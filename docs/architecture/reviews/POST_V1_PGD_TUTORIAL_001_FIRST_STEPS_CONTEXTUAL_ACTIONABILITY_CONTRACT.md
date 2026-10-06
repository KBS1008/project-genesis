# POST-V1 PGD-TUTORIAL-001 — First-Steps Contextual Actionability (Product / UX Contract)

**Mode:** Product / UX contract definition (read-only)  
**Date:** 2026-10-06  
**Authority:** `docs/development/Prompts/POST_V1_PGD_TUTORIAL_001_FIRST_STEPS_CONTEXTUAL_ACTIONABILITY_CONTRACT.md`  
**Prior review:** `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_WORKSTREAM_REVIEW_AFTER_BVI_001.md`  
**Review HEAD:** `441d76e524cb92101d253523518664bfad5d0cbc`

---

## A. Executive decision

**OPTION A — CONTRACT CLOSED / IMPLEMENTATION READY**

Every existing tutorial step has an unambiguous navigation/guidance contract keyed by **structural step ID** (no German copy parsing). Contextual focus uses existing `EntityNavigationTarget` patterns where possible; two small one-shot extensions mirror WORKFORCE-NAV / research-catalog focus precedents.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `441d76e524cb92101d253523518664bfad5d0cbc` |
| HEAD subject | `BVI-001: correct rail terminal production artwork.` |
| `origin/master` | `441d76e524cb92101d253523518664bfad5d0cbc` |
| HEAD = origin | **Yes** |
| Staged / unstaged (this task) | **None** / **None** |
| Unrelated WIP | Doc deletes/moves, dev pilots, saves, assets — **not touched** |
| Tutorial/navigation authority vs baseline | **Unchanged** on committed `HEAD` |

---

## C. Current tutorial architecture

| Layer | Role | Path / symbol |
|------|------|----------------|
| Step definition + completion derivation | Domain/application (derived each dashboard read, **not** separate save field) | `GameSessionDashboardBuilder.readTutorialProgress` — `src/application/facade/GameSessionDashboardBuilder.ts` |
| Dashboard attachment | Session facade | `GameSession` → `tutorial: this.#dashboardBuilder.readTutorialProgress(...)` — `src/application/facade/GameSession.ts` |
| Read models | Types | `TutorialStepReadModel`, `TutorialProgressReadModel` — `src/application/facade/GameSessionDashboard.ts` |
| View mapping | Web adapter | `mapTutorial` — `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts` |
| View types | Presentation | `TutorialStepViewData`, `TutorialViewData` — `apps/web/src/presentation/adapters/view-data/company-dashboard-view-data.ts` |
| Rendering | UI | `PGTutorialPanel` — `apps/web/src/presentation/components/dashboard/PGTutorialPanel.tsx` |
| Host screen | Company operations dashboard | `CompanyDashboardScreen` — `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx` (panel at end of main column) |
| Company route | Overview vs operations | `CompanyScreen` — toggles `CompanyOverviewScreen` / `CompanyDashboardScreen` |

**Persistence:** Tutorial progress is **recomputed from live session state** (buildings, inventory, transactions, production jobs, milestones). No dedicated tutorial blob in save schema.

---

## D. Current tutorial step inventory

Source: `readTutorialProgress` step array (`GameSessionDashboardBuilder.ts`, lines 910–964). Order is fixed in code.

| Order | Structural ID | Title | Description (summary) |
|------|---------------|-------|------------------------|
| 1 | `open_plot` | Grundstück öffnen | Session started; view dashboard. |
| 2 | `build_sawmill` | Sägewerk bauen | Place sawmill via sidebar actions. |
| 3 | `buy_wood` | Holz beschaffen | Buy wood at market or use start resources (≥10 wood). |
| 4 | `produce_planks` | Bretter produzieren | Wait for sawmill, hire workers, start „Bretter herstellen“. |
| 5 | `sell_planks` | Bretter verkaufen | Sell planks at market via sidebar. |
| 6 | `earn_profit` | Ersten Gewinn erzielen | Complete first sale; reach „First Profit“ milestone. |
| 7 | `npc_supply_contract` | NPC-Liefervertrag nutzen | NPC buys wood on interval — keep inventory ready. |
| 8 | `corporate_tax` | Unternehmenssteuer verstehen | Periodic corporate tax — check finance ledger. |

