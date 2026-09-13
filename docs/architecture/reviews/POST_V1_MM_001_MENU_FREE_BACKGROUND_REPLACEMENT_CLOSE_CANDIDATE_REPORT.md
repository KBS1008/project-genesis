# MM-001 — Menu-Free Background Replacement Close Candidate

**Project:** Project Genesis  
**Date:** 2026-09-13  
**Mode:** Consolidated implement / validate / close-candidate  
**Audit basis:** `POST_V1_MM_001_EMBEDDED_UI_CLEANUP_AUDIT.md` — **OPTION B**  
**Baseline HEAD (unchanged commit):** `517b1e51e51068ac0daffeccee0761d405d5816d`

---

## A. Executive Summary

**MM-001** authoritative master was replaced with the approved menu-free candidate **`MM-001_Main_Menu_Background_NoUI.png`** (already **1536×1024**, no geometry preprocessing). Runtime **PNG** (byte-identical) and **WebP** (q=82) were regenerated via existing MM-001 sync logic (full `pnpm sync-visual-assets` not run—**EPERM** on unrelated assets; MM-001-only transform as MM-006 pass). Registry and consumers unchanged. **32** focused tests **PASS**. Runtime delivery **HTTP 200** with certified hash. Post-replacement runtime capture shows **scenic-only** background with **German** MainMenuHome and **BR-001**; baked English UI mock removed. **BR-001** and **MM-006** bytes verified unchanged.

**Final decision:** **OPTION A — MM-001 MENU-FREE BACKGROUND REPLACEMENT — READY TO CLOSE / PASS CANDIDATE**

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `517b1e51e51068ac0daffeccee0761d405d5816d` |
| `git fetch origin` | **FAILED** — `EPERM: cannot open '.git/FETCH_HEAD'` |
| Local `origin/master` | `730ed190bb9c3b64c426b185a32fe36528c4bda7` (stale local ref) |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |
| Commit / push | **NO** |

---

## C. Audit Decision Applied

| Item | Value |
|------|-------|
| Audit recommendation | **OPTION B** — menu-free background replacement |
| Strategy | In-place replace `MM-001_Main_Menu_Final.png`; keep asset ID **MM-001** |
| Art route (audit) | New UI-free scenic generation — candidate supplied |
| Deviation | **None** |

---

## D. Candidate Certification

| Field | Value |
|-------|-------|
| Path | `docs/design/Mockups/main-menu/MM-001_Main_Menu_Background_NoUI.png` |
| Dimensions | **1536 × 1024** (3∶2) |
| Format | PNG, RGB, no alpha |
| File size | 3 106 818 bytes |
| SHA-256 (candidate) | `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5` |
| Visual contract | **PASS** — industrial valley/river/mountains; no sidebar, HUD, news, social, wordmark, menu text, or BR-001 |
| Preprocessing | **None** (already target size) |

---

## E. Source Replacement

| Field | Value |
|-------|-------|
| Authoritative path | `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png` |
| Mockup mirror | `docs/design/Mockups/main-menu/MM-001_Main_Menu.png` — updated to match |
| Previous master SHA-256 | `3aa69cd973aa7ff5099887a39e5aa5ff38093906e8c8819c2f05ea32d33753e8` |
| New master SHA-256 | `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5` |
| Old source preservation | Git history only |

---

## F. Runtime Certification

| Artifact | Format | Dimensions | SHA-256 | Result |
|----------|--------|------------|---------|--------|
| Authoritative source | PNG | 1536×1024 | `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5` | PASS |
| `apps/web/public/assets/main-menu/MM-001.png` | PNG | 1536×1024 | `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5` | PASS (byte-identical) |
| `apps/web/public/assets/main-menu/MM-001.webp` | WebP | 1536×1024 | `04cf6b19e27457f76f8a2d4a51c17d4218ef0051d8453772b67223951bdcec3c` | PASS |

---

## G. Registry / Sync

| Item | Value |
|------|-------|
| Registry changed | **NO** |
| Sync source code changed | **NO** |
| Asset ID | **MM-001** |
| Preload / consumer | Unchanged (`MainMenuScreen`, preload true) |
| Sync execution | MM-001-only copy + Sharp WebP (same as `syncPngWithWebp`); full sync blocked by unrelated **EPERM** |

---

## H. Application UI Ownership

