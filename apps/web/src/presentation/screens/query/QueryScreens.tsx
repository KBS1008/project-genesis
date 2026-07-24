'use client';

import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { Card } from '@/presentation/primitives/Card';
import { mapFinanceRowsViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { fetchFinanceTransactions } from '@/presentation/adapters/api/query-client';
import type { FinanceRowViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import { useScreenQuery } from '@/presentation/hooks/useScreenQuery';
import { QueryRows } from '@/presentation/screens/shared/QueryRows';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';

/** Finance screen backed by finance transaction queries. */
export function FinanceScreen() {
  const { viewData } = useGameWorkspace();
  const { data, isLoading, errorMessage } = useScreenQuery(
    'finance',
    () => fetchFinanceTransactions().then(mapFinanceRowsViewData),
    viewData.session.hasGame,
  );

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={isLoading}
      errorMessage={errorMessage}
      loadingLabel="Finanzdaten werden geladen…"
    >
      <Card title="Finanzen">
        <QueryRows
          columns={['Typ', 'Betrag', 'Saldo']}
          rows={(data ?? []).map((row: FinanceRowViewData) => ({
            id: row.id,
            cells: [row.typeLabel, row.amountLabel, row.balanceLabel],
          }))}
        />
      </Card>
    </ScreenQueryFrame>
  );
}
