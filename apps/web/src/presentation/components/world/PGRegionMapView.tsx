'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { computeObjectFitContainContentRect } from '@/presentation/adapters/mappers/object-fit-contain-geometry';
import {
  projectDomainFootprintTopLeftToRegionMapContentPixels,
  projectDomainPlacementToRegionMapContentPixels,
  REGION_MAP_DOMAIN_GRID_EXTENT,
  unprojectRegionMapElementPointToDomainPlacement,
} from '@/presentation/adapters/mappers/world-region-map-placement-projection';
import type { BuildingMapPlacementSession } from '@/presentation/navigation/building-map-placement-session';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';
import { resolveWorldRegionLandscapeAsset } from '@/presentation/config/world-region-landscape-assets';
import { PGRegionMapBuildingMarker } from '@/presentation/components/world/PGRegionMapBuildingMarker';

type PGRegionMapViewProps = {
  readonly regionId: string;
  readonly regionName: string;
  readonly buildingMarkers: readonly WorldBuildingMarkerViewData[];
  readonly selectedBuildingId?: string | null;
  readonly onSelectBuilding?: (buildingId: string) => void;
  readonly onClearBuildingSelection?: () => void;
  readonly placementSession?: BuildingMapPlacementSession | null;
  readonly placementFootprint?: { readonly width: number; readonly height: number };
  readonly onPickPlacementCandidate?: (candidate: { readonly x: number; readonly y: number } | null) => void;
};

