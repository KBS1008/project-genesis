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
import type { RegionId } from '../region/RegionId.js';
import type { BuildingId, BuildingTypeId } from './BuildingId.js';
import { BuildingStatus } from './BuildingStatus.js';
import type { Position } from './Position.js';
import { BuildingConstructionCompleted } from './events/BuildingConstructionCompleted.js';
import { BuildingConstructionStarted } from './events/BuildingConstructionStarted.js';
import { BuildingPlaced } from './events/BuildingPlaced.js';

/** Result of ticking building construction progress. */
export type BuildingConstructionTickResult = {
  readonly status: 'constructing' | 'completed';
  readonly progress: number;
};

/** Parameters required to place a new building. */
export type CreateBuildingParams = {
  readonly id: BuildingId;
  readonly buildingTypeId: BuildingTypeId;
  readonly companyId: CompanyId;
  readonly regionId: RegionId;
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
  readonly #regionId: RegionId;
  readonly #name: string;
  readonly #position: Position;
  readonly #level: number;
  readonly #createdAt: number;
  #status: BuildingStatus;
  #constructionDuration: number;
  #constructionProgress: number;
  #constructionStartTime: number | undefined;
  #constructionEndTime: number | undefined;

  private constructor(
    params: {
      id: BuildingId;
      buildingTypeId: BuildingTypeId;
      companyId: CompanyId;
      regionId: RegionId;
      name: string;
      position: Position;
      level: number;
      createdAt: number;
      status: BuildingStatus;
      constructionDuration: number;
      constructionProgress: number;
      constructionStartTime: number | undefined;
      constructionEndTime: number | undefined;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#buildingTypeId = params.buildingTypeId;
    this.#companyId = params.companyId;
    this.#regionId = params.regionId;
    this.#name = params.name;
    this.#position = params.position;
    this.#level = params.level;
    this.#createdAt = params.createdAt;
    this.#status = params.status;
    this.#constructionDuration = params.constructionDuration;
    this.#constructionProgress = params.constructionProgress;
    this.#constructionStartTime = params.constructionStartTime;
    this.#constructionEndTime = params.constructionEndTime;

    if (!restoring) {
      this.addDomainEvent(
        new BuildingPlaced(
          params.createdAt,
          params.id.value,
          params.companyId.value,
          params.regionId.value,
          params.buildingTypeId.value,
          params.position.x,
          params.position.y,
        ),
      );
    }
  }

  /**
   * Places a new building aggregate in planned status.
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
        regionId: params.regionId,
        name: trimmedNameResult.value,
        position: params.position,
        level: 1,
        createdAt,
        status: BuildingStatus.PLANNED,
        constructionDuration: 0,
        constructionProgress: 0,
        constructionStartTime: undefined,
        constructionEndTime: undefined,
      }),
    );
  }

  /**
   * Rehydrates a building aggregate from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: BuildingId;
    readonly buildingTypeId: BuildingTypeId;
    readonly companyId: CompanyId;
    readonly regionId: RegionId;
    readonly name: string;
    readonly position: Position;
    readonly level: number;
    readonly createdAt: number;
    readonly status: BuildingStatus;
    readonly constructionDuration: number;
    readonly constructionProgress: number;
    readonly constructionStartTime: number | undefined;
    readonly constructionEndTime: number | undefined;
  }): Result<Building, ValidationError> {
    const nameResult = Guard.againstEmptyString(params.name, 'Building name must not be empty.');

    if (!nameResult.ok) {
      return Result.fail(nameResult.error);
    }

    const levelResult = Guard.againstNegative(params.level, 'Building level must not be negative.');

    if (!levelResult.ok) {
      return Result.fail(levelResult.error);
    }

    const durationResult = Guard.againstNegative(
      params.constructionDuration,
      'Construction duration must not be negative.',
    );

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    if (params.constructionProgress < 0 || params.constructionProgress > 100) {
      return Result.fail(new ValidationError('Construction progress must be between 0 and 100.'));
    }

    return Result.ok(
      new Building(
        {
          id: params.id,
          buildingTypeId: params.buildingTypeId,
          companyId: params.companyId,
          regionId: params.regionId,
          name: nameResult.value,
          position: params.position,
          level: levelResult.value,
          createdAt: params.createdAt,
          status: params.status,
          constructionDuration: durationResult.value,
          constructionProgress: params.constructionProgress,
          constructionStartTime: params.constructionStartTime,
          constructionEndTime: params.constructionEndTime,
        },
        true,
      ),
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

  /** The region that owns this building's spatial context. */
  getRegionId(): RegionId {
    return this.#regionId;
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

  /** Total construction duration in simulation time units. */
  getConstructionDuration(): number {
    return this.#constructionDuration;
  }

  /** Display construction progress from 0 to 100. */
  getConstructionProgress(): number {
    return this.#constructionProgress;
  }

  /** Simulation time when construction started, if applicable. */
  getConstructionStartTime(): number | undefined {
    return this.#constructionStartTime;
  }

  /** Simulation time when construction finished, if completed. */
  getConstructionEndTime(): number | undefined {
    return this.#constructionEndTime;
  }

  /**
   * Starts or immediately completes construction for a planned building.
   */
  beginConstruction(duration: number, clock: Clock): Result<void, ValidationError> {
    if (this.#status !== BuildingStatus.PLANNED) {
      return Result.fail(new ValidationError('Only planned buildings can begin construction.'));
    }

    const durationResult = Guard.againstNegative(
      duration,
      'Construction duration must not be negative.',
    );

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    this.#constructionDuration = durationResult.value;

    if (this.#constructionDuration === 0) {
      return this.#activate(clock);
    }

    const startTime = clock.now();
    this.#status = BuildingStatus.UNDER_CONSTRUCTION;
    this.#constructionStartTime = startTime;
    this.#constructionProgress = 0;

    this.addDomainEvent(
      new BuildingConstructionStarted(
        startTime,
        this.getId().value,
        this.#companyId.value,
        this.#buildingTypeId.value,
        this.#constructionDuration,
      ),
    );

    return Result.ok(undefined);
  }

  /**
   * Advances construction progress for a building under construction.
   */
  tickConstruction(clock: Clock): Result<BuildingConstructionTickResult, ValidationError> {
    if (this.#status !== BuildingStatus.UNDER_CONSTRUCTION) {
      return Result.fail(
        new ValidationError('Only buildings under construction can tick construction progress.'),
      );
    }

    if (this.#constructionStartTime === undefined) {
      return Result.fail(
        new ValidationError('Building under construction is missing a start time.'),
      );
    }

    const elapsed = clock.now() - this.#constructionStartTime;
    this.#constructionProgress = Math.min(100, (elapsed / this.#constructionDuration) * 100);

    if (this.#constructionProgress >= 100) {
      const completeResult = this.#activate(clock);

      if (!completeResult.ok) {
        return Result.fail(completeResult.error);
      }

      return Result.ok({ status: 'completed', progress: 100 });
    }

    return Result.ok({ status: 'constructing', progress: this.#constructionProgress });
  }

  #activate(clock: Clock): Result<void, ValidationError> {
    this.#status = BuildingStatus.ACTIVE;
    this.#constructionProgress = 100;
    this.#constructionEndTime = clock.now();

    this.addDomainEvent(
      new BuildingConstructionCompleted(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        this.#buildingTypeId.value,
      ),
    );

    return Result.ok(undefined);
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
