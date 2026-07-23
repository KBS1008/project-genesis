'use client';

import {
  PRIMARY_SCREENS,
  type PrimaryScreenId,
} from '@/presentation/navigation/primary-screens';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** Keyboard-accessible primary navigation for the game workspace. */
export function PrimaryNavigation() {
  const { navigation, navigateToScreen } = useGameWorkspace();

  return (
    <nav className="pg-primary-nav" aria-label="Hauptnavigation">
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
