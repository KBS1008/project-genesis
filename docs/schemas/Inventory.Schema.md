# Inventory Schema

> Definiert das Datenmodell der Lagerverwaltung in Project Genesis.

Version: 1.0

---

# Zweck

Das Inventory verwaltet sämtliche Ressourcen einer Company.

Es bildet die Grundlage für:

- Produktion
- Handel
- Transport
- Forschung
- Energie
- Bauprojekte

Das Inventory speichert keine Gebäudedaten.

Es verwaltet ausschließlich Ressourcen.

---

# Grundprinzip

```
Company

↓

Inventory

↓

Inventory Items

↓

Reservierungen

↓

Produktion

↓

Markt

↓

Transport
```

---

# Architektur

```
Inventory

├── Inventory Items

├── Reservations

├── Incoming Deliveries

├── Outgoing Deliveries

└── Statistics
```

---

# Inventory Schema

```yaml
id:

companyId:

status:

capacity:

usedCapacity:

reservedCapacity:

items:

reservations:

incoming:

outgoing:

statistics:

createdAt:

updatedAt:
```

---

# Feldbeschreibung

## id

Eindeutige Lager-ID.

---

## companyId

Besitzer.

---

## status

```text
ACTIVE

LOCKED

ARCHIVED
```

---

## capacity

Gesamtkapazität.

Einheit

Liter

Version 1

Unbegrenzt.

Das Feld bleibt dennoch erhalten.

---

## usedCapacity

Berechneter Lagerverbrauch.

---

## reservedCapacity

Bereits reservierter Lagerplatz.

Später wichtig für:

- Transporte
- Produktion
- Bauprojekte

---

## items

Liste aller Lagerpositionen.

---

## reservations

Aktive Materialreservierungen.

---

## incoming

Eingehende Lieferungen.

Version 2.

---

## outgoing

Ausgehende Lieferungen.

Version 2.

---

## statistics

```yaml
totalStored:

totalConsumed:

totalProduced:

totalSold:

totalPurchased:
```

---

# Inventory Item Schema

Jede Ressource besitzt genau einen Eintrag.

```yaml
resourceId:

quantity:

reserved:

available:

averagePurchasePrice:

lastUpdated:
```

---

# resourceId

Referenz auf ResourceType.

Beispiel

```text
WOOD
```

---

# quantity

Gesamtbestand.

---

# reserved

Reservierte Menge.

Nicht verfügbar.

---

# available

Berechnet.

```
available

=

quantity

-

reserved
```

Dieses Feld wird nicht gespeichert.

Es wird berechnet.

---

# averagePurchasePrice

Durchschnittlicher Einkaufspreis.

Nur Statistik.

Nicht Marktpreis.

---

# Reservation Schema

```yaml
id:

resourceId:

amount:

reason:

referenceType:

referenceId:

createdAt:

expiresAt:
```

---

# reason

Beispiele

```text
PRODUCTION

BUILDING

TRANSPORT

CONTRACT
```

---

# referenceType

```text
ProductionJob

Construction

TransportOrder

MarketOrder
```

---

# referenceId

ID des auslösenden Objekts.

---

# Incoming Delivery

Version 2

```yaml
id:

transportId:

resourceId:

amount:

arrivalTime:
```

---

# Outgoing Delivery

Version 2

```yaml
id:

transportId:

resourceId:

amount:

departureTime:
```

---

# Beispiel

```yaml
id: INVENTORY-001

companyId: COMPANY-001

status: ACTIVE

capacity: 0

usedCapacity: 420

reservedCapacity: 90

items:

  - resourceId: WOOD

    quantity: 500

    reserved: 100

    averagePurchasePrice: 21

  - resourceId: STONE

    quantity: 320

    reserved: 0

    averagePurchasePrice: 13

reservations:

  - id: RES-001

    resourceId: WOOD

    amount: 100

    reason: PRODUCTION

    referenceType: ProductionJob

    referenceId: JOB-001

statistics:

  totalStored: 820

  totalConsumed: 2500

  totalProduced: 900

  totalSold: 1200

  totalPurchased: 1600
```

---

# Lageroperationen

## Einlagern

```
Resource

↓

Inventory Item erhöhen

↓

Statistik aktualisieren

↓

Event erzeugen
```

---

## Reservieren

```
Inventory Item

↓

reserved erhöhen

↓

available sinkt

↓

Production startet
```

---

## Verbrauch

```
reserved

↓

quantity

↓

Reservation löschen

↓

Inventory Event
```

---

## Verkauf

```
quantity reduzieren

↓

Statistik erhöhen

↓

Market Event
```

---

# Beziehungen

```
Inventory

├── gehört zu → Company

├── besitzt → Inventory Items

├── besitzt → Reservations

├── liefert → Production

├── liefert → Construction

├── liefert → Transport

└── liefert → Market
```

---

# Designregeln

✔ Ein Unternehmen besitzt genau ein Inventory.

✔ Jede Ressource existiert maximal einmal als Inventory Item.

✔ Verfügbare Menge wird berechnet.

✔ Reservierungen besitzen immer eine Referenz.

✔ Produktion nutzt ausschließlich reservierte Ressourcen.

✔ Marktpreise gehören niemals ins Inventory.

✔ Lager kennt keine Rezepte.

✔ Lager kennt keine Gebäude.

---

# Erweiterbarkeit

Version 2

- Mehrere Lagerhäuser
- Regionale Lager
- Kühlhäuser
- Silos
- Tanklager
- Gefahrgutlager

Version 3

- Automatische Umlagerung
- Lagerroboter
- Priorisierte Lagerplätze
- FIFO/LIFO
- Qualitätsverwaltung
- Chargenverwaltung

---

# Definition of Done

Ein Inventory ist vollständig definiert, wenn:

- Besitzer gesetzt
- Lagerstatus definiert
- Inventory Items vorhanden
- Reservierungen möglich
- Statistiken initialisiert
- Events definiert

---

# Leitsatz

> "Ein Lagerbestand besteht nicht nur aus dem, was vorhanden ist – sondern aus dem, was tatsächlich verfügbar ist."

Project Genesis unterscheidet konsequent zwischen **Gesamtbestand**, **reservierten Ressourcen** und **verfügbaren Ressourcen**. Diese Trennung verhindert Inkonsistenzen und bildet die Grundlage für Produktion, Handel und Logistik.