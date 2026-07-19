# ResourceType.Schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** ResourceType
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert den kanonischen Content-Contract für `ResourceType`-Assets in Project Genesis.

Ein `ResourceType` beschreibt eine statische Ressourcendefinition, die von der Spielsimulation, Produktion, Logistik, Wirtschaft und weiteren Systemen referenziert werden kann.

Ein `ResourceType` ist **kein konkreter Bestand** einer Company und repräsentiert keine einzelne Ressource im Runtime-Zustand.

Die fachliche Trennung lautet:

```text
ResourceType
    ↓
statische Content-Definition

Resource / Inventory Entry
    ↓
Runtime-Bestand einer Company oder eines Systems
```

Der `ResourceType`-Contract ist Bestandteil der zentralen Content-Pipeline.

---

# Architecture

Die ResourceType-Content-Pipeline folgt dem Standard-Content-Modell:

```text
ResourceType YAML Asset
        ↓
ResourceTypeLoader
        ↓
Parse
        ↓
ResourceTypeValidator
        ↓
Duplicate ID Validation
        ↓
ResourceTypeRegistry
        ↓
Cross-Registry Validation
        ↓
Validated ResourceType Content
```

Die relevanten Komponenten befinden sich im Resource-Content-Bounded-Context:

```text
src/content/resource/
├── ResourceTypeDefinition
├── ResourceTypeValidator
├── ResourceTypeLoader
└── ResourceTypeRegistry
```

Die statische Definition wird von Runtime-Beständen getrennt.

```text
ResourceType
    │
    ▼
ResourceTypeRegistry
    │
    ├───────────────┐
    ▼               ▼
Production       Inventory
    │               │
    ▼               ▼
Recipe         Runtime Resource State
```

---

# Asset Identity

Jeder `ResourceType` besitzt eine eindeutige Asset-ID.

Beispiele:

```text
wood
steel
coal
water
electricity
```

Die ID muss dem globalen Asset-ID-Contract entsprechen.

Aktuell gilt:

```regex
^[a-z0-9_]+$
```

Beispiele für gültige IDs:

```text
wood
raw_wood
steel
iron_ore
electricity
```

Beispiele für ungültige IDs:

```text
Wood
iron-ore
iron ore
IronOre
```

Die ID muss innerhalb der `ResourceTypeRegistry` eindeutig sein.

Eine einmal veröffentlichte ResourceType-ID darf nicht ohne kontrollierte Migration geändert werden, da andere Content-Typen und Runtime-Daten auf diese ID referenzieren können.

---

# Required Fields

Eine `ResourceType`-Definition besteht aus den Feldern, die vom implementierten `ResourceTypeDefinition`- und `ResourceTypeValidator`-Contract unterstützt werden.

Der kanonische Contract umfasst die im Code tatsächlich definierten und validierten Eigenschaften.

Der zentrale Identifikator ist:

| Feld | Typ    | Beschreibung               |
| ---- | ------ | -------------------------- |
| `id` | string | Eindeutige ResourceType-ID |

Weitere Eigenschaften müssen mit dem implementierten `ResourceTypeDefinition`- und `ResourceTypeValidator`-Contract synchron gehalten werden.

Die Dokumentation darf keine zusätzlichen Pflichtfelder einführen, die der aktuelle Loader oder Validator nicht verarbeitet.

---

# ResourceType Definition

Ein `ResourceType` beschreibt die Identität und die statischen Eigenschaften eines Ressourcentyps.

Vereinfacht:

```text
ResourceType
├── id
└── statische Resource-Eigenschaften
```

Die statische Definition wird über die `ResourceTypeRegistry` bereitgestellt.

Andere Systeme referenzieren Ressourcentypen über die stabile `ResourceType`-ID.

Beispiel:

```yaml
resourceType: wood
```

oder innerhalb eines Recipe-Contracts:

```yaml
inputs:
  - resourceType: wood
```

Die konkrete Feldstruktur richtet sich nach dem implementierten Content-Contract.

