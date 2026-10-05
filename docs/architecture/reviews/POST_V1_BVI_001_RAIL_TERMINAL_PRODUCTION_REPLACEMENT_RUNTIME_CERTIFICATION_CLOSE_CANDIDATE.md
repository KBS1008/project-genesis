# POST-V1 BVI-001 — Rail Terminal Production Replacement & Runtime Certification (Close Candidate)

**Task:** Promote human-approved `rail_terminal` candidate; certify runtime; close BV-I6.  
**Certification pass:** 2026-10-05 (`POST_V1_BVI_001_RUNTIME_CERTIFICATION_FINAL_CLOSEOUT` prompt)  
**Committed baseline HEAD:** `824a477c68b85216ffd8213ba44474799615e4c8` — `PDM-001: add direct map building placement.` (BVI remains **local / uncommitted** on top).  
**Outcome:** **OPTION A — BVI-001 PRODUCTION REPAIR COMPLETE** (ready for independent final closure review).

---

## A. Executive result

Human visual gate **PASS** for `BVI-001-ICON-003-rail_terminal-candidate-primary.png`. The approved raster was copied byte-identically into the sealed production master, runtime WebP was regenerated with the established ICON-003 infrastructure pipeline (`sharp.webp` quality **82**, effort **4**), bounded **23/23** primary integrity scan **PASS**, and live Buildings catalog resolution was verified (`rail_terminal` → `ICON-003-rail_terminal.webp`, distinct from `ICON-003-recycling_facility.webp`). **No new art generated.**

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (committed) | `824a477c68b85216ffd8213ba44474799615e4c8` |
| `origin/master` | Same SHA |
| BVI committed/pushed | **No** — asset + manifest + tooling + evidence are local WIP |
| Dev runtime (certification) | `pnpm dev:restart` → `http://127.0.0.1:3000` |
| Capture | `PG_WEB_ORIGIN=http://127.0.0.1:3000 node tools/capture-bvi-001-rail-terminal-runtime-evidence.mjs` — exit **0** @ 2026-10-05T16:59:18Z |

**Unrelated WIP (not BVI-owned):** doc relocations, dev pilots, API saves, unrelated assets, PDM sealed on HEAD, etc.

---

## C. Human approval authority

Per task authority and human gate closeout:

> **BVI-001 HUMAN VISUAL GATE: PASS** — entity `rail_terminal` (Bahnterminal).

Reference: `BVI-001-SOURCE_RECORD.json` (`humanVisualGate: PASS`) and `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_VISUAL_INTEGRITY_HUMAN_GATE.md` (§Q final disposition; §P historical).

---

## D. Approved candidate identity

| Check | Result |
|-------|--------|
| Path | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-ICON-003-rail_terminal-candidate-primary.png` |
| SHA-256 (before promotion) | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` |
| Matches human-approved hash | **YES** |
| SHA-256 (after promotion) | **Unchanged** (provenance file retained) |

---

## E. Old production identity

| Asset | SHA-256 (verified before promotion) |
|-------|-------------------------------------|
| Production master `ICON-003-rail_terminal.png` | `bf7b0678bef38e13ea024836fed0ed2d6631b59600dcb3a593805645c6861eef` |
| Runtime WebP | `e5668e60b81dbac4c47500187c322262ac5740fa574d00f1ba6fdf3c2b74602c` |

Faulty master archived (historical evidence only):  
`docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_FAULTY_PRODUCTION_MASTER_ARCHIVE.png`

---

## F. Production promotion

