import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';

export type WorldCameraState = {
  readonly scale: number;
  readonly translateX: number;
  readonly translateY: number;
};

export const WORLD_CAMERA_MIN_SCALE = 0.45;
export const WORLD_CAMERA_MAX_SCALE = 2.5;
export const WORLD_CAMERA_ZOOM_STEP = 0.15;

export function clampWorldScale(scale: number): number {
  return Math.min(WORLD_CAMERA_MAX_SCALE, Math.max(WORLD_CAMERA_MIN_SCALE, scale));
}

export function zoomWorldScale(scale: number, delta: number): number {
  return clampWorldScale(scale + delta);
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
): WorldCameraState {
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const scaleX = (viewportWidth - padding * 2) / contentWidth;
  const scaleY = (viewportHeight - padding * 2) / contentHeight;
  const scale = clampWorldScale(Math.min(scaleX, scaleY, 1));

  const translateX = (viewportWidth - contentWidth * scale) / 2 - bounds.minX * scale;
  const translateY = (viewportHeight - contentHeight * scale) / 2 - bounds.minY * scale;

  return Object.freeze({ scale, translateX, translateY });
}

export function fitRegionCamera(
  region: { readonly mapX: number; readonly mapY: number },
  viewportWidth: number,
  viewportHeight: number,
  cellSize: number = WORLD_MAP_CELL_SIZE,
  padding = 48,
): WorldCameraState {
  const centerX = region.mapX * cellSize + cellSize / 2;
  const centerY = region.mapY * cellSize + cellSize / 2;
  const scale = clampWorldScale(1.2);

  return Object.freeze({
    scale,
    translateX: viewportWidth / 2 - centerX * scale,
    translateY: viewportHeight / 2 - centerY * scale,
  });
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
