# Jai Bhawani Enterprises — Website & Operations Console

Corporate marketing website and internal operations dashboard for **Jai Bhawani Enterprises (JBE)**, a family-owned non-ferrous scrap metal trading business established in 1998 in Nashik, Maharashtra, India.

**Live site:** https://jbe-one.vercel.app  
**Domain (planned):** jbhawanienterprises.in  
**Stack:** Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase · Vercel

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Architecture](#5-architecture)
6. [Design System](#6-design-system)
7. [Content Editing](#7-content-editing)
8. [Operations Dashboard](#8-operations-dashboard)
9. [Environment Variables](#9-environment-variables)
10. [Deployment](#10-deployment)
11. [Contributing](#11-contributing)
12. [Roadmap](#12-roadmap)

---

## 1. Project Overview

This repository contains two distinct products served from the same Next.js app:

### Marketing site (`/`)
JBE's primary online presence — a single-page brochure site targeting scrap sellers, buyers, and export partners across Maharashtra and Gujarat.

### Operations console (`/dashboard`)
An internal web app replacing JBE's legacy desktop software. It digitises the daily scrap purchase workflow:

1. Customer brings scrap → workers weigh by metal type, record gross weight and sack count
2. Scrap is cleaned — impurities removed, deduction weight agreed
3. Net weight calculated, rate set (before or after weighing)
4. Customer reviews paperwork, agrees to deductions → purchase marked **Complete**
5. Printed A4 purchase voucher handed to customer

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components by default, route-segment layouts, Vercel-native |
| Language | TypeScript 5 (strict) | Catches schema mismatches at compile time |
| Styling | Tailwind CSS 4 + hand-authored CSS | Design tokens as CSS custom properties; separate CSS files per route segment |
| Database | Supabase (PostgreSQL) | Managed Postgres, real-time ready, generous free tier |
| Auth | Supabase Auth (email/password) | Cookie-based sessions work with Next.js middleware |
| Fonts | next/font/google | Zero layout shift; no external request at runtime |
| Deployment | Vercel (Hobby) | Auto-deploy on push to `main`; preview URLs on every PR |

---

## 3. Getting Started

### Prerequisites

- **Node.js** ≥ 20 (`node -v`)
- **npm** ≥ 10 (bundled with Node 20)
- A **Supabase** account with the JBE project (credentials from Hemant)

### Install and run

```bash
git clone https://github.com/hemantsinghcr7/JBE.git
cd JBE
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ofhmnochmsxafouphhth.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<get from Hemant>

# Dev quick-login (local only — never commit)
NEXT_PUBLIC_DEV_EMAIL=your@email.com
NEXT_PUBLIC_DEV_PASSWORD=your-password
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — sign in at `/login` first.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type-check without emitting |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting (used in CI) |

---

## 4. Project Structure

```
JbeWebsite/
├── .github/
│   └── workflows/ci.yml        # CI: lint + type-check + build on every PR
├── public/
│   ├── Images/                 # Site images (webp preferred)
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, <head> metadata, JSON-LD structured data
│   │   ├── page.tsx            # Home page — imports all marketing sections
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── sitemap.ts          # Dynamic sitemap.xml
│   │   ├── globals.css         # Marketing site styles: tokens + all component CSS
│   │   ├── login/              # /login — auth page
│   │   │   ├── page.tsx
│   │   │   └── login.css       # Login page styles (isolated — not in globals.css)
│   │   └── dashboard/          # /dashboard/* — operations console (auth-gated)
│   │       ├── layout.tsx      # Dashboard shell: sidebar nav + main scroll area
│   │       ├── dashboard.css   # All dashboard styles (dash- prefix; separate file)
│   │       ├── page.tsx        # Overview: stat cards, stock levels, bar chart
│   │       ├── purchases/      # Buying side: scrap in from customers
│   │       │   ├── page.tsx    # Purchases list
│   │       │   ├── new/        # New purchase form
│   │       │   └── [id]/
│   │       │       ├── page.tsx      # Purchase detail: items, payments, actions
│   │       │       └── print/        # Printable A4 purchase voucher
│   │       ├── customers/      # Scrap sellers
│   │       │   ├── page.tsx    # Customer list
│   │       │   ├── new/        # Add customer
│   │       │   └── [id]/       # Customer profile: scrap received, account, history
│   │       ├── sales/          # Selling side: scrap out to buyers
│   │       │   ├── page.tsx    # Sales list
│   │       │   ├── new/        # New sale form (quantity + rate agreed by phone)
│   │       │   └── [id]/
│   │       │       ├── page.tsx      # Sale detail: items, status progression, compliance refs, payments
│   │       │       └── print/        # Printable sale invoice / delivery challan
│   │       ├── buyers/         # Businesses JBE sells to (Maharashtra/Gujarat)
│   │       │   ├── page.tsx    # Buyer list
│   │       │   ├── new/        # Add buyer
│   │       │   └── [id]/       # Buyer profile: scrap sold, receivable, history
│   │       ├── stock/
│   │       │   ├── page.tsx    # Stock index: Aluminium/Copper/Brass/Other categories
│   │       │   └── [category]/ # Material-level breakdown within one category
│   │       └── receipt-print.css  # Shared A4 print styles (purchase voucher + sale invoice)
│   ├── components/
│   │   ├── layout/             # Marketing chrome: TopStrip, Navbar, MobileDrawer, Footer, ScrollExtras
│   │   ├── sections/           # Marketing sections: Hero, Ticker, Stats, About, Materials, Process, ExportBand, Contact
│   │   ├── ui/                 # Shared primitives: Btn, Kicker, LogoTile, Reveal
│   │   └── dashboard/          # Dashboard-specific components (all "use client"):
│   │                           #   LoginForm, NewPurchaseForm, NewCustomerForm, NewSaleForm, NewBuyerForm,
│   │                           #   RecordPaymentForm, RecordSalePaymentForm, MarkCompleteButton,
│   │                           #   AdvanceSaleStatusButton, SaleComplianceForm, PrintButton
│   ├── data/
│   │   └── content.ts          # Single source of truth for all marketing content
│   ├── hooks/
│   │   ├── useCountUp.ts       # Count-up animation (DOM mutation — no React re-renders)
│   │   └── useScrollSpy.ts     # IntersectionObserver active-section tracker
│   ├── lib/
│   │   ├── db.ts               # Typed DB access layer — createDb(client) factory, all queries live here
│   │   ├── supabase-browser.ts # Session-aware client for Client Components
│   │   ├── supabase-server.ts  # Session-aware clients for middleware + Server Components
│   │   ├── metalCategory.ts    # Groups the material list into Aluminium/Copper/Brass/Other
│   │   ├── toWords.ts          # Converts rupee amounts to Indian English words
│   │   └── utils.ts            # cn() classname helper
│   ├── middleware.ts            # Auth guard: redirects /dashboard/* to /login if no session
│   └── types/
│       └── database.ts         # Hand-maintained DB row types (see upgrade path below)
├── supabase/
│   └── schema.sql              # DB schema reference (tables already live in Supabase)
├── CLAUDE.md                   # AI assistant context and all project rules
├── CONTRIBUTING.md             # Branch strategy, commit format, PR process
└── ROADMAP.md                  # Feature roadmap by phase
```

---

## 5. Architecture

### Marketing site: server-first

Every component is a **Server Component** by default — renders on the server, sends plain HTML. Client components (`"use client"`) are used only when browser APIs, state, or event handlers are required.

Current client components: `Navbar`, `MobileDrawer`, `ScrollExtras`, `Stats`, `Reveal`, `Contact`, and all dashboard interactive components.

### Operations dashboard: repository pattern

All database access goes through `db.ts`'s `createDb(client)` factory — never a singleton, because Supabase RLS policies are gated on `auth.role() = 'authenticated'`, so every query needs the signed-in user's session attached.

```
Server Component → createSupabaseServerComponent() ─┐
                                                      ├→ createDb(client) → Supabase (PostgreSQL)
Client Component → createSupabaseBrowser()          ─┘
```

This isolates the `as unknown as` type cast to one file, makes queries easy to test, and means swapping the DB only requires changing `db.ts`. Never construct a Supabase client directly in a component — always `createDb()`.

### CSS isolation strategy

Tailwind CSS 4's PostCSS pipeline drops CSS appended after the main layer in `globals.css`. Dashboard styles live in a separate file (`dashboard.css`) imported only by the dashboard layout. This means:

- Dashboard CSS loads only on dashboard pages
- No class name collision with marketing styles (all dashboard classes are `dash-` prefixed)
- `globals.css` stays fast — only marketing styles

### Auth flow

```
/dashboard/* request
  → middleware.ts
    → createSupabaseMiddleware() checks session cookie
      → no session → redirect to /login
      → session valid → serve page
```

Session is set by Supabase Auth on sign-in and stored in cookies automatically by `@supabase/ssr`. The middleware is the single enforcement point for **page routes** — update only there to change auth behaviour.

Middleware alone doesn't protect the database: the anon/publishable key is public in the client bundle, so Supabase Row Level Security (RLS) policies restrict every table to `auth.role() = 'authenticated'`. This is why `createDb()` needs a session-aware client rather than a plain one — without the user's JWT attached, RLS silently returns zero rows.

### Purchase voucher / sale invoice print

`/dashboard/purchases/[id]/print` and `/dashboard/sales/[id]/print` are server components that render an A4-sized HTML document, sharing `receipt-print.css`. `@media print` CSS hides the sidebar and action buttons, leaving a clean printable document. The `toWords.ts` utility converts the total amount to Indian English words (handles up to 99 crore). The sale invoice explicitly states it's a reference document, not a substitute for the GST invoice or government E-way Bill (see §8).

---

## 6. Design System

All tokens are CSS custom properties in `src/app/globals.css`.

### Colours

| Token | Value | Use |
|---|---|---|
| `--blue` | `#0C3C8F` | Brand primary: nav, stats, footer, dashboard accents |
| `--blue-deep` | `#082A66` | Hover on blue |
| `--red` | `#D32027` | CTAs, kickers, balance-due, accents |
| `--ink` | `#0B1B33` | Body text, dashboard sidebar |
| `--ink-70` | `rgba(11,27,51,.7)` | Secondary text |
| `--ink-50` | `rgba(11,27,51,.5)` | Muted / placeholder |
| `--paper` | `#F5F4F0` | Page background |
| `--card` | `#FFFFFF` | Card surfaces |
| `--line` | `rgba(11,27,51,.16)` | Borders |
| `--line-soft` | `rgba(11,27,51,.09)` | Subtle separators |

### Typography

| Variable | Font | Weights | Use |
|---|---|---|---|
| `--f-display` | Archivo | 500–900 | Headings, hero, stat values |
| `--f-body` | IBM Plex Sans | 400–700 | Body copy |
| `--f-mono` | IBM Plex Mono | 400–600 | Labels, codes, GST, table data |

### Visual signatures

- **JBE tile** — 42×42px blue square, white "JBE", red CSS triangle top-right
- **Kicker labels** — mono uppercase, red `■` prefix, `0.18em` letter-spacing
- **Metal swatches** — CSS gradient per metal (AL/CU/BR), grain overlay, hover sheen
- **Sharp edges** — zero border-radius everywhere, including the dashboard

---

## 7. Content Editing

All marketing content is in [`src/data/content.ts`](src/data/content.ts). No component files need touching to update:

| Data | Key |
|---|---|
| Company name, GST, phone, address | `company` |
| Animated counters | `stats` |
| Metal materials and grades | `materials` |
| Process steps | `processSteps` |
| About timeline | `timeline` |
| Navigation links | `navLinks` |
| Contact rows | `contactRows` |

---

## 8. Operations Dashboard

The dashboard at `/dashboard` is an auth-gated internal tool. Access requires signing in at `/login` with a Supabase Auth account.

### Key pages

| Route | What it does |
|---|---|
| `/dashboard` | Overview: cash position (payables/receivables), stock position by category, recent activity |
| `/dashboard/purchases` | All purchases — buying side |
| `/dashboard/purchases/new` | Record a new purchase (customer + metal items) |
| `/dashboard/purchases/[id]` | Detail: items, payments, mark complete, print |
| `/dashboard/purchases/[id]/print` | Printable A4 purchase voucher with amount in words |
| `/dashboard/customers` | Customer directory (scrap sellers) |
| `/dashboard/customers/[id]` | Customer profile: scrap received (week/month/all-time), account balance |
| `/dashboard/sales` | All sales — selling side |
| `/dashboard/sales/new` | Record a new sale (buyer + metal items, quantity/rate agreed by phone) |
| `/dashboard/sales/[id]` | Detail: items, status progression, compliance reference numbers, payments, print |
| `/dashboard/sales/[id]/print` | Printable sale invoice / delivery challan |
| `/dashboard/buyers` | Buyer directory (businesses JBE sells to) |
| `/dashboard/buyers/[id]` | Buyer profile: scrap sold, receivable balance |
| `/dashboard/stock` | Stock index: Aluminium / Copper / Brass / Other |
| `/dashboard/stock/[category]` | Material-level breakdown within one category |
| `/login` | Sign in (Supabase Auth) |

### Purchase status flow

```
draft  →  (customer reviews paperwork)  →  complete
```

A purchase starts as **draft** when recorded. After the customer visits, reviews the weighment details and agrees to deductions, click "✓ Mark as Complete" — this triggers an inline confirmation (no `confirm()` dialog) then updates Supabase.

### Sale status flow

```
quoted  →  dispatched  →  delivered  →  paid
```

A sale starts as **quoted** once rate and quantity are agreed by phone. Marking **dispatched** requires a vehicle number (the truck has left, and this is the point stock is deducted) — **delivered** and **paid** follow once the buyer confirms receipt and settles.

### Stock on hand

`/dashboard` and `/dashboard/stock` show **net** stock: total received from `purchase_items`, minus `sale_items` for any sale in `dispatched`/`delivered`/`paid` status (a `quoted` sale hasn't shipped yet, so it doesn't reduce stock). Materials are grouped into 3 categories — Aluminium, Copper, Brass, plus Other — via `src/lib/metalCategory.ts`; update that file if the material list changes.

### Buyer compliance (E-way Bill, GST, TCS)

`sales.invoice_number` and `sales.eway_bill_number` are reference fields, not automated filings — generate the actual GST invoice and government E-way Bill (mandatory above ₹50,000 per consignment) through your accounting tool / the e-way bill portal, then record the numbers on the sale. Scrap sales also attract 1% TCS under Income Tax Act §206C(1) unless the buyer provides Form 27C. Confirm current thresholds and rates with a CA — this is general regulatory awareness baked into the docs, not tax advice enforced by the app.

### Dev quick login

In development, the login page shows a "⚡ Dev — Quick Login" button. Set credentials in `.env.local`:
```env
NEXT_PUBLIC_DEV_EMAIL=your@email.com
NEXT_PUBLIC_DEV_PASSWORD=your-password
```
This button does not appear in production builds.

---

## 9. Environment Variables

| Key | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Vercel + `.env.local` | Supabase anon/publishable key |
| `NEXT_PUBLIC_DEV_EMAIL` | `.env.local` only | Dev quick-login email |
| `NEXT_PUBLIC_DEV_PASSWORD` | `.env.local` only | Dev quick-login password |

**Never commit `.env.local`.** It is already in `.gitignore`.  
**Never add `NEXT_PUBLIC_DEV_*` to Vercel** — they are local developer shortcuts only.

---

## 10. Deployment

| Branch | Behaviour |
|---|---|
| `main` | Auto-deploys to https://jbe-one.vercel.app |
| Any branch / PR | Gets a unique preview URL |

**To deploy:** merge your PR to `main`. Vercel handles the rest.

### Required Vercel environment variables

Go to Vercel dashboard → Settings → Environment Variables → add for Production and Preview:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Custom domain checklist (when `jbhawanienterprises.in` is purchased)

1. Add domain in Vercel → Domains
2. Point DNS as instructed
3. Update `BASE_URL` in `src/app/sitemap.ts`
4. Update `Sitemap:` line in `public/robots.txt`
5. Update `openGraph.url` in `src/app/layout.tsx`

---

## 11. Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

### Branch naming

```
feature/<name>   e.g. feature/stock-dispatch
fix/<name>       e.g. fix/receipt-decimal-format
setup/<name>     e.g. setup/supabase-rls-policies
content/<name>   e.g. content/update-grades
```

### Workflow

1. Branch off `main`
2. Make changes
3. Run `npm run lint && npm run type-check` — CI blocks merge if either fails
4. Open PR → CI runs automatically → get review → merge → auto-deploys

### Non-negotiable rules

- All DB calls via `src/lib/db.ts` — never import `supabase` directly in a component
- Dashboard CSS in `src/app/dashboard/dashboard.css` — never in `globals.css`
- All dashboard class names prefixed `dash-`
- No `any` in TypeScript
- No raw hex in component files — always `var(--token)`

---

## 12. Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Marketing website | ✅ Live |
| 2 | Operations dashboard (auth · purchases · receipts) | ✅ Live |
| 3 | Stock dispatch tracking (running inventory) | 🔲 Next |
| 4 | Customer detail page + purchase history | 🔲 Next |
| 5 | Scrap rate estimator (public-facing) | 🔲 Planned |
| 6 | Export portal | 🔲 Future |

See [ROADMAP.md](ROADMAP.md) for detail on each phase.

---

*Jai Bhawani Enterprises · M-61, MIDC Ambad, Nashik 422010 · Est. 1998 · GST: 27ADGPC2741P1ZE*
