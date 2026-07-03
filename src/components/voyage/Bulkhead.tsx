/**
 * Structural seam between two ship-interior sections — a heavy deck
 * beam with spaced status lights, so adjoining rooms read as decks of
 * the same vessel instead of separate boxes floating in space.
 */
export function Bulkhead({ label }: { label?: string }) {
  return (
    <div aria-hidden className="relative h-12 overflow-hidden bg-gradient-to-b from-[#0d1017] via-[#141826] to-[#0b0d16]">
      {/* beam edges */}
      <div className="absolute inset-x-0 top-0 h-px bg-line-bright/40" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-line-bright/40" />
      {/* rivet strip */}
      <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 items-center justify-between">
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full border border-line-bright/40 bg-[#1a1d2c]"
          />
        ))}
      </div>
      {/* deck label plate */}
      {label && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-line bg-[#0a0c14] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
          {label}
        </span>
      )}
      {/* running lights */}
      {[12, 88].map((x) => (
        <span
          key={x}
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-glow-warm/80 shadow-[0_0_8px_rgba(251,191,36,0.7)]"
          style={{ left: `${x}%` }}
        />
      ))}
    </div>
  );
}
