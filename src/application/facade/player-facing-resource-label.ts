/**
 * Player-facing resource labels for requirement/blocker copy (domain IDs stay internal).
 */

import type { ResourceTypeRegistry } from '../../content/resource/ResourceTypeRegistry.js';

/**
 * Resolves the authoritative player-facing resource name from content.
 * Unknown IDs fall back to the raw identifier (diagnostic last resort).
 */
export function resolvePlayerFacingResourceName(
  resourceId: string,
  resourceTypes: ResourceTypeRegistry,
): string {
  const definition = resourceTypes.get(resourceId);
  const name = definition?.name.trim();

  if (name === undefined || name.length === 0) {
    return resourceId;
  }

  return name;
}

/** Standard German blocker sentence for missing recipe/production input. */
export function formatMissingResourceInputReason(
  resourceId: string,
  amount: number,
  resourceTypes: ResourceTypeRegistry,
  options: { readonly marketWarehouseHint: boolean },
): string {
  const label = resolvePlayerFacingResourceName(resourceId, resourceTypes);
  if (options.marketWarehouseHint) {
    return `Benötigt ${amount}× ${label} — am Markt kaufen (landet im Lager).`;
  }
  return `Benötigt ${amount}× ${label}.`;
}
