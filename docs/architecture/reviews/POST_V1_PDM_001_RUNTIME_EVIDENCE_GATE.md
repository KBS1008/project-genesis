# POST-V1 PDM-001 — Direct Map Building Placement Runtime Evidence Gate

**Mode:** Runtime certification / evidence gate (completion pass)  
**Date:** 2026-10-04  
**Authority:** `docs/development/Prompts/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md`, Product / UX Contract, Bounded Implementation Close Candidate  
**Report required before prior gate:** **No** — this file did not exist until this completion pass.

---

## A. Executive result

**PASS — PDM-001 RUNTIME CERTIFIED / READY FOR FINAL CLOSURE REVIEW**

Automated Playwright capture against the live dev stack (`pnpm dev`, `http://127.0.0.1:3000`) passed for desktop **1440×900**, narrow **480×900**, and desktop cancel. Screenshots were inspected; machine assertions and `pdm001-runtime-evidence-run-summary.json` match the sealed PDM contract.

One bounded **production** fix was required during the initial runtime gate (placement session cleared on Buildings→World entry); it is covered by provider lifecycle integration tests and is documented in section V.

---

## B. Authority / reviewed inputs

| Document | Role |
|----------|------|
| `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md` | Process |
| `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md` | UX authority |
| `docs/architecture/reviews/POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md` | Coordinate authority |
| `docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md` | Implementation + lifecycle delta |
| `docs/development/Prompts/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md` | Runtime gate checklist |

---

## C. Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `500a00a086fa083c1bca461ccbe87b1f23f9b675` |
| HEAD subject | WORKFORCE-NAV-001: navigate from STALLED_WORKFORCE to Personal focus. |
| `origin/master` | Same SHA |
| HEAD = origin | Yes |
| PDM implementation | Local / uncommitted (full PDM slice + runtime fix) |
| Unrelated WIP | Extensive (docs moves, pilots, saves, assets, etc.) — untouched |

---

## D. Runtime environment

| Item | Value |
|------|--------|
| Application start | `pnpm dev:restart` (after stale `.next` dev corruption); standard monorepo `pnpm dev` |
| Web origin | `http://127.0.0.1:3000` |
| API | Nest dev on default API port (via `pnpm dev` parallel) |
| Capture browser | Playwright Chromium, **headless** |
| Final capture command | `node tools/capture-pdm-001-runtime-evidence.mjs` |
| Final capture exit | **0** |
| Final capture window | ~30s (2026-10-04T18:05:48Z–18:06:07Z UTC) |

---

## E. Fixture / deterministic state

| Item | Value |
|------|--------|
| Fixture builder | `tools/build-pdm-001-placement-evidence-fixture.mjs` |
| Source save | `saves/e2e-m11-phase6-production-closeout.json` |
| Target fixture | `tools/evidence-fixtures/pdm-001-map-placement.json` |
| Deterministic | Yes — byte copy of established closeout save |
| Session load | `POST /api/session/load` with `filePath` to target fixture |
| Prerequisites / cash | Legitimate closeout state (~93k cash; placeable catalog entries) |
| Building type | `sawmill` |
| Desktop name | `PDM Desktop Sägewerk` |
| Narrow name | `PDM Narrow Sägewerk` |
| Cancel name | `PDM Cancel Sägewerk` |

No manual save editing for PASS.

---

## F. Evidence harness

| Item | Value |
|------|--------|
| Capture script | `tools/capture-pdm-001-runtime-evidence.mjs` |
| Fixture builder | `tools/build-pdm-001-placement-evidence-fixture.mjs` |
| Status | **New** (PDM task-owned evidence tooling) |
| Assertions | API building counts, domain x/y equality, preview/final SVG anchor (±2px), pan/zoom candidate label stability, absence of X/Y labels |
| Summary artifact | `docs/architecture/reviews/evidence/pdm001-runtime-evidence-run-summary.json` |

---

## G. Desktop Buildings entry

**PASS** — `pdm001-desktop-buildings-entry.png` (1440×900): Baukatalog, Gebäudename, **Position auf Karte wählen**; no X-Position / Y-Position fields.

