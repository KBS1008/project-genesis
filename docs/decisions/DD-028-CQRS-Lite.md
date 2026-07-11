---
Document-ID: DD-028
Title: CQRS Lite
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
  - ARCH-001 (architecture-overview.md)
  - ARCH-002 (SAD.md)
  - ARCH-003 (DDD.md)
  - ARCH-004 (technology-stack.md)

Related Decisions:
  - DD-024 – Data-Driven Game Configuration
  - DD-025 – ECS Inspired Simulation Architecture
  - DD-026 – Hybrid Data Access Strategy
  - DD-027 – Event-Driven Simulation Architecture

Affected Components:
  - API Layer
  - Application Services
  - Repository Layer
  - Simulation Engine

Tags:
  - architecture
  - cqrs
  - commands
  - queries
  - backend
---

# DD-028 – CQRS Lite

## Status

**Accepted**

---

# Zusammenfassung

Project Genesis verwendet eine vereinfachte Form des **Command Query Responsibility Separation (CQRS)**.

Schreibzugriffe (Commands) und Lesezugriffe (Queries) werden logisch voneinander getrennt.

Es werden **keine getrennten Datenbanken**, **kein Event Sourcing** und **keine separate Read Database** verwendet.

---

# Motivation

In einer Wirtschaftssimulation unterscheiden sich schreibende und lesende Vorgänge erheblich.

Beispiele:

Schreibzugriffe:

- Gebäude bauen
- Forschung starten
- Produktion beginnen
- Angebot einstellen

Lesende Zugriffe:

- Firmenübersicht
- Lagerbestand
- Marktpreise
- Finanzberichte
- Statistiken

Eine Trennung verbessert Übersichtlichkeit, Testbarkeit und Erweiterbarkeit.

---

# Problem

Werden beide Arten von Operationen in denselben Services kombiniert, entstehen:

- große Service-Klassen
- unklare Verantwortlichkeiten
- schwierige Tests
- hohe Kopplung

---

# Entscheidung

Alle API-Anfragen werden entweder als **Command** oder als **Query** behandelt.

Ein Objekt darf niemals gleichzeitig Daten verändern und Daten zurückgeben.

---

# Architektur

```text
REST API

        │

        ▼

Command Handler

        │

        ▼

Application Service

        │

        ▼

Repository

        │

        ▼

PostgreSQL
```

```text
REST API

        │

        ▼

Query Handler

        │

        ▼

Read Repository

        │

        ▼

PostgreSQL
```

---

# Commands

Commands verändern den Spielzustand.

Beispiele:

- BuildBuildingCommand
- UpgradeBuildingCommand
- StartProductionCommand
- CancelProductionCommand
- BuyResourceCommand
- SellResourceCommand
- HireEmployeeCommand
- StartResearchCommand

Commands besitzen keinen Rückgabewert außer einer Erfolgs- oder Fehlermeldung.

---

# Queries

Queries verändern niemals Daten.

Beispiele:

- GetCompanyOverviewQuery
- GetInventoryQuery
- GetFinanceReportQuery
- GetResearchStatusQuery
- GetMarketPricesQuery
- GetStatisticsQuery

Queries dürfen beliebig optimiert werden.

---

# Trennung

```text
Controller

        │

 ┌──────┴──────┐

 ▼             ▼

Commands     Queries

 ▼             ▼

Services     Read Models

 ▼             ▼

Repositories
```

---

# Repository Layer

Repositories kapseln sämtliche Datenbankzugriffe.

Commands und Queries verwenden unterschiedliche Repository-Methoden.

Beispiel:

```text
CompanyRepository

create()

update()

delete()

findById()

findOverview()

findStatistics()
```

---

# Read Models

Read Models dürfen speziell für die Darstellung optimiert werden.

Beispiele:

- CompanyOverview
- DashboardData
- MarketOverview
- FinanceSummary
- ResearchOverview

Sie müssen nicht identisch mit den Datenbanktabellen sein.

---

# Vorteile

- Klare Verantwortlichkeiten
- Kleine Services
- Bessere Testbarkeit
- Höhere Lesbarkeit
- Optimierte Abfragen
- Gute Erweiterbarkeit

---

# Nachteile

- Mehr Klassen
- Zusätzliche Handler
- Etwas mehr Boilerplate

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Klassische CRUD-Services

Verworfen.

Grund:

Zu viele Verantwortlichkeiten in einer Klasse.

---

## Vollständiges CQRS

Verworfen.

Grund:

Zu komplex für Version 1.

Nicht verwendet werden:

- Event Sourcing
- Separate Read Database
- Messaging Infrastructure

Diese Optionen bleiben für spätere Versionen offen.

---

# Implementierung

Projektstruktur:

```text
src/

application/

commands/
│
├── company/
├── production/
├── market/
├── research/
└── finance/

queries/
│
├── company/
├── market/
├── inventory/
├── finance/
└── statistics/
```

---

# Beispiel

## Command

```text
POST /companies/{id}/buildings

↓

BuildBuildingCommand

↓

CompanyService

↓

Repository

↓

Database

↓

BuildingConstructed Event
```

---

## Query

```text
GET /companies/{id}/dashboard

↓

GetCompanyDashboardQuery

↓

Read Repository

↓

DTO

↓

JSON Response
```

---

# Hinweise für Cursor AI

Beim Generieren neuer Features gelten folgende Regeln:

- Jede schreibende Operation ist ein Command.
- Jede lesende Operation ist eine Query.
- Commands verändern Daten.
- Queries verändern niemals Daten.
- Commands veröffentlichen Domain Events.
- Queries veröffentlichen niemals Events.
- Commands dürfen keine komplexen Read Models erzeugen.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Wartbarkeit
- Erweiterbarkeit
- Testbarkeit
- Performance
- Lesbarkeit

---

# Risiken

Mögliche Risiken:

- Zu viele kleine Klassen
- Inkonsistente Benennung
- Vermischung von Commands und Queries

Diese Risiken werden durch Namenskonventionen und Code Reviews minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Befehle verändern die Welt – Abfragen beobachten sie."**

Project Genesis trennt konsequent zwischen schreibenden und lesenden Operationen. Durch CQRS Lite bleiben Application Services klein, klar strukturiert und leicht testbar, ohne die Komplexität eines vollständigen CQRS- oder Event-Sourcing-Ansatzes einzuführen.