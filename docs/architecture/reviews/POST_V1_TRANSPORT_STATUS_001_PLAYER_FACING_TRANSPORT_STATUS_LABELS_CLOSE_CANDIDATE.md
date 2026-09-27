# POST-V1 TRANSPORT-STATUS-001 — Player-Facing Transport Status Labels — Close Candidate

## A. Executive result

**TRANSPORT-STATUS-001:** `CLOSE CANDIDATE / PASS`

Dedicated **Transport** job rows and **World Map** region **Transport** rows now use **`formatTransportStatus`** for player-visible status text. Internal enum values remain on a separate **`status`** field for Transport screen summary logic. **Gameplay, save, and API unchanged.**

---

## B. Baseline & working tree

| Item | Value |
|------|--------|
| Branch | `master` |
| Baseline HEAD | `c0395d96933e1b9ae43143a957e6e59baaacef5c` |
| Baseline subject | TIME-UX-R1: replace player-facing Tick copy with Zyklus presentation. |
| `origin/master` | Same SHA at start of slice |
| Unrelated WIP | BVI assets, doc deletes/moves, pilots, saves, `.next`, design artifacts — **excluded** |

Implementation performed on baseline; **no commit/push/tag** per slice rules.

---

## C. Authoritative status contract

| Internal (`TransportOrderStatus`) | Player-facing (`formatTransportStatus`) |
|-----------------------------------|----------------------------------------|
| `WAITING` | Warteschlange |
| `IN_PROGRESS` | Unterwegs |
| `COMPLETED` | Abgeschlossen |
| `CANCELLED` | Abgebrochen |

**`CANCELLED` authority:** aligned with player-facing **`Abgebrochen`** for cancelled lifecycle states in `docs/schemas/Production.Schema.md` (same enum token family).  
**Unknown values:** safe passthrough (non-throwing), unchanged from prior formatter contract.

**Central authority:** `apps/web/src/presentation/formatting/presentation-formatters.ts` → `formatTransportStatus`.

---

## D. Pre-fix defect evidence

| Surface | Before |
|---------|--------|
| `mapTransportJobRowsViewData` | `statusLabel: order.status` (raw enum in Transport table) |
| `mapWorldRegionOperationsViewData` transports | `statusLabel: order.status` |
| `TransportScreen` summary | Compared `row.statusLabel === 'IN_PROGRESS'` etc. (coupled to raw enums) |

Company dashboard transport rows already used `formatTransportStatus` — **unchanged** (regression checked).

---

## E. Implementation

| File | Change |
|------|--------|
| `presentation-formatters.ts` | Explicit `CANCELLED` → `Abgebrochen` |
| `workspace-view-data.ts` | `TransportJobRowViewData` with `status` + `statusLabel` |
| `workspace-view-mappers.ts` | `mapTransportJobRowsViewData` uses formatter |
| `world-overlay-mappers.ts` | Region transport rows use formatter |
| `TransportScreen.tsx` | Summary uses `row.status`; table uses `statusLabel` |

No duplicate status maps. No domain/DTO/API edits.

---

## F. Internal status vs presentation separation

```text
status: order.status                    → logic (summary counts)
statusLabel: formatTransportStatus(...) → visible table cells
```

Summary **does not** compare German strings.

---

## G. Transport screen result

**PASS** — table shows **Warteschlange / Unterwegs / Abgeschlossen**; raw enums absent from status cells (component + runtime).

---

## H. World region result

**PASS** — `mapWorldRegionOperationsViewData` transport `statusLabel` localized; focused mapper test asserts **`Unterwegs`** not **`IN_PROGRESS`**.

Runtime PNG for World inspector: capture script provided; headless run did not reach map cell in this environment — **mapper + inspector path covered by unit test**.

---

## I. Formatter coverage

All four authoritative enum members covered in `formatTransportStatus` + dedicated unit tests.

---

## J. Focused tests

