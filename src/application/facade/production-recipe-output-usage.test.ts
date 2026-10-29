import { describe, expect, it } from 'vitest';
import {
  computeRecipeOutputUsage,
  type RecipeCatalogDependencyEntry,
} from './production-recipe-output-usage.js';

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
  entry('recipe_consumer_goods', 'Konsumgüter herstellen', ['planks'], ['consumer_goods'], [
    'consumer_goods_plant',
  ]),
]);

describe('computeRecipeOutputUsage', () => {
  it('returns a single downstream consumer for steel output', () => {
    const usage = computeRecipeOutputUsage([{ resourceId: 'steel' }], CHAIN_CATALOG);
    const steel = usage.find((row) => row.resourceId === 'steel');

    expect(steel?.consumers).toHaveLength(1);
    expect(steel?.consumers[0]?.recipeId).toBe('recipe_machine_parts');
  });

  it('returns all downstream consumers without omitting matches', () => {
    const catalog = Object.freeze([
      ...CHAIN_CATALOG,
      entry('recipe_industrial_machinery', 'Industriemaschinen montieren', ['steel'], [
        'industrial_machinery',
      ]),
    ]);

    const usage = computeRecipeOutputUsage([{ resourceId: 'steel' }], catalog);
    const steel = usage.find((row) => row.resourceId === 'steel');

    expect(steel?.consumers.map((consumer) => consumer.recipeId)).toEqual([
      'recipe_machine_parts',
      'recipe_industrial_machinery',
    ]);
  });

  it('returns empty consumers when no recipe consumes the output resource', () => {
    const usage = computeRecipeOutputUsage([{ resourceId: 'machine_parts' }], CHAIN_CATALOG);

    expect(usage).toHaveLength(1);
    expect(usage[0]?.consumers).toEqual([]);
  });

  it('groups downstream uses separately for multiple outputs', () => {
    const catalog = Object.freeze([
      entry('recipe_multi', 'Multi Output', ['wood'], ['planks', 'steel']),
      entry('recipe_planks', 'Bretter', ['planks'], ['consumer_goods']),
      entry('recipe_steel_use', 'Stahlverbrauch', ['steel'], ['machine_parts']),
    ]);

    const usage = computeRecipeOutputUsage(
      [{ resourceId: 'planks' }, { resourceId: 'steel' }],
      catalog,
    );

    expect(usage).toHaveLength(2);
    expect(usage[0]?.resourceId).toBe('planks');
    expect(usage[0]?.consumers[0]?.recipeId).toBe('recipe_planks');
    expect(usage[1]?.resourceId).toBe('steel');
    expect(usage[1]?.consumers[0]?.recipeId).toBe('recipe_steel_use');
  });

  it('matches by resource id, not display names', () => {
    const catalog = Object.freeze([
      entry('recipe_a', 'Display A', ['steel_id'], ['out_a']),
      entry('recipe_b', 'Display B', ['wrong_label'], ['out_b']),
    ]);

    const usage = computeRecipeOutputUsage([{ resourceId: 'steel_id' }], catalog);

    expect(usage[0]?.consumers).toHaveLength(1);
    expect(usage[0]?.consumers[0]?.recipeId).toBe('recipe_a');
  });

  it('does not duplicate the same downstream recipe for one output', () => {
    const catalog = Object.freeze([
      entry('recipe_dup', 'Dup inputs', ['steel', 'steel'], ['out']),
      entry('recipe_steel', 'Stahl', [], ['steel']),
    ]);

    const usage = computeRecipeOutputUsage([{ resourceId: 'steel' }], catalog);

    expect(usage[0]?.consumers).toHaveLength(1);
    expect(usage[0]?.consumers[0]?.recipeId).toBe('recipe_dup');
  });

  it('preserves catalog order for deterministic sorting', () => {
    const catalog = Object.freeze([
      entry('recipe_z', 'Z last', ['steel'], ['z_out']),
      entry('recipe_a', 'A first', ['steel'], ['a_out']),
      entry('recipe_m', 'M middle', ['steel'], ['m_out']),
      entry('recipe_steel', 'Stahl', [], ['steel']),
    ]);

    const usage = computeRecipeOutputUsage([{ resourceId: 'steel' }], catalog);

    expect(usage[0]?.consumers.map((consumer) => consumer.recipeId)).toEqual([
      'recipe_z',
      'recipe_a',
      'recipe_m',
    ]);
  });

  it('includes self as consumer when the same recipe consumes its output resource', () => {
    const catalog = Object.freeze([
      entry('recipe_loop', 'Loop', ['loop_item'], ['loop_item']),
    ]);

    const usage = computeRecipeOutputUsage([{ resourceId: 'loop_item' }], catalog);

    expect(usage[0]?.consumers).toHaveLength(1);
    expect(usage[0]?.consumers[0]?.recipeId).toBe('recipe_loop');
  });
});
