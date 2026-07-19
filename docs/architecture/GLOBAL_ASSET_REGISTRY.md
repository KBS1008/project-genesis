# Global Asset Registry

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-14

---

# Purpose

The Global Asset Registry is the single source of truth for every asset used throughout Project Genesis.

Every game system references assets exclusively through the registry.

No system should reference asset files directly.

The registry enables:

- asset discovery
- validation
- dependency management
- localization
- save-game compatibility
- AI-assisted workflows
- editor integration
- automated documentation
- build validation
- mod support

---

# Design Goals

The registry must be:

- centralized
- deterministic
- extensible
- machine-readable
- human-readable
- version-controlled
- automation-friendly

---

# Single Source of Truth

Every asset exists exactly once inside the registry.

Example

```
Steel Mill

↓

BLD-0015

↓

Registry Entry

↓

Everything else references the registry
```

No duplicate definitions are allowed.

---

# Registry Architecture

```text
Global Registry

├── Buildings

├── Resources

├── Vehicles

├── NPCs

├── Effects

├── Map Objects

├── Technologies

├── Recipes

├── UI Assets

├── Audio

├── Scenarios

└── Localization
```

Every category shares the same structural rules.

---

# Directory Structure

```
registry/

assets.json

buildings.json

resources.json

vehicles.json

npcs.json

effects.json

map_objects.json

technologies.json

recipes.json

ui.json

audio.json

scenarios.json
```

Each file contains one asset category.

---

# Required Fields

Every registry entry should contain:

| Field         | Required |
| ------------- | -------- |
| Asset ID      | ✓        |
| Internal Name | ✓        |
| Display Name  | ✓        |
| Category      | ✓        |
| Version       | ✓        |
| Lifecycle     | ✓        |
| Dependencies  | ✓        |
| Tags          | ✓        |
| Created       | ✓        |
| Updated       | ✓        |

Optional fields may be added without breaking compatibility.

---

# Example Entry

```json
{
  "assetId": "BLD-0015",
  "internalName": "SteelMill",
  "displayName": "Steel Mill",
  "category": "Building",
  "version": "1.2.0",
  "status": "Implemented",
  "dependencies": ["RES-3002", "EFF-1005"],
  "tags": ["industry", "steel", "production"]
}
```

---

# Asset Relationships

Relationships are stored through Asset IDs.

Example

```
Steel Mill

↓

Consumes

↓

Iron Ore

↓

RES-1004
```

Never through filenames.

---

# Registry Lookup

Every system follows the same lookup process.

```text
Asset ID

↓

Registry

↓

Metadata

↓

Asset

↓

Runtime
```

No subsystem bypasses the registry.

---

# Asset Lifecycle

Each asset records its current lifecycle stage.

Possible values:

- Planned
- Concept
- Prompt Ready
- Generated
- Reviewed
- Approved
- Implemented
- Deprecated
- Archived

---

# Version Tracking

Each registry entry stores:

- current version
- previous versions
- migration information

Version history is immutable.

---

# Dependency Tracking

The registry stores direct dependencies.

Example

```
Building

↓

Resources

↓

Effects

↓

Animations
```

The Dependency Matrix validates these relationships.

---

# Validation Rules

The registry validates:

- duplicate IDs
- invalid IDs
- missing dependencies
- invalid versions
- orphaned assets
- missing localization
- invalid references
- circular dependencies

Validation executes automatically during builds.

---

# Save Games

Save files reference only:

- Asset IDs

During loading:

```text
Save Game

↓

Asset ID

↓

Registry

↓

Current Compatible Asset
```

This guarantees compatibility across versions.

---

# Localization

The registry links every asset to localization keys.

Example

```
BLD-0015

↓

TXT-0102
```

Localized text remains independent from gameplay.

---

# AI Integration

AI systems use the registry to obtain:

- asset metadata
- style guide references
- prompt templates
- dependency information
- version history

Every AI-generated asset updates the existing registry entry rather than creating a duplicate.

---

# Editor Integration

The editor retrieves all available assets from the registry.

Benefits include:

- search
- filtering
- dependency visualization
- validation
- previews
- category browsing

No hardcoded asset lists are permitted.

---

# Mod Support

Mods register new assets by creating additional registry entries.

Official assets remain unchanged.

Example

```
Official Registry

+

Mod Registry

↓

Merged Registry
```

Conflicts are detected automatically.

---

# Build Pipeline

```text
Registry

↓

Validation

↓

Dependency Check

↓

Localization Check

↓

Asset Packaging

↓

Build
```

A failed validation prevents the build from continuing.

---

# Registry Ownership

The registry is maintained automatically where possible.

Manual edits should be limited to:

- metadata
- categorization
- documentation

Generated values should never be edited manually.

---

# Future Automation

The registry should eventually generate:

- asset database
- documentation
- dependency graphs
- editor catalogs
- localization templates
- AI prompt lists
- build manifests
- mod manifests
- QA reports

---

# Related Documents

- ASSET_ID_SYSTEM.md
- ASSET_VERSIONING.md
- DEPENDENCY_MATRIX.md
- BUILDING_LIBRARY.md
- RESOURCE_LIBRARY.md
- VEHICLE_LIBRARY.md
- NPC_LIBRARY.md
- EFFECT_LIBRARY.md
- MAP_OBJECT_LIBRARY.md

---

# Summary

The Global Asset Registry is the central asset management system of Project Genesis.

It serves as the authoritative source for every asset, ensuring consistency across development, tooling, AI workflows, localization, save games, testing and future mod support while enabling scalable automation throughout the entire project.
