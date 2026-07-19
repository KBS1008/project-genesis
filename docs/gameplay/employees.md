---
title: Employee System
version: 1.0
status: Approved
owner: Project Genesis Architecture
lastUpdated: 2026-07-02
reviewedBy: TBD
relatedDocuments:
  - production.md
  - research.md
  - buildings.md
  - economy.md
  - docs/schemas/Employee.schema.md
---

# Employee System

> Beschreibt das Mitarbeitersystem von Project Genesis.

---

# Zweck

Mitarbeitende stellen das Humankapital eines Unternehmens dar.

Sie beeinflussen:

- Produktion
- Forschung
- Wartung
- Energieeffizienz
- Verwaltung

Mitarbeitende sind eine begrenzte Ressource und müssen wirtschaftlich eingesetzt werden.

---

# Designziele

Das Mitarbeitersystem soll:

- einfach verständlich sein
- strategische Personalplanung ermöglichen
- Produktionsentscheidungen beeinflussen
- ohne Mikromanagement auskommen
- später erweitert werden können

---

# Grundprinzip

```text
Unternehmen

↓

Mitarbeitende einstellen

↓

Gebäuden zuweisen

↓

Produktivität steigern

↓

Mehr Gewinn

↓

Weitere Mitarbeitende
```

---

# Mitarbeitertypen

Version 1 verwendet Mitarbeitergruppen.

## Produktionsmitarbeiter

Betreiben Produktionsanlagen.

---

## Ingenieure

Verbessern Effizienz und Wartung.

---

## Forscher

Beschleunigen Forschungsprojekte.

---

## Verwaltung

Verbessert Unternehmensorganisation.

---

## Logistik

Steigert Lager- und Transporteffizienz.

---

# Einstellung

Neue Mitarbeitende können jederzeit eingestellt werden.

Die Einstellung verursacht:

- einmalige Rekrutierungskosten
- laufende Gehaltskosten

---

# Zuweisung

Mitarbeitende werden Gebäuden oder Unternehmensbereichen zugewiesen.

Beispiele:

```text
Sägewerk

↓

8 Produktionsmitarbeiter

↓

1 Ingenieur
```

---

# Produktivität

Die tatsächliche Leistung hängt ab von:

- Anzahl der Mitarbeitenden
- Gebäudestufe
- Forschung
- Wartungszustand
- Energieversorgung

---

# Gehälter

Alle Mitarbeitenden verursachen laufende Kosten.

Die Gehälter werden regelmäßig vom Unternehmenskonto abgebucht.

Dadurch entsteht ein wirtschaftlicher Abwägungsprozess.

---

# Mitarbeitermangel

Fehlen Mitarbeitende,

arbeiten Gebäude nur eingeschränkt.

Beispiele:

- geringere Geschwindigkeit
- reduzierte Effizienz
- eingeschränkte Produktionskapazität

---

# Überbesetzung

Mehr Mitarbeitende als erforderlich bringen nur begrenzte Vorteile.

Dadurch lohnt sich eine ausgewogene Personalplanung.

---

# Weiterbildung

Version 2

Unternehmen können Mitarbeitende weiterbilden.

Beispiele:

- Produktion
- Forschung
- Energie
- Logistik

Weiterbildung erhöht dauerhaft die Produktivität.

---

# Spezialisten

Version 2

Besondere Mitarbeitende besitzen einzigartige Fähigkeiten.

Beispiele:

- Chefingenieur
- Forschungsleiter
- Produktionsmanager
- Energieexperte

Sie verbessern einzelne Unternehmensbereiche erheblich.

---

# Mitarbeitermoral

Version 3

Die Motivation beeinflusst:

- Produktivität
- Ausfallwahrscheinlichkeit
- Fluktuation

Ein gutes Arbeitsumfeld steigert die Leistung.

---

# Unternehmenswachstum

Mit steigender Unternehmensgröße wächst auch der Personalbedarf.

Neue Gebäude benötigen zusätzliches Personal.

Dadurch entsteht eine natürliche Skalierung.

---

# Statistik

Für jede Company werden gespeichert:

- Gesamtzahl Mitarbeitende
- Personalkosten
- Produktivität
- Auslastung
- Weiterbildung
- Spezialisten

---

# Balance

Mitarbeitende sollen niemals nur Kosten sein.

Sie sind eine Investition.

Zu wenig Personal reduziert die Produktion.

Zu viel Personal verschlechtert die Wirtschaftlichkeit.

---

# Zukunft

## Version 2

- Weiterbildung
- Spezialisten
- Personalentwicklung
- Schichtsystem

## Version 3

- Motivation
- Arbeitsmarkt
- Fachkräftemangel
- Gewerkschaften
- Unternehmenskultur

---

# Beziehungen

Das Mitarbeitersystem arbeitet zusammen mit:

- Company
- Buildings
- Production
- Research
- Energy
- Finance
- Simulation

---

# Leitsatz

> "Maschinen erzeugen Produkte – Menschen machen Unternehmen erfolgreich."

Ein erfolgreiches Unternehmen investiert nicht nur in Gebäude und Technologien, sondern auch in seine Mitarbeitenden. Sie sind der entscheidende Faktor für Produktivität, Innovation und nachhaltiges Wachstum.
