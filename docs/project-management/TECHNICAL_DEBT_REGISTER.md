# Technical Debt Register

**Project:** Project Genesis

**Document:** Technical Debt Register

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-22

---

# Purpose

This document is the central register for significant technical debt identified in Project Genesis.

The register complements:

```text
TECHNICAL_DEBT_POLICY.md
```

The policy defines how technical debt is managed.

This register records the actual technical debt.

---

# Status Definitions

| Status      | Meaning                     |
| ----------- | --------------------------- |
| Open        | Debt identified             |
| Accepted    | Debt intentionally accepted |
| Scheduled   | Resolution planned          |
| In Progress | Resolution underway         |
| Resolved    | Resolution implemented      |
| Verified    | Resolution confirmed        |
| Closed      | Fully completed             |

---

# Priority Definitions

| Priority      | Meaning                             |
| ------------- | ----------------------------------- |
| Critical      | Immediate action required           |
| High          | Address before next major milestone |
| Medium        | Plan resolution                     |
| Low           | Address opportunistically           |
| Informational | No immediate action                 |

---

# Technical Debt Summary

| Priority      | Count |
| ------------- | ----: |
| Critical      |     0 |
| High          |     0 |
| Medium        |     5 |
| Low           |     5 |
| Informational |     1 |

---

# Active Technical Debt

Six M7 items deferred from gate review (AUD-005). **TD-M7-01 resolved** in M8 (regional markets shipped).

Six **M8 planning/economy gaps** registered after Gate 2 (2026-07-22). These are **not Phase 8 (Savegame V3) blockers** but must be closed before the **final M8 gate** (Phase 9).

---

# M8 Phase Boundaries (Gate 2, 2026-07-22)

| Scope | Blocker? | Notes |
| ----- | -------- | ----- |
| **Phase 8 — Savegame V3** | — | Brain + regional market persistence only; functional AI gaps below do **not** block |
| **Phase 9 — Final M8 gate** | — | TD-M8-01 … TD-M8-06 must be resolved or explicitly waived in gate report |

---

# Debt Register

| ID        | Title                              | Category      | Priority | Status   | Target Milestone |
| --------- | ---------------------------------- | ------------- | -------- | -------- | ---------------- |
| TD-M7-01  | Per-region markets                 | Architecture  | Medium   | Resolved | M8 (Phase 3)     |
| TD-M7-02  | Full map UI                        | UI            | Low      | Open     | M9               |
| TD-M7-03  | Resource depletion simulation      | Domain        | Low      | Open     | M10+             |
| TD-M7-04  | Scenario-based world selection     | Content       | Low      | Open     | M10              |
| TD-M7-05  | InfrastructureDefinition platform  | Architecture  | Medium   | Accepted | Deferred         |
| TD-M7-06  | Company home/default region        | Domain        | Info     | Open     | M8 polish        |
| TD-M8-01  | STABILIZE_LIQUIDITY orphan goal    | Simulation    | Medium   | Accepted | M8 Phase 9       |
| TD-M8-02  | REDUCE_COSTS never generated       | Simulation    | Medium   | Accepted | M8 Phase 9       |
| TD-M8-03  | EXPAND_REGION decision not executed| Domain        | Low      | Accepted | M8 Phase 9       |
| TD-M8-04  | Expansion primary region only      | Simulation    | Medium   | Accepted | M8 Phase 9       |
| TD-M8-05  | StartNewGame seeds no NPC companies| Application   | Medium   | Accepted | M8 Phase 9       |
| TD-M8-06  | Unused MarketSupplyAggregator      | Code          | Low      | Accepted | M8 Phase 9       |

---

## TD-M7-01 – Per-region markets

**Category:** Architecture

**Priority:** Medium

**Status:** Resolved

**Date Identified:** 2026-07-19

**Date Resolved:** 2026-07-22

**Identified By:** M7 gate review (AUD-005)

**Resolved By:** M8 Phase 3 (regional markets, `MarketRegionalSupplyAggregator`, save V1 regional fields)

**Related Audit:** `docs/quality/M7_WORLD_SIMULATION_GATE_REVIEW_REPORT.md`

**Related Decision:** DD-018 Amendment (regional market architecture)

**Affected Systems:** Market aggregate, save V1/V2 `markets[]`, `MarketPriceSeeder`, `MarketSimulationSystem`

### Description

~~M7 v1 keeps a single global market.~~ **Resolved in M8:** one regional market per enabled region; legacy `market_global` fallback retained for migrated saves only.

### Verification

Regional markets implemented; Gate 2 review passed Phases 1–7. See `docs/architecture/reviews/M8_IMPLEMENTATION_GATE_2_REPORT.md`.

---

## TD-M7-02 – Full map UI

**Category:** UI

**Priority:** Low

**Status:** Open

**Date Identified:** 2026-07-19

**Identified By:** M7 gate review (AUD-005)

