import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';

export type WorldCameraState = {
  readonly scale: number;
  readonly translateX: number;
  readonly translateY: number;
};

export const WORLD_CAMERA_MIN_SCALE = 0.45;
export const WORLD_CAMERA_MAX_SCALE = 2.5;
export const WORLD_CAMERA_ZOOM_STEP = 0.15;
/** Closer framing for grid region focus (presentation). */
export const WORLD_CAMERA_GRID_REGION_FOCUS_SCALE = 1.65;
/** Closer framing for scenic plate region focus (world overview often uses upscale fit). */
export const WORLD_CAMERA_SCENIC_REGION_FOCUS_SCALE = 2.15;

export function clampWorldScale(
  scale: number,
  maxScale = WORLD_CAMERA_MAX_SCALE,
  minScale = WORLD_CAMERA_MIN_SCALE,
): number {
  return Math.min(maxScale, Math.max(minScale, scale));
}

/** Upper scale for presentation-only region-focus bounds fit (grid cell + padding). */
export const WORLD_CAMERA_REGION_FOCUS_MAX_SCALE = 5;

export type WorldCameraScaleLimits = Readonly<{
  readonly min: number;
  readonly max: number;
}>;

export const WORLD_CAMERA_OVERVIEW_SCALE_LIMITS: WorldCameraScaleLimits = Object.freeze({
  min: WORLD_CAMERA_MIN_SCALE,
  max: WORLD_CAMERA_MAX_SCALE,
});

export const WORLD_CAMERA_REGION_FOCUS_SCALE_LIMITS: WorldCameraScaleLimits = Object.freeze({
  min: WORLD_CAMERA_MIN_SCALE,
  max: WORLD_CAMERA_REGION_FOCUS_MAX_SCALE,
});

export function zoomWorldScale(
  scale: number,
  delta: number,
  limits: WorldCameraScaleLimits = WORLD_CAMERA_OVERVIEW_SCALE_LIMITS,
): number {
  return clampWorldScale(scale + delta, limits.max, limits.min);
}

export type WorldBounds = {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
};

export function resolveWorldBounds(
  regions: readonly { readonly mapX: number; readonly mapY: number }[],
  cellSize: number = WORLD_MAP_CELL_SIZE,
): WorldBounds {
  if (regions.length === 0) {
    return Object.freeze({ minX: 0, minY: 0, maxX: cellSize, maxY: cellSize });
  }

  const minMapX = Math.min(...regions.map((region) => region.mapX));
  const minMapY = Math.min(...regions.map((region) => region.mapY));
  const maxMapX = Math.max(...regions.map((region) => region.mapX));
  const maxMapY = Math.max(...regions.map((region) => region.mapY));

  return Object.freeze({
    minX: minMapX * cellSize,
    minY: minMapY * cellSize,
    maxX: (maxMapX + 1) * cellSize,
    maxY: (maxMapY + 1) * cellSize,
  });
}

export function fitWorldCamera(
  bounds: WorldBounds,
  viewportWidth: number,
  viewportHeight: number,
  padding = 24,
  options?: { readonly allowUpscale?: boolean; readonly maxScale?: number },
): WorldCameraState {
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const scaleX = (viewportWidth - padding * 2) / contentWidth;
  const scaleY = (viewportHeight - padding * 2) / contentHeight;
  const fittedScale = Math.min(scaleX, scaleY);
  const maxScale = options?.maxScale ?? WORLD_CAMERA_MAX_SCALE;
  const scale = clampWorldScale(
    options?.allowUpscale === true ? fittedScale : Math.min(fittedScale, 1),
    maxScale,
  );

  const translateX = (viewportWidth - contentWidth * scale) / 2 - bounds.minX * scale;
  const translateY = (viewportHeight - contentHeight * scale) / 2 - bounds.minY * scale;

  return Object.freeze({ scale, translateX, translateY });
}

export function fitRegionCameraAtWorldCenter(
  centerX: number,
  centerY: number,
  viewportWidth: number,
  viewportHeight: number,
  targetScale = 1.2,
): WorldCameraState {
  const scale = clampWorldScale(targetScale);

  return Object.freeze({
    scale,
    translateX: viewportWidth / 2 - centerX * scale,
    translateY: viewportHeight / 2 - centerY * scale,
  });
}

export function fitRegionCamera(
  region: { readonly mapX: number; readonly mapY: number },
  viewportWidth: number,
  viewportHeight: number,
  cellSize: number = WORLD_MAP_CELL_SIZE,
  _padding = 48,
  targetScale: number = WORLD_CAMERA_GRID_REGION_FOCUS_SCALE,
): WorldCameraState {
  const centerX = region.mapX * cellSize + cellSize / 2;
  const centerY = region.mapY * cellSize + cellSize / 2;

  return fitRegionCameraAtWorldCenter(centerX, centerY, viewportWidth, viewportHeight, targetScale);
}

export function panWorldCamera(
  camera: WorldCameraState,
  deltaX: number,
  deltaY: number,
): WorldCameraState {
  return Object.freeze({
    scale: camera.scale,
    translateX: camera.translateX + deltaX,
    translateY: camera.translateY + deltaY,
  });
}

/** Zoom while keeping the world point under (localX, localY) stable in viewport space. */
export function zoomWorldCameraAtViewportPoint(
  camera: WorldCameraState,
  localX: number,
  localY: number,
  deltaScale: number,
  limits: WorldCameraScaleLimits = WORLD_CAMERA_OVERVIEW_SCALE_LIMITS,
): WorldCameraState {
  const nextScale = zoomWorldScale(camera.scale, deltaScale, limits);
  if (nextScale === camera.scale) {
    return camera;
  }

  const worldX = (localX - camera.translateX) / camera.scale;
  const worldY = (localY - camera.translateY) / camera.scale;

  return Object.freeze({
    scale: nextScale,
    translateX: localX - worldX * nextScale,
    translateY: localY - worldY * nextScale,
  });
}

/** Keep transformed world content reachable inside the viewport (presentation clamp). */
export function clampWorldCameraTranslation(
  camera: WorldCameraState,
  bounds: WorldBounds,
  viewportWidth: number,
  viewportHeight: number,
  padding = 24,
): WorldCameraState {
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const scaledWidth = contentWidth * camera.scale;
  const scaledHeight = contentHeight * camera.scale;

  let translateX = camera.translateX;
  let translateY = camera.translateY;

  if (scaledWidth <= viewportWidth - padding * 2) {
    translateX = (viewportWidth - scaledWidth) / 2 - bounds.minX * camera.scale;
  } else {
    const minTx = viewportWidth - padding - camera.scale * bounds.maxX;
    const maxTx = padding - camera.scale * bounds.minX;
    translateX = Math.min(maxTx, Math.max(minTx, translateX));
  }

  if (scaledHeight <= viewportHeight - padding * 2) {
    translateY = (viewportHeight - scaledHeight) / 2 - bounds.minY * camera.scale;
  } else {
    const minTy = viewportHeight - padding - camera.scale * bounds.maxY;
    const maxTy = padding - camera.scale * bounds.minY;
    translateY = Math.min(maxTy, Math.max(minTy, translateY));
  }

  return Object.freeze({
    scale: camera.scale,
    translateX,
    translateY,
  });
}
