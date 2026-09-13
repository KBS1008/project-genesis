# MM-006 — Menu-Free Background Replacement Audit

**Project:** Project Genesis  
**Date:** 2026-09-13  
**Mode:** Read-only asset / runtime / consumer audit (no implementation)  
**HEAD:** `517b1e51e51068ac0daffeccee0761d405d5816d`  
**origin/master:** `517b1e51e51068ac0daffeccee0761d405d5816d`

---

## A. Executive Summary

The authoritative **MM-006** splash background currently embeds a full promotional menu mockup (logo, title, four “BUILD / MANAGE / PROSPER / LEAD” panels, taglines, copyright). The application renders **real** splash copy and the **interactive** main menu separately (`SplashScreen` → `MainMenuHome` on **MM-001**). A **menu-free scenic candidate** exists under mockups with a non-standard filename.

Replacement is **architecturally correct** (decorator vs. app-owned UI) and fits the existing **PNG + WebP + sync + registry** contract with **no consumer code changes**. Candidate geometry differs from the current master (**1672×941 vs 1536×1024**), so a **small normalization step** (resize/crop to prior master geometry or documented cover-crop acceptance) is advised before source promotion.

**Final recommendation:** **OPTION B — MM-006 MENU-FREE REPLACEMENT — READY AFTER SMALL ART/GEOMETRY DELTA**

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `517b1e51e51068ac0daffeccee0761d405d5816d` |
| `origin/master` | `517b1e51e51068accee0761d405d5816d` (remote verified) |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |
| Implementation in this task | **NONE** |

---

## C. Current MM-006 Contract

| Field | Value |
|-------|-------|
| **Asset ID** | `MM-006` |
| **Semantic role** | Scenic **startup splash background** (not brand mark; not interactive menu) |
| **Authoritative sync source** | `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png` |
| **Registry `designSource`** | Same path |
| **Format** | PNG (runtime PNG + WebP) |
| **Dimensions** | **1536 × 1024** (3∶2) |
| **Color / alpha** | RGB, **no alpha** |
| **Source SHA-256** | `fd7d35b02acf700951e19f8dbc2b21fe309329578f591b41bd746217285fba96` |
| **Runtime PNG** | `apps/web/public/assets/main-menu/MM-006.png` — same hash/dimensions as source |
| **Runtime WebP** | `apps/web/public/assets/main-menu/MM-006.webp` — SHA-256 `7aaeb519c57d16eb4624be38c6ad916498215d55e187ab97921ff9ed2fba2b55`, 1536×1024 |
| **Registry** | `runtimePng`, `component: SplashScreen`, `preload: true`, paths `/assets/main-menu/MM-006.{png,webp}` |
| **Primary consumer** | `SplashScreen.tsx` → `PGVisualAssetBackground assetId="MM-006"` |
| **Catalog / backlog** | VAM UI-MM-006 complete; backlog 🚀 runtime splash background |

Duplicate copy (same hash): `docs/design/Mockups/main-menu/MM-006_Splash.png`.

---

## D. Embedded UI Assessment

**Classification: A — CLEAR EMBEDDED MENU/UI**

| Element | Present in current master |
|---------|---------------------------|
| Menu-like panels / fake buttons | **YES** — four hex tiles with BUILD / MANAGE / PROSPER / LEAD |
| Menu / marketing text | **YES** — taglines, feature blurbs, copyright |
| Title / wordmark in artwork | **YES** — shield logo + “PROJECT GENESIS” |
| HUD / frame chrome | **YES** — corner brackets, footer bar |

**Evidence:** Visual inspection of `MM-006_Splash.png` (hochgeladen + mockups copy). This duplicates responsibilities now owned by React (`SplashScreen` text overlay) and misleads users during the brief splash phase. **BR-001** now owns product identity on **MainMenuHome**, not MM-006.

---

## E. Application Menu Ownership

