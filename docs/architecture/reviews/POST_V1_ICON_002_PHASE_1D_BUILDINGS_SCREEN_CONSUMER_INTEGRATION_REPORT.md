# POST-V1 ICON-002 Phase 1D — BuildingsScreen / Baukatalog Consumer Integration Report

**Project:** Project Genesis  
**Date:** 2026-09-09  
**Slice:** ICON-002 Phase 1D — first consumer integration (BuildingsScreen → Baukatalog only)  
**HEAD (start):** `8f8315f590944edfac4eaf8fb131c1a3a5fa5ce2` (Phase 1C sealed)

---

## A. Executive Summary

ICON-002 Phase 1D integrates the certified `BuildingCategoryIcon` into exactly one consumer: **BuildingsScreen → Baukatalog**.

| Item | Result |
|------|--------|
| Consumer scope | **PASS** — Baukatalog only |
| Component reuse | **PASS** — `BuildingCategoryIcon` unchanged |
| Category data source | **PASS** — existing `entry.category` from `placeBuilding` hints |
| Duplicate mapping | **NO** |
| `currentColor` / inline SVG | **PASS** — no themed `<img>` |
| Authoritative text preserved | **PASS** — building name + category label remain |
| Unknown category fallback | **PASS** — text only, no icon |
| Phase 1C regression | **PASS** — 7 tests |
| Consumer tests | **PASS** — 4 tests |
| `pnpm sync-visual-assets` | **PASS** |
| `pnpm build:web` | **PASS** |
| Source SVG hashes | **UNCHANGED** |
| Runtime evidence | **PASS** — desktop + narrow Baukatalog screenshots |

**Final decision:** **OPTION A — PHASE 1D BUILDINGSSCREEN CONSUMER CLOSED / PASS**

---

## B. Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD (start) | `8f8315f590944edfac4eaf8fb131c1a3a5fa5ce2` |
| `origin/master` | Same as HEAD at start (Phase 1C already pushed) |
| Unrelated dirty work | Preserved (M11/M12 docs, design assets, prompts, temp saves) |
| Phase 1C commit present | **YES** — ancestor verified |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |

---

## C. Phase 1C Integrity

| Check | Result |
|-------|--------|
| Commit `8f8315f` in history | **YES** |
| `BuildingCategoryIcon` present | **YES** |
| Six category mappings | **YES** |
| Six registry entries | **YES** |
| Inline SVG / `currentColor` | **YES** — unchanged |
| Source/runtime SVG edits | **NONE** |
| Phase 1C tests | **7/7 PASS** |

No Phase 1C architecture changes were required.

---

## D. Consumer Selection

| Item | Value |
|------|-------|
| Screen | `BuildingsScreen` |
| Exact integration point | Baukatalog card — `catalog.map()` hint rows inside `Card title="Baukatalog"` |
| First consumer rationale | Per art brief / Phase 1C report — preferred first integration point |
| Other consumers touched | **NONE** |

---

## E. Existing Baukatalog Data Flow

Category values flow from server view data without new derivation:

1. API / workspace provides `companyViewData.hints.placeBuilding`.
2. Each hint exposes `category` as the raw `BuildingCategory` enum string (e.g. `PRODUCTION`).
3. Baukatalog renders `{entry.name}`, `{entry.category}`, and placement status from the same hint object.

No duplicate category map, YAML change, or gameplay fetch was added.

---

## F. Integration Seam

```tsx
<div className="pg-operation-hint-category">
  <BuildingCategoryIcon category={entry.category} />
  <span>{entry.category}</span>
</div>
```

- One decorative glyph per catalog row.
- Icon precedes the existing uppercase category label.
- Building name (`<strong>{entry.name}</strong>`) remains primary and unchanged.

---

## G. UI / Layout Delta

| Change | Location |
|--------|----------|
| Import + icon slot | `BuildingsScreen.tsx` Baukatalog row |
| Layout helper | `.pg-operation-hint-category` in `operation-screen.css` |

Layout uses `inline-flex`, `align-items: center`, `gap: var(--space-xs)`. Icon size inherits Phase 1C token `--icon-lg` (~24px) via `.pg-building-category-icon svg`.

No row/card height regression observed in runtime review.

---

## H. Accessibility

