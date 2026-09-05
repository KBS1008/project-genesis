// @vitest-environment jsdom

import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PGInventoryWidget } from '@/presentation/components/dashboard/PGInventoryWidget';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('PGInventoryWidget', () => {
  it('uses compact resource-table headers with full accessible names', () => {
    renderPresentation(
      <PGInventoryWidget
        siteRows={[
          { id: 'wood', cells: ['Holz', '0', '10'], searchText: 'Holz' },
          { id: 'iron_ore', cells: ['Eisenerz', '5', '15'], searchText: 'Eisenerz' },
        ]}
        warehouseBlocks={[
          {
            id: 'warehouse-1',
            buildingLabel: 'Lager',
            summaryRow: { id: 'warehouse-1', cells: ['Lager', '1', '5'], searchText: 'Lager' },
            detailRows: [{ id: 'planks', cells: ['Bretter', '0', '5'], searchText: 'Bretter' }],
          },
        ]}
      />,
    );

    const siteTable = screen.getByRole('table', { name: 'Standort-Inventar' });
    const reservedHeader = within(siteTable).getByRole('columnheader', { name: 'Reserviert' });
    const availableHeader = within(siteTable).getByRole('columnheader', { name: 'Verfügbar' });

    expect(within(siteTable).getByRole('columnheader', { name: 'Ressource' })).toHaveTextContent('Ressource');
    expect(reservedHeader).toHaveTextContent('Res.');
    expect(reservedHeader).toHaveAttribute('title', 'Reserviert');
    expect(availableHeader).toHaveTextContent('Verf.');
    expect(availableHeader).toHaveAttribute('title', 'Verfügbar');
    expect(within(siteTable).queryByText('Reserviert')).toBeNull();
    expect(within(siteTable).queryByText('Verfügbar')).toBeNull();

    const warehouseDetail = screen.getByRole('table', { name: 'Lager Lager' });
    expect(within(warehouseDetail).getByRole('columnheader', { name: 'Reserviert' })).toHaveTextContent('Res.');
    expect(within(warehouseDetail).getByRole('columnheader', { name: 'Verfügbar' })).toHaveTextContent('Verf.');
    expect(within(warehouseDetail).getByText('Bretter')).toBeInTheDocument();

    const warehouseSummary = screen.getByRole('table', { name: 'Lagerhäuser' });
    expect(within(warehouseSummary).getByRole('columnheader', { name: 'Lagerhaus' })).toBeInTheDocument();
    expect(within(warehouseSummary).getByRole('columnheader', { name: 'Zeilen' })).toBeInTheDocument();
    expect(within(warehouseSummary).getByRole('columnheader', { name: 'Einheiten' })).toBeInTheDocument();
    expect(within(warehouseSummary).queryByText('Res.')).toBeNull();
    expect(within(warehouseSummary).queryByText('Verf.')).toBeNull();
  });
});