**Visibility:** All eight steps are always listed while tutorial is incomplete. `activeStepId` = first step with `completed === false` (no hidden steps, no invented sequential locking).  
**Completed tutorial:** `completed === true` → `PGTutorialPanel` shows success state only (no step list).  
**Current UI:** No buttons, links, or focus/highlight in `PGTutorialPanel`.

---

## E. Existing completion authority

| Step ID | Completion condition (gameplay state) | Computed in |
|---------|--------------------------------------|-------------|
| `open_plot` | Always `completed: true` | `readTutorialProgress` |
| `build_sawmill` | Any building with `buildingTypeId === 'sawmill'` | same |
| `buy_wood` | `hasSawmill` AND (`wood` available ≥ 10 OR any `PURCHASE` finance transaction) | same |
| `produce_planks` | `planks` available > 0 OR any production job with `recipeId === 'recipe_planks'` | same |
| `sell_planks` | Any finance transaction with `transactionType === 'SALE'` | same |
| `earn_profit` | `completedMilestones` contains `'first_profit'` | same |
| `npc_supply_contract` | Any finance transaction with `transactionType === 'CONTRACT_PAYMENT'` | same |
| `corporate_tax` | Any finance transaction with `transactionType === 'TAX'` | same |

**Frozen:** Implementation must not change these predicates, ordering, `activeStepId` algorithm, or tutorial-finished semantics.

---

## F. Existing navigation authority

| Mechanism | Owner | Behavior |
|-----------|--------|----------|
| Cross-screen navigation | `GameWorkspaceProvider.navigateToTarget` | Sets `navigation.screen` + `entitySelection` via `replaceNavigation` |
| Building prerequisite CTA | `navigatePlaceBuildingPrerequisite` | Resolves target + optional `researchCatalogFocusTechnologyId` + optional `pendingCompanyOperationsNavigation` (`milestone_overview`) |
| Workforce personnel CTA | `navigateProductionWorkforcePersonnel` | Company screen + `pendingCompanyOperationsNavigation: { kind: 'workforce_assignment', buildingId }` |
| PDM placement | `startBuildingMapPlacement` | World screen + placement session ( **not** invoked by tutorial CTA ) |
| Target builders | `entity-navigation.ts` | `buildResourceNavigationTarget`, `buildProductionBuildingNavigationTarget`, etc. |
| Research catalog focus | `researchCatalogFocusTechnologyId` state | Consumed in `ResearchScreen` (one-shot scroll/highlight pattern) |
| Company operations pending | `CompanyOperationsPendingNavigation` | `milestone_overview` \| `workforce_assignment` — `CompanyScreen` opens operations; dashboard consumes workforce intent |

**Conceptual owner for PGD-TUTORIAL-001:** `GameWorkspaceProvider` exposes **`navigateTutorialStep(stepId: TutorialStepId)`** (name fixed at implementation), implemented using the **static contract table** (§H) plus **runtime resolvers** documented below—not copy parsing.

**Authoritative metadata source (new, presentation-only):**  
`apps/web/src/presentation/navigation/tutorial-step-navigation-contract.ts`  
— maps each `TutorialStepId` to label, destination kind, and static focus keys.  
Step IDs are the same strings as `TutorialStepReadModel.id` in `readTutorialProgress`.

---

## G. Product principles

1. **CTA = navigation / guidance only** — no gameplay automation (§2 of prompt).  
2. **Objective ≠ guidance ≠ completion** — per step, three separate authorities (§57).  
3. **“Take me where I can do this”** — labels describe navigation, not completion.  
4. **No copy parsing** — behavior keyed on `step.id` and structurally declared resource/building/milestone IDs in the contract file (aligned with completion logic, not German text).  
5. **PDM sealed** — construction CTAs end at Buildings catalog (+ optional catalog row focus); player runs existing map placement.  
6. **One CTA per incomplete step** — at most one button per row (~480×900).  
7. **Completed steps** — no navigation CTA (§23).  
8. **No automatic return** to tutorial after action (§27).  
9. **CTA click does not complete steps** (§25).

