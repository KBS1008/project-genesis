// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/presentation/primitives/Button';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

describe('Button', () => {
  it('renders a focusable button and handles clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderPresentation(<Button onClick={onClick}>Speichern</Button>);

    const button = screen.getByRole('button', { name: 'Speichern' });
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not invoke click handlers when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderPresentation(
      <Button disabled onClick={onClick}>
        Gesperrt
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Gesperrt' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
