# POST-V1 PGD-TUTORIAL-001 — Runtime Evidence Gate Completion

**Date:** 2026-10-06  
**Authority:** `docs/development/Prompts/POST_V1_PGD_TUTORIAL_001_RUNTIME_EVIDENCE_GATE_COMPLETION.md`

---

## A. Executive result

**OPTION A — RUNTIME CERTIFIED / CLOSE READY**

Mandatory runtime evidence captured against the live Web stack. Implementation source unchanged during this delta (evidence tooling + fixtures + reports only).

---

## B. Baseline / worktree

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (committed) | `441d76e524cb92101d253523518664bfad5d0cbc` — BVI-001 |
| `origin/master` | Same |
| PGD-TUTORIAL-001 implementation | **Uncommitted** local changes |
| Evidence delta | Tooling, fixtures, screenshots, JSON summary, reports |

---

## C. Previous runtime blocker

First capture attempt used `POST /api/session/new` on a warm dev server → **HTTP 400**. Close candidate correctly marked runtime **NOT CERTIFIED**.

---

## D. HTTP-400 diagnosis

| Field | Value |
|-------|--------|
| Endpoint | `POST http://127.0.0.1:3000/api/session/new` |
| Method | POST |
| Payload | `{"name":"PGD-TUTORIAL-001 evidence …"}` |
| Response | `400 {"ok":false,"error":"Company id \"company_001\" already exists."}` |
| Root cause | Active in-memory session already has `company_001`; `startNewGame` rejects duplicate company |
| Readiness | Secondary issue: `/health` on port **3000** returns 404; API health is on **3001** |
| Fix class | **Evidence-tool only** — `session/load` fixtures + `PG_API_ORIGIN` health wait |

---

## E. Evidence-tool correction

- `tools/build-pgd-tutorial-001-evidence-fixture.mjs` — creates `pgd-tutorial-001-new-game.json` (after clean API) and copies mid-progress fixture.
- `tools/capture-pgd-tutorial-001-runtime-evidence.mjs` — load-based bootstrap, assertions, screenshots, JSON summary, non-zero exit on failure.

---

## F. Runtime fixture/session method

1. `pnpm dev:restart` (clean session for fixture build once).
2. `node tools/build-pgd-tutorial-001-evidence-fixture.mjs`
3. `node tools/capture-pgd-tutorial-001-runtime-evidence.mjs`

Fixtures: `tools/evidence-fixtures/pgd-tutorial-001-new-game.json`, `pgd-tutorial-001-mid-progress.json` (from sealed e2e closeout save).

---

## G. Desktop certification (~1440×900)

**PASS** — tutorial panel, labels, incomplete CTAs, completed steps without CTAs (verified on fixtures).

---

## H. Build CTA / no-auto-PDM proof

**PASS** — `Gebäude öffnen` → Baukatalog, `[data-building-type-id="sawmill"]`, building count **4→4**, `build_sawmill` completion **false→false**, World not auto-opened.

---

## I. Market certification

**PASS** — `buy_wood` → `#market-resource-select` = `wood`, inventory unchanged; `sell_planks` → second `Markt öffnen` → `planks`, completion unchanged.

---

## J. Production certification

**NOT RUN (runtime click)** — mid-progress fixture has `produce_planks` complete; **automated** `resolve-tutorial-step-navigation.test.ts` covers 0/1/many sawmill rule (`sawmillCount: 1` recorded in summary).

---

## K. Company certification

**PASS** — `earn_profit` → `Meilensteine anzeigen` → `#pg-milestones-widget-title` in view; completion unchanged. Contract/tax CTAs not runtime-clicked (both complete on mid fixture); **earn_profit** satisfies “at least one” Company informational path.

---

## L. Completion non-mutation proof

**PASS** — `build_sawmill`, `buy_wood`, `sell_planks`, `earn_profit` completion flags unchanged immediately after navigation (see JSON summary).

---

## M. Gameplay non-mutation proof

**PASS** — building count unchanged (build CTA); wood inventory unchanged (market CTA); no production job assertion path on skipped produce click.

---

## N. Narrow ~480×900 certification

**PASS** — tutorial CTA visible, no horizontal overflow on `.pg-tutorial-panel`, Buildings + sawmill row, no auto-PDM, building count unchanged.

---

## O. Evidence inventory

| File | Current? |
|------|----------|
| `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_TUTORIAL_CTA_BUILDINGS.png` | Yes |
| `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_BUILDINGS_CATALOG_FOCUS.png` | Yes |
| `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_NARROW_480x900_TUTORIAL_CTA.png` | Yes |
| `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_NARROW_480x900_BUILDINGS_DESTINATION.png` | Yes |
| `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_MARKET_WOOD_CONTEXT.png` | Yes |
| `docs/architecture/reviews/evidence/PGD-TUTORIAL-001_DESKTOP_COMPANY_MILESTONES.png` | Yes |
| `docs/architecture/reviews/evidence/pgd-tutorial-001-runtime-evidence-run-summary.json` | Yes |

---

## P. Automated tests / quality gates

**Implementation gates (prior run, source unchanged this delta):** typecheck PASS; lint 0 errors / 144 warnings; **1105** tests PASS; `pnpm --filter @project-genesis/web build` PASS.

**Evidence run:** `node tools/capture-pgd-tutorial-001-runtime-evidence.mjs` → exit **0**, `overallResult: PASS`.

---

## Q. Source-change disposition

> **IMPLEMENTATION SOURCE UNCHANGED DURING RUNTIME EVIDENCE COMPLETION**

Only evidence tooling, fixtures, screenshots, JSON, and documentation changed in this gate delta.

---

## R. Scope / sealed-track integrity

PDM, BVI, Save, API, gameplay, Scenario-B — unchanged. No new art.

---

## S. Commit readiness

Ready for **one isolated commit** when authorized (implementation + evidence + reports). No commit performed.

---

## T. Final decision

> **PGD-TUTORIAL-001 RUNTIME EVIDENCE GATE:** `PASS`  
> **CLOSE CANDIDATE:** updated — `POST_V1_PGD_TUTORIAL_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md`  
> **NEXT STEP:** independent ChatGPT final review  
> **COMMIT / PUSH / TAG:** `NONE`
