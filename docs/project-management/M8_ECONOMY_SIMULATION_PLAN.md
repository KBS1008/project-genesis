# M8 – Economy Simulation

**Project:** Project Genesis

**Milestone:** M8

**Status:** Planned

**Prerequisites**

- M4 – Company Foundation
- M5 – Production & Research
- M6 – Logistics
- M7 – World Simulation

---

# 1. Executive Summary

M8 introduces the first fully autonomous economy to Project Genesis.

After this milestone the world is no longer driven solely by the player. Instead, multiple AI-controlled companies participate in the same economic systems as the player, competing for resources, infrastructure, transport capacity, research, and market opportunities.

The objective of M8 is **not** to create a scripted AI. Instead, it establishes a deterministic simulation in which autonomous companies emerge naturally from the same rules that govern player-controlled companies.

Every participant in the economy must operate under identical constraints.

No company receives hidden resources, invisible bonuses, or special simulation privileges.

The economy must evolve through interactions between production, logistics, regional markets, and strategic decision-making.

---

# 2. Milestone Goal

The primary goal of M8 is to transform Project Genesis from a single-company management simulation into a living economic ecosystem.

Upon completion of this milestone the simulation shall support:

- autonomous companies
- regional markets
- dynamic price evolution
- strategic competition
- economic expansion
- deterministic AI planning
- persistent company knowledge
- long-term market development

The simulation remains entirely deterministic.

Running the same simulation from the same initial state with the same seed shall always produce identical results.

---

# 3. Scope

M8 introduces the following capabilities.

## Included

- autonomous NPC companies
- company strategy framework
- company planning
- production planning
- purchasing AI
- selling AI
- expansion planning
- research planning
- market simulation
- regional competition
- market history
- company knowledge
- company memory
- deterministic planning systems
- savegame support
- migration support
- repository validation
- automated tests

---

## Explicitly Excluded

The following systems are outside the scope of M8.

- politics
- diplomacy
- governments
- taxation
- employment
- workforce simulation
- population simulation
- banking
- loans
- stock markets
- weather
- disasters
- military
- scripted economic events
- multiplayer synchronization

These systems belong to later milestones.

---

# 4. Design Principles

Every implementation performed during M8 shall follow the existing architecture of Project Genesis.

The following principles are mandatory.

## 4.1 Deterministic Simulation

The economy is deterministic.

Simulation state is exclusively determined by:

- simulation state
- content definitions
- deterministic algorithms
- simulation tick order

Wall-clock time must never influence simulation results.

---

## 4.2 Repository First

All persistent data remains inside repositories.

No simulation system owns persistent state.

Simulation systems consume repositories and produce deterministic state transitions.

---

## 4.3 Domain Driven Design

The existing DDD boundaries remain unchanged.

Domain

owns business rules.

Application

coordinates use cases.

Infrastructure

handles persistence.

Content

contains immutable balancing data.

Simulation

coordinates execution.

---

## 4.4 Single Source of Truth

Every concept exists exactly once.

There shall never be:

- multiple inventory systems
- multiple market models
- multiple finance systems
- multiple transport systems
- duplicate company implementations
- duplicate production systems

Existing implementations must always be extended instead of replaced.

---

## 4.5 Emergent Gameplay

Economic behaviour should emerge from simulation.

The architecture shall avoid scripted behaviour whenever possible.

Examples include:

- regional shortages
- market monopolies
- transport bottlenecks
- industrial specialization
- technological advantages

These situations should arise naturally from simulation state.

---

# 5. Architectural Objectives

The architecture introduced by M8 must satisfy five long-term objectives.

## Extensibility

Future milestones should add:

- politics
- population
- taxation
- world events

without requiring architectural redesign.

---

## Scalability

The architecture should support:

- hundreds of companies
- thousands of buildings
- multiple regions
- large transport networks
- extensive production chains

without changing simulation principles.

---

## Maintainability

Business rules must remain isolated.

Planning algorithms should be replaceable without modifying simulation infrastructure.

---

## Testability

Every planning component shall be testable independently.

Deterministic replay must always be possible.

---

## Content Driven Balancing

Balancing values belong inside content definitions whenever possible.

The simulation should avoid hardcoded economic constants.

---

# 6. NPC Company Model

Player companies and NPC companies share the same domain model.

There is no separate NPC implementation.

```
Player

↓

Company

↑

NPC
```