| Layer | Component | Evidence |
|-------|-----------|----------|
| Splash **background** | `SplashScreen` | `PGVisualAssetBackground assetId="MM-006"` |
| Splash **copy** (non-interactive) | `SplashScreen` | Eyebrow “Project Genesis”, `<h1>Wirtschaftssimulation</h1>`, tagline |
| **Interactive menu** | `MainMenuHome` (inside `MainMenuScreen` after bootstrap) | Buttons: Neues Spiel, Fortsetzen, Spiel laden, Einstellungen, Credits, Beenden |
| Main menu **background** | **MM-001** (not MM-006) | `MainMenuScreen` uses `PGVisualAssetBackground assetId="MM-001"` on home/panels |

| Question | Answer |
|----------|--------|
| Interactive controls independent of MM-006 pixels? | **YES** |
| Removing baked-in menu artwork removes app functionality? | **NO** — artwork controls were never wired; all actions are React buttons on MM-001 phase |

---

## F. Current Rendering Geometry

| Item | Behavior |
|------|----------|
| Method | **CSS `background-image`** via `PGVisualAssetBackground` → `resolveVisualAssetBackgroundImage` (WebP + PNG `image-set`) |
| Container | `.pg-visual-asset-background` — `position: absolute; inset: 0` under `.pg-main-menu-with-assets` |
| Sizing | `background-size: **cover**`; `background-position: **center**` (desktop) |
| Narrow | `@media (max-width: 48rem)` → `background-position: **center top**` |
| Overlay | `.pg-visual-asset-background-overlay` — vertical gradient (`35%` → `88%` bg mix) |
| Splash card | `.pg-menu-splash` — centered card `min(32rem, 100%)`, `z-index: 1` above background |
| Object-fit | N/A (background layer, not `<img>`) |

**Consumer adjustment for menu-free art:** **UNCHANGED** (same component stack). **Crop behavior** will change if aspect ratio changes — see §G / §Q.

---

## G. Candidate Technical Properties

**Expected name:** `MM-006_Splash_Background_NoUI.png`  
**Actual path found:**

`docs/design/Mockups/main-menu/MM-006_Splash_Background_NoUI.png.png`

(double `.png` suffix — rename recommended in implementation, not done in this audit)

| Property | Candidate | Current MM-006 master |
|----------|-----------|------------------------|
| Dimensions | **1672 × 941** | **1536 × 1024** |
| Aspect ratio | ~**1.78∶1** (16∶9-class) | **1.50∶1** (3∶2) |
| Format | PNG | PNG |
| Alpha | No | No |
| File size | ~2.80 MB | ~2.11 MB |
| SHA-256 | `defacf3dddaaf6a1263788daa6a02bf8a6887ee60ac9a6a357e30bac4c44dfd4` | `fd7d35b02acf700951e19f8dbc2b21fe309329578f591b41bd746217285fba96` |

**Geometry compatibility:** **B — COMPATIBLE AFTER DETERMINISTIC RESIZE/CROP**

Runtime `cover` can display either aspect, but **replacing the master without normalization changes default crop** and preload byte size. Prefer: resize/crop candidate to **1536×1024** (or document explicit 16∶9 master policy) before replacing `hochgeladen/MM-006_Splash.png`.

---

## H. Candidate Visual Suitability

| Criterion | Result |
|-----------|--------|
| No embedded menu / fake buttons | **PASS** |
| No menu text / readable UI chrome | **PASS** |
| Scenic industrial / environmental subject | **PASS** |
| Negative space for splash card overlay | **PASS** (mist/valley; center usable) |
| No baked Project Genesis logo (BR-001 boundary) | **PASS** |
| No watermark / obvious generation UI artifacts | **PASS** (visual review) |
| Composition vs. centered splash card | **MINOR CONCERN** — verify sun/mist legibility behind `.pg-menu-splash` + gradient overlay on desktop/narrow |

---

## I. Current vs Candidate Comparison

| Dimension | Current MM-006 | Menu-free candidate |
|-----------|----------------|---------------------|
| Role | Splash scenic background | Same (intended) |
| Embedded UI | Full mock menu + branding | **None** |
| App menu ownership | Duplicated visually | **Aligned** — app owns UI |
| Dimensions | 1536×1024 | 1672×941 |
| Runtime contract | PNG + WebP via sync | Same pipeline |
| Registry | MM-006 paths | **Unchanged** if ID preserved |
| BR-001 | Separate (MainMenuHome) | Still separate |

---

## J. Source Replacement Strategy

