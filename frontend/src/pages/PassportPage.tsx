import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  FileCode2,
  Lightbulb,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Target,
} from "lucide-react";
import { api } from "@/services/api";
import { Button, Card } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { timeAgo } from "@/lib/utils";
import { toast } from "@/stores/useToast";
import type { Passport } from "@/types";

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Target;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={15} className="text-accent" />
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
          {title}
        </h2>
      </div>
      {children}
    </Card>
  );
}

function EditableLine({
  value,
  placeholder,
  onSave,
}: {
  value?: string | null;
  placeholder: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  useEffect(() => setDraft(value || ""), [value]);

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (onSave(draft), setEditing(false))}
          className="flex-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-sm outline-none"
          autoFocus
        />
        <button onClick={() => (onSave(draft), setEditing(false))} className="text-accent">
          <Check size={15} />
        </button>
      </div>
    );
  }
  return (
    <div className="group flex items-center gap-2">
      <span className={value ? "text-text" : "text-muted"}>{value || placeholder}</span>
      <button
        onClick={() => setEditing(true)}
        className="text-muted opacity-0 transition-opacity hover:text-text group-hover:opacity-100"
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}

function AddInput({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="mt-2 flex items-center gap-2">
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && v.trim() && (onAdd(v.trim()), setV(""))}
        placeholder={placeholder}
        className="flex-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-xs outline-none"
      />
      <button
        onClick={() => v.trim() && (onAdd(v.trim()), setV(""))}
        className="grid h-7 w-7 place-items-center rounded-md bg-accent text-white"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default function PassportPage() {
  const [p, setP] = useState<Passport | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = () => api.passport().then(setP).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const correct = async (body: Parameters<typeof api.passportCorrect>[0]) => {
    try {
      setP(await api.passportCorrect(body));
      toast("Your correction will guide future context");
    } catch {
      toast("Couldn't save correction", "error");
    }
  };

  const copyPassport = async () => {
    try {
      const res = await fetch(api.passportExportUrl("markdown"));
      await navigator.clipboard.writeText(await res.text());
      setCopied(true);
      toast("Passport ready — paste it into any AI tool", "info");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Copy failed", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-muted">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!p) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Context Passport"
        subtitle="Your portable, user-owned context. Hand it to any AI — your context follows you."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={load}>
              <RefreshCw size={14} /> Refresh
            </Button>
            <Button onClick={copyPassport}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Passport"}
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted">
        <a href={api.passportExportUrl("markdown")} target="_blank" rel="noreferrer"
           className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:text-text">
          <Download size={12} /> Export Markdown
        </a>
        <a href={api.passportExportUrl("json")} target="_blank" rel="noreferrer"
           className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:text-text">
          <Download size={12} /> Export JSON
        </a>
        <span className="ml-auto">generated {timeAgo(new Date(p.generated_at).toISOString())}</span>
      </div>

      <div className="space-y-4">
        <Section title="Current Goal" icon={Target}>
          <EditableLine value={p.goal} placeholder="No goal set — click to set one"
            onSave={(v) => correct({ goal: v })} />
          {(p.project || p.branch) && (
            <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] text-muted">
              {p.repository && <span>repo: {p.repository}</span>}
              {p.branch && <span>branch: {p.branch}</span>}
              {p.active_session && <span>session: {p.active_session.title}</span>}
            </div>
          )}
        </Section>

        <Section title="Current Task" icon={FileCode2}>
          <EditableLine value={p.task} placeholder="No task inferred — click to set one"
            onSave={(v) => correct({ task: v })} />
        </Section>

        <Section title="Recent Work" icon={FileCode2}>
          {p.recent_work.length === 0 ? (
            <p className="text-sm text-muted">No recent work yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {p.recent_work.slice(0, 6).map((w) => (
                <li key={w.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-text">{w.text}</span>
                  <span className="shrink-0 text-[11px] text-muted">{timeAgo(w.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
          {p.recent_files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.recent_files.map((f) => (
                <span key={f} className="rounded bg-elevated px-2 py-0.5 font-mono text-[11px] text-muted">{f}</span>
              ))}
            </div>
          )}
        </Section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Section title="Decisions" icon={Check}>
            {p.decisions.length === 0 ? (
              <p className="text-sm text-muted">None derived yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {p.decisions.map((d, i) => (
                  <li key={i} className="text-sm text-text">• {d.text}</li>
                ))}
              </ul>
            )}
            <AddInput placeholder="Add a decision…" onAdd={(v) => correct({ add_decision: v })} />
          </Section>

          <Section title="Blockers / Errors" icon={AlertTriangle}>
            {p.blockers.length === 0 ? (
              <p className="text-sm text-muted">No blockers detected.</p>
            ) : (
              <ul className="space-y-1.5">
                {p.blockers.map((b, i) => (
                  <li key={i} className="text-sm text-text">• {b.text}</li>
                ))}
              </ul>
            )}
            <AddInput placeholder="Add a blocker…" onAdd={(v) => correct({ add_blocker: v })} />
          </Section>
        </div>

        {p.related_context.length > 0 && (
          <Section title="Related Context" icon={Lightbulb}>
            <ul className="space-y-1.5">
              {p.related_context.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-muted">{r.text}</span>
                  {typeof r.score === "number" && (
                    <span className="shrink-0 font-mono text-[11px] text-accent">{r.score.toFixed(2)}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Card className="border-accent/40 bg-accent/5 p-5">
          <div className="mb-1 flex items-center gap-2 font-display text-sm font-semibold">
            <Lightbulb size={15} className="text-accent" /> Continue From Here
          </div>
          {p.last_known_state && (
            <p className="text-sm text-muted">Last: {p.last_known_state}</p>
          )}
          {p.suggested_next_action && (
            <p className="mt-1 text-sm text-text">Next: {p.suggested_next_action}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
