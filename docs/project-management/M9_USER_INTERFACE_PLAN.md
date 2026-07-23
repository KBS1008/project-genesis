# M9 – User Interface Plan

**Project:** Project Genesis  
**Milestone:** M9 – User Interface  
**Status:** In Progress (Gate 0 complete)  
**Predecessor:** M8 – NPC Economy  
**Primary objective:** Deliver a complete, deterministic, application-layer-driven user interface for observing, controlling, saving, loading, and operating the existing Project Genesis simulation.

---

# 1. Executive Summary

M9 introduces the first complete player-facing interface for Project Genesis.

The milestone shall expose the existing world, company, economy, production, research, transport, construction, finance, and savegame systems without duplicating domain logic or bypassing Application use cases.

The UI is a presentation layer only.

It shall:

- display authoritative state obtained through queries and read models;
- submit commands through existing Application use cases;
- represent simulation progress and errors clearly;
- provide deterministic and testable interaction flows;
- support keyboard and mouse operation;
- remain modular enough for future population, politics, government, and multiplayer milestones;
- avoid embedding business rules in components, screens, controllers, or view models.

M9 must not redesign the simulation or economy architecture created in M1–M8.

---

# 2. Milestone Goals

M9 is complete when a player can:

1. Start a new game.
2. Load and save a game.
3. Inspect the world and its regions.
4. Inspect and operate their company.
5. View company finances and inventory.
6. Inspect regional markets and execute trades.
7. Place buildings.
8. Start and inspect production.
9. Start and inspect research.
10. Inspect transport activity.
11. Control simulation time.
12. Receive understandable success, warning, and error feedback.
13. Navigate all primary gameplay areas without developer tools.
14. Complete a documented core gameplay loop through the UI.
15. Use the interface without the UI mutating repositories directly.

---

# 3. Non-Goals

The following are outside M9 unless already required by an accepted ADR:

- new economic rules;
- new company AI rules;
- population simulation;
- employment simulation;
- politics;
- government;
- diplomacy;
- multiplayer;
- networking;
- mod-management UI;
- advanced data visualization;
- mobile layouts;
- gamepad-first navigation;
- localization beyond preparing the architecture;
- cinematic presentation;
- complex animation systems;
- a custom rendering engine;
- order books or financial instruments;
- changes to authoritative domain rules merely to simplify the UI.

---

# 4. Mandatory Architecture Principles

## 4.1 Presentation-only responsibility

The UI may:

- format data;
- maintain transient visual state;
- coordinate navigation;
- validate basic input shape;
- invoke commands and queries;
- show pending, success, and failure states.

The UI must not:

- calculate authoritative prices;
- determine whether a trade is legal;
- mutate repositories;
- modify aggregates directly;
- advance simulation state outside the simulation API;
- duplicate production, research, construction, finance, or market rules;
- implement AI-specific business logic.

## 4.2 Command and query separation

Every player action shall follow this flow:

```text
UI Interaction
    ↓
Presentation Controller / View Model
    ↓
Application Command or Use Case
    ↓
Domain Validation
    ↓
Repository Mutation
    ↓
Result / Domain Events
    ↓
UI Refresh
```

Every state display shall follow this flow:

```text
UI Screen
    ↓
Presentation Query Adapter
    ↓
Application Query Handler / Read Model
    ↓
Immutable UI View Data
```

## 4.3 Authoritative state

Application and domain state remain authoritative.

UI stores may contain only:

- navigation state;
- selected entity IDs;
- open panels and dialogs;
- sorting and filtering preferences;
- transient form values;
- pending request state;
- non-authoritative cached read models.

## 4.4 Determinism

UI rendering frequency must not alter simulation results.

The simulation advances only through the existing simulation control interface.

The UI must not use:

- render timing as simulation time;
- wall-clock time for domain decisions;
- nondeterministic IDs for authoritative commands;
- asynchronous race outcomes to choose simulation actions.

---

# 5. Required Pre-Implementation Review

Before implementation, perform **M9 Architecture Review – Gate 0**.

The review must inspect:

- existing application entry points;
- current UI or rendering dependencies;
- runtime platform;
- build and packaging configuration;
- application query coverage;
- application use-case coverage;
- simulation control API;
- save/load API;
- event and notification infrastructure;
- dependency rules;
- test environment;
- accessibility capabilities;
- current design tokens or styles;
- whether a presentation architecture already exists.

