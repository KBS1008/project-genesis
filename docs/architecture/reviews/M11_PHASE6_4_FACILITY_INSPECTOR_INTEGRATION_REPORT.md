# M11 Phase 6.4 — Facility & Inspector Integration Report

**Date:** 2026-08-27  
**Milestone:** M11 — Visual Production & User Experience  
**Phase:** 6.4 — Facility & Inspector Integration  
**Status:** COMPLETE (pending gate review)

---

## 1. Executive Summary

Phase 6.4 connected the existing shared Building / Facility selection architecture with the Production Operations UI delivered in Phase 6.3. The work was intentionally minimal: navigation helpers, presentation filtering by stable `buildingId`, inspector actions, and thin warehouse linkage using existing ViewData. No new selection store, command pipeline, or Production domain rules were introduced.

**Gate recommendation:** PASS — integration objectives met; PR-005 full UI and G-04/G-05 remain explicitly deferred.

---

## 2. Repository Baseline

| Item | Value |
|------|-------|
| Phase entry commit | `5050631` — Expand Phase 6.3 report for gate review handover |
| Phase 6.3 implementation baseline | `db7e3a9` — Production Operations UI (PR-001–PR-003) |
| Final HEAD (implementation) | Uncommitted at report time — changes on branch `master` working tree |
| Tests at phase entry | 882 / 882 (239 files) |
| Tests after Phase 6.4 | **891 / 891** (240 files) — `pnpm test` executed 2026-08-27 |

---

## 3. Phase-6.4 Scope Classification

| Requirement | Classification | Notes |
|-------------|----------------|-------|
| **A** Building Inspector → Production jobs | **ALREADY RESOLVED** (+ strengthened) | Building detail `relatedItems` from `dashboard.productionJobs.filter(job => job.buildingId === building.id)`; added `entityRef` for clickable job navigation |
| **B** Selected Building → Production context | **IMPLEMENTED** | `buildProductionBuildingNavigationTarget`; `ProductionScreen` scopes overview, jobs, factories, hints when `entitySelection.kind === 'building'` |
| **C** Building-scoped Production jobs | **IMPLEMENTED** | Filter by `buildingId`; 0 / 1 / multiple jobs tolerated (test fixture: 2 jobs on `building_005`) |
| **D** Building-scoped Production hints | **IMPLEMENTED** | `filterProductionHintsByBuildingId` on authoritative `companyViewData.hints.production` |
| **E** World / Inspector → Production navigation | **IMPLEMENTED** | World building marker → production with building context; region inspector production section action |
| **F** Production job selection | **ALREADY RESOLVED** (verified) | `selectEntity({ kind: 'production', id })` unchanged; inspector related-item navigation added |
| **G** PR-005 Warehouse linkage | **IMPLEMENTED (thin linkage)** | Production building context shows warehouse card when `warehouseStorage` exists; navigates to company warehouse detail via `buildWarehouseNavigationTarget` — not full PR-005 screen |

**Not applicable:** PR-004–PR-010 full surfaces, queues, cancel/pause, G-04 enforcement, G-05 finance semantics, World Production Overlay.

---

## 4. Building Inspector Integration

### Previous state

- Building inspector already listed production jobs under “Produktion an diesem Standort” via `company-dashboard-view-mappers.ts`.
- Related items were static text; no navigation to Production screen.

### Changes

- `EntityDetailRelatedItemViewData.entityRef` with `{ kind: 'production', id: jobId }` on building related jobs.
- `PGInspectorPanel` supports clickable related items via `onRelatedItemClick`.
- `CompanyOperationsInspector` footer button **Produktion öffnen** when building selected.
- `CompanyDashboardScreen` wires `navigateToTarget(buildProductionBuildingNavigationTarget)` and `buildProductionNavigationTarget`.

### Resulting behavior

- Building selected in company operations → inspector shows linked jobs with status from authoritative `operationalState`.
- Player can open Production scoped to building or jump to a specific job.

---

## 5. Building → Production Context

### Selection flow

```
World marker / Company inspector “Produktion öffnen”
  → navigateToTarget(buildProductionBuildingNavigationTarget(buildingId))
  → navigation.entitySelection = { kind: 'building', id: buildingId }
  → ProductionScreen filters by buildingId
```

### ViewData / mapper flow

- Raw jobs: `fetchProductionJobs()` (unchanged).
- Filtering: `production-building-context.ts` — `filterProductionJobsByBuildingId`, `filterProductionHintsByBuildingId`.
- Mapping: existing `mapProductionJobRowsViewData`, `mapProductionFactoryGroups`, `mapProductionOverviewSummary` on scoped raw jobs only when building filter active.

### Navigation flow

- Clear building context: **Alle Standorte** → `clearEntitySelection()` (shared selection, not a local filter store).
- Job row / **Job anzeigen** → `selectEntity({ kind: 'production', id })` (building highlight derived from job `buildingId`).

---

## 6. Building-Scoped Production Jobs

| Case | Behavior |
|------|----------|
| **0 jobs** | Empty state “Keine Produktionsjobs an diesem Standort” |
| **1 job** | Single row in jobs table; single factory card |
| **Multiple jobs** | All jobs for `buildingId` shown (e.g. `production_001` + `production_002` on `building_005` in tests); no one-job-per-building enforcement |

---

## 7. Building-Scoped Production Hints

- **Source:** `companyViewData.hints.production` (authoritative runtime hints from dashboard builder).
- **Presentation:** When building filter active, hints filtered by `hint.buildingId === contextBuildingId`.
- **Not reimplemented:** recipe eligibility, research, milestones, energy, inventory, transport validation.

---

