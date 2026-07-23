"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDb } from "@/lib/db";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { SaleStatus } from "@/types/database";

const NEXT_STATUS: Record<Exclude<SaleStatus, "paid">, SaleStatus> = {
  quoted: "dispatched",
  dispatched: "delivered",
  delivered: "paid",
};

const ACTION_LABEL: Record<Exclude<SaleStatus, "paid">, string> = {
  quoted: "Mark Dispatched",
  dispatched: "Mark Delivered",
  delivered: "Mark Paid",
};

const CONFIRM_COPY: Record<Exclude<SaleStatus, "paid">, string> = {
  quoted: "Confirm the truck has left with this load?",
  dispatched: "Confirm the buyer has received this load?",
  delivered: "Confirm this sale is fully paid?",
};

export function AdvanceSaleStatusButton({ saleId, status }: { saleId: string; status: SaleStatus }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");

  if (status === "paid") return null;

  const nextStatus = NEXT_STATUS[status];
  const needsDispatchDetails = status === "quoted";

  async function handleConfirm() {
    if (needsDispatchDetails && !vehicleNumber.trim()) {
      setError("Vehicle number is required before dispatch.");
      return;
    }
    setLoading(true);
    const db = createDb(createSupabaseBrowser());
    const { error: err } = await db.sales.updateStatus(
      saleId,
      nextStatus,
      needsDispatchDetails
        ? { vehicle_number: vehicleNumber.trim(), driver_name: driverName.trim() || null }
        : undefined
    );
    if (err) {
      setError(`Failed to update status: ${err.message}`);
      setLoading(false);
      setConfirming(false);
      return;
    }
    router.refresh();
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 480 }}>
        {needsDispatchDetails && (
          <div className="dash-form-row">
            <label className="dash-label">
              Vehicle Number <span style={{ color: "var(--red)" }}>*</span>
              <input
                className="dash-input"
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="MH15 AB 1234"
              />
            </label>
            <label className="dash-label">
              Driver Name
              <input
                className="dash-input"
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.78rem", color: "var(--ink-70)" }}>
            {CONFIRM_COPY[status]}
          </span>
          <button className="dash-btn" onClick={handleConfirm} disabled={loading}>
            {loading ? "Saving…" : `Yes, ${ACTION_LABEL[status]}`}
          </button>
          <button className="dash-btn dash-btn--outline" onClick={() => setConfirming(false)} disabled={loading}>
            Cancel
          </button>
        </div>
        {error && <span className="dash-error">{error}</span>}
      </div>
    );
  }

  return (
    <button className="dash-btn" onClick={() => setConfirming(true)}>
      {ACTION_LABEL[status]}
    </button>
  );
}
