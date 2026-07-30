# SVG Generator Guide

**Project:** Project Genesis  
**Route:** `/dev/svg-generator`  
**Audience:** Developers generating production SVG reference assets locally

---

## What it does

The SVG Generator is the standard SVG production pipeline for Project Genesis. It:

1. Selects an SVG item from `VISUAL_PRODUCTION_BACKLOG.md`
2. Chooses a typed template (charts, icons, maps, dashboards, branding, diagrams)
3. Accepts structured content and dimensions
4. Generates deterministic, validated SVG on the server
5. Previews output in the browser
6. Exports or saves through the shared Visual Asset Manager import path

Routine SVG work should **not** bypass this tool. Do not hand-edit repository paths, backlog lines, or catalog entries for generated assets.

---

## Opening the tool

1. Start the API and web app:

```bash
pnpm dev
```

2. Open:

```text
http://127.0.0.1:3000/dev/svg-generator
```

The route is developer-only. It is not linked from player navigation and write operations are blocked in production.

---

## Workflow

1. **Select backlog asset** — filter the SVG backlog table and click a row (for example `CH-010_Charts.svg`).
2. **Choose template** — the tool suggests a template from the asset ID prefix; override when needed.
3. **Set title and dimensions** — defaults come from the selected template.
4. **Configure content** — use the structured editor fields (placeholders, labels, chart types, and so on).
5. **Preview** — live preview is debounced (400 ms) and rendered server-side.
6. **Review validation** — errors block save; warnings can be accepted explicitly.
7. **Export or save**
   - **Export SVG** downloads the current preview without writing to the repository.
   - **Save to repository** writes the file and updates backlog, catalog, and changelog via Visual Asset Manager.

---

## Templates

| Template ID | Purpose | Typical asset prefixes |
|-------------|---------|------------------------|
| `chart-library` | Chart reference sheet (line, area, bar, stacked, pie, donut, scatter, gauge, sparkline) | `CH-*` |
| `icon-sheet` | Icon grid with labels and size variants | `ICON-*` |
| `map-overlay` | Map overlays, legends, markers, routes | `MAP-*` |
| `kpi-card-library` | Dashboard KPI cards | `DB-*` |
| `status-panel-library` | Status and state panels | dashboard mockups |
| `notifications-library` | Notification patterns | dashboard mockups |
| `finance-widget-library` | Finance widgets | `EC-*` |
| `brand-lockup` | Branding lockups | `BR-*` |
| `technical-diagram` | Technical diagrams | diagrams |
| `component-library` | UI component reference sheets | general UI assets |

The first shipped reference template is **`chart-library`**, which generates `CH-010_Charts.svg`.

---

## Destination mapping

Path resolution is shared with the Visual Asset Manager. The server resolves folders from the asset ID prefix; the browser never supplies paths.

| Prefix | Destination |
|--------|-------------|
| CH-* | `docs/design/charts/` |
| ICON-* | `docs/design/icons/` |
| MAP-* | `docs/design/maps/` |
| BR-* | `docs/design/branding/` |
| DB-* | `docs/design/mockups/dashboard/` |
| MM-* | `docs/design/mockups/main-menu/` |
| PR-* | `docs/design/mockups/production/` |
| RS-* | `docs/design/mockups/research/` |
| EC-* | `docs/design/mockups/economy/` |
| TR-* | `docs/design/mockups/logistics/` |
| CP-* | `docs/design/mockups/company/` |
| RP-* | `docs/design/mockups/reports/` |

The backlog filename is authoritative (for example `CH-010_Charts.svg`).

---

## Revisions

First save:

```text
CH-010_Charts.svg
```

If that file already exists, the next save becomes:

```text
CH-010_Charts_Rev1.svg
CH-010_Charts_Rev2.svg
```

Revision numbering is handled by the shared filename resolver in Visual Asset Manager.

---

## Validation

Validation runs on preview (non-blocking warnings) and before save (errors always block; warnings require `acceptWarnings`).

**Errors include:**

- invalid XML or SVG namespace
- disallowed elements (`script`, `foreignObject`, and similar)
- event handler attributes (`on*`)
- external resource references
- duplicate element IDs
- missing accessibility metadata

**Warnings include:**

- excessive element count
- low contrast combinations
- unusually large dimensions
- missing placeholder documentation hints

---

## Accessibility

Every generated SVG includes:

- `<title>` and `<desc>`
- `role="img"` on the root SVG where appropriate
- `aria-labelledby` linking title and description IDs

Templates follow `CHART_GUIDELINES.md`, `ICON_GUIDELINES.md`, and `MAP_STYLE_GUIDE.md`.

---

## Design tokens

Colors, spacing, typography, and radii come from `src/tools/svg-generator/tokens.ts`, aligned with `VISUAL_STYLE_GUIDE.md` and DD-039. Templates must not hardcode palette values.

---

## Data binding placeholders

Reference assets may show placeholder syntax such as `{{revenue}}`, `{{profit}}`, or `{{companyName}}`. The generator preserves placeholders for documentation purposes. Runtime UI binding happens in presentation code per DD-042.

---

## API

Developer endpoints (NestJS, `DevOnlyGuard`):

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/dev/svg-generator/templates` | List templates |
| GET | `/api/dev/svg-generator/templates/:templateId` | Template detail |
| GET | `/api/dev/svg-generator/backlog` | SVG backlog entries |
| GET | `/api/dev/svg-generator/suggest/:assetId` | Suggested template |
| GET | `/api/dev/svg-generator/activity` | Recent import activity |
| POST | `/api/dev/svg-generator/preview` | Generate preview SVG |
| POST | `/api/dev/svg-generator/validate` | Validate generation request |
| POST | `/api/dev/svg-generator/generate` | Save to repository |

---

## Visual Asset Manager integration

```
SvgGeneratorScreen
  → svg-generator-client.ts
  → SvgGeneratorController
  → SvgGeneratorService
  → Template engine + validator
  → VisualAssetManagerService.importAsset()
```

Shared logic (not duplicated):

- backlog parsing
- catalog updates
- changelog append
- SHA-256 duplicate detection on save
- revision filenames
- destination mapping
- transactional writes with rollback

---

## Security restrictions

- Production guard on all write endpoints
- No inline scripts or `foreignObject`
- No remote URLs in generated SVG
- Strict SVG element and attribute allowlist
- XML escaping for all text content
- No arbitrary filesystem paths from the client
- Strict asset ID validation

---

## Supported SVG elements

Allowlist: `svg`, `g`, `defs`, `style`, `linearGradient`, `radialGradient`, `stop`, `clipPath`, `mask`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `text`, `tspan`, `title`, `desc`.

---

## Tests

| Suite | Location |
|-------|----------|
| Unit | `src/tools/svg-generator/svg-generator.test.ts` |
| Snapshots | `src/tools/svg-generator/svg-generator.snapshots.test.ts` |
| Integration + security | `src/tools/svg-generator/svg-generator.integration.test.ts` |
| API | `apps/api/src/dev/svg-generator.controller.test.ts` |
| UI | `apps/web/src/presentation/screens/dev/SvgGeneratorScreen.test.tsx` |

Run:

```bash
pnpm test -- src/tools/svg-generator apps/api/src/dev/svg-generator.controller.test.ts apps/web/src/presentation/screens/dev/SvgGeneratorScreen.test.tsx
```

---

## Related documents

- `docs/development/VISUAL_ASSET_MANAGER_GUIDE.md`
- `docs/development/CURSOR_SVG_GENERATOR_IMPLEMENTATION.md`
- `docs/architecture/reviews/M11_SVG_GENERATOR_IMPLEMENTATION_REPORT.md`
