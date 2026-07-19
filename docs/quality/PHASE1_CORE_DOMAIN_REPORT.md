# Phase 1 Core Domain — Gate Review Report

**Project:** Project Genesis  
**Date:** 2026-07-19  
**Scope:** Phase 1 Core Domain — work packages P1-01 through P1-06  
**Plan:** `docs/development/PHASE1_CORE_DOMAIN_PLAN.md`  
**Auditor:** Cursor (repo-backed review)

---

# Executive Summary

Phase 1 Core Domain ist **freigegeben** und **abgeschlossen**.

| Kriterium                                            | Ergebnis                              |
| ---------------------------------------------------- | ------------------------------------- |
| Work Packages P1-01 … P1-06                          | ✅ Erfüllt                            |
| Quality Gates (lint, typecheck, test)                | ✅ Grün                               |
| Domain ohne `src/content/`-Imports (Produktionscode) | ✅ Erfüllt                            |
| Keine Regression vs. Baseline 417                    | ✅ 472 Tests                          |
| Savegame-Roundtrip nach P1-04                        | ✅ `GameStateSerializer.test.ts` grün |

**Test-Delta:** 417 → **472** (+55)  
**Empfehlung:** Mit **M7 World Simulation** (World/Region-Domain) starten.

---

# Work Package Summary

| WP    | Focus                        | Key deliverables                                                              | Status |
| ----- | ---------------------------- | ----------------------------------------------------------------------------- | ------ |
| P1-01 | Logistics domain tests       | `TransportOrder.test.ts`, `InMemoryTransportOrderRepository.test.ts`          | ✅     |
| P1-02 | Milestone domain extraction  | `MilestoneTriggerPolicy`, `MilestoneDefinitionMapper`, Service-Refactor       | ✅     |
| P1-03 | Research test coverage       | `ResearchCompletionService.test.ts`, `CompanyResearch` edge cases             | ✅     |
| P1-04 | Money VO consistency         | `Money.add/subtract/compare`, `FinanceAccount` internal `Money`               | ✅     |
| P1-05 | Company domain clarification | `src/domain/company/README.md`, `CompanySimulationSystem` stub docs           | ✅     |
| P1-06 | Repository test coverage     | Research, Milestones, CompanyResearch repo tests; Company/Inventory erweitert | ✅     |

---

# Exit Criteria (per WP)

## P1-01 — Logistics Domain Tests

- ≥ 8 neue Tests: ✅ 14 (9 domain + 5 repository)
- Keine Application-Abhängigkeit in Domain-Tests: ✅
- `pnpm test` grün: ✅

## P1-02 — Milestone Domain Extraction

- Kein `src/content/`-Import in neuen Domain-Dateien: ✅
- `MilestoneEvaluationService.test.ts` grün: ✅
- ≥ 6 Domain-Unit-Tests: ✅ 9 (`MilestoneTriggerPolicy.test.ts`)
- Verhalten vs. `game-content/milestones/` unverändert: ✅

## P1-03 — Research Test Coverage

- Happy Path + Fehlerfälle: ✅ 4 Service-Tests
- ≥ 4 neue Tests: ✅ (+ 2 `CompanyResearch` edge cases)

## P1-04 — Money VO Consistency

- Öffentliche `FinanceAccount`-API unverändert (number getters): ✅
- Finance-/Market-Tests grün: ✅
- Savegame-Roundtrip: ✅
- `STARTING_MONEY` / `FinanceConstants` unverändert: ✅

## P1-05 — Company Domain Clarification

- Dokumentation + Stub-Klarstellung: ✅
- Kein Scope-Creep (kein Bankruptcy-Flow, kein World-Bezug): ✅
- Status-Invarianten getestet (`restore`): ✅

## P1-06 — Repository Test Coverage

- ≥ 4 neue Repository-Testdateien oder 12 Tests: ✅ 3 neue Dateien, 19 neue Tests
- CRUD + Not-Found + Overwrite: ✅
- Deterministische `findAll()`-Sortierung: ✅

---

# Gate Evidence

| Prüfung                                                 | Ergebnis                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `pnpm test`                                             | 472 passed (106 files)                                                          |
| `pnpm lint`                                             | 0 errors (29 pre-existing warnings)                                             |
| `pnpm typecheck`                                        | grün                                                                            |
| Domain import audit (`src/domain/**/*.ts`, excl. tests) | 0 content imports                                                               |
| Domain test note                                        | `Market.test.ts` imports content fixtures (pre-existing; not production domain) |

---

# Architecture Outcomes

1. **Milestone trigger logic** lives in `MilestoneTriggerPolicy`; application maps content via `MilestoneDefinitionMapper`.
2. **Finance balances** use `Money` internally; transactions and public APIs remain numeric for stability.
3. **Company aggregate** scope is documented as intentionally minimal until M7+.
4. **In-memory repositories** for logistics, research, and milestones have explicit regression tests.

---

# Remaining Gaps (consciously M7+)

| Gap                                      | Rationale                                             |
| ---------------------------------------- | ----------------------------------------------------- |
| `CompanyStatus` transition methods       | Deferred — no bankruptcy/vacation gameplay in Phase 1 |
| `CompanySimulationSystem` business rules | Stub/no-op until domain services exist                |
| World / Region aggregates                | Out of Phase 1 scope                                  |
| Vehicle entities                         | DD-022 V1 waiver continues                            |
| Full `domain-model.md` coverage          | Phase 1 hardened existing M4–M6 core, not full model  |

---

# Recommendation for M7 Start

1. Introduce **World/Region** bounded context per `bounded-contexts.md` without breaking savegame v1 fields.
2. Extend `CompanySimulationSystem` only when corresponding domain policies exist (avoid application-layer rules).
3. Keep **content/domain separation**: map static definitions in application layer; policies/specifications in domain.
4. Maintain repository test pattern established in P1-06 for new aggregates.

---

# References

```text
docs/development/PHASE1_CORE_DOMAIN_PLAN.md
docs/development/IMPLEMENTATION_PROGRESS.md
docs/architecture/domain-model.md
docs/architecture/bounded-contexts.md
docs/project-management/MILESTONE_PLAN.md
```
