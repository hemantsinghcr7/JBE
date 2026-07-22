import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--f-body)",
        background: "var(--paper)",
        color: "var(--ink)",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--red)",
        }}
      >
        ■ 404
      </span>
      <h1 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 800 }}>
        Page not found.
      </h1>
      <p style={{ color: "var(--ink-70)", maxWidth: "34ch" }}>
        This page doesn&apos;t exist. Head back to the homepage.
      </p>
      <Link
        href="/"
        style={{
          background: "var(--blue)",
          color: "#fff",
          padding: "0.75rem 1.75rem",
          fontFamily: "var(--f-mono)",
          fontSize: "0.8rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        Back to home
      </Link>
    </main>
  );
}