**Recommended: OPTION B — Preserve old master in Git history; install candidate as authoritative `MM-006` source at existing sync path**

Rationale:

- **OPTION A** (in-place replace) is acceptable **after** filename fix + geometry normalization.
- No need for **MM-006B** or new asset ID — taxonomy and consumers remain `MM-006`.
- Git history retains `fd7d35b0…` master; no duplicate “nicht verwenden” tree required unless team policy mandates archival copies in `docs/design/` (none enforced for MM-006 today).
- **OPTION D** not warranted — embedded UI is clearly obsolete vs. app architecture.

Do **not** move files in this audit.

---

## K. Runtime Derivative Contract

| Runtime artifact | Current | After replacement | Regenerate? |
|------------------|---------|-------------------|-------------|
| `apps/web/public/assets/main-menu/MM-006.png` | From hochgeladen source | New bytes from new master | **YES** (`pnpm sync-visual-assets`) |
| `apps/web/public/assets/main-menu/MM-006.webp` | Sharp WebP from PNG | From new PNG | **YES** |
| Other resolutions | **None** in repo | **None** | N/A |

No new derivative sizes required unless normalization chooses a new master dimension policy.

---

## L. Sync Tool Assessment

| Item | Value |
|------|-------|
| Tool | `tools/sync-runtime-visual-assets.ts` |
| MM-006 included | **YES** — `MM-006_Splash.png` → `main-menu/MM-006.png` + WebP |
| Operation | `copyFile` + `sharp` WebP (quality 82) |
| Deterministic | **YES** (fixed source path + WebP settings) |
| Sync code change required | **NO** (expected) — only source bytes/path normalization |

---

## M. Registry Assessment

**Recommendation: A — NO REGISTRY CHANGE**

Same asset ID, paths, formats, `SplashScreen` component, `preload: true`. No dimension/hash fields in registry schema.

---

## N. Consumer Assessment

| Component | Purpose | MM-006? | Menu-free OK? | Loses required info if baked UI removed? |
|-----------|---------|---------|---------------|------------------------------------------|
| `SplashScreen` | Boot splash background + React status copy | **YES** | **YES** | **NO** |
| `MainMenuScreen` / `MainMenuHome` | Interactive menu | **NO** (uses MM-001) | N/A | **NO** |
| Preload boot | `PRELOAD_VISUAL_ASSET_IDS` | **YES** | **YES** | **NO** |

No production consumer relied on non-interactive artwork buttons.

---

## O. BR-001 Interaction

| Question | Answer |
|----------|--------|
| Menu-free MM-006 needs baked Project Genesis branding? | **NO** |
| App provides sufficient product identity without baked splash logo? | **YES** — `SplashScreen` text + **BR-001** on `MainMenuHome` |
| BR-001 change required for this replacement? | **NO** |

Do not add BR-001 to `SplashScreen` during MM-006 replacement.

---

## P. Accessibility Assessment

| Item | Current |
|------|---------|
| Background layer | `aria-hidden="true"` on `.pg-visual-asset-background` |
| Splash content | `role="status"`, `aria-live="polite"`, `aria-label="Project Genesis wird geladen"` |

Removing readable **fake** menu text from the decorative background **improves** semantic correctness (less readable content in a decorative layer). **YES** — replacement supports better a11y architecture. No code change required for audit conclusion.

---

## Q. Responsive Risk

**Overall: MEDIUM**

| Factor | Notes |
|--------|-------|
| Crop zones | `cover` + `center` / `center top` (narrow) |
| Aspect change | 3∶2 → ~16∶9 shifts vertical crop — re-verify mountains/industry focal points |
| Splash overlay | Center card ~32rem — verify contrast on mist/sun regions |
| Main menu | Unaffected (MM-001) |

**Implementation must visually verify:** desktop + narrow splash phase after sync.

---

## R. Proposed Implementation Scope (plan only — not executed)

1. Normalize candidate (rename `.png.png`; optional resize to 1536×1024 or approved master size).
2. Replace **only** `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png` (keep asset ID **MM-006**).
3. Run `pnpm sync-visual-assets` → regenerate `MM-006.png` / `MM-006.webp`.
4. **No** registry / `SplashScreen` / MainMenu changes unless visual QA fails.
5. Re-run loader/registry tests; spot-check splash desktop + narrow.
6. Record new source/runtime SHA-256 in changelog.
7. **Do not** touch BR-001, MM-001, MM-007, ICON families.

