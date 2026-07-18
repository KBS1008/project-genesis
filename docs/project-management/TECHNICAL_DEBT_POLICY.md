# Technical Debt Policy

**Project:** Project Genesis

**Document:** Technical Debt Policy

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines how technical debt is identified, classified, documented, prioritized, monitored and resolved in Project Genesis.

Technical debt is an unavoidable part of software development.

The objective is not to eliminate all technical debt.

The objective is to ensure that technical debt is:

- intentional
- visible
- documented
- prioritized
- controlled
- eventually resolved where necessary

Technical debt must never become invisible infrastructure.

---

# Definition

Technical debt is any implementation decision that provides short-term development benefit while creating additional future cost, risk or maintenance effort.

Examples include:

- temporary workarounds
- duplicated logic
- incomplete abstractions
- missing tests
- outdated documentation
- architectural compromises
- performance shortcuts
- temporary placeholder implementations

---

# Technical Debt Philosophy

Project Genesis follows these principles:

1. Technical debt must be visible.
2. Technical debt must have an owner.
3. Technical debt must have a reason.
4. Technical debt must have a priority.
5. Critical technical debt must block relevant releases.
6. Technical debt must not silently accumulate.
7. New technical debt should be intentional.
8. AI-generated technical debt is subject to the same standards as human-generated technical debt.

---

# Types of Technical Debt

## Architectural Debt

Examples:

- incorrect dependency direction
- violated layer boundaries
- circular dependencies
- incorrect domain ownership
- inappropriate abstractions

Architectural debt is considered high risk.

---

## Code Debt

Examples:

- duplicated code
- overly complex methods
- unclear naming
- excessive coupling
- obsolete code

---

## Testing Debt

Examples:

- missing unit tests
- missing integration tests
- insufficient regression tests
- untested edge cases

---

## Documentation Debt

Examples:

- outdated documentation
- undocumented architecture decisions
- missing API documentation
- implementation differs from documentation

---

## Performance Debt

Examples:

- inefficient algorithms
- unnecessary allocations
- missing caching
- unoptimized database access

Performance debt should be evaluated against actual measurements.

---

## Security Debt

Examples:

- unsafe input handling
- insecure serialization
- insufficient validation
- outdated dependencies

Security debt receives high priority.

---

## Infrastructure Debt

Examples:

- outdated tooling
- unstable CI
- manual deployment steps
- missing automation

---

# Technical Debt Classification

Technical debt is classified by severity.

| Severity | Description |
|----------|-------------|
| Critical | Immediate risk to stability, data or architecture |
| High | Significant long-term impact |
| Medium | Manageable but should be addressed |
| Low | Minor improvement opportunity |
| Informational | Observation without immediate action |

---

# Critical Technical Debt

Critical debt includes:

- data corruption risks
- savegame corruption
- simulation non-determinism
- security vulnerabilities
- severe architectural violations
- unrecoverable system failures

Critical debt must be addressed immediately.

It may block:

- feature development
- milestone completion
- release

---

# High Technical Debt

Examples:

- significant architecture violations
- major duplication
- unstable core systems
- missing critical tests
- severe performance bottlenecks

High-priority debt should be addressed before the next major milestone where possible.

---

# Medium Technical Debt

Examples:

- incomplete abstractions
- moderate duplication
- missing non-critical tests
- outdated documentation

Medium debt should be scheduled.

---

# Low Technical Debt

Examples:

- minor refactoring
- naming improvements
- small optimizations
- cosmetic code improvements

Low debt may be addressed opportunistically.

---

# Technical Debt Register

All significant technical debt must be recorded.

The recommended location is:

```text
docs/project-management/TECHNICAL_DEBT_REGISTER.md
```

Each entry should contain:

```text
Debt ID

Title

Category

Severity

Origin

Description

Reason

Impact

Affected Systems

Owner

Target Milestone

Resolution Strategy

Status
```

---

# Debt ID

Every debt item receives a unique identifier.

Format:

```text
TD-XXX
```

Examples:

```text
TD-001
TD-002
TD-003
```

---

# Debt Lifecycle

Technical debt follows:

```text
Identified

↓

Documented

↓

Classified

↓

Prioritized

↓

Scheduled

↓

Resolved

↓

Verified

↓

Closed
```

---

# Identification

Technical debt may be identified through:

