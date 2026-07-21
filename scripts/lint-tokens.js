#!/usr/bin/env node
/**
 * lint-tokens.js
 *
 * Scans TSX/TS/CSS source files for two classes of violation:
 *
 *   1. Hardcoded color values — hex (#RRGGBB / #RGB) or functional rgb()/rgba()
 *      with numeric arguments. rgba(var(--token), 0.5) is NOT a violation.
 *
 *   2. Missing "use client" directive — any file that imports from
 *      @phosphor-icons/react or calls a React hook (useState, useEffect, etc.)
 *      must have "use client" as its very first line. Omitting it causes a
 *      runtime crash in Next.js App Router.
 *
 * Exits 1 if any violations are found.
 *
 * Run:
 *   node scripts/lint-tokens.js
 *   npm run lint:tokens
 *
 * Excluded from scanning:
 *   app/tokens.css         — canonical token definitions
 *   app/tokens.project.css — project-specific token definitions
 *   .next/                 — build output
 *   node_modules/          — dependencies
 *   .git/                  — version control
 */

const fs   = require('fs');
const path = require('path');

// ─── Configuration ─────────────────────────────────────────────────────────────

const SCAN_DIRS  = ['app', 'components'];
const EXTENSIONS = new Set(['.tsx', '.ts', '.css', '.scss']);

const EXCLUDE_FILES = new Set([
  'tokens.css',
  'tokens.project.css',
  'globals.css',  // intentionally contains SVG data URIs and base styles with non-token values
]);

const EXCLUDE_DIRS = new Set([
  '.next',
  'node_modules',
  '.git',
]);

// ─── Patterns ──────────────────────────────────────────────────────────────────

// 1a. Hex color literals: #RGB or #RRGGBB
const HEX_RE = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;

// 1b. Functional color literals: rgb(N...) or rgba(N...) with numeric first arg
//     Does NOT match rgba(var(--token), 0.5) — variable-based usage is fine.
const RGB_RE = /\brgba?\s*\(\s*\d/g;

// 2a. Icon library import — always requires "use client"
const ICON_IMPORT_RE = /from\s+['"](?:@phosphor-icons\/react|lucide-react|@heroicons\/react(?:\/[^'"]+)?|@tabler\/icons-react|@radix-ui\/react-icons|react-feather|@mui\/icons-material(?:\/[^'"]+)?|react-bootstrap-icons|remixicon-react(?:\/[^'"]+)?)['"]/;

// 2b. React hook calls — require "use client" in App Router files
const HOOK_CALL_RE = /\buse(?:State|Effect|Callback|Memo|Ref|Router|Params|SearchParams|Context|Reducer|LayoutEffect|Id|DeferredValue|Transition|ImperativeHandle)\s*\(/;

// 2c. "use client" directive — must be the first non-empty line
function hasUseClientDirective(content) {
  const firstLine = content.split('\n').find(l => l.trim().length > 0) ?? '';
  const t = firstLine.trim();
  return t === '"use client";' || t === "'use client';" ||
         t === '"use client"'  || t === "'use client'";
}

// ─── File walker ───────────────────────────────────────────────────────────────

function* walkFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) yield* walkFiles(full);
    } else if (
      EXTENSIONS.has(path.extname(entry.name)) &&
      !EXCLUDE_FILES.has(entry.name)
    ) {
      yield full;
    }
  }
}

// ─── Scan ──────────────────────────────────────────────────────────────────────

const colorFindings    = [];   // hardcoded color violations
const directiveFindings = [];  // missing "use client" violations

for (const dir of SCAN_DIRS) {
  for (const file of walkFiles(dir)) {
    const ext     = path.extname(file);
    const content = fs.readFileSync(file, 'utf8');
    const lines   = content.split('\n');

    // ── Color checks (all file types) ─────────────────────────────────────────
    lines.forEach((line, idx) => {
      let match;

      HEX_RE.lastIndex = 0;
      while ((match = HEX_RE.exec(line)) !== null) {
        colorFindings.push({ file: path.normalize(file), line: idx + 1, col: match.index + 1, value: match[0] });
      }

      RGB_RE.lastIndex = 0;
      while ((match = RGB_RE.exec(line)) !== null) {
        const excerpt = line.slice(match.index, match.index + 30).replace(/\n/g, '').trimEnd();
        colorFindings.push({ file: path.normalize(file), line: idx + 1, col: match.index + 1, value: excerpt + (excerpt.length >= 30 ? '…' : '') });
      }
    });

    // ── "use client" check (TSX/TS only) ──────────────────────────────────────
    if (ext === '.tsx' || ext === '.ts') {
      const needsDirective = ICON_IMPORT_RE.test(content) || HOOK_CALL_RE.test(content);
      if (needsDirective && !hasUseClientDirective(content)) {
        const reason = ICON_IMPORT_RE.test(content)
          ? 'imports an icon library'
          : 'calls a React hook';
        directiveFindings.push({ file: path.normalize(file), reason });
      }
    }
  }
}

// ─── Report ────────────────────────────────────────────────────────────────────

let exitCode = 0;

if (colorFindings.length > 0) {
  exitCode = 1;
  console.error(`\n⚠  lint:tokens — ${colorFindings.length} hardcoded color${colorFindings.length === 1 ? '' : 's'} found\n`);
  const byFile = {};
  for (const f of colorFindings) (byFile[f.file] ??= []).push(f);
  for (const [file, hits] of Object.entries(byFile)) {
    console.error(`  ${file}`);
    for (const h of hits) console.error(`    line ${h.line}:${h.col}  ${h.value}`);
    console.error('');
  }
  console.error('  Replace each value with its CSS variable from tokens.css or tokens.project.css.');
  console.error('  Tip: grep for the value — e.g. `grep "#2EC27B" app/tokens.css`\n');
}

if (directiveFindings.length > 0) {
  exitCode = 1;
  console.error(`\n⚠  lint:client — ${directiveFindings.length} file${directiveFindings.length === 1 ? '' : 's'} missing "use client"\n`);
  for (const f of directiveFindings) {
    console.error(`  ${f.file}`);
    console.error(`    reason: ${f.reason}`);
    console.error(`    fix:    add  "use client";  as the very first line\n`);
  }
}

if (exitCode === 0) {
  console.log('✓ lint:tokens passed — no hardcoded colors or missing "use client" directives found');
}

process.exit(exitCode);
