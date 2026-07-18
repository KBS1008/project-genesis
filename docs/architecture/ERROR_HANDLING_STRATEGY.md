# Error Handling Strategy

**Project:** Project Genesis  
**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-07-15

---

# Purpose

This document defines the official error handling strategy for Project Genesis.

The objective is to ensure that all errors are:

- predictable
- typed
- traceable
- recoverable where appropriate
- consistently logged
- easy to diagnose
- easy to test

The strategy applies to all application layers.

---

# Design Principles

Project Genesis follows these principles:

- Fail Fast
- Explicit Errors
- No Silent Failures
- Recover Whenever Possible
- Domain Before Infrastructure
- Human Readable Messages
- Machine Readable Error Codes

Errors are considered part of the domain model.

---

# Error Categories

Errors are divided into clearly defined categories.

```text
ApplicationError
│
├── DomainError
├── ValidationError
├── InfrastructureError
├── PersistenceError
├── ConfigurationError
├── NetworkError
├── ExternalServiceError
└── UnexpectedError
```

Each category has different handling rules.

---

# Layer Responsibilities

## Domain Layer

Responsible for:

- business rule violations
- invalid state transitions
- invariant violations

The Domain Layer must never know infrastructure details.

---

## Application Layer

Responsible for:

- orchestration failures
- workflow failures
- command execution failures

---

## Infrastructure Layer

Responsible for:

- file access
- persistence
- networking
- serialization
- external APIs

---

## UI Layer

Responsible for:

- displaying errors
- user notifications
- retry actions

The UI must never contain business logic.

---

# Error Base Class

Every custom error shall inherit from:

```text
ProjectGenesisError
```

Properties:

- errorCode
- category
- message
- cause
- timestamp
- context
- severity

---

# Error Codes

Every error receives a unique identifier.

Format:

```text
AAA-0001
```

Examples:

```text
DOM-0001

DOM-0002

VAL-0001

APP-0003

INF-0005

NET-0002

CFG-0004
```

Codes must never be reused.

---

# Domain Errors

Examples:

```text
InsufficientMoneyError

InsufficientResourcesError

InventoryOverflowError

BuildingAlreadyExistsError

BuildingCapacityExceededError

TechnologyNotUnlockedError

RecipeNotAvailableError

InvalidTransportRouteError

ProductionAlreadyRunningError

ResearchAlreadyCompletedError
```

Domain errors represent expected gameplay situations.

They are not application failures.

---

# Validation Errors

Examples:

```text
InvalidBuildingIdError

InvalidAssetIdError

InvalidConfigurationError

InvalidRecipeError

InvalidRegistryEntryError

InvalidGameStateError

InvalidCoordinateError
```

Validation errors indicate invalid input.

---

# Infrastructure Errors

Examples:

```text
SavegameLoadError

SavegameWriteError

RegistryLoadError

RegistryValidationError

AssetNotFoundError

PersistenceFailureError

FilesystemUnavailableError
```

Infrastructure errors should contain technical context.

---

# Network Errors

Examples:

```text
ConnectionTimeoutError

WebSocketDisconnectedError

RemoteServiceUnavailableError

ApiRequestFailedError
```

Network errors should support retry strategies.

---

# Unexpected Errors

Unexpected errors indicate programming mistakes.

Examples:

```text
NullReference

InvalidCast

AssertionFailure

UnexpectedState
```

Unexpected errors should terminate the current operation and be logged with maximum severity.

---

# Error Severity

Every error has a severity.

| Level | Description |
|--------|-------------|
| Debug | Development only |
| Info | Informational |
| Warning | Recoverable |
| Error | Operation failed |
| Critical | System stability affected |

Severity determines logging behavior.

---

# Result Pattern

Business operations should prefer explicit results over exceptions.

Preferred pattern:

```text
Result<T, ProjectGenesisError>
```

or

```text
Either<ProjectGenesisError, T>
```

Exceptions should only be used for truly exceptional situations.

---

# Exception Usage

Avoid:

```typescript
throw new Error("Something failed")
```

Preferred:

```typescript
throw new BuildingCapacityExceededError(...)
```

All thrown errors must be typed.

---

# Logging

Errors should never be written directly using:

```typescript
console.log()

console.error()
```

Use the centralized logging service.

Supported levels:

```text
Debug

Info

Warning

Error

Critical
```

---

# Context Information

Every logged error should include:

- Error Code
- Message
- Timestamp
- User (if available)
- Session
- Building ID
- Company ID
- Recipe ID
- Simulation Tick
- Stack Trace (development only)

Context greatly improves debugging.

---

# Recovery Strategies

Every recoverable error should define a recovery strategy.

Possible actions:

```text
Retry

Fallback

Abort

Ignore

Compensate

Ask User
```

The strategy depends on the error category.

---

# Retry Policy

Retry is appropriate for:

- network failures
- temporary file locks
- external services

Retry is inappropriate for:

- domain errors
- validation errors
- programming errors

---

# User Messages

Technical messages must never be shown directly to players.

Instead:

```text
Technical Error

↓

Translation Layer

↓

Localized User Message
```

This allows user-friendly and localized error reporting.

---

# Testing

Every custom error must have dedicated unit tests.

Tests should verify:

- error code
- category
- message
- serialization
- inheritance
- recovery behavior

---

# Metrics

The application should record:

- error frequency
- error categories
- recovery success rate
- retry count
- recurring failures

These metrics support long-term quality improvements.

---

# AI Compatibility

AI-generated code must:

- use typed errors
- assign valid error codes
- follow category rules
- never introduce generic Error objects

AI prompts should reference this document whenever error handling is implemented.

---

# Integration

This strategy integrates with:

- LOGGING_STRATEGY.md
- VALIDATION_STRATEGY.md
- RESULT_PATTERN.md
- CURSOR_IMPLEMENTATION_GUIDE.md
- AI_WORKFLOW.md

---

# Future Improvements

Future versions may include:

- automatic error registry
- localized error catalog
- telemetry integration
- crash reporting
- analytics dashboards
- automated retry framework

---

# Summary

Project Genesis uses a strongly typed, layered and recoverable error handling strategy.

By separating domain, validation, infrastructure and application errors, assigning stable error codes and enforcing structured logging, the project achieves high maintainability, improved debugging and reliable AI-assisted development.