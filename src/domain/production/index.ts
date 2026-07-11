/**
 * @module @domain/production
 *
 * Production bounded context exports.
 */

export { ProductionJob, createProductionJobId } from './ProductionJob.js';
export type { CreateProductionJobParams, ProductionJobTickResult } from './ProductionJob.js';
export type { ProductionJobId } from './ProductionJobId.js';
export { ProductionJobStatus } from './ProductionJobStatus.js';
export { createRecipeId } from './RecipeId.js';
export type { RecipeId } from './RecipeId.js';
export type { ProductionJobRepository } from './ProductionJobRepository.js';
export { ProductionStarted } from './events/ProductionStarted.js';
export { ProductionCompleted } from './events/ProductionCompleted.js';
