---
Document-ID: DD-011
Title: Recipe-Based Production
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
  - gameplay/resources.md
  - schemas/Production.schema.md
  - schemas/Building.schema.md

Related Decisions:
  - DD-001 – Resource Graph
  - DD-002 – Production Chain Architecture
  - DD-004 – Common Schema
  - DD-005 – Production Network
  - DD-008 – No Magic Numbers
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content

Affected Components:
  - Production System
  - Building System
  - Inventory System
  - Content Loader
  - Simulation Engine

Tags:
  - production
  - recipes
  - data-driven
  - simulation
---

# DD-011 – Recipe-Based Production

## Status

**Accepted**

---

# Zusammenfassung

Alle Produktionsprozesse in Project Genesis basieren auf **Rezepten**.

Gebäude enthalten keine fest implementierte Produktionslogik. Stattdessen führen sie Rezepte aus, die vollständig über Content-Dateien definiert werden.

Dadurch werden Produktion, Balancing und Modding vollständig datengetrieben.

---

# Motivation

Viele Gebäude unterscheiden sich ausschließlich durch:

- Eingangsressourcen
- Ausgangsressourcen
- Produktionsdauer
- Energiebedarf
- benötigte Mitarbeitende

Diese Unterschiede lassen sich wesentlich flexibler durch Rezepte als durch spezialisierte Gebäudelogik modellieren.

---

# Problem

Werden Produktionsabläufe direkt in Gebäuden implementiert, entstehen:

- redundanter Code
- schwer wartbare Produktionslogik
- eingeschränkte Erweiterbarkeit
- hoher Aufwand für Balancing
- erschwertes Modding

---

# Entscheidung

Produktionsabläufe werden ausschließlich über Rezepte definiert.

Gebäude stellen lediglich die Infrastruktur bereit, um Rezepte auszuführen.

---

# Architektur

```text
Building
      │
      ▼
Supported Recipes
      │
      ▼
Recipe
      │
      ├── Inputs
      ├── Outputs
      ├── Duration
      ├── Energy
      ├── Employees
      └── Conditions
```

---

# Verantwortlichkeiten

## Gebäude

Gebäude definieren:

- unterstützte Rezepte
- Produktionskapazität
- Lagerkapazität
- Energieanschluss
- Mitarbeiterkapazität

Gebäude kennen keine Produktionsdetails.

---

## Rezept

Ein Rezept definiert:

- Eingangsressourcen
- Ausgangsressourcen
- Produktionsdauer
- Energieverbrauch
- Mitarbeiterbedarf
- optionale Voraussetzungen

---

# Beispiel

## Building

```yaml
id: steel_mill

supportedRecipes:
  - steel_plate
  - reinforced_steel
```

---

## Recipe

```yaml
id: steel_plate

inputs:
  iron_ore: 2
  coal: 1

outputs:
  steel_plate: 1

duration: 60

energy: 25

employees: 4
```

---

# Produktionsablauf

Während eines Simulationsticks:

1. Rezept auswählen
2. Voraussetzungen prüfen
3. Ressourcen reservieren
4. Produktionsfortschritt berechnen
5. Ressourcen erzeugen
6. Lager aktualisieren

---

# Vorteile

- Wiederverwendbare Produktionslogik
- Einfache Erweiterbarkeit
- Datengetriebenes Balancing
- Geringere Codekomplexität
- Modding-Unterstützung

---

# Erweiterbarkeit

Neue Produktionsprozesse benötigen lediglich:

- ein neues Rezept
- ein Gebäude, das dieses Rezept unterstützt

Der Produktionscode bleibt unverändert.

---

# Beziehung zu anderen Systemen

## Building System

Stellt Produktionskapazitäten bereit.

---

## Inventory System

Liefert Eingangsressourcen und speichert Ausgangsressourcen.

---

## Energy System

Prüft den Energiebedarf eines Rezepts.

---

## Employee System

Stellt erforderliche Mitarbeitende bereit.

---

## Research System

Kann neue Rezepte freischalten.

---

## Market System

Bewertet produzierte Ressourcen wirtschaftlich.

---

# Data-Driven Architektur

Rezepte werden vollständig über Content-Dateien definiert.

```text
game-content/

recipes/
buildings/
resources/
```

Neue Rezepte erfordern keine Änderungen an der Simulation Engine.

---

# Determinismus

Rezepte werden ausschließlich innerhalb des Simulationsticks ausgeführt.

Die Reihenfolge der Verarbeitung ist fest definiert und garantiert reproduzierbare Ergebnisse.

---

# Vorteile

- Hohe Flexibilität
- Konsistente Produktionslogik
- Klare Trennung von Infrastruktur und Produktionsprozess
- Einfaches Balancing
- Hervorragende Modding-Unterstützung

---

# Nachteile

- Größere Anzahl an Content-Dateien
- Zusätzliche Validierung erforderlich

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Produktionslogik im Gebäude

Verworfen.

Grund:

Hohe Redundanz und geringe Erweiterbarkeit.

---

## Hardcodierte Produktionsketten

Verworfen.

Grund:

Widerspricht dem datengetriebenen Architekturansatz.

---

# Implementierung

```text
src/

production/
    RecipeSystem.ts
    RecipeExecutor.ts
    RecipeRegistry.ts
    ProductionPlanner.ts

content/
    RecipeLoader.ts

game-content/

recipes/
buildings/
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Produktionslogik gehört ausschließlich in das Recipe System.
- Gebäude definieren keine Produktionsabläufe.
- Neue Produktionsarten werden durch neue Rezepte ergänzt.
- Rezepte werden vor der Registrierung validiert.
- Produktionsparameter stammen ausschließlich aus dem `game-content`.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Wartbarkeit
- Erweiterbarkeit
- Modding
- Datengetriebenes Design
- Wiederverwendbarkeit
- Konsistenz

---

# Risiken

Mögliche Risiken:

- ungültige Rezeptdefinitionen
- fehlende Ressourcenreferenzen
- Balancing-Probleme

Diese Risiken werden durch Schema-Validierung, automatisierte Tests und Content-Prüfungen minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Erste Version |
| 2.0.0 | 2026-07-03 | Vollständige Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Gebäude produzieren nicht – sie führen Rezepte aus.“**

Die Trennung zwischen Produktionsinfrastruktur und Produktionslogik ermöglicht eine vollständig datengetriebene Architektur. Gebäude stellen Kapazitäten bereit, während Rezepte sämtliche Produktionsregeln definieren. Dadurch bleibt Project Genesis flexibel, leicht balancierbar und optimal für zukünftige Erweiterungen und Modding vorbereitet.