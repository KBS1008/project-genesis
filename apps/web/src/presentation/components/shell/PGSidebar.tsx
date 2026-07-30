'use client';

import {
  PRIMARY_SCREENS,
  type PrimaryScreenId,
} from '@/presentation/navigation/primary-screens';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

function resolveAdjacentScreen(current: PrimaryScreenId, offset: number): PrimaryScreenId {
  const currentIndex = PRIMARY_SCREENS.findIndex((screen) => screen.id === current);
  const nextIndex =
    (currentIndex + offset + PRIMARY_SCREENS.length) % PRIMARY_SCREENS.length;
  return PRIMARY_SCREENS[nextIndex]?.id ?? current;
}

/** Vertical left-rail navigation for the game workspace (DD-044 / DD-045). */
export function PGSidebar() {
  const { navigation, navigateToScreen } = useGameWorkspace();

  return (
    <nav
      className="pg-sidebar"
      aria-label="Hauptnavigation"
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          navigateToScreen(resolveAdjacentScreen(navigation.screen, 1));
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          navigateToScreen(resolveAdjacentScreen(navigation.screen, -1));
          return;
        }

        if (event.key === 'Home') {
          event.preventDefault();
          navigateToScreen(PRIMARY_SCREENS[0]!.id);
          return;
        }

        if (event.key === 'End') {
          event.preventDefault();
          navigateToScreen(PRIMARY_SCREENS.at(-1)!.id);
        }
      }}
    >
      <p className="pg-sidebar-title">Navigation</p>
      {PRIMARY_SCREENS.map((screen) => {
        const isActive = navigation.screen === screen.id;

        return (
          <button
            key={screen.id}
            type="button"
            className={`pg-sidebar-link${isActive ? ' is-active' : ''}`.trim()}
            aria-current={isActive ? 'page' : undefined}
            title={screen.description}
            onClick={() => {
              navigateToScreen(screen.id);
            }}
          >
            {screen.label}
          </button>
        );
      })}
    </nav>
  );
}
