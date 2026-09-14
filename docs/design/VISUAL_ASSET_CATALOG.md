VISUAL ASSET CATALOG

Project: Project Genesis

Document Version: 1.0

Status: Active — Phase 4C integration complete (2026-08-05)



Phase 4C Runtime Summary

| Category | Count | Runtime |
|----------|------:|---------|
| A — Runtime (MM, BR) | 8 | `/assets/main-menu/*.png` via registry |
| B — UI Reference (DB, WM planned) | 12 | PG components |
| C — SVG Runtime (CH, WM-SVG) | 3 | public SVG + procedural SVG |
| D — Documentation | — | ADR / pipeline docs |

Registry: `apps/web/src/presentation/assets/visual-asset-registry.ts`  
Guide: `docs/development/VISUAL_ASSET_INTEGRATION_GUIDE.md`

### ICON-001 Resource Icons (Post-V1 — final PNG 2026-09-05)

Family ID: **ICON-001** (resource variants).

**Phase 1 status:** **CLOSED / PASS** (2026-09-06). Coverage review: `POST_V1_ICON_001_PHASE_1_CLOSEOUT_COVERAGE_REVIEW.md`.

**Visual status:** Final approved PNG artwork certified. Runtime 48×48 PNG/WebP derivatives generated.

**Phase 1 scope (complete):** nine certified source artworks; runtime PNG/WebP family; registry + mapping + sync; reusable `ResourceIcon`; Site Inventory; Warehouse Detail — all with external visual gates passed.

**Runtime integration (Phase 1):** Site inventory + warehouse detail rows (`PGInventoryWidget`) — consumers 1–2 (2026-09-05).

**Optional future expansion (not Phase 1):** additional resource-icon consumers require consumer-specific value and layout review. Phase 1 closure does **not** mean icons appear on all resource-related UI surfaces.

| Consumer / layer | Status |
|------------------|--------|
| Source artwork (9 PNG) | CLOSED / PASS |
| Runtime asset family (9 PNG + 9 WebP) | CLOSED / PASS |
| ResourceIcon infrastructure | CLOSED / PASS |
| Site Inventory | CLOSED / PASS |
| Warehouse Detail | CLOSED / PASS |
| Market Widget | DEFERRED — VALUE/COST NOT YET JUSTIFIED |
| MarketScreen | DEFERRED — OPTIONAL EXPANSION |
| Production, Transport, Contracts, others | OPTIONAL FUTURE EXPANSION — do not block Phase 1 |

Future consumer policy (summary): canonical `resourceId`, `ResourceIcon` reuse unchanged where possible, no asset-pipeline changes unless separately justified, consumer-local layout review, targeted tests, asset no-delta gate, runtime screenshot, external visual gate, one consumer per slice where practical. See Phase 1 documentation closeout report.

| Resource ID | Filename | Path | Status |
|-------------|----------|------|--------|
| wood | ICON-001_Wood.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| planks | ICON-001_Planks.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| stone | ICON-001_Stone.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| iron_ore | ICON-001_Iron_Ore.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| steel | ICON-001_Steel.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| machine_parts | ICON-001_Machine_Parts.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| advanced_electronics | ICON-001_Advanced_Electronics.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| industrial_machinery | ICON-001_Industrial_Machinery.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |
| consumer_goods | ICON-001_Consumer_Goods.png | docs/design/icons/ | Approved — runtime integrated (site inventory, warehouse detail) |

Runtime registry IDs: `ICON-001-<resource_id>` → `/assets/icons/ICON-001-<resource_id>.{png,webp}`

### ICON-002 Building Category Icons (Post-V1 — SVG 2026-09-09)

Family ID: **ICON-002** (BuildingCategory variants).

**Phase 1 status:** **CLOSED / PASS** (2026-09-10). Coverage review: `POST_V1_ICON_002_PHASE_1_COVERAGE_CLOSEOUT_REVIEW.md`.

**Visual status:** Six certified SVG outline glyphs (24×24, stroke 1.75, `currentColor`). Runtime inline SVG + public SVG copies via registry/sync.

**Phase 1 scope (complete):** six `BuildingCategory` identity glyphs; certification + runtime infrastructure; `BuildingCategoryIcon`; BuildingsScreen Baukatalog first consumer — desktop + narrow runtime visual gates passed.

**Granularity:** `BuildingCategory` identity — **not** individual `BuildingType` identity, building illustrations, state variants, or world-map marker art.

