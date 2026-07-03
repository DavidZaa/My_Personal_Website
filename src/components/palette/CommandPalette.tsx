"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { profile } from "@/lib/content/profile";
import { projects } from "@/lib/content/projects";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [egg, setEgg] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onTrigger = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-palette-trigger]")) setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onTrigger);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onTrigger);
    };
  }, []);

  const run = useCallback((fn: () => void) => {
    setEgg(null);
    fn();
  }, []);

  const go = (href: string) => run(() => { setOpen(false); router.push(href); });
  const ext = (url: string) => run(() => { setOpen(false); window.open(url, "_blank", "noopener"); });

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(o) => { setOpen(o); if (!o) setEgg(null); }}
      label="Command palette"
      shouldFilter
      className="fixed left-1/2 top-[18vh] z-[90] w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-md border border-line-bright bg-[#080a18]/95 shadow-[0_0_80px_rgba(139,92,246,0.25)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="font-mono text-xs text-glow-b">dz-01:~$</span>
        <Command.Input
          placeholder="type a command or destination…"
          className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-ink-dim/50"
        />
        <kbd className="rounded-sm border border-line px-1.5 font-mono text-[10px] text-ink-dim">
          esc
        </kbd>
      </div>

      {egg && (
        <div className="border-b border-line bg-glow-a/10 px-4 py-3 font-mono text-xs leading-relaxed text-ink">
          {egg}
        </div>
      )}

      <Command.List className="max-h-[50vh] overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-ink-dim">
        <Command.Empty className="px-3 py-6 text-center font-mono text-xs text-ink-dim">
          command not recognized · try &quot;projects&quot; or &quot;sudo hire-me&quot;
        </Command.Empty>

        <Command.Group heading="Navigate">
          {[
            ["Home — the star system", "/"],
            ["About — crew dossier", "/#dossier"],
            ["Projects — hangar bay", "/#payload"],
            ["Blog — transmission log", "/blog"],
            ["Now — live feed", "/now"],
            ["Guestbook — open channel", "/guestbook"],
          ].map(([label, href]) => (
            <Command.Item
              key={href}
              onSelect={() => go(href)}
              className="cursor-pointer rounded-sm px-3 py-2 text-sm aria-selected:bg-glow-a/20 aria-selected:text-white"
            >
              {label}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Projects">
          {projects.filter((p) => p.github || p.liveUrl).map((p) => (
            <Command.Item
              key={p.slug}
              onSelect={() => ext(p.liveUrl ?? p.github!)}
              className="cursor-pointer rounded-sm px-3 py-2 text-sm aria-selected:bg-glow-a/20 aria-selected:text-white"
            >
              {p.name} <span className="ml-2 font-mono text-[10px] text-ink-dim">↗</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Signals">
          <Command.Item onSelect={() => ext(profile.links.github)} className="cursor-pointer rounded-sm px-3 py-2 text-sm aria-selected:bg-glow-a/20 aria-selected:text-white">
            GitHub ↗
          </Command.Item>
          <Command.Item onSelect={() => ext(profile.links.linkedin)} className="cursor-pointer rounded-sm px-3 py-2 text-sm aria-selected:bg-glow-a/20 aria-selected:text-white">
            LinkedIn ↗
          </Command.Item>
          <Command.Item onSelect={() => ext(profile.links.instagram)} className="cursor-pointer rounded-sm px-3 py-2 text-sm aria-selected:bg-glow-a/20 aria-selected:text-white">
            Instagram ↗
          </Command.Item>
          <Command.Item onSelect={() => ext(`mailto:${profile.links.email}`)} className="cursor-pointer rounded-sm px-3 py-2 text-sm aria-selected:bg-glow-a/20 aria-selected:text-white">
            Email David
          </Command.Item>
        </Command.Group>

        <Command.Group heading="System">
          <Command.Item
            onSelect={() =>
              run(() => {
                sessionStorage.removeItem("dz01_booted");
                location.assign("/");
              })
            }
            className="cursor-pointer rounded-sm px-3 py-2 font-mono text-sm aria-selected:bg-glow-a/20 aria-selected:text-white"
          >
            boot — replay startup sequence
          </Command.Item>
          <Command.Item
            onSelect={() => go("/login")}
            className="cursor-pointer rounded-sm px-3 py-2 font-mono text-sm aria-selected:bg-glow-a/20 aria-selected:text-white"
          >
            crew access — request hatch entry
          </Command.Item>
          <Command.Item
            value="sudo hire-me"
            onSelect={() =>
              setEgg(
                "If you would like to contact me, email me at davidzha77@g.ucla.edu",
              )
            }
            className="cursor-pointer rounded-sm px-3 py-2 font-mono text-sm text-glow-b aria-selected:bg-glow-a/20 aria-selected:text-white"
          >
            sudo hire-me
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
