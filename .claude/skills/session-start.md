# Session Start — Pre-flight

Invoke this skill at the start of every session, or after context compaction, to reload all design context and produce the session brief before any code is written.

Invoke with: `/session-start`

---

## Step 1 — Read design system source files

Read each of these files in full:

- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/CLAUDE.md`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/figma-links.md`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/color.tokens.json`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/typography.tokens.json`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/spacing.tokens.json`
- `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/component-implementation-standards.md`

## Step 2 — Read project source files

Read each of these files in full:

- `./CLAUDE.md`
- `./figma-links.md` — note the **Measurement Nodes** section; it contains pre-listed child node IDs
- `./flows.md`
- `./assets.md`
- `./prd.pdf` if present, else `./prd.md` — skip if neither exists

## Step 3 — Load Figma context for in-scope screens

Read which screens are in scope from the opening prompt — they are listed explicitly under "Screens in scope today:". Do not ask the user to restate them. Then for each screen:

**A — Check for existing measurement file first**
Look for `_measurements-[screen-name].md` in the project root (replacing spaces with hyphens and lowercasing the screen name). If it exists, read it — the measurements are already extracted. Skip the Figma context calls for sections already measured; only call for sections not yet captured.

**B — Visual reference**
Call `get_screenshot` on the full-page node ID from `./figma-links.md`. This gives the overall layout without hitting API size limits.

**C — Precise measurements**
Check `./figma-links.md` → **Measurement Nodes** section for this screen:
- If child node IDs are listed → call `get_design_context` on each one directly. No discovery step needed.
- If child node IDs are `[not yet captured]` → identify sections from the screenshot, find their node IDs in Figma's layers panel (right-click → Copy link → extract `node-id` → convert `-` to `:`), call `get_design_context` on each, **then update the Measurement Nodes table in `./figma-links.md`** with the discovered IDs so they are available next session.

Output the design context data for each section called.

**D — Stop if a screen node ID is missing from `./figma-links.md`** — ask the user to provide it before continuing.

## Step 4 — Scan for component gaps

From the design context returned above, list every distinct Figma INSTANCE type node found. Cross-reference against `./components/ui/index.ts`. Report any component the design requires that has no codebase equivalent — these must be built from scratch.

## Step 5 — Output session brief

Output all ten points before writing any code:

1. Screens in scope and their Figma node IDs
2. States covered per screen (default, hover, error, empty, etc.)
3. Prototype connections from `flows.md` relevant to in-scope screens
4. Flow definitions from `flows.md` that apply
5. Intra-screen state behavior from `flows.md` for in-scope screens
6. Out-of-scope constraints and key business rules from `prd.pdf`/`prd.md`
7. Icon library and asset paths confirmed from `assets.md`
8. Component gaps — required by design but missing from `components/ui/`
9. Token gaps or Figma access issues
10. Confirmation that design context has been loaded for all in-scope screens; note which child node IDs were newly discovered and written to `figma-links.md`

**Wait for explicit user acknowledgement before writing any code.**
