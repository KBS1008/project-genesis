# M9 Architecture Review Report (Gate 0)

**Audit ID:** M9-0  
**Project:** Project Genesis  
**Milestone:** M9 – User Interface  
**Date:** 2026-07-22  
**Commit audited:** `0106d5c` (master)  
**Reference documents:**

- `docs/project-management/M9_USER_INTERFACE_PLAN.md`
- `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`
- `docs/art/DASHBOARD_STYLE_GUIDE.md`
- `docs/quality/M8_IMPLEMENTATION_REPORT.md`

**Method:** Full-repository search and file inspection.

---

# Executive Summary

M8 is complete (AUD-006). The repository already ships a **functional dev dashboard** (Next.js + NestJS API + `GameSession` facade) covering many M9 gameplay actions on a **single scrollable page**.

The **Application layer is largely ready** for M9: core use cases, query handlers, V3 save/load, and regional world queries exist. The **presentation architecture is not yet aligned** with the M9 plan: no primary navigation, no main menu, no modular screen routing, incomplete simulation controls, thin save/load UX, no event log, and no formal presentation adapters or UI test harness.

**Verdict:** **`ARCHITECTURE CHANGES REQUIRED`** before Phase 1–4 implementation proceeds at scale.

**Recommended path:** Retain **Next.js 15 + React 19 + NestJS API + Socket.io refresh** (already chosen in practice). Add **M9 presentation ADRs**, extend the Application facade for **pause/resume and simulation status**, then execute M9 phases 1–4.

---

# Repository Status

| Area | Status | Notes |
| --- | --- | --- |
| M8 NPC Economy | ✅ Complete | Gate AUD-006; Savegame V3 |
| Application commands | ✅ Mostly ready | All M9 gameplay commands except pause/resume/speed |
| Application queries | ⚠️ Partial | Dashboard aggregate + world queries; gaps below |
| Browser UI | ⚠️ Dev shell | Single-route dashboard, not M9 IA |
| API layer | ✅ Ready | REST + `/ws/v1/dashboard` refresh |
| Presentation ADRs | ❌ Missing | Required before Phase 1 |
| UI tests | ❌ Missing | No component/E2E/a11y suite in `apps/web` |
| Tests | 567 passing | `pnpm test` at audit commit |

---

# UI Stack Inventory

| Item | Detail |
| --- | --- |
| Web app | `apps/web` — Next.js 15.4.5, React 19, App Router |
| API | `apps/api` — NestJS 11, Express, Socket.io |
| Charts | recharts |
| State | Local React state only (no global store) |
| Routing | Single page: `apps/web/src/app/page.tsx` → `DashboardShell` |
| Styles | `dashboard.css`, `globals.css`, `DASHBOARD_STYLE_GUIDE.md` tokens (partial) |
| API client | `apps/web/src/lib/api.ts` |
| Live refresh | `apps/web/src/lib/dashboard-socket.ts` → `dashboard:refresh` |

**No direct domain or repository imports** in `apps/web` (compliant with M9 §4.1).

---

# Application Entry Points

## `GameSession` facade

**File:** `src/application/facade/GameSession.ts`

| Category | Methods |
| --- | --- |
| Commands | `startNewGame`, `tick`, `placeBuilding`, `startProduction`, `startResearch`, `buyResource`, `sellResource`, `hireEmployee`, `assignEmployee`, `saveGame`, `loadGame` |
| Queries | `getDashboard`, `getTickHistory`, `getWorldOverview`, `getRegionDetails` |

**Gaps:** no `pauseSimulation` / `resumeSimulation`, no simulation status query, no save listing.

