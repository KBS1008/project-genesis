# Building.schema.md

**Version:** 1.0  
**Status:** Active  
**Asset Type:** BuildingType  
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert den kanonischen Content-Contract für statische `BuildingType`-Assets in Project Genesis.

Ein `BuildingType` beschreibt die unveränderlichen Eigenschaften eines Gebäudetyps, der aus den Dateien unter `game-content/buildings/` geladen wird.

Der konkrete Zustand eines errichteten Gebäudes gehört dagegen zum Domain-Aggregat `Building`.

Die fachliche Trennung lautet:

```text
BuildingType
    ↓
statische Content-Definition

Building
    ↓
konkrete Runtime-Instanz
```

Dieses Dokument trägt aus historischen Gründen den Dateinamen `Building.schema.md`. Inhaltlich beschreibt es jedoch den implementierten `BuildingTypeDefinition`-Contract.

---

# Architecture

Die BuildingType-Content-Pipeline folgt dem zentralen Content-Modell:

```text
BuildingType YAML
        ↓
BuildingTypeLoader
        ↓
YAML Parsing
        ↓
BuildingTypeValidator
        ↓
Duplicate-ID-Prüfung
        ↓
BuildingTypeRegistry
        ↓
Cross-Registry-Validierung
        ↓
Validated BuildingType Content
```

Relevante Komponenten:

```text
src/content/building/
├── BuildingTypeDefinition.ts
├── BuildingTypeValidator.ts
├── BuildingTypeLoader.ts
└── BuildingTypeRegistry.ts
```

Die statische Definition wird von der Runtime getrennt:

```text
BuildingTypeRegistry
        ↓
PlaceBuildingUseCase
        ↓
Building Aggregate
        ↓
Simulation / Persistence
```

---

# Content Location

BuildingType-Assets liegen unter:

```text
game-content/buildings/
```

Beispiele:

```text
access_road.yaml
coal_power_plant.yaml
headquarters.yaml
power_substation.yaml
sawmill.yaml
smelter.yaml
warehouse.yaml
```

Der Loader verarbeitet Dateien mit folgenden Endungen:

```text
.yaml
.yml
```

Dateien werden in deterministisch sortierter Dateinamenreihenfolge geladen.

---

# Canonical v1 Contract

Der aktuelle `BuildingTypeDefinition`-Contract enthält folgende Felder:

| Feld                 | Typ      | Erforderlich | Beschreibung                               |
| -------------------- | -------- | :----------: | ------------------------------------------ |
| `id`                 | string   |      Ja      | Eindeutige BuildingType-ID                 |
| `name`               | string   |      Ja      | Anzeigename                                |
| `description`        | string   |      Ja      | Beschreibung                               |
| `category`           | enum     |      Ja      | Gebäudekategorie                           |
| `size`               | object   |      Ja      | Breite und Höhe                            |
| `energyUsage`        | number   |      Ja      | Energieverbrauch                           |
| `energyGeneration`   | number   |     Nein     | Energieerzeugung; Standardwert `0`         |
| `maintenanceCost`    | number   |      Ja      | Laufende Wartungskosten                    |
| `constructionCost`   | number   |      Ja      | Baukosten                                  |
| `constructionTime`   | number   |      Ja      | Bauzeit                                    |
| `allowedRecipes`     | string[] |      Ja      | Zulässige Recipe-IDs                       |
| `maxProductionLines` | number   |      Ja      | Maximale Produktionslinien                 |
| `requiredResearch`   | string[] |      Ja      | Erforderliche Technology-IDs               |
| `requiredMilestones` | string[] |      Ja      | Erforderliche Milestone-IDs                |
| `storageCapacity`    | number   |   Bedingt    | Lagerkapazität; für `STORAGE` erforderlich |
| `enabled`            | boolean  |      Ja      | Aktivierungsstatus                         |
| `version`            | number   |      Ja      | Asset-Version                              |

Nicht aufgeführte Felder sind kein Bestandteil des aktuellen v1-Contracts.

---

# Asset Identity

