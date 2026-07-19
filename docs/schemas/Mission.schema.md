# Mission.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Mission
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Mission-Assets in Project Genesis.

Eine Mission beschreibt eine definierte Aufgabe oder Herausforderung, die innerhalb eines Szenarios, einer Kampagne oder eines anderen Spielkontexts erfüllt werden kann.

Missions können unter anderem:

- Produktionsziele
- Transportziele
- Forschungsziele
- wirtschaftliche Ziele
- Bauziele
- Logistikziele
- Überlebensziele
- zeitbasierte Herausforderungen
- kombinierte Aufgaben

definieren.

Eine Mission beschreibt die statischen Anforderungen und Ergebnisse.

Der tatsächliche Fortschritt einer Mission gehört zum dynamischen Spielzustand.

Das Schema dient als Grundlage für:

- JSON-Assets
- Asset Registry
- Content Pipeline
- Validierung
- Scenario-System
- Campaign-System
- Objective-System
- Editor
- Modding
- Savegame-Kompatibilität

---

# Asset Identity

Jede Mission besitzt eine eindeutige Asset-ID.

Beispiele:

```text
mission.produce_1000_steel
mission.deliver_500_steel
mission.research_basic_engineering
mission.build_first_factory
mission.maintain_positive_cashflow
```

Die Asset-ID bleibt über die gesamte Lebensdauer eines Assets stabil.

---

# Required Fields

| Feld        | Typ     | Beschreibung        |
| ----------- | ------- | ------------------- |
| id          | string  | Eindeutige Asset-ID |
| version     | integer | Asset-Version       |
| displayName | string  | Anzeigename         |
| category    | string  | Missionskategorie   |
| description | string  | Beschreibung        |
| objectives  | array   | Missionsziele       |

---

# Optional Fields

| Feld              | Typ     |
| ----------------- | ------- |
| icon              | string  |
| localizationKey   | string  |
| tags              | array   |
| difficulty        | string  |
| prerequisites     | object  |
| requirements      | object  |
| timeLimit         | number  |
| rewards           | object  |
| failureConditions | array   |
| dependencies      | object  |
| repeatable        | boolean |
| hidden            | boolean |

---

# Mission Categories

Empfohlene Kategorien:

```yaml
production
transport
logistics
construction
research
economic
exploration
survival
maintenance
special
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Difficulty

Optional kann eine Mission eine Schwierigkeitsstufe definieren.

Beispiel:

```yaml
difficulty: normal
```

Empfohlene Werte:

```text
easy
normal
hard
expert
custom
```

Die Schwierigkeit dient primär der Klassifizierung und Darstellung.

Sie ersetzt keine konkreten Missionsanforderungen.

---

# Objectives

Eine Mission besteht aus mindestens einem Objective.

Beispiel:

```yaml
objectives:
  - type: produce
    resource: resource.steel
    amount: 1000
```

Objectives definieren die messbaren Bedingungen für den Missionsfortschritt.

---

# Objective Types

Empfohlene Objective-Typen:

```text
produce
consume
transport
deliver
build
destroy
research
earn
maintain
survive
reach
collect
own
operate
```

Neue Objective-Typen müssen durch das Objective-System unterstützt werden.

---

# Objective Structure

Ein Objective besitzt mindestens einen Typ.

Beispiel:

```yaml
objectives:
  - id: produce_steel

    type: produce

    resource: resource.steel

    amount: 1000
```

Eine Objective-ID muss innerhalb einer Mission eindeutig sein.

---

# Production Objective

Beispiel:

```yaml
objectives:
  - id: produce_steel

    type: produce

    resource: resource.steel

    amount: 1000
```

Die Mission gilt als erfüllt, wenn die definierte Produktionsmenge erreicht wurde.

Die konkrete Erfassung der Produktionsleistung erfolgt durch das Domain-/Simulation-System.

---

# Transport Objective

Beispiel:

```yaml
objectives:
  - id: transport_steel

    type: transport

    resource: resource.steel

    amount: 500

    destination:
      building: building.warehouse
```

Die konkrete Transportausführung wird durch das Transport-/Logistiksystem überwacht.

---

# Delivery Objective

Beispiel:

```yaml
objectives:
  - id: deliver_steel

    type: deliver

    resource: resource.steel

    amount: 500

    destination:
      region: region.industrial_valley
