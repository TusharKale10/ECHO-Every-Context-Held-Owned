import {
  AppWindow,
  FileCode2,
  FolderGit2,
  GitBranch,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui";
import { cn, timeAgo } from "@/lib/utils";
import type { ContextEvent } from "@/types";

function detectionOf(ctx: ContextEvent, field: string): "detected" | "inferred" | undefined {
  const d = (ctx.metadata?.detection ?? {}) as Record<string, string>;
  const v = d[field];
  return v === "detected" || v === "inferred" ? v : undefined;
}

function Field({
  icon: Icon,
  label,
  value,
  detection,
}: {
  icon: typeof AppWindow;
  label: string;
  value?: string | null;
  detection?: "detected" | "inferred";
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-elevated text-muted">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted">{label}</span>
          {detection && (
            <span
              className={cn(
                "rounded px-1 text-[9px] font-semibold uppercase tracking-wide",
                detection === "detected"
                  ? "bg-success/15 text-success"
                  : "bg-warn/15 text-warn"
              )}
            >
              {detection}
            </span>
          )}
        </div>
        <div className="truncate font-mono text-[13px] text-text">{value}</div>
      </div>
    </div>
  );
}

export function CurrentContext({
  ctx,
  detectedAt,
}: {
  ctx?: ContextEvent | null;
  detectedAt?: number | null;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
          Current Context
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          {detectedAt && (
            <span className="font-mono text-[11px]">
              detected {timeAgo(new Date(detectedAt).toISOString())}
            </span>
          )}
          <span className="h-2 w-2 rounded-full bg-accent pulse-dot" /> observing
        </span>
      </div>

      {ctx ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field icon={AppWindow} label="Application" value={ctx.application} detection={detectionOf(ctx, "application")} />
          <Field icon={FolderGit2} label="Project" value={ctx.project_name} detection={detectionOf(ctx, "project_name")} />
          <Field icon={FileCode2} label="File" value={ctx.file_path} detection={detectionOf(ctx, "file_path")} />
          <Field icon={GitBranch} label="Branch" value={ctx.branch} detection={detectionOf(ctx, "branch")} />
          <Field icon={Globe} label="Domain" value={ctx.domain} detection={detectionOf(ctx, "domain")} />
          <Field icon={AppWindow} label="Title" value={ctx.title} detection={detectionOf(ctx, "title")} />
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-muted">
          Waiting for meaningful activity… switch to your editor or browser.
        </p>
      )}
    </Card>
  );
}
