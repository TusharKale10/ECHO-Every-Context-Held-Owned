import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export const sourceMeta: Record<string, { label: string; color: string }> = {
  active_window: { label: "Window", color: "#7c3aed" },
  git: { label: "Git", color: "#ea580c" },
  file: { label: "File", color: "#16a34a" },
  browser: { label: "Browser", color: "#2563eb" },
  terminal: { label: "Terminal", color: "#d97706" },
  manual: { label: "Saved", color: "#e11d48" },
  unknown: { label: "Memory", color: "#64748b" },
};
