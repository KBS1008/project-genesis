import type { WorldCameraState } from '@/presentation/hooks/world-camera-math';

/** Converts viewport-local pointer coordinates to world-logical SVG user space (inverse camera transform). */
export function viewportPointerToWorldLogical(
  localX: number,
  localY: number,
  camera: WorldCameraState,
): { readonly x: number; readonly y: number } {
  return Object.freeze({
    x: (localX - camera.translateX) / camera.scale,
    y: (localY - camera.translateY) / camera.scale,
  });
}

export const WORLD_PLACEMENT_DRAG_THRESHOLD_PX = 5;

export function isPointerDrag(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  threshold: number = WORLD_PLACEMENT_DRAG_THRESHOLD_PX,
): boolean {
  return Math.hypot(endX - startX, endY - startY) > threshold;
}
