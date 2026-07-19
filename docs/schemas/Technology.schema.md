# Technology.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Technology
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert den kanonischen Content-Contract für `Technology`-Assets in Project Genesis.

Eine Technology beschreibt eine statische, erforschbare Technologie innerhalb des Spiels.

Technologies werden als statische Content-Definitionen geladen, validiert und über die `TechnologyRegistry` registriert.

Der eigentliche Forschungsprozess ist ein Runtime-Vorgang und wird nicht durch dieses statische Schema repräsentiert.

Die fachliche Trennung lautet:

```text
Technology
    ↓
statische Content-Definition

ResearchJob
    ↓
laufender Forschungsprozess

CompanyResearch
    ↓
dauerhaft abgeschlossene Forschung einer Company
```

Der Content-Ordner heißt aktuell:

```text
game-content/research/
```

Der fachliche Asset-Typ ist jedoch:

```text
Technology
```

Der Verzeichnisname `research` ist daher nicht als separater Asset-Typ `Research` zu interpretieren.

---

# Architecture

Die Technology-Content-Pipeline folgt dem zentralen Content-Modell:

```text
Technology YAML Asset
        ↓
TechnologyLoader
        ↓
Parse
        ↓
TechnologyValidator
        ↓
Duplicate ID Validation
        ↓
TechnologyRegistry
        ↓
Cross-Registry Reference Validation
        ↓
Validated Technology Content
```

Die relevanten Implementierungskomponenten befinden sich im Technology-/Research-Bounded-Context:

```text
src/content/research/
├── TechnologyDefinition
├── TechnologyValidator
├── TechnologyLoader
└── TechnologyRegistry
```

Die Runtime trennt statische Technology-Definitionen vom Forschungsprozess.

```text
Technology Definition
        │
        ▼
TechnologyRegistry
        │
        ▼
Research / Technology Runtime
        │
        ├── CompanyResearch
        │
        └── ResearchJob
                │
                ▼
        Research Completion
                │
                ▼
        CompleteTechnologyUseCase
```

---

# Asset Identity

Jede Technology besitzt eine eindeutige Asset-ID.

Beispiel:

```yaml
id: basic_woodworking
```

Die ID muss dem globalen Asset-ID-Contract entsprechen.

Aktuell gilt:

```regex
^[a-z0-9_]+$
```

Beispiele für gültige IDs:

```text
basic_woodworking
advanced_woodworking
steel_production
```

Beispiele für ungültige IDs:

```text
BasicWoodworking
basic-woodworking
basic woodworking
```

Die ID muss innerhalb der `TechnologyRegistry` eindeutig sein.

Eine einmal veröffentlichte Technology-ID darf nicht ohne kontrollierte Migration geändert werden, da andere Content-Typen und Runtime-Daten auf diese ID referenzieren können.

---

# Required Fields

Eine Technology-Definition besteht aus den Feldern, die vom implementierten `TechnologyDefinition`- und `TechnologyValidator`-Contract unterstützt werden.

Der kanonische Kern besteht aus:

| Feld                 | Typ      | Beschreibung                                             |
| -------------------- | -------- | -------------------------------------------------------- |
| `id`                 | string   | Eindeutige Technology-ID                                 |
| `name`               | string   | Anzeigename der Technologie                              |
| `description`        | string   | Beschreibung der Technologie                             |
| `researchCost`       | number   | Kosten für die Erforschung                               |
| `researchTime`       | number   | Dauer der Erforschung                                    |
| `requiredResearch`   | string[] | Optionale Voraussetzungen in Form anderer Technology-IDs |
| `requiredMilestones` | string[] | Optionale Voraussetzungen in Form von Milestone-IDs      |

Die genaue Feldstruktur muss mit dem tatsächlichen `TechnologyDefinition`- und `TechnologyValidator`-Contract synchron bleiben.

Die Dokumentation darf keine zusätzlichen Pflichtfelder einführen, die der aktuelle Loader oder Validator nicht verarbeitet.

---

# Technology Definition

Eine Technology beschreibt eine statische Forschungsdefinition.

Vereinfacht:

```text
Technology
├── id
├── name
├── description
├── researchCost
├── researchTime
├── requiredResearch
└── requiredMilestones
```

Die statische Definition enthält keine Company-spezifischen Runtime-Zustände.

Nicht Bestandteil des Technology-Assets sind:

- Forschungsfortschritt einer Company
- verbleibende Forschungszeit
- aktive Research Jobs
- Completion Timestamp
- Company-ID
- bereits abgeschlossene Forschung
- laufende Forschungsaufträge

Diese Informationen gehören zur Runtime.

---

# Research Cost

`researchCost` beschreibt die für die Erforschung erforderlichen Kosten.

Der Wert muss ein gültiger numerischer Wert gemäß dem implementierten Validator sein.

