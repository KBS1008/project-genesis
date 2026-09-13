# POST-V1 BR-001 Phase 1D — MainMenuHome + Favicon Consumer Integration Report

**Project:** Project Genesis  
**Date:** 2026-09-13  
**Slice:** BR-001 Phase 1D — MainMenuHome brand symbol + minimum favicon wiring  
**HEAD:** `f512ac7642171d1708c6a6fe143ca922e4e9cc94`

---

## A. Executive Summary

Phase 1D integrates the Phase-1C certified **BR-001** runtime SVG into **MainMenuHome** via **PGVisualAssetImage** and wires a **minimum** browser favicon consumer through **Next.js `metadata.icons`** (32×32 PNG only). Sealed asset hashes, registry, and sync tooling were **not** modified.

| Item | Result |
|------|--------|
| Integrity gate | **PASS** |
| MainMenuHome integration | **DONE** |
| Favicon decision | **Option A** — certified 32×32 PNG via `metadata.icons` |
| Registry / sync | **UNCHANGED** |
| Phase-1C tests | **PASS** (13) |
| New focused tests | **PASS** (6) — MainMenuHome + layout metadata |
| Shell snapshot test | **PASS** — MainMenuHome assertion updated (2026-09-13 finish pass) |
| Desktop / narrow browser runtime | **PASS** — `http://localhost:3000/` at ~1280×800 and 390×844 |
| Asset hashes after work | **PASS** |

**Final decision (Phase 1D implementation):** **PASS** — superseded by consolidated close candidate (see `POST_V1_BR_001_PHASE_1_CLOSE_CANDIDATE_REPORT.md`).

### Phase 1 finish-pass addendum (2026-09-13)

| Item | Result |
|------|--------|
| Snapshot / shell test | **PASS** (22 focused tests) |
| Desktop runtime | **PASS** — BR-001 + heading + subtitle; no overlap/clipping |
| Narrow runtime | **PASS** — 390×844; brand row stable |
| Favicon | **PASS** — metadata link + HTTP 200 on `/favicon-32x32.png` |
| Lifecycle closeout | **DONE** — catalog, backlog, changelog |

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `f512ac7642171d1708c6a6fe143ca922e4e9cc94` |
| `origin/master` | `730ed190bb9c3b64c426b185a32fe36528c4bda7` |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |

---

## C. Phase-1C Integrity Gate

| Asset | SHA-256 | Expected | Result |
|-------|---------|----------|--------|
| Source SVG | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` | match | **OK** |
| Runtime SVG | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` | match | **OK** |
| Favicon 16 | `b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d` | match | **OK** |
| Favicon 32 | `4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6` | match | **OK** |

---

## D. MainMenuHome Consumer Audit

| Item | Finding |
|------|---------|
| Component path | `apps/web/src/presentation/screens/menu/MainMenuHome.tsx` |
| Parent | `MainMenuScreen.tsx` — `pg-main-menu-card` shell unchanged |
| Title markup | `<h1>Project Genesis</h1>` preserved inside new text column |
| Subtitle | German tagline in `<p>` unchanged |
| Brand container | `.pg-main-menu-brand` |
| Styles | `apps/web/src/presentation/screens/menu/menu.css` |
| Responsive | Card `width: min(32rem, 100%)`; brand row flex with `min-width: 0` on text column |
| Asset API | **PGVisualAssetImage** — registry SVG, `webp: null` → single `<img>` |

---

## E. Existing Asset Infrastructure Decision

**Reuse PGVisualAssetImage** — no new `BrandLogo` / `BR001Logo` component.

Rationale: registry entry `BR-001` is `format: svg`, path `/assets/branding/BR-001.svg`; loader returns primary-only when `webp: null`; null registry entry yields no image (heading remains).

---

## F. MainMenuHome Integration

Markup (conceptual): `[ BR-001 img ] [ h1 + p ]` inside `.pg-main-menu-brand-row`.

| Field | Value |
|-------|-------|
| `assetId` | `BR-001` |
| `alt` | `""` |
| `className` | `pg-main-menu-brand-mark` |
| `loading` | `eager` |
| Display size | `2.5rem` × `2.5rem` (~40px), `object-fit: contain` |

---

## G. Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Product name authoritative | `<h1>Project Genesis</h1>` always rendered |
| Symbol decorative | `alt=""` on brand `<img>` |
| No duplicate SR label | No “logo” alt text |

---

## H. Failure / Fallback Contract

| Scenario | Behavior |
|----------|----------|
| Registry miss for `BR-001` | `PGVisualAssetImage` returns `null`; **h1 unchanged** (tested via spy on `getVisualAssetEntry`) |
| Load error | No MM-006 substitution; no conditional heading |
| MM-006 | **Not referenced** for brand |

