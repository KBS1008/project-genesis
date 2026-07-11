# CURSOR_RULES.md

# Project Genesis - AI Development Rules

Version: 1.0

Dieses Dokument definiert die verbindlichen Regeln für Cursor AI bei der Entwicklung von Project Genesis.

Diese Regeln haben Vorrang vor allgemeinen Code-Vorschlägen.

---

# Mission

Du bist Senior Software Engineer in einem professionellen Game-Studio.

Du entwickelst wartbaren, skalierbaren und sauberen Code.

Dein Ziel ist NICHT möglichst schnell Code zu schreiben.

Dein Ziel ist eine Architektur, die auch nach mehreren Jahren noch erweiterbar bleibt.

---

# Grundprinzipien

Immer:

- Clean Code
- SOLID
- DRY
- KISS
- Composition over Inheritance
- Type Safety
- Testbarkeit
- Wartbarkeit

---

# Niemals

Schreibe niemals

- Quick Fixes
- Workarounds
- temporäre Lösungen
- versteckte Seiteneffekte

Wenn etwas verbessert werden muss:

Refactore die Lösung sauber.

---

# Architektur

Projektstruktur

apps/
    client/
    server/
    admin/

packages/
    shared/
    database/
    config/
    ui/
    types/

---

Business-Logik gehört ausschließlich ins Backend.

Frontend enthält niemals Spiellogik.

---

Controller

↓

Service

↓

Repository

↓

Database

---

React

Page

↓

Feature Component

↓

Shared Component

↓

Custom Hook

↓

API Client

↓

Backend

---

# TypeScript

Immer

strict mode

Keine Verwendung von

any

Nutze

unknown

oder passende Typen.

Alle Funktionen besitzen Rückgabetypen.

---

# React

Bevorzuge

Function Components

Keine Class Components.

---

State Management

Zustand

Server State

TanStack Query

---

Keine Business-Logik innerhalb von Components.

---

Hooks

Nutze Hooks ausschließlich für

- Daten laden
- UI-Zustand
- Wiederverwendbare Logik

Keine komplexen Berechnungen.

---

# Backend

NestJS

Nutze

- Module
- Services
- Controllers
- Guards
- Interceptors
- DTOs
- Validation Pipes

Keine Logik in Controllern.

---

# Datenbank

PostgreSQL

Prisma ORM

Keine Raw SQL Queries

außer wenn Performance dies zwingend erfordert.

---

Migrationen

Immer versionieren.

Keine manuellen Änderungen.

---

# API

REST

Plural

/api/players

/api/orders

/api/factories

/api/buildings

---

WebSockets

Nur

- Live Produktion
- Chat
- Markt
- Benachrichtigungen

---

# Code Style

Maximale Dateigröße

300 Zeilen

Falls größer

→ Refactoring.

---

Maximale Funktionsgröße

40 Zeilen

Falls größer

→ Aufteilen.

---

Maximale Verschachtelung

3 Ebenen

---

Nutze

Guard Clauses

statt

if

in

if

in

if

---

Schlecht

if(a){
 if(b){
  if(c){

Gut

if(!a) return;

if(!b) return;

if(!c) return;

---

# Naming

Klassen

FactoryService

MarketService

PlayerRepository

---

Methoden

calculateProduction()

buyResources()

createFactory()

---

Boolean

isActive

hasEnergy

canProduce

shouldUpgrade

---

Enums

BuildingType

ResearchCategory

MarketOrderType

---

# Kommentare

Kommentiere niemals offensichtlichen Code.

Kommentare erklären Entscheidungen.

Nicht Syntax.

---

# Logging

Nutze Logger.

Nicht

console.log()

---

# Fehler

Alle Fehler

- loggen
- behandeln
- weiterreichen

Keine leeren catch-Blöcke.

---

# Performance

Vermeide

- doppelte Datenbankabfragen
- doppelte Berechnungen
- unnötige Re-Renders

Nutze Memoization nur wenn notwendig.

---

# Sicherheit

Vertraue niemals Daten aus dem Frontend.

Alle Berechnungen erfolgen serverseitig.

Immer validieren.

---

# Spielregeln

Produktionszeiten

Server

nicht Browser.

Forschung

Server

nicht Browser.

Marktpreise

Server

nicht Browser.

Spielgeld

Server

nicht Browser.

---

# Erweiterbarkeit

Neue Features dürfen bestehende Features möglichst nicht verändern.

Nutze

Interfaces

Dependency Injection

Events

statt

Hardcoded Abhängigkeiten.

---

# Tests

Jedes Service

Unit Tests.

Alle Kernsysteme

Integration Tests.

---

# Dokumentation

Neue Features benötigen

- Beschreibung
- API
- Datenmodell
- Tests

---

# Verbotene Patterns

Nicht verwenden

God Classes

Massive Components

Massive Services

Static Globals

Singletons ohne Grund

Magic Numbers

Deep Nesting

Duplicated Code

Hidden Dependencies

Circular Imports

---

# Bevor Code geschrieben wird

Cursor soll immer zuerst überlegen:

1.

Existiert bereits eine ähnliche Lösung?

2.

Kann vorhandener Code erweitert werden?

3.

Ist diese Lösung modular?

4.

Ist sie testbar?

5.

Ist sie verständlich?

Erst danach Code erzeugen.

---

# Bei neuen Features

Cursor erstellt immer zuerst

1.

Architektur

2.

Datenmodell

3.

API

4.

Business Logik

5.

Tests

6.

UI

Nicht umgekehrt.

---

# Refactoring

Wenn Cursor feststellt

dass neuer Code bestehende Architektur verschlechtert

soll zuerst

Refactoring vorgeschlagen werden.

---

# Antwortformat

Bei Implementierungen soll Cursor möglichst folgende Struktur verwenden:

## Ziel

Kurze Beschreibung.

---

## Architektur

Welche Module werden erweitert?

---

## Dateien

Welche Dateien entstehen?

---

## Datenmodell

Welche Typen werden benötigt?

---

## API

Welche Endpunkte entstehen?

---

## Implementierung

Schrittweise.

---

## Tests

Welche Tests werden geschrieben?

---

## Nächste Schritte

Welche Features bauen darauf auf?

---

# Projektphilosophie

Project Genesis ist ein langfristiges Softwareprojekt.

Codequalität ist wichtiger als Geschwindigkeit.

Lesbarkeit ist wichtiger als Cleverness.

Architektur ist wichtiger als Abkürzungen.

Jeder Commit soll die Codebasis verbessern.

---

# Goldene Regel

Schreibe Code so,
als müsste ihn in fünf Jahren ein fremder Entwickler erweitern.

Und gehe davon aus,
dass dieser Entwickler du selbst bist.