# Post-V1 Building Infrastructure Visual Contract — Review

**Task:** `POST_V1_BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT_EXTENSION.md`  
**Date:** 2026-09-19  
**Recommendation:** **APPROVE INFRASTRUCTURE CONTRACT** (pending human visual sign-off)  
**Final decision:** **OPTION A — INFRASTRUCTURE VISUAL CONTRACT READY FOR HUMAN VISUAL APPROVAL**

---

## A. Executive Summary

Defined LINEAR and TERMINAL/YARD grammars extending sealed ICON-003 B2 without activating production. Created three contract pilots (alpha 3/3 PASS), compact glyphs, and comparison evidence. Production remains **20/23 ICON-003** and **3/23 ICON-002** fallback. No gameplay, content, World, or registry changes.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD | `93e5413d1bf61ac0a514c081de461e9ff458a4e1` |
| Branch | `master` (local) |

**CONTRACT-TASK-OWNED (new/modified for this slice):**

- `docs/design/buildings/BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT.md`
- `docs/design/buildings/infrastructure-pilot/**` (primary PNGs, compact SVGs, manifest, alpha report)
- `docs/architecture/reviews/POST_V1_BUILDING_INFRASTRUCTURE_VISUAL_CONTRACT_REVIEW.md`
- `docs/architecture/reviews/evidence/INFRASTRUCTURE_VISUAL_CONTRACT_*.png`
- `tools/process-infrastructure-pilot-alpha.ts`
- `tools/infrastructure-visual-contract-evidence-boards.ts`
- `assets/ICON-003-*-infra-pilot-source.png` (generation sources)

**PRE-EXISTING / UNRELATED:** Dashboard/shell mappers, M11/M12 docs, dev building-pilot pages, `.next`, api saves, other untracked reviews — not absorbed.

---

## C. Current 20/23 Authority

Batches 1–3 **SEALED** on HEAD. `ICON_003_PRODUCTION_BUILDING_TYPE_IDS` unchanged. `buildingTypeToIcon003PrimaryAssetId('port'|'access_road'|'rail_terminal')` → `null`; fallback `ICON-002-infrastructure` via `BuildingTypeIcon`.

---

## D. Authoritative Semantics

See contract §4 and YAML:

- **access_road:** 5×2, free construction, connects start plot to transport network (text), no recipes.
- **port:** 6×4, gated bulk trade facility (research + milestone), no recipes.
- **rail_terminal:** 5×3, gated heavy transport hook (research + milestone), no recipes.

No modeled orientation, adjacency graph, or water/rail attachment in building YAML. Visuals use **identity cues only**.

**Unresolved product ambiguity:** NO.

---

## E. Runtime Role Audit

| Surface | access_road | port | rail_terminal |
|---------|-------------|------|---------------|
| BuildingsScreen catalog (72px primary) | CURRENT — ICON-002 fallback | CURRENT — fallback | CURRENT — fallback |
| BuildingTypeIcon compact lists | CURRENT — fallback | CURRENT — fallback | CURRENT — fallback |
| Placement UI | CURRENT — type selectable like other buildings | CURRENT | CURRENT |
| Production UI | NOT APPROPRIATE (no recipes) | NOT APPROPRIATE | NOT APPROPRIATE |
| World map markers | POTENTIAL FUTURE | POTENTIAL FUTURE | POTENTIAL FUTURE |
| Transport UI | POTENTIAL FUTURE (identity only) | POTENTIAL FUTURE | POTENTIAL FUTURE |
| Pilots in production roles | **NOT INTEGRATED** | **NOT INTEGRATED** | **NOT INTEGRATED** |

---

## F. Existing B2 Invariants

Documented in contract §5; aligned with `BUILDING_VISUAL_IDENTITY_B2_ART_SPEC.md` (camera SE, upper-left light, alpha policy, compact @32px, no text in art).

---

## G. Infrastructure Variables

Allowed: footprint aspect in composition, ground-plane extent, yard/track/water **interface** cues, horizontal occupancy, compact abstraction. Forbidden to change: overall style band, naming philosophy, alpha policy, registry family ID without architectural cause.

