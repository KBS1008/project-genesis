# InventoryTransaction Schema

> Definiert das Datenmodell aller Lagerbewegungen in Project Genesis.

Version: 1.0

---

# Zweck

Inventory Transactions dokumentieren jede Veränderung eines Lagerbestands.

Sie bilden die Grundlage für:

- Nachvollziehbarkeit
- Debugging
- Statistiken
- Buchhaltung
- Replay
- Cheat-Erkennung

Ein Lagerbestand darf niemals direkt verändert werden.

Jede Änderung erfolgt ausschließlich über eine Inventory Transaction.

---

# Grundprinzip

```
Produktion beendet

↓

Inventory Transaction

↓

Inventory aktualisieren

↓

Inventory Event

↓

Statistik aktualisieren
```

---

# Architektur

```
Inventory

│

├── Inventory Item

│

└── Inventory Transactions
        │
        ├── Produktion
        ├── Markt
        ├── Bau
        ├── Transport
        ├── Forschung
        └── Administration
```

---

# Schema

```yaml
id:

inventoryId:

companyId:

resourceId:

transactionType:

direction:

quantity:

quantityBefore:

quantityAfter:

reservationDelta:

referenceType:

referenceId:

reason:

createdBy:

timestamp:

version:
```

---

# Feldbeschreibung

## id

Eindeutige Transaktions-ID.

Beispiel

```text
INVTX-000000123
```

---

## inventoryId

Referenz auf das Lager.

---

## companyId

Besitzer.

---

## resourceId

Referenz auf ResourceType.

Beispiel

```text
WOOD
```

---

## transactionType

Art der Lagerbewegung.

```text
PRODUCTION

PURCHASE

SALE

TRANSPORT_IN

TRANSPORT_OUT

CONSTRUCTION

RESEARCH

RESERVATION

RELEASE

ADMIN

SYSTEM
```

---

## direction

```text
IN

OUT

NONE
```

NONE wird für reine Reservierungen verwendet.

---

## quantity

Menge der Bewegung.

Immer positiv.

Die Richtung wird durch `direction` bestimmt.

---

## quantityBefore

Bestand vor der Buchung.

---

## quantityAfter

Bestand nach der Buchung.

---

## reservationDelta

Änderung der reservierten Menge.

Beispiele

```text
+100

-50

0
```

---

## referenceType

Auslösendes Objekt.

```text
ProductionJob

Construction

MarketOrder

TransportOrder

Research

Contract

AdminAction
```

---

## referenceId

ID des auslösenden Objekts.

---

## reason

Freitext oder definierter Code.

Beispiel

```text
PRODUCTION_COMPLETED
```

---

## createdBy

```text
PLAYER

SYSTEM

ADMIN
```

---

## timestamp

Zeitpunkt der Buchung.

Immer UTC.

---

## version

Schema-Version.

---

# Beispiel

```yaml
id: INVTX-0000001

inventoryId: INVENTORY-000001

companyId: COMPANY-000001

resourceId: WOOD

transactionType: PRODUCTION

direction: IN

quantity: 120

quantityBefore: 380

quantityAfter: 500

reservationDelta: 0

referenceType: ProductionJob

referenceId: JOB-001

reason: PRODUCTION_COMPLETED

createdBy: SYSTEM

timestamp: 2026-07-01T08:01:00Z

version: 1
```

---

# Typische Lagerbewegungen

## Produktion abgeschlossen

```
direction

IN
```

---

## Produktion gestartet

```
direction

NONE

reservationDelta

+100
```

---

## Produktion beendet

```
direction

OUT

reservationDelta

-100
```

---

## Verkauf

```
OUT
```

---

## Einkauf

```
IN
```

---

## Bau eines Gebäudes

```
OUT
```

---

## Forschung

```
OUT
```

Nur wenn Ressourcen benötigt werden.

---

## Transport

```
OUT

↓

Transport

↓

IN
```

---

# Reihenfolge

Eine Inventory Transaction wird immer verarbeitet:

```
Validierung

↓

Bestand prüfen

↓

Transaction speichern

↓

Inventory aktualisieren

↓

Inventory Event

↓

Statistik aktualisieren
```

---

# Beziehungen

```
InventoryTransaction

├── gehört zu → Inventory

├── gehört zu → Company

├── betrifft → ResourceType

├── verweist auf → ProductionJob

├── verweist auf → Construction

├── verweist auf → MarketOrder

├── verweist auf → Research

└── erzeugt → Inventory Event
```

---

# Designregeln

✔ Transaktionen sind unveränderlich.

✔ Bereits gespeicherte Transaktionen werden niemals bearbeitet.

✔ Korrekturen erfolgen ausschließlich durch Gegentransaktionen.

✔ Jede Transaktion besitzt eine Referenz.

✔ Zeitstempel werden in UTC gespeichert.

✔ Mengen sind immer positiv.

✔ Richtung definiert Zu- oder Abgang.

---

# Fehlerbehandlung

Ungültige Transaktionen werden verworfen.

Beispiele

- negativer Bestand
- unbekannte Ressource
- fehlende Referenz
- ungültiger Transaktionstyp

Es erfolgt keine Teilbuchung.

---

# Erweiterbarkeit

Version 2

- Chargen
- Seriennummern
- Qualitätsstufen
- Lagerorte
- Transportcontainer

Version 3

- Blockchain-ähnliche Prüfsummen
- Audit-Logs
- Digitale Signaturen
- Revisionssicherheit

---

# Definition of Done

Eine Inventory Transaction ist vollständig definiert, wenn:

- ResourceType bekannt
- Menge definiert
- Richtung gesetzt
- Bestand vor/nach der Buchung gespeichert
- Referenz vorhanden
- Zeitstempel gesetzt
- Transaktion unveränderlich gespeichert

---

# Leitsatz

> "Jede Ressource hinterlässt eine Spur."

Project Genesis speichert jede Lagerbewegung als unveränderliche Transaktion. Dadurch sind Bestände jederzeit nachvollziehbar, überprüfbar und reproduzierbar.