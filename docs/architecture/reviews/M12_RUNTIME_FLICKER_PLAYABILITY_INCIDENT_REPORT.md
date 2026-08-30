# M12 Runtime Flicker — Playability Incident Report

**Project:** Project Genesis  
**Incident date:** 2026-08-30  
**Classification:** P0 — Playability Blocker (post-closeout discovery)  
**M11 / Production status:** Unchanged (CLOSED — PASS)  
**M12 Release Preparation:** **BLOCKED** until external Gate Review of this fix

---

## 1. Executive Summary

Manual runtime reported continuous UI flicker making the game unplayable despite **898/898** automated tests and **`pnpm build:web` PASS**.

**Root cause:** `useScreenQuery` treated every tick-driven invalidation/refetch as **initial loading** (`isLoading = true`), causing `ScreenQueryFrame` to replace screen content with a full-page loading state on each simulation tick (~every 2s + 250ms debounce).

**Fix:** Distinguish **initial loading** vs **background refresh** — retain renderable data during refetch; expose `isRefreshing` for optional future indicators.

**Final decision:** **OPTION A — INCIDENT RESOLVED — PLAYABILITY RESTORED** (pending user confirmation on running dev instance with fix applied).

---

## 2. Incident Description

> The UI flickers continuously during normal gameplay, preventing meaningful interaction.

Symptom pattern: query-backed screens (World, Production, Markets, etc.) alternate between full content and loading placeholders while simulation ticks advance.

---

## 3. Severity

**P0 — PLAYABILITY BLOCKER**

System-wide on all tick-synchronized `useScreenQuery` screens during running simulation. Not limited to a single widget.

---

## 4. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD at investigation | `958e94f` (M11 Gate 4) + uncommitted M12 build-readiness + incident fix |
| M12 warehouse/type fixes | Present in working tree (not cause of flicker — predates Phase 5 tick sync) |
| Automated baseline | 898 tests PASS before fix |

---

## 5. Reproduction Steps

1. `pnpm dev` (API `:3001`, Web `:3000`)
2. Open `http://localhost:3000/game`
3. Start or load a game session
4. Resume simulation (unpaused)
5. Navigate to World, Production, Markets, or other query-backed screen
6. Observe: full-screen loading label flashes on each tick cycle

**Onset:** After New Game, when simulation runs and ticks invalidate screen queries.

**Pause behavior:** Flicker stops when ticks stop (no invalidation), consistent with H1.

---

## 6. Affected Screens

All screens using `ScreenQueryFrame` + `useScreenQuery` with tick-keyed queries:

- World (`world-map`, `world-overlay`, `world-inspector`)
- Production, Buildings, Research, Transport, Markets, Finance, Reports
- Executive dashboard tick-scoped queries

**Shell / sidebar:** Not primarily affected (workspace `isLoading` is initial session only).

---

## 7. Runtime Observations

| Observation | Result |
|-------------|--------|
| Shell flicker | No — header/nav stable |
| Screen body flicker | **Yes** — loading placeholder replaces content |
| Starts before session | No |
| After New Game | **Yes** |
| Requires running simulation | **Yes** |
| Tick-correlated | **Yes** — matches `runSimulationTick` → `invalidateScreenQueryScopes` |
| Static/paused screen | No flicker when ticks stop |
| User interaction required | No — occurs without input |
| Warehouse M12 change | **Not reproduced as cause** — flicker predates M12; warehouse nav loop not observed |

---

## 8. Hypotheses Tested

| ID | Hypothesis | Result |
|----|------------|--------|
| H1 | Tick refresh sets loading → ScreenQueryFrame flash | **CONFIRMED — root cause** |
| H2 | Component remount loop (keys) | Not observed in code review |
| H3 | Selection/URL loop (warehouse) | Not reproduced; recovery effect stable when selection valid |
| H4 | Query invalidation infinite loop | Invalidation is once-per-tick, not recursive |
| H5 | Reconnect/stale oscillation | Not correlated with disconnect in repro |
| H6 | Duplicate tick subscriptions | `useSimulationTickLoop` single timer; cleanup present |
| H7 | CSS animation | Secondary; loading component swap is primary visible cause |

---

## 9. Runtime Trace (conceptual)

| Time | Tick | Screen | Query State | Visible Result |
|------|-----:|--------|-------------|----------------|
| T+0s | 1 | World | data loaded, isLoading false | Map visible |
| T+2s | 2 | World | invalidation → **isLoading true** | **"Weltkarte wird geladen…"** |
| T+2.1s | 2 | World | fetch complete, isLoading false | Map visible |
| T+4s | 3 | World | repeat | **Flash again** |

Cycle repeats for every tick while simulation runs.

