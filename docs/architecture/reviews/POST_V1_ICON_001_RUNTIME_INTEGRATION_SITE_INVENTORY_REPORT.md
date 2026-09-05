# POST-V1 ICON-001 Runtime Integration — Site Inventory Report

**Date:** 2026-09-05  
**Slice:** ICON-001 — First runtime integration (Site Inventory table)  
**Mode:** Small controlled runtime implementation  
**Commit policy:** DO NOT COMMIT (per prompt §37)

---

## A. Executive Summary

The nine certified ICON-001 resource PNG artworks are integrated into exactly one runtime surface: the **Site Inventory** table in `PGInventoryWidget` on the Company Operations Dashboard. Presentation-layer `resourceId` propagation, registry entries, sync derivatives (48×48 PNG + WebP), a thin `ResourceIcon` wrapper, and site-inventory row mapping are complete. Source artwork in `docs/design/icons/` remains untouched.

Automated tests (21 targeted), `pnpm sync-visual-assets`, and `pnpm build:web` pass. Manual runtime inspection with save `saves/m12-rc-smoke.json` confirms correct artwork for site-inventory rows (iron ore, stone, wood visible; all nine registry/runtime assets verified). Screenshot evidence captured.

**Decision:** OPTION A — SITE INVENTORY ICON INTEGRATION PASS

---

## B. Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| Starting HEAD | `73c074bb9b444eff0e748f867dec438508461cf4` (ICON-001 PNG certification commit) |
| Current HEAD | `73c074bb9b444eff0e748f867dec438508461cf4` (integration uncommitted) |
| Mode | Controlled runtime implementation slice |
| Authoritative contract | `POST_V1_ICON_001_RUNTIME_INTEGRATION_READINESS_AUDIT.md` |

---

## C. V1 Integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags not moved. All ICON-001 site-inventory work is post-V1 and uncommitted.

---

## D. Source Asset Status

| Check | Result |
|-------|--------|
| Authoritative location | `docs/design/icons/ICON-001_*.png` (9 files) |
| Dimensions | 1254×1254 RGBA (all nine) |
| Source files modified in this slice | **NO** |
| Wood normalization (prior slice) | Retained — SHA-256 `73ae60f5391c0ca6e70528d8b4cfdb95e8b28369695c7b654e8971dd661b4b7c` |

---

## E. Implementation Scope

| In scope | Status |
|----------|--------|
| Site inventory resource rows (`mapOperationsSiteInventoryRows`) | ✓ Integrated |
| `PGInventoryWidget` site table only | ✓ |

| Explicitly excluded (unchanged) | Status |
|----------------------------------|--------|
| Warehouse detail rows | ✓ Text labels only — no `ResourceIcon` |
| Market, production, transport, charts, world, notifications | ✓ Unchanged |
| Gameplay / API / domain | ✓ No delta |

---

## F. Presentation resourceId Propagation

`InventoryItemRowViewData` extended with `resourceId: string` in `company-dashboard-view-data.ts`.

Mapped from existing API read model in `company-dashboard-view-mappers.ts`:

```807:811:apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts
        resourceId: item.resourceId,
        resourceLabel: labels.resource(item.resourceId),
        quantity: item.quantity,
        reserved: item.reserved,
        available: item.available,
```

Presentation propagation only — no label inference, no API change.

Fixture tests updated in `MarketScreen.test.tsx` and `ProductionScreen.test.tsx` to include `resourceId` where inventory fixtures are used.

---

## G. Registry Integration

Nine runtime entries added to `visual-asset-registry.ts`:

