# Quality Metrics

**Project:** Project Genesis

**Document:** Quality Metrics

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the quality metrics used to evaluate the health, maturity and stability of Project Genesis.

Metrics provide objective indicators that complement:

- audits
- code reviews
- quality gates
- milestone reviews
- release reviews

Metrics must support decision-making.

They must not become targets that encourage unhealthy development behaviour.

---

# Quality Measurement Philosophy

Project Genesis follows a balanced quality measurement approach.

No single metric is sufficient to determine software quality.

Metrics should be interpreted together with:

- architectural context
- project maturity
- development phase
- known technical debt
- audit findings
- gameplay requirements

Metrics should identify trends rather than create artificial targets.

---

# Metric Categories

Quality metrics are grouped into:

1. Architecture
2. Code Quality
3. Testing
4. Reliability
5. Performance
6. Documentation
7. Technical Debt
8. Security
9. Release Quality
10. Development Health

---

# 1. Architecture Metrics

## Architecture Violations

Measures the number of known architecture violations.

Target:

```text
0 critical violations
0 high-severity violations
```

---

## Dependency Violations

Measures invalid dependencies between architectural layers.

Target:

```text
0
```

---

## Circular Dependencies

Measures circular dependencies between modules.

Target:

```text
0
```

---

## Domain Isolation

Measures whether domain code remains independent from infrastructure and UI concerns.

Target:

```text
100% compliant
```

---

# 2. Code Quality Metrics

## Static Analysis Findings

Measures issues detected by automated analysis.

Track:

- critical
- high
- medium
- low

Critical and high findings should be reviewed immediately.

---

## Code Duplication

Measures duplicated logic.

The goal is not zero duplication.

Intentional duplication may be acceptable when it improves clarity or domain separation.

---

## Complexity

Monitor:

- cyclomatic complexity
- cognitive complexity
- excessively large functions
- excessively large modules

High complexity should trigger review.

---

# 3. Testing Metrics

## Test Coverage

Measure coverage where meaningful.

Track:

- line coverage
- branch coverage
- function coverage

Coverage must not be treated as the sole indicator of test quality.

---

## Test Success Rate

Target:

```text
100% passing tests
```

Failed tests must not be ignored.

---

## Regression Rate

Measure how often previously working functionality breaks.

Target:

```text
Continuous reduction
```

---

## Simulation Test Coverage

Track coverage of important simulation systems.

Priority areas:

- production
- economy
- transport
- market
- finance
- NPC behaviour

---

# 4. Reliability Metrics

## Crash Rate

Measure application crashes.

Target:

```text
0 critical crashes
```

---

## Critical Bug Count

Target:

```text
0 open critical bugs before release
```

---

## Recovery Success

Measure whether recoverable errors can be handled without data loss.

Priority areas:

- savegames
- loading
- simulation state
- asset loading

---

# 5. Performance Metrics

## Tick Duration

Measure:

- average tick duration
- median tick duration
- worst-case tick duration

---

## Tick Stability

Measure variation in tick processing time.

Large unexpected spikes should be investigated.

---

## Memory Usage

Track:

- startup memory
- average memory
- peak memory

---

## Save/Load Performance

Measure:

- save duration
- load duration

---

# 6. Documentation Metrics

## Documentation Coverage

Track whether major systems have corresponding documentation.

Target:

```text
100% of major systems documented
```

---

## Documentation Compliance

Measure the percentage of reviewed documentation that matches the implementation.

Target:

```text
≥ 95%
```

---

## Outdated Documentation

Track documents that no longer reflect the implementation.

Target:

```text
0 critical outdated documents
```

---

# 7. Technical Debt Metrics

Track:

- total debt items
- critical debt
- high-priority debt
- medium debt
- overdue debt
- average debt age

---

## Debt Trend

Compare:

```text
Debt Created

vs

Debt Resolved
```

Long-term objective:

```text
Resolved Debt ≥ Created Debt
```

---

# 8. Security Metrics

Track:

- critical vulnerabilities
- high vulnerabilities
- outdated dependencies
- unsafe input paths
- security audit findings

Target:

```text
0 critical vulnerabilities
0 known release-blocking vulnerabilities
```

---

# 9. Release Metrics

Track:

- release-blocking bugs
- failed release candidates
- rollback events
- post-release incidents
- hotfix frequency

Healthy releases should show decreasing critical defects over time.

---

# 10. Development Health Metrics

Track:

- milestone completion
- overdue milestones
- open audit findings
- unresolved high-priority risks
- technical debt growth

These metrics help identify project health problems before they become technical problems.

---

# Quality Dashboard

A future quality dashboard should summarize:

```text
Architecture

Code Quality

Testing

Reliability

Performance

Documentation

Technical Debt

Security

Release Health
```

The dashboard should focus on trends.

---

# Metric Status

Metrics should be classified as:

| Status | Meaning            |
| ------ | ------------------ |
| Green  | Healthy            |
| Yellow | Requires attention |
| Red    | Requires action    |

Status thresholds should be defined according to project maturity.

---

# Metric Review Frequency

## Development

Review when meaningful data is available.

## Milestone

Review at milestone completion.

## Audit

Review during formal audits.

## Release

Review before major releases.

---

# Metric Ownership

Each metric should have:

- definition
- data source
- measurement frequency
- responsible owner
- target or acceptable range

---

# Metric Integrity

Metrics must be:

- reproducible
- traceable
- consistently measured
- interpreted in context

Metrics must never be manipulated to improve project reporting.

---

# Metrics and AI

AI-assisted development may use metrics to identify:

- regressions
- architecture violations
- test gaps
- documentation gaps
- technical debt

AI must not fabricate metrics.

If data is unavailable, the metric must be marked:

```text
Unknown
```

rather than estimated without evidence.

---

# Quality Trend

The primary objective is continuous improvement.

The project should aim for:

```text
Fewer Critical Issues
        ↓
Lower Technical Debt
        ↓
Higher Test Confidence
        ↓
Stable Performance
        ↓
Higher Release Confidence
```

---

# Reporting

Quality metrics should be summarized in:

```text
PROJECT_QUALITY_REPORT.md
```

Detailed technical debt information is maintained in:

```text
TECHNICAL_DEBT_REGISTER.md
```

---

# Related Documents

- PROJECT_QUALITY_REPORT.md
- QUALITY_GATES.md
- AUDIT_PROCESS.md
- TECHNICAL_DEBT_POLICY.md
- TECHNICAL_DEBT_REGISTER.md
- RELEASE_STRATEGY.md

---

# Summary

Quality metrics provide objective visibility into the health of Project Genesis.

Metrics support decisions but do not replace engineering judgment.

The goal is not to maximize numbers.

The goal is to maintain a stable, maintainable, testable and continuously improving project.
