// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PGTutorialPanel } from '@/presentation/components/dashboard/PGTutorialPanel';

const navigateTutorialStep = vi.fn();

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    navigateTutorialStep,
    isBusy: false,
  }),
}));

describe('PGTutorialPanel', () => {
  it('renders contextual navigation for incomplete steps only', () => {
    navigateTutorialStep.mockClear();

    render(
      <PGTutorialPanel
        tutorial={{
          completed: false,
          activeStepId: 'build_sawmill',
          steps: Object.freeze([
            Object.freeze({
              id: 'open_plot',
              title: 'Grundstück öffnen',
              description: 'Done',
              completed: true,
            }),
            Object.freeze({
              id: 'build_sawmill',
              title: 'Sägewerk bauen',
              description: 'Place sawmill',
              completed: false,
            }),
          ]),
        }}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Gebäude öffnen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Markt öffnen' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Gebäude öffnen' }));
    expect(navigateTutorialStep).toHaveBeenCalledWith('build_sawmill');
  });

  it('omits CTAs on completed tutorial checklist rows', () => {
    render(
      <PGTutorialPanel
        tutorial={{
          completed: false,
          activeStepId: 'buy_wood',
          steps: Object.freeze([
            Object.freeze({
              id: 'build_sawmill',
              title: 'Sägewerk bauen',
              description: 'Done',
              completed: true,
            }),
          ]),
        }}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Gebäude öffnen' })).toBeNull();
  });
});
