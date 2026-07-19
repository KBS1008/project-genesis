# Recipe.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Recipe
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert das kanonische Schema für alle Recipe-Assets in Project Genesis.

Recipes beschreiben statische Produktions- und Verarbeitungsdefinitionen.

Sie definieren insbesondere:

- benötigte Eingangsressourcen
- erzeugte Ausgangsressourcen
- Produktionsmenge
- Produktionszeit
- benötigte Gebäude
- benötigte Mitarbeiter
- Energiebedarf
- optionale Voraussetzungen

Die tatsächliche Ausführung eines Recipes gehört zur Domain- und Simulationsebene.

Das Schema dient als Grundlage für:

- JSON-Assets
- Asset Registry
- Content Pipeline
- Validierung
- Produktionssystem
- Editor
- Modding
- Savegame-Kompatibilität

---

# Asset Identity

Jedes Recipe besitzt eine eindeutige Asset-ID.

Beispiele:

```text
recipe.steel
recipe.copper_wire
recipe.plastic_components
recipe.electric_motor
recipe.fuel
```

Die Asset-ID bleibt über die gesamte Lebensdauer eines Assets stabil.

---

# Required Fields

| Feld        | Typ     | Beschreibung                 |
| ----------- | ------- | ---------------------------- |
| id          | string  | Eindeutige Asset-ID          |
| version     | integer | Asset-Version                |
| displayName | string  | Anzeigename                  |
| category    | string  | Rezeptkategorie              |
| description | string  | Beschreibung                 |
| duration    | number  | Produktionsdauer             |
| inputs      | object  | Benötigte Eingangsressourcen |
| outputs     | object  | Erzeugte Ausgangsressourcen  |

---

# Optional Fields

| Feld                 | Typ    |
| -------------------- | ------ |
| icon                 | string |
| localizationKey      | string |
| tags                 | array  |
| requirements         | object |
| buildingRequirements | object |
| workforce            | object |
| energy               | object |
| byproducts           | object |
| quality              | object |
| productionModifiers  | object |

---

# Recipe Categories

Empfohlene Kategorien:

```yaml id="h5cs17"
processing
manufacturing
assembly
refining
chemical
energy
food
construction
recycling
special
```

Neue Kategorien können projektspezifisch ergänzt werden.

---

# Duration

Die Produktionsdauer wird als numerischer Wert definiert.

Beispiel:

```yaml id="xk5cm3"
duration: 30
```

Die Einheit muss mit der zentralen Zeitdefinition der Simulation übereinstimmen.

Das Recipe definiert keine eigene Zeitlogik.

Die Simulation bestimmt, wie die Dauer in Simulations-Ticks oder Zeitintervalle übersetzt wird.

---

# Inputs

Eingangsressourcen werden über Asset-IDs referenziert.

Beispiel:

```yaml id="c5t0j7"
inputs:
  resource.iron_ore: 100
  resource.coal: 20
```

Die angegebenen Werte definieren die benötigte Menge pro Produktionszyklus.

Alle Ressourcenreferenzen müssen gültige Resource-Assets sein.

---

# Outputs

Ausgangsressourcen werden über Asset-IDs definiert.

Beispiel:

```yaml id="y6t9oc"
outputs:
  resource.steel: 80
```

Die angegebenen Werte definieren die Produktionsmenge pro vollständigem Produktionszyklus.

---

# Byproducts

Ein Recipe kann optionale Nebenprodukte erzeugen.

Beispiel:

```yaml id="dr3k0m"
byproducts:
  resource.slag: 10
```

Nebenprodukte werden genauso wie reguläre Outputs über Asset-IDs referenziert.

---

# Building Requirements

Ein Recipe kann auf bestimmte Gebäude oder Gebäudekategorien beschränkt sein.

Beispiel:

```yaml id="n0t7j1"
buildingRequirements:
  buildings:
    - building.smelter

  categories:
    - production
```

Die tatsächliche Prüfung, ob ein Gebäude aktuell verfügbar und betriebsbereit ist, erfolgt in der Domain-/Simulationsebene.

---

# Workforce

Ein Recipe kann Anforderungen an Mitarbeiter definieren.

Beispiel:

```yaml id="g8y0l3"
workforce:
  minimum: 1

  requiredEmployees:
    - employee.engineer.basic
```

Mitarbeiterreferenzen erfolgen ausschließlich über Asset-IDs.

Die tatsächliche Zuweisung von Mitarbeitern gehört zum dynamischen Spielzustand.

---

# Energy

Ein Recipe kann einen Energiebedarf definieren.

Beispiel:

```yaml id="t7p4k2"
energy:
  consumption:
    resource: resource.electricity
    amount: 50
```

Die tatsächliche Verfügbarkeit und Bilanzierung der Energie wird durch das Energy-System der Domain/Simulation bestimmt.

