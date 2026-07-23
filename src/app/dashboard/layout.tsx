import Link from "next/link";
import type { Metadata } from "next";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "JBE Dashboard",
  robots: { index: false }, // never show dashboard in search results
};

const buyingNav = [
  { label: "New Purchase", href: "/dashboard/purchases/new" },
  { label: "Purchases", href: "/dashboard/purchases" },
  { label: "Customers", href: "/dashboard/customers" },
];

const sellingNav = [
  { label: "New Sale", href: "/dashboard/sales/new" },
  { label: "Sales", href: "/dashboard/sales" },
  { label: "Buyers", href: "/dashboard/buyers" },
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
          <Link href="/dashboard" className="dash-nav-link">Overview</Link>

          <span className="dash-nav-section">Buying</span>
          {buyingNav.map((item) => (
            <Link key={item.href} href={item.href} className="dash-nav-link">
              {item.label}
            </Link>
          ))}

          <span className="dash-nav-section">Selling</span>
          {sellingNav.map((item) => (
            <Link key={item.href} href={item.href} className="dash-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="dash-sidebar-footer">
          <LogoutButton />
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
