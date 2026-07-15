"use client";
import { useRef, useState } from "react";
import { company, contactRows, roleOptions } from "@/data/content";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [btnText, setBtnText] = useState("Send inquiry →");

  function validate(): boolean {
    const form = formRef.current;
    if (!form) return false;
    let valid = true;
    ["name", "message"].forEach((n) => {
      const el = form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement;
      const bad = !el.value.trim();
      el.closest(".field")?.classList.toggle("invalid", bad);
      if (bad) valid = false;
    });
    const email = form.elements.namedItem("email") as HTMLInputElement;
    if (email.value.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      email.closest(".field")?.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    }
    return valid;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      formRef.current?.querySelector<HTMLElement>(".field.invalid input, .field.invalid textarea")?.focus();
      return;
    }
    setSubmitted(true);
    setBtnText("Sent ✓");
    formRef.current?.querySelectorAll("input, textarea").forEach((el) => {
      (el as HTMLInputElement).value = "";
    });
    setTimeout(() => setBtnText("Send inquiry →"), 4000);
    setTimeout(() => setSubmitted(false), 8000);
  }

  function clearInvalid(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.closest(".field")?.classList.remove("invalid");
  }

  return (
    <section className="contact-sec" id="contact">
      <div className="wrap">
        <Reveal>
          <div className="shead">
            <Kicker>Contact</Kicker>
            <h2>
              Sell to us.
              <br />
              Buy <span className="accent">from us.</span>
            </h2>
            <p>
              One call is usually enough. Tell us what you have or what you
              need — we&apos;ll take it from there.
            </p>
          </div>
        </Reveal>

        <div className="contact-grid">
          <Reveal>
            <div>
              <a className="contact-phone" href={`tel:${company.phoneTel}`}>
                {company.phone}
              </a>
              <div className="c-rows">
                {contactRows.filter(r => r.key !== "Phone").map((row) => (
                  <div className="c-row" key={row.key}>
                    <span className="c-k">{row.key}</span>
                    <span className="c-v">
                      {row.href ? (
                        <a href={row.href}>{row.value}</a>
                      ) : row.mono ? (
                        <span className="mono">{row.value}</span>
                      ) : (
                        row.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form className="form-card" noValidate ref={formRef} onSubmit={handleSubmit}>
              <h3 className="form-title">Send an inquiry</h3>
              <div className="f-grid">
                <div className="field">
                  <label htmlFor="f-name">Name <em>*</em></label>
                  <input id="f-name" name="name" type="text" autoComplete="name" onChange={clearInvalid} />
                  <span className="f-err">Required</span>
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Phone</label>
                  <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input id="f-email" name="email" type="email" autoComplete="email" onChange={clearInvalid} />
                  <span className="f-err">Check email format</span>
                </div>
                <div className="field">
                  <label htmlFor="f-role">I am a</label>
                  <select id="f-role" name="role">
                    {roleOptions.map((opt) => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="field span-2">
                  <label htmlFor="f-msg">Message <em>*</em></label>
                  <textarea id="f-msg" name="message" placeholder="Material, rough quantity, location…" onChange={clearInvalid} />
                  <span className="f-err">Required</span>
                </div>
              </div>
              <div className="form-foot">
                <button className="btn btn--amber" type="submit">{btnText}</button>
                <span className="form-note">Demo mode — email hookup pending</span>
              </div>
              {submitted && (
                <div className="form-ok show" role="status">
                  Received. We usually reply within a working day — or call{" "}
                  <a href={`tel:${company.phoneTel}`}>{company.phone}</a> for anything urgent.
                </div>
              )}
            </form>
          </Reveal>
        </div>

        <Reveal>
          <div className="map-box">
            <span className="map-tag">M-61 · MIDC Ambad, Nashik</span>
            <iframe
              src={company.mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jai Bhawani Enterprises — M-61, MIDC Ambad, Nashik"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
