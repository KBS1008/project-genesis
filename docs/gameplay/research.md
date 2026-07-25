---
title: Research System
version: 1.0
status: Approved
owner: Project Genesis Architecture
lastUpdated: 2026-07-25
reviewedBy: TBD
relatedDocuments:
  - production.md
  - buildings.md
  - market.md
  - economy.md
  - Research.schema.md
---

# Research System

> Beschreibt das Forschungssystem von Project Genesis.

---

# Zweck

Forschung repräsentiert den technologischen Fortschritt eines Unternehmens.

Sie ermöglicht:

- neue Gebäude
- neue Rezepte
- effizientere Produktion
- bessere Energieversorgung
- Automatisierung
- neue Unternehmensstrategien

Forschung ist der wichtigste langfristige Fortschrittsmechanismus des Spiels.

---

# Designziele

Das Forschungssystem soll:

- langfristige Ziele schaffen
- verschiedene Spielstile unterstützen
- strategische Entscheidungen belohnen
- dauerhaft motivieren
- neue Inhalte freischalten statt nur Werte erhöhen

---

# Grundprinzip

```text
Gewinn

↓

Investition

↓

Forschung

↓

Neue Technologien

↓

Neue Möglichkeiten

↓

Mehr Gewinn
```

---

# Forschungsbereiche

Der Content-Contract (`TechnologyCategory` in `TechnologyDefinition`) definiert **elf Forschungszweige**. M10 Phase 3 nutzt alle Zweige im Technologiebaum unter `game-content/research/`.

| Kategorie | Schwerpunkt |
| --------- | ----------- |
| `PRODUCTION` | Produktionsprozesse und Industrieketten |
| `BUILDING` | Gebäudetypen und Infrastruktur-Freischaltungen |
| `ENERGY` | Energieerzeugung, Effizienz, Netzsteuerung |
| `LOGISTICS` | Lager, Distribution, intermodale Transporte |
| `MANAGEMENT` | Unternehmensführung und Konzernstrukturen |
| `AUTOMATION` | Prozess- und Fabrikautomatisierung |
| `FINANCE` | Finanzplanung und Investitionssteuerung |
| `AGRICULTURE` | Nachhaltige Landwirtschaft und Ertragsoptimierung |
| `CHEMISTRY` | Chemische Verfahren und Polymerwissenschaft |
| `ELECTRONICS` | Schaltungsdesign und Halbleiterprozesse |
| `AI` | Späte Spieltechnologien (z. B. Predictive Analytics) |

Freischaltungen erfolgen primär über `requiredResearch` auf Gebäuden und Rezepten. Technologie-Boni als separates Effekt-System sind nicht Teil des v1-Contracts.

## Produktion

Verbessert Produktionsprozesse.

Beispiele

- Schnellere Fertigung
- Weniger Ausschuss
- Höhere Kapazität

---

## Gebäude

Schaltet neue Gebäudetypen frei.

Beispiele

- Stahlwerk
- Chemiefabrik
- Logistikzentrum

---

## Energie

Verbessert Energieversorgung.

Beispiele

- Effizientere Kraftwerke
- Erneuerbare Energie
- Lastmanagement

---

## Logistik

Verbessert Materialfluss.

Beispiele

- Schnellere Transporte
- Größere Lager
- Automatische Verteilung

---

## Management

Verbessert das Unternehmen.

Beispiele

- Geringere Verwaltungskosten
- Bessere Marktinformationen
- Effizientere Mitarbeitende

---

# Forschungspunkte

Version 1

Forschung kostet:

- Geld
- Zeit

Version 2

Zusätzlich:

- Forschungspunkte
- Spezialisten

---

# Forschungslabor

Forschung wird in Forschungsgebäuden durchgeführt.

Je besser das Labor,

desto schneller werden Technologien entwickelt.

---

# Forschungsauftrag

Ein Auftrag besitzt:

- Technologie
- Dauer
- Kosten
- Status
- Fortschritt
- Abschlusszeit

---

# Forschungsstatus

```text
LOCKED

↓

AVAILABLE

↓

IN_PROGRESS

↓

PAUSED

↓

COMPLETED
```

---

# Voraussetzungen

Technologien können Voraussetzungen besitzen.

Beispiele

- Vorherige Forschung
- Unternehmenslevel
- Gebäudetyp
- Ressourcen

---

# Freischaltungen

Eine Forschung kann freischalten:

- Gebäude
- Rezepte
- Produktionsboni
- Energieboni
- Lagerverbesserungen
- Marktfunktionen

---

# Forschung ist dauerhaft

Abgeschlossene Forschung bleibt dauerhaft erhalten.

Sie muss niemals erneut erforscht werden.

---

# Spezialisierung

Version 2

Unternehmen können unterschiedliche Forschungsschwerpunkte setzen.

Beispiele

```text
Industrie

↓

Automatisierung

oder

Energie

oder

Logistik

oder

Qualität
```

Dadurch entstehen unterschiedliche Unternehmensstrategien.

---

# Automatisierung

Spätere Forschung ermöglicht:

- automatische Produktion
- automatische Marktaufträge
- intelligente Lagerverwaltung
- Produktionsplanung

---

# Seltene Technologien

Version 3

Besondere Technologien können durch:

- Welt-Events
- Kooperationen
- seltene Ressourcen

freigeschaltet werden.

---

# Statistik

Für jede Company werden gespeichert:

- abgeschlossene Forschungen
- investierte Kosten
- Forschungsdauer
- Forschungsfortschritt
- freigeschaltete Technologien

---

# Balance

Nicht jede Technologie ist immer sinnvoll.

Spieler sollen entscheiden:

- sofort investieren
- Geld sparen
- Produktion erweitern
- Markt dominieren

Dadurch entstehen unterschiedliche Entwicklungswege.

---

# Zukunft

## Version 2

- Forschungspunkte
- Spezialisten
- Forschungslabore
- Forschungsprojekte

## Version 3

- Kooperationen
- Universitäten
- Patente
- Exklusive Technologien

## Version 4

- Internationale Forschung
- Unternehmensnetzwerke
- KI-Forschung
- Zukunftstechnologien

---

# Beziehungen

Das Forschungssystem arbeitet zusammen mit:

- Company
- Buildings
- Production
- Recipes
- Resources
- Energy
- Market
- Employees
- Simulation

---

# Leitsatz

> "Forschung verbessert nicht das Unternehmen – sie erweitert seine Möglichkeiten."

Technologischer Fortschritt eröffnet neue Strategien, Produktionsketten und Geschäftsmodelle und bildet damit den Motor für die langfristige Entwicklung eines Unternehmens.