## 8. World / Inspector → Production Navigation

| Path | Implementation |
|------|----------------|
| World building marker click | `WorldScreen` → `buildProductionBuildingNavigationTarget(buildingId)` (replaces buildings-screen navigation on marker click) |
| Region inspector production section | `inspectorSectionActions.production` → **Produktion öffnen** → production screen (all sites) |
| Company building inspector | **Produktion öffnen** → building-scoped production |

Buildings screen remains available via primary navigation / sidebar.

---

## 9. Production Entity Selection Regression Status

Verified preserved:

- Production job table row click → `{ kind: 'production', id }`
- Factory **Job anzeigen**
- Company inspector related production job buttons
- Existing `buildProductionNavigationTarget` used by dashboard widgets (unchanged)
- Global search / notification production navigation (no changes; existing helpers intact)

---

## 10. PR-005 Warehouse Linkage Decision

**Implemented as thin linkage.**

When ProductionScreen has an active building context and `companyViewData.warehouseStorage` contains an entry with `id === buildingId`:

- Card **Lager am Standort** shows capacity / line count from ViewData.
- **Lagerdetails öffnen** → `buildWarehouseNavigationTarget(buildingId)` → company screen warehouse detail.

**Not implemented:** PR-005 full warehouse screen, new storage rules, routing simulation, or new APIs.

`CompanyDashboardScreen` now syncs `navigation.entitySelection.kind === 'warehouse'` to local detail selection (required for navigation target to open warehouse inspector).

---

## 11. Architecture Compliance

| Check | Result |
|-------|--------|
| New selection store | **No** |
| New command pipeline | **No** |
| New event bus | **No** |
| Authoritative frontend Production state | **No** — filtering is presentation-only on fetched jobs + dashboard hints |
| Direct domain access from React | **No** |
| Production-local `selectedBuildingId` store | **No** — uses shared `navigation.entitySelection` |

---

## 12. Responsive / Accessibility

- Reused `operation-screen.css`, `PGInspectorPanel`, `QueryRows`, existing Card/Button patterns.
- Building context banner: `role="status"`, `aria-label` with building name; **Alle Standorte** is a semantic button.
- Factory highlight: `is-selected` border + `aria-current="true"` on matching factory card (not color-only).
- Inspector related items: native `<button>` with focus-visible styles.
- Building context uses flex-wrap; no new horizontal overflow patterns introduced.

---

## 13. Tests Added / Changed

| File | Change |
|------|--------|
| `production-building-context.test.ts` | **New** — filter helpers, multi-job tolerance |
| `entity-navigation.test.ts` | `buildProductionBuildingNavigationTarget`, `buildWarehouseNavigationTarget` |
| `ProductionScreen.test.tsx` | Building context scope, clear filter, warehouse link |
| `company-operations-inspector.test.tsx` | Building production open + related job click |
| `company-detail-inspector-mappers.test.ts` | Building focus with production related items |

---

## 14. Regression Test Results

```text
pnpm test
Test Files  240 passed (240)
Tests       891 passed (891)
Duration    ~97s
```

Targeted suites (all pass):

- New Phase 6.4 tests
- `production-screen-view-mappers.test.ts`
- `company-detail-inspector-mappers.test.ts`
- `company-operations-inspector.test.tsx`
- `entity-navigation.test.ts`
- Full suite (above)

---

## 15. Deferred Items

| Item | Status |
|------|--------|
| G-04 concurrent / one-job-per-building | **Deferred** — UI tolerates multiple jobs per building |
| G-05 productionCost finance semantics | **Deferred** |
| PR-004 Inventory full surface | **Out of scope** |
| PR-005 full Warehouse UI | **Out of scope** (thin linkage only) |
| PR-006–PR-010 | **Out of scope** |
| Cancel / pause production | **Out of scope** |
| World Production Overlay | **Out of scope** |
| `STALLED_ENERGY` GameSession integration fixture | **Non-blocking** (unchanged from 6.3) |

---

## 16. Remaining Risks

1. **World building click** now opens Production (building context) instead of Buildings screen — improves integration flow; players use sidebar for Buildings screen.
2. **Warehouse linkage** only appears when authoritative `warehouseStorage` row exists for the building — buildings without warehouse data show no card (correct).
3. **Region-level “Produktion öffnen”** opens unfiltered Production — intentional; no single building context at region scope.

---

## 17. Recommendation for Next Phase

Proceed to the next Sprint-4 presentation package (e.g. PR-004 Inventory surface or PR-006 Build Queue) per backlog priority, or M11 polish pass. Revisit G-04/G-05 when gameplay rules are defined.

---

## 18. Final Decision

**PHASE 6.4 COMPLETE — FACILITY & INSPECTOR INTEGRATION READY**

Recommended gate outcome: **PASS** (integration scope delivered; deferred items documented and unchanged from audit).

---

## Definition of Done Checklist

- [x] Repository analyzed before implementation
- [x] Inspector Production behavior preserved and extended (navigation)
- [x] Shared Building selection connects to Production context
- [x] Building-scoped jobs (0 / 1 / many)
- [x] Building-scoped hints
- [x] World / Inspector → Production navigation
- [x] Production job selection preserved
- [x] No second Selection architecture
- [x] No Production domain rules invented
- [x] PR-005 thin linkage (not full UI)
- [x] PR-004/006–010 not pulled into scope
- [x] G-04 / G-05 remain deferred
- [x] `pnpm test` — 891 / 891 PASS
- [x] Documentation updated
- [x] Completion report at `docs/architecture/reviews/M11_PHASE6_4_FACILITY_INSPECTOR_INTEGRATION_REPORT.md`
