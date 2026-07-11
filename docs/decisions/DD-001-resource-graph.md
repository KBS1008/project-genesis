---
Document-ID: DD-001
Title: Resource Graph
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
  - gameplay/resources.md
  - gameplay/production.md
  - gameplay/recipes.md
  - gameplay/market.md
  - schemas/ResourceType.schema.md
  - schemas/Production.schema.md

Related Decisions:
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content
  - DD-031 – Game Content Organization
  - DD-032 – Deterministic Tick Processing

Affected Components:
  - Resource System
  - Production System
  - Market System
  - Research System
  - Content Loader

Tags:
  - resources
  - production
  - economy
  - simulation
---

# DD-001 – Resource Graph

## Status

**Accepted**

---

# Zusammenfassung

Alle Ressourcen und Produktionsketten in Project Genesis werden als **gerichteter Ressourcen-Graph** modelliert.

Jede Produktion beschreibt lediglich eine Transformation von Ressourcen.

Dadurch entstehen:

- flexible Produktionsketten
- beliebig komplexe Industrien
- einfache Erweiterbarkeit
- deterministische Simulation

---

# Motivation

Nahezu alle Spielsysteme basieren auf Ressourcen:

- Produktion
- Forschung
- Energie
- Baukosten
- Transport
- Markt
- NPC-Wirtschaft

Ein gemeinsames Modell verhindert Spezialfälle und doppelte Logik.

---

# Problem

Ein hart codiertes Produktionssystem führt zu:

- redundanten Berechnungen
- schlechter Erweiterbarkeit
- kompliziertem Balancing
- hohem Entwicklungsaufwand

---

# Entscheidung

Alle Produktionsprozesse werden als Knoten eines Ressourcen-Graphen dargestellt.

Der Graph besteht aus:

- Ressourcen (Nodes)
- Transformationen (Edges)

---

# Architektur

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

Die Simulation kennt keine Sonderfälle.

Alles ist lediglich eine Umwandlung von Ressourcen.

---

# Grundprinzip

Jedes Rezept besitzt:

- Eingangsressourcen
- Ausgangsressourcen
- Produktionsdauer
- Gebäude
- Energiebedarf
- optionale Voraussetzungen

---

# Beispiel

```yaml
recipe: steel

inputs:
  iron_plate: 2
  coal: 1

outputs:
  steel: 1

duration: 12

building: steel_mill

energy: 30
```

---

# Ressourcenarten

Es wird nicht zwischen verschiedenen Logiktypen unterschieden.

Beispiele:

## Rohstoffe

- Eisen
- Kupfer
- Kohle
- Öl

---

## Zwischenprodukte

- Stahl
- Kunststoff
- Glas
- Chemikalien

---

## Endprodukte

- Maschinen
- Fahrzeuge
- Elektronik

---

## Energie

Energie wird als Ressource modelliert.

Beispiele:

- Electricity
- Steam
- Fuel
- Hydrogen

---

## Wissen

Auch Forschung verwendet Ressourcen.

Beispiele:

- Research Points
- Blueprints
- Patents

---

# Graph-Eigenschaften

Der Graph ist:

- gerichtet
- azyklisch innerhalb eines einzelnen Rezepts
- modular erweiterbar
- datengetrieben

Zyklen über mehrere Produktionsketten sind erlaubt, sofern sie spielmechanisch sinnvoll sind.

---

# Beziehung zur Simulation

```text
Resources
      │
      ▼
Recipes
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

# Beziehung zu anderen Systemen

## Buildings

Gebäude führen Rezepte aus.

---

## Market

Marktpreise beziehen sich auf Ressourcen.

---

## Transport

Transport bewegt Ressourcen zwischen Standorten.

---

## Finance

Alle Kosten und Umsätze entstehen durch Ressourcenflüsse.

---

## NPC Economy

NPC-Unternehmen produzieren und konsumieren dieselben Ressourcen wie der Spieler.

---

## Research

Neue Technologien schalten zusätzliche Ressourcen oder Rezepte frei.

---

# Data-Driven Ansatz

Alle Ressourcen werden außerhalb des Codes definiert.

Beispiel:

```text
game-content/

resources/

recipes/
```

Neue Ressourcen benötigen keine Codeänderungen.

---

# Validierung

Beim Start werden geprüft:

- eindeutige IDs
- fehlende Referenzen
- ungültige Mengen
- doppelte Definitionen
- ungültige Gebäudereferenzen

Fehler verhindern den Start der Simulation.

---

# Determinismus

Die Berechnung erfolgt ausschließlich während des Simulationsticks.

Es gibt:

- keine Zufallsproduktion
- keine zeitabhängigen Sonderfälle
- keine asynchronen Änderungen

Dadurch bleibt die Simulation vollständig reproduzierbar.

---

# Vorteile

- Einheitliches Modell
- Sehr hohe Erweiterbarkeit
- Einfache Balance-Anpassungen
- DLC- und Mod-fähig
- Deterministische Verarbeitung
- Klare Datenstrukturen

---

# Nachteile

- Höhere Anforderungen an die Content-Validierung
- Komplexere Produktionsketten können schwerer zu analysieren sein

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Hardcodierte Produktionsketten

Verworfen.

Grund:

Nicht erweiterbar und wartungsintensiv.

---

## Unterschiedliche Systeme für jede Ressourcengruppe

Verworfen.

Grund:

Erhöht die Komplexität ohne erkennbaren Nutzen.

---

# Implementierung

```text
game-content/

resources/
recipes/

src/

simulation/

production/

ResourceGraph.ts
RecipeRegistry.ts
ProductionPlanner.ts
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Ressourcen besitzen ausschließlich eindeutige IDs.
- Rezepte beschreiben nur Transformationen.
- Produktionslogik enthält keine fest codierten Ressourcen.
- Alle Inhalte werden aus `game-content` geladen.
- Neue Ressourcen dürfen keine Änderungen an der Simulation Engine erfordern.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Erweiterbarkeit
- Wartbarkeit
- Performance
- Determinismus
- Modding
- Datengetriebenes Design

---

# Risiken

Mögliche Risiken:

- ungültige Produktionsketten
- fehlende Referenzen
- Balancing-Probleme

Diese Risiken werden durch Content-Validierung und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Erste Version |
| 2.0.0 | 2026-07-03 | Vollständige Überarbeitung, Anpassung an aktuelle Architektur |

---

# Leitsatz

> **„Alles ist eine Ressource – jede Produktion ist lediglich ihre Transformation.“**

Der Ressourcen-Graph bildet das Fundament der Wirtschaftssimulation von Project Genesis. Sämtliche Produktionsketten, Märkte und wirtschaftlichen Prozesse basieren auf einem gemeinsamen, datengetriebenen Modell, das deterministisch simuliert und beliebig erweitert werden kann.