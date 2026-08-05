# M11 – Visual Production & User Experience

**Project:** Project Genesis

**Milestone:** M11

**Status:** In Progress

**Tooling:** Visual Asset Manager, SVG Generator, and UI Foundation (Phase 1) — see respective guides under `docs/development/`

**Estimated Duration:** 8–12 Weeks

**Prerequisites**

- M10 COMPLETE
- DD-039 accepted
- DD-040 accepted
- DD-041 accepted

---

# Goal

Transform the existing simulation into a production-quality game experience.

No new gameplay systems shall be introduced unless required for UI integration.

The focus of M11 is:

- visual production
- usability
- accessibility
- interaction quality
- production assets
- interface consistency
- polish

---

# Architecture References

Mandatory:

DD-029 Modular Monolith

DD-032 Deterministic Tick Processing

DD-033 Savegame Architecture

DD-038 Presentation Architecture

DD-039 Design System Architecture

DD-040 Visual Asset Pipeline

DD-041 User Experience Principles

---

# Required Design Documents

ART_DIRECTION.md

VISUAL_STYLE_GUIDE.md

VISUAL_ASSET_CATALOG.md

UI_COMPONENT_LIBRARY.md

ICON_GUIDELINES.md

CHART_GUIDELINES.md

MAP_STYLE_GUIDE.md

MOCKUP_GALLERY.md

---

# Deliverables

Complete production UI

Production assets

Professional navigation

Accessibility improvements

Visual consistency

Animation framework

Polished UX

---

# Phase 1 – Design System Integration

## Goal

Implement the design system defined during M10.

**Status:** Phase 1 UI Foundation complete — see `docs/development/UI_FOUNDATION_GUIDE.md`

---

Tasks

Implement component tokens

Typography

Spacing

Color system

Elevation

Theme support

Dark theme

Component variants

Global styles

---

Deliverables

Unified Design System

Reusable Components

Theme Tokens

Visual Consistency

---

Review

Design Review

---

# Phase 2 – Main Menu & Application Shell

**Status:** ✅ Complete (2026-07-30)

Implement:

Main Menu

Splash Screen

Loading Screen

Save

Load

Settings

Credits

Version Panel

News Panel

Tutorial Entry

---

Deliverables

Production Main Menu

Application Shell

Navigation Framework

---

Review

Navigation Review

---

# Phase 3 – Dashboard System

**Status:** ✅ Complete (2026-08-04) — Gate 3 corrections C1–C5 closed; see `M11_GATE_3_DASHBOARD_REVIEW.md` and `DASHBOARD_IMPLEMENTATION_GUIDE.md`.

Implement:

Company Dashboard

Executive Dashboard

Sidebar

Toolbar

Status Bar

Notifications

KPI Cards

Charts

Tables

Widgets

---

Deliverables

Production Dashboard

---

Review

Dashboard Review

---

Gate 1

UI Foundation Audit

---

# Phase 4 – World & Regional Visualization

Implement:

World Map

Region Screen

Overlay System

Heatmaps

Trade Overlay

Infrastructure Overlay

Resource Overlay

Selection System

Inspector Panel

---

Deliverables

Interactive World Visualization

---

# Phase 4C – Visual Asset Integration

**Status:** ✅ Complete (2026-08-05)

Integrate:

Runtime asset registry

Main menu backgrounds (MM-001–MM-007)

Dashboard mockup → PG component mapping

World SVG overlay registry

Public asset pipeline

---

Deliverables

Runtime backgrounds visible in main menu

Asset registry + loader

Integration guide + Phase 4C report

---

Review

Visual Asset Integration Review

---

Review

Map Review

---

# Phase 5 – Production UX

Implement:

Factory Screen

Recipe Viewer

Inventory

Warehouse

Construction

Production Analytics

Efficiency Indicators

---

Deliverables

Production Management UI

---

Review

Production UX Review

---

# Phase 6 – Research UX

Implement:

Technology Tree

Research Cards

Research Queue

Blueprint Style

Unlock Animation

Research Dashboard

---

Deliverables

Production Research UI

---

Review

Research UX Review

---

Gate 2

Gameplay UX Audit

---

# Phase 7 – Economy & Finance

Implement:

Market

Contracts

Finance Dashboard

Reports

Cash Flow

Analytics

Company Comparison

---

Deliverables

Financial Center

---

Review

Economy UX Review

---

# Phase 8 – Logistics

Implement:

Transport Network

Warehouses

Vehicle UI

Distribution

Routes

Traffic

Capacity

---

Deliverables

Transport Center

---

Review

Transport Review

---

# Phase 9 – Animation & Polish

Implement:

Transitions

Hover States

Selection

Loading

Progress

Feedback

Microinteractions

Sound Hooks

Accessibility

---

Deliverables

Complete Interaction System

---

Review

UX Review

---

Gate 3

Visual Polish Audit

---

# Phase 10 – Asset Production

Generate:

Icons

Charts

Maps

Illustrations

Backgrounds

Logos

Marketing Assets

Steam Assets

---

Deliverables

Production Asset Library

Visual Asset Manager (`/dev/visual-assets`) for backlog-driven imports and document sync

SVG Generator (`/dev/svg-generator`) for typed template-based SVG reference assets

---

Review

Asset Review

---

# Phase 11 – Integration

Replace placeholders

Replace mockups

Asset optimization

Performance validation

UI regression

Documentation update

---

Deliverables

Production UI

---

Review

Integration Review

---

# Phase 12 – Final Polish

Bug fixing

Accessibility improvements

Performance

Visual consistency

Cross-screen validation

Savegame validation

Release preparation

---

Deliverables

Release Candidate UI

---

Gate 4

Final Production Audit

---

# Testing Requirements

Component Tests

Visual Regression

Accessibility Tests

Snapshot Tests

Interaction Tests

Performance Tests

End-to-End UI Tests

---

# Documentation

Update:

IMPLEMENTATION_PROGRESS.md

VISUAL_ASSET_CATALOG.md

MOCKUP_GALLERY.md

Architecture Reviews

ADR references

---

# Success Criteria

All mockups implemented

No placeholder graphics

Design System fully adopted

Accessibility verified

Visual regression stable

UI performance acceptable

No architecture violations

All production assets integrated

---

# Final Deliverable

Project Genesis shall provide a production-quality interface with:

- consistent design language
- complete navigation
- integrated visual assets
- accessible workflows
- responsive dashboards
- polished interactions
- unified user experience

This milestone concludes the transition from technical prototype to production-quality presentation.