Behaviour differs.

The underlying aggregate remains identical.

NPC companies therefore:

- own buildings
- own inventories
- own money
- own technologies
- own transport routes
- own warehouses
- own production facilities

using exactly the same domain objects as the player.

---

# 7. Company Lifecycle

Every company progresses through a deterministic lifecycle.

```
Founded

↓

Early Expansion

↓

Regional Growth

↓

Specialization

↓

Optimization

↓

Mature Enterprise

↓

Possible Decline

↓

Bankruptcy
```

Lifecycle transitions emerge from simulation.

No scripted phase changes exist.

---

# 8. Company Identity

Every company possesses immutable identity data.

Examples include:

- identifier
- company name
- founding tick
- headquarters
- home region
- ownership
- initial strategy

Identity never changes after creation except where explicitly supported by future milestones.

---

# 9. Company State

The mutable state of a company includes:

- finances
- owned buildings
- inventories
- transport assets
- active research
- strategic goals
- market knowledge
- company memory
- decision queue

This state evolves only through deterministic simulation systems.

---

# 10. Company Brain

Every autonomous company owns exactly one Company Brain.

The Company Brain is responsible for transforming world state into executable business decisions.

It does not modify repositories directly.

Instead it performs the following pipeline:

```
Observe World

↓

Analyse Situation

↓

Generate Goals

↓

Evaluate Strategies

↓

Generate Decisions

↓

Queue Commands

↓

Application Layer
```

The Company Brain never bypasses validation.

---

# 11. Knowledge Model

Knowledge represents facts currently known by a company.

Examples include:

- observed market prices
- known suppliers
- known customers
- discovered regions
- researched technologies
- available resources
- infrastructure quality

Knowledge reflects observable simulation state.

Unknown information cannot influence planning.

---

# 12. Memory Model

Memory stores historical observations.

Typical examples include:

- historical prices
- supplier reliability
- transport delays
- production efficiency
- failed investments
- successful trade routes

Memory allows companies to improve future decisions without violating determinism.

Old entries may decay according to deterministic rules.

---

# 13. Goal System

Companies operate using explicit goals.

Goals are generated from current simulation state.

Typical examples include:

- increase steel production
- secure coal supply
- expand into a neighbouring region
- reduce logistics costs
- invest in automation
- stabilize liquidity

Goals are prioritised according to company strategy.

---

# 14. Strategy Profiles

Strategies influence priorities rather than behaviour.

Strategies never implement custom algorithms.

Instead they modify planning weights.

Illustrative examples include:

- Manufacturer
- Mining
- Trading
- Technology
- Energy
- Balanced
- Expansionist
- Conservative

Additional strategies may be introduced through content definitions without modifying simulation logic.

---

# 15. Decision Hierarchy

Planning is divided into three deterministic layers.

## Strategic Planning

Long-term investment decisions.

Examples:

- expansion
- specialization
- research direction
- regional growth

Strategic planning executes infrequently.

---

## Operational Planning

Medium-term business decisions.

Examples:

- production
- logistics
- purchasing
- selling

Operational planning executes regularly.

---

## Tactical Planning

Short-term reactions.

Examples:

- missing resources
- inventory overflow
- temporary shortages
- transport congestion
- sudden market opportunities

Tactical planning reacts quickly while remaining aligned with strategic objectives.

---

# 16. Regional Economy

The economy introduced in M8 extends the world created during M7.

Every region possesses unique characteristics.

Examples include:

- natural resources
- infrastructure quality
- transport connectivity
- industrial focus
- local market conditions

Companies must evaluate regional differences before expanding.

No region is universally optimal.

---

# 17. Competition Model

Companies compete indirectly.

Competition occurs through shared economic systems.

Examples include:

- purchasing scarce resources
- selling finished products
- acquiring transport capacity
- securing production chains
- investing in research
- expanding into profitable regions

There is no direct sabotage or combat between companies.

---

# 18. Fairness Principles

Player and AI operate under identical rules.

NPC companies:

- pay construction costs
- purchase resources
- consume transport capacity
- perform research
- obey market prices
- respect production recipes
- follow logistics constraints

No hidden income, invisible production, or special discounts are permitted.

---

# 19. Failure Model

Companies may fail.

Failure results from simulation rather than scripted events.

Possible causes include:

- poor investments
- supply shortages
- transport collapse
- inefficient production
- technological stagnation
- loss of competitiveness
- prolonged liquidity problems

