"use client";

import { motion, useScroll, useTransform } from "framer-motion";

// The page registers your ascent: a hairline in the right margin
// that climbs in 12 discrete steps as you scroll. The only persistent
// accent on screen.
export default function StepWitness() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, (v) => `${(Math.round(v * 12) / 12) * 100}%`);

  return (
    <div
      className="fixed right-7 top-1/2 -translate-y-1/2 z-40 hidden lg:block h-44 w-px bg-white/10"
      aria-hidden="true"
    >
      <motion.div style={{ height }} className="w-px bg-accent" />
    </div>
  );
}
