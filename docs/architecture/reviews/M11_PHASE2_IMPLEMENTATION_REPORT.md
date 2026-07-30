# M11 Phase 2 — Application Shell & Main Menu Implementation Report

**Date:** 2026-07-30  
**Milestone:** M11 — Visual Production & User Experience  
**Spec:** `docs/development/Prompts/M11_PHASE_2_APPLICATION_SHELL_AND_MAIN_MENU.md`  
**Baseline:** M11 Phase 1 CLOSED (`M11_GATE_1_DELTA_REVIEW.md`)

---

## Executive Summary

M11 Phase 2 completes the production application shell and main menu. DD-045 deferred components (`PGSidebar`, `PGGlobalSearch`, `PGContextMenu`) are implemented and integrated into `GameWorkspaceShell`. The main menu delivers the full boot flow (splash → loading → home) and all MM-001–MM-007 screens with runtime session binding.

All new tests pass; full repository test count: **748**.

---

## Implemented Components (DD-045)

| Component | File | Notes |
|-----------|------|-------|
| PGSidebar | `components/shell/PGSidebar.tsx` | Vertical left rail; replaces horizontal tabs in shell |
| PGGlobalSearch | `components/shell/PGGlobalSearch.tsx` | Command palette with screen + entity results |
| PGContextMenu | `components/shell/PGContextMenu.tsx` | Accessible menu primitive |
| GlobalSearchProvider | `components/shell/GlobalSearchProvider.tsx` | Ctrl/Cmd+K shortcut |
| ContextMenuProvider | `components/shell/ContextMenuProvider.tsx` | Workspace right-click actions |
| buildGlobalSearchIndex | `components/shell/build-global-search-index.ts` | Runtime entity catalog indexing |

Styles: `components/shell/shell-components.css` (token-driven, responsive, reduced-motion).

---

## Shell Completion

`GameWorkspaceShell` now provides:

- Top bar with global search trigger, save, main menu return
- Left sidebar (`PGSidebar`)
- Workspace area with simulation controls, entity banner, routed content
- Status bar (`PGStatusBar`) with theme toggle
- Dialogs and notifications (existing `ApplicationShell` providers)
- Context menus on workspace surface
- Global search (keyboard + toolbar)
- Skip link and focus-visible styles (preserved from Phase 1)
- Dark theme via `ThemeProvider`
- Responsive layout (sidebar stacks below 1024px)

---

## Main Menu (MM-001–MM-007)

| ID | Screen | Component |
|----|--------|-----------|
| MM-001 | Main Menu | `MainMenuHome.tsx` |
| MM-002 | New Game | `NewGamePanel.tsx` (empty default company name) |
| MM-003 | Load Game | `LoadGamePanel.tsx` |
| MM-004 | Settings | `SettingsPanel.tsx` |
| MM-005 | Credits | `CreditsPanel.tsx` |
| MM-006 | Splash | `SplashScreen.tsx` |
| MM-007 | Loading | `MenuLoadingScreen.tsx` |

Orchestration: `MainMenuScreen.tsx` + `useMenuBootstrap.ts`.

Menu actions: New Game, Continue (runtime session), Load, Settings, Credits, Exit (notification).

---

## Runtime Data Verification

| Requirement | Status |
|-------------|--------|
| No hardcoded player names | ✓ Session from API |
| No hardcoded company names | ✓ Removed `DEFAULT_COMPANY_NAME` |
| No hardcoded save data | ✓ `fetchSaveList()` |
| No hardcoded settings | ✓ `ThemeProvider` + `menu-settings.ts` |

---

## Accessibility

- Sidebar: `aria-current`, keyboard ArrowUp/Down/Home/End
- Global search: dialog role, labelled input, listbox/options pattern
- Context menu: `role="menu"` / `menuitem`
- Menu screens: semantic headings, labelled forms, status regions
- axe tests for shell primitives (`shell-components.a11y.test.tsx`)
- `prefers-reduced-motion` respected for shell and menu animations

---

## Testing

| Suite | Tests added |
|-------|-------------|
| `build-global-search-index.test.ts` | 4 |
| `shell-components.test.tsx` | 4 |
| `shell-components.a11y.test.tsx` | 3 |
| `main-menu.test.tsx` | 2 |
| `PrimaryNavigation.test.tsx` | Updated for vertical nav |

**Total:** 748 tests passing (`pnpm test`).

---

## Performance

- Search index built via `useMemo` from existing workspace view-data (no extra API calls)
- Splash/loading timers are short and non-blocking
- Shell CSS uses token transitions only (no layout thrashing)

---

## Documentation

| Document | Action |
|----------|--------|
| `docs/development/MAIN_MENU_IMPLEMENTATION_GUIDE.md` | Created |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Updated (M11 Phase 2) |
| `docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md` | Updated (Phase 2 complete) |
| `docs/design/VISUAL_ASSET_CATALOG.md` | Updated (MM implementation notes) |

---

## Remaining Risks

- Global search entity labels depend on dashboard view-data freshness (same as entity selection validation)
- `Continue` navigates to `/game` assuming an active server session; no auto-load from `savePath`
- News panel and tutorial entry from M11 plan remain future scope

---

## Recommendations

1. Run M11 Phase 2 Gate Review before starting World Module
2. Consider exposing unified search API when entity count grows
3. Add E2E test for full menu → new game → workspace flow

---

APPLICATION SHELL READY