Beispiel:

```yaml
researchCost: 100
```

Die konkrete Währung bzw. Kostenart wird durch den Application-/Domain-Contract bestimmt.

Die Schema-Dokumentation darf nicht automatisch eine bestimmte Currency-Implementierung voraussetzen, sofern diese nicht Bestandteil des `TechnologyDefinition`-Contracts ist.

---

# Research Time

`researchTime` beschreibt die für die Erforschung erforderliche Zeitdauer.

Beispiel:

```yaml
researchTime: 60
```

Die Einheit muss mit der im Runtime-Research-System verwendeten Zeitrepräsentation übereinstimmen.

Das statische Technology-Asset definiert lediglich die erforderliche Dauer.

Der tatsächliche Fortschritt wird im `ResearchJob` verwaltet.

---

# Technology Prerequisites

Technologies können andere Technologies als Voraussetzungen referenzieren.

Das Referenzmuster lautet:

```yaml
requiredResearch:
  - basic_woodworking
```

Die referenzierte Technology-ID muss in der `TechnologyRegistry` existieren.

Damit ergibt sich:

```text
Technology A
    │
    └── requiredResearch
            │
            ▼
       Technology B
```

Beispiel:

```text
basic_woodworking
        ↓
advanced_woodworking
        ↓
industrial_woodworking
```

Die Referenzen werden über die zentrale Cross-Registry-Validierung geprüft.

Eine nicht existierende Technology-ID ist ein Content-Validierungsfehler.

---

# Research Dependency Rules

`requiredResearch` beschreibt fachliche Forschungsabhängigkeiten.

Die Abhängigkeit ist eine gerichtete Beziehung:

```text
Technology A
    requires
Technology B
```

Damit muss `Technology B` abgeschlossen sein, bevor `Technology A` erforscht werden kann.

Die statische Definition darf nur Technology-IDs referenzieren.

Nicht zulässig sind:

```yaml
requiredResearch:
  - ./basic_woodworking.yaml
```

oder:

```yaml
requiredResearch:
  - ResearchJob:123
```

oder andere Runtime-Referenzen.

Referenzen erfolgen ausschließlich über stabile Technology-IDs.

---

# Milestone Prerequisites

Eine Technology kann Milestones als Voraussetzungen referenzieren.

Das Referenzmuster lautet:

```yaml
requiredMilestones:
  - milestone.first_production
```

Die referenzierte Milestone-ID muss in der `MilestoneRegistry` existieren.

Damit kann eine Technology sowohl Forschungs- als auch Fortschrittsvoraussetzungen besitzen.

Beispiel:

```text
Technology
    │
    ├── requiredResearch
    │       ↓
    │   TechnologyRegistry
    │
    └── requiredMilestones
            ↓
        MilestoneRegistry
```

Eine ungültige Milestone-ID führt zu einem Content-Validierungsfehler.

---

# Cross-Registry Contract

Technology-Definitionen stehen in Beziehung zu anderen Content-Registries.

Aktuell relevante Referenzen sind:

```text
Technology
    │
    ├── requiredResearch
    │       ↓
    │   TechnologyRegistry
    │
    └── requiredMilestones
            ↓
        MilestoneRegistry
```

Darüber hinaus können andere Content-Typen Technologies referenzieren.

Insbesondere:

```text
BuildingType
Recipe
Technology
```

können Voraussetzungen über `requiredResearch` definieren.

Damit entsteht folgender Cross-Registry-Contract:

```text
TechnologyRegistry
        ▲
        │
        │ requiredResearch
        │
   ┌────┼─────────────┐
   │    │             │
Building Recipe   Technology
```

Diese Referenzen werden durch die zentrale Content-Validierung geprüft.

---

# Required Research References

Das Feld `requiredResearch` ist eine Liste stabiler Technology-IDs.

Beispiel:

```yaml
requiredResearch:
  - basic_woodworking
```

Mehrere Voraussetzungen:

```yaml
requiredResearch:
  - basic_woodworking
  - basic_metallurgy
```

Die Reihenfolge der Einträge besitzt keine fachliche Bedeutung.

Alle referenzierten Technologies müssen existieren.

Eine Technology darf nicht auf eine nicht existierende Technology-ID verweisen.

---

# Required Milestone References

Das Feld `requiredMilestones` ist eine Liste stabiler Milestone-IDs.

Beispiel:

```yaml
requiredMilestones:
  - milestone.first_production
```

Mehrere Voraussetzungen:

```yaml
requiredMilestones:
  - milestone.first_production
  - milestone.first_profit
```

Alle referenzierten Milestones müssen in der `MilestoneRegistry` existieren.

Die Milestone-Definition selbst befindet sich in:

```text
docs/schemas/Milestone.schema.md
```

---

# Runtime Research Model

