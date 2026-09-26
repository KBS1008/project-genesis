# Post-V1 Scenario B — Visual Coverage Reassessment after MVI-001

**Prompt:** `POST_V1_SCENARIO_B_VISUAL_COVERAGE_REASSESSMENT_AFTER_MVI_001.md`  
**Date:** 2026-09-26  
**Mode:** Read-only portfolio review (report + minimal inventory reconciliation only)  
**MVI-001 commits:** Slice 1 `da1969c` · Slice 2 `e9afec9`  
**HEAD @ review:** `e9afec9627b44f325a4a700dfd6bdfc5e522d90f` · **Branch:** `master` (synced with `origin/master`)

---

## A. Executive result

MVI-001 is **CLOSED / PASS / SEALED** at both slices (`da1969c`, `e9afec9`). ICON-001 commodity integration now covers the **scoped high-value table consumers**: site inventory, warehouse detail, market price rows (Company + Market screen), and supply-chain transport cargo rows (Company Operations detailed widget + Executive dashboard Lieferkette). **No new authored concepts** were added; primary count **92** and compact count **47** are unchanged.

No **material** player-facing gap remains that warrants **immediate** Scenario-B **visual production** (new authored families or bounded integration of sealed art). Remaining opportunities are predominantly **optional polish**, **UX / player guidance**, or **not justified by current content** (TRV, events taxonomy).

**Portfolio direction:** pause material Scenario-B visual work until new evidence or enabled content appears.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `e9afec9` — *Wire ICON-001 into supply-chain transport rows for MVI-001 Slice 2.* |
| MVI-001 on HEAD | **Verified** — `da1969c` (Slice 1) + `e9afec9` (Slice 2) in history |
| Working tree | **Not clean** — unrelated shell/simulation tests, doc deletions/moves, dev pilots, local saves. **Not part of this review.** |
| Application code | **Unchanged** by this task |
| Evidence | Close candidates, registry/resolvers, mappers/widgets, `game-content/` counts, existing runtime PNGs (MVI/MVI-001/MSV/WFV) |

---

## C. Current Scenario-B accounting

Planning envelope **~380–520 authored + ~12 procedural** remains a **directional envelope**, not a quota.

| Class | Previous (post-MSV / pre-MVI close) | Current | Delta reason |
|-------|-------------------------------------|---------|--------------|
| Authored primary concepts | **92** | **92** | MVI-001 added **0** primaries (integration only) |
| Secondary / compact | **47** | **47** | unchanged |
| Generic UI glyphs | **~11** | **~11** | `DashboardIcon` inline set |
| Procedural systems (production) | **~5** | **~5** | world biomes/routes/minimap; chart language |
| Derived runtime | excluded | excluded | WebP/PNG copies |
| Dev / evidence | excluded | excluded | pilots, boards, screenshots |

**Inference:** Scenario-B **coverage maturity** increased via **integration**, not **inventory expansion**.

---

## D. Enabled content inventory

Recount from `game-content/` @ `e9afec9`:

| Domain | Count | Δ since MSV reassessment |
|--------|------:|--------------------------|
| Building types | 23 | 0 |
| Resources | 9 | 0 |
| Recipes | 7 | 0 |
| Technologies | 22 | 0 |
| Employees | 19 | 0 |
| Milestones | 8 | 0 |
| Regions | 4 | 0 |
| Cities | 7 | 0 |
| Biomes | 3 | 0 |

**Observation:** No enabled-content expansion that would require a **new** visual family without inventing semantics.

---

## E. Sealed / completed visual families (re-audit)

| Family | Expected | Repository / runtime status |
|--------|----------|----------------------------|
| BR-001, MM-001/006/007 | scenic/brand | registry ACTIVE |
| ICON-001 | 9/9 resources | sealed; `ResourceIcon` + registry |
| ICON-002 | 6 category SVGs | BuildingsScreen ACTIVE |
| ICON-003 | 23/23 + compacts | registry ACTIVE |
| ICON-004 | 22/22 + category compacts | ResearchScreen SEALED |
| ICON-005 | 7/7 | ProductionScreen SEALED |
| WFV-001 | 19/19 | `WorkforceRoleVisual` SEALED |
| MSV-001 | 8/8 | `MilestoneVisual` SEALED @ `461090b` |
| WBM-001 | world markers | compact ICON-003 SEALED |
| MVI-001 Slice 1 | market rows | `buildMarketPriceRow` @ `da1969c` |
| MVI-001 Slice 2 | supply-chain cargo | `PGSupplyChainWidget` @ `e9afec9` |

No contradictory evidence found to reopen sealed families.

---

## F. Player-facing domain audit

