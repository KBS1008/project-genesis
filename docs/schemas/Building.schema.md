# Building.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Building
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Gebäude-Assets in Project Genesis.

Gebäude bilden einen zentralen Bestandteil der Spielwelt und können unter anderem folgende Funktionen erfüllen:

* Produktion
* Lagerung
* Energieversorgung
* Transport und Logistik
* Forschung
* Verwaltung
* Personalversorgung
* Infrastruktur

Alle statischen Gebäudedefinitionen müssen diesem Schema entsprechen.

Das Schema dient als Grundlage für:

* JSON-Assets
* Asset Registry
* Content Pipeline
* Validierung
* Editor
* Modding
* Savegame-Kompatibilität

---

# Asset Identity

Jedes Gebäude besitzt eine eindeutige Asset-ID.

Beispiele:

```text
building.iron_mine
building.smelter
building.warehouse
building.power_plant
building.research_lab
building.vehicle_depot
```

Die Asset-ID bleibt über die gesamte Lebensdauer eines Assets stabil.

---

# Required Fields

| Feld             | Typ     | Beschreibung             |
| ---------------- | ------- | ------------------------ |
| id               | string  | Eindeutige Asset-ID      |
| version          | integer | Asset-Version            |
| displayName      | string  | Anzeigename              |
| category         | string  | Gebäudekategorie         |
| buildingType     | string  | Konkreter Gebäudetyp     |
| description      | string  | Beschreibung             |
| constructionCost | object  | Baukosten                |
| constructionTime | number  | Bauzeit                  |
| maintenanceCost  | number  | Laufende Wartungskosten  |
| footprint        | object  | Platzbedarf des Gebäudes |

---

# Optional Fields

| Feld            | Typ    |
| --------------- | ------ |
| icon            | string |
| model           | string |
| localizationKey | string |
| tags            | array  |
| requirements    | object |
| workforce       | object |
| production      | object |
| storage         | object |
| energy          | object |
| logistics       | object |
| research        | object |
| upgrades        | array  |

---

# Building Categories

Empfohlene Kategorien:

```yaml
production
storage
energy
logistics
transport
research
administration
residential
infrastructure
special
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Building Type

Der `buildingType` beschreibt die konkrete fachliche Funktion.

Beispiele:

```yaml
buildingType: mine
buildingType: smelter
buildingType: warehouse
buildingType: power_plant
buildingType: research_lab
buildingType: vehicle_depot
```

Die Kategorie beschreibt die übergeordnete Einordnung.

Der `buildingType` beschreibt die konkrete Funktion.

---

# Construction Cost

Baukosten werden über Ressourcen-Asset-IDs definiert.

Beispiel:

```yaml
constructionCost:
  resource.iron_ore: 500
  resource.steel: 200
  resource.copper: 50
```

Alle Ressourcenreferenzen müssen gültige Asset-IDs sein.

---

# Footprint

Der Platzbedarf wird über ein standardisiertes Footprint-Objekt definiert.

Beispiel:

```yaml
footprint:
  width: 4
  height: 3
```

Die Einheiten entsprechen den im Spiel definierten Welt- oder Grid-Einheiten.

---

# Workforce

Ein Gebäude kann Mitarbeiter benötigen.

Beispiel:

```yaml
workforce:
  required:
    - employee.engineer.basic
    - employee.logistics.operator

  minimum: 2
  maximum: 10
```

Mitarbeiter werden ausschließlich über Asset-IDs referenziert.

Die tatsächliche Mitarbeiterzuweisung gehört zum dynamischen Spielzustand und nicht zum Asset.

---

# Production

Produktionsgebäude können Produktionsrezepte referenzieren.

Beispiel:

```yaml
production:
  recipes:
    - recipe.steel

  inputResources:
    - resource.iron_ore
    - resource.coal

  outputResources:
    - resource.steel
```

Die eigentliche Produktionslogik wird durch das Domain-Modell und die Production-/Recipe-Systeme implementiert.

Das Building-Asset definiert lediglich die statischen Fähigkeiten.

---

# Storage

Gebäude können Lagerkapazitäten bereitstellen.

Beispiel:

```yaml
storage:
  capacity: 5000

  allowedCategories:
    - raw_material
    - processed_material

  allowedResources:
    - resource.iron_ore
    - resource.steel
```

Alle Ressourcenreferenzen müssen gültige Asset-IDs sein.

---

# Energy

Gebäude können Energie verbrauchen oder erzeugen.

Beispiel für Energieverbrauch:

```yaml
energy:
  consumption:
    amount: 100
    resource: resource.electricity
```

Beispiel für Energieerzeugung:

```yaml
energy:
  production:
    amount: 500
    resource: resource.electricity
