# POST-V1 PGD-001 — Player-Facing Milestone Requirement Labels (Close Candidate)

**Task:** Replace raw milestone IDs in player-facing requirement/blocker copy with authoritative milestone names.  
**Branch:** `master` @ `0415e74f131408a166ec4bf49f5ecab6492dde89` (no commit in this task).  
**Outcome:** **OPTION A — PGD-001 COMPLETE**

---

## A. Executive result

Raw milestone IDs in shared dashboard hint copy (`Meilenstein „{id}“ fehlt.`) were replaced with authoritative names from `game-content/milestones/*.yaml` via a small application-layer formatter. **Buildings**, **Production**, and **Research** surfaces consume the same `GameSessionDashboardBuilder` hints and are covered by one repair. Runtime capture on the Buildings catalog (19 milestone blockers) passed a programmatic raw-ID assertion. **No gameplay, save, API, or art changes.**

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (recorded) | `0415e74f131408a166ec4bf49f5ecab6492dde89` |

**Pre-existing / unrelated WIP (not absorbed):** shell/simulation UI edits, doc moves, dev pilots, BVI/PGD prompt trees, local saves, etc. **PGD-001 task-owned diff** is limited to milestone label formatter, dashboard hint wiring, focused tests, capture tooling, and this report.

---

## C. Confirmed runtime defect

Player-facing blocker strings exposed internal milestone IDs, e.g. `Meilenstein „first_industrial_machinery“ fehlt.` instead of authoritative names from content.

---

## D. Enabled milestone inventory

**Count:** **8** enabled milestones (`game-content/milestones/`, `enabled: true`).

| Internal ID | Authoritative player-facing name | Source file | Can appear as requirement? | Verified presentation |
|-------------|----------------------------------|-------------|----------------------------|------------------------|
| `first_advanced_electronics` | Erste Advanced Elektronik | `first_advanced_electronics.yaml` | Yes (buildings, recipes, research) | `Meilenstein „Erste Advanced Elektronik“ fehlt.` |
| `first_consumer_goods` | Erste Konsumgüter | `first_consumer_goods.yaml` | Yes | Authoritative name in runtime sample |
| `first_industrial_machinery` | Erste Industriemaschine | `first_industrial_machinery.yaml` | Yes | Builder + runtime (Bahnterminal path) |
| `first_machine_parts` | Erste Maschinenteile | `first_machine_parts.yaml` | Yes | Runtime sample (Montagehalle) |
| `first_production` | First Production | `first_production.yaml` | Yes | Formatter test (English name from content, not ID guess) |
| `first_profit` | First Profit | `first_profit.yaml` | Yes | Runtime sample (Kohlekraftwerk, Verteilzentrum) |
| `first_steel` | Erster Stahl | `first_steel.yaml` | Yes | Covered by all-milestones test |
| `profit_100` | Steady Sales | `profit_100.yaml` | Yes | ResearchScreen test fixture updated |

**Note:** `first_profit` / `first_production` English names are **authored in YAML**, not derived from IDs.

---

## E. Authoritative label source

| Layer | Location |
|-------|----------|
| Content | `game-content/milestones/*.yaml` → `MilestoneDefinition.name` |
| Registry | `MilestoneRegistry` (loaded at bootstrap into `gameContent.milestones`) |
| Presentation formatter | `src/application/facade/player-facing-milestone-label.ts` |

No duplicate hardcoded milestone-name map was introduced.

---

## F. Requirement presentation path

```
game-content/milestones/*.yaml (name)
  → MilestoneLoader / MilestoneRegistry
  → ApplicationContext.gameContent.milestones
  → GameSessionDashboardBuilder (#readPlaceBuildingHints | #readProductionHints | #readResearchHints)
  → formatMissingMilestoneReason(milestoneId, registry)
  → GameSession.readHints → API/view-data → BuildingsScreen / Production / Research (reason field)
```

**Key files**

| File | Role |
|------|------|
| `src/application/facade/player-facing-milestone-label.ts` | Resolve name + format blocker sentence |
| `src/application/facade/GameSessionDashboardBuilder.ts` | Three milestone blocker sites updated |
| `apps/web/src/presentation/screens/buildings/BuildingsScreen.tsx` | Renders `entry.reason` from hints |
| `apps/web/src/presentation/screens/research/ResearchScreen.tsx` | Renders research hint `reason` |
| Production surfaces | Same `hints.production[].reason` from builder |

