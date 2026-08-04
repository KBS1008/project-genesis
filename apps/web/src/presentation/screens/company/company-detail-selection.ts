import type { EntityCatalogViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

export type DetailSelection =
  | { readonly kind: 'overview' }
  | { readonly kind: 'building'; readonly id: string }
  | { readonly kind: 'production'; readonly id: string }
  | { readonly kind: 'transport'; readonly id: string }
  | { readonly kind: 'research'; readonly id: string }
  | { readonly kind: 'employee'; readonly id: string }
  | { readonly kind: 'finance' }
  | { readonly kind: 'transaction'; readonly id: string }
  | { readonly kind: 'logistics' }
  | { readonly kind: 'warehouse'; readonly id: string };

/** Validates that the current selection still references view-data entities. */
export function normalizeDetailSelection(
  catalog: EntityCatalogViewData | null,
  hasGame: boolean,
  hasFinance: boolean,
  hasLogistics: boolean,
  selection: DetailSelection,
): DetailSelection {
  if (selection.kind === 'overview' || !hasGame || catalog === null) {
    return { kind: 'overview' };
  }

  switch (selection.kind) {
    case 'building':
      return catalog.buildingIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'production':
      return catalog.productionIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'transport':
      return catalog.transportIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'research':
      return catalog.researchIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'employee':
      return catalog.employeeIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'finance':
      return hasFinance ? selection : { kind: 'overview' };
    case 'transaction':
      return catalog.transactionIds.has(selection.id) ? selection : { kind: 'overview' };
    case 'logistics':
      return hasLogistics ? selection : { kind: 'overview' };
    case 'warehouse':
      return catalog.warehouseIds.has(selection.id) ? selection : { kind: 'overview' };
    default:
      return { kind: 'overview' };
  }
}
