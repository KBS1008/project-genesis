# Cursor AI Implementation Guide

Version: 1.0

Status: Active

---

# Purpose

This document defines the implementation workflow for Cursor AI.

Its purpose is to ensure that every generated source file follows the documented architecture, domain model and development standards of Project Genesis.

Cursor should always prioritize consistency over speed.

---

# Architecture First

Before implementing any feature, Cursor must treat the documentation as the authoritative source.

Implementation must never redefine architecture.

If documentation and requested implementation conflict, documentation wins until explicitly updated.

---

# Required Reading Order

Before implementing a feature, Cursor should review the following documents.

**Also review:** `docs/development/IMPLEMENTATION_PROGRESS.md` for current implementation status.

## Architecture

Read in this order:

1. docs/architecture/SAD.md
2. docs/architecture/DDD.md
3. docs/architecture/domain-model.md
4. docs/architecture/bounded-contexts.md
5. docs/architecture/component-diagram.md
6. docs/architecture/runtime-view.md
7. docs/architecture/system-context.md
8. docs/architecture/deployment-view.md

---

## Architecture Decisions

Review all relevant ADRs.

At minimum:

- DD-000
- DD-003
- DD-004
- DD-005
- DD-006
- DD-008
- DD-009
- DD-010
- DD-011
- DD-027
- DD-029
- DD-031
- DD-032
- DD-036

---

## Gameplay Documentation

Review all relevant gameplay documentation before implementing business logic.

Gameplay documents define the intended behaviour.

Implementation must not invent gameplay rules.

---

## Module Documentation

Read the README of the module being modified.

Example:

```
src/domain/README.md
```

Module rules always apply.

---

# Implementation Principles

Every implementation should follow:

- Clean Architecture
- Domain-Driven Design
- SOLID
- Documentation First
- Data-Driven Design
- Event-Driven Architecture
- Deterministic Simulation

---

# General Rules

Cursor should:

- implement the smallest correct solution
- avoid unnecessary abstractions
- avoid speculative features
- prefer readability
- keep classes cohesive
- minimize coupling
- write self-documenting code

---

# Forbidden

Cursor must never:

- change architecture silently
- move responsibilities between layers
- duplicate business logic
- bypass repository interfaces
- introduce global mutable state
- introduce magic numbers
- add undocumented dependencies
- ignore ADRs

---

# Layer Rules

## Domain

Contains only business logic.

Must never depend on:

- UI
- Infrastructure
- Application

---

## Application

Coordinates use cases.

Contains no business rules.

---

## Infrastructure

Contains technical implementations.

Implements interfaces.

Never defines business rules.

---

## Simulation

Coordinates deterministic execution.

Must never define gameplay rules.

---

## UI

Presentation only.

Must never contain business logic.

---

# Dependency Rules

Allowed dependencies are defined in:

- src/README.md

Cursor must not introduce dependencies outside the documented architecture.

---

# Determinism

Simulation code must always be deterministic.

Forbidden:

- Date.now()
- new Date()
- Math.random()

Instead use documented abstractions.

---

# Error Handling

Prefer:

- Result<T>
- DomainError
- ValidationResult

Avoid exceptions for expected business outcomes.

---

# TypeScript Rules

Always enable strict typing.

Never use:

```
any
```

Prefer:

- unknown
- generics
- discriminated unions
- explicit interfaces

---

# Imports

Prefer module aliases.

Example:

```typescript
import { Company } from '@domain/company/company.js';
```

Avoid deep relative imports.

---

# Naming

Names should be:

- explicit
- domain-oriented
- singular for entities
- plural for collections

Avoid abbreviations.

---

# Comments

Only explain:

- intent
- non-obvious decisions
- algorithms

Do not explain obvious code.

---

# Testing Requirements

Every implementation should include appropriate tests.

Minimum expectations:

- happy path
- validation
- edge cases
- error handling

Business logic requires unit tests.

---

# Documentation Updates

Cursor should identify documentation that may require updates.

Possible updates include:

- README
- Architecture documents
- ADRs
- Gameplay documentation

Cursor should suggest updates rather than silently changing documentation.

---

# Architecture Changes

If implementation requires an architectural change:

STOP.

Do not implement immediately.

Instead:

1. Explain the issue.
2. Recommend a new ADR.
3. Wait for approval.

---

# Performance

Prefer:

- predictable execution
- deterministic behaviour
- maintainability

Avoid premature optimization.

---

# Code Review Checklist

Before considering a task complete, verify:

- Architecture respected
- Module rules respected
- No forbidden dependencies
- No duplicated logic
- No magic numbers
- Tests included
- Documentation considered
- Imports use aliases
- Strict typing maintained

---

# Pull Request Checklist

Each implementation should answer:

- What changed?
- Why was it necessary?
- Which documentation was used?
- Which ADRs were followed?
- Were new ADRs required?
- Which tests were added?

---

# Definition of Done

Implementation is complete only if:

- code compiles
- tests pass
- architecture is respected
- documentation remains consistent
- no warnings remain
- implementation is deterministic

---

# Summary

Cursor AI is an implementation assistant.

Architecture decisions belong to the project documentation.

Whenever uncertainty exists, documentation always takes precedence over implementation.