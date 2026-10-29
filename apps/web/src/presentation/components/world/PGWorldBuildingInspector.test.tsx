// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PGWorldBuildingInspector } from '@/presentation/components/world/PGWorldBuildingInspector';

describe('PGWorldBuildingInspector', () => {
  it('renders detail entries and closes on button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <PGWorldBuildingInspector
        buildingId="building_001"
        detail={{
          title: 'HQ',
          subtitle: 'Active',
          entries: [['Region', 'Central Basin']],
        }}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole('heading', { name: 'HQ' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Inspektor schließen' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
