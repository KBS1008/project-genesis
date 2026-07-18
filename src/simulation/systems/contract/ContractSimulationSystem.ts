/**
 * @module @simulation/systems/contract/ContractSimulationSystem
 *
 * Fulfills active NPC supply contracts each simulation tick.
 */

import type { DomainEvent } from '../../../common/events/DomainEvent.js';
import { SupplyContractKind } from '../../../domain/contract/SupplyContract.js';
import type { SupplyContractRepository } from '../../../domain/contract/SupplyContractRepository.js';
import { FinanceTransactionType } from '../../../domain/finance/FinanceTransactionType.js';
import type { FinanceRepository } from '../../../domain/finance/FinanceRepository.js';
import type { InventoryRepository } from '../../../domain/inventory/InventoryRepository.js';
import type { SimulationSystem } from '../../engine/SimulationSystem.js';
import type { TickContext } from '../../engine/TickContext.js';

/** Dependencies for {@link ContractSimulationSystem}. */
export type ContractSimulationSystemDependencies = {
  readonly supplyContractRepository: SupplyContractRepository;
  readonly inventoryRepository: InventoryRepository;
  readonly financeRepository: FinanceRepository;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
};

/**
 * Visits active supply contracts and fulfills eligible NPC purchase orders.
 */
export class ContractSimulationSystem implements SimulationSystem {
  readonly name = 'Contract';
  readonly #supplyContractRepository: SupplyContractRepository;
  readonly #inventoryRepository: InventoryRepository;
  readonly #financeRepository: FinanceRepository;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  /**
   * @param dependencies - Repositories and event enqueue callback.
   */
  constructor(dependencies: ContractSimulationSystemDependencies) {
    this.#supplyContractRepository = dependencies.supplyContractRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#enqueueEvents = dependencies.enqueueEvents;
  }

  execute(context: TickContext): void {
    for (const contract of this.#supplyContractRepository.findAll()) {
      if (!contract.shouldFulfill(context.tickNumber)) {
        continue;
      }

      if (contract.getKind() !== SupplyContractKind.NPC_PURCHASE) {
        continue;
      }

      const inventory = this.#inventoryRepository.findByCompanyId(contract.getCompanyId());
      const finance = this.#financeRepository.findByCompanyId(contract.getCompanyId());

      if (inventory === undefined || finance === undefined) {
        continue;
      }

      const removeResult = inventory.removeQuantity(
        contract.getResourceId(),
        contract.getAmount(),
        context.clock,
      );

      if (!removeResult.ok) {
        continue;
      }

      const creditResult = finance.credit(
        contract.getPaymentAmount(),
        FinanceTransactionType.CONTRACT_PAYMENT,
        context.clock,
      );

      if (!creditResult.ok) {
        inventory.addQuantity(contract.getResourceId(), contract.getAmount(), context.clock);
        continue;
      }

      contract.markFulfilled(context.tickNumber);
      this.#inventoryRepository.save(inventory);
      this.#financeRepository.save(finance);
      this.#supplyContractRepository.save(contract);
      this.#enqueueEvents([
        ...inventory.pullDomainEvents(),
        ...finance.pullDomainEvents(),
        ...contract.pullDomainEvents(),
      ]);
    }
  }
}
