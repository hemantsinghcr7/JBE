import { createDb } from "@/lib/db";
import { createSupabaseServerComponent } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { toWords } from "@/lib/toWords";
import { PrintButton } from "@/components/dashboard/PrintButton";
import type { PurchaseDetail } from "@/types/database";
import "@/app/dashboard/receipt-print.css";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function fmtAmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Short voucher reference from purchase date + last 6 chars of ID
function voucherNo(id: string, date: string) {
  const d = date.replace(/-/g, "").slice(2); // e.g. 260722
  return `PV-${d}-${id.slice(-6).toUpperCase()}`;
}

// One printable copy. Rendered twice per sheet — ORIGINAL for the
// customer, DUPLICATE for the file — so it must stay compact enough
// to fit half a landscape A4.
function VoucherCopy({
  purchase,
  copyLabel,
  voucher,
  totalAmount,
  totalPaid,
  balance,
}: {
  purchase: PurchaseDetail;
  copyLabel: string;
  voucher: string;
  totalAmount: number;
  totalPaid: number;
  balance: number;
}) {
  return (
    <div className="receipt-copy">
      <span className="receipt-copy-label">{copyLabel}</span>

      {/* Letterhead */}
      <div className="receipt-letterhead">
        <div className="receipt-logo-block">
          <div className="receipt-logo-tile">JBE</div>
          <div>
            <div className="receipt-company-name">Jai Bhawani Enterprises</div>
            <div className="receipt-company-sub">
              M-61, MIDC Ambad, Nashik 422010<br />
              Ph: +91 80438 37022
            </div>
          </div>
        </div>
        <div className="receipt-gst-block">
          <strong>GST</strong><br />
          27ADGPC2741P1ZE<br />
          <strong>Est.</strong> 1998
        </div>
      </div>

      {/* Title */}
      <div className="receipt-title-band">
        <div className="receipt-title">Purchase Voucher</div>
      </div>

      {/* Meta */}
      <div className="receipt-meta-grid">
        <div className="receipt-meta-item">
          <span className="receipt-meta-key">Voucher No.</span>
          <span className="receipt-meta-val">{voucher}</span>
        </div>
        <div className="receipt-meta-item">
          <span className="receipt-meta-key">Date</span>
          <span className="receipt-meta-val">
            {new Date(purchase.purchase_date).toLocaleDateString("en-IN", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </span>
        </div>
        <div className="receipt-meta-item">
          <span className="receipt-meta-key">Party Name</span>
          <span className="receipt-meta-val">{purchase.customer?.name ?? "—"}</span>
        </div>
        <div className="receipt-meta-item">
          <span className="receipt-meta-key">Mobile</span>
          <span className="receipt-meta-val">{purchase.customer?.phone ?? "—"}</span>
        </div>
        {purchase.customer?.address && (
          <div className="receipt-meta-item" style={{ gridColumn: "1 / -1" }}>
            <span className="receipt-meta-key">Address</span>
            <span className="receipt-meta-val">{purchase.customer.address}</span>
          </div>
        )}
      </div>

      {/* Items table */}
      <table className="receipt-table">
        <colgroup>
          <col style={{ width: "21%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>Material</th>
            <th>Gross</th>
            <th>Sacks</th>
            <th>Ded.</th>
            <th>Net Wt</th>
            <th>Rate</th>
            <th>Timing</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {purchase.items.map((item) => (
            <tr key={item.id}>
              <td>{item.metal_type}</td>
              <td>{fmt(item.gross_weight)}</td>
              <td style={{ textAlign: "center" }}>{item.sacks_count ?? 0}</td>
              <td>{fmt(item.deduction_weight ?? 0)}</td>
              <td style={{ fontWeight: 700 }}>{fmt(item.net_weight ?? 0)}</td>
              <td>{fmtAmt(item.rate)}</td>
              <td style={{ textAlign: "center" }}>
                {item.rate_timing === "before" ? "Before" : "After"}
              </td>
              <td style={{ fontWeight: 700 }}>{fmtAmt(item.amount ?? 0)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7} style={{ textAlign: "right", fontFamily: "var(--f-mono)", fontSize: "7px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Total Payable
            </td>
            <td style={{ fontWeight: 800, fontSize: "10px" }}>₹{fmtAmt(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Amount in words */}
      <div className="receipt-words-row">
        <span className="receipt-words-label">In Words:</span>
        <em>{toWords(totalAmount)}</em>
      </div>

      {/* Payment summary */}
      <div className="receipt-payment-section">
        <div className="receipt-payment-header">Payment Details</div>
        {purchase.payments.length === 0 ? (
          <div className="receipt-payment-row" style={{ color: "#999" }}>
            <span>No payment recorded</span>
            <span>—</span>
          </div>
        ) : (
          purchase.payments.map((pay) => (
            <div key={pay.id} className="receipt-payment-row">
              <span style={{ textTransform: "capitalize" }}>
                {pay.payment_type} — {new Date(pay.payment_date).toLocaleDateString("en-IN")}
                {pay.notes ? ` (${pay.notes})` : ""}
              </span>
              <span>₹{fmtAmt(pay.amount)}</span>
            </div>
          ))
        )}
        <div className="receipt-payment-total">
          <span>Balance Due</span>
          <span style={{ color: balance > 0 ? "#D32027" : "#1a6b1a" }}>₹{fmtAmt(balance)}</span>
        </div>
      </div>

      {/* Notes */}
      {purchase.notes && (
        <div className="receipt-notes">
          <strong>Remarks:</strong> {purchase.notes}
        </div>
      )}

      {/* Signatures */}
      <div className="receipt-sig-row">
        <div className="receipt-sig-block">
          <div className="receipt-sig-line" />
          <div className="receipt-sig-label">Party / Receiver</div>
        </div>
        <div className="receipt-sig-block">
          <div className="receipt-sig-line" />
          <div className="receipt-sig-label">Weigh Operator</div>
        </div>
        <div className="receipt-sig-block">
          <div className="receipt-sig-line" />
          <div className="receipt-sig-label">Authorised Signatory</div>
        </div>
      </div>

      {/* Footer */}
      <div className="receipt-footer">
        Jai Bhawani Enterprises · M-61 MIDC Ambad, Nashik 422010 · GST: 27ADGPC2741P1ZE
        <br />
        Computer-generated receipt. Subject to Nashik jurisdiction.
      </div>
    </div>
  );
}

export default async function PrintReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createDb(await createSupabaseServerComponent());
  const { data: purchase, error } = await db.purchases.get(id);
  if (error || !purchase) notFound();

  const totalAmount = purchase.items.reduce((s, i) => s + (i.amount ?? 0), 0);
  const totalPaid = purchase.payments.reduce((s, p) => s + p.amount, 0);
  const balance = totalAmount - totalPaid;
  const voucher = voucherNo(purchase.id, purchase.purchase_date);

  const shared = { purchase, voucher, totalAmount, totalPaid, balance };

  return (
    <div className="receipt-shell">
      {/* ── Screen-only action bar ── */}
      <div className="receipt-actions receipt-no-print">
        <Link href={`/dashboard/purchases/${purchase.id}`} className="dash-btn dash-btn--outline">
          ← Back to Purchase
        </Link>
        <PrintButton />
      </div>

      {/* ── One landscape sheet, two copies: cut down the middle ── */}
      <div className="receipt-sheet">
        <VoucherCopy {...shared} copyLabel="Original" />
        <VoucherCopy {...shared} copyLabel="Duplicate" />
      </div>
    </div>
  );
}
