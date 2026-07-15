# Dependency Matrix

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-14

---

# Purpose

This document defines the dependency relationships between all major systems, domains and asset libraries in Project Genesis.

Its purpose is to:

- provide architectural transparency
- prevent circular dependencies
- support implementation planning
- simplify maintenance
- improve testing
- support future modularization
- serve as the foundation for dependency validation tools

This document describes logical dependencies rather than implementation details.

---

# Design Principles

Dependencies should always follow these principles:

- High cohesion
- Low coupling
- Clear ownership
- One-directional dependencies
- No circular references
- Stable interfaces

---

# Dependency Levels

Dependencies are classified into four levels.

| Level | Meaning |
|---------|-----------------------------|
| Required | Cannot function without it |
| Strong | Frequently interacts |
| Optional | Uses only under certain conditions |
| None | No dependency |

---

# Core Architecture

```text
Content
      │
      ▼
Simulation
      │
      ▼
Application
      │
      ▼
Infrastructure
      │
      ▼
User Interface
```

No lower layer may directly control a higher layer.

---

# Domain Dependencies

| Domain | Depends On |
|----------|------------------------------|
| Buildings | Resources, Recipes |
| Resources | None |
| Recipes | Resources |
| Production | Buildings, Recipes |
| Logistics | Vehicles, Buildings, Resources |
| Market | Resources |
| Finance | Market |
| Workforce | NPCs, Buildings |
| Technologies | Research |
| Research | Resources |
| Events | Simulation |
| Scenarios | Events, Technologies |

---

# Asset Library Dependencies

| Asset Library | Depends On |
|-------------------------|------------------------|
| BUILDING_LIBRARY | RESOURCE_LIBRARY |
| RESOURCE_LIBRARY | None |
| VEHICLE_LIBRARY | RESOURCE_LIBRARY |
| NPC_LIBRARY | BUILDING_LIBRARY |
| EFFECT_LIBRARY | BUILDING_LIBRARY, VEHICLE_LIBRARY, NPC_LIBRARY |
| MAP_OBJECT_LIBRARY | BIOME_GUIDE |
| BIOME_GUIDE | MAP_STYLE_GUIDE |

---

# Documentation Dependencies

| Document | Depends On |
|-----------------------------|-------------------------|
| COLOR_PALETTE | ART_DIRECTION |
| VISUAL_LANGUAGE | DESIGN_PRINCIPLES |
| TYPOGRAPHY | VISUAL_LANGUAGE |
| UI_STYLE_GUIDE | TYPOGRAPHY |
| ICON_GUIDELINES | UI_STYLE_GUIDE |
| BUILDING_STYLE_GUIDE | VISUAL_LANGUAGE |
| RESOURCE_STYLE_GUIDE | VISUAL_LANGUAGE |
| VEHICLE_STYLE_GUIDE | VISUAL_LANGUAGE |
| MAP_STYLE_GUIDE | VISUAL_LANGUAGE |
| NPC_STYLE_GUIDE | VISUAL_LANGUAGE |
| EFFECT_STYLE_GUIDE | VISUAL_LANGUAGE |

---

# Runtime Dependencies

```text
Simulation

├── Economy

├── Production

├── Logistics

├── Workforce

├── Research

└── Events
```

Each subsystem communicates through defined interfaces.

---

# Data Flow

```text
Content Files

↓

Asset Registry

↓

Simulation

↓

Game State

↓

Application Services

↓

User Interface
```

---

# Build Pipeline

```text
Content

↓

Validation

↓

Asset Registry

↓

Compilation

↓

Packaging

↓

Distribution
```

Every stage validates the previous one before continuing.

---

# AI Asset Generation

```text
Style Guides

↓

Asset Libraries

↓

Prompt Library

↓

AI Generation

↓

Review

↓

Implementation
```

The AI pipeline must always follow this sequence.

---

# Save Game Dependencies

Save files depend on:

- Asset IDs
- Technology IDs
- Building IDs
- Resource IDs
- Vehicle IDs
- NPC IDs
- Recipe IDs

Save games must never depend on filenames.

---

# Testing Dependencies

Testing layers should be isolated.

```text
Unit Tests

↓

Integration Tests

↓

Simulation Tests

↓

Gameplay Tests

↓

Acceptance Tests
```

Failures should propagate upward but not downward.

---

# Circular Dependency Rules

The following are prohibited:

- Building → Vehicle → Building
- Resource → Building → Resource
- UI → Simulation → UI
- Scenario → Save Game → Scenario

All dependencies must form a Directed Acyclic Graph (DAG).

---

# Dependency Validation

Future tooling should automatically verify:

- missing references
- invalid IDs
- orphaned assets
- duplicate IDs
- circular dependencies
- invalid document references

Validation should execute during every build.

---

# Future Automation

Dependency data should generate:

- dependency graphs
- implementation order
- impact analysis
- documentation links
- architecture reports
- CI validation reports

---

# Related Documents

- ASSET_ID_SYSTEM.md
- ASSET_VERSIONING.md
- BUILDING_LIBRARY.md
- RESOURCE_LIBRARY.md
- VEHICLE_LIBRARY.md
- NPC_LIBRARY.md
- EFFECT_LIBRARY.md
- MAP_OBJECT_LIBRARY.md
- DDD.md
- SAD.md

---

# Summary

The Dependency Matrix defines the structural relationships between systems, documents and assets in Project Genesis.

By documenting and validating these dependencies, the project remains modular, maintainable and scalable while reducing architectural risk and enabling automated quality assurance.