# Source Code Architecture

The `src/` directory contains the complete implementation of Project Genesis.

The source code follows the architectural principles defined in:

- `docs/architecture/SAD.md`
- `docs/architecture/DDD.md`
- `docs/architecture/domain-model.md`
- `docs/architecture/bounded-contexts.md`
- `docs/architecture/component-diagram.md`
- `docs/architecture/runtime-view.md`
- `docs/architecture/system-context.md`
- `docs/architecture/deployment-view.md`
- `docs/architecture/technology-stack.md`
- `docs/decisions/`

This directory contains **implementation only**.

Gameplay balancing, configuration and static content are **not** stored here.

---

# Architecture Overview

Project Genesis follows:

- Clean Architecture
- Domain-Driven Design (DDD)
- Documentation First
- Event-Driven Architecture
- Deterministic Simulation

The source code is organized into independent modules with clearly defined responsibilities.

---

# Directory Structure

```text
src/

application/
common/
content/
domain/
infrastructure/
simulation/
ui/

main.ts
```

---

# Module Responsibilities

## application/

Coordinates use cases and application workflows.

Responsibilities:

- Application bootstrap
- Commands
- Queries
- Use Cases
- Service orchestration
- Dependency Injection configuration

Business rules do not belong here.

---

## common/

Contains reusable building blocks shared across the project.

Examples:

- Result<T>
- Entity base classes
- Value Objects
- Identifiers
- Domain Events
- Clock abstraction
- Utilities

This module should have minimal external dependencies.

---

## content/

Responsible for loading and validating game content.

Examples:

- YAML loader
- JSON Schema validation
- Content registry
- Localization
- Asset metadata

No gameplay logic belongs here.

---

## domain/

Contains the business model.

This is the heart of Project Genesis.

Examples:

- Company
- Buildings
- Resources
- Production
- Research
- Employees
- Finance
- Market

The domain must not depend on infrastructure.

---

## infrastructure/

Contains technical implementations.

Examples:

- File system
- Logging
- Persistence
- Serialization
- Dependency Injection container
- External integrations

Infrastructure implements interfaces defined elsewhere.

---

## simulation/

Contains the deterministic simulation engine.

Examples:

- Tick scheduler
- Simulation loop
- Event dispatcher
- Time system
- Production execution
- Market updates

Simulation must remain deterministic.

---

## ui/

Contains presentation logic.

Possible future implementations:

- Web UI
- Desktop UI
- Editor
- Debug tools

The UI must never contain business logic.

---

# Dependency Rules

Allowed dependencies:

```text
UI
        ↓
Application
        ↓
Domain
        ↑
Simulation
        ↑
Infrastructure

Common
↑
usable by all modules
```

---

# Forbidden Dependencies

The following dependencies are not allowed:

- Domain → Infrastructure
- Domain → UI
- Domain → Application
- Simulation → UI
- Common → Domain
- Common → Infrastructure

If a dependency seems necessary, create or update an ADR before implementing it.

---

# Design Principles

Every module should follow:

- Single Responsibility Principle
- High Cohesion
- Low Coupling
- Composition over Inheritance
- Dependency Inversion
- Explicit Interfaces

---

# Import Strategy

Prefer module aliases instead of long relative imports.

Example:

```typescript
import { Company } from '@domain/company/company.js';
```

Instead of:

```typescript
import { Company } from '../../../domain/company/company.js';
```

---

# Error Handling

Errors should be represented explicitly.

Preferred approaches:

- Result<T>
- DomainError
- ValidationResult

Avoid using exceptions for expected business situations.

---

# Testing

Production code belongs in:

```text
src/
```

Tests belong in:

```text
tests/
```

Each module should be independently testable.

---

# Documentation

Before implementing a new feature:

1. Verify existing documentation.
2. Check relevant ADRs.
3. Update documentation if required.
4. Implement the feature.
5. Add tests.

Documentation always takes precedence over implementation.

---

# Long-Term Goals

The architecture is designed to support:

- deterministic simulation
- scalable game systems
- modding
- multiplayer experiments (future)
- editor tooling
- AI-assisted development

without requiring major architectural changes.

---

# Summary

The `src/` directory contains the executable implementation of Project Genesis.

Its structure reflects the documented architecture and should evolve only through documented architectural decisions.