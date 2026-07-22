import type { Metadata } from "next";
import { LoginForm } from "@/components/dashboard/LoginForm";
import "./login.css";

export const metadata: Metadata = {
  title: "Sign in — JBE Operations",
  robots: { index: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
