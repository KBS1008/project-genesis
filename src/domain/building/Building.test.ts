import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import {
  Building,
  createBuildingId,
  createBuildingTypeId,
} from './Building.js';
import { BuildingStatus } from './BuildingStatus.js';
import { Position } from './Position.js';
import { BuildingPlaced } from './events/BuildingPlaced.js';

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

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('Building', () => {
  describe('create', () => {
    it('creates a building in planned status', () => {
      const clock = new ManualClock(200);
      const result = Building.create({
        id: requireBuildingId('building_001'),
        buildingTypeId: requireBuildingTypeId('sawmill'),
        companyId: requireCompanyId('company_001'),
        name: 'Northern Sawmill',
        position: new Position(12, 7),
        clock,
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        const building = result.value;

        expect(building.getId().value).toBe('building_001');
        expect(building.getBuildingTypeId().value).toBe('sawmill');
        expect(building.getCompanyId().value).toBe('company_001');
        expect(building.getName()).toBe('Northern Sawmill');
        expect(building.getPosition().equals(new Position(12, 7))).toBe(true);
        expect(building.getLevel()).toBe(1);
        expect(building.getCreatedAt()).toBe(200);
        expect(building.getStatus()).toBe(BuildingStatus.PLANNED);
      }
    });

    it('rejects an empty building name', () => {
      const result = Building.create({
        id: requireBuildingId('building_001'),
        buildingTypeId: requireBuildingTypeId('sawmill'),
        companyId: requireCompanyId('company_001'),
        name: '',
        position: new Position(0, 0),
        clock: new ManualClock(),
      });

      expect(result.ok).toBe(false);
    });

    it('rejects negative coordinates', () => {
      const result = Building.create({
        id: requireBuildingId('building_001'),
        buildingTypeId: requireBuildingTypeId('sawmill'),
        companyId: requireCompanyId('company_001'),
        name: 'Northern Sawmill',
        position: new Position(-1, 0),
        clock: new ManualClock(),
      });

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error.message).toBe('Building x coordinate must not be negative.');
      }
    });

    it('raises a BuildingPlaced domain event', () => {
      const clock = new ManualClock(300);
      const result = Building.create({
        id: requireBuildingId('building_001'),
        buildingTypeId: requireBuildingTypeId('sawmill'),
        companyId: requireCompanyId('company_001'),
        name: 'Northern Sawmill',
        position: new Position(12, 7),
        clock,
      });

      expect(result.ok).toBe(true);

      if (result.ok) {
        const events = result.value.pullDomainEvents();

        expect(events).toHaveLength(1);

        const event = events[0] as BuildingPlaced;
        expect(event.eventName).toBe('BuildingPlaced');
        expect(event.occurredAt).toBe(300);
        expect(event.buildingId).toBe('building_001');
        expect(event.companyId).toBe('company_001');
        expect(event.buildingTypeId).toBe('sawmill');
        expect(event.x).toBe(12);
        expect(event.y).toBe(7);
      }
    });
  });
});
