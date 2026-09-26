# Post-V1 Scenario B — Visual Coverage Reassessment after WFV-001

**Prompt:** `POST_V1_SCENARIO_B_VISUAL_COVERAGE_REASSESSMENT_AFTER_WFV_001.md`  
**Date:** 2026-09-20  
**Mode:** Read-only portfolio review (documentation only)  
**HEAD:** `65dcbfc` · **Branch:** `master`

---

## 1. Baseline

| Item | Value |
|------|--------|
| HEAD | `65dcbfce295b64e9aed74ec63778f20e023792a7` |
| Branch | `master` (pushed; includes WFV completion + runtime repair @ `65dcbfc`) |
| Working tree | **Not clean** — unrelated churn (shell/player-cycle tests, mass doc moves/deletes, building pilots, local saves). **Not absorbed** into this review. |
| Task-owned outputs | This report; factual deltas in `GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` |

**Evidence priority used:** runtime/registry → manifests → close reports → contracts → master inventory → older planning prose.

**Document discrepancies resolved:**

| Topic | Stale source | Repository truth @ `65dcbfc` |
|-------|----------------|--------------------------------|
| WFV-001 status | Inventory “complete candidate / human seal pending” | **19/19 production primaries**, resolver/registry complete, runtime repair merged; treat as **CLOSED / PASS / SEALED** for Scenario-B planning (per post-WFV reassessment authority). Art contract header still says “pending” — inventory updated; contract not rewritten in this task. |
| WBM-001 | Inventory “pending human seal” | Close candidate **OPTION A ready** @ `7426c47`; **23/23** compact markers on world layer — **SEALED** for integration scope (no new authored art). |
| Workforce blur test | Progress review 02 “text tables” | **WFV-001** active in `PGEmployeesWidget` via `WorkforceRoleVisual` — **STRONG** for enabled employee types. |
| Authored primary count | Inventory baseline HEAD `5f24b61` | Recounted below with WFV **19/19** sealed. |

---

## 2. Authoritative sealed visual tracks

| Track | Production coverage | Runtime consumer | Seal basis |
|-------|---------------------|------------------|------------|
| **ICON-001** Resources | 9/9 PNG (+ webp derivatives) | `ResourceIcon` — warehouse/inventory widgets | Phase-1 closeout docs |
| **ICON-002** Building categories | 6 category SVGs | `BuildingTypeIcon` fallback | Lifecycle closeout |
| **ICON-003** Building identity | **23/23** primary PNG + **23/23** compact SVG | Buildings catalog, inspectors, **WBM-001** world markers | Batches 1–3 + infrastructure 23/23 close candidate |
| **ICON-004** Technology | **22/22** Tier-1 primaries + **10** category compacts | `TechnologyVisual` on Research | `b5f3348` abstract completion |
| **ICON-005** Recipes / process | **7/7** primaries | `ProductionProcessVisual` on Production | `5f24b61` closeout |
| **World presentation** | 3 biomes procedural + routes + minimap | `PGWorldCanvas`, biome palettes | Slice-1 close candidate — **do not reopen** map renderer without hard defect |
| **WBM-001** | 0 new art (ICON-003 compact reuse) | `PGWorldBuildingMarker` | Close candidate @ `7426c47` |
| **WFV-001** | **19/19** hybrid primaries | `WorkforceRoleVisual` → `PGEmployeesWidget` | Batch 1 @ `22889a8` + completion + repair @ `65dcbfc` |
| **MM-001 / MM-006 / MM-007 + BR-001** | Scenic + logo | Main menu / splash / loading | Sealed menu-background workstreams |

**Firewalls:** Do not reopen ICON-001–005, World slice-1, WBM-001 integration, or WFV-001 for Scenario-B “next art” unless a **new** hard runtime defect is proven.

---

## 3. Corrected Scenario-B authored ledger

Counts exclude evidence boards, pilot DEV pages, WebP duplicates, registry rows, and fallback copies.

