// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PGProductionWidget } from '@/presentation/components/dashboard/PGProductionWidget';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('PGProductionWidget', () => {
  it('renders authoritative production summary and navigates on job row click', async () => {
    const user = userEvent.setup();
    const onJobClick = vi.fn();

    renderPresentation(
      <PGProductionWidget
        activeCount={2}
        hint="1 wartet auf Material"
        jobs={[
          {
            id: 'production_001',
            buildingLabel: 'Sägewerk Nord',
            recipeLabel: 'Bretter herstellen',
            statusLabel: 'Energie fehlt',
            progressLabel: '42%',
          },
        ]}
        selectedJobId="production_001"
        onJobClick={onJobClick}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Produktion' })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1 wartet auf Material')).toBeInTheDocument();
    expect(screen.getByText('Sägewerk Nord')).toBeInTheDocument();
    expect(screen.getByText('Energie fehlt')).toBeInTheDocument();

    await user.click(screen.getByRole('row', { name: /Energie fehlt/ }));

    expect(onJobClick).toHaveBeenCalledWith('production_001');
  });

  it('shows empty state when no jobs are active', () => {
    renderPresentation(<PGProductionWidget activeCount={0} jobs={[]} />);

    expect(screen.getByText('Keine aktiven Produktionsjobs')).toBeInTheDocument();
  });
});
