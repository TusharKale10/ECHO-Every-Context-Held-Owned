import { Fragment } from "react";
import type { CSSProperties } from "react";

/**
 * Lightweight hero visualization of the memory flow:
 *   Browser -> Context -> Memory -> Passport -> AI
 * Glowing dots travel the connecting lines in a repeating cascade. Pure CSS
 * (transform/opacity only, GPU-friendly), decorative and non-interactive — deliberately
 * a thin strip, not another feature card.
 */
const STAGES = ["Browser", "Context", "Memory", "Passport", "AI"];

export function MemoryFlow() {
  return (
    <div className="memflow" aria-hidden>
      {STAGES.map((stage, i) => (
        <Fragment key={stage}>
          <div className="memflow-node">
            <span className="memflow-dot" style={{ "--i": i } as CSSProperties} />
            <span className="memflow-label">{stage}</span>
          </div>
          {i < STAGES.length - 1 && (
            <span className="memflow-line">
              <span className="memflow-glow" style={{ "--i": i } as CSSProperties} />
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
