"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { registerLenis, prefersReducedMotion } from "@/lib/scroll-lock";

const FluidBackground = dynamic(() => import("@/components/FluidBackground"), {
  ssr: false,
});

const NewsletterPopup = dynamic(() => import("@/components/NewsletterPopup"), {
  ssr: false,
});

const ConversionHub = dynamic(() => import("@/sections/ConversionHub"), {
  ssr: false,
});

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Smooth-scroll hijacking is motion; respect the OS setting and keep native scroll.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    registerLenis(lenis);

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    // reducedMotion="user": framer-motion drops transform/layout animations
    // site-wide when the visitor has asked for reduced motion.
    <MotionConfig reducedMotion="user">
      <FluidBackground />
      {children}
      <NewsletterPopup />
      <ConversionHub />
    </MotionConfig>
  );
}
