import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { api } from "@/services/api";
import { Card } from "@/components/ui";
import { sourceMeta, timeAgo } from "@/lib/utils";
import { useContextStore } from "@/stores/useContextStore";
import type { Memory } from "@/types";

interface Item {
  id: string;
  preview: string;
  source_type: string;
  created_at?: string | null;
  at?: number;
}

export function RecentActivity() {
  const liveRecent = useContextStore((s) => s.recent);
  const [seed, setSeed] = useState<Item[]>([]);

  useEffect(() => {
    api
      .recentActivity(15)
      .then(({ items }) =>
        setSeed(
          items.map((m: Memory) => ({
            id: m.id,
            preview: m.content || m.title || "",
            source_type: m.source_type || "unknown",
            created_at: m.created_at,
          }))
        )
      )
      .catch(() => {});
  }, []);

  // live events (from WebSocket) first, then the seeded recent list, de-duped
  const seen = new Set<string>();
  const merged: Item[] = [];
  for (const r of liveRecent) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    merged.push({ id: r.id, preview: r.preview, source_type: r.source_type, at: r.at });
  }
  for (const s of seed) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    merged.push(s);
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Activity size={15} className="text-accent" />
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
          Recent Activity
        </h2>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-muted">
          <span className="h-2 w-2 rounded-full bg-accent pulse-dot" /> live
        </span>
      </div>
      {merged.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No activity yet.</p>
      ) : (
        <ul className="relative space-y-0.5 before:absolute before:bottom-2 before:left-[4px] before:top-2 before:w-px before:bg-border">
          {merged.slice(0, 12).map((it) => {
            const meta = sourceMeta[it.source_type] ?? sourceMeta.unknown;
            const when = it.created_at
              ? timeAgo(it.created_at)
              : it.at
                ? timeAgo(new Date(it.at).toISOString())
                : "";
            return (
              <li
                key={it.id}
                className="group/i relative flex items-start gap-3 rounded-lg py-1.5 pl-5 pr-1.5 transition-colors hover:bg-elevated/70"
              >
                <span
                  className="absolute left-0 top-[11px] h-[9px] w-[9px] shrink-0 rounded-full ring-2 ring-panel transition-transform duration-200 group-hover/i:scale-125"
                  style={{ backgroundColor: meta.color }}
                  title={meta.label}
                />
                <span className="flex-1 text-[13px] leading-snug text-text">{it.preview}</span>
                <time className="shrink-0 whitespace-nowrap font-mono text-[10.5px] text-muted">
                  {when}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
