# Jai Bhawani Enterprises — Website

> Corporate brochure website for **Jai Bhawani Enterprises (JBE)**, a family-owned non-ferrous scrap trading business established in 1998, based in Nashik, Maharashtra, India.

**Live site:** `hemantsinghcr7.github.io/JBE` *(once GitHub Pages is enabled)*  
**Domain (planned):** `jbhawanienterprises.in`

---

## About the Project

This is a single-page, fully static brochure website built to establish JBE's online presence and generate inbound inquiries from buyers, sellers, and potential export partners. It was designed and built from scratch with no frameworks or build tools — just HTML, CSS, and vanilla JavaScript.

**Business:** Jai Bhawani Enterprises  
**GST:** 27ADGPC2741P1ZE  
**Address:** M-61, MIDC Ambad, Nashik 422010, Maharashtra, India  
**Phone:** +91 80438 37022  

---

## Tech Stack

- **HTML5** — semantic landmarks, accessible markup
- **CSS3** — custom properties, CSS Grid, Flexbox, `clamp()` fluid sizing
- **Vanilla JavaScript** — IIFE, IntersectionObserver, no dependencies
- **Google Fonts** — Archivo (display) + IBM Plex Sans (body) + IBM Plex Mono (labels/data)
- **Deployment** — GitHub Pages / Netlify (zero config, static files)

---

## File Structure

```
JBE/
├── index.html      # All page sections in one file
├── styles.css      # Full design system + component styles
├── script.js       # All interactions (nav, counters, form, scroll)
└── README.md       # This file
```

---

## Page Sections

| Section | Anchor | Description |
|---|---|---|
| Top strip | — | Address, GST number, EST. 1998 |
| Sticky nav | — | Logo, links, mobile drawer |
| Hero | `#home` | H1, CTAs, spec card visual |
| Stats band | — | 4 animated counters |
| About | `#about` | Company story, values |
| Materials | `#materials` | Aluminium, Copper, Brass cards |
| Process | `#process` | Buy → Process → Supply steps |
| Export callout | — | International expansion band |
| Contact | `#contact` | Info + inquiry form |
| Footer | — | Links, address, copyright |

---

## Design System

| Token | Value | Use |
|---|---|---|
| `--blue` | `#0C3C8F` | Primary brand, headings, surfaces |
| `--red` | `#D32027` | CTAs, accents |
| `--ink` | `#0B1B33` | Body text, dark sections |
| `--bg` | `#F6F7F9` | Page background |
| `--font-display` | Archivo 800–900 | Headings |
| `--font-body` | IBM Plex Sans | Body text |
| `--font-mono` | IBM Plex Mono | Labels, data, kickers |

---

## Running Locally

No build step needed. Just open the folder in VS Code and use Live Server:

```bash
# Option 1 — VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Option 2 — Python (if installed)
python -m http.server 8000
# Then open http://localhost:8000
```

---

## Deployment

### GitHub Pages
1. Push all files to the `main` branch
2. Go to repo → **Settings → Pages**
3. Source: `main` branch, folder: `/ (root)`
4. Site will be live at `https://hemantsinghcr7.github.io/JBE`

### Netlify (recommended for custom domain)
1. Drag and drop the project folder onto [netlify.com/drop](https://netlify.com/drop)
2. Or connect the GitHub repo for auto-deploy on every push
3. Add custom domain (`jbhawanienterprises.in`) in Netlify settings

---

## Pending Tasks (before going live)

### 🔴 Must-do
- [ ] **Fix `Processed.` colour in hero H1** — currently orange (`rgb(211,135,32)`), should be `var(--red)` (`#D32027`)
- [ ] **Real email address** — replace `info@jbhawanienterprises.in` placeholder with live address in contact section and footer
- [ ] **Connect contact form** — currently in demo mode (no emails sent). Options:
  - [Formspree](https://formspree.io): set `<form action="https://formspree.io/f/XXXX">`, remove `e.preventDefault()` in `script.js`
  - [EmailJS](https://emailjs.com): keep client-side, use their SDK

### 🟡 Should-do
- [ ] **Real photos** — replace all striped `.ph` placeholders with optimised WebP images:
  - Hero spec card — scrap yard / baled aluminium (4:3)
  - Materials × 3 — aluminium, copper, brass photos (16:11)
- [ ] **Google Map embed** — replace map placeholder in contact section with an actual iframe embed for M-61, MIDC Ambad, Nashik
- [ ] **Favicon** — add JBE monogram favicon (blue tile, white JBE, red corner) to `<head>`
- [ ] **Fix `aria-expanded`** — burger button `aria-expanded` should toggle `true`/`false` in `script.js` `openMenu()`/`closeMenu()` for accessibility

### 🟢 Nice-to-have
- [ ] `og:image` meta tag (1200×630 social share image)
- [ ] JSON-LD `LocalBusiness` structured data (name, address, phone, GST, geo)
- [ ] `sitemap.xml` and `robots.txt`
- [ ] Custom domain setup (`jbhawanienterprises.in`, ~₹800–1500/yr via GoDaddy/Namecheap)

---

## Known Issues

| Issue | Location | Fix |
|---|---|---|
| `Processed.` is orange not red | `index.html` line 81 | Remove inline `style` from the `<span class="rd">` element |
| `aria-expanded` not toggled | `script.js` `openMenu`/`closeMenu` | Add `burger.setAttribute('aria-expanded', 'true'/'false')` |
| Contact form sends no email | `script.js`, form section | Integrate Formspree or EmailJS |

---

## Credits

**Designed & built by:** Hemant Singh  
**Business:** Jai Bhawani Enterprises, Nashik — Est. 1998  
