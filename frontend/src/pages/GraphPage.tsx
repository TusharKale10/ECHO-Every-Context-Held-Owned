import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui";
import { sourceMeta } from "@/lib/utils";
import type { GraphData } from "@/types";

const W = 900;
const H = 620;

function layout(data: GraphData) {
  const nodes = data.nodes.map((n, i) => ({
    ...n,
    x: W / 2 + Math.cos((i / Math.max(1, data.nodes.length)) * Math.PI * 2) * 220,
    y: H / 2 + Math.sin((i / Math.max(1, data.nodes.length)) * Math.PI * 2) * 220,
    vx: 0,
    vy: 0,
  }));
  const index = new Map(nodes.map((n) => [n.id, n]));
  const edges = data.edges
    .map((e) => ({ ...e, s: index.get(e.source), t: index.get(e.target) }))
    .filter((e) => e.s && e.t);

  // simple force simulation
  for (let iter = 0; iter < 220; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let d2 = dx * dx + dy * dy || 0.01;
        const rep = 5200 / d2;
        const d = Math.sqrt(d2);
        dx /= d;
        dy /= d;
        a.vx += dx * rep;
        a.vy += dy * rep;
        b.vx -= dx * rep;
        b.vy -= dy * rep;
      }
    }
    for (const e of edges) {
      const a = e.s!;
      const b = e.t!;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const spring = (d - 130) * 0.02 * e.weight;
      dx /= d;
      dy /= d;
      a.vx += dx * spring;
      a.vy += dy * spring;
      b.vx -= dx * spring;
      b.vy -= dy * spring;
    }
    for (const n of nodes) {
      n.vx += (W / 2 - n.x) * 0.002;
      n.vy += (H / 2 - n.y) * 0.002;
      n.x += Math.max(-8, Math.min(8, n.vx));
      n.y += Math.max(-8, Math.min(8, n.vy));
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x = Math.max(30, Math.min(W - 30, n.x));
      n.y = Math.max(30, Math.min(H - 30, n.y));
    }
  }
  return { nodes, edges };
}

export default function GraphPage() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    api
      .graph(80)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const sim = useMemo(() => (data ? layout(data) : null), [data]);
  const hoverNode = sim?.nodes.find((n) => n.id === hover);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <PageHeader
        title="Memory Graph"
        subtitle="Real memories connected by transparent signals — same repo, file, domain, or time."
      />

      {loading ? (
        <div className="flex justify-center py-20 text-muted">
          <Loader2 className="animate-spin" />
        </div>
      ) : !sim || sim.nodes.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          Not enough memories yet to draw a graph.
        </p>
      ) : (
        <Card hover={false} className="relative overflow-hidden p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
            {sim.edges.map((e, i) => (
              <line
                key={i}
                x1={e.s!.x}
                y1={e.s!.y}
                x2={e.t!.x}
                y2={e.t!.y}
                stroke="#e0dacb"
                strokeWidth={Math.min(3, e.weight)}
                strokeOpacity={
                  hover && (e.source === hover || e.target === hover) ? 0.9 : 0.4
                }
              />
            ))}
            {sim.nodes.map((n) => {
              const meta = sourceMeta[n.source_type] ?? sourceMeta.unknown;
              const active = hover === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x},${n.y})`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer"
                >
                  <circle
                    r={active ? 9 : 6}
                    fill={meta.color}
                    stroke="#f7f4ec"
                    strokeWidth={2}
                  />
                  {active && (
                    <text
                      x={12}
                      y={4}
                      fill="#1b1e26"
                      fontSize={12}
                      className="font-mono"
                    >
                      {n.label.slice(0, 42)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {hoverNode && (
            <div className="pointer-events-none absolute bottom-3 left-3 max-w-sm rounded-lg border border-border bg-elevated/95 p-3 text-xs">
              <div className="font-semibold text-text">{hoverNode.label}</div>
              <div className="mt-1 text-muted">
                {[hoverNode.repository, hoverNode.file_path, hoverNode.domain]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
          )}

          <div className="absolute right-3 top-3 flex flex-wrap gap-2">
            {Object.entries(sourceMeta)
              .filter(([k]) => k !== "unknown")
              .map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: v.color }}
                  />
                  {v.label}
                </span>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
