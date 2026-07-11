# Market Schema

> Definiert das Marktmodul eines Unternehmens in Project Genesis.

Version: 1.0

------------------------------------------------------------------------

# Zweck

Das Market-Modul verwaltet die Marktidentität und Handelsaktivitäten
einer Company.

Es speichert **keine einzelnen Kauf- oder Verkaufsaufträge**, sondern
Referenzen und Statistiken.

------------------------------------------------------------------------

# Grundprinzip

``` text
Company
    │
    ▼
Market
    ├── Market Orders
    ├── Order History
    ├── Trading Statistics
    └── Reputation
```

------------------------------------------------------------------------

# Schema

``` yaml
id:
companyId:
marketStatus:
reputation:
activeOrderIds:
completedOrderIds:
statistics:
settings:
createdAt:
updatedAt:
version:
```

------------------------------------------------------------------------

# Feldbeschreibung

## id

Eindeutige Markt-ID.

## companyId

Referenz auf die Company.

## marketStatus

``` text
ACTIVE
SUSPENDED
LOCKED
```

## reputation

Unternehmensruf am Markt.

Bereich:

``` text
0 - 100
```

Version 1 dient dieser Wert nur Statistiken und NPC-Systemen.

## activeOrderIds

Liste aller offenen Marktaufträge.

## completedOrderIds

Historie abgeschlossener Marktaufträge.

Version 1 kann die Historie zeitlich begrenzt werden.

## statistics

``` yaml
ordersCreated:
ordersCompleted:
totalBought:
totalSold:
totalRevenue:
totalExpenses:
highestTrade:
```

## settings

``` yaml
autoAcceptContracts:
marketNotifications:
favoriteResources:
```

## createdAt

UTC-Zeitpunkt der Erstellung.

## updatedAt

UTC-Zeitpunkt der letzten Änderung.

## version

Schema-Version.

------------------------------------------------------------------------

# Beziehungen

``` text
Market

├── gehört zu → Company

├── besitzt → Market Orders

├── erzeugt → Market Transactions

├── liefert → Marktstatistiken

└── nutzt → Order Book
```

------------------------------------------------------------------------

# Designregeln

-   Eine Company besitzt genau ein Market-Modul.
-   Marktpreise werden **nicht** im Market gespeichert.
-   Kauf- und Verkaufsaufträge liegen in `MarketOrder`.
-   Preisverläufe gehören zum `OrderBook`.
-   Handelsstatistiken werden kontinuierlich aktualisiert.

------------------------------------------------------------------------

# Erweiterbarkeit

## Version 2

-   Handelslizenz
-   Automatische Handelsregeln
-   Favorisierte Handelspartner

## Version 3

-   Internationale Märkte
-   Börsenplätze
-   Unternehmensbewertungen

------------------------------------------------------------------------

# Definition of Done

Das Market-Modul ist vollständig definiert, wenn:

-   Company verknüpft
-   Status gesetzt
-   Reputation initialisiert
-   Statistiken vorhanden
-   Einstellungen vorhanden

------------------------------------------------------------------------

# Leitsatz

> "Der Markt kennt den Händler -- nicht seine Lagerbestände."

Das Market-Modul repräsentiert die Handelsaktivität einer Company.
Einzelne Orders und Preisbildung werden in separaten Modellen verwaltet.
