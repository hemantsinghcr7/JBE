import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BuyersPage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data, error } = await db.buyers.list();

  if (error) {
    return (
      <div className="dash-page">
        <p className="dash-error">Failed to load buyers: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Buyers</h1>
        <Link href="/dashboard/buyers/new" className="dash-btn">
          + Add Buyer
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="dash-empty">
          <p>No buyers yet.</p>
          <Link href="/dashboard/buyers/new" className="dash-btn">
            Add your first buyer
          </Link>
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>State</th>
              <th>GSTIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.id}>
                <td className="dash-table-name">{b.name}</td>
                <td>{b.phone ?? "—"}</td>
                <td>{b.state ?? "—"}</td>
                <td className="dash-mono">{b.gstin ?? "—"}</td>
                <td>
                  <Link href={`/dashboard/buyers/${b.id}`} className="dash-table-link">
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
