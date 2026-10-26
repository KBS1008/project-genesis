import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isWorldScenicBackgroundEnabled,
  isWorldScenicIntegrationBannerVisible,
} from '@/presentation/config/world-scenic-feature';

describe('world-scenic-feature', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to disabled when env is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND', undefined);
    expect(isWorldScenicBackgroundEnabled()).toBe(false);
  });

  it('enables scenic background for QA values 1 and true', () => {
    vi.stubEnv('NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND', '1');
    expect(isWorldScenicBackgroundEnabled()).toBe(true);

    vi.stubEnv('NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND', 'true');
    expect(isWorldScenicBackgroundEnabled()).toBe(true);
  });

  it('stays disabled for other values', () => {
    vi.stubEnv('NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND', 'yes');
    expect(isWorldScenicBackgroundEnabled()).toBe(false);
  });

  it('shows integration banner only when scenic flag is on in development', () => {
    vi.stubEnv('NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND', '1');
    vi.stubEnv('NODE_ENV', 'development');
    expect(isWorldScenicIntegrationBannerVisible()).toBe(true);

    vi.stubEnv('NODE_ENV', 'production');
    expect(isWorldScenicIntegrationBannerVisible()).toBe(false);

    vi.stubEnv('NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND', undefined);
    vi.stubEnv('NODE_ENV', 'development');
    expect(isWorldScenicIntegrationBannerVisible()).toBe(false);
  });
});
