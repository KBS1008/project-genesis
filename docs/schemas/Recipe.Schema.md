# Recipe.Schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** Recipe  
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert den kanonischen Content-Contract für statische `Recipe`-Assets in Project Genesis.

Ein `Recipe` beschreibt eine unveränderliche Produktionsdefinition, die aus den Dateien unter `game-content/recipes/` geladen wird.

Die tatsächliche Ausführung eines Recipes gehört zum Domain-Aggregat `ProductionJob` und zur Simulation.

Die fachliche Trennung lautet:

```text
Recipe
    ↓
statische Content-Definition

ProductionJob
    ↓
konkreter Produktionslauf
```

Dieses Dokument beschreibt den implementierten `RecipeDefinition`-Contract.

---

# Architecture

Die Recipe-Content-Pipeline folgt dem zentralen Content-Modell:

```text
Recipe YAML
        ↓
RecipeLoader
        ↓
YAML Parsing
        ↓
RecipeValidator
        ↓
Duplicate-ID-Prüfung
        ↓
RecipeRegistry
        ↓
Cross-Registry-Validierung
        ↓
Validated Recipe Content
```

Relevante Komponenten:

```text
src/content/recipe/
├── RecipeDefinition.ts
├── RecipeValidator.ts
├── RecipeLoader.ts
└── RecipeRegistry.ts
```

Die statische Definition wird von der Runtime getrennt:

```text
RecipeRegistry
        ↓
StartProductionUseCase
        ↓
ProductionJob
        ↓
Simulation / Persistence
```

---

# Content Location

Recipe-Assets liegen unter:

```text
game-content/recipes/
```

Beispiele:

```text
recipe_planks.yaml
recipe_steel.yaml
recipe_advanced_planks.yaml
```

Der Loader verarbeitet Dateien mit folgenden Endungen:

```text
.yaml
.yml
```

Dateien werden in deterministisch sortierter Dateinamenreihenfolge geladen.

---

# Canonical v1 Contract

Der aktuelle `RecipeDefinition`-Contract enthält folgende Felder:

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | :---: | --- |
| `id` | string | Ja | Nicht leer, globales ID-Format |
| `name` | string | Ja | Nicht leer |
| `description` | string | Ja | Nicht leer |
| `version` | number | Ja | `>= 1` |
| `category` | enum | Ja | Unterstützte Recipe-Kategorie |
| `buildingTypes` | string[] | Ja | Mindestens ein Eintrag |
| `inputs` | object[] | Ja | Mindestens ein Eintrag |
| `outputs` | object[] | Ja | Mindestens ein Eintrag |
| `duration` | number | Ja | `>= 1` |
| `energy` | number | Ja | `>= 0` |
| `workers` | number | Ja | `>= 0` |
| `requiredResearch` | string[] | Ja | Gültige IDs |
| `requiredMilestones` | string[] | Ja | Gültige IDs |
| `maintenanceCost` | number | Ja | `>= 0` |
| `productionCost` | number | Ja | `>= 0` |
| `experience` | number | Ja | `>= 0` |
| `tags` | string[] | Ja | Array von Strings |
| `enabled` | boolean | Ja | Boolean |

Alle Felder sind im aktuellen Validator verpflichtend.

Der Validator definiert aktuell keine optionalen Recipe-Felder und setzt keine Defaultwerte.

Nicht aufgeführte Felder sind kein Bestandteil des aktuellen v1-Contracts.

---

# Complete Structural Overview

```text
Recipe
├── id
├── name
├── description
├── version
├── category
├── buildingTypes[]
├── inputs[]
│   ├── resource
│   └── amount
├── outputs[]
│   ├── resource
│   └── amount
├── duration
├── energy
├── workers
├── requiredResearch[]
├── requiredMilestones[]
├── maintenanceCost
├── productionCost
├── experience
├── tags[]
└── enabled
```

---

# Asset Identity

Jedes Recipe besitzt eine eindeutige ID.

Beispiele:

```text
recipe_planks
recipe_steel
recipe_advanced_planks
```

