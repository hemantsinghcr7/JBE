import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecordPaymentForm } from "@/components/dashboard/RecordPaymentForm";
import { MarkCompleteButton } from "@/components/dashboard/MarkCompleteButton";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function PurchaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createDb(await createSupabaseServerComponent());
  const { data: purchase, error } = await db.purchases.get(id);

  if (error || !purchase) notFound();

  const totalAmount = purchase.items.reduce((s, i) => s + (i.amount ?? 0), 0);
  const totalPaid   = purchase.payments.reduce((s, p) => s + p.amount, 0);
  const balance     = totalAmount - totalPaid;

  return (
    <div className="dash-page">
      {/* ── Back + header ── */}
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard/purchases" className="dash-back-link">← All Purchases</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{purchase.customer?.name ?? "Unknown Customer"}</h1>
        <span className={`dash-badge dash-badge--${purchase.status}`} style={{ fontSize: "0.8rem", padding: "0.3em 0.9em" }}>
          {purchase.status === "draft" ? "Pending Review" : "Complete"}
        </span>
      </div>

      {/* ── Meta row ── */}
      <div className="dash-meta-row">
        <div className="dash-meta-item">
          <span className="dash-meta-label">Date</span>
          <span className="dash-meta-value">{purchase.purchase_date}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">Phone</span>
          <span className="dash-meta-value">{purchase.customer?.phone ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">Address</span>
          <span className="dash-meta-value">{purchase.customer?.address ?? "—"}</span>
        </div>
        {purchase.notes && (
          <div className="dash-meta-item">
            <span className="dash-meta-label">Notes</span>
            <span className="dash-meta-value">{purchase.notes}</span>
          </div>
        )}
      </div>

      {/* ── Items table ── */}
      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Metal Items</div>
      <div style={{ overflowX: "auto" }}>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Metal</th>
              <th style={{ textAlign: "right" }}>Gross Wt (kg)</th>
              <th style={{ textAlign: "right" }}>Sacks</th>
              <th style={{ textAlign: "right" }}>Deduction (kg)</th>
              <th style={{ textAlign: "right" }}>Net Wt (kg)</th>
              <th style={{ textAlign: "right" }}>Rate (₹/kg)</th>
              <th>Timing</th>
              <th style={{ textAlign: "right" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {purchase.items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.metal_type}</strong></td>
                <td style={{ textAlign: "right" }} className="dash-mono">{fmt(item.gross_weight)}</td>
                <td style={{ textAlign: "right" }} className="dash-mono">{item.sacks_count ?? 0}</td>
                <td style={{ textAlign: "right" }} className="dash-mono">{fmt(item.deduction_weight ?? 0)}</td>
                <td style={{ textAlign: "right" }} className="dash-mono"><strong>{fmt(item.net_weight ?? 0)}</strong></td>
                <td style={{ textAlign: "right" }} className="dash-mono">{fmt(item.rate)}</td>
                <td className="dash-mono" style={{ fontSize: "0.75rem", color: "var(--ink-50)" }}>
                  {item.rate_timing === "before" ? "Before wt." : "After wt."}
                </td>
                <td style={{ textAlign: "right" }} className="dash-mono"><strong>₹{fmt(item.amount ?? 0)}</strong></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="dash-table-total-row">
              <td colSpan={7} style={{ textAlign: "right", fontFamily: "var(--f-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-50)", paddingRight: "1rem" }}>
                Total Payable
              </td>
              <td style={{ textAlign: "right" }} className="dash-mono">
                <strong style={{ fontSize: "1.1rem" }}>₹{fmt(totalAmount)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Payment section ── */}
      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Payments</div>
      <div className="dash-payment-wrap">
        {purchase.payments.length === 0 ? (
          <p style={{ color: "var(--ink-50)", fontSize: "0.875rem" }}>No payments recorded yet.</p>
        ) : (
          <table className="dash-table" style={{ maxWidth: 600, marginBottom: "1rem" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Amount (₹)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {purchase.payments.map((pay) => (
                <tr key={pay.id}>
                  <td className="dash-mono">{pay.payment_date}</td>
                  <td style={{ textTransform: "capitalize" }}>{pay.payment_type}</td>
                  <td style={{ textAlign: "right" }} className="dash-mono">₹{fmt(pay.amount)}</td>
                  <td style={{ color: "var(--ink-50)", fontSize: "0.8rem" }}>{pay.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="dash-balance-row">
          <div className="dash-balance-item">
            <span className="dash-meta-label">Total Payable</span>
            <span className="dash-balance-value">₹{fmt(totalAmount)}</span>
          </div>
          <div className="dash-balance-item">
            <span className="dash-meta-label">Paid</span>
            <span className="dash-balance-value" style={{ color: "var(--ink-50)" }}>₹{fmt(totalPaid)}</span>
          </div>
          <div className="dash-balance-item">
            <span className="dash-meta-label">Balance Due</span>
            <span className="dash-balance-value" style={{ color: balance > 0 ? "var(--red)" : "green" }}>
              ₹{fmt(balance)}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "1.25rem" }}>
          <RecordPaymentForm purchaseId={purchase.id} balanceDue={balance} />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="dash-detail-actions">
        {purchase.status === "draft" && <MarkCompleteButton purchaseId={purchase.id} />}
        <Link href={`/dashboard/purchases/${purchase.id}/print`} className="dash-btn dash-btn--outline">
          Print Receipt →
        </Link>
        <Link href="/dashboard/purchases" className="dash-btn dash-btn--outline">
          ← Back
        </Link>
      </div>
    </div>
  );
}
