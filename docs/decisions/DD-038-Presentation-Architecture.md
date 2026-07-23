---
Document-ID: DD-038
Title: Presentation Architecture
Type: Architecture Decision Record
Status: Accepted
Version: 1.0.0
Created: 2026-07-23
Last Updated: 2026-07-23

Authors:
  - Project Genesis Architecture

Reviewers:
  - M9 Gate 0 Review

Related Documents:
  - docs/project-management/M9_USER_INTERFACE_PLAN.md
  - docs/architecture/reviews/M9_ARCHITECTURE_REVIEW_REPORT.md
  - docs/art/UI_STYLE_GUIDE.md
  - docs/art/DASHBOARD_STYLE_GUIDE.md

Related Decisions:
  - DD-028 – CQRS Lite
  - DD-033 – Savegame and Persistence Strategy
  - DD-034 – API Versioning and Compatibility

Affected Components:
  - apps/web (Next.js presentation layer)
  - apps/api (HTTP/WebSocket adapter only)

Tags:
  - architecture
  - ui
  - presentation
  - nextjs
  - react
---

# DD-038 – Presentation Architecture

## Status

**Accepted**

---

# Summary

Project Genesis uses **Next.js 15 + React 19** in `apps/web` as the sole player-facing presentation layer for M9.

The UI is **presentation-only**: it formats data, coordinates navigation, validates input shape, and invokes Application commands and queries through the NestJS API adapter. It must never mutate domain repositories or duplicate business rules.

---

# Motivation

M1–M8 established domain, simulation, application, and persistence layers. M9 requires a complete player interface without polluting those layers.

Gate 0 identified missing presentation boundaries, no formal folder structure, and no automated dependency enforcement in `apps/web`.

---

# Decision

## Technology stack

Retain the existing stack:

| Layer | Technology |
| ----- | ---------- |
| Presentation | Next.js 15, React 19, CSS design tokens |
| API adapter | NestJS REST + Socket.io refresh |
| Build | pnpm workspace monorepo |

No framework migration is part of M9.

## Folder layout

```text
apps/web/src/
├── app/                          # Next.js routes and global styles only
├── presentation/
│   ├── shell/                    # ApplicationShell, ErrorBoundary
│   ├── tokens/                   # Design tokens (CSS variables)
│   ├── primitives/               # Shared UI building blocks
│   ├── notifications/            # Toast/notification provider
│   ├── adapters/
│   │   └── api/                  # HTTP client, WebSocket client, DTO types
│   ├── screens/                  # Route-level screen compositions
│   └── testing/                  # UI test harness utilities
├── components/                   # Legacy dashboard widgets (migrate to presentation/)
└── lib/                          # Re-exports only; prefer presentation/adapters/
```

New M9 UI code belongs under `presentation/`. Legacy `components/` files migrate incrementally during Phases 2–8.

## Layer boundaries

### Allowed dependencies (presentation →)

- `presentation/*` (internal)
- React, Next.js, browser APIs
- `presentation/adapters/api/*` (HTTP/WebSocket to NestJS)

### Forbidden dependencies (presentation ↛)

- `src/domain/*`
- `src/infrastructure/*`
- `src/simulation/*`
- `src/application/*`
- Direct repository or use-case imports from any package

Commands and queries reach the simulation exclusively through `/api/*` routes proxied to NestJS.

## Command flow

```text
UI interaction
  → screen / controller hook
  → presentation adapter (callApi)
  → NestJS controller
  → Application use case
  → domain validation + repository mutation
  → API response
  → notification + read-model refresh
```

## Query flow

```text
UI screen
  → presentation query hook / adapter
  → GET /api/* (NestJS query handler)
  → immutable read-model DTO
  → view formatting in component
```

Phase 3 introduces dedicated presentation adapters that map API DTOs to stable view-data types. Until then, adapters may expose API read models directly.

## UI state management

| State kind | Storage | Examples |
| ---------- | ------- | -------- |
| Authoritative | Server / Application | cash, inventory, tick, buildings |
| Transient UI | React local state | form drafts, sort order |
| Shared UI | React context | notifications, navigation (Phase 2) |
| Session selection | React context / URL | selected entity IDs (Phase 2) |

UI stores must not hold mutable domain aggregates. Cached read models are invalidated on tick refresh or explicit command success.

## Navigation and workspace (Phase 2+)

Primary navigation, dialogs, and screen routing are owned by `presentation/shell/` and `presentation/screens/`. Deep links use Next.js App Router segments where supported.

Invalid entity selection shows an empty state and clears selection — never silent fallback to wrong data.

## Visual system

Design tokens live in `presentation/tokens/design-tokens.css` and align with:

- `docs/art/UI_STYLE_GUIDE.md`
- `docs/art/DASHBOARD_STYLE_GUIDE.md`
- `docs/art/COLOR_PALETTE.md`

Components use semantic token names (`--color-primary`, `--text-body`) rather than raw hex in feature code.

## Simulation ↔ UI synchronization

- **Primary refresh:** Socket.io `dashboard-updated` event → refetch dashboard query.
- **Fallback:** manual refresh after command success.
- **Paused state:** UI reflects server pause flag; rendering frequency must not advance simulation (Phase 5).
- **Stale commands:** disable action buttons while a mutation is in flight; ignore out-of-order responses by request generation counter (Phase 5).

## Error and notification model

| Source | Presentation handling |
| ------ | --------------------- |
| API `{ ok: false, error }` | `translatePresentationError()` → user-facing toast |
| Network failure | Generic retry message |
| Domain validation | Pass through translated message from API |
| Success | Success toast via `NotificationProvider` |
| Persistent log | Event log screen (Phase 9) |

Warnings use `warning` tone; blocking failures use `error` tone with longer dismiss time.

Development builds may log raw errors to the console; production shows sanitized messages only.

## Testing

- **Dependency rules:** `tests/architecture/presentation-dependency-rules.test.ts` forbids backend layer imports from `apps/web`.
- **Component tests:** Vitest + jsdom + Testing Library via `presentation/testing/` harness.
- **E2E:** deferred to Phase 11 gate.

## Accessibility baseline

Shared primitives include:

- visible focus styles;
- `role` and `aria-live` on status and notification elements;
- semantic HTML for buttons, tables, and headings;
- minimum contrast per UI style guide.

Automated a11y suite is a Phase 10 deliverable.

---

# Consequences

## Positive

- Clear presentation boundary enforced by tests;
- incremental migration path for existing dashboard;
- aligns with CQRS Lite (DD-028) without UI bypassing Application layer.

## Negative

- Temporary duplication between `components/` and `presentation/` during migration;
- extra network round-trip vs. in-process queries (acceptable for M9 scope).

## Follow-up work

| Phase | Deliverable |
| ----- | ----------- |
| 1 | Shell, primitives, notifications, test harness ✅ |
| 2 | Navigation, workspace routing, UI state context |
| 3 | Query adapters, view-data types |
| 5 | Pause/resume API + simulation controls |

---

# Change Log

| Version | Date | Change |
| ------- | ---- | ------ |
| 1.0.0 | 2026-07-23 | Initial acceptance for M9 Phase 1 |