### A. Detailed authored primary art (player-facing)

| Bucket | Count | Notes |
|--------|------:|-------|
| Building type primaries (ICON-003) | 23 | `apps/web/public/assets/buildings/ICON-003-{type}.png` |
| Technology primaries (ICON-004) | 22 | `assets/research/ICON-004-{id}-primary.png` |
| Process primaries (ICON-005) | 7 | `assets/process/ICON-005-{recipeId}-primary.png` |
| Workforce primaries (WFV-001) | 19 | `assets/workforce/WFV-001-{employeeTypeId}-primary.png` |
| Resource icons (ICON-001) | 9 | Detailed commodity icons — not generic UI glyphs |
| Menu scenic (MM) | 3 | MM-001, MM-006, MM-007 |
| Brand logo (BR-001) | 1 | SVG |
| **Subtotal distinct primary concepts** | **84** | |

### B. Compact authored visuals

| Bucket | Count |
|--------|------:|
| Building compacts (ICON-003) | 23 |
| Technology category compacts (ICON-004) | 10 |
| Building category glyphs (ICON-002) | 6 |
| **Subtotal** | **39** |

### C. Scenic / environmental (runtime)

3 menu backgrounds + BR-001 (also counted above); world **procedural** plates — not additional PNG families.

### D. Procedural visual systems (production-active)

~5–6: biome fill patterns, route strokes, minimap, dashboard/Recharts + CH-010 chart language, world marker composition (WBM sizing/placement — not new art).

### E. Generic UI iconography

~11 inline `DashboardIcon` outline glyphs — **excluded** from detailed coverage claims.

### F. Honest envelope position

Planning envelope **~380–520 authored** remains a **directional envelope**, not a quota. Confirmed **~84** distinct primary concepts + **~39** compact identities + procedural layers. Large remaining envelope headroom reflects **optional** domains (milestones, transport identity, nav family, overlays) — not a mandate to fill to 520.

---

## 4. Current enabled-content inventory

Verified via `game-content/**/*.yaml` @ `65dcbfc`:

| Domain | Enabled count | Detailed art coverage | Compact / procedural |
|--------|-------------:|------------------------|----------------------|
| Resources | 9 | 9/9 ICON-001 | — |
| Recipes | 7 | 7/7 ICON-005 | — |
| Building types | 23 | 23/23 ICON-003 | 23 compacts + ICON-002 fallback |
| Technologies | 22 | 22/22 ICON-004 | 10 category SVGs |
| Employee types | 19 | 19/19 WFV-001 | ICON-002 only for unknown IDs |
| Milestones | 8 | **0/8** authored | text / KPI only |
| Regions | 4 | procedural rects | biome-linked |
| Cities | 7 | labels on world | no city crest art |
| Biomes | 3 | procedural | SEALED |
| Logistics routes (content) | 14 | procedural route lines | no vehicle art |
| Economy contracts | present | tables + charts | resource icons where wired |

No building **tier/upgrade** YAML — level fixed; no tier-art requirement from content.

---

## 5. Domain coverage matrix

