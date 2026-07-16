import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Radar,
  Activity,
  BarChart3,
  Brain,
  Clock,
  IdCard,
  Layers,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContextStore } from "@/stores/useContextStore";
import { EchoLogo } from "@/components/brand/EchoLogo";

const nav = [
  { to: "/", label: "Now", icon: Radar, end: true },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/passport", label: "Context Passport", icon: IdCard },
  { to: "/sessions", label: "Sessions", icon: Layers },
  { to: "/memories", label: "Memories", icon: Brain },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/graph", label: "Memory Graph", icon: Network },
  { to: "/search", label: "Search", icon: Search },
  { to: "/privacy", label: "Privacy", icon: ShieldCheck },
];

export function Sidebar() {
  const status = useContextStore((s) => s.status);
  const wsConnected = useContextStore((s) => s.wsConnected);
  const smOk = status?.supermemory.reachable;

  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;

  // logo emits one soft ring when a real memory is ingested
  const lastIngest = useContextStore((s) => s.lastIngest?.id ?? "");
  const [logoPulse, setLogoPulse] = useState(false);
  const prevIngest = useRef("");
  useEffect(() => {
    if (lastIngest && lastIngest !== prevIngest.current) {
      prevIngest.current = lastIngest;
      setLogoPulse(true);
      const t = setTimeout(() => setLogoPulse(false), 950);
      return () => clearTimeout(t);
    }
  }, [lastIngest]);

  return (
    // outer reserves rail width; the panel expands as an overlay so content never jumps
    <div className={cn("relative h-full shrink-0 transition-[width] duration-200", pinned ? "w-60" : "w-16")}>
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "absolute inset-y-0 left-0 z-40 flex h-full flex-col overflow-hidden border-r border-border bg-panel transition-[width] duration-200",
          open ? "w-60 shadow-[8px_0_30px_rgba(27,30,38,0.08)]" : "w-16"
        )}
      >
        {/* brand + collapse toggle */}
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
            <EchoLogo size={22} className="text-accent" pulse={logoPulse} />
          </div>
          <div className={cn("min-w-0 flex-1 transition-opacity duration-150", open ? "opacity-100" : "opacity-0")}>
            <div className="font-display text-[16px] font-bold leading-none tracking-tight">ECHO</div>
            <div className="mt-1 whitespace-nowrap text-[10px] uppercase tracking-wider text-muted">
              Context, held &amp; owned
            </div>
          </div>
          {open && (
            <button
              onClick={() => setPinned((p) => !p)}
              title={pinned ? "Unpin sidebar" : "Keep sidebar open"}
              className="shrink-0 text-muted transition-colors hover:text-text"
            >
              {pinned ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  open && "hover:translate-x-0.5",
                  isActive
                    ? "bg-accent/15 text-accent shadow-[inset_2px_0_0_0_#2f5bff]"
                    : "text-muted hover:bg-elevated hover:text-text"
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className={cn("whitespace-nowrap transition-opacity duration-150", open ? "opacity-100" : "opacity-0")}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          {open ? (
            <div className="rounded-lg bg-elevated p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-muted">Supermemory</span>
                <span className={cn("flex items-center gap-1.5 font-medium", smOk ? "text-success" : "text-warn")}>
                  <span className={cn("h-2 w-2 rounded-full", smOk ? "bg-success pulse-dot" : "bg-warn")} />
                  {smOk ? "Local" : "Offline"}
                </span>
              </div>
              <div className="font-mono text-[11px] text-muted">localhost:6767</div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                <span className={cn("h-1.5 w-1.5 rounded-full", wsConnected ? "bg-accent" : "bg-border")} />
                live stream {wsConnected ? "connected" : "…"}
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={smOk ? "Supermemory: Local" : "Supermemory: Offline"}>
              <span className={cn("h-2.5 w-2.5 rounded-full", smOk ? "bg-success pulse-dot" : "bg-warn")} />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
