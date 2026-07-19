# DD-022 – Abstract Logistics Network

Status: Accepted

Version: 1.0

Datum: 2026-07-02

Authors:

- Project Genesis Architecture

---

# Zusammenfassung

Project Genesis simuliert **keine einzelnen Fahrzeuge** für den internen Materialtransport.

Stattdessen basiert die Logistik auf einem abstrakten Logistiknetzwerk, das Transportaufträge zwischen Gebäuden automatisch verarbeitet.

Dadurch bleibt die Simulation performant, skalierbar und auf das eigentliche Ziel des Spiels fokussiert: die Unternehmensführung.

---

# Kontext

Viele Wirtschaftsspiele simulieren jedes Fahrzeug einzeln.

Dadurch entstehen:

- aufwendige Wegfindung
- hohe CPU-Auslastung
- komplexe KI
- schwieriges Balancing
- unnötiges Mikromanagement

Da Project Genesis eine Unternehmenssimulation und keine Verkehrssimulation ist, steht nicht das Fahrzeug, sondern der Materialfluss im Mittelpunkt.

---

# Entscheidung

Alle Transporte innerhalb eines Unternehmens erfolgen über ein abstraktes Logistiknetzwerk.

Der Spieler verwaltet keine Fahrzeuge.

Stattdessen erzeugen Gebäude automatisch Transportaufträge.

Das Logistiksystem übernimmt deren Ausführung.

---

# Architektur

```text
Produktion

↓

Transportauftrag

↓

Logistiknetzwerk

↓

Materialfluss

↓

Zielgebäude
```

---

# Transportauftrag

Ein Transportauftrag besteht aus:

- Quellgebäude
- Zielgebäude
- Ressource
- Menge
- Priorität
- Status

Der Auftrag wird automatisch verarbeitet.

---

# Logistiknetzwerk

Das Logistiknetzwerk übernimmt:

- Transportplanung
- Priorisierung
- Materialbewegung
- Statusüberwachung

Es besitzt keine sichtbaren Fahrzeuge.

---

# Vorteile

## Performance

Es müssen keine Fahrzeuge simuliert werden.

Dadurch bleibt die Simulation auch bei sehr großen Unternehmen performant.

---

## Skalierbarkeit

Neue Gebäude erzeugen lediglich weitere Transportaufträge.

Die Simulationslogik bleibt unverändert.

---

## Weniger Mikromanagement

Spieler konzentrieren sich auf:

- Produktion
- Forschung
- Wirtschaft
- Unternehmensentwicklung

Nicht auf das Verschieben einzelner Fahrzeuge.

---

## Erweiterbarkeit

Spätere Versionen können sichtbare Fahrzeuge ergänzen, ohne die Simulationslogik zu verändern.

---

# Versionierung

## Version 1

- Abstraktes Logistiknetzwerk
- Automatische Transportaufträge
- Keine Fahrzeuge
- Keine Wegfindung

---

## Version 2

Zusätzlich:

- Logistikzentren
- Transportkapazität
- Energieverbrauch
- Priorisierung

---

## Version 3

Zusätzlich:

- Straßen
- Eisenbahn
- Häfen
- Flughäfen
- Sichtbare Fahrzeuge (optional)

Die Fahrzeuge dienen ausschließlich der Visualisierung.

Die eigentliche Simulation bleibt unverändert.

---

# Konsequenzen

## Vorteile

✔ Sehr hohe Performance

✔ Weniger Komplexität

✔ Gute Skalierbarkeit

✔ Leicht testbar

✔ Multiplayer-freundlich

✔ Klare Trennung zwischen Simulation und Darstellung

---

## Nachteile

- Keine sichtbaren Fahrzeuge in Version 1
- Weniger optische Dynamik

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternative

Simulation einzelner Fahrzeuge.

Diese Lösung wurde verworfen aufgrund von:

- hoher Rechenlast
- komplexer Wegfindung
- vielen Sonderfällen
- größerem Entwicklungsaufwand
- höherem Testaufwand

---

# Auswirkungen

Diese Entscheidung beeinflusst:

- Transport System
- Production System
- Inventory System
- Simulation Engine
- Building System

---

# Related Decisions

- DD-018 – Multi-Layer Market Architecture
- DD-020 – Dynamic Workforce Allocation
- DD-021 – Unified Building Capacity Model

---

# Affected Documents

- transport.md
- production.md
- buildings.md
- simulation.md
- Inventory.schema.md
- Production.schema.md

---

# Implementierungshinweise

Das Logistiknetzwerk arbeitet ausschließlich mit Transportaufträgen.

Der Ablauf ist:

```text
Bedarf erkannt

↓

Transportauftrag erzeugen

↓

Priorität berechnen

↓

Transport simulieren

↓

Inventar aktualisieren

↓

Auftrag abschließen
```

Die Simulationsengine verarbeitet Transportaufträge in jedem Simulationstick.

Die Darstellung im Frontend ist vollständig von der Simulation entkoppelt.

Dadurch können spätere grafische Erweiterungen implementiert werden, ohne die Backendlogik anzupassen.

---

# Leitsatz

> "Nicht das Fahrzeug ist entscheidend – sondern dass die richtige Ressource zur richtigen Zeit am richtigen Ort ankommt."

Project Genesis betrachtet Logistik als Unternehmensprozess und nicht als Verkehrssimulation. Dadurch bleibt der Fokus auf wirtschaftlichen Entscheidungen und einer performanten, langfristig erweiterbaren Simulation.
