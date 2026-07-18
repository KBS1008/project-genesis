# Dependency Rules

**Project:** Project Genesis

**Document:** Dependency Rules

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the dependency rules for Project Genesis.

The objective is to ensure that the architecture remains:

- modular
- maintainable
- testable
- replaceable
- deterministic
- scalable
- resistant to accidental coupling

Dependencies must be intentional.

A dependency is not only a direct code reference.

It may also include:

- compile-time dependencies
- runtime dependencies
- data dependencies
- event dependencies
- service dependencies
- infrastructure dependencies
- asset dependencies
- configuration dependencies

---

# Core Principle

Dependencies should point toward stable abstractions and architectural boundaries.

The preferred direction is:

```text
Outer / Technical Layers
        ↓
Application
        ↓
Domain
```

The Domain Layer should remain as independent as practical.

---

# Architectural Dependency Model

The preferred high-level architecture is:

```text
Presentation
     ↓
Application
     ↓
Domain
     ↑
Infrastructure
```

Infrastructure implements interfaces defined by inner layers where appropriate.

Conceptually:

```text
          Presentation
                ↓
          Application
                ↓
             Domain
                ↑
         Infrastructure
```

The exact implementation depends on the project's technology stack.

The architectural dependency direction must remain explicit.

---

# Layer Responsibilities

The project uses the following conceptual layers:

```text
Presentation
Application
Domain
Infrastructure
Shared / Cross-Cutting
```

Each layer has defined dependency responsibilities.

---

# Presentation Layer

The Presentation Layer may depend on:

- Application Layer
- presentation-specific infrastructure
- UI frameworks
- rendering systems
- input systems

The Presentation Layer must not contain authoritative domain rules.

Preferred:

```text
UI
    ↓
Application Use Case
    ↓
Domain
```

Avoid:

```text
UI
    ↓
Direct Domain Mutation
```

when this bypasses application workflows.

---

# Application Layer

The Application Layer may depend on:

- Domain Layer
- application abstractions
- ports/interfaces
- Result Pattern
- validation mechanisms
- application-specific services

The Application Layer should not depend directly on concrete infrastructure implementations where an abstraction is appropriate.

Preferred:

```text
Application
    ↓
IRepository
```

Infrastructure provides:

```text
Repository
    implements I
```

---

# Domain Layer

The Domain Layer is the most protected layer.

The Domain Layer should depend only on:

- domain abstractions
- domain types
- standard language/runtime capabilities
- explicitly approved shared primitives

The Domain Layer must not depend on:

- UI
- rendering
- persistence implementations
- filesystem APIs
- network APIs
- database implementations
- platform-specific services
- infrastructure frameworks

---

# Domain Independence

The Domain Layer should remain independently testable.

Ideally:

```text
Domain Tests
    ↓
No Database

No File System

No Network

No UI

No Rendering
```

Domain logic should be executable without infrastructure.

---

# Infrastructure Layer

The Infrastructure Layer may depend on:

- Domain abstractions
- Application abstractions
- external libraries
- filesystem
- databases
- network
- platform APIs
- serialization frameworks

Infrastructure should implement technical concerns.

It should not redefine domain rules.

---

# Dependency Inversion

Where appropriate, dependencies should point toward abstractions.

Example:

```text
Application
    ↓
IPersistence
    ↑
FilePersistence
```

The Application Layer depends on:

```text
IPersistence
```

not:

```text
FilePersistence
```

---

# Interface Ownership

Interfaces should generally be owned by the layer that requires the abstraction.

Example:

```text
Application requires persistence
        ↓
Application defines IPersistence
        ↓
Infrastructure implements IPersistence
```

This avoids forcing inner layers to depend on infrastructure-specific interfaces.

---

# Dependency Direction

Dependencies should follow:

```text
Presentation
    ↓
Application
    ↓
Domain
```

Infrastructure may implement abstractions required by:

```text
Application
Domain
```

but should not force those layers to depend on concrete infrastructure implementations.

---

# Forbidden Dependencies

The following dependencies are generally forbidden.

```text
Domain → Presentation

Domain → Infrastructure

Domain → Rendering

Domain → UI Framework

Domain → Database

Domain → Filesystem

Domain → Network
```

