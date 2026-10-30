// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PGMilestonesWidget } from '@/presentation/components/dashboard/PGMilestonesWidget';
import type { MilestoneRowViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

const SAMPLE_MILESTONES: readonly MilestoneRowViewData[] = Object.freeze([
  Object.freeze({
    id: 'first_production',
    displayName: 'First Production With A Long Name',
    completed: false,
    criteriaSummary: 'Schließen Sie 1 Produktionsauftrag ab.',
    requiredByLabels: Object.freeze(['Gebäude: Schmelze']),
    requiredByOverflowCount: 0,
    requiredByDisplayLabel: 'Gebäude: Schmelze',
  }),
  Object.freeze({
    id: 'first_profit',
    displayName: 'First Profit',
    completed: true,
    criteriaSummary: 'Tätigen Sie den ersten Verkauf.',
    requiredByLabels: Object.freeze([]),
    requiredByOverflowCount: 0,
    requiredByDisplayLabel: 'Keine direkten Abhängigkeiten in den Inhaltsdaten.',
  }),
]);

describe('PGMilestonesWidget', () => {
  it('renders full milestone names, criteria, dependencies and status labels', () => {
    render(<PGMilestonesWidget milestones={SAMPLE_MILESTONES} />);

    expect(screen.getByText('First Production With A Long Name')).toBeInTheDocument();
    expect(screen.getByText('Schließen Sie 1 Produktionsauftrag ab.')).toBeInTheDocument();
    expect(screen.getByText('Gebäude: Schmelze')).toBeInTheDocument();
    expect(screen.getByText('Ausstehend')).toBeInTheDocument();
    expect(screen.getByText('Erreicht')).toBeInTheDocument();
    expect(screen.getAllByText('Voraussetzung').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Benötigt für').length).toBeGreaterThan(0);
  });

  it('filters milestones via search without hiding accessible text in matches', async () => {
    const user = userEvent.setup();

    render(<PGMilestonesWidget milestones={SAMPLE_MILESTONES} />);

    await user.type(screen.getByPlaceholderText('Meilensteine suchen…'), 'Schmelze');

    expect(screen.getByText('First Production With A Long Name')).toBeInTheDocument();
    expect(screen.queryByText('First Profit')).not.toBeInTheDocument();
  });

  it('uses responsive stacked layout instead of wide query table columns', () => {
    const { container } = render(<PGMilestonesWidget milestones={SAMPLE_MILESTONES} />);

    expect(container.querySelector('.pg-milestone-progress-list')).not.toBeNull();
    expect(container.querySelector('.pg-query-table-wide')).toBeNull();
  });
});