Jeder BuildingType besitzt eine eindeutige ID.

Beispiele:

```text
sawmill
warehouse
coal_power_plant
power_substation
```

Die ID muss folgendem Format entsprechen:

```regex
^[a-z0-9_]+$
```

Gültig:

```text
sawmill
coal_power_plant
research_lab
```

Ungültig:

```text
Sawmill
coal-power-plant
coal power plant
building.sawmill
```

Die aktuelle Implementierung verwendet keine punktseparierten IDs wie:

```text
building.sawmill
```

Referenzen erfolgen mit der tatsächlichen ID:

```yaml
allowedRecipes:
  - recipe_planks
```

Eine ID muss innerhalb der `BuildingTypeRegistry` eindeutig sein.

---

# Name

`name` ist ein nicht leerer String.

Beispiel:

```yaml
name: Sägewerk
```

Der aktuelle v1-Contract verwendet `name`, nicht:

```text
displayName
localizationKey
```

Lokalisierung ist im derzeitigen BuildingType-Contract noch nicht enthalten.

---

# Description

`description` ist ein nicht leerer String.

Beispiel:

```yaml
description: Verarbeitet Holz zu Brettern und Balken.
```

---

# Building Categories

Der aktuelle Contract unterstützt genau folgende Kategorien:

```text
PRODUCTION
ENERGY
STORAGE
INFRASTRUCTURE
ADMINISTRATION
RESEARCH
```

Beispiel:

```yaml
category: PRODUCTION
```

Andere Kategorien wie:

```text
LOGISTICS
TRANSPORT
RESIDENTIAL
SPECIAL
```

sind im aktuellen v1-Validator nicht zulässig.

Neue Kategorien erfordern eine Änderung von:

```text
BuildingCategory
BuildingTypeValidator
Tests
Schema Documentation
```

---

# Size

`size` beschreibt den statischen Platzbedarf eines BuildingType.

Struktur:

```yaml
size:
  width: 3
  height: 3
```

Regeln:

```text
width  >= 1
height >= 1
```

Die aktuelle Feldbezeichnung lautet:

```text
size
```

Nicht:

```text
footprint
```

Die tatsächliche Position eines errichteten Gebäudes gehört zum Runtime-Aggregat `Building`.

---

# Energy Usage

`energyUsage` beschreibt den Energieverbrauch des BuildingType.

Beispiel:

```yaml
energyUsage: 10
```

Regel:

```text
energyUsage >= 0
```

Auch Gebäude ohne Verbrauch müssen das Feld aktuell explizit angeben:

```yaml
energyUsage: 0
```

---

# Energy Generation

`energyGeneration` beschreibt die optionale Energieerzeugung.

Beispiel:

```yaml
energyGeneration: 50
```

Regel:

```text
energyGeneration >= 0
```

Fehlt das Feld, verwendet die Implementierung:

```text
energyGeneration = 0
```

Beispiel eines Verbrauchers ohne Erzeugung:

```yaml
energyUsage: 10
```

Beispiel eines Erzeugers:

```yaml
energyUsage: 5
energyGeneration: 50
```

Die Energieverteilung und tatsächliche Bilanzierung gehören zur Domain-/Application-/Simulationsebene.

---

# Maintenance Cost

`maintenanceCost` beschreibt die laufenden statischen Wartungskosten.

Beispiel:

```yaml
maintenanceCost: 5
```

Regel:

```text
maintenanceCost >= 0
```

Der aktuelle v1-Contract verwendet eine einzelne Zahl und kein Ressourcen- oder Währungsobjekt.

Nicht Bestandteil des aktuellen Contracts:

```yaml
maintenanceCost:
  currency: GC
  amount: 5
```

---

# Construction Cost

`constructionCost` beschreibt die Baukosten.

Beispiel:

```yaml
constructionCost: 5000
```

Regel:

```text
constructionCost >= 0
```

Der aktuelle Contract verwendet eine einzelne numerische Geldsumme.

Nicht unterstützt wird aktuell eine Ressourcenliste wie:

```yaml
constructionCost:
  steel: 200
  wood: 100
```

Die Application-Schicht verarbeitet den Wert über die `ConstructionCostPolicy`.

---

# Construction Time

`constructionTime` beschreibt die Bauzeit.

Beispiel:

```yaml
constructionTime: 120
```

Regel:

```text
constructionTime >= 0
```

Ein Wert von `0` ist gültig und wird beispielsweise für Startinfrastruktur verwendet.

Der aktuelle Baufortschritt gehört zur Runtime-Instanz `Building`.

---

# Allowed Recipes

`allowedRecipes` ist eine Liste zulässiger Recipe-IDs.

Beispiel:

```yaml
allowedRecipes:
  - recipe_planks
  - recipe_advanced_planks
```

Gebäude ohne Produktion verwenden eine leere Liste:

```yaml
allowedRecipes: []
```

Jeder Eintrag muss dem globalen ID-Format entsprechen:

```regex
^[a-z0-9_]+$
```

Zusätzlich muss jede referenzierte Recipe in der `RecipeRegistry` existieren.

---

# Building and Recipe Consistency

BuildingTypes und Recipes besitzen eine bidirektionale Beziehung:

```text
BuildingType.allowedRecipes
        ↕
Recipe.buildingTypes
```

Die normale Content-Validierung prüft mindestens:

```text
BuildingType.allowedRecipes
        ↓
RecipeRegistry
```

Damit darf ein BuildingType keine unbekannte Recipe referenzieren.

Im Strict-Modus wird zusätzlich Symmetrie verlangt:

```text
BuildingType.allowedRecipes
        ↔
Recipe.buildingTypes
```

Beispiel:

```yaml
# BuildingType
id: sawmill
allowedRecipes:
  - recipe_planks
```

und:

```yaml
# Recipe
id: recipe_planks
buildingTypes:
  - sawmill
```

Die strikte Prüfung wird ausgeführt mit:

```text
pnpm validate-content --strict
```

---

# Maximum Production Lines

`maxProductionLines` legt die maximale Anzahl der Produktionslinien fest.

Beispiel:

```yaml
maxProductionLines: 1
```

Regel:

```text
maxProductionLines >= 1
```

Das Feld ist aktuell auch für nicht produzierende Gebäude erforderlich.

Beispiele aus dem aktuellen Content verwenden dort ebenfalls:

```yaml
maxProductionLines: 1
```

Die tatsächliche Nutzung und Belegung der Produktionslinien gehört zum Runtime-Zustand.

---

# Required Research

`requiredResearch` enthält Technology-IDs, die vor dem Bau erfüllt sein müssen.

Beispiel:

```yaml
requiredResearch:
  - basic_woodworking
```

Ohne Voraussetzungen:

```yaml
requiredResearch: []
```

Jede ID muss:

- dem globalen ID-Format entsprechen
- in der `TechnologyRegistry` existieren

Die Referenzvalidierung erfolgt über:

```text
validateResearchReferences.ts
```

Nicht zulässig sind Dateipfade oder Runtime-ResearchJob-IDs.

---

# Required Milestones

`requiredMilestones` enthält Milestone-IDs, die vor dem Bau erreicht sein müssen.

Beispiel:

```yaml
requiredMilestones:
  - first_profit
```

Ohne Voraussetzungen:

```yaml
requiredMilestones: []
```

Jede ID muss:

- dem globalen ID-Format entsprechen
- in der `MilestoneRegistry` existieren

Die aktuelle Implementierung verwendet IDs ohne Präfix:

```text
first_profit
first_production
```

Nicht:

```text
milestone.first_profit
```

Die Referenzvalidierung erfolgt über:

```text
validateMilestoneReferences.ts
```

---

# Storage Capacity

`storageCapacity` beschreibt die statische Lagerkapazität.

Beispiel:

```yaml
storageCapacity: 500
```

Regel, sofern angegeben:

```text
storageCapacity >= 1
```

Für Gebäude der Kategorie:

```text
STORAGE
```

