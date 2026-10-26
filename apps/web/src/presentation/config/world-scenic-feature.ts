/**
 * Controlled development / QA switch for the 2D scenic world background (Slice 1).
 * Default: disabled — production world rendering is unchanged.
 */

export const WORLD_SCENIC_BACKGROUND_ENV_KEY = 'NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND';

function readScenicBackgroundEnv(): string | undefined {
  return process.env.NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND;
}

/** True only when `NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND` is `1` or `true` (case-sensitive). */
export function isWorldScenicBackgroundEnabled(): boolean {
  const value = readScenicBackgroundEnv();
  return value === '1' || value === 'true';
}

/** Slice 4: integration note visible only in local development when scenic flag is on (not production default). */
export function isWorldScenicIntegrationBannerVisible(): boolean {
  return isWorldScenicBackgroundEnabled() && process.env.NODE_ENV === 'development';
}
