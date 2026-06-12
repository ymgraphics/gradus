"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

function Counter({ from, to, duration = 2, suffix = "" }: { from: number; to: number; duration?: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  // Initialize with `to` so SSR/no-JS users see the real number, not 0
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let rafId: number;
    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(ease * (to - from) + from));
      if (progress < 1) {
        rafId = requestAnimationFrame(updateCounter);
      }
    };

    rafId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(rafId);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef} suppressHydrationWarning>{value}{suffix}</span>;
}

export default function Stats() {
  const { t } = useLanguage();
  
  const stats = [
    { value: 98, suffix: "+", label: t("stats.projects") },
    { value: 65, suffix: "", label: t("stats.people") },
    { value: 5, suffix: "", label: t("stats.years") },
    { value: 35, suffix: "", label: t("stats.collaborations") },
  ];
  return (
    <section className="bg-void py-20 md:py-28 border-y border-gradus-border relative overflow-hidden">
      <div className="container relative z-10 w-full h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{ "--i": i } as React.CSSProperties}
              className="flex flex-col items-start md:mt-[calc(var(--i)*1.5rem)]"
            >
              <h4 className="text-display-lg font-display tabular-nums text-text-primary mb-3">
                <Counter from={0} to={stat.value} suffix={stat.suffix} />
              </h4>
              <p className="label-utility">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
