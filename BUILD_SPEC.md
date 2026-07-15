# Build Spec — Jai Bhawani Enterprises Website

**Project:** JBE Corporate Website (Version 1.0)
**Type:** Single-page brochure website
**Owner:** Hemant Singh · Jai Bhawani Enterprises, Nashik, India
**Goal:** A fast, professional, mobile-first single-page site that establishes credibility for a 25-year-old non-ferrous scrap trading business and generates inbound inquiries.

> Hand this document to Claude Code. It is a complete, self-contained specification — design system, content, structure, interactions, and deployment. Build it exactly as described unless noted as a decision point.

---

## 1. Tech Stack & Constraints

- **Plain HTML5, CSS3, and vanilla JavaScript.** No frameworks, no build step, no bundler.
- **Three files only:** `index.html`, `styles.css`, `script.js`.
- **No dependencies** except Google Fonts (loaded via `<link>`).
- Must be deployable as static files to **GitHub Pages / Netlify** with zero configuration.
- **Mobile-first and fully responsive** (many users browse on mobile in India).
- **Fast:** keep assets minimal, no heavy images, lazy-load any photos added later.
- **Accessible:** semantic landmarks (`header`, `nav`, `section`, `footer`), `aria-label`s on icon buttons, visible focus states, `prefers-reduced-motion` respected.

---

## 2. Brand & Design System

### 2.1 Color tokens (define as CSS custom properties on `:root`)

| Token | Value | Use |
|---|---|---|
| `--blue` | `#0C3C8F` | Primary brand blue — headings accents, stats band, primary surfaces |
| `--blue-700` | `#0A327A` | Blue hover |
| `--blue-900` | `#07224F` | Deep blue (export gradient) |
| `--red` | `#D32027` | Brand red — CTAs, accents, ticks |
| `--red-700` | `#B41A20` | Red hover |
| `--ink` | `#0B1B33` | Near-black navy — body text, dark sections (topbar, footer) |
| `--ink-soft` | `#2C3A52` | Secondary text |
| `--muted` | `#5E6B82` | Tertiary text, labels |
| `--line` | `#D7DCE5` | Borders |
| `--line-soft` | `#E7EAF0` | Subtle borders/dividers |
| `--bg` | `#F6F7F9` | Page background (cool neutral white) |
| `--bg-2` | `#EEF1F6` | Alt background, chips |
| `--white` | `#FFFFFF` | Cards, white sections |
| `--steel` | `#DCE1E9` | Placeholder stripe tone |

**Rule:** Blue and red on white only. Red is reserved for CTAs and small accents — never large red fills except the diagonal-stripe motif. No other hues.

### 2.2 Typography (Google Fonts)

```
https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap
```

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Archivo** (800–900) | Heavy, slightly industrial. Tight letter-spacing `-0.015em` to `-0.025em`. Line-height ~1.0 for big headlines. |
| Body | **IBM Plex Sans** (400–700) | Base size 17px, line-height 1.6. |
| Labels / data / "spec sheet" | **IBM Plex Mono** (400–600) | Uppercase, letter-spacing ~0.1em. Used for kickers, GST number, stat labels, address, form labels. This mono treatment is core to the industrial feel — do not drop it. |

### 2.3 Layout & spacing

- Content container: `max-width: 1180px`, centered, horizontal padding `clamp(20px, 5vw, 56px)`.
- Section vertical padding: `clamp(64px, 9vw, 120px)` (tight variant `clamp(48px, 6vw, 80px)`).
- **Corner radius: 3px** (sharp/industrial — never rounded/pill except small chips & the eyebrow pill).
- Shadows: subtle. `--shadow: 0 1px 2px rgba(11,27,51,.04), 0 8px 24px rgba(11,27,51,.06)`; `--shadow-lg: 0 18px 50px rgba(11,27,51,.14)`.

### 2.4 Recurring visual motifs (build these as reusable patterns)

1. **Section kicker** — mono uppercase label with a leading 9px red square and a numeric index, e.g. `■ 01 / ABOUT US`. Blue text, muted index.
2. **Blueprint grid** — faint 44px CSS grid (two linear-gradients) behind the hero, radially masked so it fades out.
3. **Striped placeholder** (`.ph`) — `repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--steel) 12px 24px)` with a centered mono caption in a white pill describing the intended photo (e.g. "PHOTO — aluminium scrap"). Use everywhere a real image will later go.
4. **Diagonal hazard stripes** — red repeating-linear-gradient at low opacity as a decorative corner element in the export band.
5. **Logo monogram tile** — blue rounded `4px` square (46×46), white "JBE" in Archivo 900, plus a small red triangle in the top-right corner (CSS border trick). Reused in nav, footer, about signature.

---

## 3. Page Structure (single page, top to bottom)

