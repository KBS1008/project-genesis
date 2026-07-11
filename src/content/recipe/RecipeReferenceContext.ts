/**
 * @module @content/recipe/RecipeReferenceContext
 *
 * Registries used to resolve recipe content references during validation.
 */

/** Minimal lookup used for recipe reference validation. */
export type RecipeReferenceLookup = {
  has(id: string): boolean;
};

/** Registries available for recipe reference validation. */
export type RecipeReferenceContext = {
  readonly resourceTypes: RecipeReferenceLookup;
  readonly buildingTypes: RecipeReferenceLookup;
};
