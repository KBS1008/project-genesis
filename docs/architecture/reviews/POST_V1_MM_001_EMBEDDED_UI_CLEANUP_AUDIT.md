# MM-001 — Embedded UI Cleanup Audit

**Project:** Project Genesis  
**Date:** 2026-09-13  
**Mode:** Read-only visual / consumer / architecture audit  
**Precedent (closed, not reopened):** MM-006 menu-free replacement; BR-001 Phase 1; ICON-001 / ICON-002  

---

## A. Executive Summary

**MM-001** is registered and implemented as a **full-bleed scenic main-menu background** (`PGVisualAssetBackground`, `background-size: cover`), but the authoritative PNG is a **complete English UI mockup**: left sidebar navigation, top utility bar, news widget, social icons, product wordmark, and version footer—all **non-interactive pixels**.

**MainMenuHome** independently renders the real **German** menu (six actions), **BR-001**, and the **Project Genesis** heading. Removing artwork UI would **not** remove functionality.

**Classification:** **C — BACKGROUND WITH CLEAR EMBEDDED FAKE/DECORATIVE UI**

Desktop and narrow runtime both show **duplicate menu impression** and **English/German competing text**. Cleanup is **justified** and aligns with registry notes (“Decorative background only — UI text rendered in React”) and MM-006 architectural precedent.

**Final recommendation:** **OPTION B — MM-001 — MENU-FREE BACKGROUND REPLACEMENT RECOMMENDED**

**Image-production route:** **NEW GENERATION** (UI-free scenic master); deterministic resize to **1536×1024** if candidate aspect differs—same pipeline as MM-006, **not** reusing MM-006 artwork.

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `517b1e51e51068ac0daffeccee0761d405d5816d` |
| `git fetch origin` | **FAILED** — `EPERM: cannot open '.git/FETCH_HEAD'` (environment) |
| Local `origin/master` ref | `730ed190bb9c3b64c426b185a32fe36528c4bda7` (**likely stale**; MM-006 closeout documented remote at `517b1e5`) |
| HEAD == origin/master (local refs) | **NO** |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |
| Implementation in this task | **NONE** |

---

## C. Current MM-001 Contract

| Field | Value |
|-------|-------|
| **Asset ID** | `MM-001` |
| **Semantic role** | Main menu **decorative full-bleed background** (not interactive shell) |
| **Authoritative source** | `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png` |
| **Format** | PNG (runtime PNG + WebP) |
| **Dimensions** | **1536 × 1024** (3∶2) |
| **Aspect ratio** | 1.50∶1 |
| **Alpha** | No |
| **Source SHA-256** | `3aa69cd973aa7ff5099887a39e5aa5ff38093906e8c8819c2f05ea32d33753e8` |
| **Runtime PNG** | `apps/web/public/assets/main-menu/MM-001.png` — same hash (byte-identical) |
| **Runtime WebP** | `apps/web/public/assets/main-menu/MM-001.webp` — SHA-256 `2ccdc4bf7a9a8b7bde58c49bf5d204c3edf6f6698b97c2d3eb047dcca5986e99` |
| **Registry** | `MainMenuScreen`, `preload: true`, `priority: critical`, paths `/assets/main-menu/MM-001.{png,webp}` |
| **Registry note** | “Decorative background only — UI text rendered in React.” |
| **Sync** | `tools/sync-runtime-visual-assets.ts` — `MM-001_Main_Menu_Final.png` → `main-menu/MM-001.png` + WebP (q=82) |
| **Primary consumer** | `MainMenuScreen` → `PGVisualAssetBackground assetId="MM-001"` behind `MainMenuHome` card |
| **Preload** | Yes (`PRELOAD_VISUAL_ASSET_IDS`) |

Catalog describes “Industrial skyline background”; implementation treats asset as **scenic layer**, not as authoritative UI layout.

---

## D. Embedded UI Classification

**Classification: C — BACKGROUND WITH CLEAR EMBEDDED FAKE/DECORATIVE UI**

*(Not A/B: UI is extensive, navigation-like, and duplicates app responsibilities. Not D: consumer geometry is **full-bleed cover background**, not a fixed mockup layout—the artwork is misaligned with architecture, not intentionally the sole UI surface.)*