```

Die tatsächliche Energieverteilung und Bilanzierung gehört zur Domain-/Simulationsebene.

---

# Logistics

Logistikgebäude können Transport- oder Umschlagfunktionen bereitstellen.

Beispiel:

```yaml
logistics:
  loadingCapacity: 500
  unloadingCapacity: 500

  supportedVehicles:
    - vehicle.truck.small
    - vehicle.truck.large
```

Fahrzeugreferenzen erfolgen ausschließlich über Asset-IDs.

---

# Research

Forschungsgebäude können Forschungssysteme unterstützen.

Beispiel:

```yaml
research:
  enabled: true

  researchCategories:
    - engineering
    - logistics
```

Konkrete Forschungsinhalte werden über Technology- oder Research-Assets definiert.

---

# Requirements

Gebäude können Voraussetzungen für die Errichtung besitzen.

Beispiel:

```yaml
requirements:
  research:
    - technology.basic_engineering

  buildings:
    - building.vehicle_depot

  resources:
    - resource.steel
```

Alle Referenzen müssen gültige Asset-IDs sein.

---

# Maintenance

Wartungskosten werden als statische Asset-Eigenschaft definiert.

Beispiel:

```yaml
maintenanceCost:
  resource.money: 250
```

Dynamische Wartungszustände wie:

* Verschleiß
* Beschädigung
* Reparaturfortschritt

gehören zum laufenden Spielzustand und nicht zum Asset.

---

# Upgrades

Gebäude können optionale Erweiterungen unterstützen.

Beispiel:

```yaml
upgrades:
  - building_upgrade.storage_expansion
  - building_upgrade.energy_efficiency
```

Upgrades werden über eigene Asset-IDs referenziert.

---

# Asset References

Ein Building darf referenzieren:

* Resources
* Employees
* Vehicles
* Recipes
* Technologies
* Research
* Building Upgrades
* Effects

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Anzeigenamen und beschreibende Texte sollen über Lokalisierungsschlüssel referenziert werden.

Beispiel:

```yaml
localizationKey:
  building.smelter
```

Die konkrete Lokalisierung wird außerhalb des Building-Assets verwaltet.

---

# Validation Rules

Ein Gebäude ist gültig, wenn:

* eine eindeutige Asset-ID vorhanden ist
* die Version gültig ist
* eine Kategorie definiert wurde
* ein Building Type definiert wurde
* Baukosten gültig sind
* Bauzeit größer oder gleich 0 ist
* Wartungskosten gültig sind
* Footprint-Dimensionen größer als 0 sind
* sämtliche Asset-Referenzen gültig sind

Ungültige Gebäude dürfen nicht registriert oder geladen werden.

---

# Separation of Static and Runtime Data

Das Building-Asset enthält ausschließlich statische Definitionen.

Nicht Bestandteil dieses Schemas sind:

* aktuelles Gebäudelevel
* aktueller Zustand
* Beschädigung
* Reparaturfortschritt
* Produktionsfortschritt
* aktueller Lagerbestand
* aktuell zugewiesene Mitarbeiter
* aktuell zugewiesene Fahrzeuge
* temporäre Effekte

Diese Daten gehören zum dynamischen Spielzustand und werden durch die Domain-/Application-/Savegame-Systeme verwaltet.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Building-Assets erhöhen deren Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml
id: building.smelter

version: 1

displayName: Steel Smelter

category: production

buildingType: smelter

description: Processes raw materials into refined steel.

constructionCost:
  resource.iron_ore: 500
  resource.steel: 200
  resource.copper: 50

constructionTime: 120

maintenanceCost:
  resource.money: 250

footprint:
  width: 4
  height: 3

workforce:
  required:
    - employee.engineer.basic

  minimum: 2
  maximum: 10

production:
  recipes:
    - recipe.steel

  inputResources:
    - resource.iron_ore
    - resource.coal

  outputResources:
    - resource.steel

energy:
  consumption:
    amount: 100
    resource: resource.electricity

requirements:
  research:
    - technology.basic_engineering

tags:
  - production
  - metallurgy
  - industry
```

---

# Compatibility

Dieses Schema ist kompatibel mit:

* ASSET_ID_SYSTEM.md
* ASSET_VERSIONING.md
* REGISTRY_SCHEMA.md
* GLOBAL_ASSET_REGISTRY.md
* CONTENT_PIPELINE.md
* Employee.schema.md
* Vehicle.schema.md
* Resource.schema.md

---

# Future Extensions

Geplante Erweiterungen:

* Building Levels
* modulare Gebäude
* Produktionslinien
* Gebäudestatus
* Wartungszyklen
* Verschleißsystem
* Umweltbelastung
* Emissionen
* Heat Management
* Wasserverbrauch
* Abfallproduktion
* Mitarbeiterzufriedenheit
* Gebäudesynergien
* Upgrade-System
* dynamische Produktionskapazität
* Building Effects
* Zonen und Standortanforderungen
