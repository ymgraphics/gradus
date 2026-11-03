import type Lenis from "lenis";

// Lenis drives scrolling itself, so `body { overflow: hidden }` alone does not
// stop the page moving behind an overlay. Every overlay locks through here.

let lenis: Lenis | null = null;
let locks = 0;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locks > 0) lenis.stop();
}

export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
  }
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0) {
    document.documentElement.style.overflow = "";
    lenis?.start();
  }
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