Failure is considered a natural outcome of the simulation.

---

# 20. Integration with Previous Milestones

M8 extends the systems introduced by previous milestones.

## M4

Company ownership

Money

Inventories

Buildings

---

## M5

Production

Recipes

Technologies

Research

---

## M6

Transport

Routes

Warehouses

Regional logistics

---

## M7

World

Regions

Infrastructure

Regional resources

Simulation framework

---

M8 introduces no replacement systems.

Every new capability extends the existing deterministic architecture established by M4 through M7.

---

# End of Part 1

# 21. Economic Model

The economy introduced by M8 is entirely simulation-driven.

No market state is scripted.

No artificial balancing events manipulate prices.

No hidden resource generation exists.

Economic activity emerges exclusively from the interaction of companies operating under identical rules.

The economy evolves through:

- production
- logistics
- regional availability
- market competition
- research
- infrastructure
- strategic company decisions

The simulation therefore becomes self-sustaining.

---

# 22. Economic Participants

Every market participant represents an independent economic actor.

Supported participants include:

- player companies
- NPC companies

Future milestones may introduce additional participants, such as:

- governments
- public infrastructure operators
- civilian populations

These are explicitly outside the scope of M8.

---

# 23. Economic Resources

Every tradable resource originates from existing game systems.

Examples include:

- extracted raw materials
- intermediate products
- manufactured goods
- energy resources
- construction materials

Resources never appear spontaneously.

Every unit can be traced back through the production chain.

This guarantees deterministic economic behaviour.

---

# 24. Regional Markets

Every region owns exactly one market.

Markets are regional rather than global.

A market represents the current economic state of a region.

It contains no physical inventory.

Instead, it stores market information such as:

- active buy offers
- active sell offers
- transaction history
- price history
- trading volume
- market liquidity
- demand indicators
- supply indicators

Inventories remain owned by companies.

---

# 25. Market Responsibilities

Regional markets are responsible for:

- matching buyers and sellers
- tracking historical prices
- calculating market indicators
- exposing current market information
- recording completed transactions

Markets do not:

- own resources
- own money
- execute logistics
- reserve inventories

These responsibilities remain within existing domain aggregates.

---

# 26. Supply Model

Supply is calculated from observable simulation state.

Contributing factors include:

- current sell offers
- stored inventory
- active production
- incoming deliveries
- idle production capacity

Supply is calculated independently for every region.

---

# 27. Demand Model

Demand is derived from current company requirements.

Demand sources include:

- production inputs
- construction projects
- research requirements
- inventory replenishment
- strategic stockpiling

Demand is continuously recalculated as simulation progresses.

---

# 28. Price Formation

Prices emerge from market activity.

Price calculation considers:

Supply

↓

Demand

↓

Recent Transactions

↓

Regional Scarcity

↓

Transport Costs

↓

Market Liquidity

↓

Balancing Parameters

↓

Current Market Price

The pricing algorithm must remain replaceable without affecting surrounding systems.

No hardcoded pricing assumptions shall leak into business logic.

---

# 29. Market Liquidity

Liquidity represents the ability of a market to absorb trades.

Liquidity influences:

- transaction speed
- price stability
- trading volume
- short-term volatility

Liquidity itself is derived from completed transactions.

It is never configured manually during gameplay.

---

# 30. Market History

Historical information is retained for analysis.

Examples include:

- average price
- minimum price
- maximum price
- trade volume
- demand trend
- supply trend
- price volatility

Historical records are immutable once written.

Companies may use this information when making decisions.

---

# 31. Market Transparency

Companies only have access to observable information.

Examples include:

- current regional prices
- historical prices
- known suppliers
- known customers
- completed transactions

Future information is never available.

Planning must therefore operate under uncertainty while remaining deterministic.

---

# 32. Planning Architecture

Every company periodically performs planning.

Planning consists of deterministic phases.

```

Observe

↓

Evaluate

↓

Generate Goals

↓

Prioritize

↓

Generate Decisions

↓

Validate

↓

Queue Commands

```

Each phase is deterministic and independently testable.

---

# 33. Planning Frequency

Planning frequency is divided into multiple levels.

Strategic Planning

- infrequent

Operational Planning

- regular

Tactical Planning

- frequent

Exact execution intervals are balancing parameters rather than hardcoded values.

---

