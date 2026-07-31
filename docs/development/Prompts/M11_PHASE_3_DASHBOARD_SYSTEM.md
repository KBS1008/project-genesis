# PROJECT GENESIS

# M11 – PHASE 3
# DASHBOARD SYSTEM (CONSOLIDATION & PRODUCTION POLISH)

Status:
Ready to start (after usage reset)

Milestone:
M11

Phase:
3

Priority:
High

Baseline:
M11 PHASE 2 CLOSED (Gate 2 PASS)

Reference:
- `docs/architecture/reviews/M11_GATE_2_APPLICATION_SHELL_REVIEW.md`
- `docs/development/UI_FOUNDATION_GUIDE.md`
- `docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md` — Phase 3

Last known commit:
`de42928` (Gate 2 corrections, 756 tests)

------------------------------------------------------------
CONTEXT FOR THE NEXT RUN
------------------------------------------------------------

Phase 3 is **not a greenfield build**. Most dashboard deliverables from
`M11_VISUAL_PRODUCTION_PLAN.md` were already shipped in Phase 1:

| Already done (Phase 1) | Location |
|------------------------|----------|
| Executive Dashboard (DB-001) | `ExecutiveDashboardScreen.tsx` |
| PG widgets DB-002–DB-010 | `presentation/components/dashboard/` |
| KPI cards, status, finance, production, research, transport, company, reports | PG* components |
| View-data mappers | `executive-dashboard-view-mappers.ts` |
| Inspector (entity selection) | `PGInspectorPanel` in executive screen |
| Status bar, sidebar, shell | Phase 2 (`GameWorkspaceShell`) |

**Phase 3 mission:** Close the **dual-dashboard gap** and reach a single
production dashboard system — no parallel legacy CSS stack, no 1,100-line
operations monolith.

**Do NOT start World Module (M11 Phase 4)** in this phase.

------------------------------------------------------------
MISSION
------------------------------------------------------------

Consolidate and productionize the dashboard layer:

1. Migrate or replace `CompanyDashboardScreen` with PG components
2. Integrate charts per `CHART_GUIDELINES.md`
3. Remove legacy styling duplication (`dashboard.css`, `apps/web/src/components/`)
4. Unify overview + operations UX under one design system
5. Pass Dashboard Gate Review

------------------------------------------------------------
STEP 1 — REPOSITORY REVIEW (READ-ONLY FIRST)
------------------------------------------------------------

Review before writing code:

**Architecture & design**
- DD-039, DD-042, DD-044
- `UI_FOUNDATION_GUIDE.md`
- `CHART_GUIDELINES.md`
- `UI_COMPONENT_LIBRARY.md`
- Mockups: `docs/design/Mockups/dashboard/DB-*.png`

**Current dashboard split**
```text
CompanyScreen
  ├── CompanyOverviewScreen → ExecutiveDashboardScreen (PG widgets) ✅
  └── CompanyDashboardScreen (~1,100 lines, legacy) ❌ target for migration
```

**Legacy debt (from Gate 1 / Gate 2)**
- `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx`
- `apps/web/src/app/dashboard.css` (loaded in `globals.css`)
- `apps/web/src/components/` (14 files: charts, tables, tutorial)
- Hardcoded `rgba()` in `CompanyDashboardScreen` and `simulation-controls.css`
- Gameplay fallback `?? '5 %'` in legacy dashboard (Gate 1 C11)
- No chart widgets on executive dashboard

**Tests baseline:** 756 passing (`pnpm test`)

------------------------------------------------------------
STEP 2 — DEFINE TARGET ARCHITECTURE
------------------------------------------------------------

End state:

```text
CompanyScreen
  └── ExecutiveDashboardScreen (default)
        ├── PG* widgets (existing)
        ├── PGChart* or migrated TickHistoryCharts (new)
        ├── Operations panels (migrated from legacy, as PG widgets or sections)
        └── PGInspectorPanel (existing)
```

**Decision to make early:**
- **Option A (recommended):** Incremental migration — extract legacy
  `CompanyDashboardScreen` sections one-by-one into PG widget compositions;
  keep `view: overview | operations` toggle until parity reached.
- **Option B:** Replace operations view entirely with deep-linked PG inspector
  + widget drill-downs (larger UX change — requires ADR if scope grows).

Default: **Option A** unless audit shows a smaller path.

------------------------------------------------------------
STEP 3 — LEGACY MIGRATION (CORE WORK)
------------------------------------------------------------

Prioritized migration order:

| Priority | Legacy section | Target |
|----------|----------------|--------|
| P1 | Theme / loading overlay duplication | Use `ThemeProvider`, `LoadingState`, `PGWidgetSurface` |
| P2 | KPI / overview strips | Reuse `PGKpiCard`, `PGStatusPanel` |
| P3 | Production / research / transport tables | Reuse existing PG* widgets |
| P4 | Finance + charts | New `PGChartWidget` or wrap `TickHistoryCharts` with tokens |
| P5 | Employee hire/assign inline `callApi` | Typed command client + `runCommand` |
| P6 | Tutorial overlay | Move to `presentation/` or defer with ADR |

**Per section:**
- Map API data → view-data mapper (no DTOs in JSX)
- Replace `dashboard.css` classes with token CSS
- Delete migrated legacy markup
- Add component test per extracted panel

