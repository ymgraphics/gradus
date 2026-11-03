"use client";

import { useEffect, useRef, type RefObject } from "react";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
  );
}

interface DialogOptions {
  open: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  /** Element to focus on open; defaults to the first focusable in the container. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Keep Tab inside the container (modal). Default true. */
  trapFocus?: boolean;
  /** Stop the page scrolling behind the dialog. Default true. */
  lockScroll?: boolean;
}

/**
 * Keyboard and scroll behaviour shared by every overlay: Escape closes,
 * focus moves in on open and returns to the trigger on close, Tab is trapped
 * for modals, and page scroll (including Lenis) is locked.
 */
export function useDialog({
  open,
  containerRef,
  onClose,
  initialFocusRef,
  trapFocus = true,
  lockScroll: shouldLock = true,
}: DialogOptions) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (shouldLock) lockScroll();

    // Wait a frame so entrance animations have mounted the content.
    const raf = requestAnimationFrame(() => {
      const target = initialFocusRef?.current ?? (container && focusables(container)[0]);
      target?.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !trapFocus || !container) return;
      const items = focusables(container);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !container.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !container.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      if (shouldLock) unlockScroll();
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, containerRef, initialFocusRef, trapFocus, shouldLock]);
}
