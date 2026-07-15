"use client";
import { company, navLinks } from "@/data/content";
import { LogoTile } from "@/components/ui/LogoTile";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <div
      className={`drawer ${open ? "open" : ""}`}
      id="drawer"
      aria-hidden={!open}
    >
      <div className="drawer-top">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LogoTile />
          <span className="brand-name" style={{ color: "#fff" }}>
            {company.name.split(" ").slice(0, 2).join(" ")}
            <br />
            {company.name.split(" ").slice(2).join(" ")}
            <small style={{ color: "rgba(255,255,255,.45)" }}>
              {company.tagline}
            </small>
          </span>
        </div>
        <button className="drawer-close" aria-label="Close menu" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="drawer-links">
        {navLinks.map((link, i) => (
          <li key={link.href}>
            <a href={link.href} onClick={onClose}>
              <small>0{i + 1}</small> {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="drawer-foot">
        <a href={`tel:${company.phoneTel}`}>{company.phone}</a>
        <br />
        {company.address.line1}, {company.address.city} {company.address.pin}
        <br />
        GST {company.gst}
      </div>
    </div>
  );
}
