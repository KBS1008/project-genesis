# M9 Implementation Gate 1 Review Report

**Project:** Project Genesis  
**Milestone:** M9 – User Interface  
**Gate:** Gate 1 — Presentation Foundation (after Phases 1–3)  
**Review date:** 2026-07-23  
**Scope:** Phases 1–3 only (Presentation Foundation, Navigation & UI State, Read Model & Query Layer)  
**Reviewer:** Mandatory implementation audit (read-only)

---

# Executive Summary

Phases 1–3 established a **credible presentation foundation**: DD-038 is accepted, `apps/web/src/presentation/` exists with shell, tokens, primitives, notifications, navigation, URL-backed UI state, query clients, view-data types, mappers, and automated presentation dependency enforcement. **No presentation-layer repository or domain imports were found.**

However, the foundation is **not yet uniform or scalable enough** for Phase 4 gameplay UI at full scale. The legacy **`DashboardShell`** (~1,550 lines in `apps/web/src/components/`) remains the functional core of the Company screen. It **bypasses the Phase 3 view-data adapter layer**, performs **duplicate session loading and WebSocket subscription** alongside `GameWorkspaceProvider`, and continues to consume the monolithic `GameSessionDashboard` DTO directly. Several secondary screens partially comply (World, Markets, Production, etc.) but **Buildings** still reads from the dashboard aggregate instead of the dedicated `/api/buildings` query.

Phase 3 application and API work exists in the working tree but was **not committed** at review time (`master` at `9fd70db` contains Phases 1–2 only; Phase 3 changes are local modifications and untracked files).

**Verdict:** **`FOUNDATION CHANGES REQUIRED`** before Phase 4 (Main Menu, New Game, Save/Load) proceeds at scale.

---

# Repository Status

| Area | Status |
| ---- | ------ |
| **Git `master` (remote)** | `9fd70db` — M9 Phase 2 committed and pushed |
| **Local working tree** | Phase 3 backend + presentation changes **uncommitted** |
| **Tests (local, with Phase 3)** | 588 passing (`pnpm test`) |
| **Typecheck (local, with Phase 3)** | Passing |
| **M9 ADRs** | DD-038 accepted; indexed in DD-000 v3.2.0 |
| **Gate 0** | Complete (`M9_ARCHITECTURE_REVIEW_REPORT.md`) |

### Commits reviewed (M9)

| Commit | Content |
| ------ | ------- |
| `c8289cf` | Gate 0 docs + M9 UI plan |
| `1fd8ac4` | Phase 1: DD-038, presentation foundation, dependency test, UI harness |
| `9fd70db` | Phase 2: navigation, workspace state, dialogs, screen routing |
| *(uncommitted)* | Phase 3: query handlers, API routes, adapters, query-backed screens |

---

# Implemented Components

## New (M9 Phases 1–3)

### Presentation (`apps/web/src/presentation/`)

| Component | Classification |
| --------- | -------------- |
| `shell/ApplicationShell.tsx` | New — root error boundary + notifications |
| `shell/PresentationErrorBoundary.tsx` | New |
| `shell/GameWorkspaceShell.tsx` | New — workspace header, nav, dialog host |
| `shell/shell.css` | New |
| `tokens/design-tokens.css` | New |
| `primitives/*` (Button, Card, LoadingState, EmptyState, StatusBanner) | New |
| `notifications/*` (Provider, Host, translatePresentationError) | New |
| `adapters/api/client.ts` | New (canonical HTTP DTO client) |
| `adapters/api/dashboard-socket.ts` | New |
| `adapters/api/query-client.ts` | New *(uncommitted)* |
| `adapters/mappers/workspace-view-mappers.ts` | New *(uncommitted)* |
| `adapters/view-data/workspace-view-data.ts` | New *(uncommitted)* |
| `adapters/queries/load-workspace-queries.ts` | New *(uncommitted)* |
| `navigation/*` (PrimaryNavigation, ScreenRouter, primary-screens, CSS) | New |
| `state/GameWorkspaceProvider.tsx` | New |
| `state/navigation-state.ts` | New |
| `state/useTransientFormState.ts` | New |
| `dialog/*` (DialogProvider, DialogHost, types) | New |
| `screens/workspace/GameWorkspaceScreen.tsx` | New |
| `screens/world/WorldScreen.tsx` | New *(uncommitted)* |
| `screens/query/QueryScreens.tsx` | New *(uncommitted)* |
| `testing/presentation-test-harness.tsx`, `vitest.setup.ts` | New |

