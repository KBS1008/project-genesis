# UI Development Guide

Version: 1.0.0

Status: Active

Last Updated: 2026-07-24

---

# Purpose

This guide defines how to implement and extend the Project Genesis player interface in `apps/web`.

It complements:

- `docs/decisions/DD-038-Presentation-Architecture.md` — architectural boundaries
- `docs/project-management/M9_USER_INTERFACE_PLAN.md` — milestone scope and phases
- `docs/art/UI_STYLE_GUIDE.md` — visual design system
- `docs/art/DASHBOARD_STYLE_GUIDE.md` — dashboard-specific tokens and patterns

Follow this guide for all new presentation code. Do not add business rules in React components.

---

# Architecture

## Layer stack

```text
Presentation (React)
  ↓ view-data types
Queries / Commands (HTTP adapters)
  ↓ REST / WebSocket
Application (NestJS → GameSession)
  ↓
Domain → Repositories
```

Presentation **never** imports `src/domain`, `src/application`, `src/infrastructure`, or `src/simulation`.

Enforcement: `tests/architecture/presentation-dependency-rules.test.ts`

## Folder layout

```text
apps/web/src/
├── app/                          # Next.js routes only
├── presentation/
│   ├── shell/                    # ApplicationShell, GameWorkspaceShell, simulation bar
│   ├── tokens/                   # design-tokens.css
│   ├── primitives/               # Button, Card, LoadingState, EmptyState, StatusBanner
│   ├── notifications/            # NotificationProvider, error translation
│   ├── formatting/               # presentation-formatters.ts (currency, dates, ticks)
│   ├── adapters/
│   │   ├── api/                  # HTTP clients (query-client, *-client.ts)
│   │   ├── mappers/              # DTO → view-data (single transformation point)
│   │   ├── queries/              # load-workspace-queries.ts
│   │   └── view-data/            # immutable view-data types
│   ├── hooks/                    # useScreenQuery
│   ├── navigation/               # ScreenRouter, PrimaryNavigation, entity-navigation
│   ├── state/                    # GameWorkspaceProvider, navigation-state
│   ├── dialog/                   # DialogProvider, confirm flows
│   ├── screens/                  # route-level compositions
│   └── testing/                  # presentation-test-harness.tsx
└── components/                   # legacy widgets (migrate incrementally)
```

New screens belong under `presentation/screens/`. Prefer presentation primitives over legacy `@/components/*` unless reusing an existing chart or table widget at the boundary.

---

# View-data

## Rule

React components consume **immutable view-data**, not API DTOs.

Mapping happens once in `presentation/adapters/mappers/`. Components receive pre-formatted labels (`costLabel`, `progressLabel`, etc.) from mappers or `presentation/formatting/presentation-formatters.ts`.

## Types

| File | Purpose |
| ---- | ------- |
| `view-data/workspace-view-data.ts` | Session, simulation, world, save slots |
| `view-data/company-dashboard-view-data.ts` | KPIs, hints, detail maps, table rows |
| `view-data/company-overview-view-data.ts` | Phase 6 company inspection summaries |

Add new view-data types alongside mappers when a screen needs a stable read shape.

## Forbidden in components

- `Intl.NumberFormat`, `toFixed`, currency math
- Parsing or re-shaping raw API responses
- Importing `GameSessionDashboard` or other DTO types

---

# Queries

## Workspace bootstrap

`GameWorkspaceProvider` loads authoritative session state via `loadWorkspaceQueries()`:

- session and simulation status
- world overview and region list
- save metadata
- company dashboard snapshot → `companyViewData`

Screens should read shared state from `useGameWorkspace()` rather than re-fetching the full dashboard.

## Screen-scoped queries

Use `useScreenQuery` for per-screen GET data:

```tsx
const { data, isLoading, errorMessage } = useScreenQuery(
  `markets:${regionId}:${tickKey}`,
  () => fetchMarketPrices(regionId),
  viewData.session.hasGame && regionId.length > 0,
);
```

Wrap content in `ScreenQueryFrame` for consistent loading, empty, and error presentation.

## Query clients

| Module | Endpoints |
| ------ | --------- |
| `query-client.ts` | GET read models (buildings, markets, jobs, transport, finance, saves, world) |
| `load-workspace-queries.ts` | Combined workspace loader |

Map API results through mappers before passing to components:

```tsx
fetchBuildingList().then((buildings) =>
  buildings.map((b) => mapBuildingListRow(b, labels, regionNames)),
);
```

## Tick refresh

Include `viewData.simulation.tickNumber` in the query key when the screen must refresh after simulation ticks (markets, buildings, production, research). Pass `{ debounceMs: TICK_QUERY_DEBOUNCE_MS }` to avoid unbounded refetch queues during high simulation speeds.

Live dashboard refreshes are debounced in `GameWorkspaceProvider` (250 ms).

## Operator notes

- Run the stack with `pnpm dev` (API on default Nest port, web on `:3000`).
- Savegames are written under `saves/` relative to the repository root.
- Saving fails while domain events are queued; advance one simulation tick before save if commands were just executed.
- High simulation speed relies on debounced queries — do not remove `TICK_QUERY_DEBOUNCE_MS` without profiling.

## E2E tests

API-level end-to-end flows live in `apps/api/src/e2e/`:

```bash
pnpm test:e2e
```

These validate the M9 gameplay chain (new game → trade → build → produce → research → save/load) through the real NestJS adapter and Application layer.

## Accessibility

- Use `useModalAccessibility` for modal dialogs (focus trap + Escape).
- `Card` generates unique heading ids via `useId()`.
- Primary navigation supports ArrowLeft/ArrowRight/Home/End.
- Game workspace exposes a skip link to `#game-workspace-main`.
- Respect `prefers-reduced-motion` for spinner and transition styles.

---

# Commands

## Rule

User actions that mutate game state go through Application use cases via POST routes. Never call repositories or simulation code from the UI.

## Typed clients

| Module | Actions |
| ------ | ------- |
| `session-client.ts` | new game, save, load |
| `simulation-client.ts` | pause, resume, speed, step |
| `market-client.ts` | buy, sell |
| `gameplay-client.ts` | place building, start production, start research |

Add new command modules (e.g. `employees-client.ts`) instead of inline `callApi` in components.

## runCommand

Inside the game workspace, wrap mutations with `runCommand` from `GameWorkspaceProvider`:

```tsx
void runCommand(
  () => startProduction({ buildingId, recipeId }),
  `${recipeName} gestartet.`,
);
```

`runCommand`:

1. sets `isBusy` (blocks duplicate submissions)
2. shows progress notification
3. executes the HTTP command
4. refreshes session via `loadWorkspaceQueries()`
5. shows success or translated error

Use `isBusy` to disable buttons during in-flight commands.

## Hints

Eligibility (can buy, can hire, can start production) comes from `companyViewData.hints` mapped server-side. UI may disable buttons and show hint reasons; authoritative validation remains on the server.

## Pre-workspace flows

Main menu (`NewGamePanel`, `LoadGamePanel`) calls session clients directly, then navigates to `/game`. Save dialog uses `saveGame()` and `markSessionSaved()` on the provider.

---

# Screens

## Standard operation screen pattern (Phases 7–8)

1. `useGameWorkspace()` for session, hints, `runCommand`, `isBusy`
2. `useScreenQuery` for list data
3. `ScreenQueryFrame` for loading / error / no-game states
4. `QueryRows` or forms for interaction
5. Detail from `companyViewData.detail.*` maps where applicable
6. Commands via typed client + `runCommand`

Shared CSS: `screens/shared/operation-screen.css`

## Navigation

| Route | Screen |
| ----- | ------ |
| `/` | `MainMenuScreen` |
| `/game` | `GameWorkspaceScreen` → `ScreenRouter` |

URL state:

- `?screen=` — primary tab (`company`, `world`, `markets`, …)
- `?entity=kind:id` — entity selection for deep links

Use `navigateToTarget` / `selectEntity` from the workspace context. Invalid entity IDs are cleared by `recoverInvalidEntitySelection` on refresh.

## Reusable primitives

| Component | Use for |
| --------- | ------- |
| `Button` | Actions; variants `primary` / `secondary` |
| `Card` | Section containers |
| `LoadingState` | Inline loading |
| `EmptyState` | No data |
| `StatusBanner` | Errors and info |
| `ScreenQueryFrame` | Screen-level query lifecycle |
| `QueryRows` | Simple tabular read models |

---

# Notifications and errors

- Global notifications: `NotificationProvider` + `showNotification`
- Command errors: `translatePresentationError(error)` — maps API messages to user-facing German strings
- Do not maintain parallel toast state in screens

---

# Simulation

Simulation time is controlled only through API commands (`simulation-client.ts`). React render frequency must not drive ticks.

After commands and on WebSocket `dashboard:refresh`, the provider reloads read models. UI observes; it does not advance simulation in effects or intervals.

---

# Testing

## Presentation tests

Location: `apps/web/src/presentation/**/*.test.tsx`

Use `presentation/testing/presentation-test-harness.tsx` to wrap components with required providers.

Cover:

- loading, empty, and error states
- hint-driven button disablement
- command invocation (mock adapters)

## API integration tests

Gameplay flows also need `apps/api/src/game/game.controller.test.ts` coverage for success and validation failure paths.

## Architecture test

Run `pnpm test` — includes presentation dependency rules.

Current baseline: **615** tests (2026-07-24).

---

# Checklist for new screens

1. Screen file under `presentation/screens/<domain>/`
2. View-data types and mappers if new shapes are needed
3. GET via `query-client` or workspace context; map before render
4. POST via typed `*-client.ts`; use `runCommand` in workspace
5. `ScreenQueryFrame` + loading / empty / error states
6. No formatting or business rules in the component
7. Presentation test + API test for mutations
8. Update `IMPLEMENTATION_PROGRESS.md` and `ScreenRouter` / `primary-screens.ts`

---

# Related documents

- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/decisions/DD-029-Modular-Monolith-Architecture.md`
- `docs/decisions/DD-032-Deterministic-Tick-Processing.md`
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
- `docs/project-management/M9_USER_INTERFACE_PLAN.md`
- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`
- `docs/architecture/reviews/M9_IMPLEMENTATION_GATE_2_REPORT.md`

---

# Change log

| Version | Date | Change |
| ------- | ---- | ------ |
| 1.0.0 | 2026-07-24 | Initial guide after M9 Gate 2 (Phases 1–8) |
