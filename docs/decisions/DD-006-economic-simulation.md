---
Document-ID: DD-006
Title: Economic Simulation
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
  - gameplay/economy.md
  - gameplay/market.md
  - gameplay/npc-economy.md
  - gameplay/company-progression.md
  - gameplay/finance.md
  - schemas/Market.schema.md
  - schemas/Finance.schema.md

Related Decisions:
  - DD-001 – Resource Graph
  - DD-002 – Production Chain Architecture
  - DD-005 – Production Network
  - DD-027 – Event-Driven Simulation Architecture
  - DD-032 – Deterministic Tick Processing

Affected Components:
  - Simulation Engine
  - Market System
  - Finance System
  - NPC Economy
  - Company System
  - Statistics System

Tags:
  - economy
  - simulation
  - market
  - finance
  - npc
---

# DD-006 – Economic Simulation

## Status

**Accepted**

---

# Zusammenfassung

Die Wirtschaft in Project Genesis wird vollständig simuliert.

Preise, Angebot, Nachfrage, Produktion und Unternehmensentwicklung entstehen aus den Interaktionen aller Marktteilnehmer und werden nicht geskriptet.

Die Economic Simulation bildet den Kern des Spiels.

---

# Motivation

Eine glaubwürdige Wirtschaft soll:

- dynamisch reagieren
- deterministisch berechnet werden
- langfristige Strategien ermöglichen
- durch Spieler und NPCs gleichermaßen beeinflusst werden

Die Wirtschaft soll nicht "spielen", sondern entstehen.

---

# Problem

Fest definierte Preise oder Skriptereignisse führen zu:

- statischen Märkten
- geringer Wiederspielbarkeit
- fehlender strategischer Tiefe

---

# Entscheidung

Die Wirtschaft basiert vollständig auf Simulation.

Alle wirtschaftlichen Zustände ergeben sich aus:

- Produktion
- Verbrauch
- Angebot
- Nachfrage
- Lagerbeständen
- Transport
- Energie
- Unternehmensentscheidungen

---

# Architektur

```text
Resources
      │
      ▼
Production
      │
      ▼
Inventory
      │
      ▼
Transport
      │
      ▼
Market
      │
      ▼
Finance
      │
      ▼
Company Growth
```

Alle Systeme beeinflussen sich gegenseitig.

---

# Marktmodell

Jeder Markt berechnet kontinuierlich:

- verfügbares Angebot
- aktuelle Nachfrage
- Handelsvolumen
- Preisentwicklung

Es existieren keine fest programmierten Preise.

---

# Preisbildung

Der Preis einer Ressource ergibt sich aus mehreren Faktoren:

- Angebot
- Nachfrage
- Lagerbestand
- Produktionskosten
- Transportkosten
- Energiekosten

Die konkrete Berechnungsformel ist Bestandteil des Market Systems und kann balanciert werden, ohne die Architektur zu verändern.

---

# Wirtschaftsakteure

Die Simulation umfasst:

## Spielerunternehmen

- produzieren
- handeln
- investieren
- forschen

---

## NPC-Unternehmen

Nutzen dieselben Regeln wie Spielerunternehmen.

Sie:

- kaufen
- verkaufen
- produzieren
- konkurrieren

---

## Märkte

Märkte vermitteln Angebot und Nachfrage.

---

## Verbraucher

Erzeugen kontinuierliche Nachfrage nach Ressourcen und Produkten.

---

# Simulation pro Tick

In jedem Simulationstick werden mindestens folgende Schritte ausgeführt:

1. Produktion
2. Lageraktualisierung
3. Transport
4. Marktberechnung
5. Preisaktualisierung
6. Finanzbuchungen
7. Unternehmensbewertung
8. Statistik

Alle Schritte erfolgen in einer fest definierten Reihenfolge.

---

# Unternehmensentwicklung

Unternehmen entwickeln sich aufgrund ihrer wirtschaftlichen Leistung.

Einflussgrößen sind:

- Gewinn
- Liquidität
- Produktionskapazität
- Marktanteil
- Forschung
- Reputation

