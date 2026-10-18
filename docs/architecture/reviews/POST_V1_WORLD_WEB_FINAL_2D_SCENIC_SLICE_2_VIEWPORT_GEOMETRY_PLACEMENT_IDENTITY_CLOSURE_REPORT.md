# POST-V1 — Slice 2 Viewport Geometry & Placement Identity Closure Report

**Datum:** 2026-10-10  
**Auftrag:** `docs/development/Prompts/POST_V1_WORLD_WEB_FINAL_2D_SCENIC_SLICE_2_VIEWPORT_GEOMETRY_PLACEMENT_IDENTITY_CLOSURE.md`  
**Committed HEAD (Referenz):** `4c41dea3eea657bf9a3e1588bebcd4ea22213171`  
**Modus:** Bounded correction ohne Commit / Push / Tag  

---

## A. Executive Summary

Unabhängige Prüfung von Placement Consistency & Viewport Fit (OPTION B — PARTIAL) adressiert:

1. **Zu kleine Scenic-Plate:** Ursache in `fitWorldCamera` — `Math.min(scaleX, scaleY, 1)` verhinderte Upscale, wenn Plate-Bounds kleiner als der Viewport sind. Scenic `fitWorld` nutzt jetzt `allowUpscale: true` bei Plate-Bounds.
2. **Placement-Identität:** Bestätigtes Gebäude wird per API-Response / Delta-Liste als **`placedBuildingId`** ermittelt; DOM-Selektor `[data-building-id="…"]` auf bestätigten Markern (nicht Preview).
3. **Messung:** Capture misst Abstände in **Viewport-lokalen** Pixeln, damit Layout-Shift (Schließen der Placement-Leiste) Screen-Koordinaten nicht verfälscht.

**Ergebnisoption:** **OPTION A — SLICE 2 CLOSURE READY FOR REVIEW**

---

## B. Ursache kleine Scenic-Plate

| Schicht | Befund |
|--------|--------|
| Bounds | `resolveScenicPlateWorldBounds(layout)` — korrekt letterboxed im Canvas |
| Kamera | `fitWorldCamera(..., { allowUpscale: true })` nur wenn `resolveFitWorldBounds` Scenic-Plate liefert |
| Legacy-Cap | Ohne Option: `Math.min(fittedScale, 1)` → Plate ~288×162 CSS bei ~540×354 Viewport (**widthRatio ≈ 0,53**) |

**Renderkette (Scenic AN):** Viewport-Größe → Plate-World-Bounds → `fitWorldCamera` (Upscale erlaubt) → `.pg-world-canvas-transform` → Scenic-Background-IMG + SVG-Marker in gemeinsamem Transform.

---

## C. Minimaler Viewport-Fix

- `apps/web/src/presentation/hooks/world-camera-math.ts` — optionales `allowUpscale` in `fitWorldCamera`.
- `apps/web/src/presentation/hooks/useWorldCamera.ts` — `allowUpscale: scenicBounds !== null`.

Keine Domain-, API- oder Asset-Änderung.

---

## D. Plate-Größe vorher / nachher (Desktop ~540×354)

| Phase | widthRatio (Plate / Viewport) | toolbarZoom | Quelle |
|-------|------------------------------|-------------|--------|
| **Vorher** (Placement-Fit-Evidenz) | **≈ 0,53** | ~100 % | `production-slice-2-placement-consistency-viewport-fit/tests/manifest--scenic-on.json` |
| **Nachher** Initial / fitWorld | **≈ 0,91** | **170 %** | `production-slice-2-viewport-geometry-placement-identity-closure/tests/manifest--scenic-on.json` |
| **Nachher** Narrow ~432×290 | **≈ 0,88** | 133 % | gleiches Manifest, `narrow-fitWorld` |

Keine willkürliche Bildverzerrung; einheitlicher Scale auf Transform (letterbox-Proportionen der Plate bleiben).

---

## E. Scenic Initial-Fit & fitWorld

Scenic AN: Initial und nach „Welt einpassen“ identische Kamera (`scale ≈ 1,701`, Plate zentriert im Karten-Viewport). `requestAnimationFrame`-Refit bei Scenic-Bounds unverändert aus vorheriger Slice-2-Arbeit.

Scenic AUS: `manifest--scenic-off.json` — kein Plate, Zoom **63 %** / Narrow **50 %** (unverändertes Legacy-Verhalten).

---

## F. fitRegion

Capture: `geometry/scenic-on/03-fitRegion-{central-basin,eastern-industrial,southern-coastal}--scenic-on.png` — weiterhin Scenic-Anker-Fokus (keine Änderung in diesem Auftrag).

---

## G. Pan / Zoom / Resize

