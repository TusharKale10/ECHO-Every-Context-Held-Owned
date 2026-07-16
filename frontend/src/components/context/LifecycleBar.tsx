import { CheckCircle2, Loader2, Radar, Search, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Phase } from "@/types";

const steps: { key: Phase; label: string; icon: typeof Radar }[] = [
  { key: "detected", label: "Detected", icon: Radar },
  { key: "checking", label: "Checking local memory", icon: Search },
  { key: "surfaced", label: "Surfaced", icon: CheckCircle2 },
];

const order: Record<Phase, number> = {
  idle: -1,
  detected: 0,
  checking: 1,
  surfaced: 2,
  none: 2,
};

export function LifecycleBar({ phase }: { phase: Phase }) {
  const active = order[phase];

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const isDone = active > i;
        const isCurrent = active === i;
        const isNoneAtEnd = i === 2 && phase === "none";
        const Icon = isNoneAtEnd ? XCircle : s.icon;
        const label = isNoneAtEnd ? "No relevant past context" : s.label;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                isNoneAtEnd
                  ? "bg-warn/15 text-warn"
                  : isCurrent
                    ? "bg-accent/20 text-accent"
                    : isDone
                      ? "bg-success/15 text-success"
                      : "bg-elevated text-muted"
              )}
            >
              {isCurrent && s.key === "checking" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Icon size={13} />
              )}
              {label}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-5",
                  active > i ? "bg-success/40" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
