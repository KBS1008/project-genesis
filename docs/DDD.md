---
Document-ID: ARCH-003
Title: Database Design Document (DDD)
Type: Database Architecture
Status: Approved
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - SAD.md
  - architecture-overview.md

Related Decisions:
  - DD-021
  - DD-022
  - DD-023
  - DD-024
  - DD-025

Tags:
  - database
  - schema
  - persistence
  - architecture
---

# Database Design Document (DDD)

> Dieses Dokument beschreibt das logische und physische Datenmodell von **Project Genesis**.

---

# Inhaltsverzeichnis

1. Ziel
2. Architekturprinzipien
3. Datenbankübersicht
4. Domänenmodell
5. Entitäten
6. Beziehungen
7. Schlüsselkonzepte
8. Persistenzstrategie
9. Performance
10. Versionierung
11. Migrationen
12. Backup
13. Zukunft

---

# 1. Ziel

Das DDD definiert:

- sämtliche Domänenobjekte
- Beziehungen
- Datenbankprinzipien
- Persistenzstrategie
- Indexierung
- Namenskonventionen

Es bildet die Referenz für Backend, Datenbank und API.

---

# 2. Architekturprinzipien

Die Datenbank folgt folgenden Grundsätzen:

- Single Source of Truth
- Data Driven Design
- Normalize first
- Denormalize only for performance
- Immutable Transaction History
- Soft Deletes
- UUID als Primärschlüssel
- Server Authoritative

---

# 3. Datenbankübersicht

```text
Player
   │
   ├────────────┐
   ▼            ▼

Company     Statistics

   │

   ├───────────────┬──────────────┬─────────────┐
   ▼               ▼              ▼             ▼

Buildings     Inventory      Finance     Employees

   │               │              │             │
   ▼               ▼              ▼             ▼

Production   Transactions   Ledger      Assignments

   │
   ▼

Recipes

   │
   ▼

Resources

   │
   ▼

Market
```

---

# 4. Domänenmodell

## Player

Repräsentiert einen Benutzer.

Ein Player besitzt:

- genau ein Benutzerkonto
- mehrere Companies (zukünftig)
- Einstellungen
- Erfolge

---

## Company

Das zentrale Objekt des Spiels.

Eine Company besitzt:

- Gebäude
- Mitarbeitende
- Lager
- Produktion
- Finanzen
- Forschung
- Statistiken

---

## Building

Ein Gebäude besitzt:

- Typ
- Level
- Zustand
- Kapazitäten
- Energie
- Produktion

Alle Gebäude folgen DD-021.

---

## Employee

Mitarbeitende werden Unternehmen zugeordnet.

Eigenschaften:

- Qualifikation
- Kosten
- Zuweisung
- Produktivität

---

## Inventory

Speichert Ressourcen.

Besteht aus:

- Resource ID
- Menge
- Reservierung
- Lagerort

---

## Resource

Definition einer Ressource.

Eigenschaften:

- Kategorie
- Einheit
- Basispreis
- Stapelbarkeit

---

## Recipe

Produktionsvorschrift.

Besteht aus:

- Eingaben
- Ausgaben
- Dauer
- Energiebedarf

---

## Production

Aktiver Produktionsauftrag.

Speichert:

- Rezept
- Fortschritt
- Status

---

## Market

Marktinformationen.

Speichert:

- Preise
- Angebot
- Nachfrage
- Handelsvolumen

---

## Finance

Finanzstatus.

Speichert:

- Kontostand
- Gewinn
- Umsatz
- Bilanz

---

## FinanceTransaction

Unveränderliche Finanzbuchung.

---

## InventoryTransaction

Historie sämtlicher Materialbewegungen.

---

## Research

Fortschritt eines Unternehmens.

---

## Statistics

Aggregierte Unternehmensdaten.

---

# 5. Beziehungen

```text
Player

1

↓

n

Company

↓

1:n

Buildings

↓

1:n

Production

↓

1:1

Recipe

↓

n:m

Resources
```

Weitere Beziehungen:

```text
Company

├── Employees

├── Inventory

├── Finance

├── Research

└── Statistics
```

---

# 6. Schlüsselkonzepte

## UUID

Alle Hauptobjekte verwenden UUIDs.

Beispiel:

```
company_id

building_id

employee_id
```

---

## Soft Delete

Datensätze werden grundsätzlich nicht gelöscht.

Beispiel:

```
deleted_at
```

---

## Audit Felder

Jede Entität besitzt:

```
created_at

updated_at

created_by

updated_by
```

---

## Versionierung

Konfigurationsdaten besitzen zusätzlich:

```
version
```

---

# 7. Persistenzstrategie

## PostgreSQL

Speichert:

- Spieler
- Unternehmen
- Gebäude
- Produktion
- Finanzen
- Forschung

---

## Redis

Speichert:

- Sessions
- Cache
- Tickdaten
- Marktcache

---

## Object Storage

Speichert:

- Backups
- Logs
- Exporte

---

# 8. Performance

Grundregeln:

- passende Indizes
- Foreign Keys
- Batch Updates
- keine N+1 Queries
- Pagination

---

# 9. Namenskonventionen

Tabellen:

```
players

companies

buildings

employees

inventories

recipes

productions

resources

finance_transactions
```

Spalten:

```
snake_case
```

Primärschlüssel:

```
id
```

Fremdschlüssel:

```
company_id

player_id

building_id
```

---

# 10. Migrationen

Migrationen erfolgen ausschließlich versioniert.

Beispiel:

```
001_create_players

002_create_companies

003_create_resources
```

Migrationen dürfen niemals bestehende Daten zerstören.

---

# 11. Backup

Tägliche Backups.

Aufbewahrung:

- täglich
- wöchentlich
- monatlich

Backups werden automatisch getestet.

---

# 12. Zukunft

Geplante Erweiterungen:

- Mehrere Companies pro Spieler
- Regionen
- Holding-Strukturen
- Börse
- Internationale Märkte
- NPC-Unternehmen

Die Datenbankstruktur ist darauf vorbereitet.

---

# Referenz auf Schemas

Die detaillierten Datenmodelle befinden sich unter:

```
docs/schemas/

Building.schema.md

Company.schema.md

Player.schema.md

Inventory.schema.md

InventoryTransaction.schema.md

Finance.schema.md

FinanceTransaction.schema.md

Production.schema.md

ResourceType.schema.md
```

Weitere Schemas werden im Verlauf der Entwicklung ergänzt.

---

# Qualitätsziele

Die Datenbankarchitektur soll:

- wartbar sein
- performant sein
- leicht testbar sein
- migrationsfähig sein
- langfristig erweiterbar bleiben

---

# Änderungsprotokoll

| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Eine gute Datenbank bildet die Domäne ab – nicht den Programmcode."**

Project Genesis verwendet ein klar strukturiertes, normalisiertes und erweiterbares Datenmodell. Die Datenbank bildet die Grundlage für die gesamte Simulationsengine und ist konsequent auf langfristige Wartbarkeit, Performance und Erweiterbarkeit ausgelegt.
