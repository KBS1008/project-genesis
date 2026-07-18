# Naming Conventions

**Project:** Project Genesis

**Document:** Naming Conventions

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines naming conventions for Project Genesis.

Consistent naming improves:

- readability
- discoverability
- maintainability
- code review
- tooling
- architecture enforcement
- onboarding
- documentation consistency

Names should communicate intent.

A good name should reduce the need for additional explanation.

---

# Core Principles

Project Genesis follows these principles:

1. Names must be explicit.
2. Names must reflect domain meaning.
3. Names should be consistent within the same context.
4. Abbreviations should be avoided unless universally understood.
5. Naming should remain stable over time.
6. Technical names should not obscure domain concepts.
7. Names should not encode temporary implementation details.
8. Naming conventions must be applied consistently.
9. Domain terminology is authoritative.
10. Naming decisions should support discoverability.

---

# Language

The primary language for source code identifiers is:

```text
English
```

This applies to:

- classes
- interfaces
- functions
- methods
- variables
- properties
- enums
- constants
- modules
- namespaces
- files

Domain terminology should use consistent English terms.

---

# Domain Terminology

Domain names must follow the project's canonical domain vocabulary.

The same concept should have one primary name.

Avoid:

```text
Factory
Plant
ProductionFacility
ManufacturingSite
```

if all refer to the same domain concept.

Prefer one canonical term:

```text
Factory
```

The canonical term should be used consistently throughout:

- code
- documentation
- tests
- assets
- registries
- configuration
- logs

---

# Ubiquitous Language

The project's domain terminology should be treated as a shared vocabulary.

When a domain concept changes name, the change should be evaluated across:

```text
Code
+
Documentation
+
Assets
+
Registries
+
Savegames
+
Configuration
+
Tests
```

Renaming a core domain concept is an architectural change.

---

# General Naming Rules

Names should:

- be descriptive
- be unambiguous
- use established domain vocabulary
- avoid unnecessary abbreviations
- avoid redundant prefixes
- avoid meaningless suffixes

Avoid:

```text
data
manager
helper
util
thing
object
stuff
misc
temp
```

unless the name is genuinely appropriate.

---

# Abbreviations

Avoid abbreviations unless they are:

- universally understood
- established project terminology
- part of an external standard

Preferred:

```text
Simulation
Production
Configuration
Repository
```

Avoid:

```text
Sim
Prod
Config
Repo
```

unless explicitly established by the project.

---

# Acronyms

Acronyms should use consistent casing.

Examples:

```text
ID
API
UI
NPC
AI
LOD
```

The exact convention should remain consistent with the programming language.

Example:

```text
EntityId
NpcController
AiDecision
```

or:

```text
EntityID
NPCController
AIDecision
```

The project should choose one style per language ecosystem and apply it consistently.

---

# Classes

Classes should use:

```text
PascalCase
```

Examples:

```text
Factory
ProductionOrder
ResourceInventory
MarketSimulation
```

Class names should normally be nouns or noun phrases.

Avoid:

```text
DoFactory
ProcessThing
Manager
```

unless the concept genuinely represents that behaviour.

---

# Interfaces

Interfaces should use:

```text
PascalCase
```

The interface naming convention should reflect the project's language ecosystem.

Preferred conceptual names:

```text
Repository
Clock
RandomSource
AssetProvider
```

If the language ecosystem convention requires an `I` prefix, use:

```text
IRepository
IClock
IRandomSource
```

The project should use one convention consistently.

---

# Abstract Classes

Abstract classes should use:

```text
PascalCase
```

The name should describe the abstraction.

Examples:

```text
BaseEntity
AbstractSimulationSystem
```

Avoid unnecessary `Base` prefixes.

Prefer meaningful abstractions where possible.

---

# Records and Data Structures

Records and data structures should use:

```text
PascalCase
```

Examples:

```text
ProductionOrderData
FactoryState
SimulationSnapshot
SaveGameMetadata
```

Names should describe the data represented.

---

# Enums

Enums should use:

```text
PascalCase
```

Example:

```text
ProductionState
```

Enum values should follow the language-specific constant convention.

Example:

```text
Idle
Running
Completed
Failed
```

Avoid numeric-only meanings.

Prefer:

```text
ProductionState.Running
```

over:

```text
ProductionState.State2
```

---

# Enum Values

Enum values should describe domain meaning.

Avoid:

```text
Value1
Unknown2
TypeA
```

