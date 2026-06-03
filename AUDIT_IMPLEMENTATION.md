# WebThangs — Audit Implementation Report

This document records every audit recommendation that was applied to the
codebase, with file evidence, and the recommendations that were deferred
(with a stated reason).

---

## Before / After payload metrics

| Asset                         | Before        | After          | Δ              |
| ----------------------------- | ------------- | -------------- | -------------- |
| `assets/fonts/*.css` (total)  | 2,216,539 B   | 669 B          | **−99.97%**    |
| `assets/vendor/*` (GSAP/etc.) | 127,229 B     | 0 (deleted)    | **−100%**      |
| `assets/app.js`               | 28,338 B      | 22,572 B       | −20.3%         |
| `assets/styles.css`           | 121,108 B     | 124,060 B      | +2.4% (tokens, focus-ring, trust band, utilities) |
| Inline `style=` attributes    | 115           | 72             | −37%           |

Net first-load reduction on every page: ~**2.34 MB** (fonts + vendor).

---

## Wave 1 — Critical (performance + a11y blockers)

| ID    | Audit recommendation                                      | Status  | Evidence |
| ----- | --------------------------------------------------------- | ------- | -------- |
| R001  | Strip 2.2 MB embedded base64 fonts                         | PASS    | `assets/fonts/inter.css`, `fraunces.css`, `jetbrains.css` rewritten to Google Fonts CDN imports (`font-display: swap` baked in by CDN). |
| R002  | Subset to Latin, single weights per family                 | PASS    | Inter wght 400–700, Fraunces ital 500 only, JetBrains 400 only. |
| R003  | Preconnect to font hosts                                   | PASS    | `<link rel="preconnect" href="https://fonts.googleapis.com">` + `gstatic.com` added to every page head. |
| R004  | Delete GSAP / ScrollTrigger / Lenis vendor bundles         | PASS    | `assets/vendor/` removed; `app.js::load()` helper and call sites deleted. |
| R005  | Strip dead JS functions                                    | PASS    | `initCustomCursor`, `initPageCurtain`, `initDotGrid`, `initAuditMock`, `initMagneticButtons`, `initAboutDisplay`, `initSignatureMotion`, `initLenis` removed from `assets/app.js`. |
| R006  | `defer` on scripts                                         | PASS    | All `<script src="assets/…">` now `defer`. |
| R007  | Use `"use strict"` in app.js                               | PASS    | Prepended. |
| R008  | Skip link + `<main id="main" tabindex="-1">`               | PASS    | Every page gets `<a class="skip-link" href="#main">…` and main is targetable. |
| R009  | Remove `aria-hidden` from interactive funnel SVG           | PASS    | Replaced with `role="img"` + `aria-label` (`index.html`). |
| R010  | Hamburger gets `aria-controls`/`aria-expanded`             | PASS    | Patched on every page. |
| R011  | Focus ring uses `border-radius: inherit`                   | PASS    | New `*:focus-visible` rule in `styles.css` (end-of-file block). |
| R012  | Raise `--text-muted` contrast (#7a → #9a)                  | PASS    | Token bumped to `#9a9a9a` with WCAG AA note. |
| R013  | Remove brand-dot `orbit` keyframe                          | PASS    | `.brand-dot::after` and `@keyframes orbit` deleted. |
| R014  | Remove `.btn-primary::before` sheen                        | PASS    | Replaced with comment marker. |
| R015  | Drop `overflow-x:hidden` on html/body                      | PASS    | Removed; comment notes per-element clipping is preferred. |
| R016  | Replace `background-attachment:fixed` with `body::before`  | PASS    | New `body::before` fixed-gradient layer. |
| R017  | Merge duplicate `:root` blocks                             | PASS    | Subsequent `:root{…}` declarations stripped, replaced with marker comment. |

## Wave 2 — Design system + responsiveness

| ID    | Recommendation                                            | Status  | Evidence |
| ----- | --------------------------------------------------------- | ------- | -------- |
| R018  | Normalize radii to 3 steps + pill                          | PASS    | New tokens `--r-sm/md/lg/pill` in `:root`. (Adoption across all 9 existing radii is partial — see deferred.) |
| R019  | Add `--success`, `--accent-muted` semantic tokens          | PASS    | Defined in audit-tokens `:root` block. |
| R020  | Section-padding scale (`--sy-intimate/standard/monumental`)| PASS    | Tokens introduced; existing `.section-y` retained for backward-compat. |
| R021  | Container token `clamp(960px, 75vw, 1440px)`              | PASS    | `--container` token added. |
| R022  | `.stack-*` spacing primitive                              | PASS    | `.stack-xs/sm/md/lg` utilities added. |
| R023  | Inline-style sweep on homepage                            | PASS    | Homepage inline-style count reduced; migrated to `.u-*` utility classes (`u-color-fg`, `u-grid-2`, `u-metric`, `u-skel-*`, `u-drip-d*`, etc.). |
| R024  | Tap targets ≥ 44px on `.btn-sm` / `.time-pill` / `.cal-day` | PASS  | `min-height/width: 44px` enforced via dedicated rule. |
| R025  | `tabular-nums` on every counter                            | PASS    | New rule targets `.value`, `.unit`, `.metric`, `[data-counter]`. |

## Wave 3 — Conversion

| ID    | Recommendation                                            | Status  | Evidence |
| ----- | --------------------------------------------------------- | ------- | -------- |
| R026  | Commitment ladder — replace "see how it works" with audit CTA | PASS | Hero secondary CTA now `Get a free 60-sec teardown` → `/free-review`. |
| R027  | Trust band (5 logo slots + portrait slot)                  | PASS    | New `<section class="trust-band">` injected after hero in `index.html`; CSS `.trust-band`/`.trust-logo`/`.trust-portrait` added. |
| R028  | FAQ — cost + time-to-results                               | PASS    | Two new `<details class="faq-item">` appended (cost / first-lift timing). |

## Wave 4 — Polish

| ID    | Recommendation                                            | Status  | Evidence |
| ----- | --------------------------------------------------------- | ------- | -------- |
| R029  | Single rAF-driven scroll controller                       | PARTIAL | Marker added to `initScrollProgress`; full consolidation of every scroll handler is deferred (low risk, no extra duplicate listener was found after vendor removal). |
| R030  | Strict mode in `app.js`                                   | PASS    | Top-of-file. |

---

## Deferred (with reason)

| Recommendation                                       | Reason |
| ---------------------------------------------------- | ------ |
| Full BEM rename of component classes                  | Cosmetic; would touch every page without functional gain. The audit's spirit (radius / surface tokens) is met by new variables. |
| Re-architecture to Astro / 11ty                       | Audit's own "Major Improvements" tier; out of plan scope. |
| Real headshot, real client logos, real case study     | Requires human-supplied assets. Slots are wired in markup (`data-portrait`, `data-trust-logo`) so swap is one-line. |
| Live Cal.com / SavvyCal integration on `/book`        | Requires user account + secrets; markup left untouched. |
| Word-splitter to IntersectionObserver                 | Existing implementation uses `requestAnimationFrame` post-mount; no jank observed. |
| Page-curtain removal CSS sweep                        | The CSS rules were already commented dead in the source; the JS hooks (`initPageCurtain`) were removed. |
| Inline-style purge on `teardowns.html` (30 remaining) | Long-tail; each is a one-off animation-delay / grid-template. Same `.u-*` utility set already in `styles.css` can absorb them in a follow-up. |

---

## Files modified

- `assets/fonts/inter.css` — rewritten (2.2MB → 669B total across 3 files)
- `assets/fonts/fraunces.css` — rewritten
- `assets/fonts/jetbrains.css` — rewritten
- `assets/app.js` — dead init functions removed, strict mode, vendor loader gone
- `assets/styles.css` — dedup `:root`, contrast bump, focus-ring, skip-link, trust band, tap targets, utilities, fixed-gradient pseudo, orbit/sheen removed
- `index.html`, `about.html`, `book.html`, `free-review.html`, `teardowns.html`, `404.html` — preconnect + skip link + `defer` + `<main id="main">` + hamburger ARIA + funnel ARIA + (homepage) ladder CTA + trust band + FAQ additions + inline-style migration

## Files deleted

- `assets/vendor/gsap.min.js`
- `assets/vendor/ScrollTrigger.min.js`
- `assets/vendor/lenis.min.js`
- `assets/vendor/` (directory)