Nicht neu instrumentiert; Schmaler Viewport: `responsive/scenic-on/08-narrow-fitWorld--scenic-on.png`.

---

## H. Placement Identity & Abstände (Scenic AN)

| Feld | Wert |
|------|------|
| **Autoritative ID** | `building_005` |
| **Domain (API)** | x=49, y=54 (`access_road`, `Zufahrtsstrasse`) |
| pointer → preview (viewport-lokal) | **≈ 2,9 px** (Toleranz 28) |
| preview → confirmed (viewport-lokal) | **≈ 0 px** |
| confirmed → reload (viewport-lokal) | **≈ 0 px** |

`data-building-id` nur auf bestätigten Markern (`PGWorldBuildingMarker.tsx`). Preview: `is-preview`, kein `data-building-id`.

**Hinweis:** Screen-space-Abstände (`distancesPxScreen`) zeigen weiterhin ~134 px preview→confirmed wegen Layout-Shift nach Confirm — für Gates nur **viewport-lokal** verwenden.

---

## I. Domain-Koordinaten & QA-Reset

- `tools/capture-world-scenic-slice-2-pdm-coordinate-verify.mjs` — **PASS** (nach Capture).
- Capture lädt am Ende `saves/scenic-slice-1-pdm-gate-baseline.json` nach erfolgreichem Place.

---

## J. Geänderte Dateien (dieser Closure-Auftrag)

| Datei | Änderung |
|-------|----------|
| `apps/web/src/presentation/hooks/world-camera-math.ts` | `allowUpscale` in `fitWorldCamera` |
| `apps/web/src/presentation/hooks/useWorldCamera.ts` | Scenic Plate-Fit mit Upscale |
| `apps/web/src/presentation/components/world/PGWorldBuildingMarker.tsx` | `data-building-id` (non-preview) |
| `apps/web/src/presentation/components/world/PGWorldBuildingMarker.test.tsx` | Assertion `data-building-id` |
| `apps/web/src/presentation/hooks/world-scenic-viewport-fit.test.ts` | Legacy scale 1 vs Scenic upscale |
| `tools/capture-world-scenic-slice-2-viewport-geometry-placement-identity-closure.mjs` | Evidenz + ID + viewport-lokal + Server-Mode-Guard |

*(Weitere Slice-2-Dateien aus früheren Teilaufträgen bleiben im Working Tree; HEAD uncommitted.)*

---

## K. Tests / Build

| Prüfung | Ergebnis |
|---------|----------|
| Vitest (camera-math, viewport-fit, scenic-projection, PGWorldBuildingMarker) | **14 tests, Exit 0** |
| `pnpm --filter @project-genesis/web typecheck` | **PASS** |
| `pnpm --filter @project-genesis/web build` | **PASS** (bestehende ESLint-Warnungen, keine neuen Fehler) |

---

## L. Evidenz

**Root:** `docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-2-viewport-geometry-placement-identity-closure/`

- Manifeste: `tests/manifest--scenic-on.json`, `tests/manifest--scenic-off.json`
- Review: `review-overview/index--scenic-on.html`, `review-overview/index--scenic-off.html`
- Screenshots: `scenic-on/`, `geometry/`, `placement/`, `responsive/` (Suffix `--scenic-on` / `--scenic-off`)

**Mode-Attribution:** Scenic-ON-Capture schlägt fehl, wenn Web ohne `NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND=1` läuft (Skript-Guard).

---

## M. Scenic Asset

SHA unverändert: `44a1291d7216cfbdaebdd2ccc109d2fd6f239f1e5abe465e1206cdc48d14776b` (`world-scenic-presentation-profile.ts`).

---

## N. Gate-Tabelle (Auszug)

| Kriterium | Status |
|-----------|--------|
| Plate-Ursache nachgewiesen | PASS |
| Scenic fitWorld/Initial Nutzung Viewport | PASS |
| Gebäude-ID autoritativ | PASS |
| Preview/Confirm/Reload (viewport-lokal) | PASS |
| Scenic AUS unverändert | PASS |
| Desktop + Narrow Evidenz | PASS |
| Typecheck / Build / Regression | PASS |
| Kein Commit/Push/Tag | PASS |
| Slice 3 nicht begonnen | PASS |

---

## O. Verbleibende Risiken

- Screen-space-Metriken bei PDM weiterhin irreführend, wenn Placement-UI den Seitenlayout verschiebt — Capture dokumentiert beide Felder.
- Visuelle Freigabe der Screenshots durch unabhängige Review ausstehend.
- Lokaler WIP außerhalb dieses Scopes unberührt.

---

**Ergebnisoption:** **OPTION A — SLICE 2 CLOSURE READY FOR REVIEW**
