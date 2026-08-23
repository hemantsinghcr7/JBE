"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { errorMessage } from "@/lib/errorMessage";

/**
 * Deleting a customer who has purchases would orphan financial records, and
 * the foreign key would reject it anyway. So when purchases exist the action
 * is disabled with an explanation rather than offered and then failing.
 */
export function DeleteCustomerButton({
  customerId,
  customerName,
  purchaseCount,
}: {
  customerId: string;
  customerName: string;
  purchaseCount: number;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const blocked = purchaseCount > 0;

  async function handleDelete() {
    setLoading(true);
    setError("");
    const db = createDb(createSupabaseBrowser());
    const { error: err } = await db.customers.remove(customerId);
    if (err) {
      setError(errorMessage(err));
      setLoading(false);
      setConfirming(false);
      return;
    }
    router.push("/dashboard/customers");
    router.refresh();
  }

  if (blocked) {
    return (
      <span className="dash-delete-blocked">
        Can’t delete — {purchaseCount} purchase{purchaseCount === 1 ? "" : "s"} on record
      </span>
    );
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--ink-70)" }}>
          Delete <strong>{customerName}</strong> permanently?
        </span>
        <button className="dash-btn dash-btn--danger" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting…" : "Yes, Delete"}
        </button>
        <button className="dash-btn dash-btn--outline" onClick={() => setConfirming(false)} disabled={loading}>
          Cancel
        </button>
        {error && <span className="dash-error">{error}</span>}
      </div>
    );
  }

  return (
    <button className="dash-btn dash-btn--outline dash-btn--danger-text" onClick={() => setConfirming(true)}>
      Delete Customer
    </button>
  );
}
