// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SettingsPanel } from '@/presentation/screens/menu/SettingsPanel';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('presentation theme integration', () => {
  it('persists theme selection through ThemeProvider', async () => {
    const user = userEvent.setup();
    renderPresentation(<SettingsPanel onCancel={() => {}} />);

    const select = screen.getByLabelText('Theme');
    await user.selectOptions(select, 'dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('pg-theme')).toBe('dark');
  });
});