| Element | Location (approx.) | Readable text / content | Resembles control? | App renders equivalent? | Conflicts with MainMenuHome? |
|---------|-------------------|-------------------------|--------------------|-------------------------|------------------------------|
| Product logo + wordmark | Top-left | “PROJECT GENESIS”, hex logo | Brand chrome | **YES** — BR-001 + `<h1>` | **YES** — dual branding |
| Tagline | Top-left | “BUILD · MANAGE · PROSPER” | Marketing | Partial (German subtitle in React) | **YES** |
| Sidebar nav list | Left ~15–35% width | NEW GAME, LOAD GAME, COMPANIES, TUTORIALS, SETTINGS, CREDITS, EXIT GAME + descriptions | **YES** — primary nav | **YES** for 5/7 labels (see §E); COMPANIES/TUTORIALS **not** in app | **YES** — strong duplicate |
| Top utility bar | Top-right | Language, Notifications (badge “3”), Profile | **YES** | **NO** | Misleading affordances |
| Latest News panel | Bottom-right | “LATEST NEWS”, headline, body, “READ MORE >”, pagination dots | Panel/widget | **NO** | Competing chrome |
| Social icons | Bottom-left | Discord, X, globe, mail | Icon buttons | **NO** | Pseudo-controls |
| Version footer | Bottom-center | “v0.1.0 Alpha” | Status text | **YES** — React footer (different copy) | **YES** |

**Evidence:** Direct inspection of `MM-001_Main_Menu_Final.png`; desktop runtime screenshot at **1280×800** (2026-09-13 validation pass).

---

## E. Application UI Ownership

**Real menu owner:** `MainMenuHome` inside `MainMenuScreen` (`pg-main-menu-card`).

**Actual controls (repository-backed):**

| Action | Real application UI | Represented in MM-001 artwork | Duplicated visual responsibility |
|--------|----------------------|------------------------------|-----------------------------------|
| Neues Spiel | YES | YES (“NEW GAME”) | **YES** |
| Fortsetzen | YES | YES (via “LOAD GAME” / continue framing) | **YES** |
| Spiel laden | YES | YES (“LOAD GAME”) | **YES** |
| Einstellungen | YES | YES (“SETTINGS”) | **YES** |
| Credits | YES | YES (“CREDITS”) | **YES** |
| Beenden | YES | YES (“EXIT GAME”) | **YES** |
| Companies / Tutorials | **NO** | YES (sidebar only) | Fake-only (still misleading) |
| Language / Notifications / Profile | **NO** | YES (top bar) | Fake-only |
| Latest News / social links | **NO** | YES | Fake-only |

| Question | Answer |
|----------|--------|
| Would removing fake UI from MM-001 remove actual functionality? | **NO** |
| Would MainMenuHome remain complete and understandable? | **YES** (BR-001 + heading + six buttons + footer) |

---

## F. BR-001 Ownership

| Question | Answer |
|----------|--------|
| MM-001 contains Project Genesis text / logo? | **YES** — baked wordmark + shield-style logo |
| Duplicates BR-001? | **YES** — parallel product identity in artwork |
| MM-001 needs embedded product branding? | **NO** |
| MainMenuHome sufficient (BR-001 + heading)? | **YES** |
| BR-001 change required for MM-001 cleanup? | **NO** |

Preferred direction: **MM-001 = scenic environment; BR-001 = brand symbol; MainMenuHome = menu/UI.**

---

## G. Rendering Geometry

| Item | Value |
|------|-------|
| Consumer | `MainMenuScreen` (home phase) |
| API | `PGVisualAssetBackground` → CSS `background-image` (`image-set` WebP/PNG) |
| Sizing | `background-size: **cover**` |
| Position | `center` (desktop); **`center top`** at `max-width: 48rem` |
| Container | `.pg-main-menu-with-assets` — `position: relative; overflow: hidden`; background `inset: 0`, `z-index: 0`, `pointer-events: none`, `aria-hidden` |
| Overlay | `.pg-visual-asset-background-overlay` — vertical gradient (35% → 88% bg mix) |
| Foreground | `.pg-main-menu-card` — `width: min(32rem, 100%)`, centered flex shell, `z-index: 1` |
| Intended role | **FULL-BLEED SCENIC BACKGROUND** (registry + component docstring) |

