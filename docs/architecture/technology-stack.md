---
Document-ID: ARCH-004
Title: Technology Stack
Type: Architecture Document
Status: Approved
Version: 1.1.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - architecture-overview.md
  - SAD.md
  - DDD.md

Related Decisions:
  - DD-024 – Data-Driven Game Configuration
  - DD-025 – ECS Inspired Simulation Architecture
  - DD-026 – Hybrid Data Access Strategy

Tags:
  - architecture
  - technology
  - backend
  - frontend
---

# Technology Stack

> Dieses Dokument beschreibt den vollständigen Technologie-Stack von **Project Genesis** sowie die Gründe für die Auswahl der einzelnen Technologien.

---

# Architekturziele

Der Technologie-Stack soll:

- vollständig in TypeScript entwickelt werden
- langfristig wartbar sein
- hohe Performance bieten
- horizontale Skalierung ermöglichen
- eine hervorragende Developer Experience bieten
- Open-Source-Technologien verwenden
- moderne DevOps-Prozesse unterstützen

---

# Gesamtübersicht

```text
Browser

↓

Next.js (React)

↓

REST API + WebSocket

↓

NestJS

↓

Simulation Engine

↓

Repository Layer

        │

 ┌──────┴─────────┐

 ▼                ▼

Prisma         Kysely

 └──────┬─────────┘

        ▼

 PostgreSQL

        │

        ▼

 Redis

        │

        ▼

 Docker
```

---

# Frontend

## Next.js

Verwendung:

- Browser-Frontend
- Routing
- Rendering
- Client-Anwendung

Vorteile:

- React-Standard
- TypeScript
- hohe Performance
- große Community
- App Router
- gute Skalierbarkeit

---

## React

Komponentenbasierte Benutzeroberfläche.

---

## TypeScript

Projektweite Programmiersprache.

Gründe:

- Typsicherheit
- bessere Wartbarkeit
- bessere IDE-Unterstützung
- weniger Laufzeitfehler

---

## Tailwind CSS

Styling.

Vorteile:

- schnelle Entwicklung
- konsistentes UI
- wartbare Komponenten

---

## Zustand

Clientseitiges State Management.

Verwendung:

- UI-State
- Benutzeroberfläche
- lokale Einstellungen

---

## TanStack Query

Server-State.

Verwendung:

- REST Requests
- Caching
- Synchronisierung
- Retry
- Background Refresh

---

# Backend

## NestJS

Das Backend wird vollständig mit NestJS entwickelt.

Verantwortlich für:

- REST API
- WebSocket
- Authentifizierung
- Business Logic
- Simulation Controller

Vorteile:

- modulare Architektur
- Dependency Injection
- ausgezeichnete Testbarkeit
- TypeScript First
- große Community

---

# Simulation

Die Simulationsengine ist ein eigenständiger Bestandteil des Backends.

Eigenschaften:

- Tick-basiert
- deterministisch
- ECS-inspiriert
- datengetrieben
- serverautoritativ

---

# Datenzugriff

Project Genesis verwendet eine **hybride Datenzugriffsstrategie**.

Siehe:

**DD-026 – Hybrid Data Access Strategy**

---

## Prisma

Prisma wird verwendet für:

- Benutzer
- Authentifizierung
- Unternehmen
- Gebäude
- Forschung
- Konfigurationsdaten
- Migrationen
- Standard-CRUD

Vorteile:

- Typsicherheit
- hohe Entwicklerproduktivität
- automatische Migrationen

---

## Kysely

Kysely wird verwendet für:

- Tick-Verarbeitung
- Produktionssystem
- Marktberechnungen
- Energie
- Finanzaggregation
- Statistiken
- komplexe SQL-Abfragen
- Batch-Operationen

Gründe:

- maximale SQL-Performance
- vollständige Kontrolle über Abfragen
- sehr gute TypeScript-Unterstützung

---

## Repository Layer

Alle Datenbankzugriffe erfolgen ausschließlich über Repositories.

```text
Application Service

↓

Repository

↓

Prisma / Kysely

↓

PostgreSQL
```

Dadurch kennt die Business-Logik niemals direkt Prisma oder Kysely.

---

# Datenbank

## PostgreSQL

Primäre Datenbank.

Speichert:

