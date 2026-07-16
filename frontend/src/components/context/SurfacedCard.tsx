import { ExternalLink, Sparkles } from "lucide-react";
import { Badge, Card, ConfidenceRing } from "@/components/ui";
import { sourceMeta, timeAgo } from "@/lib/utils";
import type { SurfacedMemory } from "@/types";

export function SurfacedCard({ item }: { item: SurfacedMemory }) {
  const m = item.memory;
  const meta = sourceMeta[m.source_type ?? "unknown"] ?? sourceMeta.unknown;
  const body = m.content || m.title || "(memory)";

  return (
    <Card className="fade-up p-4">
      <div className="flex gap-4">
        <ConfidenceRing value={item.context_confidence} />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <Badge color={meta.color}>{meta.label}</Badge>
            {m.repository && (
              <span className="font-mono text-[11px] text-muted">{m.repository}</span>
            )}
            {m.created_at && (
              <span className="text-[11px] text-muted">· {timeAgo(m.created_at)}</span>
            )}
            {typeof item.semantic_score === "number" && (
              <span className="ml-auto font-mono text-[11px] text-muted">
                semantic {item.semantic_score.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-text">{body}</p>

          {m.url && (
            <a
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
            >
              <ExternalLink size={12} /> {m.domain || m.url}
            </a>
          )}

          <div className="mt-3 rounded-lg border border-border bg-elevated/60 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              <Sparkles size={12} className="text-accent" /> Why this appeared
            </div>
            <ul className="space-y-1">
              {item.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 flex items-center gap-4 text-[11px] text-muted">
            <span>
              Source: <span className="text-text">{meta.label}</span>
            </span>
            {m.created_at && (
              <span>
                Memory age: <span className="text-text">{timeAgo(m.created_at)}</span>
              </span>
            )}
            <span className="ml-auto">
              Context Confidence:{" "}
              <span className="font-semibold text-text">{item.context_confidence}%</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
