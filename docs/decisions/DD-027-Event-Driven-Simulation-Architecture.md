---
Document-ID: DD-027
Title: Event-Driven Simulation Architecture
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

Related Decisions:
  - DD-021 – Unified Building Capacity Model
  - DD-022 – Abstract Logistics Network
  - DD-025 – ECS Inspired Simulation Architecture
  - DD-026 – Hybrid Data Access Strategy

Affected Components:
  - Simulation Engine
  - Event Bus
  - Production System
  - Market System
  - Energy System
  - Finance System
  - Research System
  - Transport System
  - Statistics System

Tags:
  - architecture
  - simulation
  - events
  - domain-events
---

# DD-027 – Event-Driven Simulation Architecture

## Status

**Accepted**

---

# Zusammenfassung

Die Simulationsengine verwendet ein internes **Event-Driven Architecture Pattern**.

Systeme kommunizieren ausschließlich über Domain Events.

Direkte Aufrufe zwischen Simulationssystemen sind grundsätzlich nicht erlaubt.

Dadurch entstehen lose gekoppelte, leicht testbare und einfach erweiterbare Systeme.

---

# Motivation

Eine Wirtschaftssimulation besteht aus vielen voneinander abhängigen Prozessen.

Beispiel:

Produktion erzeugt Ressourcen.

↓

Lagerbestand ändert sich.

↓

Markt erhält neues Angebot.

↓

Preis verändert sich.

↓

Unternehmensgewinn steigt.

↓

Statistik wird aktualisiert.

Bei direkten Methodenaufrufen würden alle Systeme voneinander abhängig werden.

---

# Problem

Direkte Kommunikation führt zu:

- hoher Kopplung
- schwer testbarem Code
- schlechter Erweiterbarkeit
- komplexen Abhängigkeiten

Je mehr Spielmechaniken entstehen, desto schwieriger wird die Wartung.

---

# Entscheidung

Alle Simulationssysteme veröffentlichen Domain Events.

Andere Systeme abonnieren ausschließlich die Events, die sie interessieren.

Direkte Aufrufe zwischen Simulationssystemen sind nicht erlaubt.

---

# Architektur

```text
                Production System

                        │

                        ▼

             ProductionCompleted

                        │

                Event Bus

        ┌────────────┼─────────────┐

        ▼            ▼             ▼

 Inventory      Market       Statistics

        ▼            ▼             ▼

 Inventory     PriceUpdate   CompanyScore
```

---

# Event Bus

Der Event Bus arbeitet ausschließlich innerhalb eines Simulationsticks.

Eigenschaften:

- In-Memory
- synchron
- deterministisch
- keine Persistenz
- keine externe Queue

Nach Abschluss eines Ticks wird die Event Queue geleert.

---

# Event Flow

```text
Tick Start

↓

Production

↓

Event erzeugen

↓

Event Bus

↓

Listener

↓

Neue Events

↓

Queue leer?

↓

Ja

↓

Nächstes System
```

---

# Eventtypen

## Produktionsereignisse

- ProductionStarted
- ProductionCompleted
- ProductionCancelled

---

## Lagerereignisse

- InventoryAdded
- InventoryRemoved
- InventoryReserved
- InventoryReleased

---

## Markt

- OfferCreated
- OfferExpired
- TradeExecuted
- PriceChanged

---

## Energie

- EnergyProduced
- EnergyConsumed
- PowerFailure

---

## Forschung

- ResearchStarted
- ResearchCompleted
- TechnologyUnlocked

---

## Personal

- EmployeeAssigned
- EmployeeReleased
- ProductivityChanged

---

## Gebäude

- BuildingConstructed
- BuildingUpgraded
- BuildingDestroyed

---

## Finanzen

- TransactionBooked
- CompanyBankrupt
- LoanGranted

---

## Unternehmen

- CompanyCreated
- CompanyExpanded
- CompanyMilestoneReached

---

# Regeln

Events beschreiben ausschließlich bereits eingetretene Ereignisse.

Beispiele:

✔ ProductionCompleted

✔ BuildingConstructed

✔ TradeExecuted

Nicht erlaubt:

✘ ProduceResources

✘ BuyItem

✘ UpgradeBuilding

Diese stellen Befehle (Commands) dar und keine Ereignisse.

---

# Event Naming

Events werden im Past Tense benannt.

Beispiele:

- ProductionCompleted
- BuildingFinished
- ResearchUnlocked
- TradeExecuted

---

# Prioritäten

Innerhalb eines Ticks besitzen Events dieselbe Priorität.

Die Reihenfolge ergibt sich ausschließlich aus der Reihenfolge ihrer Erzeugung.

Dadurch bleibt die Simulation deterministisch.

---

# Fehlerbehandlung

Fehler in einem Event Listener dürfen:

- andere Listener nicht beeinflussen
- den Tick nicht abbrechen
- keine Events verlieren

Fehler werden protokolliert und dem Monitoring gemeldet.

---

# Vorteile

- Lose Kopplung
- Gute Testbarkeit
- Einfache Erweiterbarkeit
- Hohe Wartbarkeit
- Gute Nachvollziehbarkeit
- Deterministische Simulation

---

# Nachteile

- Mehr Klassen
- Höherer Initialaufwand
- Ereignisfluss muss dokumentiert werden

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Direkte Methodenaufrufe

Verworfen.

Grund:

Zu hohe Kopplung.

---

## Globaler Service Locator

Verworfen.

Grund:

Versteckte Abhängigkeiten.

---

## Externer Message Broker

Verworfen.

Grund:

Zu komplex für die interne Simulation.

Kafka, RabbitMQ oder Redis Streams werden ausschließlich für zukünftige externe Integrationen betrachtet.

---

# Implementierung

Projektstruktur:

```text
src/

simulation/

events/
│
├── EventBus.ts
├── DomainEvent.ts
├── EventDispatcher.ts
├── EventQueue.ts
│
├── production/
├── market/
├── finance/
├── energy/
├── research/
└── transport/
```

---

# Hinweise für Cursor AI

Beim Generieren neuer Simulationssysteme gelten folgende Regeln:

- Systeme kommunizieren niemals direkt.
- Änderungen werden als Domain Events veröffentlicht.
- Systeme abonnieren ausschließlich benötigte Events.
- Events enthalten keine Business-Logik.
- Events sind immutable.
- Listener besitzen genau eine Verantwortung.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Lose Kopplung
- Erweiterbarkeit
- Testbarkeit
- Determinismus
- Wartbarkeit
- Skalierbarkeit

---

# Risiken

Mögliche Risiken:

- Zu viele Eventtypen
- Event-Ketten werden unübersichtlich
- Endlosschleifen durch gegenseitige Events

Diese Risiken werden durch klare Namenskonventionen, Dokumentation und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Systeme kennen sich nicht – sie reagieren auf Ereignisse."**

Project Genesis verwendet eine interne Event-Driven Simulation Architecture, um die Simulationssysteme lose zu koppeln. Domain Events bilden die Kommunikationsbasis zwischen Produktion, Markt, Energie, Forschung, Transport und Finanzen. Dadurch bleibt die Simulationsengine deterministisch, modular und langfristig erweiterbar.
