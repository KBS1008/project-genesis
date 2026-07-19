# M5 Economy — Market Fees (Step 3) — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M5-3 Marktgebühren (`MARKET_FEE`)  
**Date:** 2026-07-18  
**Status:** Completed

---

## Ziel

Marktgebühren als Geldsenke einführen: Jeder Sofortkauf und -verkauf erzeugt eine `MARKET_FEE`-Transaktion (Version 1: fester Satz, nicht volumenabhängig).

---

## Umsetzung

| Schicht     | Artefakt                      | Zweck                                                          |
| ----------- | ----------------------------- | -------------------------------------------------------------- |
| Domain      | `MarketPriceConstants.ts`     | `MARKET_TRADE_FEE_RATE = 0.02`, `MARKET_TRADE_FEE_MINIMUM = 1` |
| Domain      | `MarketFeePolicy.ts`          | Berechnet Gebühr aus Handelswert                               |
| Application | `MarketTradeService.ts`       | Bucht Gebühr bei Buy/Sell, Rollback bei Fehlern                |
| Dashboard   | `GameSessionDashboardBuilder` | Kauf-Hints berücksichtigen Gebühr                              |

### Gebührenformel

```text
fee = max(1, round(tradeValue × 0.02))
```

- **Verkauf:** `SALE`-Gutschrift, dann `MARKET_FEE`-Belastung → Netto = Handelswert − Gebühr
- **Kauf:** `PURCHASE`-Belastung, dann `MARKET_FEE`-Belastung → Gesamtkosten = Handelswert + Gebühr

`MarketTradeResult` enthält jetzt `feeAmount` und `netAmount`.

---

## Tests

| Test                         | Abdeckung                                                           |
| ---------------------------- | ------------------------------------------------------------------- |
| `MarketFeePolicy.test.ts`    | Minimum, Prozentsatz, Validierung                                   |
| `MarketTradeService.test.ts` | Sell/Buy mit Gebühr, Ledger-Einträge, unzureichendes Cash inkl. Fee |

---

## UI

- Finanz-Ledger zeigt `MARKET_FEE` als „Marktgebühr“ (bereits vorhanden)
- Markt-Sektion: Hinweis „Handelsgebühr: 2 % (min. 1 GC)“
- Kauf-Hints: „… inkl. Marktgebühr“

---

## M5 Abschluss

M5-4 abgeschlossen — Milestone M5 vollständig. Audit: `docs/quality/M5_ECONOMY_AUDIT_REPORT.md`.

---

## Referenzen

- `docs/gameplay/market.md` — Marktgebühren Version 1
- `docs/gameplay/economy.md` — Geldsenken
