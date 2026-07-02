import { afterEach, describe, expect, it } from "vitest";
import { isOwner } from "@/lib/auth";

const user = (email: string | null) => ({ id: "u1", email, name: null });

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.OWNER_EMAIL;
});

function configureSupabase() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
}

describe("isOwner", () => {
  it("admits everyone in demo mode (no Supabase, nothing to protect)", () => {
    expect(isOwner(null)).toBe(true);
  });

  it("admits only the configured owner email once Supabase is live", () => {
    configureSupabase();
    process.env.OWNER_EMAIL = "me@example.com";
    expect(isOwner(user("me@example.com"))).toBe(true);
    expect(isOwner(user("intruder@example.com"))).toBe(false);
    expect(isOwner(null)).toBe(false);
  });

  it("compares emails case-insensitively", () => {
    configureSupabase();
    process.env.OWNER_EMAIL = "Me@Example.COM";
    expect(isOwner(user("me@example.com"))).toBe(true);
  });

  it("denies everyone when OWNER_EMAIL is unset in live mode", () => {
    configureSupabase();
    expect(isOwner(user("me@example.com"))).toBe(false);
  });

  it("denies users without an email in live mode", () => {
    configureSupabase();
    process.env.OWNER_EMAIL = "me@example.com";
    expect(isOwner(user(null))).toBe(false);
  });
});
