# POST-V1 — Slice 3 Responsive Layout & Label Boundary Closure Report

**Datum:** 2026-10-12  
**Auftrag:** `docs/development/Prompts/POST_V1_WORLD_WEB_FINAL_2D_SCENIC_SLICE_3_RESPONSIVE_LAYOUT_LABEL_BOUNDARY_CLOSURE.md`  
**Committed HEAD (Referenz):** `4c41dea3eea657bf9a3e1588bebcd4ea22213171`  
**Modus:** Bounded closure ohne Commit / Push / Tag  

---

## A. Executive Summary

Slice-3-Review (OPTION B — PARTIAL) adressiert drei Befunde:

| Befund | Ursache (nachgewiesen) | Fix | Status |
|--------|------------------------|-----|--------|
| **A. Narrow Web** | `.pg-workspace-frame-with-inspector:has(.pg-world-with-assets)` erzwang **zwei Spalten** (Karte + Inspector) auch unter 64rem → World-Workspace ~160 px | Inspector-/World-Grid unter **64rem** auf **1 Spalte**; Scenic-Viewport `width: 100%` | **PASS** |
| **B. Label-Clipping** | Extreme horizontale Offsets + fehlende Rand-Clamps; Overlap-Gate unvollständig | Inward Offsets, `middle`-Anker, **Clamp** an Plate-Ränder; Browser-Gate `fullyInsideViewport` | **PASS** |
| **C. Horizontaler Overflow** | u. a. `border-box` fehlte auf Shell/Viewport; Karten-`border` ohne `box-sizing` | `box-sizing` auf `.pg-workspace`, Viewport, Shell-Body; `max-width: 100%` | **PARTIAL** (~9–10 px `scrollWidth` bleibt) |

**Ergebnisoption:** **OPTION B — PARTIAL** (Narrow + Labels closure-ready; Overflow-Gate formal noch nicht 0 px)

---

## B. Repository Baseline

HEAD Referenz `4c41dea3…`; lokaler WIP unverändert durch reset/clean/stash. Slice-3-Evidenz (presentation) nicht überschrieben.

---

## C. Narrow-Web Root Cause

**Messkette (480×900, vor Fix):** `shellMain` ~432 px → `frameMain`/`workspace` ~**160 px** bei `frameGrid: "432px"` (Inspector neben Karte in einer Spalte).

**Ursache:** World-spezifische Regel  
`.pg-workspace-frame-with-inspector:has(.pg-world-with-assets) { grid-template-columns: minmax(0,1fr) minmax(12.5rem,16rem); }`  
ohne Media Query — überschreibt die globale Stack-Regel (`max-width: 1024px`) auch auf schmalen Viewports.

---

## D. Responsive Layout Fix

- **Breakpoint `< 64rem`:** Inspector unter Karte (`grid-template-columns: 1fr`); World-Layout eine Spalte (Layer Manager unter Karte).
- **Desktop `≥ 64rem`:** unveränderte schmalere Inspector-Spalte aus Slice 3.
- Viewport: `box-sizing: border-box`, `max-width: 100%`.

---

## E. Messungen vorher / nachher (480×900, Scenic ON, fitWorld)

| Metrik | Slice 3 (partial) | Nach Closure |
|--------|-------------------|--------------|
| World-Workspace Breite | ~160 px | **~432 px** |
| Kartenviewport Breite | ~178 px | **~432 px** |
| Scenic-Plate Breite | ~130 px | **~343 px** |
| Plate Höhe | ~73 px | **~193 px** |

Quelle: `evidence/production-slice-3-responsive-layout-label-boundary-closure/tests/manifest--scenic-on.json` (`narrow-480`); Referenz `baseline/slice-3-partial-narrow-reference.json`.

Desktop 1440×900: Kartenviewport weiter ~662 px (keine Regression).

---

## F. Label Boundary Fix

- `world-scenic-region-label-layout.ts`: sanftere Offsets, `middle`-Ausrichtung, horizontale/vertikale **Clamps** an Plate-Ränder (mit Textbreiten-Schätzung).
- `PGWorldCanvas.tsx`: übergibt Regionstitel für Clamp.
- Browser: alle vier Labels `fullyInsideViewport: true` an 1440, 1280, 1024, 768, 480, 390 (Manifest).

---

## G. Horizontal Overflow

**Befund:** `document.documentElement.scrollWidth - clientWidth` ≈ **9 px** (1440) / **10 px** (schmal).

**Maßnahmen:** `box-sizing: border-box` auf `.pg-workspace` (`navigation.css`), World-Viewport/Layout, Shell-Body/Status-Bar (World-Scope).

**Rest:** Overflow bleibt in allen erfassten Viewports ~9–10 px — vermutlich außerhalb World-CSS (Shell-Chrome/Subpixel). Kein `overflow-x: hidden` auf `html`/`body`. Weitere Ursache für unabhängige Review offen.

---

## H. Scenic AUS / AN

Evidenz: `tests/manifest--scenic-off.json`, `manifest--scenic-on.json`; Mode-Guards im Capture-Skript.

---

## I. PDM / Kamera / Regionen

- Keine Änderungen an `useWorldCamera`, `world-camera-math`, Domain-Projektion.
- Capture: PDM Preview/Confirm-Screenshots (Scenic ON); QA-Reset `scenic-slice-1-pdm-gate-baseline.json` nach Confirm.
- Regions-Screenshots und `fitWorld` über alle Viewports im Closure-Capture.

---

## J. Changed Files

| Datei | Änderung |
|-------|----------|
| `world-components.css` | Responsive World/Inspector-Grid, box-sizing, Narrow Scenic 16:9 |
| `navigation.css` | `box-sizing: border-box` auf `.pg-workspace` |
| `world-scenic-region-label-layout.ts` | Clamps + Offset-Tuning |
| `world-scenic-region-label-layout.test.ts` | Horizontal-Margin-Tests |
| `PGWorldCanvas.tsx` | Label-Text an Layout-Resolver |
| `tools/capture-world-scenic-slice-3-responsive-layout-label-boundary-closure.mjs` | Closure-Evidenz |
| `evidence/.../production-slice-3-responsive-layout-label-boundary-closure/` | Manifeste + Screenshots |

---

## K. Tests / Build

| Prüfung | Ergebnis |
|---------|----------|
| `world-scenic-region-label-layout.test.ts` | 3 tests PASS |
| Scenic/world regression (Slice-3-relevant) | PASS |
| `pnpm --filter @project-genesis/web typecheck` | PASS |
| Build (vor Closure-Report) | PASS |

---

## L. Evidence Inventory

`docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-responsive-layout-label-boundary-closure/`  
Review: `review-overview/index--scenic-on.html`, `index--scenic-off.html`

---

## M. Final Gate (Auszug)

| Kriterium | Status |
|-----------|--------|
| Narrow-Web Workspace/Plate sinnvoll | **PASS** |
| Vier Labels vollständig im Viewport | **PASS** |
| Label-Label-Overlap | **PASS** |
| Desktop-Layout unverändert brauchbar | **PASS** |
| Horizontal Overflow = 0 | **PARTIAL** |
| Scenic AUS/AN | **PASS** |
| Kein Commit | **PASS** |

---

## N. Exact Next Step

Unabhängige Review: Overflow-Ursache per DOM-Überstand-Liste verifizieren; bei 0 px Rest → OPTION A für gesamten Slice 3.

---

**Ergebnisoption:** **OPTION B — PARTIAL**
