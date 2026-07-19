# Employee Dashboard & API — Implementation Report

**Project:** Project Genesis  
**Phase:** 2 — Architecture Driven Development  
**Task:** M4 Employees — Dashboard & API Integration  
**Date:** 2026-07-18  
**Status:** Completed

---

## Ziel

Mitarbeiter-Workflows im Browser-Dashboard und über REST-API verfügbar machen: Snapshot-Daten, Action-Hints, Hire/Assign-Endpunkte und UI-Tabellen.

---

## Betroffene Module

| Layer       | Module                                                               |
| ----------- | -------------------------------------------------------------------- |
| Application | `GameSessionDashboard`, `GameSessionDashboardBuilder`, `GameSession` |
| API         | `GameController`, Hire/Assign DTOs                                   |
| Web         | `DashboardShell`, `DashboardDetailPanel`, `api.ts`                   |

---

## Dashboard-Erweiterungen

| Feld / Hint                  | Beschreibung                                            |
| ---------------------------- | ------------------------------------------------------- |
| `employees[]`                | Session-Read-Model pro Mitarbeiter                      |
| `contentNames.employees`     | Typ-Labels für UI                                       |
| `kpis.employeeCount`         | Anzahl eingestellter Mitarbeiter                        |
| `kpis.assignedEmployeeCount` | Zugewiesene Mitarbeiter                                 |
| `kpis.payrollPerInterval`    | Summe Gehälter pro Payroll-Zyklus                       |
| `hints.hireEmployee`         | Einstellungsaktionen inkl. Prerequisites & Kosten       |
| `hints.assignEmployee`       | Zuweisungen für unassigned Mitarbeiter × aktive Gebäude |

---

## Neue API-Routen

| Method | Path                    | Action                       |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/api/employees/hire`   | Mitarbeiter einstellen       |
| POST   | `/api/employees/assign` | Mitarbeiter Gebäude zuweisen |

---

## Geänderte Dateien

| Datei                                                   | Änderung                                         |
| ------------------------------------------------------- | ------------------------------------------------ |
| `src/application/facade/GameSessionDashboard.ts`        | Employee Read-Models, Hints, KPIs                |
| `src/application/facade/GameSessionDashboardBuilder.ts` | Hire/Assign-Hints, Content-Namen, KPI-Berechnung |
| `src/application/facade/GameSession.ts`                 | `#readEmployees`, Dashboard-Wiring               |
| `apps/api/src/game/game.controller.ts`                  | REST-Endpunkte                                   |
| `apps/web/src/lib/api.ts`                               | Frontend-Typen                                   |
| `apps/web/src/components/DashboardShell.tsx`            | KPI, Tabelle, Sidebar-Aktionen                   |
| `apps/web/src/components/DashboardDetailPanel.tsx`      | Employee-Drill-down                              |
| `docs/development/IMPLEMENTATION_PROGRESS.md`           | Status aktualisiert                              |

---

## Tests

| Datei                     | Tests                                   |
| ------------------------- | --------------------------------------- |
| `GameSession.test.ts`     | Dashboard nach Hire + Assign            |
| `game.controller.test.ts` | API Validation + Hire/Assign Round-Trip |

---

## Referenzen

- `docs/quality/EMPLOYEE_APPLICATION_LAYER_REPORT.md`
- `docs/art/DASHBOARD_STYLE_GUIDE.md`
- `docs/gameplay/employees.md`
