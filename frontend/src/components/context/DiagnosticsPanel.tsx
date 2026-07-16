import { useEffect, useState, type ReactNode } from "react";
import { Activity, ChevronDown, ChevronRight } from "lucide-react";
import { api } from "@/services/api";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Diagnostics } from "@/types";

function Row({ label, value, tone }: { label: string; value: ReactNode; tone?: "ok" | "warn" }) {
  const has = value !== undefined && value !== null && value !== "";
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/40 py-2 last:border-0">
      <span className="shrink-0 text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      {has && tone ? (
        <span
          className={cn(
            "max-w-[65%] truncate rounded-full px-2 py-0.5 text-right font-mono text-[10.5px] font-medium ring-1 ring-inset",
            tone === "ok"
              ? "bg-success/10 text-success ring-success/20"
              : "bg-warn/10 text-warn ring-warn/20"
          )}
        >
          {value}
        </span>
      ) : (
        <span
          className={cn(
            "max-w-[65%] truncate text-right font-mono text-[11px]",
            has ? "text-text" : "text-muted/60"
          )}
        >
          {has ? value : "—"}
        </span>
      )}
    </div>
  );
}

export function DiagnosticsPanel() {
  const [open, setOpen] = useState(false);
  const [diag, setDiag] = useState<Diagnostics | null>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    const load = () => api.diagnostics().then((d) => alive && setDiag(d)).catch(() => {});
    load();
    const t = setInterval(load, 1500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [open]);

  const p = diag?.pipeline;

  return (
    <Card hover={false} className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted hover:text-text"
      >
        <span className="flex items-center gap-2">
          <Activity size={15} className="text-accent" /> Pipeline diagnostics
        </span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <div className="border-t border-border bg-elevated/25 px-4 py-2">
          <Row label="Phase" value={diag?.phase} tone={diag?.phase === "surfaced" ? "ok" : undefined} />
          <Row
            label="Supermemory"
            value={diag?.supermemory?.reachable ? "reachable :6767" : "offline"}
            tone={diag?.supermemory?.reachable ? "ok" : "warn"}
          />
          <Row label="WS clients" value={diag?.ws_clients} />
          <Row
            label="Last event"
            value={
              p?.last_event
                ? [p.last_event.source_type, p.last_event.file_path || p.last_event.domain || p.last_event.application]
                    .filter(Boolean)
                    .join(" · ")
                : undefined
            }
          />
          <Row
            label="Filter"
            value={p?.last_filter ? (p.last_filter.meaningful ? "meaningful ✓" : "filtered out") : undefined}
            tone={p?.last_filter ? (p.last_filter.meaningful ? "ok" : "warn") : undefined}
          />
          <Row
            label="Dedup"
            value={p?.last_dedup ? (p.last_dedup.significant ? "significant change ✓" : "unchanged") : undefined}
            tone={p?.last_dedup ? (p.last_dedup.significant ? "ok" : undefined) : undefined}
          />
          <Row label="Contextual query" value={p?.last_query} />
          <Row label="Supermemory results" value={p?.last_result_count} />
          <Row label="Ranked / surfaced" value={p?.last_ranked_count} />
          <Row
            label="Last ingest"
            value={
              p?.last_ingest
                ? (p.last_ingest.stored ? `stored (${p.last_ingest.reason})` : `skipped (${p.last_ingest.reason})`)
                : undefined
            }
            tone={p?.last_ingest ? (p.last_ingest.stored ? "ok" : undefined) : undefined}
          />
        </div>
      )}
    </Card>
  );
}