### Application layer *(mostly uncommitted)*

| Component | Classification |
| --------- | -------------- |
| `read-models/SessionStatusReadModel.ts` | New |
| `read-models/SimulationStatusReadModel.ts` | New |
| `read-models/SaveMetadataReadModel.ts` | New |
| `read-models/EventLogEntryReadModel.ts` | New |
| `queries/GetSessionStatusQueryHandler.ts` | New |
| `queries/GetSimulationStatusQueryHandler.ts` | New |
| `queries/ListSavegamesQueryHandler.ts` | New |
| `queries/GetEventLogQueryHandler.ts` | New (stub — returns empty list) |
| `GameSession` facade extensions | Extended — 15+ new query methods |
| `SavegameStore.listMetadata()` | Extended |
| `FileSavegameStore.listMetadata()` | Extended |
| `SimulationEngine.tickDuration` getter | Extended |

### API (`apps/api/src/game/game.controller.ts`)

15 new GET routes for session, simulation, saves, world, company, buildings, inventory, finance, markets, production, research, transport, employees, events *(uncommitted)*.

### Tests

| Test | Classification |
| ---- | -------------- |
| `tests/architecture/presentation-dependency-rules.test.ts` | New |
| `presentation/**/*.test.tsx` (6 files) | New |
| `navigation-state.test.ts` | New |
| `workspace-view-mappers.test.ts` | New *(uncommitted)* |
| `GetSessionStatusQueryHandler.test.ts` | New *(uncommitted)* |
| `ListSavegamesQueryHandler.test.ts` | New *(uncommitted)* |
| `game.controller.test.ts` (session/world routes) | Extended *(uncommitted)* |

### Documentation

| Document | Classification |
| -------- | -------------- |
| `docs/decisions/DD-038-Presentation-Architecture.md` | New |
| `docs/decisions/DD-000` (v3.2.0) | Extended |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Extended |
| `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW*.md` | New (Gate 0) |

---

## Extended (pre-M9, modified for M9)

| Component | Change |
| --------- | ------ |
| `apps/web/src/components/DashboardShell.tsx` | `hideHeader` prop; embedded in workspace |
| `apps/web/src/app/layout.tsx` | Wraps `ApplicationShell` |
| `apps/web/src/app/page.tsx` | Routes through `DashboardScreen` → `GameWorkspaceScreen` |
| `apps/web/src/app/globals.css` | Imports presentation tokens/primitives/nav CSS |
| `apps/web/src/lib/api.ts`, `dashboard-socket.ts` | Re-export shims to presentation adapters |
| `vitest.config.ts` | jsdom for `apps/web`, React plugin, `@` alias |
| `package.json` | Testing Library, jsdom dev dependencies |

---

## Unchanged (still authoritative for Company screen)

| Component | Notes |
| --------- | ----- |
| `apps/web/src/components/*` (charts, DataTable, DashboardDetailPanel, TutorialPanel, icons) | Legacy dev-dashboard widgets; not migrated to `presentation/` |
| `apps/web/src/app/dashboard.css` | Legacy dashboard styling (~1,400 lines) |
| `src/domain/*`, `src/simulation/*` | No UI coupling detected |

---

## Deprecated (by ADR intent, not yet removed)

| Component | Replacement target |
| --------- | ------------------ |
| `apps/web/src/lib/api.ts` | `presentation/adapters/api/client.ts` |
| `apps/web/src/lib/dashboard-socket.ts` | `presentation/adapters/api/dashboard-socket.ts` |
| Direct `GameSessionDashboard` consumption in components | View-data adapters per DD-038 |

---

# Phase Verification

## Phase 1 — Presentation Foundation

