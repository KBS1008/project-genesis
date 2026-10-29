// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PGRegionMapView } from '@/presentation/components/world/PGRegionMapView';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';

const regionMapCssPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'world-components.css');

const MARKERS: readonly WorldBuildingMarkerViewData[] = Object.freeze([
  Object.freeze({
    id: 'building_001',
    buildingTypeId: 'headquarters',
    regionId: 'region_default',
    label: 'Firmenzentrale',
    statusLabel: 'ACTIVE',
    clusterSize: 4,
    domainX: 12,
    domainY: 12,
    x: 16,
    y: 16,
  }),
]);

describe('PGRegionMapView', () => {
  it('uses visible overflow on the region map view so upper-edge markers are not clipped (Slice 2E)', () => {
    const css = readFileSync(regionMapCssPath, 'utf8');
    const block = css.match(/\.pg-world-region-map-view\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
    expect(block).toContain('overflow: visible');
    expect(block).not.toMatch(/overflow:\s*hidden/);
  });

  it('renders landscape group for Central Basin', () => {
    render(
      <PGRegionMapView
        regionId="region_default"
        regionName="Central Basin"
        buildingMarkers={[]}
      />,
    );
    expect(screen.getByRole('group', { name: 'Regionskarte Central Basin' })).toHaveAttribute(
      'data-landscape-url',
      '/images/world/regions/central-basin.webp.png',
    );
  });

  it('shows unavailable state for unknown region', () => {
    render(
      <PGRegionMapView regionId="region_missing" regionName="Missing" buildingMarkers={[]} />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('nicht verfügbar');
  });

  it('renders building markers for the active region after image load', () => {
    render(
      <PGRegionMapView
        regionId="region_default"
        regionName="Central Basin"
        buildingMarkers={MARKERS}
        onSelectBuilding={vi.fn()}
      />,
    );

    const stage = document.querySelector('.pg-world-region-map-view-stage');
    expect(stage).not.toBeNull();
    stage!.getBoundingClientRect = () =>
      ({
        width: 1440,
        height: 900,
        top: 0,
        left: 0,
        right: 1440,
        bottom: 900,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const image = document.querySelector('.pg-world-region-map-view-image');
    expect(image).not.toBeNull();
    fireEvent.load(image!);

    expect(screen.getByRole('button', { name: 'Gebäude Firmenzentrale' })).toHaveAttribute(
      'data-building-id',
      'building_001',
    );
  });

  function loadRegionMapStage() {
    const stage = document.querySelector('.pg-world-region-map-view-stage');
    expect(stage).not.toBeNull();
    stage!.getBoundingClientRect = () =>
      ({
        width: 1114,
        height: 743,
        top: 100,
        left: 50,
        right: 1164,
        bottom: 843,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;
    const image = document.querySelector('.pg-world-region-map-view-image');
    Object.defineProperty(image, 'naturalWidth', { value: 1536, configurable: true });
    Object.defineProperty(image, 'naturalHeight', { value: 1024, configurable: true });
    fireEvent.load(image!);
    return stage!;
  }

  it('keeps building markers interactive during placement (Slice 2F-B)', () => {
    const css = readFileSync(regionMapCssPath, 'utf8');
    expect(css).toMatch(
      /\.pg-world-region-map-view-stage\.is-placement-active \.pg-world-region-map-building-marker[\s\S]*?pointer-events:\s*auto/,
    );
  });

  it('selects an existing marker during placement without terrain placement pick', () => {
    const onPick = vi.fn();
    const onSelect = vi.fn();
    render(
      <PGRegionMapView
        regionId="region_default"
        regionName="Central Basin"
        buildingMarkers={MARKERS}
        placementSession={Object.freeze({
          buildingTypeId: 'warehouse',
          name: 'Lager',
          canPlace: true,
          candidate: null,
          validation: null,
          regionId: 'region_default',
        })}
        onPickPlacementCandidate={onPick}
        onSelectBuilding={onSelect}
      />,
    );

    loadRegionMapStage();
    fireEvent.click(screen.getByRole('button', { name: 'Gebäude Firmenzentrale' }));
    expect(onSelect).toHaveBeenCalledWith('building_001');
    expect(onPick).not.toHaveBeenCalled();
  });

  it('does not invoke placement pick on marker pointerdown during placement (Slice 2F-B priority)', () => {
    const onPick = vi.fn();
    const onSelect = vi.fn();
    render(
      <PGRegionMapView
        regionId="region_default"
        regionName="Central Basin"
        buildingMarkers={MARKERS}
        placementSession={Object.freeze({
          buildingTypeId: 'warehouse',
          name: 'Lager',
          canPlace: true,
          candidate: null,
          validation: null,
          regionId: 'region_default',
        })}
        onPickPlacementCandidate={onPick}
        onSelectBuilding={onSelect}
      />,
    );

    loadRegionMapStage();
    const marker = screen.getByRole('button', { name: 'Gebäude Firmenzentrale' });
    fireEvent.pointerDown(marker, { clientX: 200, clientY: 200 });
    fireEvent.click(marker);
    expect(onPick).not.toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith('building_001');
  });

  it('forwards preview clicks to placement pick without hitting building markers', () => {
    const onPick = vi.fn();
    render(
      <PGRegionMapView
        regionId="region_default"
        regionName="Central Basin"
        buildingMarkers={MARKERS}
        placementSession={Object.freeze({
          buildingTypeId: 'sawmill',
          name: 'Sägewerk',
          canPlace: true,
          candidate: { x: 30, y: 30 },
          validation: { valid: true, reason: null },
          regionId: 'region_default',
        })}
        onPickPlacementCandidate={onPick}
      />,
    );

    const stage = document.querySelector('.pg-world-region-map-view-stage');
    expect(stage).not.toBeNull();
    stage!.getBoundingClientRect = () =>
      ({
        width: 1114,
        height: 743,
        top: 100,
        left: 50,
        right: 1164,
        bottom: 843,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;

    const image = document.querySelector('.pg-world-region-map-view-image');
    Object.defineProperty(image, 'naturalWidth', { value: 1536, configurable: true });
    Object.defineProperty(image, 'naturalHeight', { value: 1024, configurable: true });
    fireEvent.load(image!);

    const preview = document.querySelector('.pg-world-region-map-placement-preview.is-valid');
    expect(preview).not.toBeNull();
    fireEvent.pointerDown(preview!, { clientX: 400, clientY: 400 });
    expect(onPick).toHaveBeenCalled();
  });

  function setupPlacementStage() {
    const onPick = vi.fn();
    render(
      <PGRegionMapView
        regionId="region_default"
        regionName="Central Basin"
        buildingMarkers={[]}
        placementSession={Object.freeze({
          buildingTypeId: 'sawmill',
          name: 'Sägewerk',
          canPlace: true,
          candidate: null,
          validation: null,
          regionId: 'region_default',
        })}
        onPickPlacementCandidate={onPick}
      />,
    );

    const stage = document.querySelector('.pg-world-region-map-view-stage');
    expect(stage).not.toBeNull();
    stage!.getBoundingClientRect = () =>
      ({
        width: 1114,
        height: 743,
        top: 100,
        left: 50,
        right: 1164,
        bottom: 843,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;

    const image = document.querySelector('.pg-world-region-map-view-image');
    Object.defineProperty(image, 'naturalWidth', { value: 1536, configurable: true });
    Object.defineProperty(image, 'naturalHeight', { value: 1024, configurable: true });
    fireEvent.load(image!);

    return { stage: stage!, onPick };
  }

  it('does not call onPick on pointer move before a map click locks the tile', () => {
    const { stage, onPick } = setupPlacementStage();

    fireEvent.pointerMove(stage, { clientX: 400, clientY: 400 });
    fireEvent.pointerMove(stage, { clientX: 500, clientY: 200 });
    expect(onPick).not.toHaveBeenCalled();

    const hoverPreview = document.querySelector('.pg-world-region-map-placement-preview.is-hover');
    expect(hoverPreview).not.toBeNull();
  });

  it('calls onPick on pointer down and ignores pointer move after selection is locked', () => {
    const { stage, onPick } = setupPlacementStage();

    fireEvent.pointerDown(stage, { clientX: 400, clientY: 400 });
    expect(onPick).toHaveBeenCalledTimes(1);
    const firstPick = onPick.mock.calls[0][0];

    onPick.mockClear();
    fireEvent.pointerMove(stage, { clientX: 900, clientY: 150 });
    expect(onPick).not.toHaveBeenCalled();

    const lockedPreview = document.querySelector('.pg-world-region-map-placement-preview.is-valid, .pg-world-region-map-placement-preview.is-invalid');
    expect(lockedPreview).toBeNull();

    render(
      <PGRegionMapView
        regionId="region_default"
        regionName="Central Basin"
        buildingMarkers={[]}
        placementSession={Object.freeze({
          buildingTypeId: 'sawmill',
          name: 'Sägewerk',
          canPlace: true,
          candidate: firstPick,
          validation: { valid: true, reason: null },
          regionId: 'region_default',
        })}
        onPickPlacementCandidate={onPick}
      />,
    );

    const stage2 = document.querySelector('.pg-world-region-map-view-stage');
    fireEvent.pointerMove(stage2!, { clientX: 900, clientY: 150 });
    expect(onPick).not.toHaveBeenCalled();
  });
});
