# CURSOR_DEVELOPMENT_RULES.md

**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-18
**Owner:** Architecture Team

---

# Purpose

Dieses Dokument definiert die verbindlichen Entwicklungsregeln für alle Implementierungen innerhalb von **Project Genesis**.

Es dient als dauerhafte Arbeitsgrundlage für KI-gestützte Entwicklung (z. B. Cursor) und stellt sicher, dass neue Funktionen konsistent mit der definierten Architektur umgesetzt werden.

Diese Regeln gelten für:

- neue Features
- Refactorings
- Bugfixes
- Optimierungen
- Erweiterungen bestehender Systeme

---

# Guiding Principles

Jede Implementierung muss folgende Prioritäten einhalten:

1. Correctness
2. Determinism
3. Maintainability
4. Testability
5. Readability
6. Performance

Performance darf niemals auf Kosten von Korrektheit oder Architektur erreicht werden.

---

# Mandatory Architecture Documents

Vor jeder Implementierung sind die folgenden Dokumente als verbindliche Spezifikation zu berücksichtigen:

## Architecture

- ERROR_HANDLING_STRATEGY.md
- RESULT_PATTERN.md
- VALIDATION_STRATEGY.md
- DEPENDENCY_RULES.md
- PERFORMANCE_GUIDELINES.md
- LOGGING_STRATEGY.md
- TESTING_STRATEGY.md
- NAMING_CONVENTIONS.md

## Governance

- QUALITY_GATES.md
- QUALITY_METRICS.md
- TECHNICAL_DEBT_POLICY.md
- AUDIT_PROCESS.md

## Roadmap

- PROJECT_ROADMAP.md
- MILESTONE_PLAN.md
- RELEASE_STRATEGY.md

## Audit

- ARCHITECTURE_STANDARDS_SYNC.md
- AUD-002_IMPLEMENTATION_AUDIT.md

---

# Development Workflow

Jede Implementierung erfolgt nach folgendem Ablauf:

1. Anforderungen analysieren
2. Betroffene Module identifizieren
3. Vorhandene Komponenten prüfen
4. Architekturkonformität sicherstellen
5. Implementierung durchführen
6. Tests ergänzen oder anpassen
7. Dokumentation aktualisieren (falls erforderlich)
8. Implementation Report erstellen

---

# Reuse Before Create

Vor jeder neuen Klasse ist zu prüfen, ob bereits eine geeignete Implementierung existiert.

Insbesondere:

- Interface
- Port
- Adapter
- Repository
- Domain Service
- Application Service
- Value Object
- Result
- Domain Error
- Event
- Validator
- Mapper
- Utility

Bestehende Lösungen sind zu bevorzugen.

Doppelte Implementierungen sind zu vermeiden.

---

# Layer Responsibilities

## Domain

Enthält ausschließlich:

- Business Rules
- Entities
- Value Objects
- Domain Events
- Domain Services

Die Domain kennt keine Infrastruktur.

---

## Application

Verantwortlich für:

- Use Cases
- Orchestrierung
- Ports
- Commands
- Queries

Keine Geschäftslogik.

---

## Infrastructure

Implementiert:

- Adapter
- Persistence
- Logging
- externe Systeme

Keine fachlichen Entscheidungen.

---

## Presentation

Verantwortlich für:

- UI
- Eingaben
- Darstellung

Keine Business Rules.

---

# Dependency Rules

Erlaubte Abhängigkeitsrichtung:

Presentation

↓

Application

↓

Domain

Infrastructure implementiert ausschließlich Ports.

Direkte Infrastrukturabhängigkeiten innerhalb von Domain oder Application sind unzulässig.

---

# Error Handling

Erwartete Fehler werden über das Result Pattern behandelt.

Beispiel:

- Validation Errors
- Domain Errors
- Business Rule Violations

Unerwartete Fehler werden über die ProjectGenesisError-Hierarchie verarbeitet.

Unstrukturierte Exceptions sind zu vermeiden.

---

# Validation

Validierung erfolgt mehrstufig:

1. Input Validation
2. Application Validation
3. Domain Validation
4. Business Rules

Validation gehört nicht in die Infrastruktur.

---

# Logging

Ausschließlich strukturierte Logger verwenden.

Nicht erlaubt:

- console.log
- Debug-Ausgaben im Produktionscode
- unstrukturierte Logtexte

Log-Level müssen bewusst gewählt werden.

---

# Result Pattern

Erwartete Fehler werden niemals über Exceptions transportiert.

Alle neuen Use Cases verwenden konsequent Result<T>.

Result muss den definierten Architekturstandards entsprechen.

---

# Testing

Jede Implementierung benötigt angemessene Tests.

Mindestens:

- Happy Path
- Failure Path
- Validation
- Business Rules

Bei Bedarf zusätzlich:

- Integration Tests
- Architekturtests
- Regression Tests

Neue Funktionen ohne Tests gelten als unvollständig.

---

# Performance

Optimierungen erfolgen ausschließlich nach Messung.

Nicht zulässig:

- Premature Optimization
- versteckte Allokationen
- unnötige Komplexität

Lesbarkeit und Wartbarkeit besitzen Vorrang.

---

# Naming

Alle neuen Elemente folgen den Naming Conventions.

Insbesondere:

- Klassen
- Interfaces
- Events
- Commands
- Repositories
- Ports
- Services

Abweichungen sind zu vermeiden.

---

# Documentation

Neue Architekturentscheidungen müssen dokumentiert werden.

Implementierungsdetails ohne Architekturrelevanz benötigen keine neuen Architektur-Dokumente.

Bestehende Dokumentation ist bei Änderungen aktuell zu halten.

---

# Technical Debt

Neue technische Schulden sollen grundsätzlich vermieden werden.

Falls technische Schulden unvermeidbar sind, müssen sie:

- dokumentiert
- begründet
- priorisiert
- im Technical Debt Register erfasst

werden.

---

# Code Review Checklist

Vor Abschluss einer Aufgabe ist zu prüfen:

- Architektur eingehalten
- Dependency Rules eingehalten
- Naming korrekt
- Tests vorhanden
- Logging korrekt
- Validation korrekt
- Result Pattern verwendet
- Dokumentation aktuell
- Keine unnötigen Duplikate
- Keine offensichtlichen technischen Schulden

---

# Required Implementation Report

Nach jeder abgeschlossenen Aufgabe ist ein kurzer Bericht zu erstellen.

Der Bericht enthält mindestens:

- Ziel der Änderung
- betroffene Module
- geänderte Dateien
- neue Dateien
- gelöschte Dateien
- Tests
- Architekturentscheidungen
- offene Punkte
- bekannte Risiken
- technische Schulden
- Empfehlungen

---

# Success Criteria

Eine Implementierung gilt als abgeschlossen, wenn:

- Architekturstandards eingehalten sind
- Tests erfolgreich sind
- Dokumentation aktuell ist
- keine Layerverletzungen bestehen
- keine kritischen technischen Schulden entstanden sind
- der Implementation Report erstellt wurde

---

# Continuous Improvement

Dieses Dokument ist Bestandteil der Projekt-Governance.

Es wird nach:

- größeren Refactorings
- abgeschlossenen Audits
- Architekturentscheidungen
- Major Releases

überprüft und bei Bedarf aktualisiert.
