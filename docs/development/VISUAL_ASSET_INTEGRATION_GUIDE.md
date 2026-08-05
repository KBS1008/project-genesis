# Visual Asset Integration Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 4C — Visual Asset Integration  
**Audience:** Frontend developers and visual production

---

## Overview

Phase 4C connects approved design assets to the running game through a **central visual asset registry**. Assets are either served at runtime from `apps/web/public/assets/` or explicitly classified as design references.

No gameplay logic lives in the asset layer — components resolve decorative backgrounds and reference mappings only.

---

## Asset lifecycle

```text
Design import (Visual Asset Manager)
  └── docs/design/…                     Canonical design archive
        └── tools/sync-runtime-visual-assets.ts
              └── apps/web/public/assets/ Runtime static files
                    └── presentation/assets/visual-asset-registry.ts
                          └── PGVisualAssetBackground / screens
```

| Stage | Location | Purpose |
|-------|----------|---------|
| Design archive | `docs/design/` | Approved PNG/SVG source files |
| Runtime static | `apps/web/public/assets/` | Browser-served files |
| Registry | `presentation/assets/visual-asset-registry.ts` | IDs, categories, paths, components |
| Loader | `presentation/assets/visual-asset-loader.ts` | URL resolution, preload, cache |
| UI primitive | `presentation/components/assets/PGVisualAsset.tsx` | Background + image rendering |

---

## Categories

| Category | Meaning | Example |
|----------|---------|---------|
| **runtime** | Served from `/assets/…` and visible in game | MM-001–MM-007 backgrounds |
| **reference** | Mockup only; PG component renders UI | DB-001–DB-010 dashboard mockups |
| **svg-runtime** | SVG or procedural vector in components | CH-010 style ref, PGWorldCanvas grid |
| **documentation** | Architecture / pipeline diagrams | ADR graphics |

Every approved asset must appear in `VISUAL_ASSET_REGISTRY` with exactly one category.

---

## Runtime asset mapping

| Asset ID | Public path | Screen / component |
|----------|-------------|-------------------|
| MM-001 | `/assets/main-menu/MM-001.png` | `MainMenuScreen` background |
| MM-006 | `/assets/main-menu/MM-006.png` | `SplashScreen` background |
| MM-007 | `/assets/main-menu/MM-007.png` | `MenuLoadingScreen` background |
| MM-002–MM-005 | `/assets/main-menu/MM-00x.png` | Panel layout references (React UI on top) |
| BR-001 | `/assets/main-menu/MM-006.png` | Brand mark fallback until dedicated logo |
| CH-010 | `/assets/charts/CH-010_Charts.svg` | Chart style reference |

**Rule:** PNG mockups are **never** rendered as UI chrome with embedded text. Backgrounds use `PGVisualAssetBackground` with a token overlay; all labels remain React strings.

---

## Dashboard reference mapping

Dashboard PNGs are Category B. Runtime UI is rendered by PG widgets:

| Mockup | PG component |
|--------|--------------|
| DB-001 | `ExecutiveDashboardScreen` |
| DB-002 | `PGKpiCard` |
| DB-003 | `PGStatusPanel` |
| DB-004 | `PGNotificationCenter` |
| DB-005 | `PGFinanceWidget` |
| DB-006 | `PGProductionWidget` |
| DB-007 | `PGResearchWidget` |
| DB-008 | `PGSupplyChainWidget` |
| DB-009 | `PGCompanyWidget` |
| DB-010 | `PGReportWidget` |

Source: `presentation/assets/dashboard-asset-mapping.ts`

---

## World module

WM-001–WM-010 mockups are **planned references** (no PNG on disk yet). Runtime visualization uses procedural SVG (Phase 4A/4B):

| Registry ID | Component | Notes |
|-------------|-----------|-------|
| WM-SVG-GRID | `PGWorldCanvas` | Token-stroked grid layer |
| WM-SVG-LEGEND | `PGWorldLegend` | CSS swatches for active layers |
| WM-001 | `PGWorldCanvas` | Future mockup reference |

Decorative frame: `pg-world-asset-frame` in `PGWorldWorkspace`.

---

## Loading pipeline

```typescript
import { resolveVisualAssetUrl, preloadCriticalVisualAssets } from '@/presentation/assets';

// Resolve URL
const url = resolveVisualAssetUrl('MM-006');

// Preload boot assets (MM-001, MM-006, MM-007, BR-001)
await preloadCriticalVisualAssets();
```

`MainMenuScreen` calls `useVisualAssetPreload(PRELOAD_VISUAL_ASSET_IDS)` on mount.

Features:

- Central registry — no duplicated path strings in screens
- Lazy preload — non-critical assets load on demand
- Fallback chain — `fallbackId` on registry entries
- In-memory cache — `getVisualAssetLoadState(assetId)`
- **Format control** — `format: 'png' | 'svg' | 'webp'` per entry
- **WebP preference** — `webp` path + automatic `image-set()` / `<picture>` fallback
- **Theme variants** — optional `themeVariants: { light, dark }` paths (reserved for future mockups)

### Registry entry shape

```typescript
{
  id: 'MM-006',
  type: 'runtime',
  component: 'SplashScreen',
  preload: true,
  theme: 'default',
  format: 'png',
  path: '/assets/main-menu/MM-006.png',
  webp: '/assets/main-menu/MM-006.webp',
  themeVariants: null, // e.g. { light: '...', dark: '...' }
}
```

Screens resolve assets only by ID — format and theme selection stay in the loader.

---

## Sync command

After importing new design files:

```bash
pnpm sync-visual-assets
```

This copies PNG/SVG sources into `apps/web/public/assets/` and **generates WebP variants** for all main-menu PNGs (quality 82, ~90% smaller). The runtime loader prefers WebP automatically when the browser supports it.

Then register new assets in `visual-asset-registry.ts` and update `VISUAL_ASSET_CATALOG.md`.

---

## Testing

| Test file | Coverage |
|-----------|----------|
| `visual-asset-registry.test.ts` | Classification, dashboard map, preload IDs |
| `visual-asset-loader.test.ts` | URL resolution, preload success/error |

Run: `pnpm test -- visual-asset`

---

## Related documents

- `docs/design/VISUAL_ASSET_CATALOG.md` — master asset list
- `docs/design/VISUAL_PRODUCTION_BACKLOG.md` — production status
- `docs/architecture/GLOBAL_ASSET_REGISTRY.md` — long-term registry architecture
- `docs/architecture/reviews/M11_PHASE4C_VISUAL_ASSET_INTEGRATION_REPORT.md` — Phase 4C report
- `docs/development/MAIN_MENU_IMPLEMENTATION_GUIDE.md`
- `docs/development/WORLD_MODULE_IMPLEMENTATION_GUIDE.md`
