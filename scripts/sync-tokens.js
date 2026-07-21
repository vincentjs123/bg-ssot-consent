#!/usr/bin/env node
/**
 * sync-tokens.js
 *
 * Refreshes app/tokens.css from the canonical design-system source.
 * Project-specific tokens live in app/tokens.project.css and are never touched.
 *
 * Run:
 *   node scripts/sync-tokens.js
 *   npm run tokens:sync
 *
 * Wired automatically into `npm run dev` so tokens are always fresh.
 */

const fs   = require('fs');
const path = require('path');

// Design-system compiled CSS — at ai-projects/figma-to-code-bg/design-system/
// __dirname is [project]/scripts/ → go up to ai-projects/ then into figma-to-code-bg/design-system/
const DS_TOKENS_PATH = path.resolve(
  __dirname,
  '../../figma-to-code-bg/design-system/dist/css/tokens.css'
);

// Destination inside this project
const PROJECT_TOKENS_PATH = path.resolve(__dirname, '../app/tokens.css');

if (!fs.existsSync(DS_TOKENS_PATH)) {
  console.warn('⚠  tokens:sync skipped — design system not found at:');
  console.warn('   ' + DS_TOKENS_PATH);
  console.warn('   Check that the design-system folder is at the expected path.');
  process.exit(0); // Non-fatal: dev server still starts
}

fs.copyFileSync(DS_TOKENS_PATH, PROJECT_TOKENS_PATH);
console.log('✓ tokens:sync — tokens.css refreshed from design system');
