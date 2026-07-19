---
Document-ID: DD-005
Title: Production Network
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
  - gameplay/buildings.md
  - gameplay/transport.md
  - gameplay/resources.md
  - schemas/Production.schema.md
  - schemas/Building.schema.md

Related Decisions:
  - DD-001 – Resource Graph
  - DD-002 – Production Chain Architecture
  - DD-003 – Global Identifiers
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content
  - DD-032 – Deterministic Tick Processing

Affected Components:
  - Production System
  - Building System
  - Transport System
  - Inventory System
  - NPC Economy
  - Simulation Engine

Tags:
  - production
  - network
  - logistics
  - simulation
---

# DD-005 – Production Network

## Status

**Accepted**

---

# Zusammenfassung

Produktionsanlagen bilden keine isolierten Fabriken, sondern ein zusammenhängendes Produktionsnetzwerk.

Gebäude werden über Materialflüsse miteinander verbunden. Das Netzwerk bildet die Grundlage für Produktion, Lagerhaltung, Transport und wirtschaftliche Optimierung.

---

# Motivation

Moderne Industrie besteht aus vernetzten Produktionsketten.

Ein Netzwerkmodell ermöglicht:

- komplexe Produktionsketten
- zentrale Lager
- spezialisierte Fabriken
- realistische Logistik
- wirtschaftliche Optimierung

---

# Problem

Isolierte Produktionsgebäude führen zu:

- unrealistischen Abläufen
- redundanten Lagerbeständen
- eingeschränkter Skalierbarkeit
- unnötigen Spezialfällen

---

# Entscheidung

Alle Produktionsgebäude sind Teil eines gemeinsamen Produktionsnetzwerks.

Material bewegt sich ausschließlich über definierte Materialflüsse zwischen den Netzwerkknoten.

---

# Architektur

```text
Iron Mine
      │
      ▼
Warehouse
      │
      ├────────────┐
      ▼            ▼
Steel Mill    Foundry
      │            │
      └──────┬─────┘
             ▼
Machine Factory
             │
             ▼
Distribution Center
             │
             ▼
Market
```

---

# Netzwerkmodell

Ein Produktionsnetzwerk besteht aus:

- Produktionsgebäuden
- Lagern
- Transportverbindungen
- Materialflüssen

Gebäude sind Knoten.

Materialbewegungen bilden die Kanten.

---

# Materialfluss

Ressourcen bewegen sich ausschließlich entlang definierter Verbindungen.

Jeder Transfer berücksichtigt:

- verfügbare Menge
- Transportkapazität
- Entfernung
- Transportdauer
- Energiebedarf

---

# Lager

Lager dienen als Puffer zwischen Produktionsschritten.

Sie:

- speichern Ressourcen
- entkoppeln Produktionszyklen
- reduzieren Produktionsstillstände

---

# Produktionsplanung

Jeder Simulationstick berechnet:

1. Materialbedarf
2. verfügbare Bestände
3. Transportmöglichkeiten
4. Produktionskapazitäten
5. resultierende Materialflüsse

---

# Beziehung zu anderen Systemen

## Production System

Führt Rezepte auf Basis verfügbarer Materialien aus.

---

## Inventory System

Verwaltet Bestände an jedem Netzwerkknoten.

---

## Transport System

Bewegt Ressourcen zwischen Gebäuden.

---

## Energy System

Versorgt Produktions- und Transportprozesse.

---

## Finance System

Erfasst Transport-, Lager- und Produktionskosten.

---

## NPC Economy

NPC-Unternehmen nutzen dieselben Netzwerkmechanismen wie Spielerunternehmen.

---

# Determinismus

Die Berechnung des Produktionsnetzwerks erfolgt ausschließlich innerhalb des Simulationsticks.

Die Reihenfolge ist fest definiert:

1. Bedarf
2. Transport
3. Produktion
4. Lageraktualisierung

Dadurch bleibt das Netzwerk vollständig reproduzierbar.

---

# Data-Driven Architektur

Netzwerkregeln werden über Content-Dateien definiert.

```text
game-content/

buildings/
recipes/
resources/
transport/
```

Gebäude und Rezepte definieren lediglich ihre Eigenschaften. Das Produktionsnetzwerk entsteht dynamisch zur Laufzeit.

---

# Vorteile

- Realistische Produktionsketten
- Hohe Skalierbarkeit
- Flexible Fabriklayouts
- Einheitliche Logik
- Einfache Erweiterbarkeit
- Gute Grundlage für Optimierungen

---

# Nachteile

- Höhere Komplexität bei der Materialflussberechnung
- Größerer Rechenaufwand bei sehr großen Netzwerken

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Isolierte Produktionsgebäude

Verworfen.

Grund:

Keine realistischen Lieferketten und eingeschränkte Skalierung.

---

## Feste Produktionspfade

Verworfen.

Grund:

Zu unflexibel für unterschiedliche Fabriklayouts und Modding.

---

# Implementierung

```text
src/

simulation/

production/
    ProductionNetwork.ts
    MaterialFlowPlanner.ts
    ProductionPlanner.ts

transport/
    TransportPlanner.ts

inventory/
    InventoryManager.ts
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Produktionsnetzwerke werden dynamisch aus Gebäuden und Verbindungen aufgebaut.
- Gebäude besitzen keine Kenntnis über ihre Nachbarn.
- Materialflüsse werden zentral berechnet.
- Transport erfolgt ausschließlich über das Transport System.
- Produktionsentscheidungen basieren auf verfügbaren Ressourcen und Kapazitäten.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Skalierbarkeit
- Wartbarkeit
- Determinismus
- Erweiterbarkeit
- Realistische Wirtschaftssimulation

---

# Risiken

Mögliche Risiken:

- Engpässe durch unzureichende Transportkapazitäten
- Zirkuläre Materialflüsse
- Performance bei sehr großen Netzwerken

Diese Risiken werden durch Validierung, deterministische Berechnung und spätere Optimierungsalgorithmen minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung                                             |
| ------- | ---------- | ---------------------------------------------------- |
| 1.0.0   | 2026-07-03 | Erste Version                                        |
| 2.0.0   | 2026-07-03 | Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Produktion ist kein einzelnes Gebäude – sie ist ein Netzwerk aus Materialflüssen.“**

Das Production Network verbindet Gebäude, Lager und Transport zu einem gemeinsamen, deterministischen System. Dadurch entstehen realistische Lieferketten, skalierbare Fabrikstrukturen und eine flexible Grundlage für Wirtschaft, Logistik und zukünftige Erweiterungen.