The review shall conclude with exactly one of:

- `READY FOR M9 IMPLEMENTATION`
- `ARCHITECTURE CHANGES REQUIRED`

No major UI framework, state-management library, routing system, or component architecture shall be introduced without this review.

---

# 6. Expected Architecture Decisions

The Gate 0 review shall determine whether existing ADRs cover the following topics.

Create or amend ADRs only where the repository does not already define them.

## 6.1 Presentation architecture

Define:

- presentation-layer boundaries;
- screen/component/view-model responsibilities;
- allowed dependencies;
- query and command adapters;
- error handling;
- loading and refresh behavior.

## 6.2 UI state management

Define:

- authoritative versus transient state;
- local versus shared UI state;
- cache invalidation;
- entity selection;
- simulation-tick refresh strategy;
- persistence of user preferences.

## 6.3 Navigation and workspace model

Define:

- primary navigation;
- nested entity views;
- dialogs;
- deep-linkable entity IDs where supported;
- back-navigation behavior;
- invalid selection handling.

## 6.4 Visual system

Define:

- design tokens;
- color roles;
- typography;
- spacing;
- component states;
- accessibility contrast;
- data-table conventions;
- chart conventions.

## 6.5 Simulation-to-UI synchronization

Define:

- tick notifications;
- polling versus subscription;
- batching;
- refresh boundaries;
- paused-state behavior;
- high-speed simulation behavior;
- prevention of stale command execution.

## 6.6 Error and notification model

Define:

- domain-error translation;
- field errors;
- operation failures;
- warnings;
- success notifications;
- persistent event log;
- debug details in development builds.

---

# 7. Proposed UI Information Architecture

The final structure may be adjusted by the accepted UI ADR, but M9 should cover these primary areas.

```text
Application Shell
├── Main Menu
│   ├── New Game
│   ├── Load Game
│   ├── Settings
│   └── Exit / Return
├── Game Workspace
│   ├── Global Header
│   │   ├── Date / Tick
│   │   ├── Simulation Speed
│   │   ├── Pause / Resume
│   │   ├── Company Cash
│   │   └── Notifications
│   ├── Primary Navigation
│   │   ├── World
│   │   ├── Company
│   │   ├── Markets
│   │   ├── Production
│   │   ├── Buildings
│   │   ├── Research
│   │   ├── Transport
│   │   ├── Finance
│   │   └── Reports
│   ├── Context Panel
│   └── Dialog Layer
└── Save / Load Workspace
```

---

# 8. Core Screens

## 8.1 Main Menu

Required functions:

- new game;
- load game;
- settings;
- application version display;
- validation-friendly error display;
- safe exit or return behavior appropriate to the runtime platform.

## 8.2 New Game

Required inputs depend on existing application capabilities.

At minimum:

- game or world name where supported;
- player company name;
- starting region;
- available scenario or content selection if already modeled;
- validation feedback;
- creation progress;
- failure recovery.

The UI shall use the existing new-game workflow.

## 8.3 World Overview

Display:

- regions;
- region status;
- regional markets;
- company presence;
- buildings;
- transport connections where available;
- selected-region details.

The initial M9 visualization may use a list, table, schematic map, or existing map rendering system. A geographic renderer is not mandatory unless already supported.

## 8.4 Region Detail

Display:

- region identity and metadata;
- local company presence;
- local buildings;
- local resources;
- regional market summary;
- production activity;
- transport connections;
- available construction actions.

## 8.5 Company Overview

Display:

- company identity;
- strategy status where player-visible;
- cash and financial summary;
- inventories;
- buildings;
- production jobs;
- research;
- regional presence;
- recent events.

NPC brain internals must not automatically become player-visible gameplay data. Debug views may expose them only in development mode if permitted by architecture.

## 8.6 Market Screen

Display:

- region selection;
- resource prices;
- supply;
- demand;
- liquidity;
- price history;
- company inventory;
- available cash;
- buy and sell actions;
- trade validation and results.

Trades must invoke existing `BuyResourceUseCase` and `SellResourceUseCase`, or their established command interfaces.

## 8.7 Building Screen

Display:

