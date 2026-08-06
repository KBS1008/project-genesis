# Command Execution Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.4A  
**Audience:** Frontend developers wiring UI mutations to the application layer

---

## Overview

All gameplay mutations follow one pipeline:

```text
React action → typed *-client.ts → Application API
  → query invalidation → workspace/screen refresh → React update
```

Commands never mutate ViewData directly. React state is not authoritative for gameplay data.

---

## Command entry point

Inside the game workspace, wrap mutations with `runCommand` from `GameWorkspaceProvider`:

```ts
void runCommand(
  () => placeBuilding(payload),
  'Gebäude in Bau gegeben.',
  { commandId: 'construction.placeBuilding' },
);
```

`runCommand` provides:

- global `isBusy` guard (duplicate submission prevention)
- stale-response guard via command generation counter
- scoped workspace refresh (no full reload unless required)
- screen query invalidation for affected lists
- success/error notifications (no gameplay event mapping in 5.4A)

---

## Command inventory

| Command ID | Client | Invalidation |
|------------|--------|--------------|
| `company.newGame` | `session-client.startNewGame` | full session |
| `construction.placeBuilding` | `gameplay-client.placeBuilding` | dashboard + buildings |
| `production.start` | `gameplay-client.startProduction` | dashboard + production |
| `research.start` | `gameplay-client.startResearch` | dashboard + research |
| `employees.hire` | `employees-client.hireEmployee` | dashboard |
| `employees.assign` | `employees-client.assignEmployee` | dashboard |
| `market.buy` / `market.sell` | `market-client` | dashboard + markets + finance |
| `simulation.*` | `simulation-client` | session and/or dashboard |
| `session.save` | `session-client.saveGame` | saves list |
| `session.load` | `session-client.loadGame` | full session |

Full registry: `apps/web/src/presentation/commands/command-invalidation-map.ts`

---

## Query scopes

### Workspace scopes (provider state)

| Scope | Data |
|-------|------|
| `workspace.dashboard` | `companyViewData`, dashboard aggregate |
| `workspace.session` | session + simulation status |
| `workspace.world` | world overview + regions |
| `workspace.saves` | save slot list |

### Screen scopes (`useScreenQuery`)

Derived from query key prefix (`finance:12` → `screen.finance`). Invalidation bumps a generation counter subscribed by `useScreenQuery`.

---

## Invalidation triggers

| Trigger | Behavior |
|---------|----------|
| Command success | scopes from `commandId` map |
| Command failure | no data refresh |
| Simulation tick | session + dashboard workspace scopes + all screen scopes |
| WebSocket refresh | dashboard + session + world workspace scopes + screen invalidation |
| Manual `refreshSession()` | full workspace reload (initial load / menu entry) |
| Save completed | `workspace.saves` via `session.save` |
| Load completed | full session reload on `/game` mount |

---

## Loading and error states

| State | UI signal |
|-------|-----------|
| idle | `isBusy === false` |
| loading | `isBusy === true`, buttons disabled |
| success | success notification + scoped refresh |
| recoverable error | typed `PresentationCommandError`, `recoverable: true` |
| fatal error | error notification, no refresh |
| cancelled | superseded command generation, no refresh |

---

## Extension rules

1. Add typed client function under `adapters/api/*-client.ts`
2. Register command in `COMMAND_REGISTRY` with invalidation scopes
3. Call `runCommand` with explicit `commandId`
4. Add screen query prefix mapping if a new list screen is introduced
5. Do not call `fetchDashboard()` from screen components after mutations

---

## Related documents

- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/design/UI_DATA_BINDING_GUIDELINES.md`
- `docs/development/SIMULATION_INTEGRATION_GUIDE.md`
- `docs/architecture/reviews/M11_PHASE5_4A_COMMANDS_REPORT.md`