---

## G. Root-cause classification

**Primary:** **PGD-M2 — HINT BUILDER USES RAW ID**  
**Secondary:** **PGD-M1 — LABEL AUTHORITY NOT PROPAGATED** (registry had names but hint builder interpolated IDs directly).

Not PGD-M4 (single builder, not duplicated formatters in presentation).

---

## H. Implementation

1. Added `resolvePlayerFacingMilestoneName` and `formatMissingMilestoneReason` (content-backed).
2. Replaced three `` `Meilenstein „${missingMilestone}“ fehlt.` `` sites in `GameSessionDashboardBuilder`.
3. Tests: all enabled milestones, unknown-ID fallback, builder integration (buildings + research), ResearchScreen mock updated to semantic name.

**Technology** blocker strings (`Forschung „{technologyId}“ fehlt.`) intentionally **unchanged** (deferred PGD family).

---

## I. Unknown-ID fallback

If `milestones.get(id)` is missing or name is empty:

- Label falls back to **raw milestone ID** inside the same German sentence.
- Deterministic; no crash; no fabricated translation.
- Test: `player-facing-milestone-label.test.ts` → `milestone_does_not_exist_xyz`.

---

## J. Buildings runtime verification

| Item | Value |
|------|--------|
| Viewport | 1440×900 |
| Evidence | `docs/architecture/reviews/evidence/PGD_001_MILESTONE_LABELS_BUILDINGS_DESKTOP_1440x900.png` |
| Tool | `node tools/capture-pgd-001-milestone-labels-runtime-evidence.mjs` |
| DOM assertion | **19** milestone blocker rows; **0** enabled raw milestone IDs in blocker text |
| Sample | `Meilenstein „Erste Maschinenteile“ fehlt.`, `Meilenstein „First Profit“ fehlt.`, etc. |

---

## K. Production / Research shared-consumer verification

| Surface | Verification |
|---------|----------------|
| Production | Same `#readProductionHints` path; covered by shared formatter + builder tests pattern |
| Research | `#readResearchHints` + `GameSessionDashboardBuilder.test.ts` (semiconductor_process) |
| Runtime Research | Component test uses authoritative `Steady Sales` for mocked hint |

Production runtime milestone blockers not separately screenshot’d (same hint pipeline; no gameplay manipulation).

---

## L. Narrow viewport verification

| Item | Value |
|------|--------|
| Viewport | 480×900 |
| Evidence | `docs/architecture/reviews/evidence/PGD_001_MILESTONE_LABELS_BUILDINGS_NARROW_480x900.png` |
| Assertion | Same raw-ID scan **PASS** (19 blockers) |
| Layout | No task-owned layout changes; longer German names render without task-local regression |

---

## M. Raw-ID residual audit

| Category | Active player-facing milestone blocker leak |
|----------|---------------------------------------------|
| `src/application` `Meilenstein „first_*` / `profit_*` | **0** (post-fix grep) |
| `apps/web` presentation | **0** |
| Content YAML / domain / saves / API | IDs remain (expected) |
| Tests of domain identity | Unchanged |
| Historical reports / screenshots | Unchanged |
| Debug / internal | Unchanged |

**Active player-facing requirement copy leak count:** **0**

Remaining raw IDs in **technology** prerequisite copy (`Forschung „advanced_metallurgy“ fehlt.`) — **deferred** (not milestone family).

---

## N. Gameplay / save / API firewall

| Area | Changed? |
|------|----------|
| Milestone IDs | **NO** |
| Milestone triggers / rewards / ordering | **NO** |
| Building/research/recipe prerequisites | **NO** |
| Save schema / serialized milestone IDs | **NO** |
| API contracts | **NO** |
| Currency `$` presentation | **NO** |
| Building placement / PDM | **NO** |
| Art / BVI-001 / ICON-003 | **NO** |
| Scenario-B | **Paused; delta 0** |

---

## O. Focused tests

| Command | Result |
|---------|--------|
| `pnpm exec vitest run src/application/facade/player-facing-milestone-label.test.ts` | **PASS** (3) |
| `pnpm exec vitest run src/application/facade/GameSessionDashboardBuilder.test.ts` | **PASS** (4) |
| `pnpm exec vitest run apps/web/src/presentation/screens/research/ResearchScreen.test.tsx` | **PASS** (1) |

---

