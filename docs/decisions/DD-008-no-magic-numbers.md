---
Document-ID: DD-008
Title: No Magic Numbers
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
  - architecture/technology-stack.md
  - gameplay/economy.md
  - gameplay/production.md
  - gameplay/market.md
  - gameplay/energy.md
  - gameplay/research.md

Related Decisions:
  - DD-004 – Common Schema
  - DD-024 – Data-Driven Game Configuration
  - DD-030 – Configuration-Driven Game Content
  - DD-031 – Game Content Organization

Affected Components:
  - Simulation Engine
  - Game Content
  - Configuration System
  - Content Loader
  - All Gameplay Systems

Tags:
  - architecture
  - configuration
  - balancing
  - maintainability
---

# DD-008 – No Magic Numbers

## Status

**Accepted**

---

# Zusammenfassung

Spielmechanische Konstanten dürfen nicht im Quellcode fest kodiert werden.

Alle Werte, die das Gameplay beeinflussen, werden aus Konfigurationsdateien geladen und können ohne Codeänderung angepasst werden.

---

# Motivation

Project Genesis verfolgt einen vollständig datengetriebenen Architekturansatz.

Balancing soll möglich sein, ohne:

- den Code zu ändern
- neu zu kompilieren
- Systeme umzuschreiben

Dadurch werden Wartbarkeit, Modding und langfristige Weiterentwicklung erheblich verbessert.

---

# Problem

Fest codierte Werte führen zu:

- verstecktem Balancing
- schwer nachvollziehbarem Verhalten
- hohem Wartungsaufwand
- unnötigen Releases für Balance-Anpassungen

Beispiel:

```typescript
const energyConsumption = 25;
```

Der Wert ist weder dokumentiert noch außerhalb des Codes anpassbar.

---

# Entscheidung

Alle gameplayrelevanten Zahlen werden aus Content-Dateien oder zentralen Konfigurationsdateien geladen.

Der Anwendungscode enthält ausschließlich Berechnungslogik.

---

# Beispiele

Nicht erlaubt:

```typescript
const TAX_RATE = 0.18;
```

```typescript
factory.capacity = 120;
```

```typescript
market.price *= 1.08;
```

---

Erlaubt:

```typescript
factory.capacity = building.capacity;
```

```typescript
taxRate = economyConfig.taxRate;
```

```typescript
price *= marketConfig.priceAdjustmentFactor;
```

---

# Gültige Quellen

Spielwerte stammen ausschließlich aus:

```text
game-content/

resources/
recipes/
buildings/
market/
research/
employees/
energy/
transport/
regions/
```

oder

```text
config/
```

für technische Konfigurationen.

---

# Ausnahmen

Folgende Werte dürfen im Code verbleiben:

- mathematische Konstanten (`PI`, `E`)
- Sprachkonstanten
- technische Limits (z. B. Arraygrößen)
- Framework-Konfigurationen

Diese Werte beeinflussen nicht das Gameplay.

---

# Balancing

Folgende Werte sind grundsätzlich konfigurierbar:

- Produktionszeiten
- Baukosten
- Energieverbrauch
- Lagerkapazitäten
- Transportkosten
- Forschungskosten
- Marktparameter
- Steuersätze
- Wartungskosten
- Mitarbeitergehälter
- Emissionswerte
- Startkapital
- Kreditkonditionen

---

# Beziehung zu anderen Systemen

## Content Loader

Lädt sämtliche Spielparameter.

---

## Simulation Engine

Verwendet ausschließlich geladene Konfigurationswerte.

---

## Market System

Preisparameter stammen vollständig aus Konfigurationsdateien.

---

## Production System

Produktionsparameter werden ausschließlich aus Rezept- und Gebäudedaten gelesen.

---

## Research System

Kosten und Freischaltungen werden vollständig datengetrieben definiert.

---

# Validierung

Beim Laden werden geprüft:

- fehlende Werte
- ungültige Wertebereiche
- negative Werte (falls unzulässig)
- doppelte Definitionen
- Datentypen

Ungültige Konfigurationen verhindern den Start.

---

# Vorteile

- Einfaches Balancing
- Keine versteckten Spielwerte
- Klare Verantwortlichkeiten
- Höhere Wartbarkeit
- Bessere Testbarkeit
- Modding-Unterstützung
- Schnellere Iteration

---

# Nachteile

- Größere Konfigurationsdateien
- Zusätzlicher Validierungsaufwand

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternativen

## Konstanten im Code

Verworfen.

Grund:

Gameplay-Werte wären schwer auffindbar und nur durch Codeänderungen anpassbar.

---

## Gemischter Ansatz

Verworfen.

Grund:

Unklare Verantwortlichkeiten und inkonsistentes Balancing.

---

# Implementierung

```text
game-content/
    resources/
    recipes/
    buildings/
    economy/
    market/
    research/
    transport/

config/
    simulation.yaml
    economy.yaml

src/
    content/
        ContentLoader.ts
        ConfigurationService.ts
```

---

# Hinweise für Cursor AI

Beim Implementieren gelten folgende Regeln:

- Gameplay-Werte dürfen nicht im Code definiert werden.
- Neue Systeme müssen ihre Parameter aus Konfigurationsdateien beziehen.
- Pull Requests mit neuen Magic Numbers sind abzulehnen.
- Änderungen am Balancing erfolgen ausschließlich über Content oder Konfiguration.

---

# Qualitätsziele

Diese Entscheidung unterstützt:

- Wartbarkeit
- Erweiterbarkeit
- Modding
- Testbarkeit
- Nachvollziehbarkeit
- Datengetriebenes Design

---

# Risiken

Mögliche Risiken:

- unvollständige Konfigurationen
- fehlerhafte Standardwerte
- Versionskonflikte bei Mods

Diese Risiken werden durch Schema-Validierung, Standardkonfigurationen und automatisierte Tests minimiert.

---

# Änderungsprotokoll

| Version | Datum | Änderung |
|----------|--------|----------|
| 1.0.0 | 2026-07-03 | Erste Version |
| 2.0.0 | 2026-07-03 | Überarbeitung entsprechend der aktuellen Architektur |

---

# Leitsatz

> **„Der Code beschreibt das Verhalten – die Daten bestimmen das Spiel.“**

Gameplay-relevante Werte gehören nicht in den Quellcode. Durch die konsequente Trennung von Logik und Konfiguration bleibt Project Genesis flexibel, leicht balancierbar und langfristig wartbar.