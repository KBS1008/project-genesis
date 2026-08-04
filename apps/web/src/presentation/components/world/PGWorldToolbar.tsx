'use client';

import { Button } from '@/presentation/primitives/Button';
import type { WorldCameraState } from '@/presentation/hooks/world-camera-math';

/** Zoom and fit controls for the world map camera. */
export function PGWorldToolbar({
  camera,
  onZoomIn,
  onZoomOut,
  onFitWorld,
  onFitRegion,
  hasRegionSelection,
}: {
  readonly camera: WorldCameraState;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onFitWorld: () => void;
  readonly onFitRegion: () => void;
  readonly hasRegionSelection: boolean;
}) {
  const zoomLabel = `${Math.round(camera.scale * 100)} %`;

  return (
    <div className="pg-world-toolbar" role="toolbar" aria-label="Kartenwerkzeuge">
      <Button variant="secondary" aria-label="Hineinzoomen" onClick={onZoomIn}>+</Button>
      <Button variant="secondary" aria-label="Herauszoomen" onClick={onZoomOut}>−</Button>
      <Button variant="secondary" onClick={onFitWorld}>Welt einpassen</Button>
      <Button variant="secondary" disabled={!hasRegionSelection} onClick={onFitRegion}>
        Region fokussieren
      </Button>
      <p className="pg-world-toolbar-status">Zoom: {zoomLabel}</p>
    </div>
  );
}
