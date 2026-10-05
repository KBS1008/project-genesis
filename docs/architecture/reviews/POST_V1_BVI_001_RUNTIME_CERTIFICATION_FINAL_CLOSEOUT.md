# POST-V1 BVI-001 — Runtime Certification / Final Closeout

**Mode:** Runtime certification + final closeout (no commit / push / tag)  
**Date:** 2026-10-05  
**Authority:** `docs/development/Prompts/POST_V1_BVI_001_RUNTIME_CERTIFICATION_FINAL_CLOSEOUT.md`  
**Committed HEAD:** `824a477c68b85216ffd8213ba44474799615e4c8` (`PDM-001` on `origin/master`; BVI **local only**)

---

## A. Executive decision

**OPTION A — BVI-001 RUNTIME CERTIFIED / CLOSE READY**

Approved bytes were frozen, non-destructive **23/23** primary integrity **PASS**, desktop and narrow Buildings catalog runtime **PASS** with canonical evidence and machine WebP hash proof. Human-gate stale wording reconciled in §Q of the human-gate report. Promotion script was **not** re-run. No asset bytes changed during certification.

**Independent formal seal:** not claimed — **READY FOR INDEPENDENT FINAL CLOSURE REVIEW**.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (committed) | `824a477c68b85216ffd8213ba44474799615e4c8` |
| HEAD subject | `PDM-001: add direct map building placement.` |
| `origin/master` | Same SHA |
| BVI committed | **No** |
| BVI pushed | **No** |
| Promotion script run this task | **No** |
| New art generated | **No** |

---

## C. Authority chain

| Stage | Evidence | Status |
|---|---|---|
| BV-I6 diagnosis | Player-guidance reassessment | **PASS** |
| Human visual gate | `BVI-001-SOURCE_RECORD.json` + human-gate §Q | **PASS / RECONCILED** |
| Local promotion (prior) | Byte reconciliation report | **CLASS A** |
| 23/23 integrity | Non-destructive scan (this task) | **PASS** |
| Runtime certification | Playwright capture + summary JSON | **PASS** |
| Root gates | This task @ 2026-10-05 | **PASS** |
| Final closeout | This report | **READY FOR INDEPENDENT REVIEW** |

---

## D. Human-gate final disposition

| Item | Final state |
|---|---|
| Human visual decision | **PASS** |
| Approved candidate | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png` |
| Candidate SHA-256 | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` |
| Stale gate wording corrected | **YES** — `POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md` §Q added |
| SOURCE_RECORD modified | **NO** (frozen) |
| New human decision invented | **NO** |
| New artwork generated | **NO** |

---

## E. Approved candidate integrity

| Check | Result |
|---|---|
| Exists | **PASS** |
| Dimensions | 1024×1024 PNG |
| SHA-256 | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` |
| Authority match | **PASS** (SOURCE_RECORD) |

---

## F. Production primary integrity

| Check | Result |
|---|---|
| Path | `docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png` |
| SHA-256 | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` |
| Byte-identical to approved | **PASS** |
| HEAD (`origin`) primary | `bf7b0678…` (faulty) — **not** on remote until BVI commit |

---

## G. Runtime derivative integrity

| Asset | SHA-256 | Dimensions | Result |
|---|---|---|---|
| Runtime PNG mirror | `26f0136b…` | 1024×1024 | **PASS** (byte-identical to approved) |
| Runtime WebP | `99c9d8312dc6c4f034a7ebe62b4942dfe9407d531e8be89d39dccada5f0460cd` | 1024×1024 | **PASS** (matches SOURCE_RECORD after) |
| HEAD WebP | `e5668e60…` | — | Stale on committed baseline |

---

## H. Recycling firewall

| Asset | HEAD SHA-256 | Local SHA-256 | Result |
|---|---|---|---|
| `ICON-003-recycling_facility.webp` | `eb720d39…` | `eb720d39…` | **PASS / UNCHANGED** |
| Primary vs `rail_terminal` | `3a1801bc…` vs `26f0136b…` | — | **DISTINCT** |

---

## I. Runtime resolver

```
rail_terminal → BuildingTypeIcon (primary)
  → buildingTypeToIcon003PrimaryAssetId → ICON-003-rail_terminal
  → resolveVisualAssetUrl → /assets/buildings/ICON-003-rail_terminal.webp
```

Stale override: **none** identified. Registry/resolver source on HEAD: **unchanged**.

---

## J. 23/23 ICON-003 integrity

