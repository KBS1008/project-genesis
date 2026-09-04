# VISUAL PRODUCTION BACKLOG

**Project:** Project Genesis

**Document Version:** 2.0

**Status:** Active

**Milestone:** M11 – Visual Production & User Experience

**Owner:** Project Genesis Team

---

# Purpose

This document is the master production backlog for every visual asset of
Project Genesis.

It serves as the authoritative production plan for:

- UI Mockups
- Icons
- Maps
- Charts
- Illustrations
- Branding
- Marketing Assets
- Steam Assets

Every visual asset shall be tracked here.

---

# Production Philosophy

Unlike software development, visual assets are not implemented in multiple
planned versions.

Every asset represents one production target.

The default workflow is:

```text
Planned

↓

Production

↓

Review

↓

Approved

↓

Integrated
```

Only when changes are requested after review shall a revision be created.

Example:

MM-001_Main_Menu.png

↓

MM-001_Main_Menu_Rev1.png

↓

MM-001_Main_Menu_Rev2.png

There are no predefined v1 / v2 / Final stages.

---

# Status Legend

| Status | Meaning |
|----------|----------|
| ☐ | Planned |
| ◐ | In Production |
| 👀 | In Review |
| ☑ | Approved |
| 🚀 | Integrated |

---

# Production Rules

Every asset shall have:

- unique identifier
- unique filename
- unique storage location
- review status
- integration status

Every approved asset becomes the production reference.

---

# Naming Convention

Format:

<AREA>-<NUMBER>_<DESCRIPTION>.png

Examples:

MM-001_Main_Menu.png

MM-002_New_Game_Dialog.png

DB-001_Executive_Dashboard.png

WM-001_World_Map.png

Revision example:

MM-001_Main_Menu_Rev1.png

---

# Repository Structure

docs/
└── design/
    ├── mockups/
    ├── icons/
    ├── charts/
    ├── maps/
    ├── illustrations/
    └── branding/

---

# Sprint 1 — Main Menu

## Main Menu

🚀 MM-001_Main_Menu.png — runtime background `/assets/main-menu/MM-001.png`

---

## New Game

🚀 MM-002_New_Game_Dialog.png — registry reference + synced runtime copy

---

## Load Game

🚀 MM-003_Load_Game.png — registry reference + synced runtime copy

---

## Settings

🚀 MM-004_Settings.png — registry reference + synced runtime copy

---

## Credits

🚀 MM-005_Credits.png — registry reference + synced runtime copy

---

## Splash Screen

🚀 MM-006_Splash.png — runtime splash background

---

## Loading Screen

🚀 MM-007_Loading.png — runtime loading background

---

# Sprint 2 — Dashboard

☑ DB-001_Executive_Dashboard.png — PG reference (`ExecutiveDashboardScreen`)

☑ DB-002_KPI_Cards.png — PG reference (`PGKpiCard`)

☑ DB-003_Status_Panel.png — PG reference (`PGStatusPanel`)

☑ DB-004_Notifications.png — PG reference (`PGNotificationCenter`)

☑ DB-005_Finance_Widget.png — PG reference (`PGFinanceWidget`)

☑ DB-006_Production_Widget.png — PG reference (`PGProductionWidget`)

☑ DB-007_Research_Widget.png — PG reference (`PGResearchWidget`)

☑ DB-008_Transport_Widget.png — PG reference (`PGSupplyChainWidget`)

☑ DB-009_Company_Overview.png — PG reference (`PGCompanyWidget`)

☑ DB-010_Dashboard.png — PG reference (`PGReportWidget`)

---

# Sprint 3 — World

☐ WM-001_World_Map.png

☐ WM-002_Region_View.png

☐ WM-003_Trade_Overlay.png

☐ WM-004_Resource_Overlay.png

☐ WM-005_Population_Overlay.png

☐ WM-006_Infrastructure_Overlay.png

☐ WM-007_Climate_Overlay.png

☐ WM-008_Selection.png

☐ WM-009_Inspector.png

☐ WM-010_World.png

---

# Sprint 4 — Production

☐ PR-001_Production_Overview.png

☐ PR-002_Factory.png

☐ PR-003_Recipe.png

☐ PR-004_Inventory.png

☐ PR-005_Warehouse.png

☐ PR-006_Build_Queue.png

☐ PR-007_Construction.png

☐ PR-008_Analytics.png

☐ PR-009_Efficiency.png

☐ PR-010_Production.png

---

# Sprint 5 — Research

☐ RS-001_Tech_Tree.png

☐ RS-002_Research_Card.png

☐ RS-003_Queue.png

