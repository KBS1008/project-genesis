'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
  type WheelEvent,
} from 'react';
import {
  clampWorldCameraTranslation,
  fitRegionCamera,
  fitRegionCameraAtWorldCenter,
  fitWorldCamera,
  WORLD_CAMERA_REGION_FOCUS_MAX_SCALE,
  WORLD_CAMERA_SCENIC_REGION_FOCUS_SCALE,
  panWorldCamera,
  resolveWorldBounds,
  WORLD_CAMERA_OVERVIEW_SCALE_LIMITS,
  WORLD_CAMERA_ZOOM_STEP,
  zoomWorldCameraAtViewportPoint,
  type WorldBounds,
  type WorldCameraState,
  type WorldCameraScaleLimits,
} from '@/presentation/hooks/world-camera-math';
import type { WorldLogicalPoint } from '@/presentation/adapters/mappers/company-building-placement-coordinates';
import type { WorldMapRegionCellViewData } from '@/presentation/adapters/view-data/world-view-data';
import { shiftWorldBoundsToLayerLocal } from '@/presentation/hooks/world-region-presentation-bounds';
import { WORLD_PLACEMENT_DRAG_THRESHOLD_PX } from '@/presentation/hooks/world-viewport-pointer';

export type WorldCameraRegionFocusResolver = (
  region: WorldMapRegionCellViewData,
) => WorldLogicalPoint | null;

const DEFAULT_CAMERA: WorldCameraState = Object.freeze({
  scale: 1,
  translateX: 0,
  translateY: 0,
});

const FIT_PADDING = 24;

type DragState = Readonly<{
  readonly startX: number;
  readonly startY: number;
  readonly lastX: number;
  readonly lastY: number;
  readonly panning: boolean;
}>;

