import type { ReactNode } from "react";

export function HudPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`hud-panel rounded-sm p-5 ${className}`}>
      {title && <div className="hud-label mb-3">{title}</div>}
      {children}
    </div>
  );
}
