import { useEffect, useMemo, useState } from "react";
import {
  AppWindow,
  ArrowRightLeft,
  ExternalLink,
  FilePlus,
  FolderPlus,
  GitBranch,
  Globe,
  Image as ImageIcon,
  Loader2,
  PenLine,
  Pin,
  Search,
  Star,
  StickyNote,
  TerminalSquare,
  Trash2,
} from "lucide-react";
import { api } from "@/services/api";
import { Card } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn, timeAgo } from "@/lib/utils";
import { toast } from "@/stores/useToast";
import { useContextStore } from "@/stores/useContextStore";
import type { Memory } from "@/types";

type Row = {
  id: string;
  text: string;
  source_type: string;
  kind?: string;
  action?: string;
  at: number;
  iso?: string | null;
  full_path?: string;
  pinned?: boolean;
  important?: boolean;
  live?: boolean;
};

const FILTERS = [
  "all", "folders", "files", "images", "browser", "apps", "git", "terminal", "manual",
] as const;
const LABELS: Record<string, string> = {
  all: "All", folders: "Folders", files: "Files", images: "Images", browser: "Browser",
  apps: "Apps", git: "Git", terminal: "Terminal", manual: "Notes",
};
const RANGES = [
  { key: "1", label: "Today", ms: 864e5 },
  { key: "7", label: "7 days", ms: 7 * 864e5 },
  { key: "30", label: "30 days", ms: 30 * 864e5 },
  { key: "all", label: "All", ms: Infinity },
] as const;

