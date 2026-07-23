"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { MetalType } from "@/types/database";

interface Props {
  buyers: { id: string; name: string }[];
}

interface ItemRow {
  metal_type: MetalType;
  quantity: string;
  rate: string;
}

const EMPTY_ITEM: ItemRow = { metal_type: "Aluminium Cast", quantity: "", rate: "" };

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

export function NewSaleForm({ buyers }: Props) {
  const router = useRouter();
  const [buyerId, setBuyerId] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ ...EMPTY_ITEM }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function rowAmount(item: ItemRow) {
    return (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
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

  async function handleSubmit() {
    setError("");
    if (!buyerId) { setError("Please select a buyer."); return; }
    if (items.some((i) => !i.quantity || !i.rate)) {
      setError("All items need a quantity and rate.");
      return;
    }

    setSaving(true);
    try {
      const db = createDb(createSupabaseBrowser());
      const { data: sale, error: sErr } = await db.sales.insert({
        buyer_id: buyerId,
        sale_date: saleDate,
        status: "quoted",
        notes: notes || null,
      });

      if (sErr || !sale) throw sErr ?? new Error("Failed to create sale");

      const { error: iErr } = await db.saleItems.insertMany(
        items.map((item) => ({
          sale_id: sale.id,
          metal_type: item.metal_type,
          quantity: parseFloat(item.quantity),
          rate: parseFloat(item.rate),
        }))
      );

      if (iErr) throw iErr;

      router.push(`/dashboard/sales/${sale.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="dash-form-wrap">
      <div className="dash-form-row">
        <label className="dash-label">
          Buyer
          <select
            className="dash-input"
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            required
          >
            <option value="">Select buyer…</option>
            {buyers.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        <label className="dash-label">
          Date
          <input
            type="date"
            className="dash-input"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
          />
        </label>
      </div>

      <div className="dash-section-label">Metal items — quantity &amp; rate agreed on the call</div>

      <div className="dash-items-table">
        <div className="dash-sale-items-head">
          <span>Metal</span>
          <span>Quantity (kg)</span>
          <span>Rate (₹/kg)</span>
          <span>Amount (₹)</span>
          <span></span>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="dash-sale-items-row">
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
              placeholder="e.g. 10000 (10 tonnes)"
              step="0.001"
              min="0"
              value={item.quantity}
              onChange={(e) => updateItem(idx, { quantity: e.target.value })}
            />

            <input
              type="number"
              className="dash-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={item.rate}
              onChange={(e) => updateItem(idx, { rate: e.target.value })}
            />

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
          placeholder="Any remarks about this sale…"
        />
      </label>

      {error && <p className="dash-error">{error}</p>}

      <div className="dash-form-actions">
        <button
          type="button"
          className="dash-btn"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Quote"}
        </button>
      </div>
    </div>
  );
}
