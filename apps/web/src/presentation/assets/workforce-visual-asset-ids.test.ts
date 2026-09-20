import { describe, expect, it } from 'vitest';
import {
  WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS,
  employeeTypeToWfvPrimaryAssetId,
  isWfvBatch1EmployeeType,
  resolveWorkforceRoleVisualAssetIds,
} from '@/presentation/assets/workforce-visual-asset-ids';

describe('workforce-visual-asset-ids', () => {
  it('maps all 8 Batch-1 IDs to primaries', () => {
    expect(WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS).toHaveLength(8);
    for (const id of WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS) {
      expect(isWfvBatch1EmployeeType(id)).toBe(true);
      expect(employeeTypeToWfvPrimaryAssetId(id)).toBe(`WFV-001-${id}-primary`);
    }
  });

  it('resolves non-Batch-1 known IDs to category fallback only', () => {
    const resolved = resolveWorkforceRoleVisualAssetIds('employee_researcher_basic');
    expect(resolved.primaryAssetId).toBeNull();
    expect(resolved.fallbackAssetId).toBe('ICON-002-research');
  });

  it('resolves unknown employee IDs safely', () => {
    const resolved = resolveWorkforceRoleVisualAssetIds('employee_unknown');
    expect(resolved.primaryAssetId).toBeNull();
    expect(resolved.fallbackAssetId).toBe('ICON-002-administration');
  });

  it('has no duplicate Batch-1 mappings', () => {
    const assetIds = WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS.map(
      (id) => employeeTypeToWfvPrimaryAssetId(id)!,
    );
    expect(new Set(assetIds).size).toBe(8);
  });

  it('points every Batch-1 manifest asset at an existing runtime PNG', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const root = path.resolve(process.cwd());
    for (const id of WFV_001_BATCH_1_EMPLOYEE_TYPE_IDS) {
      const file = path.join(root, 'apps/web/public/assets/workforce', `WFV-001-${id}-primary.png`);
      await expect(fs.access(file)).resolves.toBeUndefined();
    }
  });
});
