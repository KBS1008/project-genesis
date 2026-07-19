# Logging Strategy

**Project:** Project Genesis

**Document:** Logging Strategy

**Version:** 1.0

**Status:** Active

**Last Updated:** 2026-07-18

---

# Purpose

This document defines the logging strategy for Project Genesis.

The logging system provides structured observability for:

- application lifecycle
- simulation execution
- domain events
- infrastructure operations
- errors
- performance
- debugging
- diagnostics

Logging must help developers understand what happened without exposing unnecessary implementation details or generating excessive noise.

---

# Logging Philosophy

Project Genesis follows these principles:

1. Logs must be meaningful.
2. Logs must be structured.
3. Logs must provide context.
4. Logs must use appropriate severity levels.
5. Logs must not replace proper error handling.
6. Logs must not replace domain events.
7. Logs must not expose sensitive information.
8. Logging must have minimal impact on simulation performance.
9. Logging must support deterministic debugging.
10. Production logging must be configurable.

---

# Logging Responsibilities

Logging is responsible for recording operational information.

Logging is not responsible for:

- controlling application flow
- replacing error handling
- storing persistent game state
- communicating gameplay events to the UI
- replacing domain events
- acting as an analytics database

---

# Log Levels

Project Genesis uses the following levels.

## TRACE

Extremely detailed diagnostic information.

Use for:

- internal algorithm execution
- detailed simulation steps
- low-level diagnostics

TRACE logging should normally be disabled.

---

## DEBUG

Detailed information useful during development.

Examples:

- system initialization
- state transitions
- resource calculations
- decision-making

DEBUG logging should be configurable.

---

## INFO

Normal application and system events.

Examples:

- application started
- simulation started
- savegame loaded
- major subsystem initialized

INFO should describe meaningful operational events.

---

## WARN

Unexpected conditions that do not prevent operation.

Examples:

- fallback activated
- missing optional asset
- deprecated configuration
- recoverable data issue

Warnings should not be used for normal control flow.

---

## ERROR

An operation failed.

Examples:

- save failed
- asset loading failed
- infrastructure operation failed
- unrecoverable subsystem operation

ERROR logs should include enough context to diagnose the issue.

---

## FATAL

The application cannot continue safely.

Examples:

- unrecoverable initialization failure
- corrupted critical state
- catastrophic infrastructure failure

FATAL events should normally trigger controlled shutdown or recovery.

---

# Log Level Guidelines

| Level | Purpose                 | Production       |
| ----- | ----------------------- | ---------------- |
| TRACE | Deep diagnostics        | Usually disabled |
| DEBUG | Development diagnostics | Configurable     |
| INFO  | Normal operations       | Enabled          |
| WARN  | Recoverable problems    | Enabled          |
| ERROR | Failed operations       | Enabled          |
| FATAL | Critical failure        | Always enabled   |

---

# Structured Logging

Logs should use structured data.

Preferred format:

```text
timestamp
level
category
message
context
metadata
```

Example:

```json
{
  "timestamp": "2026-07-18T12:00:00Z",
  "level": "ERROR",
  "category": "SaveSystem",
  "message": "Failed to save game state",
  "context": {
    "saveId": "save-001",
    "worldId": "world-001"
  }
}
```

The exact serialization format may vary by environment.

---

# Log Categories

Recommended categories include:

- Application
- Simulation
- Domain
- Economy
- Production
- Logistics
- Research
- NPC
- SaveSystem
- AssetSystem
- UI
- Infrastructure
- Performance
- Security

Categories should remain stable over time.

---

# Context

Every meaningful log should include sufficient context.

Depending on the system, context may include:

- subsystem
- entity ID
- aggregate ID
- world ID
- simulation tick
- event ID
- command ID
- request ID
- savegame ID

Context should be added where it improves diagnostics.

---

# Correlation

Related operations should use a shared correlation identifier where applicable.

Example:

```text
Command
    ↓
Domain Event
    ↓
Simulation Update
    ↓
Persistence
```

A correlation ID allows developers to trace the complete operation.

---

# Simulation Logging

The simulation is performance-sensitive.

Logging must therefore be used carefully.

The following should generally not be logged at INFO level for every tick:

- every entity update
- every resource calculation
- every movement step
- every internal state transition

High-frequency simulation logging should use:

- TRACE
- DEBUG
- sampling
- aggregation

---

# Simulation Tick Context

Diagnostic logs related to simulation should include:

```text
simulationId
tick
timestamp
system
entityId
```

Where relevant.

Example:

```json
{
  "level": "DEBUG",
  "category": "Simulation",
  "message": "Production cycle completed",
  "context": {
    "simulationId": "sim-001",
    "tick": 1204,
    "entityId": "factory-042"
  }
}
```

---

# Domain Events vs Logs

Domain events and logs serve different purposes.

## Domain Event

Represents a meaningful event in the domain.

Example:

```text
ProductionCompleted
```

Domain events may affect:

- other systems
- persistence
- gameplay
- UI

---

## Log

Records information for diagnostics.

Example:

```text
ProductionCompleted event dispatched
```

A domain event must not be replaced by a log entry.

---

# Error Logging

