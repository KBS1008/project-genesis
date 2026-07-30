# M11 Gate 1 — UI Foundation Review Report

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Gate:** M11.1 — UI Foundation & Dashboard Implementation  
**Review date:** 2026-07-30  
**Commit audited:** `38d5a1e` (master)  
**Reference:** `docs/development/Prompts/M11_GATE_1_UI_FOUNDATION_REVIEW.md`  
**Reviewer:** Mandatory independent audit (read-only)

---

# Executive Summary

M11 Phase 1 delivers a **credible UI foundation slice**: centralized design tokens with dark-theme support, nine PG dashboard widgets aligned to DB-002–DB-010, layout primitives (status bar, inspector, dashboard grid), and a runtime-driven executive dashboard (`ExecutiveDashboardScreen`) integrated into the company route. Developer tooling (Visual Asset Manager, SVG Generator) is production-ready with security controls and test coverage.

The implementation is **not yet complete against the gate specification**. Several foundation items required by `M11_PHASE_1_UI_FOUNDATION_AND_DASHBOARD_IMPLEMENTATION.md` are missing (left navigation, global search, context menu, shared loading/error overlays). A **parallel legacy UI stack** persists (`CompanyDashboardScreen` + `apps/web/src/components/` + `dashboard.css`), creating design-system fragmentation and duplicate theme handling. Testing covers smoke paths only; accessibility, responsive, snapshot, and visual-regression tests are absent.

**Gate decision:** **PASS WITH CORRECTIONS** → **Corrections C1–C8 applied** (2026-07-30)

The executive dashboard and PG widget library are suitable as a foundation for continued M11 work, but corrections are required before treating Phase 1 as fully closed.

---

# Scope

| Area | Included |
|------|----------|
| Presentation layer | `apps/web/src/presentation/` |
| M11 Phase 1 components | `presentation/components/{foundation,layout,dashboard}/` |
| Executive dashboard | `presentation/screens/dashboard/ExecutiveDashboardScreen.tsx` |
| Design tokens & theme | `presentation/tokens/`, `presentation/theme/` |
| Application shell | `ApplicationShell`, `GameWorkspaceShell` |
| Legacy operations dashboard | `CompanyDashboardScreen`, `apps/web/src/components/` |
| Developer tooling | Visual Asset Manager, SVG Generator |
| Tests | 729 total (`pnpm test` at audit time) |
| Documentation | `UI_FOUNDATION_GUIDE.md`, implementation reports |

**Out of scope for this gate:** Main menu mockup alignment (MM-*), full `CompanyDashboardScreen` refactor, gameplay systems.

---

# Reviewed Documents

| Document | Path | Compliance summary |
|----------|------|-------------------|
| DD-039 Design System Architecture | `docs/architecture/adr/DD-039 – Design System Architecture.md` | Partial — tokens exist; not uniformly applied |
| DD-040 Visual Asset Pipeline | `docs/architecture/adr/DD-040 – Visual Asset Pipeline.md` | Compliant for VAM + SVG Generator |
| DD-041 User Experience Principles | `docs/architecture/adr/DD-041 – User Experience Principles.md` | Partial — loading/error patterns inconsistent |
| DD-042 UI Data Binding Guidelines | `docs/design/UI_DATA_BINDING_GUIDELINES.md` | Partial — KPI placeholders preserved; `playerSummary` misbound |
| DD-043 UI Text Guidelines | `docs/design/UI_TEXT_GUIDELINES.md` | Partial — hardcoded notification copy in mapper |
| DD-044 UI Layout Guidelines | `docs/design/UI_LAYOUT_GUIDELINES.md` | Partial — left nav missing; inspector always reserved |
| VISUAL_STYLE_GUIDE.md | `docs/design/VISUAL_STYLE_GUIDE.md` | Partial — legacy CSS bypasses tokens |
| UI_COMPONENT_LIBRARY.md | `docs/design/UI_COMPONENT_LIBRARY.md` | Partial — PG* subset only; many catalog components absent |
| ICON_GUIDELINES.md | `docs/design/ICON_GUIDELINES.md` | Not integrated in PG widgets |
| CHART_GUIDELINES.md | `docs/design/CHART_GUIDELINES.md` | Not integrated — no charts on executive dashboard |
| MAP_STYLE_GUIDE.md | `docs/design/MAP_STYLE_GUIDE.md` | N/A for this gate |
| VISUAL_ASSET_CATALOG.md | `docs/design/VISUAL_ASSET_CATALOG.md` | DB assets approved; not wired into React components |
| VISUAL_PRODUCTION_BACKLOG.md | `docs/design/VISUAL_PRODUCTION_BACKLOG.md` | Referenced by tooling; no runtime integration |

