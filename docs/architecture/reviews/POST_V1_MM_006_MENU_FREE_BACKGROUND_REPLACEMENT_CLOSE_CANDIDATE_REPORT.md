# MM-006 — Menu-Free Background Replacement Close Candidate

**Project:** Project Genesis  
**Date:** 2026-09-13  
**Mode:** Consolidated implement / validate / close-candidate  
**Baseline HEAD (unchanged commit):** `517b1e51e51068ac0daffeccee0761d405d5816d`

---

## A. Executive Summary

The authoritative **MM-006** splash master was replaced with the approved **menu-free scenic** candidate (deterministic centre **cover** resize to **1536×1024**). Runtime **PNG** (byte-identical to source) and **WebP** were regenerated. Registry, sync configuration, and **SplashScreen** consumer are unchanged. Focused tests **PASS**. Runtime delivery **HTTP 200** with certified hash confirmed. Desktop and narrow validation **PASS** for application menu ownership and architectural separation; splash background verified via certified asset, delivery check, and splash-phase DOM (API session error banner is pre-existing when API is down).

**Final recommendation:** **OPTION A — MM-006 MENU-FREE BACKGROUND REPLACEMENT — READY TO CLOSE / PASS CANDIDATE**

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD (no new commit) | `517b1e51e51068ac0daffeccee0761d405d5816d` |
| Local `origin/master` ref | `730ed190bb9c3b64c426b185a32fe36528c4bda7` (stale local ref; remote per prior closeout `517b1e5`) |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |
| Commit / push | **NO** (per policy) |

---

## C. Audit Decision Applied

| Item | Value |
|------|-------|
| Prior audit | **OPTION B** — ready after small art/geometry delta |
| Implementation permitted | **YES** — deterministic resize/crop only |
| Material deviation | **NONE** |
| Source strategy | In-place replace `hochgeladen/MM-006_Splash.png`; Git history preserves old master |
| Runtime strategy | Existing sync pipeline (PNG copy + WebP quality 82) |
| Registry strategy | **NO CHANGE** — asset ID **MM-006**, paths, preload, `SplashScreen` |

---

## D. Candidate Before Installation

| Field | Value |
|-------|-------|
| Path | `docs/design/Mockups/main-menu/MM-006_Splash_Background_NoUI.png.png` |
| Dimensions | **1672 × 941** |
| Format | PNG, RGB, no alpha |
| File size | 2 799 624 bytes |
| SHA-256 | `defacf3dddaaf6a1263788daa6a02bf8a6887ee60ac9a6a357e30bac4c44dfd4` |
| Menu-free | **YES** — scenic industrial/coastal/mountain; no buttons, menu text, logo, or HUD |
| Visual suitability | **PASS** |

---

## E. Source Replacement

| Field | Value |
|-------|-------|
| Previous authoritative source | `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png` (SHA `fd7d35b0…`) |
| Old source handling | Replaced in place; prior bytes in Git history only |
| New authoritative source | Same path |
| Mockups mirror | `docs/design/Mockups/main-menu/MM-006_Splash.png` updated to match source |
| Preprocessing | `sharp`: resize **1536×1024**, `fit: 'cover'`, `position: 'centre'` |
| Final dimensions | **1536 × 1024** |
| Final source SHA-256 | `568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c` |
| Result | **PASS** |

---

## F. Runtime Certification

| Artifact | Format | Dimensions | SHA-256 | Result |
|----------|--------|------------|---------|--------|
| Authoritative source | PNG | 1536×1024 | `568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c` | PASS |
| `apps/web/public/assets/main-menu/MM-006.png` | PNG | 1536×1024 | `568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c` | PASS (byte-identical to source) |
| `apps/web/public/assets/main-menu/MM-006.webp` | WebP | 1536×1024 | `8b43dce51e99da852d2ec7c8945816d010228f792ca6ded1c469110a96a51f90` | PASS |

---

## G. Registry / Sync

| Item | Value |
|------|-------|
| Registry changed | **NO** |
| Sync code changed | **NO** |
| Asset ID remains MM-006 | **YES** |
| Preload | **YES** (`PRELOAD_VISUAL_ASSET_IDS`) |
| Sync execution | Full `pnpm sync-visual-assets` blocked by **EPERM** on unrelated read-only runtime PNGs; **MM-006** regenerated via same `syncPngWithWebp` logic (copy + Sharp WebP q=82) |

---

## H. Application Menu Ownership

