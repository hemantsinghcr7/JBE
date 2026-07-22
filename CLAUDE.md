# CLAUDE.md — Jai Bhawani Enterprises (JBE) Website

This file is read by Claude Code at the start of every session.
It is the single source of truth for project context, conventions, and rules.

---

## 1. Project Overview

**Client:** Jai Bhawani Enterprises (JBE) — family-owned non-ferrous scrap metal trading business.
**Owner/Developer:** Hemant Singh (hemantsinghcr7@gmail.com)
**Live URL:** https://jbe-one.vercel.app
**Repo:** https://github.com/hemantsinghcr7/JBE
**Stack:** Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase · Vercel

### Business Details
- **GST:** 27ADGPC2741P1ZE
- **Address:** M-61, MIDC Ambad, Nashik 422010, Maharashtra, India
- **Phone:** +91 80438 37022
- **Founded:** 1998
- **Operations:** 2 processing sites · 25 workers · 3 owned trucks
- **Buys:** Aluminium scrap, copper scrap, brass scrap
- **Supplies:** Graded Al/Cu/Br · iron wire coil · copper rods
- **Markets:** Maharashtra, Gujarat (export groundwork in progress)

### Business Workflow (operations digitisation context)
1. Customer brings scrap to warehouse
2. Workers weigh each metal type on a small scale, recording gross weight and sack count
3. Scrap is cleaned — impurities (iron, attachments) removed
4. Deduction weight agreed, net weight calculated
5. Rate set (before or after weighing, depending on agreement)
6. Customer called to review paperwork, agree to deductions → status marked **Complete**
7. Customer receives printed voucher and payment

---

## 2. Repo Structure

```
JbeWebsite/
├── public/
│   ├── Images/              ← all site images (webp preferred)
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← root layout, fonts, metadata, JSON-LD
│   │   ├── page.tsx         ← home page — imports all sections
│   │   ├── not-found.tsx    ← 404 page
│   │   ├── sitemap.ts       ← dynamic sitemap.xml
│   │   ├── globals.css      ← marketing site styles (design tokens + components)
│   │   ├── login/           ← /login — Supabase auth, split-screen design
│   │   └── dashboard/       ← /dashboard/* — ops console (auth-gated)
│   │       ├── layout.tsx   ← dashboard shell: sidebar + main area
│   │       ├── dashboard.css← ALL dashboard styles (prefixed dash-)
│   │       ├── page.tsx     ← overview: stats, stock, chart
│   │       ├── purchases/
│   │       │   ├── page.tsx          ← list all purchases
│   │       │   ├── new/page.tsx      ← new purchase form
│   │       │   └── [id]/
│   │       │       ├── page.tsx      ← purchase detail, payments, mark complete
│   │       │       └── print/page.tsx← printable A4 purchase voucher
│   │       ├── customers/
│   │       │   ├── page.tsx          ← list all customers
│   │       │   └── new/page.tsx      ← add customer form
│   │       └── stock/                ← stock detail (planned)
│   ├── components/
│   │   ├── layout/          ← TopStrip, Navbar, MobileDrawer, Footer, ScrollExtras
│   │   ├── ui/              ← LogoTile, Kicker, Btn, Reveal (reusable primitives)
│   │   ├── sections/        ← Hero, Ticker, Stats, About, Materials, Process, ExportBand, Contact
│   │   └── dashboard/       ← LoginForm, NewPurchaseForm, NewCustomerForm,
│   │                           RecordPaymentForm, MarkCompleteButton, PrintButton
│   ├── data/
│   │   └── content.ts       ← ALL editable marketing content
│   ├── hooks/
│   │   ├── useScrollSpy.ts
│   │   └── useCountUp.ts
│   ├── lib/
│   │   ├── db.ts            ← typed DB access layer (repository pattern)
│   │   ├── supabase.ts      ← base Supabase client (no Database generic)
│   │   ├── supabase-browser.ts ← browser client for auth (client components)
│   │   ├── supabase-server.ts  ← server client for middleware auth check
│   │   ├── toWords.ts       ← Indian rupee amount → words converter
│   │   └── utils.ts         ← cn() classname helper
│   ├── middleware.ts         ← protects /dashboard/* — redirects to /login if no session
│   └── types/
│       └── database.ts      ← hand-maintained DB row types (replace with generated types later)
├── supabase/
│   └── schema.sql           ← DB schema reference (tables already created in Supabase)
├── .github/workflows/ci.yml ← CI: lint + type-check + build on every PR
├── CLAUDE.md                ← this file
├── ROADMAP.md               ← feature roadmap by phase
└── CONTRIBUTING.md          ← branch strategy, commit conventions, code rules
```

---

## 3. Design System (never break these)

### Colours — CSS custom properties only, never raw hex in components
```
--blue:      #0C3C8F   primary brand, nav, stats band, footer, dashboard sidebar accents
--blue-deep: #082A66   hover states
--red:       #D32027   CTAs, accents, kickers, required markers, balance-due
--ink:       #0B1B33   body text, dark sections, dashboard sidebar background
--ink-70:    rgba(11,27,51,.7)
--ink-50:    rgba(11,27,51,.5)
--paper:     #F5F4F0   page background
--card:      #FFFFFF
--line:      rgba(11,27,51,.16)
--line-soft: rgba(11,27,51,.09)
```

### Typography — loaded via next/font/google in layout.tsx
```
Archivo 500–900       → --f-display  headings, brand name, stat values
IBM Plex Sans 400–700 → --f-body     body text
IBM Plex Mono 400–600 → --f-mono    labels, codes, kickers, GST, table data
```

