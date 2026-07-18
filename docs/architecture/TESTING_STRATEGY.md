# Testing Strategy

**Project:** Project Genesis

**Document:** Testing Strategy

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the testing strategy for Project Genesis.

The testing strategy ensures that the project remains:

- correct
- stable
- deterministic
- maintainable
- performant
- architecturally compliant
- resistant to regression

Testing is a continuous engineering activity.

It is not limited to release preparation.

---

# Testing Philosophy

Project Genesis follows these principles:

1. Test behaviour, not implementation details.
2. Prefer automated tests where practical.
3. Test critical domain rules extensively.
4. Protect deterministic simulation with automated regression tests.
5. Test failure paths as well as success paths.
6. Use the appropriate test level for each requirement.
7. Tests must be deterministic unless non-determinism is explicitly being tested.
8. Tests must be maintainable.
9. A passing test suite does not guarantee overall quality.
10. Tests complement architecture reviews, audits and manual validation.

---

# Testing Pyramid

Project Genesis follows a layered testing model.

```text
                 End-to-End Tests
                       ▲
                       │
                Integration Tests
                       ▲
                       │
                   Domain Tests
                       ▲
                       │
                  Unit Tests
```

The majority of tests should exist at the lower levels.

Higher-level tests should validate integration and critical user flows.

---

# Test Categories

The project uses the following categories:

1. Unit Tests
2. Domain Tests
3. Application Tests
4. Integration Tests
5. Simulation Tests
6. Regression Tests
7. Property-Based Tests
8. Performance Tests
9. End-to-End Tests
10. Manual Validation
11. Architecture Tests
12. Security Tests

---

# 1. Unit Tests

Unit tests validate small isolated units of behaviour.

Examples:

- Value Objects
- utility functions
- pure calculations
- algorithms
- mappers
- validators

Unit tests should be:

- fast
- deterministic
- isolated
- repeatable

---

# Unit Test Principles

Unit tests should:

- test one logical behaviour
- avoid unnecessary infrastructure
- avoid external dependencies
- use controlled inputs
- verify observable outcomes

Avoid testing implementation details that do not represent externally meaningful behaviour.

---

# 2. Domain Tests

Domain tests validate business rules and invariants.

Priority areas include:

- Entities
- Value Objects
- Aggregates
- Domain Services
- state transitions
- economic rules
- production rules
- resource rules

Domain tests are critical to Project Genesis.

---

# Domain Invariants

Critical domain invariants must have automated tests.

Examples:

```text
Money >= 0

Inventory >= 0

ProductionQuantity > 0

Capacity >= 0

ValidStateTransition = true
```

The exact invariants depend on the domain model.

---

# 3. Application Tests

Application tests validate use cases.

Examples:

```text
Create Production Order

Purchase Resources

Sell Products

Start Research

Save Game

Load Game
```

Application tests verify:

- orchestration
- command handling
- Result propagation
- validation
- domain interaction
- transaction behaviour

---

# 4. Integration Tests

Integration tests validate communication between components.

Examples:

```text
Application
    ↕
Domain

Application
    ↕
Persistence

Application
    ↕
Infrastructure

Simulation
    ↕
Persistence
```

Integration tests should verify actual boundaries where practical.

---

# Integration Test Scope

Integration tests may include:

- persistence
- filesystem
- databases
- asset loading
- serialization
- event dispatch
- infrastructure adapters

External services should be isolated or replaced with controlled test environments where possible.

---

# 5. Simulation Tests

Simulation testing is a core requirement for Project Genesis.

Simulation tests must validate:

- deterministic execution
- tick progression
- system ordering
- resource flows
- production
- economy
- logistics
- NPC behaviour
- state transitions

---

# Determinism Tests

The following principle must be tested:

```text
Same Initial State
+
Same Input
+
Same Seed

↓

Same Result
```

A deterministic simulation must produce equivalent results under identical conditions.

---

# Determinism Regression

Determinism tests should compare:

- simulation state
- relevant domain state
- event sequences
- resource quantities
- financial state

The comparison must use a defined equivalence model.

Not every runtime detail must be identical.

---

# Simulation Replay Tests

Where practical, simulation inputs should be recordable.

Example:

```text
Initial State
+
Seed
+
Input Sequence

↓

Replay

↓

Expected Final State
```

Replay testing is strongly recommended for complex simulation systems.

---

# Simulation Invariants

Simulation tests should verify invariants such as:

```text
Inventory >= 0

Money >= 0

No invalid entity references

No impossible state transitions

Resource conservation where applicable
```

---

# 6. Regression Tests

Regression tests prevent previously fixed problems from returning.

Every significant bug should result in:

```text
Bug Fixed

↓

Regression Test Added

↓

Fix Verified
```

Critical bugs must have automated regression protection where practical.

---

# Regression Test Naming

Regression tests should reference the relevant issue or audit finding where appropriate.

