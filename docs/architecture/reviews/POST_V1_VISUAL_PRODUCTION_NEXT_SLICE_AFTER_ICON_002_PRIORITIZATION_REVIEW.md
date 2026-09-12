# Post-V1 Visual Production — Next Slice Prioritization Review (After ICON-002 Phase 1)

**Project:** Project Genesis  
**Date:** 2026-09-10  
**Mode:** Read-only prioritization gate  
**HEAD:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`  
**Commit policy:** DO NOT COMMIT (per prompt §39)

---

## A. Executive Summary

ICON-001 (nine resource icons) and ICON-002 (six `BuildingCategory` SVG glyphs) are **CLOSED / PASS, SEALED**. The next visual slice must be a **new bounded problem**, not default extension of sealed families.

After re-scoring credible candidates against current repository evidence, the preferred next slice is:

**BR-001 — Logo / Brand Mark (bounded Phase 1: primary logomark + favicon planning)**

This advances **product/shell brand identity** — a capability neither ICON-001 nor ICON-002 addressed — with a small asset count, known consumers (splash, main menu, favicon gap), and no gameplay-semantics dependency. Production cannot start until an **art brief / requirements audit** locks composition, wordmark relationship, color treatment, and export sizes.

**Not selected:** ICON-003 (no transport-mode taxonomy); WM illustrated map / marker production (separate visual system, high scope); ICON-002 or ICON-001 consumer expansion (sealed optional work, low distinct proof); Market Widget ICON-001 integration (explicitly deferred, no new evidence).

**Decision:** **OPTION A — NEXT VISUAL SLICE SELECTED / ART BRIEF REQUIRED**

**Next gate:** **A — ART BRIEF / REQUIREMENTS AUDIT**

No implementation, art generation, backlog edits, or commits were performed.

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `730ed190bb9c3b64c426b185a32fe36528c4bda7` |
| `origin/master` | `730ed190bb9c3b64c426b185a32fe36528c4bda7` (in sync) |
| ICON-002 closeout commit present | **YES** |
| Unrelated dirty work | Preserved (M11/M12 docs, design churn, prompts, temp saves) |

### Tag integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags moved: **NO**

---

## C. Sealed Visual Baseline

| Family | Status | Scope | Proven consumers |
|--------|--------|-------|------------------|
| **ICON-001** | CLOSED / PASS, SEALED | 9 resource PNGs + runtime derivatives | Site Inventory, Warehouse Detail |
| **ICON-002** | CLOSED / PASS, SEALED | 6 `BuildingCategory` SVG glyphs | BuildingsScreen → Baukatalog |

Key commits: ICON-002 Phase 1C `8f8315f`; Phase 1D `f0ef49a`; lifecycle closeout `730ed19`.

Sealed work reopened: **NO**

Additional ICON-001/002 consumers: **OPTIONAL / DEFERRED** — not backlog defects.

---

## D. Current Visual Backlog State

Source: `docs/design/VISUAL_PRODUCTION_BACKLOG.md` (authoritative filenames; not automatic priority).

| Area | State |
|------|-------|
| ICON-001 | ☑ Phase 1 CLOSED / PASS |
| ICON-002 | ☑ Phase 1 CLOSED / PASS |
| ICON-003…010 | ☐ Planned (historical labels; semantics unresolved) |
| CH-010 | ◐ In Production — runtime SVG synced; **zero UI consumers** |
| WM-001…010, PR/RS/EC/TR/CP/RP/MAP | ☐ Planned — **zero produced files** on disk |
| BR-001…010 | ☐ Planned — registry alias to MM-006 splash only |
| MM-001/006/007 | 🚀 Integrated backgrounds |
| DB-001…010 | ☑ Approved PG references |

Lifecycle docs (`VISUAL_ASSET_CATALOG.md`, changelog) accurately reflect ICON-002 closeout. Minor stale note: registry comment may still imply ICON-002 consumer deferred — **LOW**, does not affect prioritization.

---

## E. Candidate Discovery

Credible **new independent** candidates (excluding sealed-family expansion):

| ID | Problem | Backlog label vs reality |
|----|---------|--------------------------|
| **BR-001** | Missing dedicated brand mark / favicon | `BR-001_Logo.png` — aspirational; today alias → MM-006 splash |
| **ICON-008** | Operational/construction status recognition | `ICON-008_Status.svg` — overlaps partial `DashboardIcon` set |
| **WM markers** | World map building/site identity | WM sprint — procedural circles only; separate from ICON-002 glyphs |
| **ICON-003** | Transport identity | `ICON-003_Transport.svg` — **no `TransportMode` taxonomy** in domain |
| **Per-type building art** | Building-type distinction beyond category | Catalog §6 aspirational — 23+ types, multi-state |
| **CH-010** | Chart visual language | Art exists; integration value weak |
| **ICON-001 Market** | Resource icons in market rows | Deferred — no new evidence |
| **ICON-002 consumers** | Category icons elsewhere | Art exists — optional, low distinct proof |

Rejected before scoring (hard disqualifiers):

- **ICON-003 Transport** — BLOCKED BY GAMEPLAY SEMANTICS (routes use building categories, not vehicle/mode IDs)
- **Full WM-001…010 sprint** — too broad; volatile overlay semantics; art + gameplay direction required
- **ICON-001 Market Widget** — prior deferral stands; no material new value evidence
- **ICON-002 / ICON-001 mandatory expansion** — sealed optional work, not next-slice requirement

---

## F. Candidate Granularity

| Candidate | Bounded first slice? |
|-----------|---------------------|
| BR-001 | **YES** — primary logomark (+ favicon export spec); not full BR-004…010 branding pack |
| ICON-008 | **YES** — subset e.g. production `ProductionOperationalState` (5 values) OR construction pair; not full `BuildingStatus` (8) + all screens |
| WM building markers | **YES as art brief only** — marker identity system definition; not illustrated world map sprint |
| Per-type building art | **YES as audit only** — granularity/style decision; not 23-asset production |
| ICON-003 | **NO** — taxonomy undefined |

---

## G. Candidate Consumer / Data-Flow Analysis

| Candidate | Primary consumer | User task | Data in presentation layer | Domain change needed? |
|-----------|------------------|-----------|----------------------------|------------------------|
| BR-001 | Splash (`MM-006`), main menu shell, favicon | Brand recognition at entry | Registry alias `BR-001` → MM-006 path | **NO** |
| ICON-008 (production subset) | `ProductionScreen` summary cards, job rows | Spot stalled/running production | `ProductionOperationalState` via dashboard API | **NO** |
| WM building markers | `PGWorldCanvas` building layer | Map building recognition | `WorldBuildingMarkerViewData`: label + status; **no category on marker** | **YES** for ICON-002 reuse on map |
| Per-type building art | TBD after brief | Type-level recognition | `buildingTypeId` + labels widespread | **NO** for data; **YES** for art scope |
| ICON-003 | TransportScreen, `PGSupplyChainWidget` | Logistics comprehension | Status/route/resource text only | **YES** — needs mode taxonomy |
| ICON-001 Production recipes | ProductionScreen recipe I/O | Resource recognition | `resourceId` in catalog rows | **NO** — **reuse only**, not new family |

---

## H. Candidate Value Analysis

| Candidate | Player value | Exposure | Distinct proof vs ICON-001/002 |
|-----------|--------------|----------|--------------------------------|
| BR-001 | MEDIUM — shell/brand identity | HIGH — every session entry | **HIGH** — new brand layer |
| ICON-008 (bounded) | HIGH — operational scanability | HIGH — production/ops screens | MEDIUM — state glyphs new; overlaps inline icons |
| WM marker brief | HIGH — map comprehension | HIGH — World nav screen | **HIGH** — first spatial identity system |
| Per-type art brief | HIGH — building recognition | MEDIUM–HIGH | LOW–MEDIUM — incremental over category glyphs |
| CH-010 integration | LOW | MEDIUM | LOW — decorative chart chrome |
| ICON-003 | MEDIUM (if taxonomy existed) | MEDIUM | N/A — blocked |

---

## I. Technical / Architecture Readiness

| Candidate | Readiness | Notes |
|-----------|-----------|-------|
| BR-001 | **PARTIAL** | Registry slot + preload alias exist; zero dedicated logo asset |
| ICON-008 subset | **READY** (integration) / **PARTIAL** (art contract) | Enums stable; overlap with `DashboardIcon` unresolved |
| WM marker brief | **NOT READY** (production) | Procedural SVG active; marker view-data lacks category; illustrated vs glyph undecided |
| Per-type art brief | **NOT READY** (production) | 23-type scale; illustration vs glyph undecided |
| ICON-003 | **NOT READY** | No stable icon taxonomy |
| CH-010 | **READY** (asset) / **PARTIAL** (value) | Synced; no consumer |

---

## J. Art / Semantic Readiness

| Candidate | Art-brief readiness |
|-----------|---------------------|
| BR-001 | **ART BRIEF REQUIRED** — logo form, wordmark, monochrome/color locks, favicon sizes |
| ICON-008 bounded | **ART BRIEF REQUIRED** — bounded subset + distinction from `DashboardIcon` success/error/info/check |
| WM building markers | **ART BRIEF REQUIRED** — silhouette vs category-glyph vs hybrid; zoom/selection behavior |
| Per-type buildings | **ART BRIEF REQUIRED** — illustration vs icon; first-slice count; state variants out of scope |
| ICON-003 | **BLOCKED** — define transport semantics first |

---

## K. Risk Analysis

| Candidate | Art ambiguity | Tech coupling | Gameplay coupling | Layout risk | Architecture risk | Scope-expansion risk |
|-----------|---------------|---------------|-------------------|-------------|-------------------|----------------------|
| BR-001 | **HIGH** | LOW | LOW | LOW | LOW | LOW |
| ICON-008 subset | MEDIUM | LOW | LOW | MEDIUM | LOW | MEDIUM |
| WM marker brief | **HIGH** | MEDIUM | MEDIUM | MEDIUM | MEDIUM | **HIGH** |
| Per-type art brief | **HIGH** | LOW | LOW | MEDIUM | LOW | **HIGH** |
| ICON-003 | HIGH | MEDIUM | **HIGH** | MEDIUM | MEDIUM | HIGH |

---

## L. Candidate Scoring Matrix

Weights per prompt §20 (VALUE max 100, PENALTY max 60, NET = VALUE − PENALTY).

| Candidate | Problem solved | Primary consumer | Asset scale | Format | Method | Value | Penalty | **Net** | Readiness | Next step |
|-----------|----------------|------------------|-------------|--------|--------|------:|--------:|--------:|-----------|-----------|
| **BR-001 Logo** | Brand/shell identity | Splash, menu, favicon | 1–2 | PNG (+ favicon SVG likely) | Manual/vector | 76 | 20 | **56** | PARTIAL | **Art brief** |
| ICON-008 Production ops (5) | Stall/run state scan | ProductionScreen | 5 | SVG outline | Manual/vector | 86 | 26 | **60** | PARTIAL | Art brief |
| WM building marker brief | Map building identity | PGWorldCanvas | TBD in brief | Mixed/UNDECIDED | Manual | 82 | 45 | **37** | NOT READY | Art brief |
| Per-type building brief | Type-level identity | TBD | 23 aspirational | Mixed | Manual | 68 | 40 | **28** | NOT READY | Art brief |
| ICON-003 Transport | Logistics mode identity | TransportScreen | Unknown | UNDECIDED | — | — | — | **BLOCKED** | NOT READY | Define taxonomy |
| CH-010 integration | Chart chrome | Recharts widgets | 1 | SVG | Exists | 52 | 18 | 34 | READY asset | Low priority |
| ICON-002 consumer expansion | Category scan elsewhere | Ops/Production | 0 new | Reuse | Reuse | 48 | 12 | 36 | READY art | Optional — not next slice |
| ICON-001 Market Widget | Resource in market rows | PGMarketWidget | 0 new | Reuse | Reuse | 40 | 15 | 25 | Conditional | **Still deferred** |

**Qualitative override:** ICON-008 scores higher numerically on in-session value, but **BR-001 wins** on lowest coupling to sealed families, zero gameplay/enum overlap decisions, and prior validated #2 ranking with cleaner Phase-1 boundary. WM and per-type candidates lose on scope-expansion and readiness despite high map/type recognition value.

---

## M. Hard Blockers

| Candidate | Hard blocker |
|-----------|--------------|
| ICON-003 | No `TransportMode` or vehicle taxonomy — **BLOCKED BY GAMEPLAY SEMANTICS** |
| WM-001 full sprint | Volatile overlay semantics + zero produced art + gameplay decisions — **too broad** |
| ICON-001 Market Widget | Explicit lifecycle deferral; density/coupling unchanged — **no new evidence** |
| ICON-002 / ICON-001 expansion | Sealed optional consumers — **not mandatory next slice** |
| CH-010 | No identified high-value consumer — weak ROI |

No hard blocker prevents **BR-001 art brief** from starting.

---

## N. Existing Asset Reuse

| Asset family | Reuse in candidates |
|--------------|---------------------|
| ICON-001 | Sufficient for resource identity; Production/Market need **consumer integration only**, not new art |
| ICON-002 | Sufficient for category identity; Baukatalog proven; map/list reuse needs **mapper/view-data work** — separate from new family selection |
| DashboardIcon | Partial status/severity coverage — **ICON-008 must not duplicate** without brief |
| MM-006 splash | Temporary stand-in for BR-001 alias — **not a production logo** |
| PGWorldCanvas procedural SVG | World layer infrastructure exists; **marker art is additive**, not replacement |

Unnecessary duplicate family avoided by selecting **BR-001** over ICON-008 (which risks overlapping inline status icons).

---

## O. Winner

| Field | Value |
|-------|-------|
| **Candidate** | **BR-001 — Logo / Brand Mark (bounded Phase 1)** |
| **Player problem** | “What product/brand am I playing?” — consistent identity at splash, menu, and browser chrome |
| **Primary consumer** | Main menu splash background area (`MM-006` consumer path), shell/header branding, favicon |
| **Semantic family** | Single primary logomark (wordmark lockup relationship decided in brief) |
| **Estimated asset count** | **1–2** (primary mark; favicon export specification) |
| **Likely format** | **PNG** master (+ derived favicon sizes; optional SVG mark if brief selects vector-first) |
| **Likely production method** | **MANUAL / VECTOR** (human design-tool work; not AI illustration pipeline) |
| **Technical readiness** | PARTIAL — registry placeholder exists |
| **Art-brief readiness** | **ART BRIEF REQUIRED** |
| **Gameplay coupling** | **NONE** |
| **Architecture risk** | **LOW** |
| **Scope risk** | **LOW** (if bounded to logo only) |

---

## P. Winner Slice Boundary

### INCLUDED

- Primary logomark definition (symbol/mark)
- Relationship to “Project Genesis” wordmark (integrated vs separate — brief decision)
- Color/mono variants sufficient for splash + small-size favicon
- Export size specification for favicon and header use
- Registry path plan for `BR-001` (replace MM-006 alias)

### EXCLUDED

- Full BR-002…010 branding pack (splash redesign, marketing, Steam capsule)
- ICON-003…010 production
- WM illustrated map sprint
- Per-building-type artwork
- ICON-002 / ICON-001 consumer expansion
- UI redesign or navigation icon replacement (ICON-006)
- Gameplay/domain/API changes

### FIRST CONSUMER (post-art, future slice)

Main menu / splash shell — not authorized in this review.

### KNOWN RISKS

- Art direction undefined (`ART_DIRECTION.md` / logo spec incomplete per graphics audit)
- Confusion with MM-006 photographic splash if not separated clearly
- Scope creep into full Sprint 13 branding pack

### OPEN QUESTIONS

- Wordmark-only vs symbol-only vs combined lockup?
- Monochrome requirement for favicon vs full-color splash usage?
- SVG vs PNG authoritative master?

### NEXT GATE

**ART BRIEF / REQUIREMENTS AUDIT** for BR-001 bounded Phase 1.

---

## Q. Recommended Next Gate

**A — ART BRIEF / REQUIREMENTS AUDIT**

Do not authorize logo production until brief closes: composition rules, wordmark policy, color locks, minimum sizes, and consumer placement.

---

## R. Deferred Candidates

| Candidate | Reason deferred |
|-----------|-----------------|
| ICON-008 operational status subset | Strong #2; overlaps `DashboardIcon`; brief needed to bound subset — viable **after BR-001** or if brand brief blocked |
| WM building marker art brief | High map value; high scope/semantic risk; category not on marker view-data |
| Per-type building art brief | Valid future work; 23-scale risk; category glyphs already prove category layer |
| ICON-003 Transport | Blocked — no mode taxonomy |
| ICON-001 Market Widget | Lifecycle deferral unchanged |
| ICON-002 optional consumers | Sealed optional — Production/Ops/world list |
| CH-010 chart integration | Art done; consumer value weak |
| MM-002–005 panel PNG rollout | Reference-only policy; layout/density risk |

---

## S. Repository Integrity

| Check | Result |
|-------|--------|
| Task-owned change | `POST_V1_VISUAL_PRODUCTION_NEXT_SLICE_AFTER_ICON_002_PRIORITIZATION_REVIEW.md` only |
| Code changed | **NO** |
| Assets changed | **NO** |
| Tests changed | **NO** |
| Lifecycle docs changed | **NO** |
| Commits created | **NO** |
| Pushed | **NO** |
| Tags moved | **NO** |

---

## T. Final Decision

# **OPTION A — NEXT VISUAL SLICE SELECTED / ART BRIEF REQUIRED**

**Winner:** BR-001 — Logo / Brand Mark (bounded Phase 1)

**Next gate:** Art brief / requirements audit — do not implement in this review.

---

# Post-V1 Visual Production — Next Slice After ICON-002
## Execution Summary

### Baseline

- **Branch:** `master`
- **HEAD:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- **origin/master:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- **ICON-002 closeout commit present:** YES
- **Unrelated working tree:** YES (preserved)
- **v1.0.0:** `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- **v1.0.0-rc.1:** `442665cd6437bdebff88fd1540cedc689238c240`
- **Tags moved:** NO

