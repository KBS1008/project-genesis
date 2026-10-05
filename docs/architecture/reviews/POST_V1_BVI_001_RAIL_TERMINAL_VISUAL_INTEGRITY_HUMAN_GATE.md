# POST-V1 BVI-001 — Rail Terminal Visual Integrity Human Gate

**Workstream:** BVI-001 (sealed ICON-003 integrity exception)  
**Date:** 2026-09-26  
**Mode:** Human-gated corrected primary candidate — **no production wiring**  
**Authority:** `docs/development/Prompts/POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md`  
**Prior diagnosis:** `docs/architecture/reviews/POST_V1_PLAYER_GUIDANCE_DIRECT_MANIPULATION_CURRENT_STATE_REASSESSMENT.md` (BV-I6)

---

## A. Executive result

One **non-production** corrected Bahnterminal primary candidate and review evidence are prepared for **human visual approval**. Sealed production assets, registry, resolver, runtime WebP, and application source are **unchanged**.

**Cursor does not approve the art.** Status: **READY FOR HUMAN GATE**.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (last commit) | `0415e74` — Show player-facing currency as dollar while keeping internal GC. |
| Unrelated working tree | Shell/simulation, ProductionScreen Zyklus tests, doc moves, player-guidance reassessment (untracked), pilots, saves — **not modified by BVI-001** |
| Commit / push / tag | **None** (per prompt) |

---

## C. Confirmed BV-I6 authority

Re-verified on current tree (no contradiction):

| Check | Result |
|-------|--------|
| `rail_terminal` → `ICON-003-rail_terminal` | **Correct** |
| `recycling_facility` → `ICON-003-recycling_facility` | **Correct** |
| Registry / resolver / view-data / fallback | **Not defective** |
| Catalog uses **primary** tier @ ~72px | **Yes** (`BuildingsScreen`) |
| 23/23 primary WebP hash collisions | **None** |
| Defect locus | **Master semantic subject** for `rail_terminal` |

**DEFECT CLASS:** **BV-I6 — MASTER / SOURCE ASSET DEFECT**

---

## D. Current faulty rail_terminal primary

| Asset | Path |
|-------|------|
| Production master | `docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png` |
| Runtime WebP | `apps/web/public/assets/buildings/ICON-003-rail_terminal.webp` |
| Manifest | `docs/design/buildings/production/infrastructure/ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json` |

**Semantic read:** Recycling/processing hall (conveyors, sorted bales, processing interior) with minor rail elements — reads like **Recyclinganlage**, not **Bahnterminal**.

**SHA-256 (unchanged this task):**

- Master: `bf7b0678bef38e13ea024836fed0ed2d6631b59600dcb3a593805645c6861eef`
- WebP: `e5668e60b81dbac4c47500187c322262ac5740fa574d00f1ba6fdf3c2b74602c`

---

## E. Semantic authority for Bahnterminal

| Field | Authority |
|-------|-----------|
| ID | `rail_terminal` |
| Player name | **Bahnterminal** (`game-content/buildings/rail_terminal.yaml`) |
| Description | *Anbindung an das regionale Schienennetz fuer Schwertransporte.* |
| Category | `INFRASTRUCTURE` |
| Infrastructure grammar | **TERMINAL/YARD** (`ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json`) |
| Research gate | `intermodal_logistics` (unchanged; not redesigned) |

Expected visual read: **regional rail freight terminal / intermodal yard** for heavy rail freight — not passenger station, not recycling plant, not port.

---

## F. Existing ICON-003 art-direction authority

- **Inventory / sealed status:** ICON-003 **CLOSED / PASS / SEALED** — 23/23 (`GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`)
- **Family reference:** Rich stylized isometric industrial primaries (e.g. `ICON-003-port.png`, `ICON-003-access_road.png`)
- **Primary contract:** 1024×1024 transparent PNG master, no baked UI/text (infrastructure pilot manifest documents same dimensions)
- **BVI-001:** Preserves direction; **does not** reopen Scenario-B production batch

---

## G. Corrected candidate

| Item | Path |
|------|------|
| **Candidate master (human gate only)** | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png` |
| Source / audit record | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-SOURCE_RECORD.json` |
| Evidence generator (non-production) | `tools/bvi-001-rail-terminal-human-gate-evidence.mjs` |

