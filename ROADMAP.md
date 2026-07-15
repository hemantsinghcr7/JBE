# JBE Website — Product Roadmap

This document tracks what has been built, what is planned, and what is future scope.
Update this file whenever a phase is completed or plans change.

---

## Phase 1 — Marketing Website ✅ DONE

**Goal:** Establish online presence, generate inbound enquiries.

### Delivered
- [x] Single-page Next.js 16 site (TypeScript + Tailwind CSS 4)
- [x] Sections: Hero · Ticker · Stats · About · Materials · Process · Export band · Contact
- [x] Design system: Archivo + IBM Plex fonts, CSS design tokens, metal swatches
- [x] Interactions: scroll-spy nav, reveal animations, count-up stats, mobile drawer
- [x] Contact inquiry form (demo mode — no email send yet)
- [x] Google Maps embed (M-61, MIDC Ambad)
- [x] JSON-LD LocalBusiness structured data (SEO)
- [x] Deployed to Vercel, auto-deploy from master

### Still to do in Phase 1
- [ ] Connect contact form to email (Formspree or Resend)
- [ ] Add favicon (proper .ico / apple-touch-icon)
- [ ] Purchase domain: jbhawanienterprises.in
- [ ] Point domain to Vercel
- [ ] Convert brass.jfif + copper.jfif to .webp in public/Images/

---

## Phase 2 — Scrap Rate Estimator 🔲 PLANNED

**Goal:** Let buyers/sellers get a rough price estimate before calling.

### How it works (proposed)
1. User selects material (Al / Cu / Br) and grade
2. User enters weight (kg)
3. Site calculates: weight × today's rate = estimated value
4. Disclaimer: "Rates indicative only. Final price on weighbridge."

### What needs to be built
- [ ] Rate management: a simple admin page where Hemant/dad enters today's rates per grade
- [ ] Database: store current rates (Postgres via Vercel Storage or Supabase free tier)
- [ ] API route: `GET /api/rates` — returns current rates
- [ ] API route: `POST /api/rates` — updates rates (admin only, password-protected)
- [ ] Estimator UI: new section on home page or `/estimate` page
- [ ] Basic auth on admin rate page (no full login system needed yet)

### Dependencies
- Vercel Postgres or Supabase account
- Decision: single page section vs. dedicated `/estimate` route

---

## Phase 3 — Operations Digitisation 🔲 PLANNED

**Goal:** Move paper-based workflows online. Parallel to paper, not replacing it.

> ⚠️ This phase requires a business analysis session with the proprietor (A. Singh)
> before any code is written. Document the paper workflow first.

### Known paper documents (to investigate)
- [ ] Purchase bills / weighbridge receipts
- [ ] Supplier ledger (who sold what, when, at what rate)
- [ ] Dispatch records (what went out, to whom, when)
- [ ] Stock register (what's in the yard)
- [ ] Payment records

### Proposed approach
1. Sit with dad, map every paper form field-by-field
2. Design the digital equivalent
3. Build simple data entry screens (tablet-friendly)
4. Print = the paper is still generated, but from the system

### What will likely need to be built
- [ ] Authentication (proper login — workers, admin, owner roles)
- [ ] Purchase entry form
- [ ] Supplier directory
- [ ] Dispatch / outbound entry
- [ ] Basic reporting (monthly summary, material-wise totals)
- [ ] PDF generation for bills and receipts

---

## Phase 4 — Export Portal 🔲 FUTURE

**Goal:** Support cross-border scrap trade (import/export).

> Groundwork only at this stage. Build after Phase 3 is stable.

### Rough ideas
- [ ] Separate page for export enquiries
- [ ] Document management (shipping docs, quality certificates)
- [ ] Buyer/broker directory
- [ ] Shipment tracking log

---

## Phase 5 — Public Buyer/Seller Portal 🔲 FUTURE

**Goal:** Self-service for regular buyers and sellers.

- [ ] Seller portal: submit pickup request, view past transactions
- [ ] Buyer portal: view available stock, place order
- [ ] Notifications (SMS / WhatsApp via Twilio or MSG91)

---

## Technical Debt / Housekeeping

- [ ] Set up ESLint rules (currently default)
- [ ] Add Prettier config
- [ ] Write component tests (Vitest + Testing Library) once codebase stabilises
- [ ] Set up Sentry for error monitoring (free tier)
- [ ] Lighthouse audit — target 95+ on all scores

---

*Last updated: July 2026*