| Step | Result |
|------|--------|
| Method | `copyFile` approved candidate → production master (no re-export) |
| New production master SHA-256 | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` |
| Byte-identical to approved candidate | **YES** |
| Tool | `node tools/bvi-001-rail-terminal-production-promotion.mjs` |

---

## G. Runtime derivative regeneration

| Asset | SHA-256 |
|-------|---------|
| Old WebP | `e5668e60b81dbac4c47500187c322262ac5740fa574d00f1ba6fdf3c2b74602c` |
| New WebP | `99c9d8312dc6c4f034a7ebe62b4942dfe9407d531e8be89d39dccada5f0460cd` |
| Runtime PNG mirror | Updated via same pipeline convention as `tools/process-icon-003-infrastructure-production.ts` |
| Pipeline | `sharp(source).webp({ quality: 82, effort: 4 })` |

---

## H. Manifest / source-record updates

| File | Change |
|------|--------|
| `docs/design/buildings/production/infrastructure/ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json` | `rail_terminal.bvi001Repair` metadata + provenance pointer to approved candidate |
| `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/BVI-001-SOURCE_RECORD.json` | `humanVisualGate: PASS`, `productionPromotion` block, updated `productionHashesAfter` |

Other manifest entries unchanged. Historical `productionHashesBefore` preserved in source record.

---

## I. Registry / resolver / compact firewalls

| Surface | Modified |
|---------|----------|
| `visual-asset-registry.ts` | **NO** |
| `building-type-visual-asset-ids.ts` | **NO** |
| Resolver / fallback / view-data | **NO** |
| `ICON-003-rail_terminal-compact.svg` | **NO** (SHA-256 `949cd151069ced572ca43d26db807afd01f86056e6f1a1e2768824f28152f66c` before/after) |

---

## J. Recyclinganlage firewall

| Asset | SHA-256 before | SHA-256 after |
|-------|----------------|---------------|
| Production master | `3a1801bce15da36ca32bf94f89f98b7e1d998cadfd5aea6b6347ebbbccac57a9` | **Same** |
| Runtime WebP | `eb720d3945be72315cb6653a7c23315ca7c047e24e0fca8b4805183bb58e98b1` | **Same** |

---

## K. 23/23 primary integrity certification

Command: promotion script embedded scan over all 23 `ICON-003-{buildingTypeId}.png` production primaries.

| Result | Detail |
|--------|--------|
| Count | **23/23** files present, valid dimensions |
| Exact-hash collisions | **None** |
| `rail_terminal` vs `recycling_facility` | **Distinct hashes** |

Runtime coverage: **23** primary `ICON-003-*.webp` files under `apps/web/public/assets/buildings/` (excluding compact).

---

## L. Active-reference audit

| Check | Result |
|-------|--------|
| Active production master | Approved art (`26f0136b…`) |
| Active runtime WebP | New derivative (`99c9d831…`) |
| Old master hash `bf7b0678…` in active paths | **None** (only manifest metadata, source record, human-gate docs, faulty archive) |
| Duplicate `rail_terminal` consumer paths | **None found** |

Human-gate / closeout boards retain OLD faulty raster for audit only.

---

## M. Production closeout evidence

| Artifact | Path |
|----------|------|
| Closeout board | `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/evidence/BVI-001_RAIL_TERMINAL_PRODUCTION_CLOSEOUT_BOARD.png` |
| Review mirror | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_PRODUCTION_CLOSEOUT_BOARD.png` |

Columns: archived faulty production → promoted production master → unchanged Recyclinganlage reference.

---

## N. Desktop runtime certification

| Item | Value |
|------|--------|
| Viewport | 1440×900 |
| Screen | Buildings catalog (`/game?screen=buildings`) |
| Evidence | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_DESKTOP_1440x900.png` |
| Resolution proof | `img[src*="ICON-003-rail_terminal"]` → `…/ICON-003-rail_terminal.webp`; recycling → distinct `…/ICON-003-recycling_facility.webp` |
| Fallback same src | **NO** |

Tool: `PG_WEB_ORIGIN=http://localhost:3000 node tools/capture-bvi-001-rail-terminal-runtime-evidence.mjs`

---

## O. Narrow runtime certification

| Item | Value |
|------|--------|
| Viewport | 480×900 |
| Evidence | `docs/architecture/reviews/evidence/BVI-001_RAIL_TERMINAL_RUNTIME_CATALOG_NARROW_480x900.png` |
| Layout | Full-page capture with Bahnterminal scrolled into view; no task-owned layout changes |

---

## P. Focused tests / visual verification

| Command | Result |
|---------|--------|
| `pnpm exec vitest run apps/web/src/presentation/assets/building-type-visual-asset-ids.test.ts` | **PASS** (9 tests) |
| `node tools/bvi-001-rail-terminal-production-promotion.mjs` | **PASS** (promotion + 23/23 scan) |
| Human-gate evidence generator | **Not re-run** (would rewrite historical OLD column now that production path holds new art); compositor fix retained in `tools/bvi-001-rail-terminal-human-gate-evidence.mjs` |

---

## Q. Root quality gates

Rerun after certification closeout (2026-10-05; local BVI WIP + capture script summary JSON; **no asset byte changes** during certification):

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** — **0 errors**, **144 warnings** (pre-existing) |
| `pnpm test` | **PASS** — **290** files, **1096** tests |
| `pnpm build:web` | **PASS** |

No BVI-local regression identified.

---

## R. Scenario-B / ICON-003 accounting

| Metric | Value |
|--------|--------|
| ICON-003 primary coverage | **23/23** |
| ICON-003 status | **CLOSED / PASS / SEALED** (integrity repair only) |
| Scenario-B authored-primary delta | **0** |
| New art in production step | **NO** |
| PGD-001 / raw milestone IDs in catalog copy | **Untouched** (BVI firewall) |

Master inventory: concise BVI-001 note on `rail_terminal` row in `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` (count unchanged).

---

## S. Final diff ownership

**BVI-001 task-owned (this task + prior evidence repair in same workstream):**