---

# Reviewed Components

## Application foundation

| Component | Status | Evidence |
|-----------|--------|----------|
| Application Shell | ✅ Implemented | `ApplicationShell.tsx` — ThemeProvider, notifications, dialogs, error boundary |
| Top Navigation | ✅ Implemented | `GameWorkspaceShell.tsx` workspace header; `PrimaryNavigation.tsx` horizontal tab bar |
| Left / Side Navigation | ❌ Missing | Spec requires left nav (`M11_PHASE_1…md` L159). `PrimaryNavigation` is horizontal (`navigation.css` L1–9) |
| Content Area | ✅ Implemented | `GameWorkspaceShell` `<main id="game-workspace-main">` |
| Right Inspector Panel | ⚠️ Partial | `PGInspectorPanel.tsx` — always mounted, reserves 20rem even when empty (`ExecutiveDashboardScreen.tsx` L123–141) |
| Status Bar | ✅ Implemented | `PGStatusBar.tsx`; wired in `GameWorkspaceShell.tsx` |
| Dialog System | ⚠️ Partial | `DialogProvider` + `DialogHost` — confirm-only pattern |
| Modal System | ⚠️ Partial | `SaveGameDialog.tsx` separate from dialog host |
| Notification System | ✅ Implemented | `NotificationProvider`, `NotificationHost` |
| Toast System | ✅ Implemented | `NotificationToast` in `NotificationHost.tsx` |
| Loading Overlay | ⚠️ Partial | `LoadingState` + `ScreenQueryFrame`; legacy `.loading-overlay` in `CompanyDashboardScreen.tsx` L459–465; no shared `PGLoadingOverlay` |
| Skeleton Loader | ✅ Implemented | `PGSkeleton.tsx` via `PGWidgetSurface` |
| Error Overlay | ⚠️ Partial | `PresentationErrorBoundary` only; no full-screen error overlay primitive |
| Global Search | ❌ Missing | No implementation in `apps/web/src` |
| Context Menu | ❌ Missing | No implementation in `apps/web/src` |
| Empty States | ✅ Implemented | `EmptyState` primitive + `PGWidgetSurface` |
| Dark Theme | ⚠️ Partial | `ThemeProvider` + tokens; duplicate theme logic in `CompanyDashboardScreen.tsx` L312–352 |

## PG dashboard widgets (DB-002–DB-010)

| Widget | File | Variants / states | Theme | Runtime binding |
|--------|------|-------------------|-------|-----------------|
| PGKpiCard | `PGKpiCard.tsx` | 5 tone variants; loading/empty/error via surface | Token CSS | Props from mapper; `{{availableCash}}` placeholder |
| PGStatusPanel | `PGStatusPanel.tsx` | Tone per item | Token CSS | Props from mapper |
| PGNotificationCenter | `PGNotificationCenter.tsx` | 4 tones | Token CSS | Derived notifications (partially hardcoded messages) |
| PGFinanceWidget | `PGFinanceWidget.tsx` | Table + metrics | Token CSS | Finance entries from view-data |
| PGProductionWidget | `PGProductionWidget.tsx` | Badge + table | Token CSS | Production jobs from view-data |
| PGResearchWidget | `PGResearchWidget.tsx` | Tags + table | Token CSS | Research jobs from view-data |
| PGSupplyChainWidget | `PGSupplyChainWidget.tsx` | Badge + table | Token CSS | Transport orders from view-data |
| PGCompanyWidget | `PGCompanyWidget.tsx` | Tables + metrics | Token CSS | Buildings/regions from query |
| PGReportWidget | `PGReportWidget.tsx` | Action list | Token CSS | Static action metadata in mapper |

