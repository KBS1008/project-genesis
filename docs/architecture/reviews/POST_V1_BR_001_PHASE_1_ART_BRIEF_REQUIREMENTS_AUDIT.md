# BR-001 Phase 1 — Logo / Brand Mark Art Brief & Requirements Audit

**Project:** Project Genesis  
**Date:** 2026-09-10  
**Mode:** Read-only art brief / requirements audit  
**HEAD:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`  
**Accepted prior decision:** `POST_V1_VISUAL_PRODUCTION_BR_001_VS_ICON_008_WINNER_DELTA.md` — BR-001 SELECTED  
**Commit policy:** DO NOT COMMIT (per prompt §43)

---

## A. Executive Summary

This audit defines the production-ready requirements contract for **BR-001 Phase 1** — a bounded **product/shell brand mark**, not gameplay iconography and not a splash background.

**Authoritative Phase-1 meaning:** one **text-free graphic symbol** representing Project Genesis product identity, displayed in the main menu brand block with the existing HTML `<h1>Project Genesis</h1>` preserved, plus **favicon PNG derivatives** of the same symbol.

**Identity model:** **MODEL A — SYMBOL-FIRST** (HTML text remains authoritative product name).

**Source strategy:** **HYBRID** — SVG vector master in design repo; certified **PNG + WebP** runtime for menu via `PGVisualAssetImage`; PNG favicon exports derived from the same master.

**Primary UI consumer:** `MainMenuHome` → `.pg-main-menu-brand` (exactly one UI integration target in Phase 1).

**Secondary derivative:** browser favicon via `layout.tsx` metadata (not a second UI consumer).

**Splash usage:** **DEFERRED** — MM-006 remains scenic background only; unused CSS hook `.pg-menu-splash-brand-mark` noted for future optional use.

**MM-006 separation:** confirmed — scenic splash background ≠ brand mark; current BR-001→MM-006 registry alias is a **TEMPORARY COMPATIBILITY PLACEHOLDER**.

**Final decision:** **OPTION B — BR-001 ART BRIEF TECHNICALLY READY / HUMAN ART-DIRECTION DECISION REQUIRED**

Technical, consumer, format, accessibility, and favicon contracts are sufficiently defined for production **after** one bounded human choice on symbol concept direction (§G, §Z). No art, code, assets, registry, or lifecycle docs were modified.

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `730ed190bb9c3b64c426b185a32fe36528c4bda7` |
| `origin/master` | `730ed190bb9c3b64c426b185a32fe36528c4bda7` (in sync) |
| Winner-delta report | Untracked locally (read-only; no commit) |
| Unrelated dirty work | Preserved (M11/M12 docs, design churn, prompts, temp saves) |

### Tag integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags moved: **NO**

### Sealed baseline (unchanged)

ICON-001 and ICON-002 Phase 1 remain **CLOSED / PASS, SEALED** — not reopened.

---

## C. BR-001 Existing State

### Registry entry (`visual-asset-registry.ts`)

| Field | Current value |
|-------|---------------|
| ID | `BR-001` |
| Label | Project Genesis Brand Mark |
| Type | `runtime` |
| Format | `png` |
| Path | `/assets/main-menu/MM-006.png` |
| WebP | `/assets/main-menu/MM-006.webp` |
| Component annotation | `SplashScreen` |
| Preload | `true` |
| Design source | `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png` |
| Notes | Brand mark sourced from splash art until dedicated logo asset exists. |

**Alias status:** **YES** — BR-001 still aliases MM-006 splash background bytes.

### Dedicated artwork

| Check | Result |
|-------|--------|
| `BR-001_Logo.png` on disk | **NO** — backlog row only (`VISUAL_PRODUCTION_BACKLOG.md`) |
| `docs/design/branding/` production file | **NO** committed certified logo |
| Runtime logo under `apps/web/public/` | **NO** — no `/assets/logos/` tree; no root favicon |
| Unused logo candidate in repo | **NO** — repository search found zero `*Logo*` production files |
| MM-006 intentional embedded logomark | **NO evidence** — MM-006 is full-bleed scenic splash photography |

### Runtime consumers

| Component | Renders BR-001? |
|-----------|-----------------|
| `PGVisualAssetImage` call sites | **ZERO** reference `BR-001` |
| `SplashScreen` | Uses `MM-006` background directly |
| `MainMenuHome` | Text-only brand block |
| Preload | Loads BR-001 paths (= MM-006 bytes) via `PRELOAD_VISUAL_ASSET_IDS` |

**Conclusion:** BR-001 is a **registry placeholder + preload alias**, not a functioning brand mark.

---

## D. Existing Brand Presentation

| Surface | How "Project Genesis" appears | Image slot? |
|---------|------------------------------|-------------|
| `SplashScreen` | Text eyebrow + `<h1>Wirtschaftssimulation</h1>` + tagline over MM-006 photo | No logo image |
| `MainMenuHome` | `<h1>Project Genesis</h1>` + subtitle in `.pg-main-menu-brand` | **No image slot today** |
| `MenuLoadingScreen` | Loading copy over MM-007 background | None |
| `GameWorkspaceShell` | Text eyebrow `Project Genesis · {screenLabel}` | None |
| `ApplicationShell` | No brand chrome | None |
| `layout.tsx` | `metadata.title = 'Project Genesis'` | **No favicon/icons metadata** |
| Browser tab | Default document title only | **No favicon** |

**Text authority:** Product name is consistently carried by **HTML text** or metadata title — never by a dedicated mark image.

**Splash Phase 1:** **DEFERRED** — splash already communicates product via text overlay; integrating BR-001 on splash would be a second UI target and risks conflating mark with MM-006 photography.

---

## E. Consumer Geometry / Responsive Audit

Measurements from `menu.css` and `design-tokens.css` (no invented dimensions).

### Main menu card / brand block

| Property | Source | Value |
|----------|--------|-------|
| Outer menu padding | `.pg-main-menu` | `var(--space-xl)` = **2rem** |
| Card max width | `.pg-main-menu-card` | **`min(32rem, 100%)`** → 512px at 16px root |
| Card inner padding | `.pg-main-menu-card` | **`var(--space-xl)`** = 2rem per side |
| Usable content width (desktop max) | derived | **~448px** (512 − 64px padding) |
| Brand heading size | `.pg-main-menu-brand h1` | **`var(--text-h1)` = 1.5rem** (24px) |
| Brand subtitle | `.pg-main-menu-brand p` | body secondary, `--muted` |
| Home column gap | `.pg-main-menu-home` | **`var(--space-lg)` = 1.5rem** |

### Narrow viewport

Card becomes **`100%`** of viewport minus outer `2rem` padding on each side. Brand block remains single column; full-width buttons below. No dedicated narrow override for `.pg-main-menu-brand`.

### Planned mark geometry (Phase 1D integration contract)

| Parameter | Recommendation | Basis |
|-----------|----------------|-------|
| Placement | **Above** existing `<h1>` inside `.pg-main-menu-brand` | Clear hierarchy; h1 remains semantic title |
| Display height | **2rem–3rem** (32–48px) | Between `--icon-xl` (2rem) and `--text-h1` (1.5rem) heading; readable without dominating card |
| Max width | **`min(12rem, 100%)`** (192px max) | Matches existing unused `.pg-menu-splash-brand-mark` hook in `visual-asset-components.css` — evidence of prior intended mark scale |
| Aspect ratio | **Square preferred; horizontal compact mark acceptable** | Favicon derivation favors square; menu slot is width-flexible |
| Minimum certified visual size | **16×16px** (favicon floor) | Browser favicon minimum |
| CSS display range | **height: 2rem–3rem; width: auto; max-width: min(12rem, 100%)** | Derived from card geometry |

### Favicon geometry

| Size | Phase 1 status |
|------|----------------|
| 32×32 PNG | **REQUIRED** |
| 16×16 PNG | **REQUIRED** (or embedded in `.ico`) |
| SVG favicon | **OPTIONAL / DEFERRED** |
| Apple touch / PWA manifest icons | **OUT OF SCOPE** |

---

## F. Phase-1 Identity Model

### Models evaluated

| Model | Phase 1 fit | Decision |
|-------|-------------|----------|
| **A — Symbol-first** | Text-free mark + HTML `<h1>`; favicon from symbol | **SELECTED** |
| B — Wordmark-first | Duplicates HTML title; poor favicon legibility | Rejected |
| C — Combined lockup | Duplicates accessible product name | Rejected |
| D — Responsive identity system | Multiple authoritative artworks | Beyond Phase 1 scope |

### Selected: **MODEL A — SYMBOL-FIRST**

**Rationale:**

1. Winner delta and accessibility policy require preserving HTML `"Project Genesis"`.
2. `UI_TEXT_GUIDELINES.md` treats official logos as exceptions to ALL CAPS rules — a combined wordmark image would fight HTML title semantics.
3. Favicon requires a compact symbol; wordmark text fails at 16px (§20).
4. `ART_DIRECTION.md` emphasizes identity through clarity and professional dashboards, not decorative wordmarks.
5. Lowest localization and assistive-technology coupling.

**Phase-1 primary mark:** standalone **graphic symbol** (no embedded product name text).

---

## G. Brand Concept Requirements

Extracted from `ART_DIRECTION.md`, product description strings, and menu copy — **not invented lore**.

### REQUIRED ASSOCIATIONS

| Theme | Repository basis |
|-------|------------------|
| Industrial / engineered | ART_DIRECTION — factories functional, steel/glass/concrete, automation |
| Economic / strategic management | Vision — CEO of industrial corporation; professional management software |
| Precision / clarity | Emotional goals — confidence, clarity, control; avoid visual clutter |
| Modern professional UI | Corporate identity section — executive dashboards, KPIs |
| Purposeful, non-decorative | Constraints — avoid fantasy ornamentation, neon, glassmorphism |

### OPTIONAL ASSOCIATIONS (pick at most one direction in human decision)

| Theme | Basis |
|-------|-------|
| Modular network / connected systems | World — economically connected, industrialized, regional |
| Growth / evolution | Vision — technological evolution, corporate growth |
| Genesis / origin (abstract) | Product name only — **abstract geometric**, not literal biological or religious imagery |

### ASSOCIATIONS TO AVOID

| Avoid | Basis |
|-------|-------|
| Fantasy, steampunk, sci-fi space opera, cyberpunk, neon | ART_DIRECTION — explicit NOT list |
| Cartoon, comic, mobile-game casual | ART_DIRECTION |
| Military / shooter / city-builder mayor fantasy | ART_DIRECTION player role |
| Specific resource, building, transport, or map geography icons | No gameplay semantics in brand mark (prompt §36) |
| Photographic textures, scenic backgrounds | MM-006 role separation |
| Gratuitous glow, glassmorphism, oversized shadows | ART_DIRECTION constraints |

### BLOCKING human art-direction decision (before Phase 1B)

Select **exactly one** symbol concept direction from:

| Option | Description |
|--------|-------------|
| **CONCEPT 1 — Modular industrial mark** | Simple geometric forms suggesting engineered modules / connection (network node, linked blocks) |
| **CONCEPT 2 — Strategic precision mark** | Minimal mark suggesting precision, control, analytical focus (compass/grid/crosshair abstraction — not a literal UI icon) |
| **CONCEPT 3 — Abstract genesis mark** | Compact abstract form suggesting origin/growth (seed, ascending structure) without literal biology |

All three must obey REQUIRED/AVOID lists. **No further symbol specification** in this audit.

---

## H. Style Contract

BR-001 requires its **own** contract — not ICON-002 24×24 outline rules, not ICON-001 raster illustration rules.

| Dimension | Phase-1 contract |
|-----------|------------------|
| Form | **Flat geometric symbol** — not illustration |
| Detail level | **Simple** — readable at 16px favicon |
| Line vs solid | **Solid silhouette preferred** for favicon; outline acceptable if silhouette survives 16px gate |
| Industrial vs decorative | **Industrial / professional** — functional, not ornamental |
| Photographic elements | **Prohibited** |
| Text inside artwork | **Prohibited** (symbol-first model) |
| Gradients in source master | **Discouraged** — if used, must survive monochrome flatten |
| Shadows/glow in source | **Prohibited in master** — placement effects belong in consumer CSS if ever needed |
| Monochrome compatibility | **Required** — mark must read in single-color treatment |
| ICON-002 inheritance | **None automatic** — may share "professional flat" family resemblance only |

---

## I. Color / Background Contract

### Existing palette (from `design-tokens.css`)

| Token | Light | Dark |
|-------|-------|------|
| `--color-primary` / `--accent` | `#2563eb` | `#3b82f6` |
| `--color-text` | `#111827` | `#f8fafc` |
| Menu card surface | `--bg-elevated` / `--color-surface` | dark surface tokens |

