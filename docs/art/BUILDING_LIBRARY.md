# Building Library

**Project:** Project Genesis  
**Version:** 1.0  
**Status:** Planning  
**Last Updated:** 2026-07-12

---

# Purpose

The Building Library is the master catalog of every constructible building in Project Genesis.

It provides a single source of truth for designers, developers, artists and AI-assisted workflows by assigning every building a permanent identifier, category, gameplay purpose and lifecycle status.

This document complements BUILDING_STYLE_GUIDE.md by defining *what* exists rather than *how* it looks.

---

# Relationship to Other Documents

This document complements:

- BUILDING_STYLE_GUIDE.md
- RESOURCE_LIBRARY.md
- MAP_STYLE_GUIDE.md
- AI_PROMPT_LIBRARY.md
- ASSET_LIST.md

---

# Naming Convention

Every building receives a permanent identifier.

Format:

BLD-XXXX

Examples:

BLD-0001

BLD-0105

BLD-1023

Identifiers are permanent and must never be reused.

---

# Building Status

Every building follows the same lifecycle.

| Status | Description |
|---------|-------------|
| Planned | Defined but not implemented |
| Concept | Concept art available |
| Prompt Ready | AI prompt completed |
| Generated | First visual version created |
| Reviewed | Design review completed |
| Approved | Ready for implementation |
| Implemented | Available in the game |
| Deprecated | Removed from active development |

---

# Metadata

Every building should define:

| Field | Description |
|--------|-------------|
| ID | Permanent identifier |
| Internal Name | Development name |
| Display Name | Player-facing name |
| Category | Functional category |
| Technology Tier | Unlock level |
| Construction Cost | Planned balance value |
| Size | Map footprint |
| Employees | Planned workforce |
| Input Resources | Required materials |
| Output Resources | Produced goods |
| Energy Usage | Consumption or production |
| Upgrade Path | Next building tier |
| Status | Lifecycle status |

---

# Building Categories

The library is organized into the following categories:

- Resource Extraction
- Agriculture
- Manufacturing
- Logistics
- Energy
- Research
- Administration
- Services
- Infrastructure
- Environment
- Military (Reserved)
- Special Buildings

---

# Resource Extraction

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-1001 | Forestry | Harvest wood | I | Planned |
| BLD-1002 | Stone Quarry | Produce stone | I | Planned |
| BLD-1003 | Iron Mine | Produce iron ore | II | Planned |
| BLD-1004 | Coal Mine | Produce coal | II | Planned |
| BLD-1005 | Oil Well | Produce crude oil | III | Planned |
| BLD-1006 | Gas Extraction Plant | Produce natural gas | III | Planned |

---

# Agriculture

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-2001 | Crop Farm | Produce crops | I | Planned |
| BLD-2002 | Greenhouse | High-efficiency farming | II | Planned |
| BLD-2003 | Livestock Farm | Produce animal products | II | Planned |
| BLD-2004 | Food Processing Plant | Process agricultural goods | III | Planned |

---

# Manufacturing

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-3001 | Sawmill | Process wood | I | Planned |
| BLD-3002 | Steel Mill | Produce steel | II | Planned |
| BLD-3003 | Cement Plant | Produce cement | II | Planned |
| BLD-3004 | Electronics Factory | Produce electronics | III | Planned |
| BLD-3005 | Chemical Plant | Produce chemicals | III | Planned |
| BLD-3006 | Automobile Factory | Produce vehicles | IV | Planned |

---

# Logistics

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-4001 | Warehouse | Store goods | I | Planned |
| BLD-4002 | Distribution Center | Manage logistics | II | Planned |
| BLD-4003 | Cargo Terminal | Rail logistics | III | Planned |
| BLD-4004 | Harbor | Maritime logistics | IV | Planned |
| BLD-4005 | Airport Cargo Hub | Air logistics | IV | Planned |

---

# Energy

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-5001 | Wind Farm | Renewable energy | II | Planned |
| BLD-5002 | Solar Farm | Renewable energy | II | Planned |
| BLD-5003 | Hydroelectric Plant | Renewable energy | III | Planned |
| BLD-5004 | Gas Power Plant | Electricity generation | III | Planned |
| BLD-5005 | Nuclear Power Plant | High-capacity energy | IV | Planned |
| BLD-5006 | Battery Storage | Energy storage | IV | Planned |

---

# Research

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-6001 | University | Education | II | Planned |
| BLD-6002 | Research Laboratory | Research | III | Planned |
| BLD-6003 | Innovation Center | Advanced research | IV | Planned |

---

# Administration

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-7001 | Headquarters | Company management | I | Planned |
| BLD-7002 | Financial Center | Financial operations | II | Planned |
| BLD-7003 | Regional Office | Regional administration | III | Planned |

---

# Services

| ID | Building | Purpose | Tier | Status |
|----|----------|----------|------|--------|
| BLD-8001 | Fire Station | Emergency response | I | Planned |
| BLD-8002 | Hospital | Healthcare | II | Planned |
| BLD-8003 | Police Station | Public safety | II | Planned |
| BLD-8004 | Training Center | Workforce development | III | Planned |

---

# Infrastructure

Typical future infrastructure assets include:

- Roads
- Railways
- Bridges
- Tunnels
- Power Lines
- Pipelines
- Water Networks

Infrastructure assets may later receive their own dedicated library.

---

# Upgrade Paths

Buildings should define upgrade relationships.

Example:

Crop Farm

↓

Automated Farm

↓

Smart Farm

↓

Autonomous Agricultural Complex

Upgrade paths should preserve the visual language while reflecting technological progress.

---

# Asset Pipeline

Each building follows the standard asset lifecycle:

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

Every approved building must:

- follow BUILDING_STYLE_GUIDE.md
- support the official camera perspective
- use approved materials
- integrate with logistics systems
- support technology progression
- maintain silhouette recognition at all zoom levels

---

# Future Automation

The Building Library should eventually generate:

- asset lists
- implementation tasks
- AI prompt templates
- balancing spreadsheets
- localization keys
- documentation reports

---

# Related Documents

- BUILDING_STYLE_GUIDE.md
- RESOURCE_LIBRARY.md
- MAP_STYLE_GUIDE.md
- AI_PROMPT_LIBRARY.md
- ASSET_LIST.md

---

# Summary

The Building Library is the authoritative catalog of all buildings in Project Genesis.

It provides a structured inventory that supports asset production, balancing, implementation and long-term maintenance while ensuring consistency across development, art and gameplay.