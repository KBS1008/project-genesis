---
Document-ID: DD-004
Title: Common Schema
Type: Architecture Decision Record
Status: Accepted
Version: 2.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - schemas/Building.schema.md
  - schemas/Company.schema.md
  - schemas/Player.schema.md
  - schemas/Production.schema.md
  - schemas/ResourceType.schema.md

Related Decisions:
  - DD-003 – Global Identifiers
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content
  - DD-031 – Game Content Organization

Affected Components:
  - Content Loader
  - Schema Validation
  - Game Content
  - Simulation Engine
  - Savegame System

Tags:
  - schema
  - validation
  - content
  - architecture
---

# DD-004 – Common Schema

## Status

**Accepted**

---

# Zusammenfassung

Alle datengetriebenen Inhalte in Project Genesis basieren auf einem gemeinsamen Basisschema.

Dadurch erhalten sämtliche Content-Dateien eine einheitliche Struktur, gemeinsame Metadaten und ein konsistentes Validierungsmodell.

---

# Motivation

Project Genesis verwendet hunderte Konfigurationsdateien:

- Ressourcen
- Gebäude
- Rezepte
- Technologien
- Märkte
- Mitarbeiter
- Energieanlagen
- Transporte
- Szenarien

Alle sollen identisch aufgebaut sein.

---

# Problem

Ohne ein gemeinsames Schema entstehen:

- unterschiedliche Dateiformate
- inkonsistente Metadaten
- redundante Validierungslogik
- höherer Wartungsaufwand

---

# Entscheidung

Alle Content-Dateien besitzen ein gemeinsames Basisschema.

Jedes Fachschema erweitert dieses Basisschema.

---

# Gemeinsame Eigenschaften

Jedes Schema enthält mindestens:

```yaml
id:
name:
description:
version:
category:
enabled:
tags:
```

Optional:

```yaml
icon:
localizationKey:
mod:
deprecated:
metadata:
```

---

# Basisschema

```yaml
id: steel_mill

name: Steel Mill

description: Produces steel from iron plates.

version: 1

category: production

enabled: true

tags:
  - industry
  - steel
```

---

# Erweiterung

Fachspezifische Schemas ergänzen eigene Felder.

Beispiel Building:

```yaml
capacity:
energyConsumption:
employees:
supportedRecipes:
maintenance:
```

Beispiel Resource:

```yaml
stackSize:
mass:
volume:
marketCategory:
```

---

# Namenskonventionen

IDs:

```text
snake_case
```

Beispiele:

```text
iron_ore
steel_plate
advanced_factory
```

---

Dateinamen:

```text
snake_case.yaml
```

---

Schema-Dateien:

```text
Building.schema.md
Company.schema.md
```

---

# Versionierung

Jedes Content-Objekt besitzt eine Version.

Beispiel:

```yaml
version: 2
```

Die Version dient:

- Migrationen
- Savegame-Kompatibilität
- Mod-Kompatibilität

---

# Validierung

Beim Laden werden geprüft:

- Pflichtfelder
- Datentypen
- ID-Konventionen
- doppelte IDs
- Versionsnummer
- Referenzen
- unbekannte Felder (optional konfigurierbar)

Ungültige Inhalte verhindern den Start.

---

# Beziehung zu anderen Systemen

## Content Loader

Lädt alle Dateien gegen das Basisschema.

---

## Savegame System

Speichert ausschließlich gültige Inhalte.

---

## Mod Loader

Erweitert vorhandene Inhalte unter Einhaltung des Basisschemas.

---

## Simulation

Verarbeitet ausschließlich validierte Daten.

---

# Data-Driven Architektur

Alle Gameplay-Inhalte befinden sich unter:

```text
game-content/
```

Die Simulation kennt keine fest eingebauten Spielwerte.

---

# Vorteile

- Einheitliche Struktur
- Einfache Validierung
- Weniger Redundanz
- Höhere Wartbarkeit
- Bessere Mod-Unterstützung
- Konsistente Dokumentation

---

# Nachteile

- Höherer Initialaufwand
- Änderungen am Basisschema betreffen viele Inhalte

Diese Nachteile werden akzeptiert.

---

# Verworfene Alternativen

## Individuelle Schemas ohne gemeinsame Basis

Verworfen.

Grund:

Inkonsistente Datenmodelle und redundante Validierung.

---

## Codebasierte Konfiguration

Verworfen.

Grund:

Widerspricht dem datengetriebenen Architekturansatz.

---

# Implementierung

```text
game-content/

schemas/
    common.schema.yaml

resources/
buildings/
recipes/
technologies/
employees/
market/

src/

content/

SchemaLoader.ts
SchemaValidator.ts
ContentRegistry.ts
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Alle Schemas erweitern das Common Schema.
- Pflichtfelder dürfen nicht entfernt werden.
- IDs müssen DD-003 entsprechen.
- Neue Content-Typen müssen das Basisschema übernehmen.
- Validierung erfolgt vor der Registrierung im Content Registry.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Konsistenz
- Erweiterbarkeit
- Wartbarkeit
- Modding
- Datenqualität
- Automatisierte Validierung

---

# Risiken

Mögliche Risiken:

- Breaking Changes im Basisschema
- Versionskonflikte zwischen Mods
- Unvollständige Migrationen

Diese Risiken werden durch Versionierung, Migrationen und automatisierte Validierung minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Erste Version |
| 2.0.0 | 2026-07-03 | Vollständige Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Jeder Content-Typ ist einzigartig – aber alle sprechen dieselbe Sprache.“**

Das Common Schema definiert die gemeinsame Grundlage aller datengetriebenen Inhalte in Project Genesis. Es sorgt für konsistente Strukturen, einfache Validierung und eine stabile Basis für Erweiterungen, Modding und langfristige Wartbarkeit.