All nine required widgets exist and are composed in `ExecutiveDashboardScreen.tsx`.

---

# Architecture

## Strengths

- **DD-038 presentation layering preserved:** API DTOs → mappers → immutable view-data → screens (`executive-dashboard-view-mappers.ts`, `GameWorkspaceProvider`).
- **Widget composition:** Executive dashboard built from reusable PG components, not bespoke layout markup.
- **Developer tooling integration:** SVG Generator delegates to Visual Asset Manager for path/revision/catalog logic (no duplicated pipeline code).

## Findings

### MAJ-01 — Dual dashboard architecture (legacy split)

**Evidence:**
- Executive path: `CompanyOverviewScreen.tsx` → `ExecutiveDashboardScreen.tsx` → PG widgets.
- Operations path: `CompanyScreen.tsx` L31–38 → `CompanyDashboardScreen.tsx` (~1,100 lines).
- Legacy imports: `CompanyDashboardScreen.tsx` L18–28 imports from `apps/web/src/components/`.
- Global CSS loads both systems: `globals.css` imports presentation CSS **and** `dashboard.css` L7.

**Impact:** Two styling systems, two theme handlers, inconsistent UX between company overview and operations.

### MAJ-02 — Inspector column always reserved

**Evidence:** `ExecutiveDashboardScreen.tsx` L123–141 always passes `inspector={...}` to `PGWorkspaceFrame`, including empty `<PGInspectorPanel />`. `PGDashboardGrid.tsx` L34 applies `pg-workspace-frame-with-inspector` whenever `inspector !== undefined`, reserving `--inspector-width: 20rem` (`design-tokens.css` L91).

**Impact:** ~20rem horizontal space wasted at desktop widths (1366–1920); conflicts with DD-044 optional inspector semantics.

### MAJ-03 — Duplicate theme management

**Evidence:**
- Canonical: `ThemeProvider.tsx` + `GameWorkspaceShell` toggle (L163–165).
- Duplicate: `CompanyDashboardScreen.tsx` L312–352 — own `useState`, `localStorage('pg-theme')`, `document.documentElement.dataset.theme`.

**Impact:** Theme can desync when switching between executive and operations dashboards.

### MIN-01 — `components/` not migrated

14 legacy files under `apps/web/src/components/` (charts, tables, tutorial) remain outside `presentation/`. Documented as remaining risk in `M11_PHASE1_IMPLEMENTATION_REPORT.md`.

---

# Design System

## Strengths

- `design-tokens.css` centralizes brand, semantic, spacing, typography, elevation, breakpoints, animation, and icon-size tokens.
- Dark palette defined under `html[data-theme='dark']` (L124–142).
- New widget CSS (`dashboard-components.css`, `layout-components.css`) predominantly uses `var(--*)` tokens.

## Findings

### MAJ-04 — Hardcoded colors outside token system

| File | Line(s) | Value |
|------|---------|-------|
| `navigation.css` | 67 | `color: #fff` |
| `navigation.css` | 28–29, 38–39, 119, 139, 175, 239 | `rgba(...)` literals |
| `primitives.css` | 43 | `#fff` on primary button |
| `primitives.css` | 115–130 | rgba status banner backgrounds |
| `CompanyDashboardScreen.tsx` | 510, 546 | inline `rgba(245, 158, 11, 0.45)` |

**Violation:** Gate token review requires no hardcoded color values.

### MIN-02 — Breakpoint tokens not used in media queries

`design-tokens.css` defines `--breakpoint-lg: 1024px` but `layout-components.css` L150 uses literal `1024px`.

### MIN-03 — Hardcoded dimensions in new CSS

`dashboard-components.css`: `min-height: 6.5rem` (L49), `minmax(11rem, 1fr)` (L237), `letter-spacing: 0.04em` (L57).

### MIN-04 — PG naming vs primitive naming

Spec (`UI_COMPONENT_LIBRARY.md`) defines `PGButton`, `PGCard`; implementation uses `Button`, `Card` in `primitives/` without PG prefix aliases.

---

# Dashboard

## Strengths

