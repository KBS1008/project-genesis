# POST-V1 PGD-TUTORIAL-001 — Bounded Implementation Close Candidate

**Date:** 2026-10-06  
**Authority:** `docs/development/Prompts/POST_V1_PGD_TUTORIAL_001_BOUNDED_IMPLEMENTATION.md`  
**Product contract:** `docs/architecture/reviews/POST_V1_PGD_TUTORIAL_001_FIRST_STEPS_CONTEXTUAL_ACTIONABILITY_CONTRACT.md` (`CLOSED / PASS`)

---

## A. Executive result

**OPTION A — IMPLEMENTATION CLOSE CANDIDATE**

Contextual **Erste Schritte** navigation CTAs are implemented per contract: navigation/guidance only, no gameplay mutation, no completion changes, structural step-ID routing (no copy parsing).

**Milestone row emphasis (`first_profit`):** **Intentionally omitted** per contract minimality rule (§22) — milestones **section scroll** only.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` (local implementation, uncommitted) |
| Pre-task HEAD | `441d76e524cb92101d253523518664bfad5d0cbc` — `BVI-001: correct rail terminal production artwork.` |
| `origin/master` at task start | Same as pre-task HEAD |
| PGD-TUTORIAL-001 | **Local diff only** — no commit/push/tag per prompt |

---

## C. Contract authority

Implemented against `POST_V1_PGD_TUTORIAL_001_FIRST_STEPS_CONTEXTUAL_ACTIONABILITY_CONTRACT.md` without semantic drift.

---

## D. Task-owned file inventory

| File | Class |
|------|--------|
| `apps/web/src/presentation/navigation/tutorial-step-navigation-contract.ts` | production |
| `apps/web/src/presentation/navigation/resolve-tutorial-step-navigation.ts` | production |
| `apps/web/src/presentation/navigation/resolve-tutorial-step-navigation.test.ts` | test |
| `apps/web/src/presentation/navigation/company-operations-pending-navigation.ts` | production |
| `apps/web/src/presentation/navigation/company-operations-pending-navigation.test.ts` | test |
| `apps/web/src/presentation/state/GameWorkspaceProvider.tsx` | production |
| `apps/web/src/presentation/components/dashboard/PGTutorialPanel.tsx` | production |
| `apps/web/src/presentation/components/dashboard/PGTutorialPanel.test.tsx` | test |
| `apps/web/src/presentation/components/dashboard/dashboard-components.css` | production |
| `apps/web/src/presentation/screens/buildings/BuildingsScreen.tsx` | production |
| `apps/web/src/presentation/screens/buildings/BuildingsScreen.test.tsx` | test |
| `apps/web/src/presentation/screens/company/CompanyScreen.tsx` | production |
| `apps/web/src/presentation/screens/company/CompanyScreen.test.tsx` | test |
| `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx` | production |
| `apps/web/src/presentation/testing/game-workspace-mock.ts` | test |
| `tools/capture-pgd-tutorial-001-runtime-evidence.mjs` | evidence tool |
| `tools/build-pgd-tutorial-001-evidence-fixture.mjs` | evidence tool |
| `tools/evidence-fixtures/pgd-tutorial-001-new-game.json` | fixture |
| `tools/evidence-fixtures/pgd-tutorial-001-mid-progress.json` | fixture |
| `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_*.png` | evidence |
| `docs/architecture/reviews/evidence/pgd-tutorial-001-runtime-evidence-run-summary.json` | evidence |
| `docs/architecture/reviews/POST_V1_PGD_TUTORIAL_001_RUNTIME_EVIDENCE_GATE_COMPLETION.md` | report |
| `docs/architecture/reviews/POST_V1_PGD_TUTORIAL_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md` | report |

**Pre-existing (not task-owned):** `docs/architecture/reviews/POST_V1_PGD_TUTORIAL_001_FIRST_STEPS_CONTEXTUAL_ACTIONABILITY_CONTRACT.md`

**Evidence-gate delta (2026-10-06):** implementation source **unchanged**; tooling/fixtures/screenshots/summary + gate completion report added.

---

## E. Tutorial navigation contract implementation

- Static labels and structural IDs in `tutorial-step-navigation-contract.ts`.
- Resolution in `resolve-tutorial-step-navigation.ts` (markets, buildings catalog, production sawmill rule, company pending intents).
- `GameWorkspaceProvider.navigateTutorialStep(stepId)` orchestrates intents; uses `sessionDashboardRef` for sawmill instance resolution.

---

## F. Per-step implementation matrix

| Step ID | CTA when incomplete? | Label | Destination | Focus/context | CTA when complete? | Gameplay mutation? | Test | Runtime evidence |
|---------|---------------------|-------|-------------|---------------|-------------------|-------------------|------|------------------|
| `open_plot` | No | — | — | NONE | N/A | NONE | contract resolver | — |
| `build_sawmill` | Yes | Gebäude öffnen | `buildings` | Catalog focus `sawmill` | No | NONE | resolver + panel | script §N/O |
| `buy_wood` | Yes | Markt öffnen | `markets` | resource `wood` | No | NONE | resolver | script |
| `produce_planks` | Yes | Produktion öffnen | `production` | building filter if \|sawmills\|=1 | No | NONE | resolver | script |
| `sell_planks` | Yes | Markt öffnen | `markets` | resource `planks` | No | NONE | resolver | script |
| `earn_profit` | Yes | Meilensteine anzeigen | `company` operations | scroll `#pg-milestones-widget-title` | No | NONE | resolver + pending | script |
| `npc_supply_contract` | Yes | Lieferverträge anzeigen | `company` operations | scroll `#pg-economy-widget-title` | No | NONE | resolver + pending | script |
| `corporate_tax` | Yes | Finanzbuchungen anzeigen | `company` operations | scroll `#pg-finance-widget-title` | No | NONE | resolver + pending | script |

