# Milestone.schema.md

**Version:** 1.0
**Status:** Active
**Asset Type:** Milestone
**Schema Version:** 1

---

# Purpose

Dieses Dokument definiert den kanonischen Content-Contract für Milestone-Assets in Project Genesis.

Ein Milestone beschreibt ein dauerhaft erreichbares Fortschrittsziel innerhalb des Spiels.

Milestones werden als statische Content-Definitionen geladen und über die `MilestoneRegistry` registriert.

Der aktuelle Fortschritts- und Completion-Status eines Milestones gehört nicht zum statischen Asset, sondern zum Runtime-Zustand der jeweiligen Company.

Aktuell implementierte Milestone-Trigger sind:

- `FIRST_SALE`
- `PRODUCTION_VOLUME`
- `PROFIT_THRESHOLD`

Weitere Trigger sind zukünftige Erweiterungen und dürfen nicht als Bestandteil des aktuellen v1-Contracts betrachtet werden.

---

# Architecture

Der Milestone-Content folgt der Standard-Content-Pipeline:

```text
Milestone YAML Asset
        ↓
MilestoneLoader
        ↓
MilestoneValidator
        ↓
Duplicate ID Validation
        ↓
MilestoneRegistry
        ↓
Runtime Evaluation
        ↓
CompanyMilestones
```

Die statische Definition wird von der Runtime-Auswertung getrennt.

```text
Milestone Definition
        │
        ├── statischer Content
        │
        ▼
MilestoneRegistry
        │
        ▼
MilestoneEvaluationService
        │
        ▼
CompanyMilestones
        │
        ▼
Milestone Completion State
```

Der Completion State wird persistent im Runtime-/Savegame-Zustand verwaltet.

---

# Asset Identity

Jeder Milestone besitzt eine eindeutige Asset-ID.

Beispiele:

```text
milestone.first_production
milestone.first_profit
milestone.first_steel
milestone.profit_100
```

Die ID muss dem globalen Asset-ID-Contract entsprechen.

Aktuell gilt:

```regex
^[a-z0-9_]+$
```

Die ID muss innerhalb der `MilestoneRegistry` eindeutig sein.

Eine Milestone-ID darf nach Veröffentlichung nicht ohne kontrollierte Migration geändert werden, da andere Content-Assets und Runtime-Daten auf diese ID referenzieren können.

---

# Required Fields

Der konkrete v1-Contract besteht aus den vom `MilestoneDefinition` und `MilestoneValidator` unterstützten Feldern.

Mindestens erforderlich sind:

| Feld        | Typ    | Beschreibung                               |
| ----------- | ------ | ------------------------------------------ |
| `id`        | string | Eindeutige Milestone-ID                    |
| `trigger`   | enum   | Definiert die Art der Milestone-Erreichung |
| `condition` | object | Trigger-spezifische Erreichungsbedingung   |

Weitere Felder dürfen nur verwendet werden, wenn sie durch den implementierten `MilestoneDefinition`- und `MilestoneValidator`-Contract unterstützt werden.

Die Dokumentation darf keine zusätzlichen Pflichtfelder einführen, die der aktuelle Loader oder Validator nicht verarbeitet.

---

# Trigger Types

Der aktuell implementierte v1-Contract unterstützt genau folgende Trigger:

```text
FIRST_SALE
PRODUCTION_VOLUME
PROFIT_THRESHOLD
```

Diese Werte sind Teil des kanonischen Runtime-Contracts.

---

# FIRST_SALE

`FIRST_SALE` wird erreicht, sobald die Company ihren ersten gültigen Verkauf abgeschlossen hat.

Für diesen Trigger ist keine zusätzliche Mengenbedingung erforderlich.

Beispiel:

```yaml
id: milestone.first_sale

trigger: FIRST_SALE

condition: {}
```

Die konkrete Asset-Struktur muss dem tatsächlich vom `MilestoneLoader` und `MilestoneValidator` unterstützten YAML-Format entsprechen.

Die Runtime erkennt das relevante Verkaufsereignis und markiert den Milestone für die Company als erreicht.

