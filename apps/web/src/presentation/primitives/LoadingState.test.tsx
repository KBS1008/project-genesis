// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingState } from '@/presentation/primitives/LoadingState';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('LoadingState', () => {
  it('exposes a polite live region for accessibility', () => {
    renderPresentation(<LoadingState label="Lade Simulation…" />);

    const status = screen.getByRole('status', { name: /lade simulation/i });
    expect(status).toHaveAttribute('aria-busy', 'true');
  });
});