Errors should follow:

```text
ERROR_HANDLING_STRATEGY.md
```

Errors should be logged at the appropriate boundary.

Avoid logging the same error repeatedly at multiple layers.

Preferred pattern:

```text
Low-Level Failure
        ↓
Error Propagation
        ↓
Context Added
        ↓
Final Error Logging
```

---

# Error Log Requirements

An ERROR log should contain:

- error code
- message
- subsystem
- relevant entity or operation
- correlation ID where applicable
- recoverability information where useful

Avoid logging:

- passwords
- authentication tokens
- secrets
- personal data
- unnecessary sensitive information

---

# Duplicate Logging

The same failure should not be logged repeatedly at every layer.

Bad:

```text
Repository: ERROR
Service: ERROR
Controller: ERROR
Application: ERROR
```

Preferred:

```text
Repository
    ↓
Error propagated
    ↓
Application boundary
    ↓
ERROR logged once with context
```

---

# Performance Logging

Performance measurements should be available for:

- simulation tick duration
- system execution time
- save duration
- load duration
- asset loading
- expensive operations

Performance logging should support:

- profiling
- regression detection
- performance audits

High-frequency measurements should use sampling or aggregation.

---

# Startup Logging

Application startup should log:

- application version
- environment
- configuration profile
- enabled systems
- initialization status

Sensitive configuration values must not be logged.

---

# Shutdown Logging

The application should log:

- shutdown initiated
- shutdown reason where known
- save status
- subsystem shutdown status

Unexpected termination should be distinguishable from normal shutdown.

---

# Savegame Logging

Save operations should log:

- save initiated
- save completed
- save failed
- save format version
- save duration

Savegame content itself should not be logged in full.

---

# Asset Logging

Asset systems should log:

- asset loading failures
- missing required assets
- fallback assets
- asset version mismatches

Optional missing assets may produce WARN.

Required missing assets should produce ERROR or FATAL depending on impact.

---

# Configuration

Logging must be configurable.

Configuration should support:

- minimum log level
- category filtering
- development mode
- production mode
- file output
- console output
- diagnostic mode

---

# Development Logging

Development environments may enable:

```text
DEBUG
TRACE
```

to support development and debugging.

---

# Production Logging

Production environments should prioritize:

```text
INFO
WARN
ERROR
FATAL
```

DEBUG and TRACE should remain available when diagnostic investigation is required.

---

# Log Storage

Logs should support:

- local file output
- console output
- optional structured export

Log retention should be configurable.

Logs must not be treated as permanent application state.

---

# Log Rotation

Log files should support rotation based on:

- file size
- time
- application version

Old logs should be archived or deleted according to retention policy.

---

# Deterministic Debugging

Because Project Genesis contains deterministic simulation systems, logs should support reproducible debugging.

Where relevant, diagnostic logs should include:

```text
simulation seed
simulation tick
world state identifier
event identifier
entity identifier
```

The logging system itself must not alter simulation results.

---

# Logging and Determinism

Logging must not introduce non-deterministic behaviour into the simulation.

Logging must not:

- modify simulation state
- change execution order
- introduce random values
- alter timing-sensitive simulation logic

Performance impact should be minimized.

---

# Security

Logs must never expose:

- passwords
- secrets
- API keys
- authentication tokens
- private credentials

Sensitive data must be sanitized before logging.

---

# Logging and Privacy

Only necessary information should be logged.

Avoid unnecessary personal or identifying information.

Where personal data is unavoidable, logging must follow applicable privacy requirements.

---

# Logging Failures

Failure of the logging system must not normally crash the application.

If logging infrastructure is unavailable:

- application operation should continue where safe
- errors should be handled gracefully
- fallback logging may be used

Critical diagnostic failures may be reported through an emergency fallback mechanism.

---

# Testing

Logging behaviour should be tested where it is critical.

Tests may verify:

- correct log level
- required context
- error code presence
- sensitive data filtering
- correlation IDs
- performance impact

Logging tests should not depend unnecessarily on exact message wording.

---

# Quality Requirements

The logging system must:

- use structured data
- support log levels
- support contextual metadata
- avoid sensitive information
- support configurable output
- minimize simulation overhead
- support deterministic debugging

---

# Anti-Patterns

Avoid:

- `console.log()` in production code
- logging sensitive information
- logging every simulation tick at INFO
- logging the same error repeatedly
- using logs as state storage
- using logs instead of domain events
- vague messages such as "Something went wrong"
- logging without relevant context

---

# Logging Review

Logging should be reviewed:

- during architecture reviews
- during audits
- during major feature development
- before major releases

---

# Related Documents

- ERROR_HANDLING_STRATEGY.md
- QUALITY_GATES.md
- AUDIT_PROCESS.md
- QUALITY_METRICS.md
- TECHNICAL_DEBT_POLICY.md
- RELEASE_STRATEGY.md

---

# Summary

Logging provides observability for Project Genesis.

The logging strategy ensures that important operational events, errors and performance characteristics can be understood without compromising:

- simulation determinism
- performance
- security
- maintainability

Logs are diagnostic tools.

They are not a replacement for error handling, domain events, persistence or application state.