| Registry ID | PNG path | WebP path | Preload | Component |
|-------------|----------|-----------|---------|-----------|
| `ICON-001-wood` | `/assets/icons/ICON-001-wood.png` | `/assets/icons/ICON-001-wood.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-planks` | `/assets/icons/ICON-001-planks.png` | `/assets/icons/ICON-001-planks.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-stone` | `/assets/icons/ICON-001-stone.png` | `/assets/icons/ICON-001-stone.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-iron_ore` | `/assets/icons/ICON-001-iron_ore.png` | `/assets/icons/ICON-001-iron_ore.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-steel` | `/assets/icons/ICON-001-steel.png` | `/assets/icons/ICON-001-steel.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-machine_parts` | `/assets/icons/ICON-001-machine_parts.png` | `/assets/icons/ICON-001-machine_parts.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-advanced_electronics` | `/assets/icons/ICON-001-advanced_electronics.png` | `/assets/icons/ICON-001-advanced_electronics.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-industrial_machinery` | `/assets/icons/ICON-001-industrial_machinery.png` | `/assets/icons/ICON-001-industrial_machinery.webp` | `false` | `PGInventoryWidget` |
| `ICON-001-consumer_goods` | `/assets/icons/ICON-001-consumer_goods.png` | `/assets/icons/ICON-001-consumer_goods.webp` | `false` | `PGInventoryWidget` |

Mapping helper: `resource-icon-asset-ids.ts` — `resourceIdToIconAssetId()` / `resolveResourceIconAssetId()` with registry existence check.

---

## H. Sync / Runtime Derivatives

Extended `tools/sync-runtime-visual-assets.ts` with ICON-001 resize pipeline (`ICON_RUNTIME_PX = 48`, Sharp, alpha preserved, `WEBP_QUALITY = 82`).

| Resource | Source | Runtime PNG | Runtime WebP | Dimensions | Status |
|----------|--------|-------------|--------------|------------|--------|
| wood | `ICON-001_Wood.png` | `ICON-001-wood.png` | `ICON-001-wood.webp` | 48×48 | PASS |
| planks | `ICON-001_Planks.png` | `ICON-001-planks.png` | `ICON-001-planks.webp` | 48×48 | PASS |
| stone | `ICON-001_Stone.png` | `ICON-001-stone.png` | `ICON-001-stone.webp` | 48×48 | PASS |
| iron_ore | `ICON-001_Iron_Ore.png` | `ICON-001-iron_ore.png` | `ICON-001-iron_ore.webp` | 48×48 | PASS |
| steel | `ICON-001_Steel.png` | `ICON-001-steel.png` | `ICON-001-steel.webp` | 48×48 | PASS |
| machine_parts | `ICON-001_Machine_Parts.png` | `ICON-001-machine_parts.png` | `ICON-001-machine_parts.webp` | 48×48 | PASS |
| advanced_electronics | `ICON-001_Advanced_Electronics.png` | `ICON-001-advanced_electronics.png` | `ICON-001-advanced_electronics.webp` | 48×48 | PASS |
| industrial_machinery | `ICON-001_Industrial_Machinery.png` | `ICON-001-industrial_machinery.png` | `ICON-001-industrial_machinery.webp` | 48×48 | PASS |
| consumer_goods | `ICON-001_Consumer_Goods.png` | `ICON-001-consumer_goods.png` | `ICON-001-consumer_goods.webp` | 48×48 | PASS |

**Totals:** 9 PNG + 9 WebP = 18 files under `apps/web/public/assets/icons/`. All verified 48×48 RGBA via Sharp metadata decode.

---

## I. ResourceIcon Implementation

Thin presentation component at `apps/web/src/presentation/components/assets/ResourceIcon.tsx`:

1. Accepts canonical `resourceId`
2. Resolves certified registry entry via `resolveResourceIconAssetId()`
3. Renders via `resolveVisualAssetSources()` + `<picture>` / `<img>` (local wrapper — does not alter global `PGVisualAssetImage` semantics)
4. `alt=""`, `aria-hidden`, `loading="lazy"`, `decoding="async"`
5. `onError` hides broken image (local failure handling)

No gameplay, economy, or resource-definition logic.

---

## J. Fallback Behaviour

