# M5 Economy — Milestone Audit Report

**Audit ID:** AUD-003 (M5 scope)  
**Project:** Project Genesis  
**Date:** 2026-07-18  
**Commit:** `49110dd` (Follow-ups; Audit-Basis `d1a9987`)  
**Scope:** M5 Economy (M5-1 … M5-4) — dynamic prices, dashboard, fees, taxes, contracts, inflation  
**Auditor:** Cursor (repo-backed review per `docs/project-management/AUDIT_PROCESS.md`)

---

# Executive Summary

M5 ist **code-seitig abgeschlossen** und für den Übergang zu M6 **freigegeben**.

| Kriterium | Ergebnis |
|---|---|
| Deliverables M5-1 … M5-4 | ✅ Erfüllt |
| Exit: dynamische Preise | ✅ Erfüllt |
| Exit: Determinismus | ✅ Erfüllt |
| Exit: stabile Wirtschaft | 🟡 Teilweise (Single-Company-Prototyp, keine Insolvenz-/Multiplayer-Simulation) |
| Tests / Typecheck | ✅ 400 / grün |
| Dokumentation | ✅ Reports + IMPLEMENTATION_PROGRESS aktualisiert |
| Audit-Follow-ups (F-01, F-04, F-07) | ✅ Abgeschlossen (2026-07-18) |

**Gesamtbewertung M5:** **8.5 / 10** — solide Milestone-Umsetzung; Audit-Follow-ups erledigt.

**Empfehlung:** Mit **M6 Logistics** starten; verbleibende Low-Priority-Punkte (F-02, F-03 Dashboard-Hinweis, F-05 Lagerhaus) nicht blockierend.

---

# Evidence

| Prüfung | Ergebnis |
|---|---|
| `pnpm test` | 396 passed (95 files) |
| `pnpm typecheck` | grün (root, api, web) |
| Architecture dependency rules | grün |
| Savegame round-trip (Session) | `GameSession.test.ts`, `SaveGameUseCase.test.ts`, `GameStateSerializer.test.ts` |
| API smoke | `game.controller.test.ts` grün |

---

# Deliverable Compliance

| M5 Schritt | Soll (MILESTONE_PLAN) | Ist | Report |
|---|---|---|---|
| M5-1 Dynamic Prices | Supply/Demand-Preisanpassung | ✅ | `M5_ECONOMY_DYNAMIC_PRICES_REPORT.md` |
| M5-2 Dashboard | Angebot/Nachfrage/Druck sichtbar | ✅ | `M5_ECONOMY_DASHBOARD_REPORT.md` |
| M5-3 Market Fees | `MARKET_FEE` als Geldsenke | ✅ | `M5_ECONOMY_MARKET_FEES_REPORT.md` |
| M5-4 Taxes/Contracts/Inflation | Steuer, Vertrag, Preisindex-Dämpfung | ✅ | `M5_ECONOMY_TAX_CONTRACTS_INFLATION_REPORT.md` |

---

# Architecture & Determinism

**Stärken**

- Simulation-Reihenfolge dokumentiert und getestet: `Market → Contract → Finance`
- Domain-Logik rein (`TaxCalculator`, `InflationCalculator`, `MarketPriceCalculator`, `SupplyContract`)
- Savegame-Felder optional (`supplyContracts?`, `lastTaxCollectedAt?`, `priceIndex?`) — alte Saves kompatibel
- Bootstrap/Restore/Save über `supplyContractRepository` konsistent verdrahtet

**Keine Architekturverletzungen festgestellt** (Dependency-Rule-Test bestanden).

---

# Gameplay Compliance (`docs/gameplay/economy.md`)

