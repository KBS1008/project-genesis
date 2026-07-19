# Registry Schema

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-15

---

# Purpose

This document defines the canonical data schema for the Global Asset Registry used throughout Project Genesis.

The schema establishes a consistent structure for every registry file, enabling interoperability between development tools, the game runtime, AI-assisted workflows and future modding support.

All registry files must conform to this specification.

---

# Design Goals

The registry schema shall be:

- deterministic
- human-readable
- machine-readable
- version-controlled
- extensible
- backward compatible
- validation-friendly

---

# Registry Structure

The registry is divided into category-specific files.

```text
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

Each file contains an array of registry entries.

---

# Common Entry Structure

Every registry entry follows the same base schema.

```json
{
  "assetId": "",
  "internalName": "",
  "displayName": "",
  "category": "",
  "version": "",
  "status": "",
  "tags": [],
  "dependencies": [],
  "created": "",
  "updated": ""
}
```

---

# Required Fields

| Field        | Type              | Required |
| ------------ | ----------------- | -------- |
| assetId      | string            | ✓        |
| internalName | string            | ✓        |
| displayName  | string            | ✓        |
| category     | string            | ✓        |
| version      | string            | ✓        |
| status       | string            | ✓        |
| tags         | array             | ✓        |
| dependencies | array             | ✓        |
| created      | string (ISO-8601) | ✓        |
| updated      | string (ISO-8601) | ✓        |

---

# Optional Fields

Optional metadata may include:

| Field            | Type    |
| ---------------- | ------- |
| description      | string  |
| author           | string  |
| source           | string  |
| localizationKey  | string  |
| thumbnail        | string  |
| previewImage     | string  |
| icon             | string  |
| notes            | string  |
| deprecated       | boolean |
| replacement      | string  |
| customProperties | object  |

Unknown optional fields must not invalidate the schema.

---

# Category-Specific Extensions

Each asset type may extend the base schema.

## Buildings

```json
{
  "size": "4x4",
  "constructionCost": {},
  "maintenanceCost": {},
  "workforce": 40,
  "powerConsumption": 350
}
```

---

## Resources

```json
{
  "unit": "kg",
  "stackSize": 100,
  "tradable": true,
  "tier": 2
}
```

---

## Vehicles

```json
{
  "capacity": 25000,
  "speed": 80,
  "energySource": "Diesel"
}
```

---

## NPCs

```json
{
  "profession": "",
  "educationLevel": "",
  "workplace": ""
}
```

---

## Effects

```json
{
  "looping": true,
  "duration": 2.5,
  "performanceLevel": "Medium"
}
```

---

## Map Objects

```json
{
  "biome": "Temperate",
  "collision": true,
  "seasonalVariant": false
}
```

---

# Enumerations

## Asset Status

Allowed values:

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

## Categories

Allowed categories include:

- Building
- Resource
- Vehicle
- NPC
- Effect
- MapObject
- Technology
- Recipe
- UI
- Audio
- Scenario

---

# Naming Rules

Internal names:

- PascalCase
- ASCII characters only
- no spaces
- unique within the category

Examples

```
SteelMill

ElectricTruck

OakTreeLarge
```

---

# Dependency Rules

Dependencies always reference Asset IDs.

Correct

```json
["RES-1004", "EFF-1002"]
```

Incorrect

```json
["Iron Ore", "Smoke"]
```

---

# Version Rules

Versions follow Semantic Versioning.

Examples

```
1.0.0

1.2.1

2.0.0
```

---

# Date Format

Dates use ISO-8601.

Example

```
2026-07-15T10:45:00Z
```

---

# Validation Rules

Every registry entry must satisfy:

- valid Asset ID
- valid category
- valid version
- unique internal name
- unique Asset ID
- existing dependencies
- valid timestamps

---

# Registry Relationships

Relationships are represented by Asset IDs.

Example

```text
Steel Mill

↓

Consumes

↓

RES-1004

↓

Iron Ore
```

The registry must never duplicate relationship data.

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
  "tags": ["Industry", "Steel"],
  "dependencies": ["RES-1004", "EFF-1005"],
  "created": "2026-06-01T09:00:00Z",
  "updated": "2026-07-15T14:30:00Z"
}
```

---

# JSON Schema Evolution

Future schema changes should:

- preserve backward compatibility
- avoid renaming existing fields
- introduce new fields as optional
- provide migration documentation
- increment the schema version

---

# Future Automation

The schema should support:

- automatic JSON validation
- schema generation
- editor auto-completion
- code generation
- documentation generation
- dependency visualization
- registry migration

---

# Related Documents

- GLOBAL_ASSET_REGISTRY.md
- ASSET_ID_SYSTEM.md
- ASSET_VERSIONING.md
- DEPENDENCY_MATRIX.md
- CONTENT_PIPELINE.md

---

# Summary

The Registry Schema defines the canonical data model for all registry entries in Project Genesis.

By establishing a consistent, extensible and machine-readable structure, it enables reliable automation, validation and seamless integration across development tools, AI workflows, the game runtime and future modding support.
