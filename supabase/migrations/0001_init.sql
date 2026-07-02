-- Personal site schema. Run in the Supabase SQL editor (or `supabase db push`).
--
-- Access model:
--   * owner  = the Google account matching the OWNER_EMAIL env var,
--     mirrored here by the is_owner() helper reading the JWT email claim.
--   * public tables are readable by anyone, writable only by the owner.
--   * guestbook accepts inserts from any signed-in user (their own row).
--   * page_views / stat_cache are written only by the service role.

create extension if not exists "pgcrypto";

-- Owner check reads the email claim from the caller's JWT and compares it
-- with the owner_email setting stored in a config table (single row).
create table if not exists site_config (
  id int primary key default 1 check (id = 1),
  owner_email text not null
);

create or replace function is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = (select lower(owner_email) from site_config where id = 1),
    false
  );
$$;

-- ---------- posts ----------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content_md text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "published posts are public"
  on posts for select
  using (status = 'published' or is_owner());

create policy "owner writes posts"
  on posts for insert with check (is_owner());
create policy "owner updates posts"
  on posts for update using (is_owner());
create policy "owner deletes posts"
  on posts for delete using (is_owner());

-- ---------- tasks (private) ----------
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  done boolean not null default false,
  due_date date,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table tasks enable row level security;

create policy "owner reads tasks" on tasks for select using (is_owner());
create policy "owner writes tasks" on tasks for insert with check (is_owner());
create policy "owner updates tasks" on tasks for update using (is_owner());
create policy "owner deletes tasks" on tasks for delete using (is_owner());

-- ---------- events (private calendar) ----------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  notes text
);

alter table events enable row level security;

create policy "owner reads events" on events for select using (is_owner());
create policy "owner writes events" on events for insert with check (is_owner());
create policy "owner updates events" on events for update using (is_owner());
create policy "owner deletes events" on events for delete using (is_owner());

-- ---------- counters (public read, owner write) ----------
create table if not exists counters (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value bigint not null default 0,
  unit text,
  icon text
);

alter table counters enable row level security;

create policy "counters are public" on counters for select using (true);
create policy "owner writes counters" on counters for insert with check (is_owner());
create policy "owner updates counters" on counters for update using (is_owner());
create policy "owner deletes counters" on counters for delete using (is_owner());

-- ---------- now_status (single row; public read, owner write) ----------
create table if not exists now_status (
  id int primary key default 1 check (id = 1),
  focus text not null default '',
  building text not null default '',
  listening text,
  location text,
  updated_at timestamptz not null default now()
);

alter table now_status enable row level security;

create policy "now status is public" on now_status for select using (true);
create policy "owner writes now status" on now_status for insert with check (is_owner());
create policy "owner updates now status" on now_status for update using (is_owner());

-- ---------- guestbook ----------
create table if not exists guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_avatar text,
  message text not null check (char_length(message) between 1 and 280),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table guestbook_entries enable row level security;

create policy "guestbook is public" on guestbook_entries for select using (true);
create policy "signed-in users sign the guestbook"
  on guestbook_entries for insert
  with check (auth.uid() = user_id);
create policy "owner moderates guestbook"
  on guestbook_entries for delete using (is_owner());

-- ---------- stat_cache (public read, service-role write) ----------
create table if not exists stat_cache (
  key text primary key check (key in ('github', 'leetcode')),
  data jsonb not null,
  fetched_at timestamptz not null default now()
);

alter table stat_cache enable row level security;

create policy "stat cache is public" on stat_cache for select using (true);
-- No insert/update policies: only the service role (bypasses RLS) writes.

-- ---------- page_views (owner read, service-role write) ----------
create table if not exists page_views (
  path text not null,
  day date not null default current_date,
  count bigint not null default 0,
  primary key (path, day)
);

alter table page_views enable row level security;

create policy "owner reads page views" on page_views for select using (is_owner());

create or replace function increment_page_view(view_path text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into page_views (path, day, count)
  values (view_path, current_date, 1)
  on conflict (path, day) do update set count = page_views.count + 1;
$$;

-- Public visitor total without exposing per-path detail.
create or replace function total_page_views()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(count), 0)::bigint from page_views;
$$;

-- ---------- setup ----------
-- After running this migration, insert your owner email once:
--   insert into site_config (id, owner_email) values (1, 'you@example.com')
--   on conflict (id) do update set owner_email = excluded.owner_email;