---

## G. Workspace/provider navigation

- `navigateTutorialStep`, `buildingCatalogFocusBuildingTypeId`, `clearBuildingCatalogFocus` added to context.
- Company pending kinds extended: `economy_contracts_section`, `finance_ledger_section`.
- `milestone_overview` now consumed in `CompanyDashboardScreen` (scroll), not cleared in `CompanyScreen` (aligned with workforce pattern).

---

## H. Building catalog focus

`BuildingsScreen` consumes one-shot `buildingCatalogFocusBuildingTypeId`: pre-selects catalog entry, `is-catalog-focus` outline, scroll, clear focus. Rows use `data-building-type-id`.

---

## I. Market resource navigation

Reuses `buildResourceNavigationTarget` via resolver; existing `MarketScreen` entity-selection effect applies.

---

## J. Production contextual navigation

`|S| === 1` sawmill → `buildProductionBuildingNavigationTarget`; else unscoped production screen.

---

## K. Company operations contextual navigation

`resolveCompanyOperationsSectionScrollTargetId` + dashboard `useEffect` scroll (workforce path unchanged).

---

## L. Completion-semantics preservation

No changes to `readTutorialProgress` predicates, ordering, or persistence model.

---

## M. Gameplay-mutation firewall

Tutorial CTAs call only navigation setters / `navigateToTarget` — no `runCommand`, placement, trade, production, or hire paths.

---

## N. Desktop runtime evidence

**Status:** **CERTIFIED** (2026-10-06).

**Historical failure (first attempt):** `POST /api/session/new` → **400** — `Company id "company_001" already exists.` (warm dev session; not a stale payload contract).

**Corrected bootstrap:** `session/load` of `tools/evidence-fixtures/pgd-tutorial-001-new-game.json` and `pgd-tutorial-001-mid-progress.json`; API readiness via `http://127.0.0.1:3001/health`.

**Command:** `node tools/capture-pgd-tutorial-001-runtime-evidence.mjs` → exit **0**, `overallResult: PASS`.

**Viewport:** ~**1440×900**.

**Artifacts:**

- `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_TUTORIAL_CTA_BUILDINGS.png`
- `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_BUILDINGS_CATALOG_FOCUS.png`
- `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_MARKET_WOOD_CONTEXT.png`
- `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_COMPANY_MILESTONES.png`
- `docs/architecture/reviews/evidence/pgd-tutorial-001-runtime-evidence-run-summary.json`

See also: `POST_V1_PGD_TUTORIAL_001_RUNTIME_EVIDENCE_GATE_COMPLETION.md`.

---

## O. Narrow ~480×900 runtime evidence

**Status:** **CERTIFIED**.

- `PGD-TUTORIAL-001_NARROW_480x900_TUTORIAL_CTA.png`
- `PGD-TUTORIAL-001_NARROW_480x900_BUILDINGS_DESTINATION.png`
- No horizontal overflow on `.pg-tutorial-panel` (asserted in summary JSON).

---

## N2. Runtime certification table

