"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { errorMessage } from "@/lib/errorMessage";
import type { CustomerRow } from "@/types/database";

export function EditCustomerForm({ customer }: { customer: CustomerRow }) {
  const router = useRouter();
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [address, setAddress] = useState(customer.address ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required."); return; }

    setSaving(true);
    const db = createDb(createSupabaseBrowser());
    const { error: err } = await db.customers.update(customer.id, {
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
    });

    if (err) {
      setError(errorMessage(err));
      setSaving(false);
      return;
    }
    router.push(`/dashboard/customers/${customer.id}`);
    router.refresh();
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
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
