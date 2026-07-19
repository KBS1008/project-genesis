---
Document-ID: ARCH-001
Title: Architecture Overview
Type: Software Architecture
Status: Approved
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - SAD.md
  - DDD.md

Related Decisions:
  - DD-001
  - DD-021
  - DD-022
  - DD-024
  - DD-025

Tags:
  - architecture
  - overview
  - simulation
  - backend
---

# Architecture Overview

> Dieses Dokument beschreibt die Gesamtarchitektur von **Project Genesis** und dient als Einstiegspunkt für alle Entwickler.

---

# Vision

Project Genesis ist eine moderne, serverseitige Wirtschaftssimulation mit deterministischer Simulationsengine.

Das Spiel soll:

- langfristig erweiterbar sein
- vollständig datengetrieben arbeiten
- eine performante Multiplayer-Simulation ermöglichen
- einfach wartbar bleiben
- Modding und zukünftige Erweiterungen unterstützen

Die Architektur folgt konsequent dem Grundsatz:

> **"Game Logic over Presentation."**

Die Spiellogik existiert ausschließlich auf dem Server.

---

# Architekturprinzipien

Die Architektur basiert auf folgenden Grundprinzipien:

- Data-Driven Design
- Separation of Concerns
- Deterministic Simulation
- Composition over Inheritance
- Event-Driven Communication
- Configuration over Code
- Single Source of Truth
- Server Authoritative Simulation

---

# Systemübersicht

```text
                        Client (Browser)

                               │

                               ▼

                      REST API / WebSocket

                               │

                               ▼

                    Application Services

        ┌─────────────────────────────────────┐
        │                                     │
        │   Authentication                    │
        │   Company Service                   │
        │   Player Service                    │
        │   Market Service                    │
        │   Research Service                  │
        │                                     │
        └─────────────────────────────────────┘

                               │

                               ▼

                     Simulation Engine

        ┌─────────────────────────────────────┐
        │                                     │
        │ Production System                   │
        │ Energy System                       │
        │ Transport System                    │
        │ Market System                       │
        │ Finance System                      │
        │ Research System                     │
        │ Maintenance System                  │
        │ Statistics System                   │
        │                                     │
        └─────────────────────────────────────┘

                               │

                               ▼

                      Persistence Layer

                PostgreSQL / Redis / Object Storage
```

---

# Schichtenmodell

## 1. Presentation Layer

Verantwortlich für:

- Browser-Frontend
- Benutzeroberfläche
- Visualisierung
- Eingaben

Enthält keine Spiellogik.

---

## 2. API Layer

Kommunikation zwischen Client und Server.

Technologien:

- REST API
- WebSocket

Aufgaben:

- Authentifizierung
- Validierung
- Anfragen entgegennehmen
- Antworten senden

---

## 3. Application Layer

Koordiniert Geschäftsprozesse.

Beispiele:

- Unternehmen gründen
- Gebäude bauen
- Forschung starten
- Handel durchführen

Enthält keine eigentliche Simulation.

---

## 4. Simulation Layer

Das Herzstück des Spiels.

Hier befinden sich alle Simulationssysteme.

Jedes System besitzt genau eine Verantwortlichkeit.

---

## 5. Persistence Layer

Speichert dauerhaft:

- Spieler
- Unternehmen
- Gebäude
- Lager
- Markt
- Forschung
- Spielstände

---

# Simulation Engine

Die Simulationsengine arbeitet tickbasiert.

```text
Simulation Tick

↓

Production

↓

Transport

↓

Energy

↓

Finance

↓

Market

↓

Research

↓

Statistics
```

Alle Berechnungen erfolgen serverseitig.

---

# ECS-inspirierte Architektur

Die Simulation orientiert sich an einem Entity-Component-System.

```text
Entities

↓

Components

↓

Systems

↓

Events

↓

Updated World State
```

Entities enthalten ausschließlich Daten.

Alle Spiellogik befindet sich in den Systems.

---

# Datenfluss

```text
Player Action

↓

REST API

↓

Application Service

↓

Command

↓

Simulation

↓

Database

↓

WebSocket Event

↓

Browser Update
```

---

# Datenmodell

Das Spiel verwendet eine klar getrennte Datenstruktur.

```text
Player

└── Company

        ├── Buildings

        ├── Employees

        ├── Inventory

        ├── Finance

        ├── Production

        ├── Research

        └── Statistics
```

---

# Datengetriebene Inhalte

Alle Spielinhalte werden aus Konfigurationsdateien geladen.

Beispiele:

- Ressourcen
- Gebäude
- Rezepte
- Technologien
- Produktionsketten
- Marktparameter

Die Spielmechanik kennt ausschließlich diese Daten.

---

# Kommunikation

Client → Server

- REST API

Server → Client

- WebSocket

Simulationen werden niemals im Browser berechnet.

---

# Performance

Die Architektur unterstützt:

- Tick-basierte Berechnung
- Event-Verarbeitung
- Caching
- Parallelisierung
- Horizontale Skalierung

---

# Sicherheit

Der Server ist jederzeit die einzige autoritative Instanz.

Clients dürfen niemals:

- Produktionsmengen berechnen
- Marktpreise ändern
- Lager manipulieren
- Forschung abschließen

Alle Änderungen werden serverseitig validiert.

---

# Dokumentationsstruktur

```text
docs/

├── architecture/
├── decisions/
├── game-design/
├── schemas/
├── api/
├── simulation/
├── development/
└── glossary.md
```

---

# Wichtige Dokumente

| Dokument     | Zweck                     |
| ------------ | ------------------------- |
| README.md    | Projekteinstieg           |
| vision.md    | Spielvision               |
| SAD.md       | Softwarearchitektur       |
| DDD.md       | Datenmodell               |
| decisions/   | Architekturentscheidungen |
| game-design/ | Spielmechaniken           |
| schemas/     | Datenmodelle              |
| api/         | Schnittstellen            |
| simulation/  | Simulationslogik          |

---

# Architektur-Roadmap

## Phase 1

- Kernsimulation
- Ressourcen
- Produktion
- Markt
- Forschung
- Energie
- Mitarbeitende
- Transport

---

## Phase 2

- NPC-Unternehmen
- Regionen
- Verträge
- Event-System
- Wetter
- Modding

---

## Phase 3

- Börse
- Internationale Märkte
- Holding-Strukturen
- KI-Konkurrenz
- Weltwirtschaft

---

# Qualitätsziele

Die Architektur verfolgt folgende Qualitätsmerkmale:

- Wartbarkeit
- Erweiterbarkeit
- Skalierbarkeit
- Testbarkeit
- Performance
- Sicherheit
- Nachvollziehbarkeit

Jede Architecture Decision soll mindestens eines dieser Ziele unterstützen.

---

# Leitsatz

> **"Eine gute Architektur macht komplexe Systeme verständlich, erweiterbar und langfristig wartbar."**

Project Genesis basiert auf einer klaren Schichtenarchitektur, einer deterministischen Simulationsengine und einer konsequent datengetriebenen Entwicklung. Alle Komponenten folgen dem Prinzip der losen Kopplung und können unabhängig voneinander erweitert werden.
