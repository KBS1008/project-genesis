---
Document-ID: DD-000
Title: Architecture Decision Index
Type: Architecture Decision Record
Status: Living Document
Version: 3.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Related Documents:
  - architecture/SAD.md
  - architecture/DDD.md
  - architecture/architecture-overview.md

Purpose:
  Central index of all Architecture Decision Records (ADRs).
---

# DD-000 – Architecture Decision Index

## Zweck

Dieses Dokument dient als zentrales Verzeichnis aller Architecture Decision Records (ADRs) von **Project Genesis**.

Die ADRs dokumentieren alle langfristigen Architekturentscheidungen und bilden gemeinsam mit dem SAD und dem DDD die verbindliche technische Grundlage des Projekts.

---

# Kategorien

| Kürzel | Beschreibung |
|---------|--------------|
| 🏛 | Core Architecture |
| 🎮 | Gameplay |
| 📦 | Data Model |
| ⚙ | Runtime / Simulation |
| 💾 | Persistence |
| 🚀 | Infrastructure |

---

# Architekturentscheidungen

| ID | Kategorie | Titel | Status | Core |
|----|-----------|-------|--------|------|
| DD-000 | 🏛 | Architecture Decision Index | Living | ⭐ |
| DD-001 | 🎮 | Resource Graph | Accepted | |
| DD-002 | 🎮 | Production Chain Architecture | Accepted | |
| DD-003 | 🏛 | Global Identifiers | Accepted | ⭐ |
| DD-004 | 📦 | Common Schema | Accepted | ⭐ |
| DD-005 | 🎮 | Production Network | Accepted | |
| DD-006 | ⚙ | Economic Simulation | Accepted | ⭐ |
| DD-007 | 🏛 | Region-Ready Architecture | Accepted | |
| DD-008 | 🏛 | No Magic Numbers | Accepted | ⭐ |
| DD-009 | ⚙ | Deterministic Simulation | Accepted | ⭐ |
| DD-010 | 🏛 | Documentation First | Accepted | ⭐ |
| DD-011 | 🎮 | *(reserved)* | Planned | |
| DD-012 | 🎮 | *(reserved)* | Planned | |
| DD-013 | 🎮 | *(reserved)* | Planned | |
| DD-014 | 🎮 | *(reserved)* | Planned | |
| DD-015 | 🎮 | *(reserved)* | Planned | |
| DD-016 | 🎮 | *(reserved)* | Planned | |
| DD-017 | 🎮 | *(reserved)* | Planned | |
| DD-018 | 🎮 | Recipe System Architecture | Accepted | |
| DD-019 | 🎮 | Employee Simulation Model | Accepted | |
| DD-020 | 🎮 | Energy as a Resource | Accepted | |
| DD-021 | ⚙ | Unified Building Capacity Model | Accepted | ⭐ |
| DD-022 | ⚙ | Logistics Network Architecture | Accepted | |
| DD-023 | 🎮 | Company Progression System | Accepted | |
| DD-024 | 🏛 | Data-Driven Game Configuration | Accepted | ⭐ |
| DD-025 | 💾 | Content Validation Pipeline | Accepted | |
| DD-026 | 🚀 | Hybrid Data Access Strategy | Accepted | ⭐ |
| DD-027 | ⚙ | Event-Driven Simulation Architecture | Accepted | ⭐ |
| DD-028 | ⚙ | CQRS Lite | Accepted | ⭐ |
| DD-029 | 🚀 | Dependency Injection Strategy | Accepted | |
| DD-030 | 🏛 | Configuration-Driven Game Content | Accepted | ⭐ |
| DD-031 | 🏛 | Game Content Organization | Accepted | ⭐ |
| DD-032 | ⚙ | Deterministic Tick Processing | Accepted | ⭐ |
| DD-033 | 💾 | Savegame and Persistence Strategy | Accepted | ⭐ |
| DD-034 | 🚀 | Configuration Management | Accepted | |
| DD-035 | 🚀 | Error Handling Strategy | Accepted | |

---

# Core Architecture Decisions

Die folgenden ADRs bilden die unveränderlichen Grundprinzipien der Architektur und dienen als Referenz für alle weiteren Entscheidungen:

- DD-003 – Global Identifiers
- DD-004 – Common Schema
- DD-006 – Economic Simulation
- DD-008 – No Magic Numbers
- DD-009 – Deterministic Simulation
- DD-010 – Documentation First
- DD-021 – Unified Building Capacity Model
- DD-024 – Data-Driven Game Configuration
- DD-026 – Hybrid Data Access Strategy
- DD-027 – Event-Driven Simulation Architecture
- DD-028 – CQRS Lite
- DD-030 – Configuration-Driven Game Content
- DD-031 – Game Content Organization
- DD-032 – Deterministic Tick Processing
- DD-033 – Savegame and Persistence Strategy

Diese Entscheidungen dürfen nur in Ausnahmefällen geändert werden, da sie die grundlegenden Architekturprinzipien von Project Genesis definieren.

---

# Lebenszyklus einer ADR

```text
Proposed
    ↓
Accepted
    ↓
Superseded
    ↓
Deprecated
```

Einmal akzeptierte ADRs bleiben Bestandteil der Projekthistorie. Änderungen erfolgen durch neue ADRs oder durch den Status **Superseded**, nicht durch das Überschreiben bestehender Entscheidungen.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Initiale Version |
| 2.0.0 | 2026-07-03 | Erweiterung um DD-035 |
| 3.0.0 | 2026-07-03 | Überarbeitung mit Kategorien, Core Decisions und Lebenszyklus |