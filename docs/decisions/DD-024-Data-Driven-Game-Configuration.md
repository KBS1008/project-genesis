# DD-024 – Data-Driven Game Configuration

Status: Accepted

Version: 1.0

Datum: 2026-07-02

Authors:
- Project Genesis Architecture

---

# Zusammenfassung

Project Genesis verwendet eine vollständig datengetriebene Spielkonfiguration.

Spielinhalte werden **nicht im Quellcode definiert**, sondern in externen Konfigurationsdateien.

Die Spiellogik verarbeitet ausschließlich diese Daten.

Dadurch können neue Inhalte hinzugefügt oder bestehende angepasst werden, ohne den Programmcode ändern zu müssen.

---

# Kontext

In vielen Spielen werden Spielwerte direkt im Code definiert.

Beispiele:

- Gebäude
- Produktionsrezepte
- Forschung
- Ressourcen
- Marktparameter

Dies führt zu mehreren Problemen:

- Balancing erfordert Codeänderungen
- Neue Inhalte benötigen Entwickler
- Fehleranfälligkeit steigt
- Schlechte Erweiterbarkeit

Project Genesis soll langfristig wachsen und regelmäßig erweitert werden.

Deshalb wird eine datengetriebene Architektur gewählt.

---

# Entscheidung

Alle Spielinhalte werden in externen Konfigurationsdateien gespeichert.

Der Programmcode enthält ausschließlich die Spielmechanik.

Alle Werte werden beim Start geladen.

Die Simulation arbeitet ausschließlich mit den geladenen Daten.

---

# Architektur

```text
JSON / YAML Dateien

↓

Game Loader

↓

Game Database

↓

Simulation Engine

↓

Spielwelt
```

---

# Datengetriebene Systeme

Version 1

Folgende Systeme werden vollständig datengetrieben umgesetzt:

- Ressourcen
- Gebäude
- Rezepte
- Produktionsketten
- Forschung
- Marktparameter
- Startbedingungen
- Wartungskosten
- Energieverbrauch

---

# Beispiel

Gebäude werden nicht programmiert.

Stattdessen beschreibt eine Konfigurationsdatei ihre Eigenschaften.

```yaml
id: sawmill

name: Sägewerk

constructionCost: 5000

energyConsumption: 40

employees: 10

maintenance: 25

productionRecipe: wood_planks
```

Die Simulationsengine verarbeitet diese Daten generisch.

---

# Vorteile

## Einfaches Balancing

Spielwerte können angepasst werden, ohne den Quellcode zu ändern.

---

## Erweiterbarkeit

Neue Inhalte entstehen durch neue Datensätze.

Die Simulationsengine bleibt unverändert.

---

## Modding

Die Architektur ermöglicht später:

- Community-Mods
- eigene Gebäude
- neue Ressourcen
- neue Produktionsketten

ohne Änderungen am Kernsystem.

---

## Testbarkeit

Balancing-Tests können mit unterschiedlichen Datensätzen durchgeführt werden.

---

## Wartbarkeit

Spielmechanik und Spielinhalte bleiben sauber getrennt.

---

# Datenformate

Version 1

Interne Speicherung:

JSON

Optional:

YAML als Autorenformat

Beim Build-Prozess können YAML-Dateien automatisch nach JSON konvertiert werden.

---

# Validierung

Alle Konfigurationsdateien werden beim Laden validiert.

Geprüft werden:

- Pflichtfelder
- Datentypen
- Referenzen
- eindeutige IDs
- Versionskompatibilität

Fehlerhafte Datensätze verhindern den Spielstart.

---

# Auswirkungen

Diese Entscheidung betrifft nahezu alle Systeme.

Insbesondere:

- Resources
- Buildings
- Production
- Recipes
- Research
- Market
- Energy
- Simulation

---

# Versionierung

Jede Konfigurationsdatei besitzt eine Versionsnummer.

Beispiel:

```yaml
version: 1
```

Dadurch können spätere Migrationen automatisiert werden.

---

# Konsequenzen

## Vorteile

✔ Sehr einfache Erweiterbarkeit

✔ Schnelles Balancing

✔ Saubere Trennung von Daten und Logik

✔ Mod-Unterstützung möglich

✔ Weniger Quellcode

✔ Gute Testbarkeit

---

## Nachteile

- Zusätzlicher Loader erforderlich
- Validierung notwendig
- Fehler können bereits in Konfigurationsdateien entstehen

Diese Nachteile werden bewusst akzeptiert.

---

# Verworfene Alternative

Alle Spielwerte direkt im Quellcode.

Diese Lösung wurde verworfen aufgrund von:

- schlechter Wartbarkeit
- hoher Entwicklungsaufwand
- schwieriges Balancing
- geringe Flexibilität

---

# Implementierungshinweise

Beim Serverstart:

1. Konfigurationsdateien laden
2. Validieren
3. Referenzen auflösen
4. In den Game Data Cache übernehmen
5. Simulation starten

Während des Spielbetriebs werden ausschließlich die geladenen Daten verwendet.

Direkte Dateizugriffe während der Simulation finden nicht statt.

---

# Related Decisions

- DD-018 – Multi-Layer Market Architecture
- DD-020 – Dynamic Workforce Allocation
- DD-021 – Unified Building Capacity Model
- DD-022 – Abstract Logistics Network
- DD-023 – Company Progression Without Player Levels

---

# Affected Documents

- resources.md
- buildings.md
- production.md
- recipes.md
- research.md
- market.md
- simulation.md

---

# Langfristige Vision

Ab Version 3 können Inhalte vollständig über sogenannte Content Packs erweitert werden.

Ein Content Pack kann beispielsweise enthalten:

- neue Gebäude
- neue Ressourcen
- neue Produktionsketten
- neue Technologien
- neue Spielmodi

Dadurch entsteht eine modulare Architektur, die sowohl offizielle Erweiterungen als auch Community-Inhalte unterstützt.

---

# Leitsatz

> "Die Spielmechanik kennt keine Inhalte – sie kennt nur Daten."

Project Genesis trennt konsequent zwischen Spiellogik und Spielinhalten. Dadurch entsteht eine flexible, wartbare und langfristig erweiterbare Architektur, die schnelles Balancing, Modding und zukünftige Erweiterungen ermöglicht.