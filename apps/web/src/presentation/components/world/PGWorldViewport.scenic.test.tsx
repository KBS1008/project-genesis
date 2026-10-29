// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_WORLD_OVERLAY } from '@/presentation/adapters/view-data/world-view-data';
import { WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import { PGWorldViewport } from '@/presentation/components/world/PGWorldViewport';

const MAP = Object.freeze({
  mapId: 'map_world_default',
  mapName: 'Genesis World Map',
  columns: 3,
  rows: 3,
  cellSize: 96,
  regions: [],
  connections: [],
});

const CAMERA = Object.freeze({ scale: 1, translateX: 0, translateY: 0 });

describe('PGWorldViewport scenic integration', () => {
  it('does not render scenic layer when profile is null', () => {
    const { container } = render(
      <PGWorldViewport
        map={MAP}
        overlays={EMPTY_WORLD_OVERLAY}
        selectedRegionId={null}
        layers={Object.freeze({ regions: true })}
        camera={CAMERA}
        viewportRef={{ current: null }}
        onSelectRegion={vi.fn()}
        onWheel={vi.fn()}
        onPointerDown={vi.fn()}
        onPointerMove={vi.fn()}
        onPointerUp={vi.fn()}
        scenicPresentationProfile={null}
      />,
    );

    expect(container.querySelector('.pg-world-scenic-background-layer')).toBeNull();
  });

  it('renders scenic background under the SVG canvas without intercepting pointer events', () => {
    const { container } = render(
      <PGWorldViewport
        map={MAP}
        overlays={EMPTY_WORLD_OVERLAY}
        selectedRegionId={null}
        layers={Object.freeze({ regions: true })}
        camera={CAMERA}
        viewportRef={{ current: null }}
        onSelectRegion={vi.fn()}
        onWheel={vi.fn()}
        onPointerDown={vi.fn()}
        onPointerMove={vi.fn()}
        onPointerUp={vi.fn()}
        scenicPresentationProfile={WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT}
      />,
    );

    const layer = container.querySelector('.pg-world-scenic-background-layer');
    const image = container.querySelector('.pg-world-scenic-background-image');
    const svg = container.querySelector('svg.pg-world-canvas');

    expect(layer).not.toBeNull();
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe(
      WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT.plateAssetUrl,
    );
    expect(svg).not.toBeNull();

    const stack = container.querySelector('.pg-world-canvas-stack');
    expect(stack?.children[0]).toHaveClass('pg-world-scenic-background-layer');
    expect(stack?.children[1]?.classList.contains('pg-world-canvas')).toBe(true);
  });

  it('does not render scenic layer in selected-region focus even when profile is set', () => {
    const { container } = render(
      <PGWorldViewport
        map={MAP}
        overlays={EMPTY_WORLD_OVERLAY}
        selectedRegionId="region_default"
        regionFocusRegionId="region_default"
        layers={Object.freeze({ regions: true })}
        camera={CAMERA}
        viewportRef={{ current: null }}
        onSelectRegion={vi.fn()}
        onWheel={vi.fn()}
        onPointerDown={vi.fn()}
        onPointerMove={vi.fn()}
        onPointerUp={vi.fn()}
        scenicPresentationProfile={WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT}
      />,
    );

    expect(container.querySelector('.pg-world-scenic-background-layer')).toBeNull();
    expect(container.querySelector('.pg-world-viewport.is-scenic-integration')).toBeNull();
  });

  it('renders scenic background in world overview when profile is set and region focus is inactive', () => {
    const { container } = render(
      <PGWorldViewport
        map={MAP}
        overlays={EMPTY_WORLD_OVERLAY}
        selectedRegionId={null}
        regionFocusRegionId={null}
        layers={Object.freeze({ regions: true })}
        camera={CAMERA}
        viewportRef={{ current: null }}
        onSelectRegion={vi.fn()}
        onWheel={vi.fn()}
        onPointerDown={vi.fn()}
        onPointerMove={vi.fn()}
        onPointerUp={vi.fn()}
        scenicPresentationProfile={WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT}
      />,
    );

    expect(container.querySelector('.pg-world-scenic-background-layer')).not.toBeNull();
    expect(container.querySelector('.pg-world-viewport.is-scenic-integration')).not.toBeNull();
  });

  it('applies inverse zoom scaling to scenic region label groups', () => {
    const mapWithRegions = {
      ...MAP,
      regions: [
        {
          id: 'region_default',
          name: 'Central Basin',
          biomeId: 'forest',
          biomeLabel: 'Forest',
          biomeCategory: 'FOREST',
          mapX: 1,
          mapY: 1,
          cityCount: 1,
        },
      ],
    };

    const { container } = render(
      <PGWorldViewport
        map={mapWithRegions}
        overlays={EMPTY_WORLD_OVERLAY}
        selectedRegionId={null}
        layers={Object.freeze({ regions: true, labels: true })}
        camera={Object.freeze({ scale: 2, translateX: 0, translateY: 0 })}
        viewportRef={{ current: null }}
        onSelectRegion={vi.fn()}
        onWheel={vi.fn()}
        onPointerDown={vi.fn()}
        onPointerMove={vi.fn()}
        onPointerUp={vi.fn()}
        scenicPresentationProfile={WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT}
      />,
    );

    const labelGroup = container.querySelector('.pg-world-scenic-region-label-group');
    expect(labelGroup?.getAttribute('transform')).toContain('scale(0.5');
  });
});
