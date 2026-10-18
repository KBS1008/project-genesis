# POST-V1 — Slice 3 Horizontal Overflow Root Cause & Evidence Closure Report

**Datum:** 2026-10-12  
**Auftrag:** `docs/development/Prompts/POST_V1_WORLD_WEB_FINAL_2D_SCENIC_SLICE_3_HORIZONTAL_OVERFLOW_ROOT_CAUSE_EVIDENCE_CLOSURE.md`  
**Committed HEAD (Referenz):** `4c41dea3eea657bf9a3e1588bebcd4ea22213171`  
**Modus:** Root-cause closure ohne Commit / Push / Tag  

---

## A. Executive Summary

Die bisherigen **~9–10 px** `documentElement.scrollWidth − clientWidth` entstanden durch **echten horizontalen Layout-Überstand**, nicht durch reine Scrollbar-Semantik.

**Hauptursache (Desktop):** `.pg-inspector-panel` mit fester `width: var(--inspector-width)` und **`content-box`** — Padding/Border addierten zur Grid-Spaltenbreite; `rect.right` ragte **9 px** über `window.innerWidth` (1440 → scrollWidth 1449). `scrollTo(1000)` erreichte **`scrollX = 9`**.

**Weitere Beiträge:** Skip-Link `left: -9999px` erweiterte die Scrollbreite; **Narrow Web:** Inspector unter der Karte mit gleichem Box-Modell (**~8 px**).

**Fix:** `box-sizing: border-box` + `width: 100%` / `max-width: 100%` am Inspector (global + World-Desktop); Statusleiste `box-sizing`; Skip-Link auf **clip**-Muster; Sidebar `max-width: 100%` unter 64rem.

**Nach Fix:** alle **6 Viewports** × Scenic ON — `scrollWidthMinusClient: 0`, `actuallyScrollable: false`.

Geschützte Slice-3-Ergebnisse (Narrow ~432 px, Labels, Desktop ~662 px) in Evidenz **ohne Regression**.

**Ergebnisoption:** **OPTION A — SLICE 3 CLOSURE READY FOR INDEPENDENT REVIEW**

---

## B. Messsemantik (Teil A §10–11)

| Messung | Vor Fix (1440) | Nach Fix |
|---------|----------------|----------|
| `scrollWidth − clientWidth` | 9 | **0** |
| `scrollTo(1000)` → `scrollX` | 9 | **0** |
| `maxScrollLeft` | 17 | **0** |
| Vertikale Scrollbar (`innerWidth − clientWidth`) | 0 (Playwright) | 0 |

Diagnose: **D — überstehende DOM-Geometrie** (nicht nur Subpixel/Scrollbar-Gutter).

---

## C. DOM-Überstand (Teil A §12)

Top-Offender vor Fix:

1. `aside.pg-inspector-panel` — `pastRight: 9` (Desktop)
2. `a.pg-skip-link` — `left: -9999` (Scrollbreite)

Nach Fix: keine relevanten Offender mit `pastRight > 0` bei `innerWidth` (Manifest `domOverflowOffenders` leer bzw. ohne Viewport-Überstand).

---

## D. Root Cause & Fix (Dateien)

| Regel | Datei |
|-------|--------|
| `.pg-inspector-panel { box-sizing: border-box; }` + narrow `width: 100%` | `layout-components.css` |
| World desktop: `.pg-inspector-panel { width: 100%; }` in Grid-Spalte | `world-components.css` |
| `.pg-status-bar { box-sizing; width/max-width: 100% }` | `layout-components.css` |
| `.pg-skip-link` clip statt `-9999px` | `navigation.css` |
| `.pg-sidebar { max-width: 100%; box-sizing }` @ ≤64rem | `shell-components.css` |

Kein `html/body { overflow-x: hidden }`.

---

## E. Regression geschützter Slice-3-Stand

Aus `diagnostics/overflow-root-cause.json` (Scenic ON, nach Fix):

- **1440:** viewport ~660 px, workspace ~844 px  
- **480:** workspace ~432 px, plate ~343 px  

Labels: `fullyInsideViewport` in vorherigem Label-Closure-Stand unverändert geprüft via Vitest + Scenic-Tests.

---

## F. PDM / QA

- `placement/pdm-placement-record.json`: **PASS**, `building_005`, `placeCallCount: 1`  
- Viewport-lokal (px): Pointer→Preview **2.98**, Preview→Confirmed **≈0**, Confirmed→Reload **0** (Toleranz 28)  
- `placement/qa-reset-record.json`: Load `saves/scenic-slice-1-pdm-gate-baseline.json` nach Confirm

---

## G. Tests / Lint / Build

| Prüfung | Ergebnis | Protokoll |
|---------|----------|-----------|
| Vitest (11 Dateien, World/Scenic/PDM) | **35 tests, exit 0** | `evidence/.../tests/vitest-protocol.txt` |
| ESLint (geänderte TS/JS) | exit 0 | `lint/eslint-protocol.txt` |
| typecheck | exit 0 | `typecheck/protocol.txt` |
| `next build` | exit 0 | `build/protocol.txt` |

---

## H. Evidence Inventory

`docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-horizontal-overflow-root-cause-evidence-closure/`

- `diagnostics/overflow-root-cause.json`, `overflow-before-after.json`
- `tests/manifest--scenic-on.json`, `manifest--scenic-off.json`
- `review-overview/index--*.html`
- Screenshots: scenic on/off, narrow, PDM, pan/zoom

---

## I. Final Gate (Auszug)

| Kriterium | Status |
|-----------|--------|
| Overflow-Ursache nachgewiesen | **PASS** |
| Minimaler Fix (kein body hidden) | **PASS** |
| 6 Viewports overflow 0 | **PASS** |
| Narrow/Label/Desktop Regression | **PASS** |
| Scenic AUS/AN Evidenz | **PASS** |
| Tests/Lint/Build | **PASS** |
| Kein Commit | **PASS** |

---

**Ergebnisoption:** **OPTION A — SLICE 3 CLOSURE READY FOR INDEPENDENT REVIEW**
