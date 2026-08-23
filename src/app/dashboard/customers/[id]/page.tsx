import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { formatDate, formatDateLong } from "@/lib/formatDate";
import { DeleteCustomerButton } from "@/components/dashboard/DeleteCustomerButton";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createDb(await createSupabaseServerComponent());

  const [{ data: customer, error }, { data: customerPurchases }, { data: summary }] = await Promise.all([
    db.customers.get(id),
    db.purchases.byCustomer(id),
    db.customers.summary(id),
  ]);

  if (error || !customer) notFound();

  const fmtKg = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });
  const fmtRupees = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard/customers" className="dash-back-link">← All Customers</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{customer.name}</h1>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link href={`/dashboard/customers/${customer.id}/edit`} className="dash-btn dash-btn--outline">
            Edit
          </Link>
          <Link href="/dashboard/purchases/new" className="dash-btn">
            + New Purchase
          </Link>
        </div>
      </div>

      <div className="dash-meta-row">
        <div className="dash-meta-item">
          <span className="dash-meta-label">Phone</span>
          <span className="dash-meta-value">{customer.phone ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">Address</span>
          <span className="dash-meta-value">{customer.address ?? "—"}</span>
        </div>
        <div className="dash-meta-item">
          <span className="dash-meta-label">Customer Since</span>
          <span className="dash-meta-value">{formatDateLong(customer.created_at)}</span>
        </div>
      </div>

      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Scrap Received</div>
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
          <span className="dash-stat-label">Total Purchase Value</span>
          <span className="dash-stat-value">₹{fmtRupees(summary.totalValue)}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Paid</span>
          <span className="dash-stat-value">₹{fmtRupees(summary.totalPaid)}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Outstanding</span>
          <span className={`dash-stat-value${summary.outstanding > 0 ? " dash-stat-value--red" : ""}`}>
            ₹{fmtRupees(summary.outstanding)}
          </span>
        </div>
      </div>

      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Purchase History</div>
      {customerPurchases.length === 0 ? (
        <p style={{ color: "var(--ink-50)", fontSize: "0.85rem" }}>No purchases recorded for this customer yet.</p>
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
            {customerPurchases.map((p) => (
              <tr key={p.id}>
                <td className="dash-table-date">{formatDate(p.purchase_date)}</td>
                <td>
                  <span className={`dash-badge dash-badge--${p.status}`}>{p.status}</span>
                </td>
                <td>
                  <Link href={`/dashboard/purchases/${p.id}`} className="dash-table-link">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="dash-detail-actions">
        <DeleteCustomerButton
          customerId={customer.id}
          customerName={customer.name}
          purchaseCount={customerPurchases.length}
        />
      </div>
    </div>
  );
}