**Related Audit:** `docs/quality/M7_WORLD_SIMULATION_GATE_REVIEW_REPORT.md`

**Affected Systems:** Dashboard, M9 window model

### Description

World data is queryable via application read models and minimal REST endpoints (`GET api/world/overview`, `GET api/world/regions/:id`). No visual map, editor, or pathfinding UI exists.

### Origin

Explicit M7 non-goal per `M7_WORLD_SIMULATION_PLAN.md` §19.

---

## TD-M7-03 – Resource depletion simulation

**Category:** Domain

**Priority:** Low

**Status:** Open

**Date Identified:** 2026-07-19

**Identified By:** M7 gate review (AUD-005)

**Affected Systems:** Regional resources (Option A flags only)

### Description

Regional resources use Option A: static availability flags and extraction modifiers without depletion or regeneration state.

---

## TD-M7-04 – Scenario-based world selection

**Category:** Content

**Priority:** Low

**Status:** Open

**Date Identified:** 2026-07-19

**Identified By:** M7 gate review (AUD-005)

**Affected Systems:** `StartNewGameUseCase`, scenario loader (not implemented)

### Description

New games always bootstrap `world_default` / `region_default`. Scenario content referencing alternate worlds is documented but not loaded.

---

## TD-M7-05 – InfrastructureDefinition platform

**Category:** Architecture

**Priority:** Medium

**Status:** Accepted

**Date Identified:** 2026-07-19

**Identified By:** M7-0 gap audit

**Affected Systems:** Transport/construction policies

### Description

No standalone infrastructure content type. M7 uses biome modifiers and map connection distance for transport duration instead of a generic infrastructure registry.

---

## TD-M7-06 – Company home/default region

**Category:** Domain

**Priority:** Informational

**Status:** Open

**Date Identified:** 2026-07-19

**Identified By:** M7-0 gap audit

**Affected Systems:** Company aggregate, new-game setup

### Description

Buildings have required `regionId`; companies do not yet track an optional home region for UI or AI expansion. M8 expansion planning places buildings in the **primary region only** (see TD-M8-04).

---

## TD-M8-01 – STABILIZE_LIQUIDITY orphan goal

**Category:** Simulation

**Priority:** Medium

**Status:** Accepted

**Date Identified:** 2026-07-22

**Identified By:** M8 Implementation Gate 2 review

**Related Audit:** `docs/architecture/reviews/M8_IMPLEMENTATION_GATE_2_REPORT.md`

**Affected Systems:** `CompanyGoalPlanner`, `CompanyDecisionPlanner`, `GoalKind.STABILIZE_LIQUIDITY`

### Description

`STABILIZE_LIQUIDITY` goals can be created during planning, but no matching decision is enqueued or executed.

### Phase boundary

**Does not block Phase 8 (Savegame V3).** Must be wired or removed before final M8 gate.

### Resolution Strategy

Add liquidity decisions (e.g. sell resources, defer expansion) or stop generating the goal until handlers exist.

---

## TD-M8-02 – REDUCE_COSTS never generated

**Category:** Simulation

**Priority:** Medium

**Status:** Accepted

**Date Identified:** 2026-07-22

**Identified By:** M8 Implementation Gate 2 review

**Affected Systems:** `GoalKind.REDUCE_COSTS`, `CompanyGoalPlanner`

### Description

`REDUCE_COSTS` is defined in the domain enum but never produced by the goal planner.

### Phase boundary

**Does not block Phase 8.** Resolve in Phase 9 (implement generation + decisions, or remove from enum).

---

## TD-M8-03 – EXPAND_REGION decision not executed

**Category:** Domain

**Priority:** Low

**Status:** Accepted

**Date Identified:** 2026-07-22

**Identified By:** M8 Implementation Gate 2 review

**Affected Systems:** `CompanyDecisionType.EXPAND_REGION`, `CompanyDecisionExecutionService`

### Description

`EXPAND_REGION` exists as a decision type and snapshot payload variant, but execution routes expansion through `PLACE_BUILDING` only. No handler calls an expand-region use case.

### Phase boundary

**Does not block Phase 8** (decision type may appear in saved queues). Align domain model and execution before final gate.

### Resolution Strategy

Implement execution path or remove unused type in favour of `PLACE_BUILDING` only.

---

## TD-M8-04 – Expansion primary region only

**Category:** Simulation

**Priority:** Medium

**Status:** Accepted

**Date Identified:** 2026-07-22

**Identified By:** M8 Implementation Gate 2 review

**Affected Systems:** `CompanyPlanningAnalyser`, `CompanyDecisionPlanner`, cross-region world model

### Description

Regional expansion goals and building placement decisions target the company's primary region only. Cross-region expansion is not modeled in planning.

### Phase boundary

**Does not block Phase 8.** Required for full M8 economy behaviour before final gate.

---

## TD-M8-05 – StartNewGame seeds no NPC companies

**Category:** Application

**Priority:** Medium

**Status:** Accepted