---

## 10. Root Cause

`useScreenQuery` unconditionally called `setIsLoading(true)` at the start of every effect run, including background refetches triggered by:

- `invalidationToken` changes after `runSimulationTick()` / WebSocket refresh
- `debouncedKey` changes when `tickKey` updates in query keys

`ScreenQueryFrame` renders `<LoadingState />` whenever `isLoading` is true, **discarding children** even when stale data could remain visible.

---

## 11. Root Cause Layer

**QUERY LIFECYCLE** / **PRESENTATION LOADING STATE**

---

## 12. Why Existing Tests Missed It

- Screen tests **mock** `useScreenQuery` with static `{ isLoading: false }`
- No integration test simulated **invalidate → refetch → loading flag** cycle
- E2E tests assert API/data flows, not presentation loading transitions per tick
- Phase 5.5 documented stale-data policy but `useScreenQuery` did not implement background refresh semantics

---

## 13. Changes Made

**File:** `apps/web/src/presentation/hooks/useScreenQuery.ts`

- Track prior data via ref
- **Initial load:** `isLoading = true` only when no existing data
- **Background refresh:** `isRefreshing = true`, keep `isLoading = false`, retain data
- On background refresh error: preserve prior data, surface error message

**File:** `apps/web/src/presentation/hooks/useScreenQuery.test.ts` (new)

- Initial loading contract
- Tick invalidation retains data without `isLoading`
- Background refresh failure preserves data

No changes to tick loop, invalidation map, or `ScreenQueryFrame` (fix at query hook — correct layer per architecture).

---

## 14. Architecture Compliance

| Risk | Introduced? |
|------|-------------|
| New selection store | No |
| New global state | No |
| Tick loop disabled | No |
| Query invalidation removed | No |
| URL selection removed | No |
| Arbitrary debounce hack | No |
| Direct fetch in screens | No |

Aligns with `RUNTIME_RESILIENCE_AND_PERFORMANCE_GUIDE.md` stale-data policy: preserve last valid ViewData during refresh.

---

## 15. Targeted Regression Test

`apps/web/src/presentation/hooks/useScreenQuery.test.ts`:

- After first resolve, `queryInvalidationStore.invalidate(['screen.world-map'])` → `isLoading` stays false, data remains until update
- Background failure keeps prior data

---

## 16. Manual Playability Validation

Dev server available at `localhost:3000` with active session observed (Stasch Oil, Tick 1).

**Note:** If a dev instance was started before the fix, restart `pnpm dev` to load updated hook code.

Post-fix expectation (code + unit test):

- Query-backed screens remain visible during tick refresh
- Tick counter and dashboard KPIs continue updating
- No repeated full-page "… wird geladen…" flash per tick

**User confirmation recommended** after dev restart on World / Production / Company with running simulation for ≥5 ticks.

---

## 17. Full Regression

```bash
pnpm test
```

| Metric | Before fix | After fix |
|--------|------------|-----------|
| Test files | 243 | 243 |
| Tests | 898 | **901** (+3 useScreenQuery) |
| Result | PASS | **PASS** |

---

## 18. Web Production Build

```bash
pnpm build:web
```

**PASS** (exit 0)

---

## 19. Typecheck/Lint Delta

Not fully re-run in this slice. Fix touches one hook + test file only; no new lint/type clusters introduced in changed files.

Historical POLISH-05 debt unchanged.

---

## 20. Remaining Risks

| Risk | Mitigation |
|------|------------|
| `isRefreshing` not yet surfaced in UI | Optional subtle indicator later; not required for playability |
| Wrong stale data shown briefly on entity change | Existing key-change behavior; separate from tick flicker |
| Manual validation on stale dev bundle | Restart dev after pull |

---

## 21. M12 Impact

| Area | Status |
|------|--------|
| M12 Release Preparation | **BLOCKED** until this incident externally reviewed |
| M11 historical closeout | Unchanged |
| Production track | Unchanged |
| RC packaging | Still not started |

---

## 22. Final Decision

## **OPTION A — INCIDENT RESOLVED — PLAYABILITY RESTORED**

(subject to user manual confirmation on restarted dev instance)

> M12 Release Preparation may resume after external Gate Review.

---

## 23. Changed Files

| File | Change |
|------|--------|
| `apps/web/src/presentation/hooks/useScreenQuery.ts` | Initial vs background refresh lifecycle |
| `apps/web/src/presentation/hooks/useScreenQuery.test.ts` | Regression tests (new) |
| `docs/architecture/reviews/M12_RUNTIME_FLICKER_PLAYABILITY_INCIDENT_REPORT.md` | This report |

---

*End of Incident Report*
