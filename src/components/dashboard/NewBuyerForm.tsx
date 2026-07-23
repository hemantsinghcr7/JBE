"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function NewBuyerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [gstin, setGstin] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required."); return; }

    setSaving(true);
    const db = createDb(createSupabaseBrowser());
    const { error: err } = await db.buyers.insert({
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
      state: state.trim() || null,
      gstin: gstin.trim() || null,
    });

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/dashboard/buyers");
    }
  }

  return (
    <form className="dash-form-wrap" onSubmit={handleSubmit}>
      <label className="dash-label">
        Name <span style={{ color: "var(--red)" }}>*</span>
        <input
          className="dash-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Buyer / company name"
          required
        />
      </label>

      <div className="dash-form-row">
        <label className="dash-label">
          Phone
          <input
            className="dash-input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="dash-label">
          State
          <input
            className="dash-input"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Maharashtra / Gujarat / ..."
          />
        </label>
      </div>

      <label className="dash-label">
        GSTIN
        <input
          className="dash-input"
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value.toUpperCase())}
          placeholder="27ADGPC2741P1ZE"
        />
      </label>

      <label className="dash-label">
        Address
        <textarea
          className="dash-input"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Factory / yard address"
        />
      </label>

      {error && <p className="dash-error">{error}</p>}

      <div className="dash-form-actions">
        <button type="button" className="dash-btn dash-btn--outline" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className="dash-btn" disabled={saving}>
          {saving ? "Saving…" : "Add Buyer"}
        </button>
      </div>
    </form>
  );
}
