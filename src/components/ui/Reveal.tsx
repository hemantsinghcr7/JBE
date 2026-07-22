"use client";
import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in seconds — pass 0.1, 0.2, etc. to offset siblings. */
  delay?: number;
  className?: string;
}

/**
 * Wraps children in a div with the `.reveal` CSS class and adds `.in`
 * when the element enters the viewport. The CSS transition (defined in
 * globals.css) handles the actual fade/slide animation.
 *
 * Unobserves after the first trigger — the animation only plays once.
 * Immediately adds `.in` if the user prefers reduced motion.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = ref.current;
    if (!el) return;

    if (prefersReduced) {
      el.classList.add("in");
      return;
    }

    el.style.setProperty("--reveal-delay", `${delay}s`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