---

## I. Responsive Geometry

CSS additions only:

- `.pg-main-menu-brand-row` — flex, center align, `gap: var(--space-md)`
- `.pg-main-menu-brand-mark` — fixed 2.5rem square, `flex-shrink: 0`
- `.pg-main-menu-brand-text` — `min-width: 0` for narrow card

No menu hierarchy / MM-001 background changes.

**Browser narrow/desktop verification:** **NOT AVAILABLE** (session did not run local Next dev server). Layout contract reviewed statically.

---

## J. Favicon Architecture Audit

| Item | Before Phase 1D |
|------|-----------------|
| `layout.tsx` | `title` + `description` only |
| `app/icon.*` | **None** |
| `public/favicon.ico` | **None** |
| Certified PNGs | `favicon-16x16.png`, `favicon-32x32.png` present, unwired |
| Auto-discovery | Next.js does **not** auto-wire arbitrary `favicon-32x32.png` name without metadata or `app/icon` convention |

---

## K. Favicon Consumer Decision

**Classification: A — Wire only certified 32×32 PNG**

Mechanism: Next.js App Router **`export const metadata`** in `apps/web/src/app/layout.tsx`:

```typescript
icons: {
  icon: [{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }],
},
```

---

## L. Favicon Minimality Justification

| Option | Why not chosen / chosen |
|--------|-------------------------|
| 16 + 32 PNG | **Not chosen** — no repository evidence that both sizes must be declared; modern tabs scale 32px asset |
| 32 PNG only | **Chosen** — single certified derivative satisfies tab favicon; explicit `metadata.icons` documents contract |
| Runtime SVG favicon | **Not chosen** — no existing `app/icon.svg`; would add a second favicon representation without evidence |
| `app/icon.png` duplicate | **Not chosen** — avoids duplicate file; uses existing certified public PNG |
| `favicon.ico` | **Not created** — not required |

16×16 PNG remains on disk as **certified candidate** but is **not wired**.

---

## M. Targeted Tests

| File | Coverage | Result |
|------|----------|--------|
| `MainMenuHome.test.tsx` | h1 preserved; BR-001 img src/alt; no MM-006; actions; registry-null fallback | **5 PASS** |
| `layout.test.ts` | `metadata.icons` → 32×32 PNG | **1 PASS** |
| `br001-runtime-certification.test.ts` | Phase-1C sealed contract | **5 PASS** |
| `visual-asset-registry.test.ts` | Registry | **8 PASS** |
| `shell-components.snapshot.test.tsx` | MainMenuHome snapshot | **FAIL** (stale) |

---

## N. Desktop Runtime Evidence

**NOT AVAILABLE** — application not run in browser this session.

Static integration review: **PASS** (markup, CSS, registry path, tests).

---

## O. Narrow Runtime Evidence

**NOT AVAILABLE** — same as desktop.

Static responsive CSS (`min-width: 0`, fixed mark size): **contract OK**.

---

## P. Favicon Verification

| Check | Result |
|-------|--------|
| Static metadata contract | **PASS** — `layout.test.ts` |
| Runtime browser tab | **STATIC CONTRACT ONLY** |
| New derivatives | **NO** |

---

## Q. Asset Hash Integrity (End)

All four certified files: **unchanged** (same hashes as §C).

| Area | Modified |
|------|----------|
| Registry | **NO** |
| Sync | **NO** |
| Source / runtime SVG / favicon bytes | **NO** |

---

## R. Scope Verification

| Forbidden area | Changed |
|----------------|---------|
| SplashScreen / MM-006 / MM-001 / MM-007 | **NO** |
| Gameplay / domain / API / YAML | **NO** |
| ICON-001 / ICON-002 | **NO** |
| Lifecycle catalog/backlog/changelog | **NO** |
| Release tags | **NO** |

---

## S. Repository Integrity

**Phase 1D task-owned files:**

