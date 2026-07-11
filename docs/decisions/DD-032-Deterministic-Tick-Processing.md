---
Document-ID: DD-032
Title: Deterministic Tick Processing
Type: Architecture Decision Record
Status: Accepted
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - ARCH-002 (SAD.md)
  - ARCH-003 (DDD.md)

Related Decisions:
  - DD-021 – Unified Building Capacity Model
  - DD-025 – ECS Inspired Simulation Architecture
  - DD-027 – Event-Driven Simulation Architecture
  - DD-028 – CQRS Lite
  - DD-029 – Modular Monolith Architecture

Affected Components:
  - Simulation Engine
  - Tick Scheduler
  - Event Bus
  - Market System
  - Production System
  - Finance System
  - Statistics System

Tags:
  - simulation
  - deterministic
  - tick
  - architecture
---

# DD-032 – Deterministic Tick Processing

## Status

**Accepted**

---

# Zusammenfassung

Die gesamte Spielsimulation arbeitet deterministisch.

Ein identischer Spielzustand mit identischen Eingaben erzeugt immer exakt dieselben Ergebnisse.

Dies gilt unabhängig von:

- Hardware
- CPU
- Betriebssystem
- Serverinstanz

---

# Motivation

Project Genesis simuliert tausende Unternehmen gleichzeitig.

Deterministische Berechnungen ermöglichen:

- reproduzierbare Fehler
- identische Testergebnisse
- stabile Multiplayer-Synchronisation
- zuverlässige Simulation
- einfache Lasttests

---

# Problem

Nicht deterministische Systeme erzeugen:

- unterschiedliche Ergebnisse
- schwer reproduzierbare Bugs
- inkonsistente Marktpreise
- fehlerhafte Statistiken

Diese Probleme wachsen mit der Größe der Spielwelt.

---

# Entscheidung

Alle Simulationsschritte werden in einer festen Reihenfolge verarbeitet.

Kein System darf diese Reihenfolge verändern.

---

# Tick-Ablauf

Jeder Tick folgt exakt derselben Reihenfolge.

```text
Tick Start

↓

1. Eingaben übernehmen

↓

2. Gebäude aktualisieren

↓

3. Energie berechnen

↓

4. Transport durchführen

↓

5. Produktion berechnen

↓

6. Lager aktualisieren

↓

7. Markt berechnen

↓

8. Finanzen berechnen

↓

9. Forschung aktualisieren

↓

10. Mitarbeitende aktualisieren

↓

11. Unternehmensentwicklung

↓

12. Statistiken

↓

13. Domain Events verarbeiten

↓

14. Persistieren

↓

15. WebSocket Updates

↓

Tick Ende
```

Diese Reihenfolge ist verbindlich.

---

# Reihenfolge innerhalb eines Systems

Auch innerhalb eines Systems ist die Verarbeitung eindeutig.

Beispiel:

```text
Companies

↓

UUID sortiert

↓

Buildings

↓

ID sortiert

↓

Production Jobs

↓

ID sortiert
```

Es wird niemals über unsortierte Collections iteriert.

---

# Parallelisierung

Version 1

Die Simulation läuft bewusst in einem Thread.

Dadurch bleibt das Verhalten vollständig deterministisch.

---

Version 2

Parallelisierung ist möglich.

Voraussetzungen:

- unabhängige Aufgaben
- feste Merge-Regeln
- deterministische Reihenfolge

---

# Zufallszahlen

Die Simulation verwendet keine unkontrollierten Zufallszahlen.

Falls Zufall erforderlich ist:

- Seed basiert
- reproduzierbar
- dokumentiert

Beispiel:

```text
seed = worldId + tick + companyId
```

---

# Zeit

Alle Systeme verwenden ausschließlich:

```text
Simulation Tick
```

Nicht erlaubt:

- Systemzeit
- aktuelle Uhrzeit
- lokale Zeit

---

# Rundungsregeln

Alle Berechnungen folgen denselben Regeln.

Empfehlung:

Intern ausschließlich Integer verwenden.

Beispiel:

```text
1 Einheit

=

1000 Millieinheiten
```

Dadurch entstehen keine Floating-Point-Fehler.

---

# Event Processing

Domain Events werden erst nach Abschluss eines Simulationsschrittes verarbeitet.

Innerhalb eines Ticks gilt:

```text
System

↓

Events erzeugen

↓

System beendet

↓

Event Queue

↓

Listener

↓

Nächstes System
```

---

# Fehlerbehandlung

Ein Fehler darf niemals:

- den Tick abbrechen
- andere Unternehmen beeinflussen
- die Reihenfolge verändern

Fehler werden:

- geloggt
- markiert
- überwacht

---

# Persistenz

Persistiert wird ausschließlich am Ende eines Ticks.

Zwischenstände werden nicht gespeichert.

---

# WebSocket Updates

Clients erhalten Updates erst nach erfolgreichem Tick.

Dadurch sehen alle Spieler denselben Zustand.

---

# Testbarkeit

Deterministische Simulation ermöglicht:

- Snapshot Tests
- Replay Tests
- Regression Tests
- Performance Benchmarks

---

# Replay

Ein Tick kann vollständig reproduziert werden.

Benötigt werden:

- Spielstand
- Ticknummer
- Eingaben
- Seed

Dadurch lassen sich Fehler exakt nachstellen.

---

# Vorteile

- Reproduzierbare Ergebnisse
- Einfaches Debugging
- Stabiler Multiplayer
- Gute Testbarkeit
- Hohe Konsistenz

---

# Nachteile

- Eingeschränkte Parallelisierung
- Feste Tick-Reihenfolge
- Höhere Anforderungen an die Architektur

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Echtzeit ohne Tick-System

Verworfen.

Grund:

Nicht reproduzierbar.

---

## Parallele Verarbeitung ohne Synchronisation

Verworfen.

Grund:

Race Conditions.

---

## Verwendung der Systemzeit

Verworfen.

Grund:

Nicht deterministisch.

---

# Implementierung

```text
SimulationScheduler

↓

TickManager

↓

System Pipeline

↓

Event Queue

↓

Persistence

↓

WebSocket
```

---

# Hinweise für Cursor AI

Beim Generieren neuer Simulationssysteme gelten folgende Regeln:

- Systeme besitzen eine feste Ausführungsreihenfolge.
- Systeme verwenden niemals `Date.now()` oder vergleichbare Zeitquellen.
- Alle Berechnungen müssen deterministisch sein.
- Keine Iteration über unsortierte Collections.
- Gleitkommazahlen sind in der Kernsimulation zu vermeiden.
- Domain Events werden erst nach Abschluss des aktuellen Simulationsschritts verarbeitet.
- Persistierung erfolgt ausschließlich am Tick-Ende.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Determinismus
- Stabilität
- Testbarkeit
- Multiplayer
- Wartbarkeit
- Performance

---

# Risiken

Mögliche Risiken:

- Verletzung der Tick-Reihenfolge
- Unkontrollierter Einsatz von Zufallszahlen
- Verwendung von Fließkommazahlen
- Race Conditions

Diese Risiken werden durch Architekturregeln, Code Reviews und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Ein Tick ist die einzige Wahrheit."**

Jeder Simulationsschritt in Project Genesis wird in einer festen, reproduzierbaren Reihenfolge ausgeführt. Die deterministische Tick-Verarbeitung bildet das Fundament für eine stabile Wirtschaftssimulation, reproduzierbare Tests und konsistente Multiplayer-Spielwelten.