---

## H. LINEAR Grammar

Representative paved **access segment** on integrated ground; elongated band; no building podium. Resolved: diagonal segment in square canvas; 3/4 camera retained; compact = band geometry.

---

## I. TERMINAL/YARD Grammar

Shared low-wide yard grammar; port = quay + crane + yard; rail = hall + short tracks + loading equipment. Differentiated from warehouse/logistics volumetric types.

---

## J. Access-Road Pilot

- Master: `docs/design/buildings/infrastructure-pilot/primary/ICON-003-access_road-infra-pilot.png`
- Reads as linear infrastructure; family board PASS; catalog @72 PASS.

---

## K. Port Pilot

- Master: `.../ICON-003-port-infra-pilot.png`
- Terminal/yard not warehouse; distinct from rail pilot.

---

## L. Rail-Terminal Pilot

- Master: `.../ICON-003-rail_terminal-infra-pilot.png`
- Rail facility identity; distinct from port and distribution_center.

---

## M. Alpha QA

`tools/process-infrastructure-pilot-alpha.ts` → **3/3 PASS** (`INFRASTRUCTURE_VISUAL_CONTRACT_ALPHA_REPORT.json`). Real alpha, no checkerboard suspect.

---

## N. Compact QA

Three pilot SVGs; evidence board at 24/32/48px vs production compacts. **32px READABLE** (visual review on `INFRASTRUCTURE_VISUAL_CONTRACT_COMPACT_BOARD.png`).

---

## O. Catalog-Scale QA

Static mock @ **72px** (`INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png`) matches BuildingsScreen slot. access_road band remains visible vs volumetric anchors.

---

## P. Cross-Family QA

`INFRASTRUCTURE_VISUAL_CONTRACT_PRIMARY_BOARD.png` — warehouse, distribution_center, logistics_hub, maintenance_facility, research_campus + three pilots. Coherent camera/light/material band.

---

## Q. World-Scale Feasibility

| Type | Primary | Compact | World derivative |
|------|---------|---------|------------------|
| access_road | SUITABLE | SUITABLE | Oriented tile derivative may be needed later |
| port | SUITABLE | SUITABLE | Optional zoom-specific crop |
| rail_terminal | SUITABLE | SUITABLE | Optional zoom-specific crop |

Production World integration: **NONE**.

---

## R. State Overlay Compatibility

**SHARED OVERLAYS SUFFICIENT** — rectangular overlay frames work on elongated/yard compositions; no new overlay art required for contract.

---

## S. Asset-Family Decision

**ICON-003 EXTENSION APPROVED** (conceptual). Geometry variation does not require a new namespace. Registry semantics support `ICON-003-{buildingTypeId}` when activated.

---

## T. Production Naming Proposal

| buildingTypeId | Primary (future) | Compact (future) |
|----------------|------------------|------------------|
| access_road | `ICON-003-access_road` | `ICON-003-access_road-compact` |
| port | `ICON-003-port` | `ICON-003-port-compact` |
| rail_terminal | `ICON-003-rail_terminal` | `ICON-003-rail_terminal-compact` |

**Not activated.**

---

## U. Gameplay / Content / World Firewalls

No changes to placement, footprints, transport simulation, YAML, PGWorldCanvas, or BuildingsScreen production rendering.

---

## V. Repository Integrity

No staging, commit, push, or tag. Task-owned paths listed in §B; unrelated working tree churn preserved separately.

---

## W. Production Readiness

Contract is **strong enough** for one later production slice (exactly these three types) after human visual approval: re-run alpha on production paths, extend `ICON_003_PRODUCTION_BUILDING_TYPE_IDS`, sync runtime assets, capture runtime evidence.

---

## X. Human Visual Decision Required

Please review pilots and evidence boards, then respond:

- **APPROVE INFRASTRUCTURE CONTRACT** — proceed to production slice planning  
- **REVISE INFRASTRUCTURE CONTRACT** — specify grammar/type  
- **REJECT INFRASTRUCTURE CONTRACT**

