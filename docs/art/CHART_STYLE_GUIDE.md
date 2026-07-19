# Chart Style Guide

**Project:** Project Genesis  
**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-07-12

---

# Purpose

This document defines the visualization standards for all charts used throughout Project Genesis.

Charts transform raw simulation data into actionable insights. They should enable players to quickly understand trends, compare values and make informed strategic decisions.

Charts are not decorative elements—they are core gameplay components.

---

# Relationship to Other Documents

This document builds upon:

- ART_DIRECTION.md
- VISUAL_PILLARS.md
- DESIGN_PRINCIPLES.md
- VISUAL_LANGUAGE.md
- UI_STYLE_GUIDE.md
- DASHBOARD_STYLE_GUIDE.md
- TYPOGRAPHY.md
- COLOR_PALETTE.md

---

# Chart Philosophy

Every chart should answer one primary question.

Examples:

- Is production increasing?
- Which factory is least efficient?
- Where is profit declining?
- Which product generates the highest margin?

Avoid combining unrelated information into a single visualization.

---

# Design Goals

Charts should be:

- readable
- comparable
- uncluttered
- interactive
- consistent
- accessible
- scalable

---

# General Design Rules

Prefer:

- simple layouts
- minimal grid lines
- neutral backgrounds
- restrained colors
- balanced spacing

Avoid:

- 3D charts
- gradients
- decorative textures
- unnecessary animations
- excessive labels

---

# Color Usage

Use colors consistently.

| Meaning | Example                |
| ------- | ---------------------- |
| Blue    | Neutral / Primary      |
| Green   | Positive               |
| Orange  | Warning                |
| Red     | Critical / Negative    |
| Gray    | Secondary / Historical |

Never use color as the sole means of conveying meaning.

---

# Typography

Charts should use the typography system defined in TYPOGRAPHY.md.

Requirements:

- consistent font family
- concise labels
- readable axis titles
- clear legends

Avoid excessive text.

---

# Grid Lines

Grid lines should support reading values without dominating the chart.

Recommendations:

- light gray
- thin stroke
- horizontal lines preferred
- minimize vertical lines

---

# Legends

Legends should be:

- close to the chart
- concise
- ordered logically
- removable when unnecessary

Avoid duplicate information.

---

# Tooltips

Every interactive chart should provide tooltips.

Tooltips should display:

- exact value
- unit
- date or category
- comparison where appropriate

Tooltips should remain compact.

---

# Axis Guidelines

Axes should:

- start at logical values
- display units
- use readable intervals
- avoid excessive tick marks

Numbers should be formatted consistently.

---

# Supported Chart Types

## Line Chart

Use for:

- trends
- production over time
- financial history
- research progress

Avoid using line charts for unrelated categories.

---

## Bar Chart

Use for:

- comparisons
- rankings
- productivity
- market share
- inventory

Bars should start at zero.

---

## Stacked Bar Chart

Use when displaying composition.

Examples:

- production by resource
- costs by category
- energy mix

Avoid too many stacked categories.

---

## Area Chart

Use for cumulative development.

Examples:

- total population
- storage utilization
- cumulative revenue

Transparency should remain subtle.

---

## Scatter Plot

Use for correlation.

Examples:

- investment vs profit
- pollution vs production
- education vs productivity

Avoid connecting data points.

---

## Heatmap

Use for:

- factory efficiency
- regional demand
- logistics utilization
- power consumption

Color scales should remain intuitive.

---

## Sankey Diagram

Recommended for:

- production chains
- logistics networks
- resource flows
- supply chains

This is one of the most important visualization types in Project Genesis.

---

## Waterfall Chart

Use for financial analysis.

Examples:

- profit calculation
- cost breakdown
- monthly cash flow

---

## Tree Map

Use for proportional structures.

Examples:

- company divisions
- warehouse contents
- production categories

---

## Pie Chart

Use sparingly.

Only for:

- simple composition
- few categories
- one point in time

Prefer bar charts whenever precise comparison matters.

---

# Animation

Animations should communicate change.

Allowed:

- smooth transitions
- value interpolation
- hover highlighting
- selection feedback

Avoid:

- spinning charts
- bouncing effects
- excessive movement

---

# Interactive Features

Charts should support:

- zoom
- filtering
- drill-down
- hover information
- export
- reset view

Interaction should always feel responsive.

---

# Drill-Down

Every major chart should support hierarchical navigation where appropriate.

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

---

# Time Series

Time-based charts should provide:

- zoom
- period selection
- comparison periods
- trend indicators

Support:

- daily
- weekly
- monthly
- quarterly
- yearly

---

# Financial Charts

Financial charts should emphasize:

- trends
- comparisons
- anomalies
- forecasts

Currency formatting must remain consistent throughout the interface.

---

# Production Charts

Production visualizations should highlight:

- bottlenecks
- idle capacity
- efficiency
- throughput
- inventory

Sankey diagrams and stacked bars are preferred.

---

# Accessibility

Charts should support:

- keyboard navigation
- screen readers where practical
- high contrast
- color-blind friendly palettes

Important information should never depend on color alone.

---

# Performance

Charts should remain responsive even with large datasets.

Recommendations:

- lazy loading
- data aggregation
- virtualization
- incremental rendering

---

# AI Chart Mockups

When generating chart concepts with AI, prompts should include:

- modern BI dashboard
- clean professional layout
- flat design
- neutral background
- minimalistic style
- consistent typography
- industrial management software aesthetic

---

# Chart Review Checklist

| Question                                         | Status |
| ------------------------------------------------ | ------ |
| Is the chart immediately understandable?         | □      |
| Is the correct chart type used?                  | □      |
| Are colors meaningful and consistent?            | □      |
| Is the visual hierarchy clear?                   | □      |
| Are labels concise?                              | □      |
| Does the chart support interaction where needed? | □      |
| Is accessibility considered?                     | □      |
| Does it follow the design system?                | □      |

---

# Future Chart Library

Standard chart templates should eventually be created for:

- Revenue
- Profit
- Cash Flow
- Production Output
- Warehouse Capacity
- Resource Flow
- Logistics
- Market Share
- Research Progress
- Workforce Statistics
- Energy Consumption
- Environmental Impact

Each template should reuse the same visual language.

---

# Related Documents

- DASHBOARD_STYLE_GUIDE.md
- UI_STYLE_GUIDE.md
- TYPOGRAPHY.md
- COLOR_PALETTE.md
- DESIGN_TOKENS.md
- ICON_GUIDELINES.md

---

# Summary

Charts are one of the primary decision-support tools in Project Genesis.

Every visualization should maximize clarity, consistency and strategic insight while minimizing cognitive load.

The goal is to help players understand the simulation—not simply to display data.
