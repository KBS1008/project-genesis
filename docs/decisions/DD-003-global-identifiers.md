---
Document-ID: DD-003
Title: Global Identifiers
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
  - schemas/Building.schema.md
  - schemas/Company.schema.md
  - schemas/Player.schema.md
  - schemas/ResourceType.schema.md

Related Decisions:
  - DD-001 – Resource Graph
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content
  - DD-033 – Savegame and Persistence Strategy

Affected Components:
  - Content Loader
  - Savegame System
  - Simulation Engine
  - Repository Layer
  - Event Bus

Tags:
  - identifiers
  - ids
  - content
  - persistence
  - architecture
---

# DD-003 – Global Identifiers

## Status

**Accepted**

---

# Zusammenfassung

Alle dauerhaft referenzierbaren Objekte in Project Genesis besitzen einen global eindeutigen, stabilen Bezeichner (Global Identifier).

IDs sind Bestandteil der Datenmodelle und dienen als primäre Referenz zwischen Content, Simulation und Persistenz.

---

# Motivation

Das Projekt basiert auf einem datengetriebenen Content-System.

Gebäude, Ressourcen, Rezepte, Technologien und weitere Inhalte werden über Konfigurationsdateien definiert und müssen eindeutig referenzierbar sein.

Stabile IDs ermöglichen:

- konsistente Referenzen
- Savegame-Kompatibilität
- Modding
- Erweiterungen
- reproduzierbare Simulationen

---

# Problem

Namen oder Anzeigenamen sind keine geeigneten Schlüssel, da sie:

- lokalisiert werden können
- sich im Laufe der Entwicklung ändern
- nicht eindeutig sein müssen

Numerische Datenbank-IDs eignen sich ebenfalls nicht, da sie zwischen Installationen variieren können.

---

# Entscheidung

Alle fachlichen Objekte besitzen eine unveränderliche String-ID.

Diese ID wird in allen Referenzen verwendet.

---

# Beispiele

```yaml
resource:
  id: iron_ore

building:
  id: steel_mill

recipe:
  id: steel

technology:
  id: metallurgy

company:
  id: company_001
```

---

# Regeln

Eine ID:

- ist global eindeutig
- bleibt dauerhaft unverändert
- verwendet nur Kleinbuchstaben, Zahlen und Unterstriche
- enthält keine Leerzeichen
- wird niemals lokalisiert

---

# Verwendung

Globale IDs werden verwendet für:

- Ressourcen
- Gebäude
- Rezepte
- Technologien
- Unternehmen
- Spielstände
- Events
- Konfigurationen

---

# Referenzierung

Alle Beziehungen erfolgen ausschließlich über IDs.

Beispiel:

```yaml
recipe:
  id: steel

inputs:
  iron_plate: 2
  coal: 1

building: steel_mill
```

---

# Persistenz

Savegames speichern ausschließlich IDs.

Dadurch bleiben Spielstände auch nach Änderungen an Anzeigenamen oder Übersetzungen kompatibel.

---

# Modding

Mods dürfen neue IDs hinzufügen.

Bestehende IDs dürfen nicht überschrieben oder verändert werden.

Zur Vermeidung von Konflikten wird ein Präfix empfohlen.

Beispiel:

```text
base.steel_mill
my_mod.advanced_steel_mill
```

---

# Validierung

Beim Laden werden geprüft:

- doppelte IDs
- ungültige Zeichen
- fehlende Referenzen
- ungültige Namenskonventionen

Fehler verhindern den Start der Anwendung.

---

# Vorteile

- Eindeutige Referenzen
- Stabile Savegames
- Sichere Mod-Unterstützung
- Klare Datenbeziehungen
- Einfache Validierung

---

# Nachteile

- IDs müssen langfristig gepflegt werden
- Umbenennungen erfordern Migrationen

Diese Nachteile werden akzeptiert.

---

# Verworfene Alternativen

## Anzeigenamen als Schlüssel

Verworfen.

Grund:

Nicht stabil und nicht sprachunabhängig.

---

## Datenbank-IDs

Verworfen.

Grund:

Nicht reproduzierbar und installationsabhängig.

---

# Implementierung

```text
game-content/
resources/
buildings/
recipes/
technologies/

src/
common/
types/
EntityId.ts
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Alle Referenzen erfolgen über IDs.
- IDs sind unveränderlich.
- Anzeigenamen dürfen niemals als Schlüssel verwendet werden.
- Neue Content-Dateien müssen eindeutige IDs definieren.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Konsistenz
- Erweiterbarkeit
- Persistenz
- Modding
- Wartbarkeit

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Erste Version |
| 2.0.0 | 2026-07-03 | Überarbeitung gemäß aktueller Architektur |

---

# Leitsatz

> **„Jedes Objekt besitzt genau eine stabile Identität.“**

Globale Identifikatoren bilden die Grundlage für Referenzen zwischen Content, Simulation, Persistenz und Erweiterungen und gewährleisten eine konsistente, langlebige Datenbasis.