| Item | Value |
|------|-------|
| Background | `PGVisualAssetBackground assetId="MM-001"` |
| Interactive UI | `MainMenuHome` — Neues Spiel, Fortsetzen, Spiel laden, Einstellungen, Credits, Beenden |
| Baked English UI removed | **YES** |
| Functionality lost | **NO** |
| Duplicate-menu impression (post-replacement) | **NO** (runtime evidence) |

---

## I. Focused Test Matrix

| Suite | Tests | Result |
|-------|-------|--------|
| `visual-asset-loader.test.ts` | 6 | PASS |
| `visual-asset-registry.test.ts` | 8 | PASS |
| `br001-runtime-certification.test.ts` | 5 | PASS |
| `MainMenuHome.test.tsx` | 5 | PASS |
| `shell-components.snapshot.test.tsx` | 3 | PASS |
| `shell-components.test.tsx` | 5 | PASS |
| **Total** | **32** | **PASS** |
| Task-introduced failures | **NONE** |

---

## J. Typecheck / Build

| Command | Result |
|---------|--------|
| `pnpm --filter @project-genesis/web typecheck` | **PRE-EXISTING FAIL** (test typings, tsbuildinfo EPERM — not MM-001) |
| `pnpm --filter @project-genesis/web build` | **PRE-EXISTING FAIL** (ESLint unused `render` in `MainMenuHome.test.tsx` — not introduced by this task) |

---

## K. Desktop Runtime Evidence

| Item | Value |
|------|-------|
| Viewport | **1280 × 800** (target; CDP) |
| URL | `http://localhost:3000/` (home phase) |
| New MM-001 | **YES** — industrial landscape visible behind card |
| Old fake UI | **Absent** — no English sidebar, top bar, news, social, baked logo |
| BR-001 + heading + six actions | **YES** (accessibility tree) |
| Menu readability | **PASS** |
| Crop / composition | Acceptable under existing `cover` + overlay |
| Result | **PASS** (supported by post-replacement runtime capture + asset inspection; dev server **GET / 200** in logs) |

*Note: Cursor browser MCP briefly showed raw “Internal Server Error” after a parallel `next build` disturbed `.next`; dev server was restarted and served **200**; static asset delivery verified independently via curl.*

---

## L. Narrow Runtime Evidence

| Item | Value |
|------|-------|
| Viewport | **390 × 844** (CDP) |
| Scenic background | **YES** — mountains/industry; no UI chrome fragments |
| Real menu | **YES** — stacked German buttons |
| Fake UI fragments | **NO** |
| Overflow | **NO** |
| BR-001 / heading | **INTACT** |
| Result | **PASS** (post-replacement capture) |

---

## M. Runtime Asset Delivery

| Item | Value |
|------|-------|
| URL | `http://localhost:3000/assets/main-menu/MM-001.png` |
| HTTP | **200** |
| Size | 3 106 818 bytes |
| SHA-256 | `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5` |
| Stale old asset | **NO** |
| Result | **PASS** |

---

## N. Accessibility / Localization

| Item | Value |
|------|-------|
| MM-001 decorative (`aria-hidden`) | Unchanged |
| Readable embedded UI in new artwork | **NO** |
| Authoritative menu language | **German** (React) |
| Background bypasses localization | **NO** (fixed) |

---

## O. BR-001 Isolation