| Requirement | Status | Evidence |
| ----------- | ------ | -------- |
| Presentation folder structure | ✅ Met | `apps/web/src/presentation/` per DD-038 |
| Application shell | ✅ Met | `ApplicationShell` + `GameWorkspaceShell` |
| Design tokens | ✅ Met | `presentation/tokens/design-tokens.css` |
| Base typography/spacing | ✅ Met | CSS variables; legacy `dashboard.css` still parallel |
| Shared primitives | ✅ Met | Button, Card, LoadingState, EmptyState, StatusBanner |
| Error boundary | ✅ Met | `PresentationErrorBoundary` |
| Notification system | ✅ Met | `NotificationProvider` + `NotificationHost` |
| Loading/empty states | ✅ Met | Primitives + screen usage |
| Presentation dependency rules | ✅ Met | `tests/architecture/presentation-dependency-rules.test.ts` |
| UI test harness | ✅ Met | `presentation/testing/presentation-test-harness.tsx`, jsdom setup |
| Component library completeness | ⚠️ Partial | No shared Table, Form, Dialog primitives beyond confirm shell; legacy `DataTable` in `components/` |
| Baseline accessibility checks | ⚠️ Partial | ARIA on primitives; **no automated a11y test suite** |

**Phase 1 exit criteria:** Mostly met. Automated accessibility gate not satisfied.

---

## Phase 2 — Navigation and UI State

| Requirement | Status | Evidence |
| ----------- | ------ | -------- |
| Primary navigation | ✅ Met | 9 screens in `PrimaryNavigation` |
| Selected entity state | ✅ Met | URL `entity=` param + `EntitySelection` types |
| Screen routing / workspace | ✅ Met | `ScreenRouter` + `GameWorkspaceScreen` |
| Dialog management | ⚠️ Partial | Infrastructure exists; **`openConfirmDialog` unused** in any screen |
| Transient form state | ⚠️ Partial | `useTransientFormState` hook exists; **not used** |
| Application-session state | ✅ Met | `GameWorkspaceProvider` + `loadWorkspaceQueries()` *(uncommitted)* |
| Simulation status state | ✅ Met | From `/api/simulation/status` via view-data mapper *(uncommitted)* |
| Invalid-selection recovery | ✅ Met | `recoverInvalidEntitySelection()` + region catalog merge |

**Phase 2 exit criteria:** Navigation and URL persistence met. Dialog and transient-form infrastructure present but not integrated into flows.

---

## Phase 3 — Read Model and Query Layer

| Requirement | Status | Evidence |
| ----------- | ------ | -------- |
| Application queries (session, world, saves, …) | ✅ Met | New handlers + facade methods *(uncommitted)* |
| API exposure | ✅ Met | 15+ new GET routes *(uncommitted)* |
| Presentation adapters | ⚠️ Partial | `query-client`, mappers, view-data exist; **Company screen excluded** |
| Immutable UI view-data | ✅ Met | `workspace-view-data.ts` types are readonly/frozen |
| Query handler tests | ⚠️ Partial | Session, save list tested; **no dedicated `GetSimulationStatusQueryHandler` test** |
| Event log query | ⚠️ Stub | Returns empty array; persistence deferred |
| Components consume query results only | ❌ Not met | **`DashboardShell` uses monolithic dashboard DTO**; **BuildingsScreen** uses `dashboard.buildings` slice |

**Phase 3 exit criteria:** Not fully met due to legacy Company screen and partial screen migration.

---

# Presentation Architecture Review

Expected flow per DD-038 and M9 plan:

```text
Presentation → View Models → Commands/Queries → Application → Domain → Repositories
```

### Verified compliant paths

- New query-backed screens (World, Markets, Production, Research, Transport, Finance, Reports) fetch via `query-client.ts`, map through `workspace-view-mappers.ts`, render view-data.
- Commands in `DashboardShell` use `callApi('/api/...')` POST routes → NestJS → `GameSession` use cases. **No domain logic duplicated for trade/build/production eligibility** — server `hints` are authoritative.
- `GameWorkspaceProvider` loads authoritative state via HTTP only.

### Violations / shortcuts