---

## H. Desktop World transition

**PASS** — After map entry, URL contains `screen=world`; `pdm001-desktop-world-placement-mode.png` shows placement bar (building name, instruction, Abbrechen / Gebäude platzieren).

---

## I. Desktop candidate / preview

**PASS** — Pick at map tap; `pdm001-desktop-preview.png` shows placement mode, **Gewählte Position: 19, 13**, dashed preview marker on map.

---

## J. No mutation before confirm

**PASS** — Harness: `buildingCountBefore` 5, unchanged after pick; `PDM Desktop Sägewerk` absent in API list before confirm (desktop run in summary JSON).

---

## K. Desktop confirm / success

**PASS** — Explicit **Gebäude platzieren**; placement mode detached; URL remains `screen=world`; exactly one new building (count 5→6); `pdm001-desktop-confirmed.png`.

---

## L. Preview → final continuity

**PASS (desktop)** — Summary: preview anchor (23, 17), final anchor (23, 17), delta **0**; tolerance **2px** on SVG marker anchor math.

---

## M. Pan stability

**PASS** — Intentional drag on viewport; candidate label unchanged before/after pan; no confirm invoked.

---

## N. Zoom stability

**PASS** — Two **Hineinzoomen** clicks; candidate domain label unchanged; confirm still succeeds afterward.

---

## O. Cancel

**PASS** — `pdm001-desktop-cancel-preview.png`, `pdm001-desktop-cancel-cancelled.png`: **Abbrechen** → Baukatalog; count 5→5; `PDM Cancel Sägewerk` absent; picked domain (17, 11) never persisted.

---

## P. No-pick

**N/A — BELOW-ORIGIN NO-PICK NOT NATURALLY RUNTIME-REACHABLE**

Normal **Welt einpassen** camera does not expose a practical below-origin pick in the default region UI. Authoritative contract evidence: `company-building-placement-coordinates.test.ts` (negative unprojection → no-pick).

---

## Q. Positive outside-art / no presentation cap

**PASS (via runtime candidate positions)**

Desktop picked **(19, 13)** and narrow **(23, 15)** — positive domain coordinates beyond the painted default-region cell footprint; not rejected by adapter or command. Supplementary: `company-building-placement-coordinates.test.ts` high-coordinate round-trip.

---

## R. Command rejection

**N/A — NO SAFE DETERMINISTIC RUNTIME REJECTION FIXTURE**

No existing save/fixture produces authoritative rejection without inventing rules. Provider integration: `building-map-placement-lifecycle.integration.test.ts` (rejection retains session + candidate).

---

## S. Narrow 480×900

**PASS** — Full flow; artifacts `pdm001-narrow-*.png`; preview and confirm/cancel controls reachable; no X/Y fallback; picked **(23, 15)** = placed **(23, 15)**; preview/final anchor delta **0**.

---

## T. Gameplay / Save / API integrity

**UNCHANGED** — Evidence uses normal UI + `POST /api/buildings/place` path via confirm only. No save schema, API shape, or placement rule changes for evidence.

---

## U. Evidence artifacts

See manifest below. All under `docs/architecture/reviews/evidence/`.

---

## V. Code changes during runtime gate

### Production (initial runtime gate — bounded defect)

| File | Change |
|------|--------|
| `apps/web/src/presentation/state/GameWorkspaceProvider.tsx` | Clear placement session only when **leaving** World (`previousScreen === 'world'`), not when session exists while URL still on Buildings during Buildings→World entry |

### Tests

| File | Change |
|------|--------|
| `apps/web/src/presentation/state/building-map-placement-lifecycle.integration.test.tsx` | Provider lifecycle suite (+ session retained after map entry) |

### Evidence tooling (this completion pass)

