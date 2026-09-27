# POST-V1 PGD-RES-001 — Player-Facing Resource Requirement Labels (Close Candidate)

**Task:** Replace raw resource IDs in player-facing Production missing-input copy with authoritative resource names.  
**Branch:** `master` @ `15836da78669329492501410e273a785c969d43c` (PGD-002-S1 committed/pushed on `origin/master`).  
**Outcome:** **OPTION A — PGD-RES-001 RUNTIME & GATE EVIDENCE COMPLETE** (implementation frozen; root lint **LINT-B** — see §M)

---

## A. Executive result

Raw resource IDs in Production hint copy (`Benötigt N× wood`) were replaced with authoritative names from `game-content/resources/*.yaml` via `player-facing-resource-label.ts` and `GameSessionDashboardBuilder.#readProductionHints`. **Real Production runtime** was certified at **1440×900** and **480×900** using a deterministic evidence fixture (on-site wood depleted; recipe semantics unchanged): visible blocker `Benötigt 10× Holz — am Markt kaufen (landet im Lager).` with **no** raw `wood` in scoped `.pg-operation-hint-copy`. **PGD-RES-001 task-owned lint:** PASS. **Root `pnpm lint`:** FAIL — **proven committed baseline defect** in sealed PGD-002-S1 evidence tool (`tools/build-pgd-002-s1-research-evidence-fixture.mjs`, `no-undef` on `console`). **No commit / push / tag.**

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (recorded) | `15836da78669329492501410e273a785c969d43c` |
| `origin/master` | Matches HEAD |
| PGD-RES-001 | Local WIP (implementation + evidence completion) |
| PGD-002-S1 introducing commit | `15836da` (includes `tools/build-pgd-002-s1-research-evidence-fixture.mjs`) |

**Unrelated WIP (excluded):** shell/simulation UI, BVI assets, doc deletes, dev pilots, local `apps/api/saves/*`, etc.

---

## C–J. (Implementation — unchanged from prior close pass)

Confirmed defect, 9 enabled resources, `ResourceTypeRegistry` authority, single `#readProductionHints` repair site, formatter tests + builder integration (`recipe_machine_parts` → `Benötigt 3× Stahl.`), **RES-A count = 0** in bounded family (re-audited post-runtime).

---

## K. Production runtime verification (evidence completion)

### Runtime health recovery

| Step | Action |
|------|--------|
| 1 | `pnpm dev:stop` (ports 3000/3001) |
| 2 | Removed `apps/web/.next` generated cache |
| 3 | Restarted `pnpm --filter @project-genesis/api --filter @project-genesis/web --parallel dev` |
| 4 | `npx playwright install chromium` in `tools/capture-evidence-tmp` (browser binary missing on first attempt) |
| 5 | `node tools/build-pgd-res-001-resource-label-evidence-fixture.mjs` |
| 6 | `node tools/capture-pgd-res-001-resource-labels-runtime-evidence.mjs` |

**Root cause of prior failure:** capture loaded session **after** navigating to `/game` via in-page `fetch`, so the client hydrated empty state before server load; PGD-002 pattern (**`page.request.post` load, then `goto` production**) plus `waitForActiveWorkspace` fixes binding. Not a formatter defect.

### State source

| Item | Value |
|------|--------|
| Fixture builder | `tools/build-pgd-res-001-resource-label-evidence-fixture.mjs` |
| Fixture save | `tools/evidence-fixtures/pgd-res-001-production-resource-label.json` |
| Patch | `company_001` inventory `wood`: `quantity=0`, `reserved=0` only (from `saves/e2e-m11-phase6-production-closeout.json`) |
| Active building | `building_005` sawmill `ACTIVE` (unchanged) |

No recipe YAML, resource definitions, or amounts in content were edited.

### Certified case

| Field | Value |
|-------|--------|
| Recipe ID | `recipe_planks` |
| Recipe name | `Bretter herstellen` |
| Resource ID | `wood` |
| Authoritative name | `Holz` |
| Missing amount | `10` |
| Visible reason (scoped) | `Benötigt 10× Holz — am Markt kaufen (landet im Lager).` |
| Raw ID in scoped copy? | **NO** |

