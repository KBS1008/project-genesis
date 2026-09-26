# POST-V1 PGD-TECH-001 — Player-Facing Technology Requirement Labels (Close Candidate)

**Task:** Replace raw technology IDs in player-facing requirement/blocker copy with authoritative technology names.  
**Branch:** `master` @ `693014ab2a34bfd614f4f46a66dbf2d9719f766b` (PGD-001 committed; **PGD-TECH-001 not committed** per prompt).  
**Outcome:** **OPTION A — PGD-TECH-001 COMPLETE**

---

## A. Executive result

Raw technology IDs in shared dashboard hint copy (`Forschung „{technologyId}“ fehlt.`) were replaced with authoritative names from `game-content/research/*.yaml` via a small application-layer formatter. **Buildings**, **Production**, and **Research** surfaces consume the same `GameSessionDashboardBuilder` hints and are covered by one repair. Runtime capture (Buildings desktop/narrow + Research desktop) passed a programmatic scan for **22** enabled technology IDs inside visible `Forschung` blocker text (**0** leaks). **No gameplay, save, API, art, or PGD-001 milestone behavior changes.**

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (recorded) | `693014ab2a34bfd614f4f46a66dbf2d9719f766b` |
| PGD-001 | Committed/pushed on `master` (`693014a` slice) |
| PGD-TECH-001 | Local WIP only; **no commit / push / tag** |

**Pre-existing / unrelated WIP (not absorbed):** shell/simulation UI, BVI production assets, doc moves, dev building pilots, local `apps/api/saves/*`, `.next` cache, etc. **PGD-TECH-001 task-owned diff** is limited to technology label formatter, dashboard hint wiring (three sites), focused tests, capture tooling, runtime evidence PNGs, and this report.

---

## C. Confirmed technology-ID defect

Player-facing blocker strings exposed internal technology IDs, e.g. `Forschung „advanced_metallurgy“ fehlt.` instead of authoritative names from research content. PGD-001 close candidate explicitly deferred this family.

---

## D. Enabled technology inventory

**Count:** **22** enabled technologies (`game-content/research/`, `enabled: true`).

See **§60 Required technology table** (full 22 rows).

**Mixed-language names (authored, not translated in this slice):** e.g. `Basic Woodworking`, `Executive Leadership`, `Predictive Analytics`.

**Duplicate authoritative names:** none among enabled technologies.

---

## E. Authoritative technology-name source

| Layer | Location |
|-------|----------|
| Content | `game-content/research/*.yaml` → `TechnologyDefinition.name` |
| Registry | `TechnologyRegistry` (loaded at bootstrap into `gameContent.technologies`) |
| Presentation formatter | `src/application/facade/player-facing-technology-label.ts` |

No duplicate hardcoded technology-name map was introduced. **ICON-004** visual manifests are **not** used as semantic text authority.

---

## F. Technology requirement presentation path

```
game-content/research/*.yaml (name)
  → TechnologyLoader / TechnologyRegistry
  → ApplicationContext.gameContent.technologies
  → GameSessionDashboardBuilder (#readPlaceBuildingHints | #readProductionHints | #readResearchHints)
  → formatMissingTechnologyReason(technologyId, registry)
  → GameSession.readHints → API/view-data → Buildings / Production / Research (reason field)
```

**Key files**

| File | Role |
|------|------|
| `src/application/facade/player-facing-technology-label.ts` | Resolve name + format blocker sentence |
| `src/application/facade/GameSessionDashboardBuilder.ts` | Three technology blocker sites updated |
| `apps/web/src/presentation/screens/buildings/BuildingsScreen.tsx` | Renders `entry.reason` from hints |
| `apps/web/src/presentation/screens/research/ResearchScreen.tsx` | Renders research hint `reason` |
| Production surfaces | Same `hints.production[].reason` from builder |

---

## G. Root-cause classification

**Primary:** **PGD-T2 — HINT BUILDER USES RAW TECHNOLOGY ID**  
**Secondary:** **PGD-T1 — TECHNOLOGY LABEL AUTHORITY NOT PROPAGATED** (registry had names but hint builder interpolated IDs directly).

Not PGD-T4 (single builder, not duplicated formatters in presentation). Not PGD-T5 (all enabled technologies have usable `name` fields).

---

## H. Implementation

1. Added `resolvePlayerFacingTechnologyName` and `formatMissingTechnologyReason` (content-backed).
2. Replaced three raw `` `Forschung „${missingResearch}“ fehlt.` `` interpolations in `GameSessionDashboardBuilder` (buildings, production, research hints).
3. Tests: all **22** enabled technologies, unknown-ID fallback, `advanced_metallurgy` spot check, builder integration (`precision_machining` → Fortgeschrittene Metallurgie; `rail_terminal` → Intermodale Logistik).

