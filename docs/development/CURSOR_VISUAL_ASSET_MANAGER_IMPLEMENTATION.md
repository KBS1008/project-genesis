# CURSOR IMPLEMENTATION PROMPT — VISUAL ASSET MANAGER

**Project:** Project Genesis  
**Milestone:** M11 – Visual Production & User Experience  
**Status:** Ready for implementation  
**Target path:** `docs/development/CURSOR_VISUAL_ASSET_MANAGER_IMPLEMENTATION.md`

---

# Mission

Implement an internal **Visual Asset Manager** for Project Genesis.

The tool shall automate this workflow:

```text
Select backlog item
→ Upload image
→ Validate file
→ Resolve canonical filename
→ Resolve repository folder
→ Save asset
→ Update VISUAL_PRODUCTION_BACKLOG.md
→ Update VISUAL_ASSET_CATALOG.md
→ Append audit log
```

The user must not manually rename files, choose folders, or update visual-production documents.

---

# Read First

Read completely:

```text
docs/development/CURSOR_IMPLEMENTATION_GUIDE.md
docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md
docs/design/VISUAL_PRODUCTION_BACKLOG.md
docs/design/VISUAL_ASSET_CATALOG.md
docs/design/IMAGE_MOCKUP_EXTRACTION_WORKFLOW.md
docs/design/ART_DIRECTION.md
docs/design/VISUAL_STYLE_GUIDE.md
docs/design/UI_COMPONENT_LIBRARY.md
docs/design/ICON_GUIDELINES.md
docs/design/CHART_GUIDELINES.md
docs/design/MAP_STYLE_GUIDE.md
docs/design/MOCKUP_GALLERY.md
```

Follow:

- DD-038 Presentation Architecture
- DD-039 Design System Architecture
- DD-040 Visual Asset Pipeline
- DD-041 User Experience Principles

---

# Scope

Implement a developer-only tool for:

- backlog discovery
- asset selection
- drag-and-drop upload
- automatic filename resolution
- automatic folder resolution
- image validation
- preview
- duplicate detection
- status changes
- Markdown updates
- audit logging
- revision handling

Initial supported formats:

```text
PNG
JPEG
WebP
SVG
```

PNG is preferred for raster UI mockups.

---

# Non-Goals

Do not implement:

- image generation
- Figma/Adobe integration
- cloud storage
- Steam publishing
- autonomous Git push
- user accounts
- gameplay features
- simulation changes

---

# Route and Production Guard

Implement as a developer-only web route:

```text
/dev/visual-assets
```

Do not expose it in player navigation.

All file-write endpoints must be unavailable in production.

Use the repository’s existing dev-only guard. If none exists, enforce:

```text
NODE_ENV !== "production"
```

---

# Architecture

Use:

```text
Visual Asset Manager UI
→ Typed Presentation API Client
→ NestJS Dev Controller
→ Visual Asset Application Service
→ Repository File-System Adapter
```

React must not access the filesystem or edit Markdown directly.

---

# Internal Model

Suggested model:

```ts
type VisualAssetStatus =
  | "planned"
  | "in-production"
  | "in-review"
  | "approved"
  | "integrated";

type VisualAssetKind =
  | "mockup"
  | "icon"
  | "chart"
  | "map"
  | "illustration"
  | "branding"
  | "marketing";

interface VisualAssetRecord {
  assetId: string;
  displayName: string;
  canonicalFilename: string;
  revision: number;
  kind: VisualAssetKind;
  status: VisualAssetStatus;
  sprint: string;
  targetDirectory: string;
}
```

Keep it inside the developer-tooling module, not the gameplay domain.

---

# Backlog Parsing

Parse:

```text
docs/design/VISUAL_PRODUCTION_BACKLOG.md
```

Recognize:

```text
☐ MM-001_Main_Menu.png
◐ MM-002_New_Game_Dialog.png
👀 MM-003_Load_Game.png
☑ MM-004_Settings.png
🚀 MM-005_Credits.png
```

Requirements:

- preserve all document formatting
- update only the selected line
- reject duplicate IDs
- report malformed entries
- never run a full Markdown reformatter
- changes must be minimal and idempotent

---

# Asset Catalog Updates

Update:

```text
docs/design/VISUAL_ASSET_CATALOG.md
```

For an existing asset, update:

- status
- filename
- revision
- integration state
- review date

For a missing asset, add one canonical entry in the correct category.

Never duplicate asset IDs.

---

# Naming and Revision Rules

The backlog filename is authoritative.

Example:

```text
MM-001_Main_Menu.png
```

Revisions:

```text
MM-001_Main_Menu_Rev1.png
MM-001_Main_Menu_Rev2.png
```

Prohibit names such as:

```text
final-final.png
latest.png
copy.png
new.png
```

Show the resolved name before saving.

---

# Destination Mapping

Centralize this mapping:

```text
MM-*   → docs/design/mockups/main-menu/
DB-*   → docs/design/mockups/dashboard/
WM-*   → docs/design/mockups/world/
PR-*   → docs/design/mockups/production/
RS-*   → docs/design/mockups/research/
EC-*   → docs/design/mockups/economy/
TR-*   → docs/design/mockups/logistics/
CP-*   → docs/design/mockups/company/
RP-*   → docs/design/mockups/reports/
CH-*   → docs/design/charts/
MAP-*  → docs/design/maps/
ICON-* → docs/design/icons/
BR-*   → docs/design/branding/
MK-*   → docs/design/marketing/
```

Do not duplicate path logic between client and server.