---

# PRODUCTION_VOLUME

`PRODUCTION_VOLUME` wird erreicht, wenn eine definierte Produktionsmenge erreicht wurde.

Unterstützte Bedingungen:

| Feld       | Typ              | Beschreibung                                |
| ---------- | ---------------- | ------------------------------------------- |
| `count`    | number           | Erforderliche Produktionsmenge              |
| `recipeId` | string, optional | Optionaler Filter auf eine bestimmte Recipe |

Beispiel für eine allgemeine Produktionsmenge:

```yaml
id: milestone.first_production

trigger: PRODUCTION_VOLUME

condition:
  count: 1
```

Beispiel für eine Recipe-spezifische Produktionsmenge:

```yaml
id: milestone.first_steel

trigger: PRODUCTION_VOLUME

condition:
  count: 1
  recipeId: recipe.steel
```

Die `recipeId` muss auf eine gültige Recipe-ID verweisen.

Die referenzierte Recipe muss über die `RecipeRegistry` verfügbar sein.

---

# PROFIT_THRESHOLD

`PROFIT_THRESHOLD` wird erreicht, wenn der definierte Schwellenwert erreicht wurde.

Die aktuelle v1-Semantik basiert auf kumulierten Verkaufserlösen in Game Currency (GC).

Unterstützte Bedingung:

| Feld     | Typ    | Beschreibung                       |
| -------- | ------ | ---------------------------------- |
| `amount` | number | Erforderlicher Schwellenwert in GC |

Beispiel:

```yaml
id: milestone.first_profit

trigger: PROFIT_THRESHOLD

condition:
  amount: 1
```

Ein höherer Schwellenwert kann beispielsweise so definiert werden:

```yaml
id: milestone.profit_100

trigger: PROFIT_THRESHOLD

condition:
  amount: 100
```

Die genaue Interpretation des Schwellenwerts muss mit der implementierten Milestone-Evaluation konsistent bleiben.

---

# Condition Rules

Die Struktur von `condition` ist vom Trigger-Typ abhängig.

## FIRST_SALE

```yaml
condition: {}
```

## PRODUCTION_VOLUME

```yaml
condition:
  count: <positive number>
```

Optional:

```yaml
condition:
  count: <positive number>
  recipeId: <valid recipe id>
```

## PROFIT_THRESHOLD

```yaml
condition:
  amount: <positive number>
```

Nicht unterstützte Condition-Felder dürfen nicht als gültige Milestone-Konfiguration betrachtet werden.

---

# Asset References

Aktuell kann ein `PRODUCTION_VOLUME`-Milestone optional eine Recipe referenzieren.

Beispiel:

```yaml
recipeId: recipe.steel
```

Die Referenz muss gegen die `RecipeRegistry` validiert werden.

Milestones selbst definieren keine generische Asset-Referenzierungslogik für:

- Buildings
- Technologies
- Employees
- Vehicles
- Scenarios
- Biomes
- Missions

Solche Beziehungen dürfen erst dokumentiert werden, wenn sie durch den tatsächlichen Implementierungsvertrag unterstützt werden.

---

# Milestone Dependencies

Andere Content-Typen können Milestones als Voraussetzungen referenzieren.

Das aktuell implementierte Referenzmuster ist:

```yaml
requiredMilestones:
  - milestone.first_production
```

Diese Referenzen werden gegen die `MilestoneRegistry` validiert.

Aktuell relevante Consumer sind insbesondere:

- BuildingType
- Recipe
- Technology

Die Validierung erfolgt über die zentrale Content-Validierung und `validateMilestoneReferences`.

Eine ungültige oder nicht existierende Milestone-ID führt zu einem Content-Validierungsfehler.

---

# Runtime Completion State

Das Milestone-Asset enthält ausschließlich die statische Definition.

Nicht Bestandteil des Milestone-Assets sind:

- aktueller Fortschritt
- Completion State
- Completion Timestamp
- Company-ID
- bereits ausgelöste Events
- bereits vergebene Rewards

Der Runtime-Status wird separat verwaltet.

