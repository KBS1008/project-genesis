# ResourceType Schema

> Definiert das Datenmodell aller Ressourcen in Project Genesis.

Version: 1.0

---

# Zweck

Ein ResourceType beschreibt die Eigenschaften einer Ressource.

Er definiert:

- was eine Ressource ist
- wie sie transportiert wird
- wie sie gelagert wird
- welche Basiseigenschaften sie besitzt

Er enthält **keine spielerspezifischen Daten**.

---

# Grundprinzip

```
ResourceType

↓

wird gelagert als

↓

Inventory Item

↓

wird gehandelt über

↓

Market Order

↓

wird verwendet in

↓

Recipe
```

---

# Schema

```yaml
id:

name:

description:

category:

tier:

state:

weight:

volume:

basePrice:

marketEnabled:

tradable:

stackSize:

storageType:

transportType:

qualityEnabled:

decayEnabled:

hazardous:

flammable:

recyclable:

energyValue:

requiredResearch:

tags:

enabled:

version:
```

---

# Feldbeschreibung

## id

Technische ID.

Beispiel

```text
WOOD
```

---

## name

Anzeigename.

```text
Holz
```

---

## description

Beschreibung für UI und Wiki.

---

## category

Hauptkategorie.

```text
PRIMARY_RESOURCE

PROCESSED_RESOURCE

INDUSTRIAL_MATERIAL

COMPONENT

PRODUCT

SPECIAL
```

---

## tier

Komplexitätsstufe.

```text
1

2

3

4

5

6
```

---

## state

Physikalischer Zustand.

```text
SOLID

LIQUID

GAS

ENERGY
```

---

## weight

Gewicht einer Einheit.

Einheit

kg

```yaml
weight: 5
```

---

## volume

Lagervolumen.

Einheit

Liter

```yaml
volume: 4
```

---

## basePrice

Interner Referenzpreis.

Wird ausschließlich für:

- Balancing
- NPC-Aufträge
- Statistiken

verwendet.

Nicht als Marktpreis.

---

## marketEnabled

Kann gehandelt werden.

```yaml
true
```

---

## tradable

Darf von Spielern gehandelt werden.

---

## stackSize

Maximale Stapelgröße.

Version 1

```yaml
999999
```

---

## storageType

Erforderlicher Lagertyp.

```text
WAREHOUSE

SILO

TANK

REFRIGERATED

HAZARDOUS
```

Version 1

Alle Ressourcen verwenden

```text
WAREHOUSE
```

---

## transportType

Bevorzugtes Transportmittel.

```text
TRUCK

TRAIN

SHIP

PIPELINE

POWER_GRID
```

Version 1

Nur Information.

---

## qualityEnabled

Unterstützt Qualitätsstufen.

Version 1

```yaml
false
```

---

## decayEnabled

Kann verderben.

Version 1

```yaml
false
```

Später:

Lebensmittel.

---

## hazardous

Gefahrgut.

---

## flammable

Entzündlich.

---

## recyclable

Kann recycelt werden.

---

## energyValue

Optional.

Nur für Energieträger.

Beispiel

```yaml
energyValue: 24
```

---

## requiredResearch

Benötigte Forschung.

```yaml
requiredResearch:

- RESEARCH_OIL_PROCESSING
```

---

## tags

Freie Klassifizierung.

```yaml
tags:

- WOOD

- EARLY_GAME

- NATURAL
```

---

## enabled

Aktiviert.

---

## version

Schema-Version.

---

# Beispiel

```yaml
id: WOOD

name: Holz

description: Rohholz aus nachhaltiger Forstwirtschaft.

category: PRIMARY_RESOURCE

tier: 1

state: SOLID

weight: 5

volume: 6

basePrice: 25

marketEnabled: true

tradable: true

stackSize: 999999

storageType: WAREHOUSE

transportType: TRUCK

qualityEnabled: false

decayEnabled: false

hazardous: false

flammable: true

recyclable: true

energyValue: 0

requiredResearch: []

tags:

- WOOD

- NATURAL

- BASIC

enabled: true

version: 1
```

---

# Beziehungen

```
ResourceType

├── wird genutzt von → Recipe

├── wird gelagert als → Inventory Item

├── wird gehandelt über → Market Order

├── wird transportiert über → Transport

├── wird erforscht über → Research

└── besitzt → Marktstatistik
```

---

# Designregeln

✔ Jede Ressource besitzt eine eindeutige ID.

✔ IDs werden niemals geändert.

✔ Namen dürfen lokalisiert werden.

✔ Marktpreise gehören nicht zur Ressource.

✔ Lagerbestände gehören nicht zur Ressource.

✔ Eigentümer gehören nicht zur Ressource.

✔ Produktionsrezepte gehören nicht zur Ressource.

✔ Die Ressource beschreibt ausschließlich ihre Eigenschaften.

---

# Erweiterbarkeit

Version 2

- Qualitätsstufen
- Reinheit
- Temperatur
- Feuchtigkeit
- Herkunft

Version 3

- Radioaktivität
- Haltbarkeit
- CO₂-Fußabdruck
- Zertifizierungen
- Regionale Varianten

---

# Definition of Done

Ein ResourceType ist vollständig definiert, wenn:

- ID vorhanden
- Kategorie festgelegt
- Tier definiert
- Gewicht bekannt
- Volumen bekannt
- Lagerart definiert
- Transportart definiert
- Handelsfähigkeit definiert
- Version gesetzt

---

# Leitsatz

> "Eine Ressource beschreibt ihre Eigenschaften – niemals ihren aktuellen Zustand."

Alle dynamischen Informationen (Lagerbestand, Marktpreis, Eigentümer, Reservierungen) werden in eigenen Datenmodellen gespeichert.