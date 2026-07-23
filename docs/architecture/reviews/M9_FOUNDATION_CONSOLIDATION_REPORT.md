# M9 Foundation Consolidation Report

**Project:** Project Genesis  
**Milestone:** M9 – User Interface  
**Scope:** Mandatory foundation consolidation after Gate 1 Review  
**Date:** 2026-07-23  
**Verdict:** **READY FOR GATE 1 DELTA REVIEW**

---

# Executive Summary

The M9 foundation consolidation addressed all blocking findings from `M9_IMPLEMENTATION_GATE_1_REPORT.md`. The legacy `DashboardShell` no longer owns session loading, WebSocket subscription, or local notification state. A single authoritative workspace session flows through `GameWorkspaceProvider`, with immutable `CompanyDashboardViewData` consumed by presentation components. Formatting is centralized in `presentation/formatting/presentation-formatters.ts`. The Buildings screen uses the dedicated `/api/buildings` query.

All **588** tests pass. Typecheck passes for root, API, and web packages. Presentation dependency rules remain clean (no repository/domain/simulation imports in React components).

---

# DashboardShell Migration

| Before | After |
| ------ | ----- |
| ~1,586-line monolith in `apps/web/src/components/` | Composition root `CompanyDashboardScreen` in `presentation/screens/company/` |
| Direct `GameSessionDashboard` DTO consumption | `companyViewData` from workspace context |
| Local `fetchDashboard` + tick history | Authoritative `loadWorkspaceQueries()` in provider |
| Local Toast notifications | Global `NotificationProvider` via `runCommand` |
| Inline formatters (15+ functions) | Centralized `presentation-formatters.ts` + mappers |

`apps/web/src/components/DashboardShell.tsx` is now a thin deprecated re-export for backward compatibility. `ScreenRouter` routes the company screen through `CompanyDashboardScreen`.

Presentation subcomponents remain co-located in `CompanyDashboardScreen.tsx` (KpiStrip, OverviewStrip, SidebarActions, etc.) but consume view-data only — no DTO formatting inside components.

`CompanyDetailPanel` replaces direct `DashboardDetailPanel` + DTO usage for entity drill-down.

---

# Session State Consolidation

**Single authoritative session** is provided by `GameWorkspaceProvider`:

| State | Owner |
| ----- | ----- |
| Session dashboard snapshot (internal) | `GameWorkspaceProvider` via `loadWorkspaceQueries()` |
| `WorkspaceViewData` | Mapped once in query loader |
| `CompanyDashboardViewData` | Mapped once via `buildCompanyDashboardViewData()` |
| Tick chart history | Included in workspace query result |
| `isLoading`, `isBusy`, `isLiveConnected` | Provider only |
| Navigation (URL-backed) | Provider + `navigation-state.ts` |

**Removed from CompanyDashboardScreen:**
- `useState` for dashboard / tickHistory
- `fetchDashboard()` / `fetchDashboardHistory()` effects
- `connectDashboardSocket()` subscription
- Duplicate refresh logic

**Public context API** no longer exposes raw `dashboard` DTO. Consumers use `viewData`, `companyViewData`, and `runCommand`.

---

# Notification Consolidation

| Before | After |
| ------ | ----- |
| Global `NotificationProvider` + local `Toast` in DashboardShell | Single `NotificationProvider` pipeline |
| Local `statusMessage` / `statusTone` state | `showNotification()` in `runCommand` |
| Silent socket refresh errors in DashboardShell | Provider socket refresh with `translatePresentationError` |

Commands (session, simulation, building, market, etc.) notify through `runCommand(action, successMessage)` which shows info → success/error notifications.

---

# ViewData Migration

New view-data layer for the company screen:

| File | Purpose |
| ---- | ------- |
| `presentation/adapters/view-data/company-dashboard-view-data.ts` | Immutable types (KPI, tables, hints, detail maps) |
| `presentation/adapters/mappers/company-dashboard-view-mappers.ts` | DTO → view-data mapping (single transformation point) |
| `presentation/formatting/presentation-formatters.ts` | Currency, resource, date, tick, progress, transport, transaction formatting |

