import { useEffect, useState } from "react";
import { Activity, Clock, FolderGit2, Loader2, TrendingUp } from "lucide-react";
import { api } from "@/services/api";
import { Card } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn, sourceMeta } from "@/lib/utils";
import type { Analytics } from "@/types";

const PERIODS = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
] as const;

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Activity; label: string; value: string; sub?: string }) {
  return (
    <Card className="p-4">
      <Icon size={17} className="mb-2 text-accent" />
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="font-display text-xl font-semibold text-text">{value}</div>
      {sub && <div className="text-[11px] text-muted">{sub}</div>}
    </Card>
  );
}

function hourLabel(h: number) {
  const ampm = h < 12 ? "a" : "p";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${ampm}`;
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [a, setA] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.analytics(period).then(setA).finally(() => setLoading(false));
  }, [period]);

  const maxDay = a ? Math.max(1, ...a.day_series.map((d) => d.count)) : 1;
  const maxHour = a ? Math.max(1, ...a.hour_series.map((h) => h.count)) : 1;
  const maxSrc = a ? Math.max(1, ...a.by_source.map((s) => s.count)) : 1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Work Analytics"
        subtitle="The story of your work — where your attention went, from real activity."
        action={
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {PERIODS.map((p) => (
              <button key={p.key} onClick={() => setPeriod(p.key)}
                className={cn("rounded-md px-3 py-1 text-xs font-medium",
                  period === p.key ? "bg-accent text-white" : "text-muted hover:text-text")}>
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {loading || !a ? (
        <div className="flex justify-center py-20 text-muted"><Loader2 className="animate-spin" /></div>
      ) : a.total_events === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No activity in this period yet. As you work, ECHO builds your work story here.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Activity} label="Total activity" value={String(a.total_events)} sub={`in the last ${a.days}d`} />
            <Stat icon={TrendingUp} label="Most active" value={sourceMeta[a.most_active_source ?? "unknown"]?.label ?? "—"} sub="context source" />
            <Stat icon={FolderGit2} label="Top project" value={a.most_active_project ?? "—"} />
            <Stat icon={Clock} label="Peak hour" value={a.busiest_hour != null ? hourLabel(a.busiest_hour) : "—"} sub="when you focus" />
          </div>

          {/* where your attention went */}
          <Card className="p-5">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted">
              Where your attention went
            </h2>
            <div className="space-y-2.5">
              {a.by_source.map((s) => {
                const meta = sourceMeta[s.name] ?? sourceMeta.unknown;
                return (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs text-text">{meta.label}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-elevated">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(s.count / maxSrc) * 100}%`, backgroundColor: meta.color }} />
                    </div>
                    <span className="w-14 shrink-0 text-right font-mono text-[11px] text-muted">{s.pct}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* activity per day */}
          <Card className="p-5">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted">
              Activity per day
            </h2>
            <div className="flex items-end justify-between gap-1.5" style={{ height: 140 }}>
              {a.day_series.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full flex-1 items-end">
                    <div className="w-full rounded-t bg-accent/70 transition-all duration-700"
                      style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? 3 : 0 }}
                      title={`${d.count} events`} />
                  </div>
                  <span className="text-[10px] text-muted">{d.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* focus by hour */}
          <Card className="p-5">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted">
              Focus by hour of day
            </h2>
            <div className="flex items-end gap-[3px]" style={{ height: 90 }}>
              {a.hour_series.map((h) => (
                <div key={h.hour} className="flex flex-1 flex-col items-center justify-end" title={`${hourLabel(h.hour)}: ${h.count}`}>
                  <div className="w-full rounded-t bg-accent-soft/70 transition-all duration-500"
                    style={{ height: `${(h.count / maxHour) * 100}%`, minHeight: h.count ? 2 : 0 }} />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted">
              <span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span>
            </div>
          </Card>

          {a.by_project.length > 0 && (
            <Card className="p-5">
              <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted">
                Top projects
              </h2>
              <div className="space-y-2">
                {a.by_project.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 truncate text-xs text-text sm:w-40" title={p.name}>
                      {p.name}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
                      <div className="h-full rounded-full bg-accent transition-all duration-700"
                        style={{ width: `${p.pct}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono text-[11px] text-muted">{p.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
