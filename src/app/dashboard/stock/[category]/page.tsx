import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { categorySlugToName, categoryOf, CATEGORY_COLORS } from "@/lib/metalCategory";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StockCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categorySlugToName(slug);
  if (!category) notFound();

  const db = createDb(await createSupabaseServerComponent());
  const { data: stock } = await db.stock.byMetal();

  const materials = Object.entries(stock)
    .filter(([metal]) => categoryOf(metal) === category)
    .sort((a, b) => b[1] - a[1]);
  const total = materials.reduce((sum, [, kg]) => sum + kg, 0);

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard/stock" className="dash-back-link">← All Stock</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title" style={{ color: CATEGORY_COLORS[category] }}>{category}</h1>
      </div>

      {materials.length === 0 ? (
        <p style={{ color: "var(--ink-50)", fontSize: "0.85rem" }}>No {category.toLowerCase()} stock on hand.</p>
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
            {materials.map(([metal, kg]) => {
              const pct = total > 0 ? (kg / total) * 100 : 0;
              return (
                <tr key={metal}>
                  <td>{metal}</td>
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