### Programmatic assertions (capture script)

- Production mounted (`heading` **Rezeptkatalog**)
- Active session (no **Keine aktive Session** / **Session wird geladen**)
- Scoped row: recipe name + `Benötigt 10× Holz` fragment
- Authoritative **Holz** present; amount **10** present; raw **`wood`** absent from `.pg-operation-hint-copy` only

### Desktop (~1440×900)

| Item | Value |
|------|--------|
| Result | **PASS** |
| Evidence | `docs/architecture/reviews/evidence/PGD_RES_001_PRODUCTION_RESOURCE_REQUIREMENT_DESKTOP_1440x900.png` |

### Narrow (~480×900)

| Item | Value |
|------|--------|
| Result | **PASS** (blocker readable; no destructive clip observed on certified row) |
| Evidence | `docs/architecture/reviews/evidence/PGD_RES_001_PRODUCTION_RESOURCE_REQUIREMENT_NARROW_480x900.png` |
| Long-label note | Certified case uses short label **Holz**; no additional legitimate runtime state was used for **Advanced Elektronik**-length copy in this pass |

### Gameplay integrity

Evidence flow used **load + navigation + screenshot only**; no Starten, market, transport, research, or build commands executed.

---

## L. Focused tests (reconfirmed)

| Command | Result |
|---------|--------|
| `pnpm exec vitest run src/application/facade/player-facing-resource-label.test.ts` | **PASS** (3) |
| `pnpm exec vitest run src/application/facade/GameSessionDashboardBuilder.test.ts` | **PASS** (10) |
| PGD-001 / PGD-TECH-001 formatter tests | **PASS** (regression) |

---

## M. Root quality gates

| Gate | Current (WIP tree) | Clean baseline `15836da` worktree | PGD-RES-001 ownership | Classification |
|------|----------------------|-----------------------------------|------------------------|----------------|
| `pnpm typecheck` | **PASS** | (not re-run) | Task-owned TS | — |
| `pnpm test` | **PASS** (280 / 1052) | (not re-run) | Includes new tests | — |
| `pnpm build:web` | **PASS** | (not re-run) | — | — |
| `pnpm lint` | **FAIL** | **FAIL** | Task-owned files **PASS** (`eslint` on formatter, builder, tests, RES capture + fixture builders) | **LINT-B** |

### Lint investigation (`tools/build-pgd-002-s1-research-evidence-fixture.mjs`)

| Question | Answer |
|----------|--------|
| Tracked? | **Yes** |
| Introduced in | **`15836da`** (PGD-002-S1) |
| On `origin/master`? | **Yes** |
| Locally modified vs `15836da`? | **No** (`git diff` empty) |
| PGD-RES-001 modified it? | **No** |
| Rule | `@typescript-eslint/no-undef` — `'console' is not defined` (line 44) |
| Clean-baseline lint executed? | **Yes** — detached worktree `../pg-genesis-lint-baseline` @ `15836da`, `pnpm lint` → same **1 error** |
| Classification | **ROOT LINT BLOCKED BY PROVEN COMMITTED BASELINE DEFECT** (sealed PGD-002-S1 scope; **not repaired** in this task) |

---

## N. Diff ownership

| Bucket | Files |
|--------|--------|
| **Implementation (frozen before evidence pass)** | `player-facing-resource-label.ts`, `.test.ts`, `GameSessionDashboardBuilder.ts` (+ test) |
| **Evidence-completion delta** | `tools/build-pgd-res-001-resource-label-evidence-fixture.mjs`, updated `tools/capture-pgd-res-001-resource-labels-runtime-evidence.mjs`, PNGs under `docs/architecture/reviews/evidence/PGD_RES_001_PRODUCTION_*`, this report |
| **Generated fixture (local)** | `tools/evidence-fixtures/pgd-res-001-production-resource-label.json` (regenerate via builder; not canonical save) |
| **Production code changed during evidence task** | **NO** |

---

## O. Firewalls

PGD-001, PGD-TECH-001, PGD-002-S1, gameplay/save/API/art — **unchanged**. Scenario-B **paused**.

---

## P. Final decision — OPTION A

> **PRODUCTION RUNTIME:**  
> `PASS`

