# Result Pattern

**Project:** Project Genesis

**Document:** Result Pattern

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the standard Result Pattern for Project Genesis.

The Result Pattern provides a consistent way to represent the outcome of operations without relying on exceptions for expected business failures.

It is primarily used for operations that may legitimately produce either:

- a successful result
- a known failure

The pattern supports:

- explicit error handling
- predictable control flow
- type safety
- domain integrity
- testability
- clear separation between expected failures and unexpected system failures

---

# Core Principle

Operations should make their possible outcomes explicit.

Instead of:

```text
Function
    ↓
Value
or
Exception
```

the preferred pattern is:

```text
Function
    ↓
Result<T, E>
    ├── Success<T>
    └── Failure<E>
```

This makes expected failure part of the operation's contract.

---

# Result Structure

A Result represents exactly one of two states:

```text
Success
    OR
Failure
```

A Result must never represent both simultaneously.

A Result must never represent neither.

Conceptually:

```text
Result<T, E>

    Success
        value: T

    Failure
        error: E
```

---

# Success

A successful operation returns a Result containing the expected value.

Example:

```text
Result<ProductionOrder, ProductionError>
```

Success:

```text
{
    success: true,
    value: ProductionOrder
}
```

The success value must represent a valid result.

---

# Failure

A failed operation returns a Result containing a structured error.

Example:

```text
Result<ProductionOrder, ProductionError>
```

Failure:

```text
{
    success: false,
    error: ProductionError
}
```

The error must follow:

```text
ERROR_HANDLING_STRATEGY.md
```

---

# Conceptual Type

The canonical conceptual structure is:

```typescript
type Result<T, E> =
    | {
        success: true
        value: T
      }
    | {
        success: false
        error: E
      }
```

The exact implementation may vary.

The semantic contract must remain consistent.

---

# Generic Parameters

The Result Pattern uses two conceptual type parameters.

```text
T = Success Value

E = Error Type
```

Example:

```text
Result<Money, InsufficientFundsError>
```

This means:

```text
Success → Money

Failure → InsufficientFundsError
```

---

# Result and Exceptions

The Result Pattern does not eliminate exceptions.

It distinguishes between:

```text
Expected Failure

vs

Unexpected Failure
```

---

# Expected Failures

Expected failures should normally use Result.

Examples:

- insufficient funds
- invalid production order
- missing required resource
- invalid state transition
- unavailable market
- insufficient storage capacity

Example:

```text
Result<ProductionOrder, ProductionError>
```

---

# Unexpected Failures

Unexpected failures may use exceptions or equivalent mechanisms.

Examples:

- programming errors
- corrupted runtime state
- infrastructure crashes
- unexpected system failures
- impossible internal states

Unexpected failures should be handled according to:

```text
ERROR_HANDLING_STRATEGY.md
```

---

# Rule

Use:

```text
Result
```

for expected, recoverable or domain-relevant failures.

Use:

```text
Exception / Panic / Fatal Error
```

for unexpected failures that cannot reasonably be represented as part of the normal operation contract.

---

# Domain Layer

The Domain Layer should prefer explicit Results for business operations.

Example:

```text
ProductionOrder.create(...)
        ↓
Result<ProductionOrder, ProductionOrderError>
```

Possible failures:

```text
InvalidQuantity
InvalidProduct
InsufficientResources
InvalidState
```

The Domain Layer must not depend on infrastructure-specific error types.

---

# Application Layer

The Application Layer coordinates use cases.

Example:

```text
CreateProductionOrderUseCase
        ↓
Result<ProductionOrderDTO, ApplicationError>
```

The Application Layer may:

- translate domain errors
- add application context
- coordinate multiple Results
- return DTOs

---

# Infrastructure Layer

Infrastructure operations may use Results when failures are expected and recoverable.

Examples:

- file not found
- asset unavailable
- savegame invalid
- database unavailable

