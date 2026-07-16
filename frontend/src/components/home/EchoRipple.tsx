import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useContextStore } from "@/stores/useContextStore";

/**
 * Code-based Echo Ripple for the hero. Concentric wave-fronts originate near the left edge
 * and propagate LEFT -> CENTER -> RIGHT, then fade with a calm pause before repeating.
 * Purely decorative: pointer-events:none, sits BEHIND hero content, very low opacity, and
 * is fully contained by the hero card's overflow-hidden. Real ECHO events (reconnect,
 * memory ingested, context surfaced, passport-ready) emit an extra throttled pulse.
 */
export function EchoRipple() {
  const [pulses, setPulses] = useState<number[]>([]);
  const lastPulse = useRef(0);
  const prev = useRef({ ws: false, ingest: "", phase: "", sugg: 0 });

  const ws = useContextStore((s) => s.wsConnected);
  const ingest = useContextStore((s) => s.lastIngest?.id ?? "");
  const phase = useContextStore((s) => s.phase);
  const sugg = useContextStore((s) => s.suggestion?.created_at ?? 0);

  const emit = () => {
    const now = Date.now();
    if (now - lastPulse.current < 1200) return; // debounce bursts of events
    lastPulse.current = now;
    const id = now;
    setPulses((p) => [...p, id]);
    window.setTimeout(() => setPulses((p) => p.filter((x) => x !== id)), 5000);
  };

  // each maps a REAL state transition -> one restrained ripple
  useEffect(() => {
    if (ws && !prev.current.ws) emit();
    prev.current.ws = ws;
  }, [ws]);
  useEffect(() => {
    if (ingest && ingest !== prev.current.ingest) {
      prev.current.ingest = ingest;
      emit();
    }
  }, [ingest]);
  useEffect(() => {
    if (phase === "surfaced" && prev.current.phase !== "surfaced") emit();
    prev.current.phase = phase;
  }, [phase]);
  useEffect(() => {
    if (sugg && sugg !== prev.current.sugg) {
      prev.current.sugg = sugg;
      emit();
    }
  }, [sugg]);

  return (
    <div className="echo-ripple" aria-hidden>
      <span className="echo-wave" style={{ "--d": "0s" } as CSSProperties} />
      <span className="echo-wave alt" style={{ "--d": "1.4s" } as CSSProperties} />
      {pulses.map((id) => (
        <span key={id} className="echo-wave echo-wave--pulse" />
      ))}
    </div>
  );
}