| Item | Value |
|---|---|
| What “23” means | Existing ICON-003 production primary building identities (`ALL_BUILDINGS` in promotion tooling) |
| Method | Read-only Node scan (no promotion script invocation) |
| Result | **23 / 23 PASS** — all primaries present, valid dimensions, **no SHA-256 collisions** |
| `rail_terminal` hash | `26f0136b…` |
| Other primaries changed by BVI | **No** |

---

## K. Desktop runtime certification

| Item | Value |
|---|---|
| Viewport | 1440×900 |
| Flow | Session load `saves/e2e-m11-phase6-production-closeout.json` → `/game?screen=buildings` → Bahnterminal |
| Artifact | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_DESKTOP_1440x900.png` |
| `railSrc` | `http://127.0.0.1:3000/assets/buildings/ICON-003-rail_terminal.webp` |
| Distinct from recycling | **YES** (`sameSrc: false`) |
| Rail semantics (visual) | **PASS** |
| Broken/fallback/stale | **Absent** |
| Result | **PASS** |

---

## L. Narrow runtime certification

| Item | Value |
|---|---|
| Viewport | 480×900 |
| Artifact | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_NARROW_480x900.png` |
| Bahnterminal reachable | **YES** |
| Semantics readable | **PASS** |
| Result | **PASS** |

---

## M. Canonical evidence manifest

| Artifact | Path |
|---|---|
| Desktop catalog | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_DESKTOP_1440x900.png` |
| Narrow catalog | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_NARROW_480x900.png` |
| Machine summary | `docs/architecture/reviews/evidence/bvi001-runtime-evidence-run-summary.json` |
| Historical copies | `docs/architecture/reviews/evidence/alte Grafiken/BVI-001_*.png` — **retained**, not deleted |

---

## N. Close-candidate reconciliation

`POST_V1_BVI_001_RAIL_TERMINAL_PRODUCTION_REPLACEMENT_RUNTIME_CERTIFICATION_CLOSE_CANDIDATE.md` updated for:

- HEAD `824a477`, BVI uncommitted state;
- canonical evidence paths and 2026-10-05 capture timestamp;
- human-gate §Q reference;
- root gate rerun results.

---

## O. Gameplay / Save / API / PDM / Scenario-B firewall

| Firewall | Result |
|---|---|
| Gameplay / building defs | **UNCHANGED** |
| Save | **UNCHANGED** |
| API | **UNCHANGED** |
| PDM-001 | **REMAINS SEALED** |
| Scenario-B | **REMAINS PAUSED** |

---

## P. Root gates

| Gate | Result |
|---|---|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** — **0 errors**, **144 warnings** |
| `pnpm test` | **PASS** — **290** files, **1096** tests |
| `pnpm build:web` | **PASS** |

---

## Q. Post-gate byte stability

| Asset | Pre-cert SHA-256 | Post-cert SHA-256 | Result |
|---|---|---|---|
| Approved candidate | `26f0136b…` | `26f0136b…` | **UNCHANGED** |
| Production primary | `26f0136b…` | `26f0136b…` | **UNCHANGED** |
| Runtime PNG | `26f0136b…` | `26f0136b…` | **UNCHANGED** |
| Runtime WebP | `99c9d831…` | `99c9d831…` | **UNCHANGED** |
| Recycling WebP | `eb720d39…` | `eb720d39…` | **UNCHANGED** |

BVI-owned changes this task: human-gate §Q, capture script (summary JSON + hash assert), close-candidate edits, this report, **new** canonical PNGs + summary JSON (evidence only).

---

## R. Final task-owned inventory (commit planning)

| Path | Category | Disposition |
|---|---|---|
| Production primary + runtime PNG/WebP | Production assets | **INCLUDE** |
| `ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json` | Manifest | **INCLUDE** |
| `bvi-001-rail-terminal-human-gate/**` | Human-gate | **INCLUDE** |
| `tools/bvi-001-*.mjs`, `tools/capture-bvi-001-*.mjs` | Tooling | **INCLUDE** |
| `docs/architecture/reviews/evidence/BVI-001_*`, `bvi001-runtime-evidence-run-summary.json` | Evidence | **INCLUDE** |
| Human-gate + close-candidate + reconciliation + this closeout | Reports | **INCLUDE** |
| `assets/ICON-003-rail_terminal-infra-pilot-source.png` | Unrelated pilot | **EXCLUDE** |
| `evidence/alte Grafiken/*` | Historical duplicate | **REVIEW BEFORE COMMIT** (optional) |

---

## S. Generated / historical artifact disposition

- Canonical runtime PNGs + JSON: **INCLUDE**
- `alte Grafiken` BVI copies: **REVIEW BEFORE COMMIT** — not required for correctness if canonical paths exist
- Faulty archive under human-gate evidence: **INCLUDE** (audit)

---

## T. Remaining observations

- Human-gate §P historical lines remain for chronology; §Q supersedes status for closure.
- `origin/master` still serves faulty `rail_terminal` art until isolated BVI commit.
- Playwright browsers installed under `tools/capture-evidence-tmp` for capture (environment setup, not product change).

---

## U. Commit readiness

| Item | Status |
|---|---|
| After independent PASS | **READY** for isolated BVI commit |
| Recommended subject | `BVI-001: correct rail terminal production artwork.` |
| Tag | **NOT REQUIRED** |
| Commit/push this task | **NONE** |

---

## V. Final decision

> **BVI-001 RUNTIME CERTIFICATION:** `PASS`  
> **IMPLEMENTATION STATE:** `CLASS A — ALREADY COMPLETE LOCALLY`  
> **HUMAN VISUAL GATE:** `PASS / RECONCILED`  
> **ICON-003 INTEGRITY:** `23 / 23 PASS`  
> **DESKTOP / NARROW:** `PASS`  
> **INDEPENDENT REVIEW READINESS:** `READY`  
> **KNOWN BVI-LOCAL DEFECTS:** `NONE`  
> **AUTHORITY AMBIGUITIES:** `NONE` (human-gate §P historical only)

---

## Integrity table (prompt §38)

| Integrity check | Result |
|---|---|
| Approved candidate exists | **PASS** |
| Candidate hash matches authority | **PASS** |
| Production primary byte-identical | **PASS** |
| Runtime PNG byte-identical | **PASS** |
| Runtime WebP matches SOURCE_RECORD | **PASS** |
| Recycling asset unchanged | **PASS** |
| Rail/recycling hashes distinct | **PASS** |
| 23 primaries present | **PASS** |
| 23 distinct (no collision) | **PASS** |
| Resolver → rail WebP | **PASS** |
| No stale override | **PASS** |
| Desktop runtime | **PASS** |
| Narrow runtime | **PASS** |

---

## Runtime evidence table (prompt §37)

| Viewport | Path | Bahnterminal visible | Correct asset | Rail semantics | Broken/fallback? | Result |
|---|---|---:|---:|---:|---:|---|
| 1440×900 | `…/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_DESKTOP_1440x900.png` | Yes | Yes | Pass | No | **PASS** |
| 480×900 | `…/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_NARROW_480x900.png` | Yes | Yes | Pass | No | **PASS** |

---

## Visual semantics table (prompt §37)

| Image | Rail-terminal semantics | Recycling ambiguity | Corruption | Result |
|---|---|---|---|---|
| Approved / local primary / WebP | Tracks, yard, gantry, containers | Low | None observed | **PASS** |
| HEAD faulty primary (git) | Processing/bales read | High | N/A | **FAIL (historical defect)** |

---

## Factual answers (prompt §45) — abbreviated

1–7. `master`, `824a477`, PDM subject, origin same, BVI local/uncommitted, not pushed, unrelated WIP present. 8–11. Modified assets + manifest; untracked human-gate tree, tools, reports, evidence. 12–18. BV-I6; `rail_terminal` / Bahnterminal; gate dir + docs; SOURCE_RECORD PASS; candidate `26f0136b…` 1024². 19–27. Primary/runtime hashes as §E–G; recycling unchanged `eb720d39…`; distinct from rail. 28–31. No promotion run; no asset byte changes in cert; no new/altered art. 32–36. Resolver §I; no override; 23/23 pass; fixture closeout save; 37–41. `pnpm dev:restart`, `127.0.0.1:3000`, Playwright headless. 42–54. Desktop/narrow pass; canonical paths; machine hash `99c9d831…` on served WebP path; distinct recycling; alte Grafiken not deleted. 55–61. Close candidate updated; uncommitted accurate. 62–69. Gates pass 0/144/290/1096. 70–71. No post-gate asset/tool change after gates (markdown/evidence only before gates). 73–77. Firewalls unchanged; Scenario-B paused. 78–85. Inventory §R; independent ready; subject recommended; no commit/push/tag.

---

Definition of done: certification prompt §49 satisfied; **OPTION A** issued.
