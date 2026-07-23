# M9 Architecture Review

**Project:** Project Genesis  
**Milestone:** M9 – User Interface  
**Status:** Pre-Implementation Architecture Review (Gate 0)  
**Plan:** `docs/project-management/M9_USER_INTERFACE_PLAN.md`

---

# 1. Purpose

This document defines the mandatory **M9 Gate 0** review that must complete before Phase 1 (Presentation Foundation) begins.

The review ensures the UI remains a **presentation layer only**: commands through Application use cases, state through query handlers and read models, simulation advances only through the existing control API, and no duplicate business rules appear in components.

---

# 2. Review Goals

The review verifies that:

- existing application entry points (`GameSession`, NestJS API) cover M9 commands and queries;
- the current UI stack and folder structure are documented;
- presentation-layer boundaries are defined before expansion;
- simulation control, save/load UX, and missing read models are identified;
- dependency rules and test harness gaps are recorded;
- required ADRs are listed;
- a single readiness verdict is issued.

---

# 3. Mandatory Repository Audit

Minimum audit scope:

## Presentation (`apps/web`, `apps/api`)

- framework and routing;
- component inventory vs M9 screens;
- state management approach;
- API client and WebSocket refresh;
- direct repository or domain imports (must be none).

## Application facade

- `GameSession` command and query surface;
- dashboard aggregate vs dedicated screen queries;
- error envelope consistency.

## Commands (M9 §11)

- start new game, save, load;
- buy, sell, place building, start production, start research;
- pause, resume, speed, tick (where supported).

## Queries (M9 §10)

- session / simulation status;
- world, region, company, inventory, finance;
- markets, buildings, production, research, transport;
- event log, save metadata.

## Simulation control

- `SimulationEngine`, `SimulationState.paused`;
- tick API exposure;
- determinism constraints.

## Persistence

- Savegame V3 round-trip;
- save discovery and metadata (if required by UI).

## Architecture tests

- domain/simulation dependency rules;
- presentation-layer rules (if any).

---

# 4. Expected Outcomes

Gate 0 produces:

1. `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW_REPORT.md`
2. Required ADR list (create only where existing ADRs do not cover the topic)
3. Exactly one verdict:
   - `READY FOR M9 IMPLEMENTATION`
   - `ARCHITECTURE CHANGES REQUIRED`

---

# 5. Rules

- Do **not** begin Phase 1 until Gate 0 is accepted.
- Do **not** introduce a new UI framework without documenting the decision in the gate report.
- Do **not** bypass Application use cases from UI code.
- Retain M8 Savegame V3 as the only authoritative persistence contract.

---

# 6. Related Documents

- `docs/project-management/M9_USER_INTERFACE_PLAN.md`
- `docs/art/DASHBOARD_STYLE_GUIDE.md`
- `docs/architecture/DEPENDENCY_RULES.md`
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`
