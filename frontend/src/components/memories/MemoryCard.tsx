import { useState } from "react";
import {
  Check,
  ExternalLink,
  Pencil,
  Pin,
  Star,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { api } from "@/services/api";
import { cn, sourceMeta, timeAgo } from "@/lib/utils";
import type { Memory } from "@/types";

function IconBtn({
  active,
  title,
  onClick,
  children,
  activeColor = "text-accent",
}: {
  active?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  activeColor?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-elevated",
        active ? activeColor : "text-muted hover:text-text"
      )}
    >
      {children}
    </button>
  );
}

export function MemoryCard({
  memory,
  onChanged,
  onDelete,
}: {
  memory: Memory;
  onChanged?: (m: Memory) => void;
  onDelete?: (id: string) => void;
}) {
  const meta = sourceMeta[memory.source_type ?? "unknown"] ?? sourceMeta.unknown;
  const [m, setM] = useState<Memory>(memory);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m.content || "");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(m.note || "");

  const patch = async (body: Parameters<typeof api.updateMemory>[1], optimistic: Partial<Memory>) => {
    const next = { ...m, ...optimistic };
    setM(next);
    onChanged?.(next);
    try {
      await api.updateMemory(m.id, body);
    } catch {
      setM(m); // revert on failure
    }
  };

  const saveEdit = async () => {
    setEditing(false);
    if (draft.trim() && draft !== m.content) {
      await patch({ content: draft.trim() }, { content: draft.trim() });
    }
  };

  const saveNote = async () => {
    setNoteOpen(false);
    await patch({ note }, { note });
  };

  return (
    <Card
      className={cn(
        "group p-4",
        m.pinned && "border-accent/40",
        m.irrelevant && "opacity-50"
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge color={meta.color}>{meta.label}</Badge>
        {m.action && <span className="text-[10px] uppercase tracking-wide text-muted">{m.action}</span>}
        {m.project_name && <span className="font-mono text-[11px] text-muted">{m.project_name}</span>}
        {m.file_path && <span className="font-mono text-[11px] text-muted">· {m.file_path}</span>}
        {typeof m.score === "number" && (
          <span className="font-mono text-[11px] text-accent">{m.score.toFixed(2)}</span>
        )}
        <span className="ml-auto text-[11px] text-muted">{timeAgo(m.created_at)}</span>
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            className="flex-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-sm outline-none"
            autoFocus
          />
          <IconBtn title="Save" onClick={saveEdit}><Check size={14} /></IconBtn>
          <IconBtn title="Cancel" onClick={() => setEditing(false)}><X size={14} /></IconBtn>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-text">{m.content || m.title}</p>
      )}

      {m.url && (
        <a href={m.url} target="_blank" rel="noreferrer"
           className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline">
          <ExternalLink size={12} /> {m.domain || m.url}
        </a>
      )}

      {m.note && !noteOpen && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-elevated/60 px-2.5 py-1.5 text-xs text-muted">
          <StickyNote size={12} className="mt-0.5 text-warn" /> {m.note}
        </div>
      )}
      {noteOpen && (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveNote()}
            placeholder="Add a personal note…"
            className="flex-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-xs outline-none"
            autoFocus
          />
          <IconBtn title="Save note" onClick={saveNote}><Check size={14} /></IconBtn>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <IconBtn title={m.pinned ? "Unpin" : "Pin"} active={m.pinned}
                 onClick={() => patch({ pinned: !m.pinned }, { pinned: !m.pinned })}>
          <Pin size={14} />
        </IconBtn>
        <IconBtn title="Mark important" active={m.important} activeColor="text-warn"
                 onClick={() => patch({ important: !m.important }, { important: !m.important })}>
          <Star size={14} />
        </IconBtn>
        <IconBtn title="Add note" active={!!m.note} onClick={() => setNoteOpen((o) => !o)}>
          <StickyNote size={14} />
        </IconBtn>
        <IconBtn title="Edit" onClick={() => { setDraft(m.content || ""); setEditing(true); }}>
          <Pencil size={14} />
        </IconBtn>
        <IconBtn title={m.irrelevant ? "Mark relevant" : "Mark irrelevant"} active={m.irrelevant}
                 onClick={() => patch({ irrelevant: !m.irrelevant }, { irrelevant: !m.irrelevant })}>
          <X size={14} />
        </IconBtn>
        <div className="ml-auto">
          <IconBtn title="Delete" activeColor="text-warn" onClick={() => onDelete?.(m.id)}>
            <Trash2 size={14} />
          </IconBtn>
        </div>
      </div>
    </Card>
  );
}
