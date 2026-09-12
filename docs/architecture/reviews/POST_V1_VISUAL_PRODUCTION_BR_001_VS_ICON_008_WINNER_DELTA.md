# Post-V1 Visual Production — BR-001 vs ICON-008 Winner Selection Delta

**Project:** Project Genesis  
**Date:** 2026-09-10  
**Mode:** Read-only decision delta  
**Baseline HEAD:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`  
**Parent review:** `POST_V1_VISUAL_PRODUCTION_NEXT_SLICE_AFTER_ICON_002_PRIORITIZATION_REVIEW.md`

---

## 1. Purpose

The parent prioritization review accepted full candidate discovery but selected **BR-001** over **ICON-008** despite ICON-008 scoring higher numerically (Net 60 vs 56). This delta re-examines only those two candidates against current repository evidence and determines whether that qualitative override was justified.

**Scope locked out:** ICON-001, ICON-002, ICON-003, World Map, per-building-type art, Market, CH-010.

---

## 2. BR-001 Re-check

### Current consumers and placeholders

| Surface | Asset / branding today | BR-001 involvement |
|---------|------------------------|-------------------|
| `SplashScreen.tsx` | `PGVisualAssetBackground assetId="MM-006"` (full-bleed splash photo) + text overlay (`Project Genesis`, tagline) | **None rendered** — uses MM-006 directly |
| `MainMenuScreen.tsx` / `MainMenuHome.tsx` | `PGVisualAssetBackground assetId="MM-001"` + text block `.pg-main-menu-brand` (`<h1>Project Genesis</h1>`) | **None rendered** |
| `MenuLoadingScreen.tsx` | `MM-007` background | None |
| `GameWorkspaceShell.tsx` header | Text eyebrow `Project Genesis · {screenLabel}` | None |
| `ApplicationShell.tsx` | No header brand slot | None |
| `layout.tsx` metadata | `title: 'Project Genesis'` only | No `icons` / favicon metadata |
| `apps/web/public/` | No root `favicon.ico`, `icon.png`, or `apple-touch-icon` | **Absent** |

### Registry state

`visual-asset-registry.ts` defines `BR-001` with:

- `path` / `webp` → **same files as MM-006** (`/assets/main-menu/MM-006.{png,webp}`)
- `preload: true` (preloads splash background bytes, not a discrete logomark)
- `component: 'SplashScreen'`
- Note: *"Brand mark sourced from splash art until dedicated logo asset exists."*

**Finding:** BR-001 is a **registry alias / preload hook**, not a dedicated logo asset. No `PGVisualAssetImage` call site references `BR-001`. The splash photo is a scenic background, not an extracted logomark.

### Dedicated logo absence

**Confirmed:** A visible dedicated logo mark is **genuinely absent**. Brand presence is **typography-only** on menu/splash and **text eyebrow** in the in-game workspace header.

### Exposure and player value

| Dimension | Assessment |
|-----------|------------|
| Session exposure | **MEDIUM** — splash (brief boot), main menu (each session start); **zero** during gameplay workspace |
| Product identity | **MEDIUM–HIGH** — shell polish, browser tab identity (once favicon added) |
| In-game task clarity | **LOW** — logo does not aid production/logistics/build decisions |
| Gameplay usefulness | **LOW** |

This is primarily **product branding**, not gameplay UI information value.

### First consumer (precise)

**Primary Phase-1 consumer:** `MainMenuHome` → `.pg-main-menu-brand` (add `PGVisualAssetImage assetId="BR-001"` above or beside existing `<h1>`).

**Secondary (same slice boundary):** `layout.tsx` favicon metadata + exported favicon files derived from the same mark.

**Not the first consumer:** MM-006 full-bleed background — that is a **background photograph**, not a logo placement. Replacing MM-006 with a logo would conflate two asset roles.

### Layout work required

**YES — small, bounded:**

- Menu brand block layout (mark + optional wordmark text)
- Favicon/metadata wiring
- Registry path update (stop aliasing MM-006)

No gameplay/API/domain change.

### Art risk

**HIGH** — wordmark vs symbol, color vs monochrome favicon, relationship to existing MM-006 photography, and minimum-size legibility are all unresolved (`ART_DIRECTION.md` does not lock logo composition).

---

## 3. ICON-008 Re-check

### Authoritative semantic family

**Source:** `ProductionOperationalState` in `GameSessionDashboard.ts` (derived in `GameSession.#resolveProductionOperationalState`).