Infrastructure errors should remain infrastructure-specific until translated at an appropriate boundary.

---

# UI Layer

The UI should not expose raw technical errors to users.

Example:

```text
Domain Error
    ↓
Application Error
    ↓
Presentation Message
```

The UI should translate errors into meaningful user-facing feedback.

Example:

```text
InsufficientFunds
        ↓
"You do not have enough funds to complete this transaction."
```

---

# Error Translation

Errors may be translated between architectural layers.

Example:

```text
InfrastructureError
        ↓
ApplicationError
        ↓
User-facing Message
```

Translation must preserve meaningful information.

Do not discard the original cause when it is useful for diagnostics.

---

# Error Mapping

A layer may map errors into a more appropriate abstraction.

Example:

```text
DatabaseConnectionError
        ↓
PersistenceError
        ↓
ApplicationError
```

The Domain Layer must not become dependent on:

- database errors
- filesystem errors
- network errors
- UI errors

---

# Result Composition

Results should be composable.

Conceptually:

```text
Result A
    ↓
Result B
    ↓
Result C
```

If an intermediate operation fails:

```text
Failure
    ↓
Stop or recover
```

The failure should propagate explicitly.

---

# Example

```text
Create Production Order
        ↓
Check Resources
        ↓
Reserve Resources
        ↓
Create Order
```

Possible flow:

```text
Create Order
    ↓
Success
    ↓
Check Resources
    ↓
Failure: InsufficientResources
```

The final Result should represent the failure.

---

# Result Chaining

Operations may be chained when each operation depends on the previous success.

Conceptually:

```text
Result<A>
    ↓
Result<B>
    ↓
Result<C>
```

This should avoid deeply nested conditional structures.

The implementation should remain readable.

---

# Multiple Errors

An operation may produce multiple validation errors.

In such cases, the error type may contain a collection.

Example:

```text
ValidationError
    ├── InvalidQuantity
    ├── MissingResource
    └── InvalidDestination
```

The distinction between:

```text
single failure
```

and:

```text
validation failure collection
```

must remain explicit.

---

# Result vs Optional

Result and Optional represent different concepts.

Use:

```text
Optional<T>
```

when a value may legitimately be absent.

Example:

```text
FindEntity(id)
    ↓
Entity
or
None
```

Use:

```text
Result<T, E>
```

when failure has meaningful information.

Example:

```text
LoadEntity(id)
    ↓
Entity
or
EntityLoadError
```

---

# Result vs Boolean

Avoid using Boolean values as the primary representation of meaningful operation outcomes.

Avoid:

```text
true
false
```

when the caller needs to know why an operation failed.

Prefer:

```text
Result<void, Error>
```

or an equivalent explicit result.

---

# Result vs Null

Avoid using:

```text
null
```

to represent expected failures.

Null should represent absence where appropriate.

Failures should use explicit error types.

---

# Result and Domain Invariants

The Result Pattern must not allow invalid domain states to escape successful operations.

Example:

```text
Result<ProductionOrder, ProductionError>
```

A successful Result must contain a valid ProductionOrder.

Invalid objects must not be returned as success values.

---

# Result and Transactions

When multiple operations form a logical transaction, partial success must be handled explicitly.

Example:

```text
Reserve Resources
        ↓
Create Order
        ↓
Start Production
```

If a later operation fails, the system must define whether:

- previous operations are rolled back
- the state remains partially committed
- compensation is required

The Result Pattern does not automatically provide transaction semantics.

Transaction behaviour must be defined by the responsible application or domain logic.

---

# Result and Persistence

Persistence operations should explicitly represent expected failures.

Example:

```text
Result<SaveGameId, SaveGameError>
```

Possible failures:

```text
InvalidPath
PermissionDenied
SerializationFailed
WriteFailed
```

---

# Result and Simulation

Simulation systems should avoid exceptions for expected gameplay conditions.

Example:

```text
ProductionSystem.process(...)
```

