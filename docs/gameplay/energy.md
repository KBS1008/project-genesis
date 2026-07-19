---
title: Energy System
version: 1.0
status: Approved
owner: Project Genesis Architecture
lastUpdated: 2026-07-02
reviewedBy: TBD
relatedDocuments:
  - buildings.md
  - production.md
  - employees.md
  - research.md
  - simulation.md
---

# Energy System

> Beschreibt das Energiesystem von Project Genesis.

---

# Zweck

Energie versorgt sämtliche Gebäude eines Unternehmens.

Ohne ausreichende Energie können:

- Produktionsanlagen
- Forschungseinrichtungen
- Logistiksysteme
- Verwaltungsgebäude

nicht oder nur eingeschränkt arbeiten.

Das Energiesystem verbindet nahezu alle Spielmechaniken.

---

# Designziele

Das Energiesystem soll:

- leicht verständlich sein
- strategische Entscheidungen fördern
- Engpässe erzeugen
- langfristige Planung belohnen
- problemlos erweitert werden können

---

# Grundprinzip

```text
Kraftwerke

↓

Energieerzeugung

↓

Unternehmensnetz

↓

Gebäude

↓

Produktion
```

---

# Energieerzeugung

Energie wird ausschließlich durch Energiegebäude erzeugt.

Version 1

Beispiele:

- Kohlekraftwerk
- Gaskraftwerk
- Solarkraftwerk
- Windkraftanlage

Weitere Kraftwerkstypen werden durch Forschung freigeschaltet.

---

# Energieverbrauch

Jedes Gebäude besitzt einen definierten Energiebedarf.

Beispiele

| Gebäude   | Verbrauch |
| --------- | --------: |
| Sägewerk  |     40 MW |
| Mine      |     80 MW |
| Forschung |     30 MW |
| Lager     |     10 MW |

Die tatsächlichen Werte werden im Balancing festgelegt.

---

# Energiebilanz

Für jedes Unternehmen wird kontinuierlich berechnet:

```text
Erzeugung

-

Verbrauch

=

Reserve
```

Eine positive Reserve bedeutet ausreichende Energieversorgung.

---

# Energieüberschuss

Überschüssige Energie bleibt zunächst ungenutzt.

Version 2

Überschüsse können gespeichert oder verkauft werden.

---

# Energiemangel

Bei einem Defizit arbeitet das Unternehmen eingeschränkt.

Version 1

Gebäude werden nach Priorität versorgt.

Niedrig priorisierte Gebäude pausieren automatisch.

---

# Prioritäten

Jedes Gebäude besitzt eine Energiepriorität.

```text
Sehr Hoch

↓

Hoch

↓

Normal

↓

Niedrig
```

Bei Strommangel werden zuerst Gebäude mit niedriger Priorität abgeschaltet.

---

# Energieeffizienz

Der Energieverbrauch wird beeinflusst durch:

- Forschung
- Gebäudestufe
- Wartungszustand
- Spezialisierungen

Dadurch können Unternehmen ihre Betriebskosten langfristig senken.

---

# Wartung

Schlecht gewartete Kraftwerke erzeugen weniger Energie.

Schlecht gewartete Verbraucher benötigen mehr Energie.

Dadurch entsteht ein direkter Zusammenhang zwischen Wartung und Wirtschaftlichkeit.

---

# Mitarbeitende

Ingenieure erhöhen:

- Kraftwerksleistung
- Energieeffizienz
- Wartungsgeschwindigkeit

Fehlendes Personal reduziert die tatsächliche Leistung.

---

# Forschung

Neue Technologien ermöglichen:

- effizientere Kraftwerke
- geringeren Verbrauch
- neue Energiequellen
- intelligente Lastverteilung

---

# Energiekosten

Jede erzeugte Energie besitzt Produktionskosten.

Diese setzen sich zusammen aus:

- Brennstoff
- Wartung
- Personal
- Gebäudekosten

Dadurch entstehen realistische Betriebskosten.

---

# Notstrom

Version 2

Unternehmen können Notstromaggregate installieren.

Diese versorgen kritische Gebäude bei Energieengpässen.

---

# Energiespeicher

Version 2

Batterien oder Speicher puffern Energieüberschüsse.

Dadurch lassen sich Lastspitzen ausgleichen.

---

# Erneuerbare Energien

Version 3

Neue Technologien ermöglichen:

- Solarparks
- Windparks
- Wasserkraft
- Geothermie

Diese erzeugen Energie mit geringeren Betriebskosten.

---

# Umwelt

Version 4

Kraftwerke verursachen Emissionen.

Spätere Spielmechaniken können berücksichtigen:

- CO₂-Ausstoß
- Umweltauflagen
- Emissionshandel

---

# Statistik

Für jede Company werden gespeichert:

- Gesamterzeugung
- Gesamtverbrauch
- Energieüberschuss
- Energiekosten
- Kraftwerksauslastung
- Effizienz

---

# Balance

Ein erfolgreiches Unternehmen produziert nicht möglichst viel Energie.

Es produziert genau so viel wie benötigt.

Überdimensionierte Kraftwerke verursachen unnötige Kosten.

Zu wenig Energie reduziert die Produktivität.

---

# Zukunft

## Version 2

- Energiespeicher
- Notstrom
- Lastmanagement
- Stromhandel

## Version 3

- Erneuerbare Energien
- Smart Grid
- Virtuelle Kraftwerke

## Version 4

- Regionale Stromnetze
- Energiebörse
- CO₂-Handel
- Internationale Energieversorgung

---

# Beziehungen

Das Energiesystem arbeitet zusammen mit:

- Buildings
- Production
- Employees
- Research
- Finance
- Simulation

---

# Leitsatz

> "Kapital baut Fabriken – Energie hält sie am Laufen."

Ein wirtschaftlich erfolgreiches Unternehmen investiert nicht nur in Produktionskapazitäten, sondern auch in eine stabile und effiziente Energieversorgung.
