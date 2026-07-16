import { IdCard, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContextStore } from "@/stores/useContextStore";
import { cn } from "@/lib/utils";
import { EchoLogo } from "@/components/brand/EchoLogo";
import { EchoRipple } from "@/components/home/EchoRipple";

export function Hero() {
  const navigate = useNavigate();
  const wsConnected = useContextStore((s) => s.wsConnected);
  const smOk = useContextStore((s) => s.status?.supermemory.reachable);
  const listening = wsConnected && smOk;

  return (
    <div className="hero-glow group relative overflow-hidden rounded-2xl border border-border transition-[border-color,box-shadow] duration-300 hover:border-accent/45 hover:shadow-[0_0_0_1px_rgba(47,91,255,0.18),0_24px_60px_-20px_rgba(47,91,255,0.28)]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <EchoRipple />
      <div className="relative z-10 px-8 py-12 text-center sm:py-16">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-panel/70 px-3 py-1 text-xs">
          <span className={cn("h-2 w-2 rounded-full", listening ? "bg-success pulse-dot" : "bg-warn")} />
          <span className={listening ? "text-text" : "text-muted"}>
            {listening ? "ECHO is listening · context active" : "Reconnecting to your context…"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <EchoLogo size={44} className="text-accent" />
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">ECHO</h1>
        </div>
        <p className="mt-3 font-display text-lg font-semibold text-text sm:text-xl">
          Every Context, Held &amp; Owned
        </p>
        <p className="mt-1 text-sm text-muted">Pick up exactly where you left off.</p>

        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
          ECHO understands the context behind your work, remembers what matters, and carries
          it across the AI tools you use.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() =>
              document.getElementById("ask-echo")?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            <Sparkles size={16} /> Ask ECHO
          </button>
          <button
            onClick={() => navigate("/passport")}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-elevated"
          >
            <IdCard size={16} /> View Context Passport
          </button>
        </div>
      </div>
    </div>
  );
}