> **DESKTOP EVIDENCE:**  
> `PASS`

> **NARROW EVIDENCE:**  
> `PASS`

> **AUTHORITATIVE RESOURCE NAME:**  
> `VISIBLE` (`Holz`)

> **RAW RESOURCE ID IN SCOPED PLAYER COPY:**  
> `ABSENT`

> **MISSING AMOUNT:**  
> `UNCHANGED` (`10`)

> **SCOPED RES-A LEAKS:**  
> `0`

> **PRODUCTION IMPLEMENTATION CHANGED DURING EVIDENCE TASK:**  
> `NO`

> **PGD-RES-001 TASK-OWNED LINT:**  
> `PASS`

> **ROOT LINT:**  
> `FAIL — PROVEN COMMITTED BASELINE DEFECT OUTSIDE PGD-RES-001`

> **TYPECHECK / FULL TESTS / BUILD:WEB:**  
> `PASS`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## §31 Evidence inventory

| Evidence | Path | Exists? | Proves |
|----------|------|---------|--------|
| Desktop Production screenshot | `docs/architecture/reviews/evidence/PGD_RES_001_PRODUCTION_RESOURCE_REQUIREMENT_DESKTOP_1440x900.png` | Yes | Live Rezeptkatalog + scoped blocker with **Holz** |
| Narrow Production screenshot | `docs/architecture/reviews/evidence/PGD_RES_001_PRODUCTION_RESOURCE_REQUIREMENT_NARROW_480x900.png` | Yes | Narrow readability |
| Capture script | `tools/capture-pgd-res-001-resource-labels-runtime-evidence.mjs` | Yes | Session load order + scoped DOM assertions |
| Fixture builder | `tools/build-pgd-res-001-resource-label-evidence-fixture.mjs` | Yes | Deterministic missing-input state |
| Formatter tests | `player-facing-resource-label.test.ts` | Yes | All 9 resources + fallback |
| Builder test | `GameSessionDashboardBuilder.test.ts` | Yes | `Benötigt 3× Stahl.` integration |
| Baseline lint proof | Git worktree @ `15836da` | Yes | PGD-002-S1 tool `no-undef` on committed baseline |

---

## §32–34 Runtime / lint / closure Q&A (summary)

1–11: Active workspace **yes** after fix; Production + Rezeptkatalog **yes**; certified **`recipe_planks` / `wood` / Holz / 10**; scoped raw ID **absent**; no gameplay commands **yes**.  
12–16: Desktop + narrow captured **yes**; overflow **none observed**; RES-A **0**.  
18–30: Lint file **`build-pgd-002-s1-research-evidence-fixture.mjs`**, rule **`no-undef`**, commit **`15836da`**, PGD-RES-001 did **not** modify it; baseline lint **executed and FAIL**; classification **LINT-B**; task-owned lint **PASS**; root lint **FAIL** (not mislabeled).  
31–50: No production semantic changes during evidence task; sealed slices unchanged; gates as §M; closure-ready **yes** pending reviewer policy on root lint debt.

---

## §60 Required resource table

| Internal ID | Authoritative player-facing name | Source file | Enabled? | Can appear in recipe inputs? | Semantic resolution verified? |
|-------------|----------------------------------|-------------|----------|------------------------------|------------------------------|
| `advanced_electronics` | Advanced Elektronik | `advanced_electronics.yaml` | Yes | Yes | Yes |
| `consumer_goods` | Konsumgüter | `consumer_goods.yaml` | Yes | Yes | Yes |
| `industrial_machinery` | Industriemaschinen | `industrial_machinery.yaml` | Yes | Yes | Yes |
| `iron_ore` | Eisenerz | `iron_ore.yaml` | Yes | Yes | Yes |
| `machine_parts` | Maschinenteile | `machine_parts.yaml` | Yes | Yes | Yes |
| `planks` | Bretter | `planks.yaml` | Yes | Yes | Yes |
| `steel` | Stahl | `steel.yaml` | Yes | Yes | Yes (builder spot check) |
| `stone` | Stein | `stone.yaml` | Yes | Yes | Yes |
| `wood` | Holz | `wood.yaml` | Yes | Yes | Yes (runtime + formatter) |
