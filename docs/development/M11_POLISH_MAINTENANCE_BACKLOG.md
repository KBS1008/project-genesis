# M11 Polish & Maintenance Backlog

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Status:** Active maintenance track (not a Phase 5.x deliverable)  
**Last updated:** 2026-08-07

---

## Purpose

Small polish and maintenance items identified during M11 Phase 5 gate review and closeout. These are **not** Phase 5.7 scope — they are tracked here for incremental M11 polish / dev-tooling work.

---

## Completed (2026-08-07)

| ID | Item | Evidence |
|----|------|----------|
| POLISH-01 | Explicit `commandId` on `CompanyDashboardScreen.runAction` | `CompanyDashboardScreen.tsx`, `PGOperationsSidebar.tsx`; removed architecture-test exception |
| POLISH-02 | Fix `visual-assets.controller.test.ts` multipart validate | Uses planned backlog asset `WM-001_World_Map.png` |
| POLISH-03 | Disconnect/reconnect integration test | `dashboard-reconnect.integration.test.tsx` |
| POLISH-04 | Search → world selection → camera → inspector automation | `world-search-selection.integration.test.ts` |

---

## Open — Advisory / Maintenance

| ID | Item | Area | Priority | Notes |
|----|------|------|----------|-------|
| POLISH-05 | Root `pnpm typecheck` failures in visual-asset-manager tooling | Dev tooling | Medium | `src/tools/visual-asset-manager/*`, `tools/sync-runtime-visual-assets.ts` |
| POLISH-06 | Extend notification action UI beyond executive dashboard | Presentation | Low | Provider supports `executeNotificationAction`; `PGNotificationCenter` only on executive screen today |
| POLISH-07 | Optional ESLint rule mirroring `commandId` architecture test | Tooling | Low | Architecture test exists; ESLint would catch at author time |
| POLISH-08 | Manual responsive sweep (1920 → tablet) | UX QA | Medium | Not automated in Phase 5.6 |
| POLISH-09 | Backend `entityId` / `entityType` on event log (C5) | API + presentation | Medium | Enables entity-specific notification deep links |

---

## Tracking rules

- New items from gate reviews or polish passes go here — not under Phase 5.x prompts.
- Close items with commit reference and test evidence.
- Blocking gameplay integration defects escalate outside this backlog.

---

## Related documents

- `docs/architecture/reviews/M11_GATE_PHASE5_FINAL_REVIEW.md`
- `docs/architecture/reviews/M11_PHASE5_SIMULATION_INTEGRATION_FINAL_REPORT.md`
- `docs/development/SIMULATION_INTEGRATION_GUIDE.md`
