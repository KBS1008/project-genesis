import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { projectTechnologyUnlockOutcomes } from './technology-unlock-outcome-projection.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

describe('projectTechnologyUnlockOutcomes', () => {
  async function loadContent() {
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

  it('shows Advanced Plank Production blocked when first_production is missing', async () => {
    const gameContent = await loadContent();
    const projection = projectTechnologyUnlockOutcomes({
      progressionContext: {
        completedMilestones: new Set(),
        completedResearch: new Set(['basic_woodworking']),
      },
      recipes: gameContent.recipes,
      buildingTypes: gameContent.buildingTypes,
      milestones: gameContent.milestones,
      technologies: gameContent.technologies,
    });

    const woodworking = projection.find((entry) => entry.technologyId === 'basic_woodworking');
    expect(woodworking).toBeDefined();

    const advancedPlanks = woodworking?.outcomes.find(
      (outcome) => outcome.contentId === 'recipe_advanced_planks',
    );

    expect(advancedPlanks?.name).toBe('Advanced Plank Production');
    expect(advancedPlanks?.progressionEligible).toBe(false);
    expect(advancedPlanks?.progressionBlockerReason).toBe(
      'Meilenstein „First Production“ fehlt.',
    );
  });

  it('marks Advanced Plank Production available when milestone and research are satisfied', async () => {
    const gameContent = await loadContent();
    const projection = projectTechnologyUnlockOutcomes({
      progressionContext: {
        completedMilestones: new Set(['first_production']),
        completedResearch: new Set(['basic_woodworking']),
      },
      recipes: gameContent.recipes,
      buildingTypes: gameContent.buildingTypes,
      milestones: gameContent.milestones,
      technologies: gameContent.technologies,
    });

    const woodworking = projection.find((entry) => entry.technologyId === 'basic_woodworking');
    const advancedPlanks = woodworking?.outcomes.find(
      (outcome) => outcome.contentId === 'recipe_advanced_planks',
    );

    expect(advancedPlanks?.progressionEligible).toBe(true);
    expect(advancedPlanks?.progressionBlockerReason).toBeNull();
  });

  it('does not list outcomes for technologies that are not completed', async () => {
    const gameContent = await loadContent();
    const projection = projectTechnologyUnlockOutcomes({
      progressionContext: {
        completedMilestones: new Set(),
        completedResearch: new Set(),
      },
      recipes: gameContent.recipes,
      buildingTypes: gameContent.buildingTypes,
      milestones: gameContent.milestones,
      technologies: gameContent.technologies,
    });

    expect(projection).toHaveLength(0);
  });

  it('requires other research prerequisites before marking multi-research outcomes available', async () => {
    const gameContent = await loadContent();
    const projection = projectTechnologyUnlockOutcomes({
      progressionContext: {
        completedMilestones: new Set(['first_steel']),
        completedResearch: new Set(['basic_woodworking']),
      },
      recipes: gameContent.recipes,
      buildingTypes: gameContent.buildingTypes,
      milestones: gameContent.milestones,
      technologies: gameContent.technologies,
    });

    const woodworking = projection.find((entry) => entry.technologyId === 'basic_woodworking');
    expect(woodworking?.outcomes.some((outcome) => outcome.contentId === 'machine_shop')).toBe(
      false,
    );

    const metallurgyProjection = projectTechnologyUnlockOutcomes({
      progressionContext: {
        completedMilestones: new Set(['first_steel', 'first_machine_parts']),
        completedResearch: new Set(['advanced_metallurgy']),
      },
      recipes: gameContent.recipes,
      buildingTypes: gameContent.buildingTypes,
      milestones: gameContent.milestones,
      technologies: gameContent.technologies,
    });

    const metallurgy = metallurgyProjection.find(
      (entry) => entry.technologyId === 'advanced_metallurgy',
    );
    const machineShop = metallurgy?.outcomes.find((outcome) => outcome.contentId === 'machine_shop');

    expect(machineShop?.kind).toBe('building');
    expect(machineShop?.progressionEligible).toBe(true);
  });

  it('sorts completed technologies and outcomes deterministically', async () => {
    const gameContent = await loadContent();
    const projection = projectTechnologyUnlockOutcomes({
      progressionContext: {
        completedMilestones: new Set(['first_production', 'first_steel']),
        completedResearch: new Set(['advanced_metallurgy', 'basic_woodworking']),
      },
      recipes: gameContent.recipes,
      buildingTypes: gameContent.buildingTypes,
      milestones: gameContent.milestones,
      technologies: gameContent.technologies,
    });

    const technologyIds = projection.map((entry) => entry.technologyId);
    expect(technologyIds).toEqual([...technologyIds].sort());

    for (const entry of projection) {
      const outcomeKeys = entry.outcomes.map(
        (outcome) => `${outcome.kind}:${outcome.contentId}`,
      );
      expect(outcomeKeys).toEqual([...outcomeKeys].sort());
    }
  });
});