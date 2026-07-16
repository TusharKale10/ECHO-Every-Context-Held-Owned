import { useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { api } from "@/services/api";
import { Card } from "@/components/ui";
import { sourceMeta, timeAgo } from "@/lib/utils";
import type { AskResponse, Memory } from "@/types";

interface Turn {
  role: "user" | "assistant";
  content: string;
  grounded?: boolean;
  evidence?: Memory[];
  timeFilter?: string | null;
}

const suggestions = [
  "What was I working on today?",
  "What did I research about Supermemory?",
  "What was the JWT issue I fixed?",
  "What files did I create for the hackathon?",
];

export function AskPanel({ compact = false }: { compact?: boolean }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (q: string) => {
    const question = q.trim();
    if (!question || loading) return;
    const history = turns.map((t) => ({ role: t.role, content: t.content }));
    setTurns((t) => [...t, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    try {
      const res: AskResponse = await api.ask(question, history);
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          content: res.answer,
          grounded: res.grounded,
          evidence: res.evidence,
          timeFilter: res.time_filter,
        },
      ]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setTurns((t) => [
        ...t,
        { role: "assistant", content: "I couldn't reach your local memory just now.", grounded: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hover={false} className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Sparkles size={15} className="text-accent" />
        <span className="font-display text-sm font-semibold">Ask ECHO</span>
        <span className="ml-auto text-[11px] text-muted">grounded in your local memory</span>
      </div>

      <div className={compact ? "max-h-72 overflow-y-auto px-4 py-3" : "max-h-[26rem] overflow-y-auto px-4 py-3"}>
        {turns.length === 0 ? (
          <div className="space-y-2.5 py-2">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="press rounded-full border border-border bg-panel px-3 py-1.5 text-xs text-muted shadow-[0_1px_2px_rgba(27,30,38,0.04)] transition-all duration-200 hover:-translate-y-px hover:border-accent/50 hover:bg-accent/5 hover:text-accent hover:shadow-[0_3px_8px_rgba(47,91,255,0.10)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {turns.map((t, i) => (
              <div key={i} className={t.role === "user" ? "text-right" : ""}>
                <div
                  className={
                    t.role === "user"
                      ? "inline-block rounded-2xl rounded-br-sm bg-accent/20 px-3 py-2 text-sm text-text"
                      : "inline-block max-w-full rounded-2xl rounded-bl-sm bg-elevated px-3 py-2 text-sm text-text"
                  }
                >
                  {t.content}
                </div>
                {t.role === "assistant" && t.evidence && t.evidence.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-muted">Evidence from your memory</div>
                    {t.evidence.slice(0, 4).map((m) => {
                      const meta = sourceMeta[m.source_type ?? "unknown"] ?? sourceMeta.unknown;
                      return (
                        <div key={m.id} className="flex items-start gap-2 rounded-lg border border-border bg-panel/60 px-2.5 py-1.5">
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                          <span className="flex-1 text-xs text-muted">{m.content || m.title}</span>
                          <span className="shrink-0 text-[10px] text-muted">{timeAgo(m.created_at)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border p-2">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-elevated/60 p-1 transition-colors focus-within:border-accent/50 focus-within:bg-panel focus-within:ring-2 focus-within:ring-accent/15">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask your computer memory…"
            aria-label="Ask ECHO"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send question"
            className="press grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-white shadow-[0_2px_6px_rgba(47,91,255,0.28)] transition-all duration-200 hover:bg-accent-soft disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
      </div>
    </Card>
  );
}
