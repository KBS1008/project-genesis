# Milestone.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Milestone
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Milestone-Assets in Project Genesis.

Ein Milestone beschreibt einen dauerhaften oder einmalig erreichbaren Fortschrittspunkt innerhalb des Spiels.

Milestones können beispielsweise den Fortschritt eines Spielers, einer Kampagne oder eines Szenarios abbilden.

Typische Beispiele sind:

* erste Produktion gestartet
* erste Produktion abgeschlossen
* bestimmter Umsatz erreicht
* bestimmte Produktionsmenge erreicht
* bestimmtes Gebäude errichtet
* bestimmte Technologie erforscht
* bestimmter wirtschaftlicher oder logistischer Zustand erreicht

Milestones können von anderen Content-Assets als Voraussetzungen referenziert werden.

Insbesondere können sie als Voraussetzung für:

* Technologies
* Recipes
* Buildings
* Scenarios
* Missions

verwendet werden.

Das Milestone-Asset definiert ausschließlich die statische Definition eines Fortschrittsziels.

Der aktuelle Fortschritts- und Erreichungsstatus gehört zum dynamischen Spielzustand.

Das Schema dient als Grundlage für:

* JSON-/YAML-Assets
* Asset Registry
* Content Pipeline
* Content Validator
* Milestone Registry
* Technology Progression
* Scenario-System
* Mission-System
* Editor
* Modding
* Savegame-Kompatibilität

---

# Asset Identity

Jeder Milestone besitzt eine eindeutige Asset-ID.

Beispiele:

```text
milestone.first_production
milestone.first_profit
milestone.profit_100
milestone.first_factory
milestone.first_research
```

Die Asset-ID bleibt über die gesamte Lebensdauer eines Assets stabil.

Die ID wird als stabile Referenz von anderen Content-Assets verwendet.

---

# Required Fields

| Feld        | Typ     | Beschreibung                        |
| ----------- | ------- | ----------------------------------- |
| id          | string  | Eindeutige Milestone-ID             |
| version     | integer | Asset-Version                       |
| displayName | string  | Anzeigename                         |
| description | string  | Beschreibung                        |
| type        | string  | Milestone-Typ                       |
| condition   | object  | Definition der Erreichungsbedingung |

---

# Optional Fields

| Feld            | Typ     |
| --------------- | ------- |
| icon            | string  |
| localizationKey | string  |
| tags            | array   |
| category        | string  |
| hidden          | boolean |
| repeatable      | boolean |
| rewards         | object  |

---

# Milestone Categories

Empfohlene Kategorien:

```yaml
production
economic
construction
research
logistics
transport
exploration
progression
special
```

Die Kategorie dient primär zur Gruppierung und Darstellung.

Die konkrete Erreichungslogik wird über `type` und `condition` definiert.

---

# Milestone Types

Empfohlene Milestone-Typen:

```text
production
profit
revenue
building_constructed
technology_researched
resource_collected
resource_delivered
transport_completed
employee_hired
vehicle_acquired
custom
```

Die tatsächlich unterstützten Typen müssen mit dem implementierten Milestone-System übereinstimmen.

Neue Typen dürfen nur eingeführt werden, wenn der entsprechende Validator und die Runtime-Auswertungslogik diese unterstützen.

---

# Condition

Die `condition` definiert, wann ein Milestone als erreicht gilt.

Beispiel:

```yaml
condition:
  resource: resource.steel
  amount: 100
```

Die konkrete Struktur der Condition hängt vom Milestone-Typ ab.

---

# Production Milestone

Ein Produktions-Milestone wird erreicht, wenn eine bestimmte Produktionsmenge erzeugt wurde.

Beispiel:

```yaml
id: milestone.first_production

version: 1

displayName: First Production

description: Produce your first unit of any resource.

type: production

condition:
  amount: 1
```

Für ressourcenspezifische Produktionsziele:

```yaml
id: milestone.produce_100_steel

version: 1

displayName: Produce 100 Steel

description: Produce 100 units of steel.

type: production

condition:
  resource: resource.steel
  amount: 100
```

---

# Profit Milestone

Ein Profit-Milestone wird erreicht, wenn ein definierter Gewinnwert erreicht wurde.

Beispiel:

```yaml
id: milestone.first_profit

version: 1

displayName: First Profit

description: Generate your first positive profit.

type: profit

condition:
  amount: 1
```

---

# Revenue Milestone

Ein Revenue-Milestone wird erreicht, wenn ein bestimmter Umsatz erreicht wurde.

Beispiel:

```yaml
id: milestone.revenue_100000

version: 1

displayName: Revenue 100,000

description: Generate total revenue of 100,000.

type: revenue

condition:
  amount: 100000
```

---

# Building Milestone

Ein Building-Milestone wird erreicht, wenn ein bestimmter Gebäudetyp errichtet wurde.

Beispiel:

```yaml
id: milestone.first_factory

version: 1

displayName: First Factory

description: Construct your first factory.

type: building_constructed

condition:
  buildingType: building.factory
  amount: 1
```

Die Referenz erfolgt auf einen gültigen `BuildingType`.

---

# Technology Milestone

Ein Technology-Milestone wird erreicht, wenn eine Technologie erforscht wurde.

Beispiel:

```yaml
id: milestone.first_research

version: 1

displayName: First Research

description: Research your first technology.

type: technology_researched

condition:
  technology: technology.basic_engineering
```

Die Referenz erfolgt auf eine gültige Technology-ID.

---

# Resource Milestone

Ein Resource-Milestone kann das Sammeln oder Besitzen einer bestimmten Ressourcenmenge abbilden.

Beispiel:

```yaml
id: milestone.collect_1000_iron

version: 1

displayName: Collect 1,000 Iron Ore

description: Collect 1,000 units of iron ore.

type: resource_collected

condition:
  resource: resource.iron_ore
  amount: 1000
```

Die genaue Semantik zwischen `collected`, `produced`, `consumed` und `owned` muss durch das jeweilige Domain-System eindeutig definiert werden.

---

# Transport Milestone

Ein Transport-Milestone kann den Abschluss eines bestimmten Transportziels abbilden.

Beispiel:

```yaml
id: milestone.first_transport

version: 1

displayName: First Transport

description: Complete your first transport operation.

type: transport_completed

condition:
  amount: 1
```

Die tatsächliche Transportausführung wird durch das Transport-/Logistiksystem überwacht.

---

# Employee Milestone

Ein Milestone kann die Einstellung eines bestimmten Mitarbeitertyps voraussetzen.

Beispiel:

```yaml
id: milestone.first_engineer

version: 1

displayName: First Engineer

description: Hire your first engineer.

type: employee_hired

condition:
  employee: employee.engineer.basic
  amount: 1
```

Die Referenz erfolgt auf einen gültigen Employee-Asset-Typ.

---

# Vehicle Milestone

Ein Milestone kann den Erwerb eines bestimmten Fahrzeugtyps voraussetzen.

Beispiel:

```yaml
id: milestone.first_truck

version: 1

displayName: First Truck

description: Acquire your first truck.

type: vehicle_acquired

condition:
  vehicle: vehicle.truck.small
  amount: 1
```

Die Referenz erfolgt auf einen gültigen Vehicle-Asset-Typ.

---

# Milestone Completion

Ein Milestone gilt als erreicht, sobald seine Condition erfüllt wurde.

Die Erreichung eines Milestones soll grundsätzlich dauerhaft sein.

Beispiel:

```text
Condition not met
        ↓
Progress tracked
        ↓
Condition fulfilled
        ↓
Milestone reached
        ↓
Milestone remains reached
```

Der aktuelle Status wird nicht im statischen Milestone-Asset gespeichert.

---

# Repeatable Milestones

Standardmäßig sind Milestones nicht wiederholbar.

Beispiel:

```yaml
repeatable: false
```

Ein wiederholbarer Milestone kann optional definiert werden:

```yaml
repeatable: true
```

Wiederholbare Milestones müssen eine eindeutige Runtime-Semantik besitzen.

Das Asset muss nicht festlegen, wie der Wiederholungsstatus gespeichert wird.

---

# Hidden Milestones

Ein Milestone kann verborgen sein.

Beispiel:

```yaml
hidden: true
```

Ein verborgener Milestone kann beispielsweise erst sichtbar werden, wenn:

* eine bestimmte Technologie erforscht wurde
* ein Szenariofortschritt erreicht wurde
* eine andere Mission abgeschlossen wurde

Die Sichtbarkeitslogik gehört zum Application-/Domain-System.

---

# Milestone Dependencies

Milestones können von anderen Content-Assets als Voraussetzungen referenziert werden.

Beispiel:

```yaml
requiredMilestones:
  - milestone.first_production
```

Die Referenzierung wird durch das jeweilige Asset-Schema definiert.

Milestones selbst sollten grundsätzlich keine direkten zyklischen Abhängigkeiten zu anderen Milestones erzeugen.

---

# Rewards

Optional können Milestones Belohnungen definieren.

Beispiel:

```yaml
rewards:
  money: 1000
```

Weitere mögliche Belohnungen:

```yaml
rewards:
  money: 1000

  resources:
    resource.steel: 100

  unlocks:
    - technology.advanced_metallurgy
```

Alle Asset-Referenzen müssen gültige Asset-IDs sein.

Die Vergabe von Belohnungen erfolgt durch das Application-/Domain-System.

---

# Asset References

Ein Milestone darf referenzieren:

* ResourceTypes
* BuildingTypes
* Technologies
* Employees
* Vehicles
* Missions
* Scenarios
* andere Milestones

Alle Referenzen erfolgen ausschließlich über stabile Asset-IDs.

