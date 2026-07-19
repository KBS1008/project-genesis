---
Document-ID: DD-030
Title: Configuration-Driven Game Content
Type: Architecture Decision Record
Status: Accepted
Version: 1.0.0
Created: 2026-07-03
Last Updated: 2026-07-03

Authors:
  - Project Genesis Architecture

Reviewers:
  - TBD

Related Documents:
  - ARCH-002 (SAD.md)
  - ARCH-003 (DDD.md)
  - ARCH-004 (technology-stack.md)

Related Decisions:
  - DD-024 – Data-Driven Game Configuration
  - DD-025 – ECS Inspired Simulation Architecture
  - DD-027 – Event-Driven Simulation Architecture
  - DD-029 – Modular Monolith Architecture

Affected Components:
  - Simulation Engine
  - Content Loader
  - Configuration System
  - Building Module
  - Production Module
  - Research Module
  - Market Module

Tags:
  - architecture
  - configuration
  - data-driven
  - balancing
---

# DD-030 – Configuration-Driven Game Content

## Status

**Accepted**

---

# Zusammenfassung

Alle Spielinhalte werden ausschließlich über Konfigurationsdateien definiert.

Der Programmcode enthält keine Spielwerte, Produktionsrezepte, Gebäude, Technologien oder Marktparameter.

Die Simulation interpretiert lediglich die Konfigurationen.

---

# Motivation

Ein Wirtschaftsspiel entwickelt sich ständig weiter.

Regelmäßig werden:

- neue Gebäude
- neue Produkte
- neue Technologien
- neue Industrien
- neue Balancing-Werte

hinzugefügt oder angepasst.

Diese Änderungen dürfen keine Anpassungen am Quellcode erfordern.

---

# Problem

Werden Spielwerte im Code hinterlegt, entstehen:

- häufige Codeänderungen
- unnötige Releases
- schwieriges Balancing
- höheres Fehlerrisiko
- eingeschränkte Erweiterbarkeit

---

# Entscheidung

Spielinhalte werden vollständig datengetrieben definiert.

Die Simulationsengine verarbeitet ausschließlich Konfigurationsdaten.

---

# Architektur

```text
JSON / YAML

↓

Content Loader

↓

Validation

↓

Game Registry

↓

Simulation Engine

↓

Gameplay
```

---

# Grundprinzip

Der Code beschreibt **wie** das Spiel funktioniert.

Die Konfigurationsdateien beschreiben **was** im Spiel existiert.

---

# Konfigurierbare Inhalte

## Ressourcen

Beispiele:

- Holz
- Stahl
- Kunststoff
- Elektronik
- Wasser
- Energie

---

## Gebäude

Konfigurierbar sind:

- Baukosten
- Bauzeit
- Größe
- Energiebedarf
- Kapazitäten
- Wartungskosten
- Freischaltungen

---

## Produktionsrezepte

Konfigurierbar sind:

- Eingaben
- Ausgaben
- Produktionsdauer
- Energiebedarf
- Mitarbeitende
- Voraussetzungen

---

## Technologien

Konfigurierbar sind:

- Forschungsdauer
- Kosten
- Voraussetzungen
- Freigeschaltete Inhalte

---

## Marktparameter

Konfigurierbar sind:

- Startpreise
- Preisgrenzen
- Nachfragefaktoren
- Angebotsfaktoren
- Marktvolatilität

---

## Mitarbeitende

Konfigurierbar sind:

- Berufsgruppen
- Qualifikationen
- Produktivität
- Gehälter
- Schulungskosten

---

## Energie

Konfigurierbar sind:

- Kraftwerke
- Brennstoffe
- Wirkungsgrade
- Emissionen
- Speicher

---

# Verzeichnisstruktur

```text
config/

resources/
buildings/
recipes/
research/
employees/
market/
energy/
transport/
companies/
world/
balancing/
```

---

# Content Loader

Der Content Loader lädt beim Serverstart alle Konfigurationen.

Ablauf:

```text
Dateien laden

↓

Schema validieren

↓

Referenzen prüfen

↓

Registry erzeugen

↓

Simulation starten
```

Startet die Validierung nicht erfolgreich, wird der Server nicht gestartet.

---

# Registry

Nach erfolgreichem Laden befinden sich sämtliche Inhalte in einer zentralen Registry.

Beispiel:

```text
GameRegistry

├── Resources
├── Buildings
├── Recipes
├── Technologies
├── Employees
├── MarketRules
└── EnergyRules
```

Die Registry ist während der Laufzeit schreibgeschützt.

---

# Validierung

Jede Konfigurationsdatei besitzt ein Schema.

Beispiele:

- Building.schema.json
- Recipe.schema.json
- Resource.schema.json
- Technology.schema.json

Ungültige Inhalte verhindern den Serverstart.

---

# Regeln

Konfigurationsdateien dürfen:

- keine Logik enthalten
- keine Berechnungen durchführen
- keine Skripte ausführen

Sie definieren ausschließlich Daten.

---

# Vorteile

- Kein Hardcoding
- Einfaches Balancing
- Neue Inhalte ohne Codeänderung
- Gute Testbarkeit
- Unterstützung für Mods und Erweiterungen
- Klare Trennung zwischen Inhalt und Logik

---

# Nachteile

- Höherer Initialaufwand
- Umfangreiche Validierung erforderlich
- Mehr Konfigurationsdateien

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Hardcodierte Inhalte

Verworfen.

Grund:

Schlechte Wartbarkeit und hoher Entwicklungsaufwand.

---

## Datenbank als Content-Quelle

Verworfen.

Grund:

Spielinhalte sollen versioniert, nachvollziehbar und im Repository gepflegt werden.

---

## Dynamische Skripte

Verworfen.

Grund:

Sicherheitsrisiken und schwer nachvollziehbares Verhalten.

---

# Implementierung

Projektstruktur:

```text
config/

resources/
buildings/
recipes/
research/
employees/
market/
energy/
transport/
world/

src/

content/

ContentLoader.ts
GameRegistry.ts
SchemaValidator.ts
ReferenceValidator.ts
```

---

# Hinweise für Cursor AI

Beim Erstellen neuer Features gelten folgende Regeln:

- Keine Spielwerte im Code hinterlegen.
- Neue Inhalte werden ausschließlich über Konfigurationsdateien definiert.
- Jede neue Konfigurationsdatei benötigt ein Schema.
- Jede Referenz wird beim Laden validiert.
- IDs sind stabil und eindeutig.
- Inhalte werden nach dem Laden schreibgeschützt behandelt.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Wartbarkeit
- Erweiterbarkeit
- Modding
- Balancing
- Testbarkeit
- Konsistenz

---

# Risiken

Mögliche Risiken:

- Fehlerhafte Konfigurationen
- Ungültige Referenzen
- Inkonsistente IDs

Diese Risiken werden durch Schema-Validierung, Referenzprüfung und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Der Code beschreibt die Regeln – die Konfiguration beschreibt die Welt."**

Project Genesis trennt konsequent zwischen Spiellogik und Spielinhalten. Sämtliche Inhalte werden über versionierte Konfigurationsdateien definiert und beim Serverstart validiert. Dadurch bleibt das Spiel langfristig wartbar, leicht erweiterbar und einfach zu balancieren.