☐ RS-004_Technology_Details.png

☐ RS-005_Blueprint.png

☐ RS-006_Unlock.png

☐ RS-007_Research.png

---

# Sprint 6 — Economy

☐ EC-001_Market.png

☐ EC-002_Contracts.png

☐ EC-003_Finance.png

☐ EC-004_Cash_Flow.png

☐ EC-005_Price_Chart.png

☐ EC-006_Trade.png

☐ EC-007_Comparison.png

☐ EC-008_Reports.png

☐ EC-009_Economy.png

---

# Sprint 7 — Logistics

☐ TR-001_Transport.png

☐ TR-002_Warehouse.png

☐ TR-003_Routes.png

☐ TR-004_Vehicles.png

☐ TR-005_Traffic.png

☐ TR-006_Distribution.png

☐ TR-007_Logistics.png

---

# Sprint 8 — Company

☐ CP-001_Company.png

☐ CP-002_Departments.png

☐ CP-003_Employees.png

☐ CP-004_Managers.png

☐ CP-005_Statistics.png

☐ CP-006_Company.png

---

# Sprint 9 — Reports

☐ RP-001_Report_Center.png

☐ RP-002_Finance_Report.png

☐ RP-003_Production_Report.png

☐ RP-004_Research_Report.png

☐ RP-005_Transport_Report.png

☐ RP-006_Economy_Report.png

☐ RP-007_Company_Report.png

☐ RP-008_Reports.png

---

# Sprint 10 — Charts

☐ CH-001_Cashflow.svg

☐ CH-002_Profit.svg

☐ CH-003_Revenue.svg

☐ CH-004_Production.svg

☐ CH-005_Research.svg

☐ CH-006_Transport.svg

☐ CH-007_Market.svg

☐ CH-008_Population.svg

☐ CH-009_Energy.svg

◐ CH-010_Charts.svg

---

# Sprint 11 — Maps

☐ MAP-001_Political.png

☐ MAP-002_Resources.png

☐ MAP-003_Trade.png

☐ MAP-004_Infrastructure.png

☐ MAP-005_Energy.png

☐ MAP-006_Climate.png

☐ MAP-007_Industry.png

☐ MAP-008_Maps.png

---

# Sprint 12 — Icons

☑ ICON-001_Resources.svg — **family produced** (9 resource variants in `docs/design/icons/ICON-001_*.svg`, post-V1 2026-09-04)

Resource variants: Wood, Planks, Stone, Iron_Ore, Steel, Machine_Parts, Advanced_Electronics, Industrial_Machinery, Consumer_Goods

☐ ICON-002_Buildings.svg

☐ ICON-003_Transport.svg

☐ ICON-004_Economy.svg

☐ ICON-005_Research.svg

☐ ICON-006_UI.svg

☐ ICON-007_Notifications.svg

☐ ICON-008_Status.svg

☐ ICON-009_Menu.svg

☐ ICON-010_Icons.svg

---

# Sprint 13 — Branding

☐ BR-001_Logo.png

☐ BR-002_Splash.png

☐ BR-003_Loading.png

☐ BR-004_Backgrounds.png

☐ BR-005_Main_Illustration.png

☐ BR-006_Steam_Capsule.png

☐ BR-007_Header.png

☐ BR-008_Website.png

☐ BR-009_Press_Kit.png

☐ BR-010_Branding.png

---

# Sprint 14 — Marketing

☐ MK-001_Screenshot_Set.png

☐ MK-002_Trailer_Scenes.png

☐ MK-003_Website.png

☐ MK-004_Steam.png

☐ MK-005_Store_Banners.png

☐ MK-006_Press_Images.png

☐ MK-007_Key_Art.png

☐ MK-008_Marketing.png

---

# Asset Documentation

Every completed asset shall be documented with:

Asset ID

Filename

Storage Path

Status

Review Date

Revision Count

---

Example

Asset ID:
MM-001

Filename:
MM-001_Main_Menu.png

Storage:

docs/design/mockups/main-menu/

Status:

☑ Approved

Revision Count:

0

---

# Review Criteria

Every asset must pass:

✓ Design Review

✓ UX Review

✓ Accessibility Review

✓ Naming Validation

✓ Visual Consistency Review

✓ Integration Review

---

# Completion Criteria

The Visual Production Backlog is complete when:

- every asset is approved
- every asset is integrated
- all placeholder graphics are replaced
- the implementation matches the approved mockups
- DD-039, DD-040 and DD-041 are fully reflected in the final product

This document shall be maintained throughout Milestone M11 and serves as the
single source of truth for visual production.