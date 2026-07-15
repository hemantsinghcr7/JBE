import { company, navLinks } from "@/data/content";
import { LogoTile } from "@/components/ui/LogoTile";

export function Footer() {
  return (
    <footer className="footer">
      <span className="watermark" aria-hidden="true">
        JBE
      </span>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <LogoTile />
              <span className="brand-name" style={{ color: "#fff" }}>
                Jai Bhawani
                <br />
                Enterprises
                <small>{company.tagline}</small>
              </span>
            </div>
            <p>
              Aluminium, copper and brass scrap — bought, processed and supplied
              from MIDC Ambad, Nashik, since {company.founded}.
            </p>
          </div>

          <div className="foot-col">
            <h4>Site</h4>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h4>Reach us</h4>
            <ul>
              <li>
                <a href={`tel:${company.phoneTel}`} className="mono">
                  {company.phone}
                </a>
              </li>
              <li>
                <span className="mono">GST {company.gst}</span>
              </li>
              <li>
                {company.address.line1},<br />
                {company.address.city} {company.address.pin},{" "}
                {company.address.state}
              </li>
            </ul>
          </div>
        </div>

        <div className="barcode" aria-hidden="true" />

        <div className="legal">
          <span>
            © <span id="foot-year">{new Date().getFullYear()}</span>{" "}
            JAI BHAWANI ENTERPRISES
          </span>
          <span>NASHIK · MAHARASHTRA · INDIA</span>
        </div>
      </div>
    </footer>
  );
}