- `docs/design/buildings/production/infrastructure/primary/ICON-003-rail_terminal.png`
- `apps/web/public/assets/buildings/ICON-003-rail_terminal.png`
- `apps/web/public/assets/buildings/ICON-003-rail_terminal.webp`
- `docs/design/buildings/production/infrastructure/ICON_003_INFRASTRUCTURE_PRODUCTION_MANIFEST.json`
- `docs/design/buildings/icon-003/bvi-001-rail-terminal-human-gate/` (source record, evidence, archive, closeout board)
- `docs/architecture/reviews/evidence/BVI-001_*` runtime + closeout PNGs
- `docs/architecture/reviews/POST_V1_BVI_001_RAIL_TERMINAL_PRODUCTION_REPLACEMENT_RUNTIME_CERTIFICATION_CLOSE_CANDIDATE.md` (this file)
- `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` (one-line note)
- `tools/bvi-001-rail-terminal-production-promotion.mjs`
- `tools/capture-bvi-001-rail-terminal-runtime-evidence.mjs`
- `tools/bvi-001-rail-terminal-human-gate-evidence.mjs` (eslint header + prior compositor repair)

**Not task-owned:** shell/simulation UI WIP, doc mass moves, dev pilots, unrelated prompts/assets.

---

## T. Final decision

> **BVI-001 DEFECT:**  
> `BV-I6 — MASTER / SOURCE ASSET DEFECT`

> **HUMAN ART GATE:**  
> `PASS`

> **rail_terminal PRODUCTION PRIMARY:**  
> `REPLACED WITH APPROVED CANDIDATE`

> **rail_terminal RUNTIME DERIVATIVE:**  
> `CERTIFIED`

> **recycling_facility:**  
> `UNCHANGED`

> **rail_terminal COMPACT:**  
> `UNCHANGED`

> **REGISTRY / RESOLVER:**  
> `UNCHANGED`

> **ICON-003 COVERAGE:**  
> `23/23`

> **ICON-003 STATUS:**  
> `CLOSED / PASS / SEALED`

> **SCENARIO-B CONCEPT COUNT DELTA:**  
> `0`

> **NEW ART GENERATED IN PRODUCTION STEP:**  
> `NO`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## Required hash table (§39)

| Asset | Before | After | Changed? |
|-------|--------|-------|----------|
| Approved candidate | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` | **NO** |
| Production `rail_terminal` PNG | `bf7b0678bef38e13ea024836fed0ed2d6631b59600dcb3a593805645c6861eef` | `26f0136b748c4aa3ea80262fa4f649edb3e3a55788f6842f721826faa69f758c` | **YES** (intended) |
| Runtime `rail_terminal` WebP | `e5668e60b81dbac4c47500187c322262ac5740fa574d00f1ba6fdf3c2b74602c` | `99c9d8312dc6c4f034a7ebe62b4942dfe9407d531e8be89d39dccada5f0460cd` | **YES** (intended) |
| Production `recycling_facility` PNG | `3a1801bce15da36ca32bf94f89f98b7e1d998cadfd5aea6b6347ebbbccac57a9` | `3a1801bce15da36ca32bf94f89f98b7e1d998cadfd5aea6b6347ebbbccac57a9` | **NO** |
| Runtime `recycling_facility` WebP | `eb720d3945be72315cb6653a7c23315ca7c047e24e0fca8b4805183bb58e98b1` | `eb720d3945be72315cb6653a7c23315ca7c047e24e0fca8b4805183bb58e98b1` | **NO** |
| `rail_terminal` compact | `949cd151069ced572ca43d26db807afd01f86056e6f1a1e2768824f28152f66c` | `949cd151069ced572ca43d26db807afd01f86056e6f1a1e2768824f28152f66c` | **NO** |

---

## Required factual answers (§40)

1. Approved candidate hash verified before promotion? **YES**
2. Equal to `26f0136b…`? **YES**
3. Old production master hash? **`bf7b0678…`**
4. New production master hash? **`26f0136b…`**
5. New master byte-identical to candidate? **YES**
6. Old runtime WebP hash? **`e5668e60…`**
7. New runtime WebP hash? **`99c9d831…`**
8. Established pipeline? **YES** (ICON-003 infrastructure WebP convention)
9. `recycling_facility` unchanged? **YES**
10. `rail_terminal` compact unchanged? **YES**
11. Registry unchanged? **YES**
12. Resolver unchanged? **YES**
13. View-data/routing unchanged? **YES**
14. Gameplay/content unchanged? **YES**
15. Saves/API contracts unchanged? **YES**
16. Runtime shows new Bahnterminal art path? **YES** (`ICON-003-rail_terminal.webp` loaded)
17. Runtime shows correct Recyclinganlage? **YES**
18. Visually distinct at runtime (asset identity)? **YES** (distinct WebP URLs; closeout board + catalog DOM)
19. Fallback for `rail_terminal`? **NO** (primary asset URL resolved)
20. Narrow viewport valid? **YES** (capture + no layout code changes)
21. 23/23 scan pass? **YES**
22. New `rail_terminal` hash-collision with any other primary? **NO**
23. Active runtime still uses old faulty art? **NO**
24. New images generated? **NO**
25. Scenario-B count increase? **NO**
26. ICON-003 23/23? **YES**
27. ICON-003 CLOSED/PASS/SEALED? **YES**
28. PGD-001 untouched? **YES**
29. Focused checks green? **YES**
30. Root quality gates green? **YES**
31. BVI-001 ready to close? **YES** (pending independent review of this close candidate)

**No commit. No push. No tag.**

# END
