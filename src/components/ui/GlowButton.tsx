import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow-b";

const variants = {
  solid:
    "bg-gradient-to-r from-glow-a to-glow-b text-white shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_36px_rgba(139,92,246,0.55)] hover:brightness-110",
  ghost:
    "border border-line-bright text-ink hover:bg-white/5 hover:border-white/40",
};

type Props = {
  children: ReactNode;
  variant?: keyof typeof variants;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function GlowButton({
  children,
  variant = "solid",
  href,
  external,
  onClick,
  className = "",
  type = "button",
  disabled,
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${cls} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
}
