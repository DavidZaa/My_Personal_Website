"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Expanded hologram record: a popup projected over the cargo hold when
 * a compact dossier row is opened. Esc or backdrop click closes it.
 */
export function HoloModal({
  open,
  title,
  meta,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  meta?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#02060a]/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.05, filter: "brightness(3)" }}
            animate={{ opacity: 1, scaleY: 1, filter: "brightness(1)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.05, filter: "brightness(2.5)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
            onClick={(e) => e.stopPropagation()}
            className="holo-panel max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-sm p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="hud-label !text-glow-b/60">expanded record</p>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-[#e6fbff]">
                  {title}
                </h3>
                {meta && (
                  <p className="mt-1 font-mono text-[11px] text-glow-b/80">{meta}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close record"
                className="rounded-sm border border-glow-b/40 px-2 py-1 font-mono text-xs text-glow-b transition-colors hover:bg-glow-b/10"
              >
                esc ✕
              </button>
            </div>
            <div className="mt-4 border-t border-glow-b/20 pt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
