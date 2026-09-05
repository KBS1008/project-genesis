# POST-V1 ICON-001 Resource SVG Rework V2 — Production Report

**Date:** 2026-09-05  
**Slice:** ICON-001 — Resource SVG Rework V2  
**Mode:** Controlled visual rework / reference-driven SVG production  
**Commit policy:** DO NOT COMMIT (per prompt §36)

---

## A. Executive Summary

ICON-001 V1 resource SVGs were rejected for insufficient visual quality (generic thin outline icons). All nine assets were reworked as clean SVG interpretations of the user-approved concept sheet: stylized industrial game resource art with material-specific color, simple gradients, strong dark outlines, and 48×48 authoring canvas. Filenames and resource IDs unchanged. Runtime integration not performed. A temporary nine-icon preview was created locally for visual gate review.

**Agent production decision:** OPTION A — ICON-001 V2 VISUAL PRODUCTION PASS (pending user + ChatGPT visual gate).

---

## B. Reason for Rework

V1 draft failed visual quality review. Icons were technically valid but:

- Too generic / navigation-symbol-like (DashboardIcon thin-stroke precedent)
- Poor material distinction (wood vs planks, stone vs iron ore, ore vs steel)
- Weak silhouettes at UI sizes
- Insufficient game-art identity

V1 artwork classified: **REJECTED_VISUAL_DRAFT**. Artwork replaced; filenames preserved.

---

## C. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| Starting HEAD | `cdb5a66b21f44fb3517690cde45ca11210fada5c` |
| Current HEAD | `cdb5a66b21f44fb3517690cde45ca11210fada5c` (unchanged — not committed) |
| Prior ICON-001 commit | `cdb5a66` — Post-V1: produce ICON-001 resource SVG icon family |

---

## D. V1 Integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags not moved. All ICON-001 V2 work is post-V1.

---

## E. Approved Visual Reference

**Primary authority:** Uploaded approved concept sheet — *Project Genesis Resource Icons – Concept Sheet (v2)*

Local copies:

- `docs/design/icons/Vorschlag_Icons.png`
- Session asset: approved concept sheet image (user upload)

Reference defines: stacked logs, lumber planks, grey stone cluster, dark ore with rust deposits, steel ingots, gear/bearing/bolt parts group, green PCB with chip, industrial motor assembly, packaged consumer goods (box/can/bag).

---

## F. Superseded Style Rules

| Rule | Status |
|------|--------|
| DashboardIcon.tsx as ICON-001 visual authority | **Superseded** for resource artwork |
| 24×24 navigation-icon constraint | **Re-evaluated** → 48×48 chosen |
| `currentColor` / stroke-only / no gradients | **Superseded** for resource artwork |
| `stroke-width="1.75"` lock | **Superseded** → 1.5 on 48×48 canvas |

DashboardIcon remains valid for general navigation/UI icons.

---

## G. V2 Visual Contract

**Direction:** Stylized industrial game resource icon

| Property | Value |
|----------|-------|
| Perspective | Slight 3/4 / isometric presentation |
| Rendering | Flat fills + simple linear gradients |
| Outline | Strong dark stroke, unified family |
| Background | Transparent |
| Text | None inside SVGs |
| Density | Compact, readable silhouettes |
| Family | Shared shadow, padding, outline philosophy |

---

## H. Canvas / ViewBox Decision

**Decision: 48×48**

| Option | Assessment |
|--------|------------|
| 24×24 | Too tight for dimensional log stacks, ingots, machinery, multi-object compositions |
| **48×48** | **Selected** — improves path precision and material detail while remaining scalable |
| 64×64 | Marginal gain over 48×48 for maintainability; larger DOM without proportional benefit |

Runtime UI sizing unchanged in this slice. Icons scale down to 24×24 via CSS/img dimensions.

**Practical minimum readable size:** 32×32 (identity retained); 24×24 readable for simpler icons (wood, planks, steel); complex icons (machine_parts, industrial_machinery) best at ≥32×32.

---

## I. Palette

Shared family tokens (not application theme tokens):

