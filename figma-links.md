# bg-ssot-consent — Figma Screen Inventory

This file is the screen inventory for this specific prototype project. It maps every screen to its Figma node ID, states, and build status. Claude reads this file at the start of every session to get screen node IDs.

**This file is separate from `design-system/figma-links.md`**, which only contains shared design system component references. This file contains product screen node IDs.

---

## Before Every Session

1. Run `bash /Users/vsanto/ai-projects/figma-to-code-bg/prototype-creation-wizard.sh generate-prototype` — it lists every screen with ✓ (node ID present) or ✗ (missing) and lets you fill in any missing node IDs interactively.
2. To add a new screen not set up during the original `setup` run, add a row manually and fill in the node ID when `generate-prototype` prompts you.
3. Update Status after each screen is built and validated.

**If a node ID is missing and you need to look one up manually:**
1. Press `Shift+D` to enter Dev Mode in Figma
2. Click the individual named frame (not a flow container or overview)
3. **Browser:** copy from the address bar — extract `node-id=XXXX-YYYY`
4. **Desktop app:** right-click → Copy link to selection, or press `Cmd+L` — extract `node-id=XXXX-YYYY`
5. Convert the `-` to `:` → `XXXX:YYYY`

---

## Project Figma File

- URL: `https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB/Single-Source-of-Truth?node-id=11146-17548&t=tewOnO28lMcGEro4-0`
- File Key: `b06D8PhSu51B1kaeXYtxMB`

---

## Screen Inventory

**Status values:** `not started` → `in progress` → `built` → `validated`

| Screen Name | Figma URL | Node ID | States to Cover | Status |
|---|---|---|---|---|
| `Test Code Repository:Admin - Review Submission` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21123 | `11148:21123` | default | validated |
| `Test Code Repository:Admin Status Queue` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21126 | `11148:21126` | default | validated |
| `Test Code Repository:Editor Status Queue` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21122 | `11148:21122` | default | validated |
| `Test Code Repository:Test Code Version History` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21121 | `11148:21121` | default | validated |
| `Test Code Repository:Edit New Test Code` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21127 | `11148:21127` | default | validated |
| `Test Code Repository:Create New Test Code` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21120 | `11148:21120` | default | validated |
| `Test Code Repository:Request Edit` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21125 | `11148:21125` | default | validated |
| `Test Code Repository:Request Delete` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21119 | `11148:21119` | default | validated |
| `Test Code Repository:Test Code Details` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21118 | `11148:21118` | default | validated |
| `Test Code Repository:Actions Contextual Menu Module` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21271 | `11148:21271` | default | validated |
| `Test Code Repository:Export Options Modal` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21270 | `11148:21270` | default | validated |
| `Test Code Repository:Customize Table Modal` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21261 | `11148:21261` | default | validated |
| `Test Code Repository:Filters Modal` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21260 | `11148:21260` | default | validated |
| `Test Code Repository:Dashboard` | https://www.figma.com/design/b06D8PhSu51B1kaeXYtxMB?node-id=11148-21117 | `11148:21117` | default | validated |

---

## Measurement Nodes

Child section node IDs for `get_design_context` calls. Discovered once during the first session and stored here permanently — at every subsequent session start, call `get_design_context` on these directly and skip the discovery step entirely.

**How to find a child node ID:** In Figma's layers panel, hover over the section frame → right-click → Copy link to selection → extract `node-id=XXXX-YYYY` from the URL → convert `-` to `:` → `XXXX:YYYY`

> Aim for 3–5 child nodes per screen covering: header/nav, primary content area, any cards or sidebars, and interactive components.


| Section | Child Node ID |
|---|---|
| [e.g. Header / Nav] | `[paste node ID]` |
| [e.g. Main content] | `[paste node ID]` |
| [e.g. Sidebar / Cards] | `[paste node ID]` |

<!-- Copy the block above for each screen as child node IDs are discovered -->

---

## Product Requirements

Product context, acceptance criteria, business rules, and out-of-scope constraints live in `prd.pdf`. Copy your PRD PDF into the project root and name it `prd.pdf` — Claude reads it directly during pre-flight.

## Flow References

Prototype connections, flow definitions, and intra-screen state behavior live in `flows.md` (created automatically by `prototype-creation-wizard.sh setup`). Claude reads `flows.md` during pre-flight to plan all routing, navigation, and within-screen interactions.

- **Prototype Connections** — auto-extracted from Figma (which screen connects to which, trigger type, navigation type)
- **Flow Definitions** — optional; add user goals, screen sequences, and exit conditions to give Claude full journey context
- **Intra-Screen State Behavior** — optional; document what changes within a screen (form validation errors, toggle layouts, loading states, empty states) so Claude doesn't invent behavior

---

## Implementation Notes

Use this section for design decisions, Figma-to-code caveats, and approved deviations from the Figma.

- `[Add notes here as they are discovered during implementation]`
