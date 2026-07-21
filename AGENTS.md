# Agent Pre-Flight Checklist

This file defines the mandatory pre-flight procedure for every session. Complete every step in order. Output the results. Wait for user confirmation before writing any code.

---

## Why This Exists

Past sessions failed because implementation began before Figma references were loaded, token values were confirmed, or the scope of each screen was defined. This checklist makes those steps non-optional and verifiable by the user.

---

## Key Project Files — Know the Difference

Five project-specific files must be read in Step 1. Each serves a different purpose:

| File | Contains | Used for |
|---|---|---|
| `design-system/figma-links.md` | Shared design system component node IDs (buttons, inputs, nav, etc.) | Validating components against the design system |
| `[this project]/prd.pdf` | Product context, acceptance criteria, business rules, out-of-scope constraints | Knowing what to build, what the rules are, and what to explicitly exclude |
| `[this project]/figma-links.md` | Product screen node IDs, states, and build status | Finding node IDs to load design context |
| `[this project]/flows.md` | Auto-extracted prototype connections + optional flow definitions + optional intra-screen state behavior | Planning all routing, navigation, and within-screen interactions before writing code |
| `[this project]/assets.md` | Installed icon library (package + import syntax) + exported asset paths | All icon and image usage — use only what is listed here |

Product screen node IDs are always in **this project's** `figma-links.md`. Routing decisions always come from **this project's** `flows.md`. Product constraints always come from **this project's** `prd.pdf`. Icon and asset usage always comes from **this project's** `assets.md`. Never invent any of these.

---

## Pre-Flight Procedure

### Step 1 — Confirm all files are readable

Read the following files and confirm each loaded successfully:

**Design system files (shared):**
- [ ] `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/CLAUDE.md`
- [ ] `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/figma-links.md` ← component node IDs
- [ ] `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/color.tokens.json`
- [ ] `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/typography.tokens.json`
- [ ] `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/spacing.tokens.json`
- [ ] `/Users/vsanto/ai-projects/figma-to-code-bg/design-system/component-implementation-standards.md`

**This project's files:**
- [ ] This project's `CLAUDE.md`
- [ ] This project's `prd.pdf` ← product context, acceptance criteria, business rules, and out-of-scope constraints (read the PDF directly; if absent, proceed without product context)
- [ ] This project's `figma-links.md` ← screen inventory with product screen node IDs
- [ ] This project's `flows.md` ← auto-extracted prototype connections, optional flow definitions, and optional intra-screen state behavior (may be sparse — that's OK)
- [ ] This project's `assets.md` ← installed icon library and exported asset paths (may be empty — that's OK)

Output: list each file with ✓ confirmed or ✗ failed. If any file fails to load, stop and report it.

---

### Step 2 — Load the screen inventory

From **this project's** `figma-links.md` (not the design system file), extract the screen inventory table and output it in full:

| Screen Name | Node ID | States | Status |
|---|---|---|---|
| (list every row from the table) | | | |

Flag any rows where:
- The node ID is missing or still a placeholder (`[OWNER: paste node ID]`)
- The status is stale (marked `built` but not yet `validated`)

Do not proceed if node IDs are missing. Ask the user to provide them before continuing.

---

### Step 3 — Define session scope and load flow context

Read the screens in scope from the opening prompt the user sent at the start of this session. The prompt lists them explicitly under "Screens in scope today:". Do not ask the user which screens to build — they are already specified.

Cross-reference each screen name against this project's `figma-links.md` to get its node ID and states.

Then read this project's `flows.md` and extract context relevant to the in-scope screens:
- Any prototype connections where an in-scope screen is the source or destination
- Any flow definitions that include in-scope screens (user goal, screen sequence, exit conditions)
- Any intra-screen state behavior defined for in-scope screens (form validation, toggles, loading states, empty states)

Also read this project's `prd.pdf` and note any business rules, acceptance criteria, or out-of-scope constraints that apply to the in-scope screens.

Use this information to plan routing, navigation, within-screen interactions, and implementation constraints before writing any code. If `flows.md` has no entries for in-scope screens, note it explicitly — do not invent routing or interactions. If a behavior is not in the PRD or Figma, do not add it.

Output the confirmed scope:
- Screen name
- Node ID (from figma-links.md)
- States to be covered (from figma-links.md)
- Relevant prototype connections from flows.md (or "none defined")
- Intra-screen state behavior from flows.md (or "none defined")

