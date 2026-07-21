# Flows — bg-ssot-consent

Prototype connections auto-extracted from Figma, plus optional flow definitions.
Last updated: 2026-06-24

---

## Prototype Connections

Extracted from Figma on 2026-06-24. Reflects prototype wiring defined at the time of extraction.
Update this table manually if Figma connections change after setup.

| From Screen | Trigger | To Screen | Navigation |
|---|---|---|---|
| Test Code Repository:Admin - Review Submission | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Admin - Review Submission | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Admin - Review Submission | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Admin - Review Submission | ON_CLICK | [unknown: 11146:12393] | CHANGE_TO |
| Test Code Repository:Admin - Review Submission | ON_HOVER | [unknown: 11146:3029] | CHANGE_TO |
| Test Code Repository:Admin Status Queue | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Admin Status Queue | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Admin Status Queue | ON_CLICK | Test Code Repository:Admin - Review Submission | NAVIGATE |
| Test Code Repository:Editor Status Queue | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Editor Status Queue | ON_CLICK | Test Code Repository:Create New Test Code | NAVIGATE |
| Test Code Repository:Test Code Version History | ON_HOVER | [unknown: 11146:3876] | CHANGE_TO |
| Test Code Repository:Test Code Version History | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Test Code Version History | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Test Code Version History | ON_CLICK | Test Code Repository:Test Code Details | NAVIGATE |
| Test Code Repository:Test Code Version History | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Edit New Test Code | ON_HOVER | [unknown: 11146:3876] | CHANGE_TO |
| Test Code Repository:Edit New Test Code | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Edit New Test Code | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Edit New Test Code | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Edit New Test Code | ON_HOVER | [unknown: 11146:3029] | CHANGE_TO |
| Test Code Repository:Create New Test Code | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Create New Test Code | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Create New Test Code | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Create New Test Code | ON_CLICK | [unknown: 11146:12391] | CHANGE_TO |
| Test Code Repository:Create New Test Code | ON_CLICK | [unknown: 11146:12338] | CHANGE_TO |
| Test Code Repository:Create New Test Code | ON_HOVER | [unknown: 11146:3029] | CHANGE_TO |
| Test Code Repository:Request Edit | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Request Edit | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Request Edit | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Request Edit | ON_HOVER | [unknown: 11146:3029] | CHANGE_TO |
| Test Code Repository:Request Delete | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Request Delete | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Request Delete | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Request Delete | ON_HOVER | [unknown: 11146:3029] | CHANGE_TO |
| Test Code Repository:Test Code Details | ON_HOVER | [unknown: 11146:3876] | CHANGE_TO |
| Test Code Repository:Test Code Details | ON_CLICK | Test Code Repository:Dashboard | NAVIGATE |
| Test Code Repository:Test Code Details | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Test Code Details | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Test Code Details | ON_CLICK | [unknown: 11146:12393] | CHANGE_TO |
| Test Code Repository:Test Code Details | ON_CLICK | Test Code Repository:Test Code Version History | NAVIGATE |
| Test Code Repository:Test Code Details | ON_CLICK | Test Code Repository:Request Edit | NAVIGATE |
| Test Code Repository:Test Code Details | ON_CLICK | Test Code Repository:Request Delete | NAVIGATE |
| Test Code Repository:Actions Contextual Menu Module | ON_CLICK | Test Code Repository:Test Code Details | NAVIGATE |
| Test Code Repository:Actions Contextual Menu Module | ON_CLICK | Test Code Repository:Request Edit | NAVIGATE |
| Test Code Repository:Actions Contextual Menu Module | ON_CLICK | Test Code Repository:Request Delete | NAVIGATE |
| Test Code Repository:Actions Contextual Menu Module | ON_CLICK | Test Code Repository:Test Code Version History | NAVIGATE |
| Test Code Repository:Customize Table Modal | ON_CLICK | [unknown: 11146:12393] | CHANGE_TO |
| Test Code Repository:Customize Table Modal | ON_CLICK | [unknown: 753:3930] | CHANGE_TO |
| Test Code Repository:Filters Modal | ON_CLICK | [unknown: 753:3930] | CHANGE_TO |
| Test Code Repository:Filters Modal | ON_HOVER | [unknown: 11146:3031] | CHANGE_TO |
| Test Code Repository:Dashboard | ON_CLICK | Test Code Repository:Editor Status Queue | NAVIGATE |
| Test Code Repository:Dashboard | ON_CLICK | Test Code Repository:Filters Modal | OVERLAY |
| Test Code Repository:Dashboard | ON_CLICK | Test Code Repository:Customize Table Modal | OVERLAY |
| Test Code Repository:Dashboard | ON_CLICK | Test Code Repository:Export Options Modal | OVERLAY |
| Test Code Repository:Dashboard | ON_HOVER | [unknown: 11146:3029] | CHANGE_TO |
| Test Code Repository:Dashboard | ON_CLICK | Test Code Repository:Actions Contextual Menu Module | OVERLAY |

> **Navigation types:** NAVIGATE (push new screen), OVERLAY (modal/drawer over current), SWAP (replace in place)
> **Trigger types:** ON_CLICK, ON_HOVER, ON_PRESS, AFTER_TIMEOUT, KEY_DOWN, MOUSE_ENTER, MOUSE_LEAVE

---

## Flow Definitions (optional)

Add user goals and screen sequences here to give Claude context beyond the connection table above.
Claude reads this file during pre-flight. Fill in as many or as few flows as are relevant.

---

### [Flow Name]

**User goal:** [What the user is trying to accomplish in one sentence]
**Entry point:** [Screen name]

**Screen sequence:**
1. [Screen name] — [what the user does / sees here]
2. [Screen name] — triggered by: [button name, form submit, etc.]
3. [Screen name] — triggered by: [...]

**Exit conditions:**
- Success: [Screen name] — [describe the happy path outcome]
- Error: [Screen name] — [describe what happens on failure]
- Abandon: [e.g., user closes modal / presses back]

**Out of scope for this prototype:**
- [Interactions shown in Figma but not being wired in this build]

---

<!-- Copy the flow template above to add more flows -->

---

## Intra-Screen State Behavior (optional)

Document what happens *within* a screen — form validation revealing errors, toggles changing layout,
loading states appearing, empty states, etc. `flows.md` captures which screen connects to which;
this section captures what changes *inside* a screen. Claude reads this during pre-flight to plan
within-screen interactions without inventing behavior.

Fill in only what is defined in Figma. Leave blank if not applicable.

---

### [Screen Name]

- [trigger] → [what changes on screen]
  - Example: "Submit with empty required fields → show inline error message below each empty input"
  - Example: "Toggle 'Show advanced options' → expand collapsed section below toggle"
  - Example: "API call in progress → replace button label with spinner, disable all inputs"
  - Example: "0 results returned → replace list with empty state illustration and helper text"

---

<!-- Copy the screen block above for each screen that has defined intra-screen behavior -->