**Migrated consumers:**
- `CompanyDashboardScreen` — all tables, charts, KPIs, sidebar hints
- `CompanyDetailPanel` — entity drill-down via pre-mapped detail entries
- `QueryScreens` (Markets, Production, Research) — label resolver from `companyViewData.labels`
- `GameWorkspaceShell` — available cash from `companyViewData.kpis`
- `workspace-view-mappers` — finance rows use centralized transaction formatters

**Remaining legacy (acceptable for consolidation scope):**
- Chart components in `apps/web/src/components/` still accept structurally compatible point/price shapes mapped at the presentation boundary
- `DashboardDetailPanel.tsx` in components/ is unused by the company screen; retained for reference only

---

# Query Layer Verification

| Screen | Endpoint | Status |
| ------ | -------- | ------ |
| Session / simulation / world / saves | Phase 3 GET routes | ✅ Via `loadWorkspaceQueries()` |
| Markets | `/api/markets/prices` | ✅ |
| Production | `/api/production/jobs` | ✅ |
| Research | `/api/research/jobs` | ✅ |
| Transport | `/api/transport/orders` | ✅ |
| Finance | `/api/finance/transactions` | ✅ |
| **Buildings** | **`/api/buildings`** | ✅ **Fixed** — was dashboard aggregate |
| Company dashboard tables | Mapped from dashboard snapshot in loader | ✅ Single loader, view-data at boundary |

Buildings query added: `fetchBuildingList()` in `query-client.ts`.

---

# Dependency Verification

Automated test `tests/architecture/presentation-dependency-rules.test.ts` passes.

Verified: React components under `apps/web/src/presentation/` do **not** import:
- repositories
- aggregates
- simulation
- infrastructure

`CompanyDashboardScreen` imports only presentation adapters, view-data, formatting, legacy chart/table components (allowed presentation boundary), and `callApi` for commands.

---

# State Verification

| Concern | Count | Location |
| ------- | ----- | -------- |
| Session state | **1** | `GameWorkspaceProvider` |
| Notification pipeline | **1** | `NotificationProvider` + `runCommand` |
| WebSocket subscription | **1** | `GameWorkspaceProvider` effect |
| Authoritative refresh | **1** | `loadWorkspaceQueries()` |
| UI navigation state | **1** | URL params via `navigation-state.ts` |

No duplicate dashboard caches in presentation components.

---

# Tests

| Command | Result |
| ------- | ------ |
| `pnpm test` | **588 passed** (142 files) |
| `pnpm typecheck` | **Pass** (root + api + web) |

Updated: `PrimaryNavigation.test.tsx` mock aligned with new context shape (`companyViewData`, `isBusy`, `runCommand`).

No new tests were required beyond mock alignment; migration preserves existing behavior.

---

# Deferred Follow-ups (Post-Phase 4)

The items below were reviewed after consolidation. **None block Phase 4.** Each is deferred until after Phase 4 or until a dedicated cleanup pass.

| Item | Status | Decision |
| ---- | ------ | -------- |
| **CompanyDashboardScreen (~1,300 lines)** | Deferred | Split into `presentation/screens/company/sections/` is desirable but **not forced before Phase 4**. The optimal section boundaries will become clearer once Phase 4 screens exist. |
| **Legacy chart components** | Accepted | Charts remain in `apps/web/src/components/` with legacy types. Acceptable while they are fed **only** via mapped ViewData at the presentation boundary. Targeted migration in a later cleanup. |
| **Dashboard snapshot for company tables** | Accepted | Parts of the company view still load from the `/api/dashboard` snapshot in `loadWorkspaceQueries()`. Sufficient for Phase 4. Per-domain queries (employees, finance, production, etc.) can be evaluated incrementally later; Buildings already uses `/api/buildings`. |
| **Unused `DashboardDetailPanel.tsx`** | Deferred | Legacy code, no runtime risk. Remove in a later cleanup pass. |
| **Dialog / `useTransientFormState`** | Deferred | Pre-existing Phase 2 infrastructure; still unused. Address when Phase 4 workflows require it. |

---

# Final Recommendation

**READY FOR GATE 1 DELTA REVIEW**

Foundation consolidation is complete. Phase 4 (Main Menu, New Game, Save/Load gameplay UI) may proceed after delta review confirms no regressions in the consolidated architecture.

The deferred follow-ups above do **not** gate Phase 4.
