# Common Module

The `common` module contains the shared building blocks used throughout Project Genesis.

It provides generic, framework-independent components that are reused by multiple modules.

The Common Module should remain stable, lightweight and free of business-specific knowledge.

---

# Purpose

The purpose of this module is to provide reusable infrastructure for the domain and application layers without introducing unnecessary dependencies.

Everything inside `common` should be generic enough to be reused across the entire project.

---

# Responsibilities

Typical responsibilities include:

- Base domain abstractions
- Result handling
- Identifiers
- Value Objects
- Domain Events
- Event interfaces
- Guard utilities
- Validation helpers
- Time abstraction
- Shared utility types

No gameplay logic belongs here.

---

# Planned Structure

```text
common/

core/
  Entity.ts
  AggregateRoot.ts
  ValueObject.ts
  Identifier.ts

events/
  DomainEvent.ts
  EventBus.ts

errors/
  DomainError.ts
  ValidationError.ts

result/
  Result.ts

time/
  Clock.ts

validation/
  Guard.ts

types/
  Maybe.ts
  Nullable.ts
  DeepReadonly.ts
```

The exact structure may evolve during implementation.

---

# Base Classes

## Entity

Represents an object with a stable identity.

Examples:

- Company
- Building
- Region
- Employee

---

## AggregateRoot

Represents the root of an aggregate.

Responsibilities:

- Entity identity
- Domain Event collection
- Aggregate consistency

Only Aggregate Roots should be loaded and persisted through repositories.

---

## ValueObject

Represents immutable values.

Examples:

- Money
- Percentage
- Coordinate
- ProductionRate

Value Objects are compared by value rather than identity.

---

## Identifier

Provides strongly typed identifiers.

Examples:

```text
CompanyId
BuildingId
RecipeId
ResourceId
```

Identifiers should not be represented as plain strings throughout the codebase.

---

# Result Pattern

The project prefers explicit result handling.

Example:

```text
Result<T>
Success<T>
Failure
```

Expected business failures should not rely on exceptions.

---

# Domain Events

Domain Events describe something that has already happened.

Examples:

- CompanyCreated
- ProductionStarted
- TechnologyResearched
- MarketPriceChanged

Events are immutable.

---

# Event Bus

The Event Bus distributes Domain Events between modules.

Responsibilities:

- publish events
- subscribe handlers
- preserve deterministic execution order

The Event Bus should not contain business logic.

---

# Clock

Time should always be abstracted.

Never call:

```typescript
Date.now()
new Date()
```

directly inside business logic.

Instead use:

```text
Clock
```

This improves determinism and testability.

---

# Validation

Shared validation helpers belong here.

Example:

```text
Guard.againstNull()

Guard.againstNegative()

Guard.againstEmptyString()
```

Validation should be centralized where appropriate.

---

# Utility Types

Examples:

```text
Maybe<T>

Nullable<T>

Optional<T>

DeepReadonly<T>
```

Only include utility types that are genuinely reused.

---

# Dependency Rules

The Common Module may not depend on:

- Domain
- Application
- Simulation
- Infrastructure
- UI
- Content

It should remain as independent as possible.

All other modules may depend on `common`.

---

# Design Principles

Components should be:

- generic
- deterministic
- immutable where practical
- reusable
- framework-independent
- highly testable

Avoid adding project-specific behavior.

---

# Testing

Every public component should include unit tests.

Examples:

- Entity equality
- Value Object equality
- Result handling
- Identifier validation
- Guard functions
- Event dispatch

---

# Future Extensions

Possible future additions:

- Strongly typed collections
- Functional helper utilities
- Generic state machine support
- Shared serialization helpers

These should only be introduced when justified by actual usage.

---

# Related Documentation

- docs/architecture/DDD.md
- docs/architecture/domain-model.md
- docs/architecture/component-diagram.md
- docs/decisions/DD-003-global-identifiers.md
- docs/decisions/DD-029-dependency-injection.md
- docs/decisions/DD-032-error-handling-strategy.md

---

# Summary

The Common Module forms the technical foundation of Project Genesis.

It provides reusable abstractions that support the domain model while remaining independent of business logic, infrastructure and user interface concerns.