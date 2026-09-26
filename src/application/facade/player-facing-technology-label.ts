/**
 * Player-facing technology labels for requirement/blocker copy (domain IDs stay internal).
 */

import type { TechnologyRegistry } from '../../content/research/TechnologyRegistry.js';

/**
 * Resolves the authoritative player-facing technology name from content.
 * Unknown IDs fall back to the raw identifier (diagnostic last resort).
 */
export function resolvePlayerFacingTechnologyName(
  technologyId: string,
  technologies: TechnologyRegistry,
): string {
  const definition = technologies.get(technologyId);
  const name = definition?.name.trim();

  if (name === undefined || name.length === 0) {
    return technologyId;
  }

  return name;
}

/** Standard German blocker sentence for a missing technology requirement. */
export function formatMissingTechnologyReason(
  technologyId: string,
  technologies: TechnologyRegistry,
): string {
  const label = resolvePlayerFacingTechnologyName(technologyId, technologies);
  return `Forschung „${label}“ fehlt.`;
}
