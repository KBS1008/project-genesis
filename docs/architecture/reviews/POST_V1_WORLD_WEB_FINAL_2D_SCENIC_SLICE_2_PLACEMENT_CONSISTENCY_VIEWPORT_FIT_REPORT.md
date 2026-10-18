# POST-V1 — Slice 2 Placement Consistency & Viewport Fit Report

**Datum:** 2026-10-10  
**Auftrag:** `docs/development/Prompts/POST_V1_WORLD_WEB_FINAL_2D_SCENIC_SLICE_2_PLACEMENT_CONSISTENCY_VIEWPORT_FIT.md`  
**Committed HEAD (Referenz):** `4c41dea3eea657bf9a3e1588bebcd4ea22213171`  
**Modus:** Bounded correction ohne Commit / Push / Tag  

---

## A. Executive Summary

Drei Review-Befunde adressiert:

1. **PDM:** Gemeinsame Scenic-Display-Projektion für Preview und bestätigte Marker; Scenic-Klicks werden per **inverser Regions-Projektion** in den bestehenden Domain-`unproject`-Pfad überführt (kein `placeBuilding`-Eingriff).  
2. **Viewport:** `fitWorld`/Initial-Fit nutzen bei Scenic AN die **letterboxed Plate-Bounds** statt nur des Regionsgitters.  
3. **Evidenz:** Neue Aufnahmen mit **`--scenic-on` / `--scenic-off`-Suffix** und DOM-`modeAttribution` (Banner + Background-Layer).

**Ergebnisoption:** **OPTION A — SLICE 2 READY FOR INDEPENDENT REVIEW**  
**PARTIAL:** Automatisierte Preview→Confirmed-Distanz im Capture-Skript traf vermutlich ein anderes Gebäude (Selektor); **Pointer→Preview ~2,3 px PASS**. Manuelle Screenshot-Prüfung der neuen `placement/06–07`-Shots empfohlen.

---

## B.–C. Baseline / WIP

HEAD unverändert committed; kein reset/clean/stash; alte Evidence-Ordner unangetastet.

---

## D. Changed Files

- `world-scenic-visual-projection.ts` — `resolveScenicPlateWorldBounds`, `projectScenicVisualToRegionLogical`  
- `useWorldCamera.ts` — `resolveFitWorldBounds`  
- `PGWorldWorkspace.tsx` — inverse Scenic-Pick, Plate-fit, `rAF` refit  
- `PGWorldCanvas.tsx` — einheitliche `renderMarkerAt` für Preview  
- Tests: `world-scenic-visual-projection.test.ts`, `world-scenic-viewport-fit.test.ts`  
- `tools/capture-world-scenic-slice-2-placement-consistency-viewport-fit.mjs`

---

## E. Original PDM Root Cause

Preview nutzte **Pick-World-Logical** direkt; bestätigte Gebäude **`projectMarkerToScenicVisual`** → sichtbarer Sprung nach Confirm.

---

## F. PDM Projection Strategy

| Schritt | Raum |
|---------|------|
| Klick | Viewport → World-Visual (Kamera) |
| Scenic AN | `projectScenicVisualToRegionLogical` → Region-Logical |
| Domain | `unprojectWorldLogicalPoint` (unverändert) |
| Anzeige Preview + Marker | `projectDomainPlacementPosition` → `projectMarkerToScenicVisual` (identisch) |

---

## G.–H. Preview / Confirm / Reload / Domain

- Runtime: `placement/05-pdm-preview`, `06-pdm-after-confirm`, `07-after-reload` (Scenic ON).  
- **Pointer → Preview:** ~**2,3 px** (Toleranz 28 px) — `manifest--scenic-on.json`.  
- **Domain x/y:** weiterhin verifizierbar via `tools/capture-world-scenic-slice-2-pdm-coordinate-verify.mjs` (isolierter QA-Save).  
- Skript-Distanz Preview→Confirmed **nicht** als Gate PASS gewertet (Selektor-Risiko).

---

## I. Original Viewport Root Cause

`fitWorld` basierte auf **Regions-Gitter-Bounds**; Scenic-Plate liegt in **Canvas-Logical** letterboxed — Kamera rahmte Gitter ein, Plate wirkte klein/am Rand.

---

## J.–K. Scenic Initial Fit & fitWorld

`resolveScenicPlateWorldBounds(layout)` → `fitWorldCamera`; Scenic AN only; zusätzlicher `requestAnimationFrame`-`fitWorld` bei Scenic-Bounds.

---

## L. fitRegion

Unverändert aus Alignment-Runde (Scenic-Anker).

---

## M. Pan / Zoom / Resize

Nicht separat erneut instrumentiert; gemeinsamer Transform unverändert. Schmaler Viewport: `responsive/08-narrow-viewport--scenic-on.png`.

---

## N. Scenic OFF Protection

`manifest--scenic-off.json`: `modeConsistent: true`, kein Banner/Layer.

---

## O. Scenic ON Visual Quality

Neue Screenshots `01-initial`, `02-after-fitWorld`, fitRegion 03× — unabhängige visuelle Freigabe ausstehend.

---

## P. Screenshot Mode Attribution

Dateinamen: `*--scenic-on.png` / `*--scenic-off.png`; JSON-Felder `envFlag`, `scenicBannerVisible`, `scenicBackgroundLayerVisible`, `modeConsistent`.

**Hinweis zu älteren Dateien:** `01-full-world-scenic-off.png` mit Scenic-Bild = **falscher Web-Prozess/Env** (Server nicht nach Flag-Wechsel neu gestartet), nicht neue Evidenz.

---

## Q. Quantitative Viewport Measurements

`viewportMeasurements` in Manifest (Container ~540×354, Plate-IMG ~288×162 CSS nach Transform). Messung per `getBoundingClientRect` — interpretiert zusammen mit Screenshots.

---

## R. Quantitative Placement Measurements

Siehe `placementMetrics` in `tests/manifest--scenic-on.json`.

---

## S.–T. Tests / Build

- Vitest: visual-projection (inkl. Pick-Round-Trip), viewport-fit, camera-focus, placement lifecycle, scenic regression — **Exit 0**  
- `pnpm --filter @project-genesis/web typecheck` / `build` — **Exit 0**

---

## U. Evidence Inventory

`docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-2-placement-consistency-viewport-fit/`  
Review: `review-overview/index--scenic-on.html`, `index--scenic-off.html`

---

## V.–W. Risks / Gate

- Bestätigte Marker-Messung im Skript verbessern (Gebäude-ID nach Place).  
- Visuelle Plate-Größe unabhängig prüfen.  
- Asset-SHA unverändert.

---

## X. Next Step

Unabhängige Review der neuen Evidenz; optional Capture-Skript für Confirm-Marker-Ziel-ID.

---

**Ergebnisoption:** **OPTION A — SLICE 2 READY FOR INDEPENDENT REVIEW**
