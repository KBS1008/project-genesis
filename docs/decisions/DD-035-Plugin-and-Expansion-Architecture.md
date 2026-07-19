---
Document-ID: DD-035
Title: Plugin and Expansion Architecture
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
  - DD-030 – Configuration-Driven Game Content
  - DD-031 – Game Content Organization
  - DD-032 – Deterministic Tick Processing

Affected Components:
  - Game Content System
  - Simulation Engine
  - Content Loader
  - Registry System
  - Modding System
  - Expansion System

Tags:
  - architecture
  - plugins
  - mods
  - dlc
  - extensibility
---

# DD-035 – Plugin and Expansion Architecture

## Status

**Accepted**

---

# Zusammenfassung

Project Genesis unterstützt eine **Plugin- und Expansion-Architektur**.

Das bedeutet:

- Neue Inhalte können als Module hinzugefügt werden
- DLCs können unabhängig vom Core-System entwickelt werden
- Mods können Spielinhalte erweitern oder überschreiben
- Der Core bleibt unverändert stabil

---

# Motivation

Ein langfristig erfolgreiches Wirtschaftsspiel benötigt Erweiterbarkeit:

Typische Erweiterungen:

- neue Industriezweige
- neue Ressourcen
- neue Produktionsketten
- neue Szenarien
- neue Spielmodi
- Balancing-Overhauls
- Community Mods

Ohne eine klare Architektur müssten solche Erweiterungen direkt im Core-Code erfolgen.

---

# Problem

Ohne Plugin-System entstehen:

- starke Kopplung zwischen Core und Erweiterungen
- schwer wartbare Codebasen
- riskante Updates
- Konflikte zwischen Erweiterungen
- kaum Modding-Support

---

# Entscheidung

Project Genesis verwendet ein **Content-basiertes Plugin-System**.

Plugins dürfen:

- neue Inhalte hinzufügen
- bestehende Inhalte erweitern
- bestehende Inhalte überschreiben (mit Regeln)

Plugins dürfen nicht:

- Core-Logik verändern
- Simulation Engine verändern
- Tick-System verändern

---

# Architektur

```text
Core Game

│
├── Base Game Content
│
├── DLC Modules
│
├── Community Mods
│
└── Loaded Game Registry
```

---

# Plugin-Struktur

```text
game-content/

base/

dlc/

mods/

community/
```

Jeder dieser Bereiche ist ein Plugin-Container.

---

# Plugin-Typen

## Base Game

- Standardspielinhalt
- immer geladen
- unveränderlich im Design

---

## DLC

- offizielle Erweiterungen
- können neue Systeme hinzufügen
- können Balancing erweitern

---

## Mods

- Community-Inhalte
- optional
- können Inhalte überschreiben

---

# Content Override System

Plugins können Inhalte überschreiben über:

### Prioritätssystem

```text
base < dlc < mods
```

---

### Beispiel

```text
building.steel-mill (base)

↓

building.steel-mill (dlc1 override)

↓

building.steel-mill (mod override)
```

Das System wählt immer die höchste Priorität.

---

# Content Isolation

Jedes Plugin besitzt:

- eigene Namespace-Präfixe
- eigene IDs
- eigene Assets

Beispiel:

```text
base.building.steel-mill

dlc.industry.advanced-mill

mod.user123.super-mill
```

---

# Registry Integration

Alle Inhalte werden beim Start in die GameRegistry geladen.

Ablauf:

```text
Load Base Content

↓

Load DLC Content

↓

Load Mods

↓

Resolve Conflicts

↓

Validate Registry

↓

Start Simulation
```

---

# Validierung

Beim Laden werden geprüft:

- doppelte IDs
- ungültige Referenzen
- Zyklusabhängigkeiten
- fehlende Basiselemente

Fehlerhafte Plugins verhindern optional den Start oder werden deaktiviert.

---

# API für Plugins

Plugins können sich registrieren über:

```text
PluginManifest
```

Beispiel:

```yaml
id: mod.super-industries
version: 1.0.0

dependencies:
  - base-game >= 1.0.0

content:
  - buildings/
  - recipes/
  - technologies/
```

---

# Modding Regeln

Mods dürfen:

- neue Ressourcen hinzufügen
- neue Gebäude hinzufügen
- neue Rezepte definieren
- bestehende Inhalte erweitern

Mods dürfen nicht:

- Simulation Engine verändern
- Tick-Logik ändern
- Event System ersetzen

---

# DLC Regeln

DLCs dürfen zusätzlich:

- neue Systeme einführen
- neue Simulation Module aktivieren
- neue Event-Typen definieren (innerhalb des Systems)

---

# Konfliktlösung

Wenn mehrere Plugins denselben Inhalt definieren:

```text
1. Mods
2. DLCs
3. Base Game
```

Priorität entscheidet.

---

# Vorteile

- Maximale Erweiterbarkeit
- Modding-fähig
- Zukunftssicher
- Klare Trennung Core vs Content
- DLC-fähig ohne Core-Änderung
- Community Integration möglich

---

# Nachteile

- Komplexere Content-Resolution
- Potenzielle Konflikte zwischen Mods
- Höhere Validierungsanforderungen

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Kein Modding

Verworfen.

Grund:

Keine langfristige Community-Erweiterbarkeit.

---

## Hardcoded DLCs

Verworfen.

Grund:

Erfordert Core-Änderungen für jede Erweiterung.

---

## Externe Script-Engine (Lua etc.)

Verworfen für Version 1.

Grund:

Sicherheits- und Performance-Risiken.

---

# Implementierung

```text
content-loader/

PluginLoader.ts
ContentResolver.ts
ConflictResolver.ts
RegistryBuilder.ts
PluginValidator.ts
```

---

# Hinweise für Cursor AI

Beim Erstellen neuer Inhalte gelten folgende Regeln:

- Jede Erweiterung muss als Plugin strukturiert sein.
- Core-System darf nicht verändert werden.
- Inhalte werden immer über die Registry geladen.
- Konflikte werden über Priorität gelöst.
- IDs müssen eindeutig und namespaced sein.
- Plugins müssen validierbar und deaktivierbar sein.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Erweiterbarkeit
- Modding
- Stabilität
- Wartbarkeit
- Zukunftssicherheit
- Community-Fähigkeit

---

# Risiken

Mögliche Risiken:

- Konflikte zwischen Mods
- Balancing-Inkonsistenzen
- Missbrauch durch Mod-Autoren

Diese Risiken werden durch Validierung, Sandbox-Regeln und Prioritätssysteme minimiert.

---

# Änderungsprotokoll

| Version | Datum      | Änderung         |
| ------- | ---------- | ---------------- |
| 1.0.0   | 2026-07-03 | Initiale Version |

---

# Leitsatz

> **"Der Kern bleibt unverändert – die Welt wächst darüber hinaus."**

Project Genesis trennt strikt zwischen Core-Engine und Erweiterungen. Durch ein plugin-basiertes Content-System können neue Inhalte, DLCs und Community-Mods integriert werden, ohne die Stabilität der Simulation zu gefährden.
