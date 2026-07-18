# Validation Strategy

**Project:** Project Genesis

**Document:** Validation Strategy

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the validation strategy for Project Genesis.

Validation ensures that:

- inputs are valid
- domain invariants are preserved
- invalid states do not enter the system
- invalid state transitions are rejected
- external data is verified before use
- application boundaries remain safe
- simulation state remains consistent

Validation is a core architectural responsibility.

---

# Validation Philosophy

Project Genesis follows these principles:

1. Validate at the appropriate boundary.
2. Validate as early as practical.
3. Never trust external input.
4. Domain invariants belong to the Domain Layer.
5. Validation must not replace domain rules.
6. Validation must not replace error handling.
7. Validation must produce explicit results.
8. Validation must be deterministic where required.
9. Validation should avoid unnecessary duplication.
10. Invalid states should be prevented rather than repaired later.

---

# Validation vs Error Handling

Validation and error handling serve different purposes.

Validation answers:

```text
Is this input or state valid?
```

Error handling answers:

```text
What should happen if something fails?
```

Example:

```text
Input
    ↓
Validation
    ↓
Invalid
    ↓
Result<Failure>
    ↓
Error Handling
```

Validation determines validity.

Error handling determines the response.

---

# Validation vs Business Rules

Validation checks whether input or state satisfies defined constraints.

Business rules define how the domain behaves.

Example:

```text
Validation:
Quantity must be greater than zero.

Business Rule:
A factory may only produce a product if required resources are available.
```

The distinction must remain clear.

---

# Validation Layers

Validation is distributed across architectural boundaries.

Recommended layers:

```text
External Input Validation
        ↓
Application Validation
        ↓
Domain Validation
        ↓
Infrastructure Validation
```

Each layer has a specific responsibility.

---

# 1. External Input Validation

External input includes:

- UI input
- configuration
- savegames
- network input
- imported data
- files
- external services

External input must be considered untrusted.

Examples:

```text
Null values
Invalid formats
Invalid ranges
Missing fields
Unknown identifiers
Malformed data
```

External input must be validated before entering trusted application logic.

---

# 2. Application Validation

The Application Layer validates use-case-specific requirements.

Examples:

- required parameters
- authorization context
- command completeness
- use-case preconditions
- valid workflow state

Application validation should not contain deep domain rules that belong to the Domain Layer.

---

# 3. Domain Validation

The Domain Layer protects domain invariants.

Examples:

- money cannot be negative
- production quantity must be valid
- inventory cannot become negative
- invalid state transitions are rejected
- required relationships must exist

Domain validation is authoritative.

No outer layer may bypass domain invariants.

---

# 4. Infrastructure Validation

Infrastructure validation protects technical boundaries.

Examples:

- file format
- serialization
- database schema
- asset format
- resource availability
- configuration format

Infrastructure validation must occur before data is passed into the application or domain.

---

# Validation Boundaries

Validation should occur at trust boundaries.

Examples:

```text
User Input
    ↓
Validation

File
    ↓
Validation

Savegame
    ↓
Validation

Network
    ↓
Validation

External API
    ↓
Validation
```

Internal trusted domain objects should not be repeatedly revalidated without reason.

---

# Fail-Fast Principle

Invalid input should normally be rejected as early as possible.

Preferred:

```text
Invalid Input
    ↓
Reject
```

Avoid:

```text
Invalid Input
    ↓
Process
    ↓
Partial State
    ↓
Failure Later
```

Early rejection reduces cascading failures.

---

# Domain Invariants

Domain invariants must always be protected.

Examples:

```text
Inventory >= 0

Money >= 0

ProductionQuantity > 0

Capacity >= 0

ValidStateTransition = true
```

The exact invariants depend on the domain model.

---

# Invariant Ownership

Every invariant must have a clear owner.

Possible owners:

- Value Object
- Entity
- Aggregate
- Domain Service
- Application Service

The owner must be responsible for enforcing the invariant.

---

# Value Object Validation

Value Objects should validate their own invariants.

Example:

```text
Money
    amount >= 0
```

Example:

```text
ProductionQuantity
    quantity > 0
```

Invalid Value Objects should not be constructible.

Conceptually:

```text
Create Value Object
        ↓
Validate
        ↓
Success
or
Failure
```

---

# Entity Validation

Entities must maintain their own invariants throughout their lifecycle.

Validation is required:

- during creation
- during state changes
- during important transitions

An Entity must not become invalid through public operations.

---

# Aggregate Validation

Aggregates protect consistency boundaries.