**Date Identified:** 2026-07-22

**Identified By:** M8 Implementation Gate 2 review

**Affected Systems:** `StartNewGameUseCase`, `CreateCompanyUseCase` (`autonomous: true`)

### Description

New games create a single player company only. Autonomous NPC companies and brains require explicit `CreateCompany` with `autonomous: true`.

### Phase boundary

**Does not block Phase 8** (empty `companyBrains[]` is valid in V3). Seed competing NPCs before final M8 gate or document as M9 world bootstrap.

### Resolution Strategy

Extend `StartNewGameUseCase` or add dedicated world-bootstrap step with content-driven NPC roster.

---

## TD-M8-06 – Unused MarketSupplyAggregator

**Category:** Code

**Priority:** Low

**Status:** Accepted

**Date Identified:** 2026-07-22

**Identified By:** M8 Implementation Gate 2 review

**Affected Systems:** `src/domain/market/MarketSupplyAggregator.ts`, `MarketRegionalSupplyAggregator.ts`

### Description

Legacy global-inventory `MarketSupplyAggregator` is unused; `MarketRegionalSupplyAggregator` is authoritative for regional price simulation.

### Phase boundary

**Does not block Phase 8.** Remove or mark deprecated before final gate.

---

# Debt Register (template reference)

| ID  | Title               | Category | Priority | Status | Target Milestone |
| --- | ------------------- | -------- | -------- | ------ | ---------------- |
| —   | See active items above | —     | —        | —      | —                |

---

# Debt Item Template

New technical debt items should use the following structure.

---

## TD-XXX – Title

**Category:**

**Priority:**

**Status:**

**Date Identified:**

**Identified By:**

**Related Audit:**

**Related Decision:**

**Affected Systems:**

### Description

Describe the technical debt.

### Origin

Explain how the debt was introduced.

### Reason

Explain why the current implementation was accepted.

### Impact

Describe the consequences.

### Risk

Describe potential future risks.

### Resolution Strategy

Describe the preferred solution.

### Target Milestone

Define when the debt should be resolved.

### Owner

Define the responsible person or team.

### Verification

Describe how resolution will be verified.

---

# Technical Debt Categories

Technical debt may be categorized as:

- Architecture
- Code
- Testing
- Documentation
- Performance
- Security
- Infrastructure
- Dependencies
- Tooling
- Simulation
- Data
- Savegames

---

# Audit Findings

Technical debt discovered during audits should reference the original audit.

Example:

```text
Audit:
AUD-001

Finding:
AUD-001-F01

Debt:
TD-001
```

This creates traceability between:

```text
Audit

↓

Finding

↓

Technical Debt

↓

Resolution

↓

Verification
```

---

# Technical Debt Lifecycle

```text
Identified

↓

Registered

↓

Classified

↓

Prioritized

↓

Accepted or Scheduled

↓

Resolved

↓

Verified

↓

Closed
```

---

# Review Schedule

The register should be reviewed:

- during milestone reviews
- during architecture audits
- before major releases
- after significant refactoring

Critical and high-priority items should be reviewed more frequently.

---

# Debt Aging

The age of unresolved debt should be monitored.

Recommended categories:

```text
0–30 days

31–90 days

91–180 days

181–365 days

365+ days
```

Old unresolved debt should be reviewed for priority escalation.

---

# Debt Trend

Track:

```text
New Debt

vs

Resolved Debt
```

The long-term objective is:

```text
Resolved Debt ≥ New Debt
```

Persistent growth indicates increasing technical risk.

---

# Closure Criteria

A debt item may be closed only when:

- resolution implemented
- tests updated
- documentation updated
- relevant Quality Gates passed
- original problem verified as resolved

---

# Exceptions

A debt item may remain open when:

- the compromise is still intentional
- the resolution cost is currently unjustified
- the affected system is scheduled for replacement
- the debt is low risk

The reason must remain documented.

---

# Current Register Status

As of 2026-07-22 (post Gate 2):

```text
Critical Debt: 0

High Debt: 0

Medium Debt: 5  (TD-M7-05, TD-M8-01, TD-M8-02, TD-M8-04, TD-M8-05)

Low Debt: 5     (TD-M7-02, TD-M7-03, TD-M7-04, TD-M8-03, TD-M8-06)

Informational Debt: 1  (TD-M7-06)
```

M8 Phase 8 may proceed while TD-M8-* items remain open.

---

# Related Documents

- TECHNICAL_DEBT_POLICY.md
- QUALITY_METRICS.md
- PROJECT_QUALITY_REPORT.md
- QUALITY_GATES.md
- AUDIT_PROCESS.md
- RELEASE_STRATEGY.md

---

# Summary

The Technical Debt Register provides a single source of truth for known technical debt.

Technical debt must be visible, traceable and actively managed.

An empty register does not mean that technical debt cannot exist.

It means that no specific debt has yet been formally registered.

The register must be updated whenever significant technical debt is identified.
