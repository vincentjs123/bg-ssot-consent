# Prototype Template

A reusable Next.js 15 starter wired to the Design System. Copy this directory when starting a new prototype project.

---

## What This Is

This template gives you a working Next.js app with:
- All Design System tokens loaded as CSS custom properties via `app/globals.css`
- Tailwind v4 `@theme inline` mappings for every semantic token (colors, radius, shadows, z-index)
- Typography utility classes (`.text-style-h1` through `.text-style-h5`, body styles, captions, labels)
- Base UI components: Button (6 variants), Input, Card, Badge, Tag
- Barlow font loaded via `next/font/google`
- Correct `globals.css` → `layout.tsx` → `page.tsx` app structure

---

## How to Start a New Prototype

Follow the full process in `/Users/vsanto/ai-projects/figma-to-code-bg/figma-designs-to-code-prototype-checklist.md`. Quick summary:

1. **Copy this directory** — `cp -r prototype-template /Users/vsanto/ai-projects/[project-name]`
2. **Delete the copied `node_modules`** — `rm -rf /Users/vsanto/ai-projects/[project-name]/node_modules`
3. **app/layout.tsx and app/page.tsx updated automatically** — project name set throughout
4. **`figma-links.md`, `flows.md`, and `assets.md` are created automatically** — the script fetches pages, frames, and prototype connections directly from the Figma API. You select which pages and which frames to include. Node IDs are extracted automatically. Prototype connections (what connects to what, and what trigger/navigation type) are written to `flows.md`. Both top-level frames and frames nested inside Sections are detected — Section-nested frames are labeled `[Section Name] Frame Name` in the selection list.
   - Requires a Figma Personal Access Token (one-time setup): Figma → Settings → **Security** tab → Personal access tokens → Generate new token. The script saves it to `~/.figma_token` for future sessions.
   - The script prompts for a PRD PDF. If you have one, copy it to the project folder as `prd.pdf` — Claude reads it directly. If not, you can create `prd.md` manually at any time before a session. If neither exists, Claude proceeds without product context.
   - After setup, open `flows.md` — review the auto-extracted connections; optionally fill in the Flow Definitions template to give Claude user goal and sequence context; optionally fill in the Intra-Screen State Behavior section to document within-screen interactions (form errors, toggles, loading/empty states).
   - Also open `assets.md` — confirm the detected icon library matches what the Figma file uses, and verify all expected assets appear in the exported list.
5. **Run `npm install`** and start the dev server — the script handles this and opens the browser automatically. Confirm the page loads and the tab title shows your project name, then press Enter.
6. **Start a Claude Code session** — use the opening prompt from the checklist

---

## Token Import Path

The template imports design system tokens from a local copy inside the project:

```css
@import "./tokens.css";
```

`app/tokens.css` is copied from `design-system/dist/css/tokens.css` automatically by `prototype-creation-wizard.sh` during setup and refreshed at the start of every session. Do not edit it manually — rebuild the design system (`cd design-system && npm run build`) then run `npm run tokens:sync` in your project to pick up token changes.

---

## Available Token Utilities

### Colors (Tailwind classes)
```
bg-bg-page          bg-bg-body          bg-bg-surface       bg-bg-inverse
text-text-primary   text-text-secondary text-text-muted     text-text-link
border-border-subtle border-border-default border-border-primary
bg-btn-primary-bg   text-btn-primary-text   (all 6 button variants)
bg-input-bg         border-input-border     (all input states)
bg-badge-info-bg    bg-badge-success-bg     bg-badge-caution-bg   bg-badge-alert-bg
bg-tag-default-bg   text-tag-default-text
```

### Spacing (CSS variables)
```
var(--gap-xs)    4px     var(--padding-xs)   8px
var(--gap-sm)    8px     var(--padding-sm)   12px
var(--gap-md)    16px    var(--padding-md)   16px
var(--gap-lg)    24px    var(--padding-lg)   24px
var(--gap-xl)    32px    var(--padding-xl)   32px
```

### Radius (Tailwind classes)
```
rounded-button    rounded-input    rounded-card    rounded-modal    rounded-pill
```

### Shadows (Tailwind classes)
```
shadow-card    shadow-popover    shadow-modal
```

### Z-index (CSS variables)
```
var(--z-dropdown)   20
var(--z-sticky)     30
var(--z-tooltip)    40
var(--z-modal)      50
```

### Typography utilities (CSS classes)
```
.text-style-h1 through .text-style-h5
.text-style-body-xl through .text-style-body-xs
.text-style-button   .text-style-label   .text-style-caption
.text-style-overline .text-style-badge
```

---

## Base Components

All in `components/ui/`, exported from `components/ui/index.ts`:

| Component | Props | Notes |
|---|---|---|
| `Button` | `variant`, standard button attrs | 6 variants: primary, secondary, ghost, success, alert, caution |
| `Input` | `label`, `helpText`, `state`, standard input attrs | Handles label, help text, error/success states |
| `Card` | `children`, `className` | Surface background, border, shadow, padding |
| `Badge` | `variant` | info, success, caution, alert |
| `Tag` | `variant` | default, accent |

---

## Key Files

| File | Purpose |
|---|---|
| `app/globals.css` | Token imports, @theme mappings, typography utilities, form styles |
| `app/layout.tsx` | Root layout — Barlow font, body background |
| `app/page.tsx` | Replace with your project's home page |
| `prd.pdf` / `prd.md` | **Product context, acceptance criteria, business rules, out-of-scope constraints** — `prd.pdf` is read directly; `prd.md` is the text fallback |
| `figma-links.md` | **Your project's screen inventory — node IDs, states, build status** |
| `flows.md` | **Prototype connections (auto-extracted) + optional flow definitions + optional intra-screen state behavior** |
| `assets.md` | **Installed icon library + asset paths exported to `public/assets/`** |
| `AGENTS.md` | Claude's mandatory pre-flight checklist |
| `CLAUDE.md` | Design system rules and implementation standards for Claude |

---

## Design System Reference

Source: `/Users/vsanto/ai-projects/figma-to-code-bg/design-system`

- Token pipeline: Style Dictionary → `dist/css/tokens.css`, `dist/tailwind/tokens.cjs`, `dist/ts/tokens.ts`
- Rebuild tokens after changes: `cd design-system && npm run build`
- Figma master file: https://www.figma.com/design/Mn2YoCnnppJTVO9pV96ZTN/Digital-Design-System-v2.1
