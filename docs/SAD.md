---
Document-ID: ARCH-002
Title: Software Architecture Document (SAD)
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
  - architecture-overview.md
  - DDD.md
  - vision.md

Related Decisions:
  - DD-001
  - DD-018
  - DD-020
  - DD-021
  - DD-022
  - DD-023
  - DD-024
  - DD-025

Tags:
  - architecture
  - backend
  - frontend
  - simulation
---

# Software Architecture Document (SAD)

> Dieses Dokument beschreibt die vollständige Softwarearchitektur von **Project Genesis**.

---

# Inhaltsverzeichnis

1. Einleitung
2. Architekturziele
3. Qualitätsziele
4. Randbedingungen
5. Lösungsstrategie
6. Systemkontext
7. Bausteinsicht
8. Laufzeitsicht
9. Verteilungssicht
10. Datenarchitektur
11. Sicherheitskonzept
12. Fehlerbehandlung
13. Performance
14. Skalierung
15. Teststrategie
16. Deployment
17. Technologiestack
18. Architekturentscheidungen
19. Risiken
20. Glossar

---

# 1. Einleitung

Project Genesis ist eine browserbasierte Unternehmens- und Wirtschaftssimulation.

Die gesamte Spiellogik läuft serverseitig.

Der Browser dient ausschließlich als Benutzeroberfläche.

---

# 2. Architekturziele

Die Architektur verfolgt folgende Ziele:

- Hohe Wartbarkeit
- Gute Erweiterbarkeit
- Skalierbarkeit
- Performante Simulation
- Deterministische Spielberechnung
- Datengetriebenes Balancing
- Einfache Testbarkeit
- Multiplayer-Unterstützung

---

# 3. Qualitätsziele

| Ziel                   | Priorität |
| ---------------------- | --------- |
| Wartbarkeit            | Sehr hoch |
| Erweiterbarkeit        | Sehr hoch |
| Performance            | Hoch      |
| Skalierbarkeit         | Hoch      |
| Testbarkeit            | Hoch      |
| Sicherheit             | Hoch      |
| Benutzerfreundlichkeit | Mittel    |

---

# 4. Randbedingungen

Projektvorgaben:

- Browsergame
- Multiplayer
- Server Authoritative
- Tick-basierte Simulation
- Data-Driven Design
- ECS-inspirierte Architektur
- Eventbasierte Kommunikation
- PostgreSQL als Primärdatenbank

---

# 5. Lösungsstrategie

Project Genesis basiert auf folgenden Architekturprinzipien:

## Data Driven Design

Spielinhalte befinden sich ausschließlich in Konfigurationsdateien.

---

## Separation of Concerns

Jede Komponente besitzt genau eine Verantwortung.

---

## Composition over Inheritance

Funktionalität wird über Komponenten kombiniert.

---

## Deterministic Simulation

Gleiche Eingaben erzeugen stets identische Ergebnisse.

---

## Server Authoritative

Der Server entscheidet über den Spielzustand.

---

# 6. Systemkontext

```text
Spieler

↓

Browser

↓

REST API / WebSocket

↓

Application Layer

↓

Simulation Engine

↓

Persistence Layer

↓

PostgreSQL
```

---

# 7. Bausteinsicht

## Frontend

Verantwortlich für:

- UI
- Visualisierung
- Eingaben
- Darstellung

---

## API Layer

- REST
- WebSocket
- Authentifizierung
- Validierung

---

## Application Layer

- Company Service
- Player Service
- Market Service
- Research Service
- Finance Service

---

## Simulation Engine

Bestehend aus:

- Production System
- Energy System
- Finance System
- Market System
- Research System
- Transport System
- Maintenance System
- Statistics System

---

## Persistence Layer

- PostgreSQL
- Redis
- Dateispeicher

---

# 8. Laufzeitsicht

Jeder Simulationstick folgt derselben Reihenfolge.

```text
Tick

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

↓

Persistenz

↓

WebSocket Updates
```

---

# 9. Verteilungssicht

```text
Browser

↓

Load Balancer

↓

Application Server

↓

Simulation Server

↓

PostgreSQL

↓

Redis
```

---

# 10. Datenarchitektur

Zentrale Entitäten:

- Player
- Company
- Building
- Employee
- Inventory
- Finance
- Production
- Research
- Market
- Statistics

Die vollständige Beschreibung befindet sich im DDD.

---

# 11. Sicherheitskonzept

Grundregeln:

- Server ist autoritativ.
- Keine Spiellogik im Browser.
- JWT-Authentifizierung.
- Rollenbasierte Berechtigungen.
- Validierung aller Eingaben.
- Schutz vor Manipulation.

---

# 12. Fehlerbehandlung

Alle Systeme liefern standardisierte Fehlerobjekte.

Fehler werden:

- protokolliert
- kategorisiert
- überwacht

Simulationen dürfen niemals aufgrund einzelner Fehler abbrechen.

---

# 13. Performance

Optimierungsziele:

- Tick-Verarbeitung unter 100 ms
- Batch-Verarbeitung
- Redis-Caching
- Datenbank-Indizes
- Lazy Loading
- Asynchrone Hintergrundprozesse

---

# 14. Skalierung

Horizontale Skalierung durch:

- mehrere API-Server
- mehrere Simulation-Worker
- Redis
- PostgreSQL-Replikation

---

# 15. Teststrategie

Testarten:

- Unit Tests
- Integrationstests
- Simulationstests
- Lasttests
- End-to-End-Tests

Jedes Simulationssystem wird unabhängig getestet.

---

# 16. Deployment

Umgebungen:

- Local Development
- Test
- Staging
- Production

Containerisierung erfolgt über Docker.

CI/CD wird später ergänzt.

---

# 17. Technologiestack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- NestJS
- TypeScript

## Datenbanken

- PostgreSQL
- Redis

## Infrastruktur

- Docker
- Docker Compose

Geplante Erweiterungen:

- Kubernetes
- Prometheus
- Grafana

---

# 18. Architekturentscheidungen

Die Architektur basiert auf den dokumentierten ADRs.

Besonders relevant:

- DD-001 Simulation
- DD-018 Markt
- DD-020 Mitarbeitende
- DD-021 Gebäude
- DD-022 Logistik
- DD-023 Unternehmensentwicklung
- DD-024 Data Driven Design
- DD-025 ECS-Inspired Architecture

---

# 19. Risiken

Bekannte Risiken:

- Komplexes Balancing
- Große Datenmengen
- Tick-Performance
- Multiplayer-Synchronisation

Gegenmaßnahmen:

- Profiling
- Lasttests
- Monitoring
- Modularisierung

---

# 20. Glossar

| Begriff       | Bedeutung                            |
| ------------- | ------------------------------------ |
| Tick          | Simulationszyklus                    |
| Company       | Unternehmen eines Spielers           |
| Building      | Gebäude                              |
| Recipe        | Produktionsrezept                    |
| Inventory     | Lagerbestand                         |
| Company Score | Kennzahl für Unternehmensentwicklung |
| ADR           | Architecture Decision Record         |

---

# Änderungsprotokoll

| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |

---

# Fazit

Die Architektur von Project Genesis verfolgt konsequent eine modulare, datengetriebene und serverautoritative Struktur.

Durch die Kombination aus:

- Tick-basierter Simulation
- ECS-inspirierter Architektur
- Event-Driven Design
- Data-Driven Configuration
- klar dokumentierten ADRs

entsteht eine Softwarearchitektur, die langfristig wartbar, skalierbar und leicht erweiterbar ist.

Das SAD bildet den technischen Referenzpunkt für alle zukünftigen Entwicklungen des Projekts.