## P. Root quality gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** (0 errors; pre-existing warnings) |
| `pnpm test` | **PASS** (277 files / 1038 tests) |
| `pnpm build:web` | **PASS** |

---

## Q. Diff ownership

**Task-owned**

- `src/application/facade/player-facing-milestone-label.ts`
- `src/application/facade/player-facing-milestone-label.test.ts`
- `src/application/facade/GameSessionDashboardBuilder.ts`
- `src/application/facade/GameSessionDashboardBuilder.test.ts`
- `apps/web/src/presentation/screens/research/ResearchScreen.test.tsx`
- `tools/capture-pgd-001-milestone-labels-runtime-evidence.mjs`
- `docs/architecture/reviews/evidence/PGD_001_MILESTONE_LABELS_*.png`
- This close candidate

---

## R. Deferred Player Guidance issues

| ID | Issue | Status |
|----|-------|--------|
| PGD-002+ | Actionable requirements (navigation, “go to”) | Deferred |
| — | Technology ID labels in `Forschung „…“ fehlt.` | Deferred (separate family) |
| — | Resource/recipe/route raw-ID presentation | Deferred |
| TUT-001 | Tutorial actionability | Deferred |
| PDM-001 | Direct world placement | Deferred |
| — | Tick vs Zyklus terminology | Record-only; not absorbed |

---

## S. Final decision

> **PGD-001 DEFECT:**  
> `RAW MILESTONE IDs IN PLAYER-FACING REQUIREMENT COPY`

> **PLAYER-FACING MILESTONE LABELS:**  
> `AUTHORITATIVE`

> **ACTIVE RAW MILESTONE IDs IN REQUIREMENT COPY:**  
> `0`

> **MILESTONE DOMAIN IDs:**  
> `UNCHANGED`

> **GAMEPLAY / BALANCING:**  
> `UNCHANGED`

> **SAVE / API CONTRACTS:**  
> `UNCHANGED`

> **NEW ART:**  
> `NONE`

> **BVI-001 / ICON-003:**  
> `UNCHANGED / SEALED`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## Required consumer table (§51)

| Screen | Source | Before | After | Runtime verified? | Test verified? | Status |
|--------|--------|--------|-------|-----------------|----------------|--------|
| Buildings catalog | `GameSessionDashboardBuilder.#readPlaceBuildingHints` → `BuildingsScreen` | Raw ID in `reason` | Authoritative name | Yes (1440 + 480) | Yes | **FIXED** |
| Production | `#readProductionHints` | Raw ID | Authoritative name | Not screenshot (shared path) | Via formatter + builder pattern | **FIXED** |
| Research | `#readResearchHints` → `ResearchScreen` | Raw ID | Authoritative name | Mock only | Yes | **FIXED** |

---

## Required factual answers (§53)

1. Enabled milestones: **8**
2. Authoritative source: **`game-content/milestones/*.yaml` → `MilestoneDefinition.name`**
3. Root cause: **Hint builder interpolated milestone ID instead of content name (PGD-M2/M1)**
4. Implementation: **`formatMissingMilestoneReason` + `GameSessionDashboardBuilder` wiring**
5. Milestone IDs renamed: **NO**
6. Gameplay rules changed: **NO**
7. Milestone content values changed: **NO**
8. Save schema changed: **NO**
9. API contracts changed: **NO**
10. `first_machine_parts`: **Erste Maschinenteile** — **YES**
11. `first_profit`: **First Profit** (YAML) — **YES**
12. `first_advanced_electronics`: **Erste Advanced Elektronik** — **YES**
13. `first_industrial_machinery`: **Erste Industriemaschine** — **YES**
14. `first_production`: **First Production** (YAML) — **YES**
15. All other enabled IDs: **YES** (all-milestones test)
16. Unknown ID: **Raw ID fallback in same sentence**
17. Buildings runtime raw IDs in blockers: **NO** (assertion PASS)
18. Production/Research shared repair: **YES**
19. Narrow viewport usable: **YES**
20. Art changed: **NO**
21. BVI-001 reopened: **NO**
22. Scenario-B reopened: **NO**
23. Currency changed: **NO**
24. Placement/direct manipulation changed: **NO**
25. Technology/resource raw IDs deferred: **YES**
26. Active player-facing raw milestone-ID occurrences: **0**
27. Focused tests green: **YES**
28. Root gates green: **YES**
29. PGD-001 ready to close: **YES** (pending independent review)

**No commit. No push. No tag.**

# END
