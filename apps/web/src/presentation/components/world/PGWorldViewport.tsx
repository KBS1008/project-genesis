'use client';

import type { PointerEvent, WheelEvent } from 'react';
import type { WorldCameraState } from '@/presentation/hooks/world-camera-math';
import { PGWorldCanvas } from '@/presentation/components/world/PGWorldCanvas';
import type { WorldMapViewData } from '@/presentation/adapters/view-data/world-view-data';

/** Pan/zoom viewport wrapper for the world SVG canvas. */
export function PGWorldViewport({
  map,
  selectedRegionId,
  layers,
  camera,
  viewportRef,
  onSelectRegion,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  readonly map: WorldMapViewData;
  readonly selectedRegionId: string | null;
  readonly layers: Readonly<Record<string, boolean>>;
  readonly camera: WorldCameraState;
  readonly viewportRef: RefObject<HTMLDivElement | null>;
  readonly onSelectRegion: (regionId: string) => void;
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
          selectedRegionId={selectedRegionId}
          layers={layers}
          onSelectRegion={onSelectRegion}
        />
      </div>
    </div>
  );
}
