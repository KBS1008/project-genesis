// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResearchScreen } from '@/presentation/screens/research/ResearchScreen';

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  useScreenQuery: () => ({
    data: [],
    isLoading: false,
    errorMessage: null,
  }),
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true },
      simulation: { tickNumber: 2 },
    },
    companyViewData: {
      completedResearchLabels: [],
      labels: {
        resource: (id: string) => id,
        building: (id: string) => id,
        recipe: (id: string) => id,
        technology: (id: string) => id,
        employee: (id: string) => id,
      },
      hints: {
        research: [
          {
            technologyId: 'basic_woodworking',
            name: 'Basic Woodworking',
            canStart: false,
            reason: 'Meilenstein „profit_100“ fehlt.',
          },
        ],
      },
      detail: {
        researchJobs: new Map(),
      },
    },
    isBusy: false,
    runCommand: vi.fn(),
  }),
}));

describe('ResearchScreen', () => {
  it('renders research catalog with prerequisite messaging', () => {
    render(<ResearchScreen />);

    expect(screen.getByText('Forschungskatalog')).toBeInTheDocument();
    expect(screen.getByText('Basic Woodworking')).toBeInTheDocument();
    expect(screen.getByText('Meilenstein „profit_100“ fehlt.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Forschung starten' })).toBeDisabled();
  });
});
