# M11 Phase 6.3 Production Operations UI

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Phase:** 6.3 — Production Operations UI (Sprint 4 Core: PR-001–PR-003)  
**Report date:** 2026-08-27  
**Repository baseline (start):** `master` @ `279a236`  
**Phase 6.2 baseline:** `M11_PHASE6_2_PRODUCTION_RUNTIME_EVENT_CORRECTIONS_REPORT.md`

---

## Verification Record (executed tests)

| Run | Command | Result |
|-----|---------|--------|
| Full suite | `pnpm test` | **239** files, **882** tests passed; duration **105.97s**; exit code **0** |
| Phase 6.3 subset | `ProductionScreen.test.tsx`, `production-screen-view-mappers.test.ts`, `GameSession.test.ts` | All passed |

Prior baseline (Phase 6.2 closeout): **874** tests. Net **+8** tests from Phase 6.3.

---

## 1. Executive Summary

Phase 6.3 integrates Sprint 4 production operations UI (PR-001–PR-003) on the existing `ProductionScreen` using authoritative production runtime data from Phase 6.2. No production domain redesign, no G-04/G-05 gameplay semantics, and no new mutation API endpoints.

**Delivered:**

- **PR-001** — Production overview summary metrics + active jobs table with semantic progress
- **PR-002** — Factory-grouped job panels by building
- **PR-003** — Recipe catalog and detail panel (inputs/outputs/duration/energy) via dashboard read model
- **Read model** — `recipeCatalog` on `GameSessionDashboard` (no `GET /api/recipes`)
- **Tests** — Presentation mapper tests for all operational states including `STALLED_ENERGY`; `ProductionScreen` behavior tests; recipe catalog dashboard test

**Final decision:** **PRODUCTION OPERATIONS UI READY**

**Recommended next package:** Phase 6.4 — Facility & Inspector Integration (per Phase 6.1 audit)

---

## 2. Scope

| In scope (implemented) | Out of scope (not changed) |
|------------------------|----------------------------|
| PR-001 overview on `ProductionScreen` | PR-004 … PR-010 mockups |
| PR-002 factory grouping by building | Production queues (G-04) |
| PR-003 recipe catalog + detail | `productionCost` posting (G-05) |
| Authoritative `operationalState` + progress UI | Cancel / pause production |
| Recipe catalog read model on dashboard | New production API endpoints |
| Production entity navigation preserved | Domain lifecycle redesign |
| Presentation / mapper tests | C5 non-production entity linkage |

---

## 3. PR Definitions (repository source of truth)

Mockup files `PR-001_Production_Overview.png`, `PR-002_Factory.png`, `PR-003_Recipe.png` are **planned** in `VISUAL_PRODUCTION_BACKLOG.md` (not present as approved assets). Implementation follows:

| ID | Backlog / audit name | Implemented surface |
|----|----------------------|---------------------|
| PR-001 | Production Overview | Summary metric grid + active jobs table (`TransportScreen` pattern) |
| PR-002 | Factory | Jobs grouped by building with per-job status and progress |
| PR-003 | Recipe | Recipe catalog buttons + detail card (inputs/outputs/building types) |

---

## 4. PR-001 Implementation — Production Overview

**UI:** `ProductionScreen` summary grid (`pg-operation-summary-grid`) with counts:

- Active jobs, running, stalled energy, stalled workforce, waiting, finished

**Data:** `mapProductionOverviewSummary` from `GET /api/production/jobs` query (tick-debounced). Counts use `operationalState` and domain `status` from server read model — not client-derived stall logic.

**Jobs table:** Gebäude, Rezept, Status, Fortschritt with `ProductionProgressCell` (`<progress>` + label).

**Tests:** `ProductionScreen.test.tsx` — overview metrics; `production-screen-view-mappers.test.ts` — summary counts.

---

## 5. PR-002 Implementation — Factory

**UI:** `Fabriken` card with per-building sections (`pg-production-factory-card`).

**Data:** `mapProductionFactoryGroups` groups authoritative jobs by `buildingId`; building labels from `companyViewData.buildings`.

**Interaction:** `Job anzeigen` selects production entity via `selectEntity({ kind: 'production', id })`.

**Tests:** `production-screen-view-mappers.test.ts` — factory grouping; `ProductionScreen.test.tsx` — factory section visible.

---

## 6. PR-003 Implementation — Recipe

**Read model (application):**

- `RecipeCatalogEntryReadModel` on `GameSessionDashboard`
- `GameSessionDashboardBuilder.readRecipeCatalog()` from enabled game content

**Presentation:**

- `RecipeCatalogEntryViewData` via `mapRecipeCatalog` in `company-dashboard-view-mappers.ts`
- Catalog list with selectable recipe buttons (`aria-pressed`)
- Detail card: duration, energy/tick, building types, input/output labels
- `Produktion starten` filtered by selected recipe (`recipeHintsForSelection`)

