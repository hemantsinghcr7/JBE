"use client";
import { useEffect, useRef } from "react";

/**
 * Renders two scroll-driven UI extras:
 *   1. A red progress bar pinned to the top of the viewport.
 *   2. A "back to top" button that appears after 600px of scroll.
 *
 * Both are driven by a single passive scroll listener that mutates the DOM
 * directly via refs — no setState — to avoid scheduling a React re-render
 * on every scroll event (which fires ~60 times/sec while scrolling).
 */
export function ScrollExtras() {
  const progressRef = useRef<HTMLDivElement>(null);
  const totopRef = useRef<HTMLButtonElement>(null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const progress = progressRef.current;
    const totop = totopRef.current;
    if (!progress || !totop) return;

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
      totop.classList.toggle("show", window.scrollY > 600);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <button
        ref={totopRef}
        className="totop"
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
        }
      >
        ↑
      </button>
    </>
  );
}