Die ID muss folgendem Format entsprechen:

```regex
^[a-z0-9_]+$
```

Gültig:

```text
recipe_planks
recipe_steel
```

Ungültig:

```text
Recipe_Planks
recipe-planks
recipe.planks
```

Die ID muss innerhalb der `RecipeRegistry` eindeutig sein.

---

# Name

`name` ist ein nicht leerer String.

Beispiel:

```yaml
name: Bretter herstellen
```

Der aktuelle v1-Contract verwendet `name`, nicht:

```text
displayName
localizationKey
```

---

# Description

`description` ist ein nicht leerer String.

Beispiel:

```yaml
description: Verarbeitung von Holz zu Brettern.
```

---

# Version

`version` ist eine numerische Asset-Version.

Beispiel:

```yaml
version: 1
```

Regel:

```text
version >= 1
```

---

# Category

Der aktuelle Contract unterstützt genau folgende Kategorien:

```text
WOOD
METAL
CHEMICAL
FOOD
ENERGY
ELECTRONICS
TEXTILE
LOGISTICS
```

Beispiel:

```yaml
category: WOOD
```

Andere Kategorien sind im aktuellen v1-Validator nicht zulässig.

---

# Building Types

`buildingTypes` listet die BuildingType-IDs, in denen das Recipe produziert werden darf.

Beispiel:

```yaml
buildingTypes:
  - sawmill
```

Regeln:

- Array von Strings,
- mindestens ein Eintrag,
- globales ID-Format,
- jeder BuildingType muss in der `BuildingTypeRegistry` existieren.

`buildingTypes` ist nicht dasselbe wie allgemeine Gebäudevoraussetzungen außerhalb der Produktionszuordnung.

