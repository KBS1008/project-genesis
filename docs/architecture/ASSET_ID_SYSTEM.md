# Asset ID System

**Project:** Project Genesis
**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-14

---

# Purpose

This document defines the global asset identification system used throughout Project Genesis.

Every asset in the project receives one permanent, unique identifier that remains stable throughout its entire lifecycle.

Asset identifiers are used by:

- source code
- game content
- save games
- databases
- localization
- AI asset generation
- documentation
- testing
- modding
- debugging

Asset IDs are never reused.

---

# Design Goals

The Asset ID System must be:

- globally unique
- human readable
- scalable
- deterministic
- permanent
- tool-friendly
- source-control friendly

---

# General Rules

Every asset:

- has exactly one ID
- keeps this ID forever
- may change name without changing its ID
- may change appearance without changing its ID
- may change implementation without changing its ID

Only deletion permanently retires an ID.

Retired IDs are never reused.

---

# Asset ID Format

```
PREFIX-NNNN
```

Examples

```
BLD-0001
RES-0001
VEH-0001
NPC-0001
EFF-0001
MAP-0001
```

---

# Prefix Definitions

| Prefix | Asset Type        |
| ------ | ----------------- |
| BLD    | Buildings         |
| RES    | Resources         |
| VEH    | Vehicles          |
| NPC    | NPC Types         |
| EFF    | Visual Effects    |
| MAP    | Map Objects       |
| BIO    | Biomes            |
| TEC    | Technologies      |
| REC    | Recipes           |
| ITM    | Inventory Items   |
| UI     | UI Assets         |
| ICO    | Icons             |
| AUD    | Audio Assets      |
| MUS    | Music             |
| AMB    | Ambient Sounds    |
| ANI    | Animation Sets    |
| TXT    | Localization Text |
| SCR    | Scenarios         |
| EVT    | Game Events       |
| MIS    | Missions          |
| TUT    | Tutorials         |

New prefixes require an architecture review.

---

# Numeric Range

The numeric part always contains four digits.

Example

```
0001
0002
0098
0420
1000
9999
```

Leading zeros are mandatory.

---

# Reserved Ranges

Reserved ranges reduce future conflicts.

| Range     | Usage                 |
| --------- | --------------------- |
| 0001–0999 | Core Game             |
| 1000–1999 | Expansion 1           |
| 2000–2999 | Expansion 2           |
| 3000–3999 | DLC                   |
| 4000–4999 | Tutorial              |
| 5000–5999 | Scenario Assets       |
| 6000–6999 | Temporary Development |
| 7000–7999 | Internal Testing      |
| 8000–8999 | Mod Support           |
| 9000–9999 | Reserved              |

---

# Naming Convention

Internal names use PascalCase.

Examples

```
SteelMill
ElectricLocomotive
OakTreeLarge
WindTurbine
```

Display names are localized separately.

Example

```
Steel Mill
Stahlwerk
Aciérie
```

The Asset ID never changes.

---

# Relationship to File Names

Asset IDs should appear in filenames.

Example

```
BLD-0007-SteelMill.glb

RES-0012-Steel.png

VEH-0105-ElectricTruck.fbx
```

This improves searchability and traceability.

---

# Relationship to Source Code

Game code should reference IDs rather than filenames.

Example

```
BuildingID = BLD-0007

ResourceID = RES-0012

VehicleID = VEH-0105
```

The implementation may change without affecting gameplay data.

---

# Save Games

Save files should reference only Asset IDs.

Never store:

- filenames
- localized names
- temporary identifiers

Correct

```
BLD-0012
```

Incorrect

```
SteelMill_Final_v4.glb
```

---

# Localization

Localization files reference Asset IDs.

Example

```
BLD-0007

en:
Steel Mill

de:
Stahlwerk

fr:
Aciérie
```

---

# AI Asset Generation

AI-generated assets should inherit the existing Asset ID.

Generating a new image does not create a new ID.

The asset version changes.

The identifier does not.

---

# Version Independence

Asset IDs never include version numbers.

Incorrect

```
BLD-0007-v2
```

Correct

```
BLD-0007
```

Versioning is handled separately.

---

# Deleted Assets

Deleted assets remain documented.

Example

```
VEH-0235

Status:

Deprecated

Reason:

Replaced by VEH-0420
```

The old identifier is permanently retired.

---

# Validation Rules

Every Asset ID must satisfy:

- valid prefix
- four-digit number
- unique identifier
- registered in the asset catalog
- immutable after creation

---

# Future Automation

The Asset ID System should support:

- automatic ID validation
- duplicate detection
- asset registry generation
- dependency tracking
- save-game validation
- AI prompt generation
- build-time consistency checks

---

# Related Documents

- ASSET_VERSIONING.md
- BUILDING_LIBRARY.md
- RESOURCE_LIBRARY.md
- VEHICLE_LIBRARY.md
- NPC_LIBRARY.md
- EFFECT_LIBRARY.md
- MAP_OBJECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Summary

The Asset ID System establishes a permanent, globally unique identification scheme for every asset in Project Genesis.

Stable identifiers improve maintainability, support automation, simplify localization and save-game compatibility, and provide a reliable foundation for future expansions, modding and AI-assisted content creation.
