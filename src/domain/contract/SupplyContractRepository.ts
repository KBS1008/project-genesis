/**
 * @module @domain/contract/SupplyContractRepository
 *
 * Persistence contract for {@link SupplyContract} aggregate roots.
 */

import type { CompanyId } from '../company/CompanyId.js';
import type { SupplyContract } from './SupplyContract.js';
import type { SupplyContractId } from './SupplyContractId.js';

/**
 * Provides access to persisted supply contract aggregates.
 */
export interface SupplyContractRepository {
  /** Persists a supply contract aggregate. */
  save(contract: SupplyContract): void;

  /** Returns a contract by id, or undefined when not found. */
  findById(id: SupplyContractId): SupplyContract | undefined;

  /** Returns all contracts owned by a company in deterministic id order. */
  findByCompanyId(companyId: CompanyId): readonly SupplyContract[];

  /** Returns all persisted contracts in deterministic id order. */
  findAll(): readonly SupplyContract[];
}
