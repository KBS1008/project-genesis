# Production System

> Beschreibt das Produktionssystem von Project Genesis.

**Version:** 1.0

---

# Zweck

Das Produktionssystem ist das wirtschaftliche Herzstück von Project Genesis.

Es definiert, wie Unternehmen Ressourcen in Produkte umwandeln und dadurch wirtschaftlichen Erfolg erzielen.

Die Produktion verbindet nahezu alle Spielsysteme:

- Gebäude
- Ressourcen
- Rezepte
- Energie
- Mitarbeiter
- Forschung
- Markt
- Logistik

---

# Designziele

Das Produktionssystem soll:

- leicht verständlich sein
- langfristige Optimierung ermöglichen
- strategische Entscheidungen belohnen
- viele Produktionsketten erlauben
- vollständig automatisierbar sein
- einfach erweitert werden können

---

# Grundprinzip

```text
Ressourcen

↓

Rezept auswählen

↓

Produktionslinie

↓

Produktionsauftrag

↓

Produktion läuft

↓

Produkt fertig

↓

Lager
```

---

# Produktionskette

Eine Produktion besteht immer aus:

1. Eingangsressourcen
2. Rezept
3. Produktionsgebäude
4. Produktionszeit
5. Energie
6. Fertigprodukt

---

# Produktionsgebäude

Gebäude produzieren selbst nichts.

Sie führen lediglich Rezepte aus.

Dadurch kann ein Gebäude später durch Forschung neue Produkte herstellen.

Beispiel

```text
Sägewerk

↓

Bretter

↓

Möbel

↓

Fertighäuser
```

---

# Produktionsauftrag

Ein Produktionsauftrag enthält:

- Rezept
- Menge
- Priorität
- Status
- Startzeit
- Endzeit
- Energiebedarf
- Ressourcenreservierung

---

# Produktionsstatus

```text
PLANNED

↓

WAITING_FOR_RESOURCES

↓

READY

↓

RUNNING

↓

PAUSED

↓

COMPLETED

↓

CANCELLED

↓

FAILED
```

---

# Produktionswarteschlange

Jedes Produktionsgebäude besitzt eine Warteschlange.

Version 1

Eine Produktionslinie pro Gebäude.

Version 2

Mehrere Produktionslinien möglich.

---

# Ressourcenreservierung

Beim Start einer Produktion werden alle benötigten Ressourcen reserviert.

Dadurch können sie nicht versehentlich mehrfach verwendet werden.

Die Reservierung erfolgt vor Produktionsbeginn.

---

# Produktionszeit

Die Produktionszeit ergibt sich aus:

- Rezept
- Gebäudestufe
- Forschung
- Mitarbeitereffizienz
- Energieversorgung
- Gebäudeeffizienz

---

# Effizienz

Die Produktion arbeitet niemals mit 100 % festen Werten.

Die tatsächliche Effizienz hängt von mehreren Faktoren ab.

Beispiele:

- Wartung
- Energieversorgung
- Mitarbeitende
- Forschung
- Spezialisierung

---

# Energie

Ohne Energie findet keine Produktion statt.

Version 1

Produktion pausiert.

Version 2

Priorisierte Energieverteilung.

---

# Wartung

Schlecht gewartete Gebäude produzieren langsamer.

Sehr schlechter Zustand erhöht zusätzlich:

- Energieverbrauch
- Produktionszeit
- Ausfallwahrscheinlichkeit

---

# Mitarbeitende

Version 1

Mitarbeitende erhöhen die Effizienz.

Version 2

Spezialisierte Fachkräfte.

Beispiele:

- Ingenieur
- Maschinenführer
- Qualitätsmanager

---

# Forschung

Neue Technologien können:

- Produktionszeit verkürzen
- Energieverbrauch senken
- neue Rezepte freischalten
- neue Produktionslinien ermöglichen

---

# Qualitätsstufen

Version 1

Alle Produkte besitzen identische Qualität.

Version 2

Mehrere Qualitätsstufen.

Beispiel

```text
Standard

↓

Gut

↓

Premium

↓

Luxus
```

---

# Produktionsunterbrechung

Eine Produktion kann pausieren durch:

- Stromausfall
- Ressourcenmangel
- Gebäudeschaden
- manuelle Pause

Nach Beseitigung der Ursache wird sie fortgesetzt.

---

# Automatisierung

Version 1

Manuelle Produktionsaufträge.

Version 2

Automatische Produktionsregeln.

Beispiele

```text
Wenn Holz > 1000

↓

Produziere Bretter
```

---

# Produktionsketten

Produkte können wiederum Rohstoffe für weitere Produkte sein.

Beispiel

```text
Holz

↓

Bretter

↓

Möbel

↓

Büroausstattung

↓

Unternehmensverkauf
```

Dadurch entstehen komplexe Wertschöpfungsketten.

---

# Spezialisierung

Gebäude können später spezialisiert werden.

Beispiele

- Geschwindigkeit
- Qualität
- Energieeffizienz
- Massenproduktion

---

# Statistik

Für jede Produktion werden erfasst:

- produzierte Menge
- Laufzeit
- Energieverbrauch
- Ressourceneinsatz
- Produktionskosten
- Gewinn

Diese Daten dienen der Optimierung und Auswertung.

---

# Produktionskosten

Die tatsächlichen Produktionskosten setzen sich zusammen aus:

- Rohstoffen
- Energie
- Mitarbeitenden
- Wartung
- Gebäudekosten

Dadurch besitzt jedes Produkt einen realen Herstellungspreis.

---

# Wirtschaftliches Ziel

Nicht jede Produktion ist automatisch profitabel.

Spieler sollen entscheiden:

- selbst produzieren
- einkaufen
- verkaufen
- Zwischenprodukte handeln

Dadurch entsteht eine dynamische Wirtschaft.

---

# Zukunft

## Version 2

- Produktionsmodule
- Schichtbetrieb
- Qualitätsmanagement
- Produktionsplanung
- Lieferverträge

## Version 3

- KI-Produktionsplanung
- Just-in-Time-Produktion
- Produktionsnetzwerke
- Fabrikverbünde
- Industrie 4.0

---

# Beziehungen

Das Produktionssystem arbeitet zusammen mit:

- Building
- Recipe
- Resource
- Inventory
- Finance
- Market
- Energy
- Employees
- Research
- Simulation

---

# Leitsatz

> "Produktion bedeutet nicht nur, Güter herzustellen – sondern Ressourcen, Zeit, Energie und Kapital optimal einzusetzen."

Der wirtschaftliche Erfolg eines Unternehmens entsteht nicht durch möglichst viele Gebäude, sondern durch eine effiziente und gut geplante Produktion.