**Optional future expansion (not Phase 1):** additional category-icon consumers; per-building-type artwork; state-variant art; world-map-specific markers. Each requires separate value/layout review. Phase 1 closure does **not** mean category icons appear on all building-related UI surfaces.

| Consumer / layer | Status |
|------------------|--------|
| Source artwork (6 SVG) | CLOSED / PASS |
| Runtime infrastructure (inline SVG + registry + sync) | CLOSED / PASS |
| BuildingCategoryIcon | CLOSED / PASS |
| BuildingsScreen / Baukatalog | CLOSED / PASS |
| Owned-building list, detail panel, Operations | OPTIONAL / DEFERRED |
| Production views | OPTIONAL / DEFERRED |
| Market | NOT A MEANINGFUL ICON-002 TARGET |
| World map markers | SEPARATE FUTURE VISUAL PROBLEM |

| BuildingCategory | Asset ID | Source file | Status |
|------------------|----------|-------------|--------|
| PRODUCTION | ICON-002-production | ICON-002_Production.svg | Approved — runtime integrated (Baukatalog) |
| ENERGY | ICON-002-energy | ICON-002_Energy.svg | Approved — runtime integrated (Baukatalog) |
| STORAGE | ICON-002-storage | ICON-002_Storage.svg | Approved — runtime integrated (Baukatalog) |
| INFRASTRUCTURE | ICON-002-infrastructure | ICON-002_Infrastructure.svg | Approved — runtime integrated (Baukatalog) |
| ADMINISTRATION | ICON-002-administration | ICON-002_Administration.svg | Approved — runtime integrated (Baukatalog) |
| RESEARCH | ICON-002-research | ICON-002_Research.svg | Approved — runtime integrated (Baukatalog) |

Runtime registry IDs: `ICON-002-<category>` → `/assets/icons/ICON-002-<category>.svg` (inline SVG preferred for `currentColor` theming).

Implementation commits: Phase 1C `8f8315f590944edfac4eaf8fb131c1a3a5fa5ce2`; Phase 1D `f0ef49ae596880860a9dbdcc78096ec9056b5bbc` (local at closeout time).


### BR-001 Product Brand Symbol (Post-V1 — SVG 2026-09-13)

Family ID: **BR-001** (modular-industrial product mark).

**Phase 1 status:** **CLOSED / PASS** (2026-09-13). Close candidate: `POST_V1_BR_001_PHASE_1_CLOSE_CANDIDATE_REPORT.md`.

**Visual status:** Sealed SVG master `#2563EB`; three distinct L-modules; no text; transparent background.

**Phase 1 scope (complete):** authoritative source `docs/design/branding/BR-001_Logo.svg`; byte-identical runtime copy `/assets/branding/BR-001.svg`; registry migration (MM-006 alias removed); certified favicon derivative candidates (16/32 PNG); **MainMenuHome** consumer via `PGVisualAssetImage`; **browser favicon** via `metadata.icons` → `/favicon-32x32.png` only.

| Consumer / layer | Status |
|------------------|--------|
| Source SVG (sealed) | CLOSED / PASS |
| Runtime SVG copy | CLOSED / PASS |
| MainMenuHome brand mark | CLOSED / PASS |
| Browser favicon (32×32 wired) | CLOSED / PASS |
| Favicon 16×16 PNG | CERTIFIED DERIVATIVE — unwired |
| SplashScreen brand overlay | DEFERRED — MM-006 remains scenic-only splash (menu-free master installed 2026-09-13) |
| Workspace / game HUD / other menus | OUT OF PHASE 1 |

Runtime registry: `BR-001` → `/assets/branding/BR-001.svg` (`format: svg`, `preload: false`, `component: MainMenuHome`).

Per-building-type artwork, state variants, and world-map marker redesign remain **future optional visual production work** — see §6 Buildings below. They are **not** part of ICON-002 Phase 1.



Purpose

This document defines every visual asset required for Project Genesis.

The catalog serves as the master planning document for:





UI assets



Icons



Illustrations



Charts



Maps



Backgrounds



Building graphics



Research graphics



Transportation graphics



Visual effects



Marketing artwork

Every asset receives:





unique ID



category



priority



implementation status



owner



notes



Asset Status







Status



Meaning





Planned



Not started





Concept



Mockup exists





Approved



Design approved





Generated



Asset generated





Integrated



Implemented





Finished



Production ready





Priority Levels

Critical

Required for gameplay.

High

Strongly recommended.

Medium

Improves UX.

Low

Future enhancement.





1 Main Menu



Background

ID

UI-MM-001

Priority

High

Status

