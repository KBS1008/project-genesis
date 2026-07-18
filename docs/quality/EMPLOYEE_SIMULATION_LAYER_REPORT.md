# Employee Simulation Layer — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M4 Employees — Schritt 4 (Simulation)  
**Date:** 2026-07-18  
**Status:** Completed  

---

## Ziel

Integration der Employee-Runtime in die Simulation: Gehaltsabzug, Worker-Efficiency für Produktion und `recipe.workers`-Enforcement gemäß `docs/gameplay/employees.md`.

---

## Betroffene Module

| Layer | Module |
|---|---|
| Domain | `EmployeeAllocationCalculator`, `EmployeeAllocationPort`, `EmployeePayrollConstants` |
| Domain | `ProductionJob.tick()` mit `workerEfficiency` |
| Application | `EmployeeAllocationService` |
| Simulation | `FinanceSimulationSystem` (Payroll), `ProductionSimulationSystem` (Worker-Gate) |
| Bootstrap | `EmployeeAllocationService` Wiring in `bootstrapApplication` + `restoreApplicationFromSnapshot` |

---

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `src/domain/production/ProductionJob.ts` | `tick()` skaliert Fortschritt via `workerEfficiency` |
| `src/simulation/systems/finance/FinanceSimulationSystem.ts` | Payroll-Debit alle `PAYROLL_INTERVAL_TICKS` |
| `src/simulation/systems/production/ProductionSimulationSystem.ts` | Worker-Efficiency vor Job-Tick |
| `src/simulation/systems/SimulationSystemDependencies.ts` | `employeeRepository`, `employeeAllocationService` |
| `src/simulation/systems/createDefaultSimulationSystems.ts` | Finance-System-Deps erweitert |
| `src/application/bootstrap/bootstrapApplication.ts` | `EmployeeAllocationService` |
| `src/application/bootstrap/restoreApplicationFromSnapshot.ts` | `EmployeeAllocationService` |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Status aktualisiert |

---

## Neue Dateien

| Datei | Beschreibung |
|---|---|
| `src/domain/employee/EmployeePayrollConstants.ts` | `PAYROLL_INTERVAL_TICKS = 10` |
| `src/domain/employee/EmployeeAllocationPort.ts` | Domain Port |
| `src/domain/employee/EmployeeAllocationCalculator.ts` | Pure Efficiency-Berechnung |
| `src/domain/employee/EmployeeAllocationCalculator.test.ts` | 4 Tests |
| `src/application/services/EmployeeAllocationService.ts` | Port-Implementierung |
| `src/application/services/EmployeeAllocationService.test.ts` | 1 Test |
| `src/simulation/systems/finance/FinanceSimulationSystem.test.ts` | 2 Tests |
| `src/simulation/systems/production/ProductionSimulationSystem.test.ts` | 2 Tests |
| `docs/quality/EMPLOYEE_SIMULATION_LAYER_REPORT.md` | Dieser Bericht |

---

## Tests

```text
Test Files:  87 passed (+4)
Tests:       365 passed (+11)
Typecheck:   passed
```

---

## Simulationsverhalten

### Payroll (`FinanceSimulationSystem`)

- Alle **10 Ticks** (`PAYROLL_INTERVAL_TICKS`): Summe der `Employee.getSalary()` pro Company
- Debit als `FinanceTransactionType.SALARY`
- Bei unzureichendem Cash: Payroll wird übersprungen (kein Partial-Debit)

### Worker Enforcement (`ProductionSimulationSystem`)

- `workerEfficiency = min(assigned / recipe.workers, 1)`
- `recipe.workers === 0` → Effizienz 1
- Keine zugewiesenen Worker bei Bedarf > 0 → kein Fortschritt
- Teilbesetzung → proportional langsamer (z. B. 1/2 Worker bei `recipe_planks`)

### `EmployeeAllocationService`

- Zählt `employeeRepository.findByBuildingId()`
- Liest `recipe.workers` aus Content
- Delegiert Berechnung an `EmployeeAllocationCalculator`

---

## Bewusst nicht in Schritt 4

| Thema | Geplant in |
|---|---|
| Savegame-Persistenz für Employees | Schritt 5 |
| Produktivitäts-Multiplikator (`getProductivity()`) in Efficiency | Später |
| Employee-Typ-Kategorien (nur Ingenieure etc.) | Später |
| Maintenance-Kosten on tick | Separates Feature |
| Dashboard/API für Employee-KPIs | Optional später |

---

## Nächster Schritt

**Schritt 5 — Persistenz:** Employee-State in `GameStateSerializer` / Savegame round-trip.