| Suite | Coverage |
|-------|----------|
| `presentation-formatters.test.ts` | All statuses + unknown passthrough |
| `workspace-view-mappers.test.ts` | Transport rows + internal status for counts |
| `TransportScreen.test.tsx` | Localized rows; summary counts; no `IN_PROGRESS` in DOM |
| `world-overlay-mappers.test.ts` | World transport `statusLabel` |

**Focused tests:** PASS.

---

## K. Runtime evidence

| Artifact | Result |
|----------|--------|
| Fixture | `tools/build-transport-status-001-evidence-fixture.mjs` → `tools/evidence-fixtures/transport-status-001-representative-orders.json` |
| Capture | `tools/capture-transport-status-001-runtime-evidence.mjs` |
| PNG (Transport @ 1440×900) | `docs/architecture/reviews/evidence/TRANSPORT_STATUS_001_TRANSPORT_SCREEN_DESKTOP_1440x900.png` |

Transport table programmatically checked in capture script (no raw enums; German labels present).

**Narrow viewport (480×900):** labels are short; no layout regression observed in scope — **PASS (not material to this slice)**.

---

## L. Scoped raw-enum audit

Owned surfaces (Transport job status cells; World region Transport row values):

**Active raw `WAITING` / `IN_PROGRESS` / `COMPLETED` / `CANCELLED` presentation:** **0**

---

## M. Root gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** (0 errors, **144** warnings) |
| `pnpm test` | **PASS** — **282** files / **1062** tests |
| `pnpm build:web` | **PASS** |

---

## N. Deferred semantic families

| Family | Status |
|--------|--------|
| Route-ID in transport inspector | **Deferred** (explicit out of scope) |
| Research job status enums | **Deferred** |
| Production operational status | **Deferred** |
| Building category / building status on World | **Deferred** |
| **WORKFORCE-GUIDANCE-001** | **Next queued slice** |
| Scenario-B art | **Paused** |

---

## O. Final decision — OPTION A

> **TRANSPORT-STATUS-001:**  
> `CLOSE CANDIDATE / PASS`

> **PLAYER-FACING STATUS AUTHORITY:**  
> `TransportOrderStatus → formatTransportStatus`

> **TRANSPORT SCREEN:**  
> `PASS`

> **WORLD TRANSPORT ROWS:**  
> `PASS`

> **SUMMARY SEMANTICS:**  
> `PASS — INTERNAL STATUS`

> **GAMEPLAY:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **ART:**  
> `NONE`

> **WORKFORCE-GUIDANCE-001:**  
> `DEFERRED / NEXT QUEUED SLICE`

> **COMMIT / PUSH / TAG:**  
> `NONE`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## Required factual questions (prompt §29)

| # | Answer |
|---|--------|
| 1–4 | `master`; baseline `c0395d9…`; `origin/master` matched at start; unrelated WIP excluded |
| 5–6 | `TransportOrderStatus`; `WAITING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| 7–10 | Warteschlange; Unterwegs; Abgeschlossen; Abgebrochen; unknown → passthrough |
| 11–13 | `formatTransportStatus`; no duplicate maps |
| 14–15 | `mapTransportJobRowsViewData`; `mapWorldRegionOperationsViewData` |
| 16–22 | Yes; yes; internal `status`; yes; no German comparisons; counts correct in tests |
| 23–27 | No simulation/routing/save/API change |
| 28–35 | Company dashboard unchanged; resource/building labels unchanged; Route-ID/Research/Production/BuildingCategory/Workforce out of scope |
| 36–40 | Formatter, mapper, summary, World tests added/updated; **PASS** |
| 41–42 | Transport runtime **PASS** (PNG); World **PASS** (mapper + test; PNG optional) |
| 43–44 | Raw enums **absent** on owned surfaces |
| 45 | Narrow check **PASS** (non-material) |
| 46 | Scoped raw enum count **0** |
| 47–52 | typecheck/lint/test/build **PASS**; **1062** tests |
| 53–54 | No task regressions; unrelated WIP untouched |
| 55–57 | No sealed family reopen; no art; Scenario-B paused |
| 58–60 | Ready for independent review; deferrals listed; **no commit/push/tag** |
