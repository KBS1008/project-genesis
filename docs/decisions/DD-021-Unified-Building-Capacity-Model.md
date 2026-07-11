# DD-021 – Unified Building Capacity Model

Status: Accepted

Version: 1.0

Datum: 2026-07-02

---

# Kontext

In vielen Wirtschaftssimulationen besitzt jeder Gebäudetyp eigene Regeln.

Beispiele:

- Kraftwerke erzeugen Energie.
- Lagerhäuser speichern Ressourcen.
- Fabriken produzieren Waren.
- Forschungslabore entwickeln Technologien.

Dadurch entstehen zahlreiche Sonderfälle in der Simulation.

Mit zunehmender Anzahl von Gebäuden wächst die Komplexität der Implementierung erheblich.

Project Genesis verfolgt deshalb einen generischen Ansatz.

---

# Entscheidung

Jedes Gebäude basiert auf demselben Kapazitätsmodell.

Unabhängig vom Gebäudetyp besitzt jedes Gebäude definierte Kapazitäten und Ressourcenbedarfe.

Die Simulation behandelt dadurch alle Gebäude nach denselben Grundregeln.

---

# Das Unified Building Model

Jedes Gebäude besitzt folgende Kernbereiche:

```text
Building

├── Personal Capacity
├── Energy Capacity
├── Storage Capacity
├── Production Capacity
├── Maintenance State
├── Efficiency
└── Upgrade Level
```

Nicht jede Kapazität wird von jedem Gebäude genutzt.

Nicht benötigte Kapazitäten besitzen den Wert **0**.

---

# Beschreibung der Kapazitäten

## Personal Capacity

Beschreibt den Personalbedarf und die maximale Personalkapazität.

Beeinflusst:

- Produktion
- Forschung
- Wartung
- Energieerzeugung

---

## Energy Capacity

Beschreibt entweder:

- den Energieverbrauch

oder

- die Energieerzeugung

Je nach Gebäudetyp.

---

## Storage Capacity

Speichert:

- Rohstoffe
- Zwischenprodukte
- Endprodukte

Nicht jedes Gebäude besitzt Lagerkapazität.

---

## Production Capacity

Bestimmt die maximale Produktionsleistung.

Kann verwendet werden für:

- Produktion
- Forschung
- Energieerzeugung
- Logistikprozesse

Je nach Gebäudetyp.

---

## Maintenance State

Der Wartungszustand beeinflusst:

- Energieeffizienz
- Produktionsleistung
- Ausfallwahrscheinlichkeit

---

## Efficiency

Die Gesamteffizienz ergibt sich aus mehreren Faktoren:

- Personal
- Energie
- Wartung
- Forschung
- Gebäudestufe

---

## Upgrade Level

Bestimmt den technologischen Ausbau eines Gebäudes.

Beeinflusst:

- Kapazitäten
- Energieverbrauch
- Produktionsleistung

---

# Beispiele

## Sägewerk

```text
Personal      10

Energy        -40 MW

Storage       500

Production    100
```

---

## Lagerhaus

```text
Personal      2

Energy        -5 MW

Storage       20.000

Production    0
```

---

## Solarkraftwerk

```text
Personal      3

Energy        +120 MW

Storage       0

Production    0
```

---

## Forschungslabor

```text
Personal      12

Energy        -30 MW

Storage       0

Production    50 Forschungseinheiten
```

---

# Vorteile

## Einheitliche Simulation

Alle Gebäude werden identisch verarbeitet.

Dadurch sinkt die Anzahl spezieller Berechnungen.

---

## Hohe Erweiterbarkeit

Neue Gebäudetypen benötigen keine eigene Simulationslogik.

Lediglich die Kapazitätswerte unterscheiden sich.

---

## Einfaches Balancing

Gebäude werden ausschließlich über Kapazitäten angepasst.

Neue Spielinhalte können ohne Änderungen an der Simulationsengine ergänzt werden.

---

## Geringere Backend-Komplexität

Statt vieler Spezialfälle existiert ein generisches Gebäudemodell.

Das reduziert:

- Codeumfang
- Fehlerquellen
- Wartungsaufwand

---

# Auswirkungen auf andere Systeme

## Produktion

Produktionsleistung basiert auf der Production Capacity.

---

## Energie

Energieerzeugung und Energieverbrauch nutzen dasselbe Modell.

---

## Mitarbeitende

Die Personal Capacity bestimmt den Personalbedarf.

---

## Lager

Storage Capacity definiert die maximale Lagergröße.

---

## Forschung

Gebäude können Forschungskapazität besitzen.

Dadurch benötigt Forschung keine eigene Gebäudelogik.

---

## Simulation

Die Simulationsengine verarbeitet sämtliche Gebäude nach denselben Regeln.

---

# Versionierung

## Version 1

- Personal Capacity
- Energy Capacity
- Storage Capacity
- Production Capacity
- Maintenance State
- Efficiency
- Upgrade Level

---

## Version 2

Zusätzlich:

- Module
- Spezialisierungen
- Prioritäten
- Automatisierung

---

## Version 3

Zusätzlich:

- Verschleiß
- Umweltwerte
- Emissionen
- Smart Grid
- Produktionsnetzwerke

---

# Konsequenzen

## Vorteile

✔ Einheitliche Architektur

✔ Weniger Sonderlogik

✔ Einfache Erweiterbarkeit

✔ Gute Skalierbarkeit

✔ Leicht testbar

✔ Einheitliches Datenmodell

---

## Nachteile

Einige Gebäude besitzen Kapazitäten, die sie praktisch nicht nutzen.

Diese zusätzlichen Felder werden bewusst akzeptiert.

Die Vorteile einer einheitlichen Architektur überwiegen deutlich.

---

# Verworfene Alternative

Für jeden Gebäudetyp ein eigenes Datenmodell und eine eigene Simulationslogik.

Gründe für die Ablehnung:

- hoher Entwicklungsaufwand
- viele Sonderfälle
- schwierige Wartung
- schlechte Erweiterbarkeit

---

# Implementierungshinweise

Alle Gebäude basieren auf einer gemeinsamen Basisklasse bzw. einem gemeinsamen Datenmodell.

Gebäudespezifisches Verhalten entsteht ausschließlich durch:

- Kapazitätswerte
- Gebäudetyp
- Forschung
- Module
- Spezialisierungen

Die Simulationsengine arbeitet ausschließlich mit diesen Eigenschaften.

---

# Beziehungen

Diese Entscheidung beeinflusst insbesondere:

- Building.schema.md
- Production.schema.md
- Employee.schema.md
- Energy System
- Simulation Engine
- Database Design Document (DDD)
- Software Architecture Document (SAD)

---

# Leitsatz

> "Jedes Gebäude folgt denselben Grundregeln – nur seine Kapazitäten unterscheiden sich."

Durch ein einheitliches Gebäudemodell bleibt Project Genesis flexibel, erweiterbar und langfristig wartbar. Neue Gebäude können hinzugefügt werden, ohne die Simulationsengine verändern zu müssen.