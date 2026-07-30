# UI Foundation Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 1 — UI Foundation & Executive Dashboard  
**Audience:** Frontend developers working on presentation layer screens

---

## Overview

M11 Phase 1 establishes the production UI foundation for Project Genesis:

- centralized design tokens (light + dark theme)
- reusable layout primitives (status bar, inspector, dashboard grid)
- nine dashboard widgets aligned to DB-001–DB-010 mockups
- executive dashboard assembled from widgets with runtime view-data binding

All gameplay screens should compose from these components — no screen-local styling or duplicated widget logic.

---

## Architecture

```text
GameWorkspaceShell
  ├── WorkspaceHeader + PrimaryNavigation
  ├── ScreenRouter
  │     └── CompanyScreen
  │           ├── ExecutiveDashboardScreen (default)
  │           └── CompanyDashboardScreen (operations)
  └── PGStatusBar

ExecutiveDashboardScreen
  → buildExecutiveDashboardViewData()
  → PG* widgets
  → PGInspectorPanel (entity selection)
```

Data flow follows DD-038 Presentation Architecture:

1. API DTOs loaded in `GameWorkspaceProvider`
2. Mappers build immutable view-data
3. Screens render view-data only (no domain types in JSX)

---

## Folder structure

| Path | Purpose |
|------|---------|
| `presentation/tokens/design-tokens.css` | Color, spacing, typography, elevation, breakpoints |
| `presentation/theme/` | `ThemeProvider`, `useTheme` |
| `presentation/components/foundation/` | `PGSkeleton`, `PGWidgetSurface` |
| `presentation/components/layout/` | `PGStatusBar`, `PGInspectorPanel`, `PGDashboardGrid` |
| `presentation/components/dashboard/` | DB-aligned widgets (`PGKpiCard`, …) |
| `presentation/screens/dashboard/` | `ExecutiveDashboardScreen` |
| `presentation/adapters/view-data/executive-dashboard-view-data.ts` | Executive dashboard types |
| `presentation/adapters/mappers/executive-dashboard-view-mappers.ts` | Dashboard mapper |

---

## Design tokens

All styling must use CSS custom properties from `design-tokens.css`.

| Group | Examples |
|-------|----------|
| Colors | `--color-primary`, `--color-success`, `--danger` |
| Typography | `--text-h1`, `--text-body`, `--font-ui` |
| Spacing | `--space-xs` … `--space-2xl` |
| Radius | `--radius-sm`, `--radius-md`, `--radius-lg` |
| Elevation | `--elevation-1` … `--elevation-4` |
| Layout | `--inspector-width`, `--status-bar-height`, `--grid-gap` |
| Breakpoints | `--breakpoint-sm` … `--breakpoint-xl` |
| Animation | `--duration-fast`, `--ease-standard` |
| Icons | `--icon-sm` … `--icon-xl` |

Dark theme: `html[data-theme='dark']` (managed by `ThemeProvider`).

---

## Theme usage

```tsx
import { useTheme } from '@/presentation/theme';

const { theme, setTheme, toggleTheme } = useTheme();
```

Theme is initialized from `localStorage('pg-theme')` in `app/layout.tsx` before hydration.

---

## Dashboard widgets

| Component | Mockup | Purpose |
|-----------|--------|---------|
| `PGKpiCard` | DB-002 | KPI metrics with variants and placeholders |
| `PGStatusPanel` | DB-003 | Session and economy status rows |
| `PGNotificationCenter` | DB-004 | Alerts and system notifications |
| `PGFinanceWidget` | DB-005 | Finance summary + recent transactions |
| `PGProductionWidget` | DB-006 | Active production jobs |
| `PGResearchWidget` | DB-007 | Research jobs + completed tech tags |
| `PGSupplyChainWidget` | DB-008 | Transport orders |
| `PGCompanyWidget` | DB-009 | Company summary, buildings, regions |
| `PGReportWidget` | DB-010 | Quick actions and report hints |

Every widget supports:

- `state`: `idle` | `loading` | `empty` | `error`
- accessibility labels and semantic structure
- token-based styling (no hardcoded colors)

---

## Runtime data binding (DD-042)

View-data is built server-side or from workspace queries — never hardcoded in components.

Example KPI placeholder preservation:

```typescript
{
  label: 'Verfügbare Mittel',
  value: kpis.availableCashLabel,
  placeholder: '{{availableCash}}',
}
```

Placeholders document runtime binding targets; values come from `CompanyDashboardViewData`.

---

## Executive dashboard

Route: `screen=company` (default view)

Open operations dashboard via **Operatives Dashboard** tab → `CompanyDashboardScreen`.

Inspector panel opens when an entity is selected via navigation (`entitySelection`).

---

## Layout components

### PGStatusBar

Bottom workspace footer with session tick, cash, and theme toggle.

### PGInspectorPanel

Right column inspector for selected entities (building, production, transport, research, employee).

### PGDashboardGrid / PGDashboardGridItem

12-column responsive grid (`span` 3, 4, 6, 8, 12). Collapses to single column below 1024px.

### PGWorkspaceFrame

Main content + optional inspector column.

---

## Testing

| Suite | Location |
|-------|----------|
| Widget tests | `presentation/components/dashboard/dashboard-components.test.tsx` |
| Mapper tests | `presentation/adapters/mappers/executive-dashboard-view-mappers.test.ts` |
| Screen tests | `presentation/screens/dashboard/ExecutiveDashboardScreen.test.tsx` |
| Theme tests | `presentation/theme/ThemeProvider.test.tsx` |

Run:

```bash
pnpm test -- apps/web/src/presentation/components/dashboard apps/web/src/presentation/screens/dashboard
```

---

## Related documents

- `docs/development/M11_PHASE_1_UI_FOUNDATION_AND_DASHBOARD_IMPLEMENTATION.md`
- `docs/design/UI_COMPONENT_LIBRARY.md`
- `docs/design/UI_DATA_BINDING_GUIDELINES.md`
- `docs/architecture/reviews/M11_PHASE1_IMPLEMENTATION_REPORT.md`
