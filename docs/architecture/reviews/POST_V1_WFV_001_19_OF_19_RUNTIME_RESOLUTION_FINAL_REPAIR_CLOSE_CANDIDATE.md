# POST-V1 WFV-001 — 19/19 Runtime Resolution Final Repair Close Candidate

**Prompt:** `POST_V1_WFV_001_19_OF_19_RUNTIME_RESOLUTION_FINAL_REPAIR.md`  
**Predecessor:** `POST_V1_WFV_001_WORKFORCE_ROLE_VISUAL_IDENTITY_PRODUCTION_COMPLETION_8_TO_19_CLOSE_CANDIDATE.md` (OPTION A **failed** external runtime-visual gate)  
**Branch:** `master` · **HEAD:** `22889a8` (completion + repair remain local, uncommitted)

---

## 1. Executive summary

Independent human review rejected the completion close candidate because real Workforce screenshots showed **ICON-002-style category glyphs** for newly covered roles (researcher, administrator, junior engineer) while Batch-1 roles (e.g. production worker) showed WFV-001 art.

This repair **does not regenerate art**. It fixes the **runtime consumer contract** and re-captures evidence with instrumentation.

**Root cause (evidence-backed):**

1. **`WorkforceRoleVisual` error path:** On `<img onError>`, the component set `failedPrimary`, cleared the WFV primary URL, and rendered **`resolveVisualAssetUrl(fallbackAssetId)`** (ICON-002 SVG). Any transient 404 (stale `next start` build, missing public PNG, lazy-load race) therefore **looked like “no WFV art”** even when the resolver correctly returned a production primary ID.
2. **Capture / build hygiene:** Completion evidence used `next start` on `:3005` without guaranteeing a fresh `build:web` after the +11 PNG sync; combined with `loading="lazy"` and no wait for decoded PNG dimensions, screenshots could show fallbacks or broken states while unit tests still passed.

**Repair:**

- Production-mapped roles keep the **WFV primary `src`** on load failure (flag only via `data-wfv-primary-load-failed`); ICON-002 is used **only** when `primaryAssetId === null` (unknown / unmapped type).
- Employee table uses `loading="eager"` for workforce thumbnails.
- Capture waits for `data-workforce-primary="true"` images with `naturalWidth > 0` and writes `WFV_001_FINAL_RUNTIME_RESOLUTION_REPORT.json`.

---

## 2. Runtime chain trace (affected roles)

| Step | Finding |
|------|---------|
| UI row type | `employee.employeeTypeId` from dashboard mapper (correct authoritative IDs) |
| `PGEmployeesWidget` | `mapOperationsEmployeeRows` → `WorkforceRoleVisual` |
| Resolver | `employeeTypeToWfvPrimaryAssetId` → `WFV-001-{id}-primary` for all 19 |
| Registry | `wfv001RegistryEntries()` — 19 PNG paths under `/assets/workforce/` |
| Browser request | PNG URLs correct when build includes public assets |
| Fallback branch | **Previously:** `onError` → ICON-002 for enabled types · **Now:** blocked |

---

## 3. Re-audit — 19 enabled types (repository state)

Static gates verified 2026-09-20. Runtime fixture column: roles present in e2e closeout save + completion capture hires; all others verified via asset/registry/resolver tests.

| Employee type ID | Player name | Production primary | Registry | Resolver | Runtime fixture | Rendered source (after repair) |
|---|---|---:|---:|---:|---:|---|
| `employee_production_worker` | Produktionsmitarbeiter | YES | YES | YES | YES | WFV-001 primary |
| `employee_senior_production_worker` | Erfahrener Produktionsmitarbeiter | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_operations_supervisor` | Produktionsleiter | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_engineer_basic` | Junior-Ingenieur | YES | YES | YES | YES | WFV-001 primary |
| `employee_senior_engineer` | Senior-Ingenieur | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_maintenance_technician` | Wartungstechniker | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_researcher_basic` | Forscher | YES | YES | YES | YES | WFV-001 primary |
| `employee_senior_researcher` | Senior-Forscher | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_lab_director` | Laborleiter | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_logistics_operator` | Logistikmitarbeiter | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_logistics_coordinator` | Logistikkoordinator | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_distribution_clerk` | Distributionsmitarbeiter | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_port_operator` | Hafenlogistiker | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_rail_dispatcher` | Schienendisponent | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_administrator_basic` | Verwaltungsmitarbeiter | YES | YES | YES | YES | WFV-001 primary (Direction A) |
| `employee_financial_analyst` | Finanzanalyst | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_hr_manager` | HR-Manager | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_regional_manager` | Regionalleiter | YES | YES | YES | — | WFV-001 primary (static) |
| `employee_executive_director` | Geschäftsführer | YES | YES | YES | — | WFV-001 primary (static) |

**Unknown ID:** `employee_unknown` → ICON-002 administration fallback **retained** (unit test).

---

## 4. Mandatory runtime reproduction

Capture: `tools/capture-wfv-001-completion-runtime-evidence.mjs`  
Environment: `PG_WEB_ORIGIN=http://localhost:3005` after fresh `pnpm build:web` + `next start -p 3005`, API on `:3001`.

Machine report: `docs/architecture/reviews/evidence/WFV_001_FINAL_RUNTIME_RESOLUTION_REPORT.json`

| Check | Result |
|-------|--------|
| Production worker WFV art | PASS (2 save rows) |
| `employee_researcher_basic` | PASS — loaded WFV PNG |
| `employee_administrator_basic` | PASS — loaded WFV PNG |
| `employee_engineer_basic` | PASS — loaded WFV PNG |
| Enabled-type ICON-002 fallback violations | **0** |
| Updated desktop / narrow / coverage PNGs | PASS (same filenames, corrected visuals) |

---

## 5. Code changes (task-owned)

| File | Change |
|------|--------|
| `WorkforceRoleVisual.tsx` | No ICON-002 swap on primary `onError`; diagnostic data attributes |
| `company-operations-table-mappers.tsx` | `loading="eager"` for workforce column |
| `WorkforceRoleVisual.test.tsx` | Guards production primary + error behavior |
| `capture-wfv-001-completion-runtime-evidence.mjs` | Load waits, row diagnostics, JSON report |

Resolver/registry/manifest/19 PNG masters: **unchanged** from completion slice (art authoritative).

---

## 6. Root gates

| Gate | Result |
|------|--------|
| typecheck | PASS (via `build:web`) |
| lint | PASS (0 errors) |
| test | PASS (**1015**) |
| build:web | PASS |

---

## 7. Final decision

### OPTION A — WFV-001 19/19 RUNTIME RESOLUTION REPAIR — FINAL CLOSE CANDIDATE READY

Asset + resolver coverage from completion slice stands; **runtime-visual gate** is re-opened with corrected consumer behavior and instrumented evidence. External human seal still required before track **SEALED**.

---

*No commit, push, or tag per prompt.*
