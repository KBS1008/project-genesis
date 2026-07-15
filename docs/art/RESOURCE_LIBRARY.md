# Resource Library

**Project:** Project Genesis
**Version:** 1.0
**Status:** Planning
**Last Updated:** 2026-07-12

---

# Purpose

The Resource Library is the master catalog of every resource used throughout Project Genesis.

It provides a centralized inventory for designers, developers, artists and AI-assisted workflows by assigning every resource a permanent identifier, category, gameplay purpose and lifecycle status.

This document complements RESOURCE_STYLE_GUIDE.md by defining *what* resources exist rather than *how* they should appear.

---

# Relationship to Other Documents

This document complements:

- RESOURCE_STYLE_GUIDE.md
- BUILDING_LIBRARY.md
- VEHICLE_LIBRARY.md
- MAP_OBJECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md
- ASSET_LIST.md

---

# Naming Convention

Every resource receives a permanent identifier.

Format:

RES-XXXX

Examples:

RES-0001

RES-0100

RES-2045

Identifiers are permanent and must never be reused.

---

# Resource Status

Every resource follows the same lifecycle.

| Status | Description |
|---------|-------------|
| Planned | Defined but not implemented |
| Concept | Concept artwork available |
| Prompt Ready | AI prompt completed |
| Generated | Initial asset generated |
| Reviewed | Design review completed |
| Approved | Ready for implementation |
| Implemented | Available in the game |
| Deprecated | Removed from active development |

---

# Resource Metadata

Every resource should define:

| Field | Description |
|--------|-------------|
| ID | Permanent identifier |
| Internal Name | Development identifier |
| Display Name | Player-facing name |
| Category | Resource group |
| Tier | Processing level |
| Stack Size | Inventory size |
| Unit | kg, L, pcs, MWh, etc. |
| Produced By | Buildings producing the resource |
| Consumed By | Buildings consuming the resource |
| Tradable | Yes / No |
| Status | Lifecycle status |

---

# Resource Categories

Resources are organized into:

- Raw Materials
- Agricultural Products
- Industrial Materials
- Manufactured Goods
- Consumer Goods
- Chemicals
- Liquids
- Gases
- Energy
- Waste
- Luxury Goods

---

# Raw Materials

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-1001 | Wood Logs | Forestry | I | Planned |
| RES-1002 | Stone | Quarry | I | Planned |
| RES-1003 | Sand | Sand Pit | I | Planned |
| RES-1004 | Iron Ore | Iron Mine | I | Planned |
| RES-1005 | Coal | Coal Mine | I | Planned |
| RES-1006 | Crude Oil | Oil Well | II | Planned |
| RES-1007 | Natural Gas | Gas Extraction Plant | II | Planned |

---

# Agricultural Products

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-2001 | Wheat | Farm | I | Planned |
| RES-2002 | Corn | Farm | I | Planned |
| RES-2003 | Potatoes | Farm | I | Planned |
| RES-2004 | Milk | Dairy Farm | II | Planned |
| RES-2005 | Meat | Livestock Farm | II | Planned |
| RES-2006 | Fruit | Orchard | II | Planned |

---

# Industrial Materials

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-3001 | Lumber | Sawmill | II | Planned |
| RES-3002 | Steel | Steel Mill | II | Planned |
| RES-3003 | Cement | Cement Plant | II | Planned |
| RES-3004 | Glass | Glass Factory | II | Planned |
| RES-3005 | Plastic | Chemical Plant | III | Planned |
| RES-3006 | Copper Wire | Metal Processing | III | Planned |

---

# Manufactured Goods

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-4001 | Machinery | Machine Factory | III | Planned |
| RES-4002 | Electronics | Electronics Factory | III | Planned |
| RES-4003 | Vehicle Parts | Component Plant | III | Planned |
| RES-4004 | Household Appliances | Appliance Factory | IV | Planned |
| RES-4005 | Automobiles | Vehicle Factory | IV | Planned |

---

# Consumer Goods

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-5001 | Bread | Bakery | II | Planned |
| RES-5002 | Clothing | Textile Factory | II | Planned |
| RES-5003 | Furniture | Furniture Factory | III | Planned |
| RES-5004 | Beverages | Beverage Plant | II | Planned |

---

# Chemicals

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-6001 | Fertilizer | Chemical Plant | III | Planned |
| RES-6002 | Industrial Chemicals | Chemical Plant | III | Planned |
| RES-6003 | Pharmaceuticals | Pharmaceutical Plant | IV | Planned |

---

# Liquids

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-7001 | Water | Water Treatment Plant | I | Planned |
| RES-7002 | Fuel | Refinery | III | Planned |
| RES-7003 | Lubricants | Chemical Plant | III | Planned |

---

# Gases

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-8001 | Oxygen | Gas Plant | II | Planned |
| RES-8002 | Hydrogen | Electrolysis Plant | IV | Planned |
| RES-8003 | Carbon Dioxide | Chemical Plant | III | Planned |

---

# Energy

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-9001 | Electricity | Power Plants | I | Planned |
| RES-9002 | Heat | Heating Plant | II | Planned |
| RES-9003 | Steam | Steam Plant | II | Planned |

---

# Waste

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-9501 | Industrial Waste | Factories | II | Planned |
| RES-9502 | Recyclables | Recycling Center | III | Planned |
| RES-9503 | Hazardous Waste | Chemical Industry | IV | Planned |

---

# Luxury Goods

| ID | Resource | Produced By | Tier | Status |
|----|----------|-------------|------|--------|
| RES-9901 | Luxury Furniture | Premium Factory | IV | Planned |
| RES-9902 | Jewelry | Jewelry Workshop | IV | Planned |
| RES-9903 | Fine Wine | Winery | III | Planned |

---

# Resource Progression

Resources should generally follow a production chain.

Example:

Wood Logs

↓

Lumber

↓

Furniture

↓

Luxury Furniture

Every resource should fit into at least one production chain.

---

# Asset Pipeline

Each resource follows the standard asset lifecycle.

```text
Planned
    │
    ▼
Concept
    │
    ▼
AI Prompt
    │
    ▼
Generated
    │
    ▼
Review
    │
    ▼
Approved
    │
    ▼
Implemented
```

---

# Quality Requirements

Every approved resource must:

- follow RESOURCE_STYLE_GUIDE.md
- use the official color palette
- remain recognizable at all UI scales
- support AI regeneration
- integrate into at least one production chain

---

# Future Automation

The Resource Library should eventually generate:

- resource database
- crafting recipes
- production chains
- balancing spreadsheets
- localization keys
- AI prompt templates
- implementation tasks

---

# Related Documents

- RESOURCE_STYLE_GUIDE.md
- BUILDING_LIBRARY.md
- VEHICLE_LIBRARY.md
- MAP_OBJECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Summary

The Resource Library is the authoritative catalog of all resources in Project Genesis.

It provides a structured inventory that supports gameplay design, balancing, asset creation, AI-assisted workflows and implementation while ensuring consistency across the entire economic simulation.