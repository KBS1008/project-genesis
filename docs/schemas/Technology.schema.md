# Technology.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Technology
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Technology-Assets in Project Genesis.

Technologien bilden den statischen Wissens- und Fortschrittsbaum des Spiels.

Eine Technologie kann unter anderem:

* Gebäude freischalten
* Fahrzeuge freischalten
* Ressourcenverarbeitung ermöglichen
* Rezepte freischalten
* Mitarbeiterfähigkeiten erweitern
* Produktionsparameter verbessern
* neue Spielmechaniken aktivieren
* weitere Technologien freischalten

Das Technology-Asset definiert ausschließlich die statischen Eigenschaften und Freischaltungen.

Der tatsächliche Forschungsfortschritt gehört zum dynamischen Spielzustand.

Das Schema dient als Grundlage für:

* JSON-Assets
* Asset Registry
* Content Pipeline
* Validierung
* Research-System
* Technology Tree
* Editor
* Modding
* Savegame-Kompatibilität

---

# Asset Identity

Jede Technologie besitzt eine eindeutige Asset-ID.

Beispiele:

```text
technology.basic_engineering
technology.advanced_metallurgy
technology.industrial_automation
technology.logistics_optimization
technology.renewable_energy
```

Die Asset-ID bleibt über die gesamte Lebensdauer eines Assets stabil.

---

# Required Fields

| Feld         | Typ     | Beschreibung               |
| ------------ | ------- | -------------------------- |
| id           | string  | Eindeutige Asset-ID        |
| version      | integer | Asset-Version              |
| displayName  | string  | Anzeigename                |
| category     | string  | Technologiekategorie       |
| description  | string  | Beschreibung               |
| researchCost | number  | Benötigte Forschungskosten |
| researchTime | number  | Forschungsdauer            |

---

# Optional Fields

| Feld                 | Typ     |
| -------------------- | ------- |
| icon                 | string  |
| localizationKey      | string  |
| tags                 | array   |
| prerequisites        | object  |
| unlocks              | object  |
| modifiers            | object  |
| researchRequirements | object  |
| effects              | array   |
| tier                 | integer |

---

# Technology Categories

Empfohlene Kategorien:

```yaml id="a4z7y1"
engineering
metallurgy
manufacturing
automation
logistics
transport
energy
electronics
chemistry
construction
agriculture
research
special
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Technology Tier

Technologien können in Stufen organisiert werden.

Beispiel:

```yaml id="w7p3m2"
tier: 2
```

Die Tier-Nummer ist eine optionale Ordnungs- und Darstellungsinformation.

Sie ersetzt nicht die explizite Definition von Voraussetzungen.

Eine Technologie der Stufe 2 muss daher nicht zwingend eine Technologie der Stufe 1 voraussetzen.

Abhängigkeiten werden ausschließlich über `prerequisites` definiert.

---

# Research Cost

Die Forschungskosten definieren die statische Menge an Forschungsressourcen oder Forschungspunkten, die zum Abschluss benötigt werden.

Beispiel:

```yaml id="e2n9k4"
researchCost: 500
```

Die Interpretation der Forschungskosten erfolgt durch das Research-System.

---

# Research Time

Die Forschungsdauer definiert die benötigte Forschungszeit.

Beispiel:

```yaml id="q8v5r3"
researchTime: 120
```

Die Einheit muss mit der zentralen Zeitdefinition der Simulation übereinstimmen.

Das Technology-Asset definiert keine eigene Zeitlogik.

---

# Prerequisites

Technologien können andere Technologien als Voraussetzungen besitzen.

Beispiel:

```yaml id="m6c2x8"
prerequisites:
  technologies:
    - technology.basic_engineering
    - technology.basic_metallurgy
```

Alle Referenzen müssen gültige Technology-Assets sein.

Zirkuläre Abhängigkeiten sind nicht zulässig.

---

# Research Requirements

Zusätzlich zu technologischen Voraussetzungen können weitere Anforderungen definiert werden.

Beispiel:

```yaml id="p9s4k1"
researchRequirements:
  buildings:
    - building.research_lab

  employees:
    - employee.scientist.senior
```

Weitere mögliche Anforderungen:

* Gebäude
* Mitarbeiter
* Ressourcen
* Szenario-Fortschritt
* andere Technologien

Alle Asset-Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Unlocks

Eine Technologie kann verschiedene Assets freischalten.

Beispiel:

```yaml id="v3j7d5"
unlocks:
  buildings:
    - building.advanced_smelter

  vehicles:
    - vehicle.truck.large

  recipes:
    - recipe.advanced_steel

  resources:
    - resource.advanced_alloy