| # | Finding | Severity |
| - | ------- | -------- |
| V1 | **`DashboardShell` bypasses view-data layer** — imports `GameSessionDashboard` and API DTO types directly from `@/lib/api` | High |
| V2 | **Dual session loaders** — `GameWorkspaceProvider.refreshSession()` and `DashboardShell.refreshDashboard()` both fetch dashboard + open WebSocket | High |
| V3 | **Dual notification paths** — global `NotificationProvider` + local `Toast` state inside `DashboardShell` | Medium |
| V4 | **Parallel styling systems** — `presentation/tokens` + `app/dashboard.css` with overlapping variables | Medium |
| V5 | **Legacy `components/` not under `presentation/`** — violates DD-038 migration target | Medium |
| V6 | **Presentation formatting duplicated** — `formatTransactionType`, `formatProgress`, etc. in `DashboardShell` instead of shared mappers | Medium |

No direct repository, aggregate, infrastructure, or simulation imports were found in `apps/web`.

---

# Dependency Review

| Rule | Result |
| ---- | ------ |
| React components must not import repositories/aggregates/infrastructure/simulation | ✅ **Pass** — grep + `presentation-dependency-rules.test.ts` |
| View models must not mutate repositories | ✅ **Pass** — view-data types are readonly; no mutation APIs |
| Presentation communicates only via Commands/Queries/Read Models | ⚠️ **Partial** — Company screen uses aggregate dashboard read model rather than screen-specific view-data |

**Violations:** None at import level. Architectural layering violation at **Company screen data consumption pattern** (V1).

---

# State Management Review

| State type | Implementation | Authoritative source |
| ---------- | -------------- | -------------------- |
| **Authoritative** (cash, tick, buildings, …) | Server via API; cached in `GameWorkspaceProvider.dashboard` and separately in `DashboardShell` | Application / `GameSession` |
| **Navigation** | URL search params (`screen`, `entity`) | Browser URL (transient); validated against server catalog |
| **Entity selection** | `NavigationState.entitySelection` | URL + recovery against query catalogs |
| **Simulation display** | `WorkspaceViewData.simulation` from `/api/simulation/status` | Simulation engine |
| **Transient UI** | Sidebar open, theme, detail panel, table sort — local React state | Client only |
| **Cached read models** | `viewData`, per-screen query hooks in `QueryScreens` | Refreshed on WebSocket + manual actions |
| **Form drafts** | `useTransientFormState` defined but unused | N/A |

**Finding:** Domain entities are not stored as mutable UI state. ✅

**Finding:** Two independent caches of the same authoritative dashboard create **staleness and refresh inconsistency risk** between workspace header and Company screen content. ❌

---

# Query Layer Review

### Application queries implemented (Phase 3)

| Query domain | Handler | API route | Screen consumer |
| ------------ | ------- | --------- | --------------- |
| Session status | `GetSessionStatusQueryHandler` | `/api/session/status` | `loadWorkspaceQueries` |
| Simulation status | `GetSimulationStatusQueryHandler` | `/api/simulation/status` | `loadWorkspaceQueries` |
| Save metadata | `ListSavegamesQueryHandler` | `/api/saves` | Reports screen |
| World overview | existing | `/api/world/overview` | `loadWorkspaceQueries` |
| Regions list | existing `ListRegionsQueryHandler` | `/api/world/regions` | World screen |
| Region details | existing | `/api/world/regions/:id` | World screen |
| World map | existing | `/api/world/map` | **No screen yet** |
| Cities | existing | `/api/world/cities` | **No screen yet** |
| Company | existing | `/api/company` | **Not used by UI** |
| Buildings | existing | `/api/buildings` | **Not used** — BuildingsScreen uses dashboard |
| Inventory | existing | `/api/inventory` | **Not used** |
| Finance | existing | `/api/finance` | **Not used** |
| Finance transactions | existing | `/api/finance/transactions` | Finance screen ✅ |
| Market prices | existing | `/api/markets/prices` | Markets screen ✅ |
| Production jobs | facade `#readProductionJobs` | `/api/production/jobs` | Production screen ✅ |
| Research jobs | facade | `/api/research/jobs` | Research screen ✅ |
| Transport orders | facade | `/api/transport/orders` | Transport screen ✅ |
| Employees | facade | `/api/employees` | **Not used** |
| Event log | stub | `/api/events/log` | **Not used** |
| Dashboard aggregate | facade | `/api/dashboard` | **DashboardShell + workspace loader** |