## NestJS REST (`apps/api/src/game/game.controller.ts`)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/dashboard` | Aggregated session snapshot |
| GET | `/api/dashboard/history` | Tick metrics for charts |
| GET | `/api/world/overview` | **Not used by web UI today** |
| GET | `/api/world/regions/:regionId` | **Not used by web UI today** |
| POST | `/api/session/new` | Hardcoded company name in UI |
| POST | `/api/session/save` | Fixed path `saves/browser-session.json` |
| POST | `/api/session/load` | Same fixed path |
| POST | `/api/simulation/tick` | `{ count? }` only |
| POST | `/api/buildings/place` | ✅ |
| POST | `/api/production/start` | ✅ |
| POST | `/api/research/start` | ✅ |
| POST | `/api/market/buy`, `/api/market/sell` | ✅ |
| POST | `/api/employees/hire`, `/api/employees/assign` | Extra (pre-M9 dashboard) |

## WebSocket

- Namespace `/ws/v1/dashboard`
- Event `dashboard:refresh` after mutations
- No domain event stream or entity subscriptions

---

# Query Handler Inventory

All under `src/application/queries/`:

| Handler | Wired to API | M9 screen need |
| --- | --- | --- |
| `GetWorldOverviewQueryHandler` | Direct endpoint | World overview |
| `GetRegionDetailsQueryHandler` | Direct endpoint | Region detail |
| `ListRegionsQueryHandler` | No | World navigation |
| `GetWorldMapQueryHandler` | No | Map/schematic view |
| `ListCitiesQueryHandler` | No | Region detail |
| `GetRegionalResourcesQueryHandler` | Embedded in region details | Region detail |
| `GetCompanyQueryHandler` | Dashboard only | Company |
| `GetInventoryQueryHandler` | Dashboard only | Company / market |
| `GetFinanceQueryHandler` | Dashboard only | Finance |
| `ListFinanceTransactionsQueryHandler` | Dashboard only | Finance |
| `GetMarketPricesQueryHandler` | Dashboard only | Markets |
| `ListBuildingsQueryHandler` | Dashboard only | Buildings |

**Missing for M9 §10:**

- simulation status (paused, tick, speed);
- savegame metadata / list;
- event log / reports;
- dedicated transport overview query (partially covered by dashboard aggregate).

---

# M9 Screen Coverage (Plan §8)

| Screen | Status | Evidence |
| --- | --- | --- |
| Main menu | ❌ | Lands directly on dashboard |
| New game | ⚠️ | Sidebar button, fixed name |
| World overview | ❌ UI | API ready |
| Region detail | ❌ UI | API ready |
| Company overview | ⚠️ | KPI header + tables on one page |
| Market | ⚠️ | Table + charts; hint buttons not forms |
| Buildings | ⚠️ | Table + hints |
| Production | ⚠️ | Table + hints |
| Research | ⚠️ | Table + hints |
| Transport | ⚠️ | Read-only table |
| Finance | ⚠️ | KPI + transactions |
| Reports / event log | ❌ | No query or UI |
| Save / load | ⚠️ | Fixed path; no list/confirm/version |

**Primary navigation (World, Company, Markets, …):** not implemented.

---

# Simulation Control

| Capability | Domain | Facade/API | UI |
| --- | --- | --- | --- |
| Advance tick | ✅ `SimulationEngine.tick()` | ✅ `POST /api/simulation/tick` | ✅ Sidebar buttons |
| Pause | ✅ `SimulationState.paused` | ❌ | ❌ |
| Resume | ✅ (unpause via state) | ❌ | ❌ |
| Speed / tick duration | ✅ persisted in save | ❌ read/write API | ❌ |
| Determinism | ✅ manual clock | ✅ | N/A |

---

# Save / Load (V3)

- **Schema:** `GameSaveSnapshotV3` via `GameStateSerializer` / `FileSavegameStore`
- **Round-trip:** covered by M8 tests
- **UI gaps:** no save discovery, no slot selection, no overwrite confirmation, no schema version display

---

# Dependency Analysis

| Layer | Rule enforcement |
| --- | --- |
| Domain / simulation | ✅ `tests/architecture/dependency-rules.test.ts` |
| Application | Documented in `DEPENDENCY_RULES.md`; not fully automated |
| `apps/web` | No repo imports; **no automated presentation rule test** |
| `apps/api` | Delegates to `GameSession`; acceptable adapter |

**Phase 1 requirement:** add presentation dependency rule test (forbid `@domain/*`, `@infrastructure/*` imports from `apps/web`).

