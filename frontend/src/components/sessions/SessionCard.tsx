import { useState } from "react";
import { Check, Layers, Pencil, Pin } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { api } from "@/services/api";
import { cn, sourceMeta, timeAgo } from "@/lib/utils";
import type { Session } from "@/types";

export function SessionCard({
  session,
  onChanged,
}: {
  session: Session;
  onChanged?: () => void;
}) {
  const [s, setS] = useState<Session>(session);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(s.title);

  const pin = async () => {
    setS({ ...s, pinned: !s.pinned });
    await api.pinSession(s.id, !s.pinned).catch(() => {});
    onChanged?.();
  };

  const rename = async () => {
    setEditing(false);
    if (title.trim() && title !== s.title) {
      setS({ ...s, title: title.trim() });
      await api.renameSession(s.id, title.trim()).catch(() => {});
      onChanged?.();
    }
  };

  return (
    <Card className={cn("p-4", s.pinned && "border-accent/40")}>
      <div className="mb-2 flex items-center gap-2">
        <Layers size={15} className="text-accent" />
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && rename()}
            className="flex-1 rounded-md border border-border bg-elevated px-2 py-1 text-sm outline-none"
            autoFocus
          />
        ) : (
          <span className="font-display text-sm font-semibold">{s.title}</span>
        )}
        <span className="ml-auto flex items-center gap-1">
          {editing ? (
            <button onClick={rename} className="text-muted hover:text-text" title="Save">
              <Check size={14} />
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="text-muted hover:text-text" title="Rename">
              <Pencil size={14} />
            </button>
          )}
          <button
            onClick={pin}
            className={cn("hover:text-text", s.pinned ? "text-accent" : "text-muted")}
            title={s.pinned ? "Unpin" : "Pin"}
          >
            <Pin size={14} />
          </button>
        </span>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
        <span>{s.count} activities</span>
        <span>· last {timeAgo(new Date(s.last_activity).toISOString())}</span>
        {s.sources.map((src) => {
          const meta = sourceMeta[src] ?? sourceMeta.unknown;
          return <Badge key={src} color={meta.color}>{meta.label}</Badge>;
        })}
      </div>

      <ul className="space-y-1">
        {s.preview.map((p, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-border" />
            {p}
          </li>
        ))}
      </ul>
    </Card>
  );
}
