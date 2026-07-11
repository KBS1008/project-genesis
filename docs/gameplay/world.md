---
Document-ID: WORLD-001
Title: World Definition
Type: World Design Document
Status: Active
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Related Docs:
  - DD-030 Configuration Driven Content
  - DD-031 Game Content Organization
  - DD-032 Deterministic Tick Processing
  - DD-033 Savegame Strategy

Tags:
  - world
  - simulation
  - economy
  - scaling
---

# 🌍 World Definition – Project Genesis

## 1. Zweck der Welt

Die Welt ist der **globale Rahmen der Simulation**.

Sie definiert:

- Startbedingungen
- Skalierung
- geografische Struktur
- wirtschaftliche Grundparameter
- globale Constraints

---

# 🧠 Grundprinzip

> Die Welt ist kein statisches Level, sondern ein **laufender Simulationsraum**.

---

# 🗺️ Weltstruktur

Die Welt besteht aus:

```text
World
│
├── Regions
│   ├── Region A (Industrie)
│   ├── Region B (Rohstoffe)
│   ├── Region C (Handel)
│   └── Region D (Forschung)
│
├── Cities
│   ├── Produktionszentren
│   ├── Märkte
│   └── Logistik-Hubs
│
└── Global Systems
    ├── Economy
    ├── Energy Grid
    ├── Transport Network
    └── Research Network
```

---

# ⚙️ Globale Parameter

## Wirtschaft

- globale Nachfragekurven
- globale Preisstabilität
- Inflationsmodell
- Handelsvolumen-Faktor

---

## Simulation

- Tick-Dauer (global)
- Weltgröße (Skalierung)
- Simulationsdichte (aktive Entities)

---

## Energie

- globale Energieverfügbarkeit
- Netzkapazität
- Verlustfaktor

---

## Transport

- globale Logistikkosten
- Verzögerungsmodelle
- Infrastrukturqualität

---

# 🏭 Startbedingungen

Die Welt startet mit:

- definierten Ressourcenverteilungen
- initialen Unternehmen
- Startmärkten
- Basistechnologien

---

# 📈 Skalierungssystem

Die Welt wächst nicht linear, sondern über:

- regionale Expansion
- wirtschaftliche Entwicklung
- Infrastruktur-Ausbau
- Spieler- und NPC-Aktivität

---

# 🧩 Welt & Simulation

Die Welt ist **kein passives Objekt**, sondern Teil der Simulation:

- Märkte existieren pro Region
- Energie kann regional limitiert sein
- Transport beeinflusst lokale Preise
- Forschung kann regional gebunden sein

---

# 🔁 Beziehung zur Simulation

```text
World
  ↓
Simulation Engine
  ↓
Systems (Market, Production, etc.)
  ↓
Events
  ↓
State Update
```

---

# 💾 Persistenz

Die Welt ist:

- Teil des Snapshots (DD-033)
- vollständig rekonstruierbar
- deterministisch reproduzierbar

---

# 🔒 Regeln

- Weltdefinition ist **immutable zur Laufzeit**
- Änderungen nur über neue Versionen oder DLCs
- keine dynamische Strukturänderung ohne Plugin-System

---

# 🌐 Modding / Expansion

Erweiterungen dürfen:

- neue Regionen hinzufügen
- neue Märkte definieren
- neue globale Parameter einführen

aber nicht:

- Tick-System verändern
- Simulation Kernel beeinflussen

---

# 📌 Bedeutung für die Architektur

Die Welt verbindet:

- Content Layer (DD-030 / DD-031)
- Simulation Layer (DD-032)
- Economy Layer
- Market Layer
- Energy Layer

---

# 🧭 Leitsatz

> **„Die Welt ist der Rahmen, in dem alle Systeme existieren.“**

Sie definiert nicht das Verhalten der Simulation – aber ihre Grenzen und Struktur.