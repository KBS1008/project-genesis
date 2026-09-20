/**
 * Creates runtime evidence save with mixed Batch-1 + fallback employee types (evidence fixture only).
 */
/* global console, process */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('D:/Cursor/Project Genesis');
const sourcePath = path.join(ROOT, 'saves/e2e-m11-phase6-production-closeout.json');
const destPath = path.join(ROOT, 'saves/wfv-001-batch1-runtime-evidence.json');

async function main() {
  const raw = await fs.readFile(sourcePath, 'utf8');
  const save = JSON.parse(raw);
  save.employees = [
    {
      id: 'employee_wfv_001',
      companyId: 'company_001',
      employeeTypeId: 'employee_production_worker',
      displayName: 'Closeout Worker 1',
      salary: 120,
      productivity: 1,
      hiredAt: 121,
      status: 'ACTIVE',
      assignedBuildingId: 'building_005',
    },
    {
      id: 'employee_wfv_002',
      companyId: 'company_001',
      employeeTypeId: 'employee_senior_engineer',
      displayName: 'Engineering Lead',
      salary: 320,
      productivity: 1.2,
      hiredAt: 121,
      status: 'ACTIVE',
      assignedBuildingId: 'building_005',
    },
    {
      id: 'employee_wfv_003',
      companyId: 'company_001',
      employeeTypeId: 'employee_researcher_basic',
      displayName: 'Lab Assistant',
      salary: 180,
      productivity: 1,
      hiredAt: 121,
      status: 'ACTIVE',
      assignedBuildingId: null,
    },
  ];
  await fs.writeFile(destPath, `${JSON.stringify(save)}\n`);
  console.log('Wrote', destPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