Example:

```text
test_AUD_001_F01_save_failure_is_reported
```

or:

```text
test_BUG_042_inventory_never_becomes_negative
```

---

# 7. Property-Based Tests

Property-based testing may be used where rules are better expressed as general properties.

Examples:

```text
For all valid quantities:

quantity > 0
```

```text
For all valid transactions:

balance_after = balance_before + income - expense
```

```text
For all valid simulations:

inventory >= 0
```

Property-based testing is especially useful for:

- economic systems
- resource systems
- state transitions
- simulation
- mathematical calculations

---

# 8. Performance Tests

Performance tests measure system behaviour under load.

Priority areas include:

- simulation tick processing
- large entity counts
- production chains
- logistics
- NPC populations
- save/load
- asset loading

---

# Performance Regression

Performance tests should detect significant regressions.

Metrics may include:

- average tick duration
- worst-case tick duration
- memory usage
- startup time
- save duration
- load duration

Performance thresholds should be defined based on project maturity.

---

# 9. End-to-End Tests

End-to-end tests validate complete workflows.

Examples:

```text
Start Application
    ↓
Create Company
    ↓
Acquire Resources
    ↓
Produce Goods
    ↓
Store Goods
    ↓
Sell Goods
    ↓
Observe Financial Result
```

End-to-end tests should focus on critical gameplay flows.

They should not attempt to cover every possible scenario.

---

# 10. Manual Validation

Automated tests do not replace manual validation.

Manual validation should cover:

- visual correctness
- UI usability
- player experience
- game feel
- visual feedback
- unexpected emergent behaviour

Manual validation is particularly important for:

- UI
- maps
- animations
- effects
- visual presentation

---

# 11. Architecture Tests

Architecture tests verify structural constraints.

Examples:

```text
Domain
    ↓
Must not depend on UI
```

```text
Domain
    ↓
Must not depend on Infrastructure
```

```text
Infrastructure
    ↓
Must implement defined interfaces
```

Architecture tests should prevent accidental dependency violations.

---

# 12. Security Tests

Security-sensitive systems should include tests for:

- invalid input
- malformed data
- unsafe paths
- serialization
- authentication boundaries where applicable
- permission handling

Security tests should be proportional to project requirements.

---

# Test Data

Test data should be:

- deterministic
- minimal
- readable
- reusable where appropriate

Avoid unnecessary dependency on large shared fixtures.

---

# Test Fixtures

Fixtures should represent meaningful domain states.

Examples:

```text
Empty Company

Small Factory

Large Factory

Resource Shortage

Market Crash

Full Storage

Bankrupt Company
```

Fixtures should be documented when their meaning is not obvious.

---

# Test Isolation

Tests should not depend on execution order.

Each test should establish its own required state.

Avoid:

```text
Test A modifies global state

↓

Test B depends on Test A
```

Prefer:

```text
Test A
Independent

Test B
Independent
```

---

# Test Determinism

Tests must produce repeatable results.

Avoid uncontrolled dependencies on:

- current time
- random numbers
- external services
- system state
- execution order

Where randomness is required:

```text
Use Explicit Seed
```

---

# Time in Tests

Time-dependent logic should use controllable time sources.

Avoid direct reliance on system time where deterministic behaviour is required.

Preferred:

```text
Clock Interface

↓

Controlled Test Clock
```

---

# Randomness in Tests

Random behaviour must be controllable.

Preferred:

```text
Random Seed
```

Tests should record seeds when failures occur.

Example:

```text
Test failed

Seed:
123456789
```

This allows reproduction.

---

# Test Naming

Test names should describe behaviour.

Preferred:

```text
production_fails_when_resources_are_insufficient
```

Avoid:

```text
test1
testProduction
```

---

# Arrange – Act – Assert

Tests should generally follow:

```text
Arrange

↓

Act

↓

Assert
```

Example:

```text
Arrange:
Factory has insufficient resources.

Act:
Start production.

Assert:
Result is Failure(InsufficientResources).
```

---

# Result Pattern Testing

Operations using:

```text
RESULT_PATTERN.md
```

must test both:

```text
Success
```

and:

```text
Failure
```

Expected failures should verify:

- correct error type
- correct error code
- correct propagation
- correct translation

---

# Validation Testing

Validation logic must test:

- valid input
- invalid input
- boundary conditions
- missing values
- malformed data
- multiple validation errors

Critical domain invariants must have automated regression protection.

---

# Error Handling Testing

Error handling must test:

- expected failures
- unexpected failures
- error propagation
- recovery behaviour
- fallback behaviour
- logging where appropriate

Tests should verify that errors do not silently disappear.

---

# Logging Testing

Logging tests should focus on meaningful behaviour.

Where critical, verify:

- correct severity
- required context
- correlation IDs
- sensitive data filtering

Avoid tests that depend excessively on exact message wording.