---

### Step 4 — Load Figma design context and audit components for all in-scope screens

For each in-scope screen:
- Call `get_design_context` using the node ID from this project's `figma-links.md`
- `get_design_context` returns exact measurements: spacing, typography, dimensions, colors, border radii — use these values directly in implementation, do not eyeball or estimate
- Output the design context data to the user
- Note any issues: screen not found, wrong frame, multiple frames, flow overview instead of individual screen

If `get_design_context` returns a flow overview (multiple screens side-by-side), stop. Tell the user: "That node returned a flow overview. I need the individual frame node ID for [screen name]." Do not proceed without it.

If design context cannot be loaded for any other reason, stop and resolve before proceeding.

**If all `get_design_context` calls fail simultaneously** with "This resource couldn't be accessed": the Figma file is not open in the desktop app or browser. This is the only cause of uniform simultaneous failure across multiple node IDs. Tell the user directly: "Open [file name] in Figma — desktop app or a browser tab — then let me know and I'll retry." Do not present a multi-point diagnostic checklist about Dev Mode, permissions, or MCP settings.

After loading design context for all in-scope screens, scan the returned data for Figma component instances (INSTANCE type nodes). List every distinct component type found. Cross-reference against `components/ui/index.ts`. Report any component the design requires that has no equivalent in the codebase — these must be built from scratch during the session and the user should know before implementation begins.

---

### Step 5 — Output session brief and wait for confirmation

Output a structured brief:

```
SESSION BRIEF
─────────────────────────────────────────
Design system files: loaded ✓
Token files: loaded ✓
This project's figma-links.md: loaded ✓
This project's flows.md: loaded ✓
This project's prd.pdf: loaded ✓
This project's assets.md: loaded ✓
Screen inventory: N screens registered, N in scope today

IN-SCOPE SCREENS:
1. [Screen Name] — Node ID: [ID] — States: [list]
2. [Screen Name] — Node ID: [ID] — States: [list]

PROTOTYPE CONNECTIONS (in-scope screens):
- [Screen A] → [Screen B] via ON_CLICK (NAVIGATE)
- [none defined for in-scope screens]

FLOW DEFINITIONS: [summary of any defined flows touching in-scope screens, or "none"]
INTRA-SCREEN STATE: [summary of any within-screen behavior defined in flows.md, or "none"]
OUT OF SCOPE (from PRD): [list anything in the PRD's Out of Scope section that applies to today's screens, or "none"]
KEY CONSTRAINTS (from PRD): [any business rules or acceptance criteria relevant to today's screens, or "none"]

FIGMA DESIGN CONTEXT: loaded for all in-scope screens ✓

COMPONENT GAPS: [none / list components the design requires that are not in components/ui/]
ICON LIBRARY: [library name from assets.md, e.g. lucide-react / "none detected"]
TOKEN GAPS: [none / list any missing tokens]
FIGMA ACCESS ISSUES: [none / list any problems]

Ready to begin. Awaiting user confirmation.
─────────────────────────────────────────
```

**Do not write any implementation code until the user explicitly confirms this brief.**

---

## During Implementation

Follow these rules for every screen, in this exact order:

### Phase 0 — Measurement extraction (before any code)

Before writing a single line of implementation code, parse the design context loaded in Step 4 and output a measurement plan. **Quote raw values verbatim from the design context response — do not interpret, round, or paraphrase.** Use the exact API field names so the user can cross-check against Figma's inspect panel.

| Layer / Element | Design Context Field | Raw Value | CSS Translation |
|---|---|---|---|
| [container name] | `width` | 375 | `width: 375px` |
| [container name] | `paddingTop` / `paddingBottom` / `paddingLeft` / `paddingRight` | 24 / 24 / 16 / 16 | `padding: 24px 16px` |
| [container name] | `itemSpacing` | 16 | `gap: 16px` |
| [text element] | `fontSize` | 32 | `font-size: 32px` |
| [text element] | `fontWeight` | 700 | `font-weight: 700` |
| [text element] | `lineHeightPx` | 40 | `line-height: 40px` |
| [shape] | `cornerRadius` | 8 | `border-radius: 8px` |

List every layer you intend to implement. The "Design Context Field" and "Raw Value" columns must be copied directly from the API response — not derived from memory or assumed. Do not begin Phase 1 until this table is output and the user has had a chance to verify the values against Figma.

