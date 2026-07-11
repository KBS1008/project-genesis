---
title: Market System
version: 1.0
status: Approved
owner: Project Genesis Architecture
lastUpdated: 2026-07-02
reviewedBy: TBD
relatedDocuments:
  - economy.md
  - production.md
  - resources.md
  - Market.schema.md
---

# Market System

> Beschreibt das Handelssystem von Project Genesis.

---

# Zweck

Der Markt verbindet alle Unternehmen der Spielwelt.

Er ermöglicht:

- Einkauf von Rohstoffen
- Verkauf eigener Produkte
- Preisbildung
- langfristige Verträge
- wirtschaftlichen Wettbewerb

Der Markt ist das zentrale Bindeglied zwischen Produktion und Gewinn.

---

# Designziele

Das Marktsystem soll:

- dynamisch sein
- fair bleiben
- langfristige Strategien belohnen
- Angebot und Nachfrage simulieren
- niemals vollständig berechenbar sein
- trotzdem für neue Spieler verständlich bleiben

---

# Core Gameplay Loop

```text
Produktion

↓

Lager

↓

Markt

↓

Verkauf

↓

Gewinn

↓

Investitionen

↓

Mehr Produktion
```

---

# Handelsarten

Version 1 unterstützt zwei Handelsformen.

## Sofortkauf

Spieler kaufen Ressourcen direkt zum aktuell besten Marktpreis.

---

## Verkaufsauftrag

Spieler stellen Waren auf dem Markt ein.

Der Auftrag bleibt aktiv bis:

- verkauft
- storniert
- abgelaufen

---

# Orderbuch

Jede Ressource besitzt ein eigenes Orderbuch.

Dieses enthält:

- Kaufaufträge
- Verkaufsaufträge
- aktuellen Marktpreis
- Handelsvolumen

Der Marktpreis ergibt sich aus den tatsächlich ausgeführten Geschäften.

---

# Preisbildung

Es existieren keine festen Preise.

Der Preis entsteht durch:

- Angebot
- Nachfrage
- Handelsvolumen

Dadurch entwickelt jede Ressource ihren eigenen Markt.

---

# Marktpreis

Für jede Ressource werden gespeichert:

- letzter Preis
- Durchschnittspreis
- Tageshoch
- Tagestief
- Handelsvolumen

Diese Werte dienen ausschließlich der Information.

---

# Kaufaufträge

Ein Kaufauftrag enthält:

- Ressource
- Menge
- Maximalpreis
- Laufzeit

Der Auftrag wird automatisch ausgeführt, sobald ein passendes Angebot vorhanden ist.

---

# Verkaufsaufträge

Ein Verkaufsauftrag enthält:

- Ressource
- Menge
- Mindestpreis
- Laufzeit

Während der Auftrag aktiv ist, bleibt die Ware im Lager reserviert.

---

# Marktgebühren

Jeder Handel erzeugt Gebühren.

Version 1

Feste Handelsgebühr.

Version 2

Abhängig vom Handelsvolumen.

---

# Verträge

Version 2

Unternehmen können langfristige Lieferverträge abschließen.

Beispiele:

- 500 Holz pro Stunde
- 100 Stahl pro Tag

Dadurch entstehen stabile Lieferketten.

---

# Marktinformationen

Spieler erhalten:

- Preisdiagramme
- Handelsvolumen
- Preisentwicklung
- Durchschnittspreise
- eigene Handelsstatistiken

Informationen sind ein strategischer Vorteil.

---

# Spekulation

Version 2

Spieler können gezielt auf steigende oder fallende Preise reagieren.

Beispiele:

- Vorräte aufbauen
- Waren zurückhalten
- günstige Marktphasen nutzen

---

# NPC-Unternehmen

Version 2

Nicht alle Marktteilnehmer sind menschliche Spieler.

NPC-Unternehmen sorgen für:

- Grundversorgung
- stabile Nachfrage
- realistische Preisentwicklung

---

# Weltwirtschaft

Version 3

Globale Ereignisse beeinflussen den Markt.

Beispiele:

- Energiekrisen
- schlechte Ernten
- technologische Durchbrüche
- Naturkatastrophen

Diese Ereignisse verändern Angebot und Nachfrage.

---

# Unternehmensreputation

Eine hohe Reputation kann später Vorteile bringen:

- günstigere Gebühren
- exklusive Verträge
- frühere Ausschreibungen

---

# Marktstatistiken

Für jede Company werden gespeichert:

- Umsatz
- Einkaufsvolumen
- Verkaufsvolumen
- Gewinn
- Anzahl der Handelsgeschäfte
- erfolgreich abgeschlossene Aufträge

---

# Wirtschaftliches Ziel

Erfolg entsteht nicht allein durch Produktion.

Ein gutes Unternehmen entscheidet:

- produzieren
- einkaufen
- verkaufen
- lagern
- warten
- spekulieren

Dadurch entstehen unterschiedliche Unternehmensstrategien.

---

# Zukunft

## Version 2

- Lieferverträge
- NPC-Unternehmen
- Preisdiagramme
- Handelsfilter
- automatische Handelsregeln

## Version 3

- Weltwirtschaft
- Wirtschaftskrisen
- regionale Märkte
- Ausschreibungen
- Großkunden

## Version 4

- Terminmärkte
- Rohstoffbörse
- Unternehmensanteile
- internationale Handelsplätze

---

# Beziehungen

Das Marktsystem arbeitet zusammen mit:

- Company
- Inventory
- Finance
- Production
- Resources
- Research
- Simulation

---

# Leitsatz

> "Produziert wird in der Fabrik – Gewinn entsteht am Markt."

Ein erfolgreiches Unternehmen zeichnet sich nicht nur durch effiziente Produktion aus, sondern vor allem durch kluge Handelsentscheidungen und das Verständnis wirtschaftlicher Zusammenhänge.