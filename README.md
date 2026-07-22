# Jai Bhawani Enterprises — Website

Corporate marketing website for **Jai Bhawani Enterprises (JBE)**, a family-owned non-ferrous scrap metal trading business established in 1998, based in Nashik, Maharashtra, India.

**Live site:** https://jbe-one.vercel.app  
**Domain (planned):** jbhawanienterprises.in  
**Stack:** Next.js · TypeScript · Tailwind CSS · Vercel

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Architecture](#5-architecture)
6. [Design System](#6-design-system)
7. [Content Editing](#7-content-editing)
8. [Environment Variables](#8-environment-variables)
9. [Deployment](#9-deployment)
10. [Contributing](#10-contributing)
11. [Roadmap](#11-roadmap)

---

## 1. Project Overview

JBE's website serves as the company's primary online presence — a single-page brochure site targeting:

- **Scrap sellers** — factories and yards looking to offload aluminium, copper, and brass scrap
- **Buyers** — manufacturers in Maharashtra and Gujarat sourcing graded non-ferrous material
- **Export partners** — as JBE builds cross-border supply lines

The site is deliberately lean: no CMS, no database, no login. All content lives in one TypeScript file (`src/data/content.ts`) so anyone on the team can update it without touching component code.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server components by default, built-in font/image optimisation, Vercel-native |
| Language | TypeScript 5 (strict) | Catches content-shape mismatches at compile time |
| Styling | Tailwind CSS 4 + hand-authored CSS | Design tokens in CSS custom properties; Tailwind for utilities |
| Fonts | next/font/google | Zero layout shift; no external network request at runtime |
| Deployment | Vercel (Hobby) | Auto-deploy on push to `main`; preview URLs on every PR |

---

## 3. Getting Started

### Prerequisites

- **Node.js** ≥ 20 (check with `node -v`)
- **npm** ≥ 10 (bundled with Node 20)

### Install and run

```bash
# Clone the repo
git clone https://github.com/hemantsinghcr7/JBE.git
cd JBE

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type-check without emitting files |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing (used in CI) |

---

## 4. Project Structure

```
JbeWebsite/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI: lint + type-check + build on every PR
├── public/
│   ├── Images/                 # Site images (webp preferred)
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, <head> metadata, JSON-LD
│   │   ├── page.tsx            # Home page — imports and arranges all sections
│   │   ├── not-found.tsx       # 404 page
│   │   ├── sitemap.ts          # Dynamic sitemap.xml generation
│   │   └── globals.css         # ALL styles: design tokens + component CSS
│   ├── components/
│   │   ├── layout/             # Chrome: TopStrip, Navbar, MobileDrawer, Footer, ScrollExtras
│   │   ├── sections/           # Page sections: Hero, Ticker, Stats, About, Materials, Process, ExportBand, Contact
│   │   └── ui/                 # Primitives: Btn, Kicker, LogoTile, Reveal
│   ├── data/
│   │   └── content.ts          # Single source of truth for all editable content
│   ├── hooks/
│   │   ├── useCountUp.ts       # Count-up animation (DOM-mutation variant for perf)
│   │   └── useScrollSpy.ts     # IntersectionObserver active-section tracker
│   └── lib/
│       └── utils.ts            # cn() classname helper
├── static-v1/                  # Original plain HTML/CSS/JS — kept as reference only
├── CLAUDE.md                   # AI assistant context and project rules
├── ROADMAP.md                  # Feature roadmap by phase
└── package.json
```

---

## 5. Architecture

### Server vs client components

Next.js App Router makes every component a **Server Component by default** — they render on the server and send plain HTML to the browser. This is the default and what we want for most of the site.

A component must be a **Client Component** (`"use client"` at the top) only when it needs:
- Browser APIs (`window`, `document`, `IntersectionObserver`)
- React state (`useState`, `useRef`)
- Event handlers

Current client components: `Navbar`, `MobileDrawer`, `ScrollExtras`, `Stats`, `Reveal`, `Contact`.

**Rule:** default to Server Components. Only add `"use client"` when you have a specific reason.

### Content layer

All editable content — text, numbers, contact info, nav links, material grades — lives in `src/data/content.ts`. Components import named exports from there.

**Never hardcode text, phone numbers, addresses, or product names in JSX.** If something might change, it belongs in `content.ts`.

### Styling approach

All styles live in `src/app/globals.css`. We use **hand-authored CSS class names** (`.btn`, `.kicker`, `.mat-card`, etc.) built on top of CSS custom properties. Tailwind CSS is available for one-off utilities but the component classes are the primary styling method.

**Never use raw hex values in component files.** Always reference a CSS custom property (`var(--blue)`, `var(--red)`, etc.).

### Animation strategy

All animations are **CSS-driven** — JS only adds or removes a class name:

- **Scroll reveal:** `Reveal` component adds `.in` via `IntersectionObserver` → CSS handles the fade/slide
- **Count-up:** `useCountUpRef` mutates `textContent` directly on every animation frame (avoids React re-renders)
- **Ticker:** pure CSS `animation: ticker-anim` infinite loop
- **Hover effects:** pure CSS `transition`

---

## 6. Design System

All design tokens are CSS custom properties defined at the top of `globals.css`.

### Colours

| Token | Value | Use |
|---|---|---|
| `--blue` | `#0C3C8F` | Primary brand — nav, stats band, footer |
| `--blue-deep` | `#082A66` | Hover states on blue surfaces |
| `--red` | `#D32027` | CTAs, kicker squares, accents, required markers |
| `--ink` | `#0B1B33` | Body text, dark sections |
| `--ink-70` | `rgba(11,27,51,.7)` | Secondary text |
| `--ink-50` | `rgba(11,27,51,.5)` | Placeholder, muted |
| `--paper` | `#F5F4F0` | Page background |
| `--card` | `#FFFFFF` | Card surfaces |
| `--line` | `rgba(11,27,51,.16)` | Borders, dividers |
| `--line-soft` | `rgba(11,27,51,.09)` | Subtle separators |

### Typography

| Variable | Font | Weights | Use |
|---|---|---|---|
| `--f-display` | Archivo | 500–900 | Headings, hero, brand name |
| `--f-body` | IBM Plex Sans | 400–700 | All body copy |
| `--f-mono` | IBM Plex Mono | 400–600 | Kickers, labels, codes, GST number |

### Layout

- Max content width: `1160px` (`--wrap`)
- Base padding: `20px` (`--pad`)
- Border radius: **0px everywhere** — the industrial sharp-edge aesthetic is intentional

### Visual signatures (do not change these)

- **JBE tile** — 42×42px blue square, white "JBE", red CSS triangle top-right corner
- **Kicker labels** — mono uppercase, red `■` prefix injected via CSS `::before`, `0.18em` letter-spacing
- **Metal swatches** — CSS gradient per metal (AL/CU/BR), grain overlay, hover sheen
- **Sharp edges** — zero border-radius across the entire site

---

## 7. Content Editing

All content is in [`src/data/content.ts`](src/data/content.ts). You do not need to touch any component files to update:

- Company name, GST, phone, address → `company` object
- Animated counters → `stats` array
- Metal materials and grades → `materials` array
- Process steps → `processSteps` array
- About section timeline → `timeline` array
- Navigation links → `navLinks` array
- Footer contact rows → `contactRows` array
- Contact form role dropdown → `roleOptions` array

### Adding a new stat

```ts
// src/data/content.ts
export const stats = [
  { value: 28, suffix: "", unit: "YRS", label: "In the trade" },
  // add a new entry here — the Stats component maps over this array
  { value: 500, suffix: "+", unit: "MT", label: "Processed monthly" },
];
```

### Updating the phone number

Change both `phone` (display format) and `phoneTel` (E.164 format for `tel:` links) in the `company` object.

---

## 8. Environment Variables

None required currently. When added (e.g. contact form email service, future API routes):

1. Create `.env.local` in the project root (already in `.gitignore` — never commit this)
2. Add the key to Vercel dashboard under **Settings → Environment Variables**
3. Document the key name below (never the value)

| Key | Purpose | Required |
|---|---|---|
| *(none yet)* | | |

---

## 9. Deployment

Deployment is fully automatic via Vercel.

| Branch | Behaviour |
|---|---|
| `main` | Auto-deploys to production: https://jbe-one.vercel.app |
| Any other branch / PR | Gets a unique preview URL (e.g. `jbe-abc123.vercel.app`) |

**To deploy:** merge your PR to `main`. That's it.

### Manual production deploy (emergency only)

```bash
npm run build   # verify it builds locally first
git push origin main
```

### Custom domain

When `jbhawanienterprises.in` is purchased:
1. Add it in Vercel dashboard → **Domains**
2. Point DNS as instructed by Vercel
3. Update `BASE_URL` in `src/app/sitemap.ts`
4. Update `Sitemap:` in `public/robots.txt`
5. Update the `openGraph.url` in `src/app/layout.tsx`

---

## 10. Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. Quick reference:

### Branch naming

```
feature/<name>   → new features          e.g. feature/rate-estimator
fix/<name>       → bug fixes             e.g. fix/mobile-nav-overlap
setup/<name>     → infra / config        e.g. setup/email-integration
```

### Workflow

1. Branch off `main`
2. Make your changes
3. Run `npm run lint && npm run type-check` locally — CI will block merge if either fails
4. Open a PR → CI runs automatically
5. Get a review → merge to `main` → auto-deploys

### Code rules (enforced)

- All content from `src/data/content.ts` — never hardcode in JSX
- CSS custom properties — never raw hex in component files
- `next/image` for all images — never `<img>`
- TypeScript strict — no `any`
- Mobile-first CSS — base styles mobile, scale up with `@media (min-width: ...)`
- 44px minimum touch targets on all interactive elements

---

## 11. Roadmap

See [ROADMAP.md](ROADMAP.md) for full detail.

| Phase | Feature | Status |
|---|---|---|
| 1 | Marketing website | ✅ Live |
| 2 | Scrap rate estimator | 🔲 Planned |
| 3 | Operations digitisation | 🔲 Planned |
| 4 | Export portal | 🔲 Future |

---

*Jai Bhawani Enterprises · M-61, MIDC Ambad, Nashik 422010 · Est. 1998 · GST: 27ADGPC2741P1ZE*
