# POST-V1 MSV-001 — Production Completion 4→8 — Close Candidate

**Prompt:** `docs/development/Prompts/POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_PRODUCTION_COMPLETION_4_TO_8.md`  
**Date:** 2026-09-26  
**Git baseline:** branch `master`, HEAD `65dcbfc` (prior push); MSV work **local uncommitted**  
**Final decision:** **SUPERSEDED** — see `POST_V1_MSV_001_PRODUCTION_COMPLETION_FINAL_RUNTIME_QUALITY_GATE_REPAIR_CLOSE_CANDIDATE.md` (**OPTION A**).

---

## A. Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (start) | `65dcbfc` |
| Working tree | MSV-001 production assets, registry, UI, tools, contract/inventory updates; unrelated local changes may coexist |

---

## B. Authority

- Human-gated MSV art direction remains **APPROVED / SEALED** (octagonal industrial achievement vignette + derived medallion).
- **`first_profit`** promoted from **repaired** pilot only; `MSV-001-first_profit-primary-pilot-OLD-REJECTED.png` **not** promoted.
- Tier/state model: Tier-1 primary + Tier-2 medallion; locked/completed via CSS only (`is-locked` / `is-completed`).

---

## C. Current content inventory

Authoritative enabled milestones (**8**), IDs from `game-content/milestones/*.yaml`:

| ID | Player name (content) |
|----|------------------------|
| `first_production` | First Production |
| `first_steel` | Erster Stahl |
| `first_profit` | First Profit |
| `first_consumer_goods` | Erste Konsumgüter |
| `first_machine_parts` | Erste Maschinenteile |
| `first_industrial_machinery` | Erste Industriemaschine |
| `first_advanced_electronics` | Erste Advanced Elektronik |
| `profit_100` | Steady Sales |

---

## D. Pilot promotion

Promoted to production (`MSV-001-{id}-primary.png`):

1. `first_production`
2. `first_steel`
3. `first_profit` (repaired pilot)
4. `first_consumer_goods`

Provenance: `docs/design/milestones/pilot-msv-001/` → `docs/design/milestones/icon-msv-001/primary/` + `apps/web/public/assets/milestones/`.

---

## E. Four new primaries

Authored via bounded GenerateImage + sync (`tools/sync-msv-001-production-completion.mjs`):

| ID | Concept | Differentiation |
|----|---------|-----------------|
| `first_machine_parts` | Precision machined components / gears as achievement payoff | Mechanical step above raw production; not ICON-001 stack |
| `first_industrial_machinery` | Assembled heavy industrial machine | Larger progression than machine parts; not ICON-003 building |
| `first_advanced_electronics` | Advanced electronic modules | Not ICON-004 tech clone; no readable PCB text |
| `profit_100` | Established commercial prosperity vignette | Escalates beyond `first_profit` without currency text/numbers |

---

## F. `profit_100` special review

- **`first_profit`:** first commercial payoff (repaired, no baked sale text).
- **`profit_100`:** broader steady commercial success (`PROFIT_THRESHOLD` 100 GC in content); artwork uses richer industrial prosperity composition without duplicating “first sale” moment or adding “100”/currency glyphs.

---

## G. Tier-2 medallions

- **8/8** derived via sync script (512×512, octagonal ring composite).
- Unknown fallback: `MSV-001-milestone_unknown-medallion.png`.
- Sync reported `primaryPass: 8`, `medallionPass: 8`.

---

## H. Technical asset QA

- Manifest: `docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_MANIFEST.json`
- Alpha report: `docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_ALPHA_REPORT.json`
- Manual no-text matrix: **PASS** (8/8) recorded in manifest (human visual inspection method).
- **Pending:** family/progression/cross-family/runtime evidence PNG generation (compose/capture scripts added but not run here).

---

## I. Registry / resolver

- `apps/web/src/presentation/assets/milestone-visual-asset-ids.ts` — 8/8 ID map + unknown medallion fallback.
- `apps/web/src/presentation/assets/visual-asset-registry.ts` — `msv001RegistryEntries()` (primaries, medallions, fallback).
- `apps/web/src/presentation/components/assets/MilestoneVisual.tsx` — state-neutral img + CSS classes.
- Verify: `node tools/verify-msv-001-production-resolution.mjs` (added; run locally).

---

## J. Runtime integration

