# Dashboard Style Guide

**Project:** Project Genesis  
**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-07-12

---

# Purpose

This document defines the design principles, layout rules and interaction patterns for all dashboards within Project Genesis.

Dashboards are the primary interface between the player and the simulation. They transform complex simulation data into understandable, actionable information.

Every dashboard should help players make informed strategic decisions quickly and confidently.

---

# Relationship to Other Documents

This document builds upon:

- ART_DIRECTION.md
- VISUAL_PILLARS.md
- DESIGN_PRINCIPLES.md
- VISUAL_LANGUAGE.md
- UI_STYLE_GUIDE.md
- TYPOGRAPHY.md
- COLOR_PALETTE.md
- CHART_STYLE_GUIDE.md

---

# Dashboard Philosophy

Dashboards are decision-support systems.

A dashboard should answer three questions:

1. What is happening?
2. Why is it happening?
3. What should I do next?

The interface should guide the player toward meaningful actions instead of merely displaying raw numbers.

---

# Design Goals

Dashboards should be:

- information-rich
- easy to scan
- visually calm
- highly interactive
- responsive
- consistent
- accessible

Complexity belongs in the simulation—not in the presentation.

---

# General Layout

Every dashboard follows the same high-level structure.

```
+-------------------------------------------------------------+
| Header                                                      |
+-------------------------------------------------------------+
| KPI Cards                                                   |
+-------------------------------------------------------------+
| Charts / Graphs                                             |
+--------------------------+----------------------------------+
| Tables                   | Details                          |
+--------------------------+----------------------------------+
| Status / Notifications                                  |
+-------------------------------------------------------------+
```

Players should always know where to find information.

---

# Header

The header contains:

- Dashboard title
- Current company
- Active scenario
- Simulation date
- Search
- Global actions

Keep the header compact.

---

# KPI Cards

The top section should display the most important indicators.

Examples:

- Cash
- Revenue
- Profit
- Production Efficiency
- Employee Satisfaction
- Market Share
- Energy Balance
- Research Progress

Each KPI card should contain:

- icon
- title
- current value
- trend indicator
- comparison to previous period

---

# Charts

Charts visualize trends over time.

Recommended chart types:

- Line Chart
- Bar Chart
- Area Chart
- Sankey Diagram
- Heatmap
- Waterfall Chart

Pie charts should be used sparingly.

Charts must prioritize readability over decoration.

---

# Tables

Tables provide detailed information.

Requirements:

- sortable
- filterable
- searchable
- sticky headers
- column resizing
- pagination if required

Financial values should align numerically.

---

# Detail Panels

Detail panels display contextual information for the currently selected object.

Typical content:

- building details
- production chain
- transport route
- employee information
- financial breakdown

Selection should immediately update the panel.

---

# Sidebar

Sidebars may contain:

- filters
- navigation
- saved views
- quick actions

The sidebar should remain collapsible.

---

# Notifications

Dashboards should display important events without interrupting gameplay.

Categories:

- Information
- Success
- Warning
- Error

Critical events may remain visible until acknowledged.

---

# Visual Hierarchy

Information should be prioritized through:

1. Position
2. Size
3. Typography
4. Contrast
5. Color

Avoid using animation as the primary attention mechanism.

---

# Color Usage

Colors communicate status.

Examples:

- Blue → Interactive
- Green → Positive
- Yellow/Orange → Warning
- Red → Critical
- Gray → Neutral

Never use color as the only indicator.

---

# Trend Indicators

Whenever possible, display:

- ▲ Increase
- ▼ Decrease
- → Stable

Combine icons with color and numeric values.

---

# Empty States

Every empty dashboard should explain:

- why data is unavailable
- how to generate data
- recommended next action

Example:

"No production buildings have been constructed yet."

---

# Filtering

Support:

- text search
- category filters
- date range
- company
- building type
- production chain
- region

Filters should update data in real time whenever practical.

---

# Drill-Down

Players should be able to navigate from high-level metrics to detailed information.

Example:

Revenue

↓

Product Category

↓

Factory

↓

Production Line

↓

Individual Product

Every dashboard should support logical drill-down paths.

---

# Responsive Behaviour

Dashboards should adapt to:

- Full HD
- 1440p
- 4K
- Ultra-wide displays

Panels should resize gracefully while preserving hierarchy.

---

# Performance

Dashboards should remain responsive even with large simulations.

Recommendations:

- virtualized tables
- lazy loading
- asynchronous updates
- incremental rendering

Avoid blocking the user interface.

---

# Accessibility

Dashboards should support:

- keyboard navigation
- scalable UI
- high contrast
- screen readers where applicable
- color-blind accessibility

Important information must never rely solely on color.

---

# AI Dashboard Generation

When generating dashboard mockups with AI, prompts should specify:

- modern business intelligence software
- clean layout
- KPI cards
- professional charts
- minimalistic interface
- balanced whitespace
- neutral colors
- industrial management aesthetic

---

# Dashboard Review Checklist

| Question                                    | Status |
| ------------------------------------------- | ------ |
| Is the dashboard purpose immediately clear? | □      |
| Are KPIs easy to identify?                  | □      |
| Are charts readable?                        | □      |
| Is navigation intuitive?                    | □      |
| Can users drill down into details?          | □      |
| Does the dashboard support filtering?       | □      |
| Is visual hierarchy clear?                  | □      |
| Does it follow the UI Style Guide?          | □      |

---

# Future Dashboard Types

The following dashboards are planned:

- Executive Overview
- Finance Dashboard
- Production Dashboard
- Logistics Dashboard
- Market Dashboard
- Research Dashboard
- Workforce Dashboard
- Energy Dashboard
- Environment Dashboard
- Construction Dashboard
- Statistics Dashboard

Each dashboard should reuse the same design system.

---

# Related Documents

- UI_STYLE_GUIDE.md
- CHART_STYLE_GUIDE.md
- TYPOGRAPHY.md
- COLOR_PALETTE.md
- ICON_GUIDELINES.md
- DESIGN_TOKENS.md

---

# Summary

Dashboards are the operational command center of Project Genesis.

Their purpose is not only to display information but to support strategic decision-making through clear hierarchy, consistent layouts and highly readable visualizations.

Every dashboard should transform simulation data into actionable knowledge while maintaining a calm, professional and scalable user experience.