- `apps/web/src/presentation/screens/menu/MainMenuHome.tsx`
- `apps/web/src/presentation/screens/menu/menu.css`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/presentation/screens/menu/MainMenuHome.test.tsx`
- `apps/web/src/app/layout.test.ts`
- This report

**Commit / push:** **NO**

---

## T. Deferred Work

| Item | Notes |
|------|-------|
| Update MainMenuHome shell snapshot | `vitest -u` on `shell-components.snapshot.test.tsx` or structural assertion |
| Manual desktop/narrow QA | Run dev server + viewport check |
| BR-001 Phase 1 lifecycle closeout | Later doc-only slice |
| Optional wire 16×16 | Only if Phase 1 review requires dual-size metadata |

---

## U. Final Gate Recommendation

**OPTION B — BR-001 PHASE 1D IMPLEMENTATION COMPLETE / SMALL INTEGRATION DELTA REQUIRED**

Integration and favicon contract are complete; **one** stale snapshot test remains due to host file **EPERM** on the snapshot artifact.

---

# Required MainMenu Facts

| Field | Value |
|-------|-------|
| Consumer | MainMenuHome |
| Existing Project Genesis text preserved | **YES** |
| BR-001 visible | **YES** (via PGVisualAssetImage) |
| Asset infrastructure used | **PGVisualAssetImage** |
| New one-off logo component | **NO** |
| Decorative semantics | **YES** |
| alt | `""` |
| MM-006 fallback | **NO** |
| Source artwork modified | **NO** |
| Runtime SVG modified | **NO** |
| Registry modified | **NO** |
| Sync modified | **NO** |

---

# Required Favicon Facts

| Field | Value |
|-------|-------|
| Existing architecture before | No icons metadata; no `app/icon.*` |
| Selected mechanism | **`metadata.icons`** in root `layout.tsx` |
| Selected derivative(s) | Certified **32×32 PNG** only |
| 16 PNG wired | **NO** |
| 32 PNG wired | **YES** |
| Runtime SVG wired as favicon | **NO** |
| metadata.icons modified | **YES** |
| App Router icon convention used | **NO** |
| New derivative required | **NO** |
| favicon.ico created | **NO** |
| Apple-touch icon created | **NO** |

---

# BR-001 Phase 1D — MainMenuHome + Favicon Consumer Integration
## Execution Summary

### Baseline

- **Branch:** `master`
- **HEAD:** `f512ac7642171d1708c6a6fe143ca922e4e9cc94`
- **origin/master:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- **v1.0.0:** `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- **v1.0.0-rc.1:** `442665cd6437bdebff88fd1540cedc689238c240`
- **tags moved:** NO

### Integrity Gate

- **source SVG SHA-256:** `e1291850…` **OK**
- **runtime SVG SHA-256:** `e1291850…` **OK**
- **favicon 16 / 32:** **OK**
- **integrity:** **PASS**

### MainMenuHome Audit

- **component:** `MainMenuHome.tsx`
- **title markup:** h1 + p in `.pg-main-menu-brand-text`
- **asset infrastructure:** PGVisualAssetImage
- **responsive structure:** flex brand row + min-width text column
- **new component required:** NO

### MainMenuHome Integration

- **BR-001 rendered:** YES
- **Project Genesis text preserved:** YES
- **decorative:** YES
- **alt:** `""`
- **MM-006 fallback:** NO
- **layout change:** minimal brand row
- **CSS change:** scoped brand row/mark/text rules

### Favicon Audit

- **existing favicon architecture:** none wired
- **framework mechanism:** Next.js Metadata API
- **certified candidates available:** 16 + 32 PNG on disk

### Favicon Decision

- **selected mechanism:** `metadata.icons`
- **selected derivative(s):** 32×32 PNG
- **16 PNG wired:** NO
- **32 PNG wired:** YES
- **SVG wired:** NO
- **metadata.icons changed:** YES
- **App Router convention used:** NO
- **new derivative created:** NO
- **minimality rationale:** single declared size; browsers scale; 16 remains uncertified-for-wiring candidate on disk

### Validation

- **focused MainMenu tests:** PASS (5)
- **Phase-1C tests:** PASS (13)
- **metadata test:** PASS (1)
- **desktop runtime:** NOT AVAILABLE
- **narrow runtime:** NOT AVAILABLE
- **browser favicon:** STATIC CONTRACT ONLY
- **typecheck/build:** not re-run (known EPERM on `.next/trace` historically)

### Asset Integrity After Implementation

- **source unchanged:** YES
- **runtime SVG unchanged:** YES
- **favicon 16 unchanged:** YES
- **favicon 32 unchanged:** YES
- **registry unchanged:** YES
- **sync unchanged:** YES

### Scope

All forbidden areas: **NO**

### Repository Integrity

- **task-owned files:** listed §S
- **commit:** NO
- **push:** NO
- **tags moved:** NO

### Final Decision

**OPTION A — BR-001 PHASE 1D CONSUMER INTEGRATION — PASS** (validated in consolidated finish pass)

**Follow-up:** Run `pnpm exec vitest run apps/web/src/presentation/components/shell/shell-components.snapshot.test.tsx -u` (or update snapshot manually) to clear the remaining test delta.
