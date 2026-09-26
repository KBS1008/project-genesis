/**
 * Player-facing milestone labels for requirement/blocker copy (domain IDs stay internal).
 */

import type { MilestoneRegistry } from '../../content/milestone/MilestoneRegistry.js';

/**
 * Resolves the authoritative player-facing milestone name from content.
 * Unknown IDs fall back to the raw identifier (diagnostic last resort).
 */
export function resolvePlayerFacingMilestoneName(
  milestoneId: string,
  milestones: MilestoneRegistry,
): string {
  const definition = milestones.get(milestoneId);
  const name = definition?.name.trim();

  if (name === undefined || name.length === 0) {
    return milestoneId;
  }

  return name;
}

/** Standard German blocker sentence for a missing milestone requirement. */
export function formatMissingMilestoneReason(
  milestoneId: string,
  milestones: MilestoneRegistry,
): string {
  const label = resolvePlayerFacingMilestoneName(milestoneId, milestones);
  return `Meilenstein „${label}“ fehlt.`;
}
