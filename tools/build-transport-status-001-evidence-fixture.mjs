/**
 * Builds a deterministic save fixture with representative transport order statuses
 * for TRANSPORT-STATUS-001 runtime evidence (presentation-only; no rule changes).
 */
/* global console */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'saves/e2e-m11-phase6-production-closeout.json');
const targetPath = path.join(
  root,
  'tools/evidence-fixtures/transport-status-001-representative-orders.json',
);

const snapshot = JSON.parse(readFileSync(sourcePath, 'utf8'));
const companyId = snapshot.companies?.[0]?.id ?? 'company_001';
const buildings = snapshot.buildings ?? [];
const warehouse = buildings.find((b) => b.buildingTypeId === 'warehouse');
const sawmill = buildings.find((b) => b.buildingTypeId === 'sawmill');

if (warehouse === undefined || sawmill === undefined) {
  throw new Error('Closeout save must include warehouse and sawmill for transport fixture.');
}

const now = snapshot.simulation?.currentTick ?? 100;

snapshot.transportOrders = [
  {
    id: 'transport_status_evidence_wait',
    companyId,
    sourceBuildingId: warehouse.id,
    destinationBuildingId: sawmill.id,
    resourceId: 'wood',
    amount: 10,
    duration: 5,
    routeId: 'route_storage_to_production',
    productionJobId: '',
    sourceRegionId: warehouse.regionId,
    destinationRegionId: sawmill.regionId,
    createdAt: now,
    status: 'WAITING',
    startTime: undefined,
    endTime: undefined,
    progress: 0,
  },
  {
    id: 'transport_status_evidence_active',
    companyId,
    sourceBuildingId: warehouse.id,
    destinationBuildingId: sawmill.id,
    resourceId: 'wood',
    amount: 10,
    duration: 5,
    routeId: 'route_storage_to_production',
    productionJobId: '',
    sourceRegionId: warehouse.regionId,
    destinationRegionId: sawmill.regionId,
    createdAt: now,
    status: 'IN_PROGRESS',
    startTime: now,
    endTime: undefined,
    progress: 45,
  },
  {
    id: 'transport_status_evidence_done',
    companyId,
    sourceBuildingId: warehouse.id,
    destinationBuildingId: sawmill.id,
    resourceId: 'wood',
    amount: 10,
    duration: 5,
    routeId: 'route_storage_to_production',
    productionJobId: '',
    sourceRegionId: warehouse.regionId,
    destinationRegionId: sawmill.regionId,
    createdAt: now - 10,
    status: 'COMPLETED',
    startTime: now - 10,
    endTime: now,
    progress: 100,
  },
];

writeFileSync(targetPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
console.log(`Wrote ${targetPath}`);
