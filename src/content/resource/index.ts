/**
 * @module @content/resource
 *
 * Resource type content loading and registration.
 */

export {
  ResourceCategory,
  ResourceState,
  ResourceStorageType,
  ResourceTransportType,
  ResourceTypeDefinition,
} from './ResourceTypeDefinition.js';

export type { ResourceTypeDefinitionProps } from './ResourceTypeDefinition.js';

export { ResourceTypeLoader } from './ResourceTypeLoader.js';
export { ResourceTypeRegistry } from './ResourceTypeRegistry.js';
export { validateResourceTypeDefinition } from './ResourceTypeValidator.js';
