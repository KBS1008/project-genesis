/**
 * @module @domain/company/Company
 *
 * Company aggregate root for Project Genesis.
 *
 * A company is the central economic unit controlled by a player.
 *
 * @see docs/schemas/Company.Schema.md
 * @see docs/architecture/domain-model.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId, PlayerId } from './CompanyId.js';
import { CompanyStatus } from './CompanyStatus.js';
import { CompanyFounded } from './events/CompanyFounded.js';

/** Parameters required to create a new company. */
export type CreateCompanyParams = {
  readonly id: CompanyId;
  readonly name: string;
  readonly ownerId: PlayerId;
  readonly clock: Clock;
};

/**
 * The company aggregate root.
 */
export class Company extends AggregateRoot<'Company'> {
  readonly #name: string;
  readonly #ownerId: PlayerId;
  readonly #foundedAt: number;
  readonly #status: CompanyStatus;

  private constructor(
    params: {
      id: CompanyId;
      name: string;
      ownerId: PlayerId;
      foundedAt: number;
      status: CompanyStatus;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#name = params.name;
    this.#ownerId = params.ownerId;
    this.#foundedAt = params.foundedAt;
    this.#status = params.status;

    if (!restoring) {
      this.addDomainEvent(
        new CompanyFounded(
          params.foundedAt,
          params.id.value,
          params.ownerId.value,
          params.name,
        ),
      );
    }
  }

  /**
   * Creates a new company aggregate.
   *
   * @param params - Creation parameters including id, name, owner and clock.
   * @returns A result containing the company or a validation error.
   */
  static create(params: CreateCompanyParams): Result<Company, ValidationError> {
    const nameResult = Guard.againstEmptyString(params.name, 'Company name must not be empty.');

    if (!nameResult.ok) {
      return Result.fail(nameResult.error);
    }

    const trimmedName = nameResult.value.trim();
    const trimmedNameResult = Guard.againstEmptyString(
      trimmedName,
      'Company name must not be a whitespace-only string.',
    );

    if (!trimmedNameResult.ok) {
      return Result.fail(trimmedNameResult.error);
    }

    const foundedAt = params.clock.now();

    return Result.ok(
      new Company(
        {
          id: params.id,
          name: trimmedNameResult.value,
          ownerId: params.ownerId,
          foundedAt,
          status: CompanyStatus.ACTIVE,
        },
      ),
    );
  }

  /**
   * Rehydrates a company aggregate from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: CompanyId;
    readonly name: string;
    readonly ownerId: PlayerId;
    readonly foundedAt: number;
    readonly status: CompanyStatus;
  }): Result<Company, ValidationError> {
    const nameResult = Guard.againstEmptyString(params.name, 'Company name must not be empty.');

    if (!nameResult.ok) {
      return Result.fail(nameResult.error);
    }

    return Result.ok(
      new Company(
        {
          id: params.id,
          name: nameResult.value,
          ownerId: params.ownerId,
          foundedAt: params.foundedAt,
          status: params.status,
        },
        true,
      ),
    );
  }

  /** The company display name. */
  getName(): string {
    return this.#name;
  }

  /** The owning player's identifier. */
  getOwnerId(): PlayerId {
    return this.#ownerId;
  }

  /** Simulation time when the company was founded. */
  getFoundedAt(): number {
    return this.#foundedAt;
  }

  /** The current company lifecycle status. */
  getStatus(): CompanyStatus {
    return this.#status;
  }
}

/** Creates a validated company identifier from a raw string. */
export function createCompanyId(rawValue: string): Result<CompanyId, ValidationError> {
  const result = Identifier.create<CompanyId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}

/** Creates a validated player identifier from a raw string. */
export function createPlayerId(rawValue: string): Result<PlayerId, ValidationError> {
  const result = Identifier.create<PlayerId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
