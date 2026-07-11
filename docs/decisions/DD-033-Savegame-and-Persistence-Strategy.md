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

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Der Snapshot ist die Wahrheit – alles andere ist Ableitung."**

Project Genesis speichert den Spielzustand als vollständige, deterministische Snapshots. Dadurch bleibt die Simulation jederzeit reproduzierbar, stabil und effizient ladbar – selbst bei sehr großen Spielwelten.