ist eine positive `storageCapacity` zwingend erforderlich.

Damit gilt:

```text
category == STORAGE
    ⇒
storageCapacity >= 1
```

Für andere Gebäudekategorien darf das Feld fehlen. In diesem Fall verwendet die Implementierung:

```text
storageCapacity = 0
```

Beispiel:

```yaml
id: warehouse
category: STORAGE
storageCapacity: 500
```

Die tatsächlich belegte Lagerkapazität gehört zum Runtime-Zustand `BuildingStorage`, nicht zur statischen Definition.

---

# Enabled

`enabled` legt fest, ob der BuildingType aktiv verfügbar ist.

Beispiel:

```yaml
enabled: true
```

Das Feld muss ein Boolean sein.

Gültig:

```yaml
enabled: true
```

```yaml
enabled: false
```

Ungültig:

```yaml
enabled: 'true'
```

Der genaue Umgang mit deaktiviertem Content wird durch Bootstrap-, Registry- und Application-Logik bestimmt.

---

# Version

`version` ist die Asset-Version.

Beispiel:

```yaml
version: 1
```

Regel:

```text
version >= 1
```

Der Validator prüft aktuell einen numerischen Mindestwert, aber keine Ganzzahligkeit.

Aus fachlicher Sicht sollte `version` dennoch als positive Ganzzahl verwendet werden.

Eine Änderung der BuildingType-ID kann andere Content-Referenzen und Savegame-Daten ungültig machen und erfordert daher eine kontrollierte Migration.

---

# Complete Example

## Production Building

```yaml
id: sawmill
name: Sägewerk
description: Verarbeitet Holz zu Brettern und Balken.
category: PRODUCTION

size:
  width: 3
  height: 3

energyUsage: 10
maintenanceCost: 5
constructionCost: 5000
constructionTime: 120

allowedRecipes:
  - recipe_planks
  - recipe_advanced_planks

maxProductionLines: 1

requiredResearch: []
requiredMilestones: []

enabled: true
version: 1
```

---

## Energy Building

```yaml
id: coal_power_plant
name: Kohlekraftwerk
description: Erzeugt Energie für Produktionsgebäude.
category: ENERGY

size:
  width: 5
  height: 4

energyUsage: 5
energyGeneration: 50

maintenanceCost: 12
constructionCost: 18000
constructionTime: 180

allowedRecipes: []
maxProductionLines: 1

requiredResearch: []

requiredMilestones:
  - first_profit

enabled: true
version: 1
```

---

## Storage Building

```yaml
id: warehouse
name: Lagerhaus
description: Lagert feste Ressourcen in grosser Menge.
category: STORAGE

size:
  width: 4
  height: 4

energyUsage: 2
maintenanceCost: 3
constructionCost: 3000
constructionTime: 90

allowedRecipes: []
maxProductionLines: 1

storageCapacity: 500

requiredResearch: []

requiredMilestones:
  - first_profit

enabled: true
version: 1
```

---

# Validation Rules

Ein BuildingType ist gültig, wenn:

- der Root-Wert ein Objekt ist
- `id` ein nicht leerer String ist
- `id` dem globalen ID-Format entspricht
- `id` innerhalb der Registry eindeutig ist
- `name` ein nicht leerer String ist
- `description` ein nicht leerer String ist
- `category` eine unterstützte Kategorie ist
- `size` ein Objekt ist
- `size.width >= 1`
- `size.height >= 1`
- `energyUsage >= 0`
- `energyGeneration >= 0`, sofern angegeben
- `maintenanceCost >= 0`
- `constructionCost >= 0`
- `constructionTime >= 0`
- `allowedRecipes` ein String-Array gültiger IDs ist
- `maxProductionLines >= 1`
- `requiredResearch` ein String-Array gültiger IDs ist
- `requiredMilestones` ein String-Array gültiger IDs ist
- `storageCapacity >= 1`, sofern angegeben
- `STORAGE`-Gebäude eine positive `storageCapacity` besitzen
- `enabled` ein Boolean ist
- `version >= 1`