After outputting the table, write it to `_measurements-[screen-name].md` in the project root. This file survives context window compression — if the measurement plan is no longer in the conversation later in the session, re-read this file rather than re-deriving values from memory.

### Phase 1 — Layout skeleton

Build container shells and auto-layout structure only — no content, no typography, no fills. Just the structural grid.

**Checkpoint — Part A (self-comparison):** After writing Phase 1, compare every container dimension, padding, and gap value in your code against the measurement plan:

| Element | Property | Design context | Implemented | Match? |
|---|---|---|---|---|
| ... | ... | ... | ... | ✓ / ✗ |

Fix every ✗ before Part B.

**Checkpoint — Part B (DevTools spot-check):** Output a DevTools verification list so the user can independently confirm what the browser actually rendered. For each key container, provide the selector or inspection path, the computed CSS property name, and the expected value:

```
DevTools spot-check — Cmd+Option+I → Elements → select element → Computed tab

| Element         | How to find                        | Computed property | Expected |
|-----------------|------------------------------------|-------------------|----------|
| Outer frame     | right-click outermost div → Inspect| width             | 375px    |
| Outer frame     | same element                       | padding-top       | 24px     |
| Content stack   | inspect the flex container inside  | gap               | 16px     |
```

**Do not proceed to Phase 2 until the user confirms all DevTools values match.** If the user reports a mismatch, fix it and re-output the spot-check list.

### Phase 2 — Section by section

Build one major section at a time (e.g., header, content area, sidebar, footer). After each section, output a comparison for that section's values before starting the next section:

| Property | Design context | Implemented | Match? |
|---|---|---|---|
| ... | ... | ... | ✓ / ✗ |

Fix every ✗ before moving to the next section.

### Phase 3 — Final validation

After the screen is fully built, call `get_design_context` one final time and run a full property-by-property comparison. Report all mismatches to the user before marking the screen done.

### Always

- **One screen at a time.** Complete all phases and validation before starting the next screen.
- **No approximate values.** Every value must come from the measurement plan or a mapped token. Never say "roughly" or "approximately" — stop and ask if a value cannot be matched.
- **Report token gaps immediately.** If a required value has no token, stop and ask. Do not invent a substitute.
- **Multi-screen consistency.** Before building any screen that contains a component already built on a previous screen (nav bar, header, sidebar, footer), read the existing component file first. Replicate the same implementation — do not rebuild from scratch. If inconsistencies are found between screens mid-session, surface them to the user before proceeding.

---

## Red Flags (Stop and Ask)

Stop and ask the user if any of these occur:

- A Figma node ID returns a flow overview (multiple screens) instead of an individual frame
- A required component exists in Figma but not in the codebase
- A layout value cannot be matched to any token
- A use case or screen state is mentioned that has no Figma reference
- This project's `figma-links.md` has placeholder node IDs (`[OWNER: paste node ID]`) for in-scope screens
- Navigation or routing is needed for a screen that has no entry in `flows.md` — do not invent it
- A feature or behavior is needed that is explicitly listed in the PRD's Out of Scope section — stop; do not implement it
- An icon or image asset is needed that is not listed in `assets.md` — do not substitute or skip; stop and ask
- Context window compression has caused loss of session state
- A component that imports from an icon library is written without `"use client"` at the top — add the directive before writing any code that imports from an icon package

---

## Next.js App Router — `"use client"` Directive

Any component file that does ANY of the following MUST have `"use client"` as its very first line:

- **Imports from an icon library** (`@phosphor-icons/react`, `lucide-react`, `@heroicons/react`, `@tabler/icons-react`, etc.) — icon packages use React context internally and will throw `createContext only works in Client Components` at runtime without this directive
- **Uses React hooks** (`useState`, `useEffect`, `useContext`, `useRef`, `useCallback`, `useMemo`, etc.)
- **Uses browser-only APIs** (`window`, `document`, `navigator`, event listeners, etc.)
- **Imports from any third-party package** that uses React context or DOM APIs internally

This applies at the file level. If any import in a file requires `"use client"`, the entire file must be a Client Component.

**Default rule for this project:** if a component renders icons, add `"use client"` as the first line — before writing any other code.

---

## Next.js Version Notice

This template uses Next.js 15 with the App Router. APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.
