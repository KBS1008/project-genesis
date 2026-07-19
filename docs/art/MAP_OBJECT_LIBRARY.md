# Map Object Library

**Project:** Project Genesis
**Version:** 1.0
**Status:** Planning
**Last Updated:** 2026-07-12

---

# Purpose

The Map Object Library is the master catalog of all non-building world objects used throughout Project Genesis.

Map objects create environmental detail, improve navigation, reinforce biome identity and support environmental storytelling without functioning as production buildings.

This document complements MAP_STYLE_GUIDE.md by defining _which_ map objects exist rather than _how_ they should appear.

---

# Relationship to Other Documents

This document complements:

- MAP_STYLE_GUIDE.md
- BIOME_GUIDE.md
- BUILDING_LIBRARY.md
- RESOURCE_LIBRARY.md
- EFFECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Naming Convention

Every map object receives a permanent identifier.

Format:

MAP-XXXX

Examples:

MAP-0001

MAP-0150

MAP-4200

Identifiers are permanent and must never be reused.

---

# Object Status

Every map object follows the standard asset lifecycle.

| Status       | Description                 |
| ------------ | --------------------------- |
| Planned      | Defined but not implemented |
| Concept      | Concept artwork available   |
| Prompt Ready | AI prompt completed         |
| Generated    | Initial asset generated     |
| Reviewed     | Design review completed     |
| Approved     | Ready for implementation    |
| Implemented  | Available in the game       |
| Deprecated   | Removed from development    |

---

# Object Metadata

Every object should define:

| Field            | Description            |
| ---------------- | ---------------------- |
| ID               | Permanent identifier   |
| Internal Name    | Development identifier |
| Display Name     | Player-facing name     |
| Category         | Object group           |
| Biome            | Preferred biome        |
| Collision        | Yes / No               |
| Destructible     | Yes / No               |
| Seasonal Variant | Yes / No               |
| LOD Levels       | Number of models       |
| Status           | Lifecycle status       |

---

# Object Categories

Map objects are organized into:

- Vegetation
- Rocks
- Water Features
- Roads & Infrastructure
- Utility Objects
- Fences & Barriers
- Decorative Objects
- Historical Objects
- Public Furniture
- Terrain Details

---

# Vegetation

| ID       | Object       | Biome     | Seasonal | Status  |
| -------- | ------------ | --------- | -------- | ------- |
| MAP-1001 | Oak Tree     | Temperate | Yes      | Planned |
| MAP-1002 | Pine Tree    | Forest    | Yes      | Planned |
| MAP-1003 | Birch Tree   | Temperate | Yes      | Planned |
| MAP-1004 | Bush         | All       | Yes      | Planned |
| MAP-1005 | Wild Grass   | All       | Yes      | Planned |
| MAP-1006 | Flower Patch | Plains    | Yes      | Planned |

---

# Rocks

| ID       | Object          | Biome    | Collision | Status  |
| -------- | --------------- | -------- | --------- | ------- |
| MAP-2001 | Small Rock      | All      | Yes       | Planned |
| MAP-2002 | Large Boulder   | Mountain | Yes       | Planned |
| MAP-2003 | Cliff Formation | Mountain | Yes       | Planned |
| MAP-2004 | Gravel Patch    | All      | No        | Planned |

---

# Water Features

| ID       | Object    | Biome        | Animated | Status  |
| -------- | --------- | ------------ | -------- | ------- |
| MAP-3001 | River     | River Valley | Yes      | Planned |
| MAP-3002 | Lake      | All          | Yes      | Planned |
| MAP-3003 | Waterfall | Mountain     | Yes      | Planned |
| MAP-3004 | Marsh     | Wetlands     | Yes      | Planned |
| MAP-3005 | Coastline | Coastal      | Yes      | Planned |

---

# Roads & Infrastructure

| ID       | Object           | Biome        | Collision | Status  |
| -------- | ---------------- | ------------ | --------- | ------- |
| MAP-4001 | Dirt Road        | Rural        | No        | Planned |
| MAP-4002 | Asphalt Road     | All          | No        | Planned |
| MAP-4003 | Railway Crossing | Industrial   | No        | Planned |
| MAP-4004 | Stone Bridge     | River Valley | No        | Planned |
| MAP-4005 | Tunnel Entrance  | Mountain     | No        | Planned |