- Executive dashboard renders all nine PG widgets with runtime view-data.
- KPI strip maps from `companyViewData.kpis` with DD-042 placeholder preservation (`executive-dashboard-view-mappers.ts` L50, L58).
- Tab navigation between executive and operations views.

## Findings

### MAJ-05 — Charts not on executive dashboard

Gate Step 6 and `CHART_GUIDELINES.md` expect chart widgets. `ExecutiveDashboardScreen` has no chart components; charts exist only in legacy `components/TickHistoryCharts.tsx` used by `CompanyDashboardScreen`.

### MAJ-06 — Notification messages partially hardcoded

**Evidence:** `executive-dashboard-view-mappers.ts` L105–123 builds notifications with fixed German strings (`'Energiedefizit'`, `'Steuerzahlung blockiert'`) rather than runtime alert objects from the simulation layer.

### MIN-05 — `playerSummary` misbound

**Evidence:** `executive-dashboard-view-mappers.ts` L196:
```typescript
playerSummary: companyViewData.companyName ?? 'Spieler',
```
Uses company name instead of a distinct player name field. Violates DD-042 placeholder intent (`{{playerName}}`).

### MIN-06 — Gameplay fallbacks in legacy dashboard

**Evidence:** `CompanyDashboardScreen.tsx` L733 — `?? '5 %'` corporate tax fallback when economy data is null.

---

# Runtime Binding

| Check | Result | Evidence |
|-------|--------|----------|
| No hardcoded company names in PG widgets | ✅ Pass | Widgets accept props only |
| No hardcoded numeric gameplay values in PG widgets | ✅ Pass | Values from mapper props |
| KPI placeholders preserved | ✅ Pass | `{{availableCash}}`, `{{energyReserve}}` in mapper |
| Player name binding | ❌ Fail | `playerSummary` uses `companyName` (L196) |
| Alert/notification binding | ⚠️ Partial | Derived from flags but messages are static strings |
| Report actions | ⚠️ Partial | Static navigation metadata in mapper (acceptable for UI chrome) |

---

# Accessibility

## Strengths

- Skip link in `GameWorkspaceShell.tsx` L178–180.
- Widget sections use `aria-labelledby` (e.g. `PGFinanceWidget.tsx` L27–28).
- KPI cards use `aria-label` (`PGKpiCard.tsx` L30).
- Status bar `role="contentinfo"` (`PGStatusBar.tsx` L16).
- Modal focus trap in `useModalAccessibility.ts`.
- Primary navigation keyboard support tested (`PrimaryNavigation.test.tsx`).
- `prefers-reduced-motion` respected in `design-tokens.css` L144–149.

## Findings

### MAJ-07 — Duplicate accessible names on report actions

**Evidence:** `PGReportWidget.tsx` L45–47 — every action button labeled `"Öffnen"`. Screen readers cannot distinguish actions. Test at `dashboard-components.test.tsx` L53 reinforces this pattern.

### MAJ-08 — Invalid definition list markup

**Evidence:** `PGInspectorPanel.tsx` L54–60 — `<dl>` contains `<div>` wrappers instead of direct `<dt>/<dd>` children.

### MIN-07 — Static widget heading IDs

Multiple widgets use fixed IDs (`pg-status-panel-title`, `pg-finance-widget-title`). Duplicate if multiple instances render.

### MIN-08 — `<time>` without `dateTime`

`PGNotificationCenter.tsx` L42–44.

### MIN-09 — Touch targets below 44px

`navigation.css` L14 — `min-height: 2.25rem` (36px) on nav buttons.

### MIN-10 — Legacy loading overlay hides busy state

`CompanyDashboardScreen.tsx` L460 — `aria-hidden="true"` on loading overlay.

---

# Performance

| Check | Result | Notes |
|-------|--------|-------|
| Widget render purity | ✅ | Presentational components; no fetch in widgets |
| Memoization | ✅ | `useMemo` in `ExecutiveDashboardScreen` for dashboard/inspector |
| Debounced queries | ✅ | `useScreenQuery` with debounce |
| Unnecessary re-renders | ⚠️ | No `React.memo` on widgets — acceptable at current scale |
| Bundle / CSS weight | ⚠️ | Full `dashboard.css` (~1,400 lines) loaded globally alongside new CSS |
| Code splitting | ❌ | No `lazy()` / dynamic imports for screens or widgets |
| Charts on executive view | N/A | Not implemented — reduces render cost but misses spec |