- code review
- architecture review
- audit
- testing
- performance profiling
- security review
- developer observation
- AI-assisted analysis

---

# Documentation Requirements

A technical debt item must explain:

- what the problem is
- why it exists
- why it was accepted
- what the impact is
- how it can be resolved

Unknown debt is considered unmanaged debt.

---

# Intentional vs Unintentional Debt

## Intentional Debt

The team knowingly accepts a temporary compromise.

Example:

```text
A temporary implementation is used to validate gameplay before final optimization.
```

Intentional debt must still be documented.

---

## Unintentional Debt

Debt discovered after implementation.

Examples:

- unexpected coupling
- insufficient test coverage
- architectural inconsistency

Unintentional debt should be assessed as soon as it is discovered.

---

# Technical Debt Interest

Technical debt may create ongoing cost.

Examples:

- slower development
- increased bug probability
- more difficult testing
- higher onboarding cost
- performance degradation

The longer high-impact debt remains unresolved, the higher its priority may become.

---

# Debt Priority

Priority should consider:

```text
Impact

×

Probability

×

Cost of Delay
```

A low-impact issue with high probability may become significant over time.

---

# Debt Resolution

Resolution should preferably:

- remove the underlying cause
- preserve architecture
- include regression tests
- update documentation
- pass applicable Quality Gates

A workaround is not considered debt resolution if the underlying problem remains.

---

# Debt Prevention

Technical debt should be reduced by:

- architecture reviews
- automated tests
- quality gates
- code reviews
- documentation
- CI validation
- dependency checks
- performance benchmarks

---

# AI-Generated Technical Debt

AI-generated code must not be exempt from technical debt controls.

AI may introduce:

- duplicated abstractions
- unnecessary complexity
- incorrect patterns
- undocumented assumptions
- incomplete error handling

AI-generated code must pass the same:

- architecture checks
- tests
- quality gates
- reviews

as manually written code.

---

# Technical Debt and Quality Gates

Technical debt does not automatically block completion.

However:

| Debt Level | Quality Gate Impact |
|------------|---------------------|
| Critical | Blocks completion |
| High | Usually blocks milestone |
| Medium | Must be documented |
| Low | May be accepted |
| Informational | No blocking effect |

Any accepted debt must be recorded.

---

# Technical Debt and Releases

A release may proceed with known technical debt only if:

- no critical debt exists
- no release-blocking high debt exists
- accepted debt is documented
- risks are understood
- mitigation is planned

---

# Technical Debt Review

Technical debt should be reviewed:

- during audits
- during milestone reviews
- before major releases
- after major refactoring

---

# Debt Budget

Each milestone should maintain a controlled debt budget.

New debt should be compared against resolved debt.

The objective is:

```text
New Debt

≤

Resolved Debt

```

over the long term.

If technical debt consistently increases, development priorities should be reassessed.

---

# Technical Debt Metrics

The following metrics may be tracked:

- total debt items
- critical debt
- high-priority debt
- average debt age
- debt created per milestone
- debt resolved per milestone
- overdue debt
- debt by category

---

# Escalation

Technical debt must be escalated when:

- it remains unresolved beyond its target milestone
- severity increases
- it blocks development
- it affects multiple domains
- it threatens release stability

Escalated debt should be reviewed by project leadership.

---

# Exceptions

Temporary exceptions may be granted when:

- experimentation is required
- gameplay validation is necessary
- a prototype is being developed
- a short-term performance tradeoff is justified

Exceptions must be documented.

---

# Technical Debt Closure

Debt may be closed only when:

- implementation corrected
- tests added or updated
- documentation updated
- Quality Gates passed
- original issue verified as resolved

---

# Reporting

Technical debt status should be reflected in:

```text
PROJECT_QUALITY_REPORT.md
```

Major technical debt findings should also be referenced in audit reports.

---

# Related Documents

- PROJECT_QUALITY_REPORT.md
- PROJECT_ROADMAP.md
- MILESTONE_PLAN.md
- QUALITY_GATES.md
- RELEASE_STRATEGY.md
- AUDIT_PROCESS.md

---

# Summary

Technical debt is managed as a controlled project liability.

The objective is not zero technical debt.

The objective is to ensure that every significant compromise is:

- known
- documented
- prioritized
- owned
- reviewed
- eventually resolved where appropriate

Project Genesis must never allow technical debt to become invisible or uncontrolled.