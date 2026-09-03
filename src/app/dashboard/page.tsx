import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { CATEGORY_ORDER, CATEGORY_COLORS, CATEGORY_SLUGS, groupStockByCategory } from "@/lib/metalCategory";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtRupees(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

async function getOverviewData() {
  const db = createDb(await createSupabaseServerComponent());
  const [financials, stock, customers, recent] = await Promise.all([
    db.purchases.financialSummary(),
    db.stock.byMetal(),
    db.customers.list(),
    db.purchases.recent(5),
  ]);
  return {
    financials: financials.data,
    stock: stock.data,
    customerCount: customers.data.length,
    recent: recent.data,
  };
}

export default async function DashboardPage() {
  const { financials, stock, customerCount, recent } = await getOverviewData();

  const groups = groupStockByCategory(stock);
  const totalStock = CATEGORY_ORDER.reduce((sum, cat) => sum + groups[cat].total, 0);

  return (
    <div className="dash-page">
      <div className="dash-page-header">
        <h1 className="dash-page-title">Overview</h1>
        <Link href="/dashboard/purchases/new" className="dash-btn">
          + New Purchase
        </Link>
      </div>

      <div className="dash-position-grid">
        {/* ── Cash position ── */}
        <div className="dash-position-col">
          <div className="dash-position-col-label">Cash Position</div>
          <div className="dash-ledger-primary">
            <span className="dash-ledger-label">Payables — Owed to Customers</span>
            <span className="dash-ledger-value" style={{ color: financials.outstanding > 0 ? "var(--red)" : "var(--ink)" }}>
              ₹{fmtRupees(financials.outstanding)}
            </span>
          </div>
          <div className="dash-ledger-row">
            <span>Paid Today</span>
            <span>₹{fmtRupees(financials.paidToday)}</span>
          </div>
          <div className="dash-ledger-row">
            <span>Purchase Value — This Week</span>
            <span>₹{fmtRupees(financials.valueThisWeek)}</span>
          </div>
          <div className="dash-ledger-row">
            <span>Avg. Purchase Size</span>
            <span>₹{fmtRupees(financials.avgPurchaseSize)}</span>
          </div>
        </div>

        {/* ── Stock position ── */}
        <div className="dash-position-col">
          <div className="dash-position-col-label">
            Stock Position <small>{totalStock.toLocaleString("en-IN")} kg received</small>
          </div>
          {totalStock === 0 ? (
            <p style={{ color: "var(--ink-50)", fontSize: "0.85rem" }}>No stock data yet.</p>
          ) : (
            <div className="dash-category-bars">
              {CATEGORY_ORDER.filter((cat) => groups[cat].total > 0).map((cat) => {
                const pct = totalStock > 0 ? (groups[cat].total / totalStock) * 100 : 0;
                return (
                  <Link key={cat} href={`/dashboard/stock/${CATEGORY_SLUGS[cat]}`} className="dash-category-bar-row">
                    <span className="dash-category-bar-name">{cat}</span>
                    <div className="dash-category-bar-track">
                      <div className="dash-category-bar-fill" style={{ width: `${pct.toFixed(1)}%`, background: CATEGORY_COLORS[cat] }} />
                    </div>
                    <span className="dash-category-bar-val">{groups[cat].total.toLocaleString("en-IN")} kg</span>
                  </Link>
                );
              })}
            </div>
          )}
          <div className="dash-position-note">{customerCount} customer{customerCount === 1 ? "" : "s"} on record</div>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div className="dash-section-label">Recent Activity</div>
      {recent.length === 0 ? (
        <p style={{ color: "var(--ink-50)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>No purchases recorded yet.</p>
      ) : (
        <table className="dash-table" style={{ marginBottom: "1.75rem" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => {
              const total = (p.items ?? []).reduce((s, i) => s + (i.amount ?? 0), 0);
              return (
                <tr key={p.id}>
                  <td className="dash-table-date">{formatDate(p.purchase_date)}</td>
                  <td className="dash-table-name">{p.customer?.name ?? "—"}</td>
                  <td className="dash-table-num">₹{fmtRupees(total)}</td>
                  <td>
                    <span className={`dash-badge dash-badge--${p.status}`}>{p.status}</span>
                  </td>
                  <td>
                    <Link href={`/dashboard/purchases/${p.id}`} className="dash-table-link">View →</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ── Quick actions ── */}
      <div className="dash-section-label">Quick Actions</div>
      <div className="dash-quick-links">
        <Link href="/dashboard/purchases/new" className="dash-quick-link">
          <span className="dash-quick-icon" aria-hidden="true">↓</span>
          <span>Record a purchase</span>
        </Link>
        <Link href="/dashboard/purchases" className="dash-quick-link">
          <span className="dash-quick-icon" aria-hidden="true">☰</span>
          <span>View all purchases</span>
        </Link>
        <Link href="/dashboard/customers" className="dash-quick-link">
          <span className="dash-quick-icon" aria-hidden="true">◆</span>
          <span>Manage customers</span>
        </Link>
      </div>
    </div>
  );
}
