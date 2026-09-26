# Milestone Visual Identity — MSV-001 Art Contract

**Status:** `APPROVED / PRODUCTION AUTHORITY`  
**Workstream:** MSV-001 — Milestone / Achievement Visual Identity (Scenario B)  
**Authority:** `POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_ART_DIRECTION_CONTRACT_PILOT.md` · `POST_V1_MSV_001_FIRST_PROFIT_FINAL_PILOT_REPAIR_HUMAN_GATE_CLOSEOUT.md` · `POST_V1_SCENARIO_B_VISUAL_COVERAGE_REASSESSMENT_AFTER_WFV_001.md`

This document is **production authority** for MSV-001 runtime milestone visuals (8/8 Tier-1 + Tier-2, state-neutral UI treatment).

**Production activation:** 2026-09-26 — `POST_V1_MSV_001_MILESTONE_ACHIEVEMENT_VISUAL_IDENTITY_PRODUCTION_COMPLETION_4_TO_8.md` (4 pilot primaries promoted + 4 new primaries authored; manifest `docs/design/milestones/icon-msv-001/MSV_001_PRODUCTION_MANIFEST.json`).

---

## Human gate (2026-09-20)

| Decision | Outcome |
|----------|---------|
| Art direction | **APPROVED** — stylized industrial achievement vignette + octagonal frame |
| Tier model | **APPROVED** — Tier-1 primary + Tier-2 derived medallion |
| `first_production` | **PASS** (unchanged) |
| `first_steel` | **PASS** (unchanged) |
| `first_consumer_goods` | **PASS** (unchanged) |
| `first_profit` (original) | **REVISE** — baked readable text `FIRST PROFITABLE SALE` (contract violation) |
| `first_profit` (repaired) | **PASS / SEALED** — text-free repair promoted to production |
| 8/8 scalability | **VIABLE** with special care for `first_profit` / `profit_100` |

---

## 1. Purpose

MSV-001 provides **authored achievement visuals** for enabled game milestones so progression reads as **reward and accomplishment**, not as another resource, building, technology, process, or workforce portrait.

Runtime today: **8/8** production milestone art (`PGMilestonesWidget` + `MilestoneVisual` resolver).

---

## 2. Semantic boundary

Milestones answer:

> What significant industrial or economic accomplishment has the player achieved?

MSV-001 must **not** become:

- ICON-001 commodity icons in a frame  
- ICON-003 building catalog art  
- ICON-004 technology apparatus  
- ICON-005 recipe/process primaries  
- WFV-001 portraits  
- Generic dashboard glyphs, trophies, stars, ribbons, or mobile-game popup chrome  

---

## 3. Relationship to sealed families

| Family | Allowed | Forbidden |
|--------|---------|-----------|
| ICON-001 | Material cues (e.g. steel texture) inside accomplishment composition | Flat resource icon + decorative border only |
| ICON-003 | Distant contextual silhouettes when trigger is building-linked | Milestone reads as building type card |
| ICON-004 | — | Apparatus-on-base as dominant grammar |
| ICON-005 | Motifs of industrial action/result | Reuse of recipe primary PNG |
| WFV-001 | — | Portrait-first milestone language |

---

## 4. Primary-art grammar (Tier 1 — Achievement Primary)

**Target surfaces:** milestone detail, completion/reward presentation, future progression panel.

**Master:** ~1024×1024 RGBA, production-quality stylized industrial realism.

**Composition:** **Stylized industrial achievement vignette** inside a restrained **octagonal industrial frame** (brushed metal, subtle inner glow). Center weight on **accomplishment payoff**, not isolated catalog object.

**Palette:** steel blue, charcoal, muted warm metallurgy accents; restrained orange safety highlights where appropriate.

**Scale targets:** readable at **96px**; rewarding at **128–256px**.

---

## 5. Compact-medallion grammar (Tier 2)

**Target surfaces:** KPI strip, milestone lists, toasts/notifications (~**48–64px** primary; **32px** diagnostic).

**Pilot finding:** **Option A — derived medallion** from Tier-1 primary (512×512 master) with strengthened octagonal frame ring and tighter crop — preserves family coherence without four separate symbolic redraws.

Dedicated symbolic compacts (Option B) remain allowed for production if human review finds derivation too noisy at 48px.

---

## 6. Camera / composition rules

- Single achievement focal cluster; max two depth layers.  
- Strong central silhouette for small-scale legibility.  
- No isometric building-catalog framing.  
- No readable text, numbers, progress bars, or “completed” labels baked into art.

---

## 7. Transparency / background policy