# 34. Strategic Planning

Strategic planning evaluates long-term development.

Typical questions include:

- Should the company expand?
- Should a new industry be entered?
- Should research be prioritised?
- Should logistics be improved?
- Should additional regions be entered?

Strategic planning is computationally expensive and therefore executes infrequently.

---

# 35. Operational Planning

Operational planning converts strategic goals into executable business activities.

Responsibilities include:

- production scheduling
- purchasing
- selling
- warehouse balancing
- transport planning
- resource allocation

Operational planning executes more frequently than strategic planning.

---

# 36. Tactical Planning

Tactical planning reacts to immediate economic changes.

Examples include:

- missing production inputs
- unexpected demand spikes
- transport delays
- inventory overflow
- temporary shortages

Tactical planning must never contradict strategic objectives.

---

# 37. Decision Queue

Planning never changes simulation state directly.

Instead, validated decisions are stored inside a deterministic decision queue.

Examples include:

- Purchase Resource
- Sell Product
- Start Production
- Build Facility
- Research Technology
- Create Transport Route

Execution occurs through the existing Application Layer.

---

# 38. Production Planning

Production planning evaluates:

Current Inventory

↓

Recipe Availability

↓

Building Availability

↓

Required Technologies

↓

Expected Demand

↓

Transport Capacity

↓

Expected Profit

↓

Production Decision

Production may only begin when every prerequisite has been satisfied.

---

# 39. Purchasing Planning

Purchasing evaluates:

Current Stock

↓

Expected Consumption

↓

Regional Supply

↓

Supplier Prices

↓

Transport Costs

↓

Delivery Time

↓

Purchase Decision

Companies never purchase unavailable resources.

---

# 40. Selling Planning

Selling evaluates:

Current Inventory

↓

Reserved Inventory

↓

Regional Demand

↓

Current Market Price

↓

Future Expectations

↓

Target Stock Levels

↓

Selling Decision

Companies may intentionally delay sales if doing so aligns with their strategy.

---

# 41. Inventory Policies

Every strategy defines preferred inventory behaviour.

Typical parameters include:

- minimum stock
- target stock
- emergency reserve
- maximum stock

Inventory policies are content-driven.

No strategy contains hardcoded inventory limits.

---

# 42. Company Specialisation

Companies naturally specialise through strategic decisions.

Possible specialisations include:

- mining
- manufacturing
- processing
- logistics
- technology
- mixed economy

Specialisation emerges from strategy weights rather than fixed company classes.

---

# 43. Expansion Planning

Expansion begins with bottleneck analysis.

Potential bottlenecks include:

- insufficient production
- transport limitations
- storage shortages
- infrastructure
- regional demand
- resource availability

Expansion is justified only when expected long-term value exceeds investment costs.

---

# 44. Construction Planning

Construction planning evaluates:

Available Capital

↓

Land Availability

↓

Infrastructure

↓

Transport Access

↓

Expected Return

↓

Building Selection

↓

Construction Decision

Existing placement validation remains authoritative.

---

# 45. Research Planning

Research represents long-term investment.

Planning evaluates:

Technology Prerequisites

↓

Economic Benefit

↓

Production Improvement

↓

Market Opportunity

↓

Research Cost

↓

Research Duration

↓

Technology Selection

Only existing Technology definitions may be researched.

---

# 46. Financial Planning

Financial planning manages company liquidity.

Planning priorities include:

- operational expenses
- construction
- logistics
- research
- expansion
- strategic reserves

Companies should maintain sufficient liquidity to survive temporary economic downturns.

---

# 47. Risk Management

Companies continuously evaluate operational risks.

Examples include:

- supplier dependency
- transport dependency
- resource scarcity
- market volatility
- declining profitability

Risk influences future planning priorities but never overrides deterministic decision making.

---

# 48. Market Competition

Competition is indirect.

Companies compete through:

- pricing
- efficiency
- technology
- logistics
- expansion
- resource acquisition

The economy rewards better strategic decisions rather than scripted advantages.

---

# 49. Regional Expansion

Companies evaluate new regions using:

- demand
- resource availability
- infrastructure
- competition
- logistics costs
- expected profitability

Expansion remains a strategic decision.

---

# 50. Multi-Region Operations

A company may simultaneously operate in multiple regions.

Examples include:

- production facilities
- warehouses
- logistics hubs
- research centres