| Domain | Classification | Evidence (summary) |
|--------|----------------|---------------------|
| Main shell / navigation | **ADEQUATE** / optional polish | `PGSidebar` text labels only (`primary-screens.ts`); functional IA |
| World | **ADEQUATE** | WBM-001 + procedural routes/biomes; sealed foundation |
| Buildings | **STRONG** | ICON-003 catalog + ICON-002 categories |
| Production | **STRONG** | ICON-005 + operational state icons |
| Research | **STRONG** | ICON-004 detailed + category |
| Workforce | **STRONG** | WFV-001 in employee rows |
| Company / operations | **STRONG** | rich widgets; MVI market + supply chain |
| Milestones | **STRONG** | MSV-001 widget |
| Market / economy | **STRONG** | MVI-001 price rows; charts procedural |
| Transport / logistics | **ADEQUATE** | cargo identity in Lieferkette widgets; dedicated TransportScreen table route-first |
| Warehouse / storage | **STRONG** | ICON-001 inventory + warehouse |
| Energy | **ADEQUATE** | numeric/KPI surfaces; no missing entity art |
| Finance / reports | **ADEQUATE** | ledger tables + `PGReportWidget` actions; CH-010 chart language |
| Tutorial / guidance | **UX GAP, NOT ART GAP** | `PGTutorialPanel` text steps + generic `DashboardIcon` |
| Events / notifications | **CONTENT MODEL DOES NOT JUSTIFY ART** | no stable event illustration taxonomy |

---

## G. Gap-type classification (remaining candidates)

| Candidate | Primary gap type |
|-----------|-------------------|
| TRV-001 | **F — NOT JUSTIFIED** |
| NAV-001 authored family | **E — OPTIONAL POLISH** (generic nav sufficient) |
| Building-state badges | **C/D — procedural or generic UI** |
| World environment detail | **E — OPTIONAL POLISH** / procedural |
| Tutorial vignettes | **D — UX** |
| Events family | **F — NOT JUSTIFIED** |
| Finance scenic enrichment | **E — OPTIONAL POLISH** |
| TransportScreen cargo column | **D — UX / IA** |
| Minor summary lists (e.g. Market screen inventory `<ul>` text-only) | **E — OPTIONAL POLISH** (not commodity price table) |

---

## H. Post-MVI commodity integration audit

| Consumer | ICON-001 wired? | Notes |
|----------|-----------------|-------|
| Site inventory rows | Yes | `mapOperationsSiteInventoryRows` |
| Warehouse detail rows | Yes | `mapOperationsWarehouseBlocks` |
| Market price rows (Company) | Yes | `buildMarketPriceRow` |
| Market price rows (Market screen) | Yes | `mapMarketPriceRows` |
| Supply-chain / transport orders | Yes | `PGSupplyChainWidget` + `resourceId` |
| Executive Lieferkette | Yes | same widget |
| TransportScreen order table | N/A (no cargo column) | detail KV shows resource **label** only |
| Market screen inventory summary | Text labels only | low-frequency summary, out of MVI scope |

**Conclusion:** **MVI-001 integration backlog cleared** for explicitly scoped commodity-row consumers. No **important** remaining price/cargo **table** consumer with stable `resourceId` is text-only.

---

## I. Deferred-candidate reassessment

### TRV-001
**NOT JUSTIFIED BY CURRENT CONTENT.** Logistics YAML defines routes between building types; no vehicle/mode/fleet entities in content. Cargo identity correctly uses ICON-001.

### NAV-001
**NOT MATERIAL** for a new authored family now. `PGSidebar` is text-first but clear; screen interiors are visually rich. Improvement would be **optional polish** or **generic icon reuse** (`DashboardIcon`), not a justified new art family at current priority.

### Building-state presentation
**DEFERRED OPTIONAL POLISH / shared UI.** `BuildingConstructionStatus` uses label + procedural progress bar; does not require ICON-003 reopen or new overlay art family for material comprehension.

### Tutorial / player guidance
**UX GAP, NOT ART GAP.** Tutorial is step text + generic success icon. Blockers/raw IDs in entity inspectors (e.g. transport detail entries) are **guidance/copy** issues, not missing art.

### Events / notifications
**NOT JUSTIFIED BY CURRENT CONTENT** for an illustration family.

### World / environment
**ADEQUATE / DEFERRED OPTIONAL POLISH.** Reopening sealed world foundation would require concrete comprehension failure evidence; none observed beyond generic “could be prettier.”

### Finance / Reports
**ADEQUATE** for management-game density. Procedural charts + text tables; no enabled finance **entity** set requiring unique art.

### TransportScreen
**UX / INFORMATION ARCHITECTURE** if improved—not a visual-integration gap. Slice-2 close candidate rationale still valid: adding a cargo column changes IA. Cargo identity is available on Lieferkette surfaces.

---

## J. Visual quality vs quantity assessment

High-frequency surfaces (buildings, production, research, workforce, milestones, market prices, transport cargo widgets) now benefit from **detailed authored families** where semantics justify them. Remaining text-heavy areas (finance ledger, transport route list, shell nav) primarily serve **dense comparison or navigation**, where additional authored art would add **decoration** more than **comprehension**. This supports **pause**, not quota-chasing toward ~380–520.

---

## K. Candidate workstream table

