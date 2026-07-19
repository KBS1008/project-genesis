# Icon Library

**Project:** Project Genesis  
**Version:** 1.0  
**Status:** Planning  
**Last Updated:** 2026-07-12

---

# Purpose

This document serves as the master catalog of all icons used in Project Genesis.

Every icon must have:

- a unique identifier
- a unique name
- a defined category
- a clear purpose
- an implementation status

The Icon Library acts as the single source of truth for icon management throughout the project lifecycle.

---

# Relationship to Other Documents

This document complements:

- ICON_GUIDELINES.md
- UI_STYLE_GUIDE.md
- DESIGN_TOKENS.md
- ASSET_LIST.md
- AI_PROMPT_LIBRARY.md

---

# Naming Convention

Every icon receives a permanent identifier.

Format:

ICO-XXXX

Examples:

ICO-0001

ICO-0002

ICO-0105

ICO-1342

Identifiers must never be reused.

---

# Icon Status

Every icon should have one of the following states.

| Status       | Description                 |
| ------------ | --------------------------- |
| Planned      | Defined but not yet created |
| Prompt Ready | AI prompt prepared          |
| Generated    | Initial version created     |
| Reviewed     | Design review completed     |
| Approved     | Ready for production        |
| Deprecated   | No longer used              |

---

# Icon Categories

The library is organized into the following categories:

- User Interface
- Resources
- Buildings
- Production
- Logistics
- Research
- Finance
- Population
- Infrastructure
- Market
- Notifications
- Actions
- Navigation
- Statistics
- Settings
- Miscellaneous

---

# Icon Metadata

Each icon should include the following information.

| Field               | Description                 |
| ------------------- | --------------------------- |
| ID                  | Permanent identifier        |
| Name                | Internal icon name          |
| Category            | Functional category         |
| Purpose             | Intended usage              |
| Style               | Outline / Filled            |
| Color Category      | Defined in COLOR_PALETTE.md |
| SVG Available       | Yes / No                    |
| PNG Available       | Yes / No                    |
| AI Prompt Available | Yes / No                    |
| Status              | Lifecycle status            |

---

# User Interface Icons

| ID       | Name          | Purpose               | Status  |
| -------- | ------------- | --------------------- | ------- |
| ICO-0001 | Dashboard     | Open dashboard        | Planned |
| ICO-0002 | Home          | Return to home screen | Planned |
| ICO-0003 | Search        | Search interface      | Planned |
| ICO-0004 | Filter        | Filter data           | Planned |
| ICO-0005 | Sort          | Sort table            | Planned |
| ICO-0006 | Refresh       | Reload data           | Planned |
| ICO-0007 | Settings      | Open settings         | Planned |
| ICO-0008 | Help          | Open help             | Planned |
| ICO-0009 | Notifications | Notification center   | Planned |
| ICO-0010 | Profile       | Player profile        | Planned |

---

# Resource Icons

| ID       | Name        | Purpose       | Status  |
| -------- | ----------- | ------------- | ------- |
| ICO-1001 | Wood        | Resource icon | Planned |
| ICO-1002 | Stone       | Resource icon | Planned |
| ICO-1003 | Sand        | Resource icon | Planned |
| ICO-1004 | Iron Ore    | Resource icon | Planned |
| ICO-1005 | Coal        | Resource icon | Planned |
| ICO-1006 | Steel       | Resource icon | Planned |
| ICO-1007 | Water       | Resource icon | Planned |
| ICO-1008 | Electricity | Resource icon | Planned |
| ICO-1009 | Oil         | Resource icon | Planned |
| ICO-1010 | Gas         | Resource icon | Planned |

---

# Building Icons

| ID       | Name            | Purpose       | Status  |
| -------- | --------------- | ------------- | ------- |
| ICO-2001 | Farm            | Building icon | Planned |
| ICO-2002 | Mine            | Building icon | Planned |
| ICO-2003 | Quarry          | Building icon | Planned |
| ICO-2004 | Warehouse       | Building icon | Planned |
| ICO-2005 | Steel Mill      | Building icon | Planned |
| ICO-2006 | Power Plant     | Building icon | Planned |
| ICO-2007 | Harbor          | Building icon | Planned |
| ICO-2008 | Airport         | Building icon | Planned |
| ICO-2009 | University      | Building icon | Planned |
| ICO-2010 | Research Center | Building icon | Planned |

---

# Finance Icons

| ID       | Name       | Purpose             | Status  |
| -------- | ---------- | ------------------- | ------- |
| ICO-3001 | Revenue    | Financial dashboard | Planned |
| ICO-3002 | Profit     | Financial dashboard | Planned |
| ICO-3003 | Expenses   | Financial dashboard | Planned |
| ICO-3004 | Investment | Financial dashboard | Planned |
| ICO-3005 | Loan       | Financial dashboard | Planned |
| ICO-3006 | Tax        | Financial dashboard | Planned |
| ICO-3007 | Budget     | Financial dashboard | Planned |
| ICO-3008 | Bankruptcy | Financial dashboard | Planned |

---

# Research Icons

| ID       | Name                    | Purpose       | Status  |
| -------- | ----------------------- | ------------- | ------- |
| ICO-4001 | Artificial Intelligence | Research tree | Planned |
| ICO-4002 | Robotics                | Research tree | Planned |
| ICO-4003 | Logistics               | Research tree | Planned |
| ICO-4004 | Automation              | Research tree | Planned |
| ICO-4005 | Agriculture             | Research tree | Planned |
| ICO-4006 | Energy                  | Research tree | Planned |

---

# Logistics Icons

| ID       | Name       | Purpose   | Status  |
| -------- | ---------- | --------- | ------- |
| ICO-5001 | Truck      | Logistics | Planned |
| ICO-5002 | Train      | Logistics | Planned |
| ICO-5003 | Cargo Ship | Logistics | Planned |
| ICO-5004 | Airplane   | Logistics | Planned |
| ICO-5005 | Warehouse  | Logistics | Planned |
| ICO-5006 | Container  | Logistics | Planned |

---

# Notification Icons

| ID       | Name        | Purpose             | Status  |
| -------- | ----------- | ------------------- | ------- |
| ICO-6001 | Success     | Success message     | Planned |
| ICO-6002 | Warning     | Warning message     | Planned |
| ICO-6003 | Error       | Error message       | Planned |
| ICO-6004 | Information | Information message | Planned |
| ICO-6005 | Question    | Confirmation dialog | Planned |

---

# Future Categories

Additional icon groups may include:

- Population
- Politics
- Tourism
- Environment
- Construction
- Military (if ever introduced)
- Multiplayer
- Achievements
- Modding
- Debug

---

# Asset Pipeline

Each icon follows this lifecycle:

```text
Planned
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
Integrated
```

---

# Quality Requirements

Every approved icon must:

- follow ICON_GUIDELINES.md
- use the official color palette
- support small-scale rendering
- be available as SVG
- include monochrome support
- integrate visually with the complete icon family

---

# Future Automation

The library should eventually support automatic generation of:

- SVG exports
- PNG exports
- sprite sheets
- icon documentation
- asset validation reports

---

# Related Documents

- ICON_GUIDELINES.md
- UI_STYLE_GUIDE.md
- DESIGN_TOKENS.md
- AI_PROMPT_LIBRARY.md
- ASSET_LIST.md

---

# Summary

The Icon Library provides a structured inventory of every icon used in Project Genesis.

It ensures consistency, traceability and scalability while supporting AI-assisted asset generation and long-term maintenance.
