# Domain Module

The `domain` module contains the business model of Project Genesis.

It represents the rules of the simulation and defines how the game world behaves.

This module is the core of the application.

Everything else exists to support the domain.

---

# Purpose

The Domain Layer models the economy, companies, production, logistics, finance, research and every other business concept of the simulation.

It contains **business rules only**.

No technical concerns belong here.

---

# Responsibilities

The Domain Layer is responsible for:

- Aggregates
- Entities
- Value Objects
- Domain Services
- Repository Interfaces
- Domain Events
- Business Rules
- Invariants
- Policies
- Specifications

---

# Guiding Principles

The Domain Layer should be:

- deterministic
- framework-independent
- persistence-agnostic
- UI-independent
- testable
- explicit
- stable

Business logic must never depend on technical implementation details.

---

# Planned Structure

```text
domain/

company/
finance/
market/
production/
research/
resources/
regions/
transport/
world/

events/
repositories/
services/
specifications/
policies/
value-objects/
```

The structure may evolve as the project grows.

---

# Building Blocks

## Aggregates

Aggregates protect consistency.

Examples:

- Company
- Region
- Market
- World

Each Aggregate has exactly one Aggregate Root.

---

## Entities

Entities have identity.

Examples:

- Building
- Employee
- Vehicle
- Warehouse

Identity is stable throughout the lifetime of the entity.

---

## Value Objects

Value Objects are immutable.

Examples:

- Money
- Percentage
- Quantity
- ProductionRate
- Coordinate

Equality is based on value.

---

## Domain Services

Domain Services encapsulate business operations that do not naturally belong to a single Aggregate.

Examples:

- Price Calculation
- Route Optimization
- Tax Calculation
- Loan Evaluation

Services should remain stateless whenever possible.

---

## Repository Interfaces

Repositories provide access to Aggregate Roots.

Only interfaces belong in the Domain Layer.

Concrete implementations belong to Infrastructure.

Example:

```text
CompanyRepository

MarketRepository

WorldRepository
```

---

# Domain Events

Domain Events describe completed business actions.

Examples:

- CompanyFounded
- BuildingConstructed
- ProductionFinished
- TechnologyUnlocked
- LoanApproved

Events are immutable.

---

# Business Rules

All business rules belong here.

Examples:

- Production recipes
- Employee limits
- Market pricing
- Resource consumption
- Research requirements
- Construction prerequisites

No business rule should be implemented outside the Domain Layer.

---

# Invariants

Aggregates must always protect their invariants.

Examples:

- Money cannot become negative if prohibited by the business rules.
- Production cannot start without all required resources.
- Buildings cannot exceed configured limits.
- Technologies cannot be researched twice.

Invariant validation belongs inside the Aggregate.

---

# Policies

Policies encapsulate configurable business decisions.

Examples:

- Tax Policy
- Loan Policy
- Bankruptcy Policy
- Market Regulation Policy

Policies make business behavior easier to evolve without changing Aggregate responsibilities.

---

# Specifications

Specifications encapsulate composable eligibility rules.

Examples:

- Building supports recipe
- Resource listed on market
- Sufficient inventory for production

Specifications return `Result<void, ValidationError>` and can be combined (e.g. with `AndSpecification`).

Application code evaluates specifications against domain types and passes content-derived context as snapshots. Domain specifications must not import `src/content/`.

---

# Dependency Rules

The Domain Layer may depend only on:

- Common

It must not depend on:

- Application
- Infrastructure
- UI
- Content
- Simulation

Domain code defines interfaces and abstractions.

Other layers provide implementations.

---

# Determinism

The Domain Layer must behave deterministically.

The same input and simulation state must always produce the same output.

Never depend directly on:

- current system time
- random generators
- file system
- network
- user interface

Such dependencies must be abstracted.

---

# Error Handling

Expected business outcomes should be represented explicitly.

Preferred approaches:

- Result<T>
- DomainError
- ValidationResult

Avoid exceptions for expected business situations.

---

# Testing

The Domain Layer should have the highest level of test coverage.

Recommended tests:

- Aggregate Tests
- Entity Tests
- Value Object Tests
- Domain Service Tests
- Policy Tests
- Specification Tests
- Invariant Tests

Every business rule should be verifiable through automated tests.

---

# Related Documentation

- docs/architecture/domain-model.md
- docs/architecture/bounded-contexts.md
- docs/architecture/runtime-view.md
- docs/gameplay/
- docs/decisions/

The Domain Layer must always remain consistent with these documents.

---

# Summary

The Domain Module is the authoritative source of all business rules in Project Genesis.

It models the game world independently of user interfaces, infrastructure and technical frameworks, ensuring a deterministic, maintainable and extensible simulation.