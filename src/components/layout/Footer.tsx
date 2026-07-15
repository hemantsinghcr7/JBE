import { company, navLinks } from "@/data/content";

export function Footer() {
  return (
    <footer className="footer">
      <span className="foot-watermark" aria-hidden="true">JBE</span>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="foot-brand-name">JBE</div>
            <div className="foot-brand-sub">Jai Bhawani Enterprises</div>
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
                <a href={`tel:${company.phoneTel}`} className="mono">{company.phone}</a>
              </li>
              <li className="mono">GST {company.gst}</li>
              <li>
                {company.address.line1},<br />
                {company.address.city} {company.address.pin},<br />
                {company.address.state}
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-divider" />

        <div className="legal">
          <span>© {new Date().getFullYear()} Jai Bhawani Enterprises</span>
          <span>Nashik · Maharashtra · India</span>
          <span>Est. {company.founded}</span>
        </div>
      </div>
    </footer>
  );
}
