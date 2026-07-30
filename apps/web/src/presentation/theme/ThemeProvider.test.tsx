// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '@/presentation/theme';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      Theme: {theme}
    </button>
  );
}

describe('ThemeProvider', () => {
  it('toggles light and dark themes', async () => {
    const user = userEvent.setup();

    renderPresentation(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByText('Theme: light')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Theme: light' }));
    expect(screen.getByText('Theme: dark')).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
