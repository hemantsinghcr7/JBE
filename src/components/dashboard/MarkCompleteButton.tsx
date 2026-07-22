"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { purchases } from "@/lib/db";

export function MarkCompleteButton({ purchaseId }: { purchaseId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    const { error: err } = await purchases.updateStatus(purchaseId, "complete");
    if (err) {
      setError("Failed to update status.");
      setLoading(false);
      setConfirming(false);
      return;
    }
    router.refresh();
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.78rem", color: "var(--ink-70)" }}>
          Customer has reviewed and agreed to the paperwork?
        </span>
        <button className="dash-btn" onClick={handleConfirm} disabled={loading}>
          {loading ? "Saving…" : "Yes, Mark Complete"}
        </button>
        <button className="dash-btn dash-btn--outline" onClick={() => setConfirming(false)} disabled={loading}>
          Cancel
        </button>
        {error && <span className="dash-error">{error}</span>}
      </div>
    );
  }

  return (
    <button className="dash-btn" onClick={() => setConfirming(true)}>
      ✓ Mark as Complete
    </button>
  );
}
