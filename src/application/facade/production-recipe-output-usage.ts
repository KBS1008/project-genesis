/**
 * @module @application/facade/production-recipe-output-usage
 *
 * Side-effect-free downstream recipe lookup for production-chain UI (P2-PC-S2).
 */

/** Minimal recipe row for dependency matching. */
export type RecipeCatalogDependencyEntry = {
  readonly id: string;
  readonly name: string;
  readonly inputs: readonly { readonly resourceId: string }[];
  readonly outputs: readonly { readonly resourceId: string }[];
  readonly buildingTypeIds: readonly string[];
};

/** One downstream consumer of an output resource. */
export type RecipeOutputConsumerReadModel = {
  readonly recipeId: string;
  readonly recipeName: string;
  readonly buildingTypeIds: readonly string[];
};

/** Downstream uses grouped by one output resource of the selected recipe. */
export type RecipeOutputUsageReadModel = {
  readonly resourceId: string;
  readonly consumers: readonly RecipeOutputConsumerReadModel[];
};

function compareRecipeIds(left: string, right: string): number {
  return left.localeCompare(right);
}

/**
 * For each output resource of a recipe, finds catalog recipes whose inputs
 * include that resource ID (stable catalog order, deduplicated per output).
 */
export function computeRecipeOutputUsage(
  recipeOutputs: readonly { readonly resourceId: string }[],
  catalog: readonly RecipeCatalogDependencyEntry[],
): readonly RecipeOutputUsageReadModel[] {
  const catalogOrder = new Map(catalog.map((entry, index) => [entry.id, index] as const));

  return Object.freeze(
    recipeOutputs.map((output) => {
      const seenRecipeIds = new Set<string>();
      const consumers: RecipeOutputConsumerReadModel[] = [];

      for (const candidate of catalog) {
        const consumesOutput = candidate.inputs.some(
          (input) => input.resourceId === output.resourceId,
        );

        if (!consumesOutput || seenRecipeIds.has(candidate.id)) {
          continue;
        }

        seenRecipeIds.add(candidate.id);
        consumers.push(
          Object.freeze({
            recipeId: candidate.id,
            recipeName: candidate.name,
            buildingTypeIds: Object.freeze([...candidate.buildingTypeIds]),
          }),
        );
      }

      consumers.sort((left, right) => {
        const leftIndex = catalogOrder.get(left.recipeId) ?? Number.MAX_SAFE_INTEGER;
        const rightIndex = catalogOrder.get(right.recipeId) ?? Number.MAX_SAFE_INTEGER;

        if (leftIndex !== rightIndex) {
          return leftIndex - rightIndex;
        }

        return compareRecipeIds(left.recipeId, right.recipeId);
      });

      return Object.freeze({
        resourceId: output.resourceId,
        consumers: Object.freeze(consumers),
      });
    }),
  );
}
