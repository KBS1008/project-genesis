/** One-shot pending navigation into Unternehmen → Operatives Dashboard. */
export type CompanyOperationsPendingNavigation =
  | Readonly<{ readonly kind: 'milestone_overview' }>
  | Readonly<{ readonly kind: 'economy_contracts_section' }>
  | Readonly<{ readonly kind: 'finance_ledger_section' }>
  | Readonly<{
      readonly kind: 'workforce_assignment';
      readonly buildingId: string;
    }>;

export function isWorkforceAssignmentPendingNavigation(
  navigation: CompanyOperationsPendingNavigation | null | undefined,
): navigation is Readonly<{ readonly kind: 'workforce_assignment'; readonly buildingId: string }> {
  return navigation?.kind === 'workforce_assignment';
}

const COMPANY_OPERATIONS_SECTION_SCROLL_TARGET_BY_KIND: Readonly<
  Record<
    'milestone_overview' | 'economy_contracts_section' | 'finance_ledger_section',
    string
  >
> = Object.freeze({
  milestone_overview: 'pg-milestones-widget-title',
  economy_contracts_section: 'pg-economy-widget-title',
  finance_ledger_section: 'pg-finance-widget-title',
});

export function resolveCompanyOperationsSectionScrollTargetId(
  navigation: CompanyOperationsPendingNavigation,
): string | null {
  if (navigation.kind === 'workforce_assignment') {
    return null;
  }

  return COMPANY_OPERATIONS_SECTION_SCROLL_TARGET_BY_KIND[navigation.kind] ?? null;
}
