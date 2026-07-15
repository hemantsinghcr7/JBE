# CLAUDE.md — Jai Bhawani Enterprises (JBE) Website

This file is read by Claude Code at the start of every session.
It is the single source of truth for project context, conventions, and rules.

---

## 1. Project Overview

**Client:** Jai Bhawani Enterprises (JBE) — family-owned non-ferrous scrap metal trading business.
**Owner/Developer:** Hemant Singh (hemantsinghcr7@gmail.com)
**Live URL:** https://jbe-one.vercel.app
**Repo:** https://github.com/hemantsinghcr7/JBE
**Stack:** Next.js 16 · TypeScript · Tailwind CSS 4 · Vercel

### Business Details
- **GST:** 27ADGPC2741P1ZE
- **Address:** M-61, MIDC Ambad, Nashik 422010, Maharashtra, India
- **Phone:** +91 80438 37022
- **Founded:** 1998
- **Operations:** 2 processing sites · 25 workers · 3 owned trucks
- **Buys:** Aluminium scrap, copper scrap, brass scrap
- **Supplies:** Graded Al/Cu/Br · iron wire coil · copper rods
- **Markets:** Maharashtra, Gujarat (export groundwork in progress)

---

## 2. Repo Structure

```
JbeWebsite/
├── public/
│   └── Images/          ← all site images (webp preferred)
├── src/
│   ├── app/
│   │   ├── layout.tsx   ← root layout, fonts, metadata, JSON-LD
│   │   ├── page.tsx     ← home page — imports all sections
│   │   └── globals.css  ← ALL styles (design tokens + component CSS)
│   ├── components/
│   │   ├── layout/      ← TopStrip, Navbar, MobileDrawer, Footer, ScrollExtras
│   │   ├── ui/          ← LogoTile, Kicker, Btn, Reveal (reusable primitives)
│   │   └── sections/    ← Hero, Ticker, Stats, About, Materials, Process, ExportBand, Contact
│   ├── data/
│   │   └── content.ts   ← ALL editable content (text, numbers, grades, nav, contact)
│   ├── hooks/
│   │   ├── useScrollSpy.ts
│   │   └── useCountUp.ts
│   └── lib/
│       └── utils.ts
└── static-v1/           ← original plain HTML/CSS/JS backup — do not delete
```

---

## 3. Design System (never break these)

### Colours — CSS custom properties only, never raw hex in components
```
--blue:      #0C3C8F   primary brand, nav, stats band, footer
--blue-deep: #082A66   hover states
--red:       #D32027   CTAs, accents, kickers, required markers
--ink:       #0B1B33   body text, dark sections
--ink-70:    rgba(11,27,51,.7)
--ink-50:    rgba(11,27,51,.5)
--paper:     #F5F4F0   page background
--card:      #FFFFFF
--line:      rgba(11,27,51,.16)
--line-soft: rgba(11,27,51,.09)
```

### Typography — loaded via next/font/google in layout.tsx
```
Archivo 500–900      → --f-display  headings, brand name
IBM Plex Sans 400–700 → --f-body    body text
IBM Plex Mono 400–600 → --f-mono   labels, codes, kickers, GST
```

### Layout
```
Max width:  1160px (--wrap)
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

1. **All content from `data/content.ts`** — never hardcode text, numbers, or grades in JSX
2. **CSS custom properties** — never raw hex in components
3. **`next/image`** for all images — never `<img>`
4. **`next/font`** for fonts — never `<link>` tags
5. **TypeScript strict** — no `any`
6. **No comments** unless the WHY is non-obvious
7. **Mobile-first** — base styles mobile, scale up
8. **`prefers-reduced-motion`** — check before any animation
9. **Semantic HTML** — `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`
10. **44px min touch targets** on all interactive elements

---

## 5. Branch Strategy

```
main            → production (auto-deploys to Vercel)
feature/<name>  → new features, e.g. feature/rate-estimator
fix/<name>      → bug fixes, e.g. fix/mobile-nav
setup/<name>    → infrastructure/config, e.g. setup/project-foundation
```

**Rules:**
- Never push directly to `main` unless it's a trivial copy/config change
- Every feature gets a branch → PR → merge to main
- Branch names are lowercase, hyphenated

---

## 6. Deployment

- **Platform:** Vercel (hobby plan)
- **Trigger:** every push to `master` auto-deploys to production
- **Preview:** every branch/PR gets a preview URL automatically
- **Domain (planned):** jbhawanienterprises.in — not yet purchased
- **Do NOT add** `output: 'export'` to next.config.ts — we need API routes later

---

## 7. Roadmap (phases)

See `ROADMAP.md` for full detail.

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Marketing website | ✅ Done |
| 2 | Scrap rate estimator | 🔲 Planned |
| 3 | Operations digitisation | 🔲 Planned (needs business analysis) |
| 4 | Export portal | 🔲 Future |

---

## 8. What NOT to build (until explicitly asked)

- Formspree / EmailJS contact form integration
- Live scrap rate API / price feeds
- Buyer/seller login or portal
- Blog or news section
- Admin dashboard
- Multi-language (Hindi)
- Export enquiry dedicated page

---

## 9. Environment Variables

None required yet. When added (e.g. DB connection, email API):
- Store in `.env.local` locally (already gitignored)
- Add to Vercel dashboard under Environment Variables
- Document the key name here (never the value)

---

*Jai Bhawani Enterprises · Nashik, India · Est. 1998 · GST: 27ADGPC2741P1ZE*