| Value | Derivation (stable) |
|-------|---------------------|
| `WAITING` | Job status WAITING |
| `RUNNING` | Job RUNNING with energy + workforce available |
| `FINISHED` | Job status FINISHED |
| `STALLED_ENERGY` | Job RUNNING but recipe energy unaffordable |
| `STALLED_WORKFORCE` | Job RUNNING but worker efficiency ≤ 0 |

**Gameplay/domain change required:** **NO** — enum is authoritative and already exposed via session read models and API DTOs.

### Where states appear today

| Consumer | Presentation |
|----------|--------------|
| `ProductionScreen.tsx` | Six summary **cards** with German titles (`Energie fehlt`, `Keine Mitarbeiter`, `Laufend`, `Wartend`, `Abgeschlossen`) + numeric counts; job table **`statusLabel` text**; factory groups **`statusLabel` text**; `ProductionProgressCell` for percent |
| `PGProductionWidget.tsx` | Dashboard widget rows — **`statusLabel` text** only |
| `company-dashboard-view-mappers.ts` / `workspace-view-mappers.ts` | `formatProductionStatus(...)` → localized strings (`Energie fehlt`, `Keine Mitarbeiter`, `Wartet auf Transport`, etc.) |
| Detail panels | Key/value status entries — text |

**No operational-state icons anywhere** in production surfaces.

### Bounded Phase-1 proposal (ICON-008)

| Field | Value |
|-------|-------|
| Semantic family | `ProductionOperationalState` (5 values) |
| Asset count (if new family) | Up to **5** SVG outline glyphs |
| Format | Inline SVG (`currentColor`), consistent with `DashboardIcon` / ICON-002 pattern |
| First consumer | `ProductionScreen` — summary cards and/or job table **Status** column |
| Read-model/API change | **None** — `operationalState` already on job rows |

**Excluded from Phase 1:** full `BuildingStatus`, construction UI, transport/research status, world map overlays.

---

## 4. DashboardIcon Overlap Test

`DashboardIcon` (`DashboardIcon.tsx`) defines: `cash`, `energy`, `transport`, `warehouse`, `onsite`, `employees`, `success`, `error`, `info`, `check`.

**Runtime usage today:** only `PGTutorialPanel.tsx` (`success`, `check`). **Zero** production-screen usage.

| `ProductionOperationalState` | Classification | Rationale |
|------------------------------|----------------|-----------|
| `WAITING` | **C — TEXT / STATUS STYLE** | Dedicated summary card *Wartend* + labels like *Wartet auf Transport*; progress bar conveys activity; `info` would be generic |
| `RUNNING` | **C — TEXT / STATUS STYLE** | *Laufend* card + `%` progress cell; no production icon today and no proven scanability gap |
| `FINISHED` | **A — DashboardIcon ADEQUATE** | `success` / `check` glyphs exist and fit semantically; not integrated in production UI |
| `STALLED_ENERGY` | **A — DashboardIcon ADEQUATE** | `energy` glyph exists; stall cause already explicit in text *Energie fehlt* and summary card title |
| `STALLED_WORKFORCE` | **A — DashboardIcon ADEQUATE** | `employees` glyph exists; text *Keine Mitarbeiter* and summary card already distinct |

### Summary

| Category | Count |
|----------|------:|
| A — Already adequately represented by DashboardIcon (if integrated) | **3** |
| B — Semantically distinct — new icon justified | **0** |
| C — Should remain text / status style | **2** |

**States genuinely needing new art:** **0** for a justified ICON-008 production slice.

**Strongest operational need** (stall detection) is already served by:

1. Explicit German `statusLabel` strings from `formatProductionStatus`
2. Dedicated stall summary cards with counts on `ProductionScreen`

New ICON-008 glyphs would largely **duplicate** existing `DashboardIcon` vocabulary or **redundant text**, not introduce a missing visual system.

---

## 5. Brand Value Test (BR-001)

| Dimension | Rating |
|-----------|--------|
| Player task clarity | **LOW** |
| Session exposure | **MEDIUM** (menu/splash; not in-game) |
| Product identity | **HIGH** |
| Visual-system advancement | **HIGH** (only candidate adding a true brand-mark layer) |
| Immediate gameplay usefulness | **LOW** |

**Conclusion:** BR-001 is **HIGH** product-branding value and **LOW–MEDIUM** in-game information/decision value. These must not be treated as equivalent; the missing dedicated logomark is real, but it does not improve operational comprehension.

---

## 6. Re-score (Same Model as Parent Review)

Model: VALUE max 100; PENALTY max 60; NET = VALUE − PENALTY.

### BR-001