```

---

# Construction Objective

Beispiel:

```yaml
objectives:
  - id: build_smelter

    type: build

    building: building.smelter

    amount: 1
```

---

# Research Objective

Beispiel:

```yaml
objectives:
  - id: research_engineering

    type: research

    technology: technology.basic_engineering
```

---

# Economic Objective

Beispiel:

```yaml
objectives:
  - id: earn_money

    type: earn

    amount: 100000
```

---

# Maintenance Objective

Beispiel:

```yaml
objectives:
  - id: maintain_cashflow

    type: maintain

    metric: cashflow

    value: 10000

    duration: 600
```

Die konkrete Messung und zeitliche Auswertung erfolgt durch das Simulation-/Objective-System.

---

# Compound Objectives

Eine Mission kann mehrere Objectives besitzen.

Beispiel:

```yaml
objectives:
  - id: produce_steel

    type: produce

    resource: resource.steel

    amount: 1000

  - id: maintain_cashflow

    type: maintain

    metric: cashflow

    value: 10000

    duration: 600
```

Die Auswertungslogik wird über `completionMode` definiert.

---

# Completion Mode

Eine Mission kann definieren, wie mehrere Objectives zusammen ausgewertet werden.

Beispiel:

```yaml
completionMode: all
```

Mögliche Werte:

```text
all
any
sequential
```

## all

Alle Objectives müssen erfüllt werden.

## any

Mindestens ein Objective muss erfüllt werden.

## sequential

Objectives müssen in definierter Reihenfolge erfüllt werden.

Die Reihenfolge wird durch die Reihenfolge der Objective-Definitionen bestimmt.

---

# Prerequisites

Eine Mission kann andere Missionen oder Technologien voraussetzen.

Beispiel:

```yaml
prerequisites:
  missions:
    - mission.build_first_factory

  technologies:
    - technology.basic_engineering
```

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

Zirkuläre Missionsabhängigkeiten sind nicht zulässig.

---

# Requirements

Requirements definieren zusätzliche Voraussetzungen für die Aktivierung einer Mission.

Beispiel:

```yaml
requirements:
  buildings:
    - building.research_lab

  employees:
    - employee.engineer.basic
```

Mögliche Requirement-Typen:

- Buildings
- Employees
- Vehicles
- Resources
- Technologies
- Scenarios

Die konkrete Prüfung erfolgt durch das Scenario-/Mission-System.

---

# Time Limit

Eine Mission kann ein Zeitlimit besitzen.

Beispiel:

```yaml
timeLimit: 1800
```

Die Einheit muss mit der zentralen Zeitdefinition der Simulation übereinstimmen.

Ein fehlendes `timeLimit` bedeutet, dass keine explizite zeitliche Begrenzung besteht.

---

# Failure Conditions

Missionen können Bedingungen besitzen, unter denen sie fehlschlagen.

Beispiel:

```yaml
failureConditions:
  - type: bankruptcy

  - type: time_limit_exceeded
```

Weitere mögliche Bedingungen:

```text
objective_failed
resource_depleted
building_destroyed
player_bankrupt
scenario_failed
```

Die konkrete Auswertung erfolgt durch das Mission-/Scenario-System.

---

# Rewards

Missionen können Belohnungen definieren.

Beispiel:

```yaml
rewards:
  money: 50000

  resources:
    resource.steel: 500

  unlocks:
    - technology.advanced_metallurgy
```

Mögliche Belohnungen:

- Geld
- Ressourcen
- Technologien
- Gebäude
- Fahrzeuge
- Szenarien
- Missionen
- andere Assets

Alle Asset-Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Dependencies

Missionen können Teil einer größeren Missionskette sein.

Beispiel:

```yaml
dependencies:
  previous:
    - mission.build_first_factory

  next:
    - mission.expand_production
