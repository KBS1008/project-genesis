# POST-V1 ICON-001 Site Inventory — Closeout Report

**Date:** 2026-09-05  
**Slice:** ICON-001 — Site Inventory runtime integration closeout  
**Mode:** Controlled closeout / commit  
**Push policy:** DO NOT PUSH (per prompt §29)

---

## A. Executive Summary

ICON-001 Site Inventory integration is closed locally. A scoped commit (`62fc619`) integrates nine certified resource icons into the Site Inventory table only, with 48×48 runtime derivatives, registry entries, `ResourceIcon`, presentation `resourceId` propagation, tests, lifecycle documentation, integration report, and runtime screenshot evidence.

Source PNG production was already committed in `73c074b`. V1 and RC tags remain unchanged. Unrelated working-tree changes were excluded.

**Decision:** OPTION B — CLOSEOUT PASS / UNRELATED WORK REMAINS

---

## B. Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| Starting HEAD | `73c074bb9b444eff0e748f867dec438508461cf4` |
| Closeout HEAD | `62fc61989c746445f77416df10a11e71fdb25b68` |
| Prior ICON-001 commit | `73c074b` — PNG certification + readiness audit |

---

## C. Working Tree Classification

| File / Pattern | Classification | Staged? | Reason |
|----------------|----------------|---------|--------|
| `apps/web/public/assets/icons/ICON-001-*.{png,webp}` (18) | A — ICON-001 APPROVED | Yes | Runtime derivatives |
| `apps/web/src/presentation/**` (ResourceIcon, registry, mappers, CSS, tests) | A — ICON-001 APPROVED | Yes | Site inventory integration |
| `tools/sync-runtime-visual-assets.ts` | A — ICON-001 APPROVED | Yes | ICON-001 sync pipeline |
| `docs/architecture/reviews/POST_V1_ICON_001_RUNTIME_INTEGRATION_SITE_INVENTORY_REPORT.md` | B — DOCUMENTATION / EVIDENCE | Yes | Integration report |
| `docs/architecture/reviews/evidence/POST_V1_ICON_001_SITE_INVENTORY_RUNTIME.png` | B — DOCUMENTATION / EVIDENCE | Yes | Approved runtime screenshot |
| `docs/design/VISUAL_ASSET_CATALOG.md` | B — DOCUMENTATION / EVIDENCE | Yes | Lifecycle — site inventory integrated |
| `docs/design/VISUAL_ASSET_CHANGELOG.md` | B — DOCUMENTATION / EVIDENCE | Yes | Lifecycle changelog entry |
| `docs/design/VISUAL_PRODUCTION_BACKLOG.md` | B — DOCUMENTATION / EVIDENCE | Yes | Backlog status update |
| `docs/design/icons/ICON-001_*.png` (9) | A — already in `73c074b` | N/A | Source production complete; unchanged |
| `docs/architecture/reviews/M11_*.md`, `M12_7_*.md` | C — PRE-EXISTING / UNRELATED | No | M11/M12 review edits |
| `docs/design/Bilder/**`, mockups, UI guidelines | C — PRE-EXISTING / UNRELATED | No | Design workspace churn |
| `docs/development/Prompts/**` (untracked) | C — PRE-EXISTING / UNRELATED | No | Prompt archive — not part of slice |
| `apps/api/saves/**`, `saves/**` | D — TEMPORARY | No | Temp smoke saves |
| `docs/design/charts/CH-010_Charts.svg` (deleted) | C — UNRELATED | No | Unrelated deletion |
| `POST_V1_VISUAL_ASSET_GRAPHICS_READINESS_AUDIT.md` | C — UNRELATED | No | Separate audit slice |

---

## D. V1 Integrity

| Tag | Expected | Before closeout | After closeout |
|-----|----------|-----------------|----------------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ | ✓ |

Tags not moved, not recreated.

---

## E. Source Asset Verification

| Check | Result |
|-------|--------|
| Count | 9 authoritative PNGs in `docs/design/icons/` |
| Dimensions | 1254×1254 RGBA (all nine) |
| Modified during closeout | **NO** |
| Wood normalized | Retained (committed in `73c074b`) |
| Committed in this slice | N/A — already in `73c074b` |

---

## F. Runtime Derivative Verification

| Check | Result |
|-------|--------|
| Location | `apps/web/public/assets/icons/` |
| PNG count | 9 × 48×48 |
| WebP count | 9 × 48×48 |
| Total | 18 files |
| Extra derivatives | None (no 64/128 variants) |
| Sync deterministic | ✓ `pnpm sync-visual-assets` regenerates identical family |
| Committed | ✓ in `62fc619` |

---

## G. Registry Verification

| Check | Result |
|-------|--------|
| Entry count | 9 |
| IDs | `ICON-001-wood` … `ICON-001-consumer_goods` |
| PNG/WebP paths | `/assets/icons/ICON-001-<id>.{png,webp}` |
| Preload | `false` for all |
| Duplicate IDs | None |
| Rejected SVG runtime entries | None |

