# Employee Application Layer — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M4 Employees — Schritt 3 (Application Layer)  
**Date:** 2026-07-18  
**Status:** Completed  

---

## Ziel

Einführung der Application-Layer-Workflows für Mitarbeiter: Einstellung mit Rekrutierungskosten, Zuweisung zu Gebäuden, Bootstrap-/Session-Wiring gemäß bestehender Use-Case-Patterns.

---

## Betroffene Module

| Layer | Module |
|---|---|
| Application | `HireEmployeeUseCase`, `AssignEmployeeUseCase`, Commands |
| Application | `ApplicationContext`, `bootstrapApplication`, `restoreApplicationFromSnapshot` |
| Application | `GameSession` Facade (`hireEmployee`, `assignEmployee`) |
| Domain | `EmployeePrerequisitesSpecification`, `RequiredBuildingTypesSpecification` |
| Domain | `FinanceTransactionType.RECRUITMENT_COST` |

---

## Geänderte Dateien

| Datei | Änderung |
|---|---|
| `src/application/bootstrap/ApplicationContext.ts` | `employeeRepository` |
| `src/application/bootstrap/bootstrapApplication.ts` | `InMemoryEmployeeRepository` Wiring |
| `src/application/bootstrap/restoreApplicationFromSnapshot.ts` | Leeres `employeeRepository` nach Load |
| `src/application/facade/GameSession.ts` | Use Cases + Facade-Methoden + ID-Sequenz |
| `src/domain/finance/FinanceTransactionType.ts` | `RECRUITMENT_COST` |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Status aktualisiert |

---

## Neue Dateien

| Datei | Beschreibung |
|---|---|
| `src/application/commands/HireEmployeeCommand.ts` | Hire-Command |
| `src/application/commands/AssignEmployeeCommand.ts` | Assign-Command |
| `src/application/use-cases/HireEmployeeUseCase.ts` | Einstellung + Finance-Debit |
| `src/application/use-cases/AssignEmployeeUseCase.ts` | Gebäude-Zuweisung |
| `src/application/use-cases/HireEmployeeUseCase.test.ts` | 6 Tests |
| `src/application/use-cases/AssignEmployeeUseCase.test.ts` | 4 Tests |
| `src/domain/specifications/employee/RequiredBuildingTypesSpecification.ts` | Building-Voraussetzungen |
| `src/domain/specifications/employee/EmployeePrerequisitesSpecification.ts` | Research + Buildings |
| `src/domain/specifications/employee/EmployeePrerequisitesSpecification.test.ts` | 3 Tests |
| `docs/quality/EMPLOYEE_APPLICATION_LAYER_REPORT.md` | Dieser Bericht |

---

## Tests

```text
Test Files:  83 passed (+3)
Tests:       354 passed (+13)
Typecheck:   passed
```

---

## Workflow-Details

### HireEmployeeUseCase

1. Validiert IDs, Company, Employee-Type aus Content
2. Prüft `enabled`, Rekrutierungskosten ≥ 0
3. `EmployeePrerequisitesSpecification` (Research + aktive Gebäude)
4. `Employee.hire()` mit Salary/Productivity aus Content
5. `finance.debit(cost, RECRUITMENT_COST)`
6. Persistenz + Event-Enqueue

### AssignEmployeeUseCase

1. Lädt Employee + Building
2. Gleiche Company, Building `ACTIVE`
3. `employee.assignToBuilding()`
4. Persistenz + Event-Enqueue

### GameSession

- `hireEmployee({ employeeTypeId, displayName })` → generiert `employee_XXX`
- `assignEmployee({ employeeId, buildingId })`

---

## Bewusst nicht in Schritt 3

| Thema | Geplant in |
|---|---|
| Laufende Gehaltszahlungen (`SALARY` on tick) | Schritt 4 — Simulation |
| `recipe.workers`-Enforcement | Schritt 4 |
| Savegame-Persistenz für Employees | Schritt 5 |
| Dashboard/API-Endpunkte für Employees | Optional später |
| `UnassignEmployeeUseCase` | Optional (Domain unterstützt es) |

---

## Nächster Schritt

**Schritt 4 — Simulation:** Gehaltsabzug pro Tick, `EmployeeAllocationService`, `recipe.workers`-Prüfung in Produktion.
