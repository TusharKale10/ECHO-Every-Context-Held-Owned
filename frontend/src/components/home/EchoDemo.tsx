import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FilePlus2,
  IdCard,
  Radio,
} from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Self-playing illustration of ECHO's real pipeline (capture -> remember -> recall ->
 * carry). Representative example, styled like a live terminal/product demo. It shows how
 * the product works — it is not your live memory (that appears in the panels above).
 */
const STEPS = [
  {
    stage: "Capture",
    icon: FilePlus2,
    tag: "activity signal",
    line: "Created auth.ts in your project",
    sub: "File Explorer · privacy-filtered, paths only",
    tint: "#16a34a",
  },
  {
    stage: "Remember",
    icon: CheckCircle2,
    tag: "POST /v3/documents",
    line: "Stored as a memory in Supermemory Local",
    sub: "localhost:6767 · on your machine",
    tint: "#2563eb",
  },
  {
    stage: "Recall",
    icon: BrainCircuit,
    tag: "context changed",
    line: '"Working on auth.ts" → 1 memory surfaced',
    sub: "Fixed JWT expiration · 84% · same file",
    tint: "#7c3aed",
  },
  {
    stage: "Carry",
    icon: IdCard,
    tag: "context passport",
    line: "Ready for Claude · Cursor · any AI",
    sub: "Your context follows you",
    tint: "#e11d48",
  },
];

const STAGES = ["Capture", "Remember", "Recall", "Carry"];

export function EchoDemo() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % STEPS.length), 2400);
    return () => clearInterval(t);
  }, []);

  const step = STEPS[i];
  const Icon = step.icon;

  return (
    <Card hover={false} className="overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1 flex items-center gap-1.5 text-xs font-medium text-text">
          <Radio size={12} className="text-accent" /> ECHO · live pipeline
        </span>
        <span className="ml-auto font-mono text-[10px] text-muted">runs on your machine</span>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* stage rail */}
        <div className="flex shrink-0 gap-2 border-b border-border p-3 sm:w-36 sm:flex-col sm:border-b-0 sm:border-r">
          {STAGES.map((s, idx) => (
            <div
              key={s}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-300 sm:flex-none",
                idx === i ? "bg-accent/12 text-accent" : "text-muted"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full transition-all",
                  idx === i ? "scale-125" : "opacity-40"
                )}
                style={{ backgroundColor: idx === i ? step.tint : "currentColor" }}
              />
              <span className="hidden sm:inline">{s}</span>
            </div>
          ))}
        </div>

        {/* animated screen */}
        <div className="min-h-[132px] flex-1 p-4">
          <div key={i} className="fade-up">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-elevated px-2 py-0.5 font-mono text-[10px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: step.tint }} />
              {step.tag}
            </div>
            <div className="flex items-start gap-2.5">
              <div
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                style={{ backgroundColor: `${step.tint}18`, color: step.tint }}
              >
                <Icon size={16} />
              </div>
              <div>
                <div className="text-sm font-medium text-text">{step.line}</div>
                <div className="mt-0.5 text-xs text-muted">{step.sub}</div>
              </div>
            </div>
          </div>

          {/* progress + flow */}
          <div className="mt-4 flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === i ? "w-6 bg-accent" : "w-2 bg-border"
                )}
              />
            ))}
            <span className="ml-auto flex items-center gap-1 text-[10px] text-muted">
              activity <ArrowRight size={10} /> memory <ArrowRight size={10} /> context
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