### Repository access in presentation

```text
grep repository.find / repository.save in apps/web → No matches
```

✅ **Pass**

---

# Command Review

All player actions in `DashboardShell` invoke POST endpoints:

| Action | Route | Application path |
| ------ | ----- | ---------------- |
| New game | `/api/session/new` | `StartNewGameUseCase` |
| Save / Load | `/api/session/save`, `/load` | Save/Load use cases |
| Tick | `/api/simulation/tick` | `SimulationEngine.tick()` |
| Place building | `/api/buildings/place` | `PlaceBuildingUseCase` |
| Production / Research | `/api/production/start`, `/api/research/start` | Use cases |
| Market buy/sell | `/api/market/buy`, `/sell` | Use cases |
| Hire / Assign | `/api/employees/hire`, `/assign` | Use cases |

**Business rule duplication:** None detected. UI uses server-provided `hints.canPlace`, `canBuy`, `canSell`, etc. for button disabled state.

**Gap:** No presentation command adapter layer (typed command functions) — raw `callApi` strings inline in `DashboardShell`. Acceptable for dev shell but not scalable for Phase 4 flows.

---

# Shared Component Review

| Component | In `presentation/primitives` | Reusable | Notes |
| --------- | ---------------------------- | -------- | ----- |
| Button | ✅ | ✅ | Tested |
| Card | ✅ | ✅ | |
| LoadingState | ✅ | ✅ | Tested, `aria-label` |
| EmptyState | ✅ | ✅ | |
| StatusBanner | ✅ | ⚠️ | Not widely adopted |
| Dialog (confirm) | ✅ infrastructure | ⚠️ | Unused |
| Tables | ❌ | Legacy `DataTable` in `components/` | Sortable, used heavily |
| Forms | ❌ | Inline inputs only | |
| Notifications | ✅ | ⚠️ | Duplicated local Toast in DashboardShell |
| Error displays | ✅ boundary + translate | ⚠️ | Split systems |
| Status badges | ❌ | `MarketTrendBadge` in legacy | |
| Entity links | ❌ | Row select in DataTable | |
| Currency displays | ❌ | Inline `toLocaleString` | Should be mapper |
| Simulation status | ⚠️ | Workspace header pills | Not a shared component |

**Conclusion:** Foundation primitives exist but **legacy component library remains the effective UI kit** for the primary Company screen.

---

# Navigation Review

| Feature | Status |
| ------- | ------ |
| Application shell | ✅ `ApplicationShell` → `GameWorkspaceScreen` |
| Primary navigation | ✅ 9 M9 screens reachable |
| Nested navigation | ❌ Not implemented (single flat nav) |
| Dialogs | ⚠️ Infrastructure only |
| Entity navigation | ⚠️ URL entity param + World region select; no cross-screen entity deep links |
| Selection recovery | ✅ Invalid entity cleared after catalog load |
| History / back | ⚠️ Browser back works via URL; no explicit back stack |
| Main menu | ❌ Phase 4 scope — not present |

**Weakness:** Navigation state uses query params on `/` only — no App Router segments per screen (`/world`, `/company`). Acceptable for Phase 2 but limits deep linking and Phase 4 menu routing.

---

# Accessibility Review

| Criterion | Status |
| --------- | ------ |
| Keyboard navigation | ⚠️ Primary nav buttons keyboard-accessible; large tables/charts not fully audited |
| Focus handling | ✅ `focus-visible` on primitives and nav |
| Labels | ⚠️ Partial — charts rely on Recharts defaults; some buttons use icon-only patterns |
| Contrast | ⚠️ Not programmatically verified |
| Error messages | ✅ `role="alert"` / `aria-live` on errors and notifications |
| Tab order | ⚠️ Not tested; modal dialog exists but unused |
| Screen reader readiness | ⚠️ Partial ARIA; query tables use `role="table"` in QueryScreens |
| Empty/loading states | ✅ `role="status"`, `aria-busy` on LoadingState |

