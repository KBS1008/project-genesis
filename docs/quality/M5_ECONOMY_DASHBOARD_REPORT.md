# M5 Economy — Dashboard Supply & Demand (Step 2) — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M5-2 Dashboard Preis-Trends / Supply & Demand  
**Date:** 2026-07-18  
**Status:** Completed  

---

## Ziel

Marktdynamik im Dashboard sichtbar machen: neben Preisverläufen auch Angebot, Nachfrage, Druckindex und Trend pro Ressource anzeigen.

---

## Backend

| Änderung | Details |
|---|---|
| `MarketPriceReadModel` | + `totalSupply`, `baselineDemand`, `pressureIndex`, `changeFromBase`, `changePercent`, `trend` |
| `projectMarketPrice.ts` | Projektion aus Markt + Inventar |
| `GetMarketPricesQueryHandler` | nutzt `inventoryRepository` + `MarketSupplyAggregator` |
| `MarketPressureCalculator` | Druckindex & Trend (Domain) |
| `MarketSupplyAggregator` | nach Domain verschoben (wiederverwendbar) |
| `TickMarketPriceSnapshot` | + Supply/Demand/Druck für Chart-Historie |
| Savegame v1 | optionale Felder in `tickMetricsHistory.marketPrices` (abwärtskompatibel) |

---

## Frontend

| Komponente | Zweck |
|---|---|
| `MarketPricesTable` | Tabelle mit Preis, Δ Basis, Angebot, Nachfrage, Druck, Trend |
| `MarketSupplyDemandChart` | Balkendiagramm Angebot vs. Nachfrage (aktueller Stand) |
| `MarketPressureHistoryChart` | Liniendiagramm Druckindex über Ticks (Referenzlinie bei 1,0) |
| `MarketTrendBadge` | ▲/▼/→ Trend-Badge |
| `DashboardShell` | Markt-Sektion + neue Charts eingebunden |

---

## Tests

- `MarketPressureCalculator.test.ts`
- `GetMarketPricesQueryHandler.test.ts` erweitert (Supply-Projektion)
- Savegame-Restore mit alten Tick-Snapshots (Defaults für fehlende Felder)

---

## M5 Abschluss

M5-3 und M5-4 abgeschlossen. Siehe `docs/quality/M5_ECONOMY_MARKET_FEES_REPORT.md` und `M5_ECONOMY_TAX_CONTRACTS_INFLATION_REPORT.md`.

---

## Referenzen

- `docs/quality/M5_ECONOMY_DYNAMIC_PRICES_REPORT.md` (M5-1)
- `docs/gameplay/market.md`