The exact technology may vary.

The architectural rule does not.

---

# Presentation to Infrastructure

Direct Presentation → Infrastructure dependencies should be minimized.

Preferred:

```text
Presentation
    ↓
Application
    ↓
Infrastructure Adapter
```

Direct dependencies may be allowed for purely presentation-specific technical services.

Such exceptions should be documented.

---

# Application to Infrastructure

The Application Layer should not directly instantiate infrastructure implementations.

Avoid:

```text
new FileRepository()
```

inside application use cases.

Prefer:

```text
IRepository
```

provided through:

- dependency injection
- composition root
- factory
- service locator where unavoidable

Dependency injection is preferred.

---

# Composition Root

Concrete implementations should be assembled at a defined composition boundary.

Conceptually:

```text
Composition Root
    ↓
Create Infrastructure
    ↓
Bind Interfaces
    ↓
Create Application
    ↓
Create Presentation
```

The composition root is responsible for wiring dependencies.

---

# Dependency Injection

Dependency injection should be preferred when:

- a dependency is replaceable
- testing requires substitution
- multiple implementations exist
- infrastructure must remain decoupled

Avoid dependency injection for trivial values where it adds unnecessary complexity.

---

# Service Locator

Service Locator patterns should generally be avoided.

They hide dependencies.

Prefer explicit dependencies.

If a Service Locator is required by the framework, its use should be isolated.

---

# Global State

Global mutable state should be avoided.

Examples:

```text
Global Mutable Singleton
Global Event Bus
Global Registry
Global Service Locator
```

Global state makes:

- testing harder
- dependencies implicit
- determinism harder
- lifecycle management harder

If global state is required, ownership and lifecycle must be documented.

---

# Static Dependencies

Static utility functions may be used when they are:

- pure
- deterministic
- stateless

Static access to mutable services should generally be avoided.

---

# Event Dependencies

Events introduce indirect dependencies.

Example:

```text
System A
    ↓
Event
    ↓
System B
```

Event dependencies must be documented.

Events should define:

- event owner
- publisher
- subscribers
- lifecycle
- ordering requirements
- failure behaviour

---

# Event Ordering

If event ordering affects domain correctness, the ordering must be explicit.

Avoid relying on:

```text
Accidental Subscription Order
```

or:

```text
Undefined Execution Order
```

Deterministic systems require deterministic event processing.

---

# Event Bus Dependencies

Event buses may be used where appropriate.

However, excessive use can create hidden coupling.

Avoid using an Event Bus to replace ordinary direct dependencies when direct dependencies are clearer.

---

# Circular Dependencies

Circular dependencies are forbidden at the architectural module level.

Avoid:

```text
Module A
    ↓
Module B
    ↓
Module A
```

Circular dependencies make:

- testing harder
- build systems more complex
- ownership unclear
- refactoring difficult

---

# Breaking Circular Dependencies

Possible solutions:

- introduce an abstraction
- extract shared functionality
- invert dependency direction
- introduce a domain service
- introduce an application boundary

Do not solve circular dependencies by creating a generic "Common" module without clear ownership.

---

# Shared Modules

Shared modules should remain small.

A Shared module must not become a dumping ground.

Valid shared content may include:

- primitive abstractions
- common result types
- common identifiers
- low-level immutable types

Avoid placing domain logic into generic shared modules solely to avoid dependency problems.

---

# Common Module Anti-Pattern

Avoid:

```text
Common
    ├── Everything
    ├── Utilities
    ├── Domain Logic
    ├── UI Helpers
    └── Infrastructure Helpers
```

This creates hidden coupling.

Shared modules must have clearly defined ownership.

---

# Third-Party Dependencies

Third-party dependencies must be evaluated before adoption.

Consider:

- license
- maintenance
- security
- performance
- compatibility
- platform support
- dependency size
- transitive dependencies
- replacement cost

---

# Dependency Approval

New external dependencies should answer:

```text
Why is this dependency required?

Can existing functionality solve the problem?

Can a smaller dependency solve the problem?

What is the long-term maintenance cost?

Does it affect determinism?

Does it affect build size?

Does it introduce security risk?
```