Das statische Technology-Asset ist nicht identisch mit einem laufenden Research Job.

Die fachliche Trennung lautet:

```text
STATIC
──────

Technology
    id
    name
    description
    researchCost
    researchTime
    prerequisites


RUNTIME
───────

ResearchJob
    company
    technology
    progress
    remainingTime
    state


PERSISTENT COMPANY STATE
────────────────────────

CompanyResearch
    company
    completedTechnologies
```

Eine Technology kann von vielen Companies unabhängig erforscht werden.

Der Abschluss einer Technology für eine Company wird im Runtime-Zustand gespeichert.

---

# Research Completion

Nach erfolgreicher Forschung wird die Technology für die jeweilige Company als abgeschlossen registriert.

Vereinfacht:

```text
ResearchJob
    │
    ▼
Research Completion
    │
    ▼
CompleteTechnologyUseCase
    │
    ▼
CompanyResearch
    │
    ▼
Technology marked as researched
```

Der Completion State gehört nicht in die statische Technology-Definition.

---

# Research Availability

Eine Technology ist grundsätzlich erforschbar, wenn ihre Voraussetzungen erfüllt sind.

Vereinfacht:

```text
Technology
    │
    ├── requiredResearch erfüllt?
    │
    └── requiredMilestones erfüllt?
            │
            ▼
      Research Available
```

Die tatsächliche Runtime-Entscheidung, ob eine Company eine Technology erforschen darf, gehört in den Application-/Domain-Layer und nicht in das statische YAML-Schema.

---

# Validation Rules

Eine Technology-Definition ist gültig, wenn:

- eine gültige `id` vorhanden ist
- die ID dem globalen Asset-ID-Format entspricht
- die ID innerhalb der `TechnologyRegistry` eindeutig ist
- alle erforderlichen Felder vorhanden sind
- numerische Werte gültig sind
- `requiredResearch` nur gültige Technology-IDs enthält
- `requiredMilestones` nur gültige Milestone-IDs enthält
- keine ungültigen oder nicht unterstützten Felder verwendet werden

## Cross-Registry Validation

Zusätzlich wird geprüft:

```text
requiredResearch
    ↓
TechnologyRegistry
```

und:

```text
requiredMilestones
    ↓
MilestoneRegistry
```

Ungültige Referenzen führen zu einem Content-Validierungsfehler.

---

# Duplicate IDs

Technology-IDs müssen eindeutig sein.

Beispiel eines ungültigen Zustands:

```text
basic_woodworking
basic_woodworking
```

Innerhalb der geladenen Technology-Assets darf eine ID nur einmal vorkommen.

Der Loader bzw. die Content-Pipeline muss doppelte IDs erkennen und ablehnen.

---

# Content Pipeline

Technologies werden über die zentrale Content-Pipeline geladen.

Der vereinfachte Ablauf:

```text
game-content/research/*.yaml
        ↓
TechnologyLoader
        ↓
Parse YAML
        ↓
TechnologyValidator
        ↓
Duplicate ID Check
        ↓
TechnologyRegistry
        ↓
Cross-Registry Validation
        ↓
Validated Game Content
```

Die zentrale Content-Validierung prüft insbesondere:

```text
Technology References
        ↓
TechnologyRegistry

Milestone References
        ↓
MilestoneRegistry
```

Die Content-Pipeline muss alle referenzierten Technologies und Milestones validieren.

---

# Example

Ein minimales Technology-Asset kann konzeptionell beispielsweise so aussehen:

```yaml
id: basic_woodworking

name: Basic Woodworking

description: >
  Enables basic woodworking production.

researchCost: 100

researchTime: 60

requiredResearch: []

requiredMilestones: []
```

Eine abhängige Technology:

```yaml
id: advanced_woodworking

name: Advanced Woodworking

description: >
  Enables advanced woodworking production.

researchCost: 250

researchTime: 120

requiredResearch:
  - basic_woodworking

requiredMilestones:
  - milestone.first_production
```

Die Beispiele dienen der Darstellung des Contract-Modells. Die tatsächlich im Repository vorhandenen Technology-Assets bleiben die maßgebliche Quelle für konkrete Werte und Inhalte.

---

# Current Asset Location

Die aktuellen Technology-Assets liegen unter:

```text
game-content/research/
```

Beispiel:

```text
game-content/research/basic_woodworking.yaml
```

Der Content-Pfad ist historisch bzw. fachlich durch den Research-Bounded-Context begründet.

Der kanonische Asset-Typ bleibt:

```text
Technology
```

Daher gilt:

```text
Research Folder
    ≠
Research Asset Type
```

Es ist nicht erforderlich, den Content-Ordner ausschließlich aufgrund des Asset-Typs umzubenennen.

Eine Änderung des Content-Pfads wäre eine separate Architekturentscheidung und nicht Bestandteil dieses Schemas.

