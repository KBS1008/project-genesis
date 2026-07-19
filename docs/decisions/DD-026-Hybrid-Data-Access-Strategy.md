---
Document-ID: DD-026
Title: Hybrid Data Access Strategy
Type: Architecture Decision Record
Status: Accepted
Version: 1.1.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - ARCH-002 (SAD.md)
  - ARCH-003 (DDD.md)
  - ARCH-004 (technology-stack.md)

Related Decisions:
  - DD-024 – Data-Driven Game Configuration
  - DD-025 – ECS Inspired Simulation Architecture

Affected Components:
  - Backend
  - Database Layer
  - Repository Layer
  - Simulation Engine
  - Market System
  - Production System
  - Finance System

Tags:
  - architecture
  - database
  - prisma
  - kysely
  - repository
  - performance
---

# DD-026 – Hybrid Data Access Strategy

## Status

**Accepted**

---

# Zusammenfassung

Project Genesis verwendet eine **hybride Datenzugriffsstrategie**.

Anstatt ausschließlich ein ORM oder ausschließlich SQL zu verwenden, kombiniert das Projekt die jeweiligen Stärken moderner Werkzeuge.

Die Business-Logik bleibt vollständig von der konkreten Datenzugriffstechnologie entkoppelt.

Alle Datenbankzugriffe erfolgen ausschließlich über eine Repository-Schicht.

---

# Motivation

Project Genesis besitzt zwei grundsätzlich unterschiedliche Arten von Datenzugriffen.

## Geschäftsdaten

Diese ändern sich vergleichsweise selten.

Beispiele:

- Spieler
- Unternehmen
- Gebäude
- Forschung
- Einstellungen
- Konfiguration

Hier stehen Wartbarkeit und Entwicklerproduktivität im Vordergrund.

---

## Simulationsdaten

Diese werden in jedem Simulationstick verarbeitet.

Beispiele:

- Produktion
- Markt
- Energie
- Logistik
- Finanzen
- Statistiken

Hier steht maximale Performance im Vordergrund.

---

# Problem

Ein einzelnes Werkzeug erfüllt beide Anforderungen nur bedingt.

Ein ORM bietet:

- hohe Produktivität
- Typsicherheit
- einfache CRUD-Operationen

Bei sehr großen Batch-Operationen und komplexen Aggregationen entstehen jedoch Performance-Nachteile.

Reines SQL hingegen bietet maximale Performance, erhöht jedoch den Entwicklungsaufwand erheblich.

---

# Entscheidung

Project Genesis kombiniert beide Ansätze.

## Prisma

Prisma wird für klassische Geschäftsprozesse verwendet.

## Kysely

Kysely wird für performancekritische Simulationsprozesse verwendet.

---

# Architektur

```text
                    Application Services

                            │

                            ▼

                 Repository Interfaces

                            │

          ┌─────────────────┴─────────────────┐

          ▼                                   ▼

CompanyRepository                 MarketRepository

          │                                   │

          ▼                                   ▼

       Prisma                            Kysely

          └─────────────────┬─────────────────┘

                            ▼

                      PostgreSQL
```

---

# Repository Layer

Die Repository-Schicht kapselt sämtliche Datenbankzugriffe.

Die Business-Logik kennt weder Prisma noch Kysely.

Repositories implementieren klar definierte Interfaces.

Beispiele:

```text
CompanyRepository

PlayerRepository

BuildingRepository

MarketRepository

ProductionRepository

FinanceRepository

ResearchRepository
```

---

# Verantwortlichkeiten

## Prisma

Verwendung für:

- Authentifizierung
- Benutzerverwaltung
- Unternehmen
- Gebäude
- Forschung
- Konfigurationsdaten
- CRUD-Operationen
- Datenmigrationen

---

## Kysely

Verwendung für:

- Tick-Verarbeitung
- Produktionsberechnungen
- Marktberechnungen
- Energieversorgung
- Transport
- Statistiken
- Aggregationen
- Batch-Updates
- Reporting

---

# Auswahlmatrix