---

# Dependency Risk

Dependencies should be classified according to risk.

Example:

```text
Low Risk
Small, stable, well-maintained utility

Medium Risk
Large framework or significant runtime dependency

High Risk
Unmaintained, security-sensitive or mission-critical dependency
```

High-risk dependencies require explicit review.

---

# Dependency Versioning

Dependencies must use controlled versions.

Avoid uncontrolled version ranges where reproducibility is important.

Preferred:

```text
Pinned Version
```

or:

```text
Controlled Version Range
```

depending on the package ecosystem.

---

# Dependency Updates

Dependency updates should be evaluated for:

- breaking changes
- security fixes
- performance impact
- compatibility
- determinism
- license changes

Updates should not be performed blindly.

---

# Transitive Dependencies

Transitive dependencies should be monitored.

A dependency that introduces a large dependency tree should be evaluated carefully.

---

# Dependency Security

Dependencies should be monitored for known vulnerabilities.

Security-sensitive dependencies require special attention.

Critical vulnerabilities should be assessed immediately.

---

# Dependency Licensing

All external dependencies must have compatible licenses.

License information should be recorded where required.

---

# Determinism and Dependencies

Dependencies used by deterministic systems must not introduce uncontrolled non-determinism.

Examples:

- random number generators
- time sources
- asynchronous scheduling
- floating-point behaviour
- platform-specific behaviour

Critical deterministic dependencies require explicit review.

---

# Simulation Dependencies

Simulation code should have a minimal dependency footprint.

Preferred:

```text
Simulation
    ↓
Domain
    ↓
Deterministic Primitives
```

Avoid unnecessary dependencies on:

- UI
- rendering
- filesystem
- network
- real-time clocks

---

# Time Dependencies

Simulation systems must not directly depend on wall-clock time.

Preferred:

```text
Simulation Clock
```

rather than:

```text
System Clock
```

Time should be injected or explicitly provided.

---

# Random Dependencies

Simulation randomness must be explicit.

Preferred:

```text
Random Seed
    ↓
Deterministic RNG
```

Avoid hidden global random generators.

---

# Database Dependencies

The Domain Layer must not depend on database technology.

Database-specific concerns belong to Infrastructure.

Example:

```text
Domain
    ↓
Repository Abstraction

Infrastructure
    ↓
Database Implementation
```

---

# Filesystem Dependencies

Filesystem access belongs to Infrastructure.

Domain logic should not directly access:

- paths
- files
- directories

---

# Network Dependencies

Network access belongs to Infrastructure.

Domain logic should not directly perform:

- HTTP requests
- socket operations
- API calls

---

# Rendering Dependencies

Simulation and Domain logic must not depend on rendering.

Preferred:

```text
Simulation State
    ↓
Presentation Adapter
    ↓
Rendering
```

The renderer observes state.

The renderer should not become the authoritative owner of simulation state.

---

# Asset Dependencies

Assets should be accessed through defined asset boundaries.

Domain logic should not depend directly on:

- texture files
- model files
- shader files
- scene files

Asset identifiers may exist in domain models when appropriate.

The actual asset resolution belongs outside the Domain Layer.

---

# Configuration Dependencies

Configuration should be accessed through abstractions.

Avoid spreading configuration access throughout the codebase.

Preferred:

```text
Configuration
    ↓
Validated Configuration Object
    ↓
Application
```

---

# Environment Dependencies

Code should not directly depend on environment-specific behaviour unless necessary.

Examples:

- operating system
- filesystem layout
- environment variables
- platform-specific APIs

Such dependencies should be isolated.

---

# Testing Dependencies

Production code should not depend on testing frameworks.

Test code may depend on:

- test frameworks
- mocking libraries
- property-based testing tools
- test utilities

---

# Test Doubles

Test doubles should be used at architectural boundaries.

Examples:

```text
Mock

Stub

Fake

Spy
```

Avoid mocking internal implementation details excessively.

---

# Dependency Substitution

Dependencies should be replaceable in tests where appropriate.

Example:

```text
ProductionRepository
```

can be replaced with:

```text
InMemoryRepository
```

without changing domain behaviour.

---

