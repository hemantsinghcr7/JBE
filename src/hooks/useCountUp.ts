"use client";
import { useEffect, useRef } from "react";

/**
 * Attaches to a <span> ref and counts up from 0 to `target` using a
 * cubic ease-out animation when the element scrolls into view.
 *
 * Mutates DOM directly (textContent) instead of setState to avoid a
 * React re-render on every animation frame — important when multiple
 * counters run simultaneously on the Stats band.
 *
 * Respects prefers-reduced-motion: jumps straight to the final value.
 */
export function useCountUpRef(target: number, duration = 1300) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        if (prefersReduced) {
          el.textContent = String(target);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}
