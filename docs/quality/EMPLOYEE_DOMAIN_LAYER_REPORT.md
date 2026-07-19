# Employee Domain Layer — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M4 Employees — Schritt 2 (Domain Layer)  
**Date:** 2026-07-18  
**Status:** Completed

---

## Ziel

Einführung des Employee-Aggregats in der Domain-Schicht gemäß `docs/architecture/domain-model.md` und `docs/gameplay/employees.md`: Typisierte Identifiers, Aggregate Root, Domain Events, Repository-Interface und In-Memory-Persistenz für Tests.

---

## Betroffene Module

| Layer          | Module                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| Domain         | `Employee`, `EmployeeId`, `EmployeeStatus`, `EmployeeRepository`                        |
| Domain         | Events: `EmployeeHired`, `EmployeeAssignedToBuilding`, `EmployeeUnassignedFromBuilding` |
| Infrastructure | `InMemoryEmployeeRepository`                                                            |

---

## Geänderte Dateien

| Datei                                         | Änderung                            |
| --------------------------------------------- | ----------------------------------- |
| `src/infrastructure/persistence/index.ts`     | Export `InMemoryEmployeeRepository` |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Status aktualisiert                 |

---

## Neue Dateien

| Datei                                                               | Beschreibung                                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/domain/employee/EmployeeId.ts`                                 | `EmployeeId`, `EmployeeTypeId` Brands                                            |
| `src/domain/employee/EmployeeStatus.ts`                             | Lifecycle-Enum (`ACTIVE`)                                                        |
| `src/domain/employee/Employee.ts`                                   | Aggregate Root mit `hire`, `assignToBuilding`, `unassignFromBuilding`, `restore` |
| `src/domain/employee/EmployeeRepository.ts`                         | Persistenz-Contract                                                              |
| `src/domain/employee/events/EmployeeHired.ts`                       | Domain Event                                                                     |
| `src/domain/employee/events/EmployeeAssignedToBuilding.ts`          | Domain Event                                                                     |
| `src/domain/employee/events/EmployeeUnassignedFromBuilding.ts`      | Domain Event                                                                     |
| `src/domain/employee/Employee.test.ts`                              | 7 Tests                                                                          |
| `src/infrastructure/persistence/InMemoryEmployeeRepository.ts`      | In-Memory-Implementierung                                                        |
| `src/infrastructure/persistence/InMemoryEmployeeRepository.test.ts` | 3 Tests                                                                          |
| `docs/quality/EMPLOYEE_DOMAIN_LAYER_REPORT.md`                      | Dieser Bericht                                                                   |

---

## Gelöschte Dateien

Keine.

---

## Tests

| Suite                                | Tests                                                   |
| ------------------------------------ | ------------------------------------------------------- |
| `Employee.test.ts`                   | Hire, Validation, Assign, Unassign, Restore ohne Events |
| `InMemoryEmployeeRepository.test.ts` | Save/Find by id, company, building                      |

```text
Test Files:  80 passed (+2)
Tests:       341 passed (+10)
Typecheck:   passed
```

---

## Architektur-Compliance

| Regel                                                             | Status                                             |
| ----------------------------------------------------------------- | -------------------------------------------------- |
| Domain importiert kein `src/content/`                             | ✓ Salary/Productivity kommen via Application Layer |
| `Result` / `ValidationError` für erwartete Fehler                 | ✓                                                  |
| `AggregateRoot` + `Identifier.create<T>()`                        | ✓                                                  |
| `restore()` ohne Domain Events                                    | ✓                                                  |
| Repository-Interface in Domain, Implementierung in Infrastructure | ✓                                                  |
| Keine TODOs / Workarounds                                         | ✓                                                  |

---

## Domain-Invarianten

- Display-Name darf nicht leer oder nur Whitespace sein.
- Salary und Productivity müssen > 0 sein.
- Ein Employee gehört genau einer Company.
- Maximal eine Building-Zuweisung gleichzeitig.
- Reassign erfordert vorheriges `unassignFromBuilding`.

---

## Bewusst nicht in Schritt 2

| Thema                                           | Geplant in                    |
| ----------------------------------------------- | ----------------------------- |
| `HireEmployeeUseCase` / `AssignEmployeeUseCase` | Schritt 3 (Application Layer) |
| Finance-Debit (Rekrutierung + Gehalt)           | Schritt 3                     |
| `GameSession`-Integration                       | Schritt 3                     |
| `recipe.workers`-Enforcement                    | Schritt 4 (Simulation)        |
| Savegame-Persistenz                             | Schritt 5                     |
| `EmployeeAllocationService`                     | Schritt 4                     |

---

## Nächster Schritt

**Schritt 3 — Application Layer:** `HireEmployeeUseCase`, `AssignEmployeeUseCase`, Finance-Integration, Repository-Wiring in `GameSession` / Bootstrap.