Ownership remains centralised within a single Company aggregate.

No regional sub-companies are introduced.

---

# End of Part 2

# 51. Company Knowledge Evolution

Knowledge is not static.

Every company continuously expands its understanding of the world through observation.

Knowledge acquisition includes:

- completed trades
- successful production
- failed production
- completed transport
- observed market prices
- regional expansion
- completed research

Knowledge never contains information that has not been observed.

There is no omniscient AI.

---

# 52. Company Memory

Memory stores historical observations.

Examples include:

- previous market prices
- supplier reliability
- transport delays
- production efficiency
- profitability
- regional performance
- historical demand

Memory supports long-term planning.

Historical information may decay according to deterministic rules.

The decay algorithm shall itself be deterministic.

---

# 53. Strategy Adaptation

Strategies evolve through experience.

The underlying planning algorithms remain unchanged.

Only strategy weights may change.

Example:

Poor Profitability

↓

Decrease Expansion Weight

↓

Increase Cost Optimization Weight

↓

Increase Trading Weight

↓

Rebalance Production

The adaptation model must never create unpredictable behaviour.

---

# 54. AI Event Model

Important business events become simulation events.

Examples include:

CompanyFounded

CompanyExpanded

CompanyMerged (future)

CompanyBankrupt

ResearchStarted

ResearchCompleted

MarketOpportunityDetected

ProductionFailure

LiquidityWarning

These events integrate into the existing simulation event infrastructure.

No secondary event system shall be introduced.

---

# 55. Simulation Integration

The economy integrates into the existing Simulation Engine.

No additional scheduler shall be implemented.

Simulation systems execute according to the deterministic execution order defined by M7.

Illustrative execution order:

Simulation Tick

↓

World Systems

↓

Market Systems

↓

Company Planning

↓

Production Systems

↓

Transport Systems

↓

Research Systems

↓

Financial Systems

↓

Persistence

↓

Next Tick

The exact ordering shall follow existing architectural decisions.

---

# 56. Planning Systems

Planning responsibilities are separated into dedicated simulation systems.

Possible systems include:

- CompanyPlanningSystem
- MarketAnalysisSystem
- StrategyPlanningSystem
- FinancialPlanningSystem

Systems shall remain small, deterministic and independently testable.

Responsibilities must never overlap.

---

# 57. Deterministic Execution

Determinism remains the highest architectural priority.

Simulation execution shall guarantee:

stable ordering

stable iteration

stable identifiers

stable random seed usage

stable event ordering

stable serialization

Running identical saves must always produce identical simulation results.

---

# 58. Repository Integration

Existing repositories shall be extended whenever possible.

Potential additions include:

CompanyBrainRepository

StrategyRepository

MarketHistoryRepository

DecisionQueueRepository

New repositories shall only be introduced when they represent genuine aggregate ownership or are required by multiple consumers.

Repository duplication is prohibited.

---

# 59. Application Layer Integration

Every autonomous action becomes an Application command.

Examples include:

PurchaseResourceUseCase

SellResourceUseCase

StartProductionUseCase

ConstructBuildingUseCase

StartResearchUseCase

CreateTransportRouteUseCase

The AI never modifies repositories directly.

The same validation pipeline is used by both player and AI.

---

# 60. Domain Integration

Business rules remain inside the Domain Layer.

Examples include:

inventory validation

recipe validation

technology validation

building validation

financial validation

market validation

Planning systems never duplicate business rules.

---

# 61. Persistence

The complete runtime state required for deterministic continuation shall be persisted.

Persistent state includes:

Company Brain

Strategy

Goals

Knowledge

Memory

Decision Queue

Pending Plans

Active Evaluations

Simulation Tick

Everything required to continue the simulation without behavioural changes.

---

# 62. Savegame Migration

Existing savegames remain supported.

Migration shall:

detect version

↓

transform legacy state

↓

initialize new economy state

↓

validate consistency

↓

load simulation

Migration must never invalidate existing player progress.

---

# 63. Serialization Rules

Serialization shall preserve:

stable identifiers

stable ordering

stable references

stable version information

Transient runtime caches must never be serialized.

Derived values shall be reconstructed after loading.

---

# 64. Content Extensions

New content types shall only be introduced where they provide genuine flexibility.

Potential additions include:

StrategyDefinition

MarketPolicyDefinition

DecisionWeightsDefinition

ResearchPriorityDefinition