---

# Persistence Testing

Persistence systems must test:

- save
- load
- invalid data
- missing data
- version compatibility
- migration
- corruption handling

Savegame systems are considered critical.

---

# Savegame Compatibility Tests

Every savegame format change should include tests for:

```text
Old Version
    ↓
Migration
    ↓
New Version
    ↓
Validation
```

The resulting state must be valid.

---

# Test Coverage

Coverage should be measured where useful.

Track:

- line coverage
- branch coverage
- function coverage

Coverage must not be treated as the sole quality indicator.

High coverage does not guarantee meaningful tests.

---

# Critical Path Coverage

Priority should be given to:

- financial calculations
- production
- resource management
- logistics
- save/load
- simulation determinism
- domain invariants

---

# Coverage Targets

Initial guidance:

```text
Critical Domain Logic
    ≥ 90% target

Core Application Logic
    ≥ 80% target

Infrastructure
    Risk-based

UI
    Risk-based

Generated Code
    Exempt where appropriate
```

These are targets, not absolute guarantees.

Meaningful tests are more important than achieving arbitrary percentages.

---

# Test Execution

The test suite should be executable through automated tooling.

Recommended pipeline:

```text
Commit

↓

Static Analysis

↓

Unit Tests

↓

Domain Tests

↓

Integration Tests

↓

Simulation Tests

↓

Performance Tests

↓

Build
```

Not every test category must run on every commit.

---

# Continuous Integration

CI should automatically execute relevant tests.

At minimum:

- unit tests
- domain tests
- application tests
- architecture checks

Long-running tests may execute:

- nightly
- before milestones
- before releases

---

# Test Failure Policy

A failed critical test must not be ignored.

The following should block relevant quality gates:

- critical test failures
- deterministic simulation failures
- savegame corruption
- critical domain invariant failures

---

# Flaky Tests

Flaky tests are considered defects.

A flaky test should be:

1. identified
2. documented
3. isolated
4. fixed or quarantined temporarily

Quarantining a test must not become permanent neglect.

---

# Test Debt

Missing or insufficient tests constitute technical debt.

Test debt should be tracked in:

```text
TECHNICAL_DEBT_REGISTER.md
```

---

# Test and Technical Debt

Examples:

```text
Missing regression test
        ↓
Technical Debt

Insufficient simulation coverage
        ↓
Technical Debt

Untested save migration
        ↓
Potential Release Blocker
```

---

# Test and Quality Gates

The testing strategy supports:

```text
QUALITY_GATES.md
```

A release should not proceed with:

- failing critical tests
- known deterministic simulation failures
- unverified savegame migration
- unresolved critical domain invariant violations

---

# Test Review

Tests should be reviewed for:

- correctness
- readability
- maintainability
- determinism
- meaningful assertions

Tests should be treated as production code.

---

# Anti-Patterns

Avoid:

- testing implementation details unnecessarily
- relying only on manual testing
- ignoring flaky tests
- using uncontrolled randomness
- depending on test order
- excessive mocking
- giant integration tests for simple logic
- meaningless coverage-driven tests
- skipping regression tests for fixed critical bugs
- ignoring failing tests

---

# Adoption Strategy

Testing should be implemented incrementally.

Priority:

1. Critical domain invariants
2. Core business rules
3. Result and validation behaviour
4. Save/load
5. Simulation determinism
6. Application use cases
7. Integration boundaries
8. Performance
9. End-to-end workflows
10. UI and visual validation

---

# Migration

When adding tests to existing code:

```text
Identify Critical Behaviour

↓

Define Expected Behaviour

↓

Create Test

↓

Implement or Correct Behaviour

↓

Add Regression Protection

↓

Run Quality Gates

↓

Document Remaining Test Debt
```

---

# Quality Requirements

The testing architecture must provide:

- deterministic automated tests
- meaningful domain coverage
- regression protection
- simulation determinism validation
- savegame compatibility testing
- validation testing
- error handling testing
- architecture verification
- performance monitoring

---

# Related Documents

- ERROR_HANDLING_STRATEGY.md
- LOGGING_STRATEGY.md
- RESULT_PATTERN.md
- VALIDATION_STRATEGY.md
- PERFORMANCE_GUIDELINES.md
- QUALITY_GATES.md
- QUALITY_METRICS.md
- TECHNICAL_DEBT_POLICY.md
- TECHNICAL_DEBT_REGISTER.md
- AUDIT_PROCESS.md

---

# Summary

Testing is a core engineering discipline in Project Genesis.

The primary objective is not maximum test count or maximum coverage.

The objective is confidence.

Confidence that:

- domain rules are correct
- invalid states are rejected
- simulation remains deterministic
- critical workflows remain functional
- savegames remain compatible
- regressions are detected
- architecture remains compliant

A strong test suite allows Project Genesis to evolve without sacrificing stability or architectural integrity.