import { cn } from "@/lib/utils";

/**
 * ECHO brand symbol — an "echo ripple": a signal originating at one point and
 * propagating outward. Rendered as inline SVG (currentColor) so it themes cleanly and
 * powers the ripple micro-interaction. Aspect ratio is always 1:1.
 *
 * To use the exact provided raster instead, drop it at public/assets/echo-logo.png and
 * swap the <svg> below for <img src="/assets/echo-logo.png" .../>.
 */
export function EchoLogo({
  size = 24,
  className,
  pulse = false,
  ring = true,
}: {
  size?: number;
  className?: string;
  pulse?: boolean;
  ring?: boolean;
}) {
  return (
    <span
      className={cn("echo-logo relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
      data-pulse={pulse ? "" : undefined}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" opacity="0.22" />
        <circle cx="28" cy="50" r="8" fill="currentColor" />
        <path d="M34.8 33.3 A18 18 0 0 1 34.8 66.7" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.95" />
        <path d="M39.3 22.2 A30 30 0 0 1 39.3 77.8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
        <path d="M43.8 11.1 A42 42 0 0 1 43.8 88.9" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
      </svg>
      {ring && <span className="echo-logo-ring" />}
    </span>
  );
}
