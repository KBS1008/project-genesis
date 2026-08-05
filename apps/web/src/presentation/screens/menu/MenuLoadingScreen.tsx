'use client';

import { PGVisualAssetBackground } from '@/presentation/components/assets';
import { LoadingState } from '@/presentation/primitives/LoadingState';

/** MM-007 Loading screen while session status is fetched. */
export function MenuLoadingScreen() {
  return (
    <>
      <PGVisualAssetBackground assetId="MM-007" />
      <div className="pg-menu-loading pg-menu-animate-in" role="status" aria-live="polite">
        <LoadingState label="Hauptmenü wird vorbereitet…" />
      </div>
    </>
  );
}
