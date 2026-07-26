# Visual Asset Manager Guide

**Project:** Project Genesis  
**Route:** `/dev/visual-assets`  
**Audience:** Developers and art pipeline operators running the project locally

---

## What it does

The Visual Asset Manager automates the M11 visual production workflow:

1. Pick an item from `VISUAL_PRODUCTION_BACKLOG.md`
2. Upload the image (drag-and-drop or file picker)
3. Validate dimensions, format, and naming rules
4. Resolve the canonical filename and repository folder
5. Save the asset under `docs/design/…`
6. Update backlog status, catalog status, and the audit changelog

You should **not** manually rename files, choose folders, or edit backlog/catalog lines for routine imports.

---

## Opening the tool

1. Start the API and web app (same as normal local development):

```bash
pnpm dev
```

2. Open:

```text
http://127.0.0.1:3000/dev/visual-assets
```

The route is **not** linked from player navigation. It is available only in non-production environments.

---

## Importing an asset

1. Filter or search the backlog table.
2. Click a row to select an asset (e.g. `MM-001_Main_Menu.png`).
3. Choose the target status (typically `In Review` or `Approved` after upload).
4. Drop a PNG/JPEG/WebP/SVG file onto the upload zone.
5. Review the resolved filename, destination path, dimensions, and warnings.
6. Click **Save asset**.

On success:

- the image is written under the mapped folder (see below)
- the backlog line icon is updated (☐ ◐ 👀 ☑ 🚀)
- `VISUAL_ASSET_CATALOG.md` status is synchronized
- an entry is appended to `VISUAL_ASSET_CHANGELOG.md`

---

## Path mapping

| Prefix | Destination |
|--------|-------------|
| MM-* | `docs/design/mockups/main-menu/` |
| DB-* | `docs/design/mockups/dashboard/` |
| WM-* | `docs/design/mockups/world/` |
| PR-* | `docs/design/mockups/production/` |
| RS-* | `docs/design/mockups/research/` |
| EC-* | `docs/design/mockups/economy/` |
| TR-* | `docs/design/mockups/logistics/` |
| CP-* | `docs/design/mockups/company/` |
| RP-* | `docs/design/mockups/reports/` |
| CH-* | `docs/design/charts/` |
| MAP-* | `docs/design/maps/` |
| ICON-* | `docs/design/icons/` |
| BR-* | `docs/design/branding/` |
| MK-* | `docs/design/marketing/` |

The backlog filename is authoritative. The tool never accepts arbitrary paths from the browser.

---

## Revisions

First import:

```text
MM-001_Main_Menu.png
```

If that file already exists, the next import becomes:

```text
MM-001_Main_Menu_Rev1.png
MM-001_Main_Menu_Rev2.png
```

Integrated assets (`🚀`) cannot change status directly — import a new revision instead.

---

## Status workflow

Allowed transitions:

```text
Planned → In Production
In Production → In Review
In Review → Approved
In Review → In Production
Approved → Integrated
Approved → In Review
```

Status-only updates are available through the API (`POST /api/dev/visual-assets/:assetId/status`) when no new file is required.

---

## Validation rules

**Raster mockups (MM, DB, WM, …)**

- readable image
- width ≥ 450 px
- height ≥ 350 px
- extension matches detected format
- max upload size 25 MiB

**Warnings** (can be overridden with checkbox):

- undersized mockup when explicitly accepted
- other soft checks added over time

**Blocked**

- corrupt/unknown formats
- SVG with embedded scripts
- duplicate SHA-256 already present in `docs/design/`
- invalid backlog filenames (`final-final`, `latest`, etc.)

---

## Duplicate handling

Before saving, the server hashes the upload (SHA-256) and scans `docs/design/`. If the exact bytes already exist, import is rejected and the existing relative path is shown.

Filename collisions are resolved through the revision suffix rules above.

---

## Recovery

All writes are transactional:

1. image saved via temp file + rename
2. backlog/catalog updated
3. changelog appended

If metadata update fails, markdown files are restored and the new image is removed when safe.

To recover manually:

- inspect `docs/design/VISUAL_ASSET_CHANGELOG.md`
- restore affected markdown files from Git
- delete orphaned images if needed

---

## API reference (development only)

```text
GET  /api/dev/visual-assets
GET  /api/dev/visual-assets/activity
GET  /api/dev/visual-assets/:assetId
POST /api/dev/visual-assets/validate   (multipart: file, backlogFilename, status)
POST /api/dev/visual-assets/import     (multipart: file, backlogFilename, status)
POST /api/dev/visual-assets/:assetId/status  (JSON: { status })
```

All endpoints return `{ ok: true, data }` or `{ ok: false, error }`.

Production builds reject these routes (`NODE_ENV=production`).

---

## Supported formats

| Format | Notes |
|--------|-------|
| PNG | Preferred for UI mockups |
| JPEG | Allowed |
| WebP | Allowed |
| SVG | Allowed; script content is rejected |

---

## Related documents

- `docs/design/VISUAL_PRODUCTION_BACKLOG.md`
- `docs/design/VISUAL_ASSET_CATALOG.md`
- `docs/design/VISUAL_ASSET_CHANGELOG.md`
- `docs/design/IMAGE_MOCKUP_EXTRACTION_WORKFLOW.md`
- `docs/development/CURSOR_VISUAL_ASSET_MANAGER_IMPLEMENTATION.md`