---

# Test Environment

| Suite | Status |
| --- | --- |
| Domain / application / simulation | ✅ Vitest, 567 tests |
| API integration | ✅ `game.controller.test.ts` |
| Web components | ❌ None |
| E2E gameplay flow | ❌ None (M9 §16.4) |
| Accessibility automation | ❌ None |

---

# Required ADRs (Gate 0 Output)

Create or amend before Phase 1:

| Topic | Suggested ADR | Covers |
| --- | --- | --- |
| Presentation architecture | **DD-038** (new) | Folder structure, adapters, allowed dependencies |
| UI state management | Part of DD-038 or appendix | Transient vs authoritative state, selection, cache |
| Navigation / workspace | Part of DD-038 | Primary nav, context panel, dialogs |
| Simulation ↔ UI sync | Part of DD-038 | WebSocket refresh, stale command prevention |
| Error / notification model | Part of DD-038 | Domain error translation, toasts vs dialogs |

**Already covered elsewhere:**

- Persistence → DD-033 (V3)
- Commands through use cases → existing application architecture
- Visual tokens → `DASHBOARD_STYLE_GUIDE.md` (extend, not replace)

---

# Architecture Gaps (Blockers for Full M9)

| # | Gap | Phase | Severity |
| --- | --- | --- | --- |
| G1 | No presentation ADR / folder structure | 0–1 | High |
| G2 | Single-page dashboard vs M9 navigation IA | 1–2 | High |
| G3 | Pause/resume not exposed on facade/API | 5 | Medium |
| G4 | Save discovery / metadata | 4 | Medium |
| G5 | Event log query + UI | 9 | Medium |
| G6 | World/region screens not wired in web | 6 | Medium |
| G7 | No UI test harness | 1 | Medium |
| G8 | Hint-button actions vs validated forms | 7–8 | Low–Medium |

---

# Gate 0 – Architekturentscheidung / Framework Decision

**Framework Decision:** The existing technology stack consisting of Next.js 15, React 19, and NestJS is retained. M9 shall build upon the existing stack. No framework migration or replacement is part of this milestone unless a critical architectural blocker is identified during the review.

**Supporting rationale:**

- Already integrated with `GameSession` and production build path (`pnpm build:web`);
- Meets M9 desktop target;
- Avoids parallel UI stack during milestone delivery.

**Assignment:** Next.js 15 + React 19 for `apps/web`; NestJS for HTTP/WebSocket adapter.

---

# Gate 0 Verdict

## **`ARCHITECTURE CHANGES REQUIRED`**

### Conditions before Phase 1 starts

1. Accept **DD-038** (Presentation Architecture) or equivalent gate-approved decision record.
2. Document presentation folder layout (`apps/web/src/presentation/` or approved alternative).
3. Add **presentation dependency rule test**.
4. Plan facade/API extensions for **pause/resume** and **simulation status** (Phase 5 prerequisite).

### What may proceed immediately after ADR acceptance

- Phase 1: shell refactor, shared primitives, error boundary, notification system, UI test harness
- Phase 2: navigation and workspace routing
- Phase 3: query adapters; add missing read models incrementally

### What must not proceed yet

- Declaring M9 complete
- Full E2E gate without phases 4–11
- Direct repository access from UI components

---

# Recommended Implementation Order

```text
Gate 0 (this report) ✅
    ↓
ADR DD-038 Presentation Architecture
    ↓
Phase 1 — Presentation Foundation
    ↓
Phase 2 — Navigation & UI State
    ↓
Phase 3 — Read Model Adapters (+ missing queries)
    ↓
Phase 4 — Main Menu, New Game, Save/Load
    ↓
Phases 5–11 per M9_USER_INTERFACE_PLAN.md
```

---

# Related Documents

- `docs/project-management/M9_USER_INTERFACE_PLAN.md`
- `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW.md`
- `docs/art/DASHBOARD_STYLE_GUIDE.md`
- `docs/architecture/DEPENDENCY_RULES.md`
