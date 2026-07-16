import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((s) => (
          <div key={s.id} className="rounded-lg border border-border bg-elevated/50 p-3">
            <div className="text-sm font-medium text-text">{s.title}</div>
            <div className="mt-0.5 text-[11px] text-muted">
              {s.count} activities · last {timeAgo(new Date(s.last_activity).toISOString())}
            </div>
            {s.preview[0] && (
              <div className="mt-1.5 truncate text-xs text-muted">{s.preview[0]}</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
