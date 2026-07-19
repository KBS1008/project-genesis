# Effect Library

**Project:** Project Genesis
**Version:** 1.0
**Status:** Planning
**Last Updated:** 2026-07-12

---

# Purpose

The Effect Library is the master catalog of every visual effect (VFX) used throughout Project Genesis.

Effects communicate gameplay events, operational status, environmental conditions and user feedback. This library serves as the authoritative reference for designers, artists, developers and AI-assisted asset generation.

This document complements EFFECT_STYLE_GUIDE.md by defining _which_ effects exist rather than _how_ they should appear.

---

# Relationship to Other Documents

This document complements:

- EFFECT_STYLE_GUIDE.md
- ANIMATION_STYLE_GUIDE.md
- BUILDING_LIBRARY.md
- VEHICLE_LIBRARY.md
- NPC_LIBRARY.md
- MAP_OBJECT_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Naming Convention

Every effect receives a permanent identifier.

Format:

EFF-XXXX

Examples:

EFF-0001

EFF-0105

EFF-2500

Identifiers are permanent and must never be reused.

---

# Effect Status

Every effect follows the standard asset lifecycle.

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

# Effect Metadata

Every effect should define:

| Field             | Description            |
| ----------------- | ---------------------- |
| ID                | Permanent identifier   |
| Internal Name     | Development identifier |
| Display Name      | Player-facing name     |
| Category          | Effect group           |
| Trigger           | Gameplay event         |
| Looping           | Yes / No               |
| Duration          | Typical duration       |
| Sound Linked      | Yes / No               |
| Animation Set     | Animation reference    |
| Performance Level | Low / Medium / High    |
| Status            | Lifecycle status       |

---

# Effect Categories

Effects are organized into:

- Production
- Logistics
- Construction
- Environment
- Weather
- Energy
- Research
- Economy
- User Interface
- Alerts
- Emergency

---

# Production Effects

| ID       | Effect            | Trigger          | Loop | Status  |
| -------- | ----------------- | ---------------- | ---- | ------- |
| EFF-1001 | Factory Smoke     | Building Active  | Yes  | Planned |
| EFF-1002 | Steam Vent        | Production Cycle | Yes  | Planned |
| EFF-1003 | Conveyor Movement | Active Transport | Yes  | Planned |
| EFF-1004 | Welding Sparks    | Manufacturing    | Yes  | Planned |
| EFF-1005 | Furnace Glow      | Smelting         | Yes  | Planned |

---

# Logistics Effects

| ID       | Effect          | Trigger            | Loop | Status  |
| -------- | --------------- | ------------------ | ---- | ------- |
| EFF-2001 | Dust Trail      | Truck Movement     | Yes  | Planned |
| EFF-2002 | Ship Wake       | Ship Movement      | Yes  | Planned |
| EFF-2003 | Crane Operation | Cargo Loading      | Yes  | Planned |
| EFF-2004 | Container Lift  | Terminal Activity  | No   | Planned |
| EFF-2005 | Forklift Lights | Warehouse Activity | Yes  | Planned |

---

# Construction Effects

| ID       | Effect            | Trigger        | Loop | Status  |
| -------- | ----------------- | -------------- | ---- | ------- |
| EFF-3001 | Construction Dust | Active Build   | Yes  | Planned |
| EFF-3002 | Crane Assembly    | Construction   | Yes  | Planned |
| EFF-3003 | Concrete Pour     | Building Phase | No   | Planned |
| EFF-3004 | Material Delivery | Construction   | No   | Planned |

---

# Environmental Effects

| ID       | Effect             | Trigger        | Loop | Status  |
| -------- | ------------------ | -------------- | ---- | ------- |
| EFF-4001 | Moving Clouds      | Weather        | Yes  | Planned |
| EFF-4002 | Wind Through Trees | Wind           | Yes  | Planned |
| EFF-4003 | Water Movement     | Rivers / Lakes | Yes  | Planned |
| EFF-4004 | Fog                | Weather        | Yes  | Planned |

---

# Weather Effects

