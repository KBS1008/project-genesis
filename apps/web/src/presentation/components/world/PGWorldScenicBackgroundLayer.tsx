'use client';

import { useCallback, useState } from 'react';
import type { ScenicPlateLayoutRect } from '@/presentation/adapters/mappers/world-scenic-calibration';
import type { WorldScenicPresentationProfile } from '@/presentation/adapters/mappers/world-scenic-presentation-profile';

/** Non-interactive scenic JPEG under the SVG world canvas (presentation only). */
export function PGWorldScenicBackgroundLayer({
  profile,
  layout,
  canvasWidth,
  canvasHeight,
}: {
  readonly profile: WorldScenicPresentationProfile;
  readonly layout: ScenicPlateLayoutRect;
  readonly canvasWidth: number;
  readonly canvasHeight: number;
}) {
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const handleLoad = useCallback(() => {
    setLoadState('ready');
  }, []);

  const handleError = useCallback(() => {
    setLoadState('error');
  }, []);

  return (
    <div
      className="pg-world-scenic-background-layer"
      aria-hidden="true"
      data-scenic-load-state={loadState}
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      {loadState !== 'error' ? (
        <img
          className="pg-world-scenic-background-image"
          src={profile.plateAssetUrl}
          alt=""
          width={profile.plateWidth}
          height={profile.plateHeight}
          draggable={false}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            left: layout.x,
            top: layout.y,
            width: layout.width,
            height: layout.height,
          }}
        />
      ) : null}
    </div>
  );
}