### Sealed Work

- **ICON-001:** CLOSED / PASS, SEALED
- **ICON-002:** CLOSED / PASS, SEALED
- **Sealed work reopened:** NO

### Candidate Count

- **Credible candidates scored:** 4 (BR-001, ICON-008 subset, WM marker brief, per-type building brief)
- **Rejected before scoring:** ICON-003 (semantics), full WM sprint (scope), ICON-001 Market (deferral), sealed-family expansion (policy)
- **Reason:** Hard blockers or sealed-work extension policy

### Ranked Candidates

1.
- **candidate:** BR-001 Logo / brand mark
- **value:** 76
- **penalty:** 20
- **net:** **56**
- **readiness:** PARTIAL
- **blocker:** none — art direction required
- **next-step type:** A — ART BRIEF

2.
- **candidate:** ICON-008 Production operational states (bounded ~5 glyphs)
- **value:** 86
- **penalty:** 26
- **net:** **60**
- **readiness:** PARTIAL
- **blocker:** overlap with DashboardIcon — brief required
- **next-step type:** A — ART BRIEF

3.
- **candidate:** World map building marker art brief
- **value:** 82
- **penalty:** 45
- **net:** **37**
- **readiness:** NOT READY
- **blocker:** scope + marker view-data + illustrated vs glyph undecided
- **next-step type:** A — ART BRIEF (later)