**Generation:** Cursor `GenerateImage` with style references to sealed **port** and **access_road** primaries; prompt constrained to rail yard / tracks / gantry / freight containers; explicit exclusion of recycling sorting language.

**Post-process (candidate only):** Near-black background chroma-key to alpha to satisfy transparent primary contract (`hasAlpha: true`, 1024×1024).

**Not wired:** registry, resolver, WebP pipeline, runtime, manifests.

---

## H. Semantic differentiation analysis

### H1. vs Recyclinganlage

| Criterion | Assessment |
|-----------|------------|
| Old production Bahnterminal | **Fails** — dominated by recycling/processing vocabulary |
| New candidate | **Pass (candidate review)** — parallel tracks, yard ballast, gantry over rails, intermodal containers; **no bale stacks / sorting hall** |
| Recycling production | Unchanged; still correct for its ID |

### H2. vs Port

| Criterion | Assessment |
|-----------|------------|
| Port | Quay, water edge, maritime crane/container terminal |
| New candidate | **Rail-dominant** — no waterline, no dock/quay geometry as primary read |

### H3. vs Logistics Hub

| Criterion | Assessment |
|-----------|------------|
| Logistics hub | Road-oriented warehouse / logistics mass |
| New candidate | Identity **depends on visible multi-track yard** and rail-side handling |

**Internal pre-gate check:** Candidate reads **rail terminal** before generic industrial hall. Human must confirm.

---

## I. Scale-readability evidence

`docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_CANDIDATE_SCALE_READABILITY.png`

Scales: **256 / 128 / 96 / 72 px** (candidate only). Yard + crane silhouette intended to survive catalog-scale reduction.

---

## J. Side-by-side human-review board

`docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_OLD_NEW_RECYCLING_BOARD.png`

Duplicate copy for review convenience:

`docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_OLD_NEW_RECYCLING_BOARD.png`

Panels: **OLD BAHNTERMINAL (production)** | **NEW BAHNTERMINAL CANDIDATE** | **RECYCLINGANLAGE (production)**

---

## K. Infrastructure-family comparison

`docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_INFRASTRUCTURE_FAMILY_BOARD.png`

Sealed primaries: `access_road`, `port`, `logistics_hub`, `maintenance_facility`, `recycling_facility` + **rail_terminal CANDIDATE**.

Purpose: family fit without confusing neighboring infrastructure identities.

---

## L. Production-integrity / hash firewall

| Asset | SHA-256 | Modified? |
|-------|---------|-----------|
| `ICON-003-rail_terminal.png` (production) | `bf7b0678…` | **NO** |
| `ICON-003-rail_terminal.webp` | `e5668e60…` | **NO** |
| `ICON-003-recycling_facility.png` | `3a1801bc…` | **NO** |
| `ICON-003-recycling_facility.webp` | `eb720d39…` | **NO** |

Production manifest, visual registry, resolver, `BuildingTypeIcon`, compact SVG for `rail_terminal`: **unchanged**.

Application source under `apps/web/src` / `src/application`: **no BVI-001 edits** (unrelated shell diffs remain in working tree only).

---

## M. Scenario-B accounting

| Metric | Value |
|--------|--------|
| Production primary count | **Unchanged** (23) |
| Candidate status | **DEV / HUMAN-GATE** — not ACTIVE |
| Scenario-B authored-primary delta | **0** |
| Scenario-B visual production | **Still PAUSED** |

Approval would **replace** one incorrect concept, not add a new authored primary.

---

## N. Human visual gate

Reviewer must choose **one** (Cursor does **not** decide):

| Decision | Meaning |
|----------|---------|
| **PASS** | Approve direction → separate **production replacement / runtime certification** prompt |
| **REVISE** | Direction OK; specify visual changes → revise candidate only |
| **REJECT** | Does not fix integrity → new bounded candidate direction |

### Gate questions (evidence supports answers)

1. NEW reads as Bahnterminal? — **For human judgment** (candidate designed yes)
2. Distinct from Recyclinganlage? — **Strong separation vs OLD; human confirms vs recycling PNG**
3. Distinct from Port? — **Designed yes (no maritime read)**
4. Distinct from logistics warehouse? — **Designed yes (rail yard essential)**
5. ICON-003 family fit? — **References port/access_road; human confirms**
6. Readable ~72–96px? — **See scale board**
7. Baked text/UI? — **None on candidate art**
8. Strong enough to replace sealed faulty master? — **Human decision**

