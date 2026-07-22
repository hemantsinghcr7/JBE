# Contributing to JBE Website

This document is for anyone working on the JBE website codebase — whether you're a full-time developer, a contractor, or the owner making a quick content update.

---

## Getting set up

See the [Getting Started](README.md#3-getting-started) section in the README. You need Node.js ≥ 20 and npm ≥ 10.

```bash
npm install
npm run dev    # http://localhost:3000
```

---

## Branching

We use a simple branch-per-task model. Always branch off `main`.

```
feature/<name>   new functionality       feature/rate-estimator
fix/<name>       bug fixes               fix/mobile-nav-overlap
setup/<name>     infra, config, CI       setup/email-integration
content/<name>   text or data updates    content/update-grades
```

Branch names are lowercase and hyphenated. No underscores. No personal names in branch names.

---

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/). One line summary, imperative mood, under 72 characters.

```
feat: add rate estimator section
fix: correct scroll-padding-top offset for sticky nav
content: update aluminium grades in content.ts
chore: add Prettier config
docs: rewrite README for Next.js stack
```

Types: `feat`, `fix`, `content`, `style`, `refactor`, `chore`, `docs`, `ci`.

---

## Pull request process

1. **Branch off `main`** — never commit directly to `main`
2. **Keep PRs focused** — one feature or fix per PR; easier to review and revert
3. **Check CI passes** — the CI job runs lint + type-check + build automatically on every PR; a failing CI blocks merge
4. **Self-review first** — read your own diff before requesting a review
5. **Write a clear PR title** — same format as commit messages
6. **Merge via squash** — squash commits when merging so `main` history stays readable

---

## Code standards

### TypeScript

- `strict: true` is enforced — no `any`, no `ts-ignore` without a comment explaining why
- Run `npm run type-check` locally before pushing

### Linting & formatting

- ESLint rules come from `next/core-web-vitals` and `next/typescript`
- Prettier handles formatting — run `npm run format` before committing, or configure your editor to format on save
- Run `npm run lint` locally before pushing

### Component rules

| Rule | Why |
|---|---|
| All content from `src/data/content.ts` | One place to find every business fact; no hunting through JSX |
| CSS custom properties — never raw hex | Rebranding means changing one file, not grep-replacing hex codes |
| `next/image` for all images | Automatic WebP conversion, lazy loading, no layout shift |
| `next/font` for fonts | Zero layout shift; no render-blocking external stylesheets |
| Server components by default | Faster pages; only add `"use client"` when you need browser APIs or state |
| Mobile-first CSS | Base styles target mobile; `@media (min-width: ...)` enhances upward |
| 44px minimum touch targets | WCAG 2.5.5 — users on phones with large fingers need reachable targets |
| No `border-radius` | The sharp industrial aesthetic is intentional — do not soften it |

### Adding a new section

1. Create `src/components/sections/MySection.tsx`
2. Add any content it needs to `src/data/content.ts`
3. Add its CSS to `src/app/globals.css` under a clearly labelled comment block
4. Import and place it in `src/app/page.tsx`
5. If it needs a nav link, add it to `navLinks` in `content.ts` and ensure the section has a matching `id` attribute

### Adding a new page (future)

1. Create `src/app/my-page/page.tsx`
2. Export metadata from it (title, description, openGraph)
3. Add the URL to `src/app/sitemap.ts`

---

## Testing

There are currently no automated tests (tracked in ROADMAP.md tech-debt). When Vitest + Testing Library is set up, add a test for any new hook or utility you write.

Until then: **manually verify on both mobile and desktop** before opening a PR. Use Chrome DevTools device emulation at 375px width for mobile.

---

## Questions

Reach out to Hemant Singh (hemantsinghcr7@gmail.com) — project owner and lead developer.
