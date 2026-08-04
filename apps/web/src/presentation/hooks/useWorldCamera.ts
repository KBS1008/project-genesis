'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type RefObject, type WheelEvent } from 'react';
import {
  fitRegionCamera,
  fitWorldCamera,
  panWorldCamera,
  resolveWorldBounds,
  WORLD_CAMERA_ZOOM_STEP,
  type WorldCameraState,
  zoomWorldScale,
} from '@/presentation/hooks/world-camera-math';
import type { WorldMapRegionCellViewData } from '@/presentation/adapters/view-data/world-view-data';

const DEFAULT_CAMERA: WorldCameraState = Object.freeze({
  scale: 1,
  translateX: 0,
  translateY: 0,
});

/** Camera controls for world map zoom, pan, and fit operations. */
export function useWorldCamera(regions: readonly WorldMapRegionCellViewData[]) {
  const [camera, setCamera] = useState<WorldCameraState>(DEFAULT_CAMERA);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ x: number; y: number } | null>(null);

  const bounds = useMemo(() => resolveWorldBounds(regions), [regions]);

  const readViewportSize = useCallback(() => {
    const element = viewportRef.current;
    if (element === null) {
      return { width: 640, height: 480 };
    }

    return {
      width: element.clientWidth,
      height: element.clientHeight,
    };
  }, []);

  const fitWorld = useCallback(() => {
    const { width, height } = readViewportSize();
    setCamera(fitWorldCamera(bounds, width, height));
  }, [bounds, readViewportSize]);

  const fitRegion = useCallback(
    (regionId: string | null) => {
      if (regionId === null) {
        fitWorld();
        return;
      }

      const region = regions.find((entry) => entry.id === regionId);
      if (region === undefined) {
        return;
      }

      const { width, height } = readViewportSize();
      setCamera(fitRegionCamera(region, width, height));
    },
    [fitWorld, readViewportSize, regions],
  );

  const zoomIn = useCallback(() => {
    setCamera((current) => ({
      ...current,
      scale: zoomWorldScale(current.scale, WORLD_CAMERA_ZOOM_STEP),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setCamera((current) => ({
      ...current,
      scale: zoomWorldScale(current.scale, -WORLD_CAMERA_ZOOM_STEP),
    }));
  }, []);

  const onWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -WORLD_CAMERA_ZOOM_STEP : WORLD_CAMERA_ZOOM_STEP;
    setCamera((current) => ({
      ...current,
      scale: zoomWorldScale(current.scale, delta),
    }));
  }, []);

  const onPointerDown = useCallback((event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    dragStateRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: PointerEvent) => {
    const dragState = dragStateRef.current;
    if (dragState === null) {
      return;
    }

    const deltaX = event.clientX - dragState.x;
    const deltaY = event.clientY - dragState.y;
    dragStateRef.current = { x: event.clientX, y: event.clientY };
    setCamera((current) => panWorldCamera(current, deltaX, deltaY));
  }, []);

  const onPointerUp = useCallback((event: PointerEvent) => {
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  useEffect(() => {
    if (regions.length === 0) {
      return;
    }

    fitWorld();
  }, [fitWorld, regions.length]);

  return {
    camera,
    viewportRef,
    fitWorld,
    fitRegion,
    zoomIn,
    zoomOut,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
