/**
 * @module @application/facade/production-recipe-input-origin
 *
 * Side-effect-free upstream recipe lookup for production-chain UI (P2-PC-S3).
 */

import type { RecipeCatalogDependencyEntry } from './production-recipe-output-usage.js';

/** One catalog recipe that outputs a required input resource. */
export type RecipeInputOriginProducerReadModel = {
  readonly recipeId: string;
  readonly recipeName: string;
  readonly buildingTypeIds: readonly string[];
};

/** Upstream producers grouped by one input resource of the selected recipe. */
export type RecipeInputOriginReadModel = {
  readonly resourceId: string;
  readonly producers: readonly RecipeInputOriginProducerReadModel[];
};

function compareRecipeIds(left: string, right: string): number {
  return left.localeCompare(right);
}

/**
 * For each input resource of a recipe, finds catalog recipes whose outputs
 * include that resource ID (stable catalog order, deduplicated per input).
 */
export function computeRecipeInputOrigin(
  recipeInputs: readonly { readonly resourceId: string }[],
  catalog: readonly RecipeCatalogDependencyEntry[],
): readonly RecipeInputOriginReadModel[] {
  const catalogOrder = new Map(catalog.map((entry, index) => [entry.id, index] as const));

  return Object.freeze(
    recipeInputs.map((input) => {
      const seenRecipeIds = new Set<string>();
      const producers: RecipeInputOriginProducerReadModel[] = [];

      for (const candidate of catalog) {
        const producesInput = candidate.outputs.some(
          (output) => output.resourceId === input.resourceId,
        );

        if (!producesInput || seenRecipeIds.has(candidate.id)) {
          continue;
        }

        seenRecipeIds.add(candidate.id);
        producers.push(
          Object.freeze({
            recipeId: candidate.id,
            recipeName: candidate.name,
            buildingTypeIds: Object.freeze([...candidate.buildingTypeIds]),
          }),
        );
      }

      producers.sort((left, right) => {
        const leftIndex = catalogOrder.get(left.recipeId) ?? Number.MAX_SAFE_INTEGER;
        const rightIndex = catalogOrder.get(right.recipeId) ?? Number.MAX_SAFE_INTEGER;

        if (leftIndex !== rightIndex) {
          return leftIndex - rightIndex;
        }

        return compareRecipeIds(left.recipeId, right.recipeId);
      });

      return Object.freeze({
        resourceId: input.resourceId,
        producers: Object.freeze(producers),
      });
    }),
  );
}
