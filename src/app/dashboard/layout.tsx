import type { Metadata } from "next";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "JBE Dashboard",
  robots: { index: false }, // never show dashboard in search results
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <span className="dash-logo-tile">JBE</span>
          <span className="dash-logo-label">Operations</span>
        </div>
        <DashboardNav />
        <div className="dash-sidebar-footer">
          <LogoutButton />
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