| Aufgabe       | Technologie |
| ------------- | ----------- |
| Benutzer      | Prisma      |
| Login         | Prisma      |
| Unternehmen   | Prisma      |
| Gebäude       | Prisma      |
| Forschung     | Prisma      |
| Konfiguration | Prisma      |
| Migrationen   | Prisma      |
| Tick-System   | Kysely      |
| Produktion    | Kysely      |
| Markt         | Kysely      |
| Energie       | Kysely      |
| Transport     | Kysely      |
| Statistiken   | Kysely      |
| Batch-Updates | Kysely      |
| Reporting     | Kysely      |

---

# Entwicklungsregeln

## Pflichtregeln

Business Services dürfen niemals direkt auf Prisma zugreifen.

Business Services dürfen niemals direkt auf Kysely zugreifen.

Alle Datenbankzugriffe erfolgen ausschließlich über Repositories.

Repositories implementieren Interfaces.

Repositories dürfen keine Spiellogik enthalten.

Repositories dürfen ausschließlich Daten lesen oder schreiben.

---

# Schichtenmodell

```text
Controller

↓

Application Service

↓

Repository Interface

↓

Repository Implementation

↓

Prisma / Kysely

↓

PostgreSQL
```

Jede Schicht besitzt genau eine Verantwortung.

---

# Vorteile

- Hohe Entwicklerproduktivität
- Maximale Performance
- Klare Verantwortlichkeiten
- Gute Testbarkeit
- Austauschbare Implementierungen
- Einfache Erweiterbarkeit

---

# Nachteile

- Zwei Bibliotheken müssen gepflegt werden.
- Repository-Schicht erzeugt zusätzlichen Code.
- Neue Entwickler müssen beide Werkzeuge kennen.

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Nur Prisma

Verworfen.

Grund:

Performancekritische Batch-Prozesse würden unnötig eingeschränkt.

---

## Nur SQL

Verworfen.

Grund:

Zu hoher Entwicklungsaufwand für Standard-CRUD.

---

## Nur Kysely

Verworfen.

Grund:

CRUD-Entwicklung wäre deutlich aufwendiger.

---

# Auswirkungen

Diese Entscheidung beeinflusst:

- Backend-Architektur
- Repository Layer
- Simulation Engine
- Datenbankzugriffe
- Performance
- Teststrategie

---

# Implementierung

Projektstruktur:

```text
src/

database/
│
├── prisma/
│
├── kysely/
│
├── repositories/
│
├── interfaces/
│
└── migrations/
```

Repositories werden nach Domänen organisiert.

Beispiel:

```text
repositories/

CompanyRepository.ts

PlayerRepository.ts

MarketRepository.ts

ProductionRepository.ts

FinanceRepository.ts
```

---

# Hinweise für Cursor AI

Beim Generieren von Code gelten folgende Regeln:

- Niemals Prisma direkt im Controller verwenden.
- Niemals Kysely direkt im Controller verwenden.
- Niemals Prisma direkt in Services verwenden.
- Alle Datenbankzugriffe laufen über Repositories.
- Repositories enthalten keine Business-Logik.
- Simulationen verwenden ausschließlich Repository-Interfaces.
- Datenbankmodelle werden niemals direkt an die API zurückgegeben.
- DTOs trennen Persistenzmodell und API-Modell.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Performance
- Wartbarkeit
- Skalierbarkeit
- Erweiterbarkeit
- Testbarkeit
- Typsicherheit

---

# Risiken

Mögliche Risiken:

- Inkonsistente Verwendung der beiden Datenzugriffstechnologien.
- Umgehung der Repository-Schicht.
- Vermischung von Business-Logik und Datenzugriff.

Diese Risiken werden durch Code Reviews, Architekturregeln und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung                                                                                                   |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-07-03 | Erste Version                                                                                              |
| 1.1.0   | 2026-07-03 | Repository Layer ergänzt, Architekturdiagramme erweitert, Auswahlmatrix und Entwicklungsregeln hinzugefügt |

---

# Leitsatz

> **"Das richtige Werkzeug für die richtige Aufgabe – abstrahiert durch eine saubere Repository-Schicht."**

Project Genesis kombiniert die Produktivität moderner ORMs mit der Performance optimierter SQL-Abfragen. Durch die konsequente Trennung zwischen Business-Logik und Datenzugriff bleibt die Architektur langfristig wartbar, performant und flexibel erweiterbar.
