import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { CATEGORY_ORDER, CATEGORY_COLORS, CATEGORY_SLUGS, groupStockByCategory } from "@/lib/metalCategory";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const db = createDb(await createSupabaseServerComponent());
  const { data: stock } = await db.stock.byMetal();

  const groups = groupStockByCategory(stock);
  const total = CATEGORY_ORDER.reduce((sum, cat) => sum + groups[cat].total, 0);

  return (
    <div className="dash-page">
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/dashboard" className="dash-back-link">← Overview</Link>
      </div>
      <div className="dash-page-header">
        <h1 className="dash-page-title">Stock on Hand</h1>
      </div>

      <p style={{ color: "var(--ink-50)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        {total.toLocaleString("en-IN")} kg total, received across all purchases. This is inbound stock
        only — dispatch/sales tracking is planned for a future phase. Click a category for the
        material-level breakdown.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {CATEGORY_ORDER.filter((cat) => groups[cat].total > 0).map((cat) => {
          const preview = groups[cat].materials.slice(0, 3).map((m) => m.name).join(" · ");
          return (
            <Link key={cat} href={`/dashboard/stock/${CATEGORY_SLUGS[cat]}`} className="dash-category-card">
              <div className="dash-category-card-head">
                <span className="dash-category-card-name" style={{ color: CATEGORY_COLORS[cat] }}>{cat}</span>
                <span className="dash-category-card-total">{groups[cat].total.toLocaleString("en-IN")} kg</span>
              </div>
              <div className="dash-category-card-preview">{preview}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