**PGD-001 milestone raw IDs:** May still appear in catalog mock copy — **intentionally not fixed** in BVI-001.

---

## O. Final decision

> **BVI-001 DEFECT:**  
> `BV-I6 — MASTER / SOURCE ASSET DEFECT`

> **AFFECTED ENTITY:**  
> `rail_terminal — Bahnterminal`

> **ICON-003 ART DIRECTION:**  
> `REMAINS SEALED`

> **PRODUCTION ASSET CHANGED:**  
> `NO`

> **NEW ART FAMILY CREATED:**  
> `NO`

> **SCENARIO-B CONCEPT COUNT DELTA:**  
> `0`

> **CANDIDATE STATUS:**  
> `READY FOR HUMAN GATE`

> **HUMAN DECISION REQUIRED:**  
> `YES`

---

## Required factual questions (§37)

1. Building ID: **`rail_terminal`**
2. Player name: **Bahnterminal**
3. Semantics: YAML description + TERMINAL/YARD grammar + intermodal research gate (§E)
4. Wrong with sealed primary: **Recycling/processing subject matter, not rail freight terminal**
5. Registry mapping: **Still correct — YES**
6. Resolver: **Still correct — YES**
7. View-data: **Still correct — YES**
8. Fallback involved: **NO**
9. Primary tier: **YES** (catalog `variant="primary"`)
10. Compact valid: **YES — unchanged; distinct hash; not part of defect**
11. Candidate reads as rail infrastructure: **Yes (pre-gate); human confirms**
12. Differs from Recyclinganlage: **Yes (pre-gate); human confirms**
13. Differs from Port: **Yes (pre-gate)**
14. Differs from Logistics Hub: **Yes (pre-gate)**
15. Fits ICON-003 direction: **Intended yes; human confirms**
16. Recognizable at 72px: **See scale board; human confirms**
17. Baked text/UI: **NO on candidate raster**
18. Production assets overwritten: **NO**
19. Registry/resolver/app changed: **NO**
20. Scenario-B concept count increase: **NO (delta 0)**
21. Gameplay/content change required: **NO**
22. Ready for human visual approval: **YES — READY FOR HUMAN GATE**

---

## Evidence file index (§36)

| Artifact | Path |
|----------|------|
| Candidate master | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png` |
| Source record | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-SOURCE_RECORD.json` |
| Scale board | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_CANDIDATE_SCALE_READABILITY.png` |
| OLD / NEW / Recycling board | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_OLD_NEW_RECYCLING_BOARD.png` |
| Infrastructure family board | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_INFRASTRUCTURE_FAMILY_BOARD.png` |
| Catalog card comparison | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_CATALOG_CARD_COMPARISON.png` |
| Review mirror board | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_OLD_NEW_RECYCLING_BOARD.png` |

---

## P. Evidence repair (POST-V1 human-gate evidence repair)

### Previous failure

The first semantic differentiation board (`BVI-001_RAIL_TERMINAL_OLD_NEW_RECYCLING_BOARD.png`) was **rejected as evidence** (not as art): column titles and board chrome were visible, but the three comparison rasters were not. Human gate outcome: **REJECTED EVIDENCE**.

### Root cause

`tools/bvi-001-rail-terminal-human-gate-evidence.mjs` composited a **full-canvas SVG label layer after** the PNG artwork. With Sharp/librsvg, that second full-size SVG pass re-renders an **opaque canvas** over the entire board, replacing the previously composited building images with the flat review background. Source PNGs loaded correctly; alpha and paths were valid.

### Repair (evidence composition only)

| Item | Action |
|------|--------|
| Evidence generator | Minimal fix: **SVG labels first**, then panel plates + normalized rasters; deterministic per-panel visibility assertions |
| Subject scale | In-memory `trim(threshold 12)` + `fit: inside` per panel (sources unchanged on disk) |
| Visibility plates | Neutral panel fill under each cell (evidence-only) |
| Semantic board | **Regenerated** — all three buildings now visible |
| Scale readability board | **Regenerated** (same compositor defect) |
| Infrastructure family board | **Regenerated** (same compositor defect) |
| Catalog card comparison | **Repaired** — raster card compositing (embedded SVG `<image href="data:…">` was not relied on) |
| Review mirror | Byte-identical copy of repaired semantic board |

### Integrity (before → after)

| Asset | SHA-256 | Changed? |
|-------|---------|----------|
| Candidate `BVI-001-ICON-003-rail_terminal-candidate-primary.png` | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` | **NO** |
| Production `ICON-003-rail_terminal.png` | `bf7b0678bef38e13ea024836fed0ed2d6631b59600dcb3a593805645c6861eef` | **NO** |
| Production `ICON-003-recycling_facility.png` | `3a1801bce15da36ca32bf94f89f98b7e1d998cadfd5aea6b6347ebbbccac57a9` | **NO** |
| Runtime WebP / registry / resolver / app | — | **NO** |

