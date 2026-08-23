import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecordSalePaymentForm } from "@/components/dashboard/RecordSalePaymentForm";
import { AdvanceSaleStatusButton } from "@/components/dashboard/AdvanceSaleStatusButton";
import { SaleComplianceForm } from "@/components/dashboard/SaleComplianceForm";
import { formatDateLong } from "@/lib/formatDate";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STATUS_LABELS: Record<string, string> = {
  quoted: "Quoted",
  dispatched: "Dispatched",
  delivered: "Delivered",
  paid: "Paid",
};

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createDb(await createSupabaseServerComponent());
  const { data: sale, error } = await db.sales.get(id);

  if (error || !sale) notFound();

  const totalAmount = sale.items.reduce((s, i) => s + (i.amount ?? 0), 0);
  const totalPaid = sale.payments.reduce((s, p) => s + p.amount, 0);
  const balance = totalAmount - totalPaid;

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard/sales" className="dash-back-link">← All Sales</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{sale.buyer?.name ?? "Unknown Buyer"}</h1>
        <span className={`dash-badge dash-badge--${sale.status}`} style={{ fontSize: "0.8rem", padding: "0.3em 0.9em" }}>
          {STATUS_LABELS[sale.status] ?? sale.status}
        </span>
      </div>

      <div className="dash-meta-row">
        <div className="dash-meta-item">
          <span className="dash-meta-label">Date</span>
          <span className="dash-meta-value">{formatDateLong(sale.sale_date)}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">Phone</span>
          <span className="dash-meta-value">{sale.buyer?.phone ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">State</span>
          <span className="dash-meta-value">{sale.buyer?.state ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">GSTIN</span>
          <span className="dash-meta-value dash-mono">{sale.buyer?.gstin ?? "—"}</span>
        </div>
        {sale.vehicle_number && (
          <div className="dash-meta-item">
            <span className="dash-meta-label">Vehicle</span>
            <span className="dash-meta-value dash-mono">{sale.vehicle_number}</span>
          </div>
        )}
        {sale.driver_name && (
          <div className="dash-meta-item">
            <span className="dash-meta-label">Driver</span>
            <span className="dash-meta-value">{sale.driver_name}</span>
          </div>
        )}
        {sale.notes && (
          <div className="dash-meta-item">
            <span className="dash-meta-label">Notes</span>
            <span className="dash-meta-value">{sale.notes}</span>
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
              <th style={{ textAlign: "right" }}>Quantity (kg)</th>
              <th style={{ textAlign: "right" }}>Rate (₹/kg)</th>
              <th style={{ textAlign: "right" }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.metal_type}</strong></td>
                <td style={{ textAlign: "right" }} className="dash-mono">{fmt(item.quantity)}</td>
                <td style={{ textAlign: "right" }} className="dash-mono">{fmt(item.rate)}</td>
                <td style={{ textAlign: "right" }} className="dash-mono"><strong>₹{fmt(item.amount ?? 0)}</strong></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="dash-table-total-row">
              <td colSpan={3} style={{ textAlign: "right", fontFamily: "var(--f-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-50)", paddingRight: "1rem" }}>
                Total Payable
              </td>
              <td style={{ textAlign: "right" }} className="dash-mono">
                <strong style={{ fontSize: "1.1rem" }}>₹{fmt(totalAmount)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Compliance ── */}
      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Compliance Reference</div>
      <div className="dash-payment-wrap">
        <SaleComplianceForm
          saleId={sale.id}
          invoiceNumber={sale.invoice_number}
          ewayBillNumber={sale.eway_bill_number}
        />
      </div>

      {/* ── Payment section ── */}
      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Payments</div>
      <div className="dash-payment-wrap">
        {sale.payments.length === 0 ? (
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
              {sale.payments.map((pay) => (
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
            <span className="dash-meta-label">Collected</span>
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
          <RecordSalePaymentForm saleId={sale.id} balanceDue={balance} />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="dash-detail-actions">
        <AdvanceSaleStatusButton saleId={sale.id} status={sale.status} />
        <Link href={`/dashboard/sales/${sale.id}/print`} className="dash-btn dash-btn--outline">
          Print Invoice →
        </Link>
        <Link href="/dashboard/sales" className="dash-btn dash-btn--outline">
          ← Back
        </Link>
      </div>
    </div>
  );
}