| Domain | Enabled | Detailed art | Compact art | Procedural | Runtime consumer | Status | Material gap? |
|--------|--------:|---:|---:|---:|---|---|---|
| World / biomes | 3 | — | — | STRONG | World canvas | **SEALED / STRONG** | No (unless new defect) |
| Regions / cities | 4 / 7 | — | — | ADEQUATE | Map labels | **PROCEDURAL-ONLY** | Low — optional vista art |
| Buildings | 23 | 23/23 | 23 compacts | overlays text-led | Buildings + world markers | **COMPLETE / SEALED** | No |
| Building states | enums | — | — | text status | `BuildingConstructionStatus` | **TEXT-ONLY** | Optional shared overlays (deferred) |
| Resources | 9 | 9/9 | — | — | `ResourceIcon` | **COMPLETE / SEALED** | No |
| Production / recipes | 7 | 7/7 | — | job progress bars | ProductionScreen | **COMPLETE / SEALED** | No |
| Energy | KPI + plants | via building types | — | charts | Dashboard | **STRONG** | No new family |
| Transport / logistics | orders + 14 routes | — | resource at endpoints only | routes + tables | `PGSupplyChainWidget`, world routes | **PARTIAL / GENERIC-ICON-ONLY** | **Medium** — not fleet fantasy |
| Warehousing | sites | ICON-001 + warehouse building | — | — | Inventory widgets | **STRONG** | No |
| Market / economy | 9 resources priced | ICON-001 exists but **market price rows omit icons** | trend badges | charts | `PGMarketWidget` | **PARTIAL** | **Low–medium** (mostly UX wiring) |
| Research | 22 | 22/22 | category | — | ResearchScreen | **COMPLETE / SEALED** | No |
| Workforce | 19 | 19/19 | — | — | `PGEmployeesWidget` | **COMPLETE / SEALED** | No |
| Company / management | HQ types + roles | building + WFV exec art | — | KPI tiles | Dashboard | **ADEQUATE** | Low |
| Milestones / progression | 8 | **0/8** | — | — | KPI count only | **GAP / TEXT-ONLY** | **HIGH** |
| Events | event log API | — | — | text list | Reports | **TEXT-ONLY** | Low (no rich catalog) |
| Tutorial / guidance | steps | — | — | — | (text-led) | **TEXT-ONLY** | Medium but UX-heavy |
| Navigation / shell | 9 screens | — | DashboardIcon | — | Nav pills | **GENERIC-ICON-ONLY** | Medium — polish not fantasy |
| Decorative / menu | — | MM + BR | — | — | Main menu | **STRONG** | No |
| Economic visualization | — | — | — | CH-010 + Recharts | Dashboard | **ADEQUATE** | No decorative art need |

---

## 6. Game-fantasy assessment (blur test)

If labels were blurred, the player **still reads** industry, research, production recipes, workforce roles, resources, and building types on their primary screens — **pass** for sealed families.

**Still weak after blur:**

- **Milestones:** only a numeric KPI (“2 von 8 erreicht”) — **fail**; no visual achievement language.
- **Transport orders:** table of route names + amounts — **partial**; world routes help context but orders feel administrative.
- **Market:** numeric columns dominate; missing resource icons in price table reduces commodity legibility — **partial fail** (fixable without new art family).
- **Shell navigation:** screen pills without distinct screen identity — **weak** but lower fantasy priority than progression rewards.

---

## 7. Progression / reward assessment

| Domain | Class | Notes |
|--------|-------|-------|
| Research completion | **STRONG** | Detailed tech art + catalog |
| Production / recipes | **STRONG** | ICON-005 primaries |
| Constructing industry | **STRONG** | ICON-003 + world markers |
| Workforce hiring | **STRONG** | WFV-001 |
| Company growth | **ADEQUATE** | KPIs + HQ/building art; not a dedicated “corporate saga” layer |
| Logistics expansion | **WEAK** | Functional tables + lines |
| Economic progress | **ADEQUATE** | Charts; not celebratory |
| **Milestones** | **ABSENT** | No reward surface beyond count |
| Events | **ABSENT** | Text log |

---

## 8. Milestone audit (mandatory)

