'use client';

import type { PointerEvent, RefObject, WheelEvent } from 'react';
import type { WorldCameraState } from '@/presentation/hooks/world-camera-math';
import { PGWorldCanvas } from '@/presentation/components/world/PGWorldCanvas';
import type { WorldMapViewData, WorldOverlayViewData } from '@/presentation/adapters/view-data/world-view-data';

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
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  readonly map: WorldMapViewData;
  readonly overlays: WorldOverlayViewData;
  readonly selectedRegionId: string | null;
  readonly layers: Readonly<Record<string, boolean>>;
  readonly camera: WorldCameraState;
  readonly viewportRef: RefObject<HTMLDivElement | null>;
  readonly onSelectRegion: (regionId: string) => void;
  readonly onSelectBuilding?: (buildingId: string) => void;
  readonly onWheel: (event: WheelEvent) => void;
  readonly onPointerDown: (event: PointerEvent) => void;
  readonly onPointerMove: (event: PointerEvent) => void;
  readonly onPointerUp: (event: PointerEvent) => void;
}) {
  return (
    <div
      ref={viewportRef}
      className="pg-world-viewport"
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
        <PGWorldCanvas
          map={map}
          overlays={overlays}
          selectedRegionId={selectedRegionId}
          layers={layers}
          onSelectRegion={onSelectRegion}
          onSelectBuilding={onSelectBuilding}
        />
      </div>
    </div>
  );
}
