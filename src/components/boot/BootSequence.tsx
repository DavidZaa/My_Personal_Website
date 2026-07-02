"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BOOT_KEY = "dz01_booted";

const LINES = [
  "DZ-01 PERSONAL SYSTEM v1.0",
  "───────────────────────────────",
  "power ................... ok",
  "calibrating star charts .. ok",
  "loading portfolio modules  ok",
  "uplink: github ........... ok",
  "uplink: research ......... ok",
  "guestbook receiver ....... ok",
  "telemetry stream ......... live",
  "",
  "welcome, visitor.",
];

const LINE_DELAY_MS = 170;
const EXIT_DELAY_MS = 700;

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    sessionStorage.setItem(BOOT_KEY, "1");
    setVisible(false);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(BOOT_KEY)) {
      sessionStorage.setItem(BOOT_KEY, "1");
      return;
    }
    setVisible(true);

    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setLineCount(i + 1), i * LINE_DELAY_MS));
    });
    timers.push(
      setTimeout(finish, LINES.length * LINE_DELAY_MS + EXIT_DELAY_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [finish]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Site loading"
          className="scanlines fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-void"
          onClick={finish}
          exit={{ opacity: 0, filter: "brightness(2.5)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="w-[min(90vw,420px)] font-mono text-sm leading-7">
            {LINES.slice(0, lineCount).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className={
                  i === LINES.length - 1
                    ? "mt-1 text-glow-b glow-text"
                    : line.endsWith("live")
                      ? "text-glow-a"
                      : "text-ink-dim"
                }
              >
                {line || " "}
              </motion.p>
            ))}
            <motion.div
              className="mt-4 h-px bg-gradient-to-r from-glow-a to-glow-b"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: lineCount / LINES.length }}
              style={{ transformOrigin: "left" }}
            />
            <p className="mt-4 text-[10px] tracking-[0.3em] text-ink-dim/60 uppercase">
              click or press esc to skip
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