---

# Security

## Visual Asset Manager

| Control | Status | Evidence |
|---------|--------|----------|
| DevOnlyGuard | ✅ | `dev-only.guard.ts` |
| Server-side path resolution | ✅ | `visual-asset-manager/constants.ts` |
| SHA-256 duplicate detection | ✅ | `VisualAssetManagerService` |
| No path traversal from client | ✅ | Filename from backlog only |

## SVG Generator

| Control | Status | Evidence |
|---------|--------|----------|
| Element allowlist | ✅ | `validator.ts` |
| Script/foreignObject rejection | ✅ | `validator.ts` L138, L157–158 |
| Event handler rejection | ✅ | Integration security tests |
| No remote URLs | ✅ | Validator remote reference check |
| DevOnlyGuard on API | ✅ | `svg-generator.controller.ts` |

## Presentation layer

| Control | Status | Evidence |
|---------|--------|----------|
| No `dangerouslySetInnerHTML` in PG widgets | ✅ | Text content only |
| SVG preview in dev tool | ⚠️ | `SvgGeneratorScreen` uses `dangerouslySetInnerHTML` for preview — dev-only route |

**Security score is high; no critical findings.**

---

# Testing

| Category | Required | Present | Gap |
|----------|----------|---------|-----|
| Unit tests | Yes | 12+ svg-generator, mapper, widget partial | 4 widgets untested individually |
| Component tests | Yes | `dashboard-components.test.tsx` (5 cases) | PGFinance, PGProduction, PGResearch, PGSupplyChain, PGCompany, PGInspector untested |
| Integration tests | Yes | SVG generator integration; executive screen smoke | No shell integration test |
| Snapshot tests | Yes | SVG generator snapshots only | **No UI component snapshots** |
| Accessibility tests | Yes | None | **No axe / a11y automation** |
| Responsive tests | Yes | None | **No viewport tests** |
| Theme tests | Yes | `ThemeProvider.test.tsx` (toggle) | No contrast/token regression |
| Visual regression | Yes | None | **Missing** |
| CompanyDashboardScreen | — | None | Legacy screen untested |

**Total repository tests at audit:** 729 passing.

---

# Documentation

| Document | Status | Finding |
|----------|--------|---------|
| `UI_FOUNDATION_GUIDE.md` | ✅ Present | Accurate for delivered scope |
| `SVG_GENERATOR_GUIDE.md` | ✅ Present | Complete operator guide |
| `M11_PHASE1_IMPLEMENTATION_REPORT.md` | ✅ Present | Claims "no hardcoded values" — **overstated** |
| `M11_SVG_GENERATOR_IMPLEMENTATION_REPORT.md` | ✅ Present | Accurate |
| `IMPLEMENTATION_PROGRESS.md` | ✅ Updated | UI Foundation at 100% — **overstates gate completeness** |
| Per-component API docs | ❌ Missing | Only guide table; no JSDoc on public widget props |
| Gate review report | ✅ This document | — |

---

# Code Quality

| Principle | Assessment |
|-----------|------------|
| SOLID | Good separation in new code; `CompanyDashboardScreen` violates SRP |
| DRY | Violated — dual theme logic, dual CSS systems, parallel dashboard paths |
| KISS | PG widgets are simple; legacy screen is complex |
| YAGNI | Report actions static in mapper — acceptable |
| Dependency injection | NestJS dev services use constructor injection; React uses context |
| Folder structure | Clear `presentation/components/{foundation,layout,dashboard}` |
| Naming | Consistent PG prefix on new widgets; primitives omit PG prefix |
| Types | Fully typed view-data and widget props |
| Error handling | `ScreenQueryFrame` + `PGWidgetSurface` error states |
| Maintainability | **Risk** from legacy split; new code is maintainable |

---

# Risks