| ID       | Effect     | Trigger      | Loop | Status  |
| -------- | ---------- | ------------ | ---- | ------- |
| EFF-5001 | Rain       | Rain Weather | Yes  | Planned |
| EFF-5002 | Snowfall   | Snow Weather | Yes  | Planned |
| EFF-5003 | Lightning  | Thunderstorm | No   | Planned |
| EFF-5004 | Heavy Wind | Storm        | Yes  | Planned |

---

# Energy Effects

| ID       | Effect                | Trigger            | Loop | Status  |
| -------- | --------------------- | ------------------ | ---- | ------- |
| EFF-6001 | Power Flow            | Electricity Active | Yes  | Planned |
| EFF-6002 | Transformer Glow      | Substation         | Yes  | Planned |
| EFF-6003 | Wind Turbine Rotation | Wind Available     | Yes  | Planned |
| EFF-6004 | Solar Reflection      | Daylight           | Yes  | Planned |

---

# Research Effects

| ID       | Effect              | Trigger             | Loop | Status  |
| -------- | ------------------- | ------------------- | ---- | ------- |
| EFF-7001 | Research Complete   | Technology Finished | No   | Planned |
| EFF-7002 | Laboratory Activity | Research Running    | Yes  | Planned |

---

# Economy Effects

| ID       | Effect              | Trigger          | Loop | Status  |
| -------- | ------------------- | ---------------- | ---- | ------- |
| EFF-8001 | Profit Notification | Positive Balance | No   | Planned |
| EFF-8002 | Market Alert        | Market Change    | No   | Planned |
| EFF-8003 | Trade Confirmation  | Transaction      | No   | Planned |

---

# User Interface Effects

| ID       | Effect              | Trigger         | Loop | Status  |
| -------- | ------------------- | --------------- | ---- | ------- |
| EFF-9001 | Button Hover        | Pointer Hover   | No   | Planned |
| EFF-9002 | Window Transition   | UI Navigation   | No   | Planned |
| EFF-9003 | Selection Highlight | Object Selected | Yes  | Planned |

---

# Alert Effects

| ID       | Effect                | Trigger         | Loop | Status  |
| -------- | --------------------- | --------------- | ---- | ------- |
| EFF-9501 | Warning Pulse         | Warning         | Yes  | Planned |
| EFF-9502 | Critical Flash        | Emergency       | Yes  | Planned |
| EFF-9503 | Maintenance Indicator | Maintenance Due | Yes  | Planned |

---

# Emergency Effects

| ID       | Effect           | Trigger             | Loop | Status  |
| -------- | ---------------- | ------------------- | ---- | ------- |
| EFF-9901 | Fire             | Fire Event          | Yes  | Planned |
| EFF-9902 | Smoke Column     | Fire Event          | Yes  | Planned |
| EFF-9903 | Emergency Lights | Emergency Vehicle   | Yes  | Planned |
| EFF-9904 | Hazard Marker    | Industrial Accident | Yes  | Planned |

---

# Effect Priorities

Effects should follow these priority levels:

| Priority   | Usage                 |
| ---------- | --------------------- |
| Critical   | Emergencies           |
| High       | Active Production     |
| Medium     | Logistics             |
| Low        | Environment           |
| Background | Decorative Atmosphere |

Higher-priority effects may suppress lower-priority effects if performance limits are reached.

---

# Asset Pipeline

Each effect follows the standard asset lifecycle.

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

Every approved effect must:

- follow EFFECT_STYLE_GUIDE.md
- follow ANIMATION_STYLE_GUIDE.md
- communicate gameplay information clearly
- support AI regeneration
- remain performant
- scale correctly at all zoom levels

---

# Future Automation

The Effect Library should eventually generate:

- effect database
- animation assignments
- particle system configuration
- sound effect mapping
- localization keys
- AI prompt templates
- implementation tasks

---

# Related Documents

- EFFECT_STYLE_GUIDE.md
- ANIMATION_STYLE_GUIDE.md
- MAP_OBJECT_LIBRARY.md
- BUILDING_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Summary

The Effect Library is the authoritative catalog of all visual effects used throughout Project Genesis.

It ensures that every gameplay event, environmental condition and user interaction is represented consistently through a structured, reusable and scalable visual effect system.
