import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

/** Minimum export contract premium over resource base price. */
const EXPORT_CONTRACT_PREMIUM = 1.12;

/** Minimum recipe output value margin over input material value. */
const RECIPE_VALUE_MARGIN = 1.05;

const INDUSTRIAL_CHAIN_PRICES = Object.freeze([
  { resourceId: 'steel', minimumBasePrice: 75 },
  { resourceId: 'machine_parts', minimumBasePrice: 140 },
  { resourceId: 'industrial_machinery', minimumBasePrice: 300 },
  { resourceId: 'advanced_electronics', minimumBasePrice: 500 },
  { resourceId: 'consumer_goods', minimumBasePrice: 700 },
]);

const INDUSTRIAL_CHAIN_RECIPES = Object.freeze([
  'recipe_steel',
  'recipe_machine_parts',
  'recipe_industrial_machinery',
  'recipe_advanced_electronics',
  'recipe_consumer_goods',
]);

const EARLY_RESEARCH_PACING = Object.freeze([
  { technologyId: 'basic_woodworking', maxCost: 1100, maxDuration: 55 },
  { technologyId: 'advanced_metallurgy', maxCost: 2400, maxDuration: 85 },
]);

const DIFFICULTY_PROFILE = Object.freeze({
  smelterMaxConstructionCost: 11_500,
  machineShopMaxConstructionCost: 9_500,
});

function recipeMaterialValue(
  entries: readonly { readonly resource: string; readonly amount: number }[],
  basePrices: ReadonlyMap<string, number>,
): number {
  return entries.reduce((total, entry) => {
    const basePrice = basePrices.get(entry.resource);

    if (basePrice === undefined) {
      throw new Error(`Missing base price for resource "${entry.resource}".`);
    }

    return total + basePrice * entry.amount;
  }, 0);
}

describe('M10 balancing profile', () => {
  it('keeps industrial tier prices ascending and recipes margin-positive', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { resourceTypes, recipes } = result.value;
    const basePrices = new Map(
      resourceTypes.getAll().map((resource) => [resource.id, resource.basePrice]),
    );

    let previousPrice = 0;

    for (const step of INDUSTRIAL_CHAIN_PRICES) {
      const resource = resourceTypes.get(step.resourceId);
      expect(resource).toBeDefined();
      expect(resource?.basePrice).toBeGreaterThanOrEqual(step.minimumBasePrice);
      expect(resource?.basePrice).toBeGreaterThan(previousPrice);
      previousPrice = resource?.basePrice ?? 0;
    }

    for (const recipeId of INDUSTRIAL_CHAIN_RECIPES) {
      const recipe = recipes.get(recipeId);
      expect(recipe).toBeDefined();

      if (recipe === undefined) {
        continue;
      }

      const inputValue = recipeMaterialValue(recipe.inputs, basePrices);
      const outputValue = recipeMaterialValue(recipe.outputs, basePrices);

      expect(outputValue).toBeGreaterThanOrEqual(inputValue * RECIPE_VALUE_MARGIN);
    }
  });

  it('pays export contracts above market base price with a premium', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { resourceTypes, supplyContractTemplates } = result.value;

    for (const template of supplyContractTemplates.getEnabled()) {
      if (!template.tags.includes('contract_export') || template.autoGrantOnNewGame) {
        continue;
      }

      const resource = resourceTypes.get(template.resourceId);
      expect(resource).toBeDefined();

      const unitPayment = template.paymentAmount / template.amount;
      const minimumUnitPayment = (resource?.basePrice ?? 0) * EXPORT_CONTRACT_PREMIUM;

      expect(unitPayment).toBeGreaterThanOrEqual(minimumUnitPayment - 1e-6);
    }
  });

  it('keeps early industrial research and smelter costs within the standard difficulty profile', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { technologies, buildingTypes } = result.value;

    for (const pacing of EARLY_RESEARCH_PACING) {
      const technology = technologies.get(pacing.technologyId);
      expect(technology).toBeDefined();
      expect(technology?.researchCost).toBeLessThanOrEqual(pacing.maxCost);
      expect(technology?.researchDuration).toBeLessThanOrEqual(pacing.maxDuration);
    }

    const smelter = buildingTypes.get('smelter');
    expect(smelter?.constructionCost).toBeLessThanOrEqual(DIFFICULTY_PROFILE.smelterMaxConstructionCost);

    const machineShop = buildingTypes.get('machine_shop');
    expect(machineShop?.constructionCost).toBeLessThanOrEqual(
      DIFFICULTY_PROFILE.machineShopMaxConstructionCost,
    );
  });
});