| Viewport | Step | CTA | Expected destination | Actual destination | Focus/context | Completion unchanged? | Gameplay mutation? | Evidence | Result |
|----------|------|-----|-------------------|-------------------|---------------|----------------------:|-------------------:|----------|--------|
| 1440×900 | `build_sawmill` | Gebäude öffnen | Buildings | Baukatalog | `data-building-type-id=sawmill` | Yes (false→false) | None | DESKTOP_*BUILDINGS*.png | PASS |
| 1440×900 | `buy_wood` | Markt öffnen | Markets | Handel | `#market-resource-select=wood` | Yes | None | MARKET_WOOD_CONTEXT.png | PASS |
| 1440×900 | `sell_planks` | Markt öffnen | Markets | Handel | `planks` | Yes | None | summary JSON | PASS |
| 1440×900 | `produce_planks` | Produktion öffnen | Production scoped/unscoped | — | — | — | — | NOT RUN (fixture step complete) | Tests |
| 1440×900 | `earn_profit` | Meilensteine anzeigen | Company ops | Milestones widget | section scroll | Yes | None | COMPANY_MILESTONES.png | PASS |
| 1440×900 | `npc_supply_contract` / `corporate_tax` | — | — | — | — | — | — | NOT RUN (complete on fixture) | Tests |
| 480×900 | `build_sawmill` | Gebäude öffnen | Buildings | Baukatalog | sawmill row | Yes | None | NARROW_*.png | PASS |

---

## N3. State non-mutation table

| Runtime path | State before | State after navigation | Expected | Result |
|--------------|--------------|------------------------|----------|--------|
| Build CTA | buildings **4**, `build_sawmill` incomplete | buildings **4**, still incomplete | unchanged | PASS |
| Market wood CTA | wood **0**, `buy_wood` incomplete | wood **0**, still incomplete | unchanged | PASS |
| Market planks CTA | `sell_planks` incomplete | still incomplete | unchanged | PASS |
| Milestones CTA | `earn_profit` incomplete | still incomplete | unchanged | PASS |

---

## P. Focused tests

| Test file | Coverage |
|-----------|----------|
| `resolve-tutorial-step-navigation.test.ts` | All step kinds, sawmill cardinality |
| `PGTutorialPanel.test.tsx` | CTA render + click handler |
| `company-operations-pending-navigation.test.ts` | Scroll anchor mapping |
| `CompanyScreen.test.tsx` | Milestone pending not cleared early |
| `BuildingsScreen.test.tsx` | Mock extended for catalog focus API |

---

## Q. Root quality gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **0 errors**, 144 warnings (pre-existing) |
| `pnpm test` | **292 files / 1105 tests PASS** |
| `pnpm --filter @project-genesis/web build` | **PASS** |

---

## R. Sealed-track / scope integrity

PDM, BVI, domain tutorial completion, Save, API, Scenario-B, PGD-CATEGORY — **unchanged / not reopened**.

---

## S. Unrelated WIP

Unchanged (doc deletes, dev pilots, saves, assets, etc.) — not staged or modified by this task.

---

## T. Known limitations / deferred items

- `produce_planks` runtime CTA click not executed on mid-progress fixture (step already complete); cardinality covered by unit tests.
- `npc_supply_contract` / `corporate_tax` runtime clicks not executed on same fixture (steps complete); pending intents covered by unit tests.
- `produce_planks` does not add a second workforce CTA (contract: one CTA per step).
- Milestone row highlight omitted (section scroll only).

---

## U. Commit readiness

Implementation is **ready for independent review**; **no commit** performed per prompt. Suggested subject when authorized: `PGD-TUTORIAL-001: add first-steps contextual navigation CTAs.`

---

## V. Final decision

> **PGD-TUTORIAL-001 IMPLEMENTATION:**  
> `PASS / CLOSE CANDIDATE`

> **PLAYER PROBLEM:**  
> `PASSIVE FIRST-STEPS NAVIGATION HUNTING — ADDRESSED (NAVIGATION ONLY)`

> **GAMEPLAY / SAVE / API:**  
> `UNCHANGED`

> **COMPLETION AUTHORITY:**  
> `UNCHANGED`

> **PDM-001 / BVI-001 / SCENARIO-B:**  
> `REMAIN SEALED / PAUSED`

> **RUNTIME EVIDENCE GATE:**  
> `PASS`

> **RUNTIME EVIDENCE:**  
> `CAPTURED — SEE evidence/ AND pgd-tutorial-001-runtime-evidence-run-summary.json`

> **CLOSE CANDIDATE:**  
> `PASS — READY FOR INDEPENDENT CHATGPT FINAL REVIEW`

> **COMMIT / PUSH / TAG:**  
> `NONE`

---

Definition of done: bounded implementation complete; runtime gate certified; close candidate updated; implementation gates green (prior run; source unchanged in evidence delta).
