# Finance Schema

> Definiert das Finanzmodul eines Unternehmens in Project Genesis.

Version: 1.0

---

# Zweck

Das Finance-Modul verwaltet sämtliche finanziellen Informationen einer Company.

Es ist verantwortlich für:

- Kontostände
- Einnahmen
- Ausgaben
- Kredite
- Investitionen
- Statistiken

Alle Geldbewegungen werden über Finance Transactions dokumentiert.

---

# Grundprinzip

```
Company

↓

Finance

↓

Finance Transactions

↓

Kontostand

↓

Statistiken
```

---

# Architektur

```
Finance

├── Cash Account

├── Transactions

├── Loans

├── Investments

├── Statistics

└── Reports
```

---

# Schema

```yaml
id:

companyId:

currency:

cashBalance:

reservedCash:

availableCash:

creditLimit:

loanIds:

investmentIds:

statistics:

createdAt:

updatedAt:

version:
```

---

# Feldbeschreibung

## id

Eindeutige Finance-ID.

Beispiel

```text
FINANCE-000001
```

---

## companyId

Besitzer.

---

## currency

Spielwährung.

Version 1

```text
GC
```

(Genesis Credits)

---

## cashBalance

Aktueller Kontostand.

Berechnet.

---

## reservedCash

Reservierter Geldbetrag.

Beispiele

- Gebäude im Bau
- Marktgebote
- Verträge

---

## availableCash

```
cashBalance

-

reservedCash
```

Wird berechnet.

---

## creditLimit

Maximal möglicher Kredit.

Version 1

```text
0
```

---

## loanIds

Aktive Kredite.

```yaml
loanIds:
  - LOAN-001
```

---

## investmentIds

Aktive Investitionen.

Version 2.

---

## statistics

```yaml
totalIncome:

totalExpenses:

totalTaxes:

totalInterest:

highestBalance:

lowestBalance:

largestTransaction:
```

---

## createdAt

Erstellungsdatum.

---

## updatedAt

Letzte Änderung.

---

## version

Schema-Version.

---

# Beispiel

```yaml
id: FINANCE-000001

companyId: COMPANY-000001

currency: GC

cashBalance: 250000

reservedCash: 15000

availableCash: 235000

creditLimit: 50000

loanIds: []

investmentIds: []

statistics:
  totalIncome: 0

  totalExpenses: 0

  totalTaxes: 0

  totalInterest: 0

  highestBalance: 250000

  lowestBalance: 250000

  largestTransaction: 0

createdAt: 2026-07-01T08:00:00Z

updatedAt: 2026-07-01T08:00:00Z

version: 1
```

---

# Kontomodell

Version 1 besitzt ein Hauptkonto.

```
Genesis Credits

↓

Unternehmenskonto
```

Version 2 kann mehrere Konten unterstützen.

Beispiele

- Hauptkonto
- Investitionskonto
- Rücklagen
- Auslandskonto

---

# Geldreservierung

Bestimmte Aktionen reservieren Geld.

Beispiele

- Gebäudebau
- Marktgebote
- Ausschreibungen
- Langfristige Verträge

Reserviertes Geld steht nicht für andere Aktionen zur Verfügung.

---

# Kredite

Version 1

Kredite werden separat verwaltet.

Finance speichert ausschließlich Referenzen.

---

# Beziehungen

```
Finance

├── gehört zu → Company

├── besitzt → Finance Transactions

├── besitzt → Loans

├── besitzt → Investments

├── liefert → Statistiken
```

---

# Designregeln

✔ Jede Company besitzt genau ein Finance-Modul.

✔ Kontostände werden niemals direkt verändert.

✔ Alle Geldbewegungen erfolgen über Finance Transactions.

✔ Reserviertes Geld ist nicht verfügbar.

✔ Währung ist systemweit einheitlich.

✔ Finanzdaten gehören niemals zum Player.

---

# Erweiterbarkeit

Version 2

- Mehrere Konten
- Dividenden
- Investitionen
- Leasing
- Versicherungen

Version 3

- Aktienmarkt
- Unternehmensbewertungen
- Holding-Strukturen
- Fremdwährungen
- Internationale Banken

---

# Definition of Done

Ein Finance-Modul ist vollständig definiert, wenn:

- Besitzer gesetzt
- Währung definiert
- Kontostand initialisiert
- Reservierungen möglich
- Statistiken vorhanden
- Referenzen zu Krediten vorhanden

---

# Leitsatz

> "Geld ist eine Ressource mit eigener Buchhaltung."

Das Finance-Modul verwaltet den aktuellen finanziellen Zustand eines Unternehmens. Jede Veränderung wird ausschließlich über Finance Transactions dokumentiert.