```

Mögliche Unlock-Typen:

* Buildings
* Vehicles
* Recipes
* Resources
* Employees
* Research
* Technologies
* Upgrades

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Effects

Technologien können statische Effekte definieren.

Beispiel:

```yaml id="k5t8b2"
effects:
  - type: production_efficiency
    target: recipe.steel
    value: 0.10
```

Die konkrete Berechnung und Anwendung dieser Effekte gehört zur Domain-/Simulationsebene.

Das Asset definiert lediglich die Parameter.

---

# Modifiers

Technologien können optionale Modifikatoren bereitstellen.

Beispiel:

```yaml id="r2y6n8"
modifiers:
  productionEfficiency: 0.10
  energyEfficiency: 0.05
  logisticsEfficiency: 0.08
```

Modifikatoren sind statische Werte.

Die Aggregation und Anwendung mehrerer Modifikatoren erfolgt durch das entsprechende Domain-System.

---

# Technology Tree

Technologien bilden gemeinsam einen gerichteten Graphen.

Beispiel:

```text
technology.basic_engineering
        │
        ▼
technology.industrial_engineering
        │
        ├───────────────┐
        ▼               ▼
technology.automation   technology.advanced_metallurgy
        │
        ▼
technology.smart_factory
```

Der Technology Tree wird aus den `prerequisites` aller Technology-Assets aufgebaut.

Die Reihenfolge der Assets in Dateien oder im Registry-System darf keine implizite Abhängigkeit erzeugen.

---

# Asset References

Eine Technology darf referenzieren:

* Technologies
* Buildings
* Vehicles
* Resources
* Recipes
* Employees
* Research
* Effects
* Upgrades

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Anzeigenamen und Beschreibungen sollen über Lokalisierungsschlüssel referenziert werden.

Beispiel:

```yaml id="x4m7q2"
localizationKey:
  technology.advanced_metallurgy
```

Die konkrete Lokalisierung wird außerhalb des Technology-Assets verwaltet.

---

# Validation Rules

Eine Technology ist gültig, wenn:

* eine eindeutige Asset-ID vorhanden ist
* die Version gültig ist
* eine Kategorie definiert wurde
* die Forschungskosten größer oder gleich 0 sind
* die Forschungsdauer größer als 0 ist
* alle Technologie-Voraussetzungen gültige Asset-IDs besitzen
* keine zirkulären Technologieabhängigkeiten bestehen
* alle Unlock-Referenzen gültig sind
* alle Effect- und Modifier-Definitionen gültig sind

Ungültige Technologien dürfen nicht registriert oder geladen werden.

---

# Runtime State Separation

Das Technology-Asset enthält ausschließlich statische Definitionen.

Nicht Bestandteil dieses Schemas sind:

* aktueller Forschungsfortschritt
* aktuell investierte Forschungspunkte
* Forschungsstatus
* Forschungswarteschlange
* aktuell zugewiesene Mitarbeiter
* aktuelle Forschungsgeschwindigkeit
* bereits erforschte Technologien
* temporäre Forschungsboni

Diese Daten gehören zum dynamischen Spielzustand.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Technology-Assets erhöhen deren Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml id="s9w3k6"
id: technology.advanced_metallurgy

version: 1

displayName: Advanced Metallurgy

category: metallurgy

description: Enables advanced methods for processing and refining industrial metals.

researchCost: 500

researchTime: 120

tier: 2

prerequisites:
  technologies:
    - technology.basic_engineering

researchRequirements:
  buildings:
    - building.research_lab

  employees:
    - employee.scientist.senior

unlocks:
  buildings:
    - building.advanced_smelter

  recipes:
    - recipe.advanced_steel

  vehicles:
    - vehicle.truck.large

effects:
  - type: production_efficiency
    target: recipe.steel
    value: 0.10

modifiers:
  productionEfficiency: 0.10
  energyEfficiency: 0.05

tags:
  - research
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
* Building.schema.md
* Recipe.schema.md

---

# Future Extensions

Geplante Erweiterungen:

* Forschungspunkte nach Kategorien
* Research Specializations
* Technology Branches
* Technology Groups
* dynamische Forschungsboni
* Forschungsprioritäten
* parallele Forschungsprojekte
* Fraktionsabhängige Technologien
* Szenarioabhängige Technologien
* Technology Obsolescence
* alternative Technologiepfade
* Technologie-Kombinationen
* Forschungskosten-Modifikatoren
* Forschungsrisiken
* experimentelle Technologien
* Technologie-Level
