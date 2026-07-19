# Scenario.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Scenario
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Scenario-Assets in Project Genesis.

Ein Scenario definiert eine vollständig beschriebene Spielsituation und deren Rahmenbedingungen.

Ein Szenario kann unter anderem festlegen:

- Ausgangsbedingungen
- Welt- und Biomeinstellungen
- verfügbare Ressourcen
- verfügbare Gebäude
- verfügbare Fahrzeuge
- verfügbare Technologien
- Startbedingungen
- Siegbedingungen
- Niederlagebedingungen
- Szenarioziele
- Einschränkungen
- Zeitlimits
- Schwierigkeitsparameter

Das Scenario-Asset definiert ausschließlich die statischen Rahmenbedingungen.

Der tatsächliche Spielfortschritt gehört zum dynamischen Spielzustand.

Das Schema dient als Grundlage für:

- JSON-Assets
- Asset Registry
- Content Pipeline
- Validierung
- Szenarioauswahl
- Spielstart
- Editor
- Modding
- Savegame-Kompatibilität

---

# Asset Identity

Jedes Szenario besitzt eine eindeutige Asset-ID.

Beispiele:

```text
scenario.tutorial
scenario.first_factory
scenario.industrial_expansion
scenario.arctic_logistics
scenario.global_supply_chain
```

Die Asset-ID bleibt über die gesamte Lebensdauer eines Assets stabil.

---

# Required Fields

| Feld               | Typ     | Beschreibung        |
| ------------------ | ------- | ------------------- |
| id                 | string  | Eindeutige Asset-ID |
| version            | integer | Asset-Version       |
| displayName        | string  | Anzeigename         |
| category           | string  | Szenariokategorie   |
| description        | string  | Beschreibung        |
| world              | object  | Weltdefinition      |
| startingConditions | object  | Ausgangsbedingungen |
| objectives         | object  | Szenarioziele       |

---

# Optional Fields

| Feld               | Typ    |
| ------------------ | ------ |
| icon               | string |
| localizationKey    | string |
| tags               | array  |
| difficulty         | string |
| biome              | string |
| map                | string |
| timeLimit          | number |
| availableContent   | object |
| restrictions       | object |
| victoryConditions  | array  |
| defeatConditions   | array  |
| rewards            | object |
| unlockRequirements | object |

---

# Scenario Categories

Empfohlene Kategorien:

```yaml id="k1p5x8"
tutorial
campaign
challenge
sandbox
story
economic
logistics
survival
special
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Difficulty

Optional kann ein Szenario eine Schwierigkeitsstufe definieren.

Beispiel:

```yaml id="v7n2m4"
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

Die konkrete Auswirkung der Schwierigkeit wird durch die Spielregeln und Simulation definiert.

---

# World

Die World-Definition beschreibt die statische Umgebung des Szenarios.

Beispiel:

```yaml id="q9r3w6"
world:
  biome:
    - biome.temperate

  map:
    - map.industrial_valley
```

Ein Szenario kann je nach Spielsystem ein oder mehrere Biome und Kartenreferenzen verwenden.

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Biome

Ein Szenario kann ein oder mehrere Biome referenzieren.

Beispiel:

```yaml id="f4y8t2"
biome:
  - biome.temperate
  - biome.forest
```

Die Biome definieren die Eigenschaften der Weltumgebung.

Die konkrete Generierung oder Platzierung der Welt gehört zum World-/Simulation-System.

---

# Starting Conditions

Die Starting Conditions definieren die Ausgangssituation eines neuen Spiels.

Beispiel:

```yaml id="m6s1k9"
startingConditions:
  money: 100000

  resources:
    resource.iron_ore: 500
    resource.coal: 200

  buildings:
    - building.warehouse
    - building.smelter

  vehicles:
    - vehicle.truck.small

  employees:
    - employee.engineer.basic
```

Die tatsächliche Erstellung der Runtime-Objekte erfolgt durch das Start-/Scenario-System.

