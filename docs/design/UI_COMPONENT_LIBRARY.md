# UI COMPONENT LIBRARY

**Project:** Project Genesis

**Version:** 1.0

**Status:** Planning

---

# Purpose

This document defines every reusable user interface component used by
Project Genesis.

The goals are:

- visual consistency
- interaction consistency
- accessibility
- reuse
- maintainability

Every gameplay screen shall be composed from these components.

No screen should invent its own component unless approved by design review.

---

# Design Philosophy

Components are:

- reusable
- composable
- predictable
- accessible
- data-driven

Components shall contain presentation logic only.

Business logic belongs to the Application Layer.

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
Component
    ↓
Primitive
```

---

# Naming Convention

```
PG<Component>

Examples

PGButton

PGCard

PGDialog

PGTable

PGBadge

PGChart
```

---

# Component Categories

## Application Components

Application Shell

Workspace

Sidebar

Toolbar

Header

Footer

Breadcrumbs

Workspace Tabs

Simulation Controls

Notification Area

Status Bar

---

## Navigation Components

Primary Navigation

Secondary Navigation

Context Navigation

Tab Bar

Entity Navigation

Pagination

Breadcrumb Navigation

Region Selector

Company Selector

Market Selector

---

## Layout Components

Page

Section

Split Layout

Grid Layout

Stack Layout

Panel Layout

Resizable Panel

Dock Area

Scrollable Area

Sidebar

Inspector Panel

---

## Surface Components

Panel

Card

Window

Dialog

Drawer

Popover

Tooltip

Accordion

Collapsible Panel

Floating Panel

---

## Input Components

Text Input

Number Input

Currency Input

Percentage Input

Date Picker

Time Picker

Slider

Toggle

Checkbox

Radio Button

Search Field

Tag Selector

Autocomplete

---

## Selection Components

Dropdown

Tree View

Hierarchy Selector

Entity Picker

Technology Picker

Building Picker

Resource Picker

Recipe Picker

Company Picker

Region Picker

---

## Buttons

Primary Button

Secondary Button

Danger Button

Ghost Button

Icon Button

Split Button

Menu Button

Toolbar Button

Floating Action Button (future)

---

## Tables

Standard Table

Sortable Table

Grouped Table

Tree Table

Financial Table

Inventory Table

Production Table

Market Table

Research Table

Transport Table

Virtualized Table

---

## Lists

Simple List

Virtual List

Entity List

Timeline

Notification List

Task List

Research Queue

Production Queue

Transport Queue

---

## Cards

Summary Card

Statistic Card

Financial Card

Resource Card

Production Card

Building Card

Research Card

Transport Card

Company Card

Region Card

Market Card

Alert Card

---

## KPI Widgets

Cash

Revenue

Expenses

Profit

Inventory

Employees

Production

Research

Market Share

Transport

Energy

Efficiency

Storage

Company Rating

---

## Charts

Line Chart

Area Chart

Bar Chart

Stacked Bar

Heatmap

Treemap

Timeline

Progress Chart

Price History

Demand Curve

Supply Curve

Production Trend

Finance Trend

Population Trend

Transport Utilization

---

## Maps

World Map

Region Map

Transport Overlay

Trade Overlay

Resource Overlay

Ownership Overlay

Infrastructure Overlay

Heatmap Overlay

Selection Overlay

---

## Progress Components

Linear Progress

Circular Progress

Research Progress

Production Progress

Construction Progress

Transport Progress

Loading Spinner

Skeleton Loader

---

## Status Components

Badge

Status Chip

Indicator

Signal

Health Indicator

Trend Indicator

Connection Indicator

Simulation Indicator

---

## Notification Components

Toast

Snackbar

Inline Notification

Alert Banner

Critical Alert

Confirmation Dialog

Error Dialog

Success Dialog

---

## Empty States

No Buildings

No Production

No Research

No Market Data

No Employees

No Contracts

No Savegames

No Results

---

## Error States

Validation Error

Network Error

Simulation Error

Savegame Error

Permission Error

Unknown Error

---

## Analytics Components

KPI Dashboard

Executive Dashboard

Production Dashboard

Finance Dashboard

Research Dashboard

Market Dashboard

Transport Dashboard

Regional Dashboard

---

# Primitive Components

Text

Heading

Label

Icon

Divider

Spacer

Avatar

Image

Surface

Container

Stack

Grid

Flex

---

# Component Rules

Every component must support:

Loading

Disabled

Error

Empty

Focused

Hovered

Active

Selected

Keyboard Navigation

---

# Accessibility Requirements

Every interactive component must support:

Keyboard navigation

Visible focus

ARIA labels where applicable

Screen reader compatibility

Color-independent state indication

Accessible tooltips

---

# Theme Support

Every component must support:

Dark Theme

Future Light Theme

Consistent spacing

Consistent typography

Semantic colors

---

# Responsiveness

Desktop First

Large Monitor Support

Minimum Resolution Support

Graceful resizing

Scrollable overflow where required

---

# Data Binding

Components receive immutable ViewData.

Components never mutate repositories.

Components never execute business rules.

Commands are dispatched through the Application Layer.

---

# Component Composition

Example

```text
Company Dashboard

↓

Summary Section

↓

Financial Card

↓

Cash KPI

↓

Currency Label
```

---

# Performance Guidelines

Avoid unnecessary re-rendering.

Prefer memoized components where beneficial.

Large datasets should use virtualization.

Avoid expensive computations inside render functions.

Charts should receive preprocessed ViewData.

---

# Animation Guidelines

Animations communicate:

Selection

Progress

Completion

Navigation

Loading

Avoid decorative animations.

---

# Component Review Checklist

Every new component shall be reviewed for:

Consistency

Accessibility

Reusability

Performance

Responsiveness

Visual hierarchy

Naming

Maintainability

Testability

---

# Relationship to Other Documents

This library complements:

ART_DIRECTION.md

VISUAL_STYLE_GUIDE.md

VISUAL_ASSET_CATALOG.md

ICON_GUIDELINES.md

CHART_GUIDELINES.md

MAP_STYLE_GUIDE.md

MOCKUP_GALLERY.md

All UI implementations shall use this component library as the canonical reference.
