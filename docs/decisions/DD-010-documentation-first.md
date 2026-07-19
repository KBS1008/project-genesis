---
Document-ID: DD-010
Title: Documentation First
Type: Architecture Decision Record
Status: Accepted
Version: 2.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - architecture/SAD.md
  - architecture/DDD.md
  - architecture/architecture-overview.md
  - architecture/technology-stack.md
  - gameplay/
  - schemas/

Related Decisions:
  - DD-003 – Global Identifiers
  - DD-004 – Common Schema
  - DD-008 – No Magic Numbers
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content

Affected Components:
  - Entire Project
  - Documentation
  - Development Workflow
  - CI/CD
  - AI-assisted Development

Tags:
  - documentation
  - workflow
  - architecture
  - quality
---

# DD-010 – Documentation First

## Status

**Accepted**

---

# Zusammenfassung

Project Genesis folgt einem **Documentation-First-Ansatz**.

Architektur, Domänenmodell, Gameplay-Regeln und Datenmodelle werden dokumentiert und abgestimmt, bevor mit ihrer Implementierung begonnen wird.

Die Dokumentation ist die verbindliche Referenz für Entwicklung, Tests und KI-gestützte Codegenerierung.

---

# Motivation

Project Genesis ist ein langfristig angelegtes Simulationsprojekt mit:

- zahlreichen Spielsystemen
- komplexen Wechselwirkungen
- datengetriebener Architektur
- langfristiger Wartung
- Unterstützung für KI-gestützte Entwicklung

Eine gemeinsame Dokumentationsbasis reduziert Missverständnisse und erleichtert spätere Erweiterungen.

---

# Problem

Ein "Code First"-Ansatz führt häufig zu:

- inkonsistenten Architekturen
- widersprüchlichen Datenmodellen
- unklaren Verantwortlichkeiten
- aufwändigen Refactorings
- Wissensverlust

Besonders bei großen Projekten entstehen technische Schulden bereits in frühen Entwicklungsphasen.

---

# Entscheidung

Neue Features werden grundsätzlich in folgender Reihenfolge entwickelt:

1. Gameplay-Konzept
2. Architekturentscheidung (ADR), falls erforderlich
3. Datenmodell (Schema)
4. Dokumentation
5. Implementierung
6. Tests
7. Optimierung

---

# Dokumentationsstruktur

Die Projektdokumentation ist in klar abgegrenzte Bereiche unterteilt.

```text
docs/

architecture/
    SAD.md
    DDD.md
    architecture-overview.md
    technology-stack.md

decisions/
    DD-000-Decision-Index.md
    DD-001...
    ...

gameplay/
    ...

schemas/
    ...

config/
    ...
```

Jeder Bereich besitzt eine klar definierte Verantwortung.

---

# Architektur als Referenz

Die Architektur definiert:

- Systemgrenzen
- Verantwortlichkeiten
- Datenflüsse
- Qualitätsziele
- Entwurfsprinzipien

Die Implementierung folgt diesen Vorgaben.

---

# Gameplay als Referenz

Gameplay-Dokumente definieren:

- Spielmechaniken
- Balancing
- Produktionsregeln
- Wirtschaft
- Forschung
- Transport
- Energie

Gameplay-Regeln werden nicht im Quellcode dokumentiert.

---

# Schemas als Referenz

Schemas definieren:

- Datenstrukturen
- Pflichtfelder
- Beziehungen
- Validierungsregeln

Sie bilden die Grundlage für Content Loader und Persistenz.

---

# Architecture Decision Records

Architekturentscheidungen dokumentieren:

- Problemstellung
- Entscheidung
- Motivation
- Alternativen
- Konsequenzen

ADRs dienen als langfristige Wissensbasis und Entscheidungsprotokoll.

---

# KI-gestützte Entwicklung

Die Dokumentation dient als primäre Wissensquelle für KI-Assistenten.

Werkzeuge wie Cursor oder ChatGPT sollen ihre Implementierungen auf Basis der vorhandenen Dokumentation erstellen und nicht auf Annahmen.

Die Reihenfolge lautet daher:

```text
Dokumentation
        ↓
Architektur
        ↓
Implementierung
        ↓
Tests
```

---

# Änderungen

Änderungen an der Implementierung, die Auswirkungen auf Architektur oder Gameplay haben, müssen zuerst in den entsprechenden Dokumenten beschrieben werden.

Code und Dokumentation dürfen nicht dauerhaft auseinanderlaufen.

---

# Vorteile

- Klare Architektur
- Weniger Refactorings
- Konsistente Implementierung
- Einheitliche Terminologie
- Höhere Wartbarkeit
- Bessere Zusammenarbeit
- Optimale Grundlage für KI-gestützte Entwicklung

---

# Nachteile

- Höherer Aufwand vor der Implementierung
- Zusätzliche Pflege der Dokumentation

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Code First

Verworfen.

Grund:

Architekturentscheidungen werden implizit im Code getroffen und sind schwer nachvollziehbar.

---

## Dokumentation nach der Implementierung

Verworfen.

Grund:

Dokumentation ist häufig unvollständig oder veraltet und verliert ihren Wert als Referenz.

---

# Implementierung

Der Documentation-First-Ansatz beeinflusst den Entwicklungsprozess, nicht den Anwendungscode.

Empfohlene Reihenfolge für neue Features:

```text
Gameplay
    ↓
ADR
    ↓
Schema
    ↓
Implementierung
    ↓
Tests
    ↓
Review
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Vor Beginn der Implementierung sind vorhandene Architektur- und Gameplay-Dokumente zu berücksichtigen.
- Neue Architekturentscheidungen werden als ADR dokumentiert.
- Datenmodelle werden vor ihrer Implementierung spezifiziert.
- Die Implementierung muss mit der Dokumentation übereinstimmen.
- Widersprüche zwischen Code und Dokumentation sind zu vermeiden.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Wartbarkeit
- Nachvollziehbarkeit
- Konsistenz
- Erweiterbarkeit
- Wissensmanagement
- KI-gestützte Entwicklung

---

# Risiken

Mögliche Risiken:

- veraltete Dokumentation
- zusätzlicher Pflegeaufwand
- Disziplin im Entwicklungsprozess erforderlich

Diese Risiken werden durch regelmäßige Reviews und die Verpflichtung zur gemeinsamen Pflege von Code und Dokumentation minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung                                                              |
| ------- | ---------- | --------------------------------------------------------------------- |
| 1.0.0   | 2026-07-03 | Erste Version                                                         |
| 2.0.0   | 2026-07-03 | Vollständige Überarbeitung entsprechend der aktuellen Projektstruktur |

---

# Leitsatz

> **„Die Dokumentation beschreibt das System – der Code setzt sie um.“**

Project Genesis wird nach dem Documentation-First-Prinzip entwickelt. Architektur, Gameplay und Datenmodelle werden vor ihrer Implementierung definiert und bilden die verbindliche Grundlage für Entwicklung, Tests und KI-gestützte Codegenerierung. Dadurch bleibt das Projekt über seinen gesamten Lebenszyklus konsistent, nachvollziehbar und wartbar.