| Question | Finding |
|----------|---------|
| Enabled count | **8** YAML files in `game-content/milestones/` |
| IDs | `first_production`, `first_steel`, `first_machine_parts`, `first_industrial_machinery`, `first_advanced_electronics`, `first_consumer_goods`, `first_profit`, `profit_100` |
| Display names | Mixed EN/DE in content (`First Production` vs `Erster Stahl`) — localization debt separate from art |
| Runtime surfaces | **`completedMilestoneCount` + hint** on company/executive dashboard KPIs only (`company-dashboard-view-mappers.ts`). **No milestone list UI**, gallery, notification art, or reports section. |
| ID leakage | Catalog exposed via API (`MilestoneCatalogEntry.id`) but **not shown** in current KPI-only UI |
| Authored art | **None** — no `MSV-*` registry entries |
| Generic icons | None — pure text/count |
| Completion emphasis | **No** visual celebration |
| Distinguish meanings | **No** — all achievements collapse to one integer |
| Safe semantics for art | **Yes** — triggers map to real gameplay (production volume, recipe outputs, profit thresholds) without inventing mechanics |
| Two-tier need | **Useful**: compact **medallion** for KPI/list + optional **detailed primary** for future milestone panel / toast — mirror ICON-004 pattern only if UI warrants both |
| Grammar | Evidence-backed: **achievement medallion** depicting industrial accomplishment (output, profit, first-run) — not portrait art |
| Display sizes | KPI tile ~48–64px compact; future panel ~96–128px detailed |

---

## 9. Transport / logistics audit (mandatory)

| Question | Finding |
|----------|---------|
| Enabled concepts | 14 logistics route definitions; live **transport orders** as simulation entities (source/dest, resource, progress) |
| Player mechanics | Order creation/progress — **not** vehicle fleet simulation |
| Visual consumers | `PGSupplyChainWidget` (text rows); world **procedural** route curves; inventory uses ICON-001 |
| Authored transport art | **None** (no TRV registry) |
| Route lines carrying meaning | **Yes** — primary geographic legibility; adequate for abstract logistics |
| New art justified? | **Only** if tied to **real** concepts — e.g. route-type glyph, hub emphasis — **not** invented trucks/ships/trains |
| vs milestones | Lower **progression reward** value; higher **semantic risk** if depicting non-existent vehicle classes |

---

## 10. Market / economy audit (mandatory)

| Weakness class | Assessment |
|----------------|------------|
| A. Missing authored identity | **Partial** — commodity identity exists (ICON-001) but **market widget rows lack `ResourceIcon`** (`buildMarketPriceRow` text-first) |
| B. Information hierarchy / UX | **Primary** — wide numeric table reads spreadsheet-like |
| C. Economic visualization | **Adequate** — CH-010 / Recharts on dashboard |
| D. Resource art sufficient | **Yes** for goods themselves — gap is **wiring + hierarchy**, not a new commodity art family |

**Conclusion:** Market is **not** the best next **authored-art** workstream; a small presentation integration could reuse ICON-001 without MSV-scale investment.

---

## 11. Remaining material gaps (Scenario B sense)

**Clearly missing authored identity**

- **Milestones (8)** — highest progression-reward gap.

**Optional enrichment (defer unless product prioritizes)**

- Transport/route **compact glyphs** (bounded, semantics-safe).
- Building **state overlays** (shared badges).
- Shell **nav icon family**.
- Tutorial **step vignettes** (UX-heavy).
- Region/city **identity accents**.

**Should NOT receive more art now**

- ICON-001–005 production batches, WFV-001, ICON-003 building batches, World biome renderer, generic World polish, responsive/shell beautification for its own sake.

**Not a quota calculation:** remaining work is **justified by player-facing weakness**, not `520 − 84`.

---

## 12. Candidate workstream matrix (scoring summary)

| Candidate | Freq. | Gameplay | Weakness | Reward | Semantics | Reuse art | New art | Runtime ready | Risk | First slice |
|-----------|-------|----------|----------|--------|-----------|-----------|---------|---------------|------|-------------|
| **MSV-001 Milestones** | Medium | High | **High** | **High** | **Safe** | ICON-001/005 motifs optional | **8 medallions** | Needs new consumer | Low | **4-pilot art direction** |
| TRV transport identity | High | Medium | Medium | Low | **Risky** if vehicles | Resources, routes | Many unknowns | Partial | Route glyph pilot |
| Market MSV-style art | High | High | Medium | Low | N/A | ICON-001 | Low value | **Wire icons first** | Low | Integration slice (not selected) |
| Company progression | Medium | Medium | Medium | Medium | OK | WFV + HQ buildings | Medium | Partial | Defer |
| Events illustrations | Low | Low | High | Low | No catalog | — | Speculative | None | Defer |
| Region/city identity | Medium | Low | Medium | Low | OK | Biomes | High | World layer | Medium | Defer |
| Tutorial visuals | Medium | Medium | Medium | Medium | UX-bound | — | Heavy | PGTutorial | High | Defer |
| Nav icon family | High | Low | Medium | Low | OK | DashboardIcon | ~9 glyphs | Shell | Low | Defer |