- owned buildings;
- building status;
- region and placement;
- construction state;
- available building definitions;
- construction costs and requirements;
- placement action;
- validation failures.

Construction must invoke the existing placement workflow.

## 8.8 Production Screen

Display:

- production facilities;
- available recipes;
- current jobs;
- inputs;
- outputs;
- progress;
- blocked jobs;
- inventory shortages;
- start-production action.

Production must invoke the existing production use case.

## 8.9 Research Screen

Display:

- available technologies;
- prerequisites;
- research status;
- cost;
- progress;
- completed research;
- start-research action.

Research must invoke the existing research use case.

## 8.10 Transport Screen

Display:

- transport connections;
- active transport state;
- origin and destination;
- cargo where available;
- capacity;
- progress;
- failures or blocked routes.

M9 shall not invent new transport commands unless already supported by the Application layer.

## 8.11 Finance Screen

Display:

- current cash;
- income and expenditure summaries;
- transaction history where available;
- market trade impact;
- construction, production, and research costs;
- warnings for insufficient liquidity.

No financial calculation may be authoritative in the UI.

## 8.12 Reports and Event Log

Display:

- recent domain-relevant events;
- operation successes and failures;
- market changes where available;
- production completion;
- research completion;
- construction completion;
- save/load results;
- filters and timestamps based on simulation time where applicable.

## 8.13 Save and Load

Required functions:

- list available saves if the runtime supports save discovery;
- create a save;
- overwrite with explicit confirmation;
- load a save;
- display snapshot version;
- show migration or validation errors;
- prevent accidental loss of unsaved progress where applicable.

Save/load must use the accepted V3 persistence architecture from M8.

---

# 9. Shared UI Components

M9 should establish reusable components for:

- application shell;
- navigation;
- entity header;
- tabs;
- panels;
- dialogs;
- confirmation dialogs;
- forms;
- buttons;
- text inputs;
- numeric inputs;
- select controls;
- tables;
- sortable table headers;
- filtering;
- pagination or virtualized lists where needed;
- status badges;
- progress indicators;
- empty states;
- loading states;
- error states;
- notification toasts;
- event-log entries;
- resource amount display;
- currency display;
- simulation tick/date display;
- price history chart;
- entity links;
- development diagnostics.

Components must not depend directly on repositories.

---

# 10. Read Models and Query Requirements

Before building each screen, verify that an Application query or read model can supply its data.

Do not assemble complex screen state by importing repositories into the UI.

Expected query categories:

- game/session summary;
- simulation status;
- world overview;
- region detail;
- player company overview;
- company inventory;
- company finances;
- company buildings;
- production overview;
- research overview;
- transport overview;
- regional market prices;
- market price history;
- event-log entries;
- savegame metadata.

Where a query is missing:

1. add an Application query handler;
2. define an immutable result type;
3. test it independently;
4. expose it to the presentation adapter;
5. do not place query logic in the component.

---

# 11. Command Requirements

Expected UI command categories:

- start new game;
- pause simulation;
- resume simulation;
- set simulation speed;
- advance one tick where supported;
- buy resource;
- sell resource;
- place building;
- start production;
- start research;
- save game;
- load game.

Commands must:

- use typed input;
- return typed success or failure;
- expose domain errors safely;
- prevent duplicate submissions;
- refresh affected read models after completion.

---

# 12. Error Handling

M9 shall introduce a consistent error presentation policy.

## 12.1 Error categories

- input validation error;
- domain rule violation;
- missing entity;
- stale selection;
- insufficient funds;
- insufficient inventory;
- invalid placement;
- unavailable recipe;
- unmet research prerequisite;
- save validation failure;
- migration failure;
- unexpected infrastructure failure.

## 12.2 Presentation behavior

- Field-specific errors appear near the field.
- Domain errors appear in the current action context.
- Critical failures appear in a persistent dialog or error boundary.
- Technical stack traces are development-only.
- Failed commands must not leave the UI in a false success state.
- Error messages should identify a corrective action where possible.

---

# 13. Accessibility Requirements

M9 must include baseline accessibility rather than deferring it.

Required:

- keyboard-accessible primary navigation;
- visible focus indication;
- semantic labels;
- accessible form validation;
- sufficient contrast;
- non-color-only status indicators;
- screen-reader-compatible control names where supported;
- meaningful empty states;
- predictable tab order;
- reduced-motion compatibility for optional animation;
- charts accompanied by textual values or tables.

