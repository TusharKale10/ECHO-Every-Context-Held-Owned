import { Radar } from "lucide-react";
import { useContextStore } from "@/stores/useContextStore";
import { SurfacedCard } from "@/components/context/SurfacedCard";
import { LifecycleBar } from "@/components/context/LifecycleBar";

/** The ambient retrieval surface: lifecycle state + memories Supermemory surfaced. */
export function RelatedMemoryPanel() {
  const surfaced = useContextStore((s) => s.surfaced);
  const phase = useContextStore((s) => s.phase);
  const query = useContextStore((s) => s.query);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <LifecycleBar phase={phase} />
      </div>

      {query && phase !== "idle" && (
        <div className="mb-3 truncate font-mono text-[11px] text-muted">
          contextual query: {query}
        </div>
      )}

      {phase === "checking" && (
        <div className="rounded-xl border border-dashed border-accent/40 py-8 text-center text-sm text-accent">
          Checking local memory…
        </div>
      )}
      {phase === "none" && (
        <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted">
          No relevant past context found for what you're doing now.
        </div>
      )}
      {surfaced.length > 0 && (
        <div className="space-y-3">
          {surfaced.map((item) => (
            <SurfacedCard key={item.memory.id} item={item} />
          ))}
        </div>
      )}
      {phase === "idle" && surfaced.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
          <Radar size={24} className="text-muted" />
          <p className="text-sm font-medium">Waiting for a context change…</p>
          <p className="max-w-sm text-xs text-muted">
            Switch apps, save a file, or open a tab — related memories appear here.
          </p>
        </div>
      )}
    </div>
  );
}