4.
- **candidate:** Per-building-type art brief (audit)
- **value:** 68
- **penalty:** 40
- **net:** **28**
- **readiness:** NOT READY
- **blocker:** 23-type scale; incremental over ICON-002
- **next-step type:** A — ART BRIEF (later)

### Winner

- **candidate:** BR-001 — Logo / Brand Mark (bounded Phase 1)
- **player problem:** Consistent product/brand identity at shell entry points
- **primary consumer:** Splash / main menu shell, favicon (future integration)
- **semantic family:** Primary logomark (+ wordmark relationship TBD in brief)
- **estimated asset count:** 1–2
- **likely format:** PNG master (+ favicon derivatives; SVG optional per brief)
- **likely production method:** MANUAL / VECTOR
- **technical readiness:** PARTIAL
- **art-brief readiness:** ART BRIEF REQUIRED
- **gameplay coupling:** NONE
- **architecture risk:** LOW
- **scope risk:** LOW (if bounded)

### Winner Boundary

**Included:** primary logomark definition, wordmark relationship decision, favicon/export specs, registry plan for BR-001.

**Excluded:** full branding sprint, WM/map art, per-type building art, ICON-003…010, sealed-family consumer expansion, gameplay changes.

### Existing Asset Reuse

- **ICON-001 reuse:** Not winner scope — remains sealed for resource contexts
- **ICON-002 reuse:** Not winner scope — category glyphs remain sealed
- **Other existing assets:** MM-006 splash currently aliases BR-001 — placeholder only
- **Unnecessary duplicate family avoided:** Yes — did not select ICON-008 overlap or ICON-003 blocked taxonomy

### Required Next Gate

**A — ART BRIEF / REQUIREMENTS AUDIT**

### Deferred

- **ICON-008 subset:** Strong operational value; defer until after BR brief or if brand blocked
- **WM markers:** High map value; scope/semantics not ready
- **Per-type building art:** Future optional; category layer sufficient for Phase 1 building identity
- **ICON-003:** Blocked — no transport mode taxonomy
- **Market / sealed expansions:** Prior deferral / optional policy unchanged

### Repository Integrity

- **Report created:** YES
- **Code changed:** NO
- **Assets changed:** NO
- **Tests changed:** NO
- **Lifecycle docs changed:** NO
- **Commits created:** NO
- **Pushed:** NO
- **Tags moved:** NO

### Final Decision

**OPTION A**
