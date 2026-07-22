import Link from "next/link";
import { company } from "@/data/content";

export function TopStrip() {
  return (
    <div className="topstrip">
      <div className="wrap">
        <span>
          {company.address.line1.toUpperCase()}, {company.address.city.toUpperCase()}{" "}
          {company.address.pin} · MH, INDIA
        </span>
        <span className="ts-right">
          GST <b>{company.gst}</b> · EST. <b>{company.founded}</b>
          <Link href="/login" className="ts-ops-link">JBE Operations →</Link>
        </span>
      </div>
    </div>
  );
}