**Missing:** Automated a11y suite (deferred to Phase 10 per plan). Gate 1 accessibility foundation is **partial**.

---

# Simulation Integration Review

| Rule | Status |
| ---- | ------ |
| UI never advances simulation implicitly | ✅ Pass — ticks only via `/api/simulation/tick` button |
| Speed controls use existing interfaces | ⚠️ Display only (`tickDuration` shown); no speed change API (Phase 5) |
| Rendering frequency does not influence simulation | ✅ Pass |
| Simulation remains deterministic | ✅ Pass — UI is observational + explicit commands |
| Pause/resume | ⚠️ `isPaused` exposed in simulation status query; **no pause/resume commands** (Phase 5) |

**Finding:** Dual WebSocket refresh does not affect simulation determinism but increases ** redundant refetch load**.

---

# Performance Review

| Risk | Location | Notes |
| ---- | -------- | ----- |
| Duplicate dashboard fetch | `GameWorkspaceProvider` + `DashboardShell` | Every refresh loads dashboard twice on Company screen |
| Duplicate WebSocket | Both providers subscribe to `dashboard:refresh` | Two socket connections |
| Full aggregate fetch | `/api/dashboard` | Large payload for header-only needs |
| Parallel 6-query bundle | `loadWorkspaceQueries()` on every refresh | Appropriate for workspace but heavy on each socket event |
| Per-screen refetch | `QueryScreens` `useScreenQuery` | No shared cache; remount refetches |
| Large rerenders | `DashboardShell` | Single component ~1,550 lines; many charts/tables |
| Missing memoization | QueryScreens loaders | `loader` not in effect deps by design — stale name maps possible |
| Unbounded lists | Finance transactions, event log (future) | No pagination in UI |
| Table virtualization | `DataTable`, query tables | None — OK for dev scale |

**No optimization performed** — findings only.

---

# Testing Review

| Category | Present | Notes |
| -------- | ------- | ----- |
| Unit tests (application queries) | ✅ | 14+ query handler test files including new session/save tests |
| Component tests | ⚠️ | Button, LoadingState only (2 primitives) |
| Navigation tests | ✅ | `navigation-state.test.ts`, `PrimaryNavigation.test.tsx` |
| Query / mapper tests | ✅ | `workspace-view-mappers.test.ts` *(uncommitted)* |
| Presentation dependency tests | ✅ | `presentation-dependency-rules.test.ts` |
| Accessibility tests | ❌ | None |
| Integration tests (API) | ⚠️ | `game.controller.test.ts` — dashboard, session status, world regions |
| E2E / UI flow tests | ❌ | Deferred to Phase 11 |

**Summary:** 588 total tests. M9 presentation coverage is **narrow but present** for foundation pieces. **No integration test** proving screen navigation + query round-trip.

---

# Documentation Review

| Document | Synchronized | Notes |
| -------- | ------------ | ----- |
| `IMPLEMENTATION_PROGRESS.md` | ⚠️ | Claims Phase 3 ✅ at 65%; Phase 3 uncommitted |
| `DD-038` | ✅ | Matches implementation intent |
| `DD-000` | ✅ | DD-038 indexed |
| `M9_USER_INTERFACE_PLAN.md` | ✅ | Present |
| Gate 0 reports | ✅ | Present |
| **`UI_DEVELOPMENT_GUIDE.md`** | ❌ | Listed in M9 plan §19 — **missing** |
| **`M9_IMPLEMENTATION_REPORT.md`** | ❌ | Listed in plan §19 — **missing** |
| Application command/query docs | ⚠️ | New API routes not documented outside controller |
| Schema docs for UI view-data | ❌ | No JSON schema for view-data types |

---

# Remaining Risks