**Not** a fixed UI mockup viewport—the React card is the sole interactive surface. Current PNG behaves like a **frozen UI comp** under `cover`, which exposes left-rail and header chrome on desktop and crops them on narrow.

---

## H. Desktop Runtime Evidence

| Item | Value |
|------|-------|
| Viewport | **1280 × 800** (CDP device metrics) |
| URL | `http://localhost:3000/` (home phase after bootstrap) |
| MM-001 visible | **YES** — industrial valley + mountains |
| MainMenuHome card | **YES** — centered elevated panel |
| BR-001 + heading | **YES** |
| Real menu actions | **YES** — six buttons in accessibility tree |
| Embedded MM-001 UI | **YES** — full English sidebar, top bar, news panel, baked logo/title |
| Duplicate menu impression | **YES** — English sidebar + German card simultaneously |
| Competing text | **YES** — “NEW GAME” vs “Neues Spiel”; “PROJECT GENESIS” vs BR-001 row |
| Misleading fake controls | **YES** — sidebar and top icons look clickable |
| Readability | Card readable; background noise reduces hierarchy |
| **Classification** | **CLEANUP JUSTIFIED** |

---

## I. Narrow Runtime Evidence

| Item | Value |
|------|-------|
| Viewport | **390 × 844** (CDP, mobile) |
| MM-001 crop | `center top` — mostly scenic mountains/industry; **much sidebar chrome cropped** |
| Embedded UI partial visibility | Reduced vs desktop; **top branding area** may still appear at edges |
| Fake controls cut off | Sidebar partially off-screen; **residual misleading fragments possible** |
| Real MainMenuHome | **YES** — stacked buttons, readable |
| Removing fake UI would help responsive robustness | **YES** — less dependence on crop luck |
| **Classification** | **CLEANUP JUSTIFIED** (desktop issue is worse; narrow still benefits) |

---

## J. Accessibility Assessment

| Item | Assessment |
|------|------------|
| MM-001 layer | **Decorative** — `aria-hidden="true"` on background |
| Readable menu text in artwork | **YES** — large English nav strings |
| Problem | Readable **pseudo-controls** in a decorative layer; real actions only in foreground |
| Duplicate information | Visual duplicate of nav labels (not exposed to SR from background, but **misleading sighted UX**) |
| Pseudo-control risk | **HIGH** on desktop (sidebar + top bar) |
| Code change in this audit | **NONE** |

Scenic-only MM-001 would align decorative semantics with pixels.

---

## K. Localization Assessment

| Layer | Language |
|-------|----------|
| MainMenuHome (authoritative UI) | **German** (buttons, subtitle, banners) |
| MM-001 baked UI | **English** (sidebar, news, utilities, tagline) |

| Question | Answer |
|----------|--------|
| Artwork bypasses app UI/localization ownership? | **YES** |
| Scenic-only MM-001 would remove inconsistency? | **YES** (background would carry no locale-specific copy) |

No localization project started in this audit.

---

## L. Source / Runtime Pipeline

| Item | Value |
|------|-------|
| Authoritative source | `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png` |
| Runtime PNG | `apps/web/public/assets/main-menu/MM-001.png` |
| Runtime WebP | `apps/web/public/assets/main-menu/MM-001.webp` |
| Other derivatives | **None** in contract |
| Sync tool | `pnpm sync-visual-assets` / `sync-runtime-visual-assets.ts` |
| Transform | Copy PNG + Sharp WebP (quality **82**); **no** resize in sync today |
| Byte replacement only | **Registry change:** **NO** |
| Sync-code change | **NO** (expected) |
| Consumer-code change | **NO** (expected) |

**Expected implementation shape:** same **MM-001** ID, paths, geometry policy (**1536×1024** master), consumer unchanged—**new scenic bytes only** (plus optional deterministic crop/resize if candidate aspect differs).

---

## M. Cleanup Strategy Comparison