---

## H. Presentation Integration Verification

| Check | Result |
|-------|--------|
| `InventoryItemRowViewData.resourceId` | ✓ Mapped from read model |
| Site inventory cell | `ResourceIcon` + visible label |
| Numeric columns | Unchanged |
| Warehouse detail rows | Text only — correctly deferred |
| API/domain delta | None |

---

## I. Fallback / Accessibility Verification

| Scenario | Result |
|----------|--------|
| Known resource | Icon + text |
| Unknown resource | Text only |
| Registry miss | Text only |
| Image load failure | Icon hidden via local `onError` |
| Accessibility | `alt=""`, `aria-hidden="true"` |

---

## J. Validation Results

| Command | Result |
|---------|--------|
| Targeted tests (21) | PASS |
| `pnpm sync-visual-assets` | PASS |
| `pnpm build:web` | PASS |
| Runtime recheck required | NO — sync output deterministic; approved screenshot preserved |

---

## K. Visual Evidence

| Item | Value |
|------|-------|
| Path | `docs/architecture/reviews/evidence/POST_V1_ICON_001_SITE_INVENTORY_RUNTIME.png` |
| SHA-256 | `E15232062926568BF2DD9CAFFB832F7E9ABBD252B6F39E3CE956929977E2E28A` |
| Preserved unchanged | ✓ Committed as-is |
| Shows | Site Inventory with Eisenerz, Stein, Holz icons |

---

## L. Lifecycle Status

| State | Status |
|-------|--------|
| ICON-001 source production | COMPLETE (`73c074b`) |
| ICON-001 site inventory integration | COMPLETE / PASS (`62fc619`) |
| Warehouse, market, production, transport, etc. | DEFERRED |

---

## M. Non-Blocking Observations

The first Site Inventory column can truncate resource headers and labels aggressively at narrow widget widths. This is a **pre-existing layout observation**, not an ICON-001 integration blocker. Not fixed in this closeout. Icons remain at `var(--icon-lg)` (~24px).

---

## N. Files Included in Commit

**Commit:** `62fc61989c746445f77416df10a11e71fdb25b68`

- `apps/web/public/assets/icons/ICON-001-*.{png,webp}` (18)
- `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.test.ts`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx`
- `apps/web/src/presentation/adapters/view-data/company-dashboard-view-data.ts`
- `apps/web/src/presentation/assets/index.ts`
- `apps/web/src/presentation/assets/resource-icon-asset-ids.test.ts`
- `apps/web/src/presentation/assets/resource-icon-asset-ids.ts`
- `apps/web/src/presentation/assets/visual-asset-registry.test.ts`
- `apps/web/src/presentation/assets/visual-asset-registry.ts`
- `apps/web/src/presentation/components/assets/ResourceIcon.test.tsx`
- `apps/web/src/presentation/components/assets/ResourceIcon.tsx`
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`
- `apps/web/src/presentation/screens/market/MarketScreen.test.tsx`
- `apps/web/src/presentation/screens/production/ProductionScreen.test.tsx`
- `tools/sync-runtime-visual-assets.ts`
- `docs/architecture/reviews/POST_V1_ICON_001_RUNTIME_INTEGRATION_SITE_INVENTORY_REPORT.md`
- `docs/architecture/reviews/evidence/POST_V1_ICON_001_SITE_INVENTORY_RUNTIME.png`
- `docs/design/VISUAL_ASSET_CATALOG.md`
- `docs/design/VISUAL_ASSET_CHANGELOG.md`
- `docs/design/VISUAL_PRODUCTION_BACKLOG.md`

---

## O. Files Explicitly Excluded

- M11/M12 review doc edits
- `docs/design/Bilder/**` churn and deletions
- Dashboard mockups, UI guidelines (untracked)
- Development prompts (untracked)
- `apps/api/saves/**`, root `saves/**` temp files
- `POST_V1_VISUAL_ASSET_GRAPHICS_READINESS_AUDIT.md`

---

## P. Commit

| Item | Value |
|------|-------|
| SHA | `62fc61989c746445f77416df10a11e71fdb25b68` |
| Subject | `feat(web): integrate ICON-001 resource icons in site inventory` |
| Files changed | 38 |
| Insertions | 718 |
| Deletions | 16 |

---

## Q. Post-Commit Working Tree

Working tree is **not clean**. Remaining changes are unrelated M11/M12 docs, design Bilder churn, untracked prompts/mockups/saves — all safely uncommitted.

---

## R. V1 / RC Tag Verification After Commit

| Tag | SHA | Moved? |
|-----|-----|--------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | No |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | No |

---

## S. Final Decision

**OPTION B — CLOSEOUT PASS / UNRELATED WORK REMAINS**

ICON-001 Site Inventory slice committed cleanly. Validation passes. Visual evidence preserved. Lifecycle accurate. V1/RC immutable. Unrelated local work preserved uncommitted. Not pushed. Not tagged.