**PGD-001 milestone formatter** (`player-facing-milestone-label.ts`) **unchanged.**

---

## I. Unknown-ID fallback

If `technologies.get(id)` is missing or name is empty:

- Label falls back to **raw technology ID** inside the same German sentence.
- Deterministic; no crash; no fabricated translation or ID humanization.
- Test: `player-facing-technology-label.test.ts` → `technology_does_not_exist_xyz`.

---

## J. Active consumer audit

| Surface | Technology blockers? | Owner |
|---------|---------------------|--------|
| Buildings | Yes (`requiredResearch` on building types) | `GameSessionDashboardBuilder` → hint `reason` |
| Production | Yes (`requiredResearch` on recipes) | Same |
| Research | Yes (`requiredResearch` on technologies) | Same |
| Company / Market / Transport / Workforce / tutorial | No active `Forschung „…“ fehlt.` path found in presentation audit |

All in-scope consumers share one formatter contract.

---

## K. Buildings verification

| Item | Value |
|------|--------|
| Viewports | 1440×900, 480×900 |
| Evidence | `docs/architecture/reviews/evidence/PGD_TECH_001_TECHNOLOGY_LABELS_BUILDINGS_DESKTOP_1440x900.png`, `…_BUILDINGS_NARROW_480x900.png` |
| Tool | `node tools/capture-pgd-tech-001-technology-labels-runtime-evidence.mjs` |
| Session | `saves/e2e-m11-phase6-production-closeout.json` |
| DOM assertion | Every visible hint row containing `Forschung` scanned against **22** enabled IDs → **0** raw-ID leaks |
| Note | This save shows many **milestone** blockers; fewer **technology** `Forschung` rows than Research on the same save |

---

## L. Production verification

| Surface | Verification |
|---------|----------------|
| Production | Same `#readProductionHints` path; `formatMissingTechnologyReason` wired; covered by builder tests and shared formatter all-technology test |
| Runtime Production | Not separately screenshot’d (same hint pipeline; no task-owned UI change) |

---

## M. Research verification

| Item | Value |
|------|--------|
| Viewport | 1440×900 |
| Evidence | `docs/architecture/reviews/evidence/PGD_TECH_001_TECHNOLOGY_LABELS_RESEARCH_DESKTOP_1440x900.png` |
| Assertion | Same raw-ID scan **PASS** on Forschung-containing hint rows |
| Sample | Authoritative names in blocker copy (e.g. content names for missing prerequisites on locked research entries) |

---

## N. Desktop runtime evidence

Three PNG captures (Buildings desktop, Research desktop) document post-fix UI. Capture script asserts **zero** enabled raw technology IDs in scanned blocker regions.

---

## O. Narrow runtime evidence

Buildings **480×900** capture included; same assertion **PASS**. No task-owned layout changes.

---

## P. Raw-ID residual audit

| Category | Active player-facing technology requirement leak |
|----------|--------------------------------------------------|
| `GameSessionDashboardBuilder` raw `` missingResearch `` interpolation | **0** (post-fix) |
| `src/application` other `Forschung „${…}` (non-formatter) | **0** |
| `apps/web` presentation constructing technology blocker sentences | **0** (`ResearchScreen` uses `hint.name` for started-toast only) |
| Content YAML / domain / saves / API | Technology IDs remain (expected) |
| ICON-004 visual identity | Unchanged |
| Tests of domain identity | Unchanged |
| Historical reports / PGD-001 evidence | Unchanged |
| Debug / internal | Unchanged |

**Active player-facing technology requirement copy leak count:** **0**

---

## Q. Milestone / gameplay / save / API firewalls

| Area | Changed? |
|------|----------|
| PGD-001 milestone formatter / wording | **NO** |
| Technology IDs | **NO** |
| Technology YAML (costs, prerequisites, effects) | **NO** |
| Research / unlock rules | **NO** |
| Save schema / serialized technology IDs | **NO** |
| API contracts | **NO** |
| Currency `$` presentation | **NO** |
| Building placement / PDM | **NO** |
| Art / BVI-001 / ICON-003 / ICON-004 | **NO** |
| Scenario-B | **Paused; delta 0** |

---

## R. Focused tests

| Command | Result |
|---------|--------|
| `pnpm exec vitest run src/application/facade/player-facing-technology-label.test.ts` | **PASS** (3) |
| `pnpm exec vitest run src/application/facade/GameSessionDashboardBuilder.test.ts` | **PASS** (5) |
| `pnpm exec vitest run src/application/facade/player-facing-milestone-label.test.ts` | **PASS** (3) — PGD-001 regression check |

---

## S. Root quality gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** (0 errors; pre-existing warnings) |
| `pnpm test` | **PASS** (278 files / 1042 tests) |
| `pnpm build:web` | **PASS** |