| Option | Assessment |
|--------|------------|
| **A — Keep unchanged** | **Reject** — clear duplication, localization conflict, contradicts registry intent |
| **B — New menu-free master, in-place replace** | **Recommended** — same pattern as MM-006; preserves asset ID and pipeline |
| **C — Edit existing to remove UI** | **Possible but poor fit** — UI covers most frame edges; inpainting risk high |
| **D — Broader architecture decision** | **Not required** — architecture already defines background + React shell; artwork is legacy mock |

**Selected:** **OPTION B**

---

## N. Image-Production Recommendation

**Route: NEW GENERATION** (UI-free scenic composition)

Rationale: baked UI occupies **most** of the frame (left rail, top bar, bottom widgets, branding). The **central industrial valley / mountains / river** are suitable to preserve **thematically**, but clean removal of all chrome is better achieved by **regenerating a scenic plate** (or a new art pass) than by editing the current master.

Do **not** reuse **MM-006** splash art for **MM-001**—different consumer timing, composition, and mood; no evidence they should share one asset.

---

## O. Art Requirements Block

*(For next image-generation / art brief step—not executed here.)*

| Requirement | Detail |
|-------------|--------|
| **Role** | Main menu **scenic background only** — zero interactive UI |
| **Aspect ratio** | **3∶2** (match repository master) |
| **Target source dimensions** | **1536 × 1024** px PNG (authoritative sync master) |
| **Subject** | Industrial/economic landscape consistent with catalog (“industrial skyline / valley”)—factories, river, mountains, golden-hour or equivalent PG mood |
| **Negative space** | **Center** ~40–50% width, vertical mid-frame — clear for `min(32rem)` centered **opaque** card + gradient overlay; avoid critical detail under card text |
| **Preserve (thematic)** | Valley industry, mountains, atmospheric depth, Project Genesis tone (serious sim, not cartoon HUD) |
| **Remove / forbidden** | All menu labels; sidebar; buttons; icons that look clickable; HUD panels; news/widgets; social icons; **any** “Project Genesis” wordmark or logo; English or German **UI copy**; version strings; notification badges |
| **Composition** | Full-bleed environment; **no** letterboxed UI comp; design for **`background-size: cover`** |
| **Crop-safe zones** | **Desktop:** `center` — keep focal scenery mid-frame; **narrow:** `center top` — keep upper/third composition strong; **avoid** placing readable elements at left rail or top-right (historically visible on desktop) |
| **BR-001** | Do **not** embed; brand stays in React |
| **Deliverable naming** | Working name e.g. `MM-001_Main_Menu_Background_NoUI.png` until promoted to `MM-001_Main_Menu_Final.png` |

---

## P. Proposed Replacement Scope

*(Planning only—do not execute.)*

1. Produce and approve UI-free **MM-001** candidate (separate mockups path until approved).
2. Deterministic preprocess if needed (centre **cover** resize to **1536×1024**, as MM-006).
3. Replace authoritative `hochgeladen/MM-001_Main_Menu_Final.png` in place; Git history retains current master.
4. Regenerate runtime PNG/WebP via existing sync.
5. Keep **MM-001** ID, registry, preload, `MainMenuScreen` / `MainMenuHome` unchanged.
6. Do **not** modify BR-001, MM-006, ICON families.
7. Focused tests: visual asset registry/loader, shell/menu tests, BR-001 isolation tests.
8. Verify HTTP delivery + SHA-256 certification.
9. Desktop (**~1280×800**) + narrow (**390×844**) runtime QA.
10. Update `VISUAL_ASSET_CATALOG.md`, `VISUAL_PRODUCTION_BACKLOG.md`, `VISUAL_ASSET_CHANGELOG.md`.
11. Close-candidate report; commit/push only after external approval.

---

## Q. Scope Verification

| Check | Result |
|-------|--------|
| Files modified by audit | **`POST_V1_MM_001_EMBEDDED_UI_CLEANUP_AUDIT.md` only** |
| MM-001 source/runtime | **Untouched** |
| Forbidden areas | **Untouched** |
| Unrelated dirty work | **Preserved** |

---

## R. Repository Integrity

| Item | Value |
|------|-------|
| HEAD | `517b1e51e51068ac0daffeccee0761d405d5816d` |
| Commit / push / tag | **NO** |
| Remote fetch | Blocked by environment EPERM |

---

## S. Final Recommendation

