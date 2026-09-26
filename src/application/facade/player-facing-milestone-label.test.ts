import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { MilestoneLoader } from '../../content/milestone/MilestoneLoader.js';
import {
  formatMissingMilestoneReason,
  resolvePlayerFacingMilestoneName,
} from './player-facing-milestone-label.js';

const gameContentMilestonesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../game-content/milestones',
);

describe('player-facing-milestone-label', () => {
  it('resolves every enabled game-content milestone to its authoritative name', async () => {
    const loadResult = await new MilestoneLoader().loadFromDirectory(gameContentMilestonesDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const registry = loadResult.value;
    const enabled = registry.getAll().filter((milestone) => milestone.enabled);

    expect(enabled.length).toBe(8);

    for (const milestone of enabled) {
      const label = resolvePlayerFacingMilestoneName(milestone.id, registry);
      expect(label).toBe(milestone.name);
      expect(label).not.toBe(milestone.id);
      expect(formatMissingMilestoneReason(milestone.id, registry)).toBe(
        `Meilenstein „${milestone.name}“ fehlt.`,
      );
    }
  });

  it('uses deterministic raw-ID fallback for unknown milestone IDs', async () => {
    const loadResult = await new MilestoneLoader().loadFromDirectory(gameContentMilestonesDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const unknownId = 'milestone_does_not_exist_xyz';
    expect(resolvePlayerFacingMilestoneName(unknownId, loadResult.value)).toBe(unknownId);
    expect(formatMissingMilestoneReason(unknownId, loadResult.value)).toBe(
      `Meilenstein „${unknownId}“ fehlt.`,
    );
  });

  it('formats screenshot-confirmed cases with authoritative German names', async () => {
    const loadResult = await new MilestoneLoader().loadFromDirectory(gameContentMilestonesDir);
    expect(loadResult.ok).toBe(true);

    if (!loadResult.ok) {
      return;
    }

    const registry = loadResult.value;
    expect(formatMissingMilestoneReason('first_industrial_machinery', registry)).toBe(
      'Meilenstein „Erste Industriemaschine“ fehlt.',
    );
    expect(formatMissingMilestoneReason('first_advanced_electronics', registry)).toBe(
      'Meilenstein „Erste Advanced Elektronik“ fehlt.',
    );
    expect(formatMissingMilestoneReason('first_machine_parts', registry)).toBe(
      'Meilenstein „Erste Maschinenteile“ fehlt.',
    );
    expect(formatMissingMilestoneReason('first_profit', registry)).toBe(
      'Meilenstein „First Profit“ fehlt.',
    );
    expect(formatMissingMilestoneReason('first_production', registry)).toBe(
      'Meilenstein „First Production“ fehlt.',
    );
  });
});
