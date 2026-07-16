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
    <div className="group/f flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-elevated/70">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-elevated text-muted transition-colors group-hover/f:bg-accent/10 group-hover/f:text-accent">
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
            {label}
          </span>
          {detection && (
            <span
              className={cn(
                "rounded-full px-1.5 py-px text-[8.5px] font-semibold uppercase tracking-wide",
                detection === "detected"
                  ? "bg-success/12 text-success ring-1 ring-inset ring-success/20"
                  : "bg-warn/12 text-warn ring-1 ring-inset ring-warn/20"
              )}
            >
              {detection}
            </span>
          )}
        </div>
        <div className="truncate font-mono text-[13px] font-medium text-text" title={value}>
          {value}
        </div>
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
          Current Context
        </h2>
        <span className="flex items-center gap-2 text-xs">
          {detectedAt && (
            <span className="font-mono text-[11px] text-muted">
              detected {timeAgo(new Date(detectedAt).toISOString())}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success ring-1 ring-inset ring-success/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> observing
          </span>
        </span>
      </div>

      {ctx ? (
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
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
