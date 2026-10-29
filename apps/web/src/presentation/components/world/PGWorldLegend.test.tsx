import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PGWorldLegend } from '@/presentation/components/world/PGWorldLegend';
import { DEFAULT_WORLD_LAYERS } from '@/presentation/adapters/view-data/world-view-data';

describe('PGWorldLegend (Slice 6)', () => {
  it('shows active route count when transport layer is enabled', () => {
    render(
      <PGWorldLegend
        layers={DEFAULT_WORLD_LAYERS}
        biomeEntries={[]}
        activeTransportRouteCount={2}
        compact={false}
      />,
    );

    expect(screen.getByText(/2 Routen aktiv/)).toBeTruthy();
  });
});
