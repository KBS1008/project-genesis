# NPC Library

**Project:** Project Genesis
**Version:** 1.0
**Status:** Planning
**Last Updated:** 2026-07-12

---

# Purpose

The NPC Library is the master catalog of all non-player character types used throughout Project Genesis.

NPCs represent the human workforce behind the economy. They operate buildings, transport goods, conduct research, maintain infrastructure and provide public services.

This document complements NPC_STYLE_GUIDE.md by defining *which* NPC types exist rather than *how* they should appear.

---

# Relationship to Other Documents

This document complements:

- NPC_STYLE_GUIDE.md
- BUILDING_LIBRARY.md
- VEHICLE_LIBRARY.md
- RESOURCE_LIBRARY.md
- AI_PROMPT_LIBRARY.md
- CHARACTER_ANIMATION_LIBRARY.md

---

# Naming Convention

Every NPC type receives a permanent identifier.

Format:

NPC-XXXX

Examples:

NPC-0001

NPC-0100

NPC-2500

Identifiers are permanent and must never be reused.

---

# NPC Status

Every NPC follows the standard asset lifecycle.

| Status | Description |
|---------|-------------|
| Planned | Defined but not implemented |
| Concept | Concept artwork available |
| Prompt Ready | AI prompt completed |
| Generated | Initial asset generated |
| Reviewed | Design review completed |
| Approved | Ready for implementation |
| Implemented | Available in the game |
| Deprecated | Removed from development |

---

# NPC Metadata

Every NPC should define:

| Field | Description |
|--------|-------------|
| ID | Permanent identifier |
| Internal Name | Development identifier |
| Display Name | Player-facing name |
| Category | Profession group |
| Workplace | Typical workplace |
| Technology Tier | Unlock level |
| Required Education | Skill level |
| Animation Set | Assigned animation package |
| Equipment | Typical tools or clothing |
| Status | Lifecycle status |

---

# NPC Categories

NPCs are organized into:

- Industrial Workers
- Logistics Personnel
- Construction Workers
- Engineers
- Scientists
- Office Employees
- Agriculture
- Public Services
- Executives
- Visitors

---

# Industrial Workers

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-1001 | Factory Worker | Manufacturing | I | Planned |
| NPC-1002 | Machine Operator | Manufacturing | II | Planned |
| NPC-1003 | Assembly Technician | Manufacturing | II | Planned |
| NPC-1004 | Production Supervisor | Manufacturing | III | Planned |

---

# Logistics Personnel

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-2001 | Truck Driver | Logistics | I | Planned |
| NPC-2002 | Warehouse Worker | Warehouse | I | Planned |
| NPC-2003 | Forklift Operator | Warehouse | II | Planned |
| NPC-2004 | Logistics Coordinator | Distribution Center | III | Planned |

---

# Construction Workers

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-3001 | Construction Worker | Construction Site | I | Planned |
| NPC-3002 | Crane Operator | Construction Site | II | Planned |
| NPC-3003 | Site Engineer | Construction Site | III | Planned |
| NPC-3004 | Construction Manager | Construction Site | IV | Planned |

---

# Engineers

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-4001 | Mechanical Engineer | Factory | III | Planned |
| NPC-4002 | Electrical Engineer | Power Plant | III | Planned |
| NPC-4003 | Process Engineer | Chemical Plant | IV | Planned |

---

# Scientists

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-5001 | Research Scientist | Laboratory | III | Planned |
| NPC-5002 | Senior Researcher | Innovation Center | IV | Planned |
| NPC-5003 | Chief Scientist | Research Campus | V | Planned |

---

# Office Employees

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-6001 | Office Clerk | Office | I | Planned |
| NPC-6002 | Accountant | Headquarters | II | Planned |
| NPC-6003 | Financial Analyst | Finance Center | III | Planned |
| NPC-6004 | Human Resources Manager | Headquarters | III | Planned |

---

# Agriculture

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-7001 | Farmer | Farm | I | Planned |
| NPC-7002 | Livestock Specialist | Farm | II | Planned |
| NPC-7003 | Agronomist | Agricultural Center | III | Planned |

---

# Public Services

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-8001 | Firefighter | Fire Station | I | Planned |
| NPC-8002 | Police Officer | Police Station | I | Planned |
| NPC-8003 | Paramedic | Hospital | II | Planned |
| NPC-8004 | Maintenance Technician | Utility Services | II | Planned |

---

# Executives

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-9001 | Operations Manager | Headquarters | III | Planned |
| NPC-9002 | Plant Director | Industrial Complex | IV | Planned |
| NPC-9003 | Chief Executive Officer | Headquarters | V | Planned |

---

# Visitors

| ID | NPC | Workplace | Tier | Status |
|----|------|-----------|------|--------|
| NPC-9501 | Visitor | Public Buildings | I | Planned |
| NPC-9502 | Investor | Headquarters | IV | Planned |
| NPC-9503 | Government Inspector | Various | IV | Planned |

---

# Career Progression

NPCs may advance through education and experience.

Example:

Factory Worker

↓

Machine Operator

↓

Production Supervisor

↓

Plant Director

Career progression supports long-term workforce development.

---

# Asset Pipeline

Each NPC follows the standard asset lifecycle.

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

Every approved NPC must:

- follow NPC_STYLE_GUIDE.md
- use the official color palette
- support assigned animation sets
- remain recognizable at all zoom levels
- integrate with workforce systems
- support AI regeneration

---

# Future Automation

The NPC Library should eventually generate:

- workforce database
- profession lists
- education requirements
- animation assignments
- localization keys
- AI prompt templates
- implementation tasks

---

# Related Documents

- NPC_STYLE_GUIDE.md
- BUILDING_LIBRARY.md
- VEHICLE_LIBRARY.md
- RESOURCE_LIBRARY.md
- CHARACTER_ANIMATION_LIBRARY.md
- AI_PROMPT_LIBRARY.md

---

# Summary

The NPC Library is the authoritative catalog of all workforce and character types in Project Genesis.

It provides a structured foundation for simulation systems, workforce management, animation, AI-assisted asset generation and future gameplay mechanics while ensuring visual and functional consistency across the project.