Recorded at close-candidate time on task-owned tree atop `693014a`.

---

## T. Diff ownership

**Task-owned**

- `src/application/facade/player-facing-technology-label.ts`
- `src/application/facade/player-facing-technology-label.test.ts`
- `src/application/facade/GameSessionDashboardBuilder.ts` (technology sites only; milestone sites remain PGD-001)
- `src/application/facade/GameSessionDashboardBuilder.test.ts` (technology assertions)
- `tools/capture-pgd-tech-001-technology-labels-runtime-evidence.mjs`
- `docs/architecture/reviews/evidence/PGD_TECH_001_TECHNOLOGY_LABELS_*.png`
- This close candidate

---

## U. Deferred Player Guidance issues

| ID | Issue | Status |
|----|-------|--------|
| PGD-002+ | Actionable requirements (navigation, “go to”) | Deferred |
| — | Resource/recipe/route raw-ID presentation (non-technology families) | Deferred |
| TUT-001 | Tutorial actionability | Deferred |
| PDM-001 | Direct world placement | Deferred |
| — | Tick vs Zyklus terminology | Record-only |

Technology **ID** leakage in `Forschung „…“ fehlt.` — **addressed by PGD-TECH-001** (this close).

---

## V. Final decision

> **PGD-TECH-001 DEFECT:**  
> `RAW TECHNOLOGY IDs IN PLAYER-FACING REQUIREMENT COPY`

> **PLAYER-FACING TECHNOLOGY LABELS:**  
> `AUTHORITATIVE (CONTENT-BACKED)`

> **ACTIVE RAW ENABLED TECHNOLOGY IDs IN REQUIREMENT COPY:**  
> `0`

> **TECHNOLOGY DOMAIN IDs:**  
> `UNCHANGED`

> **PGD-001 MILESTONE PRESENTATION:**  
> `UNCHANGED`

> **GAMEPLAY / BALANCING:**  
> `UNCHANGED`

> **SAVE / API CONTRACTS:**  
> `UNCHANGED`

> **NEW ART:**  
> `NONE`

> **BVI-001 / ICON-003 / ICON-004:**  
> `UNCHANGED / SEALED`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## §60 Required technology table

| Internal ID | Authoritative player-facing name | Source file | Enabled? | Can appear as prerequisite? | Semantic resolution verified? | Representative consumer |
|-------------|----------------------------------|-------------|----------|----------------------------|------------------------------|-------------------------|
| `advanced_metallurgy` | Fortgeschrittene Metallurgie | `advanced_metallurgy.yaml` | Yes | Yes | Yes (formatter + test) | Research / Production (`precision_machining`) |
| `basic_woodworking` | Basic Woodworking | `basic_woodworking.yaml` | Yes | Yes | Yes | Research |
| `circuit_design` | Schaltungsdesign | `circuit_design.yaml` | Yes | Yes | Yes | Research / buildings |
| `coal_efficiency` | Kohlekraft-Effizienz | `coal_efficiency.yaml` | Yes | Yes | Yes | Research |
| `corporate_management` | Unternehmensfuehrung | `corporate_management.yaml` | Yes | Yes | Yes | Research |
| `crop_optimization` | Ertragsoptimierung | `crop_optimization.yaml` | Yes | Yes | Yes | Research |
| `distribution_networks` | Distributionsnetze | `distribution_networks.yaml` | Yes | Yes | Yes | Research |
| `executive_leadership` | Executive Leadership | `executive_leadership.yaml` | Yes | Yes | Yes | Research |
| `factory_automation` | Fabrikautomatisierung | `factory_automation.yaml` | Yes | Yes | Yes | Research |
| `financial_planning` | Finanzplanung | `financial_planning.yaml` | Yes | Yes | Yes | Research |
| `industrial_assembly` | Industriemontage | `industrial_assembly.yaml` | Yes | Yes | Yes | Research |
| `intermodal_logistics` | Intermodale Logistik | `intermodal_logistics.yaml` | Yes | Yes | Yes | Buildings (`rail_terminal`) |
| `organic_chemistry` | Organische Chemie | `organic_chemistry.yaml` | Yes | Yes | Yes | Research |
| `polymer_science` | Polymerwissenschaft | `polymer_science.yaml` | Yes | Yes | Yes | Research |
| `precision_machining` | Praezisionsbearbeitung | `precision_machining.yaml` | Yes | Yes | Yes | Research (hint target) |
| `predictive_analytics` | Predictive Analytics | `predictive_analytics.yaml` | Yes | Yes | Yes | Research |
| `process_automation` | Prozessautomatisierung | `process_automation.yaml` | Yes | Yes | Yes | Research |
| `renewable_energy` | Erneuerbare Energie | `renewable_energy.yaml` | Yes | Yes | Yes | Research |
| `semiconductor_process` | Halbleiterprozesse | `semiconductor_process.yaml` | Yes | Yes | Yes | Research |
| `smart_grid` | Intelligentes Stromnetz | `smart_grid.yaml` | Yes | Yes | Yes | Research |
| `sustainable_agriculture` | Nachhaltige Landwirtschaft | `sustainable_agriculture.yaml` | Yes | Yes | Yes | Research |
| `warehouse_systems` | Lagersysteme | `warehouse_systems.yaml` | Yes | Yes | Yes | Research |

