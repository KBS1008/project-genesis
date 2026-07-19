# Vehicle Library

**Project:** Project Genesis
**Version:** 1.0
**Status:** Planning
**Last Updated:** 2026-07-12

---

# Purpose

The Vehicle Library is the master catalog of all movable transport assets in Project Genesis.

Vehicles connect production, logistics and infrastructure by transporting resources, goods, people and energy throughout the simulated economy.

This document complements VEHICLE_STYLE_GUIDE.md by defining _which_ vehicles exist rather than _how_ they should appear.

---

# Relationship to Other Documents

This document complements:

- VEHICLE_STYLE_GUIDE.md
- RESOURCE_LIBRARY.md
- BUILDING_LIBRARY.md
- MAP_OBJECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md
- ASSET_LIST.md

---

# Naming Convention

Every vehicle receives a permanent identifier.

Format:

VEH-XXXX

Examples:

VEH-0001

VEH-0150

VEH-1200

Identifiers are permanent and must never be reused.

---

# Vehicle Status

Every vehicle follows the standard asset lifecycle.

| Status       | Description                 |
| ------------ | --------------------------- |
| Planned      | Defined but not implemented |
| Concept      | Concept artwork available   |
| Prompt Ready | AI prompt completed         |
| Generated    | First asset generated       |
| Reviewed     | Design review completed     |
| Approved     | Ready for implementation    |
| Implemented  | Available in the game       |
| Deprecated   | Removed from development    |

---

# Vehicle Metadata

Every vehicle should define:

| Field           | Description                      |
| --------------- | -------------------------------- |
| ID              | Permanent identifier             |
| Internal Name   | Development identifier           |
| Display Name    | Player-facing name               |
| Category        | Vehicle group                    |
| Technology Tier | Unlock level                     |
| Cargo Type      | Supported cargo                  |
| Capacity        | Transport capacity               |
| Speed           | Maximum operating speed          |
| Energy Source   | Diesel, Electric, Hydrogen, etc. |
| Operating Cost  | Running cost                     |
| Build Cost      | Construction cost                |
| Upgrade Path    | Future replacement               |
| Status          | Lifecycle status                 |

---

# Vehicle Categories

Vehicles are organized into:

- Road Transport
- Rail Transport
- Maritime Transport
- Air Transport
- Industrial Vehicles
- Construction Vehicles
- Emergency Vehicles
- Utility Vehicles
- Autonomous Vehicles

---

# Road Transport

| ID       | Vehicle            | Cargo                  | Tier | Status  |
| -------- | ------------------ | ---------------------- | ---- | ------- |
| VEH-1001 | Small Delivery Van | Consumer Goods         | I    | Planned |
| VEH-1002 | Box Truck          | General Cargo          | I    | Planned |
| VEH-1003 | Flatbed Truck      | Construction Materials | II   | Planned |
| VEH-1004 | Tank Truck         | Liquids                | II   | Planned |
| VEH-1005 | Bulk Trailer       | Grain / Coal           | II   | Planned |
| VEH-1006 | Heavy Haul Truck   | Machinery              | III  | Planned |

---

# Rail Transport

| ID       | Vehicle                     | Cargo          | Tier | Status  |
| -------- | --------------------------- | -------------- | ---- | ------- |
| VEH-2001 | Diesel Freight Locomotive   | General Cargo  | II   | Planned |
| VEH-2002 | Electric Freight Locomotive | General Cargo  | III  | Planned |
| VEH-2003 | Flat Wagon                  | Containers     | II   | Planned |
| VEH-2004 | Hopper Wagon                | Bulk Materials | II   | Planned |
| VEH-2005 | Tank Wagon                  | Liquids        | III  | Planned |
| VEH-2006 | Car Carrier Wagon           | Vehicles       | IV   | Planned |

---

# Maritime Transport

| ID       | Vehicle        | Cargo         | Tier | Status  |
| -------- | -------------- | ------------- | ---- | ------- |
| VEH-3001 | Cargo Ship     | General Cargo | III  | Planned |
| VEH-3002 | Container Ship | Containers    | IV   | Planned |
| VEH-3003 | Bulk Carrier   | Ore / Coal    | IV   | Planned |
| VEH-3004 | Oil Tanker     | Oil           | IV   | Planned |
| VEH-3005 | River Barge    | Inland Cargo  | III  | Planned |

