# M11 Polish & Maintenance Backlog

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Status:** Active maintenance track (not a Phase 5.x deliverable)  
**Last updated:** 2026-08-07

---

## Phase 5 closure

**M11 Phase 5 is closed.** Gate: `M11_GATE_PHASE5_FINAL_REVIEW.md` — **PASS** (commit `65364f5`).

The four gate **Minor** corrections (P5-GATE-01 … P5-GATE-04) were **not** Phase 5 deliverables; they were resolved in this polish track (POLISH-01 … POLISH-04).

**Offen bleiben nur** die separat als **nicht blockierend** eingestuften Punkte:

| Category | IDs | Blocks Phase 5? |
|----------|-----|----------------|
| **C5 — deferred** | POLISH-09 (`entityId` / `entityType` im Event-Log-Backend) | **NO** |
| **Advisory / tooling** | POLISH-05 … POLISH-08, P5-GATE-05 … P5-GATE-07 | **NO** |

Normal gameplay integration (commands, selection, notifications, reconnect, E2E) is complete without these items.

---

## Purpose

Small polish and maintenance items identified during M11 Phase 5 gate review and closeout. These are **not** Phase 5.7 scope — they are tracked here for incremental M11 polish / dev-tooling work.

---

## Completed (2026-08-07)

| ID | Item | Evidence |
|----|------|----------|
| POLISH-01 | Explicit `commandId` on `CompanyDashboardScreen.runAction` (P5-GATE-01) | `65364f5` — `CompanyDashboardScreen.tsx`, `PGOperationsSidebar.tsx`; architecture-test exception removed |
| POLISH-02 | Fix `visual-assets.controller.test.ts` multipart validate (P5-GATE-02) | `65364f5` — planned backlog asset `WM-001_World_Map.png` |
| POLISH-03 | Disconnect/reconnect integration test (P5-GATE-03) | `65364f5` — `dashboard-reconnect.integration.test.tsx` |
| POLISH-04 | Search → world selection → camera → inspector automation (P5-GATE-04) | `65364f5` — `world-search-selection.integration.test.ts` |

---

## Open — non-blocking only (does not block Phase 5)

### C5 — accepted deferred

| ID | Item | Area | Priority | Notes |
|----|------|------|----------|-------|
| POLISH-09 | Backend `entityId` / `entityType` on event log (C5) | API + presentation | Medium | Screen-level notification navigation works today; entity deep links require backend read-model extension |

### Advisory / tooling

| ID | Item | Area | Priority | Notes |
|----|------|------|----------|-------|
| POLISH-05 | Root `pnpm typecheck` failures in visual-asset-manager tooling (P5-GATE-05) | Dev tooling | Medium | `src/tools/visual-asset-manager/*`, `tools/sync-runtime-visual-assets.ts` |
| POLISH-06 | Extend notification action UI beyond executive dashboard (P5-GATE-06) | Presentation | Low | Provider supports `executeNotificationAction`; `PGNotificationCenter` only on executive screen today |
| POLISH-07 | Optional ESLint rule mirroring `commandId` architecture test | Tooling | Low | Architecture test exists; ESLint would catch at author time |
| POLISH-08 | Manual responsive sweep (1920 → tablet) | UX QA | Medium | Not automated in Phase 5.6 |

---

## Tracking rules

- New items from gate reviews or polish passes go here — not under Phase 5.x prompts.
- Close items with commit reference and test evidence.
- Blocking gameplay integration defects escalate outside this backlog.
- **Do not reopen Phase 5** for items listed under “Open — non-blocking only”.

---

## Related documents

- `docs/architecture/reviews/M11_GATE_PHASE5_FINAL_REVIEW.md`
- `docs/architecture/reviews/M11_PHASE5_SIMULATION_INTEGRATION_FINAL_REPORT.md`
- `docs/development/SIMULATION_INTEGRATION_GUIDE.md`
