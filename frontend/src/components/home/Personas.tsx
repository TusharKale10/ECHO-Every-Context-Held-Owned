import { Briefcase, Code2, GraduationCap, PenTool, Microscope } from "lucide-react";
import { Card } from "@/components/ui";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const PEOPLE = [
  {
    icon: Code2,
    tint: "#2563eb",
    title: "Developers",
    copy: "Code, git branches, terminal commands & docs — one context across VS Code, Cursor & Claude.",
  },
  {
    icon: GraduationCap,
    tint: "#7c3aed",
    title: "Students",
    copy: "Research, notes, PDFs & assignments — remember what you studied and where you left off.",
  },
  {
    icon: Microscope,
    tint: "#16a34a",
    title: "Researchers",
    copy: "Papers, browser research & documents connected into sessions you can resume anytime.",
  },
  {
    icon: PenTool,
    tint: "#ea580c",
    title: "Writers & Creators",
    copy: "Drafts, files & references — pick up your work exactly where you paused.",
  },
  {
    icon: Briefcase,
    tint: "#e11d48",
    title: "Freelancers",
    copy: "Many clients & projects, cleanly separated — switch context without losing your place.",
  },
];

export function Personas() {
  return (
    <div>
      <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        Built for everyone whose context matters
      </p>
      <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PEOPLE.map((p) => (
          <RevealItem key={p.title}>
            <Card className="h-full p-5 text-center">
              <div
                className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full"
                style={{ backgroundColor: `${p.tint}18`, color: p.tint }}
              >
                <p.icon size={20} />
              </div>
              <div className="font-display text-sm font-semibold">{p.title}</div>
              <p className="mt-1.5 text-[12px] leading-snug text-muted">{p.copy}</p>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
