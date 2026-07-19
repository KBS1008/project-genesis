---
Document-ID: DD-009
Title: Deterministic Simulation
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
  - architecture/SAD.md
  - gameplay/economy.md
  - gameplay/production.md
  - gameplay/market.md
  - gameplay/npc-economy.md

Related Decisions:
  - DD-005 – Production Network
  - DD-006 – Economic Simulation
  - DD-008 – No Magic Numbers
  - DD-027 – Event-Driven Simulation Architecture
  - DD-028 – CQRS Lite
  - DD-032 – Deterministic Tick Processing
  - DD-033 – Savegame and Persistence Strategy

Affected Components:
  - Simulation Engine
  - Production System
  - Market System
  - Finance System
  - Transport System
  - NPC Economy
  - Event Bus
  - Savegame System

Tags:
  - simulation
  - deterministic
  - architecture
  - reproducibility
---

# DD-009 – Deterministic Simulation

## Status

**Accepted**

---

# Zusammenfassung

Die Simulation von Project Genesis ist vollständig deterministisch.

Bei identischem Startzustand, identischer Konfiguration und identischen Eingaben erzeugt die Simulation stets denselben Zustand.

Determinismus ist ein grundlegendes Architekturprinzip und gilt für sämtliche Simulationssysteme.

---

# Motivation

Eine deterministische Simulation ermöglicht:

- reproduzierbare Ergebnisse
- einfache Fehlersuche
- zuverlässige Savegames
- automatisierte Tests
- spätere Multiplayer-Unterstützung (Lockstep)
- Replay-Funktionalität

---

# Problem

Nicht-deterministische Berechnungen führen zu:

- schwer reproduzierbaren Fehlern
- unterschiedlichen Spielständen
- inkonsistenten Simulationen
- schwierigen Regressionstests

---

# Entscheidung

Alle Spielsysteme werden deterministisch berechnet.

Das Ergebnis eines Simulationsticks darf ausschließlich abhängen von:

- aktuellem Spielzustand
- Konfigurationsdaten
- Spieleraktionen
- deterministischen Zufallszahlen (Seed)

Externe Einflüsse dürfen das Simulationsergebnis nicht verändern.

---

# Grundprinzip

```text
State(t)
      │
      ▼
Simulation Tick
      │
      ▼
State(t + 1)
```

Der gleiche Eingabestatus erzeugt immer denselben Folgezustand.

---

# Tick-basierte Verarbeitung

Alle Änderungen erfolgen ausschließlich innerhalb eines Simulationsticks.

Außerhalb eines Ticks werden keine Änderungen am Spielzustand vorgenommen.

---

# Reihenfolge

Die Verarbeitung erfolgt in einer festen Reihenfolge:

1. Spieleraktionen übernehmen
2. Produktion
3. Lagerverwaltung
4. Transport
5. Energie
6. Markt
7. Finanzen
8. Forschung
9. NPC-Unternehmen
10. Ereignisse veröffentlichen
11. Statistiken aktualisieren

Diese Reihenfolge ist unveränderlich.

---

# Zufall

Zufallsereignisse sind erlaubt.

Sie müssen jedoch einen deterministischen Zufallszahlengenerator verwenden.

Beispiel:

```text
Seed + Tick + Event-ID
```

Es dürfen keine systemabhängigen Zufallsquellen verwendet werden.

---

# Parallelisierung

Parallelisierung ist zulässig.

Voraussetzungen:

- identische Ergebnisse unabhängig von der Thread-Reihenfolge
- keine Race Conditions
- keine konkurrierenden Schreibzugriffe

Falls diese Bedingungen nicht erfüllt werden können, erfolgt die Berechnung sequentiell.

---

# Zeit

Die Simulation verwendet ausschließlich Simulationszeit.

Nicht zulässig:

- Systemzeit
- Uhrzeit
- lokale Zeitzone

Beispiel:

Nicht erlaubt:

```typescript
Date.now();
```

Erlaubt:

```typescript
simulation.currentTick;
```

---

# Ereignisse

Domain Events beschreiben abgeschlossene Änderungen.

Events verändern den Zustand nicht direkt.

Sie werden nach Abschluss des Simulationsticks verarbeitet.

---

# Savegames

Ein Savegame speichert ausschließlich den Simulationszustand.

Nach dem Laden muss die Simulation exakt reproduzierbar sein.

---

# Beziehung zu anderen Systemen

## Production System

Produziert deterministisch anhand verfügbarer Ressourcen.

---

## Market System

Berechnet Preise ausschließlich aus dem aktuellen Simulationszustand.

---

## Finance System

Bucht Einnahmen und Ausgaben in fester Reihenfolge.

---

## NPC Economy

Verwendet dieselben Regeln wie das Spielerunternehmen.

---

## Event Bus

Veröffentlicht ausschließlich abgeschlossene Zustandsänderungen.

---

# Vorteile

- Reproduzierbare Simulation
- Einfaches Debugging
- Stabile Savegames
- Replay-Unterstützung
- Gute Testbarkeit
- Multiplayer-fähige Architektur
- Vorhersagbares Verhalten

---

# Nachteile

- Höhere Anforderungen an die Implementierung
- Eingeschränkte Nutzung bestimmter Framework-Funktionen
- Zusätzliche Sorgfalt bei Parallelisierung

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Echtzeitbasierte Berechnungen

Verworfen.

Grund:

Nicht reproduzierbar.

---

## Verwendung der Systemzeit

Verworfen.

Grund:

Abhängig von Betriebssystem und Hardware.

---

## Unkontrollierte Parallelisierung

Verworfen.

Grund:

Nicht deterministische Ergebnisse.

---

# Implementierung

```text
src/

simulation/
    SimulationEngine.ts
    SimulationTickRunner.ts
    TickScheduler.ts
    DeterministicRandom.ts

common/
    SimulationClock.ts
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Keine Verwendung von `Date.now()`, `Math.random()` oder vergleichbaren nicht-deterministischen Funktionen innerhalb der Simulation.
- Zustandsänderungen erfolgen ausschließlich während eines Simulationsticks.
- Alle Systeme arbeiten in einer festen Reihenfolge.
- Deterministische Zufallszahlen werden ausschließlich über den zentralen Zufallszahlengenerator erzeugt.
- Parallelisierung darf das Ergebnis der Simulation nicht beeinflussen.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Determinismus
- Testbarkeit
- Wartbarkeit
- Reproduzierbarkeit
- Skalierbarkeit
- Multiplayer-Vorbereitung

---

# Risiken

Mögliche Risiken:

- versehentliche Nutzung nicht-deterministischer APIs
- inkonsistente Verarbeitung bei Parallelisierung
- fehlerhafte Event-Reihenfolge

Diese Risiken werden durch Code Reviews, automatisierte Tests und statische Analysen minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung                                                          |
| ------- | ---------- | ----------------------------------------------------------------- |
| 1.0.0   | 2026-07-03 | Erste Version                                                     |
| 2.0.0   | 2026-07-03 | Vollständige Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Gleiche Eingaben erzeugen immer dieselbe Welt.“**

Die deterministische Simulation bildet das Fundament von Project Genesis. Sie gewährleistet reproduzierbare Ergebnisse, stabile Savegames, zuverlässige Tests und schafft die Grundlage für zukünftige Funktionen wie Replays, Simulationstests und deterministischen Multiplayer.
