import type { ReactNode } from "react";

/**
 * Compact section header — keeps the page organised into sections without spending a
 * half-screen of vertical space on copy. Suits a working tool rather than a landing page.
 */
export function SectionHeader({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </div>
        <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
        {copy && <p className="mt-1 max-w-2xl text-sm text-muted">{copy}</p>}
      </div>
      {action}
    </div>
  );
}
