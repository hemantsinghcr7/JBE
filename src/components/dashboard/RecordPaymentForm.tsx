"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { PaymentType } from "@/types/database";

export function RecordPaymentForm({ purchaseId, balanceDue }: { purchaseId: string; balanceDue: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<PaymentType>("cash");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Enter a valid amount."); return; }
    setLoading(true);
    const db = createDb(createSupabaseBrowser());
    const { error: err } = await db.payments.insert({
      purchase_id: purchaseId,
      amount: amt,
      payment_type: type,
      payment_date: date,
      notes: notes || null,
    });
    if (err) { setError(`Failed to record payment: ${err.message}`); setLoading(false); return; }
    setOpen(false);
    setAmount("");
    setNotes("");
    router.refresh();
  }

  if (!open) {
    return (
      <button className="dash-btn" onClick={() => setOpen(true)} disabled={balanceDue <= 0}>
        + Record Payment
      </button>
    );
  }

  return (
    <form className="dash-payment-form" onSubmit={handleSubmit}>
      <div className="dash-section-label" style={{ marginBottom: "0.75rem" }}>Record Payment</div>
      <div className="dash-form-row" style={{ maxWidth: 600 }}>
        <label className="dash-label">
          Amount (₹)
          <input
            type="number"
            className="dash-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={balanceDue.toFixed(2)}
            min="0.01"
            step="0.01"
            required
          />
        </label>
        <label className="dash-label">
          Type
          <select className="dash-input" value={type} onChange={(e) => setType(e.target.value as PaymentType)}>
            <option value="cash">Cash</option>
            <option value="credit">Credit / Bank</option>
          </select>
        </label>
        <label className="dash-label">
          Date
          <input type="date" className="dash-input" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="dash-label">
          Notes (optional)
          <input type="text" className="dash-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cheque no, UPI ref…" />
        </label>
      </div>
      {error && <div className="dash-error">{error}</div>}
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
        <button type="submit" className="dash-btn" disabled={loading}>{loading ? "Saving…" : "Save Payment"}</button>
        <button type="button" className="dash-btn dash-btn--outline" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}