All sections live in one `index.html`. Nav links scroll to anchor IDs: `#home`, `#about`, `#materials`, `#process`, `#contact`.

### 3.1 Top strip (`.topbar`) — dark navy bar
- Left: red dot + `M-61, MIDC Ambad, Nashik 422010` · `GST 27ADGPC2741P1ZE` (GST bold).
- Right: `EST. 1998 · NON-FERROUS METAL SCRAP` (hide on screens < 760px).
- Mono font, 12.5px.

### 3.2 Sticky nav (`.nav`)
- Sticky to top, `z-index: 60`, translucent white with `backdrop-filter: blur`. Adds a shadow + more opaque background once scrolled (`is-stuck` class toggled in JS at `scrollY > 8`).
- Left: logo tile + two-line brand text ("Jai Bhawani Enterprises" / mono "NON-FERROUS SCRAP · NASHIK").
- Center: nav links (Home, About, Materials, Process, Contact). Active link gets blue text + a red 2px underline (driven by scroll-spy).
- Right: red **"Get in Touch"** button.
- **< 940px:** hide links + button, show a hamburger button that opens a right-side drawer.

### 3.3 Mobile drawer (`.mobile-menu`) + scrim
- Slides in from the right (`translateX`), `z-index: 70`, with a dimming scrim behind.
- Large Archivo links, a close (×) button, and a red CTA at the bottom.
- Closes on: link click, scrim click, × click, `Escape` key. Locks body scroll while open.

### 3.4 Hero (`#home`, `.hero`)
- Two-column grid (`1.05fr / .95fr`), collapses to one column < 900px (visual moves above text).
- Blueprint-grid background (masked).
- **Left:** pill eyebrow `Established 1998 · Nashik, India` (red "1998") → H1 → subhead → two CTAs → mono meta row.
  - **H1 (exact):** `Non-ferrous scrap.` / `Sourced.` (blue) `Processed.` (red) `Supplied.` — line breaks as shown. `clamp(40px, 6.6vw, 76px)`, weight 900.
  - **Subhead:** "For over 25 years, Jai Bhawani Enterprises has bought, processed and supplied aluminium, copper and brass scrap to manufacturers across Maharashtra, Gujarat and Delhi."
  - **CTAs:** blue "Start an inquiry →" (to `#contact`), ghost "View materials" (to `#materials`).
  - **Meta row (mono):** `25+ years trading` · `3 states supplied` · `2 processing sites` (numbers bold).
- **Right:** a bordered "spec card" — header row (`JBE · Ambad Yard` / `Operational` with red dot) → striped photo placeholder (4:3.1) → 3-cell strip (`Al / Aluminium`, `Cu / Copper`, `Br / Brass`). A small dark floating tag pinned bottom-left: red square + "Own transport · **3 trucks**".

### 3.5 Stats band (`.stats`) — solid blue
- Full-width blue section with faint vertical pinstripe overlay.
- 4-column grid (→ 2 cols < 820px → 1 col < 420px).
- Each stat: big Archivo number (white) with a JS count-up animation, a light-blue label, and a small red tick underline.
- **Stats (exact):**
  1. `25+` — Years in the non-ferrous trade
  2. `2` — Processing & storage sites in Nashik
  3. `3` — States supplied — Maharashtra, Gujarat, Delhi
  4. `25` — Skilled workers & an owned truck fleet

### 3.6 About (`#about`, `.about`)
- Two-column grid (collapses < 860px).
- **Left:** kicker `01 / About Us` → H2 "A family business built on metal, trust and time." → lead paragraph → two body paragraphs → signature block (small logo tile + "Hemant Singh" / mono "Jai Bhawani Enterprises · Nashik").
  - **Copy:**
    - Lead: "Jai Bhawani Enterprises began in 1998 in Nashik as a family-run scrap trading business. More than two decades later, the same family still runs it — and the same principles still guide it."
    - P2: "We buy non-ferrous scrap from local traders and industries, process and grade it at our own yards, and supply clean, sorted material to manufacturers who depend on consistency. No middlemen, no surprises — just metal delivered the way it was promised."
    - P3: "Over the years we've grown from a small trading operation into a business running two sites, a team of skilled workers, and our own fleet of trucks. We've stayed deliberately hands-on, because in this trade your word and your grading are everything."
- **Right:** three "value" cards (number + title + description), then a 3-cell ops strip.
  - **Values:** `01 Reliability` — "We deliver the grade, the volume and the timing we commit to — order after order, year after year." · `02 Long-term relationships` — "Many of our buyers and suppliers have worked with us for over a decade. We trade for the next deal, not the last one." · `03 Quality & honest grading` — "Material is sorted and graded at our own yards, so what you order is what arrives at your gate."
  - **Ops strip:** `2 Owned sites` · `25 Workers` · `3 Owned trucks`.
