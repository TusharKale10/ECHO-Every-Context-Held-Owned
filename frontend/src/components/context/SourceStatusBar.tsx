import { AppWindow, FileCode2, GitBranch, Globe, TerminalSquare } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useContextStore } from "@/stores/useContextStore";

const items = [
  { key: "browser", label: "Browser", icon: Globe },
  { key: "active_window", label: "Active Window", icon: AppWindow },
  { key: "git", label: "Git", icon: GitBranch },
  { key: "file", label: "Files", icon: FileCode2 },
  { key: "terminal", label: "Terminal", icon: TerminalSquare },
];

export function SourceStatusBar() {
  const status = useContextStore((s) => s.status);
  const sources = status?.sources ?? {};

  return (
    <Card hover={false} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
      {items.map(({ key, label, icon: Icon }) => {
        const s = sources[key];
        const on = s?.available && s?.enabled;
        return (
          <div key={key} className="flex items-center gap-2 text-sm">
            <Icon size={15} className={on ? "text-text" : "text-muted"} />
            <span className={on ? "text-text" : "text-muted"}>{label}</span>
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                on ? "bg-success" : s?.available ? "bg-warn" : "bg-border"
              )}
            />
          </div>
        );
      })}
      <div className="ml-auto flex items-center gap-2 text-sm">
        <span className="font-mono text-[11px] text-muted">Supermemory</span>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 font-mono text-[11px]",
            status?.supermemory.reachable
              ? "bg-success/15 text-success"
              : "bg-warn/15 text-warn"
          )}
        >
          Local :6767
        </span>
      </div>
    </Card>
  );
}