Die referenzierten Assets müssen gültig sein.

---

# Starting Location

Optional kann eine Startposition definiert werden.

Beispiel:

```yaml id="n3v7q5"
startingLocation:
  region: region.industrial_valley
  x: 100
  y: 200
```

Die konkrete Positionsrepräsentation muss mit dem World-System kompatibel sein.

---

# Available Content

Ein Szenario kann den verfügbaren Content einschränken.

Beispiel:

```yaml id="x8p4r1"
availableContent:
  buildings:
    - building.warehouse
    - building.smelter

  vehicles:
    - vehicle.truck.small

  recipes:
    - recipe.steel

  technologies:
    - technology.basic_engineering
```

Nicht aufgeführte Assets sind nicht automatisch verfügbar.

Die konkrete Semantik muss vom Scenario-System eindeutig definiert werden.

---

# Content Restrictions

Alternativ oder ergänzend können Inhalte explizit ausgeschlossen werden.

Beispiel:

```yaml id="c5m9w2"
restrictions:
  buildings:
    excluded:
      - building.advanced_smelter

  vehicles:
    excluded:
      - vehicle.truck.large

  technologies:
    excluded:
      - technology.industrial_automation
```

`availableContent` und `restrictions` dürfen keine widersprüchlichen Definitionen enthalten.

---

# Objectives

Szenarioziele definieren Aufgaben, die der Spieler erfüllen soll.

Beispiel:

```yaml id="j2q7s4"
objectives:
  primary:
    - objective.produce_1000_steel

  secondary:
    - objective.maintain_positive_cashflow
```

Objectives werden über eigene Asset-IDs referenziert.

Die tatsächliche Überprüfung des Fortschritts erfolgt durch das Objective-/Scenario-System.

---

# Victory Conditions

Optional können explizite Siegbedingungen definiert werden.

Beispiel:

```yaml id="p8k3n6"
victoryConditions:
  - type: objective_completed
    objective: objective.produce_1000_steel

  - type: money_reached
    amount: 1000000
```

Die konkrete Auswertung erfolgt durch die Domain-/Scenario-Logik.

---

# Defeat Conditions

Optional können Niederlagebedingungen definiert werden.

Beispiel:

```yaml id="r4v9m1"
defeatConditions:
  - type: bankruptcy

  - type: time_limit_exceeded

  - type: objective_failed
    objective: objective.protect_factory
```

Die konkrete Auswertung erfolgt durch das Scenario-System.

---

# Time Limit

Ein Szenario kann ein Zeitlimit besitzen.

Beispiel:

```yaml id="w6t2y8"
timeLimit: 3600
```

Die Einheit muss mit der zentralen Zeitdefinition der Simulation übereinstimmen.

Ein fehlendes `timeLimit` bedeutet, dass das Szenario kein explizites Zeitlimit besitzt.

---

# Rewards

Szenarien können Belohnungen für den erfolgreichen Abschluss definieren.

Beispiel:

```yaml id="s1m7q3"
rewards:
  money: 50000

  unlocks:
    - scenario.industrial_expansion
```

Freischaltungen erfolgen ausschließlich über gültige Asset-IDs.

---

# Unlock Requirements

Ein Szenario kann Voraussetzungen für seine Freischaltung besitzen.

Beispiel:

```yaml id="d8p4k2"
unlockRequirements:
  scenarios:
    - scenario.tutorial

  technologies:
    - technology.basic_engineering
```

Die tatsächliche Prüfung erfolgt durch das Scenario-/Progression-System.

---

# Scenario Rules

Optionale Szenarioregeln können spezielle Rahmenbedingungen definieren.

Beispiel:

```yaml id="g5n2x9"
rules:
  startingMoney: 50000
  marketVolatility: 1.2
  resourceAbundance: 0.8
  researchSpeed: 0.9
```

Diese Werte sind statische Szenarioparameter.

Die Interpretation erfolgt durch die jeweiligen Domain-/Simulation-Systeme.

---

# Asset References