| Scenario | Behaviour | Verified |
|----------|-----------|----------|
| Unknown `resourceId` | `ResourceIcon` returns `null`; label remains | ✓ Unit test |
| Registry miss | Returns `null` | ✓ Unit test |
| Missing runtime file / 404 | `onError` → hidden; label remains | ✓ Implemented (component test architecture) |
| Layout | No broken-image glyph; row height unchanged | ✓ Manual |

No generic placeholder icon introduced.

---

## K. Accessibility

Resource name remains visibly rendered in `.pg-resource-cell-label` adjacent to the icon. Icon is decorative: `alt=""` and `aria-hidden="true"`. Screen readers announce the text label only — no duplicate “Wood Wood” pattern.

---

## L. Site Inventory Integration

Site inventory first cell in `mapOperationsSiteInventoryRows()`:

```309:312:apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx
          <span className="pg-resource-cell" key={`resource-${item.resourceId}`}>
            <ResourceIcon resourceId={item.resourceId} />
            <span className="pg-resource-cell-label">{item.resourceLabel}</span>
          </span>,
```

Numeric columns (`Reserviert`, `Verfügbar`) unchanged. No dedicated icon column added.

Warehouse blocks (`mapOperationsWarehouseBlocks`) retain text-only resource labels — correctly deferred.

---

## M. CSS / Layout Delta

Added to `dashboard-components.css`:

- `.pg-resource-cell` — inline-flex, gap, `min-width: 0`
- `.pg-resource-cell-label` — ellipsis truncation preserved
- `.pg-resource-icon` — `width/height: var(--icon-lg)` (1.5rem ≈ 24px), `flex-shrink: 0`, `object-fit: contain`

No global asset CSS. No row-height redesign.

---

## N. Automated Tests

| Suite | Result |
|-------|--------|
| `resource-icon-asset-ids.test.ts` | 4 passed |
| `visual-asset-registry.test.ts` (ICON-001 entries) | 7 passed |
| `ResourceIcon.test.tsx` | 3 passed |
| `company-operations-table-mappers.test.ts` (site inventory) | 7 passed |
| **Total targeted** | **21 passed** |

Coverage includes: nine registry entries, mapping contract (`wood` → `ICON-001-wood`, etc.), unknown resource safe no-icon, `resourceId` preservation in site-inventory rows, decorative semantics.

---

## O. Build Validation

| Command | Result |
|---------|--------|
| `pnpm sync-visual-assets` | PASS — 9 ICON-001 derivatives regenerated |
| `pnpm build:web` | PASS (pre-existing ESLint warnings in unrelated files only) |

---

## P. Manual Runtime Validation

| Check | Result |
|-------|--------|
| Dev stack | `pnpm dev` (API :3001, Web :3000) |
| Save loaded | `saves/m12-rc-smoke.json` (`RC Smoke Test`) |
| Navigation | Company → Operatives Dashboard → Inventar (Standort) |
| Artwork visible | ✓ Iron ore, stone, wood icons render correctly |
| Correct PNG URLs | CDP: `/assets/icons/ICON-001-iron_ore.png`, `-stone.png`, `-wood.png` |
| Scale | ~24px CSS (`--icon-lg`) — appropriate at widget width |
| Clipping / distortion | None observed |
| Labels readable | ✓ (truncated at narrow column width — pre-existing table behaviour) |
| Numeric alignment | Unchanged |
| Transparent background | ✓ |
| Viewports | Widget-level screenshot at default browser width; full 1236×697 / 1920×1080 dashboard pass not separately captured (layout responsive; icons verified at runtime) |

---

## Q. Screenshot Evidence

**Path:** `docs/architecture/reviews/evidence/POST_V1_ICON_001_SITE_INVENTORY_RUNTIME.png`

Shows **Inventar (Standort)** with resource icons for **Eisenerz**, **Stein**, and **Holz** alongside labels and quantity columns.

---

## R. Lifecycle Updates