| VALUE component | Score | Evidence |
|-----------------|------:|----------|
| Player-facing value | 10 | Branding polish; no gameplay decision support |
| Exposure/frequency | 11 | Splash + main menu each session; absent in workspace |
| Visual clarity improvement | 5 | Text brand already readable; logo refines identity |
| Distinct visual-system proof | 14 | Genuinely new asset class (no duplicate family) |
| Architecture reuse | 8 | Registry + `PGVisualAssetImage` + preload infrastructure |
| Semantic readiness | 3 | Logo composition undefined |
| Consumer readiness | 3 | No render call site; brief must pick menu vs favicon-first |
| **VALUE** | **54** | |

| PENALTY component | Score | Evidence |
|-------------------|------:|----------|
| Art ambiguity | 9 | Wordmark/symbol/color/favicon subjective |
| Technical coupling | 2 | Presentation-only |
| Gameplay coupling | 0 | None |
| Responsive/layout risk | 2 | Favicon small-size legibility |
| Scope-expansion risk | 2 | Bounded if limited to mark + favicon |
| Production cost | 3 | 1–2 assets |
| **PENALTY** | **18** | |

| **NET** | **36** |

*Prior review: Value 76, Penalty 20, Net 56 — overstated consumer readiness and player-facing value given zero logo call sites and typography-only brand.*

### ICON-008 (bounded ProductionOperationalState)

| VALUE component | Score | Evidence |
|-----------------|------:|----------|
| Player-facing value | 17 | Stall/run comprehension is real but partially solved |
| Exposure/frequency | 13 | ProductionScreen + dashboard widget during ops play |
| Visual clarity improvement | 7 | Text + summary cards already differentiate states |
| Distinct visual-system proof | 3 | Heavy overlap with existing `DashboardIcon` set |
| Architecture reuse | 6 | Could reuse `DashboardIcon` without new assets |
| Semantic readiness | 9 | Enum stable and derived authoritatively |
| Consumer readiness | 9 | `operationalState` already in view mappers |
| **VALUE** | **64** | |

| PENALTY component | Score | Evidence |
|-------------------|------:|----------|
| Art ambiguity | 7 | Must resolve overlap vs new glyphs |
| Technical coupling | 2 | Presentation-only |
| Gameplay coupling | 0 | None |
| Responsive/layout risk | 3 | Table/status column density |
| Scope-expansion risk | 8 | Easy creep to all status domains |
| Production cost | 8 | Five glyphs mostly redundant with DashboardIcon + text |
| **PENALTY** | **28** | |

| **NET** | **36** | |

*Prior review: Value 86, Penalty 26, Net 60 — understated DashboardIcon overlap and redundant-art cost.*

**Numeric tie at Net 36.**

---

## 7. Qualitative Override Analysis

### Was the parent override justified?

**Partially — correct winner, weak stated reasons.**

The parent cited *"lowest coupling to sealed families"*, *"prior validated #2 ranking"*, and *"avoid DashboardIcon overlap"*. Current evidence shows:

| Parent reason | Verdict |
|---------------|---------|
| Lowest coupling | **Valid** — BR-001 has zero enum/icon vocabulary overlap |
| Prior ranking | **Invalid alone** — not sufficient per delta instructions |
| Avoid DashboardIcon overlap | **Misstated** — overlap means ICON-008 is **redundant**, not that BR-001 avoids a conflict BR-001 does not have |

### Override required for this delta?

**YES** — to break the **36 vs 36 tie**.

| Field | Value |
|-------|-------|
| **Omitted scoring factor** | **Duplicate iconography / integration-vs-production distinction** |
| **Why it matters** | Post-V1 *visual production* slices should advance a **missing asset class**. ICON-008 would produce up to five new glyphs when three states map to existing `DashboardIcon` glyphs and two are adequately served by authoritative text + summary cards. The higher-value near-term fix for production scanability is **DashboardIcon integration** (code-only), not a new ICON-008 art family. |
| **Why strong enough to reverse** | ICON-008 fails the stated winner rule to **minimize duplicated iconography** and maximize **distinct visual-system advancement**. BR-001 is the only candidate adding a genuinely absent visual layer (dedicated logomark + favicon). |

Without this factor, numeric scoring alone would not cleanly separate tied candidates.

---

## 8. Winner Rule Application

| Criterion | BR-001 | ICON-008 |
|-----------|--------|----------|
| Player-facing value (in-session) | Lower | Higher |
| Boundedness | **Strong** (1–2 assets) | Medium (5 glyphs, creep risk) |
| Semantic stability | N/A (no semantics) | **Strong** |
| Clean first consumer | Medium (layout brief needed) | **Strong** (`ProductionScreen`) |
| Distinct visual-system advancement | **Strong** | **Weak** (duplicates DashboardIcon) |
| Minimize duplicated iconography | **Strong** | **Fails** |
| Subjective art ambiguity | Higher | Medium |

