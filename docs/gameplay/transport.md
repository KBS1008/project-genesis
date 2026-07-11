---
title: Transport System
version: 1.0
status: Approved
owner: Project Genesis Architecture
lastUpdated: 2026-07-02
reviewedBy: TBD
relatedDocuments:
  - production.md
  - inventory.md
  - buildings.md
  - resources.md
  - market.md
  - simulation.md
---

# Transport System

> Beschreibt das Transportsystem von Project Genesis.

---

# Zweck

Das Transportsystem bewegt Ressourcen und Produkte zwischen Gebäuden, Lagern und Märkten.

Es verbindet sämtliche Produktionsketten eines Unternehmens.

Transport stellt sicher, dass:

- Rohstoffe Produktionsgebäude erreichen
- Zwischenprodukte weiterverarbeitet werden
- Fertigprodukte eingelagert werden
- Handelsaufträge ausgeführt werden

---

# Designziele

Das Transportsystem soll:

- einfach verständlich sein
- vollständig automatisiert arbeiten
- Engpässe ermöglichen
- spätere Erweiterungen unterstützen
- keine unnötige Mikromanagement-Aufgabe werden

---

# Grundprinzip

```text
Lager

↓

Transportauftrag

↓

Transport

↓

Zielgebäude

↓

Produktion
```

---

# Transportarten

Version 1 kennt nur interne Transporte.

Dazu gehören:

- Lager → Produktion
- Produktion → Lager
- Lager → Markt
- Markt → Lager

Der Transport erfolgt automatisch.

---

# Transportaufträge

Jeder Transportauftrag enthält:

- Startort
- Zielort
- Ressource
- Menge
- Priorität
- Status

---

# Transportstatus

```text
WAITING

↓

IN_PROGRESS

↓

COMPLETED

↓

CANCELLED
```

---

# Automatisierung

Alle Transporte werden automatisch erstellt.

Der Spieler muss keine Fahrzeuge steuern.

Das System erkennt selbst:

- Produktionsbedarf
- Lagerkapazitäten
- Markttransaktionen

---

# Prioritäten

Transportaufträge besitzen Prioritäten.

```text
Sehr Hoch

↓

Hoch

↓

Normal

↓

Niedrig
```

Beispiele:

Sehr Hoch

- Energieversorgung
- Produktionsengpässe

Normal

- Lagerauffüllung

Niedrig

- Überschusslagerung

---

# Transportkapazität

Version 1

Transport ist unbegrenzt.

Dadurch bleibt das Spiel leicht verständlich.

Version 2

Transportkapazität wird begrenzt.

Neue Gebäude verbessern den Materialfluss.

---

# Lager

Transport arbeitet eng mit dem Inventarsystem zusammen.

Vor jedem Transport wird geprüft:

- Ressource vorhanden?
- Ziel besitzt Platz?
- Auftrag gültig?

---

# Markt

Beim Kauf:

```text
Markt

↓

Unternehmenslager
```

Beim Verkauf:

```text
Lager

↓

Markt
```

---

# Produktion

Produktionsaufträge reservieren benötigte Ressourcen.

Transport liefert diese automatisch.

Dadurch entstehen keine doppelten Reservierungen.

---

# Forschung

Neue Technologien verbessern:

- Transportgeschwindigkeit
- Lagerlogik
- Priorisierung
- Automatisierung

---

# Energie

Version 2

Transport verursacht Energieverbrauch.

Logistikzentren reduzieren diesen.

---

# Mitarbeiter

Version 2

Logistikmitarbeitende verbessern:

- Durchsatz
- Geschwindigkeit
- Zuverlässigkeit

---

# Statistik

Für jede Company werden gespeichert:

- Anzahl Transporte
- Transportierte Ressourcen
- Durchschnittliche Transportzeit
- Auslastung
- Wartende Transportaufträge

---

# Balance

Transport soll niemals den Spielfluss behindern.

Version 1

Vollständig automatisiert.

Version 2

Optimierung durch Forschung und Gebäude.

Version 3

Strategische Logistikplanung.

---

# Zukunft

## Version 2

- Logistikzentren
- Förderbänder
- Transportkapazität
- Energieverbrauch

## Version 3

- Straßen
- Eisenbahn
- Häfen
- Flughäfen

## Version 4

- Internationale Lieferketten
- Containerlogistik
- Regionale Infrastruktur
- Verkehrsengpässe

---

# Beziehungen

Das Transportsystem arbeitet zusammen mit:

- Buildings
- Inventory
- Production
- Resources
- Market
- Employees
- Energy
- Simulation

---

# Leitsatz

> "Produktion beginnt mit Rohstoffen – Erfolg entsteht durch ihren zuverlässigen Transport."

Ein effizientes Unternehmen zeichnet sich nicht nur durch gute Produktion aus, sondern auch durch einen reibungslosen Materialfluss zwischen allen Unternehmensbereichen.