| ID | Gap type | New art? | Human gate? | Materiality | Status |
|----|----------|----------|-------------|-------------|--------|
| MVI-001 follow-on | Integration | No | No | — | **ALREADY COVERED** |
| TRV-001 | F | Yes | Yes | Low | **NOT JUSTIFIED** |
| NAV-001 family | E / generic UI | Maybe | Yes if family | Low–medium | **DEFER / NOT MATERIAL** |
| Building-state overlays | C/D | Maybe shared | Maybe | Low | **DEFER** |
| World polish | E/C | Unlikely | Maybe | Low | **DEFER** |
| PGV / tutorial art | D | Yes | Yes | Medium UX | **BLOCKED BY UX** |
| EVT event art | F | Yes | Yes | Low | **NOT JUSTIFIED** |
| Finance visual enrichment | E | Yes | Yes | Low | **NOT MATERIAL** |
| TransportScreen IA | D | No | No | Medium UX | **BLOCKED BY UX** (not Scenario-B art) |
| Market inventory summary icons | E | No (reuse ICON-001) | No | Low | **NOT MATERIAL** |
| Player Guidance / raw IDs | D | No | No | **High UX** | **READY (product UX, not art production)** |

---

## L. Materiality analysis

**Material for Scenario-B visual production** requires frequent impact + stable semantics + bounded path + improved comprehension via art/integration.

After MVI-001, **no candidate** besides low-priority optional polish meets several materiality criteria **without** being primarily UX or not justified by content.

**Player Guidance** is material for **product quality** but is **not** Scenario-B **visual production**.

---

## M. New-art-family justification analysis

No candidate passes the 10-question bar for a **new authored family** at this time:

- TRV: no entities.
- NAV: generic glyphs sufficient; no stable “screen identity” content set.
- Events: no taxonomy.
- PGV tutorial vignettes: UX model immature.

---

## N. UX / Player Guidance separation

Known weaknesses (tutorial text-first flow, inspector KV fields exposing internal IDs, dense tables) are classified as **Player Guidance / Direct Manipulation** workstreams. They must **not** be solved by expanding Scenario-B art counts. This review does **not** implement that workstream.

---

## O. Scenario-B status decision

**STATUS 2 — SCENARIO B VISUAL PRODUCTION PAUSES**

Enabled content for current visual families is **covered or integrated**. Remaining items are optional polish, UX/product design, or unsupported concepts. **General game development may continue**; **no new material visual-production workstream** should start now.

---

## P. Selected next workstream OR pause rationale

**Pause rationale:** MVI-001 completed the last **material integration backlog** identified at the MSV reassessment. Re-audit finds no equally justified **integration** or **new family** target without inventing scope.

**When product prioritizes non-art work first:** **Player Guidance / Direct Manipulation** review (raw IDs, tutorial flow, requirement clarity)—classified as **UX**, not Scenario-B visual production.

**Reopen triggers (examples):**

- New enabled resources/buildings/technologies/employees/milestones without visual plan.
- New stable transport **mode** or **event** taxonomy in content.
- Runtime evidence of **material comprehension failure** on a high-frequency surface.
- Broken sealed-family resolution or missing production assets.

---

## Q. Master inventory delta

Minimal reconciliation in `GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`:

- Baseline HEAD → `e9afec9`
- MVI-001 sealed with commit refs
- Material visual workstream → **NONE (pause)**
- Scenario-B ledger notes **visual production paused** (planning envelope unchanged)

---

## R. Final decision

### Required factual answers

1. **MVI-001 fully complete and sealable?** **Yes** (@ `da1969c` + `e9afec9`).
2. **Important commodity consumer still lacks ICON-001?** **No** for scoped table consumers; minor summary lists optional only.
3. **New visual-family requirement from enabled content?** **No**.
4. **TRV-001 justified?** **No**.
5. **NAV-001 materially justified now?** **No** (optional polish only).
6. **Building-state material art gap?** **No** (shared UI/procedural sufficient).
7. **World materially incomplete?** **No** (optional/procedural polish only).
8. **Tutorial weakness art vs UX?** **Primarily UX**.
9. **Event model justifies art family?** **No**.
10. **Finance/Reports lack game identity materially?** **No** (adequate for purpose).
11. **TransportScreen needs art or IA?** **IA if anything**; not bounded MVI integration.
12. **Authored-primary count?** **92**.
13. **Secondary/compact count?** **47**.
14. **Procedural-system count?** **~5** production-relevant.
15. **Continue Scenario-B visual production immediately?** **No — pause**.
16. **Next workstream?** **NONE — PAUSE** (product UX guidance recommended separately if prioritized).

---

> **SCENARIO-B STATUS:**  
> **STATUS 2 — SCENARIO B VISUAL PRODUCTION PAUSES**

> **FINAL DECISION:**  
> **OPTION D — PAUSE MATERIAL SCENARIO-B VISUAL WORK**

> **NEXT MATERIAL WORKSTREAM:**  
> **NONE — PAUSE**

> **NEW ART REQUIRED:** **NO**

> **HUMAN ART-DIRECTION GATE REQUIRED:** **NO**

---

*No commit, push, tag, or application implementation (per prompt).*
