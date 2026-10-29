import { describe, expect, it } from 'vitest';
import { computeRecipeInputOrigin } from './production-recipe-input-origin.js';
import type { RecipeCatalogDependencyEntry } from './production-recipe-output-usage.js';

function entry(
  id: string,
  name: string,
  inputs: readonly string[],
  outputs: readonly string[],
  buildingTypeIds: readonly string[] = ['building_type'],
): RecipeCatalogDependencyEntry {
  return Object.freeze({
    id,
    name,
    inputs: Object.freeze(inputs.map((resourceId) => Object.freeze({ resourceId }))),
    outputs: Object.freeze(outputs.map((resourceId) => Object.freeze({ resourceId }))),
    buildingTypeIds: Object.freeze([...buildingTypeIds]),
  });
}

const CHAIN_CATALOG: readonly RecipeCatalogDependencyEntry[] = Object.freeze([
  entry('recipe_steel', 'Stahl schmelzen', ['iron_ore'], ['steel'], ['smelter']),
  entry('recipe_machine_parts', 'Maschinenteile fertigen', ['steel'], ['machine_parts'], [
    'machine_shop',
  ]),
  entry('recipe_planks', 'Bretter herstellen', ['wood'], ['planks'], ['sawmill']),
  entry('recipe_advanced_planks', 'Advanced Planks', ['wood'], ['planks'], ['sawmill']),
  entry('recipe_consumer_goods', 'Konsumgüter herstellen', ['planks'], ['consumer_goods'], [
    'consumer_goods_plant',
  ]),
]);

describe('computeRecipeInputOrigin', () => {
  it('returns a single producer for steel input', () => {
    const origin = computeRecipeInputOrigin([{ resourceId: 'steel' }], CHAIN_CATALOG);
    const steel = origin.find((row) => row.resourceId === 'steel');

    expect(steel?.producers).toHaveLength(1);
    expect(steel?.producers[0]?.recipeId).toBe('recipe_steel');
  });

  it('returns all producers for planks input without omitting matches', () => {
    const origin = computeRecipeInputOrigin([{ resourceId: 'planks' }], CHAIN_CATALOG);
    const planks = origin.find((row) => row.resourceId === 'planks');

    expect(planks?.producers.map((producer) => producer.recipeId)).toEqual([
      'recipe_planks',
      'recipe_advanced_planks',
    ]);
  });

  it('returns empty producers when no recipe outputs the input resource', () => {
    const origin = computeRecipeInputOrigin([{ resourceId: 'wood' }], CHAIN_CATALOG);

    expect(origin).toHaveLength(1);
    expect(origin[0]?.producers).toEqual([]);
  });

  it('returns empty producers for iron_ore', () => {
    const origin = computeRecipeInputOrigin([{ resourceId: 'iron_ore' }], CHAIN_CATALOG);

    expect(origin[0]?.producers).toEqual([]);
  });

  it('preserves catalog order for deterministic sorting', () => {
    const catalog = Object.freeze([
      entry('recipe_z', 'Z', [], ['steel']),
      entry('recipe_a', 'A', [], ['steel']),
      entry('recipe_m', 'M', [], ['steel']),
    ]);

    const origin = computeRecipeInputOrigin([{ resourceId: 'steel' }], catalog);

    expect(origin[0]?.producers.map((producer) => producer.recipeId)).toEqual([
      'recipe_z',
      'recipe_a',
      'recipe_m',
    ]);
  });

  it('does not duplicate the same producer recipe for one input', () => {
    const catalog = Object.freeze([
      entry('recipe_dup', 'Dup outputs', [], ['steel', 'steel']),
    ]);

    const origin = computeRecipeInputOrigin([{ resourceId: 'steel' }], catalog);

    expect(origin[0]?.producers).toHaveLength(1);
    expect(origin[0]?.producers[0]?.recipeId).toBe('recipe_dup');
  });

  it('matches when any output on a multi-output recipe has the required resource id', () => {
    const catalog = Object.freeze([
      entry('recipe_multi', 'Multi', [], ['planks', 'steel']),
    ]);

    const origin = computeRecipeInputOrigin(
      [{ resourceId: 'planks' }, { resourceId: 'steel' }],
      catalog,
    );

    expect(origin).toHaveLength(2);
    expect(origin[0]?.producers[0]?.recipeId).toBe('recipe_multi');
    expect(origin[1]?.producers[0]?.recipeId).toBe('recipe_multi');
  });

  it('returns valid empty producer lists for an empty catalog', () => {
    const origin = computeRecipeInputOrigin([{ resourceId: 'steel' }], Object.freeze([]));

    expect(origin).toHaveLength(1);
    expect(origin[0]?.producers).toEqual([]);
  });

  it('matches by resource id, not display names', () => {
    const catalog = Object.freeze([
      entry('recipe_a', 'Display A', [], ['steel_id']),
      entry('recipe_b', 'Display B', [], ['wrong_label']),
    ]);

    const origin = computeRecipeInputOrigin([{ resourceId: 'steel_id' }], catalog);

    expect(origin[0]?.producers).toHaveLength(1);
    expect(origin[0]?.producers[0]?.recipeId).toBe('recipe_a');
  });

  it('preserves selected recipe input order', () => {
    const origin = computeRecipeInputOrigin(
      [{ resourceId: 'steel' }, { resourceId: 'wood' }, { resourceId: 'planks' }],
      CHAIN_CATALOG,
    );

    expect(origin.map((row) => row.resourceId)).toEqual(['steel', 'wood', 'planks']);
  });

  it('includes self as producer when the same recipe outputs its input resource', () => {
    const catalog = Object.freeze([
      entry('recipe_loop', 'Loop', ['loop_item'], ['loop_item']),
    ]);

    const origin = computeRecipeInputOrigin([{ resourceId: 'loop_item' }], catalog);

    expect(origin[0]?.producers).toHaveLength(1);
    expect(origin[0]?.producers[0]?.recipeId).toBe('recipe_loop');
  });

  it('retains building type ids for presentation', () => {
    const origin = computeRecipeInputOrigin([{ resourceId: 'steel' }], CHAIN_CATALOG);

    expect(origin[0]?.producers[0]?.buildingTypeIds).toEqual(['smelter']);
  });
});
