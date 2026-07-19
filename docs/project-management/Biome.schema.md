# Biome.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Biome
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Biome-Assets in Project Genesis.

Ein Biome beschreibt eine charakteristische natürliche oder künstlich definierte Umweltregion.

Biome können unter anderem folgende Eigenschaften definieren:

- Klima
- Temperatur
- Niederschlag
- Vegetation
- Terrain
- natürliche Ressourcen
- Umweltbedingungen
- Gefahren
- Energiepotenzial
- Bau- und Logistikbedingungen

Biome bilden einen wesentlichen Bestandteil der Weltdefinition und können von Szenarien, Karten und World-Generation-Systemen referenziert werden.

Das Biome-Asset definiert ausschließlich statische Eigenschaften.

Der aktuelle Zustand einer konkreten Region gehört zum dynamischen Weltzustand.

Das Schema dient als Grundlage für:

- JSON-Assets
- Asset Registry
- Content Pipeline
- World Generation
- Map Generation
- Validierung
- Editor
- Modding
- Szenarien

---

# Asset Identity

Jedes Biome besitzt eine eindeutige Asset-ID.

Beispiele:

```text
biome.temperate
biome.forest
biome.desert
biome.arctic
biome.tundra
biome.tropical
biome.mountain
biome.coastal
biome.ocean
```

Die Asset-ID bleibt über die gesamte Lebensdauer eines Assets stabil.

---

# Required Fields

| Feld        | Typ     | Beschreibung         |
| ----------- | ------- | -------------------- |
| id          | string  | Eindeutige Asset-ID  |
| version     | integer | Asset-Version        |
| displayName | string  | Anzeigename          |
| category    | string  | Biome-Kategorie      |
| description | string  | Beschreibung         |
| climate     | object  | Klimadefinition      |
| terrain     | object  | Geländeeigenschaften |

---

# Optional Fields

| Feld            | Typ    |
| --------------- | ------ |
| icon            | string |
| localizationKey | string |
| tags            | array  |
| temperature     | object |
| precipitation   | object |
| vegetation      | object |
| resources       | object |
| hazards         | object |
| environment     | object |
| energy          | object |
| construction    | object |
| logistics       | object |
| wildlife        | object |

---

# Biome Categories

Empfohlene Kategorien:

```yaml id="v6q3m8"
temperate
tropical
arid
polar
mountain
coastal
ocean
wetland
forest
desert
special
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Climate

Die Klimadefinition beschreibt die grundlegenden klimatischen Eigenschaften.

Beispiel:

```yaml id="x2n7k4"
climate:
  type: temperate

  averageTemperature: 15

  temperatureRange:
    minimum: -10
    maximum: 35

  precipitation: 800
```

Die konkreten Einheiten müssen mit den zentralen World- und Simulation-Systemen übereinstimmen.

---

# Temperature

Optional können detaillierte Temperaturbereiche definiert werden.

Beispiel:

```yaml id="q5r8m1"
temperature:
  average: 15

  minimum: -10

  maximum: 35

  seasonalVariation: 0.8
```

Das Biome definiert statische Parameter.

Die tatsächliche Temperatur einer konkreten Region kann durch:

- Jahreszeit
- Wetter
- Höhenlage
- Simulation

verändert werden.

---

# Precipitation

Niederschlag kann als statischer Biome-Parameter definiert werden.

Beispiel:

```yaml id="p3w9s6"
precipitation:
  average: 800

  variability: 0.2

  type:
    - rain
```

Mögliche Niederschlagsarten:

```text
rain
snow
hail
monsoon
none
```

---

# Terrain

Terrain beschreibt die grundlegenden Geländeeigenschaften.

Beispiel:

```yaml id="m7k2v5"
terrain:
  type: plains

  elevation:
    minimum: 0
    maximum: 200

  slope:
    minimum: 0
    maximum: 15

  roughness: 0.2