Automated accessibility testing should be added where the selected UI stack supports it.

---

# 14. Responsive and Layout Requirements

M9 targets the primary desktop gameplay layout.

Minimum behavior:

- usable at the repository-defined minimum resolution;
- no inaccessible controls due to overflow;
- scalable tables and panels;
- collapsible secondary navigation or context panels where necessary;
- dialogs constrained to viewport;
- persistent simulation controls.

Full mobile support is not required.

---

# 15. Performance Requirements

The UI must remain usable during active simulation.

Requirements:

- no complete application rerender on every minor state change;
- simulation updates batched where practical;
- expensive derived presentation data memoized or produced by queries;
- long tables paginated or virtualized when justified;
- chart history bounded;
- no repository-wide scans in render functions;
- no command dispatch from render functions;
- no unbounded event-log growth in memory;
- high simulation speeds must not create an unbounded UI update queue.

Performance targets shall be finalized after the framework audit.

---

# 16. Test Strategy

## 16.1 Unit tests

Test:

- formatters;
- view-model reducers;
- selectors;
- navigation state;
- form validation;
- error translation;
- simulation-control state;
- presentation adapters.

## 16.2 Component tests

Test:

- loading states;
- empty states;
- populated states;
- disabled actions;
- validation errors;
- success feedback;
- keyboard interaction;
- dialogs;
- table sorting and filtering.

## 16.3 Integration tests

Test each primary command path through the real Application layer with in-memory infrastructure:

- buy;
- sell;
- place building;
- start production;
- start research;
- save;
- load;
- pause/resume;
- tick refresh.

## 16.4 End-to-end tests

Implement a core gameplay flow:

```text
Start Game
→ Inspect Starting Region
→ Inspect Company
→ Buy Required Resource
→ Place Building
→ Start Production
→ Advance Simulation
→ Inspect Output
→ Start Research
→ Save Game
→ Load Game
→ Verify State
```

## 16.5 Regression tests

The complete existing suite must continue to pass.

M9 must not reduce domain, application, simulation, persistence, or determinism coverage.

## 16.6 Visual regression

Use visual snapshots only for stable shared components and critical screens. Avoid brittle whole-application snapshots.

## 16.7 Accessibility tests

Run automated checks on:

- main menu;
- game shell;
- market form;
- construction form;
- production form;
- research form;
- save/load dialogs.

---

# 17. Implementation Phases

# Phase 0 — Repository and Architecture Audit

Deliverables:

- current UI-stack inventory;
- application command/query inventory;
- architecture gap analysis;
- dependency analysis;
- test-environment analysis;
- M9 architecture review report;
- required ADR list;
- implementation readiness decision.

Exit criteria:

- architecture accepted;
- framework decision documented;
- no unresolved presentation-layer blocker.

---

# Phase 1 — Presentation Foundation

Implement:

- presentation-layer folder structure;
- application shell;
- design tokens;
- base typography and spacing;
- shared primitives;
- error boundary;
- notification system;
- loading and empty states;
- presentation dependency rules;
- UI test harness.

Exit criteria:

- shell renders;
- shared components tested;
- no direct repository imports;
- baseline accessibility checks pass.

---

# Phase 2 — Navigation and UI State

Implement:

- primary navigation;
- selected entity state;
- screen routing or workspace navigation;
- dialog management;
- transient form state;
- application-session state;
- simulation status state;
- invalid-selection recovery.

Exit criteria:

- every planned primary screen is reachable;
- navigation state is tested;
- refresh does not lose authoritative session context;
- no domain objects stored as mutable UI state.

---

# Phase 3 — Read Model and Query Layer

Audit and implement missing queries for:

- session;
- world;
- regions;
- company;
- inventory;
- finance;
- markets;
- buildings;
- production;
- research;
- transport;
- events;
- saves.

Implement presentation adapters and stable view-data types.

Exit criteria:

- components consume query results only;
- no UI repository access;
- query handlers have independent tests;
- read models are immutable.

---

# Phase 4 — Main Menu, New Game, Save and Load

Implement:

- main menu;
- new-game workflow;
- load-game workflow;
- save dialog;
- overwrite confirmation;
- migration and validation feedback;
- return-to-menu behavior;
- unsaved-progress protection where applicable.

