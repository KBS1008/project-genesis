---
Document-ID: WORLD-002
Title: NPC Economy System
Type: World Simulation Design
Status: Active
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Related Docs:
  - WORLD-001 World Definition
  - DD-032 Deterministic Tick Processing
  - DD-027 Event Driven Simulation Architecture
  - DD-030 Configuration Driven Content
  - DD-033 Savegame Strategy

Tags:
  - npc
  - economy
  - simulation
  - market
  - ai
---

# 🤖 NPC Economy System – Project Genesis

## 1. Zweck

Das NPC Economy System simuliert eine **autonome Wirtschaft ohne Spielerinteraktion**.

NPCs sind:

- Unternehmen
- Konsumenten
- Lieferanten
- Märkte
- Investoren

Sie erzeugen eine **lebendige Grundökonomie**, die der Spieler beeinflusst, aber nicht ersetzt.

---

# 🧠 Grundprinzip

> Die Welt lebt auch ohne den Spieler.

NPCs sind vollständige wirtschaftliche Akteure innerhalb der Simulation.

---

# 🏢 NPC-Typen

## 1. NPC Companies

Verhalten:

- produzieren Güter
- kaufen Ressourcen
- verkaufen Produkte
- konkurrieren mit Spielerfirmen

---

## 2. NPC Consumers

Verhalten:

- generieren Nachfrage
- reagieren auf Preise
- haben Budgetlimits
- erzeugen Marktbewegung

---

## 3. NPC Suppliers

Verhalten:

- liefern Rohstoffe
- stabilisieren Märkte
- reagieren auf Nachfrage

---

## 4. NPC Investors

Verhalten:

- investieren in Unternehmen
- reagieren auf Gewinnentwicklung
- beeinflussen Kapitalfluss

---

# ⚙️ NPC Entscheidungsmodell

NPCs nutzen **keine komplexe KI**, sondern deterministische Regeln:

```text
Decision Score = f(price, demand, supply, profit, distance, risk)
```

Alle Entscheidungen sind:

- deterministisch
- tick-basiert
- reproduzierbar (DD-032)

---

# 🔁 NPC Simulation Loop

Jeder Tick:

```text
1. Market Observation
2. Score Calculation
3. Decision Selection
4. Action Execution
5. State Update
6. Event Emission
```

---

# 📊 Marktverhalten

NPCs sind Haupttreiber des Marktes:

- erzeugen Nachfrage
- stabilisieren Preise
- verursachen Knappheit
- reagieren auf Überproduktion

---

# 💰 Wirtschaftsdynamik

## Positive Rückkopplung

- hohe Nachfrage → mehr Produktion
- mehr Produktion → mehr Angebot

---

## Negative Rückkopplung

- Überangebot → Preisverfall
- Preisverfall → Produktionsstopp

---

# 🧩 Beziehung zur Simulation

NPC Economy ist Teil der Kernsimulation:

```text
NPC System
   ↓
Market System
   ↓
Production System
   ↓
Finance System
```

---

# 🏗️ Integration mit Player Economy

NPCs:

- konkurrieren direkt mit Spielern
- beeinflussen Preise
- schaffen Marktvolatilität
- verhindern statische Wirtschaft

---

# 📉 Balancing Rolle

NPC Economy ist verantwortlich für:

- Grundnachfrage
- Preisstabilität
- Ressourcenverbrauch
- Wirtschaftswachstum

---

# 🧠 Determinismus (wichtig!)

Alle NPC Entscheidungen sind:

- seed-basiert
- tick-synchron
- vollständig reproduzierbar

Beispiel:

```text
seed = worldSeed + tick + npcId
```

---

# ⚙️ Einschränkungen

NPCs dürfen NICHT:

- Simulation Engine beeinflussen
- Tick-Reihenfolge verändern
- globale Regeln überschreiben

---

# 📦 Performance Modell

NPCs werden gruppiert:

- regionale Cluster
- Marktgruppen
- aggregierte Simulation bei hoher Last

---

# 🔄 Skalierung

Statt jede NPC-Firma einzeln zu simulieren:

- kleine Welt → Einzel-NPCs
- große Welt → aggregierte Gruppen

---

# 🧪 Testbarkeit

NPC Economy ermöglicht:

- stabile Markt-Simulation Tests
- Replay von Wirtschaftsentwicklung
- Balancing-Simulationen

---

# 📌 Rolle im Gesamtsystem

NPC Economy ist:

- Treiber der Weltökonomie
- Hintergrundsimulation
- Basis für Spielerinteraktion

---

# 🧭 Leitsatz

> **„NPCs sind die unsichtbare Hand der Wirtschaft.“**

Sie erzeugen eine stabile, dynamische Welt, die erst durch den Spieler strategisch beeinflusst wird.
