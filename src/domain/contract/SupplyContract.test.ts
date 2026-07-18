import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import {
  NPC_PURCHASE_CONTRACT_INTERVAL_TICKS,
  STARTER_NPC_WOOD_CONTRACT_AMOUNT,
  STARTER_NPC_WOOD_CONTRACT_PAYMENT,
  STARTER_NPC_WOOD_CONTRACT_RESOURCE_ID,
} from './SupplyContractConstants.js';
import { SupplyContract, createSupplyContractId } from './SupplyContract.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

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

describe('SupplyContract', () => {
  it('creates the starter NPC wood purchase contract with documented defaults', () => {
    const clock = new ManualClock(100);
    const result = SupplyContract.createStarterNpcWoodPurchase({
      id: requireSupplyContractId('contract_npc_wood_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const contract = result.value;

    expect(contract.getResourceId()).toBe(STARTER_NPC_WOOD_CONTRACT_RESOURCE_ID);
    expect(contract.getAmount()).toBe(STARTER_NPC_WOOD_CONTRACT_AMOUNT);
    expect(contract.getPaymentAmount()).toBe(STARTER_NPC_WOOD_CONTRACT_PAYMENT);
    expect(contract.getIntervalTicks()).toBe(NPC_PURCHASE_CONTRACT_INTERVAL_TICKS);
    expect(contract.isActive()).toBe(true);
    expect(contract.shouldFulfill(NPC_PURCHASE_CONTRACT_INTERVAL_TICKS)).toBe(true);
    expect(contract.shouldFulfill(NPC_PURCHASE_CONTRACT_INTERVAL_TICKS + 1)).toBe(false);
  });

  it('does not fulfill twice on the same tick', () => {
    const clock = new ManualClock(100);
    const result = SupplyContract.createStarterNpcWoodPurchase({
      id: requireSupplyContractId('contract_npc_wood_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const contract = result.value;
    contract.markFulfilled(20);

    expect(contract.shouldFulfill(20)).toBe(false);
    expect(contract.shouldFulfill(40)).toBe(true);
  });
});