Vereinfacht:

```text
Static Content
──────────────

Milestone Definition
    id
    trigger
    condition


Runtime State
────────────

CompanyMilestones
    companyId
    reachedMilestoneIds
```

Ein bereits erreichter Milestone wird für die jeweilige Company dauerhaft als erreicht gespeichert.

Die Runtime-Persistenz gehört zum Savegame-/Domain-State und nicht zum statischen Content-Schema.

---

# Milestone Evaluation

Die Bewertung eines Milestones erfolgt zur Laufzeit anhand relevanter Domain Events bzw. Domain State.

Beispiel:

```text
Sale Completed
      ↓
Milestone Evaluation
      ↓
FIRST_SALE condition
      ↓
Milestone reached
      ↓
CompanyMilestones updated
```

Für Produktionsvolumen:

```text
Production Completed
      ↓
Recipe identified
      ↓
Production count updated
      ↓
PRODUCTION_VOLUME condition evaluated
      ↓
Milestone reached
```

Für Profit-Schwellen:

```text
Relevant Sales / Revenue
      ↓
Cumulative Value
      ↓
PROFIT_THRESHOLD condition evaluated
      ↓
Milestone reached
```

Die konkrete Event- und Service-Architektur wird nicht durch das statische Milestone-Schema definiert.

---

# Validation Rules

Ein Milestone ist gültig, wenn:

- eine gültige `id` vorhanden ist
- die ID dem globalen Asset-ID-Format entspricht
- die ID innerhalb der `MilestoneRegistry` eindeutig ist
- ein unterstützter `trigger` angegeben ist
- eine gültige `condition` für den Trigger vorhanden ist
- alle trigger-spezifischen Pflichtfelder vorhanden sind
- numerische Schwellenwerte gültig sind
- referenzierte Recipes existieren
- keine unbekannten oder nicht unterstützten Trigger verwendet werden

## Trigger-spezifische Validierung

### FIRST_SALE

- keine zusätzliche numerische Schwelle erforderlich
- keine nicht unterstützten Condition-Felder

### PRODUCTION_VOLUME

- `count` muss gültig und positiv sein
- `recipeId` ist optional
- falls `recipeId` angegeben ist, muss die Recipe existieren

### PROFIT_THRESHOLD

- `amount` muss gültig und positiv sein

---

# Registry Contract

Alle Milestone-Assets werden über die `MilestoneRegistry` verwaltet.

Die Registry ist die kanonische Quelle für geladene Milestone-Definitionen.

Andere Content-Definitionen dürfen Milestones nicht über Dateipfade oder Dateinamen referenzieren.

Referenzen erfolgen ausschließlich über stabile Milestone-IDs.

Beispiel:

```yaml
requiredMilestones:
  - milestone.first_production
```

Nicht zulässig:

```yaml
requiredMilestones:
  - ./milestones/first_production.yaml
```

---

# Content Pipeline

Milestones werden als Teil der zentralen Content-Pipeline verarbeitet.

Der vereinfachte Ablauf:

```text
game-content/milestones/*.yaml
        ↓
MilestoneLoader
        ↓
Parse YAML
        ↓
MilestoneValidator
        ↓
Duplicate ID Check
        ↓
MilestoneRegistry
        ↓
Cross-Registry Validation
        ↓
Validated Game Content
```

Die zentrale Content-Validierung prüft zusätzlich Milestone-Referenzen anderer Content-Typen.

Dazu gehören insbesondere:

```text
BuildingType
Recipe
Technology
```

mit:

```yaml
requiredMilestones:
  - <milestone-id>
```

---

# Current v1 Examples

## First Production

```yaml
id: milestone.first_production

trigger: PRODUCTION_VOLUME

condition:
  count: 1
```

## First Steel

```yaml
id: milestone.first_steel

trigger: PRODUCTION_VOLUME

condition:
  count: 1
  recipeId: recipe.steel
```

## First Profit

```yaml
id: milestone.first_profit

trigger: PROFIT_THRESHOLD

condition:
  amount: 1
```

## Profit 100