Zusätzlich werden Cross-Registry-Referenzen geprüft:

```text
allowedRecipes
    ↓
RecipeRegistry

requiredResearch
    ↓
TechnologyRegistry

requiredMilestones
    ↓
MilestoneRegistry
```

---

# Registry Contract

Alle validierten BuildingType-Definitionen werden in der `BuildingTypeRegistry` gespeichert.

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

Andere Systeme referenzieren BuildingTypes ausschließlich über IDs.

Zulässig:

```yaml
buildingTypes:
  - sawmill
```

Nicht zulässig:

```yaml
buildingTypes:
  - ./buildings/sawmill.yaml
```

---

# Static vs. Runtime Boundary

## Static Content

```text
BuildingType
├── id
├── name
├── description
├── category
├── size
├── energyUsage
├── energyGeneration
├── maintenanceCost
├── constructionCost
├── constructionTime
├── allowedRecipes
├── maxProductionLines
├── requiredResearch
├── requiredMilestones
├── storageCapacity
├── enabled
└── version
```

## Runtime State

```text
Building
├── runtime id
├── company id
├── building type id
├── position
├── status
├── construction progress
└── weitere dynamische Zustände
```

Zusätzlicher Runtime-Lagerzustand:

```text
BuildingStorage
├── building id
├── aktuelle Bestände
├── reservierte Mengen
└── belegte Kapazität
```

Nicht in das BuildingType-Asset gehören:

- Runtime-Building-ID
- Company-ID
- konkrete Position
- Baufortschritt
- aktueller Gebäudestatus
- aktuelle Produktion
- aktueller Lagerbestand
- zugewiesene Mitarbeiter
- zugewiesene Fahrzeuge
- Wartungszustand
- temporäre Effekte

---

# Not Part of v1

Die folgenden Felder aus früheren Schemaentwürfen sind **nicht** Teil des aktuellen v1-Contracts:

```text
displayName
buildingType
footprint
icon
model
localizationKey
tags
requirements
workforce
production
storage
energy
logistics
research
upgrades
```

Ebenfalls nicht unterstützt:

```yaml
constructionCost:
  steel: 200
  wood: 100
```

oder:

```yaml
energy:
  consumption: 10
  production: 50
```

Der aktuelle Contract verwendet stattdessen flache Felder:

```yaml
constructionCost: 5000
energyUsage: 10
energyGeneration: 50
```

Solche Erweiterungen dürfen erst nach Anpassung von Definition, Validator, Loader, Tests und Dokumentation als aktiver Contract aufgenommen werden.

---

# Current Implementation Scope

Der aktuelle BuildingType-Contract umfasst:

```text
BuildingTypeDefinition
BuildingTypeValidator
BuildingTypeLoader
BuildingTypeRegistry
Loader Tests
Duplicate-ID Validation
Building/Recipe Consistency Validation
Research Reference Validation
Milestone Reference Validation
Runtime Building Creation
```

---

# Compatibility

Dieses Schema steht insbesondere in Beziehung zu:

```text
ResourceType.Schema.md
Recipe.Schema.md
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
BuildingType.allowedRecipes
        ↓
RecipeRegistry

BuildingType.requiredResearch
        ↓
TechnologyRegistry

BuildingType.requiredMilestones
        ↓
MilestoneRegistry
```

---

# Implementation Status

**Status:** Active

`BuildingType` ist ein vollständig implementierter Content-Typ der Project-Genesis-Content-Pipeline.

Bei Abweichungen zwischen Dokumentation und Implementierung gilt:

1. tatsächlichen `BuildingTypeDefinition`-Contract feststellen
2. `BuildingTypeValidator` prüfen
3. YAML-Assets prüfen
4. Cross-Registry-Regeln prüfen
5. Dokumentation oder Implementierung synchronisieren
6. Tests aktualisieren
7. `pnpm validate-content --strict` ausführen

Die Dokumentation darf keine nicht implementierten BuildingType-Eigenschaften als aktive v1-Funktionalität ausweisen.
