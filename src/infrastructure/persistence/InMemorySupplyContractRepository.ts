/**
 * @module @infrastructure/persistence/InMemorySupplyContractRepository
 *
 * In-memory implementation of {@link SupplyContractRepository}.
 */

import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { SupplyContract } from '../../domain/contract/SupplyContract.js';
import type { SupplyContractId } from '../../domain/contract/SupplyContractId.js';
import type { SupplyContractRepository } from '../../domain/contract/SupplyContractRepository.js';

/**
 * Stores supply contract aggregates in memory.
 */
export class InMemorySupplyContractRepository implements SupplyContractRepository {
  readonly #contracts = new Map<string, SupplyContract>();

  save(contract: SupplyContract): void {
    this.#contracts.set(contract.getId().value, contract);
  }

  findById(id: SupplyContractId): SupplyContract | undefined {
    return this.#contracts.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): readonly SupplyContract[] {
    return Object.freeze(
      [...this.#contracts.values()]
        .filter((contract) => contract.getCompanyId().value === companyId.value)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }

  findAll(): readonly SupplyContract[] {
    return Object.freeze(
      [...this.#contracts.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
