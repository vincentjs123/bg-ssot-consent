# Verifier — Browser (Prototype)

Standard recipe for verifying UI changes in this Next.js prototype by driving the real app.

## Launch

```bash
npm run dev
```

Dev server starts at **http://localhost:3000**.

> `npm run dev` also runs `tokens:sync` automatically — tokens are always up to date before the server starts.

## Routes

Add routes here after creating your first screen — e.g. `/order-dashboard`, `/order-details`

## Session Flow (full demo path)

Add the full demo path once flows.md is filled in

## Screenshot

Use the Claude Preview tool or the browser MCP to navigate and screenshot:

```
mcp__Claude_Preview__preview_start / mcp__Claude_in_Chrome__navigate
→ navigate to the route under test
→ interact (click, fill, toggle state)
→ screenshot and compare to Figma
```

## Token Lint

Run after any session to catch hardcoded colors before they accumulate:

```bash
npm run lint:tokens
```

This runs automatically as a Stop hook after every Claude Code session.

## Verification Pattern

1. Run `npm run dev` (syncs tokens, starts server)
2. Navigate to the route for the change being tested
3. Drive the UI to the relevant state (click through the flow if needed)
4. Screenshot
5. Compare to Figma via `get_screenshot` on the matching node ID from `figma-links.md`
6. Note any discrepancies as findings — do not guess if something is intentional