```yaml
id: milestone.profit_100

trigger: PROFIT_THRESHOLD

condition:
  amount: 100
```

Die Beispiele dienen der Darstellung des v1-Contracts. Die tatsächlich im Repository vorhandenen Assets bleiben die maßgebliche Quelle für konkrete Produktions- und Profit-Schwellen.

---

# Versioning

Das Milestone-Schema besitzt eine eigene Schema-Version.

Beispiel:

```text
Schema Version: 1
```

Einzelne Milestone-Assets können zusätzlich eine Asset-Version besitzen, sofern dies durch den globalen Asset-Versionierungsstandard unterstützt wird.

Eine Änderung der Milestone-ID ist keine einfache inhaltliche Änderung.

Da Milestone-IDs von anderen Assets referenziert und im Runtime-State gespeichert werden können, erfordert eine ID-Änderung eine kontrollierte Migration.

---

# Static vs. Runtime Contract

## Static Content

```text
Milestone
├── id
├── trigger
└── condition
```

## Runtime

```text
CompanyMilestones
├── companyId
└── reachedMilestoneIds
```

Diese beiden Ebenen dürfen nicht vermischt werden.

Ein Milestone-Asset darf keinen individuellen Completion State enthalten.

---

# Current Implementation Scope

Der aktuelle v1-Implementierungsumfang ist bewusst begrenzt auf:

```text
FIRST_SALE
PRODUCTION_VOLUME
PROFIT_THRESHOLD
```

Aktuell nicht Bestandteil des v1-Contracts sind beispielsweise:

```text
EMPLOYEE_HIRED
VEHICLE_ACQUIRED
TECHNOLOGY_RESEARCHED
BUILDING_CONSTRUCTED
TRANSPORT_COMPLETED
RESOURCE_COLLECTED
RESOURCE_DELIVERED
```

Diese Begriffe dürfen nur als zukünftige Erweiterungen betrachtet werden.

Sie sind **nicht** als aktuell unterstützte Milestone-Trigger zu implementieren oder zu dokumentieren.

---

# Future Extensions

Mögliche zukünftige Erweiterungen können umfassen:

- weitere Trigger-Typen
- zusammengesetzte Conditions
- mehrere Conditions pro Milestone
- Milestone Chains
- progressive Milestones
- wiederholbare Milestones
- Milestone Rewards
- Szenario-spezifische Milestones
- Missionsintegration
- Achievement-Integration

Solche Erweiterungen erfordern jeweils eine Erweiterung von:

```text
MilestoneDefinition
MilestoneValidator
MilestoneLoader
MilestoneRegistry
MilestoneEvaluationService
```

sowie entsprechende Tests und Dokumentationsanpassungen.

---

# Compatibility

Dieses Schema steht in Beziehung zu:

```text
ASSET_ID_SYSTEM.md
ASSET_VERSIONING.md
REGISTRY_SCHEMA.md
GLOBAL_ASSET_REGISTRY.md
CONTENT_PIPELINE.md
```

und insbesondere zu:

```text
Recipe.Schema.md
Building.schema.md
Technology.schema.md
```

Die Cross-Registry-Referenzen werden über die jeweiligen Registry-Contracts validiert.

---

# Implementation Status

**Status:** Active

Der Milestone-Content-Typ ist Bestandteil der implementierten Content-Pipeline.

Vorhandene Architekturkomponenten:

```text
MilestoneDefinition
MilestoneValidator
MilestoneLoader
MilestoneRegistry
MilestoneLoader Tests
Milestone Reference Validation
Milestone Runtime Evaluation
CompanyMilestones Runtime State
```

Der dokumentierte v1-Contract muss mit diesen Implementierungskomponenten synchron bleiben.

Bei Abweichungen zwischen Dokumentation und Implementierung gilt:

1. tatsächlicher validierter Code-Contract feststellen
2. Abweichung dokumentieren
3. Entscheidung treffen
4. Code oder Dokumentation synchronisieren
5. Tests aktualisieren

Die Dokumentation darf keine nicht implementierten Trigger als aktive v1-Funktionalität darstellen.
