import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ResourceTypeLoader } from '../../content/resource/ResourceTypeLoader.js';
import {
  formatMissingResourceInputReason,
  resolvePlayerFacingResourceName,
} from './player-facing-resource-label.js';

const gameContentResourcesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../game-content/resources',
);

describe('player-facing-resource-label', () => {
  it('resolves every enabled game-content resource to its authoritative name', async () => {
    const loadResult = await new ResourceTypeLoader().loadFromDirectory(gameContentResourcesDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const registry = loadResult.value;
    const enabled = registry.getAll().filter((resource) => resource.enabled);

    expect(enabled.length).toBe(9);

    for (const resource of enabled) {
      const label = resolvePlayerFacingResourceName(resource.id, registry);
      expect(label).toBe(resource.name);
      expect(label).not.toBe(resource.id);
      expect(
        formatMissingResourceInputReason(resource.id, 4, registry, { marketWarehouseHint: false }),
      ).toBe(`Benötigt 4× ${resource.name}.`);
      expect(
        formatMissingResourceInputReason(resource.id, 4, registry, { marketWarehouseHint: true }),
      ).toBe(`Benötigt 4× ${resource.name} — am Markt kaufen (landet im Lager).`);
    }
  });

  it('uses deterministic raw-ID fallback for unknown resource IDs', async () => {
    const loadResult = await new ResourceTypeLoader().loadFromDirectory(gameContentResourcesDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const unknownId = 'resource_does_not_exist_xyz';
    expect(resolvePlayerFacingResourceName(unknownId, loadResult.value)).toBe(unknownId);
    expect(
      formatMissingResourceInputReason(unknownId, 2, loadResult.value, {
        marketWarehouseHint: false,
      }),
    ).toBe(`Benötigt 2× ${unknownId}.`);
  });

  it('formats wood with authoritative content name', async () => {
    const loadResult = await new ResourceTypeLoader().loadFromDirectory(gameContentResourcesDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    expect(
      formatMissingResourceInputReason('wood', 10, loadResult.value, { marketWarehouseHint: false }),
    ).toBe('Benötigt 10× Holz.');
  });
});