| Mechanik (Doku) | Status | Anmerkung |
|---|---|---|
| Dynamische Preise (Angebot/Nachfrage) | ✅ | Alle 10 Ticks, Druckindex im Dashboard |
| Marktgebühren als Geldsenke | ✅ | 2 %, min. 1 GC |
| Steuern als Geldsenke | ✅ | 5 % auf Gewinn, alle 30 Ticks |
| Inflation kontrollieren | 🟡 | Preisindex + Dämpfung/Stimulus; kein separates Inflation-KPI-Chart |
| Verträge / NPC-Nachfrage | 🟡 | Ein Starter-Holzvertrag; kein Vertragssystem UI zum Anlegen |
| Insolvenz / Kredite | ⚪ | Bewusst außerhalb M5 |

---

# Findings

## 🟡 Medium

| ID | Finding | Empfehlung | Target |
|---|---|---|---|
| F-01 | ~~Kein dedizierter Savegame-Test~~ | ✅ `GameStateSerializer.test.ts` — StartNewGame + 30 Ticks, Vertrag + `lastTaxCollectedAt` | — |
| F-02 | Nur ein Vertragstyp (`NPC_PURCHASE` Starter-Holz) | Für M6+ Vertragscatalog / Spieler-Verträge planen | M7+ |
| F-03 | ~~Steuer bei fehlendem Cash übersprungen ohne UI-Hinweis~~ | ✅ Dashboard-Warnung + KPI-Hinweis (M5.1) | — |

## 🟢 Low

| ID | Finding | Empfehlung |
|---|---|---|
| F-04 | ~~Kein Preisindex-Chart~~ | ✅ `PriceIndexHistoryChart.tsx` im Dashboard | — |
| F-05 | ~~Vertrag nur Standort-Inventar und nicht dokumentiert~~ | ✅ In Wirtschaft-Sektion erklärt (M5.1); Lagerhaus-Anbindung später M6 | M6 |
| F-06 | Start-Holz 40 statt 20 (Balance-Fix für Vertrag + Produktion) | ✅ In Tutorial + `CORE_GAMEPLAY_START_REPORT.md` dokumentiert |
| F-07 | ~~Schema-Docs untracked~~ | ✅ `docs/schemas/Resource.schema.md`, `Vehicle.schema.md` committed | — |

---

# Risks

| Risiko | Stufe | Mitigation |
|---|---|---|
| NPC-Vertrag entzieht Holz während Bau/Produktion | Medium | Start-Ressourcen angepasst; Langzeit-Balance in Playtests |
| Steuer-Stau bei dauerhaft leerer Kasse | Low | Später Insolvenz-/Warnsystem |
| Savegame-Schema v1 ohne Migrationspfad bei neuen Pflichtfeldern | Low | Optionale Felder beibehalten |

---

# Action Items

| Prio | Task | Status |
|---|---|---|
| 🟠 | Savegame-Test: Verträge + Steuer-Zeitstempel | ✅ Completed (2026-07-18) |
| 🟡 | Schema-Docs committen | ✅ Completed (2026-07-18) |
| 🟡 | Tutorial: Vertrag/Steuer kurz erklären | ✅ Completed (2026-07-18) |
| 🟢 | Preisindex-Chart (optional) | ✅ Completed (2026-07-18) |
| 🟢 | M5.1: Steuer-Hinweis bei Skip (F-03) | ✅ Completed (2026-07-18) |
| 🟢 | M5.1: Vertrag Standort-Inventar erklären (F-05) | ✅ Completed (2026-07-18) |

---

# Milestone Readiness

**M5:** ✅ **Closed** — dokumentiert in `MILESTONE_PLAN.md` und `IMPLEMENTATION_PROGRESS.md`.

**Nächster Meilenstein:** **M6 Logistics** (Transport Routes, Vehicles, Networks, Warehouses, Capacities) — baut auf vorhandener Warehouse-Transport-Phase-1 auf.

---

# Referenzen

- `docs/quality/M5_ECONOMY_DYNAMIC_PRICES_REPORT.md`
- `docs/quality/M5_ECONOMY_DASHBOARD_REPORT.md`
- `docs/quality/M5_ECONOMY_MARKET_FEES_REPORT.md`
- `docs/quality/M5_ECONOMY_TAX_CONTRACTS_INFLATION_REPORT.md`
- `docs/project-management/MILESTONE_PLAN.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`