/** Camera controls for world map zoom, pan, and fit operations. */
export function useWorldCamera(
  regions: readonly WorldMapRegionCellViewData[],
  options?: {
    readonly resolveRegionFocusWorldCenter?: WorldCameraRegionFocusResolver;
    readonly resolveFitWorldBounds?: () => WorldBounds | null;
    /** When set, pan/zoom clamp uses these bounds (e.g. selected region only). */
    readonly resolveInteractionBounds?: () => WorldBounds | null;
    /** When set, fitRegion uses bounds-based fit instead of legacy center-scale. */
    readonly resolveRegionFitBounds?: (regionId: string) => WorldBounds | null;
    /** Mode-aware zoom limits (overview vs region focus). */
    readonly resolveCameraScaleLimits?: () => WorldCameraScaleLimits;
  },
) {
  const [camera, setCamera] = useState<WorldCameraState>(DEFAULT_CAMERA);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const viewportBindingsCleanupRef = useRef<(() => void) | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const bounds = useMemo(() => resolveWorldBounds(regions), [regions]);

  const resolveActiveBounds = useCallback((): WorldBounds => {
    const interaction = options?.resolveInteractionBounds?.() ?? null;
    if (interaction !== null) {
      return interaction;
    }

    return options?.resolveFitWorldBounds?.() ?? bounds;
  }, [bounds, options?.resolveFitWorldBounds, options?.resolveInteractionBounds]);

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

  const readScaleLimits = useCallback((): WorldCameraScaleLimits => {
    return options?.resolveCameraScaleLimits?.() ?? WORLD_CAMERA_OVERVIEW_SCALE_LIMITS;
  }, [options?.resolveCameraScaleLimits]);

  const clampCamera = useCallback(
    (next: WorldCameraState): WorldCameraState => {
      const limits = readScaleLimits();
      const { width, height } = readViewportSize();
      const scale = Math.min(limits.max, Math.max(limits.min, next.scale));
      const withScale = Object.freeze({ ...next, scale });
      return clampWorldCameraTranslation(withScale, resolveActiveBounds(), width, height, FIT_PADDING);
    },
    [readScaleLimits, readViewportSize, resolveActiveBounds],
  );

  const applyCamera = useCallback(
    (updater: (current: WorldCameraState) => WorldCameraState) => {
      setCamera((current) => clampCamera(updater(current)));
    },
    [clampCamera],
  );

  const fitWorld = useCallback(() => {
    const { width, height } = readViewportSize();
    const scenicBounds = options?.resolveFitWorldBounds?.() ?? null;
    const activeBounds = scenicBounds ?? bounds;
    setCamera(
      clampWorldCameraTranslation(
        fitWorldCamera(activeBounds, width, height, FIT_PADDING, {
          allowUpscale: scenicBounds !== null,
        }),
        activeBounds,
        width,
        height,
        FIT_PADDING,
      ),
    );
  }, [bounds, options?.resolveFitWorldBounds, readViewportSize]);

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
      const regionBounds = options?.resolveRegionFitBounds?.(regionId) ?? null;
      if (regionBounds !== null) {
        const layerLocalBounds = shiftWorldBoundsToLayerLocal(regionBounds);
        setCamera(
          clampWorldCameraTranslation(
            fitWorldCamera(layerLocalBounds, width, height, FIT_PADDING, {
              allowUpscale: true,
              maxScale: WORLD_CAMERA_REGION_FOCUS_MAX_SCALE,
            }),
            layerLocalBounds,
            width,
            height,
            FIT_PADDING,
          ),
        );
        return;
      }

      const scenicCenter = options?.resolveRegionFocusWorldCenter?.(region) ?? null;
      if (scenicCenter !== null) {
        setCamera(
          clampCamera(
            fitRegionCameraAtWorldCenter(
              scenicCenter.x,
              scenicCenter.y,
              width,
              height,
              WORLD_CAMERA_SCENIC_REGION_FOCUS_SCALE,
            ),
          ),
        );
        return;
      }

      setCamera(clampCamera(fitRegionCamera(region, width, height)));
    },
    [
      clampCamera,
      fitWorld,
      options?.resolveRegionFitBounds,
      options?.resolveRegionFocusWorldCenter,
      readViewportSize,
      regions,
    ],
  );

  const zoomAtViewportPoint = useCallback(
    (localX: number, localY: number, delta: number) => {
      const limits = readScaleLimits();
      applyCamera((current) => zoomWorldCameraAtViewportPoint(current, localX, localY, delta, limits));
    },
    [applyCamera, readScaleLimits],
  );

  const zoomIn = useCallback(() => {
    const { width, height } = readViewportSize();
    zoomAtViewportPoint(width / 2, height / 2, WORLD_CAMERA_ZOOM_STEP);
  }, [readViewportSize, zoomAtViewportPoint]);

  const zoomOut = useCallback(() => {
    const { width, height } = readViewportSize();
    zoomAtViewportPoint(width / 2, height / 2, -WORLD_CAMERA_ZOOM_STEP);
  }, [readViewportSize, zoomAtViewportPoint]);

  const handleWheelNative = useCallback(
    (event: globalThis.WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const element = viewportRef.current;
      if (element === null) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const delta = event.deltaY > 0 ? -WORLD_CAMERA_ZOOM_STEP : WORLD_CAMERA_ZOOM_STEP;
      zoomAtViewportPoint(localX, localY, delta);
    },
    [zoomAtViewportPoint],
  );

  const onWheel = useCallback(
    (event: WheelEvent) => {
      handleWheelNative(event.nativeEvent);
    },
    [handleWheelNative],
  );

  const bindViewportElement = useCallback(
    (node: HTMLDivElement | null) => {
      viewportBindingsCleanupRef.current?.();
      viewportBindingsCleanupRef.current = null;
      viewportRef.current = node;

      if (node === null) {
        return;
      }

      const wheelHandler = handleWheelNative;
      node.addEventListener('wheel', wheelHandler, { passive: false });
      const resizeObserver = new ResizeObserver(() => {
        setCamera((current) => clampCamera(current));
      });
      resizeObserver.observe(node);

      viewportBindingsCleanupRef.current = () => {
        node.removeEventListener('wheel', wheelHandler);
        resizeObserver.disconnect();
      };
    },
    [clampCamera, handleWheelNative],
  );

  const onPointerDown = useCallback((event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    dragStateRef.current = Object.freeze({
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      panning: false,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (dragState === null) {
        return;
      }

      let panning = dragState.panning;
      if (!panning) {
        const moved = Math.hypot(
          event.clientX - dragState.startX,
          event.clientY - dragState.startY,
        );
        if (moved <= WORLD_PLACEMENT_DRAG_THRESHOLD_PX) {
          return;
        }
        panning = true;
        setIsDragging(true);
      }

      const deltaX = event.clientX - dragState.lastX;
      const deltaY = event.clientY - dragState.lastY;
      dragStateRef.current = Object.freeze({
        ...dragState,
        lastX: event.clientX,
        lastY: event.clientY,
        panning: true,
      });
      applyCamera((current) => panWorldCamera(current, deltaX, deltaY));
    },
    [applyCamera],
  );

  const onPointerUp = useCallback((event: PointerEvent) => {
    dragStateRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  useEffect(() => {
    if (regions.length === 0) {
      return;
    }

    fitWorld();
    // Omit fitWorld: its identity can change when parent re-renders with new region array refs.
  }, [options?.resolveFitWorldBounds, regions.length]);

  useEffect(() => {
    return () => {
      viewportBindingsCleanupRef.current?.();
    };
  }, []);

  return {
    camera,
    viewportRef: viewportRef as RefObject<HTMLDivElement | null>,
    bindViewportElement,
    isDragging,
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
