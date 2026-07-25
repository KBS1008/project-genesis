/**
 * @module @content/validateProductionGraphAcyclicity
 *
 * Validates that the recipe resource dependency graph contains no production cycles.
 */

import { Result } from '../common/result/Result.js';
import { ContentLoadError, ContentLoadErrorCode } from './errors/ContentLoadError.js';
import type { RecipeDefinition } from './recipe/RecipeDefinition.js';
import type { RecipeRegistry } from './recipe/RecipeRegistry.js';
import type { ResourceTypeRegistry } from './resource/ResourceTypeRegistry.js';

/** Directed edge from one recipe input resource to one recipe output resource. */
export type ProductionResourceEdge = {
  readonly fromResourceId: string;
  readonly toResourceId: string;
  readonly recipeId: string;
};

/**
 * Builds directed resource edges from enabled recipes.
 *
 * Each recipe contributes edges from every input resource to every output resource.
 */
export function buildProductionResourceGraph(recipes: RecipeRegistry): readonly ProductionResourceEdge[] {
  const edges: ProductionResourceEdge[] = [];

  for (const recipe of recipes.getAll()) {
    if (!recipe.enabled) {
      continue;
    }

    for (const input of recipe.inputs) {
      for (const output of recipe.outputs) {
        edges.push({
          fromResourceId: input.resource,
          toResourceId: output.resource,
          recipeId: recipe.id,
        });
      }
    }
  }

  return Object.freeze(edges);
}

/**
 * Returns a resource cycle path when the directed graph contains a loop.
 *
 * The returned array repeats the starting resource at the end
 * (e.g. `['steel', 'machine_parts', 'steel']`).
 */
export function findProductionResourceCycle(
  edges: readonly ProductionResourceEdge[],
): readonly string[] | undefined {
  const adjacency = new Map<string, string[]>();
  const nodes = new Set<string>();

  for (const edge of edges) {
    nodes.add(edge.fromResourceId);
    nodes.add(edge.toResourceId);

    const outgoing = adjacency.get(edge.fromResourceId);

    if (outgoing === undefined) {
      adjacency.set(edge.fromResourceId, [edge.toResourceId]);
      continue;
    }

    outgoing.push(edge.toResourceId);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const path: string[] = [];

  const visit = (node: string): readonly string[] | undefined => {
    if (visited.has(node)) {
      return undefined;
    }

    if (visiting.has(node)) {
      const cycleStart = path.indexOf(node);

      if (cycleStart === -1) {
        return Object.freeze([node, node]);
      }

      return Object.freeze([...path.slice(cycleStart), node]);
    }

    visiting.add(node);
    path.push(node);

    for (const nextNode of adjacency.get(node) ?? []) {
      const cycle = visit(nextNode);

      if (cycle !== undefined) {
        return cycle;
      }
    }

    path.pop();
    visiting.delete(node);
    visited.add(node);

    return undefined;
  };

  for (const node of [...nodes].sort((left, right) => left.localeCompare(right))) {
    const cycle = visit(node);

    if (cycle !== undefined) {
      return cycle;
    }
  }

  return undefined;
}

function findDirectRecipeCycle(recipes: RecipeRegistry): RecipeDefinition | undefined {
  for (const recipe of recipes.getAll()) {
    if (!recipe.enabled) {
      continue;
    }

    const outputResources = new Set(recipe.outputs.map((output) => output.resource));

    if (recipe.inputs.some((input) => outputResources.has(input.resource))) {
      return recipe;
    }
  }

  return undefined;
}

function formatCycleMessage(cycle: readonly string[]): string {
  return `Production resource cycle detected: ${cycle.join(' -> ')}.`;
}

/**
 * Ensures enabled recipes form an acyclic resource dependency graph.
 */
export function validateProductionGraphAcyclicity(
  recipes: RecipeRegistry,
  resourceTypes?: ResourceTypeRegistry,
): Result<void, ContentLoadError> {
  if (resourceTypes !== undefined) {
    for (const recipe of recipes.getAll()) {
      if (!recipe.enabled) {
        continue;
      }

      for (const entry of [...recipe.inputs, ...recipe.outputs]) {
        if (!resourceTypes.has(entry.resource)) {
          return Result.fail(
            new ContentLoadError(
              `Recipe "${recipe.id}" references unknown resource "${entry.resource}".`,
              { contentId: recipe.id },
            ),
          );
        }
      }
    }
  }

  const directCycleRecipe = findDirectRecipeCycle(recipes);

  if (directCycleRecipe !== undefined) {
    return Result.fail(
      new ContentLoadError(
        `Recipe "${directCycleRecipe.id}" creates a direct production cycle because an input resource is also produced by the same recipe.`,
        { contentId: directCycleRecipe.id },
      ),
    );
  }

  const cycle = findProductionResourceCycle(buildProductionResourceGraph(recipes));

  if (cycle !== undefined) {
    return Result.fail(
      new ContentLoadError(formatCycleMessage(cycle), {
        errorCode: ContentLoadErrorCode.INVALID_REFERENCE,
      }),
    );
  }

  return Result.ok(undefined);
}