ExpansionPolicyDefinition

Every content type shall follow the established repository contract:

Definition

↓

Validator

↓

Loader

↓

Registry

↓

YAML Assets

↓

Schema Documentation

↓

Cross Registry Validation

↓

Tests

---

# 65. Work Package Structure

Implementation is divided into incremental work packages.

## M8-0

Architecture Audit

Repository Review

Gap Analysis

---

## M8-1

Strategy Framework

Company Brain

Knowledge

Memory

Goal System

---

## M8-2

Regional Market Simulation

Price Formation

Market History

Liquidity

Supply

Demand

---

## M8-3

Production Planning

Purchasing

Selling

Inventory Policies

---

## M8-4

Financial Planning

Risk Evaluation

Expansion Planning

Construction Planning

---

## M8-5

Research Planning

Technology Prioritization

Strategy Adaptation

---

## M8-6

Simulation Integration

Planning Systems

Event Integration

Repository Integration

---

## M8-7

Persistence

Serialization

Migration

Savegames

---

## M8-8

Integration Testing

Performance Testing

Regression Testing

Determinism Validation

---

## M8-9

Architecture Review

Repository Audit

Documentation

Final Validation

Milestone Completion

---

# 66. Deliverables

At milestone completion the repository shall contain:

- deterministic economy simulation
- autonomous companies
- dynamic regional markets
- strategy framework
- planning framework
- company memory
- company knowledge
- market history
- savegame support
- migration support
- complete documentation
- repository validation
- automated tests

---

# End of Part 3

# 67. Validation Strategy

Validation is performed continuously throughout implementation.

Every completed work package must satisfy its own validation criteria before the next work package begins.

Validation follows four independent layers:

```

Content

↓

Domain

↓

Application

↓

Simulation

```

Each layer must pass independently.

No validation layer may be skipped.

---

# 68. Content Validation

Every new content definition introduced by M8 shall follow the established repository conventions.

Validation includes:

- schema validation

- required fields

- identifier uniqueness

- cross references

- balancing values

- loader ordering

- registry consistency

Every content type requires:

Definition

↓

Validator

↓

Loader

↓

Registry

↓

Schema Documentation

↓

Tests

---

# 69. Cross Registry Validation

Relationships between content definitions shall be verified after loading.

Examples include:

StrategyDefinition

↓

TechnologyDefinition

↓

BuildingDefinition

↓

RecipeDefinition

↓

ResourceTypeDefinition

↓

RegionDefinition

Invalid references must fail validation immediately.

The repository shall never start with inconsistent content.

---

# 70. Domain Validation

Business rules remain authoritative.

Typical validation includes:

- sufficient money

- available inventory

- researched technology

- valid building

- valid recipe

- transport capacity

- regional ownership

- construction permissions

No planning system may bypass domain validation.

---

# 71. Application Validation

Every AI action executes through existing Application use cases.

Validation therefore remains identical for:

Player

↓

Application Layer

↓

Domain

↓

Repositories

and

NPC Company

↓

Application Layer

↓

Domain

↓

Repositories

Both execution paths must produce identical validation behaviour.

---

# 72. Simulation Validation

Simulation correctness is verified continuously.

Validation includes:

- deterministic tick execution

- deterministic planning

- deterministic transport

- deterministic market behaviour

- deterministic event ordering

Simulation replay using identical inputs shall always produce identical outputs.

---

# 73. Persistence Validation

Persistence testing verifies:

Save

↓

Load

↓

Continue Simulation

↓

Produce Identical Results

Migration tests shall verify compatibility with previous milestone savegames.

---

# 74. Test Strategy

Testing follows the existing repository philosophy.

Priority order:

1. Unit Tests

2. Domain Tests

3. Application Tests

4. Integration Tests

5. Simulation Tests

6. Regression Tests

7. Determinism Tests

Every planning component should have isolated unit tests before integration.

---

# 75. Unit Tests

Typical unit test targets include:

- strategy evaluation

- goal prioritisation

- market calculations

- pricing policies

- liquidity calculations

- planning heuristics

- memory decay

- knowledge updates

Unit tests shall avoid simulation infrastructure whenever possible.

---

# 76. Domain Tests

Domain tests verify:

- company lifecycle

- inventory rules

- financial rules

- production validation

- technology progression

- construction validation

- market participation

Domain tests never depend on UI or persistence.

---