---

# Air Transport

| ID       | Vehicle              | Cargo           | Tier | Status  |
| -------- | -------------------- | --------------- | ---- | ------- |
| VEH-4001 | Cargo Aircraft       | General Cargo   | IV   | Planned |
| VEH-4002 | Heavy Cargo Aircraft | Oversized Cargo | IV   | Planned |
| VEH-4003 | Logistics Drone      | Small Parcels   | V    | Planned |

---

# Industrial Vehicles

| ID       | Vehicle                        | Purpose              | Tier | Status  |
| -------- | ------------------------------ | -------------------- | ---- | ------- |
| VEH-5001 | Forklift                       | Warehouse Operations | I    | Planned |
| VEH-5002 | Reach Stacker                  | Containers           | II   | Planned |
| VEH-5003 | Terminal Tractor               | Yard Logistics       | II   | Planned |
| VEH-5004 | Automated Guided Vehicle (AGV) | Factory Logistics    | III  | Planned |

---

# Construction Vehicles

| ID       | Vehicle              | Purpose             | Tier | Status  |
| -------- | -------------------- | ------------------- | ---- | ------- |
| VEH-6001 | Excavator            | Earthworks          | I    | Planned |
| VEH-6002 | Bulldozer            | Terrain Preparation | I    | Planned |
| VEH-6003 | Mobile Crane         | Heavy Construction  | II   | Planned |
| VEH-6004 | Concrete Mixer Truck | Concrete Transport  | II   | Planned |

---

# Emergency Vehicles

| ID       | Vehicle        | Purpose          | Tier | Status  |
| -------- | -------------- | ---------------- | ---- | ------- |
| VEH-7001 | Fire Engine    | Fire Response    | I    | Planned |
| VEH-7002 | Ambulance      | Medical Response | I    | Planned |
| VEH-7003 | Police Vehicle | Security         | I    | Planned |

---

# Utility Vehicles

| ID       | Vehicle         | Purpose        | Tier | Status  |
| -------- | --------------- | -------------- | ---- | ------- |
| VEH-8001 | Maintenance Van | Infrastructure | II   | Planned |
| VEH-8002 | Utility Truck   | Power Grid     | II   | Planned |
| VEH-8003 | Snow Plow       | Winter Service | III  | Planned |

---

# Autonomous Vehicles

| ID       | Vehicle                   | Purpose             | Tier | Status  |
| -------- | ------------------------- | ------------------- | ---- | ------- |
| VEH-9001 | Autonomous Delivery Truck | Logistics           | V    | Planned |
| VEH-9002 | Autonomous Freight Train  | Rail Logistics      | V    | Planned |
| VEH-9003 | Autonomous Cargo Drone    | High-Speed Delivery | V    | Planned |

---

# Technology Progression

Typical vehicle evolution:

Mechanical

↓

Diesel

↓

Electric

↓

Hybrid

↓

Hydrogen

↓

Autonomous

↓

AI-Optimized Fleet

Every generation should improve efficiency while maintaining visual continuity.

---

# Asset Pipeline

Each vehicle follows the standard asset lifecycle.

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

Every approved vehicle must:

- follow VEHICLE_STYLE_GUIDE.md
- remain recognizable at all zoom levels
- communicate cargo type visually
- integrate with logistics systems
- support AI regeneration
- match the official color palette

---

# Future Automation

The Vehicle Library should eventually generate:

- fleet database
- logistics balancing tables
- maintenance schedules
- localization keys
- AI prompt templates
- implementation tasks

---

# Related Documents

- VEHICLE_STYLE_GUIDE.md
- RESOURCE_LIBRARY.md
- BUILDING_LIBRARY.md
- MAP_OBJECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Summary

The Vehicle Library is the authoritative catalog of all transport assets in Project Genesis.

It defines every movable logistics asset used throughout the simulation and provides a structured foundation for gameplay systems, balancing, AI-assisted asset creation and future implementation.
