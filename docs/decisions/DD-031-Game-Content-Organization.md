---
Document-ID: DD-031
Title: Game Content Organization
Type: Architecture Decision Record
Status: Accepted
Version: 2.0.0
Created: 2026-07-03
Last Updated: 2026-07-06

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - architecture/SAD.md
  - architecture/DDD.md
  - architecture/technology-stack.md
  - docs/schemas/
  - docs/gameplay/

Related Decisions:
  - DD-004 – Common Schema
  - DD-008 – No Magic Numbers
  - DD-024 – Data-Driven Game Configuration
  - DD-025 – Content Validation Pipeline
  - DD-030 – Configuration-Driven Game Content

Affected Components:
  - Content Loader
  - Configuration System
  - Game Content
  - Mod Loader
  - Simulation Engine

Tags:
  - content
  - configuration
  - data-driven
  - modding
---

# DD-031 – Game Content Organization

## Status

**Accepted**

---

# Zusammenfassung

Alle spielrelevanten Inhalte werden außerhalb des Quellcodes organisiert.

Gameplay-Daten befinden sich ausschließlich im Verzeichnis **`game-content/`** und werden zur Laufzeit durch den Content Loader geladen und validiert.

Architektur-, Gameplay- und Schema-Dokumentation befinden sich im Verzeichnis **`docs/`** und dienen als Referenz für Entwicklung und KI-gestützte Implementierung.

---

# Motivation

Project Genesis verfolgt einen vollständig datengetriebenen Ansatz.

Spielinhalte sollen:

- ohne Neukompilierung geändert werden können
- leicht balanciert werden können
- Modding unterstützen
- sauber versionierbar sein
- klar von Dokumentation und Quellcode getrennt sein

---

# Problem

Werden Inhalte im Quellcode oder uneinheitlich abgelegt, entstehen:

- versteckte Spielwerte
- schwieriges Balancing
- hoher Wartungsaufwand
- inkonsistente Projektstruktur
- erschwerte Erweiterbarkeit

---

# Entscheidung

Das Repository wird in drei klar getrennte Bereiche gegliedert:

```text
docs/
```

Projektwissen, Architektur und Spezifikationen.

```text
game-content/
```

Gameplay-Daten und Konfiguration.

```text
src/
```

Implementierung der Engine und Simulation.

---

# Repository-Struktur

```text
project-root/

docs/
│
├── architecture/
├── decisions/
├── gameplay/
├── schemas/
└── config/

game-content/
│
├── buildings/
├── companies/
├── employees/
├── energy/
├── finance/
├── market/
├── production/
├── recipes/
├── regions/
├── research/
├── resources/
├── transport/
└── world/

src/
│
├── application/
├── common/
├── content/
├── domain/
├── infrastructure/
├── simulation/
└── ui/

tests/
tools/
```

---

# Verantwortlichkeiten

## docs/

Enthält ausschließlich Dokumentation.

Beispiele:

- Software Architecture Document (SAD)
- Domain-Driven Design (DDD)
- Gameplay-Spezifikationen
- ADRs
- Schemas

Diese Dateien werden **nicht** zur Laufzeit geladen.

---

## game-content/

Enthält sämtliche Gameplay-Daten.

Beispiele:

- Gebäude
- Rezepte
- Ressourcen
- Technologien
- Märkte
- Regionen
- Energie
- Transporte

Diese Dateien werden validiert und vom Content Loader registriert.

---

## src/

Enthält ausschließlich Anwendungscode.

Der Quellcode beschreibt das Verhalten der Simulation, enthält jedoch keine gameplayrelevanten Inhalte.

---

# Content Loader

Der Content Loader:

1. durchsucht `game-content/`
2. lädt alle Dateien
3. validiert sie gegen die Schemas
4. registriert sie im Content Registry
5. stellt sie der Simulation zur Verfügung

---

# Modding

Mods folgen derselben Struktur wie das Basis-Spiel.

Beispiel:

```text
mods/

my-industry-mod/

game-content/
    buildings/
    recipes/
    resources/
```

Der Mod Loader integriert diese Inhalte in die Content Registry.

---

# Trennung von Verantwortung

| Bereich | Inhalt |
|----------|--------|
| docs/ | Architektur und Spezifikationen |
| game-content/ | Gameplay-Daten |
| src/ | Anwendungscode |
| tests/ | Tests |
| tools/ | Entwicklungswerkzeuge |

---

# Vorteile

- Klare Projektstruktur
- Datengetriebenes Gameplay
- Einfache Erweiterbarkeit
- Modding-Unterstützung
- Weniger Kopplung
- Gute Wartbarkeit

---

# Nachteile

- Größere Anzahl an Dateien
- Höherer Aufwand für Validierung und Organisation

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Gameplay-Daten im Quellcode

Verworfen.

Grund:

Widerspricht dem Data-Driven-Ansatz und erschwert Balancing sowie Modding.

---

## Vermischung von Dokumentation und Content

Verworfen.

Grund:

Unklare Verantwortlichkeiten und schlechtere Wartbarkeit.

---

# Implementierung

```text
src/

content/
    ContentLoader.ts
    ContentRegistry.ts
    SchemaValidator.ts
    ModLoader.ts

game-content/
    ...
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Gameplay-Inhalte werden ausschließlich aus `game-content/` geladen.
- Architekturentscheidungen stammen aus `docs/decisions/`.
- Datenstrukturen werden in `docs/schemas/` dokumentiert.
- Gameplay-Regeln werden in `docs/gameplay/` beschrieben.
- Neue Content-Typen müssen in den Content Loader und die Content Registry integriert werden.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Datengetriebenes Design
- Wartbarkeit
- Erweiterbarkeit
- Modding
- Testbarkeit
- Konsistenz

---

# Risiken

Mögliche Risiken:

- Inkonsistente Verzeichnisstrukturen
- Fehlende Schema-Validierung
- Namenskonflikte zwischen Mods

Diese Risiken werden durch klare Konventionen, Validierung und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Erste Version |
| 2.0.0 | 2026-07-06 | Aktualisierung auf die neue Repository-Struktur (`docs/gameplay`, `docs/schemas`, `game-content`) und Überarbeitung der Dokumentation |

---

# Leitsatz

> **„Dokumentation beschreibt das Spiel, Content definiert das Spiel und der Code führt das Spiel aus.“**

Project Genesis trennt konsequent zwischen Dokumentation, Gameplay-Daten und Anwendungscode. Diese Struktur bildet die Grundlage für eine datengetriebene, moddingfreundliche und langfristig wartbare Architektur.