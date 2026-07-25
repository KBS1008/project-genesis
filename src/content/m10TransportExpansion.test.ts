import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BuildingCategory } from './building/BuildingTypeDefinition.js';
import { TransportRouteDurationPolicy } from '../domain/policies/transport/TransportRouteDurationPolicy.js';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const CATEGORY_ROUTES = Object.freeze([
  { id: 'route_storage_to_production', source: BuildingCategory.STORAGE, destination: BuildingCategory.PRODUCTION },
  { id: 'route_production_to_storage', source: BuildingCategory.PRODUCTION, destination: BuildingCategory.STORAGE },
  { id: 'route_storage_to_infrastructure', source: BuildingCategory.STORAGE, destination: BuildingCategory.INFRASTRUCTURE },
  { id: 'route_infrastructure_to_production', source: BuildingCategory.INFRASTRUCTURE, destination: BuildingCategory.PRODUCTION },
  { id: 'route_infrastructure_to_storage', source: BuildingCategory.INFRASTRUCTURE, destination: BuildingCategory.STORAGE },
]);

const INDUSTRIAL_SUPPLY_ROUTES = Object.freeze([
  { id: 'route_distribution_to_machine_shop', source: 'distribution_center', destination: 'machine_shop', durationTicks: 6 },
  { id: 'route_distribution_to_assembly_plant', source: 'distribution_center', destination: 'assembly_plant', durationTicks: 7 },
  { id: 'route_distribution_to_electronics_factory', source: 'distribution_center', destination: 'electronics_factory', durationTicks: 8 },
  { id: 'route_distribution_to_consumer_goods_plant', source: 'distribution_center', destination: 'consumer_goods_plant', durationTicks: 9 },
]);

const INTERMODAL_ROUTES = Object.freeze([
  { id: 'route_port_to_distribution_center', durationTicks: 20, throughputCapacity: 6 },
  { id: 'route_rail_terminal_to_distribution_center', durationTicks: 12, throughputCapacity: 5 },
  { id: 'route_port_to_logistics_hub', durationTicks: 18, throughputCapacity: 6 },
  { id: 'route_rail_terminal_to_logistics_hub', durationTicks: 11, throughputCapacity: 5 },
  { id: 'route_logistics_hub_to_distribution_center', durationTicks: 8, throughputCapacity: 3 },
]);

describe('M10 transport expansion content', () => {
  it('loads category, industrial, and intermodal route network', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { transportRoutes, buildingTypes } = result.value;

    expect(transportRoutes.size).toBeGreaterThanOrEqual(14);

    for (const route of CATEGORY_ROUTES) {
      const definition = transportRoutes.get(route.id);
      expect(definition).toBeDefined();
      expect(definition?.sourceCategory).toBe(route.source);
      expect(definition?.destinationCategory).toBe(route.destination);
      expect(definition?.durationTicks).toBeGreaterThan(0);
      expect(definition?.throughputCapacity).toBeGreaterThan(0);
    }

    for (const route of INDUSTRIAL_SUPPLY_ROUTES) {
      const definition = transportRoutes.get(route.id);
      expect(definition).toBeDefined();
      expect(buildingTypes.has(route.source)).toBe(true);
      expect(buildingTypes.has(route.destination)).toBe(true);
      expect(definition?.sourceBuildingTypeId).toBe(route.source);
      expect(definition?.destinationBuildingTypeId).toBe(route.destination);
      expect(definition?.durationTicks).toBe(route.durationTicks);
    }

    for (const route of INTERMODAL_ROUTES) {
      const definition = transportRoutes.get(route.id);
      expect(definition).toBeDefined();
      expect(definition?.durationTicks).toBe(route.durationTicks);
      expect(definition?.throughputCapacity).toBe(route.throughputCapacity);
    }
  });

  it('prefers distribution-center supply routes over generic storage routes', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const routes = result.value.transportRoutes.getAll().map((route) => ({
      id: route.id,
      sourceCategory: route.sourceCategory,
      destinationCategory: route.destinationCategory,
      sourceBuildingTypeId: route.sourceBuildingTypeId,
      destinationBuildingTypeId: route.destinationBuildingTypeId,
      durationTicks: route.durationTicks,
      throughputCapacity: route.throughputCapacity,
      enabled: route.enabled,
    }));

    const resolved = TransportRouteDurationPolicy.resolve({
      routes,
      sourceBuildingTypeId: 'distribution_center',
      destinationBuildingTypeId: 'machine_shop',
      sourceCategory: BuildingCategory.STORAGE,
      destinationCategory: BuildingCategory.PRODUCTION,
    });

    expect(resolved.routeId).toBe('route_distribution_to_machine_shop');
    expect(resolved.durationTicks).toBe(6);
    expect(resolved.throughputCapacity).toBe(4);
  });
});