| Role | Color(s) |
|------|----------|
| Outline | `#1E1E22` |
| Ground shadow | `#000000` @ 10% opacity |
| Wood bark | `#9A6234` → `#5C3818` |
| Wood end grain | `#E0C490` → `#B89058` |
| Plank timber | `#E8D0A8` → `#C4A070` |
| Stone grey | `#A8A8B0` → `#686870` (3-tone cluster) |
| Iron ore rock | `#484850` → `#282830` |
| Ore accent | `#E87840` → `#B84820` |
| Steel metal | `#D8E0E8` → `#687078` + highlight `#F0F8FF` |
| Machine metal | `#B0B8C0` → `#707880` |
| PCB green | `#288848` → `#1A6030` |
| Chip / dark | `#383840` → `#121218` |
| Connector gold | `#C8A040` |
| Machinery accent | `#F0C030` → `#D89818` |
| Consumer box | `#B87848` → `#885830` |
| Consumer can | `#D84040` / `#F0F0F0` |
| Consumer bag | `#5090D0` → `#2868A8` |

---

## J. Outline / Rendering System

- **Stroke:** `#1E1E22`, width `1.5` (48×48 space)
- **Join/cap:** `round` where applicable
- **Fills:** Material linear gradients (2–3 stops max)
- **Detail lines:** Secondary strokes @ 0.5–0.8 opacity for grain, facets, traces
- **Shadow:** Ellipse under each composition (`rx≈14, ry≈2.2` at `cy≈42.5`)
- **No filters, masks, or raster embedding**

---

## K. Produced Asset Inventory

| Resource | Asset ID | Filename | Visual concept | Status |
|----------|----------|----------|----------------|--------|
| wood | ICON-001 | ICON-001_Wood.svg | Stacked raw logs, cut ends, bark grain | V2 produced |
| planks | ICON-001 | ICON-001_Planks.svg | Stacked rectangular processed boards | V2 produced |
| stone | ICON-001 | ICON-001_Stone.svg | Neutral grey rock cluster | V2 produced |
| iron_ore | ICON-001 | ICON-001_Iron_Ore.svg | Dark rough rocks + rust/orange ore deposits | V2 produced |
| steel | ICON-001 | ICON-001_Steel.svg | Stacked metallic ingots with highlights | V2 produced |
| machine_parts | ICON-001 | ICON-001_Machine_Parts.svg | Gear + bearing ring + bolt | V2 produced |
| advanced_electronics | ICON-001 | ICON-001_Advanced_Electronics.svg | Green PCB, central chip, gold connectors | V2 produced |
| industrial_machinery | ICON-001 | ICON-001_Industrial_Machinery.svg | Motor housing, yellow stripe, pipes, handle | V2 produced |
| consumer_goods | ICON-001 | ICON-001_Consumer_Goods.svg | Box + tin can + blue bag | V2 produced |

---

## L. Semantic Distinction Review

| Icon | SEMANTIC_RECOGNITION | SILHOUETTE | MATERIAL_IDENTITY | FAMILY_CONSISTENCY | SMALL_SIZE_READABILITY |
|------|---------------------|------------|-------------------|--------------------|-----------------------|
| wood | PASS | PASS | PASS | PASS | PASS (≥32) |
| planks | PASS | PASS | PASS | PASS | PASS |
| stone | PASS | PASS | PASS | PASS | PASS |
| iron_ore | PASS | PASS | PASS | PASS | PASS |
| steel | PASS | PASS | PASS | PASS | PASS |
| machine_parts | PASS | PASS | PASS | PASS | PASS (≥32) |
| advanced_electronics | PASS | PASS | PASS | PASS | PASS |
| industrial_machinery | PASS | PASS | PASS | PASS | PASS (≥32) |
| consumer_goods | PASS | PASS | PASS | PASS | PASS |

No material semantic FAIL.

---

## M. Pairwise Ambiguity Review

| Pair | Silhouette | Material / object language |
|------|------------|---------------------------|
| wood ↔ planks | DISTINCT (cylinders vs flat boards) | DISTINCT |
| stone ↔ iron_ore | DISTINCT (neutral grey vs dark + orange ore) | DISTINCT |
| iron_ore ↔ steel | DISTINCT (rough rocks vs geometric ingots) | DISTINCT |
| machine_parts ↔ industrial_machinery | DISTINCT (discrete parts vs complete motor) | DISTINCT |
| machine_parts ↔ advanced_electronics | DISTINCT (metal parts vs green PCB) | DISTINCT |
| consumer_goods ↔ generic storage | DISTINCT (box + can + bag finished goods) | DISTINCT |

---

## N. Family Consistency Review

All nine icons share:

