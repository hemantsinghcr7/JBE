"use client";
export function PrintButton() {
  return (
    <button className="dash-btn" onClick={() => window.print()}>
      🖨 Print Receipt
    </button>
  );
}