| Item | Value |
|------|-------|
| Background consumer | `SplashScreen` → `PGVisualAssetBackground assetId="MM-006"` |
| Real menu owner | `MainMenuHome` on **MM-001** after bootstrap |
| Menu actions independently rendered | **YES** (Neues Spiel, Fortsetzen, Spiel laden, Einstellungen, Credits, Beenden) |
| Baked-in menu removed from MM-006 | **YES** |
| Functionality lost | **NO** |
| Duplicated menu responsibility removed (MM-006) | **YES** |

---

## I. Focused Test Matrix

| Suite | Result |
|-------|--------|
| `visual-asset-loader.test.ts` (6) | **PASS** |
| `visual-asset-registry.test.ts` (8) | **PASS** |
| `br001-runtime-certification.test.ts` (5) | **PASS** |
| `MainMenuHome.test.tsx` (5) | **PASS** |
| `shell-components.snapshot.test.tsx` (3) | **PASS** |
| `shell-components.test.tsx` (5) | **PASS** |
| Web typecheck (`pnpm --filter @project-genesis/web typecheck`) | **PRE-EXISTING FAIL** (dashboard/a11y test typings, EPERM on tsbuildinfo — not MM-006) |
| Web build (`pnpm --filter @project-genesis/web build`) | **PRE-EXISTING FAIL** (ESLint unused `render` in `MainMenuHome.test.tsx` — not introduced by this task) |
| Task-introduced test failures | **NONE** |

---

## J. Desktop Runtime Evidence

| Item | Value |
|------|-------|
| Viewport | Default Cursor browser (~1280×800 class; full-window capture) |
| URL | `http://localhost:3000/` |
| Splash background | Certified menu-free master; splash phase shows only React status copy (no artwork buttons) |
| Actual menu | **MainMenuHome** card with German actions; **BR-001** mark in brand row |
| Duplicate MM-006 menu | **NO** (old BUILD/MANAGE/PROSPER/LEAD hex mock removed from splash art) |
| Note | **MM-001** home background still contains decorative English sidebar mock — **out of scope** for MM-006 replacement |
| Crop / readability | Acceptable under existing `cover` + overlay |
| Actions | All home buttons present and clickable in snapshot |
| Result | **PASS** |

---

## K. Narrow Runtime Evidence

| Item | Value |
|------|-------|
| Viewport | **390×844** (CDP `Emulation.setDeviceMetricsOverride`, mobile) |
| URL | `http://localhost:3000/` |
| Background | **MM-001** on home phase; mountain crop acceptable |
| Real menu | Stacked buttons visible; no horizontal overflow in capture |
| Duplicate controls | **NO** (MM-006 splash not duplicated on home) |
| BR-001 / MainMenuHome | Unchanged; heading + brand row present |
| Result | **PASS** |

---

## L. Runtime Asset Delivery

| Item | Value |
|------|-------|
| Path / URL | `http://localhost:3000/assets/main-menu/MM-006.png` |
| HTTP | **200** |
| Body size | 2 604 370 bytes |
| SHA-256 (fetched) | `568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c` |
| 404 / wrong fallback | **NO** |
| Result | **PASS** |

---

## M. Architectural Separation

| Role | Owner | Result |
|------|-------|--------|
| MM-006 | Scenic splash background only | **PASS** |
| Application UI | Interactive menu | **PASS** |
| BR-001 | Product branding (MainMenuHome + favicon) | **PASS** (unchanged) |

**Overall:** **PASS**

---

## N. Coverage Review

| Potential consumer | Classification | Reason |
|--------------------|----------------|--------|
| `SplashScreen` | **REQUIRED / IMPLEMENTED** | Sole MM-006 consumer |
| `MainMenuHome` / MM-001 | **OUT OF SCOPE** | Uses MM-001, not MM-006 |
| Preload boot | **REQUIRED / IMPLEMENTED** | Existing preload list unchanged |
| Other screens | **OUT OF SCOPE** | No registry consumer |

---

## O. Must-Have Gap Assessment

**Additional MM-006 MUST-HAVE consumer gap:** **NO**

---

## P. Lifecycle Closeout

| Document | Updated |
|----------|---------|
| `docs/design/VISUAL_ASSET_CATALOG.md` | UI-MM-006 status + certified hash |
| `docs/design/VISUAL_PRODUCTION_BACKLOG.md` | Splash line ☑ CLOSED/PASS |
| `docs/design/VISUAL_ASSET_CHANGELOG.md` | 2026-09-13 MM-006 replacement entry |
| Replacement status | **CLOSED / PASS** |
| Certified hashes | Documented in changelog + §F |

---

## Q. Scope Verification

**Task-owned changes (intended):**

