import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { GetInventoryQueryHandler } from './GetInventoryQueryHandler.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createContext(clock = new ManualClock(100)) {
  const companyRepository = new InMemoryCompanyRepository();
  const inventoryRepository = new InMemoryInventoryRepository();
  const eventBus = new InMemoryEventBus();
  const simulationEngine = new SimulationEngine({ clock, eventBus });
  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository,
    simulationEngine,
  });
  const getInventory = new GetInventoryQueryHandler({ inventoryRepository });

  return { clock, companyRepository, inventoryRepository, createCompany, getInventory };
}

describe('GetInventoryQueryHandler', () => {
  it('returns inventory items with available quantities', () => {
    const { clock, createCompany, getInventory, inventoryRepository } = createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const inventory = inventoryRepository.findByCompanyId(requireCompanyId('company_001'));

    if (inventory === undefined) {
      throw new Error('Inventory was not found.');
    }

    inventory.addQuantity('wood', 10, clock);
    inventory.reserveQuantity('wood', 4, clock);
    inventoryRepository.save(inventory);

    const result = getInventory.execute({ companyId: 'company_001' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.id).toBe('inventory_company_001');
      expect(result.value.companyId).toBe('company_001');
      expect(result.value.items).toEqual([
        {
          resourceId: 'wood',
          quantity: 10,
          reserved: 4,
          available: 6,
        },
      ]);
    }
  });

  it('returns an empty item list for a new company inventory', () => {
    const { createCompany, getInventory } = createContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = getInventory.execute({ companyId: 'company_001' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.items).toEqual([]);
    }
  });

  it('rejects unknown company inventories', () => {
    const { getInventory } = createContext();

    const result = getInventory.execute({ companyId: 'company_missing' });

    expect(result.ok).toBe(false);
  });
});
