import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from "react";

export function Card({
  className,
  hover = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "card-base rounded-xl border border-border bg-panel",
        hover && "card-hover",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  color,
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={
        color
          ? { color, backgroundColor: `${color}1a`, border: `1px solid ${color}33` }
          : undefined
      }
    >
      {children}
    </span>
  );
}

export function Button({
  className,
  variant = "default",
  loading = false,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline";
  loading?: boolean;
}) {
  const variants = {
    default:
      "bg-accent text-white shadow-[0_2px_8px_rgba(47,91,255,0.24)] hover:bg-accent-soft hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(47,91,255,0.3)]",
    ghost: "text-muted hover:text-text hover:bg-elevated",
    outline:
      "border border-border bg-panel/60 text-text hover:-translate-y-px hover:border-accent/40 hover:bg-elevated hover:shadow-[0_4px_12px_rgba(27,30,38,0.06)]",
  };
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

export function ConfidenceRing({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 70 ? "#16a34a" : value >= 50 ? "#2f5bff" : "#ea580c";
  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#e7e1d4" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {value}
      </span>
    </div>
  );
}
