import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { SellResourceUseCase } from '../use-cases/SellResourceUseCase.js';
import { BASELINE_GRID_ENERGY } from './EnergyBalanceService.js';
import { createCompanyId } from '../../domain/company/Company.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

describe('EnergyBalanceService', () => {
  it('uses baseline grid energy before an energy building is active', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    new CreateCompanyUseCase(context).execute({
      companyId: 'company_energy',
      name: 'Energy Corp',
      ownerId: 'player_001',
    });

    const companyIdResult = createCompanyId('company_energy');

    expect(companyIdResult.ok).toBe(true);

    if (!companyIdResult.ok) {
      return;
    }

    const balance = context.energyBalanceService.computeForCompany(companyIdResult.value);

    expect(balance.usesBaselineGrid).toBe(true);
    expect(balance.generation).toBe(BASELINE_GRID_ENERGY);
  });

  it('switches to plant generation after a coal power plant becomes active', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    new CreateCompanyUseCase(context).execute({
      companyId: 'company_plant',
      name: 'Plant Corp',
      ownerId: 'player_001',
    });

    const companyIdResult = createCompanyId('company_plant');

    expect(companyIdResult.ok).toBe(true);

    if (!companyIdResult.ok) {
      return;
    }

    const inventory = context.inventoryRepository.findByCompanyId(companyIdResult.value);
    inventory?.addQuantity('wood', 20, context.clock);
    if (inventory !== undefined) {
      context.inventoryRepository.save(inventory);
      inventory.pullDomainEvents();
    }

    new SellResourceUseCase(context).execute({
      companyId: 'company_plant',
      resourceId: 'wood',
      amount: 5,
    });

    context.simulationEngine.tick();

    const placeResult = new PlaceBuildingUseCase(context).execute({
      buildingId: 'building_plant',
      buildingTypeId: 'coal_power_plant',
      companyId: 'company_plant',
      name: 'Plant',
      x: 0,
      y: 0,
    });

    expect(placeResult.ok).toBe(true);

    for (let index = 0; index < 200; index += 1) {
      context.simulationEngine.tick();
    }

    const balance = context.energyBalanceService.computeForCompany(companyIdResult.value);
    expect(balance.usesBaselineGrid).toBe(false);
    expect(balance.generation).toBeGreaterThanOrEqual(50);
  });
});
