# Prototype Template

This is a reusable Next.js prototype starter wired to the Design System.

---

## ⛔ Before You Write Any Code

The design system CLAUDE.md contains a mandatory SESSION START PROTOCOL. You must complete it before touching any file in this project.

Path: `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/CLAUDE.md`

**The protocol requires you to:**
1. Read all design system source files, both figma-links.md files, and this project's prd.pdf, flows.md, and assets.md
2. Read this file
3. Load Figma design context for every screen in scope this session; scan for Figma component instances and cross-reference against `components/ui/index.ts` — report any gaps before building begins
4. Output a session brief (including out-of-scope constraints and key business rules from prd.pdf, prototype connections from flows.md, icon library from assets.md, and component gaps) and wait for user confirmation

Do not skip this. Do not partially complete it. The user has been told to reject any session where you begin coding without completing the pre-flight.

---

## Design System Source

All tokens, components, and implementation standards come from:

```
/Users/vsanto/ai-projects/figma-to-code-bg/design-system
```

Read before building any screen or component:

- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/CLAUDE.md`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/figma-links.md` ← design system component node IDs
- `./prd.pdf` ← **this project's** product context, acceptance criteria, business rules, and out-of-scope constraints — never add features or behaviors not listed here. If absent, proceed without product context.
- `./figma-links.md` ← **this project's** screen inventory and product screen node IDs
- `./flows.md` ← **this project's** prototype connections, optional flow definitions, and optional intra-screen state behavior — use for all routing and within-screen interaction decisions
- `./assets.md` ← **this project's** installed icon library and exported asset paths — use for all icon and image references
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/color.tokens.json`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/typography.tokens.json`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/spacing.tokens.json`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/component-implementation-standards.md`

---

## Product Requirements

All implementation decisions are bounded by `./prd.pdf` (check for `prd.pdf` first; fall back to `prd.md` if absent; proceed without product context if neither exists):

- Never add features, interactions, or behaviors not present in Figma or the PRD.
- If the PRD's Out of Scope section explicitly excludes something (e.g. real API calls, animations, responsive layout), do not implement it — even if it would be easy or natural to add.
- If the PRD's Business Rules define validation logic or conditional behavior, implement exactly those rules — do not assume or invent alternatives.
- If the PRD's Acceptance Criteria define success conditions, use them as the implementation target for each screen.
- If the PRD is blank or partially filled, treat undefined sections as unconstrained — but never invent explicit requirements.

---

## Routing and Navigation

All routing and within-screen interaction decisions must be based on `./flows.md`. Do not invent navigation or interactions not listed there.

- If `flows.md` has prototype connections for a screen, implement exactly those connections — no more, no less.
- If `flows.md` has flow definitions, use them to plan the full user journey before writing any routing code.
- If `flows.md` has intra-screen state behavior for a screen, implement exactly those behaviors — form validation, toggles, loading/empty states, etc. Do not invent behavior not defined there.
- If `flows.md` has no entries for a screen, stop and ask the user what the intended navigation or behavior should be before building it.

## Icons and Assets

All icon and asset usage must be based on `./assets.md`.

- Use only the icon library listed in `assets.md`. Do not import from any other icon package or create custom SVG icon components.
- Use only asset files listed in `assets.md`. They live in `public/assets/` and are referenced as `/assets/filename.ext`.
- If an icon or image is needed that is not in `assets.md`, stop and ask — do not substitute, skip, or use a placeholder without confirming.
- Any component file that imports from an icon library must have `"use client"` as its very first line — icon packages use React context internally and will throw a runtime error in the App Router without it.

---

## Two figma-links.md Files — Know the Difference

There are two separate `figma-links.md` files. Both must be read. They serve different purposes:

| File | Contains | When to use |
|---|---|---|
| `design-system/figma-links.md` | Shared component node IDs (buttons, inputs, nav, cards, etc.) from the master design system Figma file | When implementing or validating a component against the design system |
| `[this project]/figma-links.md` | Product screen node IDs, states, and build status for this specific prototype | When finding the node ID to call `get_design_context` for a screen you are about to build |

**Product screen node IDs are always in this project's `figma-links.md`, not in the design system file.** If a screen's node ID is missing from this project's file, stop and ask the user. Do not search for it or proceed without it.

---

## Per-Screen Build Rule

For every screen or component you build:

1. Find the screen in **this project's** `figma-links.md` and get its node ID.
2. Call `get_design_context` on that node and output the design context data to the user.
3. Identify every state the screen has (default, hover, error, empty, loading, etc.).
4. Get user confirmation before writing code.
5. **Phase 0 — Output a measurement plan.** Quote raw values verbatim from the design context — exact API field names (`paddingTop`, `itemSpacing`, `fontSize`, `lineHeightPx`, etc.) and their literal values. Do not interpret, round, or paraphrase. The table must be verifiable against Figma's inspect panel. Do not write any code until this table is output. Then write the completed table to `_measurements-[screen-name].md` in the project root — this file survives context compression and must be re-read rather than re-derived from memory if it is no longer in the conversation.
6. **Phase 1 — Build layout skeleton.** Containers and auto-layout shells only — no content. Then output two things before proceeding: (a) a self-comparison table (Design context vs Implemented) for every structural value — fix all ✗ rows; (b) a DevTools spot-check list (element → how to find it → computed property → expected value) for the user to independently verify in the browser. Do not proceed to Phase 2 until the user confirms the DevTools values match.
7. **Phase 2 — Build section by section.** One major section at a time. After each section, output a comparison table for that section's values. Fix all ✗ rows before starting the next section. If this screen reuses a component built on a prior screen (nav bar, header, sidebar, footer), read that component's existing file first — do not rebuild it.
8. **Phase 3 — Final validation.** Call `get_design_context` again. Run a full property comparison and report all mismatches before marking the screen done.