/** Dedicated regional landscape map with authoritative building markers (Slice 2A). */
export function PGRegionMapView({
  regionId,
  regionName,
  buildingMarkers,
  selectedBuildingId = null,
  onSelectBuilding,
  onClearBuildingSelection,
  placementSession = null,
  placementFootprint = Object.freeze({ width: 2, height: 2 }),
  onPickPlacementCandidate,
}: PGRegionMapViewProps) {
  const asset = resolveWorldRegionLandscapeAsset(regionId);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const regionMarkers = useMemo(
    () => buildingMarkers.filter((marker) => marker.regionId === regionId),
    [buildingMarkers, regionId],
  );

  const measureStage = useCallback(() => {
    const stage = stageRef.current;
    if (stage === null) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    setStageSize({ width: rect.width, height: rect.height });
  }, []);

  useLayoutEffect(() => {
    measureStage();
    const stage = stageRef.current;
    if (stage === null || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureStage();
    });
    observer.observe(stage);
    return () => {
      observer.disconnect();
    };
  }, [measureStage, loadState]);

  const handleLoad = useCallback(() => {
    setLoadState('ready');
    measureStage();
  }, [measureStage]);

  const handleError = useCallback(() => {
    setLoadState('error');
  }, []);

  const placementActive =
    placementSession !== null &&
    placementSession.canPlace &&
    placementSession.regionId === regionId &&
    onPickPlacementCandidate !== undefined;

  useEffect(() => {
    if (!placementActive) {
      setHoverCandidate(null);
    }
  }, [placementActive]);

  const contentRect = useMemo(() => {
    if (asset === null || stageSize.width <= 0 || stageSize.height <= 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    return computeObjectFitContainContentRect({
      elementWidth: stageSize.width,
      elementHeight: stageSize.height,
      naturalWidth: asset.naturalWidth,
      naturalHeight: asset.naturalHeight,
    });
  }, [asset, stageSize.height, stageSize.width]);

  const markerPositions = useMemo(() => {
    if (contentRect.width <= 0 || contentRect.height <= 0) {
      return [];
    }

    return regionMarkers.map((marker) => {
      const point = projectDomainPlacementToRegionMapContentPixels(
        { x: marker.domainX, y: marker.domainY },
        contentRect,
      );
      return Object.freeze({ marker, leftPx: point.x, topPx: point.y });
    });
  }, [contentRect, regionMarkers]);

  const [hoverCandidate, setHoverCandidate] = useState<{ readonly x: number; readonly y: number } | null>(
    null,
  );

  const lockedCandidate = placementSession?.candidate ?? null;
  const previewCandidate = lockedCandidate ?? hoverCandidate;

  const placementPreviewStyle = useMemo(() => {
    if (previewCandidate === null || contentRect.width <= 0) {
      return null;
    }

    const topLeft = projectDomainFootprintTopLeftToRegionMapContentPixels(previewCandidate, contentRect);
    const cellW = contentRect.width / REGION_MAP_DOMAIN_GRID_EXTENT;
    const cellH = contentRect.height / REGION_MAP_DOMAIN_GRID_EXTENT;
    const isLocked = lockedCandidate !== null;
    const valid = isLocked && placementSession?.validation?.valid === true;
    const invalid = isLocked && placementSession?.validation?.valid === false;
    const hoverOnly = !isLocked;

    return Object.freeze({
      left: topLeft.x,
      top: topLeft.y,
      width: placementFootprint.width * cellW,
      height: placementFootprint.height * cellH,
      valid,
      invalid,
      hoverOnly,
      isLocked,
    });
  }, [
    contentRect,
    hoverCandidate,
    lockedCandidate,
    placementFootprint.height,
    placementFootprint.width,
    placementSession?.validation?.valid,
    previewCandidate,
  ]);

  const domainFromPointer = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!placementActive || contentRect.width <= 0) {
        return null;
      }

      const stage = stageRef.current;
      if (stage === null) {
        return null;
      }

      const bounds = stage.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      return unprojectRegionMapElementPointToDomainPlacement(localX, localY, contentRect);
    },
    [contentRect, placementActive],
  );

  const pickPlacementAtPointer = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const domain = domainFromPointer(event);
      if (domain === null) {
        return;
      }

      setHoverCandidate(null);
      onPickPlacementCandidate?.(domain);
    },
    [domainFromPointer, onPickPlacementCandidate],
  );

  const handleStagePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (lockedCandidate !== null) {
        return;
      }

      const target = event.target as HTMLElement;
      if (target.closest('.pg-world-region-map-building-marker')) {
        setHoverCandidate(null);
        return;
      }

      const domain = domainFromPointer(event);
      if (domain === null) {
        return;
      }

      setHoverCandidate(domain);
    },
    [domainFromPointer, lockedCandidate],
  );

  const handleStagePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const onBuildingMarker = target.closest('.pg-world-region-map-building-marker') !== null;

      if (placementActive) {
        if (onBuildingMarker) {
          setHoverCandidate(null);
          return;
        }
        pickPlacementAtPointer(event);
        return;
      }

      if (onBuildingMarker) {
        return;
      }

      onClearBuildingSelection?.();
    },
    [onClearBuildingSelection, pickPlacementAtPointer, placementActive],
  );

  const handlePreviewPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      pickPlacementAtPointer(event);
    },
    [pickPlacementAtPointer],
  );

  if (asset === null) {
    return (
      <div
        className="pg-world-region-map-view pg-world-region-map-view--unavailable"
        role="alert"
        data-region-id={regionId}
      >
        <p>Regionskarte für diese Region ist nicht verfügbar.</p>
      </div>
    );
  }

  return (
    <div
      className="pg-world-region-map-view"
      role="group"
      aria-label={`Regionskarte ${regionName}`}
      data-region-id={regionId}
      data-landscape-load-state={loadState}
      data-landscape-url={asset.publicPath}
      data-building-marker-count={regionMarkers.length}
    >
      {loadState === 'error' ? (
        <p className="pg-world-region-map-view-error" role="alert">
          Die Landschaftskarte konnte nicht geladen werden.
        </p>
      ) : (
        <div
          ref={stageRef}
          className={`pg-world-region-map-view-stage${placementActive ? ' is-placement-active' : ''}`}
          onPointerMove={placementActive ? handleStagePointerMove : undefined}
          onPointerDown={handleStagePointerDown}
        >
          <img
            className="pg-world-region-map-view-image"
            src={asset.publicPath}
            alt=""
            width={asset.naturalWidth}
            height={asset.naturalHeight}
            decoding="async"
            draggable={false}
            onLoad={handleLoad}
            onError={handleError}
          />
          {loadState === 'ready' ? (
            <>
              {markerPositions.length > 0 ? (
                <div className="pg-world-region-map-markers" data-testid="region-map-markers">
                  {markerPositions.map(({ marker, leftPx, topPx }) => (
                    <PGRegionMapBuildingMarker
                      key={marker.id}
                      marker={marker}
                      isSelected={selectedBuildingId === marker.id}
                      leftPx={leftPx}
                      topPx={topPx}
                      onSelect={onSelectBuilding}
                    />
                  ))}
                </div>
              ) : null}
              {placementPreviewStyle !== null ? (
                <div
                  className={`pg-world-region-map-placement-preview${
                    placementPreviewStyle.hoverOnly ? ' is-hover' : ''
                  }${placementPreviewStyle.valid ? ' is-valid' : ''}${
                    placementPreviewStyle.invalid ? ' is-invalid' : ''
                  }`}
                  style={{
                    left: placementPreviewStyle.left,
                    top: placementPreviewStyle.top,
                    width: placementPreviewStyle.width,
                    height: placementPreviewStyle.height,
                  }}
                  role="button"
                  tabIndex={placementPreviewStyle.valid ? 0 : -1}
                  aria-disabled={!placementPreviewStyle.valid}
                  onPointerDown={
                    placementPreviewStyle.valid ? handlePreviewPointerDown : undefined
                  }
                  onKeyDown={
                    placementPreviewStyle.valid
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            if (placementSession?.candidate !== null && placementSession?.candidate !== undefined) {
                              onPickPlacementCandidate?.(placementSession.candidate);
                            }
                          }
                        }
                      : undefined
                  }
                  aria-label={
                    placementPreviewStyle.valid
                      ? 'Gültige Platzierungsvorschau — Position bestätigen'
                      : placementPreviewStyle.invalid
                        ? `Ungültige Platzierungsvorschau: ${placementSession?.validation?.reason ?? ''}`
                        : 'Platzierungsvorschau'
                  }
                />
              ) : null}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
