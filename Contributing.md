# Contributing to Project Genesis

Thank you for your interest in contributing to **Project Genesis**.

This document defines the development workflow, coding standards and contribution process for all contributors.

---

# Philosophy

Project Genesis follows a **Documentation First** development approach.

Every significant architectural or gameplay change must be documented before implementation begins.

The goal is to ensure a maintainable, deterministic and scalable simulation.

---

# Development Principles

All contributors are expected to follow these principles:

- Documentation First
- Clean Architecture
- Domain-Driven Design (DDD)
- Deterministic Simulation
- Data-Driven Design
- Event-Driven Architecture
- Configuration over Code
- Convention over Configuration

---

# Development Workflow

Every feature should follow this order:

1. Discuss the feature or issue
2. Update documentation (if necessary)
3. Create or update an Architecture Decision Record (ADR)
4. Implement the feature
5. Add or update tests
6. Run formatting and linting
7. Verify game content
8. Submit the change

---

# Required Development Environment

## Node.js

Use the current active LTS version.

---

## Package Manager

Project Genesis officially uses **pnpm**.

Install via Corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Verify installation:

```bash
pnpm --version
```

---

# Installation

Clone the repository.

Install dependencies:

```bash
pnpm install
```

Run the project:

```bash
pnpm dev
```

Run tests:

```bash
pnpm test
```

Build the project:

```bash
pnpm build
```

---

# Project Structure

```text
docs/
src/
tests/
game-content/
config/
mods/
savegames/
logs/
tools/
```

Each directory contains its own documentation where appropriate.

---

# Documentation Requirements

Documentation has the same importance as source code.

Before implementing new functionality, verify whether documentation must be updated.

Relevant documentation includes:

- Architecture
- Gameplay
- ADRs
- Schemas
- Runtime documentation

---

# Architecture Decisions

Architectural changes require a new ADR.

All ADRs are stored in:

```text
docs/decisions/
```

Each ADR receives a unique identifier:

```text
DD-001
DD-002
...
```

---

# Coding Standards

- TypeScript only
- ESLint must pass without errors
- Prettier formatting is mandatory
- No magic numbers
- Small focused classes
- Single Responsibility Principle
- Prefer composition over inheritance

---

# Naming Conventions

## Files

```text
building-service.ts
market-system.ts
company.ts
```

Use lowercase kebab-case.

---

## Classes

```text
Building
Company
MarketSimulation
```

Use PascalCase.

---

## Interfaces

```text
IBuildingRepository
IEventBus
```

Use PascalCase with an `I` prefix (or omit the prefix if the team later adopts the TypeScript convention of interface names without `I`; the project should remain consistent).

---

## Methods

Use camelCase.

Example:

```text
calculateProduction()
updateMarketPrices()
loadContent()
```

---

# Game Content

Gameplay data belongs in:

```text
game-content/
```

Never hardcode gameplay values.

Examples:

- buildings
- recipes
- technologies
- resources
- regions

---

# Testing

Every new feature should include appropriate tests.

Recommended test types:

- Unit Tests
- Integration Tests
- Content Validation Tests
- Simulation Tests

---

# Pull Requests

Each Pull Request should:

- solve one logical problem
- include documentation updates (if required)
- include tests
- pass all automated checks

---

# Commit Messages

Recommended format:

```text
type(scope): short description
```

Examples:

```text
feat(simulation): add tick scheduler

fix(market): correct demand calculation

docs(architecture): update runtime view

refactor(content): simplify loader
```

---

# AI-Assisted Development

AI tools such as Cursor AI may be used during development.

However:

- Generated code must be reviewed.
- Architecture decisions remain authoritative.
- Documentation always takes precedence over implementation.
- AI-generated code must comply with project standards.

---

# Questions

When uncertain:

1. Consult the documentation.
2. Review existing ADRs.
3. Prefer consistency over novelty.
4. Discuss architectural changes before implementation.

---

# Thank You

By contributing to Project Genesis, you help build a maintainable, deterministic and extensible simulation platform.