# CURSOR IMPLEMENTATION PROMPT

# M11 – PHASE 1
# UI FOUNDATION & DASHBOARD IMPLEMENTATION

Project:
Project Genesis

Status:
Approved

Priority:
Critical

Milestone:
M11

Estimated Duration:
High

------------------------------------------------------------
MISSION
------------------------------------------------------------

Implement the complete UI Foundation for Project Genesis.

This is NOT a prototype.

The result shall become the production-ready foundation for every
future UI screen.

Every implementation must follow Clean Architecture,
the existing Design Documents,
and the Presentation Architecture.

No shortcuts.

No temporary implementations.

No duplicated code.

------------------------------------------------------------
STEP 1 — REPOSITORY AUDIT
------------------------------------------------------------

Before implementing anything:

Read completely:

docs/design/DD-039_Design_System_Architecture.md
docs/design/DD-040_Visual_Asset_Pipeline.md
docs/design/DD-041_User_Experience_Principles.md
docs/design/UI_DATA_BINDING_GUIDELINES.md
docs/design/UI_TEXT_GUIDELINES.md
docs/design/UI_LAYOUT_GUIDELINES.md

docs/design/UI_COMPONENT_LIBRARY.md
docs/design/VISUAL_STYLE_GUIDE.md
docs/design/VISUAL_ASSET_CATALOG.md
docs/design/VISUAL_PRODUCTION_BACKLOG.md

Review all Dashboard assets:

DB-001
DB-002
DB-003
DB-004
DB-005
DB-006
DB-007
DB-008
DB-009
DB-010

Review the Presentation Layer.

Review existing UI infrastructure.

Review Design Tokens.

Review routing.

Review themes.

Review component architecture.

------------------------------------------------------------
STEP 2 — ARCHITECTURE REVIEW
------------------------------------------------------------

Before coding:

Identify

• duplicated code

• missing abstractions

• architecture violations

• missing services

• inconsistent naming

• inconsistent styling

If improvements are necessary

implement them first.

------------------------------------------------------------
STEP 3 — DESIGN SYSTEM
------------------------------------------------------------

Implement

✓ Design Tokens

✓ Color Palette

✓ Typography

✓ Spacing

✓ Radius

✓ Shadows

✓ Elevation

✓ Focus States

✓ Semantic Colors

✓ Theme System

✓ Responsive Breakpoints

✓ Grid System

✓ Icon Sizes

✓ Animation Tokens

No hardcoded values.

Everything must come from centralized tokens.

------------------------------------------------------------
STEP 4 — UI FOUNDATION
------------------------------------------------------------

Implement

Application Shell

Top Navigation

Left Navigation

Content Area

Right Inspector Panel

Bottom Status Bar

Dialog System

Modal System

Notification System

Toast System

Loading Overlay

Error Overlay

Context Menu

Empty States

Skeleton Loader

Global Search

Keyboard Navigation

Accessibility

Dark Theme

------------------------------------------------------------
STEP 5 — IMPLEMENT DASHBOARD COMPONENTS
------------------------------------------------------------

Implement reusable React components.

Required:

PGKpiCard

PGStatusPanel

PGNotificationCenter

PGFinanceWidget

PGProductionWidget

PGResearchWidget

PGSupplyChainWidget

PGCompanyWidget

PGReportWidget

Every component shall:

support variants

support responsive layout

support DD-042 placeholders

support runtime data binding

support loading state

support empty state

support error state

support accessibility

------------------------------------------------------------
STEP 6 — IMPLEMENT EXECUTIVE DASHBOARD
------------------------------------------------------------

Assemble the complete dashboard.

Use only reusable components.

Do NOT recreate layouts.

Use:

Top Bar

Navigation

Dashboard Grid

Widgets

Charts

Notifications

Inspector

Player Summary

Company Summary

Recent Events

Alerts

Quick Actions

Everything must be runtime-driven.

No hardcoded player names.

No hardcoded company names.

No hardcoded numbers.

------------------------------------------------------------
STEP 7 — VISUAL ASSET INTEGRATION
------------------------------------------------------------

Integrate

Visual Asset Manager

SVG Generator

Dashboard Assets

Theme Assets

Design Tokens

No duplicated asset handling.

------------------------------------------------------------
STEP 8 — TESTING
------------------------------------------------------------

Create

Unit Tests

Component Tests

Integration Tests

Accessibility Tests

Responsive Tests

Theme Tests

Snapshot Tests

Visual Regression Tests

Every component must be tested.

------------------------------------------------------------
STEP 9 — DOCUMENTATION
------------------------------------------------------------

Create

docs/development/UI_FOUNDATION_GUIDE.md

Update

IMPLEMENTATION_PROGRESS.md

Update

M11_VISUAL_PRODUCTION_PLAN.md

Document

implemented components

public APIs

design tokens

folder structure

runtime bindings

------------------------------------------------------------
STEP 10 — SELF REVIEW
------------------------------------------------------------

Perform complete audit.

Verify

Architecture

Design

Performance

Accessibility

Maintainability

Responsiveness

Theme consistency

Data Binding

No duplicated components

No duplicated styling

------------------------------------------------------------
STEP 11 — IMPLEMENTATION REPORT
------------------------------------------------------------

Create

docs/architecture/reviews/M11_PHASE1_IMPLEMENTATION_REPORT.md

Include

Executive Summary

Architecture

Design System

Theme

Dashboard Components

Runtime Binding

Accessibility

Testing

Performance

Remaining Risks

Recommendations

------------------------------------------------------------
QUALITY REQUIREMENTS
------------------------------------------------------------

The implementation must be

production ready

fully typed

responsive

accessible

themeable

maintainable

component based

testable

future proof

------------------------------------------------------------
COMPLETION CRITERIA
------------------------------------------------------------

The milestone is complete only when

✓ Design System implemented

✓ Theme implemented

✓ UI Foundation implemented

✓ Dashboard components implemented

✓ Executive Dashboard working

✓ Runtime data binding implemented

✓ Accessibility implemented

✓ Tests passing

✓ Documentation complete

✓ Implementation report created

------------------------------------------------------------
FINAL RESULT
------------------------------------------------------------

Finish with exactly one statement

UI FOUNDATION READY

or

UI FOUNDATION CORRECTIONS REQUIRED

Do not stop before every requirement has been completed.