Die bidirektionale Beziehung zu `BuildingType.allowedRecipes` wird unter [Building and Recipe Consistency](#building-and-recipe-consistency) beschrieben.

---

# Inputs

`inputs` beschreibt pro Produktionszyklus verbrauchte Ressourcen.

Struktur:

```yaml
inputs:
  - resource: wood
    amount: 10
```

Regeln:

- nicht leeres Array,
- jeder Eintrag ist ein Objekt,
- `resource` ist eine nicht leere ID im globalen Format,
- `amount >= 1`,
- jede Ressource muss in der `ResourceTypeRegistry` existieren.

---

# Outputs

`outputs` beschreibt pro Produktionszyklus erzeugte Ressourcen.

Struktur:

```yaml
outputs:
  - resource: planks
    amount: 20
```

Regeln entsprechen denen von `inputs`.

---

# Duration

`duration` beschreibt die Dauer eines Produktionszyklus.

Beispiel:

```yaml
duration: 60
```

Regel:

```text
duration >= 1
```

Die Einheit wird von der Simulation interpretiert.

---

# Energy

`energy` beschreibt den statischen Energiebedarf pro Produktionszyklus.

Beispiel:

```yaml
energy: 12
```

Regel:

```text
energy >= 0
```

Der aktuelle Contract verwendet eine flache Zahl, kein verschachteltes Energieobjekt.

---

# Workers

`workers` beschreibt den statischen Mitarbeiterbedarf pro Produktionszyklus.

Beispiel:

```yaml
workers: 2
```

Regel:

```text
workers >= 0
```

Die tatsächliche Zuweisung von Mitarbeitern gehört zum dynamischen Spielzustand.

---

# Required Research

`requiredResearch` enthält Technology-IDs, die vor Nutzung des Recipes erfüllt sein müssen.

Beispiel:

```yaml
requiredResearch:
  - basic_woodworking
```

Ohne Research-Anforderungen:

```yaml
requiredResearch: []
```

Regeln:

- Array von Strings,
- globales ID-Format,
- jede Technology muss in der `TechnologyRegistry` existieren.

Die Cross-Registry-Prüfung erfolgt nach dem Laden über:

```text
validateResearchReferences.ts
```

---

# Required Milestones

`requiredMilestones` enthält Milestone-IDs, die vor Nutzung des Recipes erreicht sein müssen.

Beispiel:

```yaml
requiredMilestones:
  - first_production
```

Ohne Milestone-Anforderungen:

```yaml
requiredMilestones: []
```

Regeln:

- Array von Strings,
- globales ID-Format,
- jeder Milestone muss in der `MilestoneRegistry` existieren.

Die Cross-Registry-Prüfung erfolgt über:

```text
validateMilestoneReferences.ts
```

---

# Maintenance Cost

`maintenanceCost` beschreibt einen statischen Kostenwert der Recipe.

Beispiel:

```yaml
maintenanceCost: 2
```

Regel:

```text
maintenanceCost >= 0
```

---

# Production Cost

`productionCost` beschreibt einen statischen Produktionskostenwert.

Beispiel:

```yaml
productionCost: 1
```

Regel:

```text
productionCost >= 0
```

---

# Experience

`experience` beschreibt einen statischen Erfahrungswert.

Beispiel:

```yaml
experience: 5
```

Regel:

```text
experience >= 0
```

---

# Tags

`tags` ist ein Array von Strings.

Beispiel:

```yaml
tags:
  - basic
  - wood
```

Der Validator prüft nur, dass es ein String-Array ist.

---

# Enabled

`enabled` steuert, ob das Recipe aktiv geladen und verwendet werden darf.

Beispiel:

```yaml
enabled: true
```

Regel:

```text
enabled ist ein Boolean
```

---

# Cross-Registry References

Der Recipe-Contract referenziert andere Content-Registries:

```text
Recipe
├── buildingTypes[]
│       ↓
│   BuildingTypeRegistry
│
├── inputs[].resource
│       ↓
│   ResourceTypeRegistry
│
├── outputs[].resource
│       ↓
│   ResourceTypeRegistry
│
├── requiredResearch
│       ↓
│   TechnologyRegistry
│
└── requiredMilestones
        ↓
    MilestoneRegistry
```

---

# Validation Timing

Nicht alle Referenzen werden im selben Schritt geprüft.

## Während des Recipe-Ladens

Der `RecipeLoader` übergibt:

```text
ResourceTypeRegistry
BuildingTypeRegistry
```

an den `RecipeValidator`.

Dadurch werden unmittelbar geprüft:

```text
buildingTypes
inputs[].resource
outputs[].resource
```

## Nach dem Laden aller Registries

Später prüft die zentrale Content-Validierung:

```text
requiredResearch
    ↓
TechnologyRegistry

requiredMilestones
    ↓
MilestoneRegistry
```

---

# Building and Recipe Consistency

Zwischen BuildingType und Recipe besteht eine bidirektionale Beziehung:

```text
BuildingType.allowedRecipes
        ↕
Recipe.buildingTypes
```

Beispiel:

```yaml
# BuildingType
id: sawmill
allowedRecipes:
  - recipe_planks
```

```yaml
# Recipe
id: recipe_planks
buildingTypes:
  - sawmill
```

## Standardvalidierung

Die normale Content-Validierung prüft mindestens:

```text
BuildingType.allowedRecipes
        ↓
RecipeRegistry
```

## Strict-Modus

Im Strict-Modus muss zusätzlich die Beziehung symmetrisch sein:

```text
pnpm validate-content --strict
```

---

# Validation Rules

Eine Recipe ist gültig, wenn:

- der Root-Wert ein Objekt ist,
- `id` ein nicht leerer String ist,
- `id` dem globalen ID-Format entspricht,
- `id` innerhalb der Registry eindeutig ist,
- `name` ein nicht leerer String ist,
- `description` ein nicht leerer String ist,
- `version >= 1`,
- `category` unterstützt wird,
- `buildingTypes` ein nicht leeres Array gültiger IDs ist,
- alle `buildingTypes` existieren,
- `inputs` ein nicht leeres Array ist,
- jeder Input ein Objekt ist,
- jeder Input eine gültige `resource` besitzt,
- jeder Input `amount >= 1` besitzt,
- alle Input-Ressourcen existieren,
- `outputs` ein nicht leeres Array ist,
- jeder Output ein Objekt ist,
- jeder Output eine gültige `resource` besitzt,
- jeder Output `amount >= 1` besitzt,
- alle Output-Ressourcen existieren,
- `duration >= 1`,
- `energy >= 0`,
- `workers >= 0`,
- `requiredResearch` ein Array gültiger IDs ist,
- alle `requiredResearch`-Referenzen existieren,
- `requiredMilestones` ein Array gültiger IDs ist,
- alle `requiredMilestones`-Referenzen existieren,
- `maintenanceCost >= 0`,
- `productionCost >= 0`,
- `experience >= 0`,
- `tags` ein Array von Strings ist,
- `enabled` ein Boolean ist.

Im Strict-Modus muss zusätzlich die BuildingType-/Recipe-Beziehung symmetrisch sein.

---

# Important Current Validator Characteristics

Der aktuelle Validator:

- verlangt alle Contract-Felder,
- ignoriert unbekannte zusätzliche Root-Felder,
- erzwingt für numerische Felder keine Ganzzahligkeit,
- prüft keine doppelten Array-Einträge,
- prüft keine leeren Strings in `tags`.

Diese Eigenschaften sind Teil des aktuellen Implementierungsstands, aber nicht zwingend das langfristig gewünschte Qualitätsniveau.

---

# Static vs. Runtime Boundary

## Static Content

```text
Recipe
├── id
├── name
├── description
├── version
├── category
├── buildingTypes
├── inputs
├── outputs
├── duration
├── energy
├── workers
├── requiredResearch
├── requiredMilestones
├── maintenanceCost
├── productionCost
├── experience
├── tags
└── enabled
```

## Runtime State

```text
ProductionJob
├── company id
├── building id
├── recipe id
├── status
├── progress
└── weitere dynamische Zustände
```

Nicht Bestandteil des Recipe-Assets sind:

- aktueller Produktionsfortschritt,
- reservierte Ressourcen,
- tatsächlich verbrauchte Ressourcen,
- zugewiesene Mitarbeiter,
- aktuelle Energiebilanz,
- Produktionsfehler,
- Produktionshistorie.

---

# Complete Example: Basic Production

```yaml
id: recipe_planks
name: Bretter herstellen
description: Verarbeitung von Holz zu Brettern.
version: 1
category: WOOD

buildingTypes:
  - sawmill

inputs:
  - resource: wood
    amount: 10

outputs:
  - resource: planks
    amount: 20

duration: 60
energy: 12
workers: 2

requiredResearch: []
requiredMilestones: []

maintenanceCost: 2
productionCost: 1
experience: 5

tags:
  - basic
  - wood

enabled: true
```

---

# Complete Example: Research and Milestone Requirements

```yaml
id: recipe_advanced_planks
name: Advanced Plank Production
description: Improved plank production requiring woodworking research.
version: 1
category: WOOD

buildingTypes:
  - sawmill

inputs:
  - resource: wood
    amount: 10

outputs:
  - resource: planks
    amount: 25

duration: 60
energy: 12
workers: 2

requiredResearch:
  - basic_woodworking

requiredMilestones:
  - first_production

maintenanceCost: 2
productionCost: 1
experience: 5

tags:
  - advanced
  - wood

enabled: true
```

---

# Complete Example: Metal Production

```yaml
id: recipe_steel
name: Stahl schmelzen
description: Schmelzt Eisenerz zu Stahl.
version: 1
category: METAL

buildingTypes:
  - smelter

inputs:
  - resource: iron_ore
    amount: 5

outputs:
  - resource: steel
    amount: 2

duration: 90
energy: 20
workers: 3

requiredResearch: []
requiredMilestones: []

maintenanceCost: 3
productionCost: 2
experience: 8

tags:
  - steel
  - smelting

enabled: true
```

---

# Registry Contract

Alle validierten Recipe-Definitionen werden in der `RecipeRegistry` gespeichert.

Die Registry bietet:

```text
register()
get()
getRequired()
getAll()
has()
size
```

Doppelte IDs werden abgelehnt.

`getAll()` liefert die Definitionen deterministisch nach ID sortiert.

Andere Systeme referenzieren Recipes ausschließlich über IDs.

---

# Not Part of v1

Die folgenden Felder aus früheren Schemaentwürfen sind **nicht** Teil des aktuellen v1-Contracts:

```text
requiredBuildings
requiredResources
displayName
localizationKey
buildingRequirements
byproducts
workforce
requirements
productionModifiers
quality
icon
```

`requiredBuildings` und `requiredResources` waren frühere Entwurfsfelder für zusätzliche Gebäude- bzw. Ressourcenvoraussetzungen.

Sie sind weder Teil von `RecipeDefinition` noch Teil von `RecipeValidator` und werden in den offiziellen Recipe-YAML-Assets nicht verwendet.

Gebäudebezogene Produktionszuordnung erfolgt über `buildingTypes`.

Ressourcenbezogene Verbrauchs- und Erzeugungslogik erfolgt über `inputs` und `outputs`.

Ebenfalls nicht unterstützt:

```yaml
inputs:
  resource.iron_ore: 100
```

Der aktuelle Contract verwendet stattdessen:

```yaml
inputs:
  - resource: iron_ore
    amount: 100
```

Solche Erweiterungen dürfen erst nach Anpassung von Definition, Validator, Loader, Tests und Dokumentation als aktiver Contract aufgenommen werden.

---

# Current Contract Gaps

Der Audit hat folgende Lücken im aktuellen Code-Contract identifiziert:

1. Unbekannte zusätzliche Felder werden nicht abgelehnt.
2. Doppelte IDs innerhalb von Referenz- und Tag-Arrays werden nicht erkannt.
3. Doppelte Ressourcen innerhalb von `inputs` oder `outputs` werden nicht erkannt.
4. Numerische Felder werden nicht auf Ganzzahligkeit geprüft.
5. `version` wird nicht auf Ganzzahligkeit geprüft.
6. `tags` dürfen leere Strings enthalten.

Diese Punkte sind Audit-Ergebnisse und keine bereits implementierten Regeln.

---

# Current Implementation Scope

Der aktuelle Recipe-Contract umfasst:

```text
RecipeDefinition
RecipeValidator
RecipeLoader
RecipeRegistry
Loader Tests
Duplicate-ID Validation
Building/Recipe Consistency Validation
Research Reference Validation
Milestone Reference Validation
Runtime Production Start
```

---

# Compatibility

Dieses Schema steht insbesondere in Beziehung zu:

```text
ResourceType.Schema.md
Building.schema.md
Technology.schema.md
Milestone.schema.md
Production.Schema.md
```

sowie zu:

```text
ASSET_ID_SYSTEM.md
ASSET_VERSIONING.md
REGISTRY_SCHEMA.md
GLOBAL_ASSET_REGISTRY.md
CONTENT_PIPELINE.md
```

Die wichtigsten Cross-Registry-Beziehungen sind:

```text
Recipe.buildingTypes
        ↓
BuildingTypeRegistry

Recipe.inputs / Recipe.outputs
        ↓
ResourceTypeRegistry

Recipe.requiredResearch
        ↓
TechnologyRegistry

Recipe.requiredMilestones
        ↓
MilestoneRegistry

BuildingType.allowedRecipes
        ↓
RecipeRegistry
```

---

# Implementation Status

**Status:** Active

`Recipe` ist ein vollständig implementierter Content-Typ der Project-Genesis-Content-Pipeline.

Bei Abweichungen zwischen Dokumentation und Implementierung gilt:

1. tatsächlichen `RecipeDefinition`-Contract feststellen
2. `RecipeValidator` prüfen
3. YAML-Assets prüfen
4. Cross-Registry-Regeln prüfen
5. Dokumentation oder Implementierung synchronisieren
6. Tests aktualisieren
7. `pnpm validate-content --strict` ausführen

Die Dokumentation darf keine nicht implementierten Recipe-Eigenschaften als aktive v1-Funktionalität ausweisen.
