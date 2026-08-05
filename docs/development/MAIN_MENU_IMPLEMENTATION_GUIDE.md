# Main Menu Implementation Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 2 — Application Shell & Main Menu  
**Audience:** Frontend developers working on boot flow and menu screens

---

## Overview

M11 Phase 2 delivers the production application shell (DD-045) and the complete main menu flow (MM-001–MM-007). All screens compose from the Phase 1 design system — no screen-local color or spacing values.

---

## Boot Flow

```text
ApplicationShell (ThemeProvider, dialogs, notifications)
  └── MainMenuScreen
        ├── SplashScreen        (MM-006)
        ├── MenuLoadingScreen   (MM-007)
        └── MainMenuHome        (MM-001)
              ├── NewGamePanel   (MM-002)
              ├── LoadGamePanel  (MM-003)
              ├── SettingsPanel  (MM-004)
              └── CreditsPanel   (MM-005)
```

Phase transitions are managed by `useMenuBootstrap()`:

1. **Splash** — fixed duration (`MENU_SPLASH_DURATION_MS`)
2. **Loading** — fetches `/api/session/status` with minimum display time
3. **Home** — renders menu actions with runtime continue availability

---

## Runtime Data

| Screen | Data source |
|--------|-------------|
| Continue | `fetchSessionStatus()` → `hasActiveSession`, `companyName` |
| New Game | User input → `startNewGame({ name })` |
| Load Game | `fetchSaveList()` → save slot view-data |
| Settings | `useTheme()` + `menu-settings.ts` (localStorage) |
| Credits | `menu-credits-data.ts` + `package.json` version |
| Version footer | `package.json` version |

No hardcoded company names, player names, or save metadata in components.

---

## Application Shell

`GameWorkspaceShell` layout (DD-044):

```text
WorkspaceHeader (search, save, main menu)
├── PGSidebar (vertical navigation)
├── WorkspaceMain (simulation controls, content, context menu)
└── PGStatusBar
```

DD-045 components:

| Component | Path | Purpose |
|-----------|------|---------|
| `PGSidebar` | `components/shell/PGSidebar.tsx` | Left-rail primary navigation |
| `PGGlobalSearch` | `components/shell/PGGlobalSearch.tsx` | Command palette (Ctrl/Cmd+K) |
| `PGContextMenu` | `components/shell/PGContextMenu.tsx` | Workspace context actions |

Providers: `GlobalSearchProvider`, `ContextMenuProvider` (scoped to game workspace).

Global search indexes:

- All `PRIMARY_SCREENS` entries
- Runtime entities from `companyViewData` and `regions` via `buildGlobalSearchIndex()`

---

## Settings

`menu-settings.ts` persists:

- `menuAnimationsEnabled` — toggles menu transition CSS (respects `prefers-reduced-motion`)

Theme is managed by `ThemeProvider` (`pg-theme` in localStorage).

---

## Animations

Menu animations use design tokens:

- `--duration-normal`, `--duration-slow`, `--ease-emphasized`
- Classes: `pg-menu-animate-in`, `pg-main-menu-animated`
- Disabled when `prefers-reduced-motion: reduce` or menu setting is off

---

## Visual assets (Phase 4C)

Approved menu backgrounds are served from `/assets/main-menu/` via the visual asset registry:

| Screen | Asset ID | Component |
|--------|----------|-----------|
| Splash | MM-006 | `SplashScreen` + `PGVisualAssetBackground` |
| Loading | MM-007 | `MenuLoadingScreen` |
| Home | MM-001 | `MainMenuScreen` |

Preload: `useVisualAssetPreload(PRELOAD_VISUAL_ASSET_IDS)` on menu mount. UI text remains React strings — PNGs are decorative backgrounds only.

See `VISUAL_ASSET_INTEGRATION_GUIDE.md`.

---

## Testing

| Test file | Coverage |
|-----------|----------|
| `shell-components.test.tsx` | Sidebar, search, context menu interactions |
| `shell-components.a11y.test.tsx` | axe violations for shell primitives |
| `build-global-search-index.test.ts` | Search index builder |
| `main-menu.test.tsx` | Splash → loading → home, navigation, continue |
| `PrimaryNavigation.test.tsx` | Sidebar keyboard navigation (via wrapper) |

Run: `pnpm exec vitest run apps/web/src/presentation/components/shell apps/web/src/presentation/screens/menu`

---

## Mockup References

Visual references only (do not embed PNG text):

- `docs/design/Mockups/main-menu/MM-001_Main_Menu.png`
- `docs/design/Mockups/main-menu/MM-002_New_Game_Dialog.png`
- … through MM-007

---

## Related Documents

- `docs/development/UI_FOUNDATION_GUIDE.md` — Phase 1 design system
- `docs/architecture/adr/DD-045 – M11 Phase 1 Shell Component Deferrals.md`
- `docs/architecture/reviews/M11_PHASE2_IMPLEMENTATION_REPORT.md`