---

## H. Per-step CTA decision matrix

| Step ID | Player title | Existing completion authority | CTA? | CTA label | Destination | Focus/highlight | Gameplay mutation | Completed-step CTA | Narrow behavior |
|---------|--------------|------------------------------|------|-----------|-------------|-----------------|-------------------|--------------------|-----------------|
| `open_plot` | Grundstück öffnen | Always complete | **NO** | — | — | NONE | NONE | N/A (always complete) | N/A |
| `build_sawmill` | Sägewerk bauen | `buildingTypeId === 'sawmill'` | **YES** | `Gebäude öffnen` | Primary screen `buildings`; `entitySelection: { kind: 'none' }` | **NAVIGATION + catalog row focus** — `buildingTypeId: 'sawmill'` (structural; tied to step id contract constant) | NONE | Hidden (step complete) | Full-width button under step text; no horizontal scroll |
| `buy_wood` | Holz beschaffen | Wood ≥10 or purchase | **YES** | `Markt öffnen` | Screen `markets`; `buildResourceNavigationTarget('wood')` | **NAVIGATION + entity focus** — resource `wood` (pre-select trade form; existing `MarketScreen` effect) | NONE | Hidden | Same |
| `produce_planks` | Bretter produzieren | Planks or `recipe_planks` job | **YES** | `Produktion öffnen` | Screen `production`; see §I dynamic building rule | **NAVIGATION + building context** when exactly one sawmill instance exists; else navigation only | NONE | Hidden | Same |
| `sell_planks` | Bretter verkaufen | `SALE` transaction | **YES** | `Markt öffnen` | Screen `markets`; `buildResourceNavigationTarget('planks')` | Resource `planks` pre-selection | NONE | Hidden | Same |
| `earn_profit` | Ersten Gewinn erzielen | Milestone `first_profit` | **YES** | `Meilensteine anzeigen` | Screen `company`; operations view; pending `milestone_overview` + scroll | **NAVIGATION + section scroll** to `#pg-milestones-widget-title`; optional **row emphasis** for milestone id `first_profit` if row present (presentation-only) | NONE | Hidden | Same |
| `npc_supply_contract` | NPC-Liefervertrag nutzen | `CONTRACT_PAYMENT` | **YES** | `Lieferverträge anzeigen` | Screen `company`; operations view; pending `economy_contracts_section` | Scroll to `#pg-economy-widget-title` | NONE | Hidden | Same |
| `corporate_tax` | Unternehmenssteuer verstehen | `TAX` transaction | **YES** | `Finanzbuchungen anzeigen` | Screen `company`; operations view; pending `finance_ledger_section` | Scroll to finance widget title (`PGFinanceWidget` ledger section — anchor id **`pg-finance-widget-title`** to be added in implementation if missing; contract anchor name fixed here) | NONE | Hidden | Same |

**CTA eligibility notes**

- `open_plot`: **CTA OPTIONAL / NOT JUSTIFIED** — always complete; never shown as incomplete.  
- Steps 2–8: **CTA REQUIRED** while `completed === false` (material navigation hunting today).  
- No step classified **CTA BLOCKED BY CONTRACT AMBIGUITY**.

### Per-step objective / guidance / completion (§57)

| Step ID | A. Objective | B. Guidance (CTA) | C. Completion |
|---------|--------------|-------------------|---------------|
| `open_plot` | View dashboard after session start | None | Always satisfied |
| `build_sawmill` | Place a sawmill | Open Buildings catalog (sawmill row focus) | Sawmill exists |
| `buy_wood` | Obtain ≥10 wood | Open Markets with Holz context | Inventory/purchase rule |
| `produce_planks` | Run plank production | Open Production (sawmill scope if unique) | Planks/job rule |
| `sell_planks` | Sell planks | Open Markets with Bretter context | Sale transaction |
| `earn_profit` | Reach First Profit milestone | Show milestones on company dashboard | `first_profit` milestone |
| `npc_supply_contract` | Fulfill NPC wood contract rhythm | Show economy/contracts widget | Contract payment transaction |
| `corporate_tax` | Understand tax ledger | Show finance ledger widget | Tax transaction |