The Aggregate Root is responsible for enforcing invariants across the Aggregate.

Example:

```text
Factory Aggregate

Factory
    ├── Production Orders
    ├── Inventory
    └── Production State
```

Operations affecting multiple Aggregate members must preserve consistency.

---

# Domain Service Validation

Domain Services may validate rules that:

- involve multiple Aggregates
- do not naturally belong to one Entity
- require domain-wide coordination

Domain Services must not become general-purpose validation containers.

---

# Command Validation

Commands should be validated before execution.

Example:

```text
CreateProductionOrderCommand
```

Validation may include:

- product ID present
- quantity valid
- factory ID present
- destination valid

The Domain Layer must still enforce domain invariants.

---

# Query Validation

Queries should validate:

- required parameters
- identifier format
- pagination limits
- sorting options
- filter constraints

Query validation should avoid unnecessary domain logic.

---

# Validation Results

Validation failures should use explicit result semantics.

Preferred:

```text
Result<ValidInput, ValidationError>
```

or:

```text
ValidationResult
```

Validation errors should be structured.

---

# Validation Errors

A validation error should contain sufficient information to identify the problem.

Possible fields:

```text
code
field
message
value
constraint
```

Example:

```text
ValidationError

code:
INVALID_QUANTITY

field:
quantity

constraint:
quantity > 0
```

Sensitive values should not be exposed.

---

# Multiple Validation Errors

When appropriate, validation may collect multiple failures.

Example:

```text
CreateProductionOrder

Errors:
    INVALID_PRODUCT
    INVALID_QUANTITY
    MISSING_FACTORY
```

This is useful for:

- forms
- commands
- configuration
- imported data

The caller should be able to distinguish:

```text
single failure
```

from:

```text
multiple validation failures
```

---

# Validation and Result Pattern

Validation should integrate with:

```text
RESULT_PATTERN.md
```

Example:

```text
Input
    ↓
Validate
    ↓
Result<ValidatedInput, ValidationError>
```

The Result Pattern defines how the outcome is represented.

The Validation Strategy defines what is validated.

---

# Validation and Error Handling

Validation failures are normally expected failures.

Therefore:

```text
Validation Failure
    ↓
Result Failure
```

Validation failures should not normally throw exceptions.

Unexpected validation infrastructure failures should follow:

```text
ERROR_HANDLING_STRATEGY.md
```

---

# Validation and Logging

Expected validation failures should not normally be logged as ERROR.

Example:

```text
User entered invalid quantity.
```

This is expected application behaviour.

It may be logged at DEBUG if diagnostic context is useful.

Unexpected validation failures may require WARN or ERROR logging.

---

# Validation and Determinism

Simulation validation must be deterministic.

Given:

```text
Same Input
+
Same State
+
Same Seed
```

validation must produce:

```text
Same Result
```

Validation must not depend on:

- system time
- random values
- external mutable state

unless explicitly part of the simulation input.

---

# Simulation Validation

Simulation systems should validate:

- input commands
- state transitions
- resource constraints
- entity relationships
- simulation invariants

Validation must not introduce unnecessary per-tick overhead.

High-frequency validation should be optimized.

---

# Runtime Validation

Runtime validation protects critical invariants.

Examples:

```text
Inventory cannot be negative.

Money cannot become NaN.

Entity references must remain valid.

Simulation state must remain consistent.
```

Critical runtime invariants should be checked continuously where necessary.

---

# Debug Validation

Development builds may perform additional validation.

Examples:

- expensive consistency checks
- aggregate validation
- reference validation
- invariant verification

These checks may be reduced or disabled in production if performance requires it.

However, disabling validation must never allow critical corruption to go undetected.

---

# Assertion vs Validation

Assertions are useful for detecting impossible internal states.

Validation handles expected invalid input.

Use:

```text
Validation
```

for:

```text
Expected invalid input
```

Use:

```text
Assertion
```

for:

```text
Impossible internal state
```

Use:

```text
Exception / Fatal Error
```

for:

```text
Unexpected unrecoverable failure
```

---

# Validation and Persistence

Data loaded from persistence must be validated.

This includes:

- savegames
- configuration
- cached state
- imported datasets

Loading data does not imply that the data is valid.

---

# Savegame Validation

Savegames should validate:

- format version
- schema
- required fields
- identifiers
- references
- domain invariants
- compatibility

Invalid savegames must not silently enter the simulation.

---

# Migration Validation

After a savegame migration:

```text
Old Format
    ↓
Migration
    ↓
New Format
    ↓
Validation
    ↓
Trusted State
```

