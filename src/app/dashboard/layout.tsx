import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "JBE Dashboard",
  robots: { index: false }, // never show dashboard in search results
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
