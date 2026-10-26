// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PGRegionMapBuildingMarker } from '@/presentation/components/world/PGRegionMapBuildingMarker';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';

const MARKER: WorldBuildingMarkerViewData = Object.freeze({
  id: 'building_001',
  buildingTypeId: 'headquarters',
  regionId: 'region_default',
  label: 'Firmenzentrale',
  statusLabel: 'ACTIVE',
  clusterSize: 1,
  domainX: 12,
  domainY: 12,
  x: 16,
  y: 16,
});

describe('PGRegionMapBuildingMarker', () => {
  it('selects building on click without navigation', () => {
    const onSelect = vi.fn();
    render(
      <PGRegionMapBuildingMarker
        marker={MARKER}
        isSelected={false}
        leftPx={100}
        topPx={120}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Gebäude Firmenzentrale' }));
    expect(onSelect).toHaveBeenCalledWith('building_001');
  });

  it('anchors the marker at the visual spec ground-contact point', () => {
    render(
      <PGRegionMapBuildingMarker
        marker={MARKER}
        isSelected={false}
        leftPx={200}
        topPx={220}
      />,
    );

    const button = screen.getByRole('button', { name: 'Gebäude Firmenzentrale' });
    expect(button.style.transform).toContain('translate(calc(0.5 * -100%)');
  });

  it('renders regional building artwork for known types', () => {
    render(
      <PGRegionMapBuildingMarker
        marker={MARKER}
        isSelected={false}
        leftPx={100}
        topPx={120}
      />,
    );

    const image = screen.getByRole('button').querySelector('img');
    expect(image?.getAttribute('src')).toContain('/images/world/buildings/headquarters.png');
  });

  it('supports keyboard activation', () => {
    const onSelect = vi.fn();
    render(
      <PGRegionMapBuildingMarker
        marker={MARKER}
        isSelected={false}
        leftPx={100}
        topPx={120}
        onSelect={onSelect}
      />,
    );

    const button = screen.getByRole('button', { name: 'Gebäude Firmenzentrale' });
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('building_001');
  });
});