- Cards lift slightly and gain a blue border on hover.

### 3.7 Materials (`#materials`, `.materials`) — white section
- Section head: kicker `02 / Materials We Deal In` → H2 "Three metals. Every grade that matters." → intro line.
- 3-column card grid (→ 2 cols < 880px → 1 col < 560px). Each card: striped photo placeholder → mono tag → H3 → description → grade chips (mono pills). Hover: lift + blue border.
  - **Aluminium** — tag `Non-Ferrous · Al`. "Our largest line. We handle a full spread of aluminium scrap, from clean casting and extruded sections to machine turnings and used beverage cans." Chips: Casting · Section / Extrusion · Turnings · Beer cans (UBC).
  - **Copper** — tag `Non-Ferrous · Cu`. "High-value copper scrap sorted by grade and purity — from bright wire and heavy cuttings to mixed and tinned copper for re-melt." Chips: Bright wire · Heavy / millberry · Mixed copper.
  - **Brass** — tag `Non-Ferrous · Br`. "Clean and mixed brass scrap supplied to foundries and component makers — honest, properly sorted material ready for casting." Chips: Honey brass · Mixed brass · Turnings.
- Below grid: a dashed-border note — blue square + "Looking for a grade not listed here? **We very likely handle it.** Tell us your specification and volume, and we'll confirm availability and pricing."

### 3.8 Process (`#process`, `.process`)
- Section head: kicker `03 / Our Process` → H2 "Buy. Process. Supply." → intro line.
- 3-column grid (→ 1 col < 860px). Each card has a colored top bar (blue / red / ink), a corner icon box, mono step label, large outlined number (text-stroke), H3, description.
  1. **Buy** — "We source non-ferrous scrap directly from local traders, industries and corporate sellers — with fair, transparent rates and prompt payment."
  2. **Process** — "At our own yards, material is sorted, cleaned, segregated and graded by type and purity — turning mixed scrap into clean, consistent feedstock."
  3. **Supply** — "Graded material is loaded onto our own trucks and delivered to manufacturers across Maharashtra, Gujarat and Delhi — on time, to spec."
- Dark footer bar: "**End to end, under one roof.** Owning our processing yards and our truck fleet means fewer handoffs, tighter quality control and supply you can plan around." + white "Discuss your requirement →" button (to `#contact`).

### 3.9 Export callout (`.export`) — blue gradient band
- Diagonal blue gradient with a faint red hazard-stripe corner.
- Left: kicker `↗ / Now Expanding` → H2 "Building supply relationships for export markets." → "With 25+ years of grading and supply experience, full GST registration and verifiable scale, JBE is opening conversations with international buyers and trading partners — including Australia."
- Right: red "Partner with JBE →" button (to `#contact`).
- Collapses to one column < 760px.

### 3.10 Contact (`#contact`, `.contact`) — white section
- Two-column grid (collapses < 860px).
- **Left — contact info:** kicker `04 / Contact` → H2 "Let's talk metal." → intro line → a definition list of rows:
  - Address — `M-61, MIDC Ambad,` / `Nashik 422010, Maharashtra, India`
  - Phone — `+91 80438 37022` (tel: link) / sub "Mon–Sat · 9:30am – 7:00pm IST"
  - Email — `info@jbhawanienterprises.in` (mailto:) / sub "Add your live address before going live" *(DECISION POINT — replace with real email)*
  - GST No. — `27ADGPC2741P1ZE` in a mono badge
  - Then a striped map placeholder ("MAP — MIDC Ambad, Nashik (embed Google Map)").
- **Right — form card** (`#inquiry-form`):
  - Header: "Send an inquiry" + mono "We reply within 1 business day".
  - A hidden success banner (`.form-ok`) shown after submit.
  - Fields: **Name*** + **Company** (row), **Email** + **Interest** select (row), **Message*** (textarea). Mono uppercase labels; required fields marked with red `*`.
  - Interest select options: "Buy scrap from JBE", "Sell scrap to JBE", "Explore an export partnership", "Something else".
  - Submit: red "Send inquiry" + note "Or call us directly at +91 80438 37022."

### 3.11 Footer (`.footer`) — dark navy
- Top: 3-column grid (→ 1 col < 760px). Brand block (logo + blurb), "Navigate" link column, "Reach Us" column (address, phone, email, GST).
  - Blurb: "A family-owned non-ferrous scrap trading business — buying, processing and supplying aluminium, copper and brass since 1998."
- Bottom bar (mono): "© {year} Jai Bhawani Enterprises. All rights reserved." + "Non-Ferrous Scrap Trading" · "Nashik · Maharashtra · India". Year injected by JS.

### 3.12 Back-to-top button (`.totop`)
- Fixed bottom-right blue circle, appears after `scrollY > 600`, scrolls to top smoothly.

