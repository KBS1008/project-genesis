# DD-040 – Visual Asset Pipeline

**Status:** Accepted

**Date:** YYYY-MM-DD

**Authors:** Project Genesis Team

**Supersedes:** None

**Superseded by:** None

---

# Context

Beginning with Milestone M11, Project Genesis enters the visual production
phase.

The project will contain several hundred visual assets, including:

- UI mockups
- icons
- charts
- maps
- illustrations
- logos
- loading screens
- splash screens
- marketing material

Without a standardized asset pipeline, the project risks:

- inconsistent naming
- duplicate assets
- version conflicts
- outdated artwork
- missing references
- broken UI integrations

A formal Visual Asset Pipeline is therefore required.

---

# Decision

Project Genesis adopts a centralized Visual Asset Pipeline.

Every visual asset shall follow a defined lifecycle from creation to
production.

Assets shall be uniquely identifiable, versioned and traceable.

No production asset may exist outside this pipeline.

---

# Objectives

The pipeline shall guarantee:

- consistency
- traceability
- maintainability
- reproducibility
- version control
- integration safety
- production readiness

---

# Asset Categories

The pipeline governs:

UI Mockups

Icons

Charts

Maps

Illustrations

Backgrounds

Company Logos

Loading Screens

Splash Screens

Marketing Assets

Steam Assets

Documentation Images

Future Cinematics

---

# Asset Lifecycle

Every asset follows:

```text
Planned

↓

Concept

↓

Draft

↓

Review

↓

Approved

↓

Integrated

↓

Released

↓

Archived
```

Assets may never skip approval.

---

# Repository Structure

```text
docs/
└── design/
    ├── mockups/
    ├── icons/
    ├── charts/
    ├── maps/
    ├── illustrations/
    └── marketing/

assets/
├── ui/
├── icons/
├── maps/
├── charts/
├── backgrounds/
├── logos/
└── marketing/
```

Documentation assets and production assets remain separated.

---

# Naming Convention

Every asset receives a unique identifier.

Format:

```text
<AREA>-<NUMBER>_<DESCRIPTION>_v<VERSION>
```

Examples:

MM-001_Main_Menu_v1.png

MM-002_New_Game_Dialog_v3.png

DB-001_Dashboard_v1.png

WM-004_Trade_Overlay_v2.png

ICON_RESOURCE_COAL.svg

CHART_FINANCE_CASHFLOW.svg

MAP_WORLD_RESOURCES_v1.png

---

# Versioning

Assets are never overwritten.

Example:

```text
MM-001_Main_Menu_v1

↓

MM-001_Main_Menu_v2

↓

MM-001_Main_Menu_Final
```

Production always references approved versions.

---

# Asset States

Every asset shall have one of:

Planned

Draft

In Review

Approved

Integrated

Deprecated

Archived

---

# Asset Registry

Every asset is registered in:

VISUAL_ASSET_CATALOG.md

Each entry contains:

Asset ID

Name

Category

Status

Owner

Version

Target Screen

Integration Status

Dependencies

---

# Source Files

Editable source files are preserved.

Examples:

Figma

SVG

PSD (if used)

AI (Illustrator)

Raster exports alone are insufficient.

---

# Export Formats

Preferred formats:

SVG

PNG

WebP (future)

JPEG only for marketing material.

Production UI assets shall use lossless formats.

---

# Mockup Pipeline

Every mockup follows:

Specification

↓

Wireframe

↓

Mockup

↓

Review

↓

Approved

↓

Implementation

↓

Visual QA

↓

Production

Mockups remain the canonical UI reference.

---

# Icon Pipeline

Icons follow:

Concept

↓

SVG

↓

Review

↓

Accessibility Review

↓

Integration

↓

Production

Icons must conform to:

ICON_GUIDELINES.md

---

# Chart Pipeline

Charts follow:

Design

↓

Prototype

↓

Review

↓

Implementation

↓

Validation

↓

Production

Charts conform to:

CHART_GUIDELINES.md

---

# Map Pipeline

Maps follow:

Layout

↓

Visual Design

↓

Overlay Review

↓

Interaction Review

↓

Implementation

↓

Production

Maps conform to:

MAP_STYLE_GUIDE.md

---

# Illustration Pipeline

Illustrations follow:

Concept

↓

Art Review

↓

Revision

↓

Approval

↓

Production

---

# Quality Gates

Before approval, every asset is reviewed for:

Visual quality

Naming

Consistency

Accessibility

Correct dimensions

Correct format

Correct version

Integration readiness

---

# Integration

Approved assets are referenced by:

UI Components

Presentation Layer

Mockup Gallery

Documentation

Assets are never referenced directly from temporary locations.

---

# Validation

Every integrated asset must verify:

Correct filename

Correct version

Correct resolution

Correct format

Correct placement

Correct references

No broken links

---

# Performance

Asset optimization shall preserve visual quality.

Avoid unnecessary file size.

Prefer vector assets whenever practical.

Large raster images should be optimized before release.

---

# Build Pipeline

Future build pipeline responsibilities include:

Asset validation

Unused asset detection

Duplicate detection

Broken reference detection

Export verification

---

# Accessibility

Icons

Charts

Maps

Illustrations

shall support:

High contrast

Scalable rendering

Semantic meaning

Alternative text where appropriate

---

# Documentation

Every production asset shall be traceable to:

VISUAL_ASSET_CATALOG.md

MOCKUP_GALLERY.md

Relevant ADRs

Relevant implementation task

---

# Consequences

Positive:

- consistent asset management
- easier collaboration
- simplified maintenance
- reproducible builds
- scalable production workflow
- reduced duplication

Negative:

- stricter review process
- additional documentation effort

The long-term benefits outweigh the overhead.

---

# Alternatives Considered

## Ad-hoc Asset Storage

Rejected.

Would result in inconsistent naming and missing references.

## Folder-based Management Only

Rejected.

Folders alone do not provide traceability.

## External Asset Management System

Rejected.

Unnecessary complexity for current project scope.

---

# Relationship to Other ADRs

DD-029 – Modular Monolith

Defines architectural module boundaries.

DD-038 – Presentation Architecture

Defines presentation responsibilities.

DD-039 – Design System Architecture

Defines reusable visual components.

DD-040 defines the lifecycle, organization and integration of every visual
asset used by the Presentation Layer.

---

# Future Evolution

Potential future enhancements include:

Automated asset optimization

Visual regression testing

CDN deployment

Theme-specific asset variants

Localization-aware graphics

Automated thumbnail generation

Build-time asset verification

---

# Decision

Project Genesis adopts a centralized Visual Asset Pipeline beginning with
Milestone M11.

All visual assets shall be created, reviewed, versioned, integrated and
maintained exclusively through this pipeline.