---

# Static vs. Runtime Contract

Der `ResourceType`-Contract beschreibt ausschließlich statische Content-Daten.

Nicht Bestandteil des `ResourceType`-Assets sind:

- aktueller Bestand
- Lagerbestand einer Company
- Produktionsmenge
- Transportmenge
- Marktbestand
- Eigentümer
- Standort
- Runtime-ID
- Inventarposition
- Preis
- laufende Produktionsaufträge

Diese Informationen gehören in die jeweiligen Runtime-/Domain-Modelle.

Die fachliche Trennung lautet:

```text
STATIC CONTENT
──────────────

ResourceType
    id
    statische Eigenschaften


RUNTIME
───────

Resource State
    owner
    location
    quantity
    inventory
    transport
```

Ein ResourceType definiert also **was** eine Ressource ist.

Der Runtime-Zustand definiert **wie viel**, **wo** und **wem** davon vorhanden ist.

---

# Registry Contract

Alle geladenen ResourceType-Definitionen werden über die `ResourceTypeRegistry` verwaltet.

Die Registry ist die kanonische Quelle für geladene statische ResourceType-Definitionen.

Andere Systeme dürfen ResourceTypes nicht über Dateipfade oder Dateinamen referenzieren.

Referenzen erfolgen ausschließlich über stabile IDs.

Beispiel:

```yaml
resourceType: steel
```

Nicht zulässig:

```yaml
resourceType: ./resources/steel.yaml
```

oder:

```yaml
resourceType: ResourceType:123
```

---

# ResourceType References

ResourceTypes werden von anderen Content-Typen und Runtime-Systemen referenziert.

Ein zentraler Consumer ist `Recipe`.

Eine Recipe kann ResourceTypes als Inputs und Outputs referenzieren.

Vereinfacht:

```text
Recipe
    │
    ├── inputs
    │       ↓
    │   ResourceTypeRegistry
    │
    └── outputs
            ↓
        ResourceTypeRegistry
```

Beispiel:

```yaml
inputs:
  - resourceType: wood

outputs:
  - resourceType: charcoal
```

Alle referenzierten ResourceType-IDs müssen in der `ResourceTypeRegistry` existieren.

---

# Recipe Integration

ResourceTypes sind ein zentraler Bestandteil des Produktionssystems.

Eine Recipe definiert:

```text
Recipe
├── inputs
│     └── ResourceType references
│
└── outputs
      └── ResourceType references
```

Damit entsteht folgende Abhängigkeit:

```text
ResourceTypeRegistry
        ▲
        │
        │ inputs / outputs
        │
      Recipe
```

Eine Recipe darf keine nicht existierende ResourceType-ID referenzieren.

Die Validierung erfolgt im Rahmen der zentralen Content-Validierung.

---

# ResourceType and Production

ResourceTypes bilden die fachliche Grundlage für Produktionsprozesse.

Eine Produktionskette kann beispielsweise so aussehen:

```text
ResourceType
    wood
       │
       ▼
Recipe
    produces charcoal
       │
       ▼
ResourceType
    charcoal
```

Die statische ResourceType-Definition beschreibt die Ressource.

Die Recipe beschreibt die Transformation.

Der laufende Produktionsvorgang wird durch den Runtime-/Domain-State repräsentiert.

Diese Ebenen dürfen nicht vermischt werden.

---

# ResourceType and Inventory

Inventory-Systeme referenzieren ResourceTypes über ihre IDs.

Vereinfacht:

```text
ResourceType
    wood
      │
      ▼
Inventory
    quantity: 100
```

Der Wert `100` gehört nicht zum ResourceType-Asset.

Der ResourceType beschreibt lediglich den Ressourcentyp `wood`.

Ein Runtime-Bestand gehört zum Inventory-/Domain-Modell.

---

# ResourceType and Logistics

Logistiksysteme können ResourceTypes transportieren.

Die fachliche Beziehung lautet:

```text
ResourceType
      │
      ▼
Transport / Logistics
      │
      ▼
Runtime Quantity
```

Das statische Asset definiert die Identität des transportierten Ressourcentyps.

Nicht Bestandteil des ResourceType-Schemas sind:

- Transportmenge
- Transportstatus
- Route
- Transportzeit
- Logistikdurchsatz
- Queue Position
- Fahrzeug
- Transportauftrag

Diese Eigenschaften gehören zu den jeweiligen Runtime-/Logistics-Contracts.

---

# Validation Rules

Eine ResourceType-Definition ist gültig, wenn:

- eine gültige `id` vorhanden ist
- die ID dem globalen Asset-ID-Format entspricht
- die ID innerhalb der `ResourceTypeRegistry` eindeutig ist
- alle vom `ResourceTypeValidator` geforderten Felder vorhanden sind
- alle Feldtypen den erwarteten Typen entsprechen
- keine ungültigen Werte verwendet werden
- keine nicht unterstützten Felder als Bestandteil des aktiven Contracts verwendet werden

Die konkrete Feldvalidierung wird durch `ResourceTypeValidator` bestimmt.

Die Dokumentation muss mit diesem Validator synchron bleiben.

---

# Duplicate IDs

ResourceType-IDs müssen eindeutig sein.

Beispiel eines ungültigen Zustands:

```text
wood
wood
```

Innerhalb der geladenen ResourceType-Assets darf eine ID nur einmal vorkommen.

Der Loader bzw. die Content-Pipeline muss doppelte IDs erkennen und ablehnen.

---

# Content Pipeline

ResourceTypes werden als YAML-Assets geladen.

Der vereinfachte Ablauf:

```text
game-content/resources/*.yaml
        ↓
ResourceTypeLoader
        ↓
Parse YAML
        ↓
ResourceTypeValidator
        ↓
Duplicate ID Check
        ↓
ResourceTypeRegistry
        ↓
Cross-Registry Validation
        ↓
Validated Game Content
```

Die ResourceType-Validierung ist Teil der zentralen Content-Validierung.

Ein erfolgreicher Content-Load garantiert, dass die ResourceType-Definitionen formal gültig und innerhalb der Registry eindeutig sind.

---

# Content Location

Die ResourceType-Assets liegen im Content-Verzeichnis:

```text
game-content/resources/
```

Beispiel:

```text
game-content/resources/wood.yaml
```

Der Content-Pfad ist Bestandteil der Content-Pipeline-Konfiguration.

Die Datei- und Verzeichnisnamen dürfen nicht als fachliche IDs anderer Assets verwendet werden.

Die ResourceType-ID wird ausschließlich aus dem Asset-Contract bezogen.

---

# Example

Ein konzeptionelles ResourceType-Asset kann beispielsweise so aussehen:

```yaml
id: wood
```

Weitere Eigenschaften dürfen nur angegeben werden, wenn sie Bestandteil des tatsächlich implementierten `ResourceTypeDefinition`- und `ResourceTypeValidator`-Contracts sind.

Die tatsächlich im Repository vorhandenen ResourceType-Assets bleiben die maßgebliche Quelle für konkrete Werte und Eigenschaften.

---

# Cross-Registry Contract

ResourceTypes stehen insbesondere in Beziehung zu Recipes.

Die zentrale Beziehung lautet:

```text
ResourceTypeRegistry
        ▲
        │
        │ inputs / outputs
        │
      Recipe
```

Eine Recipe referenziert ResourceTypes über stabile IDs.

Beispiel:

```yaml
inputs:
  - resourceType: wood

outputs:
  - resourceType: charcoal
```

Die referenzierten IDs müssen in der `ResourceTypeRegistry` existieren.

Eine nicht existierende ResourceType-ID ist ein Content-Validierungsfehler.

---

# Cross-Registry Validation

Die zentrale Content-Validierung muss sicherstellen, dass referenzierte ResourceTypes existieren.

Insbesondere werden geprüft:

```text
Recipe.inputs
    ↓
ResourceTypeRegistry

Recipe.outputs
    ↓
ResourceTypeRegistry
```

Die Cross-Registry-Prüfung verhindert, dass Content auf nicht existierende ResourceTypes verweist.

---

# Versioning

Das ResourceType-Schema besitzt eine eigene Schema-Version.

Aktuell:

```text
Schema Version: 1
```

Eine Änderung einer veröffentlichten ResourceType-ID ist eine potenziell migrationspflichtige Änderung.

Grund:

```text
ResourceType ID
    ├── Recipes
    ├── Inventory State
    ├── Production State
    ├── Logistics State
    └── weitere Runtime-Referenzen
```

Eine Änderung der ID kann daher bestehende Content-Referenzen und persistierte Runtime-Daten ungültig machen.

---

# Static vs. Runtime Boundary

Die zentrale Grenze lautet:

```text
STATIC CONTENT
──────────────

ResourceType
    ↓
"Was ist diese Ressource?"


RUNTIME / DOMAIN
────────────────

Resource State
    ↓
"Wie viel davon existiert?"
"Wo befindet es sich?"
"Wem gehört es?"
"Wie wird es transportiert?"
```

Diese Trennung ist verbindlich.

Ein ResourceType-Asset darf keinen Runtime-Bestand enthalten.

Insbesondere gehören folgende Felder nicht in ein ResourceType-Asset:

```text
quantity
owner
location
inventory
transportStatus
route
queuePosition
productionProgress
```

---

# Current Implementation Scope

Der aktuelle ResourceType-Contract umfasst:

```text
ResourceTypeDefinition
ResourceTypeValidator
ResourceTypeLoader
ResourceTypeRegistry
ResourceType Loader Tests
Content Validation
Cross-Registry Resource References
```

ResourceTypes werden insbesondere von Produktions- und Inventory-Systemen verwendet.

Die statische ResourceType-Definition ist von Runtime-Beständen getrennt.

---

# Future Extensions

Mögliche zukünftige Erweiterungen können umfassen:

- Resource Categories
- Resource Tags
- Resource Units
- Weight
- Volume
- Storage Constraints
- Transport Constraints
- Perishability
- Hazard Classification
- Market Attributes
- Resource Conversion Metadata

Solche Erweiterungen erfordern jeweils eine explizite Erweiterung des Contracts.

Mindestens folgende Komponenten wären bei einer strukturellen Erweiterung zu prüfen:

```text
ResourceTypeDefinition
ResourceTypeValidator
ResourceTypeLoader
ResourceTypeRegistry
Recipe Validation
Inventory Runtime
Logistics Runtime
Tests
Documentation
```

Nicht implementierte Eigenschaften dürfen nicht als aktiver v1-Contract dokumentiert werden.

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
Recipe.Schema.md
Building.schema.md
Technology.schema.md
Milestone.schema.md
```

Die wichtigste Cross-Registry-Beziehung ist:

```text
ResourceTypeRegistry
        ▲
        │
        │ inputs / outputs
        │
      Recipe
```

---

# Implementation Status

**Status:** Active

`ResourceType` ist ein implementierter Content-Typ der Project-Genesis-Content-Pipeline.

Die relevanten Komponenten umfassen:

```text
ResourceTypeDefinition
ResourceTypeValidator
ResourceTypeLoader
ResourceTypeRegistry
ResourceType Loader Tests
Content Validation
Cross-Registry Reference Validation
```

Der dokumentierte Contract muss mit diesen Implementierungskomponenten synchron bleiben.

Bei Abweichungen zwischen Dokumentation und Implementierung gilt folgende Vorgehensweise:

1. Tatsächlichen Code-Contract feststellen
2. Abweichung dokumentieren
3. Architekturentscheidung treffen
4. Code oder Dokumentation synchronisieren
5. Tests aktualisieren
6. Content-Assets erneut validieren

Die Dokumentation darf keine nicht implementierten ResourceType-Funktionen als aktive v1-Funktionalität darstellen.
