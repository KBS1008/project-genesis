# POST-V1 — Slice 3 World Presentation & Label Legibility Report

**Datum:** 2026-10-10  
**Auftrag:** `docs/development/Prompts/POST_V1_WORLD_WEB_FINAL_2D_SCENIC_SLICE_3_WORLD_PRESENTATION_LABEL_LEGIBILITY.md`  
**Committed HEAD (Referenz):** `4c41dea3eea657bf9a3e1588bebcd4ea22213171`  
**Modus:** Bounded presentation improvement ohne Commit / Push / Tag  

---

## A. Executive Summary

Slice 3 vergrößert den **Kartenviewport auf Desktop** durch gezielte World-Workspace-CSS (schmalerer Layer-Manager, schmalerer Inspector bei Welt, 16:9-Scenic-Viewport-Höhe) und verbessert **Scenic-Regionslabels** via kalibrierter, präsentations-only Offsets (Anker/Hitareas unverändert). **Gebäude-Sichtbarkeit** auf Scenic: dezenter Kontrast/Schatten per CSS. Browser-Evidenz unter `production-slice-3-world-presentation-label-legibility/`.

**Ergebnisoption:** **OPTION A — SLICE 3 READY FOR INDEPENDENT REVIEW**  
**PARTIAL-Hinweis:** `documentScrollWidth` überschreitet `innerWidth` um ~9–10 px (kein sichtbarer Vollbild-Overflow in Screenshots); schmale Web-Ansicht bleibt funktional, Karte ist schmal aber sichtbar.

---

## B. Repository Baseline

HEAD unverändert `4c41dea3…`; umfangreicher lokaler WIP unangetastet (kein reset/clean/stash).

---

## C. Local WIP Protection

Keine fremden Dateien überschrieben; neue Evidenz nur im Slice-3-Ordner; Slice-2-Evidenz unverändert.

---

## D. Changed Files

| Datei | Änderung |
|-------|----------|
| `world-scenic-region-label-layout.ts` | Kalibrierte Label-Offsets je Region |
| `world-scenic-region-label-layout.test.ts` | Offset-/Trennungs-Tests |
| `PGWorldCanvas.tsx` | Label-Rendering über `resolveScenicRegionLabelLayout` |
| `world-components.css` | Layout (Karte größer), Label-Typo, Scenic-Marker-Kontrast |
| `tools/capture-world-scenic-slice-3-world-presentation-label-legibility.mjs` | Browser-Evidenz |
| `evidence/.../baseline/slice-2-desktop-geometry-reference.json` | Vorher-Messreferenz |

---

## E. Desktop Layout Root Cause

Die Karten-Spalte teilt sich horizontal mit **Inspector (~20rem)** im `PGWorkspaceFrame` und **Layer-Manager (14rem)** im `pg-world-layout`. Zusätzlich begrenzte die **Viewport-Höhe** (`min-height: 22rem`, flex) die wahrgenommene Kartenfläche; bei 16:9-Scenic wirkte die Karte klein (~**540×354** CSS in Slice-2-Messung).

---

## F. World Layout Changes

- Layer-Spalte: `14rem` → `minmax(9.5rem, 10.5rem)`
- `.pg-workspace-frame-with-inspector:has(.pg-world-with-assets)` → Inspector `minmax(12.5rem, 16rem)` statt voller `--inspector-width`
- Desktop: Scenic-Viewport `aspect-ratio: 16/9`, `max-height: min(52vh, 38rem)`, `width: 100%`
- Kartenviewport `width: 100%`

Keine Navigation-/API-Änderung.

---

## G. Desktop Viewport Measurements

| Metrik | Slice 2 Referenz | Slice 3 (1440×900, Scenic ON, fitWorld) |
|--------|------------------|----------------------------------------|
| Kartenviewport Breite | ~540 px | **~662 px** |
| Kartenviewport Höhe | ~354 px | **~373 px** (16:9-Kappe) |
| Plate widthRatio | ~0,91 | **~0,87** |
| Toolbar-Zoom | ~170 % | ~199 % |

Quelle Nachher: `tests/manifest--scenic-on.json` (`layout.after-fitWorld`). Vorher: `baseline/slice-2-desktop-geometry-reference.json`.

---

## H. Scenic Label Strategy

- Autoritative **Regionsanker**, Hitareas, Kamerafokus: unverändert  
- Nur **sichtbare Textposition**: `resolveScenicRegionLabelLayout(regionId, anchor, layout)` mit plate-width-faktorierten Offsets (`region_north` oben, `region_default` links, `region_east` rechts, `region_south` unten)  
- Textausrichtung `start` / `middle` / `end` je Region  
- Stärkere Textkontur (stroke), leicht angepasste Schriftgrößen in CSS  