Approved — **menu-free replacement CLOSED / PASS** (2026-09-13)

Implementation

Complete — `MainMenuScreen` background via `PGVisualAssetBackground`; authoritative source `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-001_Main_Menu_Final.png` (1536×1024 PNG, SHA-256 `fc91ce7adfa0208daa50209ef079883641dacaf296264dc1f56fc271772f2cf5`); runtime `/assets/main-menu/MM-001.{png,webp}`. Supersedes baked English UI mock (Git history). Scenic background only — MainMenuHome + BR-001 own UI/branding.

Description

Industrial valley / skyline scenic background (UI-free).





Project Genesis Logo

ID

UI-MM-002

Priority

Critical

Status

Approved

Description

Official game logo.





Main Menu Buttons

ID

UI-MM-003

Priority

Critical

Status

Approved

Assets:

New Game

Continue

Load

Settings

Credits

Exit





2 Global UI

Application Frame

Top Bar

Sidebar

Toolbar

Window Frames

Dialogs

Notifications

Loading Screen

Progress Bars

Tooltips

Context Menus

Confirmation Dialogs

Tabs

Accordions

Cards

Scrollable Panels

Status Indicators

Badges

Empty States

Error States

Warning States

Success States





3 Dashboard Widgets

Cash Card

Profit Card

Revenue Card

Expenses Card

Production Card

Research Card

Transport Card

Market Card

Warehouse Card

Employees Card

Region Card

Power Card

Company Rating Card

AI Status Card





4 Charts

Line Chart

Area Chart

Bar Chart

Stacked Bar

Pie Chart

Donut Chart

Treemap

Heatmap

Timeline

Supply Curve

Demand Curve

Price History

Profit History

Production History

Transport Utilization

Research Progress

Regional Comparison

Company Comparison

Population Growth

Inflation

Exports

Imports

Energy Usage





5 Maps

World Map

Political Map

Economic Map

Trade Map

Transport Map

Infrastructure Map

Power Grid

Population Density

Natural Resources

Regions

Routes

Heat Maps





6 Buildings

**ICON-002 Phase 1 note (2026-09-10):** ICON-002 Phase 1 = **CLOSED / PASS** for six `BuildingCategory` identity SVG glyphs (see ICON-002 section above). The per-building artwork inventory below remains **aspirational long-term direction** for detailed building illustrations, per-type icons, and state variants — separate from, and not satisfied by, the six category glyphs.

Every building receives:

Large Illustration

Small Icon

Construction Icon

Upgrade Icon

Destroyed State

Disabled State

Operational State

Examples

Mine

Farm

Forest

Steel Mill

Machine Factory

Warehouse

Port

Airport

Rail Terminal

Distribution Center

Research Lab

University

Power Plant

Solar Plant

Wind Farm

Nuclear Plant

Corporate HQ

Regional HQ

Office

Bank

Harbor

Refinery

Chemical Plant

Electronics Factory

Vehicle Factory

Food Factory

Maintenance Facility

Training Center





7 Resources

Every resource receives:

Inventory Icon

Market Icon

Production Icon

Transport Icon

Examples

Coal

Iron Ore

Copper

Stone

Oil

Gas

Water

Steel

Glass

Concrete

Plastic

Electronics

Machine Parts

Industrial Machinery

Food

Textiles

Medicine

Fuel

Chemicals

Luxury Goods

Consumer Goods





8 Research

Research Tree

Technology Icons

Category Icons

Unlock Animations

Completed Animation

Locked State

Available State

Research Progress

Research Notifications





9 Transport

Truck

Train

Ship

Cargo Ship

Container Ship

Airplane

Cargo Plane

Locomotive

Rail Wagon

Tank Wagon

Warehouse

Container

Loading Crane

Forklift

Harbor Crane

Airport Terminal

Route Overlay

Route Arrows

Traffic Indicators





10 Company

Company Logo Placeholder

Department Icons

Finance

Operations

Research

HR

Marketing

Logistics

Board

Employee Cards

Manager Portrait Placeholder

Company Rating

Company Reputation

Corporate Hierarchy





11 Economy

Currency Icon

Supply Icon

Demand Icon

Liquidity

Inflation

Exports

Imports

Regional Economy

Market Health

Trade Balance

Contract Icons

Economic Events

Subsidies

Taxes

Interest Rates





12 World

Region Illustration

Natural Resources

Climate

Infrastructure

Education

Population

Energy

Environmental Quality

Tourism

Development Level

Regional Events





13 Notifications

Information

Success

Warning