```

Die Verwendung von `previous` und `next` ist optional.

Die primäre Abhängigkeit wird über `prerequisites` definiert.

`dependencies` dient insbesondere der Darstellung und Navigation innerhalb von Kampagnen oder Missionsketten.

---

# Repeatable Missions

Eine Mission kann wiederholbar sein.

Beispiel:

```yaml
repeatable: true
```

Bei wiederholbaren Missionen muss das Mission-System definieren:

- wann die Mission erneut aktiviert werden kann
- ob Belohnungen erneut vergeben werden
- ob Fortschritt zurückgesetzt wird

---

# Hidden Missions

Missionen können verborgen sein.

Beispiel:

```yaml
hidden: true
```

Verborgene Missionen können durch:

- Fortschritt
- Ereignisse
- Entdeckungen
- andere Missionen

sichtbar oder aktivierbar werden.

Die konkrete Freischaltlogik gehört zum Mission-/Scenario-System.

---

# Asset References

Eine Mission darf referenzieren:

- Resources
- Buildings
- Vehicles
- Employees
- Technologies
- Scenarios
- Missions
- Regions
- Biomes
- Effects
- Rewards

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Anzeigenamen und Beschreibungen sollen über Lokalisierungsschlüssel referenziert werden.

Beispiel:

```yaml
localizationKey: mission.produce_1000_steel
```

Die konkrete Lokalisierung wird außerhalb des Mission-Assets verwaltet.

---

# Validation Rules

Eine Mission ist gültig, wenn:

- eine eindeutige Asset-ID vorhanden ist
- die Version gültig ist
- eine Kategorie definiert wurde
- mindestens ein Objective vorhanden ist
- alle Objective-IDs innerhalb der Mission eindeutig sind
- alle Objective-Typen unterstützt werden
- alle referenzierten Assets existieren
- keine zirkulären Missionsabhängigkeiten bestehen
- `timeLimit` größer als 0 ist, sofern definiert
- alle Objective-Mengen größer als 0 sind
- alle Rewards gültig sind
- alle Failure Conditions gültig sind

Zusätzlich gilt:

- `completionMode` muss ein gültiger Wert sein
- `duration` muss größer als 0 sein, sofern definiert
- Asset-Referenzen müssen auf gültige Assets zeigen

Ungültige Missionen dürfen nicht registriert oder geladen werden.

---

# Runtime State Separation

Das Mission-Asset enthält ausschließlich statische Missionsdefinitionen.

Nicht Bestandteil dieses Schemas sind:

- aktueller Missionsfortschritt
- aktueller Objective-Fortschritt
- Missionsstatus
- Aktivierungszeitpunkt
- Abschlusszeitpunkt
- aktuelle Missionsergebnisse
- bereits vergebene Rewards
- aktuelle Failure Conditions
- temporäre Missionsmodifikatoren

Diese Daten gehören zum dynamischen Spielzustand.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Mission-Assets erhöhen deren Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml
id: mission.produce_1000_steel

version: 1

displayName: Produce 1,000 Steel

category: production

description: Produce a total of 1,000 units of steel.

difficulty: normal

completionMode: all

objectives:
  - id: produce_steel

    type: produce

    resource: resource.steel

    amount: 1000

timeLimit: 1800

requirements:
  buildings:
    - building.smelter

  technologies:
    - technology.basic_metallurgy

rewards:
  money: 50000

  resources:
    resource.steel: 500

  unlocks:
    - technology.advanced_metallurgy

failureConditions:
  - type: bankruptcy

tags:
  - production
  - steel
  - industry
```

---

# Compatibility

Dieses Schema ist kompatibel mit:

- ASSET_ID_SYSTEM.md
- ASSET_VERSIONING.md
- REGISTRY_SCHEMA.md
- GLOBAL_ASSET_REGISTRY.md
- CONTENT_PIPELINE.md
- Employee.schema.md
- Vehicle.schema.md
- Resource.schema.md
- Building.schema.md
- Recipe.schema.md
- Technology.schema.md
- Scenario.schema.md
- Biome.schema.md

---

# Future Extensions

Geplante Erweiterungen:

- Mission Chains
- Campaign Missions
- Dynamic Objectives
- Objective Dependencies
- Optional Objectives
- Hidden Objectives
- Branching Missions
- Mission Events
- Mission Scripting
- Dynamic Rewards
- Reward Scaling
- Reputation Rewards
- Faction Relations
- Mission Difficulty Scaling
- Procedural Missions
- Daily Missions
- Recurring Missions
- Multiplayer Missions
- Cooperative Objectives
- Competitive Objectives
- Mission Time Windows
- Mission Expiration
- Mission Modifiers