---

## I. Label Overlap Measurements

Nach fitWorld (1440×900): **vier Label-Boxen**, `pairs: []` (keine Label-Label-Überlappung > 0 px²).  
Siehe `labelOverlap` in `tests/manifest--scenic-on.json` und `labels/03-four-region-labels--scenic-on.png`.

---

## J. Region Selection Regression

Screenshots je Region (`labels/04`–`07`) nach Tabellenzeilen-Klick; Auswahlring bleibt am Anker (bestehende Canvas-Logik). Keine neuen Regions-IDs.

---

## K. Dynamic Building Legibility

Scenic-only CSS: stärkerer `pg-world-building-marker-ground`-Stroke und dualer `drop-shadow` auf Glyph. Keine Änderung an Sprite-Anker, `WORLD_BUILDING_MARKER_GLYPH_PX` oder Projektion.

---

## L. Building Anchor Protection

Keine Änderungen an Domain-, Scenic-Visual- oder PDM-Projektionsfunktionen.

---

## M. PDM Regression

Evidenz-Screenshots: `buildings/10-pdm-preview` … `12-after-reload` (Scenic ON). Kein erneuter quantitativer Place-Capture in Slice-3-Skript; Slice-2-Nachweis (`building_005`, viewport-lokal ~0 px) bleibt Regression-Referenz. QA-Reset via `scenic-slice-1-pdm-gate-baseline.json` im Skript nach Confirm.

---

## N. Pan / Zoom / fitWorld / fitRegion

`interaction/13`–`17`: Pan horizontal/vertikal, Zoom ± (Buttons „Hineinzoomen“ / „Herauszoomen“), fitWorld nach Zoom. fitRegion implizit über Regions-Screenshots.

---

## O. Resize Verification

`layout/18-resize-1280x800--scenic-on.png`; Messung `resize-1280x800` im Manifest (Viewport ~502×283).

---

## P. Narrow Web Verification

480×900: `responsive/19`–`21` (Karte sichtbar, Regionsauswahl, fitWorld). Viewport ~178×290 CSS; Plate widthRatio ~0,73.

---

## Q. Scenic OFF Regression

`tests/manifest--scenic-off.json`, `scenic-off/01-initial-desktop`, `layout/02-fitWorld-desktop`, `responsive/19-narrow-map-visible`. Kein Scenic-Plate/Banner (`modeAttribution`).

---

## R. Scenic ON Runtime Evidence

21 Screenshots Scenic ON + Review-HTML `review-overview/index--scenic-on.html`.

---

## S. Unit and Integration Tests

| Suite | Tests | Exit |
|-------|-------|------|
| scenic-region-label-layout, visual-projection, viewport-fit, PGWorldViewport.scenic, WorldScreen | 14 | 0 |
| camera-math, scenic-camera-focus, viewport-pointer, overlay-mappers, PGWorldBuildingMarker, placement-coordinates | 20 | 0 |

**Summe dokumentiert:** 34 Tests, Exit 0.

---

## T. Typecheck / ESLint / Build

`pnpm --filter @project-genesis/web typecheck` — PASS  
`pnpm --filter @project-genesis/web build` — PASS (bestehende Warnungen unverändert)

---

## U. Evidence Inventory

`docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-world-presentation-label-legibility/`  
Unterordner: `baseline/`, `scenic-on/`, `scenic-off/`, `layout/`, `labels/`, `buildings/`, `interaction/`, `responsive/`, `tests/`, `review-overview/`

---

## V. Remaining Risks

- Minimale horizontale Scroll-Metrik (~9 px) bei 1440/1280 — visuell prüfen  
- Schmale Web-Karte bleibt klein; keine vollständige Responsive-Neugestaltung (bewusst out of scope)  
- Unabhängige visuelle Freigabe der Screenshots ausstehend  

---

## W. Final Gate (Kurz)

| Bereich | Status |
|---------|--------|
| Desktop-Karte größer | PASS |
| Label-Lesbarkeit / keine Label-Overlap | PASS |
| Gebäude erkennbar (CSS) | PASS |
| Scenic AUS/AN Evidenz | PASS |
| Pan/Zoom/fitWorld Screenshots | PASS |
| Tests / Build | PASS |
| Asset-SHA | PASS (unverändert) |
| Kein Commit | PASS |

---

## X. Exact Next Step

Unabhängige Review der Slice-3-Evidenz; optional Feintuning Narrow-Web-Layout in späterem Slice falls gewünscht.

---

**Ergebnisoption:** **OPTION A — SLICE 3 READY FOR INDEPENDENT REVIEW**
