import { BrainCircuit, Radar } from "lucide-react";
import { useContextStore } from "@/stores/useContextStore";
import { CurrentContext } from "@/components/context/CurrentContext";
import { SurfacedCard } from "@/components/context/SurfacedCard";
import { SourceStatusBar } from "@/components/context/SourceStatusBar";
import { LifecycleBar } from "@/components/context/LifecycleBar";
import { DiagnosticsPanel } from "@/components/context/DiagnosticsPanel";
import { ProactiveBanner } from "@/components/context/ProactiveBanner";
import { ContinueStrip } from "@/components/context/ContinueStrip";
import { LiveActivity } from "@/components/context/LiveActivity";
import { RecentActivity } from "@/components/context/RecentActivity";
import { AskPanel } from "@/components/ask/AskPanel";
import { Hero } from "@/components/home/Hero";
import { ContextFlow } from "@/components/home/ContextFlow";
import { Personas } from "@/components/home/Personas";
import { Faq } from "@/components/home/Faq";
import { EchoDemo } from "@/components/home/EchoDemo";

export default function ContextPage() {
  const context = useContextStore((s) => s.context);
  const surfaced = useContextStore((s) => s.surfaced);
  const phase = useContextStore((s) => s.phase);
  const query = useContextStore((s) => s.query);
  const detectedAt = useContextStore((s) => s.detectedAt);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-8">
        <Hero />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-display text-lg font-semibold tracking-tight">Now</h2>
        <span className="text-sm text-muted">— what ECHO understands you're doing</span>
      </div>

      <div className="space-y-5">
        <ProactiveBanner />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* left: live context + ambient memory */}
          <div className="space-y-5 lg:col-span-3">
            <CurrentContext ctx={context} detectedAt={detectedAt} />

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted">
                  <BrainCircuit size={15} className="text-accent" /> Related Memory
                </h2>
                <LifecycleBar phase={phase} />
              </div>

              {query && phase !== "idle" && (
                <div className="mb-3 truncate font-mono text-[11px] text-muted">
                  contextual query: {query}
                </div>
              )}

              {phase === "checking" && (
                <div className="rounded-xl border border-dashed border-accent/40 py-8 text-center text-sm text-accent">
                  Checking local memory…
                </div>
              )}
              {phase === "none" && (
                <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted">
                  No relevant past context found for what you're doing now.
                </div>
              )}
              {surfaced.length > 0 && (
                <div className="space-y-3">
                  {surfaced.map((item) => (
                    <SurfacedCard key={item.memory.id} item={item} />
                  ))}
                </div>
              )}
              {phase === "idle" && surfaced.length === 0 && (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
                  <Radar size={24} className="text-muted" />
                  <p className="text-sm font-medium">Waiting for a context change…</p>
                  <p className="max-w-sm text-xs text-muted">
                    Switch apps, save a file, or open a tab — related memories appear here.
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
                See how it works
              </div>
              <EchoDemo />
            </div>
          </div>

          {/* right: ask + continue + recent */}
          <div id="ask-echo" className="space-y-5 lg:col-span-2">
            <AskPanel compact />
            <LiveActivity />
            <ContinueStrip />
            <RecentActivity />
          </div>
        </div>

      </div>

      <div className="mt-14 space-y-14">
        <Personas />
        <ContextFlow />
        <Faq />
      </div>

      <div className="mt-8 space-y-5">
        <SourceStatusBar />
        <DiagnosticsPanel />
      </div>
    </div>
  );
}
