// @vitest-environment jsdom

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { MainMenuScreen } from '@/presentation/screens/menu/MainMenuScreen';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock('@/presentation/adapters/api/query-client', () => ({
  fetchSessionStatus: vi.fn(async () => ({
    hasActiveSession: true,
    companyId: 'company-1',
    companyName: 'Nordindustrie AG',
    playerId: 'player-1',
    savePath: 'saves/browser-session.json',
  })),
}));

describe('MainMenuScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    push.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs splash and loading phases before showing the home menu', async () => {
    renderPresentation(<MainMenuScreen />);

    expect(screen.getByLabelText('Project Genesis wird geladen')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.getByText('Hauptmenü wird vorbereitet…')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(700);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Neues Spiel' })).toBeInTheDocument();
    });

    expect(screen.getByText(/Fortsetzen als Nordindustrie AG/)).toBeInTheDocument();
  });

  it('navigates to sub-panels and supports continue', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderPresentation(<MainMenuScreen />);

    await act(async () => {
      vi.advanceTimersByTime(2300);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Einstellungen' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Einstellungen' }));
    expect(screen.getByRole('heading', { name: 'Einstellungen' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Zurück' }));
    await user.click(screen.getByRole('button', { name: 'Fortsetzen' }));

    expect(push).toHaveBeenCalledWith('/game');
  });
});
