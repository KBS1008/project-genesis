'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import {
  getPrimaryScreenDefinition,
  type PrimaryScreenId,
} from '@/presentation/navigation/primary-screens';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

function PlaceholderScreen({ screenId }: { readonly screenId: PrimaryScreenId }) {
  const screen = getPrimaryScreenDefinition(screenId);
  const { session, navigation, selectEntity } = useGameWorkspace();

  return (
    <div className="pg-screen-placeholder">
      <Card title={screen.label}>
        <EmptyState
          title={session.hasGame ? `${screen.label} — Inhalt folgt in M9 Phase 3+` : 'Noch keine Session aktiv'}
          hint={
            session.hasGame
              ? screen.description
              : 'Wechseln Sie zu Unternehmen und starten Sie ein neues Spiel.'
          }
        />
        {session.hasGame ? (
          <p className="pg-workspace-subtitle">
            Navigationszustand: <strong>{navigation.screen}</strong>
            {navigation.entitySelection.kind !== 'none'
              ? ` · Auswahl ${navigation.entitySelection.kind}:${navigation.entitySelection.id}`
              : ''}
          </p>
        ) : null}
        {screenId === 'world' && session.hasGame ? (
          <button
            type="button"
            className="pg-button pg-button-secondary"
            onClick={() => {
              selectEntity({ kind: 'region', id: 'demo-region' });
            }}
          >
            Demo-Region auswählen (wird nach Refresh entfernt)
          </button>
        ) : null}
      </Card>
    </div>
  );
}

/** Routes primary navigation screens inside the game workspace. */
export function ScreenRouter() {
  const { navigation } = useGameWorkspace();

  switch (navigation.screen) {
    case 'company':
      return <DashboardShell hideHeader />;
    case 'world':
    case 'markets':
    case 'production':
    case 'buildings':
    case 'research':
    case 'transport':
    case 'finance':
    case 'reports':
      return <PlaceholderScreen screenId={navigation.screen} />;
    default:
      return <DashboardShell hideHeader />;
  }
}