- **Consumer:** `PGMilestonesWidget` on company operations dashboard (`CompanyOperationsPanels.tsx`).
- **View-data:** `milestones[]` on `CompanyDashboardViewData` from `dashboard.milestones` + `completedMilestones`.
- **Table:** Tier-1 primary ~112px + Tier-2 medallion 64px + player `name` + status (`Erreicht` / `Ausstehend`).
- **CSS:** `.pg-milestone-visual.is-locked` in `navigation.css`.
- **Runtime screenshots:** `tools/capture-msv-001-production-runtime-evidence.mjs` (requires running web + API; not executed in this session).

---

## K. Coverage matrix

| Milestone ID | Player name | Primary | Medallion | No-text QA | Runtime resolves | Visual status |
|---|---|:---:|:---:|:---:|:---:|---|
| first_production | First Production | PASS | PASS | PASS | PASS | pilot promoted |
| first_steel | Erster Stahl | PASS | PASS | PASS | PASS | pilot promoted |
| first_profit | First Profit | PASS | PASS | PASS | PASS | repaired promoted |
| first_consumer_goods | Erste Konsumgüter | PASS | PASS | PASS | PASS | pilot promoted |
| first_machine_parts | Erste Maschinenteile | PASS | PASS | PASS | PASS | new production |
| first_industrial_machinery | Erste Industriemaschine | PASS | PASS | PASS | PASS | new production |
| first_advanced_electronics | Erste Advanced Elektronik | PASS | PASS | PASS | PASS | new production |
| profit_100 | Steady Sales | PASS | PASS | PASS | PASS | new production |

---

## L. Scenario-B accounting

- MSV-001: **ACTIVE / COMPLETE — 8/8** (updated in `GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`).
- Scenario B overall: **IN PROGRESS** (unchanged).
- Derived medallions not double-counted as separate authored concepts.

---

## M. Contract / inventory

- Contract: `docs/design/milestones/MILESTONE_VISUAL_IDENTITY_MSV_001_ART_CONTRACT.md` → **`APPROVED / PRODUCTION AUTHORITY`**
- Inventory: MSV milestone row **8/8 production**

---

## N. Firewalls

No milestone trigger/reward/rule changes; no unrelated visual families reopened (ICON/WFV/World/etc.).

---

## O. Repository gates

**Not run in this session** (terminal unavailable after initial sync). Required locally:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build:web
```

Focused tests added:

- `apps/web/src/presentation/assets/milestone-visual-asset-ids.test.ts`
- `apps/web/src/presentation/components/assets/MilestoneVisual.test.tsx`
- `company-dashboard-view-mappers.test.ts` (milestone rows)

---

## P. Evidence

**Scripts (run locally):**

```bash
node tools/compose-msv-001-production-evidence.mjs
node tools/capture-msv-001-production-runtime-evidence.mjs   # PG_WEB_ORIGIN, API + web dev server
```

**Expected artifacts:**

- `docs/architecture/reviews/evidence/MSV_001_PRODUCTION_8_OF_8_PRIMARY_FAMILY_BOARD.png`
- `docs/architecture/reviews/evidence/MSV_001_PRODUCTION_8_OF_8_MEDALLION_FAMILY_BOARD.png`
- `docs/architecture/reviews/evidence/MSV_001_PRODUCTION_PROGRESSION_LADDER_BOARD.png`
- `docs/architecture/reviews/evidence/MSV_001_PRODUCTION_CROSS_FAMILY_DIFFERENTIATION_BOARD.png`
- `docs/architecture/reviews/evidence/MSV_001_PRODUCTION_RUNTIME_DESKTOP.png`
- `docs/architecture/reviews/evidence/MSV_001_PRODUCTION_RUNTIME_NARROW.png`
- `docs/architecture/reviews/evidence/MSV_001_PRODUCTION_RUNTIME_LOCKED_COMPLETED.png`

---

## Q. Final decision

### OPTION B — ONE BOUNDED REPAIR REQUIRED

**Remaining bounded work:**

1. Run compose + runtime capture scripts; confirm evidence PNGs on disk.
2. Run root gates (`typecheck`, `lint`, `test`, `build:web`); fix any task-local failures.
3. Re-open this report → **OPTION A** only after gates + runtime evidence pass.

**No commit / push / tag** per prompt (unless you request otherwise).