- Masters use RGBA; prefer soft edge integration on dark UI plates.  
- No checkerboard baked into opaque regions.  
- Locked/completed states use **UI treatment**, not duplicate PNG masters (see §11).

---

## 8. No-text / no-logo rule

Reject/regenerate assets containing pseudo-text, logos, milestone names, percentages, or UI labels.

**QA policy:** Automated checks (dimensions, alpha, decode) do **not** satisfy the no-text contract. Each pilot primary requires **manual visual no-text review** recorded in `MSV_001_PILOT_ALPHA_REPORT.json` → `manualNoTextReview`.

---

## 9. Generated-art QA

Pilot tooling: `tools/compose-msv-001-art-direction-evidence.mjs` + `MSV_001_PILOT_ALPHA_REPORT.json`.

Checks: dimensions, decode, checkerboard suspicion, cross-milestone duplication, compact readability at 48/64px.

---

## 10. Semantic honesty

Art must match **authoritative milestone triggers** in `game-content/milestones/*.yaml`. Do not depict mechanics absent from triggers (e.g. vehicle fleets, unsupported finance fantasy).

---

## 11. Completion-state treatment (future runtime)

| State | Treatment |
|-------|-----------|
| **LOCKED** | CSS/modulate: reduced saturation (~35%), reduced brightness (~72%), frame unchanged |
| **COMPLETED** | Full-color art + optional restrained highlight on frame |

No separate locked/completed PNG families unless a future pilot proves unavoidable.

---

## 12. Reuse policy

Pilot assets under `docs/design/milestones/pilot-msv-001/` and `assets/MSV-001-*-primary-pilot.png` are **DEV only**. Promotion to production requires new paths:

`MSV-001-{milestoneId}-primary.png`  
`MSV-001-{milestoneId}-medallion.png` (if Tier-2 ships)

---

## 13. Production naming convention (future)

- Primary: `MSV-001-{milestoneId}-primary`  
- Medallion: `MSV-001-{milestoneId}-medallion`  
- Registry component (future): `MilestoneVisual` (conceptual — **not activated** in this pilot)

---

## 14. Fallback concept (future)

Unknown milestone ID → generic industrial achievement medallion (single shared compact) + optional text label from content — **not** ICON-002/003/004/005 reuse.

---

## 15. All-8 scalability assessment

| Milestone ID | Class | Primary motif | Compact motif | Differentiation risk | Production recommendation |
|--------------|-------|---------------|---------------|----------------------|---------------------------|
| `first_production` | SAFE_DETAILED | First output / line activation | Derived medallion | Low vs recipe milestones | Produce after seal |
| `first_steel` | SAFE_DETAILED | Metallurgical payoff | Derived medallion | Medium vs ICON-001 steel | Produce after seal |
| `first_machine_parts` | SAFE_WITH_SHARED_GRAMMAR | Precision parts accomplishment | Shared frame, parts motif | Medium vs other recipe milestones | Batch after pilot seal |
| `first_industrial_machinery` | SAFE_WITH_SHARED_GRAMMAR | Assembly/machinery payoff | Shared grammar | Medium vs machine_parts | Batch after pilot seal |
| `first_advanced_electronics` | SAFE_WITH_SHARED_GRAMMAR | Advanced electronics payoff | Shared grammar | Medium vs consumer_goods | Batch after pilot seal |
| `first_consumer_goods` | SAFE_DETAILED | Value-chain culmination | Derived medallion | Low vs first_production | Produce after seal |
| `first_profit` | ABSTRACT_BUT_DEPICTABLE | Industrial economic success metaphor | Derived medallion | **High** — abstract trigger | Pilot first; human review required |
| `profit_100` | ABSTRACT_BUT_DEPICTABLE | Sustained sales / scale of success | Shared grammar | Medium vs first_profit | Special handling; avoid duplicate “profit” art |

**Scalability verdict:** MSV-001 can cover **8/8** without inventing mechanics, provided abstract profit milestones use **distinct metaphors** and shared frame grammar prevents near-duplicates among recipe-linked milestones.

---

## 16. Version history

| Version | Date | Status |
|---------|------|--------|
| Pilot v1 | 2026-09-20 | 4 Tier-1 + 4 Tier-2 pilots — human review: art direction **APPROVED**; `first_profit` **REVISE** (baked text) |
| Pilot v1 — first_profit repair | 2026-09-20 | Text removed; blank nameplate; medallion re-derived — **FINAL HUMAN CLOSEOUT PENDING** |

---

*No production resolver activation. No runtime wiring.*