---

## I. Destination contract

### Static destinations

| Step ID | Top-level screen | Sub-section / intent |
|---------|------------------|----------------------|
| `build_sawmill` | `buildings` | Baukatalog list |
| `buy_wood` | `markets` | Trade UI, resource `wood` |
| `sell_planks` | `markets` | Trade UI, resource `planks` |
| `produce_planks` | `production` | Job/recipe UI |
| `earn_profit` | `company` | Operations dashboard — milestones widget |
| `npc_supply_contract` | `company` | Operations dashboard — economy widget |
| `corporate_tax` | `company` | Operations dashboard — finance ledger widget |

### Dynamic resolver — `produce_planks`

At CTA click time, from current `companyViewData.buildings`:

1. Let `S` = buildings where `buildingTypeId === 'sawmill'`.  
2. If `|S| === 1` → `navigateToTarget(buildProductionBuildingNavigationTarget(S[0].id))`.  
3. If `|S| !== 1` → `navigateToTarget({ screen: 'production', entitySelection: { kind: 'none' } })` (no building filter; player uses existing production hints).

Structural basis: same `sawmill` / `recipe_planks` identifiers as completion logic—not description text.

### Company-dashboard steps when already on operations view

If `navigation.screen === 'company'` and operations view is active:

- Do **not** remount unnecessarily.  
- Apply **pending section scroll** (and milestone row emphasis if applicable) via one-shot pending intent.  
- Tutorial panel remains visible in the same column unless the player navigates away.

---

## J. Contextual focus contract

| Focus type | Steps | Implementation category |
|------------|-------|-------------------------|
| NONE | `open_plot` | — |
| Catalog row by `buildingTypeId` | `build_sawmill` | New one-shot `buildingCatalogFocusBuildingTypeId` (parallel to `researchCatalogFocusTechnologyId`); consumer `BuildingsScreen`; scroll row into view; temporary `pg-tutorial-focus` or existing row highlight; clear after consume |
| Resource pre-select | `buy_wood`, `sell_planks` | Existing `entitySelection.kind === 'resource'` on Markets |
| Production building filter | `produce_planks` | Existing `entitySelection.kind === 'building'` on Production when \|sawmills\|===1 |
| Section scroll | `earn_profit`, `npc_supply_contract`, `corporate_tax` | Extend `CompanyOperationsPendingNavigation` with `economy_contracts_section` and `finance_ledger_section`; reuse workforce scroll pattern (`requestAnimationFrame` + `scrollIntoView`) |
| Milestone row emphasis | `earn_profit` | Optional presentation highlight on row whose milestone id is `first_profit`; if row missing, scroll-only fallback |

**Focus vs gameplay:** All focus is presentation-only; no commands, no placement, no hiring, no recipe start.

---

## K. Completion semantics

| Step ID | Existing completion trigger | CTA affects completion? | Navigation affects completion? | Real gameplay still required? |
|---------|------------------------------|-------------------------|-------------------------------|------------------------------|
| All gameplay steps | §E table | **NO** | **NO** | **YES** |

Lifecycle: CTA → navigate/focus → player acts → `readTutorialProgress` recomputes on next dashboard refresh → step may complete.

---

## L. Navigation-intent lifecycle

| Intent | Created | Consumer | Cleared |
|--------|---------|----------|---------|
| `EntityNavigationTarget` | `navigateToTarget` | Target screen | Replaced by next navigation |
| `researchCatalogFocusTechnologyId` | Prerequisite nav | `ResearchScreen` | After focus applied / clear helper |
| `buildingCatalogFocusBuildingTypeId` (new) | Tutorial `build_sawmill` CTA | `BuildingsScreen` | After scroll/highlight consumed |
| `pendingCompanyOperationsNavigation` | Tutorial company CTAs / workforce | `CompanyScreen` + `CompanyDashboardScreen` | After consume (`clearPendingCompanyOperationsNavigation`) |
| Milestone row highlight (new, local UI state) | `earn_profit` CTA | `PGMilestonesWidget` or parent | After timeout or first interaction on widget |

**Rules**

