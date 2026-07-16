import { useState } from "react";
import { Download, HardDrive, Lock, Server, ShieldCheck } from "lucide-react";
import { api } from "@/services/api";
import { Button, Card } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { WatchedLocations } from "@/components/privacy/WatchedLocations";
import { cn } from "@/lib/utils";
import { useContextStore } from "@/stores/useContextStore";

const sourceLabels: Record<string, string> = {
  browser: "Browser",
  active_window: "Active Window",
  git: "Git",
  file: "Files",
  terminal: "Terminal",
};

const guarantees = [
  { icon: Lock, label: "Memory", value: "Local" },
  { icon: HardDrive, label: "Storage", value: "Local" },
  { icon: Server, label: "Semantic Retrieval", value: "Local" },
  { icon: ShieldCheck, label: "Embeddings", value: "Local" },
];

export default function PrivacyPage() {
  const status = useContextStore((s) => s.status);
  const refreshStatus = useContextStore((s) => s.refreshStatus);
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (source: string, enabled: boolean) => {
    setBusy(source);
    try {
      await api.toggleSource(source, enabled);
      await refreshStatus();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Privacy"
        subtitle="Everything meaningful stays on your machine. You own your memory."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {guarantees.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="p-4">
            <Icon size={18} className="mb-2 text-accent" />
            <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
            <div className="font-display text-lg font-semibold text-success">{value}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-6 p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">Supermemory Server</h2>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 font-mono text-xs",
              status?.supermemory.reachable
                ? "bg-success/15 text-success"
                : "bg-warn/15 text-warn"
            )}
          >
            {status?.supermemory.reachable ? "connected" : "offline"}
          </span>
        </div>
        <div className="font-mono text-sm text-muted">
          {status?.supermemory.base_url ?? "http://localhost:6767"}
        </div>
        <div className="mt-3 text-xs text-muted">
          Your memory container:{" "}
          <span className="font-mono text-text">{status?.user_container}</span>
        </div>
      </Card>

      <WatchedLocations />

      <Card className="mb-6 p-5">
        <h2 className="mb-4 font-display text-sm font-semibold">Memory Sources</h2>
        <div className="space-y-3">
          {Object.entries(sourceLabels).map(([key, label]) => {
            const s = status?.sources?.[key];
            const enabled = s?.enabled ?? false;
            return (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text">{label}</div>
                  <div className="text-[11px] text-muted">
                    {s?.available ? "available on this machine" : "not available"}
                  </div>
                </div>
                <button
                  disabled={!s?.available || busy === key}
                  onClick={() => toggle(key, !enabled)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors disabled:opacity-40",
                    enabled ? "bg-accent" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      enabled ? "translate-x-[22px]" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="flex items-center justify-between p-5">
        <div>
          <h2 className="font-display text-sm font-semibold">Export your memory</h2>
          <p className="text-xs text-muted">
            Download all your memories as an ECHO JSON export.
          </p>
        </div>
        <a href={api.exportUrl} target="_blank" rel="noreferrer">
          <Button variant="outline">
            <Download size={15} /> Export JSON
          </Button>
        </a>
      </Card>
    </div>
  );
}
