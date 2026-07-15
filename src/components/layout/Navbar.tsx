"use client";
import { useEffect, useState, useCallback } from "react";
import { company, navLinks } from "@/data/content";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { LogoTile } from "@/components/ui/LogoTile";
import { Btn } from "@/components/ui/Btn";
import { MobileDrawer } from "./MobileDrawer";

const SPY_IDS = ["home", "about", "materials", "process", "contact"];

export function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const active = useScrollSpy(SPY_IDS);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <nav className={`nav ${stuck ? "is-stuck" : ""}`} aria-label="Main">
        <div className="wrap">
          <a
            className="brand"
            href="#home"
            aria-label={`${company.name} — home`}
            style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
          >
            <LogoTile />
            <span className="brand-name">
              Jai Bhawani
              <br />
              Enterprises
              <small>{company.tagline}</small>
            </span>
          </a>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={active === link.href.slice(1) ? "active" : ""}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <Btn variant="red" size="sm" href="#contact" className="nav-cta">
            Get a quote →
          </Btn>

          <button
            className={`burger ${drawerOpen ? "open" : ""}`}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="drawer"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <span />
          </button>
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