---

## §61 Required consumer table

| Screen | Source builder/function | Before | After | Runtime verified? | Test verified? | Status |
|--------|----------------------|--------|-------|-------------------|----------------|--------|
| Buildings | `#readPlaceBuildingHints` | `Forschung „{rawId}“ fehlt.` | `formatMissingTechnologyReason` | Yes (desktop + narrow scan) | Yes (`rail_terminal`) | **PASS** |
| Production | `#readProductionHints` | Raw ID interpolation | Same formatter | Shared path (no separate screenshot) | Yes (builder + all-tech test) | **PASS** |
| Research | `#readResearchHints` | Raw ID interpolation | Same formatter | Yes (desktop scan) | Yes (`precision_machining`) | **PASS** |

---

## §62 Required residual table

| Bucket | Raw technology IDs present? | Expected |
|--------|----------------------------|----------|
| Content/domain authority (`game-content`, prerequisites) | Yes | Expected |
| Save/API identity | Yes | Expected |
| ICON-004 visual identity | Yes (non-semantic) | Expected |
| Tests/fixtures (identity assertions) | Yes | Expected |
| Debug/internal | Yes | Expected |
| Historical docs/evidence | Yes (pre-fix screenshots) | Expected |
| **Active player-facing requirement copy** | **No (enabled ID leak)** | **0** |

---

## §63 Required factual questions

1. **Enabled technologies:** **22**
2. **Authoritative name source:** `TechnologyDefinition.name` in `game-content/research/*.yaml` via `TechnologyRegistry` / `gameContent.technologies`
3. **`advanced_metallurgy` name:** **Fortgeschrittene Metallurgie**
4. **Cause of leak:** `GameSessionDashboardBuilder` interpolated `missingResearch` ID strings directly into `Forschung „…“ fehlt.` copy
5. **Resolution:** `player-facing-technology-label.ts` + three builder call sites
6. **Registry reused?** **Yes** — existing `TechnologyRegistry` lookup; no new content loader
7. **Hardcoded name map?** **No**
8. **Technology IDs renamed?** **No**
9. **Content names changed?** **No**
10. **Prerequisites changed?** **No**
11. **Costs/durations/effects changed?** **No**
12. **Research gameplay changed?** **No**
13. **Save schema changed?** **No**
14. **API contracts changed?** **No**
15. **Unknown technology ID:** raw ID inside same sentence; deterministic; tested
16. **All enabled technologies resolve?** **Yes** (all-technology unit test)
17. **Surfaces with technology blockers:** Buildings, Production, Research (shared hints)
18. **Buildings authoritative names?** **Yes** where technology prerequisites apply
19. **Production authoritative names?** **Yes** (shared builder path)
20. **Research authoritative names?** **Yes**
21. **Runtime strings checked:** all DOM hint rows containing `Forschung` on Buildings (2 viewports) + Research (1 viewport) in capture script (exact row counts vary by save; prior successful capture logged samples in tool stdout)
22. **Enabled raw IDs after repair:** **0** in scanned regions
23. **Narrow viewport usable?** **Yes** (capture + assertion pass)
24. **PGD-001 milestone presentation changed?** **No**
25. **Milestone formatter behavior changed?** **No**
26. **ICON-004 changed?** **No**
27. **Art changed?** **No**
28. **BVI-001 / ICON-003 changed?** **No**
29. **Scenario-B reopened?** **No**
30. **Currency presentation changed?** **No**
31. **Direct placement changed?** **No**
32. **Other raw-ID families deferred?** **Yes** (resources, routes, etc.)
33. **Active technology-ID requirement leaks remaining?** **0**
34. **Focused tests green?** **Yes**
35. **Root gates green?** **Yes**
36. **Ready to close PGD-TECH-001?** **Yes** — **OPTION A**

---

## §64 Deferred work

Unchanged from PGD-001 deferral list: PGD-002 actionability, non-technology semantic IDs, TUT-001, PDM-001, Transport IA, Tick/Zyklus terminology. Not implemented in this slice.

---

## §65 Final decision

**OPTION A — PGD-TECH-001 COMPLETE**

Independent review may commit task-owned files only (exclude unrelated WIP). No push/tag unless separately approved.