1. **State fragmentation** — Two independent dashboard caches can show inconsistent tick/cash between workspace header and Company panels after partial refresh failures.
2. **Phase 4 complexity** — Main menu, save/load dialogs, and overwrite confirmation require dialog and form state infrastructure that exists but is unused.
3. **Uncommitted Phase 3** — Risk of lost work and unreviewable remote baseline.
4. **Event log stub** — Reports/event UX in later phases depends on persistent event storage not yet implemented.
5. **Pause/resume gap** — Simulation status reads `paused` but no command surface; Phase 5 dependency remains.

---

# Technical Debt

| ID | Description | Introduced |
| -- | ----------- | ---------- |
| TD-M9-01 | Legacy `DashboardShell` monolith not migrated to presentation/view-data | Pre-M9, extended in M9 |
| TD-M9-02 | Duplicate dashboard fetch + WebSocket in workspace and Company screen | M9 Phase 2–3 |
| TD-M9-03 | `components/` parallel to `presentation/` | M9 Phase 1 |
| TD-M9-04 | Dialog + transient form hooks unused | M9 Phase 2 |
| TD-M9-05 | Production/research/transport queries inline in facade private methods, not dedicated handlers | M9 Phase 3 |
| TD-M9-06 | Event log query stub | M9 Phase 3 |
| TD-M9-07 | Missing UI_DEVELOPMENT_GUIDE.md | M9 plan deliverable |

---

# Open Questions

1. Should Phase 4 refactor `DashboardShell` before adding main menu flows, or wrap it temporarily?
2. Should workspace loader own all dashboard data with Company screen as a pure consumer (recommended)?
3. Is query-param routing on `/` sufficient for Phase 4 save/load deep links, or should App Router segments be introduced now?
4. When should production/research/transport reads be extracted from `GameSession` private methods into dedicated query handlers?

---

# Recommendations Before Phase 4

### Blocking (must complete)

1. **Commit Phase 3** as a coherent baseline on `master`.
2. **Consolidate session loading** — Remove duplicate `fetchDashboard` / WebSocket from `DashboardShell`; consume `GameWorkspaceProvider` (or shared query hook) as single authoritative cache.
3. **Migrate Company screen to view-data** — Either decompose `DashboardShell` into presentation screens consuming mappers, or wrap dashboard DTO through `WorkspaceViewData` before render.
4. **Wire Buildings screen to `/api/buildings`** — Align with Phase 3 “dedicated query per domain” rule.

### Strongly recommended

5. Adopt shared **command adapter** functions (typed POST wrappers) before save/load/new-game UX.
6. Integrate **DialogProvider** for destructive actions (overwrite save, new game with active session).
7. Extract shared **formatting mappers** (currency, transaction types, progress) from `DashboardShell`.
8. Add **integration test**: navigate to World → select region → verify recovery on invalid ID.
9. Create **`docs/development/UI_DEVELOPMENT_GUIDE.md`** per M9 plan.
10. Add **`GetSimulationStatusQueryHandler` unit test**.

### Deferred (acceptable for Phase 4 start after blocking items)

- Event log persistence
- Pause/resume commands (Phase 5)
- Automated a11y suite (Phase 10)
- App Router segment migration

---

# Final Recommendation

## **`FOUNDATION CHANGES REQUIRED`**

Phases 1–3 delivered the structural groundwork (ADR, presentation folder, dependency enforcement, navigation, query API, adapters), but the **primary Company screen remains on the pre-M9 architecture** with duplicate loading and direct aggregate DTO consumption. Phase 3 exit criteria **“components consume query results only”** is not satisfied repository-wide.

Address the four **blocking recommendations** before implementing Phase 4 (Main Menu, New Game, Save/Load) at scale. After consolidation, re-run Gate 1 or a focused delta review.

---

# Related Documents

- `docs/project-management/M9_USER_INTERFACE_PLAN.md`
- `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW.md`
- `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW_REPORT.md`
- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/decisions/DD-028-CQRS-Lite.md`
- `docs/decisions/DD-029-Modular-Monolith-Architecture.md`
- `docs/decisions/DD-032-Deterministic-Tick-Processing.md`
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`

---

# Change Log

| Version | Date | Change |
| ------- | ---- | ------ |
| 1.0.0 | 2026-07-23 | Initial Gate 1 review after M9 Phases 1–3 |