---

# Registry Contract

Alle geladenen Technology-Definitionen werden über die `TechnologyRegistry` verwaltet.

Die Registry ist die kanonische Quelle für geladene statische Technology-Definitionen.

Andere Content-Typen referenzieren Technologies ausschließlich über stabile IDs.

Beispiel:

```yaml
requiredResearch:
  - basic_woodworking
```

Nicht zulässig:

```yaml
requiredResearch:
  - ./research/basic_woodworking.yaml
```

oder:

```yaml
requiredResearch:
  - ResearchJob:123
```

---

# Static vs. Runtime Contract

## Static Content

```text
Technology
├── id
├── name
├── description
├── researchCost
├── researchTime
├── requiredResearch
└── requiredMilestones
```

## Runtime Research

```text
ResearchJob
├── company
├── technology
├── progress
├── remainingTime
└── state
```

## Persistent Company State

```text
CompanyResearch
├── company
└── completedTechnologies
```

Diese Ebenen dürfen nicht vermischt werden.

---

# Versioning

Das Technology-Schema besitzt eine eigene Schema-Version.

Aktuell:

```text
Schema Version: 1
```

Eine Änderung einer Technology-ID ist eine potenziell migrationspflichtige Änderung.

Grund:

```text
Technology ID
    ├── requiredResearch
    ├── Runtime Research State
    └── CompanyResearch
```

Eine Änderung einer veröffentlichten ID kann daher bestehende Content-Referenzen und persistierte Runtime-Daten ungültig machen.

---

# Current Implementation Scope

Der aktuelle Technology-Contract umfasst:

```text
Technology Definition
Technology Validator
Technology Loader
Technology Registry
Cross-Registry Research Validation
Cross-Registry Milestone Validation
Runtime Research
Company Research State
Research Completion
```

Die statische Technology-Definition beschreibt ausschließlich die Daten, die für die Content- und Research-Logik erforderlich sind.

Nicht Bestandteil dieses Schemas sind:

- Research Job Runtime State
- Company Research Progress
- Research Completion Events
- Research Rewards
- Technology Effects als allgemeines Plugin-System
- Missions
- Scenarios
- Biomes

Diese Bereiche können später über separate Contracts erweitert werden.

---

# Future Extensions

Mögliche zukünftige Erweiterungen können umfassen:

- Technology Effects
- Unlocks
- Research Trees
- Technology Categories
- Research Rewards
- Alternative Research Costs
- Multiple Cost Types
- Research Modifiers
- Scenario-specific Technologies
- Technology-based Missions
- Technology-based Achievements

Solche Erweiterungen erfordern jeweils eine explizite Erweiterung des Contracts und der zugehörigen Implementierung.

Mindestens folgende Komponenten wären bei einer strukturellen Erweiterung zu prüfen:

```text
TechnologyDefinition
TechnologyValidator
TechnologyLoader
TechnologyRegistry
Research Runtime
Cross-Registry Validation
Tests
Documentation
```

Nicht implementierte Erweiterungen dürfen nicht als aktiver v1-Contract dokumentiert werden.

---

# Compatibility

Dieses Schema steht insbesondere in Beziehung zu:

```text
ASSET_ID_SYSTEM.md
ASSET_VERSIONING.md
REGISTRY_SCHEMA.md
GLOBAL_ASSET_REGISTRY.md
CONTENT_PIPELINE.md
```

sowie zu:

```text
Milestone.schema.md
Building.schema.md
Recipe.Schema.md
ResourceType.Schema.md
```

Die wichtigsten Cross-Registry-Beziehungen sind:

```text
Technology
    │
    ├── requiredResearch
    │       ↓
    │   TechnologyRegistry
    │
    └── requiredMilestones
            ↓
        MilestoneRegistry
```

Andere Content-Typen können Technologies über `requiredResearch` referenzieren.

---

# Implementation Status

**Status:** Active

`Technology` ist ein implementierter Content-Typ der Project-Genesis-Content-Pipeline.

Die relevanten Komponenten umfassen:

```text
TechnologyDefinition
TechnologyValidator
TechnologyLoader
TechnologyRegistry
Technology Loader Tests
Research Reference Validation
Milestone Reference Validation
Research Runtime
CompanyResearch
Research Completion
```

Der dokumentierte Contract muss mit diesen Implementierungskomponenten synchron bleiben.

Bei Abweichungen zwischen Dokumentation und Implementierung gilt folgende Vorgehensweise:

1. Tatsächlichen Code-Contract feststellen
2. Abweichung dokumentieren
3. Architekturentscheidung treffen
4. Code oder Dokumentation synchronisieren
5. Tests aktualisieren
6. Content-Assets erneut validieren

Die Dokumentation darf keine nicht implementierten Technology-Funktionen als aktive v1-Funktionalität darstellen.
