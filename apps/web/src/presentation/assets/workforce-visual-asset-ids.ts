/** Enabled employee type IDs (mirrors game-content/employees/*.yaml). */
export const WFV_ENABLED_EMPLOYEE_TYPE_IDS = Object.freeze([
  'employee_production_worker',
  'employee_senior_production_worker',
  'employee_operations_supervisor',
  'employee_engineer_basic',
  'employee_senior_engineer',
  'employee_maintenance_technician',
  'employee_researcher_basic',
  'employee_senior_researcher',
  'employee_lab_director',
  'employee_logistics_operator',
  'employee_logistics_coordinator',
  'employee_distribution_clerk',
  'employee_port_operator',
  'employee_rail_dispatcher',
  'employee_administrator_basic',
  'employee_financial_analyst',
  'employee_hr_manager',
  'employee_regional_manager',
  'employee_executive_director',
] as const);

export type WfvEnabledEmployeeTypeId = (typeof WFV_ENABLED_EMPLOYEE_TYPE_IDS)[number];

/** WFV-001 Production Batch 1 — hybrid primary grammar (8/19). */
export const WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS = Object.freeze([
  'employee_production_worker',
  'employee_senior_engineer',
  'employee_executive_director',
  'employee_maintenance_technician',
  'employee_senior_researcher',
  'employee_logistics_coordinator',
  'employee_financial_analyst',
  'employee_operations_supervisor',
] as const);

export type WfvBatch1EmployeeTypeId = (typeof WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS)[number];

const ENABLED_SET = new Set<string>(WFV_ENABLED_EMPLOYEE_TYPE_IDS);
const BATCH_1_SET = new Set<string>(WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS);

/** Category fallback when no Batch-1 primary exists (ICON-002 defensive glyphs). */
export const WFV_EMPLOYEE_CATEGORY_FALLBACK_ASSET_ID = Object.freeze({
  production: 'ICON-002-production',
  engineering: 'ICON-002-infrastructure',
  research: 'ICON-002-research',
  logistics: 'ICON-002-storage',
  administration: 'ICON-002-administration',
} as const);

const EMPLOYEE_TYPE_CATEGORY: Readonly<Record<string, keyof typeof WFV_EMPLOYEE_CATEGORY_FALLBACK_ASSET_ID>> =
  Object.freeze({
    employee_production_worker: 'production',
    employee_senior_production_worker: 'production',
    employee_operations_supervisor: 'production',
    employee_engineer_basic: 'engineering',
    employee_senior_engineer: 'engineering',
    employee_maintenance_technician: 'engineering',
    employee_researcher_basic: 'research',
    employee_senior_researcher: 'research',
    employee_lab_director: 'research',
    employee_logistics_operator: 'logistics',
    employee_logistics_coordinator: 'logistics',
    employee_distribution_clerk: 'logistics',
    employee_port_operator: 'logistics',
    employee_rail_dispatcher: 'logistics',
    employee_administrator_basic: 'administration',
    employee_financial_analyst: 'administration',
    employee_hr_manager: 'administration',
    employee_regional_manager: 'administration',
    employee_executive_director: 'administration',
  });

export function isWfvEnabledEmployeeType(employeeTypeId: string): employeeTypeId is WfvEnabledEmployeeTypeId {
  return ENABLED_SET.has(employeeTypeId);
}

export function isWfvBatch1EmployeeType(employeeTypeId: string): employeeTypeId is WfvBatch1EmployeeTypeId {
  return BATCH_1_SET.has(employeeTypeId);
}

export function employeeTypeToWfvPrimaryAssetId(employeeTypeId: string): string | null {
  if (!isWfvBatch1EmployeeType(employeeTypeId)) {
    return null;
  }

  return `WFV-001-${employeeTypeId}-primary`;
}

export function resolveWfvCategoryFallbackAssetId(employeeTypeId: string): string {
  const category = EMPLOYEE_TYPE_CATEGORY[employeeTypeId] ?? 'administration';
  return WFV_EMPLOYEE_CATEGORY_FALLBACK_ASSET_ID[category];
}

export function resolveWorkforceRoleVisualAssetIds(employeeTypeId: string): {
  readonly primaryAssetId: string | null;
  readonly fallbackAssetId: string;
} {
  return Object.freeze({
    primaryAssetId: employeeTypeToWfvPrimaryAssetId(employeeTypeId),
    fallbackAssetId: resolveWfvCategoryFallbackAssetId(employeeTypeId),
  });
}
