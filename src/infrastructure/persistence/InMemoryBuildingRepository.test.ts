import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import {
  Building,
  createBuildingId,
  createBuildingTypeId,
} from '../../domain/building/Building.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { Position } from '../../domain/building/Position.js';
import { InMemoryBuildingRepository } from './InMemoryBuildingRepository.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireBuildingId(value: string) {
  const result = createBuildingId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireBuildingTypeId(value: string) {
  const result = createBuildingTypeId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireRegionId(value = 'region_default') {
  const result = createRegionId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('InMemoryBuildingRepository', () => {
  it('saves and retrieves buildings by id', () => {
    const repository = new InMemoryBuildingRepository();
    const clock = new ManualClock(100);
    const buildingResult = Building.create({
      id: requireBuildingId('building_001'),
      buildingTypeId: requireBuildingTypeId('sawmill'),
      companyId: requireCompanyId('company_001'),
      regionId: requireRegionId(),
      name: 'Northern Sawmill',
      position: new Position(2, 3),
      clock,
    });

    expect(buildingResult.ok).toBe(true);

    if (!buildingResult.ok) {
      return;
    }

    repository.save(buildingResult.value);

    expect(repository.findById(requireBuildingId('building_001'))).toBe(buildingResult.value);
  });

  it('returns buildings for a company in deterministic id order', () => {
    const repository = new InMemoryBuildingRepository();
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');

    const second = Building.create({
      id: requireBuildingId('building_002'),
      buildingTypeId: requireBuildingTypeId('warehouse'),
      companyId,
      regionId: requireRegionId(),
      name: 'Warehouse B',
      position: new Position(1, 1),
      clock,
    });
    const first = Building.create({
      id: requireBuildingId('building_001'),
      buildingTypeId: requireBuildingTypeId('sawmill'),
      companyId,
      regionId: requireRegionId(),
      name: 'Sawmill A',
      position: new Position(0, 0),
      clock,
    });

    if (!second.ok || !first.ok) {
      throw new Error('Expected valid buildings.');
    }

    repository.save(second.value);
    repository.save(first.value);

    expect(repository.findByCompanyId(companyId).map((building) => building.getId().value)).toEqual(
      ['building_001', 'building_002'],
    );
  });

  it('returns buildings for a region in deterministic id order', () => {
    const repository = new InMemoryBuildingRepository();
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const defaultRegionId = requireRegionId('region_default');
    const eastRegionId = requireRegionId('region_east');

    const defaultBuildingResult = Building.create({
      id: requireBuildingId('building_002'),
      buildingTypeId: requireBuildingTypeId('warehouse'),
      companyId,
      regionId: defaultRegionId,
      name: 'Warehouse Default',
      position: new Position(1, 1),
      clock,
    });
    const eastBuildingResult = Building.create({
      id: requireBuildingId('building_001'),
      buildingTypeId: requireBuildingTypeId('sawmill'),
      companyId,
      regionId: eastRegionId,
      name: 'Sawmill East',
      position: new Position(0, 0),
      clock,
    });

    if (!defaultBuildingResult.ok || !eastBuildingResult.ok) {
      throw new Error('Expected valid buildings.');
    }

    repository.save(defaultBuildingResult.value);
    repository.save(eastBuildingResult.value);

    expect(
      repository.findByRegionId(defaultRegionId).map((building) => building.getId().value),
    ).toEqual(['building_002']);
    expect(
      repository.findByRegionId(eastRegionId).map((building) => building.getId().value),
    ).toEqual(['building_001']);
  });

  it('returns buildings under construction in deterministic id order', () => {
    const repository = new InMemoryBuildingRepository();
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');

    const sawmillResult = Building.create({
      id: requireBuildingId('building_002'),
      buildingTypeId: requireBuildingTypeId('sawmill'),
      companyId,
      regionId: requireRegionId(),
      name: 'Sawmill B',
      position: new Position(1, 1),
      clock,
    });
    const warehouseResult = Building.create({
      id: requireBuildingId('building_001'),
      buildingTypeId: requireBuildingTypeId('warehouse'),
      companyId,
      regionId: requireRegionId(),
      name: 'Warehouse A',
      position: new Position(0, 0),
      clock,
    });

    if (!sawmillResult.ok || !warehouseResult.ok) {
      throw new Error('Expected valid buildings.');
    }

    sawmillResult.value.beginConstruction(120, clock);
    warehouseResult.value.beginConstruction(90, clock);

    repository.save(sawmillResult.value);
    repository.save(warehouseResult.value);

    expect(repository.findUnderConstruction().map((building) => building.getId().value)).toEqual([
      'building_001',
      'building_002',
    ]);
    expect(repository.findUnderConstruction()[0]?.getStatus()).toBe(
      BuildingStatus.UNDER_CONSTRUCTION,
    );
  });
});
