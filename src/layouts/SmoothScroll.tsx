"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";

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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <FluidBackground />
      {children}
      <NewsletterPopup />
      <ConversionHub />
    </>
  );
}
