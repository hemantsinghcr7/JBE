import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data, error } = await db.sales.list();

  if (error) {
    return (
      <div className="dash-page">
        <p className="dash-error">Failed to load sales: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Sales</h1>
        <Link href="/dashboard/sales/new" className="dash-btn">
          + New Sale
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="dash-empty">
          <p>No sales recorded yet.</p>
          <Link href="/dashboard/sales/new" className="dash-btn">
            Record first sale
          </Link>
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Buyer</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <td className="dash-table-date">{formatDate(s.sale_date)}</td>
                <td className="dash-table-name">{s.buyer?.name ?? "—"}</td>
                <td>
                  <span className={`dash-badge dash-badge--${s.status}`}>
                    {s.status}
                  </span>
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