Exit criteria:

- new game can be started entirely through UI;
- V3 save can be created and loaded;
- save/load failures are understandable;
- round-trip UI integration test passes.

---

# Phase 5 — Game Shell and Simulation Controls

Implement:

- global header;
- simulation date/tick;
- pause;
- resume;
- speed controls;
- single-step control if supported;
- player-company cash summary;
- notification indicator;
- active-session status.

Exit criteria:

- simulation can be controlled without developer tools;
- rendering frequency does not control simulation time;
- speed changes remain deterministic;
- controls are keyboard accessible.

---

# Phase 6 — World, Region, and Company Views

Implement:

- world overview;
- region list or map;
- region detail;
- company overview;
- inventory summary;
- finance summary;
- building and regional-presence summaries;
- entity navigation.

Exit criteria:

- player can inspect current authoritative state;
- region selection is stable;
- stale or missing entity IDs recover safely;
- key data states have loading, empty, and error presentations.

---

# Phase 7 — Market Interaction

Implement:

- regional market selector;
- price table;
- supply, demand, and liquidity;
- price history;
- buy form;
- sell form;
- available cash and inventory context;
- trade results;
- validation errors.

Exit criteria:

- buy and sell use existing Application workflows;
- no UI price calculation is authoritative;
- duplicate submissions are prevented;
- market state refreshes after trade and simulation ticks.

---

# Phase 8 — Buildings, Production, and Research

Implement:

- building list and detail;
- construction catalog;
- placement workflow;
- production facilities;
- recipe selection;
- production start workflow;
- active production jobs;
- research catalog;
- prerequisite display;
- research start workflow;
- progress and completion display.

Exit criteria:

- all three action types execute through existing use cases;
- costs and requirements are query-derived;
- domain failures are displayed correctly;
- integration tests cover success and failure.

---

# Phase 9 — Transport, Reports, and Event Log

Implement:

- transport overview;
- route or connection inspection;
- active transport state;
- reports dashboard;
- event log;
- event filters;
- event detail;
- notification-to-event navigation.

Exit criteria:

- transport state is observable;
- important state transitions are discoverable;
- event history is bounded and performant;
- no unsupported transport commands are invented.

---

# Phase 10 — UX, Accessibility, and Performance Hardening

Perform:

- keyboard navigation audit;
- contrast audit;
- focus-management audit;
- error-message review;
- empty-state review;
- high-speed simulation test;
- long-session test;
- table-size test;
- event-volume test;
- render profiling;
- interaction consistency review.

Exit criteria:

- accessibility baseline passes;
- no unbounded update queues;
- no major render bottleneck;
- critical actions have confirmation or undo behavior where appropriate.

---

# Phase 11 — Final Integration and Documentation

Complete:

- core gameplay E2E flow;
- save/load E2E flow;
- regression suite;
- architecture tests;
- UI documentation;
- schema/read-model documentation;
- implementation progress;
- operator/developer notes;
- M9 implementation report;
- final architecture gate.

Exit criteria:

- all quality gates pass;
- documentation is synchronized;
- no critical or high-severity defect remains;
- final recommendation is `M9 COMPLETE`.

---

# 18. Implementation Gates

## Gate 0 — Architecture Readiness

**When:** Before Phase 1.

Review:

- framework;
- state management;
- presentation boundaries;
- commands and queries;
- simulation synchronization;
- ADR requirements.

Outcome:

- `READY FOR M9 IMPLEMENTATION`
- or `ARCHITECTURE CHANGES REQUIRED`

## Gate 1 — Presentation Foundation

**When:** After Phase 3.

Review:

- dependency boundaries;
- shell;
- navigation;
- UI state;
- query/read-model layer;
- test harness;
- accessibility foundation.

Outcome:

- `READY FOR GAMEPLAY UI`
- or `FOUNDATION CHANGES REQUIRED`

## Gate 2 — Gameplay Integration

**When:** After Phase 8.

Review:

- market;
- buildings;
- production;
- research;
- use-case reuse;
- error translation;
- simulation refresh;
- performance risks.

Outcome:

- `READY FOR FINAL UI PHASES`
- or `INTEGRATION CHANGES REQUIRED`

## Gate 3 — Final M9 Review

**When:** After Phase 11.