---

# Utility Objects

| ID       | Object       | Biome | Collision | Status  |
| -------- | ------------ | ----- | --------- | ------- |
| MAP-5001 | Power Pole   | All   | Yes       | Planned |
| MAP-5002 | Street Light | Urban | Yes       | Planned |
| MAP-5003 | Traffic Sign | All   | Yes       | Planned |
| MAP-5004 | Utility Box  | Urban | Yes       | Planned |

---

# Fences & Barriers

| ID       | Object           | Biome      | Collision | Status  |
| -------- | ---------------- | ---------- | --------- | ------- |
| MAP-6001 | Wooden Fence     | Rural      | Yes       | Planned |
| MAP-6002 | Metal Fence      | Industrial | Yes       | Planned |
| MAP-6003 | Guard Rail       | Roads      | Yes       | Planned |
| MAP-6004 | Concrete Barrier | Industrial | Yes       | Planned |

---

# Decorative Objects

| ID       | Object     | Biome | Seasonal | Status  |
| -------- | ---------- | ----- | -------- | ------- |
| MAP-7001 | Bench      | Urban | No       | Planned |
| MAP-7002 | Trash Bin  | Urban | No       | Planned |
| MAP-7003 | Statue     | Urban | No       | Planned |
| MAP-7004 | Flower Bed | Urban | Yes      | Planned |

---

# Historical Objects

| ID       | Object                  | Biome      | Destructible | Status  |
| -------- | ----------------------- | ---------- | ------------ | ------- |
| MAP-8001 | Old Windmill            | Rural      | No           | Planned |
| MAP-8002 | Abandoned Factory       | Industrial | No           | Planned |
| MAP-8003 | Historic Railway Signal | Railway    | No           | Planned |
| MAP-8004 | Stone Ruins             | Mountain   | No           | Planned |

---

# Public Furniture

| ID       | Object            | Biome | Seasonal | Status  |
| -------- | ----------------- | ----- | -------- | ------- |
| MAP-9001 | Bus Stop          | Urban | No       | Planned |
| MAP-9002 | Bicycle Rack      | Urban | No       | Planned |
| MAP-9003 | Information Board | Parks | No       | Planned |
| MAP-9004 | Park Lamp         | Parks | No       | Planned |

---

# Terrain Details

| ID       | Object        | Biome    | Seasonal | Status  |
| -------- | ------------- | -------- | -------- | ------- |
| MAP-9501 | Tire Tracks   | All      | No       | Planned |
| MAP-9502 | Fallen Leaves | Forest   | Yes      | Planned |
| MAP-9503 | Snow Pile     | Winter   | Yes      | Planned |
| MAP-9504 | Mud Patch     | Wetlands | Yes      | Planned |

---

# Biome Integration

Every object should specify:

- preferred biome
- spawn probability
- density
- clustering behavior
- seasonal availability

Biome rules are defined in BIOME_GUIDE.md.

---

# Level of Detail (LOD)

Every object should support multiple detail levels.

| Level     | Purpose          |
| --------- | ---------------- |
| LOD0      | Close inspection |
| LOD1      | Normal gameplay  |
| LOD2      | Strategic zoom   |
| Billboard | Maximum zoom out |

---

# Placement Rules

Objects should support procedural generation using:

- spacing rules
- terrain slope limits
- biome restrictions
- clustering
- avoidance zones
- infrastructure proximity

---

# Asset Pipeline

Each object follows the standard asset lifecycle.

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

Every approved map object must:

- follow MAP_STYLE_GUIDE.md
- support procedural placement
- integrate with biome rules
- remain recognizable at all zoom levels
- support AI regeneration
- use consistent scaling

---

# Future Automation

The Map Object Library should eventually generate:

- procedural placement rules
- world generation data
- biome spawn tables
- localization keys
- AI prompt templates
- implementation tasks

---

# Related Documents

- MAP_STYLE_GUIDE.md
- BIOME_GUIDE.md
- BUILDING_LIBRARY.md
- EFFECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Summary

The Map Object Library is the authoritative catalog of all environmental world objects in Project Genesis.

It provides the foundation for procedural world generation, environmental storytelling, biome differentiation and consistent asset production while maintaining the project's realistic industrial visual language.
