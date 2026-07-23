import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createDb(await createSupabaseServerComponent());

  const [{ data: customer, error }, { data: customerPurchases }] = await Promise.all([
    db.customers.get(id),
    db.purchases.byCustomer(id),
  ]);

  if (error || !customer) notFound();

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard/customers" className="dash-back-link">← All Customers</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{customer.name}</h1>
        <Link href="/dashboard/purchases/new" className="dash-btn">
          + New Purchase
        </Link>
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
          <span className="dash-meta-value">
            {new Date(customer.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
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
                <td className="dash-mono">{p.purchase_date}</td>
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
    </div>
  );
}