Error

Research Completed

Construction Completed

Production Completed

Transport Delayed

Low Inventory

Market Crash

New Contract

Bankruptcy

AI Expansion





14 Scenario Art

Campaign Banner

Scenario Background

Scenario Preview

Difficulty Icons

Victory Illustration

Failure Illustration





15 Tutorial

Tutorial Highlight

Pointer

Animated Cursor

Overlay

Hint Panel

Keyboard Icons

Mouse Icons

Controller Icons (future)





16 Visual Effects

Glow

Selection

Hover

Construction

Research

Production

Transport

Explosion (future)

Fire (future)

Smoke (future)

Weather (future)





17 Animations

Button Hover

Window Open

Notification Slide

Progress Animation

Research Complete

Production Complete

Vehicle Movement

Market Pulse

Chart Animation

Loading Spinner





18 Branding

Logo

Splash Screen

Loading Screen

Steam Capsule

Store Banner

Website Banner

Social Media Header

Icon

Favicon





19 Marketing

Steam Screenshots

Trailer Frames

Key Art

Press Kit

Website Graphics

Social Cards





20 Audio-linked Visual Assets

Sound Indicators

Music Indicators

Volume Controls

Radio Indicators

Ambient Indicators





21 Debug Assets

Developer Icons

Debug Overlay

Performance Overlay

Simulation Tick Indicator

FPS Counter

AI Debug Icons

Transport Debug

Economy Debug





Asset Pipeline

Every asset follows:

Planned

↓

Concept

↓

Review

↓

Approved

↓

Generated

↓

Integrated

↓

Finished





Generation Workflow

All production-quality assets shall be generated only after:





Visual Style Guide approved.



Art Direction approved.



Screen layout finalized.



UI component finalized.

No production asset shall be generated before the corresponding UI workflow is stable.





Future Documents

This catalog is complemented by:

ART_DIRECTION.md

VISUAL_STYLE_GUIDE.md

ICON_GUIDELINES.md

CHART_GUIDELINES.md

MAP_STYLE_GUIDE.md

UI_COMPONENT_LIBRARY.md

MOCKUP_GALLERY.md

Each of these documents refines one aspect of the visual language of Project Genesis.

### UI-MM-004

ID

UI-MM-004

Status

Approved

Implementation

Complete — `SettingsPanel.tsx` (M11 Phase 2)

_Auto-added by Visual Asset Manager._

### UI-MM-006

ID

UI-MM-006

Status

Approved — **menu-free replacement CLOSED / PASS** (2026-09-13)

Implementation

Complete — `SplashScreen.tsx` (M11 Phase 2); authoritative source `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-006_Splash.png` (1536×1024 PNG, SHA-256 `568bb64cca148aa32959755619b37486999427c61bb908fc6a29eb81059a789c`); runtime `/assets/main-menu/MM-006.{png,webp}`. Supersedes baked-in menu mock artwork (Git history). Scenic background only — no embedded application UI.

_Auto-added by Visual Asset Manager._

### UI-MM-007

ID

UI-MM-007

Status

Approved — **menu-free replacement CLOSED / PASS** (2026-09-14)

Implementation

Complete — `MenuLoadingScreen.tsx` (M11 Phase 2); authoritative source `docs/design/Bilder/einzelne_bilder/hochgeladen/MM-007_Loading.png` (1536×1024 PNG, SHA-256 `c2da4be22005da95969324b46b15e7343bee75957187015bdc34c1f4c54c209e`); runtime `/assets/main-menu/MM-007.{png,webp}`. Supersedes baked loading HUD mock (Git history). Scenic background only — `LoadingState` owns loading copy.

_Auto-added by Visual Asset Manager._

### UI-DB-001

ID

UI-DB-001

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-002

ID

UI-DB-002

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-003

ID

UI-DB-003

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-004

ID

UI-DB-004

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-CH-010

ID

UI-CH-010

Status

In Production

_Auto-added by Visual Asset Manager._

### UI-MM-005

ID

UI-MM-005

Status

Approved

Implementation

Complete — `CreditsPanel.tsx` (M11 Phase 2)

_Auto-added by Visual Asset Manager._

### UI-DB-006

ID

UI-DB-006

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-007

ID

UI-DB-007

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-008

ID

UI-DB-008

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-009

ID

UI-DB-009

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-010

ID

UI-DB-010

Status

Approved

_Auto-added by Visual Asset Manager._

### UI-DB-005

ID

UI-DB-005

Status

Approved

_Auto-added by Visual Asset Manager._
