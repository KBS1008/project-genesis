# M5 Economy — Taxes, Contracts, Inflation (Step 4) — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M5-4 Verträge, Steuern, Inflation  
**Date:** 2026-07-18  
**Status:** Completed

---

## Ziel

Wirtschaftssimulation vervollständigen: periodische Unternehmenssteuer, NPC-Lieferverträge als Geldquelle und inflationsdämpfende Marktpreisanpassung.

---

## Umsetzung

| Schicht          | Artefakt                                           | Zweck                                                 |
| ---------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Domain           | `TaxCalculator.ts`, `TaxConstants.ts`              | 5 % Steuer auf steuerpflichtigen Gewinn alle 30 Ticks |
| Domain           | `FinanceAccount.ts`                                | `lastTaxCollectedAt`, `closeTaxPeriod()`              |
| Simulation       | `FinanceSimulationSystem.ts`                       | Payroll und Steuer getrennt                           |
| Domain           | `InflationCalculator.ts`, `InflationConstants.ts`  | Preisindex + Dämpfung/Stimulus                        |
| Simulation       | `MarketSimulationSystem.ts`                        | Anpassungsrate × Inflationsmultiplikator              |
| Domain           | `SupplyContract.ts`, Repository                    | NPC-Holzkauf (5 Holz / 125 GC / 20 Ticks)             |
| Simulation       | `ContractSimulationSystem.ts`                      | Vertragserfüllung vor Finance                         |
| Bootstrap / Save | Wiring + `supplyContracts[]`, `lastTaxCollectedAt` | Persistenz                                            |
| Application      | `StartNewGameUseCase`                              | Starter-NPC-Vertrag bei Neues Spiel                   |
| Dashboard        | `EconomyReadModel`, KPI-Strip, Wirtschaft-Sektion  | Steuersatz, Preisindex, Verträge                      |

### Steuer

- Intervall: **30 Ticks**
- Satz: **5 %** auf steuerpflichtigen Gewinn seit letzter Abrechnung
- Buchung: `TAX` (OUT); bei Betrag 0 wird die Periode trotzdem geschlossen
- Bei unzureichendem Cash: Abrechnung wird übersprungen (Periode bleibt offen)

### NPC-Vertrag (Starter)

- Ressource: **5× Holz** alle **20 Ticks**
- Zahlung: **125 GC** (`CONTRACT_PAYMENT`)
- Erfüllung nur bei ausreichendem Standort-Inventar

### Inflation

- **Preisindex:** Durchschnitt `lastPrice / basePrice` über alle Marktressourcen
- Neutralband: **0,9 – 1,1**
- Überband: Anpassungsrate × **0,5** (Dämpfung)
- Unterband: Anpassungsrate × **1,25** (Stimulus)

---

## Simulation-Reihenfolge

```text
Company → Building → Transport → Production → Research → Market → Contract → Finance
```

---

## Tests

| Test                                     | Abdeckung                          |
| ---------------------------------------- | ---------------------------------- |
| `TaxCalculator.test.ts`                  | Steuerbasis, Satz                  |
| `InflationCalculator.test.ts`            | Index, Multiplikator               |
| `SupplyContract.test.ts`                 | Starter-Vertrag, Fulfillment-Logik |
| `ContractSimulationSystem.test.ts`       | NPC-Kauf, Inventar-Guard           |
| `FinanceSimulationSystem.test.ts`        | Payroll + Steuer                   |
| `createDefaultSimulationSystems.test.ts` | Contract vor Finance               |
| `StartNewGameUseCase.test.ts`            | Starter-Vertrag angelegt           |

---

## UI

- KPI-Strip: **Preisindex**, **Steuer / Verträge**
- Sektion **Wirtschaft**: Vertragstabelle + Steuer-/Index-Hinweis
- Tick-Historie: Feld `priceIndex`
- Finanz-Ledger: `TAX`, `CONTRACT_PAYMENT` (bereits gelabelt)

Alle Schritte abgeschlossen. Milestone-Audit: `docs/quality/M5_ECONOMY_AUDIT_REPORT.md`.
