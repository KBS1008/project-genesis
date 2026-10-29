'use client';

import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { WorldBuildingMarkerViewData } from '@/presentation/adapters/view-data/world-view-data';
import {
  resolveWorldBuildingMarkerCompactUrl,
  resolveWorldBuildingMarkerVisualSpec,
} from '@/presentation/components/world/world-building-marker-visual';
import {
  resolveScenicBuildingContactShadowLayout,
  SCENIC_BUILDING_GROUNDING_VISUAL_STACK_OFFSET_Y,
} from '@/presentation/components/world/world-scenic-building-grounding';

type PGWorldBuildingMarkerProps = {
  readonly marker: WorldBuildingMarkerViewData;
  readonly isSelected: boolean;
  readonly isPreview?: boolean;
  readonly onSelect?: (buildingId: string) => void;
  /** Counter-scale for scenic viewport zoom (presentation-only). */
  readonly scenicPresentationScale?: number;
  /** Scenic-only grounding stack (shadow/anchor); does not move hit targets or world coords. */
  readonly scenicGroundingPresentation?: boolean;
};

/** World map building marker using sealed ICON-003 compact assets (WBM-001). */
export function PGWorldBuildingMarker({
  marker,
  isSelected,
  isPreview = false,
  onSelect,
  scenicPresentationScale = 1,
  scenicGroundingPresentation = false,
}: PGWorldBuildingMarkerProps) {
  const spec = resolveWorldBuildingMarkerVisualSpec(marker.buildingTypeId, marker.clusterSize);
  const [imageFailed, setImageFailed] = useState(false);
  const compactUrl = imageFailed ? null : resolveWorldBuildingMarkerCompactUrl(marker.buildingTypeId);
  const displayScale = isSelected ? spec.selectedScale : 1;
  const hitSize = spec.hitSize * displayScale;
  const halfHit = hitSize / 2;
  const glyphWidth = spec.width * displayScale;
  const glyphHeight = spec.height * displayScale;
  const imageX = halfHit - glyphWidth / 2;
  const imageY = halfHit - glyphHeight / 2;
  const silhouetteRadius = (Math.max(glyphWidth, glyphHeight) / 2) * 0.92;
  const selectionRingRadius = silhouetteRadius + (isSelected ? 6 : 0);
  const presentationScale =
    Number.isFinite(scenicPresentationScale) && scenicPresentationScale > 0 ? scenicPresentationScale : 1;
  const rootTransform =
    presentationScale === 1
      ? `translate(${marker.x - halfHit} ${marker.y - halfHit})`
      : `translate(${marker.x} ${marker.y}) scale(${presentationScale}) translate(${-halfHit} ${-halfHit})`;

  const contactShadow = scenicGroundingPresentation
    ? resolveScenicBuildingContactShadowLayout(halfHit, silhouetteRadius)
    : Object.freeze({
        cx: halfHit,
        cy: halfHit + silhouetteRadius * 0.45,
        rx: silhouetteRadius * 0.9,
        ry: silhouetteRadius * 0.28,
      });

  const markerArtwork = compactUrl !== null ? (
    <>
      <ellipse
        className="pg-world-building-marker-shadow"
        cx={contactShadow.cx}
        cy={contactShadow.cy}
        rx={contactShadow.rx}
        ry={contactShadow.ry}
        aria-hidden="true"
      />
      <circle
        className="pg-world-building-marker-ground"
        cx={halfHit}
        cy={halfHit}
        r={silhouetteRadius * (scenicGroundingPresentation ? 0.88 : 1)}
        aria-hidden="true"
      />
      <image
        className="pg-world-building-marker-glyph"
        href={compactUrl}
        x={imageX}
        y={imageY}
        width={glyphWidth}
        height={glyphHeight}
        onError={() => {
          setImageFailed(true);
        }}
      />
    </>
  ) : (
    <circle className="pg-world-building-marker-fallback" cx={halfHit} cy={halfHit} r={6} />
  );

  const activate = () => {
    if (isPreview) {
      return;
    }

    onSelect?.(marker.id);
  };

  const onClick = (event: MouseEvent) => {
    if (isPreview) {
      return;
    }

    event.stopPropagation();
    activate();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (isPreview) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      activate();
    }
  };

  return (
    <g
      className={`pg-world-building-marker${isSelected ? ' is-selected' : ''}${isPreview ? ' is-preview' : ''}${scenicGroundingPresentation ? ' pg-world-building-marker--scenic-grounding' : ''}`}
      transform={rootTransform}
      role={isPreview ? 'img' : 'button'}
      tabIndex={isPreview ? undefined : 0}
      aria-label={isPreview ? `Vorschau ${marker.label}` : `Gebäude ${marker.label}`}
      data-building-type-id={marker.buildingTypeId}
      data-building-id={isPreview ? undefined : marker.id}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <rect
        className="pg-world-building-marker-hit"
        width={hitSize}
        height={hitSize}
        x={0}
        y={0}
        fill="transparent"
        onClick={onClick}
        onPointerDown={(event) => {
          if (!isPreview) {
            event.stopPropagation();
          }
        }}
      />
      {scenicGroundingPresentation && compactUrl !== null ? (
        <g
          className="pg-world-building-marker-scenic-stack"
          transform={`translate(0 ${SCENIC_BUILDING_GROUNDING_VISUAL_STACK_OFFSET_Y})`}
        >
          {markerArtwork}
        </g>
      ) : (
        markerArtwork
      )}
      {isSelected ? (
        <circle
          className="pg-world-building-marker-selection-ring"
          cx={halfHit}
          cy={halfHit}
          r={selectionRingRadius}
          aria-hidden="true"
        />
      ) : null}
    </g>
  );
}
