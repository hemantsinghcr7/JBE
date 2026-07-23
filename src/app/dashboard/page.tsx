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

async function getStats() {
  const db = createDb(await createSupabaseServerComponent());
  const [p, c, s] = await Promise.all([
    db.purchases.stats(),
    db.customers.list(),
    db.stock.byMetal(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const rows = p.data;
  return {
    total: rows.length,
    pendingReview: rows.filter((r) => r.status === "draft").length,
    todayCount: rows.filter((r) => r.purchase_date === today).length,
    customerCount: c.data.length,
    stock: s.data,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const stockEntries = Object.entries(stats.stock).sort((a, b) => a[0].localeCompare(b[0]));
  const totalStock = stockEntries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Overview</h1>
        <Link href="/dashboard/purchases/new" className="dash-btn">
          + New Purchase
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="dash-stat-grid">
        <div className="dash-stat-card">
          <span className="dash-stat-label">Today</span>
          <span className="dash-stat-value">{stats.todayCount}</span>
          <span className="dash-stat-sub">purchases recorded</span>
        </div>
        <Link href="/dashboard/purchases?status=draft" className="dash-stat-card dash-stat-card--link">
          <span className="dash-stat-label">Pending Review</span>
          <span className={`dash-stat-value${stats.pendingReview > 0 ? " dash-stat-value--red" : ""}`}>
            {stats.pendingReview}
          </span>
          <span className="dash-stat-sub">awaiting customer sign-off</span>
        </Link>
        <div className="dash-stat-card">
          <span className="dash-stat-label">All Time</span>
          <span className="dash-stat-value">{stats.total}</span>
          <span className="dash-stat-sub">purchases</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Customers</span>
          <span className="dash-stat-value">{stats.customerCount}</span>
          <span className="dash-stat-sub">on record</span>
        </div>
      </div>

      {/* ── Stock levels ── */}
      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Stock on Hand</div>
      {stockEntries.length === 0 ? (
        <p style={{ color: "var(--ink-50)", fontSize: "0.85rem" }}>No stock data yet.</p>
      ) : (
        <div className="dash-stock-grid">
          {stockEntries.map(([metal, kg]) => (
            <Link key={metal} href="/dashboard/stock" className="dash-stock-card">
              <span className="dash-stock-symbol" style={{ color: metalColor(metal), fontSize: "0.7rem" }}>{metal}</span>
              <span className="dash-stock-weight">{kg.toLocaleString("en-IN")} kg</span>
            </Link>
          ))}
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Quick Actions</div>
      <div className="dash-quick-links">
        <Link href="/dashboard/purchases/new" className="dash-quick-link">
          <span className="dash-quick-icon">+</span>
          <span>Record a purchase</span>
        </Link>
        <Link href="/dashboard/purchases" className="dash-quick-link">
          <span className="dash-quick-icon">☰</span>
          <span>View all purchases</span>
        </Link>
        <Link href="/dashboard/customers" className="dash-quick-link">
          <span className="dash-quick-icon">👤</span>
          <span>Manage customers</span>
        </Link>
      </div>

      {/* ── Stock chart ── */}
      {stockEntries.length > 0 && (
        <>
          <div className="dash-section-label" style={{ marginTop: "1.75rem" }}>Stock Breakdown</div>
          <div className="dash-chart-wrap">
            {stockEntries.map(([metal, kg]) => {
              const pct = totalStock > 0 ? (kg / totalStock) * 100 : 0;
              return (
                <div key={metal} className="dash-chart-row">
                  <span className="dash-chart-label">{metal}</span>
                  <div className="dash-chart-track">
                    <div className="dash-chart-bar" style={{ width: `${pct.toFixed(1)}%`, background: metalColor(metal) }} />
                  </div>
                  <span className="dash-chart-pct">{pct.toFixed(0)}%</span>
                  <span className="dash-chart-val">{kg.toLocaleString("en-IN")} kg</span>
                </div>
              );
            })}
            <p className="dash-chart-note">
              Total on hand: <b>{totalStock.toLocaleString("en-IN")} kg</b> across all metals
            </p>
          </div>
        </>
      )}
    </div>
  );
}
