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
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted">Ask about your own computer activity:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-accent hover:text-text"
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

      <div className="flex items-center gap-2 border-t border-border p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask your computer memory…"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-white disabled:opacity-40"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </Card>
  );
}