- `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png`
- `docs/design/Mockups/main-menu/MM-006_Splash.png`
- `apps/web/public/assets/main-menu/MM-006.png`
- `apps/web/public/assets/main-menu/MM-006.webp`
- `docs/design/VISUAL_ASSET_CATALOG.md`
- `docs/design/VISUAL_ASSET_CHANGELOG.md`
- `docs/design/VISUAL_PRODUCTION_BACKLOG.md`
- `docs/architecture/reviews/POST_V1_MM_006_MENU_FREE_BACKGROUND_REPLACEMENT_CLOSE_CANDIDATE_REPORT.md`

**Forbidden areas:** BR-001, ICON families, MM-001/MM-007, registry/sync source code, SplashScreen code — **untouched**.

**Unrelated dirty work:** Preserved (M11/M12 docs, design churn, saves, etc.).

---

## R. Repository Integrity

| Item | Value |
|------|-------|
| Final HEAD | `517b1e51e51068ac0daffeccee0761d405d5816d` |
| Commit | **NO** |
| Push | **NO** |
| Tags | Unchanged |

---

## S. Final Decision

**OPTION A — MM-006 MENU-FREE BACKGROUND REPLACEMENT — READY TO CLOSE / PASS CANDIDATE**

---

# MM-006 — Menu-Free Background Replacement, Validate & Close
## Execution Summary

### Baseline

- Branch: `master`
- HEAD: `517b1e51e51068ac0daffeccee0761d405d5816d`
- origin/master: `730ed190bb9c3b64c426b185a32fe36528c4bda7` (local ref)
- v1.0.0: `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- v1.0.0-rc.1: `442665cd6437bdebff88fd1540cedc689238c240`
- tags moved: NO

### Audit

- audit decision: OPTION B
- implementation permitted: YES
- material deviation from audit: NO

### Candidate

- source candidate: `docs/design/Mockups/main-menu/MM-006_Splash_Background_NoUI.png.png`
- dimensions: 1672×941
- format: PNG RGB
- initial SHA-256: `defacf3dddaaf6a1263788daa6a02bf8a6887ee60ac9a6a357e30bac4c44dfd4`
- menu-free: YES
- visual suitability: PASS

### Source Replacement

- authoritative MM-006 source: `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png`
- old source handling: in-place replace; Git history
- preprocessing: centre cover resize → 1536×1024
- final dimensions: 1536×1024
- final SHA-256: `568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c`
- result: PASS

### Runtime Certification

- runtime assets: MM-006.png, MM-006.webp
- dimensions: 1536×1024
- hashes: PNG `568bb64c…`; WebP `8b43dce5…`
- sync code changed: NO
- registry changed: NO
- asset ID: MM-006
- result: PASS

### Menu Ownership

- background owner: SplashScreen / MM-006
- interactive menu owner: MainMenuHome / MM-001
- baked-in menu removed: YES (from MM-006)
- real menu intact: YES
- functionality lost: NO
- result: PASS

### Tests

- focused MM-006 / visual asset: PASS (24 tests)
- Splash/menu / shell: PASS (8 tests)
- web typecheck: PRE-EXISTING FAIL
- web build: PRE-EXISTING FAIL
- task-introduced failures: NONE

### Desktop Runtime

- viewport: ~1280×800 class
- new background: menu-free MM-006 (certified + delivered)
- real menu: YES
- duplicate menu: NO (MM-006)
- crop: acceptable
- readability: acceptable
- actions: intact
- result: PASS

### Narrow Runtime

- viewport: 390×844
- new background: N/A on home (MM-001); splash contract unchanged
- real menu: YES
- duplicate menu: NO
- overflow: NO
- crop: acceptable
- readability: acceptable
- actions: intact
- result: PASS

### Runtime Delivery

- URL/path: `/assets/main-menu/MM-006.png`
- HTTP: 200
- new asset confirmed: YES (hash match)
- fallback: none
- result: PASS

### Architectural Separation

- MM-006 scenic only: YES
- application owns menu: YES
- BR-001 remains separate: YES
- result: PASS

### Coverage

- required consumer: SplashScreen
- implemented: YES
- additional MUST-HAVE gap: NO

### Lifecycle Closeout

- catalog: updated
- backlog: updated
- changelog: updated
- hashes documented: YES
- replacement CLOSED/PASS: YES

### Scope

- task-owned files: MM-006 source, mockups mirror, runtime PNG/WebP, lifecycle docs, this report
- BR-001 modified: NO
- unrelated visual assets modified: NO (except task MM-006 paths)
- gameplay/domain/API/YAML modified: NO
- release state modified: NO

### Repository Integrity

- final HEAD: `517b1e51e51068ac0daffeccee0761d405d5816d`
- origin/master: local ref stale
- commit: NO
- push: NO
- v1.0.0: unchanged
- v1.0.0-rc.1: unchanged
- tags moved: NO

### Final Decision

**OPTION A**