**No approximate values at any phase.** Every value must come from the measurement plan or a mapped token. If a value cannot be matched, stop and ask.

**If a node ID is missing from this project's `figma-links.md`, stop and ask the user for it. Do not estimate, search, or proceed without it.**

---

## Token Integration

CSS variables are imported at the top of `app/globals.css` in order:

```css
@import "./tokens.css";         /* Design system tokens — auto-synced, do not edit */
@import "./tokens.project.css"; /* Project-specific tokens — edit freely */
```

**Two-file architecture:**

| File | Purpose | Owned by |
|---|---|---|
| `app/tokens.css` | Design system tokens, copied from `design-system/dist/css/tokens.css` | `npm run tokens:sync` — never edit manually |
| `app/tokens.project.css` | Project-specific tokens (values not in the DS palette) | You — never overwritten by sync |

`npm run dev` runs `tokens:sync` automatically before starting the server. Tailwind v4 `@theme inline` mappings are defined in `globals.css`. All design-system semantic tokens are mapped to Tailwind color, radius, shadow, and z-index utilities.

---

## Token Rules

- Use CSS variables for all color, typography, spacing, radius, shadow, and z-index values.
- Never hardcode token-based values.
- Semantic tokens take precedence over primitive tokens.
- If a required token is missing, stop and ask before inventing a substitute.
- **Project token rule:** Every token added to `app/tokens.project.css` must also get a matching `@theme inline` entry in `app/globals.css` so it is available as a Tailwind utility class. Colors use `--color-[name]` → generates `bg-[name]`, `text-[name]`, `border-[name]`. Shadows use `--shadow-[name]` → generates `shadow-[name]`.

---

## Implementation Rules

- Match Figma layout, spacing, typography, hierarchy, alignment, borders, radii, shadows, and colors.
- Do not redesign, modernize, or improvise layouts.
- Use exact pixel values where necessary.
- Only introduce responsive behavior when implied by the Figma design.
- Build one screen at a time. Validate against Figma before moving to the next.
- Any component that imports from an icon library or uses React hooks must have `"use client"` as its first line.

### Multi-field flex rows

For rows with multiple equal-width fields side by side, use `flex-1 min-w-0` on each field — not `width="auto" shrink-0`. The auto-width approach causes later fields to fall off-screen when the row is full-width.

### Checkbox variants — editable vs read-only

Two distinct visual states exist in the Figma:
- **Editable** (Create, Edit screens): checked = `btn-primary-bg` (#0C2340, dark blue), unchecked = transparent with `#A2AAAD` border. Interactive — use `<CheckboxField>`.
- **Read-only** (Review, Details screens): checked = `btn-primary-disabled-bg` (#8F9AA7, gray), always shows checkmark. Non-interactive — use `<CheckboxDisplay>`.

Do not use the same component for both. The gray fill communicates "this value was submitted; you are viewing it, not editing it."

### Per-screen build protocol — two tiers

The full Phase 0–3 process (measurement tables, layout skeleton, section comparisons, final recheck) is required for net-new or structurally complex screens. For screens that clearly follow an already-established pattern within the same session (same layout shell, same section structure, same field types), use the lightweight path: read design context → write full implementation → screenshot verify. Do not apply the heavyweight protocol to routine screens — it adds time without proportional value when patterns are already known.

### Overlays and modals

All modals and contextual menus are `useState`-driven overlays on their parent page — not separate routes. Pattern:
- One `useState` per overlay (`filtersOpen`, `exportOpen`, etc.)
- A shared `closeAll()` helper that resets all overlay states at once
- Each trigger button calls `closeAll()` then toggles its own state, so opening one overlay closes all others
- A `useEffect` with a `mousedown` listener on the page root handles outside-click dismissal

### Browser preview interaction

`preview_click` requires a CSS selector, not x/y coordinates. Use `preview_eval` with `element.click()` instead when clicking toolbar buttons or interactive elements to test overlay states.

---

## Tailwind Usage

Tailwind utility classes are available for all mapped tokens:

- Colors: `bg-bg-page`, `bg-bg-body`, `text-text-primary`, `text-text-secondary`, `border-border-default`, etc.
- Button colors: `bg-btn-primary-bg`, `text-btn-primary-text`, etc.
- Input colors: `bg-input-bg`, `border-input-border`, etc.
- Radius: `rounded-button`, `rounded-input`, `rounded-card`, `rounded-modal`, `rounded-pill`
- Shadows: `shadow-card`, `shadow-popover`, `shadow-modal`

For typography, spacing, and z-index, use CSS variables directly:
```css
font-size: var(--font-size-font-size-body-md);
gap: var(--gap-md);
padding: var(--padding-lg);
z-index: var(--z-sticky);
```

Typography utility classes are defined in `app/globals.css`:
- Headings: `text-style-h1` through `text-style-h5`
- Body: `text-style-body-xl` through `text-style-body-xs`
- Utilities: `text-style-button`, `text-style-label`, `text-style-caption`, `text-style-overline`, `text-style-badge`

---

## Figma

Master design system file:
https://www.figma.com/design/Mn2YoCnnppJTVO9pV96ZTN/Digital-Design-System-v2.1?node-id=2-191&m=dev

Always use the master design system file before referencing individual product screens.
Product screen node IDs live in **this project's** `figma-links.md`.
