/** One-shot pending navigation into Unternehmen → Operatives Dashboard. */
export type CompanyOperationsPendingNavigation =
  | Readonly<{ readonly kind: 'milestone_overview' }>
  | Readonly<{
      readonly kind: 'workforce_assignment';
      readonly buildingId: string;
    }>;

export function isWorkforceAssignmentPendingNavigation(
  navigation: CompanyOperationsPendingNavigation | null | undefined,
): navigation is Readonly<{ readonly kind: 'workforce_assignment'; readonly buildingId: string }> {
  return navigation?.kind === 'workforce_assignment';
}
