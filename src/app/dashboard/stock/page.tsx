import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import Link from "next/link";

export const dynamic = "force-dynamic";

function metalColor(type: string): string {
  if (type.startsWith("Aluminium") || type.startsWith("Radiators – Aluminium")) return "#a8c0e8";
  if (type.startsWith("Copper") || type.startsWith("Insulated Copper")) return "#c87941";
  if (type.startsWith("Brass") || type.startsWith("Radiator – Brass")) return "#c9a84c";
  return "#8a9bb0";
}

export default async function StockPage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data: stock } = await db.stock.byMetal();

  const entries = Object.entries(stock).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard" className="dash-back-link">← Overview</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">Stock on Hand</h1>
      </div>

      <p style={{ color: "var(--ink-50)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Total received weight by material, aggregated from all recorded purchases. This is inbound
        stock only — dispatch/sales tracking is planned for a future phase.
      </p>

      {entries.length === 0 ? (
        <p style={{ color: "var(--ink-50)", fontSize: "0.85rem" }}>No stock data yet.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Material</th>
              <th style={{ textAlign: "right" }}>Net Weight (kg)</th>
              <th style={{ textAlign: "right" }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([metal, kg]) => {
              const pct = total > 0 ? (kg / total) * 100 : 0;
              return (
                <tr key={metal}>
                  <td>
                    <span style={{ color: metalColor(metal), fontWeight: 700, marginRight: "0.5rem" }}>■</span>
                    {metal}
                  </td>
                  <td style={{ textAlign: "right" }} className="dash-mono">{kg.toLocaleString("en-IN")}</td>
                  <td style={{ textAlign: "right" }} className="dash-mono">{pct.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="dash-table-total-row">
              <td style={{ fontFamily: "var(--f-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-50)" }}>
                Total
              </td>
              <td style={{ textAlign: "right" }} className="dash-mono">
                <strong>{total.toLocaleString("en-IN")} kg</strong>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
