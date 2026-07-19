# Contributing Guide

> Project Genesis – Development Guidelines

Vielen Dank für deinen Beitrag zu **Project Genesis**.

Dieses Projekt verfolgt das Ziel, eine langfristig wartbare, modulare und KI-freundliche Codebasis zu schaffen.

Jeder Beitrag – ob von Menschen oder KI – sollte diesen Richtlinien folgen.

---

# Grundprinzipien

## Lesbarkeit vor Cleverness

Code wird häufiger gelesen als geschrieben.

Bevorzuge verständliche Lösungen gegenüber komplexen oder "smarten" Konstruktionen.

---

## Kleine Module

Eine Datei sollte möglichst nur eine Verantwortung besitzen.

Lieber:

- viele kleine Dateien

als

- wenige riesige Dateien.

---

## Keine Duplikate

Wiederhole keine Logik.

Nutze:

- Utility Functions
- Services
- Shared Components
- Helper Classes

---

## Erweiterbarkeit

Neue Features sollen bestehende Funktionen möglichst nicht verändern.

Bevorzuge:

Open for Extension

Closed for Modification

(SOLID-Prinzip)

---

## Keine Magic Numbers

Schlecht

```ts
productionTime = 240;
```

Gut

```ts
const DEFAULT_PRODUCTION_TIME = 240;
```

---

# Projektstruktur

```
apps/
    client/
    server/
    admin/

packages/
    ui/
    shared/
    database/
    config/
    types/

docs/

prompts/

scripts/
```

Neue Dateien gehören immer in das passende Modul.

---

# TypeScript

Immer

```ts
strict: true;
```

verwenden.

Keine Verwendung von

```ts
any;
```

Stattdessen

```ts
unknown;
```

oder passende Typen.

---

# Benennung

## Klassen

```ts
FactoryService;
MarketService;
PlayerRepository;
```

---

## Interfaces

```ts
Player;
Factory;
Building;
```

Keine Präfixe wie

```ts
IPlayer;
IFactory;
```

---

## Enums

```ts
BuildingType;

ResearchType;

MarketOrderType;
```

---

## Funktionen

camelCase

```ts
calculateProduction();

createFactory();

sellProducts();
```

---

## Konstanten

UPPER_SNAKE_CASE

```ts
MAX_STORAGE;

STARTING_MONEY;

DEFAULT_BUILD_TIME;
```

---

# Kommentare

Kommentare erklären

WARUM

nicht

WAS

Schlecht

```ts
// Add money

player.money += amount;
```

Gut

```ts
// Production income is added after maintenance
// to prevent temporary negative balances.
```

---

# Architektur

Business-Logik gehört niemals

- in React Components
- in Controller
- in API Routes

Business-Logik gehört ausschließlich in

Services.

---

# Backend

Controller

↓

Service

↓

Repository

↓

Database

---

# Frontend

Pages

↓

Components

↓

Hooks

↓

API

↓

Backend

---

# React Regeln

Komponenten sollen möglichst klein bleiben.

Eine React-Datei sollte idealerweise unter

300 Zeilen

bleiben.

---

Komponenten besitzen genau eine Aufgabe.

---

Hooks enthalten Logik.

Komponenten enthalten Darstellung.

---

# Styling

TailwindCSS

Keine Inline Styles.

Keine CSS-Dateien, sofern Tailwind ausreicht.

---

# API

REST für CRUD.

WebSockets für Live-Daten.

API-Endpunkte verwenden ausschließlich

Plural.

Beispiele

```
/players

/factories

/orders

/research
```

Nicht

```
/player

/factory
```

---

# Datenbank

Prisma ORM

Alle Migrationen werden versioniert.

Keine manuellen Änderungen an produktiven Tabellen.

---

# Fehlerbehandlung

Keine leeren

catch-Blöcke.

Schlecht

```ts
catch {}
```

Gut

```ts
catch(error){
 logger.error(error);
 throw error;
}
```

---

# Logging

Verwende strukturierte Logs.

Keine

```ts
console.log();
```

im produktiven Code.

---

# Testing

Jedes Service besitzt Unit Tests.

Wichtige Spielmechaniken besitzen Integration Tests.

---

# Performance

Vermeide:

- unnötige Datenbankabfragen
- doppelte Berechnungen
- tiefe Verschachtelungen

Nutze

Caching

wenn sinnvoll.

---

# Git Workflow

Branch-Namen

```
feature/market

feature/research

feature/factories

bugfix/login

refactor/database
```

---

Commit Messages

```
feat:

fix:

refactor:

docs:

test:

style:

chore:
```

Beispiel

```
feat: implement production queue

fix: correct storage calculation

docs: update economy specification
```

---

# Pull Requests

Jeder Pull Request sollte

- ein Ziel besitzen
- möglichst klein sein
- dokumentiert sein
- Tests bestehen

---

# Dokumentation

Neue Features benötigen immer:

- Dokumentation
- API-Beschreibung
- Datenmodell
- Balancing-Regeln (falls relevant)

---

# Sicherheit

Keine Geschäftslogik im Frontend.

Alle Berechnungen erfolgen ausschließlich auf dem Server.

Frontend dient nur der Darstellung.

---

# KI-Unterstützung

Dieses Projekt wird gemeinsam mit Cursor AI entwickelt.

KI-generierter Code muss:

- verständlich sein
- typisiert sein
- dokumentiert sein
- getestet sein
- den Projektregeln entsprechen

---

# Definition of Done

Ein Feature gilt erst als abgeschlossen, wenn:

- Code geschrieben wurde
- Tests erfolgreich sind
- Dokumentation aktualisiert wurde
- TypeScript fehlerfrei kompiliert
- ESLint keine Fehler meldet
- Prettier erfolgreich ausgeführt wurde
- keine TODOs mehr vorhanden sind

---

# Motto

> Gute Software entsteht nicht durch möglichst viel Code.

> Gute Software entsteht durch gute Architektur.