Es existieren keine künstlichen Level.

---

# Beziehung zu anderen Systemen

## Production System

Erzeugt Güter.

---

## Inventory System

Speichert verfügbare Ressourcen.

---

## Transport System

Verbindet Produzenten und Märkte.

---

## Energy System

Beeinflusst Produktionskosten und Kapazitäten.

---

## Finance System

Verarbeitet Einnahmen, Ausgaben und Investitionen.

---

## NPC Economy

Erzeugt kontinuierliche Marktbewegungen und Konkurrenz.

---

# Determinismus

Alle wirtschaftlichen Berechnungen erfolgen ausschließlich innerhalb des Simulationsticks.

Es gibt:

- keine Zufallsereignisse ohne Seed
- keine parallelen Marktberechnungen
- keine zeitabhängigen Sonderfälle außerhalb des Tick-Systems

Dadurch ist jede Wirtschaftssimulation reproduzierbar.

---

# Data-Driven Architektur

Marktparameter und wirtschaftliche Konstanten werden außerhalb des Codes definiert.

Beispiele:

```text
game-content/

market/
economy/
companies/
```

Balancing erfolgt über Content-Dateien.

---

# Event Integration

Wirtschaftliche Änderungen erzeugen Domain Events.

Beispiele:

- MarketPriceChanged
- ProductionCompleted
- CompanyBankrupt
- CompanyExpanded
- ResearchCompleted
- InventoryChanged

Diese Events werden nach Abschluss des Simulationsticks verarbeitet.

---

# Vorteile

- Dynamische Märkte
- Hohe Wiederspielbarkeit
- Realistische Wirtschaftsentwicklung
- Einheitliche Simulationslogik
- Gute Erweiterbarkeit
- Vollständig datengetrieben

---

# Nachteile

- Höherer Rechenaufwand
- Komplexeres Balancing
- Größere Anforderungen an Testabdeckung

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Feste Marktpreise

Verworfen.

Grund:

Keine wirtschaftliche Dynamik.

---

## Geskriptete Wirtschaft

Verworfen.

Grund:

Vorhersehbares Verhalten und geringe Wiederspielbarkeit.

---

## Getrennte Spieler- und NPC-Wirtschaft

Verworfen.

Grund:

Inkonsistente Regeln und künstliches Spielgefühl.

---

# Implementierung

```text
src/

simulation/

economy/
    EconomySystem.ts
    MarketSystem.ts
    PriceCalculator.ts
    DemandCalculator.ts
    SupplyCalculator.ts

finance/
    FinanceSystem.ts

company/
    CompanySystem.ts

npc/
    NpcEconomySystem.ts
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Wirtschaftliche Zustände entstehen ausschließlich durch Simulation.
- Spieler und NPCs verwenden dieselben Marktmechanismen.
- Preise werden niemals fest im Code hinterlegt.
- Alle Berechnungen erfolgen deterministisch innerhalb des Simulationsticks.
- Wirtschaftsparameter stammen aus dem `game-content`.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Realismus
- Determinismus
- Erweiterbarkeit
- Wartbarkeit
- Modding
- Skalierbarkeit

---

# Risiken

Mögliche Risiken:

- instabile Preisentwicklungen
- wirtschaftliche Extremzustände
- Balancing-Probleme

Diese Risiken werden durch Simulationstests, Balancing und konfigurierbare Marktparameter minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung                                                          |
| ------- | ---------- | ----------------------------------------------------------------- |
| 1.0.0   | 2026-07-03 | Erste Version                                                     |
| 2.0.0   | 2026-07-03 | Vollständige Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Die Wirtschaft ist kein Skript – sie ist ein lebendes, deterministisches System.“**

Project Genesis simuliert eine vollständig datengetriebene Wirtschaft, in der Produktion, Transport, Märkte, Unternehmen und NPCs nach denselben Regeln interagieren. Wirtschaftliche Entwicklungen entstehen aus den Entscheidungen der Marktteilnehmer und den Bedingungen der simulierten Welt – nicht aus fest programmierten Ereignissen.
