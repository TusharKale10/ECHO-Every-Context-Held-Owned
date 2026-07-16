import { useEffect, useState } from "react";
import { FilePlus, FolderPlus, Image, PenLine, Trash2, ArrowRightLeft, Radio } from "lucide-react";
import { Card } from "@/components/ui";
import { api } from "@/services/api";
import { useContextStore } from "@/stores/useContextStore";
import type { ActivitySignal } from "@/stores/useContextStore";

const ICONS: Record<string, typeof FilePlus> = {
  created: FilePlus,
  modified: PenLine,
  renamed: ArrowRightLeft,
  moved: ArrowRightLeft,
  deleted: Trash2,
};

function iconFor(action?: string | null, kind?: string | null) {
  if (kind === "folder") return FolderPlus;
  if (kind === "image") return Image;
  return ICONS[action ?? "modified"] ?? PenLine;
}

function ago(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export function LiveActivity() {
  const live = useContextStore((s) => s.activitySignals);
  const [history, setHistory] = useState<ActivitySignal[]>([]);

  // seed with recent persisted activity so the panel shows history immediately on load
  useEffect(() => {
    api
      .recentActivity(15)
      .then(({ items }) =>
        setHistory(
          items.map((m) => {
            const md = (m.metadata ?? {}) as Record<string, unknown>;
            return {
              text: m.content || m.title || "",
              action: (m.action as string) ?? null,
              kind: (md.file_kind as string) ?? null,
              at: typeof md.timestamp === "number"
                ? (md.timestamp as number)
                : m.created_at ? new Date(m.created_at).getTime() : Date.now(),
            } as ActivitySignal;
          })
        )
      )
      .catch(() => {});
  }, []);

  const seen = new Set(live.map((s) => s.text));
  const signals = [...live, ...history.filter((h) => !seen.has(h.text))];

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Radio size={15} className="text-accent" />
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
          Activity Signals
        </h2>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent pulse-dot" /> system-wide · live
        </span>
      </div>
      {signals.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted">
          Create a file or folder anywhere in a watched location — it appears here instantly.
        </p>
      ) : (
        <div className="space-y-2">
          {signals.slice(0, 12).map((sig, i) => {
            const Icon = iconFor(sig.action, sig.kind);
            return (
              <div key={sig.at + "-" + i} className="fade-up flex items-start gap-2.5">
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-elevated text-accent">
                  <Icon size={13} />
                </div>
                <span className="flex-1 text-sm text-text">{sig.text}</span>
                <span className="shrink-0 text-[11px] text-muted">{ago(sig.at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