**Winner:** **BR-001** — only candidate that adds a missing visual-system layer without redundant glyph production.

---

## 9. Next Gate

**ART BRIEF / REQUIREMENTS AUDIT** for BR-001 bounded Phase 1:

- Primary logomark form (symbol / wordmark / lockup)
- Monochrome favicon vs color menu usage
- Exact first consumer: `MainMenuHome.pg-main-menu-brand` + favicon exports
- Explicit separation from MM-006 background photography
- Export sizes and registry path (replace MM-006 alias)

**Do not authorize logo production in this delta.**

**Note for deferred ICON-008 path:** If operational iconography is revisited, first run a **bounded integration audit** (reuse `DashboardIcon` + text before any new ICON-008 art).

---

## 10. Repository Integrity

| Check | Result |
|-------|--------|
| Report only | **YES** — this file only |
| Code changed | **NO** |
| Assets changed | **NO** |
| Lifecycle docs changed | **NO** |
| Commit | **NO** |
| Push | **NO** |
| Tags moved | **NO** |

---

# BR-001 vs ICON-008 — Winner Selection Delta

### BR-001

- **exact problem:** No dedicated product logomark; brand is typography-only on menu/splash and text eyebrow in workspace; browser favicon absent.
- **exact consumer:** `MainMenuHome` → `.pg-main-menu-brand` (primary); `layout.tsx` favicon metadata (secondary, same slice).
- **existing placeholder/reuse:** `BR-001` registry entry aliases **MM-006 splash background paths**; preloaded but **never rendered** via `PGVisualAssetImage`.
- **player-task value:** **LOW** — does not improve in-game decisions.
- **brand value:** **HIGH** (product identity) / **LOW** (gameplay UI).
- **exposure:** **MEDIUM** — splash + main menu each session; none in gameplay workspace.
- **art ambiguity:** **HIGH** — logo form, wordmark, color/mono favicon unresolved.
- **implementation coupling:** **LOW** — presentation + registry path only; small layout work.
- **value:** 54
- **penalty:** 18
- **net:** **36**

### ICON-008

- **exact problem:** Production jobs expose five operational states, but UI uses text labels and summary cards only — no state glyphs.
- **exact consumer:** `ProductionScreen` (summary cards and/or job table Status column); also `PGProductionWidget` rows.
- **exact semantic states:** `WAITING`, `RUNNING`, `FINISHED`, `STALLED_ENERGY`, `STALLED_WORKFORCE`.
- **DashboardIcon overlap:** **3 of 5** adequately covered by existing `energy`, `employees`, `success`/`check`; **2 of 5** should remain text/progress (`WAITING`, `RUNNING`).
- **states genuinely needing new art:** **0** (integration of existing icons + text suffices before any new family).
- **player-task value:** **MEDIUM–HIGH** for stall awareness, but **partially already solved** by German status strings and stall summary cards.
- **exposure:** **HIGH** during production management sessions.
- **art ambiguity:** **MEDIUM** — mainly overlap-resolution, not greenfield semantics.
- **implementation coupling:** **LOW** — view data ready; no API/domain change.
- **gameplay/domain change required:** **NO**
- **value:** 64
- **penalty:** 28
- **net:** **36**

### Qualitative Override

- **required:** **YES** (break 36–36 tie)
- **omitted scoring factor:** Duplicate iconography / integration-vs-production distinction — ICON-008 art would redundant with `DashboardIcon` and text UI; visual production should target missing asset classes first.
- **justification:** ICON-008 fails winner-rule minimization of duplicated iconography and distinct visual-system advancement despite higher raw operational value; BR-001 addresses a genuinely absent brand-mark layer.

### Winner

**BR-001**

### Required Next Gate

**ART BRIEF / REQUIREMENTS AUDIT**

### Repository Integrity

- **report only:** YES
- **code changed:** NO
- **assets changed:** NO
- **lifecycle docs changed:** NO
- **commit:** NO
- **push:** NO
- **tags moved:** NO

### Final Decision

**OPTION A — BR-001 SELECTED**

---

**Parent inconsistency resolution:** The prior qualitative override reached the **correct winner (BR-001)** but for **partly incorrect reasons** (especially treating DashboardIcon overlap as a BR-001 advantage rather than an ICON-008 disqualifier). This delta replaces that rationale with repository-backed evidence: **ICON-008 is not justified as the next visual-production art slice** until an integration audit proves DashboardIcon + text are insufficient.
