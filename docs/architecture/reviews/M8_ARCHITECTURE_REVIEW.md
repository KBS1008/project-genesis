# M8_ARCHITECTURE_REVIEW.md

**Project:** Project Genesis  
**Milestone:** M8 – Economy Simulation  
**Status:** Pre-Implementation Architecture Review

---

# 1. Purpose

This document is the mandatory architecture review that must be completed before any implementation work for M8 begins.

Its purpose is to ensure that the Economy Simulation is implemented as an extension of the existing architecture rather than introducing competing concepts.

M8 must remain a deterministic, repository-driven evolution of the current codebase.

---

# 2. Review Goals

The review verifies that:

- the repository architecture supports M8,
- no ADRs are violated,
- no duplicate simulation concepts are introduced,
- existing systems are reused,
- responsibilities remain separated,
- deterministic behaviour is preserved,
- future milestones remain unblocked.

---

# 3. Mandatory Repository Audit

Before writing any code Cursor shall inspect the complete repository.

Minimum audit scope:

## Simulation

Search for:

SimulationEngine

SimulationState

SimulationSystem

SimulationScheduler

Tick

Event

Clock

createDefaultSimulationSystems

SimulationContext

---

## Economy

Search for:

Market

Trade

Finance

Money

Inventory

Contract

Pricing

Order

---

## Production

Search for:

Recipe

Production

Building

Technology

Milestone

Research

---

## Logistics

Search for:

Transport

Route

Connection

Capacity

Queue

Shipment

Warehouse

---

## World

Search for:

World

Region

Biome

City

Infrastructure

Map

---

## AI

Search for:

Strategy

Decision

Brain

Planner

Goal

Knowledge

Memory

AI

Behaviour

TODO

NotImplemented

---

## Persistence

Search for:

Snapshot

Savegame

Serializer

Deserializer

Migration

Version

Restore

---

# 4. ADR Review

Cursor shall inspect every accepted ADR relevant for:

- deterministic simulation
- content architecture
- runtime architecture
- logistics
- world simulation
- savegames
- domain modelling
- modular monolith boundaries

Special attention shall be paid to:

DD-007

DD-009

DD-015

DD-025

DD-027

DD-029

DD-032

DD-033

If repository code and ADR disagree:

Repository implementation

↓

Accepted ADR

↓

Architecture documents

↓

Gameplay documentation

---

# 5. Existing Responsibilities

The review must verify that the following ownership remains unchanged.

SimulationEngine

owns

simulation execution

---

SimulationSystems

own

state transitions

---

Application Layer

owns

commands

queries

validation entry points

---

Domain

owns

business rules

---

Content

owns

immutable configuration

---

Infrastructure

owns

IO

Persistence

Serialization

---

No responsibility may silently migrate.

---

# 6. Duplicate Architecture Check

Cursor shall verify that M8 does NOT introduce:

❌ second scheduler

❌ second event bus

❌ second market

❌ second inventory model

❌ second transport model

❌ second finance model

❌ second production model

❌ second company implementation

❌ second simulation loop

If duplication is detected:

reuse existing implementation

or

extend existing implementation

---

# 7. Company Architecture Review

Verify:

Company

already represents

all companies.

NPC companies must not become a different aggregate.

Player

↓

Company

NPC

↓

Company

Only behaviour differs.

---

# 8. AI Architecture Review

The review shall determine whether:

CompanyBrain

Strategy

Goal

DecisionQueue

Knowledge

Memory

already exist.

Possible outcomes:

already implemented

↓

extend

partially implemented

↓

complete

missing

↓

implement

Never replace working systems.

---

# 9. Market Review

Verify:

current pricing

market ownership

market history

market persistence

regional separation

existing trade model

Determine whether:

Market

already supports

regional extension.

Do not redesign the market unnecessarily.

---

# 10. Logistics Review

Verify integration with M6.

Check:

Routes

Queues

Capacity

Transport Orders

Shipment Processing

Determine:

how AI can reuse existing logistics.

No AI-only logistics.

---

# 11. World Review

Review M7 architecture.

Verify:

World

Region

Biome

Cities

Infrastructure

Regional Resources

Determine:

how companies become region aware.

Avoid duplicated region references.

---

# 12. Simulation Review

Determine:

Where should AI planning execute?

Possible candidates:

SimulationSystem

CompanySystem

MarketSystem

Dedicated PlanningSystem

The review must recommend one solution.

No speculative systems.

---

# 13. Decision Frequency

The review must determine:

How often should:

Strategic Planning

Operational Planning

Market Analysis

Research Planning

Expansion Planning

execute.

The answer must remain deterministic.

No wall-clock timing.

---

# 14. Event Review

Review existing domain events.

Determine:

which new events are required.

Examples:

GoalCreated

DecisionQueued

CompanyExpanded

CompanyBankrupt

ResearchSelected

Avoid event spam.

---

# 15. Savegame Review

Determine:

what runtime state requires persistence.

Expected:

Strategy

Brain

Knowledge

Memory

Decision Queue

Goals

Pending Tasks

Transient caches shall never be serialized.

---

# 16. Repository Boundaries

Review every new proposed repository.

Only create repositories if they have:

multiple consumers

or

aggregate ownership.

Otherwise extend existing repositories.

---

# 17. Content Review

Review whether StrategyDefinition becomes:

a new content type

or

embedded balancing configuration.

Avoid unnecessary registries.

---

# 18. Performance Review

Estimate:

Company Count

Region Count

Decision Count

Market Size

Transport Volume

Determine:

expected complexity.

Identify obvious O(n²) risks.

Do not optimize prematurely.

---

# 19. Determinism Review

Verify:

stable iteration

stable IDs

stable ordering

seeded randomness

event ordering

save ordering

If any existing implementation violates determinism:

document it

before implementation.

---

# 20. Risk Assessment

Identify:

architecture risks

performance risks

migration risks

testing risks

savegame risks

content risks

Only verified risks.

No speculation.

---

# 21. Required Deliverables

The review shall produce:

Repository Audit

Architecture Findings

Detected Conflicts

Recommended Extensions

Rejected Alternatives

Open Questions

Implementation Order

Risk Register

---

# 22. Exit Criteria

Implementation may begin only if:

✓ existing architecture understood

✓ responsibilities verified

✓ deterministic model preserved

✓ no duplicate systems introduced

✓ savegame strategy confirmed

✓ repository boundaries validated

✓ implementation order agreed

✓ unresolved issues documented

---

# 23. Review Report

Cursor shall finish with:

## Repository Status

Current implementation state

---

## Reuse Opportunities

Existing systems to extend

---

## Required New Components

Only components proven necessary

---

## Components NOT to create

Explicit list

---

## Architecture Risks

Verified risks only

---

## ADR Impact

Existing ADRs reused

New ADRs required

None required

---

## Recommended Implementation Order

Exact M8-0

↓

M8-1

↓

…

↓

M8-9

---

# Definition of Success

The review succeeds when Cursor can implement M8 without inventing new architectural concepts and while extending the existing deterministic simulation in a consistent manner.
