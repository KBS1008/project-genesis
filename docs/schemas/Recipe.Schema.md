# Recipe Schema

> Definiert das Datenmodell eines Produktionsrezepts.

Version: 1.0

---

# Zweck

Ein Rezept beschreibt **wie** ein Produkt hergestellt wird.

Gebäude produzieren keine Produkte.

Gebäude stellen lediglich Produktionskapazität bereit.

Das Rezept definiert:

- benötigte Rohstoffe
- erzeugte Produkte
- Produktionsdauer
- Energiebedarf
- Mitarbeiterbedarf
- Voraussetzungen

Dadurch kann jedes Gebäude mehrere Rezepte ausführen.

---

# Grundprinzip

```
Gebäude

↓

Rezept auswählen

↓

Input prüfen

↓

Produktion starten

↓

Produktionszeit

↓

Output erzeugen
```

---

# Schema

```yaml
id:

name:

description:

version:

category:

buildingTypes:

inputs:

outputs:

duration:

energy:

workers:

requiredResearch:

requiredBuildings:

requiredMilestones:

requiredResources:

maintenanceCost:

productionCost:

experience:

tags:

enabled:
```

---

# Feldbeschreibung

## id

Eindeutige technische ID.

Beispiel

```text
RECIPE_PLANKS
```

---

## name

Anzeigename.

```text
Bretter herstellen
```

---

## description

Beschreibung für UI.

---

## version

Versionsnummer des Rezepts.

Ermöglicht spätere Änderungen ohne Datenverlust.

---

## category

Mögliche Kategorien:

```text
WOOD

METAL

CHEMICAL

FOOD

ENERGY

ELECTRONICS

TEXTILE

LOGISTICS
```

---

## buildingTypes

Liste erlaubter Gebäude.

Beispiel

```yaml
buildingTypes:

- SAWMILL
```

Ein Rezept kann später von mehreren Gebäuden unterstützt werden.

---

## inputs

Liste aller Eingangsprodukte.

Beispiel

```yaml
inputs:

- resource: WOOD
  amount: 10

- resource: WATER
  amount: 5
```

---

## outputs

Liste aller erzeugten Produkte.

```yaml
outputs:

- resource: PLANKS
  amount: 20
```

---

## duration

Produktionszeit.

Einheit:

Sekunden

Beispiel

```yaml
duration: 60
```

---

## energy

Benötigte Energie.

Einheit:

kWh pro Produktionszyklus

```yaml
energy: 12
```

---

## workers

Benötigte Mitarbeiter.

```yaml
workers: 2
```

---

## requiredResearch

Notwendige Forschung.

```yaml
requiredResearch:

- RESEARCH_ADVANCED_SAWING
```

---

## requiredBuildings

Weitere Voraussetzungen.

Beispiel

```yaml
requiredBuildings:

- WAREHOUSE_LEVEL_2
```

---

## requiredMilestones

Freischaltung über Meilensteine.

```yaml
requiredMilestones:

- FIRST_1000_PLANKS
```

---

## requiredResources

Besondere Verbrauchsmaterialien.

Optional.

---

## maintenanceCost

Wartungskosten pro Produktionszyklus.

```yaml
maintenanceCost: 3
```

---

## productionCost

Zusätzliche Produktionskosten.

Beispiel:

Chemikalien

Werkzeuge

Schmierstoffe

---

## experience

Unternehmenserfahrung.

Version 1

Optional.

---

## tags

Freie Tags.

Beispiel

```yaml
tags:

- WOOD

- BASIC

- EARLY_GAME
```

---

## enabled

Aktiviert oder deaktiviert Rezept.

---

# Vollständiges Beispiel

```yaml
id: RECIPE_PLANKS

name: Bretter herstellen

description: Verarbeitung von Holz zu Brettern.

version: 1

category: WOOD

buildingTypes:

  - SAWMILL

inputs:

  - resource: WOOD
    amount: 10

outputs:

  - resource: PLANKS
    amount: 20

duration: 60

energy: 12

workers: 2

requiredResearch: []

requiredBuildings: []

requiredMilestones: []

requiredResources: []

maintenanceCost: 2

productionCost: 1

experience: 5

tags:

  - BASIC

  - WOOD

enabled: true
```

---

# Designregeln

✔ Jedes Rezept besitzt mindestens einen Input.

✔ Jedes Rezept besitzt mindestens einen Output.

✔ Produktionsdauer ist immer größer als 0.

✔ Ressourcen werden niemals negativ.

✔ Ein Rezept kennt keine Preise.

✔ Ein Rezept kennt keinen Markt.

✔ Ein Rezept kennt keinen Spieler.

✔ Ein Rezept kennt kein Gebäudeobjekt.

Nur den Gebäudetyp.

---

# Balancing

Rezepte definieren ausschließlich Produktionsparameter.

Preisbildung erfolgt ausschließlich durch den Markt.

Gebäude definieren Kapazität.

Mitarbeiter definieren Effizienz.

Forschung erweitert Rezepte.

Automatisierung steuert die Nutzung.

---

# Versionierung

Rezepte dürfen später erweitert werden.

Neue Felder müssen optional sein.

Bestehende Spielstände dürfen niemals ungültig werden.

---

# Beziehungen

```
Recipe

├── benötigt → Resources

├── produziert → Resources

├── läuft in → BuildingType

├── benötigt → Research

├── erzeugt → Events

├── verbraucht → Energy

└── wird genutzt von → ProductionQueue
```

---

# Definition of Done

Ein Rezept ist vollständig definiert, wenn:

- alle Eingaben bekannt sind
- alle Ausgaben bekannt sind
- Dauer definiert ist
- Energie definiert ist
- Mitarbeiter definiert sind
- Voraussetzungen definiert sind
- Version gesetzt ist

---

# Leitsatz

> "Gebäude stellen Kapazität bereit. Rezepte erschaffen Wert."

Das Rezept ist die kleinste wirtschaftliche Einheit in Project Genesis.