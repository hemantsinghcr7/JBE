import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data, error } = await db.customers.list();

  if (error) {
    return (
      <div className="dash-page">
        <p className="dash-error">Failed to load customers: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Customers</h1>
        <Link href="/dashboard/customers/new" className="dash-btn">
          + Add Customer
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="dash-empty">
          <p>No customers yet.</p>
          <Link href="/dashboard/customers/new" className="dash-btn">
            Add your first customer
          </Link>
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id}>
                <td className="dash-table-name">{c.name}</td>
                <td>{c.phone ?? "—"}</td>
                <td>{c.address ?? "—"}</td>
                <td>
                  <span style={{ display: "flex", gap: "0.9rem", justifyContent: "flex-end" }}>
                    <Link href={`/dashboard/customers/${c.id}/edit`} className="dash-table-link">
                      Edit
                    </Link>
                    <Link href={`/dashboard/customers/${c.id}`} className="dash-table-link">
                      View →
                    </Link>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
