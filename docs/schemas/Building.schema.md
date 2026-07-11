# Building Schema

> Definiert das Datenmodell aller Gebäude in Project Genesis.

Version: 1.0

---

# Zweck

Gebäude bilden die physische Infrastruktur eines Unternehmens.

Ein Gebäude besitzt keine wirtschaftliche Logik.

Es stellt lediglich Kapazität, Funktionen und Eigenschaften bereit.

Die eigentliche Produktion wird vollständig durch Rezepte definiert.

---

# Grundprinzip

```
Gebäude

↓

stellt Kapazität bereit

↓

führt Rezepte aus

↓

erzeugt Produktion

↓

Produkte gelangen ins Lager
```

---

# Schema

```yaml
id:

buildingType:

playerId:

name:

status:

level:

position:

rotation:

health:

efficiency:

productionLines:

installedModules:

connectedRoads:

connectedPower:

storage:

maintenance:

construction:

upgrades:

statistics:

createdAt:

updatedAt:
```

---

# Feldbeschreibung

## id

Eindeutige Gebäude-ID.

Beispiel

```text
BUILDING-00001234
```

---

## buildingType

Technischer Gebäudetyp.

Beispiele

```text
SAWMILL

IRON_MINE

WAREHOUSE

POWER_PLANT

HEADQUARTERS
```

---

## playerId

Besitzer des Gebäudes.

---

## name

Individueller Name.

Beispiel

```text
Sägewerk Nord
```

---

## status

Mögliche Zustände

```text
PLANNED

UNDER_CONSTRUCTION

ACTIVE

PAUSED

BLOCKED

MAINTENANCE

DAMAGED

DEMOLISHED
```

---

## level

Aktuelle Ausbaustufe.

Version 1

Standard:

```text
1
```

---

## position

Koordinaten auf dem Grundstück.

```yaml
x: 12

y: 7
```

---

## rotation

Gebäudeausrichtung.

```text
0°

90°

180°

270°
```

---

## health

Gebäudezustand.

Bereich

```text
0 - 100
```

100 = neuwertig

---

## efficiency

Aktuelle Produktionseffizienz.

Bereich

```text
0.0 - 1.5
```

1.0 = Normalleistung

---

## productionLines

Liste der Produktionslinien.

Beispiel

```yaml
productionLines:

- LINE-001

- LINE-002
```

Version 1

Maximal:

```text
1
```

---

## installedModules

Installierte Erweiterungen.

Beispiele

```text
SPEED_MODULE

ENERGY_MODULE

QUALITY_MODULE

AI_CONTROLLER
```

---

## connectedRoads

Angeschlossene Straßen.

Spätere Version.

---

## connectedPower

Stromnetz.

Version 1

Boolean

```yaml
true
```

---

## storage

Internes Gebäudelager.

Version 1

Optional.

---

## maintenance

```yaml
lastMaintenance:

nextMaintenance:

maintenanceLevel:
```

---

## construction

```yaml
startedAt:

finishedAt:

constructionTime:
```

---

## upgrades

Installierte Verbesserungen.

```yaml
upgrades:

- UPGRADE_SPEED_1

- UPGRADE_STORAGE_1
```

---

## statistics

Gesammelte Kennzahlen.

Beispiel

```yaml
statistics:

totalProduced:

totalConsumed:

operatingHours:

energyUsed:

maintenanceCost:
```

---

# Gebäudetypen

Version 1

## Produktion

- SAWMILL
- STONE_QUARRY
- IRON_MINE
- STEEL_MILL
- FARM

---

## Energie

- COAL_POWER_PLANT
- SOLAR_PLANT

---

## Lager

- WAREHOUSE

---

## Infrastruktur

- ROAD
- POWER_SUBSTATION

---

## Verwaltung

- HEADQUARTERS
- RESEARCH_CENTER

---

# Gebäudeeigenschaften

Jeder Gebäudetyp definiert zusätzlich:

```yaml
size:

energyUsage:

maintenanceCost:

constructionCost:

constructionTime:

allowedRecipes:

maxProductionLines:

requiredResearch:

requiredMilestones:
```

---

# Beispiel

```yaml
buildingType: SAWMILL

size:

width: 3

height: 3

energyUsage: 10

maintenanceCost: 5

constructionCost: 5000

constructionTime: 120

allowedRecipes:

- RECIPE_PLANKS

- RECIPE_BEAMS

maxProductionLines: 1
```

---

# Lebenszyklus

```
Planung

↓

Bau

↓

Aktiv

↓

Produktion

↓

Wartung

↓

Modernisierung

↓

Abriss
```

---

# Beziehungen

```
Building

├── gehört zu → Player

├── besitzt → Production Queue

├── führt aus → Production Job

├── erlaubt → Recipes

├── verbraucht → Energy

├── erzeugt → Events

├── besitzt → Modules

└── steht auf → Grundstück
```

---

# Designregeln

✔ Ein Gebäude besitzt genau einen Besitzer.

✔ Ein Gebäude besitzt genau einen Typ.

✔ Ein Gebäude besitzt genau eine Position.

✔ Ein Gebäude besitzt maximal eine aktive Warteschlange.

✔ Gebäude enthalten keine Produktionsrezepte.

✔ Gebäude kennen keine Marktpreise.

✔ Gebäude kennen keine Spielerlogik.

✔ Gebäude kennen keine Wirtschaftslogik.

---

# Definition of Done

Ein Gebäude ist vollständig definiert, wenn:

- Typ festgelegt
- Position gesetzt
- Besitzer bekannt
- Status gesetzt
- Energie definiert
- Produktionslinien erstellt
- Wartung definiert
- Upgrades möglich

---

# Erweiterbarkeit

Version 2

- Mehrere Produktionslinien
- Gebäudemodule
- Fabrikverbünde
- Cluster

Version 3

- Spezialisierte Gebäude
- Regionale Varianten
- KI-gesteuerte Fabriken
- Wartungsroboter

---

# Leitsatz

> "Gebäude sind die Infrastruktur des Unternehmens – nicht seine Intelligenz."

Gebäude stellen Kapazität bereit. Rezepte, Forschung und Automatisierung bestimmen ihre Leistungsfähigkeit.