**Tests:** `GameSession.test.ts` — `includes recipe catalog on dashboard for production UI surfaces`.

---

## 7. Runtime / Read-Model Integration

| UI value | Source |
|----------|--------|
| Job status label | `formatProductionStatus(status, awaitingTransport, operationalState)` |
| Job progress % | `ProductionJobSessionReadModel.progress` via jobs query |
| Overview counts | Jobs query + `mapProductionOverviewSummary` |
| Factory grouping | Jobs query + dashboard building rows |
| Recipe I/O | `dashboard.recipeCatalog` |
| Start hints | `companyViewData.hints.production` (dashboard refresh) |

No parallel frontend production state machine. Tick sync: `production:${tickNumber}` debounced query (existing Phase 5 pattern).

---

## 8. Operational-State Presentation

| State | Label (via formatter) | Test coverage |
|-------|----------------------|---------------|
| `STALLED_ENERGY` | `Energie fehlt` | Mapper test + `ProductionScreen` fixture |
| `STALLED_WORKFORCE` | `Keine Mitarbeiter` | Mapper test; GameSession integration (Phase 6.2) |
| `WAITING` | Domain status / transport hint | Fixture (`awaitingTransport`) |
| `RUNNING` | Domain status when operational | Overview summary test |
| `FINISHED` | Domain status | Fixture + summary count |

**Detail panel fix (6.3):** `company-dashboard-view-mappers` production job detail now passes `operationalState` into `formatProductionStatus` (was missing operational state in inspector entries).

**Note:** No new `GameSession` integration test for live `STALLED_ENERGY` resolver (energy-deficit fixture is timing-sensitive with construction ticks). Regression coverage for the energy label path is via presentation mapper + screen tests.

---

## 9. Progress Presentation

- `ProductionProgressCell` uses native `<progress value max>` with `formatProgress` label
- Preserves restored progress (e.g. 42%) from authoritative `progress` field — no reset-to-zero client logic
- Styles reuse `dashboard-components.css` progress tokens + `pg-production-progress`

---

## 10. Production Navigation / Entity Linkage

- Job row click → `selectEntity({ kind: 'production', id })` (unchanged)
- Factory `Job anzeigen` → same selection path
- Notification `open-production` pipeline not modified in 6.3
- Regression: existing notification / runtime pipeline tests pass in full suite

---

## 11. Responsive / Accessibility

- Reuses `pg-operation-grid`, `pg-operation-summary-grid`, existing Card/QueryRows patterns
- Recipe catalog: native `<button>` with `aria-pressed` for selection
- Progress: semantic `<progress>` element (not color-only)
- QueryRows: keyboard-focusable row buttons with `aria-current` on selection
- No new global design language; `operation-screen.css` extended for factory/recipe layouts

---

## 12. Tests Added / Extended

| File | Cases |
|------|-------|
| `ProductionScreen.test.tsx` | 5 — overview, factory, catalog, stalled energy display, navigation, start |
| `production-screen-view-mappers.test.ts` | 3 — summary, status labels, factory groups |
| `GameSession.test.ts` | +1 — recipe catalog on dashboard |

---

## 13. Regression Results (2026-08-27)

| Suite | Result |
|-------|--------|
| Full `pnpm test` | **882 / 882** pass (**239** files) |
| Production / M11 E2E | Pass (included in full run) |
| Phase 5 notification / runtime | Pass |

---

## 14. Deferred / Not Implemented

- G-04 concurrent jobs / queues
- G-05 `productionCost` finance posting
- PR-004 … PR-010 UI
- `GET /api/recipes` (used dashboard `recipeCatalog` instead)
- Live `GameSession` `STALLED_ENERGY` integration fixture (presentation tests cover UI path)

---

## 15. Remaining Risks

| Risk | Mitigation |
|------|------------|
| Mockup PNGs not integrated as static runtime assets | Layout follows `TransportScreen` / operation-screen patterns; parity when assets approved |
| Jobs query vs dashboard hints brief divergence | Existing scoped invalidation on `production.start` |
| Energy-stall integration test gap at facade layer | Mapper + screen tests; optional future energy-fixture hardening |

---

## 16. Recommendations

1. Proceed to **Phase 6.4** — building inspector production context and hint filtering.
2. When PR mockups are approved, visual polish pass against `PR-001`–`PR-003` PNGs.
3. Optional: dedicated `GameSession` energy-deficit fixture when a short-tick building activation scenario is identified.

---

## 17. Final Decision

**PRODUCTION OPERATIONS UI READY**

Evidence: PR-001–PR-003 surfaces on `ProductionScreen`; authoritative runtime binding; **882 / 882** tests on 2026-08-27.

---

*End of M11 Phase 6.3 Production Operations UI Report.*