Migration is not complete until the resulting state passes validation.

---

# Configuration Validation

Configuration must be validated before application startup.

Examples:

- required values
- valid ranges
- valid paths
- compatible versions
- valid feature flags

Invalid critical configuration should prevent startup.

---

# Asset Validation

Assets should be validated before use.

Validation may include:

- file existence
- format
- version
- required metadata
- compatibility
- references

Missing required assets should prevent unsafe execution.

---

# Cross-Entity Validation

Some rules involve multiple entities.

Examples:

```text
Production requires valid resource source.

Transport requires valid origin and destination.

Contract requires valid participants.
```

Cross-entity rules should be handled by:

- Aggregate
- Domain Service
- Application Service

depending on ownership.

---

# Validation Duplication

Validation should not be unnecessarily duplicated across layers.

Avoid:

```text
UI Validation
Application Validation
Domain Validation
```

all implementing the same rule independently.

Preferred:

```text
UI
    ↓
User Experience Validation

Application
    ↓
Use Case Validation

Domain
    ↓
Authoritative Invariant Validation
```

---

# Trust Model

Project Genesis uses the following trust model:

```text
Untrusted
    ↓
External Input
    ↓
Validated
    ↓
Application
    ↓
Domain
    ↓
Trusted Domain State
```

Data crossing into a more trusted boundary must satisfy the required validation rules.

---

# Validation Order

Where applicable, validation should follow:

```text
1. Structural Validation
2. Format Validation
3. Basic Constraint Validation
4. Referential Validation
5. Application Validation
6. Domain Validation
7. State Transition Validation
```

The exact sequence may vary by use case.

---

# Validation Performance

Validation must be proportional to risk.

Critical data may require strict validation.

High-frequency simulation data may require optimized validation.

Expensive validation should be:

- cached
- batched
- sampled
- performed at appropriate boundaries

where safe.

---

# Security Validation

Security-sensitive input must be validated strictly.

Examples:

- file paths
- external identifiers
- serialized data
- network input
- configuration

Never rely exclusively on client-side validation.

---

# Testing Validation

Validation logic must be tested.

Tests should include:

- valid input
- invalid input
- boundary values
- missing values
- malformed values
- multiple errors
- invalid state transitions
- persistence corruption

---

# Property-Based Testing

Where appropriate, property-based testing may be used.

Examples:

```text
Money never becomes negative.

Inventory never becomes negative.

Valid state transitions preserve invariants.
```

Property-based testing is especially valuable for:

- domain invariants
- simulation
- economic systems
- resource systems

---

# Validation Coverage

Critical invariants should have automated tests.

The objective is:

```text
Critical Invariants
        ↓
Automated Validation
        ↓
Regression Protection
```

---

# Anti-Patterns

Avoid:

- trusting external input
- relying only on UI validation
- silently correcting invalid data
- using null as a validation result
- throwing exceptions for normal validation failures
- duplicating domain rules in the UI
- bypassing domain invariants
- validating only during debugging
- ignoring invalid persisted state
- accepting partially corrupted data without explicit recovery

---

# Quality Requirements

The validation architecture must ensure:

- external input is validated
- domain invariants are protected
- invalid states are rejected
- validation results are explicit
- critical invariants are tested
- validation is deterministic where required
- validation performance is controlled
- security boundaries are protected

---

# Adoption Strategy

Validation should be implemented incrementally.

Priority:

1. Domain invariants
2. External input boundaries
3. Savegame loading
4. Application commands
5. Simulation state
6. Infrastructure boundaries
7. Configuration
8. Asset loading

---

# Migration

When introducing validation into existing code:

```text
Identify Invariant

↓

Define Validation Rule

↓

Assign Ownership

↓

Define Validation Error

↓

Implement Validation

↓

Return Result

↓

Add Tests

↓

Update Documentation

↓

Pass Quality Gates
```

---

# Related Documents

- ERROR_HANDLING_STRATEGY.md
- RESULT_PATTERN.md
- LOGGING_STRATEGY.md
- TESTING_STRATEGY.md
- QUALITY_GATES.md
- AUDIT_PROCESS.md

---

# Summary

Validation protects Project Genesis from invalid inputs and invalid states.

The central principle is:

```text
Prevent Invalid State
```

rather than:

```text
Detect Invalid State After Damage
```

Validation must occur at appropriate trust boundaries while domain invariants remain authoritative within the Domain Layer.

The strategy ensures that Project Genesis remains:

- consistent
- deterministic
- testable
- secure
- maintainable
- resilient against invalid data