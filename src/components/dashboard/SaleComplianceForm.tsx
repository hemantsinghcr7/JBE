"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function SaleComplianceForm({
  saleId,
  invoiceNumber,
  ewayBillNumber,
}: {
  saleId: string;
  invoiceNumber: string | null;
  ewayBillNumber: string | null;
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState(invoiceNumber ?? "");
  const [eway, setEway] = useState(ewayBillNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    const db = createDb(createSupabaseBrowser());
    const { error: err } = await db.sales.updateCompliance(saleId, {
      invoice_number: invoice.trim() || null,
      eway_bill_number: eway.trim() || null,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    router.refresh();
  }

  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "var(--ink-70)", marginBottom: "0.9rem" }}>
        These are reference numbers only — generate the actual GST invoice and E-way Bill through
        your invoicing/accounting tool or the government e-way bill portal, then record the numbers here.
      </p>
      <div className="dash-form-row" style={{ maxWidth: 600 }}>
        <label className="dash-label">
          Invoice Number
          <input
            className="dash-input"
            type="text"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="INV-2026-0042"
          />
        </label>
        <label className="dash-label">
          E-way Bill Number
          <input
            className="dash-input"
            type="text"
            value={eway}
            onChange={(e) => setEway(e.target.value)}
            placeholder="381xxxxxxxxx"
          />
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
        <button type="button" className="dash-btn dash-btn--outline" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span style={{ color: "green", fontSize: "0.8rem" }}>Saved</span>}
        {error && <span className="dash-error">{error}</span>}
      </div>
    </div>
  );
}