Review:

- complete gameplay flow;
- save/load;
- accessibility;
- performance;
- architecture;
- tests;
- documentation;
- known debt.

Outcome:

- `M9 COMPLETE`
- or `M9 CHANGES REQUIRED`

---

# 19. Documentation Deliverables

Create or update:

```text
docs/
├── project-management/
│   └── M9_USER_INTERFACE_PLAN.md
├── architecture/
│   ├── reviews/
│   │   ├── M9_ARCHITECTURE_REVIEW.md
│   │   ├── M9_ARCHITECTURE_REVIEW_REPORT.md
│   │   ├── M9_IMPLEMENTATION_GATE_1_REPORT.md
│   │   ├── M9_IMPLEMENTATION_GATE_2_REPORT.md
│   │   └── M9_FINAL_GATE_REPORT.md
│   └── decisions/
│       └── <required M9 ADRs>
├── development/
│   ├── prompts/
│   │   └── CURSOR_PROMPT_M9_USER_INTERFACE.md
│   └── UI_DEVELOPMENT_GUIDE.md
├── schemas/
│   └── <UI read-model or settings schemas where applicable>
└── implementation/
    └── M9_IMPLEMENTATION_REPORT.md
```

Update:

- `IMPLEMENTATION_PROGRESS.md`;
- architecture index;
- ADR index;
- development guide index;
- test-count documentation where maintained;
- application command/query documentation.

---

# 20. Quality Gates

Before each phase is accepted, run all repository-standard validation commands documented in:

```text
docs/development/CURSOR_IMPLEMENTATION_GUIDE.md
```

At minimum, where supported:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm validate-content
pnpm validate-content --strict
```

Add the selected UI framework's required checks, such as:

- component tests;
- end-to-end tests;
- accessibility tests;
- production build;
- bundle or packaging validation.

M9 cannot be declared complete unless:

- the production build succeeds;
- all existing tests pass;
- all new UI tests pass;
- no architecture rule is violated;
- the UI contains no direct repository mutation;
- all gameplay commands use Application workflows;
- save/load works with M8 snapshot V3;
- simulation determinism remains unchanged;
- accessibility baseline passes;
- documentation is synchronized.

---

# 21. Completion Criteria

M9 is complete only when all of the following are true.

## Architecture

- Presentation layer is documented.
- Allowed dependencies are tested.
- No component imports repositories.
- No UI-specific duplicate business rules exist.
- Commands and queries are clearly separated.
- Simulation synchronization is documented and deterministic.

## Functional

- New game works.
- Save and load work.
- Simulation controls work.
- World and region inspection work.
- Company inspection works.
- Trading works.
- Construction works.
- Production works.
- Research works.
- Transport inspection works.
- Finance and event feedback are available.

## Quality

- Unit, component, integration, and E2E tests pass.
- Existing regression tests pass.
- Accessibility baseline passes.
- High-speed simulation remains usable.
- Errors are actionable.
- Loading and empty states exist.
- Critical actions prevent accidental duplication.

## Documentation

- M9 plan is current.
- Required ADRs are accepted.
- Gate reports are complete.
- Implementation progress is updated.
- Final implementation report exists.
- Known technical debt is recorded.

---

# 22. Final Implementation Report

At completion, create:

```text
docs/implementation/M9_IMPLEMENTATION_REPORT.md
```

Required sections:

```text
# Executive Summary
# Scope Delivered
# Architecture Compliance
# Presentation Architecture
# Commands and Queries
# Screens Implemented
# Shared Components
# Simulation Synchronization
# Save and Load Integration
# Accessibility
# Performance
# Test Results
# Regression Results
# Documentation Updates
# Known Limitations
# Technical Debt
# Deferred Features
# Final Recommendation
```

The report shall conclude with exactly one of:

- `M9 COMPLETE`
- `M9 CHANGES REQUIRED`

---

# 23. Recommended Immediate Next Step

Create and execute:

```text
docs/architecture/reviews/M9_ARCHITECTURE_REVIEW.md
```

The review must inspect the actual repository before selecting or approving:

- the UI framework;
- state management;
- navigation;
- presentation folder structure;
- simulation refresh mechanism;
- visual-system implementation;
- UI test tooling.

Do not begin full UI implementation until Gate 0 is accepted.
