# Employee Persistence Layer — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M4 Employees — Schritt 5 (Savegame Persistence)  
**Date:** 2026-07-18  
**Status:** Completed

---

## Ziel

Mitarbeiter-Aggregate in Savegames serialisieren und nach Load wiederherstellen, damit Payroll, Worker-Efficiency und GameSession-Employee-APIs nach einem Reload korrekt funktionieren.

---

## Problem

Vor Schritt 5 war `InMemoryEmployeeRepository` nach Load immer leer:

- `GameSaveSnapshotV1` hatte kein `employees`-Feld
- `GameStateSerializer` serialisierte/hydratisierte keine Employees
- `SaveGameUseCase` übergab `employeeRepository` nicht an `serialize`
- `restoreApplicationFromSnapshot` übergab `employeeRepository` nicht an `hydrate`

---

## Betroffene Module

| Layer          | Module                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Application    | `GameSaveSnapshotV1`, `GameStateSerializerPort`, `SaveGameUseCase`, `restoreApplicationFromSnapshot` |
| Infrastructure | `GameStateSerializer`                                                                                |

---

## Persistierte Felder

| Feld                 | Quelle                                       |
| -------------------- | -------------------------------------------- |
| `id`                 | `Employee.getId()`                           |
| `companyId`          | `Employee.getCompanyId()`                    |
| `employeeTypeId`     | `Employee.getEmployeeTypeId()`               |
| `displayName`        | `Employee.getDisplayName()`                  |
| `salary`             | Runtime-Wert aus Hire (Content-Kopie)        |
| `productivity`       | Runtime-Wert aus Hire (Content-Kopie)        |
| `hiredAt`            | `Employee.getHiredAt()`                      |
| `status`             | `Employee.getStatus()`                       |
| `assignedBuildingId` | Optional; `Employee.getAssignedBuildingId()` |

---

## Geänderte Dateien

| Datei                                                            | Änderung                                              |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| `src/application/persistence/GameSaveSnapshotV1.ts`              | `GameSaveEmployeeSnapshotV1` + `employees[]`          |
| `src/application/ports/GameStateSerializerPort.ts`               | `employeeRepository` auf Source/Target                |
| `src/infrastructure/persistence/savegame/GameStateSerializer.ts` | Serialize, Parse-Default, Hydrate, `#restoreEmployee` |
| `src/application/use-cases/SaveGameUseCase.ts`                   | `employeeRepository` in Serialize-Deps                |
| `src/application/bootstrap/restoreApplicationFromSnapshot.ts`    | `employeeRepository` an `hydrate`                     |
| `docs/development/IMPLEMENTATION_PROGRESS.md`                    | Status aktualisiert                                   |

---

## Neue / erweiterte Tests

| Datei                         | Tests                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `GameStateSerializer.test.ts` | Parse-Default `employees: []`, Hydrate assigned/unassigned, invalid building id, Round-Trip hire+assign |

---

## Verhalten

### Serialize

- `source.employeeRepository.findAll()` → frozen Snapshot-Rows (analog `productionJobs`)
- Speichern weiterhin blockiert, solange Domain-Events in der Queue stehen

### Parse (Backward Compatibility)

- Alte Savegames ohne `employees`: `employees ?? []`

### Hydrate

- Reihenfolge: nach `buildings`, vor `inventories` (FK auf `assignedBuildingId`)
- `#restoreEmployee` via `Employee.restore()` mit validierten IDs

---

## Tests

```text
pnpm test
pnpm typecheck
```

(Erwartung: alle bestehenden Tests grün + neue Serializer-Tests)

---

## Referenzen

- `docs/schemas/Employee.schema.md`
- `docs/gameplay/employees.md`
- `docs/quality/EMPLOYEE_DOMAIN_LAYER_REPORT.md`
- `docs/quality/EMPLOYEE_APPLICATION_LAYER_REPORT.md`
- `docs/quality/EMPLOYEE_SIMULATION_LAYER_REPORT.md`