```

Mögliche Terrain-Typen:

```text
plains
hills
mountains
valley
plateau
coast
ocean
swamp
ice
```

---

# Vegetation

Ein Biome kann typische Vegetation definieren.

Beispiel:

```yaml id="d4n8q2"
vegetation:
  density: 0.8

  types:
    - forest
    - grass

  renewableResources:
    - resource.wood
```

Die tatsächliche Platzierung und Menge von Vegetation gehört zur World-Generation- oder Simulationsebene.

---

# Natural Resources

Biome können natürliche Ressourcen bereitstellen.

Beispiel:

```yaml id="f6y3p9"
resources:
  available:
    - resource.iron_ore
    - resource.coal
    - resource.water

  abundance:
    resource.iron_ore: 0.8
    resource.coal: 0.5
    resource.water: 1.0
```

Die Werte definieren relative Verfügbarkeit.

Die tatsächlichen Vorkommen einer Region werden durch die World Generation erzeugt.

---

# Resource Distribution

Optional kann die Verteilung natürlicher Ressourcen beschrieben werden.

Beispiel:

```yaml id="k1m7r4"
resources:
  distribution:
    resource.iron_ore:
      density: 0.6
      clustering: 0.8

    resource.water:
      density: 1.0
      clustering: 0.2
```

Mögliche Parameter:

- density
- clustering
- depth
- accessibility

---

# Hazards

Biome können natürliche Gefahren definieren.

Beispiel:

```yaml id="s8v2n5"
hazards:
  - type: extreme_cold
    severity: 0.8

  - type: blizzard
    severity: 0.5
```

Mögliche Gefahren:

```text
extreme_heat
extreme_cold
blizzard
sandstorm
flood
drought
storm
volcanic_activity
landslide
```

Die konkrete Auswirkung auf Gebäude, Fahrzeuge und Mitarbeiter wird durch die Domain-/Simulationsebene bestimmt.

---

# Environment

Optionale Umweltparameter können definiert werden.

Beispiel:

```yaml id="w4q9m3"
environment:
  airQuality: 1.0

  pollutionResistance: 0.8

  ecosystemSensitivity: 0.6
```

Diese Parameter dienen als statische Grundlage für Umwelt- und Ökosystemsimulationen.

---

# Energy Potential

Biome können natürliche Energiequellen definieren.

Beispiel:

```yaml id="n2p7k5"
energy:
  sources:
    - type: solar
      potential: 0.8

    - type: wind
      potential: 0.6

    - type: hydro
      potential: 0.4
```

Mögliche Energiequellen:

```text
solar
wind
hydro
geothermal
biomass
```

Die tatsächliche Energieproduktion erfolgt durch entsprechende Gebäude und Systeme.

---

# Construction

Biome können allgemeine Baubedingungen definieren.

Beispiel:

```yaml id="r5x8d1"
construction:
  buildability: 0.9

  foundationDifficulty: 0.2

  terrainModificationCost: 1.0
```

Diese Werte sind statische Modifikatoren.

Die tatsächlichen Baukosten werden durch Gebäude, Terrain und Simulation bestimmt.

---

# Logistics

Biome können logistische Rahmenbedingungen definieren.

Beispiel:

```yaml id="j3m6v9"
logistics:
  accessibility: 0.9

  roadConstructionDifficulty: 0.2

  transportEfficiency: 1.0
