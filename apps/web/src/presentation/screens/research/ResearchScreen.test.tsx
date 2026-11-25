// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResearchScreen } from '@/presentation/screens/research/ResearchScreen';

const selectEntity = vi.fn();
const defaultNavigation = { screen: 'research' as const, entitySelection: { kind: 'none' as const } };
vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
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
      completedResearchUnlocks: [
        {
          technologyId: 'basic_woodworking',
          name: 'Basic Woodworking',
          outcomes: [
            {
              contentId: 'recipe_advanced_planks',
              name: 'Advanced Plank Production',
              kind: 'recipe',
              kindLabel: 'Rezept',
              progressionEligible: false,
              statusLabel: 'Weitere Voraussetzungen',
              progressionBlockerReason: 'Meilenstein „First Production“ fehlt.',
            },
          ],
        },
      ],
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
            reason: 'Meilenstein „Steady Sales“ fehlt.',
          },
        ],
      },
      detail: {
        researchJobs: new Map(),
      },
    },
    isBusy: false,
    runCommand: vi.fn(),
    navigation: defaultNavigation,
    selectEntity,
    researchCatalogFocusTechnologyId: null,
    clearResearchCatalogFocus: vi.fn(),
  }),
}));

describe('ResearchScreen', () => {
  it('renders completed research unlock outcomes without marking blocked recipes available', () => {
    render(<ResearchScreen />);

    expect(screen.getByLabelText('Freischaltungen für Basic Woodworking')).toHaveTextContent(
      'Advanced Plank Production',
    );
    expect(screen.getByLabelText('Freischaltungen für Basic Woodworking')).toHaveTextContent(
      'Weitere Voraussetzungen — Meilenstein „First Production“ fehlt.',
    );
    expect(screen.queryByText(/^Verfügbar$/)).not.toBeInTheDocument();
  });

  it('renders research catalog with prerequisite messaging', () => {
    render(<ResearchScreen />);

    expect(screen.getByText('Forschungskatalog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Forschungskatalog' }).parentElement).toHaveTextContent(
      'Basic Woodworking',
    );
    expect(screen.getByText('Meilenstein „Steady Sales“ fehlt.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Forschung starten' })).toBeDisabled();
  });
});