| Document | Update |
|----------|--------|
| `VISUAL_ASSET_CATALOG.md` | ICON-001 entries marked runtime integrated (site inventory) |
| `VISUAL_ASSET_CHANGELOG.md` | 2026-09-05 site inventory integration entry |
| `VISUAL_PRODUCTION_BACKLOG.md` | ICON-001 marked runtime integrated; deferred consumers noted |

Additional consumers not marked complete.

---

## S. Files Changed

**New**

- `apps/web/public/assets/icons/ICON-001-*.png` (9)
- `apps/web/public/assets/icons/ICON-001-*.webp` (9)
- `apps/web/src/presentation/assets/resource-icon-asset-ids.ts`
- `apps/web/src/presentation/assets/resource-icon-asset-ids.test.ts`
- `apps/web/src/presentation/components/assets/ResourceIcon.tsx`
- `apps/web/src/presentation/components/assets/ResourceIcon.test.tsx`
- `docs/architecture/reviews/evidence/POST_V1_ICON_001_SITE_INVENTORY_RUNTIME.png`

**Modified**

- `apps/web/src/presentation/adapters/view-data/company-dashboard-view-data.ts`
- `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.test.ts`
- `apps/web/src/presentation/assets/visual-asset-registry.ts`
- `apps/web/src/presentation/assets/visual-asset-registry.test.ts`
- `apps/web/src/presentation/assets/index.ts`
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`
- `apps/web/src/presentation/screens/market/MarketScreen.test.tsx`
- `apps/web/src/presentation/screens/production/ProductionScreen.test.tsx`
- `tools/sync-runtime-visual-assets.ts`
- `docs/design/VISUAL_ASSET_CATALOG.md`
- `docs/design/VISUAL_ASSET_CHANGELOG.md`
- `docs/design/VISUAL_PRODUCTION_BACKLOG.md`

**Report (this file)**

- `docs/architecture/reviews/POST_V1_ICON_001_RUNTIME_INTEGRATION_SITE_INVENTORY_REPORT.md`

---

## T. Explicit Deferrals

| Surface | Status |
|---------|--------|
| Warehouse detail rows | Deferred |
| Market widget / MarketScreen | Deferred |
| Production widget / recipes | Deferred |
| Transport / supply chain | Deferred |
| Contracts, notifications, charts, world map, tutorials, building panels | Deferred |
| 64×64 / 128×128 runtime derivatives | Deferred (UI placement audit first) |

---

## U. Remaining Issues

None blocking this slice.

Minor notes (non-blocking):

- `ResourceIcon` uses direct `<picture>`/`<img>` rather than `PGVisualAssetImage` — intentional local wrapper to avoid global error-semantics change; behaviour matches contract.
- Full-viewport 1236×697 and 1920×1080 dashboard screenshots not captured separately; widget screenshot + runtime CDP verification sufficient for this pass.

---

## V. V1 Integrity Verification

Re-checked after implementation:

| Tag | SHA | Moved? |
|-----|-----|--------|
| `v1.0.0` | `c4bb643…` | No |
| `v1.0.0-rc.1` | `442665c…` | No |

No gameplay/domain delta. HEAD unchanged (`73c074b`) — integration remains uncommitted per prompt.

---

## W. Recommended Next Step

After user review and explicit commit approval: commit the site-inventory integration slice only (exclude unrelated M11/M12 doc churn and temp saves). Do **not** automatically expand to warehouse or market surfaces — schedule a separate readiness decision per consumer.

---

## X. Final Decision

**OPTION A — SITE INVENTORY ICON INTEGRATION PASS**

All nine registry entries correct. All 18 runtime derivatives correct (48×48). Site inventory uses canonical `resourceId`. Known resources render correct icons. Unknown resources safe. Image-load failure handled locally. Accessibility correct. Targeted tests pass. `build:web` passes. Manual runtime inspection passes. Screenshot evidence exists. No gameplay/domain delta.
