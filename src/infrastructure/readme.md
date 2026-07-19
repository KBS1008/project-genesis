# Infrastructure Module

The `infrastructure` module contains the technical implementations required by Project Genesis.

It provides concrete implementations of interfaces defined by the Domain and Application layers.

The Infrastructure Module contains **technical concerns only**.

Business rules must never be implemented here.

---

# Purpose

The Infrastructure Layer isolates external systems and technical frameworks from the core application.

It allows the domain model to remain independent of implementation details such as file systems, logging, persistence or dependency injection.

---

# Responsibilities

The Infrastructure Layer is responsible for:

- File system access
- Persistence
- Serialization
- Logging
- Configuration loading
- Dependency Injection container
- Content storage
- External integrations
- Technical adapters

---

# Guiding Principles

Infrastructure should always be:

- replaceable
- testable
- implementation-focused
- isolated from business rules
- framework-independent where practical

---

# Planned Structure

```text
infrastructure/

config/
di/
filesystem/
logging/
persistence/
serialization/
content/
events/
```

The exact structure may evolve during implementation.

---

# Persistence

Infrastructure provides implementations for repository interfaces.

Example:

```text
Domain

CompanyRepository (interface)

↓

Infrastructure

FileCompanyRepository
```

The Domain defines contracts.

Infrastructure implements them.

---

# Dependency Injection

The Dependency Injection container is configured here.

Responsibilities:

- register services
- resolve dependencies
- compose the application

Business logic must never be part of container configuration.

---

# Logging

Logging is a technical concern.

Typical log categories:

- startup
- content loading
- simulation
- persistence
- diagnostics
- errors

Logs should never influence simulation behavior.

---

# Configuration

Configuration is loaded during application startup.

Possible sources:

- configuration files
- environment variables
- command line arguments

Configuration should be validated before use.

---

# Serialization

Infrastructure handles serialization for:

- save games
- exports
- diagnostics
- snapshots

The Domain Layer should not know how objects are serialized.

---

# File System

Typical responsibilities:

- reading content files
- writing save games
- loading mods
- exporting reports

File system access must remain isolated from business logic.

---

# External Integrations

Future integrations may include:

- editors
- analytics
- telemetry
- cloud storage
- dedicated servers

These integrations should communicate through interfaces whenever possible.

---

# Dependency Rules

The Infrastructure Layer may depend on:

- Common
- Domain
- Application

It must never become the source of business decisions.

Infrastructure implements abstractions; it should not define them.

---

# Error Handling

Infrastructure may throw technical exceptions internally.

Before crossing architectural boundaries, technical failures should be translated into explicit application-level results where appropriate.

Business errors must never originate from Infrastructure.

---

# Testing

Recommended tests:

- repository implementations
- file access
- serialization
- configuration loading
- dependency injection
- logging

External systems should be mocked where practical.

---

# Future Extensions

Potential future additions:

- SQLite persistence
- PostgreSQL persistence
- cloud save support
- remote content repositories
- editor integration
- profiling tools

The architecture should allow these additions without modifying the Domain Layer.

---

# Related Documentation

- docs/architecture/SAD.md
- docs/architecture/component-diagram.md
- docs/architecture/deployment-view.md
- docs/architecture/technology-stack.md
- docs/decisions/DD-029-dependency-injection.md
- docs/decisions/DD-036-package-manager-strategy.md

---

# Summary

The Infrastructure Module contains the technical implementations that support Project Genesis.

It enables persistence, configuration, logging, dependency injection and other platform-specific capabilities while keeping the Domain Layer clean, deterministic and independent of implementation details.