| File | Change |
|------|--------|
| `tools/build-pdm-001-placement-evidence-fixture.mjs` | New |
| `tools/capture-pdm-001-runtime-evidence.mjs` | New; summary JSON output |
| `tools/evidence-fixtures/pdm-001-map-placement.json` | Generated |
| `docs/architecture/reviews/evidence/pdm001-*.png` | Captured |
| `docs/architecture/reviews/evidence/pdm001-runtime-evidence-run-summary.json` | Captured |

### Markdown

| File | Change |
|------|--------|
| `docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md` | **This report (created)** |

---

## W. Tests / root gates

Rerun after production + lifecycle changes:

| Gate | Result |
|------|--------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS — **0 errors**, **144 warnings** (pre-existing) |
| `pnpm test` | PASS — **290** files, **1096** tests |
| `pnpm build:web` | PASS |

---

## X. Remaining observations

- Dev `.next` cache can corrupt after `build:web` while `pnpm dev` is running; **`pnpm dev:restart`** required before re-capture (observed during completion pass).
- No dedicated runtime rejection or below-origin no-pick scenarios (authorized N/A).
- World visual quality out of scope (per gate).

---

## Y. Final runtime decision

**PDM-001 RUNTIME EVIDENCE GATE: PASS**

**PDM-001: READY FOR INDEPENDENT FINAL CLOSURE REVIEW**

**Commit / push / tag: NONE**

---

## Required runtime evidence table

| Runtime invariant | Desktop | Narrow | Evidence | Result |
|---|---|---|---|---|
| Buildings entry visible | PASS | PASS | `pdm001-*-buildings-entry.png` | PASS |
| No raw X/Y required | PASS | PASS | Harness label check + screenshots | PASS |
| Auto transition to World | PASS | PASS | URL + world-placement-mode PNG | PASS |
| Placement mode visible | PASS | PASS | world-placement-mode PNG | PASS |
| Candidate selectable | PASS | PASS | preview PNG + summary | PASS |
| Preview visible | PASS | PASS | preview PNG | PASS |
| No mutation before confirm | PASS | PASS | API count + name check | PASS |
| Explicit confirm works | PASS | PASS | confirmed PNG + summary | PASS |
| Success remains World | PASS | PASS | URL assertion | PASS |
| Exactly one building created | PASS | PASS | count 5→6 per run | PASS |
| Candidate Position = placed Position | PASS | PASS | summary JSON | PASS |
| Preview→final continuity | PASS | PASS | summary anchor delta 0 | PASS |
| Pan usable | PASS | PASS | harness pan step | PASS |
| Pan does not place | PASS | PASS | count + label stable | PASS |
| Zoom coherent | PASS | PASS | zoom + confirm | PASS |
| Candidate semantics stable | PASS | PASS | label after pan/zoom | PASS |
| Cancel reachable | PASS | n/a | cancel PNG | PASS |
| Cancel creates no building | PASS | n/a | count 5→5 | PASS |
| Session clears on cancel | PASS | n/a | Baukatalog visible | PASS |
| No-pick semantics | N/A | N/A | adapter tests | N/A |
| Positive outside-art not capped | PASS | PASS | domain 19,13 / 23,15 | PASS |
| Command rejection lifecycle | N/A | N/A | integration test | N/A |

---

## Screenshot / artifact manifest

