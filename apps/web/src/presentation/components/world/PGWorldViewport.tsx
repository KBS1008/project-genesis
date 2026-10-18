'use client';

import type { PointerEvent, RefObject, WheelEvent } from 'react';
import type { WorldCameraState } from '@/presentation/hooks/world-camera-math';
import { PGWorldCanvas } from '@/presentation/components/world/PGWorldCanvas';
import { resolveScenicPresentationContext } from '@/presentation/adapters/mappers/world-scenic-visual-projection';
import type { WorldScenicPresentationProfile } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';
import type {
  WorldBuildingMarkerViewData,
  WorldMapViewData,
  WorldOverlayViewData,
} from '@/presentation/adapters/view-data/world-view-data';
import { PGWorldScenicBackgroundLayer } from '@/presentation/components/world/PGWorldScenicBackgroundLayer';

/** Pan/zoom viewport wrapper for the world SVG canvas. */
export function PGWorldViewport({
  map,
  overlays,
  selectedRegionId,
  layers,
  camera,
  viewportRef,
  onSelectRegion,
  onSelectBuilding,
  selectedBuildingId = null,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  canvasWidth,
  canvasHeight,
  buildingPlacementMode = false,
  suppressMapEntitySelection = false,
  placementPreviewMarker = null,
  scenicPresentationProfile = null,
}: {
  readonly map: WorldMapViewData;
  readonly overlays: WorldOverlayViewData;
  readonly selectedRegionId: string | null;
  readonly layers: Readonly<Record<string, boolean>>;
  readonly camera: WorldCameraState;
  readonly viewportRef: RefObject<HTMLDivElement | null>;
  readonly onSelectRegion: (regionId: string) => void;
  readonly onSelectBuilding?: (buildingId: string) => void;
  readonly selectedBuildingId?: string | null;
  readonly onWheel: (event: WheelEvent) => void;
  readonly onPointerDown: (event: PointerEvent) => void;
  readonly onPointerMove: (event: PointerEvent) => void;
  readonly onPointerUp: (event: PointerEvent) => void;
  readonly canvasWidth?: number;
  readonly canvasHeight?: number;
  readonly buildingPlacementMode?: boolean;
  readonly suppressMapEntitySelection?: boolean;
  readonly placementPreviewMarker?: WorldBuildingMarkerViewData | null;
  readonly scenicPresentationProfile?: WorldScenicPresentationProfile | null;
}) {
  const width = canvasWidth ?? map.columns * map.cellSize;
  const height = canvasHeight ?? map.rows * map.cellSize;
  const scenicPresentationContext =
    scenicPresentationProfile !== null
      ? resolveScenicPresentationContext(
          scenicPresentationProfile,
          width,
          height,
          map.cellSize,
        )
      : null;

  return (
    <div
      ref={viewportRef}
      className={`pg-world-viewport${buildingPlacementMode ? ' is-building-placement' : ''}${
        scenicPresentationProfile !== null ? ' is-scenic-integration' : ''
      }`}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div
        className="pg-world-canvas-transform"
        style={{
          transform: `translate(${camera.translateX}px, ${camera.translateY}px) scale(${camera.scale})`,
          transformOrigin: '0 0',
          transition: 'transform var(--duration-fast) var(--ease-standard)',
        }}
      >
        <div
          className="pg-world-canvas-stack"
          style={{
            width,
            height,
          }}
        >
          {scenicPresentationContext !== null ? (
            <PGWorldScenicBackgroundLayer
              profile={scenicPresentationContext.profile}
              layout={scenicPresentationContext.layout}
              canvasWidth={width}
              canvasHeight={height}
            />
          ) : null}
          <PGWorldCanvas
            map={map}
            overlays={overlays}
            selectedRegionId={selectedRegionId}
            layers={layers}
            onSelectRegion={onSelectRegion}
            onSelectBuilding={onSelectBuilding}
            selectedBuildingId={selectedBuildingId}
            canvasWidth={width}
            canvasHeight={height}
            suppressMapEntitySelection={suppressMapEntitySelection}
            placementPreviewMarker={placementPreviewMarker}
            scenicPresentationContext={scenicPresentationContext}
          />
        </div>
      </div>
    </div>
  );
}
