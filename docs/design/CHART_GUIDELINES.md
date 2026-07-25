# CHART GUIDELINES

**Project:** Project Genesis

**Version:** 1.0

**Status:** Planning

---

# Purpose

This document defines the visualization language for all charts used
throughout Project Genesis.

Charts are a primary gameplay interface.

They communicate the state of the simulation and support strategic
decision making.

Charts are not decorative elements.

Every chart must help the player understand the economy.

---

# Design Philosophy

Charts answer questions.

Not every chart answers the same question.

Each visualization must clearly communicate one of:

• What changed?

• Why did it change?

• What is likely to happen next?

If a chart cannot answer one of these questions,
it should not exist.

---

# Design Goals

Charts shall be:

Professional

Readable

Minimal

Interactive

Responsive

Accessible

Data-driven

Consistent

Scalable

Timeless

---

# Inspirations

Visual inspiration comes from:

Power BI

Grafana

Bloomberg Terminal

TradingView

Tableau

Industrial SCADA systems

Financial dashboards

Business intelligence software

No decorative chart styles.

No "infographic" aesthetics.

---

# Chart Principles

Charts always prioritize:

information

clarity

comparison

trend recognition

decision support

Animation never has higher priority than readability.

---

# Standard Layout

Every chart consists of:

Title

Subtitle

Chart Area

Legend

Tooltip

Optional Controls

Optional Footer

Optional Status

---

# Chart Categories

## Financial

Cash Flow

Revenue

Expenses

Profit

Liquidity

Debt

Loans

Interest

Taxes

Subsidies

---

## Production

Production Volume

Production Efficiency

Input Consumption

Output Generation

Capacity

Downtime

Machine Utilization

Inventory

---

## Transport

Vehicle Utilization

Route Efficiency

Warehouse Capacity

Travel Time

Throughput

Delivery Delays

Traffic Density

---

## Research

Research Progress

Technology Timeline

Research Spending

Unlock History

Research Queue

---

## Economy

Supply

Demand

Price History

Inflation

Exports

Imports

Regional Trade

Contracts

Market Share

Economic Growth

---

## Company

Employees

Departments

Company Rating

Productivity

Expansion

Investments

Energy Usage

---

## World

Population

Infrastructure

Regional Development

Resource Availability

Energy Production

Pollution

Climate

Economic Activity

---

# Standard Chart Types

## Line Chart

Purpose

Time-based trends.

Examples

Cash

Profit

Population

Production

Research

Prices

Preferred when time is the primary axis.

---

## Area Chart

Purpose

Cumulative development.

Examples

Warehouse Fill

Energy Consumption

Resource Stock

Population

---

## Bar Chart

Purpose

Category comparison.

Examples

Production per Factory

Revenue by Company

Research Cost

Employees by Department

---

## Stacked Bar Chart

Purpose

Composition.

Examples

Energy Mix

Company Expenses

Regional Production

Transport Capacity

---

## Horizontal Bar Chart

Purpose

Ranking.

Examples

Top Companies

Top Regions

Highest Prices

Largest Warehouses

---

## Heatmap

Purpose

Density visualization.

Examples

Demand

Traffic

Production

Infrastructure

Population

---

## Treemap

Purpose

Hierarchical composition.

Examples

Company Portfolio

Production Categories

Resource Distribution

---

## Timeline

Purpose

Historical events.

Examples

Research

Construction

Bankruptcy

Acquisitions

Major Contracts

---

## Scatter Plot

Purpose

Correlation.

Examples

Price vs Demand

Efficiency vs Cost

Population vs Productivity

Research vs Profit

---

## Pie Chart

Use sparingly.

Only for simple part-to-whole comparisons.

Maximum:

6 categories.

---

# Chart Colors

Charts use semantic colors.

Not decorative palettes.

Green

Growth

Blue

Information

Purple

Research

Orange

Warning

Red

Critical

Gray

Reference

Multiple series shall remain distinguishable
without relying only on color.

---

# Grid

Subtle.

Readable.

Supports interpretation.

Never dominates the chart.

---

# Axis Rules

Every axis requires:

Label

Unit

Scale

Consistent formatting

Avoid unnecessary decimal places.

Large numbers should use compact formatting.

---

# Legends

Legends appear only when necessary.

Single-series charts generally omit legends.

Legends should support:

hover

selection

show/hide

---

# Tooltips

Every tooltip shall display:

Label

Value

Unit

Time

Optional comparison

Optional percentage change

Tooltips are mandatory.

---

# Time Navigation

Every historical chart should support:

1 Day

7 Days

30 Days

90 Days

1 Year

5 Years

Entire Game

Future time ranges may be added.

---

# Interactions

Supported interactions:

Hover

Selection

Zoom

Pan

Highlight

Series Toggle

Context Menu

Export

Interactions must never hide critical information.

---

# Threshold Indicators

Charts may display:

Target

Warning Threshold

Critical Threshold

Average

Previous Period

Reference Line

These indicators help interpretation.

---

# Comparison Mode

Many charts should optionally compare:

Current vs Previous Period

Current vs AI

Region vs Region

Company vs Company

Planned vs Actual

Forecast vs Actual

---

# Empty State

Every empty chart explains:

Why no data exists.

How data can be generated.

Never display an empty graph.

---

# Loading State

Use skeleton placeholders.

Avoid blocking dialogs.

---

# Error State

Clearly communicate:

Data unavailable

Simulation paused

Connection issue

Invalid filter

Never expose technical details.

---

# Accessibility

Charts must not rely on color alone.

Support:

Keyboard focus

Screen reader summaries

High contrast

Textual values

Tooltip accessibility

---

# Performance

Charts receive preprocessed ViewData.

Charts never execute simulation logic.

Charts never query repositories.

Large datasets should support:

aggregation

downsampling

virtual rendering where appropriate

---

# Animation

Animations communicate change.

Recommended:

Initial render

Live updates

Series highlight

Selection

Avoid:

constant movement

looping animation

decorative transitions

---

# Export

Every analytical chart should support:

PNG

CSV

Future:

PDF

Clipboard Copy

---

# Dashboard Integration

Charts should integrate naturally with KPI cards.

Example:

Cash KPI

↓

Cash History Chart

↓

Financial Details

↓

Transaction Table

The player should be able to drill down progressively.

---

# Naming Convention

Examples

PGLineChart

PGBarChart

PGAreaChart

PGHeatmap

PGTimeline

PGScatterChart

---

# Review Checklist

Every chart shall be reviewed for:

Readability

Correct chart type

Semantic colors

Accessibility

Performance

Interaction

Consistency

Responsive behavior

Correct units

Meaningful title

---

# Relationship to Other Documents

This document complements:

ART_DIRECTION.md

VISUAL_STYLE_GUIDE.md

VISUAL_ASSET_CATALOG.md

UI_COMPONENT_LIBRARY.md

ICON_GUIDELINES.md

MAP_STYLE_GUIDE.md

MOCKUP_GALLERY.md

All charts implemented in Project Genesis shall follow these guidelines.