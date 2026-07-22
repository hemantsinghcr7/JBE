import Link from "next/link";
import type { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "JBE Dashboard",
  robots: { index: false }, // never show dashboard in search results
};

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "New Purchase", href: "/dashboard/purchases/new" },
  { label: "Purchases", href: "/dashboard/purchases" },
  { label: "Customers", href: "/dashboard/customers" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <span className="dash-logo-tile">JBE</span>
          <span className="dash-logo-label">Operations</span>
        </div>
        <nav className="dash-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="dash-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="dash-sidebar-footer">
          <Link href="/" className="dash-nav-link" style={{ fontSize: "0.75rem", opacity: 0.6 }}>
            ← Back to website
          </Link>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
