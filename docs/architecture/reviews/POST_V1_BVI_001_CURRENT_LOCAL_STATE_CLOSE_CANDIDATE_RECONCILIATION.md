# POST-V1 BVI-001 — Current Local State / Close-Candidate Reconciliation

**Mode:** Read-only / non-destructive reconciliation  
**Date:** 2026-10-05  
**Authority:** `docs/development/Prompts/POST_V1_BVI_001_CURRENT_LOCAL_STATE_CLOSE_CANDIDATE_RECONCILIATION.md`  
**Review HEAD:** `824a477c68b85216ffd8213ba44474799615e4c8` (`PDM-001: add direct map building placement.`)

---

## A. Executive decision

**OPTION A — CLASS A / IMPLEMENTATION ALREADY COMPLETE LOCALLY**

Local bytes show the human-gate candidate **already promoted** to the production primary, with runtime WebP/PNG derivatives matching the recorded post-promotion hashes. `origin/master` still ships the **old faulty** primary and WebP. No registry/resolver/gameplay changes are required. Remaining work is **certification / closeout / isolated commit** — not re-promotion or new art.

**Documentation tension:** `POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md` §P still states **human art decision NOT YET MADE** (pre-promotion evidence-repair snapshot). `BVI-001-SOURCE_RECORD.json` records **`humanVisualGate: PASS`** and full `productionPromotion` metadata consistent with current local bytes. Reconciliation treats **SOURCE_RECORD + byte identity** as authoritative for “approved candidate promoted”; the human-gate Markdown body is **stale** relative to SOURCE_RECORD and local promotion.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `824a477c68b85216ffd8213ba44474799615e4c8` |
| HEAD subject | `PDM-001: add direct map building placement.` |
| `origin/master` | Same SHA |
| HEAD = origin | **Yes** |
| BVI-001 committed | **No** — no commit message matches BVI in history |
| BVI-001 pushed | **No** |
| Staged (this task) | **None** |
| This reconciliation modified | **This report only** |

---

## C. BVI authority discovered

| Document / artifact | Path | Role |
|---|---|---|
| BV-I6 diagnosis | `docs/architecture/reviews/POST_V1_PLAYER_GUIDANCE_DIRECT_MANIPULATION_CURRENT_STATE_REASSESSMENT.md` | Original defect |
| Human gate (evidence + candidate) | `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md` | Gate package; §P evidence repair |
| Approved candidate + audit | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/` | Candidate bytes + SOURCE_RECORD |
| Close candidate (untracked) | `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_PRODUCTION_REPLACEMENT_RUNTIME_CERTIFICATION_CLOSE_CANDIDATE.md` | Claims promotion + runtime PASS |
| Materiality selection | `docs/architecture/reviews/POST_V1_NEXT_MATERIAL_WORKSTREAM_REVIEW_AFTER_PDM_001.md` | BVI-001 next workstream |
| Promotion tool | `tools/bvi-001-rail-terminal-production-promotion.mjs` | Copy + WebP + 23/23 scan |
| Human-gate evidence tool | `tools/bvi-001-rail-terminal-human-gate-evidence.mjs` | Non-production boards |
| Runtime capture tool | `tools/capture-bvi-001-rail-terminal-runtime-evidence.mjs` | Playwright catalog evidence |

---

## D. Historical BV-I6 defect

| Field | Value |
|---|---|
| Building ID | `rail_terminal` |
| Player name | **Bahnterminal** |
| Production primary | `docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png` |
| Runtime derivative | `apps/web/public/assets/buildings/ICON-003-rail_terminal.webp` (+ mirror PNG under `apps/web/public/assets/buildings/`) |
| Defect | Production primary **semantically reads as recycling/processing** (bales, sorting hall) rather than rail freight terminal — incorrect game information on Buildings catalog |
| Resolver | **Not defective** — wrong **master art** (BV-I6) |

---

## E. Human-gate approval

| Check | Result |
|---|---|
| Approved candidate path | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png` |
| Explicit PASS in SOURCE_RECORD | **Yes** — `"humanVisualGate": "PASS"` |
| Human-gate Markdown executive | **Stale** — still “READY FOR HUMAN GATE” / §P “NOT YET MADE” |
| Close candidate | Asserts human visual gate **PASS** |
| Ambiguity | **Resolved for promotion** by SOURCE_RECORD + promoted bytes matching `approvedCandidateSha256`; gate Markdown should be updated during closeout, not reinterpreted here |
| Multiple approved candidates | **No** — single candidate file with fixed hash in tooling |

