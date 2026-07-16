import { IdCard, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContextStore } from "@/stores/useContextStore";
import { cn } from "@/lib/utils";
import { EchoLogo } from "@/components/brand/EchoLogo";
import { EchoRipple } from "@/components/home/EchoRipple";
import { MemoryFlow } from "@/components/home/MemoryFlow";

export function Hero() {
  const navigate = useNavigate();
  const wsConnected = useContextStore((s) => s.wsConnected);
  const smOk = useContextStore((s) => s.status?.supermemory.reachable);
  const listening = wsConnected && smOk;

  return (
    <div className="hero-glow group relative overflow-hidden rounded-2xl border border-border transition-[border-color,box-shadow] duration-300 hover:border-accent/45 hover:shadow-[0_0_0_1px_rgba(47,91,255,0.18),0_24px_60px_-20px_rgba(47,91,255,0.28)]">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <EchoRipple />
      <div className="relative z-10 px-6 py-10 text-center sm:py-12">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-panel/70 px-3 py-1 text-xs">
          <span className={cn("h-2 w-2 rounded-full", listening ? "bg-success pulse-dot" : "bg-warn")} />
          <span className={listening ? "text-text" : "text-muted"}>
            {listening ? "ECHO is listening · context active" : "Reconnecting to your context…"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          <EchoLogo size={30} className="text-accent" />
          <span className="font-display text-2xl font-bold tracking-[0.14em] text-muted sm:text-[26px]">
            ECHO
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-[44px]">
          Every Context,
          <br className="sm:hidden" />{" "}
          <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
            Held &amp; Owned
          </span>
        </h1>
        <p className="mt-3 font-display text-base font-medium text-text/80 sm:text-lg">
          Pick up exactly where you left off.
        </p>

        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          ECHO understands the context behind your work, remembers what matters, and carries
          it across the AI tools you use.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() =>
              document.getElementById("ask-echo")?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            className="press inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(47,91,255,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-soft hover:shadow-[0_6px_18px_rgba(47,91,255,0.34)]"
          >
            <Sparkles size={16} /> Ask ECHO
          </button>
          <button
            onClick={() => navigate("/passport")}
            className="press inline-flex items-center gap-2 rounded-xl border border-border bg-panel/70 px-5 py-2.5 text-sm font-medium text-text shadow-[0_1px_3px_rgba(27,30,38,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-panel hover:shadow-[0_6px_16px_rgba(27,30,38,0.07)]"
          >
            <IdCard size={16} /> View Context Passport
          </button>
        </div>

        {/* memory flow: Browser -> Context -> Memory -> Passport -> AI */}
        <div className="mt-9 border-t border-border/60 pt-6">
          <MemoryFlow />
        </div>
      </div>
    </div>
  );
}
