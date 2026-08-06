# M11 Phase 5.4A — Commands & Query Invalidation Report

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.4A  
**Review date:** 2026-08-06  
**Prompt:** M11 Phase 5.4A — Commands & Query Invalidation

---

# Executive Summary

Phase 5.4A unifies the presentation command pipeline behind typed clients, scoped query invalidation, and deterministic UI refresh. Commands no longer trigger unconditional full workspace reloads. Screen lists subscribe to a centralized invalidation store while workspace aggregates refresh only the slices affected by each command.

No gameplay mechanics, notification event mapping, or simulation event handling were introduced (reserved for Phase 5.4B).

**Final decision:** **COMMAND PIPELINE READY**

---

# Reviewed Commands

| Group | Command ID | Client | Refresh strategy |
|-------|------------|--------|------------------|
| Company | `company.newGame` | `startNewGame` | Full session |
| Construction | `construction.placeBuilding` | `placeBuilding` | Dashboard + buildings screens |
| Production | `production.start` | `startProduction` | Dashboard + production screen |
| Research | `research.start` | `startResearch` | Dashboard + research screen |
| Employees | `employees.hire` | `hireEmployee` | Dashboard |
| Employees | `employees.assign` | `assignEmployee` | Dashboard |
| Market | `market.buy` / `market.sell` | `buyResource` / `sellResource` | Dashboard + markets + finance |
| Simulation | `simulation.*` | `simulation-client` | Session and/or dashboard |
| Save | `session.save` | `saveGame` | Saves list |
| Load | `session.load` | `loadGame` | Full session on `/game` mount |

Inventory: `COMMAND_REGISTRY` in `command-invalidation-map.ts`

---

# Command Architecture

```text
React Component
  → runCommand(action, message, { commandId })
  → executePresentationCommand
  → typed *-client.ts (callApi)
  → Application API
  → scoped workspace refresh + screen invalidation
  → ViewData / useScreenQuery update
  → React render
```

---

# Execution Pipeline

- **Stale guard:** `commandGenerationRef` cancels superseded executions
- **Duplicate guard:** `isBusyRef` blocks parallel submissions
- **Typed errors:** `PresentationCommandError` with `recoverable` flag
- **No ViewData mutation in components**

---

# Query Invalidation

| Layer | Mechanism |
|-------|-----------|
| Workspace | `refreshWorkspaceScopes()` — dashboard, session, world, saves slices |
| Screen | `QueryInvalidationStore` + `useScreenQuery` invalidation token |
| Tick / WebSocket | Session + dashboard refresh + screen scope invalidation |

---

# Loading States

| State | Signal |
|-------|--------|
| idle | `isBusy === false` |
| loading | `isBusy === true` |
| success | scoped refresh + success toast |
| recoverable error | typed error, no refresh |
| fatal error | error toast, no refresh |
| cancelled | superseded generation |

---

# Error Handling

- `toPresentationCommandError()` normalizes API and network failures
- Error boundary and notification host reused
- No swallowed exceptions in command pipeline
- No gameplay notification mapping in this phase

---

# Performance

| Measurement | Result (local vitest, 2026-08-06) |
|-------------|----------------------------------|
| Command scope resolution | &lt; 1 ms (unit) |
| Invalidation store bump | &lt; 1 ms (unit) |
| Dashboard-only refresh | 2 API calls vs 7 for full `loadWorkspaceQueries` |
| Full reload | retained for initial mount / `refreshSession()` only |

Targeted invalidation avoids redundant dashboard refetch on simulation speed changes and save operations.

---

# Testing

| Suite | Coverage |
|-------|----------|
| `query-invalidation.test.ts` | Store generations, subscribers |
| `command-scopes.test.ts` | Scope maps, registry groups |
| `execute-command.test.ts` | Success, cancel, recoverable error |
| `refresh-workspace-scopes.test.ts` | Selective workspace fetches |
| Presentation regression | 141 tests passing |

---

# Documentation

| Document | Status |
|----------|--------|
| `COMMAND_EXECUTION_GUIDE.md` | Created |
| `IMPLEMENTATION_PROGRESS.md` | Updated |
| `M11_VISUAL_PRODUCTION_PLAN.md` | Updated |

---

# Remaining Risks

| Risk | Severity | Notes |
|------|----------|-------|
| Menu new/load outside provider | Low | Full refresh on `/game` mount |
| Double refresh on tick + invalidation | Low | Debounced keys coalesce with invalidation token |
| Custom commands without `commandId` | Medium | Fall back to full refresh scopes |

---

# Recommendations

1. Phase 5.4B: map simulation events to notifications
2. Add architecture test requiring `commandId` on all `runCommand` calls
3. Consider `useScreenQuery` retry hook for recoverable query errors

---

**COMMAND PIPELINE READY**
