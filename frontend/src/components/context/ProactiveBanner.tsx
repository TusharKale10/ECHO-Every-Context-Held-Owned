import { Lightbulb, X } from "lucide-react";
import { useContextStore } from "@/stores/useContextStore";

export function ProactiveBanner() {
  const suggestion = useContextStore((s) => s.suggestion);
  const dismiss = useContextStore((s) => s.dismissSuggestion);
  if (!suggestion) return null;

  return (
    <div className="fade-up flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3">
      <Lightbulb size={17} className="mt-0.5 shrink-0 text-accent" />
      <div className="flex-1">
        <div className="text-sm text-text">{suggestion.text}</div>
        <div className="mt-0.5 text-[11px] text-muted">
          Proactive suggestion · {suggestion.confidence}% confidence · {suggestion.project}
        </div>
      </div>
      <button onClick={dismiss} className="text-muted hover:text-text" title="Dismiss">
        <X size={15} />
      </button>
    </div>
  );
}
