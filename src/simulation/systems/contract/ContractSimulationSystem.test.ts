import { ManualClock } from '../../../common/time/ManualClock.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import {
  NPC_PURCHASE_CONTRACT_INTERVAL_TICKS,
  STARTER_NPC_WOOD_CONTRACT_AMOUNT,
  STARTER_NPC_WOOD_CONTRACT_PAYMENT,
} from '../../../domain/contract/SupplyContractConstants.js';
import { SupplyContract, createSupplyContractId } from '../../../domain/contract/SupplyContract.js';
import { FinanceTransactionType } from '../../../domain/finance/FinanceTransactionType.js';
import { createFinanceAccountId, FinanceAccount } from '../../../domain/finance/FinanceAccount.js';
import { STARTING_MONEY } from '../../../domain/finance/FinanceConstants.js';
import { createInventoryId, Inventory } from '../../../domain/inventory/Inventory.js';
import { InMemoryFinanceRepository } from '../../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemorySupplyContractRepository } from '../../../infrastructure/persistence/InMemorySupplyContractRepository.js';
import { ContractSimulationSystem } from './ContractSimulationSystem.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireFinanceAccountId(value: string) {
  const result = createFinanceAccountId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireInventoryId(value: string) {
  const result = createInventoryId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireSupplyContractId(value: string) {
  const result = createSupplyContractId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('ContractSimulationSystem', () => {
  it('fulfills NPC purchase contracts on interval ticks when inventory is sufficient', () => {
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const financeRepository = new InMemoryFinanceRepository();
    const inventoryRepository = new InMemoryInventoryRepository();
    const supplyContractRepository = new InMemorySupplyContractRepository();
    const events: string[] = [];

    const financeResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId,
      clock,
    });

    expect(financeResult.ok).toBe(true);

    if (!financeResult.ok) {
      return;
    }

    financeRepository.save(financeResult.value);

    const inventoryResult = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId,
      clock,
    });

    expect(inventoryResult.ok).toBe(true);

    if (!inventoryResult.ok) {
      return;
    }

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 20, clock);
    inventory.pullDomainEvents();
    inventoryRepository.save(inventory);

    const contractResult = SupplyContract.createStarterNpcWoodPurchase({
      id: requireSupplyContractId('contract_npc_wood_001'),
      companyId,
      clock,
    });

    expect(contractResult.ok).toBe(true);

    if (!contractResult.ok) {
      return;
    }

    supplyContractRepository.save(contractResult.value);

    const system = new ContractSimulationSystem({
      supplyContractRepository,
      inventoryRepository,
      financeRepository,
      enqueueEvents: (domainEvents) => {
        events.push(...domainEvents.map((event) => event.eventName));
      },
    });

    system.execute({ tickNumber: NPC_PURCHASE_CONTRACT_INTERVAL_TICKS, clock });

    const updatedInventory = inventoryRepository.findByCompanyId(companyId);
    const updatedFinance = financeRepository.findByCompanyId(companyId);
    const woodQuantity =
      updatedInventory?.getItems().find((item) => item.resourceId.value === 'wood')?.quantity ?? 0;

    expect(woodQuantity).toBe(20 - STARTER_NPC_WOOD_CONTRACT_AMOUNT);
    expect(updatedFinance?.getCashBalance()).toBe(
      STARTING_MONEY + STARTER_NPC_WOOD_CONTRACT_PAYMENT,
    );
    expect(updatedFinance?.getTransactions().at(-1)?.transactionType).toBe(
      FinanceTransactionType.CONTRACT_PAYMENT,
    );
    expect(events).toContain('FinanceTransactionRecorded');
    expect(contractResult.value.getLastFulfilledTick()).toBe(NPC_PURCHASE_CONTRACT_INTERVAL_TICKS);
  });

  it('skips fulfillment when inventory is insufficient', () => {
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const financeRepository = new InMemoryFinanceRepository();
    const inventoryRepository = new InMemoryInventoryRepository();
    const supplyContractRepository = new InMemorySupplyContractRepository();

    const financeResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId,
      clock,
    });

    if (!financeResult.ok) {
      throw new Error(financeResult.error.message);
    }

    financeRepository.save(financeResult.value);

    const inventoryResult = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId,
      clock,
    });

    if (!inventoryResult.ok) {
      throw new Error(inventoryResult.error.message);
    }

    inventoryRepository.save(inventoryResult.value);

    const contractResult = SupplyContract.createStarterNpcWoodPurchase({
      id: requireSupplyContractId('contract_npc_wood_001'),
      companyId,
      clock,
    });

    if (!contractResult.ok) {
      throw new Error(contractResult.error.message);
    }

    supplyContractRepository.save(contractResult.value);

    const system = new ContractSimulationSystem({
      supplyContractRepository,
      inventoryRepository,
      financeRepository,
      enqueueEvents: () => undefined,
    });

    system.execute({ tickNumber: NPC_PURCHASE_CONTRACT_INTERVAL_TICKS, clock });

    const finance = financeRepository.findByCompanyId(companyId);
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY);
    expect(contractResult.value.getLastFulfilledTick()).toBe(0);
  });
});
