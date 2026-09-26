import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TechnologyLoader } from '../../content/research/TechnologyLoader.js';
import {
  formatMissingTechnologyReason,
  resolvePlayerFacingTechnologyName,
} from './player-facing-technology-label.js';

const gameContentResearchDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../game-content/research',
);

describe('player-facing-technology-label', () => {
  it('resolves every enabled game-content technology to its authoritative name', async () => {
    const loadResult = await new TechnologyLoader().loadFromDirectory(gameContentResearchDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const registry = loadResult.value;
    const enabled = registry.getAll().filter((technology) => technology.enabled);

    expect(enabled.length).toBe(22);

    for (const technology of enabled) {
      const label = resolvePlayerFacingTechnologyName(technology.id, registry);
      expect(label).toBe(technology.name);
      expect(label).not.toBe(technology.id);
      expect(formatMissingTechnologyReason(technology.id, registry)).toBe(
        `Forschung „${technology.name}“ fehlt.`,
      );
    }
  });

  it('uses deterministic raw-ID fallback for unknown technology IDs', async () => {
    const loadResult = await new TechnologyLoader().loadFromDirectory(gameContentResearchDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const unknownId = 'technology_does_not_exist_xyz';
    expect(resolvePlayerFacingTechnologyName(unknownId, loadResult.value)).toBe(unknownId);
    expect(formatMissingTechnologyReason(unknownId, loadResult.value)).toBe(
      `Forschung „${unknownId}“ fehlt.`,
    );
  });

  it('formats advanced_metallurgy with authoritative content name', async () => {
    const loadResult = await new TechnologyLoader().loadFromDirectory(gameContentResearchDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    expect(formatMissingTechnologyReason('advanced_metallurgy', loadResult.value)).toBe(
      'Forschung „Fortgeschrittene Metallurgie“ fehlt.',
    );
  });
});