Ein Scenario darf referenzieren:

- Biomes
- Maps
- Regions
- Buildings
- Vehicles
- Resources
- Employees
- Recipes
- Technologies
- Objectives
- Missions
- Scenarios
- Rewards
- Effects

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Anzeigenamen und Beschreibungen sollen über Lokalisierungsschlüssel referenziert werden.

Beispiel:

```yaml id="u7k3m5"
localizationKey: scenario.first_factory
```

Die konkrete Lokalisierung wird außerhalb des Scenario-Assets verwaltet.

---

# Validation Rules

Ein Scenario ist gültig, wenn:

- eine eindeutige Asset-ID vorhanden ist
- die Version gültig ist
- eine Kategorie definiert wurde
- eine World-Definition vorhanden ist
- Starting Conditions valide sind
- alle referenzierten Assets existieren
- alle Objectives gültig sind
- alle Victory Conditions gültig sind
- alle Defeat Conditions gültig sind
- keine widersprüchlichen Content Restrictions existieren
- keine ungültigen Szenarioabhängigkeiten bestehen

Zusätzlich gilt:

- `timeLimit` muss größer als 0 sein, sofern definiert
- Startressourcen dürfen keine negativen Mengen besitzen
- Startgeld darf nicht negativ sein
- Startgebäude müssen gültige Building-Assets sein
- Startfahrzeuge müssen gültige Vehicle-Assets sein
- Startmitarbeiter müssen gültige Employee-Assets sein

Ungültige Szenarien dürfen nicht registriert oder geladen werden.

---

# Runtime State Separation

Das Scenario-Asset enthält ausschließlich statische Szenariodefinitionen.

Nicht Bestandteil dieses Schemas sind:

- aktueller Spielerfortschritt
- aktueller Geldbestand
- aktueller Ressourcenbestand
- errichtete Gebäude
- aktuell eingesetzte Fahrzeuge
- Mitarbeiterzuweisungen
- Produktionsfortschritt
- Forschungsfortschritt
- Objective-Fortschritt
- aktuelle Marktpreise
- aktuelle Weltzustände
- Spielzeit

Diese Daten gehören zum dynamischen Spielzustand und werden durch Domain-, Application- und Savegame-Systeme verwaltet.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Scenario-Assets erhöhen deren Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml id="v3r8k1"
id: scenario.first_factory

version: 1

displayName: First Factory

category: campaign

description: Build and operate your first industrial production chain.

difficulty: easy

world:
  biome:
    - biome.temperate

  map:
    - map.industrial_valley

startingConditions:
  money: 100000

  resources:
    resource.iron_ore: 500
    resource.coal: 200

  buildings:
    - building.warehouse
    - building.smelter

  vehicles:
    - vehicle.truck.small

  employees:
    - employee.engineer.basic

availableContent:
  buildings:
    - building.warehouse
    - building.smelter

  vehicles:
    - vehicle.truck.small

  recipes:
    - recipe.steel

  technologies:
    - technology.basic_engineering

objectives:
  primary:
    - objective.produce_1000_steel

  secondary:
    - objective.maintain_positive_cashflow

victoryConditions:
  - type: objective_completed
    objective: objective.produce_1000_steel

defeatConditions:
  - type: bankruptcy

timeLimit: 3600

rewards:
  money: 50000

  unlocks:
    - scenario.industrial_expansion

tags:
  - campaign
  - tutorial
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

---

# Future Extensions

Geplante Erweiterungen:

- Scenario Chains
- Campaign Progression
- Dynamic Objectives
- Objective Dependencies
- Scenario Events
- Scenario Modifiers
- Dynamic Difficulty
- Scenario-specific Economy
- Scenario-specific Market Rules
- Faction Definitions
- AI Opponents
- Scenario-specific World Generation
- Procedural Maps
- Scenario Scripting
- Scenario Milestones
- Multiple Victory Paths
- Optional Objectives
- Hidden Objectives
- Scenario-specific Technology Trees
