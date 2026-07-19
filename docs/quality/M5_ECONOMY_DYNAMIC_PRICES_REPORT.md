# M5 Economy — Dynamic Prices (Step 1) — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M5-1 Dynamic Prices (Supply & Demand)  
**Date:** 2026-07-18  
**Status:** Completed

---

## Ziel

Dynamische Marktpreise einführen: Preise reagieren deterministisch auf Angebot (Lagerbestände) und Nachfrage (Baseline-NPC-Demand), ohne die bestehende Instant-Trade-Logik zu brechen.

---

## Umsetzung

| Schicht    | Artefakt                                           | Zweck                                         |
| ---------- | -------------------------------------------------- | --------------------------------------------- |
| Domain     | `MarketPriceConstants.ts`                          | Intervalle, Baseline-Demand, Min/Max-Ratios   |
| Domain     | `MarketPriceCalculator.ts`                         | Reine Preisberechnung aus Supply/Demand       |
| Simulation | `MarketSupplyAggregator.ts`                        | Summiert verfügbares Inventar aller Companies |
| Simulation | `MarketSimulationSystem.ts`                        | Preis-Updates alle 10 Ticks, Events enqueuen  |
| Wiring     | `SimulationSystemDependencies`, Bootstrap, Restore | `inventoryRepository` an Market-System        |

### Preisformel (deterministisch)

```text
pressureIndex = baselineDemand / max(totalSupply, 1)
targetPrice   = basePrice × pressureIndex
nextPrice     = lastPrice + (targetPrice − lastPrice) × 0.08
nextPrice     = clamp(nextPrice, basePrice × 0.25 … basePrice × 4)
```

- **Angebot:** Summe der verfügbaren Inventarmengen pro Ressource (alle Companies)
- **Nachfrage:** Konstante Baseline (`MARKET_BASELINE_DEMAND = 50`) — NPC-/Weltnachfrage-Platzhalter
- **Intervall:** Alle `MARKET_PRICE_UPDATE_INTERVAL_TICKS` (10), analog Payroll

Instant-Kauf/-Verkauf nutzt weiterhin `lastPrice` über `InstantTradePricingPolicy`.

---

## Tests

| Test                             | Abdeckung                                       |
| -------------------------------- | ----------------------------------------------- |
| `MarketPriceCalculator.test.ts`  | Stabil, steigend, fallend, Min/Max-Clamping     |
| `MarketSimulationSystem.test.ts` | Hohes/niedriges Angebot, Intervall-Skip, Events |

**Ergebnis:** 396 Tests grün, Typecheck grün.

---

## M5 Abschluss

Alle vier Schritte abgeschlossen. Siehe `docs/quality/M5_ECONOMY_AUDIT_REPORT.md`.

---

## Referenzen

- `docs/gameplay/economy.md` — Preisbildung durch Angebot/Nachfrage
- `docs/gameplay/market.md` — dynamischer Marktpreis
- `docs/decisions/DD-006-economic-simulation.md` — deterministische Wirtschaftssimulation
