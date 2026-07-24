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

/** Keyboard-accessible primary navigation for the game workspace. */
export function PrimaryNavigation() {
  const { navigation, navigateToScreen } = useGameWorkspace();

  return (
    <nav
      className="pg-primary-nav"
      aria-label="Hauptnavigation"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          navigateToScreen(resolveAdjacentScreen(navigation.screen, 1));
          return;
        }

        if (event.key === 'ArrowLeft') {
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
      {PRIMARY_SCREENS.map((screen) => {
        const isActive = navigation.screen === screen.id;

        return (
          <button
            key={screen.id}
            type="button"
            className={`pg-primary-nav-link${isActive ? ' is-active' : ''}`.trim()}
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

/** Returns the label for a primary screen id. */
export function labelPrimaryScreen(screenId: PrimaryScreenId): string {
  return PRIMARY_SCREENS.find((screen) => screen.id === screenId)?.label ?? screenId;
}
