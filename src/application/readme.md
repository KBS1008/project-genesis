# Application Layer

The `application` module coordinates all application workflows.

It acts as the bridge between the presentation layer, the simulation engine and the domain model.

The Application Layer contains **application-specific behavior**, but **no business rules**.

Business rules always belong to the Domain Layer.

---

# Responsibilities

The Application Layer is responsible for:

- Application bootstrap
- Use Cases
- Commands
- Queries
- Service orchestration
- Transaction boundaries
- Dependency Injection composition
- Coordination between modules

It translates user intentions into domain operations.

---

# Responsibilities in Detail

## Bootstrap

Initializes the application.

Examples:

- Load configuration
- Build Dependency Injection container
- Load game content
- Initialize simulation
- Start application

---

## Use Cases

A Use Case represents one application action.

Examples:

- Create Company
- Buy Building
- Start Production
- Research Technology
- Hire Employee
- Save Game
- Load Game

Use Cases coordinate domain objects but do not implement business logic.

---

## Commands

Commands modify application state.

Examples:

```text
CreateCompanyCommand
StartProductionCommand
BuyBuildingCommand
```

Commands should be immutable.

---

## Queries

Queries retrieve information without modifying state.

Examples:

```text
GetCompanyQuery
GetMarketPricesQuery
GetProductionStatusQuery
```

Queries should never change domain state.

---

## Application Services

Application Services coordinate multiple domain objects.

Example:

```text
Company
+
Finance
+
Market
+
Production
↓

Start Production
```

The Application Service coordinates the process.

The business decisions remain inside the Domain Layer.

---

# What does NOT belong here?

The following must never be implemented inside the Application Layer:

- production formulas
- market calculations
- employee logic
- finance calculations
- research algorithms
- resource balancing

These belong to the Domain Layer.

---

# Directory Structure

Example:

```text
application/

bootstrap/

commands/

queries/

use-cases/

services/

dto/

mappers/
```

The exact structure may evolve during implementation.

---

# Dependency Rules

The Application Layer may depend on:

- Domain
- Common

and use interfaces implemented by Infrastructure.

Example:

```text
Application

↓

Domain

↑

Infrastructure
```

The Application Layer must never depend directly on infrastructure implementations.

Always depend on abstractions.

---

# Communication

The Application Layer communicates through:

- Commands
- Queries
- Domain Events
- Repository Interfaces

Avoid direct coupling between unrelated modules.

---

# DTOs

The Application Layer may define Data Transfer Objects (DTOs).

DTOs:

- contain no business logic
- are immutable where practical
- are used to communicate across boundaries

---

# Error Handling

Application code should prefer:

- Result<T>
- ValidationResult

Avoid throwing exceptions for expected business cases.

Unexpected technical failures may still use exceptions where appropriate.

---

# Testing

Recommended tests:

- Use Case Tests
- Command Tests
- Query Tests
- Service Tests

Dependencies should be mocked through interfaces.

---

# Design Principles

The Application Layer should remain:

- thin
- explicit
- deterministic
- testable
- framework-independent

Business rules belong elsewhere.

---

# Related Documentation

- docs/architecture/SAD.md
- docs/architecture/DDD.md
- docs/architecture/domain-model.md
- docs/architecture/runtime-view.md
- docs/architecture/component-diagram.md
- docs/decisions/

---

# Summary

The Application Layer orchestrates workflows.

It coordinates the execution of use cases, but never contains the business rules that define the simulation.