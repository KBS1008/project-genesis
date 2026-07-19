# Technical Debt Register

**Project:** Project Genesis

**Document:** Technical Debt Register

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-19

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
| Medium        |     2 |
| Low           |     3 |
| Informational |     1 |

---

# Active Technical Debt

Six non-blocking items deferred from M7 gate review (AUD-005). None block M8 start.

---

# Debt Register

| ID        | Title                              | Category      | Priority | Status   | Target Milestone |
| --------- | ---------------------------------- | ------------- | -------- | -------- | ---------------- |
| TD-M7-01  | Per-region markets                 | Architecture  | Medium   | Accepted | M8+              |
| TD-M7-02  | Full map UI                        | UI            | Low      | Open     | M9               |
| TD-M7-03  | Resource depletion simulation      | Domain        | Low      | Open     | M10+             |
| TD-M7-04  | Scenario-based world selection     | Content       | Low      | Open     | M10              |
| TD-M7-05  | InfrastructureDefinition platform  | Architecture  | Medium   | Accepted | Deferred         |
| TD-M7-06  | Company home/default region        | Domain        | Info     | Open     | M8 polish        |

---

## TD-M7-01 – Per-region markets

**Category:** Architecture

**Priority:** Medium

**Status:** Accepted

**Date Identified:** 2026-07-19

**Identified By:** M7 gate review (AUD-005)

**Related Audit:** `docs/quality/M7_WORLD_SIMULATION_GATE_REVIEW_REPORT.md`

**Related Decision:** DD-007 (regional markets aspirational); M7 v1 maps `market_global` → `region_default`

**Affected Systems:** Market aggregate, save V2 `marketRegionMappings`, trade services

### Description

M7 v1 keeps a single global market. Save V2 records a mapping from `market_global` to the default region only. Per-region market aggregates and regional price discovery are not implemented.

### Origin

Introduced intentionally in M7-5/M7-7 to avoid scope creep into M8 economy behaviour.

### Reason

Regional markets require NPC/competitor pricing logic planned for M8. Global market preserves M4–M6 gameplay.

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

Buildings have required `regionId`; companies do not yet track an optional home region for UI or AI expansion (M8).

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

As of the current audit baseline:

```text
Critical Debt: 0

High Debt: 0

Medium Debt: 0

Low Debt: 0

Informational Debt: 0
```

Future audits and reviews must update this section.

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
