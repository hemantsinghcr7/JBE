"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

const TYPEWRITER_TEXT = "Operations\nConsole.";
const TYPEWRITER_DELAY = 60;
const TYPEWRITER_START = 500;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [displayed, setDisplayed] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        const next = TYPEWRITER_TEXT[indexRef.current];
        if (next === undefined) {
          clearInterval(interval);
          setDoneTyping(true);
          return;
        }
        setDisplayed((prev) => prev + next);
        indexRef.current += 1;
      }, TYPEWRITER_DELAY);
      return () => clearInterval(interval);
    }, TYPEWRITER_START);
    return () => clearTimeout(startTimer);
  }, []);

  async function devLogin() {
    const devEmail = process.env.NEXT_PUBLIC_DEV_EMAIL ?? "";
    const devPass  = process.env.NEXT_PUBLIC_DEV_PASSWORD ?? "";
    if (!devEmail || !devPass) return;
    setEmail(devEmail);
    setPassword(devPass);
    setError("");
    setLoading(true);
    const supabase = createSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: devEmail,
      password: devPass,
    });
    if (authError) { setError("Dev login failed — check NEXT_PUBLIC_DEV_EMAIL / PASSWORD in .env.local"); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const lines = displayed.split("\n");
  const firstLine = lines[0] ?? "";
  const secondLine = lines[1] ?? "";
  const cursorOnFirst = !displayed.includes("\n");

  return (
    <div className="login-shell">
      {/* ── Left: form ── */}
      <div className="login-left">
        <div className="login-card">
          <div className="login-card-top">
            <div className="login-logo-tile">JBE</div>
          </div>

          <h1 className="login-heading">Sign in</h1>
          <p className="login-sub">Access the JBE Operations console.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="login-input"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="login-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          {process.env.NODE_ENV === "development" && (
            <button type="button" className="login-dev-btn" onClick={devLogin} disabled={loading}>
              ⚡ Dev — Quick Login
            </button>
          )}

          <Link href="/" className="login-back">← Return to main website</Link>
        </div>
      </div>

      {/* ── Right: branding + typewriter ── */}
      <div className="login-right">
        <p className="login-right-label">JBE · Jai Bhawani Enterprises</p>
        <div className="login-typewriter">
          <span>{firstLine}</span>
          {cursorOnFirst && <span className="login-cursor" />}
          {displayed.includes("\n") && (
            <>
              <br />
              <span className="login-typewriter-second">{secondLine}</span>
              {(doneTyping || secondLine.length > 0) && <span className="login-cursor" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
