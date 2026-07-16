import { useEffect, useState } from "react";
import { FolderPlus, Pause, Play, X } from "lucide-react";
import { api } from "@/services/api";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { WatchedLocations as WL } from "@/types";

export function WatchedLocations() {
  const [wl, setWl] = useState<WL | null>(null);
  const [path, setPath] = useState("");

  const load = () => api.locations().then(setWl).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const op = async (body: Parameters<typeof api.manageLocation>[0]) =>
    setWl(await api.manageLocation(body));

  if (!wl) return null;
  const existing = new Set(wl.existing_roots);

  return (
    <Card className="mb-6 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold">Watched Locations</h2>
          <p className="text-xs text-muted">
            System-wide activity capture — files &amp; folders you create anywhere here become context.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => op({ action: wl.paused ? "resume" : "pause" })}
        >
          {wl.paused ? <Play size={14} /> : <Pause size={14} />}
          {wl.paused ? "Resume" : "Pause"}
        </Button>
      </div>

      <div className="space-y-2">
        {wl.roots.map((r) => (
          <div key={r} className="flex items-center gap-2 rounded-lg border border-border bg-elevated/50 px-3 py-2">
            <span
              className={cn("h-2 w-2 rounded-full", existing.has(r) && !wl.paused ? "bg-success" : "bg-border")}
              title={existing.has(r) ? "watching" : "not found / paused"}
            />
            <span className="flex-1 truncate font-mono text-xs text-text">{r}</span>
            {!existing.has(r) && <span className="text-[10px] text-muted">not found</span>}
            <button onClick={() => op({ action: "remove", path: r })} className="text-muted hover:text-warn">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && path.trim() && (op({ action: "add", path: path.trim() }), setPath(""))}
          placeholder="Add a folder to watch (e.g. C:\Users\you\Projects)"
          className="flex-1 rounded-lg border border-border bg-elevated px-3 py-2 text-xs outline-none placeholder:text-muted"
        />
        <Button onClick={() => path.trim() && (op({ action: "add", path: path.trim() }), setPath(""))}>
          <FolderPlus size={14} /> Add
        </Button>
      </div>

      <div className="mt-3 text-[11px] text-muted">
        Auto-excluded: {wl.default_excludes.slice(0, 8).join(", ")}…
      </div>
    </Card>
  );
}