may return:

```text
Result<ProductionResult, ProductionError>
```

Expected simulation conditions should remain explicit.

Unexpected programming or infrastructure failures should follow the Error Handling Strategy.

---

# Result and Determinism

The Result Pattern must not introduce non-deterministic behaviour.

For deterministic simulation:

```text
Same Input
+
Same State
+
Same Seed

↓

Same Result
```

Result creation must not depend on:

- current time
- random values
- external state

unless those values are explicitly part of the simulation input.

---

# Result and Logging

Results do not automatically require logging.

A Result represents an operation outcome.

Logging represents observability.

Expected domain failures should not automatically be logged as ERROR.

Example:

```text
InsufficientFunds
```

may be a normal gameplay outcome.

It may be represented as:

```text
Result.failure(InsufficientFunds)
```

without producing an ERROR log.

Unexpected failures should be handled according to:

```text
ERROR_HANDLING_STRATEGY.md
```

and:

```text
LOGGING_STRATEGY.md
```

---

# Result Handling Rules

Callers must explicitly handle the Result.

Avoid:

```text
Ignore Result
```

Avoid:

```text
Assume Success
```

Avoid:

```text
Extract Value Without Checking
```

Prefer:

```text
Match Result

    Success
        ↓
    Continue

    Failure
        ↓
    Handle
```

---

# Error Propagation

If a caller cannot meaningfully recover from an error, it should propagate the error to a higher-level boundary.

Example:

```text
Repository
    ↓
Application Service
    ↓
Use Case
    ↓
Presentation Boundary
```

The error should be translated only when necessary.

---

# Result API

A Result implementation should provide operations equivalent to:

```text
isSuccess()

isFailure()

getValue()

getError()

map()

mapError()

flatMap()

fold()
```

The exact API depends on the implementation language.

---

# Anti-Patterns

Avoid:

- returning null for meaningful failures
- returning false without error context
- throwing exceptions for normal domain failures
- swallowing Result failures
- ignoring Results
- returning invalid objects as success
- leaking infrastructure errors into the domain
- logging every expected Result failure as ERROR
- mixing Result semantics inconsistently across layers

---

# Testing

Result-based operations should test:

- success case
- expected failure cases
- error propagation
- error translation
- invalid inputs
- edge cases

Example:

```text
Given valid input
When operation executes
Then Result is Success
```

Example:

```text
Given insufficient resources
When operation executes
Then Result is Failure(InsufficientResources)
```

---

# Quality Requirements

The Result Pattern must provide:

- explicit success state
- explicit failure state
- typed errors where possible
- predictable control flow
- architectural separation
- testability
- compatibility with deterministic simulation

---

# Adoption Strategy

The Result Pattern should be adopted incrementally.

Priority should be given to:

1. Domain operations
2. Application use cases
3. Persistence boundaries
4. Simulation systems
5. Infrastructure operations

Existing code should not be rewritten solely for pattern compliance unless the change provides meaningful architectural or reliability benefits.

---

# Migration

When migrating existing code:

```text
Existing Operation

↓

Identify Expected Failures

↓

Define Error Types

↓

Introduce Result

↓

Update Callers

↓

Add Tests

↓

Update Documentation

↓

Pass Quality Gates
```

Migration should avoid introducing unnecessary breaking changes.

---

# Related Documents

- ERROR_HANDLING_STRATEGY.md
- LOGGING_STRATEGY.md
- VALIDATION_STRATEGY.md
- TESTING_STRATEGY.md
- QUALITY_GATES.md
- AUDIT_PROCESS.md

---

# Summary

The Result Pattern provides a consistent and explicit mechanism for representing expected operation outcomes.

It separates:

```text
Expected Business Failure
```

from:

```text
Unexpected System Failure
```

This improves:

- type safety
- readability
- error handling
- testability
- architecture
- deterministic simulation

The Result Pattern is a core architectural convention for Project Genesis.