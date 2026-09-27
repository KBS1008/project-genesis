/** Player-facing resolution copy when production is stalled for missing building workforce. */

export const PRODUCTION_STALLED_WORKFORCE_OPERATIONAL_STATE = 'STALLED_WORKFORCE';

/** Type-agnostic path using current Company operations UI labels (copy-only slice). */
export const PRODUCTION_WORKFORCE_STALL_GUIDANCE =
  'Keine Mitarbeiter am Gebäude zugewiesen. Unter Unternehmen → Operatives Dashboard → Personal bei Bedarf einen Mitarbeiter einstellen und dem betroffenen Gebäude zuweisen.';

/** Returns workforce resolution guidance for a structured production operational state. */
export function resolveProductionWorkforceStallGuidance(
  operationalState: string,
): string | null {
  if (operationalState !== PRODUCTION_STALLED_WORKFORCE_OPERATIONAL_STATE) {
    return null;
  }

  return PRODUCTION_WORKFORCE_STALL_GUIDANCE;
}
