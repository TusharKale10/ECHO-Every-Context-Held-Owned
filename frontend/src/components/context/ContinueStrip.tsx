import { useEffect, useState } from "react";
import { Layers, PlayCircle } from "lucide-react";
import { api } from "@/services/api";
import { Card } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import type { Session } from "@/types";

export function ContinueStrip() {
  const [items, setItems] = useState<Session[]>([]);

  useEffect(() => {
    api.sessions().then((r) => setItems(r.continue || [])).catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <PlayCircle size={15} className="text-accent" />
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
          Continue where you left off
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {items.map((s) => (
          <div
            key={s.id}
            className="group/s cursor-default rounded-xl border border-border bg-elevated/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-panel hover:shadow-[0_6px_16px_rgba(27,30,38,0.07)]"
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent transition-colors group-hover/s:bg-accent group-hover/s:text-white">
                <Layers size={13} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-text">{s.title}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted">
                  <span className="rounded bg-elevated px-1.5 py-px font-mono">{s.count} activities</span>
                  <span>· {timeAgo(new Date(s.last_activity).toISOString())}</span>
                </div>
                {s.preview[0] && (
                  <div className="mt-1.5 truncate text-xs leading-snug text-muted">{s.preview[0]}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
