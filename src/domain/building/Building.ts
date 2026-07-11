/**
 * @module @domain/building/Building
 *
 * Building aggregate root for Project Genesis.
 *
 * A building represents physical infrastructure owned by a company.
 * It provides capacity and properties but contains no production logic.
 *
 * @see docs/schemas/Building.schema.md
 * @see docs/decisions/DD-014-template-vs-instance_architecture.md
 * @see docs/decisions/DD-015-static-definitions-vs-dynamic-state.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { BuildingId, BuildingTypeId } from './BuildingId.js';
import { BuildingStatus } from './BuildingStatus.js';
import { Position } from './Position.js';
import { BuildingPlaced } from './events/BuildingPlaced.js';

/** Parameters required to place a new building. */
export type CreateBuildingParams = {
  readonly id: BuildingId;
  readonly buildingTypeId: BuildingTypeId;
  readonly companyId: CompanyId;
  readonly name: string;
  readonly position: Position;
  readonly clock: Clock;
};

/**
 * The building aggregate root.
 */
export class Building extends AggregateRoot<'Building'> {
  readonly #buildingTypeId: BuildingTypeId;
  readonly #companyId: CompanyId;
  readonly #name: string;
  readonly #position: Position;
  readonly #level: number;
  readonly #createdAt: number;
  readonly #status: BuildingStatus;

  private constructor(params: {
    id: BuildingId;
    buildingTypeId: BuildingTypeId;
    companyId: CompanyId;
    name: string;
    position: Position;
    createdAt: number;
  }) {
    super(params.id);
    this.#buildingTypeId = params.buildingTypeId;
    this.#companyId = params.companyId;
    this.#name = params.name;
    this.#position = params.position;
    this.#level = 1;
    this.#createdAt = params.createdAt;
    this.#status = BuildingStatus.PLANNED;

    this.addDomainEvent(
      new BuildingPlaced(
        params.createdAt,
        params.id.value,
        params.companyId.value,
        params.buildingTypeId.value,
        params.position.x,
        params.position.y,
      ),
    );
  }

  /**
   * Places a new building aggregate in planned status.
   *
   * @param params - Placement parameters including ids, name, position and clock.
   * @returns A result containing the building or a validation error.
   */
  static create(params: CreateBuildingParams): Result<Building, ValidationError> {
    const nameResult = Guard.againstEmptyString(params.name, 'Building name must not be empty.');

    if (!nameResult.ok) {
      return Result.fail(nameResult.error);
    }

    const trimmedName = nameResult.value.trim();
    const trimmedNameResult = Guard.againstEmptyString(
      trimmedName,
      'Building name must not be a whitespace-only string.',
    );

    if (!trimmedNameResult.ok) {
      return Result.fail(trimmedNameResult.error);
    }

    const xResult = Guard.againstNegative(
      params.position.x,
      'Building x coordinate must not be negative.',
    );

    if (!xResult.ok) {
      return Result.fail(xResult.error);
    }

    const yResult = Guard.againstNegative(
      params.position.y,
      'Building y coordinate must not be negative.',
    );

    if (!yResult.ok) {
      return Result.fail(yResult.error);
    }

    const createdAt = params.clock.now();

    return Result.ok(
      new Building({
        id: params.id,
        buildingTypeId: params.buildingTypeId,
        companyId: params.companyId,
        name: trimmedNameResult.value,
        position: params.position,
        createdAt,
      }),
    );
  }

  /** Reference to the static building type definition. */
  getBuildingTypeId(): BuildingTypeId {
    return this.#buildingTypeId;
  }

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** The building display name. */
  getName(): string {
    return this.#name;
  }

  /** The building grid position. */
  getPosition(): Position {
    return this.#position;
  }

  /** The current building level. */
  getLevel(): number {
    return this.#level;
  }

  /** Simulation time when the building was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** The current building lifecycle status. */
  getStatus(): BuildingStatus {
    return this.#status;
  }
}

/** Creates a validated building identifier from a raw string. */
export function createBuildingId(rawValue: string): Result<BuildingId, ValidationError> {
  const result = Identifier.create<BuildingId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}

/** Creates a validated building type identifier from a raw string. */
export function createBuildingTypeId(rawValue: string): Result<BuildingTypeId, ValidationError> {
  const result = Identifier.create<BuildingTypeId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
