# Release Strategy

**Project:** Project Genesis

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the official release strategy for Project Genesis.

It describes how the project moves from active development through internal milestones, prototype releases, alpha, beta, release candidate and final production release.

The objective is to ensure that every release is:

- stable
- reproducible
- documented
- tested
- architecturally compliant
- recoverable
- traceable

A release is not defined only by a version number.

A release represents a verified state of the entire project.

---

# Release Philosophy

Project Genesis follows a quality-driven incremental release strategy.

The project prioritizes:

- stability over speed
- reproducibility over convenience
- documented changes over undocumented changes
- automated validation over manual assumptions
- deterministic simulation over uncontrolled behaviour

Every release should improve the project without compromising architectural integrity.

---

# Release Lifecycle

The official release lifecycle is:

```text
Development

↓

Internal Build

↓

Milestone Review

↓

Quality Gates

↓

Release Candidate

↓

Release Validation

↓

Release

↓

Post-Release Review
```

---

# Current Release Status (2026-09-02)

| Item | Status |
|------|--------|
| Formal RC | `v1.0.0-rc.1` @ `442665c` |
| Savegames / Performance / QA | Certified PASS (M12.5–M12.7) |
| Final documentation | M12.8 |
| Version 1.0 tag | **Not yet applied** — M12.9 Executive Review |
| Package metadata | `0.1.0` until M12.9 |

Operator documentation:

- [`README.md`](../../README.md)
- [`docs/development/RC_RUNTIME_CONTRACT.md`](../development/RC_RUNTIME_CONTRACT.md)
- [`docs/releases/V1_0_RELEASE_NOTES.md`](../releases/V1_0_RELEASE_NOTES.md)
- [`docs/releases/V1_0_KNOWN_ISSUES.md`](../releases/V1_0_KNOWN_ISSUES.md)
