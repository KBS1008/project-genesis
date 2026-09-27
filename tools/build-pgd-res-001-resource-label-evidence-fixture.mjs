/**
 * Builds a deterministic save fixture for PGD-RES-001 Production resource-label runtime evidence.
 * Source: e2e closeout save with on-site wood depleted at company_001 (same schema; no recipe edits).
 */
/* global console */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceSavePath = path.join(projectRoot, 'saves/e2e-m11-phase6-production-closeout.json');
const fixtureDir = path.join(projectRoot, 'tools/evidence-fixtures');
const fixtureSavePath = path.join(fixtureDir, 'pgd-res-001-production-resource-label.json');

const snapshot = JSON.parse(readFileSync(sourceSavePath, 'utf8'));

const inventory = snapshot.inventories?.find((entry) => entry.companyId === 'company_001');

if (inventory === undefined) {
  throw new Error('Expected company_001 inventory in source save.');
}

const woodLine = inventory.items?.find((item) => item.resourceId === 'wood');

if (woodLine === undefined) {
  throw new Error('Expected wood line in company_001 inventory.');
}

woodLine.quantity = 0;
woodLine.reserved = 0;

const sawmill = snapshot.buildings?.find(
  (building) =>
    building.companyId === 'company_001' &&
    building.buildingTypeId === 'sawmill' &&
    building.status === 'ACTIVE',
);

if (sawmill === undefined) {
  throw new Error('Expected active sawmill for company_001 in source save.');
}

mkdirSync(fixtureDir, { recursive: true });
writeFileSync(fixtureSavePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      fixtureSavePath,
      companyId: 'company_001',
      certifiedRecipeId: 'recipe_planks',
      missingResourceId: 'wood',
      expectedAuthoritativeName: 'Holz',
      expectedMissingAmount: 10,
      sawmillBuildingId: sawmill.id,
    },
    null,
    2,
  ),
);
