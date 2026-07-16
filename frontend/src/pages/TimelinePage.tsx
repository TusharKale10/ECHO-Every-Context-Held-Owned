import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { Badge } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { sourceMeta } from "@/lib/utils";
import type { Memory } from "@/types";

function dayLabel(iso?: string | null): string {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default function TimelinePage() {
  const [items, setItems] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .timeline(200)
      .then(({ items }) => setItems(items))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, Memory[]>();
    for (const m of items) {
      const key = dayLabel(m.created_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Timeline"
        subtitle="How your work actually unfolded — built from real memories."
      />

      {loading ? (
        <div className="flex justify-center py-20 text-muted">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([day, mems]) => (
            <div key={day}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-display text-sm font-semibold">{day}</h3>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted">{mems.length}</span>
              </div>
              <div className="relative space-y-3 border-l border-border pl-6">
                {mems.map((m) => {
                  const meta = sourceMeta[m.source_type ?? "unknown"] ?? sourceMeta.unknown;
                  return (
                    <div key={m.id} className="relative">
                      <span
                        className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg"
                        style={{ backgroundColor: meta.color }}
                      />
                      <div className="flex items-start gap-2">
                        <Badge color={meta.color}>{meta.label}</Badge>
                        <p className="flex-1 text-sm text-text">
                          {m.content || m.title}
                        </p>
                        <span className="shrink-0 font-mono text-[11px] text-muted">
                          {m.created_at
                            ? new Date(m.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <p className="py-16 text-center text-sm text-muted">
              No timeline yet — memories will appear here as you work.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