---

## 4. JavaScript Behavior (`script.js`, vanilla, IIFE)

1. **Sticky-nav shadow** — toggle `is-stuck` on `.nav` at `scrollY > 8`; toggle `.totop` `show` at `scrollY > 600`. Passive scroll listener.
2. **Mobile menu** — open/close drawer + scrim + hamburger animation; lock body scroll; close on link/scrim/×/Escape.
3. **Scroll-spy** — `IntersectionObserver` over the 5 sections (`rootMargin: "-45% 0px -50% 0px"`) sets the `.active` nav link.
4. **Reveal-on-scroll** — elements with `.reveal` fade/translate up when they enter view (`IntersectionObserver`, unobserve after). Disabled under `prefers-reduced-motion`.
5. **Stat counters** — elements with `data-count` count up with an ease-out cubic over ~1.4s when scrolled into view; format with `toLocaleString("en-IN")`.
6. **Contact form** — client-side validation: Name and Message required; Email validated only if filled (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Invalid fields get `.invalid` (red border + error text). On success show `.form-ok` banner, clear fields, flip button to "Sent ✓" for 4s. **Currently `preventDefault` demo mode** — see §5.
7. **Footer year** — inject `new Date().getFullYear()`.

> **Important:** Do **not** use `scrollIntoView` anywhere — use `window.scrollTo({ top, behavior: 'smooth' })`. Use CSS `scroll-behavior: smooth` + `scroll-padding-top: 88px` for anchor nav.

---

## 5. Contact Form — Going Live (DECISION POINT)

The form ships in **demo mode** (JS intercepts submit, shows a success message, sends nothing). To make it live, pick one:

- **Formspree (recommended):** create a form, set `<form action="https://formspree.io/f/XXXX" method="POST">`, give each field a `name`, and **remove the `e.preventDefault()` demo handler** (or POST via `fetch` and keep the in-page success banner). Add a honeypot field for spam.
- **EmailJS:** keep it client-side; send via their SDK on submit.

Keep the existing client-side validation either way.

---

## 6. Assets To Supply (placeholders today)

Replace every striped `.ph` placeholder with a real, optimized image (WebP, lazy-loaded):

| Location | Needed asset |
|---|---|
| Hero spec card | Scrap yard / baled aluminium photo (4:3) |
| Materials ×3 | Aluminium, copper, brass photos (16:11) |
| Contact | Embedded Google Map of M-61, MIDC Ambad, Nashik |
| Browser tab | `favicon` derived from the JBE monogram (blue tile, red corner) |
| Social share | `og:image` (1200×630) |

Until supplied, keep the striped placeholders with mono captions — they read as intentional, not broken.

---

## 7. SEO & Meta (already specified — keep)

- `<title>`: "Jai Bhawani Enterprises — Non-Ferrous Scrap Trading · Nashik, India"
- Meta description, `theme-color #0C3C8F`, Open Graph title/description/type.
- Add later: `LocalBusiness` JSON-LD (name, address, phone, GST, geo), `og:image`, canonical URL, `sitemap.xml`, `robots.txt`.
- Suggested domain: `jbhawanienterprises.in` or `jai-bhawani.com`.

---

## 8. Responsive Breakpoints (summary)

| Width | Changes |
|---|---|
| < 940px | Nav links + button hidden → hamburger; drawer enabled |
| < 900px | Hero → single column (visual on top) |
| < 880px | Materials → 2 columns; About → 1 column (at 860) |
| < 860px | Process → 1 column; Contact → 1 column |
| < 820px | Stats → 2 columns |
| < 760px | Top strip right text hidden; export + footer → 1 column |
| < 560px | Materials → 1 column |
| < 480px | Form rows → 1 column; contact rows stack |
| < 420px | Stats → 1 column |

---

## 9. Out of Scope (V1 — do not build)

Online pricing/rate calculator · customer login/portal · inventory integration · blog/news · live chat. (Future versions only.)

---

## 10. Acceptance Criteria

- [ ] Loads as 3 static files with no console errors; works offline-capable except fonts.
- [ ] A first-time visitor understands what JBE does within ~60 seconds.
- [ ] All five nav anchors scroll smoothly; active link tracks scroll position.
- [ ] Fully usable and legible on a 360px-wide phone; hamburger drawer works.
- [ ] Form validates required fields and a malformed email; shows success state.
- [ ] No layout shift from the sticky nav; `prefers-reduced-motion` disables animations.
- [ ] Blue/red-on-white palette only; Archivo + IBM Plex Sans/Mono throughout.
- [ ] Lighthouse: Performance & Accessibility ≥ 90 on mobile.

---

*Jai Bhawani Enterprises — Nashik, India. Est. 1998. GST: 27ADGPC2741P1ZE · +91 80438 37022*
