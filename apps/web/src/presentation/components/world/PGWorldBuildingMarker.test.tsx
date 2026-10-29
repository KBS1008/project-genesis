// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PGWorldBuildingMarker } from '@/presentation/components/world/PGWorldBuildingMarker';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';

const MARKER: WorldBuildingMarkerViewData = Object.freeze({
  id: 'building_005',
  domainX: 12,
  domainY: 7,
  buildingTypeId: 'sawmill',
  regionId: 'region_default',
  label: 'Sägewerk',
  statusLabel: 'ACTIVE',
  clusterSize: 5,
  x: 40,
  y: 40,
});

describe('PGWorldBuildingMarker', () => {
  it('renders compact ICON-003 image for known building types', () => {
    const { container } = render(
      <svg>
        <PGWorldBuildingMarker marker={MARKER} isSelected={false} onSelect={vi.fn()} />
      </svg>,
    );

    const image = container.querySelector('image.pg-world-building-marker-glyph');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('href')).toContain('ICON-003-sawmill-compact');
  });

  it('shows selection ring when selected', () => {
    const { container } = render(
      <svg>
        <PGWorldBuildingMarker marker={MARKER} isSelected onSelect={vi.fn()} />
      </svg>,
    );

    expect(container.querySelector('.pg-world-building-marker.is-selected')).not.toBeNull();
    expect(container.querySelector('.pg-world-building-marker-selection-ring')).not.toBeNull();
  });

  it('exposes stable data-building-id for authoritative DOM correlation', () => {
    const { container } = render(
      <svg>
        <PGWorldBuildingMarker marker={MARKER} isSelected={false} onSelect={vi.fn()} />
      </svg>,
    );

    expect(container.querySelector('[data-building-id="building_005"]')).not.toBeNull();
  });

  it('applies scenic grounding presentation without changing hit target geometry', () => {
    const { container } = render(
      <svg>
        <PGWorldBuildingMarker
          marker={MARKER}
          isSelected={false}
          onSelect={vi.fn()}
          scenicGroundingPresentation
        />
      </svg>,
    );

    expect(container.querySelector('.pg-world-building-marker--scenic-grounding')).not.toBeNull();
    expect(container.querySelector('.pg-world-building-marker-scenic-stack')).not.toBeNull();
    const hit = container.querySelector('rect.pg-world-building-marker-hit');
    expect(hit?.getAttribute('width')).toBeTruthy();
  });
});