- Spieler
- Unternehmen
- Gebäude
- Ressourcen
- Produktion
- Forschung
- Finanzen
- Markt
- Statistiken

Gründe:

- ACID
- Transaktionen
- JSON-Unterstützung
- hervorragende Performance
- sehr gute Skalierbarkeit

---

## Redis

Redis dient ausschließlich als In-Memory-Datenspeicher.

Verwendung:

- Sessions
- Cache
- Tick-Daten
- Warteschlangen
- WebSocket Scaling

Redis ist **keine** persistente Datenbank.

---

# Kommunikation

## REST API

Verwendung:

- Login
- Stammdaten
- Konfiguration
- Verwaltung

---

## WebSocket

Verwendung:

- Live-Updates
- Produktionsfortschritt
- Marktänderungen
- Benachrichtigungen
- Unternehmensereignisse

---

# Authentifizierung

## JWT

JSON Web Tokens.

Verwendung:

- Login
- Benutzeridentifikation
- API-Zugriffe

---

# Validierung

- class-validator
- class-transformer

Alle API-Eingaben werden serverseitig validiert.

---

# Testing

## Vitest

Unit Tests.

---

## Supertest

REST API Tests.

---

## Playwright

End-to-End-Tests.

---

# Logging

Geplant:

- Pino
- strukturierte Logs
- Request IDs
- Performance-Metriken

---

# Monitoring (Version 2)

Geplant:

- Prometheus
- Grafana

---

# Containerisierung

## Docker

Alle Anwendungen laufen in Docker-Containern.

---

## Docker Compose

Lokale Entwicklungsumgebung.

---

# CI/CD

Geplant:

- GitHub Actions
- automatische Tests
- automatische Builds
- Docker Images
- Deployment

---

# Entwicklungswerkzeuge

- Cursor AI
- Visual Studio Code
- ESLint
- Prettier
- Husky
- lint-staged
- Markdownlint

---

# Projektstruktur

```text
apps/
│
├── frontend/
├── backend/
│
packages/
│
├── shared/
├── ui/
├── config/
│
docs/
│
docker/
│
scripts/
```

---

# Verworfene Alternativen

## Angular

Verworfen.

Grund:

Zu komplex für die geplante Architektur.

---

## Vue

Verworfen.

Grund:

React besitzt im TypeScript-Ökosystem die größere Verbreitung.

---

## Express

Verworfen.

Grund:

NestJS bietet bessere Strukturierung und Skalierbarkeit.

---

## MongoDB

Verworfen.

Grund:

Die Wirtschaftssimulation basiert auf stark relationalen Daten.

---

## MySQL

Verworfen.

Grund:

PostgreSQL bietet leistungsfähigere Funktionen für komplexe Abfragen und Transaktionen.

---

## Reines Prisma

Verworfen.

Grund:

Batch-Operationen der Simulationsengine profitieren von optimierten SQL-Abfragen.

---

# Roadmap

## Version 1

- Next.js
- NestJS
- PostgreSQL
- Redis
- Prisma
- Kysely
- Docker

---

## Version 2

Zusätzlich:

- Prometheus
- Grafana
- Object Storage
- Message Queue

---

## Version 3

Zusätzlich:

- Kubernetes
- Horizontal Scaling
- CDN
- Multi-Region Deployment

---

# Qualitätsziele

Der Technologie-Stack unterstützt:

- Performance
- Wartbarkeit
- Erweiterbarkeit
- Testbarkeit
- Skalierbarkeit
- Typsicherheit

---

# Änderungsprotokoll

| Version | Datum      | Änderung                                                                                   |
| ------- | ---------- | ------------------------------------------------------------------------------------------ |
| 1.0.0   | 2026-07-03 | Initiale Version                                                                           |
| 1.1.0   | 2026-07-03 | Einführung der hybriden Datenzugriffsstrategie (Prisma + Kysely), Repository Layer ergänzt |

---

# Leitsatz

> **"Jede Technologie wird aufgrund ihrer Stärken eingesetzt – nicht, weil sie gerade im Trend ist."**

Project Genesis setzt auf einen durchgängigen TypeScript-Stack, eine serverautoritative Architektur und eine hybride Datenzugriffsschicht. Dadurch werden Entwicklerproduktivität, Performance und langfristige Wartbarkeit optimal miteinander kombiniert.
