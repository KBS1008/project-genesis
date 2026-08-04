import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchCities, fetchWorldMap } from '@/presentation/adapters/api/world-client';

const callApi = vi.fn();

vi.mock('./client', () => ({
  callApi: (...args: unknown[]) => callApi(...args),
}));

describe('world-client', () => {
  beforeEach(() => {
    callApi.mockReset();
    callApi.mockResolvedValue({});
  });

  it('fetchWorldMap requests the world map endpoint', async () => {
    await fetchWorldMap();
    expect(callApi).toHaveBeenCalledWith('/api/world/map');
  });

  it('fetchCities passes optional region filter', async () => {
    await fetchCities('region_001');
    expect(callApi).toHaveBeenCalledWith('/api/world/cities?regionId=region_001');
  });
});