**OPTION B — MM-001 — MENU-FREE BACKGROUND REPLACEMENT RECOMMENDED**

Proceed with a **new UI-free scenic master** (not in-place UI edit), **same MM-001 pipeline**, following MM-006 **architectural** precedent without sharing MM-006 artwork.

---

# MM-001 — Embedded UI Cleanup Audit
## Execution Summary

### Baseline

- Branch: `master`
- HEAD: `517b1e51e51068ac0daffeccee0761d405d5816d`
- origin/master after fetch: **fetch failed (EPERM)**; local ref `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- HEAD == origin/master: **NO** (local refs)
- v1.0.0: `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- v1.0.0-rc.1: `442665cd6437bdebff88fd1540cedc689238c240`
- tags moved: NO

### Current MM-001

- semantic role: main menu scenic background
- authoritative source: `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png`
- dimensions: 1536×1024
- SHA-256: `3aa69cd973aa7ff5099887a39e5aa5ff38093906e8c8819c2f05ea32d33753e8`
- runtime assets: `/assets/main-menu/MM-001.png`, `.webp`
- registry: MainMenuScreen, preload true, notes decorative-only
- consumers: MainMenuScreen → MainMenuHome phase

### Embedded UI

- classification: **C**
- readable strings: PROJECT GENESIS; BUILD·MANAGE·PROSPER; NEW/LOAD GAME; COMPANIES; TUTORIALS; SETTINGS; CREDITS; EXIT GAME; Language; Notifications; Profile; LATEST NEWS; READ MORE; v0.1.0 Alpha; etc.
- fake buttons/controls: YES (sidebar rows, top bar, social icons)
- sidebar/navigation: YES (primary duplicate)
- product branding: YES (logo + wordmark)
- duplicate responsibility: **YES**

### Application UI Ownership

- real menu owner: MainMenuHome
- real actions: Neues Spiel, Fortsetzen, Spiel laden, Einstellungen, Credits, Beenden
- application menu independent: YES
- functionality lost if artwork UI removed: NO

### BR-001

- brand owner: MainMenuHome (`PGVisualAssetImage` BR-001)
- heading owner: MainMenuHome `<h1>`
- embedded branding required in MM-001: NO
- BR-001 change required: NO

### Rendering Geometry

- method: CSS background cover via PGVisualAssetBackground
- fit/size: cover
- position: center / center top (narrow)
- desktop crop: exposes left sidebar UI
- narrow crop: mostly scenic; less sidebar, still benefits from cleanup

### Runtime Evidence

- desktop viewport: 1280×800
- desktop result: **CLEANUP JUSTIFIED**
- narrow viewport: 390×844
- narrow result: **CLEANUP JUSTIFIED**
- duplicate-menu impression: YES (desktop)
- competing text: YES (EN artwork vs DE UI)

### Accessibility / Localization

- decorative asset: YES (aria-hidden background)
- embedded readable UI: YES
- language mismatch: YES
- pseudo-control risk: HIGH (desktop)

### Pipeline

- source: hochgeladen `MM-001_Main_Menu_Final.png`
- derivatives: PNG + WebP only
- sync: existing RUNTIME_ASSETS entry
- registry change required: NO
- sync-code change required: NO
- consumer-code change required: NO

### Cleanup Strategy

- selected option: **OPTION B**
- reason: full UI mock on scenic background; app owns menu + BR-001
- image production route: **NEW GENERATION**
- new asset ID required: **NO** (replace bytes under MM-001)

### Art Requirements

- aspect ratio: 3∶2
- target dimensions: 1536×1024
- negative-space zone: center for menu card
- preserve: industrial valley / mountains mood
- remove: all menus, HUD, news, social, branding text
- forbidden: logos, UI text, fake controls
- crop considerations: cover center + narrow center-top

### Future Implementation Scope

- source replacement: in-place master swap after approval
- runtime regeneration: sync PNG/WebP
- registry: unchanged
- consumer: unchanged
- BR-001: unchanged
- validation: tests + desktop/narrow + hashes
- lifecycle: catalog/backlog/changelog

### Repository Integrity

- files modified by audit: this report
- implementation files modified: none
- commit: NO
- push: NO
- tags moved: NO

### Final Recommendation

**OPTION B**
