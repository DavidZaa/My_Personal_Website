"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Route transition for public pages: a quick warp-streak flash, then the
 * page rises in. Templates remount per navigation, which is what makes
 * this fire on every route change.
 */
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(139,92,246,0.35), transparent 70%)",
        }}
        initial={{ opacity: 1, scale: 1.4 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