- **One-shot** — no persistent stale focus across unrelated navigation.  
- Manual navigation away → pending tutorial focus **cleared** on consume; does not re-fire until next CTA click.  
- Repeated CTA while incomplete → same navigation deterministically; no stacked intents.  
- Stale entity focus → §O fallbacks.

---

## M. Completed-step behavior

While `step.completed === true`: **do not render** a navigation CTA on that row.  
When entire tutorial `completed`: show existing completion panel only.

---

## N. Destination-already-open behavior

| Case | Behavior |
|------|----------|
| Markets + same resource | Re-apply resource selection; ensure trade section visible (no duplicate command) |
| Production + same building filter | Keep filter; scroll to recipe/hint area if needed (no remount) |
| Buildings + sawmill focus | Re-scroll/highlight catalog row |
| Company operations + section intent | Scroll only |

---

## O. Missing/stale-target fallback

| Situation | Behavior |
|-----------|----------|
| `buildingTypeId` not in catalog | Navigate to `buildings` without catalog focus |
| Resource not in market list | Navigate to `markets` without resource pre-select |
| Sawmill count ≠ 1 for production step | Production screen, no building filter |
| `first_profit` row not in widget | Scroll to milestones section only |
| Workforce-style building missing | N/A for tutorial CTAs (no workforce CTA in v1 contract) |

No raw IDs in UI; no gameplay fallback.

---

## P. Desktop UX contract

- One secondary **Button** (existing primitive) per incomplete eligible step, below description.  
- CTA visually subordinate to step title and completion marker.  
- Panel remains compact checklist; not a command center.

---

## Q. Narrow ~480×900 UX contract

| Tutorial state | Desktop | ~480×900 |
|----------------|---------|----------|
| Incomplete step with CTA | Button under step body | Full-width block button; label wraps if needed |
| Completed step | Check marker only | Same |
| Multiple incomplete steps | Each eligible row own button | Vertical stack only (no button row) |
| Long CTA label | Wrap | Wrap; min touch target per app button styles |
| Destination already open | §N | §N |

---

## R. Accessibility contract

- Use `<button type="button">` (or `Button` component) with visible label = CTA label.  
- Keyboard: activatable; focus ring per app theme.  
- `aria-label` only if visible text insufficient (not expected here).

---

## S. Gameplay / Save / API firewall

| Area | Contract |
|------|----------|
| Save schema | **UNCHANGED** — no tutorial navigation persistence |
| API | **UNCHANGED** — no new endpoints |
| Gameplay | **UNCHANGED** — costs, PDM, milestones, recipes, workforce, transport, economy |
| Tutorial completion rules | **UNCHANGED** |
| Analytics | No new CTA tracking scope |

---

## T. PDM / BVI / Scenario-B firewall

| Track | Status |
|-------|--------|
| PDM-001 | **REMAINS SEALED** — tutorial never calls `startBuildingMapPlacement` automatically |
| BVI-001 | **REMAINS SEALED** |
| Scenario-B | **PAUSED** — **NEW ART REQUIRED: NO** |
| PGD-CATEGORY-001 | **Separate** — not in scope |

---

## U. Deferred / out-of-scope observations

- Second CTA on `produce_planks` for **Personal verwalten** (workforce) — deferred; single CTA rule; description still mentions hiring.  
- Tutorial on Company **overview** vs operations — panel only on operations dashboard today; no change required.  
- Global domain error presentation — still deferred.  
- iOS — **NOT YET**.

---

## V. Implementation readiness

**Implementation readiness test (§61):** **PASS** — all listed questions answerable without inventing product semantics.

| Question | Answer |
|----------|--------|
| Which steps have CTA? | §H (`build_sawmill` … `corporate_tax`) |
| Labels / destinations / focus | §H, §I, §J |
| Owner | `GameWorkspaceProvider` + `tutorial-step-navigation-contract.ts` |
| Focus lifetime | One-shot consume |
| Missing target | §O |
| Completion / gameplay | §K, §G |
| Narrow | §Q |

---

## W. Proposed bounded implementation scope

**Likely files (not authorized until implementation prompt):**