# Dependency Graph

The project should maintain a clear dependency graph.

Conceptually:

```text
Presentation
      ↓
Application
      ↓
Domain
      ↑
Infrastructure
```

Unexpected dependency edges should be investigated.

---

# Dependency Auditing

Dependencies should be reviewed periodically.

Audit areas include:

- forbidden dependencies
- circular dependencies
- external dependency changes
- dependency versions
- unused dependencies
- duplicate dependencies
- transitive dependency growth

---

# Architecture Tests

Where practical, dependency rules should be enforced automatically.

Examples:

```text
Domain cannot import UI

Domain cannot import Infrastructure

Application cannot instantiate Infrastructure

No circular module dependencies
```

Automated architecture tests are preferred over documentation alone.

---

# Dependency Violations

A dependency violation should be classified.

Possible classifications:

```text
Critical
Architectural boundary compromised

High
Significant coupling introduced

Medium
Unnecessary dependency

Low
Minor architectural inconsistency
```

Critical violations should block relevant quality gates.

---

# Exceptions

Exceptions to dependency rules may exist.

An exception must document:

```text
Rule Violated

Reason

Alternative Considered

Impact

Owner

Review Date
```

Temporary exceptions should have an expiration or review date.

---

# Dependency and Technical Debt

Unnecessary dependencies may create technical debt.

Examples:

- tightly coupled modules
- infrastructure leakage
- framework lock-in
- hidden global dependencies
- excessive shared modules

Such debt should be tracked in:

```text
TECHNICAL_DEBT_REGISTER.md
```

---

# Anti-Patterns

Avoid:

- circular dependencies
- dependency on concrete infrastructure
- hidden global services
- excessive shared modules
- direct database access from domain logic
- direct filesystem access from domain logic
- direct network access from domain logic
- UI-driven domain mutation
- uncontrolled third-party dependencies
- untracked dependency updates
- unnecessary framework coupling

---

# Quality Requirements

The dependency architecture must provide:

- clear dependency direction
- protected domain boundaries
- explicit abstractions
- minimal hidden coupling
- controlled external dependencies
- deterministic simulation dependencies
- testable architecture
- automated dependency verification where practical

---

# Adoption Strategy

Dependency governance should be implemented incrementally.

Priority:

1. Protect Domain Layer
2. Remove circular dependencies
3. Isolate Infrastructure
4. Define application abstractions
5. Establish composition root
6. Audit third-party dependencies
7. Automate architecture checks
8. Track exceptions

---

# Migration

When correcting dependency violations:

```text
Identify Violation

↓

Classify Risk

↓

Identify Required Abstraction

↓

Move Interface Ownership

↓

Invert Dependency

↓

Update Composition Root

↓

Add Architecture Test

↓

Remove Old Dependency

↓

Update Documentation
```

---

# Quality Gates

Dependency-related quality gates should verify:

- no new forbidden dependencies
- no circular dependencies
- critical architectural boundaries remain intact
- external dependencies are approved
- dependency versions are controlled
- critical exceptions are documented

---

# Related Documents

- TESTING_STRATEGY.md
- PERFORMANCE_GUIDELINES.md
- RESULT_PATTERN.md
- VALIDATION_STRATEGY.md
- QUALITY_GATES.md
- TECHNICAL_DEBT_POLICY.md
- TECHNICAL_DEBT_REGISTER.md
- AUDIT_PROCESS.md

---

# Summary

Dependencies are architectural decisions.

Project Genesis should prefer:

```text
Explicit
+
Minimal
+
Stable
+
Testable
+
Replaceable
```

dependencies.

The Domain Layer remains the primary protected boundary.

Infrastructure implements technical concerns.

Application coordinates use cases.

Presentation communicates with the application.

The overall dependency direction must remain intentional and enforceable.

The preferred architecture is:

```text
Presentation
      ↓
Application
      ↓
Domain
      ↑
Infrastructure
```

Dependency rules should be enforced through:

```text
Architecture
+
Code Review
+
Automated Tests
+
Audits
```

The goal is not to eliminate dependencies.

The goal is to ensure that every dependency exists for a clear reason and respects the architectural boundaries of Project Genesis.