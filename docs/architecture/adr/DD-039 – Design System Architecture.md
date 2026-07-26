# DD-039 – Design System Architecture

**Status:** Accepted

**Date:** YYYY-MM-DD

**Authors:** Project Genesis Team

**Supersedes:** None

**Superseded by:** None

---

# Context

Beginning with Milestone M11, Project Genesis transitions from primarily
technical implementation to production-quality user experience.

The project now contains:

- a stable domain model
- deterministic simulation
- modular application architecture
- presentation architecture (DD-038)

A unified visual language is required to ensure that every user interface,
dashboard, chart, map and interaction behaves consistently.

Without a formal design system, different screens would gradually diverge in
layout, typography, spacing, interaction patterns and visual hierarchy.

This would reduce maintainability and negatively affect user experience.

---

# Decision

Project Genesis shall adopt a centralized Design System.

The Design System becomes the single authoritative definition for:

- visual language
- reusable UI components
- interaction patterns
- typography
- spacing
- iconography
- charts
- maps
- accessibility
- theming

Every screen shall be composed exclusively from standardized components.

No screen may introduce custom visual behavior without design review.

---

# Objectives

The Design System shall guarantee:

- consistency
- scalability
- maintainability
- accessibility
- reusability
- predictable interactions

The visual appearance shall evolve through the Design System only.

---

# Scope

The Design System governs:

Application Shell

Navigation

Dashboards

Cards

Tables

Dialogs

Forms

Buttons

Charts

Maps

Notifications

Tooltips

Panels

Loading States

Empty States

Error States

Animations

Branding

---

# Architecture

The Design System is layered.

```text
Art Direction

↓

Visual Style Guide

↓

Component Library

↓

Reusable Components

↓

Application Screens
```

Every layer depends only on the layer directly above it.

---

# Canonical Documents

The following documents define the Design System.

ART_DIRECTION.md

VISUAL_STYLE_GUIDE.md

VISUAL_ASSET_CATALOG.md

UI_COMPONENT_LIBRARY.md

ICON_GUIDELINES.md

CHART_GUIDELINES.md

MAP_STYLE_GUIDE.md

MOCKUP_GALLERY.md

These documents form the canonical visual specification.

---

# Component Model

Every reusable UI element is considered a Component.

Examples:

PGButton

PGCard

PGDialog

PGTable

PGChart

PGWorldMap

PGBadge

PGNotification

Components may compose other components.

Components never contain business logic.

---

# Responsibilities

Components are responsible for:

layout

rendering

interaction

animation

accessibility

visual state

Components are NOT responsible for:

simulation

repositories

domain logic

application decisions

---

# Data Flow

Components receive immutable ViewData.

```text
Application Layer

↓

ViewModel

↓

Component

↓

Rendering
```

Components never directly access repositories.

Components never mutate simulation state.

---

# Component Hierarchy

```text
Application Shell

↓

Workspace

↓

Screen

↓

Section

↓

Panel

↓

Card

↓

Primitive Component
```

This hierarchy shall remain stable.

---

# Visual Consistency

Every component shall use:

same spacing system

same typography

same color semantics

same elevation

same shadows

same borders

same animation timing

same interaction language

No exceptions.

---

# Naming Convention

Components follow:

```text
PG<Component>
```

Examples:

PGButton

PGCard

PGChart

PGMap

PGDialog

PGToolbar

---

# Theme Support

The Design System supports:

Primary Theme

Dark

Future Theme

Light

Components shall never hardcode colors.

Semantic tokens shall be used instead.

---

# Accessibility

Every interactive component shall support:

keyboard navigation

visible focus

screen readers

high contrast

semantic labels

tooltips

Color shall never be the sole information carrier.

---

# Charts

Charts are standardized components.

Every chart follows:

CHART_GUIDELINES.md

Charts shall never invent independent visual styles.

---

# Maps

Maps follow:

MAP_STYLE_GUIDE.md

Maps share:

colors

icons

interaction

selection

overlays

navigation

---

# Icons

Icons follow:

ICON_GUIDELINES.md

The project shall use one coherent icon family.

Mixed icon styles are prohibited.

---

# Asset Management

Visual assets are registered in:

VISUAL_ASSET_CATALOG.md

Assets receive:

unique identifier

status

version

owner

integration state

---

# Mockup Workflow

Every screen follows:

Specification

↓

Wireframe

↓

Mockup

↓

Design Review

↓

Approved

↓

Implementation

↓

QA

↓

Production

Mockups remain the canonical design reference.

---

# Interaction Principles

Every interaction shall provide:

feedback

predictability

consistency

discoverability

minimal cognitive load

Animations support understanding.

Never decoration.

---

# Responsive Design

Primary target:

Desktop

Secondary:

Large Displays

Future:

Ultra-wide

Lightweight responsive behavior is encouraged.

Mobile is out of scope.

---

# Performance

Rendering shall remain independent from simulation.

Heavy visual updates shall never delay simulation ticks.

Charts receive preprocessed data.

Maps receive immutable render data.

---

# Testing

The Design System shall support:

Component Tests

Visual Regression Tests

Accessibility Tests

Interaction Tests

Theme Tests

Snapshot Tests

---

# Documentation

Every component shall document:

Purpose

Inputs

Outputs

States

Variants

Accessibility

Examples

---

# Consequences

Positive:

- consistent UI
- reusable components
- easier maintenance
- simpler onboarding
- faster feature development
- unified visual identity
- scalable design language

Negative:

- initial investment
- stricter review process
- reduced freedom for ad-hoc UI changes

The benefits significantly outweigh the costs.

---

# Alternatives Considered

## Ad-hoc UI

Rejected.

Would lead to inconsistent interfaces.

## Screen-specific components

Rejected.

Creates duplication and maintenance overhead.

## External Design Framework

Rejected.

Project Genesis requires a custom industrial design language.

---

# Relationship to Other ADRs

DD-029 Modular Monolith

Defines architectural module boundaries.

DD-032 Deterministic Tick Processing

Defines deterministic simulation.

DD-033 Savegame Architecture

Defines serialization boundaries.

DD-038 Presentation Architecture

Defines presentation layer responsibilities.

DD-039 extends DD-038 by defining the visual architecture implemented within
the Presentation Layer.

---

# Future Evolution

Potential future extensions include:

Theme Engine

Localization-aware layouts

High-contrast accessibility theme

Animation profiles

Custom player themes

Additional visual platforms

These shall extend the Design System without breaking existing components.

---

# Decision

Project Genesis adopts a centralized Design System as the canonical
architecture for all visual presentation beginning with Milestone M11.

All future UI development shall conform to this architecture.