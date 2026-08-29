import { describe, expect, it } from 'vitest';
import {
  buildBuildingNavigationTarget,
  buildCompanyBuildingNavigationTarget,
  buildEmployeeNavigationTarget,
  buildProductionBuildingNavigationTarget,
  buildProductionNavigationTarget,
  buildRegionNavigationTarget,
  buildResearchNavigationTarget,
  buildResourceNavigationTarget,
  buildTransportNavigationTarget,
  buildWarehouseNavigationTarget,
} from './entity-navigation';

describe('entity-navigation', () => {
  it('builds world and buildings navigation targets', () => {
    expect(buildRegionNavigationTarget('region_001')).toEqual({
      screen: 'world',
      entitySelection: { kind: 'region', id: 'region_001' },
    });

    expect(buildBuildingNavigationTarget('building_001')).toEqual({
      screen: 'buildings',
      entitySelection: { kind: 'building', id: 'building_001' },
    });
  });

  it('builds company operations and job navigation targets', () => {
    expect(buildCompanyBuildingNavigationTarget('building_001')).toEqual({
      screen: 'company',
      entitySelection: { kind: 'building', id: 'building_001' },
    });

    expect(buildProductionNavigationTarget('production_001')).toEqual({
      screen: 'production',
      entitySelection: { kind: 'production', id: 'production_001' },
    });

    expect(buildProductionBuildingNavigationTarget('building_001')).toEqual({
      screen: 'production',
      entitySelection: { kind: 'building', id: 'building_001' },
    });

    expect(buildWarehouseNavigationTarget('building_001')).toEqual({
      screen: 'company',
      entitySelection: { kind: 'warehouse', id: 'building_001' },
    });

    expect(buildTransportNavigationTarget('transport_001')).toEqual({
      screen: 'transport',
      entitySelection: { kind: 'transport', id: 'transport_001' },
    });

    expect(buildResearchNavigationTarget('research_001')).toEqual({
      screen: 'research',
      entitySelection: { kind: 'research', id: 'research_001' },
    });

    expect(buildEmployeeNavigationTarget('employee_001')).toEqual({
      screen: 'company',
      entitySelection: { kind: 'employee', id: 'employee_001' },
    });

    expect(buildResourceNavigationTarget('iron-ore')).toEqual({
      screen: 'markets',
      entitySelection: { kind: 'resource', id: 'iron-ore' },
    });
  });
});
