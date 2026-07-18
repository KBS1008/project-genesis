import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TransportRouteLoader } from './TransportRouteLoader.js';
import { TransportRouteRegistry } from './TransportRouteRegistry.js';
import { validateTransportRouteDefinition } from './TransportRouteValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = path.resolve(testDirectory, '../../../tests/fixtures/logistics');
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/logistics');

describe('TransportRouteLoader', () => {
  const loader = new TransportRouteLoader();

  it('loads valid transport route fixtures into a registry', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(1);
      expect(result.value.has('route_storage_to_production')).toBe(true);

      const route = result.value.get('route_storage_to_production');
      expect(route?.durationTicks).toBe(8);
      expect(route?.throughputCapacity).toBe(1);
      expect(route?.sourceCategory).toBe('STORAGE');
      expect(route?.destinationCategory).toBe('PRODUCTION');
    }
  });

  it('loads official game content transport routes', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns routes in deterministic order', async () => {
    const result = await loader.loadFromDirectory(fixturesDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getAll().map((route) => route.id)).toEqual(['route_storage_to_production']);
    }
  });

  it('rejects duplicate transport route ids across files', async () => {
    const registry = new TransportRouteRegistry();
    const routeResult = await loader.loadFile(
      path.join(fixturesDirectory, 'route_storage_to_production.yaml'),
    );

    expect(routeResult.ok).toBe(true);

    if (routeResult.ok) {
      const registerResult = registry.register(routeResult.value);
      expect(registerResult.ok).toBe(true);

      const duplicateResult = registry.register(routeResult.value);
      expect(duplicateResult.ok).toBe(false);
    }
  });

  it('rejects routes without category or building-type endpoints', () => {
    const result = validateTransportRouteDefinition({
      id: 'invalid_route',
      name: 'Invalid',
      description: 'Missing endpoints.',
      durationTicks: 5,
      throughputCapacity: 1,
      enabled: true,
      version: 1,
    });

    expect(result.ok).toBe(false);
  });
});