| Area | Files |
|------|--------|
| Contract table | `apps/web/src/presentation/navigation/tutorial-step-navigation-contract.ts` |
| Resolver + public API | `apps/web/src/presentation/navigation/navigate-tutorial-step.ts` (or inline in provider) |
| Workspace state | `GameWorkspaceProvider.tsx` — `buildingCatalogFocusBuildingTypeId`, extended `CompanyOperationsPendingNavigation`, `navigateTutorialStep` |
| UI | `PGTutorialPanel.tsx` — buttons when `!step.completed` |
| Consumers | `BuildingsScreen.tsx`, `CompanyScreen.tsx`, `CompanyDashboardScreen.tsx`, optionally `PGMilestonesWidget.tsx` / `PGFinanceWidget.tsx` (stable anchor ids) |
| Tests | Navigation contract unit tests; panel renders CTA for fixture step; workforce/milestone scroll pattern parity tests |
| Evidence | Optional narrow/desktop PNG capture of tutorial CTAs (not required for contract) |

**Non-goals:** §68 of prompt (no new steps, no completion redesign, no PDM/BVI/API/save/art/iOS/category enum).

---

## X. Final decision

> **PGD-TUTORIAL-001 PRODUCT / UX CONTRACT:**  
> `CLOSED / PASS`

> **PLAYER PROBLEM:**  
> `PASSIVE FIRST-STEPS NAVIGATION HUNTING`

> **CTA PRINCIPLE:**  
> `NAVIGATION / GUIDANCE ONLY`

> **GAMEPLAY AUTOMATION:**  
> `NONE`

> **CTA CHANGES COMPLETION:**  
> `NO`

> **COMPLETION AUTHORITY:**  
> `UNCHANGED`

> **STRUCTURED NAVIGATION:**  
> `REQUIRED WHERE CONTEXTUAL FOCUS IS NEEDED`

> **COPY PARSING:**  
> `FORBIDDEN`

> **SAVE:**  
> `UNCHANGED`

> **API:**  
> `UNCHANGED`

> **GAMEPLAY:**  
> `UNCHANGED`

> **PDM-001:**  
> `REMAINS SEALED`

> **BVI-001:**  
> `REMAINS SEALED`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **NEW ART:**  
> `NO`

> **NARROW ~480×900 CONTRACT:**  
> `DEFINED`

> **IMPLEMENTATION READINESS:**  
> `READY`

> **NEXT PROMPT:**  
> `POST_V1_PGD_TUTORIAL_001_BOUNDED_IMPLEMENTATION`

> **COMMIT / PUSH / TAG:**  
> `NONE`

---

## Navigation target matrix (§53)

| Destination type | Existing navigation authority | Reusable? | New structured intent needed? | Consumer | Clear condition |
|------------------|------------------------------|-----------|--------------------------------|----------|-----------------|
| Screen `buildings` | `navigateToTarget` | Yes | **Yes** — catalog `buildingTypeId` focus | `BuildingsScreen` | On consume |
| Screen `markets` + resource | `buildResourceNavigationTarget` | Yes | No | `MarketScreen` | On selection applied |
| Screen `production` + optional building | `buildProductionBuildingNavigationTarget` | Yes | No (dynamic id at click) | `ProductionScreen` | Standard navigation replace |
| Screen `company` + milestones scroll | `milestone_overview` pending (exists) | Partial — extend scroll like workforce | **Yes** — scroll + optional milestone id emphasis | `CompanyScreen`, `CompanyDashboardScreen`, `PGMilestonesWidget` | `clearPendingCompanyOperationsNavigation` |
| Screen `company` + economy scroll | — | Pattern from workforce scroll | **Yes** — `economy_contracts_section` | `CompanyDashboardScreen` | After scroll |
| Screen `company` + finance scroll | — | Same | **Yes** — `finance_ledger_section` | `CompanyDashboardScreen` | After scroll |

---

## Focus matrix (§55)