**Files likely touched:**
- `CompanyDashboardScreen.tsx` (shrink or remove)
- `CompanyScreen.tsx` (simplify routing when parity reached)
- `apps/web/src/app/dashboard.css` (reduce until removable)
- `apps/web/src/app/globals.css` (remove `dashboard.css` import when empty)
- `apps/web/src/components/*` (migrate or delete)
- New: `presentation/components/dashboard/PGChartWidget.tsx` (if needed)

------------------------------------------------------------
STEP 4 — CHART INTEGRATION
------------------------------------------------------------

Requirements (`CHART_GUIDELINES.md`):

- Charts consume view-data only (no raw tick arrays in JSX)
- Token-based colors (no hardcoded hex in chart components)
- Accessible labels / titles
- Responsive container

**Starting point:** `apps/web/src/components/TickHistoryCharts.tsx` — wrap or
refactor into `presentation/components/dashboard/`.

Wire into `ExecutiveDashboardScreen` via mapper extension
(`executive-dashboard-view-data.ts`).

------------------------------------------------------------
STEP 5 — SHARED OVERLAYS (PHASE 1 DEFERRAL)
------------------------------------------------------------

If time permits in Phase 3:

| Primitive | Purpose |
|-----------|---------|
| `PGLoadingOverlay` | Full-workspace loading (replace `.loading-overlay` in legacy screen) |
| `PGErrorOverlay` | Recoverable error surface (complement `PresentationErrorBoundary`) |

Not blocking Phase 3 gate if legacy screen is removed.

------------------------------------------------------------
STEP 6 — RUNTIME DATA
------------------------------------------------------------

Verify (same rules as Phase 2):

- No hardcoded player / company names
- No gameplay fallbacks (`'5 %'`, placeholder numbers)
- All dashboard values from view-data mappers
- KPI placeholders (`{{availableCash}}`) preserved per DD-042 where specified

------------------------------------------------------------
STEP 7 — TESTING
------------------------------------------------------------

Minimum new coverage:

| Area | Tests |
|------|-------|
| Migrated dashboard sections | Component tests per widget/panel |
| Chart widget | Render + a11y (axe) |
| CompanyScreen routing | Overview ↔ operations navigation |
| Regression | Executive dashboard + shell tests still pass |
| Snapshots | Key dashboard compositions (optional but recommended) |

Target: **no decrease** from 756 tests; aim +15–25.

Run: `pnpm test` before gate review.

------------------------------------------------------------
STEP 8 — DOCUMENTATION
------------------------------------------------------------

Create / update:

| Document | Action |
|----------|--------|
| `docs/development/DASHBOARD_IMPLEMENTATION_GUIDE.md` | **Create** |
| `IMPLEMENTATION_PROGRESS.md` | Update M11 Phase 3 row |
| `M11_VISUAL_PRODUCTION_PLAN.md` | Mark Phase 3 complete |
| `UI_FOUNDATION_GUIDE.md` | Update architecture diagram (single dashboard) |

------------------------------------------------------------
STEP 9 — GATE REVIEW (END OF PHASE)
------------------------------------------------------------

After implementation, run read-only audit:

Create: `docs/architecture/reviews/M11_GATE_3_DASHBOARD_REVIEW.md`

Verify:
- Single dashboard design system (no `dashboard.css` dependency)
- Legacy `CompanyDashboardScreen` removed or <200 lines wrapper
- Charts on executive dashboard
- Token compliance (no new hardcoded colors)
- Accessibility (axe on new chart widget)
- All tests passing

Gate decision: PASS | PASS WITH CORRECTIONS | FAIL

Final statement (exactly one):
`DASHBOARD SYSTEM READY`
or
`DASHBOARD CORRECTIONS REQUIRED`

------------------------------------------------------------
OUT OF SCOPE (DO NOT START)
------------------------------------------------------------

- World Module / map visualization (M11 Phase 4)
- News panel / tutorial entry (main-menu plan debt)
- NPC / gameplay systems
- Full `apps/web/src/components/` rewrite beyond dashboard-related files
- Pixel-perfect mockup matching (reference only)

------------------------------------------------------------
ESTIMATED EFFORT
------------------------------------------------------------

| Compared to Phase 2 | Notes |
|---------------------|-------|
| **Smaller** | Most widgets exist; work is migration + charts |
| **Risk** | `CompanyDashboardScreen` size — migrate incrementally |
| **Usage** | Plan 1–2 focused agent sessions; avoid big-bang rewrite |

Suggested session split:
1. Audit + P1–P2 migration (theme, KPI strips)
2. P3–P4 (tables, charts)
3. P5–P6 + tests + docs + gate review

------------------------------------------------------------
QUICK START PROMPT (COPY INTO NEXT CHAT)
------------------------------------------------------------

```
Implement M11 Phase 3 per docs/development/Prompts/M11_PHASE_3_DASHBOARD_SYSTEM.md

Baseline: de42928, Gate 2 PASS, 756 tests.

Start with read-only audit of CompanyDashboardScreen.tsx and list
migratable sections. Then migrate P1–P2 (theme/loading + KPI strips)
to PG components. Do not start World Module.
```

------------------------------------------------------------
CHECKLIST BEFORE YOU START
------------------------------------------------------------

- [ ] Cursor usage reset / sufficient budget (~30 %+ recommended)
- [ ] `git pull` — confirm `de42928` or later on `master`
- [ ] `pnpm test` — 756 green
- [ ] Read this briefing + `M11_GATE_2_APPLICATION_SHELL_REVIEW.md`
- [ ] Paste Quick Start Prompt into new agent session
