---
Document-ID: DD-002
Title: Production Chain Architecture
Type: Architecture Decision Record
Status: Accepted
Version: 2.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - gameplay/production.md
  - gameplay/recipes.md
  - gameplay/buildings.md
  - gameplay/resources.md
  - schemas/Production.schema.md
  - schemas/Building.schema.md

Related Decisions:
  - DD-001 – Resource Graph
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content
  - DD-031 – Game Content Organization
  - DD-032 – Deterministic Tick Processing

Affected Components:
  - Production System
  - Recipe Registry
  - Building System
  - Inventory System
  - Simulation Engine

Tags:
  - production
  - recipes
  - simulation
  - economy
---

# DD-002 – Production Chain Architecture

## Status

**Accepted**

---

# Zusammenfassung

Alle Produktionsketten in Project Genesis bestehen aus einer Folge datengetriebener Rezepte, die innerhalb der Simulation deterministisch verarbeitet werden.

Gebäude produzieren keine festen Güter. Sie führen ausschließlich definierte Rezepte aus.

---

# Motivation

Produktionsketten bilden das Herzstück der Wirtschaftssimulation.

Das System muss:

- beliebig erweiterbar sein
- leicht balanciert werden können
- DLCs und Mods unterstützen
- deterministisch arbeiten
- ohne Codeänderungen neue Produktionsketten ermöglichen

---

# Problem

Hart codierte Produktionslogik führt zu:

- schlechter Wartbarkeit
- hohem Entwicklungsaufwand
- eingeschränkter Erweiterbarkeit
- vielen Spezialfällen

---

# Entscheidung

Produktionsketten bestehen ausschließlich aus:

- Ressourcen
- Rezepten
- Gebäuden

Die Simulation verarbeitet Rezepte in jedem Tick nach einer festen Reihenfolge.

---

# Architektur

```text
Resources
      │
      ▼
Recipes
      │
      ▼
Buildings
      │
      ▼
Production System
      │
      ▼
Inventory
      │
      ▼
Market
```

---

# Produktionsmodell

Ein Rezept definiert:

- Eingaben
- Ausgaben
- Produktionsdauer
- Energiebedarf
- erforderliches Gebäude
- optionale Technologien

---

# Produktionsablauf

Während eines Simulationsticks:

1. Eingangsmaterial prüfen
2. Kapazität berechnen
3. Energie prüfen
4. Rezept ausführen
5. Ressourcen verbrauchen
6. Produkte erzeugen
7. Ereignisse veröffentlichen

---

# Gebäude

Gebäude besitzen keine fest eingebaute Produktionslogik.

Sie definieren lediglich:

- unterstützte Rezepte
- Kapazität
- Energieverbrauch
- Mitarbeiterbedarf
- Wartungskosten

---

# Rezepte

Rezepte sind vollständig datengetrieben.

Beispiel:

```yaml
id: steel

building: steel_mill

duration: 12

inputs:
  iron_plate: 2
  coal: 1

outputs:
  steel: 1

energy: 30
```

---

# Produktionsnetzwerke

Produktionsketten entstehen durch das Verbinden mehrerer Rezepte.

Beispiel:

```text
Iron Ore
      │
      ▼
Iron Plate
      │
      ▼
Steel
      │
      ▼
Machine Parts
      │
      ▼
Industrial Machine
```

Es existiert keine künstliche Begrenzung der Kettenlänge.

---

# Beziehung zu anderen Systemen

## Inventory

Alle Ein- und Ausgänge erfolgen über das Inventarsystem.

---

## Market

Produzierte Güter können verkauft oder eingelagert werden.

---

## Finance

Produktion verursacht:

- Energiekosten
- Lohnkosten
- Wartungskosten

und erzeugt Umsätze durch Verkauf.

---

## Research

Neue Technologien können:

- Rezepte freischalten
- Produktionsdauer reduzieren
- Effizienz erhöhen

---

## NPC Economy

NPC-Unternehmen nutzen dieselben Rezepte wie Spieler.

Es existieren keine Sonderregeln.

---

# Determinismus

Produktionsberechnungen erfolgen ausschließlich während des Simulationsticks.

Es gibt:

- keine parallelen Berechnungen
- keine Zufallsproduktion
- keine asynchronen Änderungen

---

# Data-Driven Content

Produktionsketten befinden sich ausschließlich in:

```text
game-content/

recipes/
buildings/
resources/
```

Neue Produktionsketten benötigen keine Codeänderungen.

---

# Validierung

Beim Start werden geprüft:

- fehlende Ressourcen
- ungültige Gebäude
- doppelte Rezept-IDs
- ungültige Produktionszeiten
- negative Mengen
- Zyklen innerhalb einzelner Rezepte

---

# Vorteile

- Hohe Erweiterbarkeit
- Klare Trennung von Daten und Logik
- Einheitliches Produktionsmodell
- Modding-fähig
- Deterministische Verarbeitung
- Einfache Balance-Anpassungen

---

# Nachteile

- Höherer Validierungsaufwand
- Komplexere Content-Definition

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Hardcodierte Fabriken

Verworfen.

Grund:

Neue Gebäude würden Codeänderungen erfordern.

---

## Produktionslogik pro Gebäude

Verworfen.

Grund:

Doppelte Logik und schlechte Erweiterbarkeit.

---

# Implementierung

```text
src/

simulation/

production/

ProductionSystem.ts
RecipeExecutor.ts
RecipeRegistry.ts
ProductionPlanner.ts

game-content/

recipes/
buildings/
resources/
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Produktionslogik ist generisch.
- Gebäude kennen keine Produkte.
- Rezepte beschreiben ausschließlich Transformationen.
- Alle Produktionsdaten stammen aus `game-content`.
- Änderungen erfolgen ausschließlich innerhalb des Simulationsticks.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Erweiterbarkeit
- Wartbarkeit
- Determinismus
- Performance
- Datengetriebenes Design
- Modding

---

# Risiken

Mögliche Risiken:

- fehlerhafte Rezeptdefinitionen
- Balancing-Probleme
- ungültige Abhängigkeiten

Diese Risiken werden durch Content-Validierung und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Erste Version |
| 2.0.0 | 2026-07-03 | Vollständige Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Gebäude produzieren nichts – sie führen Rezepte aus.“**

Die Produktionsarchitektur von Project Genesis basiert vollständig auf datengetriebenen Rezepten und dem Resource Graph. Dadurch entstehen flexible, deterministische Produktionsketten, die ohne Änderungen an der Simulation beliebig erweitert werden können.