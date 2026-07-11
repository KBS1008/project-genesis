# Company Schema

> Definiert das Datenmodell eines Unternehmens in Project Genesis.

Version: 1.0

---

# Zweck

Die Company repräsentiert das Unternehmen eines Spielers.

Sie ist die zentrale wirtschaftliche Einheit des Spiels.

Alle wirtschaftlichen Aktivitäten gehören zur Company.

Der Player verwaltet lediglich den Account.

---

# Grundprinzip

```
Player
    │
    ▼
Company
    ├── Finance
    ├── Buildings
    ├── Inventory
    ├── Employees
    ├── Research
    ├── Contracts
    ├── Energy
    ├── Market
    ├── Statistics
    └── Headquarters
```

---

# Schema

```yaml
id:

ownerId:

name:

description:

status:

headquarters:

foundedAt:

companyLevel:

reputation:

financeId:

inventoryId:

researchId:

energyNetworkId:

marketProfileId:

buildingIds:

employeeIds:

contractIds:

statistics:

settings:

createdAt:

updatedAt:
```

---

# Feldbeschreibung

## id

Eindeutige Unternehmens-ID.

Beispiel

```text
COMPANY-000001
```

---

## ownerId

Referenz auf den Player.

---

## name

Firmenname.

Beispiel

```text
Genesis Industries
```

---

## description

Firmenbeschreibung.

Optional.

---

## status

```text
ACTIVE

VACATION

BANKRUPT

LIQUIDATED

BANNED
```

---

## headquarters

Referenz auf das Hauptgebäude.

```text
BUILDING-000001
```

---

## foundedAt

Gründungsdatum.

---

## companyLevel

Unternehmensstufe.

Version 1

```text
1
```

---

## reputation

Unternehmensruf.

Bereich

```text
0 - 100
```

Später wichtig für:

- Aufträge
- Investoren
- NPC-Verträge
- Sonderforschungen

---

## financeId

Referenz auf Finance.

---

## inventoryId

Referenz auf Inventory.

---

## researchId

Referenz auf Research.

---

## energyNetworkId

Referenz auf das Energienetz.

---

## marketProfileId

Referenz auf Marktdaten.

---

## buildingIds

Liste aller Gebäude.

```yaml
buildingIds:

- BUILDING-001

- BUILDING-002
```

---

## employeeIds

Liste aller Mitarbeiter.

---

## contractIds

Liste aller Verträge.

---

## statistics

```yaml
totalRevenue:

totalExpenses:

totalProduced:

totalSold:

researchCompleted:

buildingsConstructed:

employeesHired:

energyConsumed:
```

---

## settings

Unternehmenseinstellungen.

```yaml
autoResearch:

autoRepair:

autoProduction:

notifications:
```

---

## createdAt

Erstellungsdatum.

---

## updatedAt

Zeitpunkt der letzten Änderung.

---

# Beispiel

```yaml
id: COMPANY-000001

ownerId: PLAYER-000001

name: Genesis Industries

description: Nachhaltige Industrieproduktion.

status: ACTIVE

headquarters: BUILDING-000001

foundedAt: 2026-07-01T08:00:00Z

companyLevel: 1

reputation: 50

financeId: FINANCE-000001

inventoryId: INVENTORY-000001

researchId: RESEARCH-000001

energyNetworkId: ENERGY-000001

marketProfileId: MARKET-000001

buildingIds:

- BUILDING-000001

employeeIds: []

contractIds: []

statistics:

  totalRevenue: 0

  totalExpenses: 0

  totalProduced: 0

  totalSold: 0

  researchCompleted: 0

  buildingsConstructed: 1

  employeesHired: 0

  energyConsumed: 0

settings:

  autoResearch: false

  autoRepair: false

  autoProduction: true

  notifications: true

createdAt: 2026-07-01T08:00:00Z

updatedAt: 2026-07-01T08:00:00Z
```

---

# Beziehungen

```
Company

├── besitzt → Finance

├── besitzt → Inventory

├── besitzt → Buildings

├── besitzt → Employees

├── besitzt → Research

├── besitzt → Contracts

├── besitzt → Energy Network

├── besitzt → Market Profile

├── besitzt → Statistics

└── gehört zu → Player
```

---

# Verantwortlichkeiten

Die Company ist verantwortlich für:

- Unternehmensidentität
- Besitz von Gebäuden
- Besitz von Lagerbeständen
- Finanzverwaltung
- Forschung
- Energieversorgung
- Mitarbeiterverwaltung
- Vertragsverwaltung
- Unternehmensstatistiken

---

# Nicht Bestandteil der Company

Die Company enthält **keine Detaildaten**.

Folgende Informationen werden in eigenen Modellen gespeichert:

✘ Lagerpositionen

✘ Marktaufträge

✘ Produktionswarteschlangen

✘ Produktionsjobs

✘ Forschungsfortschritte

✘ Buchungen

✘ Gebäudeparameter

✘ Ressourcen

Die Company speichert lediglich Referenzen.

---

# Designregeln

✔ Eine Company gehört genau einem Player.

✔ Ein Player kann später mehrere Companies besitzen.

✔ Eine Company besitzt genau ein Inventory.

✔ Eine Company besitzt genau ein Finance-Modul.

✔ Eine Company besitzt genau ein Research-Modul.

✔ Alle wirtschaftlichen Objekte gehören genau einer Company.

✔ Gebäude kennen niemals den Player.

✔ Wirtschaftliche Daten gehören niemals direkt zum Player.

---

# Erweiterbarkeit

Version 2

- Tochtergesellschaften
- Beteiligungen
- Unternehmensfusionen
- Aktiengesellschaften
- Joint Ventures

Version 3

- Internationale Standorte
- Holding-Strukturen
- Konzernabschlüsse
- Franchise-System

---

# Definition of Done

Eine Company ist vollständig definiert, wenn:

- Besitzer vorhanden
- Firmenname gesetzt
- Hauptsitz definiert
- Finanzmodul erstellt
- Lager erstellt
- Forschungsmodul erstellt
- Unternehmensstatus gesetzt
- Statistiken initialisiert

---

# Leitsatz

> "Die Company ist das wirtschaftliche Herz von Project Genesis."

Alle Spielsysteme – Produktion, Forschung, Energie, Markt, Mitarbeiter und Logistik – arbeiten im Auftrag der Company.