```

Diese Parameter können von Transport- und Logistiksystemen verwendet werden.

---

# Asset References

Ein Biome darf referenzieren:

- Resources
- Buildings
- Vehicles
- Technologies
- Effects
- Hazards
- Energy Types

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Anzeigenamen und Beschreibungen sollen über Lokalisierungsschlüssel referenziert werden.

Beispiel:

```yaml id="t7q2n4"
localizationKey: biome.temperate
```

Die konkrete Lokalisierung wird außerhalb des Biome-Assets verwaltet.

---

# Validation Rules

Ein Biome ist gültig, wenn:

- eine eindeutige Asset-ID vorhanden ist
- die Version gültig ist
- eine Kategorie definiert wurde
- eine Climate-Definition vorhanden ist
- eine Terrain-Definition vorhanden ist
- Temperaturgrenzen konsistent sind
- alle Ressourcenreferenzen gültig sind
- alle Hazard-Definitionen gültig sind
- alle Energiequellen gültige Typen besitzen
- alle numerischen Modifikatoren innerhalb definierter Bereiche liegen

Zusätzlich gilt:

- `minimum` darf nicht größer als `maximum` sein
- Dichten müssen ≥ 0 sein
- relative Abundanzwerte müssen ≥ 0 sein
- Potenzialwerte müssen innerhalb des definierten Wertebereichs liegen

Ungültige Biome dürfen nicht registriert oder geladen werden.

---

# Runtime State Separation

Das Biome-Asset enthält ausschließlich statische Umweltparameter.

Nicht Bestandteil dieses Schemas sind:

- aktuelle Wetterlage
- aktuelle Temperatur
- aktuelle Niederschlagsmenge
- aktuelle Ressourcenbestände
- erschöpfte Ressourcen
- aktuelle Vegetationsdichte
- aktuelle Umweltverschmutzung
- aktuelle Naturkatastrophen
- aktuelle Gebäude
- aktuelle Straßen
- aktuelle Fahrzeuge
- aktuelle Mitarbeiter

Diese Daten gehören zum dynamischen Welt- und Spielzustand.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Biome-Assets erhöhen deren Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml id="h4k8m2"
id: biome.temperate

version: 1

displayName: Temperate Region

category: temperate

description: A moderate climate with fertile terrain and diverse natural resources.

climate:
  type: temperate

  averageTemperature: 15

  temperatureRange:
    minimum: -10
    maximum: 35

  precipitation: 800

terrain:
  type: plains

  elevation:
    minimum: 0
    maximum: 200

  slope:
    minimum: 0
    maximum: 15

  roughness: 0.2

vegetation:
  density: 0.8

  types:
    - forest
    - grass

  renewableResources:
    - resource.wood

resources:
  available:
    - resource.iron_ore
    - resource.coal
    - resource.water

  abundance:
    resource.iron_ore: 0.8
    resource.coal: 0.5
    resource.water: 1.0

hazards:
  - type: storm
    severity: 0.2

environment:
  airQuality: 1.0
  pollutionResistance: 0.8
  ecosystemSensitivity: 0.6

energy:
  sources:
    - type: solar
      potential: 0.7

    - type: wind
      potential: 0.5

construction:
  buildability: 0.9
  foundationDifficulty: 0.2
  terrainModificationCost: 1.0

logistics:
  accessibility: 0.9
  roadConstructionDifficulty: 0.2
  transportEfficiency: 1.0

tags:
  - temperate
  - plains
  - forest
```

---

# Compatibility

Dieses Schema ist kompatibel mit:

- ASSET_ID_SYSTEM.md
- ASSET_VERSIONING.md
- REGISTRY_SCHEMA.md
- GLOBAL_ASSET_REGISTRY.md
- CONTENT_PIPELINE.md
- Resource.schema.md
- Building.schema.md
- Vehicle.schema.md
- Technology.schema.md
- Scenario.schema.md

---

# Future Extensions

Geplante Erweiterungen:

- Seasonal Effects
- Dynamic Weather
- Climate Change
- Natural Disasters
- Ecosystem Simulation
- Resource Regeneration
- Resource Depletion
- Soil Quality
- Water Availability
- Pollution Propagation
- Wildlife
- Biodiversity
- Terrain Generation Parameters
- Procedural World Generation
- Biome Transitions
- Biome Compatibility Rules
- Altitude Effects
- Latitude Effects
- Climate Zones
- Seasonal Resource Production