---

## 13. Selected next workstream (exactly one)

### **MSV-001 — Milestone / Achievement Visual Identity**

#### Problem

Eight enabled milestones are core **progression rewards**, but the UI exposes only a **numeric KPI**. There is no authored achievement language, no per-milestone distinction, and no visual payoff when milestones complete — the game still feels like an admin tool at the progression layer.

#### Why now

Buildings (ICON-003 + WBM), research (ICON-004), production (ICON-005), workforce (WFV-001), and world presentation are **sealed or strong**. Milestones are the **largest remaining enabled content set with zero authored visuals** and the weakest progression/reward score. Transport and market gaps are real but **either semantically risky (vehicles)** or **solvable by reusing ICON-001 (market)** without a new family.

#### Existing foundation

- Content: 8 milestone YAMLs with stable IDs and trigger types.
- API: `milestones` + `completedMilestones` on session dashboard.
- UI: KPI strip hooks (`completedMilestoneCount`, `milestoneHint`).
- Patterns to mirror: WFV/ICON pilot → contract → alpha → production batch; registry + resolver + single visual component.

#### Proposed visual family

**MSV-001** — Milestone Visual Identity (repository-consistent `MSV` prefix; aligns with deferred **MSV-001** in master inventory).

#### Art hierarchy

1. **Tier-1 detailed primary** (~96–128px) — achievement illustration / industrial payoff (optional for future milestone panel).
2. **Tier-2 compact medallion** (~48–64px) — KPI + list row default.
3. **State overlay** — completed vs locked desaturate/frame (procedural/CSS — no new PNG set required for v1).

Skip vehicle/scenic tiers.

#### First bounded slice

**MSV-001 Art-Direction & Contract Pilot (4 milestones, not 8/8 production):**

1. Authoritative read of all 8 triggers and German/English display-name policy for UI (documentation only).
2. Select **4 semantically diverse** pilots: e.g. `first_production` (first industrial run), `first_steel` (recipe-linked output), `first_profit` (economic), `first_consumer_goods` (chain completion).
3. Produce **4 DEV pilot medallions/illustrations** + comparison board under `docs/design/milestones/pilot-msv-001/` (pattern from WFV/ICON pilots).
4. Write **`MILESTONE_VISUAL_IDENTITY_MSV_001_ART_CONTRACT.md`** defining grammar (achievement medallion vs detailed hero), transparency, reuse boundaries with ICON-005 outputs, and completion-state rules.
5. **Stop before** registry activation, production sync, or dashboard wiring.

#### Human visual gate

**Required:** human approval of pilot grammar + 4 concepts before any production batch or runtime activation (same gate model as WFV-001 / ICON families).

---

## 14. Explicit firewalls

No art generation in this review; no runtime/code/content/registry changes; no reopen of sealed ICON/WFV/World/WBM tracks; no commit/push/tag.

---

## 15. Final decision

## **OPTION A — NEXT MATERIAL VISUAL WORKSTREAM IDENTIFIED**

| Field | Value |
|-------|--------|
| **Workstream** | **MSV-001 — Milestone / Achievement Visual Identity** |
| **Why material** | Only enabled 8-entity domain with **zero** authored visuals and **absent** progression reward after major systems received production-quality art |
| **First bounded slice** | **4-milestone art-direction + contract pilot** (no production batch, no runtime wiring) |
| **Human gate** | Pilot grammar + concept board approval before MSV-001 production activation |

---

*End of reassessment.*
