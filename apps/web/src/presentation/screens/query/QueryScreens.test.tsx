// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FinanceScreen } from '@/presentation/screens/query/QueryScreens';

const { useScreenQueryMock } = vi.hoisted(() => ({
  useScreenQueryMock: vi.fn(() => ({
    data: [
      {
        id: 'tx-1',
        typeLabel: 'Einnahme',
        amountLabel: '+100 GC',
        balanceLabel: '1.100 GC',
      },
    ],
    isLoading: false,
    errorMessage: null,
  })),
}));

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
  useScreenQuery: useScreenQueryMock,
}));

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true },
      simulation: { tickNumber: 12 },
    },
  }),
}));

describe('FinanceScreen', () => {
  it('uses a tick-aware query key and debounce options', () => {
    render(<FinanceScreen />);

    expect(useScreenQueryMock).toHaveBeenCalledWith(
      'finance:12',
      expect.any(Function),
      true,
      { debounceMs: 250 },
    );
    expect(screen.getByText('Finanzen')).toBeInTheDocument();
    expect(screen.getByText('Einnahme')).toBeInTheDocument();
  });
});
