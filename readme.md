# Project Genesis

> **A data-driven, deterministic economy and industry simulation built with TypeScript.**

Project Genesis is a single-player economic simulation game focused on industrial production, logistics, research, energy management and dynamic markets.

The project follows a **Documentation First** approach. The complete software architecture, gameplay design and domain model are documented before implementation begins, providing a stable foundation for development and AI-assisted programming.

---

# Vision

Build a scalable and maintainable simulation engine where:

- all gameplay is data-driven
- the simulation is deterministic
- production is recipe-based
- markets emerge from supply and demand
- every system is modular and extensible
- modding is supported from the beginning

---

# Key Features

- Data-driven gameplay
- Deterministic simulation
- Recipe-based production
- Dynamic economy
- Modular architecture
- Event-driven simulation
- Clean Architecture
- Domain-Driven Design (DDD)
- CQRS Lite
- Modding support

---

# Repository Structure

```text
ProjectGenesis/

docs/
├── architecture/
├── decisions/
├── gameplay/
├── schemas/
└── config/

game-content/

src/

tests/

tools/

config/

mods/

savegames/

logs/
```

---

# Documentation

The complete project documentation is located in `docs/`.

## Architecture

```text
docs/architecture/
```

Contains:

- Software Architecture Document (SAD)
- Domain-Driven Design (DDD)
- Architecture Overview
- Technology Stack
- Domain Model
- Bounded Contexts
- Component Diagram
- Runtime View
- System Context
- Deployment View

---

## Architecture Decisions

```text
docs/decisions/
```

Contains all Architecture Decision Records (ADRs).

Examples:

- Resource Graph
- Recipe-Based Production
- Deterministic Simulation
- Event-Driven Architecture
- CQRS Lite
- Dependency Injection
- Content Validation

---

## Gameplay

```text
docs/gameplay/
```

Contains the complete game design.

Examples:

- Buildings
- Production
- Market
- Finance
- Employees
- Research
- Energy
- Transport
- World

---

## Schemas

```text
docs/schemas/
```

Defines the canonical data models for all game content.

---

# Source Code

```text
src/
```

The implementation follows a layered architecture.

```text
Presentation
        ↓
Application
        ↓
Domain
        ↓
Infrastructure
```

Additional modules:

- Simulation
- Content
- Common

---

# Game Content

Gameplay data is stored separately from the source code.

```text
game-content/
```

Examples:

- Buildings
- Recipes
- Resources
- Regions
- Technologies
- Markets

All content is validated before loading.

---

# Development Principles

Project Genesis follows these principles:

- Documentation First
- Data-Driven Design
- Deterministic Simulation
- Event-Driven Architecture
- Clean Architecture
- Domain-Driven Design
- Configuration over Code
- Convention over Configuration

---

# Technology

- TypeScript
- Node.js
- Vitest
- ESLint
- Prettier
- YAML
- JSON Schema

See `docs/architecture/technology-stack.md` for details.

---

# Getting Started

The implementation is currently under active development.

Planned setup:

```bash
npm install
npm run build
npm run test
npm run dev
```

---

# Development Workflow

1. Update documentation (if required)
2. Implement feature
3. Add tests
4. Validate game content
5. Run linting
6. Commit changes

---

# License

See the `LICENSE` file.

---

# Project Status

Current phase:

**Phase 3 – Project Foundation**

Architecture and documentation are complete.

The implementation of the simulation engine is now being prepared.

---

# Acknowledgements

Project Genesis is developed using a Documentation First approach with AI-assisted software engineering to ensure a maintainable, scalable and well-documented codebase.