function classify(r: Row): string {
  if (r.kind === "folder") return "folders";
  if (r.kind === "image") return "images";
  if (r.source_type === "file") return "files";
  if (r.source_type === "browser") return "browser";
  if (r.source_type === "active_window") return "apps";
  if (r.source_type === "git") return "git";
  if (r.source_type === "terminal") return "terminal";
  if (r.source_type === "manual") return "manual";
  return "files";
}
function iconFor(r: Row) {
  if (r.kind === "folder") return FolderPlus;
  if (r.kind === "image") return ImageIcon;
  if (r.source_type === "browser") return Globe;
  if (r.source_type === "active_window") return AppWindow;
  if (r.source_type === "git") return GitBranch;
  if (r.source_type === "terminal") return TerminalSquare;
  if (r.source_type === "manual") return StickyNote;
  if (r.action === "deleted") return Trash2;
  if (r.action === "renamed" || r.action === "moved") return ArrowRightLeft;
  if (r.action === "created") return FilePlus;
  return PenLine;
}
function toRow(m: Memory): Row {
  const md = (m.metadata ?? {}) as Record<string, unknown>;
  const ts = typeof md.timestamp === "number" ? (md.timestamp as number)
    : m.created_at ? new Date(m.created_at).getTime() : Date.now();
  return {
    id: m.id, text: m.content || m.title || "", source_type: m.source_type || "unknown",
    kind: (md.file_kind as string) || undefined,
    action: (m.action as string) || (md.action as string) || undefined,
    at: ts, iso: m.created_at, full_path: (md.full_path as string) || undefined,
    pinned: m.pinned, important: m.important,
  };
}
function dayLabel(at: number): string {
  const d = new Date(at), today = new Date(), y = new Date();
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function ActivityRow({ r, onDelete }: { r: Row; onDelete: (id: string) => void }) {
  const [pinned, setPinned] = useState(!!r.pinned);
  const [important, setImportant] = useState(!!r.important);
  const Icon = iconFor(r);

  const patch = async (body: Parameters<typeof api.updateMemory>[1], ok: string) => {
    try { await api.updateMemory(r.id, body); toast(ok); } catch { toast("Action failed", "error"); }
  };
  const reveal = async () => {
    if (!r.full_path) return;
    try { await api.reveal(r.full_path); toast("Opened in file manager", "info"); }
    catch { toast("File no longer available", "error"); }
  };
  const del = async () => {
    try { await api.deleteMemory(r.id); onDelete(r.id); toast("Memory forgotten"); }
    catch { toast("Delete failed", "error"); }
  };

  return (
    <div className="group flex items-start gap-3 px-4 py-2.5">
      <div className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md",
        pinned ? "bg-accent/20 text-accent" : "bg-elevated text-accent")}>
        <Icon size={14} />
      </div>
      <span className="flex-1 text-sm text-text">{r.text}</span>
      <div className="flex shrink-0 items-center gap-1">
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {!r.live && (
            <>
              <button title={pinned ? "Unpin" : "Pin"} onClick={() => { setPinned(!pinned); patch({ pinned: !pinned }, pinned ? "Unpinned" : "Context pinned"); }}
                className={cn("grid h-6 w-6 place-items-center rounded hover:bg-elevated", pinned ? "text-accent" : "text-muted")}>
                <Pin size={12} />
              </button>
              <button title="Important" onClick={() => { setImportant(!important); patch({ important: !important }, important ? "Unmarked" : "Marked important"); }}
                className={cn("grid h-6 w-6 place-items-center rounded hover:bg-elevated", important ? "text-warn" : "text-muted")}>
                <Star size={12} />
              </button>
              {r.full_path && (
                <button title="Reveal in file manager" onClick={reveal}
                  className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-elevated hover:text-text">
                  <ExternalLink size={12} />
                </button>
              )}
              <button title="Forget" onClick={del}
                className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-elevated hover:text-warn">
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
        <span className="w-16 text-right text-[11px] text-muted">
          {r.iso ? timeAgo(r.iso) : timeAgo(new Date(r.at).toISOString())}
        </span>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [range, setRange] = useState<string>("7");
  const [query, setQuery] = useState("");
  const liveSignals = useContextStore((s) => s.activitySignals);

  const load = () =>
    api.recentActivity(200).then(({ items }) => setRows(items.map(toRow))).finally(() => setLoading(false));

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  const merged = useMemo(() => {
    const seen = new Set(rows.map((r) => r.text));
    const live: Row[] = liveSignals.filter((s) => s.text && !seen.has(s.text)).map((s, i) => ({
      id: "live-" + s.at + "-" + i, text: s.text, source_type: "file",
      kind: s.kind || undefined, action: s.action || undefined, at: s.at, live: true,
    }));
    return [...live, ...rows].sort((a, b) => b.at - a.at);
  }, [rows, liveSignals]);

  const rangeMs = RANGES.find((r) => r.key === range)?.ms ?? Infinity;
  const now = Date.now();
  const q = query.trim().toLowerCase();
  const filtered = merged.filter(
    (r) =>
      (filter === "all" || classify(r) === filter) &&
      now - r.at <= rangeMs &&
      (!q || r.text.toLowerCase().includes(q))
  );

  const groups = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of filtered) {
      const k = dayLabel(r.at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Activity History"
        subtitle="Everything meaningful you've done — kept in your local memory. Click a row to pin, reveal, or forget."
      />

      <Card hover={false} className="mb-4 flex flex-wrap items-center gap-2 p-2">
        <div className="flex min-w-[200px] flex-1 items-center gap-2">
          <Search size={16} className="ml-2 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your activity…"
            className="w-full min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {RANGES.map((r) => (
            <button key={r.key} onClick={() => setRange(r.key)}
              className={cn("rounded-md px-2 py-1 text-xs", range === r.key ? "bg-accent/15 text-accent" : "text-muted hover:text-text")}>
              {r.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("rounded-full border px-3 py-1 text-xs transition-colors",
              filter === f ? "border-accent bg-accent/15 text-text" : "border-border text-muted hover:text-text")}>
            {LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-muted"><Loader2 className="animate-spin" /></div>
      ) : groups.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No activity matches. Create a file or folder in a watched location and it appears here.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map(([day, items]) => (
            <div key={day}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-display text-sm font-semibold">{day}</h3>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted">{items.length}</span>
              </div>
              <Card className="divide-y divide-border/60">
                {items.map((r) => <ActivityRow key={r.id} r={r} onDelete={removeRow} />)}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