### Validation

- All three source PNGs exist (1024×1024, alpha, non-zero visible pixels; candidate ~326k non-transparent pixels at generation time).
- Repaired semantic board: programmatic panel checks passed (`nonBackgroundCount` + variance vs empty plate).
- Repaired PNG **opened and inspected**: all three building subjects are immediately visible.
- **No image generation** in this repair pass.

### Human-gate status (unchanged authority)

- **Art decision:** NOT YET MADE (PASS / REVISE / REJECT still required from human reviewer).
- **Gate status:** **READY FOR HUMAN VISUAL RE-REVIEW** / **READY FOR HUMAN GATE** (evidence no longer blocked).

---

## Evidence repair — factual answers (§27)

1. **Why invisible?** Full-canvas SVG label overlay composited **after** artwork wiped the raster layers.
2. **All three sources existed?** Yes.
3. **OLD valid?** Yes.
4. **NEW valid?** Yes.
5. **Recycling valid?** Yes.
6. **Candidate meaningful visible pixels?** Yes.
7. **Candidate modified?** No.
8. **Candidate SHA-256 before:** `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c`
9. **Candidate SHA-256 after:** `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c`
10. **Hashes identical?** Yes.
11. **Production rail_terminal modified?** No.
12. **Production recycling modified?** No.
13. **Runtime WebP modified?** No.
14. **Registry/resolver/app modified?** No.
15. **All three visible on repaired board?** Yes.
16. **Panel visibility checks passed?** Yes.
17. **Manual inspection?** Yes.
18. **Scale board required repair?** Yes (regenerated with fixed compositor).
19. **Infrastructure family board required repair?** Yes (regenerated with fixed compositor).
20. **Catalog comparison required repair?** Yes (raster compositing fix).
21. **New art generated?** No.
22. **Candidate still awaiting human visual judgment?** Yes.

> **BVI-001 ART CANDIDATE:**  
> `UNCHANGED`

> **PRODUCTION ASSETS:**  
> `UNCHANGED`

> **EVIDENCE FAILURE ROOT CAUSE:**  
> `Full-canvas SVG labels composited after PNG artwork in Sharp, producing an opaque overlay that hid all three panel images`

> **SEMANTIC DIFFERENTIATION BOARD:**  
> `REPAIRED`

> **SCALE BOARD:**  
> `REPAIRED`

> **INFRASTRUCTURE FAMILY BOARD:**  
> `REPAIRED`

> **CATALOG COMPARISON:**  
> `REPAIRED`

> **NEW ART GENERATED:**  
> `NO`

> **HUMAN ART DECISION:**  
> `NOT YET MADE`

> **STATUS:**  
> `READY FOR HUMAN VISUAL RE-REVIEW`

---

## Q. Final human-gate disposition (2026-10-05 — supersedes stale §P status lines)

The evidence-repair snapshot in **§P** remains historical context. Subsequent recorded authority:

| Item | Final state |
|------|-------------|
| Human visual decision | **PASS** |
| Approved candidate | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png` |
| Approval authority | `BVI-001-SOURCE_RECORD.json` (`humanVisualGate: PASS`) + recorded human decision |
| Candidate SHA-256 | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` |
| Production promotion | Occurred after the §P “NOT YET MADE” snapshot; local promotion bytes match SOURCE_RECORD `productionHashesAfter` |
| Stale wording superseded | §A “READY FOR HUMAN GATE”, §P “NOT YET MADE” / “READY FOR HUMAN VISUAL RE-REVIEW” |

No new human decision was invented in this disposition block; it documents authority already recorded in SOURCE_RECORD and verified by byte reconciliation (`POST_V1_BVI_001_CURRENT_LOCAL_STATE_CLOSE_CANDIDATE_RECONCILIATION.md`).

# END