| Step ID | Focus target | Focus source | Presentation-only? | Lifetime | Clear behavior | Missing-target fallback |
|---------|--------------|--------------|---------------------|----------|----------------|-------------------------|
| `build_sawmill` | Catalog row `sawmill` | Contract constant `buildingTypeId` for step id | Yes | One-shot | Clear focus state after scroll | Buildings screen only |
| `buy_wood` | Resource `wood` | Contract constant | Yes | Until next navigation | Market form state | Markets screen only |
| `sell_planks` | Resource `planks` | Contract constant | Yes | Same | Same | Same |
| `produce_planks` | Sawmill building instance | Runtime `buildings` where `buildingTypeId === 'sawmill'` (count===1) | Yes | Navigation entity selection | Replaced by navigation | Production unscoped |
| `earn_profit` | Milestones section / row `first_profit` | Contract milestone id | Yes | One-shot scroll + brief row style | Clear pending + highlight | Milestones section scroll only |
| `npc_supply_contract` | `#pg-economy-widget-title` | Pending kind | Yes | One-shot | Clear pending | Company operations only |
| `corporate_tax` | `#pg-finance-widget-title` | Pending kind | Yes | One-shot | Clear pending | Company operations only |

---

## Responsive matrix (§56)

| Tutorial state | Desktop | ~480×900 |
|----------------|---------|----------|
| Incomplete step with CTA | Inline button under description | Stacked full-width button |
| Completed step | Check + text only | Same |
| Multiple visible incomplete steps | Each incomplete eligible step shows its own button | Vertical list of buttons |
| Long CTA label | Wrap in button | Wrap; no overflow-x on panel |
| Destination already open | §N | §N |

---

## Required factual questions (§69) — condensed answers

1–5. `master`, `441d76e`, BVI subject, origin same, equal yes.  
6. Unrelated WIP as §B.  
7–8. `PGTutorialPanel.tsx`; rendered from `CompanyDashboardScreen`.  
9. `GameSession` → dashboard → `mapTutorial` → panel.  
10–14. **8 steps**; IDs and copy per §D; order fixed in builder.  
15–17. Completion per §E; computed in `readTutorialProgress`; **not** separately persisted.  
18. Persistence = live session state only via `GameSession`.  
19–21. Not sequentially locked; all visible until tutorial complete; completed steps stay visible with checkmark until whole tutorial completes.  
22. Success panel “Erste Schritte abgeschlossen”.  
23–25. **No** CTA, links, or focus today.  
26. Steps 2–8 require hunting primary nav / dashboard sections.  
27. Steps 7–8 primarily on company operations surface (but player may be elsewhere).  
28. Unique destinations per §I.  
29–31. CTA on steps 2–8; not on `open_plot`; hunting + sealed nav patterns justify.  
32–35. Labels and screens per §H–§I.  
36–40. Focus per §J; structural ids only; **no** copy parsing.  
41. **Yes** — catalog focus + two company pending kinds + milestone emphasis (minimal).  
42–45. Reuse `navigateToTarget`, resource/production targets, PGD-002 milestone pending, WORKFORCE scroll pattern.  
46–47. `GameWorkspaceProvider` owns; tutorial via `navigateTutorialStep`.  
48–52. Create on CTA click; consume on mount/RAF; clear on consume or unrelated nav; repeat click re-runs; destination-open §N.  
53–55. Missing target §O; fallback still useful.  
56–59. CTA/navigation/focus do **not** complete steps; gameplay required.  
60–67. **No** domain commands or automation.  
68. No CTA when step complete.  
69–70. No auto-return; not a wizard.  
71–72. All incomplete eligible steps show CTA; one per step.  
73–75. §P–§Q; labels fit with wrap.  
76–77. Semantic buttons; keyboard/focus per §R.  
78. No disabled CTAs unless destination impossible (none expected).  
79–80. §O; no navigation persistence.  
81–85. Save/API/gameplay/completion unchanged; no new steps.  
86. No new art.  
87–90. PDM/BVI sealed; Scenario-B paused; category/error/iOS out of scope.  
91–100. Matrix complete; destinations and focus unambiguous; completion unchanged; advisory navigation; hunting addressed; bounded and **ready**.  
101. `POST_V1_PGD_TUTORIAL_001_BOUNDED_IMPLEMENTATION`.  
102. §W file list.  
103. §68 / §W non-goals.  
104. This report.  
105–109. No prod/test/assets/content/art changes.  
110–112. No commit/push/tag.

---

Definition of done: prompt §71 checklist satisfied; **OPTION A** returned.