| Check | Result |
|-------|--------|
| Icon decorative | **YES** — `aria-hidden="true"` on wrapper + inline SVG |
| Duplicate accessible name | **NO** — category text remains the readable label |
| Icon focusable | **NO** |
| Icon-only UI | **NO** — authoritative text preserved |

---

## I. Fallback Behavior

| Case | Behavior |
|------|----------|
| Known `BuildingCategory` | Inline SVG glyph + category text |
| Unknown category string | `BuildingCategoryIcon` returns `null`; category text unchanged |

Verified by unit test with `category: 'UNKNOWN'`.

---

## J. Tests

| Suite | Count | Result |
|-------|------:|--------|
| `BuildingsScreen.test.tsx` | 4 | **PASS** |
| `BuildingCategoryIcon.test.tsx` | 3 | **PASS** |
| `icon-002-svg-certification.test.ts` | 4 | **PASS** |
| **Total targeted** | **11** | **PASS** |

New consumer tests:

- decorative icon beside Baukatalog category text (`PRODUCTION`, `stroke="currentColor"`, `aria-hidden`);
- unknown category preserves text without SVG.

---

## K. Build / Validation

| Command | Result |
|---------|--------|
| `pnpm exec vitest run` (three targeted files) | **11/11 PASS** |
| `pnpm sync-visual-assets` | **PASS** |
| `pnpm build:web` | **PASS** |

---

## L. Runtime Visual Evidence

Captured from live dev stack (`pnpm dev`) with save `saves/e2e-m9-save-load-flow.json`, screen `Gebäude` → Baukatalog.

| File | Notes |
|------|-------|
| `docs/architecture/reviews/evidence/POST_V1_ICON_002_BUILDINGS_SCREEN_RUNTIME.png` | Desktop width; multiple categories visible (PRODUCTION, ENERGY, STORAGE, INFRASTRUCTURE, ADMINISTRATION) |
| `docs/architecture/reviews/evidence/POST_V1_ICON_002_BUILDINGS_SCREEN_NARROW_RUNTIME.png` | 480px constrained width; Baukatalog icons + text remain readable |

Visual self-review:

- glyphs visible at expected size;
- `currentColor` inherits muted text tone;
- no missing-icon artifacts;
- no category-specific color coding;
- PRODUCTION / INFRASTRUCTURE / ADMINISTRATION distinguishable in real UI;
- narrow layout acceptable — icons stay aligned with category text.

---

## M. SVG Hash Integrity

SHA-256 unchanged from Phase 1C seal:

| Asset | SHA-256 |
|-------|---------|
| Production | `00855f23ab805a9cffaa6ce1c8e675f2f17c38f3d48b853294fb7e1779aef1e3` |
| Energy | `b842d1259bef710ba10e94908c368ba5435cc4d556465e71a190a55d49ee5121` |
| Storage | `1052ede34e27cce7e539a7f6fd918d75471c3a54800437e55bc5a9f9d86a1c5f` |
| Infrastructure | `9861761fee7356a5f2f2d3fbc48a07d59b37168287877061b7ebfca87ebf96f7` |
| Administration | `8cb5c8badc4fffd74629cde7c0d9ae7a016ede1e5a0ab25681de2c6c3c4f3d98` |
| Research | `9c33e31373c59395b0d9204a1ae1f7fa6fcef845565c677bf1fbc1091fcf06ab` |

Source SVG geometry modified: **NO**

---

## N. Scope Verification

| Area | Changed |
|------|:-------:|
| BuildingsScreen Baukatalog | **YES** (task-owned) |
| ProductionScreen / Operations / Market / world map | **NO** |
| Building YAML / domain / API | **NO** |
| ICON-001 | **NO** |
| Certified ICON-002 SVG sources | **NO** |
| Registry / sync pipeline architecture | **NO** |
| V1 tags | **NO** |
| Second ICON-002 consumer | **NO** |

---

## O. Remaining Optional Consumers

Future optional review candidates only (not implemented):

- other BuildingsScreen locations (owned-building list, detail panel);
- production / transport / market passive category displays;
- world map building markers.

ICON-002 lifecycle closeout remains a separate slice.

---

## P. Final Decision

# **OPTION A — PHASE 1D BUILDINGSSCREEN CONSUMER CLOSED / PASS**

Baukatalog integrates ICON-002 via the certified component, preserves authoritative text and `currentColor` inline SVG semantics, passes targeted tests and build validation, retains sealed SVG hashes, and includes acceptable runtime screenshot evidence.