- 48×48 viewBox with ~4px content padding
- Dark `#1E1E22` outline at 1.5px
- Ground shadow ellipse
- Stylized industrial density level
- Transparent background
- No embedded labels

**PASS**

---

## O. Small-Size Readability

Inspected at 64, 48, 32, 24 px via preview sheet.

| Size | Result |
|------|--------|
| 64×64 | Full detail clear |
| 48×48 | Primary review size — all identities clear |
| 32×32 | All recognizable; machine_parts / industrial_machinery slightly dense |
| 24×24 | Simpler icons OK; parts/machinery/electronics benefit from ≥32 in production UI |

**Practical minimum:** 32×32 for full family; 24×24 acceptable for wood/planks/stone/steel/consumer_goods.

---

## P. SVG Structural Validation

| Check | Result |
|-------|--------|
| Valid SVG/XML (PowerShell XML parse) | PASS — all 9 files |
| Square viewBox | PASS — `0 0 48 48` |
| Transparent background | PASS |
| No embedded raster | PASS |
| No embedded text | PASS |
| No base64 | PASS |
| No malformed paths | PASS |
| No poster/card background | PASS |
| Sensible DOM complexity | PASS (~15–35 elements per icon) |

**Classification:** RUNTIME_VALIDATION_NOT_REQUIRED_FOR_ASSET_REWORK

---

## Q. Asset Lifecycle Updates

Updated (uncommitted):

- `docs/design/VISUAL_ASSET_CATALOG.md` — V2 status, visual gate pending
- `docs/design/VISUAL_PRODUCTION_BACKLOG.md` — V2 rework note
- `docs/design/VISUAL_ASSET_CHANGELOG.md` — V1 rejected + V2 entry

---

## R. Files Changed

**SVG artwork (replaced):**

- `docs/design/icons/ICON-001_Wood.svg`
- `docs/design/icons/ICON-001_Planks.svg`
- `docs/design/icons/ICON-001_Stone.svg`
- `docs/design/icons/ICON-001_Iron_Ore.svg`
- `docs/design/icons/ICON-001_Steel.svg`
- `docs/design/icons/ICON-001_Machine_Parts.svg`
- `docs/design/icons/ICON-001_Advanced_Electronics.svg`
- `docs/design/icons/ICON-001_Industrial_Machinery.svg`
- `docs/design/icons/ICON-001_Consumer_Goods.svg`

**Lifecycle documentation:**

- `docs/design/VISUAL_ASSET_CATALOG.md`
- `docs/design/VISUAL_PRODUCTION_BACKLOG.md`
- `docs/design/VISUAL_ASSET_CHANGELOG.md`

**Report:**

- `docs/architecture/reviews/POST_V1_ICON_001_RESOURCE_SVG_REWORK_V2_REPORT.md`

**Temporary preview (not for commit):**

- `docs/design/icons/_preview_ICON-001_V2.html`

---

## S. Runtime Delta

**NONE**

No changes to PGInventoryWidget, PGProductionWidget, DashboardIcon, CSS, registry, or gameplay.

---

## T. Runtime Integration Status

**PENDING** — await user visual approval before integration slice.

---

## U. V1 Integrity Verification

| Check | Status |
|-------|--------|
| `v1.0.0` tag unmoved | ✓ |
| `v1.0.0-rc.1` tag unmoved | ✓ |
| V1 release artifact unchanged | ✓ |

**V1_RELEASE_ARTIFACT_UNCHANGED**

---

## V. Remaining Visual Issues

- SVG translation is a simplified interpretation of the concept sheet, not pixel-traced art; user may request micro-adjustments to match reference proportions more closely.
- `machine_parts` and `industrial_machinery` are the most detail-dense; may need slight simplification if production UI uses 24×24 exclusively.
- Preview HTML is local-only; open in browser for side-by-side gate review.

---

## W. Recommended Next Step

1. User + ChatGPT open `_preview_ICON-001_V2.html` or inspect SVGs at 48/32/24 px.
2. On visual approval → commit V2 artwork + lifecycle docs.
3. Follow-on slice: ICON-001 runtime integration (registry, resource tables, widgets).

Do **not** integrate into runtime until visual gate passes.

---

## X. Final Decision

**OPTION A — ICON-001 V2 VISUAL PRODUCTION PASS**

(Agent-side production complete; subject to user visual gate before commit/integration.)