# 77. Application Tests

Application tests verify complete workflows.

Examples include:

Purchase Resource

↓

Validation

↓

Repository Updates

↓

Domain Events

↓

Simulation Visibility

Every workflow shall behave identically for player and AI initiated actions.

---

# 78. Simulation Tests

Simulation tests validate interactions between systems.

Examples include:

- regional market evolution

- production chains

- logistics integration

- AI competition

- technology progression

- economic expansion

Simulation tests should execute multiple ticks and verify stable outcomes.

---

# 79. Determinism Tests

Determinism is a mandatory quality gate.

Typical scenarios include:

Run A

↓

Serialize

↓

Load

↓

Continue

↓

Compare

with

Run B

↓

Serialize

↓

Load

↓

Continue

↓

Compare

Expected result:

Simulation states are identical.

Event streams are identical.

Company decisions are identical.

---

# 80. Regression Tests

All previously completed milestones remain fully functional.

Regression scope includes:

M4

Company Management

M5

Production

Research

M6

Transport

Logistics

M7

World Simulation

No existing behaviour may regress.

---

# 81. Performance Tests

Performance validation measures:

- planning duration

- market evaluation

- transport planning

- simulation tick duration

- serialization

- loading

- savegame migration

Performance regressions shall be documented before optimisation.

---

# 82. Acceptance Criteria

The milestone is considered complete only if:

✓ Autonomous companies operate successfully.

✓ Companies participate in regional markets.

✓ Dynamic pricing functions correctly.

✓ Production planning is autonomous.

✓ Purchasing decisions are autonomous.

✓ Selling decisions are autonomous.

✓ Expansion decisions are autonomous.

✓ Research planning is autonomous.

✓ Logistics integrates correctly.

✓ Savegames remain compatible.

✓ Determinism is preserved.

✓ Repository validation succeeds.

✓ Documentation is complete.

---

# 83. Definition of Done

M8 is complete when:

- all work packages are finished

- all quality gates pass

- documentation is updated

- repository validation succeeds

- regression testing succeeds

- determinism is verified

- migration is validated

- no critical architecture issues remain open

---

# 84. Quality Gates

Every work package must satisfy:

✓ formatting

✓ linting

✓ type checking

✓ unit tests

✓ integration tests

✓ repository validation

Before milestone completion the following commands shall succeed without errors:

```text

pnpm format

pnpm lint

pnpm typecheck

pnpm test

pnpm validate-content

pnpm validate-content --strict

pnpm build

pnpm build:web

```

No milestone may be completed with failing quality gates.

---

# 85. Performance Targets

The architecture should support at least:

- hundreds of companies

- thousands of buildings

- multiple world regions

- thousands of transport operations

- thousands of simultaneous production orders

- long-running simulations

without changing the deterministic execution model.

Specific numerical optimisation targets are intentionally deferred until profiling data exists.

---

# 86. Risk Register

Known architectural risks include:

Economic Risks

- runaway inflation

- runaway deflation

- permanent shortages

- market monopolies

Simulation Risks

- excessive planning cost

- unstable iteration order

- event explosion

- excessive memory growth

Persistence Risks

- migration failures

- inconsistent savegames

- serialization drift

Implementation Risks

- duplicated business rules

- duplicate repositories

- architecture violations

- deterministic regressions

Each confirmed risk shall receive at least one regression test.

---

# End of Part 4

# 87. Architecture Compliance

M8 shall remain fully compliant with the architectural principles established throughout Project Genesis.

Implementation shall respect:

- Accepted ADRs

- Repository architecture

- Domain boundaries

- Application boundaries

- Simulation architecture

- Persistence architecture

- Content architecture

Architectural consistency always takes precedence over implementation convenience.

---

# 88. Architectural Constraints

The following constraints are mandatory.

## No Duplicate Systems

M8 shall not introduce:

- a second market

- a second company implementation

- a second inventory model

- a second logistics model

- a second production model

- a second scheduler

- a second event bus

- a second persistence model

Existing implementations shall always be extended.

---

## Stable Responsibilities

Simulation systems execute behaviour.

Repositories own state.

Domain owns business rules.

Application coordinates workflows.

Infrastructure performs IO.

Content defines immutable configuration.

These responsibilities shall never overlap.

---

## Deterministic Behaviour

Every algorithm introduced during M8 shall produce identical results when executed with identical input.

Permitted sources of variability:

- simulation state

- content definitions

- deterministic ordering

Forbidden sources include:

- wall-clock time

- thread scheduling

- unordered iteration

- non-seeded randomness

---

# 89. Documentation Requirements

Repository documentation shall remain synchronized with implementation.

The following documents shall be reviewed upon milestone completion:

- IMPLEMENTATION_[PROGRESS.md](http://PROGRESS.md)

- MILESTONE_[PLAN.md](http://PLAN.md)

- relevant ADRs

- simulation documentation

- economy documentation

- architecture documentation

Schema documentation shall be updated whenever new content definitions are introduced.

---

# 90. Architecture Decision Records

A new ADR shall only be created when M8 introduces an architectural decision that:

- changes repository structure

- changes runtime architecture

- changes persistence strategy

- changes simulation execution

- changes modular boundaries

Implementation details shall not become ADRs.

---

# 91. Repository Review

A complete repository review shall be performed after implementation.

The review verifies:

- repository consistency

- dependency direction

- module boundaries

- deterministic execution

- documentation completeness

- duplicate concepts

- obsolete code

- obsolete documentation

The review shall conclude with explicit recommendations.

---

# 92. Implementation Report

At milestone completion an implementation report shall summarize:

## Repository Audit

Current implementation status.

---

## Architecture Changes

Architectural decisions made during implementation.

---

## New Components

Repositories

Simulation Systems

Domain Objects

Content Types

Application Services

Persistence Components

---

## Modified Components

Existing systems extended during implementation.

---

## Deferred Work

Features intentionally postponed to M9 or later.

---

## Open Issues

Remaining technical debt.

Known limitations.

Potential future improvements.

---

# 93. Transition to M9

M8 prepares the simulation for future milestones.

Expected M9 capabilities include:

- population simulation

- workforce

- employment

- taxation

- regional politics

- migration

- public services

- government interaction

M8 shall not implement these systems.

Instead, it shall provide stable extension points.

---

# 94. Long-Term Vision

Following completion of M8, Project Genesis consists of:

World

↓

Regions

↓

Markets

↓

Companies

↓

Production

↓

Logistics

↓

Research

↓

Competition

↓

Emergent Economy

Future milestones will build upon this foundation without replacing it.

---

# 95. Glossary

## Company

An economic actor participating in the simulation.

---

## Strategy

A collection of decision weights guiding company planning.

---

## Company Brain

The planning component responsible for generating deterministic business decisions.

---

## Knowledge

Information currently known by a company.

---

## Memory

Historical observations retained by a company.

---

## Goal

A long-term objective generated through planning.

---

## Decision

A validated action awaiting execution.

---

## Market

A regional mechanism for price discovery and trade.

---

## Liquidity

The ability of a market to absorb trading activity.

---

## Planning Cycle

The deterministic sequence from observation to validated decisions.

---

# 96. References

The implementation of M8 builds directly upon:

- M4 – Company Foundation

- M5 – Production & Research

- M6 – Logistics

- M7 – World Simulation

Implementation shall also remain consistent with:

- accepted ADRs

- repository architecture

- deterministic simulation model

- content framework

- savegame architecture

---

# 97. Final Review Checklist

Before declaring M8 complete, verify:

Architecture

□ No duplicate systems introduced

□ Existing responsibilities preserved

□ ADR compliance verified

Simulation

□ Deterministic execution confirmed

□ Stable ordering confirmed

□ Stable serialization confirmed

Economy

□ Regional markets operational

□ Dynamic pricing operational

□ Autonomous companies operational

Persistence

□ Savegames supported

□ Migration validated

Testing

□ Unit tests passing

□ Integration tests passing

□ Regression tests passing

□ Determinism tests passing

Repository

□ Documentation updated

□ Content validation passing

□ No obsolete files remain

□ Quality gates completed

---

# 98. Milestone Completion

The Economy Simulation milestone is complete when the repository satisfies all of the following conditions:

- autonomous companies participate in the simulation

- regional markets evolve naturally

- logistics, production and research interact correctly

- companies compete under identical rules

- deterministic execution is preserved

- savegames remain compatible

- repository validation succeeds

- architecture remains consistent

- documentation is synchronized

- all quality gates pass

Completion of M8 establishes the first fully autonomous economic simulation within Project Genesis and provides the foundation for all subsequent societal, political and population systems.

---

# End of Document