unless the values genuinely represent those concepts.

---

# Methods

Methods should use the project's language-specific method casing convention.

For languages using camelCase:

```text
createProductionOrder()
calculateProductionCost()
loadSaveGame()
```

Method names should generally begin with a verb.

---

# Queries

Query methods should communicate that they retrieve information without mutating state.

Examples:

```text
getFactory()
findFactory()
findFactories()
calculateProductionCost()
isProductionActive()
hasSufficientResources()
```

The naming should distinguish:

```text
Query
```

from:

```text
Command
```

where possible.

---

# Commands

Methods that mutate state should use action-oriented names.

Examples:

```text
createProductionOrder()
startProduction()
reserveResources()
completeProduction()
cancelOrder()
```

Avoid ambiguous names such as:

```text
process()
handle()
execute()
run()
```

unless the context makes the meaning explicit.

---

# Boolean Methods

Boolean methods should use meaningful prefixes.

Examples:

```text
isActive()
isValid()
hasResources()
canProduce()
shouldSave()
```

Avoid:

```text
active()
resource()
valid()
```

when the return type alone does not make the meaning clear.

---

# Getters

Getters should be used consistently according to the language ecosystem.

Examples:

```text
getName()
getBalance()
getProductionState()
```

Avoid redundant names such as:

```text
getGetName()
```

---

# Setters

Setters should not automatically be created for every property.

Prefer domain operations that preserve invariants.

Avoid:

```text
setBalance(-1000)
```

Prefer:

```text
withdrawFunds(amount)
```

when the domain requires invariant protection.

---

# Constructors

Constructors should create valid objects.

Avoid constructors that allow invalid domain states.

Preferred:

```text
Factory.create(...)
```

or:

```text
Factory(...)
```

when construction guarantees validity.

---

# Factory Methods

Factory methods should use names that describe the creation intent.

Examples:

```text
create()
fromSnapshot()
fromSaveData()
restore()
reconstitute()
```

The distinction between:

```text
Create
```

and:

```text
Reconstitute
```

should be explicit where domain semantics require it.

---

# Variables

Variables should use:

```text
camelCase
```

where the language convention supports it.

Examples:

```text
productionOrder
resourceAmount
simulationTick
factoryState
```

Avoid:

```text
x
y
tmp
foo
bar
```

unless the context makes the meaning obvious.

---

# Loop Variables

Simple loop variables may use short names where appropriate.

Example:

```text
for entity in entities
```

is preferred over:

```text
for e in entities
```

when clarity benefits from the longer name.

---

# Collections

Collection names should indicate plurality.

Examples:

```text
factories
productionOrders
resources
npcs
contracts
```

Avoid:

```text
factoryList
orderArray
resourceCollection
```

unless the actual data structure is important to the abstraction.

---

# Maps and Dictionaries

Names should indicate key/value meaning.

Examples:

```text
factoriesById
resourcesByType
ordersByFactoryId
```

This is preferred over:

```text
factoryMap
resourceMap
orderDictionary
```

when the key relationship is important.

---

# IDs

Identifiers should use explicit names.

Examples:

```text
factoryId
productId
resourceId
entityId
```

Avoid ambiguous names:

```text
id
key
value
```

unless the local context is completely unambiguous.

---

# IDs vs References

Use names that distinguish identifiers from object references.

Example:

```text
factoryId
factory
```

Avoid:

```text
factory
```

when it actually contains an ID.

---

# Booleans

Boolean variables should communicate their semantic meaning.

Examples:

```text
isActive
hasResources
canProduce
shouldProcess
```

Avoid:

```text
activeFlag
validFlag
```

unless required by an external schema.

---

# Numeric Values

Numeric variables should communicate units where ambiguity is possible.

Examples:

```text
distanceMeters
durationSeconds
massKg
priceCredits
```

Avoid:

```text
distance
time
value
```

when multiple units are possible.

---

# Money

Monetary values must communicate their currency or unit where necessary.

Examples:

```text
credits
creditsAmount
priceCredits
```

Avoid ambiguous names:

```text
money
value
amount
```

unless the domain context is explicit.

---

# Quantities

Quantities should communicate what is being measured.

Examples:

```text
resourceQuantity
productionQuantity
inventoryQuantity
```

Avoid:

```text
amount
number
value
```

when the meaning is ambiguous.

---

# Time

Time-related values should communicate semantics.

Examples:

```text
simulationTick
durationSeconds
elapsedSeconds
timestamp
```

Avoid:

```text
time
```

when the actual meaning is unclear.

---

# Dates and Timestamps

Names should distinguish:

```text
date
timestamp
duration
elapsedTime
```

These concepts must not be used interchangeably.

---

# Files

File names should use a consistent convention.

For documentation:

```text
UPPER_SNAKE_CASE.md
```

Examples:

```text
ERROR_HANDLING_STRATEGY.md
TESTING_STRATEGY.md
PERFORMANCE_GUIDELINES.md
```

---

# Documentation Files

Documentation file names should be:

- descriptive
- stable
- uppercase
- underscore-separated

Preferred:

```text
DEPENDENCY_RULES.md
NAMING_CONVENTIONS.md
```

Avoid:

```text
dependencyRules.md
NamingConventions.md
dependency-rules.md
```

for project architecture documentation.

---

# Source Files

Source file naming should follow the conventions of the selected programming language and framework.

The project must use one consistent convention within each source ecosystem.

Examples may include:

```text
Factory.cs
ProductionOrder.cs
SimulationSystem.cs
```

or:

```text
factory.ts
production-order.ts
simulation-system.ts
```

The exact convention must match the technology stack.

---

# Test Files

Test files should clearly correspond to the tested component.

Examples:

```text
FactoryTests
ProductionOrderTests
SimulationSystemTests
```

or the equivalent convention of the selected test framework.

---

# Test Names

Test names should describe behaviour.

Preferred:

```text
production_fails_when_resources_are_insufficient
```

Avoid:

```text
test1
testProduction
```

Test naming should align with:

```text
TESTING_STRATEGY.md
```

---

# Asset Names

Asset names should be:

- stable
- descriptive
- predictable
- machine-readable
- consistent with asset registries

Asset naming must align with:

```text
ASSET_ID_SYSTEM.md
```

and:

```text
GLOBAL_ASSET_REGISTRY.md
```

---

# Asset Naming Structure

Where applicable, asset names may follow:

```text
<Category>_<Type>_<Variant>_<Version>
```

Example:

```text
VEHICLE_TRUCK_HEAVY_01
```

The exact naming scheme must be defined by the asset management system.

---

# Asset IDs vs Display Names

Asset IDs must be stable.

Display names may change.

Example:

```text
Asset ID:
VEHICLE_TRUCK_HEAVY_01

Display Name:
Heavy Cargo Truck
```

Code should use the stable ID.

UI should use the display name.

---

# Registry Names

Registry identifiers should be:

- unique
- stable
- deterministic

Registries must avoid duplicate identifiers.

---

# Configuration Keys

Configuration keys should use a consistent convention.

Example:

```text
simulation.tickRate
simulation.maxEntities
savegame.version
```

The exact format depends on the configuration technology.

---

# Environment Variables

Environment variables should use uppercase conventions where required.

Example:

```text
PROJECT_GENESIS_ENV
PROJECT_GENESIS_DEBUG
```

Environment-specific naming must remain consistent.

---

# Namespaces and Modules

Namespaces and modules should reflect architectural ownership.

Examples:

```text
ProjectGenesis.Domain
ProjectGenesis.Application
ProjectGenesis.Infrastructure
ProjectGenesis.Presentation
```

Avoid generic namespaces such as:

```text
ProjectGenesis.Misc
ProjectGenesis.Helpers
ProjectGenesis.Common
```

unless their ownership is explicitly defined.

---

# Namespace Dependency Alignment

Namespace structure should reflect architectural boundaries.

Example:

```text
ProjectGenesis.Domain
ProjectGenesis.Application
ProjectGenesis.Infrastructure
```

Namespaces should not create the illusion of architectural separation where none exists.

---

# Managers

The term `Manager` should be used cautiously.

Avoid:

```text
FactoryManager
NPCManager
ResourceManager
```

when the class has multiple unrelated responsibilities.

Prefer specific names:

```text
FactoryRegistry
NpcSimulationSystem
ResourceInventory
```

---

# Services

The term `Service` should describe a meaningful domain or application responsibility.

Avoid generic:

```text
GameService
SystemService
ManagerService
```

Prefer:

```text
ProductionService
MarketService
SaveGameService
```

where appropriate.

---

# Systems

The term `System` should be used for components that process or coordinate a defined set of operations.

Examples:

```text
ProductionSystem
LogisticsSystem
MarketSimulationSystem
```

Systems should have clear responsibilities.

---

# Controllers

`Controller` should generally refer to presentation or input coordination.

Examples:

```text
InputController
CameraController
UIController
```

Avoid using `Controller` as a generic name for domain logic.

---

# Handlers

`Handler` should represent a component that handles a defined event, command or request.

Examples:

```text
CreateProductionOrderHandler
SaveGameCommandHandler
InputEventHandler
```

---

# Repositories

Repositories should use:

```text
<Entity>Repository
```

Examples:

```text
FactoryRepository
ProductionOrderRepository
SaveGameRepository
```

Repository names should describe the persisted aggregate or domain concept.

---

# Adapters

Adapters should identify the external system or abstraction they adapt.

Examples:

```text
DatabaseRepositoryAdapter
FileSystemAssetAdapter
ExternalMarketAdapter
```

Avoid generic:

```text
Adapter
```

---

# Ports

Ports should describe the capability they expose.

Examples:

```text
AssetProvider
Clock
RandomSource
PersistencePort
```

The exact naming should follow the project's architecture.

---

# Events

Events should use past-tense names where appropriate.

Examples:

```text
ProductionStarted
ProductionCompleted
ResourceReserved
OrderCancelled
```

Events represent something that happened.

Avoid event names that sound like commands:

```text
StartProduction
CancelOrder
```

unless they are intentionally commands.

---

# Commands

Commands should use imperative names.

Examples:

```text
StartProduction
CancelProductionOrder
PurchaseResources
SaveGame
```

Commands represent requested actions.

---

# Queries

Queries should represent requests for information.

Examples:

```text
GetFactory
FindProductionOrders
GetMarketPrice
```

---

# Commands vs Events

The naming must distinguish:

```text
Command
    Request to perform an action

Event
    Notification that something happened
```

Example:

```text
StartProductionCommand
        ↓
ProductionStartedEvent
```

---

# DTOs

DTO naming should describe their boundary purpose.

Examples:

```text
ProductionOrderDto
FactorySummaryDto
SaveGameMetadataDto
```

Avoid generic:

```text
Data
Object
TransferObject
```

unless required by the framework.

---

# View Models

Presentation models should be clearly identified.

Examples:

```text
FactoryViewModel
ProductionOrderViewModel
MarketViewModel
```

They should not be confused with domain models.

---

# Error Names

Error names should describe the failure.

Examples:

```text
InsufficientResources
InvalidProductionQuantity
FactoryNotFound
SaveGameLoadFailed
```

Avoid:

```text
Error1
GenericError
SomethingWentWrong
```

Error naming must align with:

```text
ERROR_HANDLING_STRATEGY.md
```

---

# Result Names

Result types should clearly communicate their purpose.

Examples:

```text
ProductionResult
ValidationResult
SaveGameResult
```

Generic `Result<T, E>` should be used where the generic type is sufficient.

---

# Logging Context Names

Logging fields should use stable names.

Examples:

```text
entityId
factoryId
productionOrderId
simulationTick
correlationId
```

Logging names must align with:

```text
LOGGING_STRATEGY.md
```

---

# Correlation IDs

Correlation identifiers should use a consistent name:

```text
correlationId
```

Where multiple tracing concepts exist, distinguish:

```text
correlationId
traceId
spanId
requestId
```

Do not use them interchangeably.

---

# Serialization Names

Serialized field names should remain stable unless a version migration is provided.

Renaming a serialized field may be a persistence compatibility change.

---

# Savegame Names

Savegame schema names should be treated as persistent contracts.

Example:

```text
saveVersion
worldState
simulationState
playerState
```

Changes must be coordinated with savegame migration.

---

# API Names

Public APIs should use stable, explicit names.

Avoid exposing temporary implementation terminology.

---

# Public vs Internal Names

Public names require greater stability.

Internal names may evolve more freely.

Before renaming a public concept, evaluate:

- compatibility
- serialization
- savegames
- external integrations
- documentation
- tooling

---

# Naming and Refactoring

Renaming is not always a cosmetic change.

A rename may affect:

```text
Code
Tests
Documentation
Assets
Registries
Savegames
Configuration
External Interfaces
```

Core domain renames require impact analysis.

---

# Naming and Domain Evolution

If domain terminology changes:

```text
Identify Canonical Term

↓

Update Domain Model

↓

Update Code

↓

Update Tests

↓

Update Documentation

↓

Update Assets and Registries

↓

Update Persistence / Migration

↓

Run Quality Gates
```

---

# Naming and Determinism

Names must not affect deterministic behaviour accidentally.

Identifiers used in:

- sorting
- serialization
- hashing
- registry ordering

must have explicitly defined semantics.

Renaming an identifier may affect deterministic ordering.

---

# Naming and Sorting

If names are used for deterministic sorting:

- define case sensitivity
- define locale behaviour
- define normalization
- define tie-breaking

Do not rely on platform-specific locale sorting for deterministic simulation.

---

# Naming and IDs

IDs used for deterministic systems should be stable.

Avoid generating IDs from:

- memory addresses
- object references
- system time

unless explicitly intended.

---

# Naming Review

Code reviews should check:

- domain terminology
- consistency
- clarity
- abbreviation usage
- architectural meaning
- identifier stability

---

# Naming Violations

Naming violations should be classified according to impact.

Possible categories:

```text
Critical
Creates ambiguity in core domain concepts

High
Breaks architectural or persistence conventions

Medium
Creates inconsistent terminology

Low
Minor style inconsistency
```

---

# Exceptions

Exceptions to naming conventions may exist.

Examples:

- external API contracts
- framework requirements
- third-party schemas
- legacy compatibility
- platform conventions

Exceptions should not silently become project-wide conventions.

---

# Exception Documentation

Exceptions should document:

```text
Name

Rule Violated

Reason

Scope

Owner

Review Date
```

---

# Automated Enforcement

Where practical, naming conventions should be enforced through:

- linters
- static analysis
- code style tools
- architecture tests
- CI checks

Automated enforcement should focus on high-value conventions.

---

# Naming and Technical Debt

Inconsistent naming may create technical debt.

Examples:

- duplicate terminology
- ambiguous identifiers
- inconsistent domain vocabulary
- unstable serialized names
- conflicting asset IDs

Naming-related debt should be tracked where it creates meaningful maintenance cost.

---

# Anti-Patterns

Avoid:

- generic names
- meaningless abbreviations
- inconsistent domain terminology
- excessive `Manager` classes
- excessive `Helper` classes
- ambiguous IDs
- unclear boolean names
- domain concepts hidden behind technical names
- unstable persistence identifiers
- accidental terminology duplication

---

# Quality Requirements

Naming conventions must provide:

- consistent terminology
- clear domain language
- predictable identifiers
- stable asset and persistence naming
- readable source code
- discoverable architecture
- consistent documentation

---

# Adoption Strategy

Naming conventions should be adopted incrementally.

Priority:

1. Core domain terminology
2. Public APIs
3. Persistence and savegame identifiers
4. Asset IDs
5. Application boundaries
6. Tests
7. Internal implementation details

---

# Migration

When correcting naming inconsistencies:

```text
Identify Inconsistent Name

↓

Determine Canonical Term

↓

Assess Impact

↓

Update Code

↓

Update Tests

↓

Update Documentation

↓

Update Assets and Registries

↓

Handle Persistence Migration

↓

Run Quality Gates
```

---

# Quality Gates

Naming-related quality gates should verify:

- no conflicting core domain terminology
- stable persistence identifiers
- stable asset identifiers
- consistent public APIs
- naming conventions enforced where practical

---

# Related Documents

- DEPENDENCY_RULES.md
- RESULT_PATTERN.md
- VALIDATION_STRATEGY.md
- TESTING_STRATEGY.md
- LOGGING_STRATEGY.md
- ASSET_ID_SYSTEM.md
- GLOBAL_ASSET_REGISTRY.md
- QUALITY_GATES.md
- TECHNICAL_DEBT_POLICY.md
- TECHNICAL_DEBT_REGISTER.md
- AUDIT_PROCESS.md

---

# Summary

Naming is an architectural concern.

Names should communicate:

```text
Intent
+
Domain Meaning
+
Ownership
+
Stability
```

The most important naming rule for Project Genesis is:

```text
One Concept
        ↓
One Canonical Name
```

Names used by persistence, assets, registries and deterministic systems must be treated as stable contracts.

Naming conventions should be enforced through:

```text
Code Review
+
Static Analysis
+
Automated Tests
+
Architecture Audits
```

The objective is not stylistic perfection.

The objective is a codebase in which developers, designers, tools and AI systems can reliably understand that the same concept has the same name everywhere.