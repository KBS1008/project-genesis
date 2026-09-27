/**
 * Deterministic save for TIME-UX-R1 Production auto-transport cycle hint runtime evidence.
 * Transforms e2e closeout save: on-site wood depleted, warehouse holds enough for recipe_planks.
 */
/* global console */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceSavePath = path.join(projectRoot, 'saves/e2e-m11-phase6-production-closeout.json');
const fixtureDir = path.join(projectRoot, 'tools/evidence-fixtures');
const fixtureSavePath = path.join(fixtureDir, 'time-ux-r1-production-auto-transport-hint.json');

const snapshot = JSON.parse(readFileSync(sourceSavePath, 'utf8'));

const inventory = snapshot.inventories?.find((entry) => entry.companyId === 'company_001');

if (inventory === undefined) {
  throw new Error('Expected company_001 inventory in source save.');
}

const woodLine = inventory.items?.find((item) => item.resourceId === 'wood');

if (woodLine === undefined) {
  throw new Error('Expected wood line in company_001 inventory.');
}

const sawmill = snapshot.buildings?.find(
  (building) =>
    building.companyId === 'company_001' &&
    building.buildingTypeId === 'sawmill' &&
    building.status === 'ACTIVE',
);

if (sawmill === undefined) {
  throw new Error('Expected active sawmill for company_001 in source save.');
}

const warehouse = snapshot.buildings?.find(
  (building) =>
    building.companyId === 'company_001' &&
    building.buildingTypeId === 'warehouse' &&
    building.status === 'ACTIVE',
);

if (warehouse === undefined) {
  throw new Error('Expected active warehouse for company_001 in source save.');
}

const warehouseStorage = snapshot.buildingStorages?.find(
  (entry) => entry.buildingId === warehouse.id,
);

if (warehouseStorage === undefined) {
  throw new Error('Expected building storage for warehouse in source save.');
}

woodLine.quantity = 0;
woodLine.reserved = 0;

const warehouseWoodAmount = 30;
warehouseStorage.items = [
  {
    resourceId: 'wood',
    quantity: warehouseWoodAmount,
    reserved: 0,
  },
];

mkdirSync(fixtureDir, { recursive: true });
writeFileSync(fixtureSavePath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      fixtureSavePath,
      companyId: 'company_001',
      certifiedRecipeId: 'recipe_planks',
      certifiedRecipeName: 'Bretter herstellen',
      sawmillBuildingId: sawmill.id,
      warehouseBuildingId: warehouse.id,
      onSiteWoodQuantity: 0,
      warehouseWoodQuantity: warehouseWoodAmount,
      recipeInputWoodAmount: 10,
      expectedHintFragments: [
        'Material im Lagerhaus',
        'Transport startet automatisch',
      ],
      stateChanges: [
        {
          field: 'inventories[company_001].items[wood].quantity',
          original: '10 (from closeout)',
          evidence: 0,
          why: 'Trigger inbound transport (on-site insufficient)',
          gameplayRuleChanged: false,
        },
        {
          field: 'inventories[company_001].items[wood].reserved',
          original: 10,
          evidence: 0,
          why: 'Clear on-site availability',
          gameplayRuleChanged: false,
        },
        {
          field: 'buildingStorages[warehouse].items[wood]',
          original: 'empty',
          evidence: warehouseWoodAmount,
          why: 'Warehouse can fulfill recipe; needsInboundTransport path',
          gameplayRuleChanged: false,
        },
      ],
    },
    null,
    2,
  ),
);