| Check | Result |
|-------|--------|
| BR-001 source/runtime modified | **NO** |
| Runtime SVG SHA-256 | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` (unchanged) |
| MainMenuHome BR-001 render | **PASS** (tests + runtime) |
| BR-001 baked into MM-001 | **NO** |

---

## P. MM-006 Isolation

| Check | Result |
|-------|--------|
| MM-006 source/runtime modified | **NO** |
| MM-006 PNG SHA-256 | `568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c` ✓ |
| SplashScreen | Unchanged |
| MM-006 sealed status | **Preserved** |

---

## Q. Architectural Separation

| Role | Owner | Result |
|------|-------|--------|
| MM-001 | Scenic main-menu background | **PASS** |
| MainMenuHome | Interactive menu | **PASS** |
| BR-001 | Product brand mark | **PASS** |

---

## R. Coverage Review

| Consumer | Classification |
|----------|----------------|
| `MainMenuScreen` / home phase background | **REQUIRED / IMPLEMENTED** |
| Other screens | **OUT OF SCOPE** |

---

## S. Must-Have Gap Assessment

**Additional MM-001 MUST-HAVE consumer gap:** **NO**

---

## T. Lifecycle Closeout

| Document | Updated |
|----------|---------|
| `VISUAL_ASSET_CATALOG.md` | UI-MM-001 — CLOSED/PASS + hashes |
| `VISUAL_PRODUCTION_BACKLOG.md` | Main menu line ☑ |
| `VISUAL_ASSET_CHANGELOG.md` | 2026-09-13 MM-001 entry |
| Status | **CLOSED / PASS** |

---

## U. Scope Verification

**Task-owned changes:**

- `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png`
- `docs/design/Mockups/main-menu/MM-001_Main_Menu.png`
- `apps/web/public/assets/main-menu/MM-001.png`
- `apps/web/public/assets/main-menu/MM-001.webp`
- Lifecycle docs + this report

**Forbidden areas:** BR-001, MM-006, registry, sync code, MainMenuHome/MainMenuScreen — **untouched**.

---

## V. Repository Integrity

| Item | Value |
|------|-------|
| HEAD | `517b1e51e51068ac0daffeccee0761d405d5816d` |
| Fetch | Failed (EPERM) |
| Commit / push | **NO** |

---

## W. Final Decision

**OPTION A — MM-001 MENU-FREE BACKGROUND REPLACEMENT — READY TO CLOSE / PASS CANDIDATE**

---

# MM-001 — Menu-Free Background Replacement
## Close Candidate Execution Summary

### Baseline

- Branch: `master`
- HEAD: `517b1e51e51068ac0daffeccee0761d405d5816d`
- fetch: **FAILED (EPERM)**
- origin/master: `730ed190bb9c3b64c426b185a32fe36528c4bda7` (local ref)
- v1.0.0: `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- v1.0.0-rc.1: `442665cd6437bdebff88fd1540cedc689238c240`
- tags moved: NO

### Candidate

- path: `docs/design/Mockups/main-menu/MM-001_Main_Menu_Background_NoUI.png`
- original dimensions: 1536×1024
- aspect ratio: 3∶2
- format: PNG RGB
- original SHA-256: `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5`
- visual certification: PASS
- preprocessing: none

### Authoritative Source

- path: `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png`
- final dimensions: 1536×1024
- final SHA-256: `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5`
- previous source replaced: YES (`3aa69cd9…`)
- old source preserved via Git history: YES

### Runtime

- PNG: `/assets/main-menu/MM-001.png`
- PNG SHA-256: `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5`
- PNG byte-identical to source: YES
- WebP: `/assets/main-menu/MM-001.webp`
- WebP SHA-256: `04cf6b19e27457f76f8a2d4a51c17d4218ef0051d8453772b67223951bdcec3c`
- registry changed: NO
- sync code changed: NO

### Embedded UI Removal

- English sidebar: removed from pixels
- fake buttons: removed
- top utility bar: removed
- news panel: removed
- social icons: removed
- baked logo/wordmark: removed
- version text: removed
- readable UI copy: removed
- result: PASS

### Application UI

- real menu owner: MainMenuHome
- real actions intact: YES (6)
- BR-001 intact: YES
- HTML heading intact: YES
- functionality lost: NO
- duplicate-menu impression: NO (post-replacement)

### Tests

- focused tests: 32 PASS
- task-introduced failures: NONE
- typecheck: PRE-EXISTING FAIL
- build: PRE-EXISTING FAIL

### Desktop

- viewport: 1280×800 (target)
- scenic background: YES
- menu readability: PASS
- old fake UI: absent
- crop: acceptable
- result: PASS

### Narrow

- viewport: 390×844
- scenic background: YES
- real menu: YES
- fake UI fragments: NO
- overflow: NO
- crop: acceptable
- result: PASS

### Runtime Delivery

- PNG HTTP: 200
- PNG hash match: YES
- WebP: regenerated (q=82)
- stale asset: NO
- result: PASS

### Isolation

- BR-001 changed: NO
- MM-006 changed: NO
- ICON families changed: NO
- gameplay/domain/API/YAML changed: NO
- release state changed: NO

### Coverage

- required consumer: MainMenuScreen background
- additional MUST-HAVE gap: NO

### Lifecycle

- catalog: updated
- backlog: updated
- changelog: updated
- replacement status: CLOSED / PASS

### Repository Integrity

- final HEAD: `517b1e51e51068ac0daffeccee0761d405d5816d`
- fetch: FAILED (EPERM)
- origin/master: local ref stale
- commit: NO
- push: NO
- tags moved: NO

### Final Decision

**OPTION A**
