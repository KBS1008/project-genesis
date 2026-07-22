---
Document-ID: DD-033
Title: Savegame and Persistence Strategy
Type: Architecture Decision Record
Status: Accepted
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - DD-029 – Modular Monolith Architecture
  - DD-032 – Deterministic Tick Processing
  - DD-027 – Event-Driven Simulation Architecture
  - DD-026 – Hybrid Data Access Strategy

Affected Components:
  - Simulation Engine
  - Persistence Layer
  - Database Layer
  - Savegame System
  - Replay System
  - Backup System

Tags:
  - persistence
  - savegame
  - deterministic
  - simulation
---

# DD-033 – Savegame and Persistence Strategy

## Status

**Accepted**

---

# Zusammenfassung

Project Genesis speichert den Spielzustand vollständig als **deterministisches Snapshot-System**.

Der Spielstand ist kein inkrementelles Log, sondern ein vollständiger Zustand der Welt zu einem bestimmten Tick.

Zusätzlich werden optionale Tick-Logs für Replay und Debugging gespeichert.

---

# Motivation

Eine Wirtschaftssimulation benötigt:

- stabile Speicherstände
- schnelle Ladezeiten
- reproduzierbare Simulationen
- Debugging-Möglichkeiten
- Replay-Funktionalität

Ein reines Event-Sourcing-System wäre zu komplex und zu speicherintensiv.

---



# Problem

Typische Persistenzprobleme:

- inkonsistente Daten nach Abstürzen
- lange Ladezeiten bei großen Spielständen
- schwierige Debug-Reproduktion
- fehlende Replay-Funktion

---



# Entscheidung

Das System verwendet ein **Hybrid-Snapshot-Modell**:

## Primärspeicher: Snapshots

Der Spielzustand wird regelmäßig als vollständiger Snapshot gespeichert.

## Optional: Tick-Logs

Zusätzlich werden die letzten Ticks als Event-Log gespeichert.

---



# Architektur

```text
Simulation Engine
        │
        ▼
Game State (in-memory)
        │
        ▼
Snapshot Manager
        │
        ├──────────────► PostgreSQL (Snapshot)
        │
        └──────────────► Tick Log (optional)
```

---



# Snapshot-System

Ein Snapshot enthält den vollständigen Spielzustand:

- Companies
- Buildings
- Production
- Market
- Finance
- Inventory
- Research
- Energy

---



# Snapshot Zeitpunkt

Snapshots werden erstellt:

- alle N Ticks (z. B. 50 / 100)
- beim manuellen Speichern
- beim Server-Shutdown
- bei Checkpoints

---



# Tick-Log (optional)

Für Debugging und Replay werden Ticks gespeichert:

Beinhaltet:

- Input Events
- System Outputs
- Domain Events
- Random Seeds
- Tick Metadata

---



# Replay-System

Ein Spielstand kann exakt reproduziert werden durch:

```text
Snapshot + Tick Log + Seed
```

Dies ermöglicht:

- Bug Reproduction
- Simulation Testing
- Balance Validation

---



# Speicherformat

Snapshots werden als strukturierte Daten gespeichert:

Option 1:

- JSON (komprimiert)

Option 2 (empfohlen):

- PostgreSQL relational + JSONB Hybrid

---



# Ladeprozess

```text
Load Snapshot

↓

Restore Game State

↓

Replay Tick Logs (optional)

↓

Resume Simulation
```

---



# Konsistenzregeln

Während der Simulation gilt:

- Nur ein Thread verändert den State
- Änderungen erfolgen nur über Systeme
- Events werden erst nach Tick verarbeitet
- Snapshot erfolgt nur nach Tick-Ende

---



# Datenbankstrategie

Verwendet wird:

- PostgreSQL für Snapshots
- optionale JSONB Felder für flexible Strukturen
- Kysely für Performance Queries
- Prisma für CRUD & Management

---



# Speicheroptimierung

Zur Reduktion der Speichergröße:

- Delta-Kompression (zukünftig optional)
- keine redundanten Daten
- IDs statt vollständiger Objekte
- Referenzbasierte Speicherung

---



# Backup-Strategie

Backups werden erzeugt:

- täglich
- vor Updates
- vor großen Migrationen

---



# Fehlerfall-Wiederherstellung

Bei Absturz:

```text
Letzter Snapshot + letzte Ticks
```

→ garantiert konsistenter Zustand

---



# Vorteile

- Sehr schnelle Ladezeiten
- Deterministische Wiederherstellung
- Gute Debugging-Möglichkeiten
- Skalierbar
- Einfach verständlich

---



# Nachteile

- Speicherintensiver als reine Event Stores
- Snapshot-Logik notwendig
- Replay-Logik komplex

Diese Nachteile werden bewusst akzeptiert.

---



# Verworfene Alternativen



## Reines Event Sourcing

Verworfen.

Grund:

Zu komplex und zu speicherintensiv für große Simulationen.

---



## Nur Datenbank-State ohne Snapshots

Verworfen.

Grund:

Langsame Rekonstruktion des Spielzustands.

---



## Client-seitiges Speichern

Verworfen.

Grund:

Manipulationsanfällig und nicht skalierbar.

---



# Implementierung

```text
persistence/

SnapshotManager.ts
GameStateSerializer.ts
TickLogManager.ts
ReplayEngine.ts
RestoreService.ts
```

---



# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Snapshots enthalten immer den vollständigen Zustand.
- Simulation darf niemals direkt aus Logs rekonstruiert werden.
- Events sind nicht persistente Primärquelle.
- Tick-Logs sind optional und nur für Debugging.
- State-Änderungen erfolgen ausschließlich im Simulation Layer.

---



# Qualitätsziele

Diese Entscheidung unterstützt:

- Stabilität
- Performance
- Debugbarkeit
- Skalierbarkeit
- Konsistenz
- Replay-Fähigkeit

---



# Risiken

Mögliche Risiken:

- große Snapshot-Dateien
- hohe Speicheranforderungen
- komplexe Restore-Logik

Diese Risiken werden durch Kompression, Delta-Optimierung und klare Architekturregeln minimiert.

---



# Änderungsprotokoll


| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |


---



# Leitsatz

> **"Der Snapshot ist die Wahrheit – alles andere ist Ableitung."**

Project Genesis speichert den Spielzustand als vollständige, deterministische Snapshots. Dadurch bleibt die Simulation jederzeit reproduzierbar, stabil und effizient ladbar – selbst bei sehr großen Spielwelten.



# DD-033 Amendment – Savegame Snapshot V3

**Status:** Accepted

**Amends:** DD-033 – Savegame Architecture

**Date:** YYYY-MM-DD

**Authors:** Project Genesis Team

**Related ADRs:**

- DD-009 – Event-Driven Architecture

- DD-015 – Content Architecture

- DD-018 – Economy & Market Architecture

- DD-029 – Modular Monolith

- DD-032 – Deterministic Tick Processing

- DD-0XX – Company Brain & Decision Queue Architecture

---

# Context

Milestones M4 through M7 introduced deterministic savegame support for:

- companies

- buildings

- production

- logistics

- research

- finance

- world simulation

- regional infrastructure

The current savegame schema (V2) fully restores deterministic gameplay for all implemented systems.

Milestone M8 introduces autonomous company planning.

New runtime state is therefore created which must survive save/load cycles without compromising deterministic replay.

---

# Problem

The Company Brain introduces additional runtime state.

Examples include:

- active strategy

- generated goals

- company knowledge

- historical memory

- queued decisions

The existing V2 snapshot has no representation for these concepts.

The savegame architecture must therefore evolve while preserving backwards compatibility.

---

# Decision

Milestone M8 introduces **GameSaveSnapshotV3**.

Version 3 extends the existing snapshot.

It does not replace previous savegame versions.

Backward compatibility remains mandatory.

Migration shall occur exclusively through the central serializer.

---

# Savegame Versioning

The version chain becomes:

```text

V1

↓

Migration

↓

V2

↓

Migration

↓

V3

```

Each migration is deterministic.

No migration may modify simulation semantics.

---

# Persisted Company Runtime State

Each company persists:

- Company identifier

- Active strategy

- Active goals

- Knowledge

- Memory

- Decision Queue

Planning state shall be restored exactly as it existed before saving.

---

# Persisted Market State

Each regional market persists:

- current prices

- supply

- demand

- liquidity indicators

- historical statistics

- regional metrics

The saved state represents the authoritative economic state.

---

# Persisted Simulation State

Simulation continues to persist:

- simulation clock

- current tick

- event sequencing metadata

- world state

- region state

- logistics state

- production state

- research state

- finance state

Existing behaviour remains unchanged.

---

# Transient Runtime State

The following shall never be serialized:

- temporary planning caches

- heuristic evaluation scores

- temporary search trees

- intermediate calculations

- profiling information

- debugging information

- dependency injection state

These values are regenerated after loading.

---

# Repository Responsibilities

Repositories remain responsible for authoritative runtime state.

The serializer is responsible only for:

- serialization

- deserialization

- migration

Repositories remain independent of serialization logic.

---

# Migration

Migration follows the established architecture.

Only the serializer performs migrations.

Migration sequence:

```text

Load Save

↓

Detect Version

↓

Apply Required Migrations

↓

Validate

↓

Hydrate Repositories

↓

Resume Simulation

```

No repository performs migrations.

---

# Deterministic Restore

Loading a savegame shall reproduce the identical simulation state.

Given identical input:

```text

Save

↓

Load

↓

Continue Simulation

```

must produce the same future simulation as:

```text

Continue Without Saving

```

This property is mandatory.

---

# Validation

Loading performs validation before hydration.

Validation includes:

- identifier consistency

- reference integrity

- regional consistency

- market consistency

- content compatibility

- schema compatibility

Invalid savegames shall fail before modifying runtime state.

---

# Backward Compatibility

Existing savegames remain supported.

Migration path:

V1

↓

V2

↓

V3

Direct loading into V3 is not required.

Sequential migration remains the single supported approach.

---

# Testing Requirements

Savegame support requires:

- serialization tests

- deserialization tests

- migration tests

- replay tests

- determinism tests

- regression tests

Every future snapshot version shall provide migration tests from the previous version.

---

# Future Snapshot Versions

Future milestones may introduce:

V4

Population

V5

Politics

V6

Government

Each version shall extend the previous schema.

Existing migration architecture remains unchanged.

---

# Consequences

## Positive

- Deterministic savegames preserved.

- AI planning survives save/load.

- Repository ownership remains unchanged.

- Existing serializer architecture reused.

- Future migration path remains simple.

## Negative

- Larger savegames.

- Additional migration maintenance.

- More serialization tests required.

---

# Alternatives Considered

## Serialize Entire Company Brain Object Graph

Rejected.

Would persist implementation details instead of authoritative state.

---

## Recompute AI State After Loading

Rejected.

Would break deterministic replay.

---

## Independent AI Save Files

Rejected.

Would duplicate persistence architecture.

---

## Versionless Savegames

Rejected.

Would make deterministic migrations impossible.

---

# Implementation Notes

Implementation shall extend:

- GameSaveSnapshotV2

- GameStateSerializer

- Migration Pipeline

with

GameSaveSnapshotV3.

All migrations remain centralized.

No repository shall become aware of savegame versions.

The savegame architecture remains deterministic, versioned, and fully backward compatible.