This is **not** the final 23/23 activation decision.

---

## Visual Acceptance Questions

| # | Answer |
|---|--------|
| 1. access_road reads as linear infrastructure? | **YES** (pilot) |
| 2. Belongs to ICON-003 family? | **YES** |
| 3. Useful @ catalog scale? | **YES** (static 72px evidence) |
| 4. port reads terminal/yard not warehouse? | **YES** |
| 5. rail_terminal reads rail not warehouse? | **YES** |
| 6. port vs rail distinct? | **YES** |
| 7. Terminals coexist with logistics buildings? | **YES** (board) |
| 8. Family coherent across grammars? | **YES** |
| 9. Compacts @32px? | **YES** |
| 10. Semantically honest? | **YES** (no unsupported mechanics) |
| 11. Existing derivative pipeline? | **YES** |
| 12. Remain ICON-003? | **YES** |
| 13. Contract sufficient for later 3-asset slice? | **YES** |

---

# Project Genesis
# Building / Infrastructure Visual Contract Extension
## Execution Summary

### Baseline

- **HEAD:** `93e5413d1bf61ac0a514c081de461e9ff458a4e1`
- **branch:** master
- **working tree:** task-owned additions + pre-existing unrelated modifications (see §B)

### Existing Authority

- Batch 1: **SEALED**
- Batch 2: **SEALED**
- Batch 3: **SEALED**
- current ICON-003 coverage: **20 / 23**

### Infrastructure Scope

- access_road: **LINEAR**
- port: **TERMINAL / YARD**
- rail_terminal: **TERMINAL / YARD**

### Semantics

- access_road: starter 5×2 connectivity piece; no recipes
- port: gated 6×4 bulk trade facility
- rail_terminal: gated 5×3 heavy transport hook
- unresolved product ambiguity: **NO**

### Contract

- shared B2 invariants: documented §5
- LINEAR grammar: §7
- TERMINAL/YARD grammar: §8
- ground-plane contract: §10
- perspective contract: §9
- occupancy contract: §11

### Pilots

- access_road primary: `infrastructure-pilot/primary/ICON-003-access_road-infra-pilot.png`
- port primary: `infrastructure-pilot/primary/ICON-003-port-infra-pilot.png`
- rail_terminal primary: `infrastructure-pilot/primary/ICON-003-rail_terminal-infra-pilot.png`
- alpha: **3 / 3**

### Compacts

- access_road @32: **READABLE**
- port @32: **READABLE**
- rail_terminal @32: **READABLE**

### Visual QA

- primary comparison board: **DONE**
- compact board: **DONE**
- catalog-scale board: **DONE**
- family compatibility: **PASS**
- semantic truthfulness: **PASS**

### Asset Architecture

- remain ICON-003: **YES**
- production naming: §T
- runtime pipeline compatible: **YES**

### Production State

- active registry changes: **NONE**
- production coverage: **UNCHANGED — 20 / 23**
- ICON-002 fallback: **UNCHANGED — 3 / 23**

### World

- production integration: **NONE**
- future feasibility: primary/compact suitable; access_road may need oriented World derivative
- World-specific derivative needed: **PER TYPE** (optional refinement)

### Gates

- typecheck: **PASS**
- lint: **PASS** (0 errors; pre-existing warnings only)
- focused checks: pilot alpha + evidence boards executed
- test/build:web: **not required** (no production code changes)

### Firewalls

- gameplay: **NONE**
- content: **NONE**
- World: **NONE**
- placement: **NONE**
- Player Guidance: **NONE**
- deployment: **NONE**

### Repository Integrity

- task-owned: contract, review, pilots, evidence, two tools, source PNGs in `assets/`
- unrelated: shell/dashboard/dev pilots/etc.
- commit: **NONE**
- push: **NONE**
- tag: **NONE**

### Human Decision Required

**APPROVE INFRASTRUCTURE CONTRACT** (recommended)

### Final Decision

**OPTION A — INFRASTRUCTURE VISUAL CONTRACT READY FOR HUMAN VISUAL APPROVAL**

**STOP.**
