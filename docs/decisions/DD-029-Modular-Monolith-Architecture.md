---
Document-ID: DD-029
Title: Modular Monolith Architecture
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
  - DD-025 – ECS Inspired Simulation Architecture
  - DD-026 – Hybrid Data Access Strategy
  - DD-027 – Event-Driven Simulation Architecture
  - DD-028 – CQRS Lite

Affected Components:
  - Backend
  - Application Layer
  - Simulation Engine
  - Repository Layer

Tags:
  - architecture
  - modular-monolith
  - backend
  - scalability
---

# DD-029 – Modular Monolith Architecture

## Status

**Accepted**

---

# Zusammenfassung

Project Genesis wird als **Modular Monolith** entwickelt.

Alle Module laufen in einer gemeinsamen Anwendung und einem gemeinsamen Prozess, sind jedoch logisch voneinander getrennt.

Die Module kommunizieren ausschließlich über definierte Schnittstellen und Domain Events.

---

# Motivation

Ein Browser-Wirtschaftsspiel besteht aus vielen fachlichen Bereichen:

- Unternehmen
- Produktion
- Forschung
- Energie
- Markt
- Transport
- Finanzen
- Mitarbeitende
- Benutzerverwaltung

Diese Bereiche sollen unabhängig entwickelt und getestet werden können, ohne die Komplexität einer Microservice-Architektur einzuführen.

---

# Problem

Ein klassischer Monolith führt häufig zu:

- hoher Kopplung
- unklaren Verantwortlichkeiten
- schwer wartbarem Code
- langen Build-Zeiten
- schlechter Testbarkeit

Microservices lösen diese Probleme zwar teilweise, bringen jedoch neue Herausforderungen mit sich:

- Netzwerkkommunikation
- Service Discovery
- verteilte Transaktionen
- komplexes Deployment
- höherer Betriebsaufwand

Für Version 1 sind diese Nachteile nicht gerechtfertigt.

---

# Entscheidung

Project Genesis wird als Modular Monolith umgesetzt.

Jedes Modul besitzt:

- eigene Controller
- eigene Services
- eigene Repositories
- eigene DTOs
- eigene Domain Events
- eigene Tests

Alle Module laufen innerhalb einer gemeinsamen NestJS-Anwendung.

---

# Architektur

```text
Backend

│

├── Auth Module
├── Player Module
├── Company Module
├── Building Module
├── Production Module
├── Inventory Module
├── Finance Module
├── Market Module
├── Research Module
├── Employee Module
├── Transport Module
├── Energy Module
├── Statistics Module
└── Simulation Module
```

---

# Kommunikationsregeln

Module kommunizieren niemals direkt über interne Klassen.

Erlaubt sind ausschließlich:

- öffentliche Service-Interfaces
- Repository-Interfaces
- Domain Events

Nicht erlaubt:

- Direkte Importe interner Klassen anderer Module
- Gemeinsame mutable Zustände

---

# Modulstruktur

Jedes Modul folgt derselben Struktur.

```text
module-name/

controllers/

services/

repositories/

entities/

dto/

events/

commands/

queries/

interfaces/

tests/
```

Diese Struktur gilt für alle Module.

---

# Verantwortlichkeiten

## Auth

- Anmeldung
- Registrierung
- JWT
- Benutzerrechte

---

## Player

- Spielerprofil
- Einstellungen
- Erfolge

---

## Company

- Unternehmen
- Unternehmensstatus
- Unternehmensentwicklung

---

## Building

- Gebäude
- Ausbau
- Kapazitäten

---

## Production

- Produktion
- Produktionsaufträge
- Rezepte

---

## Inventory

- Lager
- Materialbewegungen
- Reservierungen

---

## Finance

- Buchungen
- Kontostände
- Bilanz
- Kredite

---

## Market

- Angebot
- Nachfrage
- Preisbildung
- Handelsaufträge

---

## Research

- Technologien
- Forschung
- Freischaltungen

---

## Employee

- Mitarbeitende
- Qualifikationen
- Produktivität

---

## Energy

- Energieproduktion
- Energieverbrauch
- Netzlast

---

## Transport

- Logistik
- Materialfluss
- Transportkapazitäten

---

## Statistics

- Kennzahlen
- Reports
- Dashboards

---

## Simulation

- Tick-Steuerung
- Event Bus
- Scheduling

---

# Abhängigkeiten

Die Abhängigkeiten verlaufen ausschließlich in eine Richtung.

```text
Controller

↓

Application Service

↓

Repository

↓

Persistence
```

Seitliche Abhängigkeiten zwischen Modulen sind zu vermeiden.

---

# Vorteile

- Einfache Entwicklung
- Hohe Performance
- Kein Netzwerk-Overhead
- Gemeinsame Datenbank
- Einfache Debugging-Möglichkeiten
- Klare Modulgrenzen
- Gute Testbarkeit

---

# Nachteile

- Gemeinsames Deployment
- Gemeinsamer Prozess
- Gemeinsame Datenbank

Diese Nachteile werden für Version 1 bewusst akzeptiert.

---

# Skalierungsstrategie

Die Architektur ermöglicht eine spätere Aufteilung in Microservices.

Module können schrittweise ausgelagert werden, beispielsweise:

Version 2:

- Market Service
- Simulation Service

Version 3:

- Finance Service
- Statistics Service

Version 4:

- Separate Game Worlds

Durch die klare Modultrennung bleibt dieser Übergang mit geringem Aufwand möglich.

---

# Implementierung

Projektstruktur:

```text
apps/

backend/

src/

modules/

auth/

player/

company/

building/

production/

inventory/

finance/

market/

research/

employee/

energy/

transport/

statistics/

simulation/
```

---

# Regeln für Cursor AI

Beim Generieren von Code gelten folgende Regeln:

- Neue Features werden immer einem Modul zugeordnet.
- Module dürfen keine internen Klassen anderer Module importieren.
- Gemeinsame Typen werden ausschließlich über `packages/shared` bereitgestellt.
- Jedes Modul besitzt eigene Tests.
- Jedes Modul besitzt eigene DTOs.
- Jedes Modul besitzt eigene Commands und Queries.
- Kommunikation erfolgt ausschließlich über öffentliche Schnittstellen oder Domain Events.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Wartbarkeit
- Erweiterbarkeit
- Testbarkeit
- Performance
- Skalierbarkeit
- Klare Verantwortlichkeiten

---

# Risiken

Mögliche Risiken:

- Verletzung der Modulgrenzen
- Zyklische Abhängigkeiten
- Übermäßige Nutzung gemeinsamer Hilfsklassen

Diese Risiken werden durch Architekturregeln, Code Reviews und automatisierte Abhängigkeitsanalysen minimiert.

---

# Verworfene Alternativen

## Klassischer Monolith

Verworfen.

Grund:

Zu hohe Kopplung und mangelnde Struktur.

---

## Microservices

Verworfen.

Grund:

Zu hoher Entwicklungs- und Betriebsaufwand für Version 1.

---

## Self-Contained Systems

Verworfen.

Grund:

Für den aktuellen Projektumfang nicht erforderlich.

---

# Änderungsprotokoll

| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Ein gut strukturierter Monolith ist einem schlecht geschnittenen Microservice-System überlegen."**

Project Genesis setzt auf einen Modular Monolith. Diese Architektur verbindet die Einfachheit eines Monolithen mit den klaren Verantwortlichkeiten modularer Systeme. Sie ermöglicht eine schnelle Entwicklung, hohe Performance und eine spätere Migration zu Microservices, falls dies aufgrund wachsender Anforderungen notwendig werden sollte.
