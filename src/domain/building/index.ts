/**
 * @module @domain/building
 *
 * Building bounded context exports.
 */

export {
  Building,
  createBuildingId,
  createBuildingTypeId,
} from './Building.js';

export type { CreateBuildingParams } from './Building.js';
export type { BuildingId, BuildingTypeId } from './BuildingId.js';
export type { BuildingRepository } from './BuildingRepository.js';
export { BuildingStatus } from './BuildingStatus.js';
export { Position } from './Position.js';
export { BuildingPlaced } from './events/BuildingPlaced.js';
