# MAP STYLE GUIDE

**Project:** Project Genesis

**Version:** 1.0

**Status:** Planning

---

# Purpose

This document defines the visual language of all maps used throughout
Project Genesis.

Maps are not decorative.

Maps are strategic planning tools.

They visualize:

- geography
- economy
- logistics
- infrastructure
- resources
- regional development
- trade
- company presence

Every map shall support decision making.

---

# Design Philosophy

Maps answer one question:

"Where should I act next?"

Everything on a map must improve spatial understanding.

The player should immediately recognize:

- important regions
- production centers
- transport bottlenecks
- economic opportunities
- resource locations

without visual clutter.

---

# Design Goals

Maps shall be:

Professional

Readable

Scalable

Interactive

Layered

Minimal

Modern

Industrial

Data-driven

---

# Visual Identity

Maps should resemble:

industrial planning software

logistics systems

GIS applications

transport planning tools

executive planning dashboards

Not:

fantasy maps

painted maps

parchment

hand drawn

cartoon

satellite photography

---

# Map Hierarchy

Every map consists of:

Background

↓

Terrain

↓

Water

↓

Political Regions

↓

Infrastructure

↓

Resources

↓

Buildings

↓

Companies

↓

Transport

↓

Selections

↓

Information Overlay

↓

Tooltips

↓

Context Actions

---

# World Scale

The world map represents:

continents

countries (optional)

regions

cities (future)

industrial areas

resource fields

transport corridors

Every zoom level should reveal additional detail.

---

# Terrain Style

Terrain should remain subtle.

The map is not a landscape simulator.

Terrain supports orientation.

Terrain must never compete with gameplay layers.

---

# Water

Oceans

Seas

Lakes

Rivers

should provide orientation only.

Shipping routes remain clearly visible.

---

# Regional Borders

Regions are primary gameplay entities.

Borders must remain visible at all zoom levels.

Selected regions receive enhanced emphasis.

---

# Region Colors

Region colors communicate ownership and state.

Examples

Player

AI Company

Neutral

Unavailable

Protected

Contested (future)

Colors should remain muted.

Selections provide emphasis.

---

# Infrastructure

Roads

Railways

Ports

Airports

Power Grid

Pipelines (future)

Communication (future)

Infrastructure should remain visible without overwhelming the map.

---

# Resource Layer

Resources appear as symbols.

Not illustrations.

Each resource uses:

consistent icon

consistent scale

consistent placement

Resource density must remain readable.

---

# Building Layer

Buildings appear as scalable symbols.

Large facilities become visible earlier.

Small facilities appear when zoomed in.

Building categories:

Production

Research

Transport

Administration

Energy

Storage

Public Services (future)

---

# Transport Layer

Transport is one of the primary gameplay layers.

Supported elements:

Road Routes

Rail Routes

Shipping Routes

Air Cargo

Distribution Centers

Warehouses

Traffic Density

Congestion

Vehicle Movement

Transport overlays should emphasize flow.

---

# Company Layer

Displays:

Headquarters

Regional Offices

Factories

Warehouses

Research Centers

Distribution Centers

Ownership

Influence

Expansion

---

# Economy Layer

Displays:

Supply

Demand

Prices

Trade Volume

Exports

Imports

Market Health

Regional Wealth

Economic Activity

Heatmaps should remain subtle.

---

# Population Layer

Displays:

Population

Workforce

Education

Urbanization

Employment

Migration (future)

---

# Energy Layer

Displays:

Power Plants

Renewables

Consumption

Grid Capacity

Energy Flow

Energy Deficits

---

# Research Layer

Displays:

Research Centers

Technology Distribution

Innovation Hotspots

Specialization

---

# Environmental Layer

Displays:

Pollution

Protected Areas

Renewable Potential

Water Availability

Climate Zones

Future Sustainability Metrics

---

# Overlay System

Every overlay can be enabled independently.

Only one major analytical overlay should be active at a time.

Minor overlays may coexist.

---

# Selection

Selections receive:

outline

highlight

information panel

context actions

The selected region should always remain visible.

---

# Tooltips

Hovering a region should display:

Name

Owner

Population

Economy

Resources

Infrastructure

Major Industries

Current Status

No technical information.

---

# Zoom Levels

World

↓

Continent

↓

Region

↓

Industrial Area

↓

Facility

Each zoom level progressively reveals more information.

Nothing important should disappear unexpectedly.

---

# Labels

Labels appear progressively.

Priority:

Selected Region

↓

Major Cities

↓

Industrial Areas

↓

Transport Hubs

↓

Minor Settlements

Avoid label overlap.

---

# Icons

Icons follow:

ICON_GUIDELINES.md

Do not create map-specific icon styles.

---

# Colors

Maps use semantic colors.

Do not use saturated colors for terrain.

High saturation is reserved for:

alerts

selection

critical issues

active filters

---

# Animations

Supported:

Vehicle Movement

Construction

Selection

Research

Transport Flow

Trade Flow

Avoid decorative animations.

---

# Heatmaps

Supported:

Demand

Supply

Traffic

Population

Energy

Pollution

Economic Activity

Heatmaps should remain transparent enough to preserve geographic context.

---

# Route Visualization

Routes should communicate:

origin

destination

capacity

utilization

priority

status

Different transport modes remain visually distinguishable.

---

# Accessibility

Support:

High contrast

Color-independent indicators

Keyboard navigation

Screen reader summaries

Zoom controls

---

# Performance

Maps shall support:

thousands of buildings

hundreds of transport routes

dozens of overlays

without affecting simulation performance.

Rendering must remain independent from simulation.

---

# Future Features

Potential future extensions:

Political borders

Weather

Natural disasters

Military logistics

Global trade lanes

Satellite imagery (optional)

Historical replay

Scenario overlays

---

# Review Checklist

Every map shall be reviewed for:

Readability

Scalability

Performance

Interaction

Accessibility

Visual hierarchy

Overlay consistency

Information density

Navigation

Strategic usefulness

---

# Relationship to Other Documents

This document complements:

ART_DIRECTION.md

VISUAL_STYLE_GUIDE.md

VISUAL_ASSET_CATALOG.md

UI_COMPONENT_LIBRARY.md

ICON_GUIDELINES.md

CHART_GUIDELINES.md

MOCKUP_GALLERY.md

All maps implemented in Project Genesis shall conform to this style guide.