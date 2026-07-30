# DD-045 – M11 Phase 1 Shell Component Deferrals

**Status:** Accepted  
**Date:** 2026-07-30  
**Milestone:** M11 — Visual Production & User Experience  
**Gate:** M11.1 (Gate 1 Review — Correction C4)

---

## Context

M11 Gate 1 review (`M11_GATE_1_UI_FOUNDATION_REVIEW.md`) identified three UI foundation items specified in `M11_PHASE_1_UI_FOUNDATION_AND_DASHBOARD_IMPLEMENTATION.md` that were not delivered in Phase 1:

1. **Left navigation** (260–300px vertical rail per DD-044)
2. **Global search**
3. **Context menu**

Phase 1 focused on design tokens, PG dashboard widgets, executive dashboard assembly, and developer asset tooling (Visual Asset Manager, SVG Generator). The current workspace uses a **horizontal primary navigation** tab bar (`PrimaryNavigation`) which satisfies M9 information architecture but not the left-rail layout in DD-044.

---

## Decision

**Defer** left navigation, global search, and context menu to **M11 Phase 2 — Application Shell & Main Menu** with the following scope:

| Component | Phase 2 deliverable |
|-----------|---------------------|
| Left navigation | `PGSidebar` vertical rail replacing or supplementing horizontal tabs |
| Global search | `PGGlobalSearch` with entity/command palette |
| Context menu | `PGContextMenu` primitive integrated with workspace selection |

Phase 1 horizontal navigation **remains authoritative** until Phase 2 ships.

---

## Rationale

- Phase 1 gate priority was dashboard widget library and executive dashboard runtime binding (DB-001–DB-010).
- Left-nav migration requires shell layout refactor (`GameWorkspaceShell`, `navigation.css`, responsive breakpoints) and risks regressions across nine M9 screens.
- Global search depends on entity catalog indexing not yet exposed as a unified query API.
- Context menu requires selection model extensions beyond current `entitySelection` navigation state.

Shipping Phase 1 without these items allows dashboard and design-system work to proceed while shell enhancements are planned as a cohesive Phase 2 unit aligned with main-menu mockups (MM-*).

---

## Consequences

- Gate 1 correction C4 is satisfied by this documented deferral.
- `UI_LAYOUT_GUIDELINES.md` left-nav specification is **not yet implemented** — track under M11 Phase 2.
- Horizontal `PrimaryNavigation` continues as the player-facing navigation pattern until Phase 2.

---

## References

- `docs/development/M11_PHASE_1_UI_FOUNDATION_AND_DASHBOARD_IMPLEMENTATION.md`
- `docs/architecture/reviews/M11_GATE_1_UI_FOUNDATION_REVIEW.md` (C4)
- DD-044 UI Layout Guidelines
- `docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md` — Phase 2