---

## S. Scope / Repository Integrity

| Check | Result |
|-------|--------|
| Files modified by audit | **This report only** |
| Implementation | **NONE** |
| Commit / push / tag | **NONE** |

Unrelated working-tree noise preserved.

---

## T. Final Recommendation

**OPTION B — MM-006 MENU-FREE REPLACEMENT — READY AFTER SMALL ART/GEOMETRY DELTA**

Proceed after: filename correction, master dimension/crop decision (prefer 1536×1024 parity), and visual QA of splash overlay on new composition.

---

# MM-006 — Menu-Free Background Replacement Audit
## Execution Summary

### Baseline

- **Branch:** `master`
- **HEAD:** `517b1e51e51068ac0daffeccee0761d405d5816d`
- **origin/master:** `517b1e51e51068ac0daffeccee0761d405d5816d`
- **v1.0.0:** `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- **v1.0.0-rc.1:** `442665cd6437bdebff88fd1540cedc689238c240`
- **tags moved:** NO

### Current MM-006

- **semantic role:** splash scenic background
- **source:** `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png`
- **format:** PNG + WebP runtime
- **dimensions:** 1536×1024
- **SHA-256:** `fd7d35b02acf700951e19f8dbc2b21fe309329578f591b41bd746217285fba96`
- **runtime assets:** `/assets/main-menu/MM-006.png`, `.webp`
- **registry:** `SplashScreen`, preload true
- **consumers:** `SplashScreen` (primary)

### Embedded UI

- **classification:** **A — CLEAR EMBEDDED MENU/UI**
- **menu text present:** YES (in artwork)
- **buttons/UI present:** YES (non-interactive mock)
- **title/logo present:** YES (in artwork)
- **evidence:** visual inspection of current master PNG

### Application Menu

- **owning component:** `MainMenuHome` (interactive); `SplashScreen` (boot copy only)
- **actions rendered independently:** YES
- **removing artwork UI loses functionality:** NO
- **result:** replacement aligned with architecture

### Candidate

- **path:** `docs/design/Mockups/main-menu/MM-006_Splash_Background_NoUI.png.png`
- **format:** PNG
- **dimensions:** 1672×941
- **aspect ratio:** ~1.78∶1
- **SHA-256:** `defacf3dddaaf6a1263788daa6a02bf8a6887ee60ac9a6a357e30bac4c44dfd4`
- **embedded UI:** none observed
- **negative space:** adequate for splash card
- **visual suitability:** PASS (minor overlay contrast check in implementation)
- **geometry compatibility:** **B** (resize/crop/normalization advised)

### Rendering

- **current method:** CSS background `cover` via `PGVisualAssetBackground`
- **object-fit/background-size:** cover / center (top on narrow)
- **consumer adjustment required:** **UNCHANGED** (crop QA only)

### Runtime Contract

- **derivatives required:** MM-006 PNG + WebP only
- **sync tool:** existing entry — **YES**
- **sync change required:** NO
- **registry change required:** NO

### BR-001

- **interaction:** separate responsibilities; no splash integration
- **branding baked into MM-006 required:** NO
- **BR-001 change required:** NO

### Responsive Risk

- **desktop:** MEDIUM (re-verify cover crop)
- **narrow:** MEDIUM (`center top` crop)
- **overall:** MEDIUM

### Proposed Replacement Strategy

- **selected option:** OPTION B (source replace at hochgeladen path after geometry delta)
- **old source handling:** Git history (no delete in audit)
- **new source handling:** replace `MM-006_Splash.png` master; fix candidate filename
- **runtime regeneration:** sync PNG/WebP
- **registry:** unchanged
- **consumer:** unchanged
- **lifecycle docs:** changelog entry on implementation

### Repository Integrity

- **files modified by audit:** `POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_AUDIT.md`
- **implementation files modified:** none
- **commit:** NO
- **push:** NO
- **tags moved:** NO

### Final Recommendation

**OPTION B**