| Artifact | Viewport | State | Proves |
|---|---|---|---|
| `docs/architecture/reviews/evidence/pdm001-desktop-buildings-entry.png` | 1440×900 | Buildings | Map entry path, no X/Y |
| `docs/architecture/reviews/evidence/pdm001-desktop-world-placement-mode.png` | 1440×900 | World | Auto transition, placement chrome |
| `docs/architecture/reviews/evidence/pdm001-desktop-preview.png` | 1440×900 | Pre-confirm | Candidate + preview |
| `docs/architecture/reviews/evidence/pdm001-desktop-confirmed.png` | 1440×900 | Post-confirm | Success on World, marker |
| `docs/architecture/reviews/evidence/pdm001-narrow-buildings-entry.png` | 480×900 | Buildings | Narrow entry |
| `docs/architecture/reviews/evidence/pdm001-narrow-world-placement-mode.png` | 480×900 | World | Narrow placement mode |
| `docs/architecture/reviews/evidence/pdm001-narrow-preview.png` | 480×900 | Pre-confirm | Narrow preview |
| `docs/architecture/reviews/evidence/pdm001-narrow-confirmed.png` | 480×900 | Post-confirm | Narrow confirm |
| `docs/architecture/reviews/evidence/pdm001-desktop-cancel-buildings-entry.png` | 1440×900 | Buildings | Cancel flow entry |
| `docs/architecture/reviews/evidence/pdm001-desktop-cancel-world-placement-mode.png` | 1440×900 | World | Cancel session |
| `docs/architecture/reviews/evidence/pdm001-desktop-cancel-preview.png` | 1440×900 | Pre-cancel | Preview before Abbrechen |
| `docs/architecture/reviews/evidence/pdm001-desktop-cancel-cancel-preview.png` | 1440×900 | Pre-cancel | Alternate cancel checkpoint |
| `docs/architecture/reviews/evidence/pdm001-desktop-cancel-cancelled.png` | 1440×900 | Post-cancel | Back on Buildings |
| `docs/architecture/reviews/evidence/pdm001-runtime-evidence-run-summary.json` | n/a | Machine | Domain + anchor assertions |

Screenshots manually inspected (desktop preview, narrow preview): placement bar, candidate text, preview marker, and controls consistent with assertions; no contradiction observed.

---

## Factual questions (selected answers)

| # | Answer |
|---|--------|
| 1–5 | `master`, `500a00a…`, WORKFORCE-NAV subject, origin aligned, yes |
| 6–7 | PDM local/uncommitted; extensive unrelated WIP |
| 8 | Required runtime report **did not exist** before this completion pass |
| 9–12 | Fixture builder + closeout source + `pdm-001-map-placement.json`; deterministic yes |
| 13–16 | `sawmill`; names as in section E |
| 17–20 | `pnpm dev` / restart; `http://127.0.0.1:3000`; `node tools/capture-pdm-001-runtime-evidence.mjs`; exit **0** |
| 21–23 | Desktop, narrow, cancel executed |
| 24–27 | No X/Y; map entry works; World transition; placement mode visible |
| 28–31 | Candidates + previews on desktop and narrow |
| 32–33 | Count stable before confirm; name absent before confirm |
| 34–36 | Pan/zoom preserve candidate label; pan does not place |
| 37–40 | Confirm success desktop + narrow; one building each; remain World |
| 41–46 | Desktop 19,13 = 19,13; narrow 23,15 = 23,15 |
| 47–49 | Anchor delta 0 both; tolerance 2px |
| 50–53 | Cancel tested; no building; count unchanged; Buildings screen |
| 54–55 | No-pick N/A; `company-building-placement-coordinates.test.ts` |
| 56–57 | Outside-art PASS at runtime; adapter test supplementary |
| 58–59 | Rejection N/A; `building-map-placement-lifecycle.integration.test.ts` |
| 60–62 | Production + test changed (session clear fix); evidence scripts changed |
| 63–65 | 13 PNG + summary JSON; inspected; no contradiction |
| 66–68 | Gates rerun; results in section W |
| 69–73 | No save/API/gameplay/region/Scenario-B changes |
| 74 | **No known PDM-local defect** |
| 75 | **Report exists:** `docs/architecture/reviews/POST_V1_PDM_001_RUNTIME_EVIDENCE_GATE.md` |
| 76 | **Ready for independent final closure review** |
| 77–79 | No commit, push, or tag |

---

## Continuity evidence (authoritative run summary)

| Run | Picked domain | Placed domain | Preview anchor | Final anchor | Delta |
|-----|---------------|---------------|----------------|--------------|-------|
| desktop | 19, 13 | 19, 13 | 23, 17 | 23, 17 | 0, 0 |
| narrow | 23, 15 | 23, 15 | 27, 19 | 27, 19 | 0, 0 |
| desktop-cancel | 17, 11 | (none) | 21, 15 | n/a | n/a |

Tolerance: **2px** on SVG marker anchor comparison (marker hit-box center).
