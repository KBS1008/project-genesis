# DD-023 – Company Progression Without Player Levels

Status: Accepted

Version: 1.0

Datum: 2026-07-02

Authors:

- Project Genesis Architecture

---

# Zusammenfassung

Project Genesis verwendet **kein klassisches Spieler-Levelsystem**.

Der Fortschritt eines Spielers wird ausschließlich durch die Entwicklung seines Unternehmens bestimmt.

Anstelle von Erfahrungspunkten wird ein **Company Score** berechnet, der den wirtschaftlichen Erfolg, die Innovationskraft und die Marktposition eines Unternehmens widerspiegelt.

---

# Kontext

Viele Aufbauspiele und Browsergames nutzen Spielerlevel.

Typischer Ablauf:

```text
XP sammeln

↓

Level aufsteigen

↓

Neue Inhalte freischalten
```

Dieses System hat mehrere Nachteile:

- künstlicher Spielfortschritt
- wenig Bezug zur Wirtschaft
- ineffiziente Unternehmen können trotzdem schnell leveln
- alle Spieler folgen demselben Fortschrittspfad

Da Project Genesis eine Unternehmenssimulation ist, soll sich der Fortschritt aus unternehmerischen Entscheidungen ergeben.

---

# Entscheidung

Der Fortschritt wird ausschließlich über das Unternehmen bewertet.

Es existiert kein Spielerlevel.

Stattdessen berechnet das Spiel einen **Company Score**, der verschiedene Unternehmenskennzahlen kombiniert.

Der Company Score dient als Indikator für den Entwicklungsstand eines Unternehmens und schaltet neue Inhalte sowie Funktionen frei.

---

# Company Score

Der Company Score setzt sich aus mehreren Bereichen zusammen.

```text
Company Score

├── Unternehmenswert
├── Gewinn
├── Umsatz
├── Produktionsleistung
├── Forschungsfortschritt
├── Handelsvolumen
├── Reputation
├── Mitarbeiter
└── Unternehmensalter
```

Die Gewichtung der einzelnen Faktoren erfolgt durch Balancing und kann im Laufe der Entwicklung angepasst werden.

---

# Freischaltungen

Neue Inhalte werden über definierte Meilensteine freigeschaltet.

Beispiele:

- neue Gebäude
- neue Produktionsketten
- neue Forschungsbereiche
- neue Märkte
- neue Unternehmensfunktionen

Freischaltungen orientieren sich am Unternehmensfortschritt und nicht an Erfahrungspunkten.

---

# Vorteile

## Realistische Unternehmensentwicklung

Der Fortschritt basiert auf wirtschaftlichem Erfolg.

---

## Unterschiedliche Strategien

Mehrere Spielstile können erfolgreich sein.

Zum Beispiel:

- Industrieunternehmen
- Handelsunternehmen
- Forschungsunternehmen
- Energieversorger
- Logistikunternehmen

---

## Kein Grind

Spieler müssen keine Erfahrungspunkte sammeln.

Jede wirtschaftliche Entscheidung trägt direkt zur Entwicklung des Unternehmens bei.

---

## Langfristige Motivation

Auch im Endgame können Unternehmen ihren Company Score weiter verbessern.

---

# Auswirkungen

Der Company Score kann verwendet werden für:

- Highscore
- Ranglisten
- Ligen
- Matchmaking
- Erfolge
- Unternehmensbewertungen
- spätere Börsenbewertung

---

# Versionierung

## Version 1

- Company Score
- Unternehmensmeilensteine
- Freischaltungen

---

## Version 2

Zusätzlich:

- Unternehmensreputation
- Branchenranking
- Auszeichnungen

---

## Version 3

Zusätzlich:

- Börsenwert
- Unternehmensbewertung
- Internationale Ranglisten
- Prestige-System

---

# Konsequenzen

## Vorteile

✔ Wirtschaftlicher Fortschritt statt künstlicher Level

✔ Hoher Wiederspielwert

✔ Unterschiedliche Unternehmensstrategien

✔ Flexible Erweiterbarkeit

✔ Authentische Wirtschaftssimulation

---

## Nachteile

- Komplexere Berechnung
- Mehr Balancing erforderlich
- Fortschritt weniger offensichtlich als bei klassischen Levelsystemen

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternative

Ein klassisches XP- und Levelsystem wurde verworfen.

Gründe:

- passt nicht zur Unternehmenssimulation
- fördert Grinding
- wenig Bezug zur Wirtschaft
- eingeschränkte strategische Freiheit

---

# Implementierungshinweise

Der Company Score wird regelmäßig innerhalb der Simulationsengine neu berechnet.

Er basiert auf aggregierten Unternehmenskennzahlen und beeinflusst:

- Freischaltungen
- Unternehmensstatus
- Ranglisten
- Statistiken

Die Berechnung sollte vollständig datengetrieben erfolgen, sodass Gewichtungen später angepasst werden können, ohne den Programmcode zu verändern.

---

# Related Decisions

- DD-018 – Multi-Layer Market Architecture
- DD-020 – Dynamic Workforce Allocation
- DD-021 – Unified Building Capacity Model
- DD-022 – Abstract Logistics Network

---

# Affected Documents

- company-progression.md
- company.schema.md
- finance.schema.md
- market.md
- research.md
- simulation.md

---

# Leitsatz

> "Nicht der Spieler steigt auf – das Unternehmen entwickelt sich."

Project Genesis misst Erfolg nicht anhand gesammelter Erfahrungspunkte, sondern anhand der nachhaltigen Entwicklung eines Unternehmens. Wachstum, Innovation und wirtschaftliche Stärke bilden die Grundlage des Spielfortschritts.