Die Referenzen werden beim Laden und Validieren gegen die jeweils zuständige Registry geprüft.

Beispiele:

```text
ResourceTypeRegistry
BuildingTypeRegistry
TechnologyRegistry
MilestoneRegistry
```

---

# Localization

Anzeigenamen und Beschreibungen sollen über Lokalisierungsschlüssel referenziert werden.

Beispiel:

```yaml
localizationKey: milestone.first_production
```

Die konkrete Lokalisierung wird außerhalb des Milestone-Assets verwaltet.

Der genaue Feldtyp und die Benennung müssen projektweit einheitlich sein.

---

# Validation Rules

Ein Milestone ist gültig, wenn:

* eine eindeutige Asset-ID vorhanden ist
* die Version gültig ist
* ein Anzeigename vorhanden ist
* eine Beschreibung vorhanden ist
* ein unterstützter `type` definiert ist
* eine gültige `condition` definiert ist
* alle referenzierten Assets existieren
* alle Mengen größer als 0 sind
* alle numerischen Werte gültig sind
* keine ungültigen oder zirkulären Abhängigkeiten bestehen

Zusätzlich gilt:

* ein `building_constructed` Milestone muss einen gültigen BuildingType referenzieren
* ein `technology_researched` Milestone muss eine gültige Technology referenzieren
* ein `resource_collected` Milestone muss einen gültigen ResourceType referenzieren
* ein `employee_hired` Milestone muss einen gültigen Employee-Typ referenzieren
* ein `vehicle_acquired` Milestone muss einen gültigen Vehicle-Typ referenzieren

Ungültige Milestones dürfen nicht registriert oder geladen werden.

---

# Runtime State Separation

Das Milestone-Asset enthält ausschließlich die statische Definition eines Milestones.

Nicht Bestandteil dieses Schemas sind:

* aktueller Fortschritt
* aktueller Status
* Zeitpunkt der Aktivierung
* Zeitpunkt der Erreichung
* bereits vergebene Rewards
* Wiederholungszähler
* Spielerbezogener Completion State

Diese Daten gehören zum dynamischen Spielzustand.

Beispiel:

```text
Milestone Asset
      ↓
statische Definition

Milestone Runtime State
      ↓
current progress
      ↓
reached / not reached
      ↓
completion timestamp
```

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Milestone-Assets erhöhen deren Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml
id: milestone.first_profit

version: 1

displayName: First Profit

description: Generate your first positive profit.

type: profit

category: economic

condition:
  amount: 1

hidden: false

repeatable: false

tags:
  - progression
  - economy
```

Ein weiteres Beispiel:

```yaml
id: milestone.produce_100_steel

version: 1

displayName: Produce 100 Steel

description: Produce a total of 100 units of steel.

type: production

category: production

condition:
  resource: resource.steel
  amount: 100

hidden: false

repeatable: false

rewards:
  money: 1000

tags:
  - production
  - steel
  - progression
```

---

# Compatibility

Dieses Schema ist kompatibel mit:

* ASSET_ID_SYSTEM.md
* ASSET_VERSIONING.md
* REGISTRY_SCHEMA.md
* GLOBAL_ASSET_REGISTRY.md
* CONTENT_PIPELINE.md
* ResourceTypeRegistry
* BuildingTypeRegistry
* TechnologyRegistry
* MilestoneRegistry
* Resource.schema.md
* Building.schema.md
* Technology.schema.md
* Recipe.schema.md
* Scenario.schema.md
* Mission.schema.md

---

# Implementation Status

Dieses Schema beschreibt einen bereits vorgesehenen Content-Typ der Architektur.

Die Implementierung umfasst grundsätzlich:

```text
MilestoneDefinition
MilestoneValidator
MilestoneRegistry
MilestoneLoader
```

Die konkrete Feldstruktur dieses Dokuments muss mit der tatsächlich implementierten `MilestoneDefinition` und dem `MilestoneValidator` synchron gehalten werden.

Das Schema darf keine Felder als verpflichtend definieren, die vom aktuellen Loader oder Validator nicht unterstützt werden.

Bei Abweichungen gilt für die Implementierungsphase:

```text
Domain / Content Model
        ↓
Validator
        ↓
Loader
        ↓
Schema Documentation
```

Die Dokumentation muss anschließend an den tatsächlichen kanonischen Contract angepasst werden.

---

# Future Extensions

Geplante Erweiterungen:

* Milestone Chains
* Milestone Dependencies
* Progressive Milestones
* Multi-Condition Milestones
* Compound Conditions
* Optional Conditions
* Hidden Conditions
* Dynamic Milestones
* Scenario-specific Milestones
* Campaign Milestones
* Faction Milestones
* Repeatable Milestones
* Milestone Tiers
* Milestone Categories
* Milestone Statistics
* Milestone History
* Milestone Rewards
* Achievement Integration
* Steam / Platform Achievements
* Multiplayer Milestones