---

## F. Approved candidate inventory

| Item | Value |
|---|---|
| File | `BVI-001-ICON-003-rail_terminal-candidate-primary.png` |
| Exists | **Yes** |
| Size | 1,034,111 bytes |
| SHA-256 | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` |
| Dimensions | **1024×1024** PNG (sharp metadata) |
| Supporting evidence | `evidence/*.png` boards, faulty archive, SOURCE_RECORD |

---

## G. Production primary state

| State | Path | SHA-256 | Size | Git |
|---|---|---|---|---|
| **Local working tree** | `docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png` | `26f0136b…` | 1,034,111 | **Modified** |
| **`origin/master` (HEAD)** | same path | `bf7b0678…` (faulty) | 1,884,363 | committed |
| vs approved candidate | — | **BYTE-IDENTICAL** | — | — |

**Primary promotion (local):** **YES**

---

## H. Runtime derivative state

| State | Path | SHA-256 | Size | Dimensions |
|---|---|---|---|---|
| **Local WebP** | `apps/web/public/assets/buildings/ICON-003-rail_terminal.webp` | `99c9d831…` | 103,178 | 1024×1024 |
| **Local PNG mirror** | `apps/web/public/assets/buildings/ICON-003-rail_terminal.png` | `26f0136b…` | 1,034,111 | (same as master PNG) |
| **HEAD WebP** | same | `e5668e60…` (stale) | 153,674 | — |
| SOURCE_RECORD `productionHashesAfter.rail_terminal_webp` | — | `99c9d831…` | — | matches local |

**Derivative regeneration (local):** **YES** — matches promotion script convention (sharp webp q=82).

**Recycling firewall:** `ICON-003-recycling_facility.webp` local SHA-256 `eb720d39…` = **HEAD** (unchanged).

---

## I. Runtime resolution path

```
rail_terminal (YAML / catalog entry)
  → BuildingsScreen BuildingTypeIcon(buildingTypeId, variant="primary")
  → buildingTypeToIcon003PrimaryAssetId('rail_terminal') → 'ICON-003-rail_terminal'
  → resolveVisualAssetUrl('ICON-003-rail_terminal')
  → apps/web/public/assets/buildings/ICON-003-rail_terminal.webp
```

No alternate consumer path found. Compact SVG unchanged per close-candidate claims.

**Buildings catalog with current worktree:** **YES** — would load **local** WebP (`99c9d831…`), not HEAD stale asset.

**Stale override risk:** **None** identified — single registry entry for `rail_terminal` primary.

---

## J. Hash / byte reconciliation

| Asset | Path | Git state | SHA-256 | Relationship |
|---|---|---|---|---|
| Approved candidate | `…/BVI-001-ICON-003-rail_terminal-candidate-primary.png` | Untracked tree | `26f0136b…` | **APPROVED SOURCE** |
| Local production primary | `…/primary/ICON-003-rail_terminal.png` | Modified | `26f0136b…` | **BYTE-IDENTICAL TO APPROVED** |
| HEAD production primary | same | Committed | `bf7b0678…` | **OLD FAULTY PRIMARY** |
| Local runtime WebP | `…/ICON-003-rail_terminal.webp` | Modified | `99c9d831…` | **DERIVED FROM APPROVED** (per pipeline) |
| HEAD runtime WebP | same | Committed | `e5668e60…` | **STALE DERIVATIVE** |
| Faulty archive | `…/BVI-001_FAULTY_PRODUCTION_MASTER_ARCHIVE.png` | Untracked | (archive of `bf7b0678…` subject) | **OLD FAULTY PRIMARY** |

---

## K. Image metadata

| Asset | Format | Dimensions | Notes |
|---|---|---|---|
| Approved / local primary | PNG | 1024×1024 | Alpha (per SOURCE_RECORD) |
| Local WebP | WebP | 1024×1024 | ICON-003 infrastructure convention |
| HEAD primary | PNG | (larger file; faulty art) | 1,884,363 bytes |

No pipeline dimension mismatch for local promoted set.

---

## L. Visual semantic inspection

| Image | Rail-terminal semantics | Recycling ambiguity | Result |
|---|---|---|---|
| Approved candidate | Tracks, yard ballast, gantry, intermodal containers | **Low** — rail-dominant | **PASS** |
| Local production primary | Same as candidate (byte-identical) | **Low** | **PASS** |
| Faulty archive / HEAD primary | Sorting hall, bale stacks, processing interior | **High** — reads as Recyclinganlage | **FAIL (defect)** |
| Local WebP (downscale) | Preserves rail-yard read at catalog scale | Distinct from recycling WebP | **PASS** |

---

## M. Promotion tooling

| Tool | Path | Behavior |
|---|---|---|
| Promotion | `tools/bvi-001-rail-terminal-production-promotion.mjs` | Verifies candidate hash → copy to production master → archive faulty → sharp WebP + PNG mirror → 23/23 scan → updates SOURCE_RECORD |
| Human-gate boards | `tools/bvi-001-rail-terminal-human-gate-evidence.mjs` | Non-production evidence only |

**Apparently already run:** **Yes** — local bytes match SOURCE_RECORD `productionHashesAfter` and script expected output hashes.

**Rerun would:** Overwrite production/WebP if old hashes no longer match (script guards on `EXPECTED_OLD_*`); **not executed** in this reconciliation.

---

## N. Existing close-candidate reconciliation

| Claim in close candidate | Actual local/Git truth |
|---|---|
| Promotion complete | **Matches** local primary = candidate |
| WebP regenerated | **Matches** `99c9d831…` |
| 23/23 scan PASS | **Plausible** — script embedded; not re-run here |
| Runtime desktop/narrow PNGs | **Exist** under `docs/architecture/reviews/evidence/alte Grafiken/` (untracked), **not** at paths cited in close candidate (`docs/architecture/reviews/evidence/BVI-001_*.png`) |
| Root gates PASS | Claimed at pre-PDM task time — **not revalidated** at `824a477` in this reconciliation |
| Commit/push | **False** — still uncommitted |

Close candidate **describes local asset bytes accurately**; **Git/evidence path claims** are **ahead of** or **misaligned with** canonical evidence location on disk.

---

## O. Existing runtime evidence

| Artifact | Location | Matches current local WebP? |
|---|---|---|
| Desktop catalog capture | `docs/architecture/reviews/evidence/alte Grafiken/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_DESKTOP_1440x900.png` | **Assumed** — captured after promotion per close candidate; **not byte-verified** to `99c9d831…` in this pass |
| Narrow capture | `…/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_NARROW_480x900.png` | Same |
| Canonical path in close candidate | `docs/architecture/reviews/evidence/BVI-001_*.png` | **Missing** (only `alte Grafiken` copies) |

**Runtime certification:** **Performed locally per close candidate** but **not authoritative on `origin/master`**; evidence may need **re-copy or re-capture** during formal closeout to match repository convention.

---

## P. ICON-003 integrity / 23-of-23 status

| Item | Value |
|---|---|
| Authority | `ICON_003_PRODUCTION_BUILDING_TYPE_IDS` / promotion script `ALL_BUILDINGS` (23 types) |
| Meaning | Existing ICON-003 **primary** set — not a new content quota |
| Local BVI impact | Replaces **one** primary; close candidate claims **no hash collisions** among 23 primaries |
| Re-scan this reconciliation | **Not run** |
| Other ICON-003 assets modified | **Only** `rail_terminal` production + runtime (+ manifest metadata) |

---

## Q. Local BVI task-owned inventory

| Path | Git state | BVI ownership | Purpose | Future commit disposition |
|---|---|---|---|---|
| `docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png` | M | **Definite** | Production primary | **INCLUDE** |
| `apps/web/public/assets/buildings/ICON-003-rail_terminal.webp` | M | **Definite** | Runtime WebP | **INCLUDE** |
| `apps/web/public/assets/buildings/ICON-003-rail_terminal.png` | M | **Definite** | Runtime PNG mirror | **INCLUDE** |
| `docs/design/buildings/production/infrastructure/ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json` | M | **Definite** | `bvi001Repair` provenance | **INCLUDE** |
| `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/**` | ?? | **Definite** | Candidate + evidence + SOURCE_RECORD | **INCLUDE** |
| `tools/bvi-001-rail-terminal-production-promotion.mjs` | ?? | **Definite** | Promotion | **INCLUDE** |
| `tools/bvi-001-rail-terminal-human-gate-evidence.mjs` | ?? | **Definite** | Human-gate boards | **INCLUDE** |
| `tools/capture-bvi-001-rail-terminal-runtime-evidence.mjs` | ?? | **Definite** | Runtime capture | **INCLUDE** |
| `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md` | tracked | **Definite** | Gate record | **REVIEW BEFORE COMMIT** (stale §P vs SOURCE_RECORD) |
| `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_PRODUCTION_REPLACEMENT_RUNTIME_CERTIFICATION_CLOSE_CANDIDATE.md` | ?? | **Definite** | Close candidate | **INCLUDE** |
| `docs/architecture/reviews/evidence/alte Grafiken/BVI-001_*.png` | ?? | **Probably** | Runtime/closeout mirrors | **INCLUDE** or move to `evidence/` per policy |
| `assets/ICON-003-rail_terminal-infra-pilot-source.png` | ?? | **Unrelated** | Pilot source | **EXCLUDE — UNRELATED** |

---

## R. Unrelated WIP firewall

Not classified as BVI: PDM (committed), doc mass deletes/moves, building pilots, API saves, unrelated `assets/*` pilots, PGD/BVI-unrelated gate docs, `ICON-003-rail_terminal` **unrelated** pilot PNG in `assets/`.

---

## S. Gameplay / Save / API / PDM / Scenario-B firewall

| Firewall | Result |
|---|---|
| Gameplay / save / API | **UNCHANGED** — no BVI changes in domain or API layers on local diff |
| PDM-001 | **REMAINS SEALED** — placement flow untouched |
| Scenario-B | **PAUSED** — single-asset integrity exception only |
| Registry / resolver | **UNCHANGED** in Git diff for `apps/web/src` |

**Replacement mode:** **`ASSET REPLACEMENT ONLY`** + manifest provenance + evidence/docs/tooling.

---

## T. Missing work, if any

| Required BVI step | Complete locally? | Evidence | Remaining action |
|---|---:|---|---|
| Human approval | **Yes** (SOURCE_RECORD) | `humanVisualGate: PASS` | Optional: align human-gate Markdown §P |
| Primary promotion | **Yes** | Byte match `26f0136b…` | Commit to `origin/master` |
| Runtime derivative | **Yes** | WebP `99c9d831…` | Same commit |
| Manifest provenance | **Yes** (local M) | `bvi001Repair` block | Same commit |
| 23/23 integrity scan | **Claimed** | Close candidate / script | Re-run at closeout if policy requires post-PDM HEAD |
| Buildings runtime certification | **Partial** | PNGs in `alte Grafiken/` | Formal closeout: verify paths + optional re-capture against `824a477`+BVI commit |
| Closeout report | **Draft exists** | Close candidate untracked | Final seal after certification |
| Root gates | **Not current** | PDM gates @ `824a477` | Re-run when committing BVI-owned assets/tools |
| Isolated commit/push | **No** | HEAD still faulty on remote | Owner commit |

---

## U. Implementation-vs-certification readiness

| Classification | **CLASS A — IMPLEMENTATION ALREADY COMPLETE LOCALLY** |
|---|---|
| Primary promoted? | **YES** |
| Derivative correct? | **YES** |
| Catalog would use corrected asset? | **YES** (local worktree) |
| New art required? | **NO** |
| Architecture decision? | **NO** |

**Runtime certification readiness:** **`RUNTIME READY`** — asset path and resolver are known; dev server + existing capture script can certify; evidence artifacts may need path normalization.

---

## V. Recommended next prompt

> **`BVI-001 RUNTIME CERTIFICATION / FINAL CLOSEOUT`**

Do **not** run another full promotion implementation slice unless certification discovers byte regression.

---

## W. Final decision

> **BVI-001 RECONCILIATION:**  
> `PASS`

> **CLASSIFICATION:**  
> `CLASS A — IMPLEMENTATION ALREADY COMPLETE LOCALLY`

> **HUMAN-GATE AUTHORITY:**  
> `VERIFIED` (SOURCE_RECORD + promoted bytes; human-gate Markdown partially stale)

> **APPROVED CANDIDATE:**  
> `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png`

> **PRODUCTION PRIMARY:**  
> `PROMOTED / VERIFIED` (local only)

> **RUNTIME DERIVATIVE:**  
> `CURRENT / VERIFIED` (local only)

> **BUILDINGS RUNTIME RESOLUTION:**  
> `CORRECTED ASSET` (when running from current worktree)

> **NEW ART REQUIRED:**  
> `NO`

> **GAMEPLAY / SAVE / API / PDM:**  
> `UNCHANGED`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **RUNTIME CERTIFICATION READINESS:**  
> `RUNTIME READY`

> **NEXT PROMPT:**  
> `BVI-001 RUNTIME CERTIFICATION / FINAL CLOSEOUT`

> **COMMIT / PUSH / TAG:**  
> `NONE`

---

## Authority table

| Authority | Exact path | What it establishes | Status |
|---|---|---|---|
| Human gate package | `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md` | BV-I6, candidate, evidence repair | **Present** (§P stale vs SOURCE_RECORD) |
| Approved candidate | `…/BVI-001-ICON-003-rail_terminal-candidate-primary.png` | Selected art bytes | **VERIFIED** |
| SOURCE_RECORD | `…/BVI-001-SOURCE_RECORD.json` | PASS + promotion hashes | **VERIFIED** |
| Production primary | `docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png` | Sealed master | **LOCAL PROMOTED** |
| Runtime derivative | `apps/web/public/assets/buildings/ICON-003-rail_terminal.webp` | UI consumption | **LOCAL UPDATED** |
| Resolver | `building-type-visual-asset-ids.ts` + `BuildingTypeIcon` | `ICON-003-rail_terminal` | **UNCHANGED / CORRECT** |
| Promotion script | `tools/bvi-001-rail-terminal-production-promotion.mjs` | Promotion semantics | **PRESENT** |
| Close candidate | `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_PRODUCTION_REPLACEMENT_RUNTIME_CERTIFICATION_CLOSE_CANDIDATE.md` | Intended PASS narrative | **Present** (untracked; evidence path drift) |
| Runtime evidence | `docs/architecture/reviews/evidence/alte Grafiken/BVI-001_*.png` | Catalog screenshots | **Present** (non-canonical path) |

---

## Factual answers (prompt §46)

1–5. `master`, `824a477…`, PDM subject, origin same, equal yes. 6–7. BVI not committed/pushed. 8. Modified: production primary, runtime webp/png, manifest. 9. Untracked: human-gate tree, BVI tools, close candidate, capture script, evidence copies in `alte Grafiken/`. 10. Extensive unrelated WIP (doc moves, pilots, saves, etc.). 11–13. BV-I6 semantic wrong master; `rail_terminal` / Bahnterminal. 14–17. Human-gate dir exists; gate doc exists; SOURCE_RECORD approves; candidate `BVI-001-ICON-003-rail_terminal-candidate-primary.png`; approval unambiguous via SOURCE_RECORD. 18–21. Candidate exists; SHA `26f0136b…`; 1024×1024. 22–26. Production path as above; HEAD primary `bf7b0678…`; local `26f0136b…`; differs yes; byte-identical to approved yes. 27. N/A. 28–33. WebP path as above; origin `e5668e60…`; local `99c9d831…`; differs yes; derived yes; 1024×1024. 34–36. Resolution path §I; local runtime yes; no stale override. 37–40. Candidate rail yes; local primary yes; derivative yes; old origin ambiguous recycling yes. 41–45. Tools exist; promotion apparently run; rerunning would overwrite if guards fail. 46–47. Close candidate exists; matches bytes; path/commit claims partial. 48–51. Runtime PNGs exist in `alte Grafiken/`; byte tie not re-verified; intended catalog Bahnterminal yes. 52–54. 23 = ICON-003 primaries; scan not re-run; only rail_terminal changed. 55–56. No other visual tracks. 57–61. No registry/gameplay/save/API/PDM changes. 62. BVI inventory §Q. 63. Human-gate MD status lines. 64. Unrelated WIP §R. 65–66. Promotion and derivative **yes** locally. 67. Runtime cert **partial** (artifacts non-canonical). 68. Close candidate **draft**. 69. Commit, formal cert paths, root gates, optional doc sync. 70–72. No new art/product/architecture. 73. **CLASS A**. 74. **RUNTIME READY**. 75. Certification/closeout prompt. 76. This report. 77–79. No prod/test/asset changes by reconciliation. 80. No art generated. 81–83. No commit/push/tag.

---

## Definition of done

Reconciliation complete per prompt §49; no destructive actions; no new art; single CLASS A outcome.
