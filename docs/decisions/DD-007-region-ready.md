---
Document-ID: DD-007
Title: Region-Ready Architecture
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
  - gameplay/world.md
  - gameplay/transport.md
  - gameplay/market.md
  - gameplay/npc-economy.md
  - schemas/Building.schema.md
  - schemas/Company.schema.md

Related Decisions:
  - DD-003 – Global Identifiers
  - DD-005 – Production Network
  - DD-006 – Economic Simulation
  - DD-022 – Logistics Network Architecture
  - DD-033 – Savegame and Persistence Strategy

Affected Components:
  - World System
  - Simulation Engine
  - Market System
  - Transport System
  - Company System
  - Savegame System

Tags:
  - world
  - regions
  - scalability
  - simulation
---

# DD-007 – Region-Ready Architecture

## Status

**Accepted**

---

# Zusammenfassung

Die Architektur von Project Genesis wird von Beginn an auf die Unterstützung mehrerer Regionen ausgelegt.

Auch wenn die erste Spielversion nur eine Region enthält, dürfen Architektur und Datenmodelle keine Annahmen über eine einzelne Welt treffen.

---

# Motivation

Die langfristige Vision umfasst:

- mehrere Regionen
- unterschiedliche Wirtschaftsräume
- regionale Märkte
- verschiedene Ressourcenverteilungen
- regionale Gesetze und Steuern
- zukünftige DLCs und Szenarien

Diese Erweiterungen sollen ohne grundlegende Architekturänderungen möglich sein.

---

# Problem

Eine Architektur mit der Annahme "es gibt genau eine Welt" führt später zu:

- aufwändigen Refactorings
- komplexen Sonderfällen
- inkonsistenten Datenmodellen
- schwer wartbarer Logik

---

# Entscheidung

Alle räumlichen Objekte gehören genau einer Region an.

Regionen bilden die oberste räumliche Organisationsebene der Simulation.

---

# Architektur

```text
World
   │
   ├── Region A
   │      │
   │      ├── Buildings
   │      ├── Companies
   │      ├── Markets
   │      └── Transport Network
   │
   ├── Region B
   │      │
   │      ├── Buildings
   │      ├── Companies
   │      ├── Markets
   │      └── Transport Network
   │
   └── Region C
```

---

# Regionsmodell

Jede Region besitzt:

- eindeutige ID
- Namen
- Kartenbereich
- Ressourcenverteilung
- Markt
- Infrastruktur
- Wirtschaftsparameter

---

# Regionale Zuständigkeiten

Eine Region verwaltet unter anderem:

- Gebäude
- Unternehmen
- Lager
- Transportnetz
- lokale Märkte
- Produktionsnetzwerke

Globale Systeme koordinieren die Zusammenarbeit zwischen Regionen.

---

# Regionale Märkte

Märkte können regional organisiert sein.

Preisunterschiede zwischen Regionen sind ausdrücklich vorgesehen.

Beispiele:

- unterschiedliche Rohstoffpreise
- Transportaufschläge
- regionale Nachfrage
- lokale Produktionsschwerpunkte

---

# Transport zwischen Regionen

Interregionale Transporte erfolgen ausschließlich über das Transport System.

Dabei können berücksichtigt werden:

- Entfernung
- Transportkosten
- Transportdauer
- Infrastruktur
- Kapazitäten

---

# Simulation

Die Simulation verarbeitet Regionen in einer deterministischen Reihenfolge.

Für jede Region werden nacheinander ausgeführt:

1. Produktion
2. Lager
3. Transport
4. Markt
5. Finanzen

Anschließend werden regionenübergreifende Prozesse berechnet.

---

# Datenmodell

Alle räumlichen Objekte referenzieren ihre Region.

Beispiel:

```yaml
building:
  id: steel_mill_01
  regionId: central_valley
```

---

# Savegames

Savegames speichern Regionen unabhängig voneinander.

Dadurch werden zukünftige Erweiterungen und Migrationen erleichtert.

---

# Data-Driven Architektur

Regionen werden vollständig über Content-Dateien definiert.

```text
game-content/

regions/
```

Neue Regionen erfordern keine Änderungen an der Simulation Engine.

---

# Vorteile

- Zukunftssichere Architektur
- Unterstützung mehrerer Karten
- Regionale Wirtschaftsräume
- DLC-fähig
- Modding-freundlich
- Gute Skalierbarkeit

---

# Nachteile

- Etwas komplexere Datenmodelle
- Zusätzliche Referenzen über `regionId`

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Eine globale Welt ohne Regionen

Verworfen.

Grund:

Nicht erweiterbar und ungeeignet für zukünftige Inhalte.

---

## Regionen nur als Kartenobjekte

Verworfen.

Grund:

Regionen sollen wirtschaftliche und organisatorische Einheiten sein, nicht nur geografische Bereiche.

---

# Implementierung

```text
src/

world/
    Region.ts
    RegionRegistry.ts
    WorldSystem.ts

simulation/
    RegionSimulationRunner.ts

game-content/

regions/
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Jedes räumliche Objekt besitzt eine `regionId`.
- Systeme dürfen keine globale Einzelregion voraussetzen.
- Regionen werden über den Content Loader registriert.
- Regionen können unabhängig voneinander simuliert werden.
- Interregionale Interaktionen erfolgen ausschließlich über definierte Systeme (z. B. Transport oder Handel).

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Skalierbarkeit
- Erweiterbarkeit
- Wartbarkeit
- Modding
- Zukunftssicherheit

---

# Risiken

Mögliche Risiken:

- Höhere Komplexität bei interregionalen Prozessen
- Zusätzlicher Speicherbedarf
- Synchronisationsaufwand zwischen Regionen

Diese Risiken werden durch klare Verantwortlichkeiten und deterministische Simulationsabläufe minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung                                                          |
| ------- | ---------- | ----------------------------------------------------------------- |
| 1.0.0   | 2026-07-03 | Erste Version                                                     |
| 2.0.0   | 2026-07-03 | Vollständige Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Die Welt besteht aus Regionen – nicht aus einer einzigen Karte.“**

Die Region-Ready Architecture stellt sicher, dass Project Genesis von Beginn an auf mehrere Wirtschaftsräume, Karten und Szenarien vorbereitet ist. Regionen bilden die räumliche Grundlage für Märkte, Transport, Produktion und zukünftige Erweiterungen, ohne dass grundlegende Änderungen an der Architektur erforderlich sind.
