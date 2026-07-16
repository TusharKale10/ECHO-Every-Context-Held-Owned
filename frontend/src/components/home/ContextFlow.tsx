import { Boxes, Brain, Cpu, IdCard, MonitorSmartphone } from "lucide-react";
import { Card } from "@/components/ui";

const STAGES = [
  { icon: Boxes, title: "Activity", copy: "Files, apps, browser, git — across your computer" },
  { icon: Cpu, title: "ECHO understands", copy: "Meaningful context, privacy-filtered" },
  { icon: Brain, title: "Supermemory remembers", copy: "Local semantic memory · :6767" },
  { icon: IdCard, title: "Context Passport", copy: "Your portable work state" },
  { icon: MonitorSmartphone, title: "Your AI tools", copy: "Claude · Cursor via MCP, or Copy Passport" },
];

export function ContextFlow() {
  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="font-display text-lg font-semibold">How ECHO works</h2>
        <p className="mt-1 text-sm text-muted">Your activity becomes context — and your context follows you.</p>
      </div>
      <Card hover={false} className="p-6">
        <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch">
          {STAGES.map((s, i) => (
            <div key={s.title} className="contents lg:flex lg:flex-1 lg:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-xl px-2 py-2 lg:flex-col lg:text-center">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
                  <s.icon size={20} />
                </div>
                <div className="lg:mt-2">
                  <div className="text-sm font-semibold text-text">{s.title}</div>
                  <div className="text-[11px] leading-snug text-muted">{s.copy}</div>
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <svg className="mx-auto my-1 h-6 w-6 rotate-90 text-accent lg:my-0 lg:h-4 lg:w-8 lg:rotate-0" viewBox="0 0 32 16" fill="none">
                  <line x1="0" y1="8" x2="26" y2="8" stroke="currentColor" strokeWidth="1.5" className="flow-line" />
                  <path d="M24 3 L30 8 L24 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-border pt-3 text-center text-[11px] text-muted">
          MCP-connected tools (Claude Code, Cursor) read your context live. Other AI tools get it via <span className="text-text">Copy Context Passport</span>.
        </p>
      </Card>
    </div>
  );
}
