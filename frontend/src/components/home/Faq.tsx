import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How does ECHO know what I'm working on?",
    a: "ECHO watches meaningful activity in your Watched Locations — files & folders you create or edit, the app you're in, git branches, and (with the browser extension) the pages you research. It's privacy-filtered: no keystrokes, no passwords, no file contents.",
  },
  {
    q: "Where is my data stored?",
    a: "Locally. Your memories live in Supermemory Local running on your own machine at localhost:6767. Nothing is sent to the cloud, and secrets are redacted before anything is stored.",
  },
  {
    q: "How do I use Ask ECHO?",
    a: "Open the Now page and type a natural question in the Ask box — like \"what did I work on today?\" or \"what was the JWT issue I fixed?\". ECHO answers grounded in your real memories and shows the supporting evidence.",
  },
  {
    q: "What is the Context Passport?",
    a: "A portable snapshot of your current work state — goal, task, project, recent work, decisions, blockers and next action. Click Copy Context Passport and paste it into any AI so it instantly knows where you left off.",
  },
  {
    q: "How do I connect ECHO to Claude Code or Cursor?",
    a: "Register the ECHO MCP server (see mcp-server/README.md). Once connected, your AI tools can read your live context — passport, recent activity, sessions and memory — directly, no copy-paste needed.",
  },
  {
    q: "Can I control what ECHO watches?",
    a: "Yes. Go to Privacy → Watched Locations to add or remove folders, exclude patterns, or pause monitoring entirely. You can also pin, edit, or forget any individual memory.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card
      hover={false}
      className={cn(
        "overflow-hidden transition-colors duration-200",
        open ? "border-accent/35" : "hover:border-accent/25"
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-elevated/50"
      >
        <span
          className={cn(
            "flex-1 text-[14px] font-medium transition-colors",
            open ? "text-accent" : "text-text"
          )}
        >
          {q}
        </span>
        <span
          className={cn(
            "grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all duration-300",
            open ? "rotate-180 bg-accent/10 text-accent" : "text-muted"
          )}
        >
          <ChevronDown size={15} />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border/60 px-5 py-4 text-[13.5px] leading-relaxed text-muted">
            {a}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function Faq() {
  return (
    <div>
      <div className="mb-5 text-center">
        <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-panel px-3 py-1 text-xs text-muted">
          <HelpCircle size={13} className="text-accent" /> FAQ
        </div>
        <h2 className="font-display text-lg font-semibold">How to use ECHO</h2>
        <p className="mt-1 text-sm text-muted">Everything you need to get your context following you.</p>
      </div>
      <div className="mx-auto max-w-2xl space-y-2.5">
        {FAQS.map((f) => (
          <Item key={f.q} {...f} />
        ))}
      </div>
    </div>
  );
}
