import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BuyerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createDb(await createSupabaseServerComponent());

  const [{ data: buyer, error }, { data: buyerSales }, { data: summary }] = await Promise.all([
    db.buyers.get(id),
    db.sales.byBuyer(id),
    db.buyers.summary(id),
  ]);

  if (error || !buyer) notFound();

  const fmtKg = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });
  const fmtRupees = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard/buyers" className="dash-back-link">← All Buyers</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{buyer.name}</h1>
        <Link href="/dashboard/sales/new" className="dash-btn">
          + New Sale
        </Link>
      </div>

      <div className="dash-meta-row">
        <div className="dash-meta-item">
          <span className="dash-meta-label">Phone</span>
          <span className="dash-meta-value">{buyer.phone ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">State</span>
          <span className="dash-meta-value">{buyer.state ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">GSTIN</span>
          <span className="dash-meta-value dash-mono">{buyer.gstin ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">Address</span>
          <span className="dash-meta-value">{buyer.address ?? "—"}</span>
        </div>
      </div>

      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Scrap Sold</div>
      <div className="dash-stat-grid">
        <div className="dash-stat-card">
          <span className="dash-stat-label">This Week</span>
          <span className="dash-stat-value">{fmtKg(summary.weekKg)}<small style={{ fontSize: "0.9rem" }}> kg</small></span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">This Month</span>
          <span className="dash-stat-value">{fmtKg(summary.monthKg)}<small style={{ fontSize: "0.9rem" }}> kg</small></span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">All Time</span>
          <span className="dash-stat-value">{fmtKg(summary.allTimeKg)}<small style={{ fontSize: "0.9rem" }}> kg</small></span>
        </div>
      </div>

      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Account</div>
      <div className="dash-stat-grid">
        <div className="dash-stat-card">
          <span className="dash-stat-label">Total Sale Value</span>
          <span className="dash-stat-value">₹{fmtRupees(summary.totalValue)}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Collected</span>
          <span className="dash-stat-value">₹{fmtRupees(summary.totalPaid)}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Outstanding (Receivable)</span>
          <span className={`dash-stat-value${summary.outstanding > 0 ? " dash-stat-value--red" : ""}`}>
            ₹{fmtRupees(summary.outstanding)}
          </span>
        </div>
      </div>

      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Sale History</div>
      {buyerSales.length === 0 ? (
        <p style={{ color: "var(--ink-50)", fontSize: "0.85rem" }}>No sales recorded for this buyer yet.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {buyerSales.map((s) => (
              <tr key={s.id}>
                <td className="dash-table-date">{formatDate(s.sale_date)}</td>
                <td>
                  <span className={`dash-badge dash-badge--${s.status}`}>{s.status}</span>
                </td>
                <td>
                  <Link href={`/dashboard/sales/${s.id}`} className="dash-table-link">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
