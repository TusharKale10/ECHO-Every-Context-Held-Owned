import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One feature = one section. Copy on one side, the REAL live component on the other,
 * alternating direction down the page. Both halves reveal as the section scrolls into view.
 * Motion fully disabled under prefers-reduced-motion.
 */
export function FeatureSection({
  eyebrow,
  title,
  copy,
  action,
  reverse = false,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  action?: ReactNode;
  reverse?: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const viewport = { once: true, margin: "-80px" };

  const textInit = reduce ? {} : { opacity: 0, x: reverse ? 28 : -28 };
  const visualInit = reduce ? {} : { opacity: 0, x: reverse ? -28 : 28, scale: 0.98 };

  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      {/* copy */}
      <motion.div
        className={cn(reverse && "lg:order-2")}
        initial={textInit}
        whileInView={reduce ? {} : { opacity: 1, x: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{copy}</p>
        {action && <div className="mt-5">{action}</div>}
      </motion.div>

      {/* live visual */}
      <motion.div
        className={cn("min-w-0", reverse && "lg:order-1")}
        initial={visualInit}
        whileInView={reduce ? {} : { opacity: 1, x: 0, scale: 1 }}
        viewport={viewport}
        transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
      >
        {children}
      </motion.div>
    </section>
  );
}
