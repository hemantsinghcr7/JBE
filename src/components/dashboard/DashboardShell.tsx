"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardNav } from "./DashboardNav";
import { LogoutButton } from "./LogoutButton";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Overview",
  purchases: "Purchases",
  customers: "Customers",
  stock: "Stock",
  new: "New",
  print: "Print",
};

interface Crumb {
  label: string;
  href: string;
}

// A UUID segment is a record id — show it as "Details" rather than
// dumping the raw id into the breadcrumb trail.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let href = "";

  for (const segment of segments) {
    href += `/${segment}`;
    const label = UUID_RE.test(segment)
      ? "Details"
      : SEGMENT_LABELS[segment] ??
        segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href });
  }

  return crumbs;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const crumbs = buildCrumbs(pathname);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="dash-shell">
      {/* Following a link closes the off-canvas drawer, otherwise it stays
          open over the page the user just navigated to. */}
      <aside
        className={`dash-sidebar${navOpen ? " dash-sidebar--open" : ""}`}
        id="dash-sidebar"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setNavOpen(false);
        }}
      >
        <div className="dash-logo">
          <span className="dash-logo-tile">JBE</span>
          <span className="dash-logo-text">
            <span className="dash-logo-name">Jai Bhawani</span>
            <span className="dash-logo-label">Operations</span>
          </span>
        </div>

        <DashboardNav />

        <div className="dash-sidebar-footer">
          <div className="dash-org-card">
            <span className="dash-org-name">Jai Bhawani Enterprises</span>
            <span className="dash-org-meta">27ADGPC2741P1ZE</span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <button
        type="button"
        className={`dash-scrim${navOpen ? " dash-scrim--visible" : ""}`}
        aria-label="Close navigation"
        tabIndex={navOpen ? 0 : -1}
        onClick={() => setNavOpen(false)}
      />

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            type="button"
            className="dash-menu-btn"
            aria-label="Open navigation"
            aria-expanded={navOpen}
            aria-controls="dash-sidebar"
            onClick={() => setNavOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <nav className="dash-crumbs" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <span key={crumb.href} style={{ display: "contents" }}>
                  {i > 0 && <span className="dash-crumb-sep" aria-hidden="true">/</span>}
                  {isLast ? (
                    <span className="dash-crumb dash-crumb--current" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="dash-crumb">{crumb.label}</Link>
                  )}
                </span>
              );
            })}
          </nav>

          <div className="dash-topbar-right">
            <span className="dash-today">{today}</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
