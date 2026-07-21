# Assets — bg-ssot-consent

Auto-extracted from Figma on 2026-06-24.
Claude reads this file during pre-flight to know which icon library is installed and which asset files are available.

---

## Icon Library

| Package | Import example |
|---|---|
| `@phosphor-icons/react` | `import { IconName } from '@phosphor-icons/react'` |

---

## Exported Assets

Assets with Figma export settings were automatically downloaded to `public/assets/`.

### Exported

| Asset | Path | Format |
|---|---|---|
| `logo` | `public/assets/logo.png` | PNG |
| `test-kit` | `public/assets/test-kit.png` | PNG |
| `icon` | `public/assets/icon.png` | PNG |
| `insurance` | `public/assets/insurance.png` | PNG |
| `queue` | `public/assets/queue.png` | PNG |
| `funnel` | `public/assets/funnel.png` | PNG |
| `table` | `public/assets/table.png` | PNG |
| `export` | `public/assets/export.png` | PNG |
| `search-bar-button` | `public/assets/search-bar-button.png` | PNG |

---

## Using Assets in Code

**Icons** — import from the installed package. Do not recreate icon SVGs manually:
```jsx
import { IconName } from '@phosphor-icons/react'
<IconName size={24} />
```

**Images and vector assets** — reference from the `public/` directory:
```jsx
<img src="/assets/filename.svg" alt="description" />

import Image from 'next/image'
<Image src="/assets/filename.png" width={400} height={300} alt="description" />
```