### Color strategy: **B — SINGLE BRAND COLOR + MONO FALLBACK**

| Requirement | Contract |
|-------------|----------|
| Primary color treatment | Symbol **may** use `--color-primary` (#2563eb) as fill/accent in color runtime PNG |
| Monochrome treatment | **Required** — single-color mark using `currentColor` equivalent or `#111827` / `#f8fafc` for exports |
| `currentColor` relevance | **Yes for SVG master** — enables theme-aware recolor if ever inlined; menu runtime PNG may bake color |
| Transparent background | **Mandatory** — no scenic or panel fill in source art |
| Badge/contained shape | **Permitted only if transparent outside** — no faux card background mimicking MM-001 |
| Work over MM-001 | Mark displays on **`--bg-elevated` card**, not directly on MM-001 photography in Phase 1 |
| Baked raster color | **Permitted** in certified PNG/WebP exports |
| Contrast | Mark must meet **≥ 3:1** against `--bg-elevated` in both light and dark themes for menu placement |

### BLOCKING human choice

Confirm Phase-1 color treatment:

- **COLOR-A:** Neutral mono mark only (black/white/currentColor) — lowest risk  
- **COLOR-B:** Primary-blue accent mark + mono favicon export — aligns with design tokens

Either satisfies contract once chosen.

---

## J. Source Format Contract

### Decision: **HYBRID SOURCE**

| Layer | Format | Location (conceptual) |
|-------|--------|------------------------|
| **Authoritative design master** | **SVG** | `docs/design/branding/BR-001_Logo.svg` (per BR prefix → `branding/` in VAM constants) |
| Certified runtime (menu) | **PNG + WebP** | `apps/web/public/assets/logos/BR-001.png` (+ `.webp`) per DD-040 `logos/` convention |
| Favicon derivatives | **PNG** (16, 32) | `apps/web/public/favicon-32x32.png`, `favicon-16x16.png` (exact filenames set in Phase 1C) |

**Why not PNG-only master:** vector editability, deterministic favicon export, reproducible derivatives.

**Why not SVG-only runtime:** `PGVisualAssetImage` + preload pipeline is PNG/WebP-native today; WebP optimization path expects `format: 'png'`. Favicon requires raster regardless.

**Why not MM-006 extraction:** separate asset roles (§Y).

**SVG master rules:**

- Valid SVG root, explicit `viewBox`
- No embedded raster `<image>`
- No external font references
- No external linked assets
- Transparent background
- Paths/shapes only (no text elements)

---

## K. Runtime / Derivative Contract

| Output | Consumer | Required? | Reason |
|--------|----------|-----------|--------|
| SVG master | Design repo / certification | **YES** | Authoritative editable source |
| PNG runtime | `PGVisualAssetImage` in MainMenuHome | **YES** | Existing registry loader path |
| WebP runtime | Same (via `<picture>`) | **YES** | Matches MM/menu asset pattern |
| PNG 32×32 | `layout.tsx` favicon | **YES** | Browser tab identity |
| PNG 16×16 | favicon fallback | **YES** | Legacy/small tab support |
| `favicon.ico` multi-size | Browser default | **OPTIONAL** — generate from PNGs if desired; not blocking |
| SVG favicon | Browser | **DEFERRED** |
| Apple touch icon | iOS | **OUT OF SCOPE** |
| PWA manifest icons | PWA | **OUT OF SCOPE** |
| Splash brand render | SplashScreen | **DEFERRED** |

**Source artworks:** **1** (symbol SVG master)  
**Derivatives:** **4** (PNG menu, WebP menu, favicon 32, favicon 16) — exported from master, not independently composed.

---

## L. Favicon Contract

### Current state

- **No** `favicon.ico`, `icon.png`, or `icons` metadata in `layout.tsx`
- **No** root favicon files in `apps/web/public/`

### Phase-1 minimum

| Item | Status |
|------|--------|
| PNG 32×32 derived from BR-001 symbol | **REQUIRED PHASE 1** |
| PNG 16×16 derived from same symbol | **REQUIRED PHASE 1** |
| `layout.tsx` `metadata.icons` wiring | **REQUIRED PHASE 1** (Phase 1D) |
| Wordmark in favicon | **PROHIBITED** |
| Dependency on MM-006 | **PROHIBITED** |
| Missing favicon breaks runtime | **NO** — app functions without; favicon is polish |

---

## M. Typography / Wordmark Relationship

| Question | Decision |
|----------|----------|
| Text inside BR-001 artwork | **NO** — symbol-first |
| Dedicated wordmark artwork in Phase 1 | **NO — DEFERRED** |
| Existing `<h1>Project Genesis</h1>` | **REMAINS** — authoritative visible + semantic product name |
| Mark vs title layout | Mark **above** title; title unchanged |
| Custom wordmark font | **Not in scope** — continue `--font-ui` (Inter) for HTML title |
| Combined lockup | **Excluded** |

**Wordmark as separate BR asset:** defer to future BR sprint rows (BR-002…010 out of scope).

---

## N. Accessibility / Fallback Contract

### Phase-1 semantics (symbol above `<h1>`)

| Element | Expected future behavior |
|---------|-------------------------|
| Graphic mark | **Decorative** — `alt=""` via `PGVisualAssetImage`; optionally wrapped with `aria-hidden="true"` on container |
| `<h1>Project Genesis</h1>` | **Remains sole accessible product name** |
| Subtitle paragraph | Unchanged |

**No duplicate product-name announcement** for assistive technology.

### Failure behavior

| Failure | Expected degradation |
|---------|------------------------|
| Registry missing / image 404 | Mark omitted; **text brand block unchanged** |
| WebP missing | PNG fallback via `<picture>` |
| Favicon missing | Browser default; **no UI impact** |
| SVG master missing (production) | **Certification failure** — do not ship runtime |

Logo failure → **text-only branding** — menu remains fully usable.

---

## O. Registry Contract

### Current (placeholder)

- ID `BR-001` → MM-006 paths, `component: 'SplashScreen'`, `preload: true`

### Future desired state (Phase 1C — no schema change)

| Field | Target |
|-------|--------|
| ID | `BR-001` (unchanged) |
| Format | `png` |
| Path | `/assets/logos/BR-001.png` (or equivalent under `logos/` per DD-040) |
| WebP | `/assets/logos/BR-001.webp` |
| Design source | `docs/design/branding/BR-001_Logo.svg` |
| Component | `MainMenuHome` (correct ownership) |
| Preload | **`true`** — menu boot critical path |
| Notes | Certified Phase-1 brand symbol; not splash background |
| MM-006 alias | **REMOVED** |

**Registry schema change:** **NO** — field value updates only.

**Placeholder term:** **TEMPORARY COMPATIBILITY PLACEHOLDER** (accurate).

---

## P. Sync / Tooling Assessment

| Asset | Tooling |
|-------|---------|
| SVG master ingestion | **VAM** (`resolveAssetKind('BR-001')` → `branding`, destination `docs/design/branding/`) — **existing, unchanged** |
| Runtime PNG/WebP sync | **Existing visual-asset sync path** for raster runtime assets — **small path/config extension** to `logos/` directory (not a schema change) |
| Favicon PNG exports | **Manual derivative handling** in Phase 1B/1C — export from SVG master at 16/32px; no new automated pipeline required in Phase 1 |
| SVG generator `brand-lockup` template | **NOT authoritative** — dev snapshot template only; do not use as production master |
| ICON-002 inline certification | **Not applicable** — BR-001 uses raster runtime + SVG master, not inline TS SVG |

**Sync tooling change:** **Small extension** (logos destination + BR-001 sync targets) — defer implementation to Phase 1C.

---

## Q. Production Method

**MANUAL / VECTOR** — human design-tool vector work (Figma/Inkscape/Illustrator or equivalent).

**Re-evaluation vs winner delta:** unchanged. Brand marks require deliberate geometric precision and editability unsuitable for batch icon pipelines.

---

## R. AI Generation Policy

| Use | Policy |
|-----|--------|
| **A. Authoritative final logo production** | **NOT PERMITTED** without explicit future audit revision |
| **B. Concept exploration only** | **PERMITTED** — sketches/mood concepts are **NON-AUTHORITATIVE** |
| **C. Not at all** | — |

Generated concepts must be **manually reconstructed** as clean SVG meeting §J–§V before certification.

**Rationale:** geometric consistency, small-size precision, reproducibility, and vector cleanliness (prompt §26–§27; graphics readiness audit).

---

## S. Asset Count

| Category | Count |
|----------|------:|
| Independent source artworks | **1** (symbol SVG master) |
| Runtime derivatives (not independent art) | **4** (menu PNG, menu WebP, favicon 32, favicon 16) |

**Not counted as separate art:** WebP (transcode), favicon sizes (export of same symbol).

---

## T. Phase-1 Boundary

### INCLUDED

- One text-free brand **symbol** SVG master
- Certified menu runtime PNG + WebP
- Favicon PNG derivatives (16, 32)
- Registry replacement of MM-006 alias (Phase 1C)
- MainMenuHome brand block integration contract (Phase 1D)
- `layout.tsx` favicon metadata (Phase 1D)
- Small-size and monochrome certification gates
- Accessibility/fallback contract (decorative mark + preserved `<h1>`)

### EXCLUDED

- Full BR-002…010 branding sprint
- Wordmark / combined lockup artwork
- SplashScreen BR-001 integration (Phase 1)
- MM-001 / MM-006 / MM-007 redesign or replacement
- Game workspace header logo
- Steam capsule, marketing, press kit, website branding
- Apple touch / PWA manifest icon package
- Animation, audio sting, merchandise
- ICON-003…010, world map, per-building-type art
- Gameplay / domain / API changes
- Navigation icon replacement (ICON-006)

---

## U. Lifecycle Proposal

Follow ICON family precedent (adjusted labels):

| Phase | Name | Deliverable |
|-------|------|-------------|
| **1A** | Art Brief / Requirements | **This audit** |
| **1B** | Art Production | Human-directed SVG master + manual PNG exports |
| **1C** | Certification / Runtime Readiness | Hash certification, sync to `public/`, registry path update off MM-006 alias |
| **1D** | First Consumer Integration | `MainMenuHome` mark + `layout.tsx` favicon |
| **1E** | Coverage / Lifecycle Closeout | Backlog, catalog, changelog |

Simpler combined 1C+1D is **not recommended** — registry must point to certified files before consumer wires `PGVisualAssetImage`.

---

## V. Production Acceptance Criteria (Future Gate)

Artwork **must not be certified** unless all pass:

| Criterion | Requirement |
|-----------|-------------|
| Transparent background | No opaque bounding box |
| Silhouette | Recognizable at 16×16 when exported |
| Aspect | Square or compact; no extreme horizontal wordmark |
| Clipping | No unintended viewBox clip |
| SVG master | No embedded raster; no `<text>`; no external refs |
| Text in art | **None** |
| Fonts | **None embedded** |
| Small-size gate | Internal negative spaces survive 16px (§20) |
| Monochrome | Readable as single-color on light and dark `--bg-elevated` |
| Color | If color PNG used, matches chosen COLOR-A or COLOR-B policy |
| Deterministic source | Stable SHA-256 recorded at certification |
| Derivative parity | Favicon PNGs traceable to same master export |
| MM-006 | **Zero pixel reuse** from splash photography |

---

## W. Consumer Acceptance Criteria (Future Phase 1D)

| Criterion | Requirement |
|-----------|-------------|
| `<h1>Project Genesis</h1>` | Still present and readable |
| Navigation | Menu buttons unaffected |
| Layout | No broken card geometry; no overlap with actions |
| Narrow viewport | Mark scales within `min(12rem, 100%)`; card scroll not required |
| CLS | No significant layout shift on mark load |
| Accessibility | Decorative mark; no duplicate name in AT |
| Fallback | Missing image → text-only brand |
| Scope | No gameplay/domain/API changes |

---

## X. Favicon Acceptance Criteria (Future Phase 1D)

| Criterion | Requirement |
|-----------|-------------|
| Derivation | From certified BR-001 symbol only |
| Legibility | Recognizable at 16×16 — **no text** |
| Background | Transparent or solid minimal |
| Metadata | Correct Next.js `metadata.icons` |
| MM-006 | **No dependency** |
| Runtime | Missing favicon does not affect app function |

---

## Y. MM-006 Separation / Placeholder Migration

| Asset | Role |
|-------|------|
| **MM-006** | Scenic splash **background photograph** — full-bleed via `PGVisualAssetBackground` |
| **BR-001** | Product **brand symbol** — discrete mark on menu card |

**Prohibited:** overwriting MM-006, renaming MM-006 to BR-001, treating splash photo as logo, removing MM-006 because BR-001 exists.

**Current alias classification:** **TEMPORARY COMPATIBILITY PLACEHOLDER**

**Migration timing:** **Phase 1C** — registry paths update to certified logo files **before** Phase 1D consumer integration. Preload then loads real mark bytes instead of splash photo.

**Note:** `.pg-menu-splash-brand-mark` CSS exists but is **unused** — future optional splash mark integration is **out of Phase 1**.

---

## Z. Open Questions / Blockers

### BLOCKING BEFORE ART PRODUCTION

| # | Question | Action |
|---|----------|--------|
| B1 | **Symbol concept direction** — choose CONCEPT 1, 2, or 3 (§G) | Human art director / product owner sign-off |
| B2 | **Color treatment** — COLOR-A (neutral mono) vs COLOR-B (primary accent) | Human sign-off |

### NONBLOCKING ART-DIRECTION CHOICES (production team)

| # | Question |
|---|----------|
| N1 | Exact SVG viewBox dimensions (recommend square ≥ 64×64 artboard) |
| N2 | Solid vs outline silhouette style within §H |
| N3 | Optional `favicon.ico` bundling vs PNG-only metadata |

### DEFERRED OUT OF PHASE 1

| # | Item |
|---|------|
| D1 | SplashScreen brand mark (`.pg-menu-splash-brand-mark`) |
| D2 | Game workspace header mark |
| D3 | Wordmark / lockup artwork |
| D4 | Apple touch / PWA icons |
| D5 | Dark/light separate color PNG variants (mono + CSS suffices for Phase 1) |

### Hard blocker test

**Is there enough authoritative art direction to create a logo without inventing brand identity?**

**NO** — not until **B1** (and preferably **B2**) are resolved. Technical contract is complete; **symbol metaphor remains a bounded human choice**.

---

## AA. Repository Integrity

Post-audit verification:

| Check | Result |
|-------|--------|
| Task-owned change | `POST_V1_BR_001_PHASE_1_ART_BRIEF_REQUIREMENTS_AUDIT.md` only |
| Code changed | **NO** |
| Assets changed | **NO** |
| Tests changed | **NO** |
| Registry changed | **NO** |
| Sync tooling changed | **NO** |
| UI changed | **NO** |
| Lifecycle docs changed | **NO** |
| Commit | **NO** |
| Push | **NO** |
| Tags moved | **NO** |

---

## AB. Final Decision

# **OPTION B — BR-001 ART BRIEF TECHNICALLY READY / HUMAN ART-DIRECTION DECISION REQUIRED**

**Human selections required before Phase 1B Art Production:**

1. **Symbol concept direction:** CONCEPT 1, 2, or 3 (§G)  
2. **Color treatment:** COLOR-A (neutral mono) or COLOR-B (primary accent + mono favicon)

**After B1 (+ B2):** proceed to **Phase 1B — Art Production** under contracts §F–§X.

**Do not reopen** BR-001 vs ICON-008. No reprioritization.

---

# Decision Matrix

| Question | Decision | Confidence | Blocking? |
|----------|----------|------------|-----------|
| Primary identity model | **MODEL A — Symbol-first** | High | No |
| Primary UI consumer | **MainMenuHome `.pg-main-menu-brand`** | High | No |
| HTML title remains | **YES** | High | No |
| Dedicated wordmark required | **NO — deferred** | High | No |
| Favicon Phase 1 | **YES — PNG 16 + 32** | High | No |
| Source format | **HYBRID — SVG master** | High | No |
| Runtime format | **PNG + WebP menu; PNG favicon** | High | No |
| Transparent background | **YES — mandatory** | High | No |
| Mono variant | **YES — required** | High | No |
| Color strategy | **B — single brand color + mono fallback** (pending COLOR-A/B choice) | Medium | **Yes (B2)** |
| Preload | **YES** | High | No |
| Registry schema change | **NO** | High | No |
| Sync tooling change | **Small extension only (Phase 1C)** | Medium | No |
| Production method | **MANUAL / VECTOR** | High | No |
| AI final-art use | **NOT PERMITTED** | High | No |
| Asset count | **1 source + 4 derivatives** | High | No |
| MM-006 separation | **YES — separate roles; alias is TEMPORARY PLACEHOLDER** | High | No |
| Ready for art production | **NO — pending B1 (+ B2)** | High | **Yes** |

---

# BR-001 Phase 1 — Art Brief / Requirements Audit
## Execution Summary

### Baseline

- **Branch:** `master`
- **HEAD:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- **origin/master:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- **unrelated dirty work:** YES (preserved)
- **v1.0.0:** `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- **v1.0.0-rc.1:** `442665cd6437bdebff88fd1540cedc689238c240`
- **tags moved:** NO

### Existing BR-001

- **dedicated artwork exists:** NO
- **registry state:** runtime entry; format png; preload true
- **current alias:** MM-006 splash paths (`/assets/main-menu/MM-006.{png,webp}`)
- **runtime consumers:** ZERO `PGVisualAssetImage` call sites
- **favicon currently exists:** NO
- **MM-006 role:** scenic splash background only

### Phase-1 Identity

- **selected model:** MODEL A — Symbol-first
- **primary mark:** text-free graphic symbol
- **wordmark:** deferred
- **HTML "Project Genesis" title:** remains authoritative
- **primary consumer:** MainMenuHome → `.pg-main-menu-brand`
- **favicon:** PNG 16 + 32 derived from symbol
- **asset role:** product/shell brand identity — not background, not gameplay icon

### Art Contract

- **source format:** HYBRID — SVG master (`docs/design/branding/`)
- **runtime format:** PNG + WebP (menu); PNG (favicon)
- **source artwork count:** 1
- **derivative count:** 4
- **aspect behavior:** square preferred; max display `min(12rem, 100%)`, height 2–3rem
- **transparent background:** mandatory
- **color strategy:** single brand color + mono fallback (COLOR-A/B choice pending)
- **monochrome requirement:** yes
- **minimum-size requirement:** 16×16 favicon certification gate
- **external fonts:** prohibited in artwork
- **external linked assets:** prohibited

### Production

- **production method:** MANUAL / VECTOR
- **AI final-art use:** NOT PERMITTED
- **AI concept use:** permitted — non-authoritative exploration only
- **human art-direction decision required:** YES — symbol concept (B1); color treatment (B2)

### Runtime

- **registry schema change:** NO
- **BR-001 alias replacement:** Phase 1C — point to `/assets/logos/BR-001.*`; remove MM-006 alias
- **preload:** YES
- **sync tooling:** existing VAM + small logos-path extension
- **first consumer integration phase:** 1D (MainMenuHome + layout favicon)
- **fallback:** text-only brand; menu fully usable without mark

### Phase-1 Boundary

**Included:** symbol SVG master, menu PNG/WebP, favicon PNGs, registry migration, MainMenuHome + favicon integration contracts, certification gates.

**Excluded:** wordmark, splash mark, workspace header, full branding sprint, PWA icons, MM-* redesign, gameplay changes.

### Acceptance Gates

- **source-art gate:** §V (SVG rules, no text/raster/external refs)
- **small-size gate:** §20 — silhouette survives 16px; no collapsed negative space
- **monochrome gate:** readable single-color on light/dark elevated surfaces
- **accessibility gate:** decorative mark; `<h1>` remains AT product name
- **responsive consumer gate:** §E geometry; narrow card width safe
- **favicon gate:** §X — symbol-only; no wordmark text
- **runtime/hash gate:** stable SHA-256 at certification; derivative parity

### Open Questions

**Blocking before art production:**

- B1 — symbol concept direction (CONCEPT 1 / 2 / 3)
- B2 — COLOR-A vs COLOR-B

**Nonblocking art-direction choices:**

- viewBox size, solid vs outline, optional favicon.ico

**Deferred:**

- splash mark, workspace header, wordmark, Apple/PWA icons

### Repository Integrity

- **report created:** YES
- **code changed:** NO
- **assets changed:** NO
- **tests changed:** NO
- **registry changed:** NO
- **sync tooling changed:** NO
- **UI changed:** NO
- **lifecycle docs changed:** NO
- **commit:** NO
- **push:** NO
- **tags moved:** NO

### Final Decision

**OPTION B**