---

# Upload UI

Required sections:

- header
- filters
- backlog table
- selected asset details
- drag-and-drop zone
- image preview
- validation results
- resolved destination
- resolved filename
- status selector
- save action
- recent activity

Support filters for:

- sprint
- status
- category
- search text

The user must never type the canonical filename or destination path.

---

# Validation

For raster mockups validate:

- readable image
- width and height present
- width ≥ 450 px
- height ≥ 350 px
- non-zero file size
- extension matches decoded format
- safe size limit
- no exact duplicate

Warn when:

- unusual aspect ratio
- probable contact sheet
- large uniform borders
- suspiciously small dimensions

Errors block import. Warnings may be overridden.

Follow `IMAGE_MOCKUP_EXTRACTION_WORKFLOW.md`.

---

# Duplicate Detection

At minimum implement:

- SHA-256 file hash
- filename collision
- asset ID collision

Do not silently create duplicates.

Show the existing repository path when a duplicate is detected.

---

# Safe Writes

Before writing anything:

1. validate upload
2. parse backlog
3. parse asset catalog
4. resolve filename
5. resolve target directory
6. calculate all pending changes

Then perform:

```text
write image
update backlog
update catalog
append changelog
```

Use temporary files and atomic rename where supported.

If any step fails:

- restore original Markdown files
- remove the newly written asset when safe
- leave no partial state

---

# Audit Log

Create:

```text
docs/design/VISUAL_ASSET_CHANGELOG.md
```

Append one entry per successful operation:

```markdown
## 2026-07-26 — MM-001

- Asset: `MM-001_Main_Menu.png`
- Operation: Added
- Status: Approved
- Destination: `docs/design/mockups/main-menu/MM-001_Main_Menu.png`
- Revision: 0
- SHA-256: `<hash>`
```

Never store absolute local paths.

---

# Status Transitions

Allow:

```text
Planned → In Production
In Production → In Review
In Review → Approved
Approved → Integrated
In Review → In Production
Approved → In Review
```

An integrated asset may only be changed by creating a revision.

Backlog and catalog must remain synchronized.

---

# Suggested API

```text
GET  /api/dev/visual-assets
GET  /api/dev/visual-assets/:assetId
POST /api/dev/visual-assets/validate
POST /api/dev/visual-assets/import
POST /api/dev/visual-assets/:assetId/status
GET  /api/dev/visual-assets/activity
```

Use typed request/response contracts.

Never accept arbitrary filesystem paths from the browser.

---

# Security

Required:

- production disabled
- strict asset-ID validation
- extension allowlist
- path traversal prevention
- upload-size cap
- destination resolved server-side
- no executable uploads
- sanitize SVG or disable SVG initially
- no stack traces in UI

---

# Tests

## Unit

- backlog parser
- catalog updater
- filename resolver
- destination resolver
- revision resolver
- status transitions
- validation
- SHA-256 hashing

## Integration

- import PNG
- update backlog
- update catalog
- append changelog
- duplicate rejection
- revision creation
- rollback after metadata failure
- production guard

## Presentation

- filters
- selection
- upload preview
- validation messages
- replacement confirmation
- success feedback

## Security

- path traversal
- invalid ID
- invalid format
- oversized upload
- production rejection

Use temporary fixture repositories. Tests must never edit real project documents.

---

# Documentation

Create:

```text
docs/development/VISUAL_ASSET_MANAGER_GUIDE.md
```

Document:

- opening the tool
- importing an asset
- revisions
- statuses
- duplicate handling
- recovery
- formats
- path mapping

Update:

```text
docs/development/IMPLEMENTATION_PROGRESS.md
docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md
```

Do not modify ADRs.

---

# Implementation Phases

## Phase A — Audit and Contracts

- inspect current dev-route mechanism
- inspect backlog/catalog structure
- define fixtures
- define API contracts
- finalize module layout

## Phase B — Server Core

- parsers
- resolver
- validator
- hashing
- transactional writer
- audit log

## Phase C — Dev API

- list/read
- validate
- import
- status update
- activity
- production guard

## Phase D — Web UI

- route
- filters
- table
- upload
- preview
- validation
- save
- activity

## Phase E — Tests

- unit
- integration
- presentation
- security

## Phase F — Docs and Review

- user guide
- progress update
- implementation report

---

# Completion Criteria

Complete only when:

- a backlog asset can be selected
- one image can be dropped into the tool
- filename and folder resolve automatically
- validation runs before save
- asset is written to the correct folder
- backlog updates automatically
- catalog updates automatically
- changelog updates automatically
- duplicates are blocked
- revisions work safely
- failures leave no partial state
- production access is blocked
- all tests pass

---

# Completion Report

Create:

```text
docs/architecture/reviews/M11_VISUAL_ASSET_MANAGER_IMPLEMENTATION_REPORT.md
```

Include:

```text
# Executive Summary
# Architecture
# Implemented Components
# Backlog Parser
# Asset Catalog Integration
# File Validation
# Revision Handling
# Transaction Safety
# Developer UI
# Security
# Testing
# Documentation
# Remaining Risks
# Final Recommendation
```

Conclude with exactly one of:

```text
VISUAL ASSET MANAGER READY
```

or:

```text
VISUAL ASSET MANAGER CORRECTIONS REQUIRED
```

---

# Final Instruction

Implement only this Visual Asset Manager.

Do not generate artwork.

Do not change gameplay systems.

Do not continue unrelated M11 work.

Stop after implementation, tests, documentation, and the completion report.
