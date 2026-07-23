"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function NewCustomerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required."); return; }

    setSaving(true);
    const db = createDb(createSupabaseBrowser());
    const { error: err } = await db.customers.insert({
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
    });

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/dashboard/customers");
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
          placeholder="Customer / company name"
          required
        />
      </label>

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
          {saving ? "Saving…" : "Add Customer"}
        </button>
      </div>
    </form>
  );
}
