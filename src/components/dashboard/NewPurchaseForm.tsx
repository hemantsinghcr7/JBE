"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { purchases, purchaseItems } from "@/lib/db";
import type { MetalType, RateTiming } from "@/types/database";

interface Props {
  customers: { id: string; name: string }[];
}

interface ItemRow {
  metal_type: MetalType;
  gross_weight: string;
  sacks_count: string;
  deduction_weight: string;
  rate: string;
  rate_timing: RateTiming;
}

const EMPTY_ITEM: ItemRow = {
  metal_type: "Aluminium Cast",
  gross_weight: "",
  sacks_count: "0",
  deduction_weight: "0",
  rate: "",
  rate_timing: "before",
};

const METALS: MetalType[] = [
  "Aluminium Cast",
  "Aluminium Cuttings",
  "Aluminium Domestic",
  "Aluminium Extruded",
  "Aluminium Wheels",
  "Brass – Clean",
  "Brass – Contaminated",
  "Copper – Burnt/Tinned",
  "Copper Candy",
  "Copper Domestic",
  "Copper Millberry",
  "Alternator/Starter Motor",
  "Electric Fridge Compressor",
  "Electric Motors Large",
  "Electric Motors Small",
  "Insulated Copper Wire – Low Grade",
  "Insulated Copper Wire – Medium Grade",
  "Radiator – Brass/Copper Clean",
  "Radiator – Brass/Copper Contaminated",
  "Radiators – Aluminium/Copper 5% Contamination",
  "Radiators – Aluminium/Copper Clean",
  "Other",
];

export function NewPurchaseForm({ customers }: Props) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ ...EMPTY_ITEM }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function netWeight(item: ItemRow) {
    return Math.max(0, (parseFloat(item.gross_weight) || 0) - (parseFloat(item.deduction_weight) || 0));
  }
  function rowAmount(item: ItemRow) {
    return netWeight(item) * (parseFloat(item.rate) || 0);
  }
  const totalAmount = items.reduce((sum, i) => sum + rowAmount(i), 0);

  function updateItem(index: number, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }
  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }
  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(status: "draft" | "complete") {
    setError("");
    if (!customerId) { setError("Please select a customer."); return; }
    if (items.some((i) => !i.gross_weight || !i.rate)) {
      setError("All items need a gross weight and rate.");
      return;
    }

    setSaving(true);
    try {
      const { data: purchase, error: pErr } = await purchases.insert({
        customer_id: customerId,
        purchase_date: purchaseDate,
        status,
        notes: notes || null,
      });

      if (pErr || !purchase) throw pErr ?? new Error("Failed to create purchase");

      const { error: iErr } = await purchaseItems.insertMany(
        items.map((item) => ({
          purchase_id: purchase.id,
          metal_type: item.metal_type,
          gross_weight: parseFloat(item.gross_weight),
          sacks_count: parseInt(item.sacks_count) || 0,
          deduction_weight: parseFloat(item.deduction_weight) || 0,
          rate: parseFloat(item.rate),
          rate_timing: item.rate_timing,
        }))
      );

      if (iErr) throw iErr;

      router.push(`/dashboard/purchases/${purchase.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="dash-form-wrap">
      <div className="dash-form-row">
        <label className="dash-label">
          Customer
          <select
            className="dash-input"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="dash-label">
          Date
          <input
            type="date"
            className="dash-input"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </label>
      </div>

      <div className="dash-section-label">Metal items</div>

      <div className="dash-items-table">
        <div className="dash-items-head">
          <span>Metal</span>
          <span>Gross wt (kg)</span>
          <span>Sacks</span>
          <span>Deduction (kg)</span>
          <span>Net wt (kg)</span>
          <span>Rate (₹/kg)</span>
          <span>Rate timing</span>
          <span>Amount (₹)</span>
          <span></span>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="dash-items-row">
            <select
              className="dash-input"
              value={item.metal_type}
              onChange={(e) => updateItem(idx, { metal_type: e.target.value as MetalType })}
            >
              {METALS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              className="dash-input"
              placeholder="0.000"
              step="0.001"
              min="0"
              value={item.gross_weight}
              onChange={(e) => updateItem(idx, { gross_weight: e.target.value })}
            />

            <input
              type="number"
              className="dash-input"
              placeholder="0"
              min="0"
              value={item.sacks_count}
              onChange={(e) => updateItem(idx, { sacks_count: e.target.value })}
            />

            <input
              type="number"
              className="dash-input"
              placeholder="0.000"
              step="0.001"
              min="0"
              value={item.deduction_weight}
              onChange={(e) => updateItem(idx, { deduction_weight: e.target.value })}
            />

            <span className="dash-computed">{netWeight(item).toFixed(3)}</span>

            <input
              type="number"
              className="dash-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={item.rate}
              onChange={(e) => updateItem(idx, { rate: e.target.value })}
            />

            <select
              className="dash-input"
              value={item.rate_timing}
              onChange={(e) => updateItem(idx, { rate_timing: e.target.value as RateTiming })}
            >
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>

            <span className="dash-computed">
              ₹{rowAmount(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>

            <button
              type="button"
              className="dash-remove-btn"
              onClick={() => removeItem(idx)}
              disabled={items.length === 1}
              aria-label="Remove row"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="dash-add-row-btn" onClick={addItem}>
        + Add metal
      </button>

      <div className="dash-total-row">
        <span>Total</span>
        <span className="dash-total-amount">
          ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <label className="dash-label" style={{ marginTop: "1.5rem" }}>
        Notes (optional)
        <textarea
          className="dash-input"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any remarks about this purchase…"
        />
      </label>

      {error && <p className="dash-error">{error}</p>}

      <div className="dash-form-actions">
        <button
          type="button"
          className="dash-btn dash-btn--outline"
          onClick={() => handleSubmit("draft")}
          disabled={saving}
        >
          Save as draft
        </button>
        <button
          type="button"
          className="dash-btn"
          onClick={() => handleSubmit("complete")}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save & complete"}
        </button>
      </div>
    </div>
  );
}
