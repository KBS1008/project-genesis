# FinanceTransaction Schema

> Definiert das Datenmodell aller Geldbewegungen in Project Genesis.

Version: 1.0

---

# Zweck

Finance Transactions dokumentieren jede Veränderung des Unternehmenskontos.

Sie bilden die Grundlage für:

- Kontostände
- Gewinn und Verlust
- Statistiken
- Kredite
- Wirtschaftsauswertungen
- Audit-Logs
- Debugging

Kontostände dürfen niemals direkt verändert werden.

Alle Geldbewegungen erfolgen ausschließlich über Finance Transactions.

---

# Grundprinzip

```
Spielaktion

↓

Finance Transaction

↓

Finance aktualisieren

↓

Statistiken aktualisieren

↓

Finance Event
```

---

# Architektur

```
Finance

│

├── Cash Balance

│

└── Finance Transactions
        │
        ├── Produktion
        ├── Markt
        ├── Bau
        ├── Forschung
        ├── Kredit
        ├── Wartung
        └── Administration
```

---

# Schema

```yaml
id:

financeId:

companyId:

transactionType:

direction:

amount:

balanceBefore:

balanceAfter:

reservedCashDelta:

referenceType:

referenceId:

description:

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
FINTX-000000001
```

---

## financeId

Referenz auf Finance.

---

## companyId

Besitzer.

---

## transactionType

Art der Buchung.

```text
SALE

PURCHASE

PRODUCTION_COST

BUILDING_COST

BUILDING_REFUND

RESEARCH_COST

RESEARCH_REWARD

MAINTENANCE

SALARY

LOAN_RECEIVED

LOAN_PAYMENT

INTEREST

MARKET_FEE

TRANSPORT_COST

CONTRACT_PAYMENT

NPC_REWARD

TAX

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

## amount

Gebuchter Geldbetrag.

Immer positiv.

Die Richtung wird über `direction` bestimmt.

---

## balanceBefore

Kontostand vor der Buchung.

---

## balanceAfter

Kontostand nach der Buchung.

---

## reservedCashDelta

Änderung reservierter Geldmittel.

Beispiele

```text
+10000

-2500

0
```

---

## referenceType

Auslösendes Objekt.

```text
MarketOrder

ProductionJob

Construction

Research

Loan

Contract

Transport

AdminAction
```

---

## referenceId

ID des auslösenden Objekts.

---

## description

Optionale Beschreibung.

Beispiel

```text
Verkauf von 500 Brettern
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
id: FINTX-000000001

financeId: FINANCE-000001

companyId: COMPANY-000001

transactionType: SALE

direction: IN

amount: 12500

balanceBefore: 80000

balanceAfter: 92500

reservedCashDelta: 0

referenceType: MarketOrder

referenceId: ORDER-000021

description: Verkauf von Brettern

createdBy: SYSTEM

timestamp: 2026-07-01T10:14:12Z

version: 1
```

---

# Typische Buchungen

## Verkauf

```
IN
```

---

## Einkauf

```
OUT
```

---

## Produktionskosten

```
OUT
```

---

## Baukosten

```
OUT
```

---

## Kreditauszahlung

```
IN
```

---

## Kreditrückzahlung

```
OUT
```

---

## Zinsen

```
OUT
```

---

## Wartungskosten

```
OUT
```

---

## Gehälter

```
OUT
```

---

## NPC-Belohnung

```
IN
```

---

# Reservierung von Geld

Bei bestimmten Aktionen wird Geld zunächst reserviert.

Beispiele

```
Gebäudebau

↓

Gebot auf Markt

↓

Langfristiger Vertrag
```

Der tatsächliche Geldabfluss erfolgt erst später.

---

# Reihenfolge

```
Validierung

↓

Kontostand prüfen

↓

Transaction speichern

↓

Finance aktualisieren

↓

Statistik aktualisieren

↓

Finance Event erzeugen
```

---

# Beziehungen

```
FinanceTransaction

├── gehört zu → Finance

├── gehört zu → Company

├── verweist auf → MarketOrder

├── verweist auf → Construction

├── verweist auf → ProductionJob

├── verweist auf → Research

├── verweist auf → Loan

├── verweist auf → Contract

└── erzeugt → Finance Event
```

---

# Designregeln

✔ Transaktionen sind unveränderlich.

✔ Bereits gespeicherte Transaktionen werden niemals geändert.

✔ Korrekturen erfolgen ausschließlich über Gegentransaktionen.

✔ Jede Transaktion besitzt eine Referenz.

✔ Beträge sind immer positiv.

✔ Die Richtung bestimmt Ein- oder Auszahlung.

✔ Zeitangaben werden ausschließlich in UTC gespeichert.

---

# Fehlerbehandlung

Ungültige Buchungen werden abgelehnt.

Beispiele

- negativer Kontostand (ohne Kredit)
- ungültige Referenz
- unbekannter Transaktionstyp
- Betrag ≤ 0

Es erfolgt keine Teilbuchung.

---

# Erweiterbarkeit

## Version 2

- Mehrere Bankkonten
- Kostenstellen
- Investitionen
- Dividenden
- Leasing

## Version 3

- Vollständige Bilanz
- Gewinn- und Verlustrechnung
- Cashflow-Analyse
- Steuerbuchhaltung
- Internationale Währungen

---

# Definition of Done

Eine Finance Transaction ist vollständig definiert, wenn:

- Finance bekannt
- Company bekannt
- Betrag definiert
- Richtung gesetzt
- Kontostand vor/nach der Buchung gespeichert
- Referenz vorhanden
- Zeitstempel gesetzt
- Transaktion unveränderlich gespeichert

---

# Leitsatz

> "Jede Geldeinheit hinterlässt einen Buchungssatz."

Project Genesis speichert jede finanzielle Bewegung als unveränderliche Finance Transaction. Dadurch bleiben sämtliche Geldflüsse jederzeit nachvollziehbar, auswertbar und revisionssicher.