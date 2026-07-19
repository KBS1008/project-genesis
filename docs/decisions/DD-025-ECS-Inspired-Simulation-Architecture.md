# DD-025 – ECS Inspired Simulation Architecture

Status: Accepted

Version: 1.0

Datum: 2026-07-02

Authors:

- Project Genesis Architecture

---

# Zusammenfassung

Die Simulationsengine von Project Genesis orientiert sich an den Prinzipien eines Entity Component Systems (ECS).

Es wird **kein vollständiges ECS-Framework** verwendet.

Stattdessen übernimmt die Architektur die wichtigsten Konzepte:

- Daten werden von Verhalten getrennt.
- Systeme arbeiten unabhängig voneinander.
- Entities bestehen ausschließlich aus Daten.
- Spiellogik befindet sich ausschließlich in den Systems.

Dadurch entsteht eine modulare, testbare und hoch skalierbare Architektur.

---

# Kontext

Klassische objektorientierte Spiele entwickeln häufig sehr große Klassen.

Beispiel:

```text
Building

├── produce()
├── consumeEnergy()
├── hireEmployees()
├── research()
├── trade()
├── maintain()
├── update()
```

Mit wachsender Spielkomplexität entstehen:

- große Klassen
- viele Abhängigkeiten
- schwierige Wartung
- hoher Testaufwand

Project Genesis soll langfristig hunderte Gebäude, Ressourcen und Produktionsketten unterstützen.

---

# Entscheidung

Die Simulationsengine trennt konsequent zwischen:

- Entities
- Components
- Systems

---

# Architektur

```text
                    Entity

                       │

        ┌──────────────┼──────────────┐

        ▼              ▼              ▼

 Personal      Energy      Inventory

        ▼              ▼              ▼

                Systems

      Production System

      Energy System

      Finance System

      Market System

      Research System

      Transport System

      Maintenance System
```

---

# Entities

Entities repräsentieren Spielobjekte.

Beispiele:

- Company
- Building
- Resource
- Market
- Contract
- Production Order

Entities besitzen selbst keine Spiellogik.

---

# Components

Components enthalten ausschließlich Daten.

Beispiele:

## Personal Component

- Mitarbeiterbedarf
- Zugewiesene Mitarbeitende

---

## Energy Component

- Energieverbrauch
- Energieerzeugung

---

## Inventory Component

- Lagerbestand
- Kapazität

---

## Production Component

- Rezept
- Produktionsgeschwindigkeit

---

## Finance Component

- Betriebskosten
- Einnahmen

---

## Maintenance Component

- Wartungszustand
- Verschleiß

---

# Systems

Systems enthalten sämtliche Spiellogik.

Beispiele:

## Production System

Berechnet Produktionsfortschritt.

---

## Energy System

Berechnet Energieversorgung.

---

## Market System

Verarbeitet Kauf- und Verkaufsaufträge.

---

## Research System

Berechnet Forschungsfortschritt.

---

## Finance System

Bucht Einnahmen und Ausgaben.

---

## Transport System

Verarbeitet Transportaufträge.

---

## Maintenance System

Berechnet Wartung und Verschleiß.

---

# Ablauf eines Simulationsticks

```text
Simulation Tick

↓

Production System

↓

Inventory System

↓

Transport System

↓

Energy System

↓

Finance System

↓

Market System

↓

Research System

↓

Statistik aktualisieren
```

Jedes System arbeitet unabhängig.

---

# Vorteile

## Geringe Kopplung

Systeme kennen sich möglichst nicht gegenseitig.

---

## Gute Testbarkeit

Jedes System kann isoliert getestet werden.

---

## Erweiterbarkeit

Neue Systeme können ergänzt werden, ohne bestehende Systeme zu verändern.

---

## Performance

Systeme können später parallel ausgeführt werden.

---

## Wartbarkeit

Die Trennung zwischen Daten und Verhalten reduziert die Komplexität erheblich.

---

# Versionierung

## Version 1

- ECS-inspirierte Architektur
- Entities
- Components
- Systems

---

## Version 2

Zusätzlich:

- Event Queue
- Priorisierte Systeme
- Performance-Optimierungen

---

## Version 3

Zusätzlich:

- Parallelisierung
- Multi-Core Simulation
- Regionale Simulationen

---

# Konsequenzen

## Vorteile

✔ Hohe Skalierbarkeit

✔ Klare Verantwortlichkeiten

✔ Gute Erweiterbarkeit

✔ Einfache Wartung

✔ Hohe Testbarkeit

✔ Zukunftssicher

---

## Nachteile

- Höherer initialer Architekturaufwand
- Mehr Dateien
- Gewöhnungsbedürftig für Entwickler ohne ECS-Erfahrung

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternative

Eine rein objektorientierte Architektur mit umfangreichen Building-Klassen wurde verworfen.

Gründe:

- hohe Kopplung
- schwer testbar
- schwierige Erweiterbarkeit
- steigende Komplexität

---

# Implementierungshinweise

Die Simulationsengine verarbeitet ausschließlich Datenobjekte.

Alle Spiellogik befindet sich in dedizierten Systems.

Die Reihenfolge der Systemausführung wird zentral definiert und ist konfigurierbar.

Neue Spielfunktionen werden möglichst durch neue Systems ergänzt, ohne bestehende Systeme anzupassen.

---

# Related Decisions

- DD-018 – Multi-Layer Market Architecture
- DD-020 – Dynamic Workforce Allocation
- DD-021 – Unified Building Capacity Model
- DD-022 – Abstract Logistics Network
- DD-023 – Company Progression Without Player Levels
- DD-024 – Data-Driven Game Configuration

---

# Affected Documents

- simulation.md
- buildings.md
- production.md
- energy.md
- market.md
- finance.md
- transport.md

---

# Affected Components

- Simulation Engine
- Game Loop
- Production System
- Energy System
- Market System
- Finance System
- Research System
- Transport System

---

# Leitsatz

> "Daten beschreiben die Welt – Systeme verändern sie."

Project Genesis trennt konsequent zwischen Daten und Spiellogik. Dadurch entsteht eine modulare, skalierbare und langfristig wartbare Simulationsarchitektur, die neue Spielmechaniken ohne tiefgreifende Änderungen am bestehenden Code integrieren kann.
