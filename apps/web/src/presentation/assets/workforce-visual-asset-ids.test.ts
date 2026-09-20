import { describe, expect, it } from 'vitest';
import {
  WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS,
  WFV_001_COMPLETION_EMPLOYEE_TYPE_IDS,
  WFV_001_PRODUCTION_EMPLOYEE_TYPE_IDS,
  WFV_ENABLED_EMPLOYEE_TYPE_IDS,
  employeeTypeToWfvPrimaryAssetId,
  isWfvBatch1EmployeeType,
  isWfvProductionEmployeeType,
  resolveWorkforceRoleVisualAssetIds,
} from '@/presentation/assets/workforce-visual-asset-ids';

describe('workforce-visual-asset-ids', () => {
  it('maps all 19 enabled IDs to production primaries', () => {
    expect(WFV_ENABLED_EMPLOYEE_TYPE_IDS).toHaveLength(19);
    expect(WFV_001_PRODUCTION_EMPLOYEE_TYPE_IDS).toHaveLength(19);
    for (const id of WFV_001_PRODUCTION_EMPLOYEE_TYPE_IDS) {
      expect(isWfvProductionEmployeeType(id)).toBe(true);
      expect(employeeTypeToWfvPrimaryAssetId(id)).toBe(`WFV-001-${id}-primary`);
    }
  });

  it('preserves historical Batch-1 subset of eight', () => {
    expect(WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS).toHaveLength(8);
    for (const id of WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS) {
      expect(isWfvBatch1EmployeeType(id)).toBe(true);
    }
    expect(WFV_001_COMPLETION_EMPLOYEE_TYPE_IDS).toHaveLength(11);
  });

  it('resolves unknown employee IDs to defensive category fallback', () => {
    const resolved = resolveWorkforceRoleVisualAssetIds('employee_unknown');
    expect(resolved.primaryAssetId).toBeNull();
    expect(resolved.fallbackAssetId).toBe('ICON-002-administration');
  });

  it('resolves completion role to primary not category fallback', () => {
    const resolved = resolveWorkforceRoleVisualAssetIds('employee_researcher_basic');
    expect(resolved.primaryAssetId).toBe('WFV-001-employee_researcher_basic-primary');
    expect(resolved.fallbackAssetId).toBe('ICON-002-research');
  });

  it('has no duplicate production asset IDs', () => {
    const assetIds = WFV_001_PRODUCTION_EMPLOYEE_TYPE_IDS.map(
      (id) => employeeTypeToWfvPrimaryAssetId(id)!,
    );
    expect(new Set(assetIds).size).toBe(19);
  });

  it('points every production manifest asset at an existing runtime PNG', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const root = path.resolve(process.cwd());
    for (const id of WFV_001_PRODUCTION_EMPLOYEE_TYPE_IDS) {
      const file = path.join(root, 'apps/web/public/assets/workforce', `WFV-001-${id}-primary.png`);
      await expect(fs.access(file)).resolves.toBeUndefined();
    }
  });
});
