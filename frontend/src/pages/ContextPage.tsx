import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useContextStore } from "@/stores/useContextStore";
import { CurrentContext } from "@/components/context/CurrentContext";
import { RelatedMemoryPanel } from "@/components/context/RelatedMemoryPanel";
import { SourceStatusBar } from "@/components/context/SourceStatusBar";
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
import { SupermemoryConnect } from "@/components/home/SupermemoryConnect";
import { FeatureSection } from "@/components/home/FeatureSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui";

export default function ContextPage() {
  const navigate = useNavigate();
  const context = useContextStore((s) => s.context);
  const detectedAt = useContextStore((s) => s.detectedAt);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <Reveal y={14} className="mb-5">
        <Hero />
        <SupermemoryConnect />
      </Reveal>

      <Reveal>
        <ProactiveBanner />
      </Reveal>

      <div className="space-y-12 py-6 sm:space-y-16 sm:py-8">
        {/* 1 — live cockpit: everything happening right now, densely packed */}
        <Reveal>
          <section>
            <SectionHeader
              eyebrow="Now"
              title="What ECHO understands you're doing"
              copy="Your live context, the memory it surfaces, and a way to ask — no searching required."
            />
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-3">
                <CurrentContext ctx={context} detectedAt={detectedAt} />
                <RelatedMemoryPanel />
              </div>
              <div id="ask-echo" className="lg:col-span-2">
                <AskPanel compact />
              </div>
            </div>

            {/* full width: long activity lines get the room they need */}
            <div className="mt-4">
              <LiveActivity />
            </div>
          </section>
        </Reveal>

        {/* 2 — history + continuity, side by side */}
        <Reveal>
          <section>
            <SectionHeader
              eyebrow="History & continuity"
              title="Nothing meaningful gets lost"
              copy="Every signal becomes durable local memory — browsable, filterable, and resumable."
              action={
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate("/activity")}>
                    Activity <ArrowRight size={14} />
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/analytics")}>
                    Analytics <ArrowRight size={14} />
                  </Button>
                </div>
              }
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RecentActivity />
              <ContinueStrip />
            </div>
          </section>
        </Reveal>

        {/* 3 — the one explainer that earns a side-by-side layout */}
        <FeatureSection
          reverse
          eyebrow="See it work"
          title="Signal in, context out"
          copy="Capture → Remember → Recall → Carry. The same loop runs behind every panel above — your activity becomes a signal, and ECHO carries the context forward to any AI you use."
          action={
            <Button variant="outline" onClick={() => navigate("/passport")}>
              View Context Passport <ArrowRight size={14} />
            </Button>
          }
        >
          <EchoDemo />
        </FeatureSection>

        {/* 4 — who it's for */}
        <Reveal>
          <Personas />
        </Reveal>

        {/* 5 — architecture in plain language */}
        <Reveal>
          <ContextFlow />
        </Reveal>

        {/* 6 — how to use it */}
        <Reveal>
          <Faq />
        </Reveal>
      </div>

      <div className="space-y-4">
        <Reveal>
          <SourceStatusBar />
        </Reveal>
        <DiagnosticsPanel />
      </div>
    </div>
  );
}
