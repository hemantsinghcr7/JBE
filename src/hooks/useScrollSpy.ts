"use client";
import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in the centre of the viewport and
 * returns its id string. Used by Navbar to highlight the active nav link.
 *
 * The rootMargin clip ("-45% 0px -50% 0px") means a section must occupy
 * the middle 5% of the viewport height before it is considered "active".
 * This prevents the active link from flickering between two sections when
 * the boundary between them passes through the viewport.
 *
 * NOTE: `ids` should be a stable reference (module-level constant) so the
 * effect does not reconnect the observer on every render.
 */
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