| ID | Risk | Likelihood | Impact |
|----|------|------------|--------|
| R1 | Design drift between executive and operations dashboards | High | High |
| R2 | Theme desync between screens | Medium | Medium |
| R3 | Accessibility regressions undetected without automated a11y tests | High | Medium |
| R4 | Layout breakage at 1366px due to reserved inspector column | Medium | Medium |
| R5 | `IMPLEMENTATION_PROGRESS` overclaim slows gate tracking | Low | Medium |
| R6 | Chart/icon guidelines not integrated into PG components | Medium | Medium |

---

# Required Corrections

## Before gate closure (major)

| ID | Correction | Status |
|----|------------|--------|
| C1 | Pass `inspector` to `PGWorkspaceFrame` only when `inspectorDetail !== null` | ✅ Fixed (`ExecutiveDashboardScreen.tsx`) |
| C2 | Unify theme — remove duplicate logic from `CompanyDashboardScreen`; use `useTheme()` | ✅ Fixed |
| C3 | Fix `PGReportWidget` accessible names — include action label in `aria-label` | ✅ Fixed |
| C4 | Implement or formally defer with ADR: left navigation, global search, context menu | ✅ Deferred — `DD-045` |
| C5 | Migrate hardcoded `#fff` / `rgba` in `navigation.css`, `primitives.css` to semantic tokens | ✅ Fixed |
| C6 | Bind `playerSummary` to actual player/session name field | ✅ Fixed — uses `session.playerId` |
| C7 | Add accessibility test suite (minimum: axe on widget components) | ✅ Fixed — `dashboard-components.a11y.test.tsx` |
| C8 | Fix `<dl>` structure in `PGInspectorPanel.tsx` | ✅ Fixed |

## Recommended (minor)

| ID | Correction |
|----|------------|
| C9 | Use `var(--breakpoint-*)` in media queries |
| C10 | Add `dateTime` to notification timestamps |
| C11 | Remove gameplay fallbacks (`'5 %'`) from `CompanyDashboardScreen.tsx` L733 |
| C12 | Add snapshot tests for PG widgets |
| C13 | Add responsive layout tests at 1920/1600/1440/1366 viewports |
| C14 | Integrate charts on executive dashboard per CHART_GUIDELINES |
| C15 | Update `IMPLEMENTATION_PROGRESS.md` to reflect gate findings (~70–80% not 100%) |

---

# Recommendations

1. **Phase 1.1 sprint:** Address C1–C8 before starting main-menu mockup work (M11 Phase 2).
2. **Incremental legacy migration:** Refactor `CompanyDashboardScreen` sections to PG widgets one panel at a time.
3. **Visual regression:** Add Playwright or Chromatic snapshots against DB mockups in `docs/design/Mockups/dashboard/`.
4. **Token audit script:** CI check for `#` and `rgba(` literals outside `design-tokens.css`.
5. **Chart integration:** Wire `TickHistoryCharts` or new `PGChart` into executive dashboard using view-data mappers.

---

# Scoring

| Category | Score | Rationale |
|----------|------:|-----------|
| Architecture | 68 | Clean new layering; legacy split and dual dashboards |
| Design | 62 | Tokens centralized; hardcoded colors remain; left nav missing |
| Implementation | 70 | 9/9 widgets + shell; missing search, context menu, overlays |
| Performance | 78 | Sound patterns; dual CSS load; no code splitting |
| Accessibility | 55 | Good baseline; duplicate button names, invalid DL, no a11y tests |
| Security | 88 | VAM + SVG Generator well guarded; dev-only preview acceptable |
| Maintainability | 60 | Two CSS systems; 1,100-line legacy screen |
| Testing | 42 | 9 Phase 1 tests; major gaps in a11y/responsive/visual |
| Documentation | 72 | Guides exist; progress reports overclaim |

**Overall score: 66 / 100** (unweighted arithmetic mean of nine categories)

---

# Gate Decision

**PASS WITH CORRECTIONS**

The M11 Phase 1 deliverable provides a usable PG widget library, executive dashboard, design-token foundation, and developer asset pipeline. It does **not** fully satisfy the gate checklist for application shell completeness, unified design system enforcement, comprehensive testing, or responsive verification. Corrections C1–C8 should be completed before declaring M11 Phase 1 formally closed.

---

M11 GATE 1 PASSED