### Layout
```
Max width:  1160px (--wrap)   [marketing site]
Padding:    20px base (--pad)
Radius:     0px — sharp/industrial, intentional
Cards:      1px solid border, no radius
```

### Visual Signature (preserve in all future UI)
- **JBE tile** — 42×42px blue square, white "JBE", red CSS triangle top-right
- **Kicker labels** — mono uppercase, red ■ prefix, 0.18em letter-spacing
- **Metal swatches** — CSS gradient AL/CU/BR, grain overlay, hover sheen
- **Sharp edges** — no border-radius anywhere

---

## 4. Critical Code Rules

1. **All marketing content from `data/content.ts`** — never hardcode text, numbers, or grades in JSX
2. **CSS custom properties** — never raw hex in components
3. **`next/image`** for all images — never `<img>`
4. **`next/font`** for fonts — never `<link>` tags
5. **TypeScript strict** — no `any`
6. **No comments** unless the WHY is non-obvious
7. **Mobile-first** — base styles mobile, scale up
8. **`prefers-reduced-motion`** — check before any animation
9. **Semantic HTML** — `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`
10. **44px min touch targets** on all interactive elements
11. **All DB calls via `src/lib/db.ts`** — never import `supabase` directly in components
12. **Dashboard CSS in `dashboard.css`** — never in `globals.css` (Tailwind CSS 4 PostCSS pipeline drops appended sections)
13. **All dashboard CSS classes prefixed `dash-`** — prevents collisions with marketing styles

---

## 5. Database (Supabase)

**Project ID:** `ofhmnochmsxafouphhth`
**Region:** ap-south-1 (Mumbai)

### Tables
| Table | Purpose |
|-------|---------|
| `customers` | Scrap sellers: name, phone, address |
| `purchases` | One purchase per customer visit: date, status (draft/complete), notes |
| `purchase_items` | Metal line items per purchase: metal_type, gross/deduction/net weight, rate, amount |
| `payments` | Payments against a purchase: amount, type (cash/credit), date |

### Purchase status flow
```
draft → complete
```
- **draft** — purchase recorded, scrap being processed or awaiting customer sign-off
- **complete** — customer reviewed paperwork, agreed to deductions, ready to print

### DB access pattern
```
components → src/lib/db.ts → src/lib/supabase.ts → Supabase
```
Never import from `supabase.ts` directly in a component. Always go through `db.ts`.

### Upgrading to generated types
```bash
npx supabase gen types typescript --project-id ofhmnochmsxafouphhth > src/types/database.ts
```
Then pass `Database` generic to `createClient` in `supabase.ts` and remove `as unknown as` casts in `db.ts`.

---

## 6. Authentication

**Method:** Supabase Auth (email + password)
**Gating:** Next.js middleware at `src/middleware.ts` — all `/dashboard/*` routes check for a valid Supabase session cookie.

### Environment variables (never commit values)
| Key | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `NEXT_PUBLIC_DEV_EMAIL` | Dev quick-login email (local only, `.env.local`) |
| `NEXT_PUBLIC_DEV_PASSWORD` | Dev quick-login password (local only, `.env.local`) |

### Dev quick login
In development, a "⚡ Dev — Quick Login" button appears on `/login` that reads credentials from `NEXT_PUBLIC_DEV_*` env vars and auto-submits. Hidden in production (`process.env.NODE_ENV === 'development'`).

### Future: upgrading auth
When multi-user or role-based access is needed, update `src/middleware.ts` — it's the only auth enforcement point. The rest of the app is unaffected.

---

## 7. Branch Strategy

```
main            → production (auto-deploys to Vercel)
feature/<name>  → new features, e.g. feature/ops-dashboard
fix/<name>      → bug fixes, e.g. fix/mobile-nav
setup/<name>    → infrastructure/config
content/<name>  → copy or content-only changes
```

**Rules:**
- Never push directly to `main` unless it's a trivial copy/config change
- Every feature gets a branch → PR → merge to main
- Branch names are lowercase, hyphenated

---

## 8. Deployment

- **Platform:** Vercel (hobby plan)
- **Trigger:** every push to `main` auto-deploys to production
- **Preview:** every branch/PR gets a preview URL automatically
- **Domain (planned):** jbhawanienterprises.in — not yet purchased
- **Do NOT add** `output: 'export'` to next.config.ts — API routes needed for future phases

### Environment variables on Vercel
Add these under Settings → Environment Variables (Production + Preview):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do NOT add `NEXT_PUBLIC_DEV_*` to Vercel — those are local-only.

---

## 9. Roadmap (phases)

See `ROADMAP.md` for full detail.

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Marketing website | ✅ Done |
| 2 | Operations dashboard (auth, purchases, receipts) | ✅ Done |
| 3 | Stock tracking (dispatch/sales, running stock) | 🔲 Planned |
| 4 | Scrap rate estimator | 🔲 Planned |
| 5 | Export portal | 🔲 Future |

---

## 10. What NOT to build (until explicitly asked)

- Formspree / EmailJS contact form integration
- Live scrap rate API / price feeds
- Buyer/seller login or portal (internal team login exists — Phase 2)
- Blog or news section
- Multi-language (Hindi)
- Export enquiry dedicated page
- Customer-facing portal
- Stock dispatch/sales tracking (not yet requested)

---

*Jai Bhawani Enterprises · Nashik, India · Est. 1998 · GST: 27ADGPC2741P1ZE*
