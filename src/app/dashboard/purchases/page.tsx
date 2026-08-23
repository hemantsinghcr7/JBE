import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data, error } = await db.purchases.list();

  if (error) {
    return (
      <div className="dash-page">
        <p className="dash-error">Failed to load purchases: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Purchases</h1>
        <Link href="/dashboard/purchases/new" className="dash-btn">
          + New Purchase
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="dash-empty">
          <p>No purchases recorded yet.</p>
          <Link href="/dashboard/purchases/new" className="dash-btn">
            Record first purchase
          </Link>
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td className="dash-table-date">{formatDate(p.purchase_date)}</td>
                <td className="dash-table-name">{p.customer?.name ?? "—"}</td>
                <td>
                  <span className={`dash-badge dash-badge--${p.status}`}>
                    {p.status}
                  </span>
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
