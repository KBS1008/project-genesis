# Technical Debt Register

**Project:** Project Genesis

**Document:** Technical Debt Register

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

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
| Medium        |     0 |
| Low           |     0 |
| Informational |     0 |

---

# Active Technical Debt

No confirmed technical debt items are currently registered.

This does not mean that no technical debt exists.

It means that no specific debt item has yet been formally recorded in this register.

---

# Debt Register

| ID  | Title               | Category | Priority | Status | Target Milestone |
| --- | ------------------- | -------- | -------- | ------ | ---------------- |
| —   | No registered items | —        | —        | —      | —                |

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