---

# Requirements

Ein Recipe kann allgemeine Voraussetzungen besitzen.

Beispiel:

```yaml id="p3s9m6"
requirements:
  research:
    - technology.basic_metallurgy

  buildings:
    - building.smelter
```

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Production Modifiers

Optional können statische Modifikatoren definiert werden.

Beispiel:

```yaml id="v4j2r8"
productionModifiers:
  temperature:
    optimal: 1200
    tolerance: 100

  efficiency:
    base: 1.0
```

Solche Werte definieren ausschließlich statische Parameter.

Die Berechnung der tatsächlichen Produktionsleistung erfolgt in der Domain-/Simulationsebene.

---

# Quality

Recipes können optionale Qualitätsdefinitionen besitzen.

Beispiel:

```yaml id="m1w8q5"
quality:
  enabled: true

  baseQuality: 1.0

  minimum: 0.5
  maximum: 1.5
```

Qualitätsberechnungen und deren Auswirkungen gehören zur Domain-/Simulationsebene.

---

# Asset References

Ein Recipe darf referenzieren:

- Resources
- Buildings
- Employees
- Technologies
- Research
- Effects

Alle Referenzen erfolgen ausschließlich über Asset-IDs.

---

# Localization

Anzeigenamen und Beschreibungen sollen über Lokalisierungsschlüssel referenziert werden.

Beispiel:

```yaml id="b2v6n9"
localizationKey: recipe.steel
```

Die konkrete Lokalisierung wird außerhalb des Recipe-Assets verwaltet.

---

# Validation Rules

Ein Recipe ist gültig, wenn:

- eine eindeutige Asset-ID vorhanden ist
- die Version gültig ist
- eine Kategorie definiert wurde
- die Produktionsdauer größer als 0 ist
- mindestens ein Input oder Output vorhanden ist
- alle Input-Mengen größer als 0 sind
- alle Output-Mengen größer als 0 sind
- alle Ressourcenreferenzen gültig sind
- alle Gebäude-, Mitarbeiter- und Technologie-Referenzen gültig sind

Ein Recipe darf keine zirkulären oder ungültigen Referenzen enthalten.

Ungültige Recipes dürfen nicht registriert oder geladen werden.

---

# Production Cycle

Ein Recipe beschreibt einen vollständigen Produktionszyklus.

Beispiel:

```yaml id="f5n3d7"
duration: 30

inputs:
  resource.iron_ore: 100
  resource.coal: 20

outputs:
  resource.steel: 80
```

Die Simulation interpretiert dies als:

```text
Start Production
        ↓
Inputs prüfen
        ↓
Inputs reservieren / verbrauchen
        ↓
Production läuft
        ↓
Duration erreicht
        ↓
Outputs erzeugen
```

Die konkrete Prozesssteuerung gehört nicht zum Asset-Schema.

---

# Runtime State Separation

Das Recipe-Asset enthält ausschließlich statische Produktionsdefinitionen.

Nicht Bestandteil dieses Schemas sind:

- aktueller Produktionsfortschritt
- aktuelle Produktionscharge
- reservierte Ressourcen
- tatsächlich verbrauchte Ressourcen
- aktuell zugewiesene Mitarbeiter
- aktueller Energieverbrauch
- Produktionsfehler
- Produktionshistorie
- aktuelle Produktionskapazität

Diese Daten gehören zum dynamischen Spielzustand.

---

# Versioning

Schemaänderungen erhöhen die Schema-Version.

Änderungen an einzelnen Recipe-Assets erhöhen deren Asset-Version.

Die Asset-ID bleibt unverändert.

---

# Example

```yaml id="n8q2s4"
id: recipe.steel

version: 1

displayName: Steel Production

category: processing

description: Processes iron ore and coal into steel.

duration: 30

inputs:
  resource.iron_ore: 100
  resource.coal: 20

outputs:
  resource.steel: 80

byproducts:
  resource.slag: 10

buildingRequirements:
  buildings:
    - building.smelter

workforce:
  minimum: 1

  requiredEmployees:
    - employee.engineer.basic

energy:
  consumption:
    resource: resource.electricity
    amount: 50

requirements:
  research:
    - technology.basic_metallurgy

tags:
  - production
  - metallurgy
  - steel
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

---

# Future Extensions

Geplante Erweiterungen:

- Produktionsvarianten
- alternative Input-Ressourcen
- Rezept-Substitution
- Batch Production
- Produktionsqualität
- Ausschuss
- Recycling
- Nebenprodukte
- dynamische Produktionsmodifikatoren
- Produktionsketten
- Multi-Stage Recipes
- Machine Requirements
- Skill Requirements
- Recipe Unlocks
- Tech Tree Integration
- Recipe Upgrades
