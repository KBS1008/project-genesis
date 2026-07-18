# Core Gameplay Start — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** Spielbeginn gemäß `core-gameplay.md`  
**Date:** 2026-07-18  
**Status:** Completed  

---

## Ziel

Neues Spiel (`startNewGame`) an die dokumentierte Kernspielschleife anbinden: Startkapital, kostenlose Startgebäude und Startressourcen laut `docs/gameplay/core-gameplay.md`.

---

## Betroffene Module

| Layer | Module |
|---|---|
| Domain | `FinanceConstants` (Startkapital) |
| Application | `StartNewGameUseCase`, `NewGameSetupConstants`, `GameSession` |
| Content | Neue Ressourcen- und Gebäudetypen |
| Tests | Use-Case-, Facade- und API-Tests |

---

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `src/domain/finance/FinanceConstants.ts` | `STARTING_MONEY`: 250_000 → 100_000 |
| `src/application/facade/GameSession.ts` | Delegation an `StartNewGameUseCase` |
| `src/application/facade/GameSession.test.ts` | Erwartungen für Starter-Setup |
| `apps/api/src/game/game.controller.test.ts` | Startkapital + Starter-Gebäude |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Status aktualisiert |

---

## Neue Dateien

| Datei | Beschreibung |
|---|---|
| `src/application/use-cases/StartNewGameUseCase.ts` | Orchestriert Firmengründung + Starter-Setup |
| `src/application/use-cases/StartNewGameUseCase.test.ts` | 3 Tests |
| `src/application/commands/StartNewGameCommand.ts` | Command-Typ |
| `src/application/new-game/NewGameSetupConstants.ts` | Starter-Gebäude, Ressourcen, Positionen |
| `game-content/resources/stone.yaml` | Ressource Stein |
| `game-content/buildings/headquarters.yaml` | Firmenzentrale |
| `game-content/buildings/power_substation.yaml` | Umspannwerk |
| `game-content/buildings/access_road.yaml` | Zufahrtsstraße |
| `docs/quality/CORE_GAMEPLAY_START_REPORT.md` | Dieser Bericht |

---

## Gelöschte Dateien

Keine.

---

## Tests

| Suite | Tests |
|---|---|
| `StartNewGameUseCase.test.ts` | Happy Path, Duplicate Company, Missing Building Type |
| `GameSession.test.ts` | Angepasst für 4 Starter-Gebäude, Energie, Lager-Logistik |
| `game.controller.test.ts` | 100_000 Credits, 4 Gebäude nach Session-Start |

```text
Test Files:  76 passed
Tests:       324 passed
Typecheck:   passed (root, api, web)
```

---

## Architekturentscheidung

- **`StartNewGameUseCase`** kapselt die Spielbeginn-Orchestrierung (Reuse von `CreateCompanyUseCase`, direkte Domain-Platzierung für kostenlose Starter-Gebäude).
- Starter-Gebäude umgehen **`PlaceBuildingUseCase`**, da dort Baukosten und Meilenstein-Voraussetzungen gelten — das widerspräche `core-gameplay.md` („kostenlos“).
- Starter-Gebäude werden mit **sofortiger Fertigstellung** (`beginConstruction(0)`) platziert; Lager-Speicher wird über **`TransportLogisticsService.ensureStorageForBuilding`** initialisiert.
- Konstanten in **`NewGameSetupConstants`** statt Magic Numbers (DD-008).
- **`STARTING_MONEY`** als Single Source of Truth in `FinanceConstants`.

---

## Umsetzung vs. Dokumentation

| `core-gameplay.md` | Umsetzung |
|---|---|
| 100.000 Credits | `STARTING_MONEY = 100_000` |
| Firmenzentrale | `headquarters` @ (12, 12) |
| Lager Level 1 | `warehouse` @ (8, 12) |
| Umspannwerk | `power_substation` @ (16, 12) |
| Zufahrtsstraße | `access_road` @ (12, 8) |
| Holz, Stein, Eisen | `wood` 20, `stone` 15, `iron_ore` 10 |
| 25×25 Startgebiet | Noch nicht modelliert (kein Grid-Aggregat) |

---

## Offene Punkte

| Punkt | Priorität |
|---|---|
| Startgebiet 25×25 als Domain-/World-Modell | Medium |
| Tutorial-Schritte (Erste Spielminute) | Medium |
| `warehouse`-Meilenstein `first_profit` vs. Starter-Lager — bewusst getrennt (Starter bypass) | Low (dokumentieren) |

---

## Technische Schulden

Neue technische Schulden: **keine**.

---

## Empfehlungen

1. Meilenstein-Logik für player-placed `warehouse` beibehalten; optional `starter_warehouse`-Typ einführen, falls Verwechslungsgefahr steigt.
2. Nächster Schritt: Tutorial-Flow oder Employee-System gemäß Roadmap M4.
