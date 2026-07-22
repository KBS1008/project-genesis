# DD-0XX – Company Brain & Decision Queue Architecture

**Status:** Accepted

**Date:** YYYY-MM-DD

**Authors:** Project Genesis Team

**Supersedes:** None

**Related ADRs:**

- DD-009 – Event-Driven Architecture
- DD-015 – Content Architecture
- DD-025 – ECS-inspired Simulation
- DD-029 – Modular Monolith
- DD-032 – Deterministic Tick Processing
- DD-033 – Savegame Architecture

---

# Context

Milestone M8 introduces autonomous NPC companies that participate in the economy alongside the player.

The repository currently contains:

- a deterministic simulation engine,
- a single Company aggregate,
- simulation systems,
- application use cases,
- repositories,
- savegame infrastructure,
- and a placeholder `CompanySimulationSystem`.

No autonomous planning system currently exists.

The architecture review confirmed that introducing a second company implementation, direct repository manipulation, or a second simulation engine would violate the existing architecture.

A deterministic planning architecture is therefore required.

---

# Problem

NPC companies must make economic decisions while remaining fully compatible with the existing simulation model.

The architecture must guarantee that:

- AI follows the same business rules as the player.
- Domain validation is never bypassed.
- Simulation remains deterministic.
- Existing aggregates remain reusable.
- Future milestones can extend planning without redesigning the simulation.

---

# Decision

Each autonomous company owns exactly one Company Brain.

The Company Brain is responsible for transforming observable simulation state into executable business decisions.

The Company Brain never changes domain state directly.

Instead it generates validated decisions which are executed through the existing Application Layer.

The planning pipeline is:

```
Observe

↓

Analyse

↓

Generate Goals

↓

Evaluate Strategy

↓

Create Decisions

↓

Validate

↓

Queue Decisions

↓

Application Use Cases

↓

Domain

↓

Repositories
```

No step in this pipeline bypasses existing validation.

---

# Company Brain Responsibilities

The Company Brain is responsible for:

- analysing company state
- analysing regional markets
- generating strategic goals
- generating operational tasks
- prioritising work
- selecting research
- selecting production
- selecting purchases
- selecting sales
- selecting expansion
- generating decision queues

The Company Brain is **not** responsible for:

- repository mutations
- persistence
- simulation scheduling
- domain validation
- logistics execution
- production execution

---

# Decision Queue

Planning and execution are separated.

The Company Brain produces immutable decisions.

Examples include:

- Purchase Resource
- Sell Resource
- Start Production
- Place Building
- Start Research
- Expand Region

These decisions are placed into a deterministic Decision Queue.

Execution occurs later through existing Application use cases.

This separation improves:

- determinism
- debugging
- replayability
- testing
- savegame persistence

---

# Goal System

Goals represent medium and long-term objectives.

Examples:

- Increase Steel Production
- Secure Coal Supply
- Expand Into Region
- Reduce Transport Costs
- Improve Profitability

Goals are prioritised according to the active Strategy.

Goals never directly modify simulation state.

---

# Strategy

Strategies define planning preferences.

Strategies modify decision weights only.

Strategies never implement alternative algorithms.

Example parameters include:

- Expansion Weight
- Production Weight
- Trading Weight
- Research Weight
- Risk Tolerance
- Liquidity Preference

Strategies are intended to become content-driven.

---

# Knowledge

Knowledge represents information currently available to the company.

Examples include:

- observed prices
- known suppliers
- discovered regions
- available technologies
- infrastructure quality

Knowledge contains only observable information.

No hidden simulation state is exposed.

---

# Memory

Memory stores historical observations.

Examples include:

- historical prices
- supplier reliability
- transport performance
- profitability
- failed investments

Memory enables long-term planning while remaining deterministic.

Historical entries may decay using deterministic rules.

---

# Repository Ownership

The Company aggregate remains the single aggregate root.

The Company Brain belongs to exactly one Company.

The following runtime concepts are owned by the Company:

- Brain
- Strategy
- Goals
- Knowledge
- Memory
- Decision Queue

The architecture intentionally avoids creating an independent AI aggregate.

Repository boundaries remain unchanged.

---

# Application Integration

All executable decisions are processed through existing Application use cases.

Examples include:

```
Decision

↓

BuyResourceUseCase

↓

Domain Validation

↓

Repositories
```

or

```
Decision

↓

StartProductionUseCase

↓

Domain Validation

↓

Repositories
```

The AI therefore follows exactly the same validation path as the player.

---

# Simulation Integration

Planning is executed by simulation systems.

The Company Brain itself contains no scheduling logic.

Simulation determines:

- when planning executes,
- planning frequency,
- execution order.

The Company Brain remains a pure planning component.

---

# Persistence

The following runtime state must be persisted:

- Strategy
- Goals
- Knowledge
- Memory
- Decision Queue

Transient planning caches shall never be serialized.

---

# Determinism

The Company Brain must remain deterministic.

Planning depends only on:

- simulation state,
- immutable content,
- deterministic iteration,
- deterministic algorithms.

The following are prohibited:

- wall-clock time
- non-seeded randomness
- unordered iteration
- asynchronous planning

---

# Consequences

## Positive

- Single Company aggregate preserved.
- Existing architecture remains unchanged.
- AI shares business rules with the player.
- High testability.
- High replayability.
- Straightforward savegame support.
- Easy future extensions.

## Negative

- Planning must execute in multiple phases.
- Decision queues introduce additional runtime objects.
- Savegame schema requires extension.

---

# Alternatives Considered

## Direct Repository Manipulation

Rejected.

Would bypass validation and violate repository ownership.

---

## Separate NPC Company Aggregate

Rejected.

Would duplicate business rules and increase maintenance cost.

---

## AI Executing Domain Logic Directly

Rejected.

Would violate Application Layer responsibilities.

---

## Event-Driven Autonomous Actors

Rejected.

Planning frequency must remain deterministic and centrally controlled by the Simulation Engine.

---

# Related Milestones

M8

Economy Simulation

M9

Population Simulation

M10+

Politics

Government

World Events

---

# Implementation Notes

Implementation shall proceed incrementally:

1. Company Brain
2. Strategy
3. Knowledge
4. Memory
5. Goal System
6. Decision Queue
7. Simulation Integration
8. Savegame Integration

No implementation may bypass the established Application Layer.

```

---

## Einschätzung

Ich würde diese ADR sogar als **eine der wichtigsten Architekturentscheidungen des gesamten Projekts** einstufen. Sie beantwortet die zentrale Frage, *wie* KI-Unternehmen in die bestehende Architektur integriert werden, ohne parallele Geschäftslogik oder Sonderfälle einzuführen.

Eine kleine Empfehlung würde ich noch ergänzen: Im Abschnitt **"Repository Ownership"** könnte ausdrücklich festgehalten werden, dass die aufgeführten Bestandteile (*Brain, Strategy, Goals, Knowledge, Memory, Decision Queue*) **konzeptionell** der `Company` gehören. Ob sie intern als Felder des Aggregats oder über eng gekoppelte, spezialisierte Repositories verwaltet werden, bleibt eine Implementierungsentscheidung, solange die Aggregate-Grenzen und Verantwortlichkeiten gewahrt bleiben. Das gibt euch mehr Flexibilität, falls Performance- oder Persistenzanforderungen später eine andere technische Umsetzung sinnvoll machen.