import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { MilestoneDefinition, MilestoneTriggerType } from '../../content/milestone/MilestoneDefinition.js';
import {
  MILESTONE_REQUIRED_BY_EMPTY_MESSAGE,
  projectMilestoneCatalogProgression,
} from './milestone-catalog-progression-projection.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

async function loadContentContext() {
  const bootstrapResult = await bootstrapApplication({
    gameContentRoot,
    strictContent: true,
  });

  expect(bootstrapResult.ok).toBe(true);

  if (!bootstrapResult.ok) {
    throw new Error(bootstrapResult.error.message);
  }

  return bootstrapResult.value.gameContent;
}

describe('projectMilestoneCatalogProgression', () => {
  it('includes smelter as a direct building dependency of first_production', async () => {
    const gameContent = await loadContentContext();

    const milestone = gameContent.milestones.get('first_production');
    expect(milestone).toBeDefined();

    if (milestone === undefined) {
      return;
    }

    const projection = projectMilestoneCatalogProgression({
      milestone,
      milestones: gameContent.milestones,
      buildingTypes: gameContent.buildingTypes,
      recipes: gameContent.recipes,
      technologies: gameContent.technologies,
    });

    expect(projection.criteriaSummary).toBe('Schließen Sie 1 Produktionsauftrag ab.');
    expect(projection.requiredByLabels.some((label) => label.includes('Schmelze'))).toBe(
      true,
    );
    expect(
      projection.requiredByLabels.some((label) => label.startsWith('Rezept:')),
    ).toBe(true);
    expect(projection.requiredByLabels.some((label) => label.includes('recipe_steel'))).toBe(
      false,
    );
  });

  it('returns empty dependency labels when no content references the milestone', async () => {
    const gameContent = await loadContentContext();

    const projection = projectMilestoneCatalogProgression({
      milestone: new MilestoneDefinition({
        id: 'synthetic_unused',
        name: 'Synthetic',
        description: '',
        trigger: { type: MilestoneTriggerType.FIRST_SALE },
        enabled: true,
        version: 1,
      }),
      milestones: gameContent.milestones,
      buildingTypes: gameContent.buildingTypes,
      recipes: gameContent.recipes,
      technologies: gameContent.technologies,
    });

    expect(projection.requiredByLabels).toEqual([]);
    expect(projection.requiredByOverflowCount).toBe(0);
    expect(projection.criteriaSummary).toContain('Verkauf');
  });

  it('records overflow when display limit is exceeded', async () => {
    const gameContent = await loadContentContext();

    const milestone = gameContent.milestones.get('first_production');
    expect(milestone).toBeDefined();

    if (milestone === undefined) {
      return;
    }

    const projection = projectMilestoneCatalogProgression({
      milestone,
      milestones: gameContent.milestones,
      buildingTypes: gameContent.buildingTypes,
      recipes: gameContent.recipes,
      technologies: gameContent.technologies,
      displayLimit: 2,
    });

    expect(projection.requiredByLabels).toHaveLength(2);
    expect(projection.requiredByOverflowCount).toBeGreaterThan(0);
  });

  it('does not mutate milestone definitions', async () => {
    const gameContent = await loadContentContext();

    const milestone = gameContent.milestones.get('first_production');
    expect(milestone).toBeDefined();

    if (milestone === undefined) {
      return;
    }

    const triggerBefore = { ...milestone.trigger };

    projectMilestoneCatalogProgression({
      milestone,
      milestones: gameContent.milestones,
      buildingTypes: gameContent.buildingTypes,
      recipes: gameContent.recipes,
      technologies: gameContent.technologies,
    });

    expect(milestone.trigger).toEqual(triggerBefore);
    expect(MILESTONE_REQUIRED_BY_EMPTY_MESSAGE.length).toBeGreaterThan(0);
  });
});
