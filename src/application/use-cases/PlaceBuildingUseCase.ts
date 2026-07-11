/**
 * @module @application/use-cases/PlaceBuildingUseCase
 *
 * Coordinates building placement, persistence and domain event enqueueing.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import {
  Building,
  createBuildingId,
  createBuildingTypeId,
} from '../../domain/building/Building.js';
import type { BuildingId } from '../../domain/building/BuildingId.js';
import { Position } from '../../domain/building/Position.js';
import { createCompanyId } from '../../domain/company/Company.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { PlaceBuildingCommand } from '../commands/PlaceBuildingCommand.js';

/** Dependencies required by {@link PlaceBuildingUseCase}. */
export type PlaceBuildingUseCaseDependencies = Pick<
  ApplicationContext,
  'clock' | 'companyRepository' | 'buildingRepository' | 'simulationEngine'
>;

/**
 * Places a building aggregate and persists it.
 */
export class PlaceBuildingUseCase {
  readonly #clock: PlaceBuildingUseCaseDependencies['clock'];
  readonly #companyRepository: PlaceBuildingUseCaseDependencies['companyRepository'];
  readonly #buildingRepository: PlaceBuildingUseCaseDependencies['buildingRepository'];
  readonly #simulationEngine: PlaceBuildingUseCaseDependencies['simulationEngine'];

  /**
   * @param dependencies - Application services required for building placement.
   */
  constructor(dependencies: PlaceBuildingUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#simulationEngine = dependencies.simulationEngine;
  }

  /**
   * Executes the place-building workflow.
   *
   * @param command - Building placement input.
   */
  execute(command: PlaceBuildingCommand): Result<BuildingId, ValidationError> {
    const buildingIdResult = createBuildingId(command.buildingId);

    if (!buildingIdResult.ok) {
      return Result.fail(buildingIdResult.error);
    }

    const buildingTypeIdResult = createBuildingTypeId(command.buildingTypeId);

    if (!buildingTypeIdResult.ok) {
      return Result.fail(buildingTypeIdResult.error);
    }

    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const buildingId = buildingIdResult.value;
    const companyId = companyIdResult.value;

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(
        new ValidationError(`Company id "${companyId.value}" was not found.`),
      );
    }

    if (this.#buildingRepository.findById(buildingId) !== undefined) {
      return Result.fail(
        new ValidationError(`Building id "${buildingId.value}" already exists.`),
      );
    }

    const buildingResult = Building.create({
      id: buildingId,
      buildingTypeId: buildingTypeIdResult.value,
      companyId,
      name: command.name,
      position: new Position(command.x, command.y),
      clock: this.#clock,
    });

    if (!buildingResult.ok) {
      return Result.fail(buildingResult.error);
    }

    const building = buildingResult.value;
    this.#buildingRepository.save(building);
    this.#simulationEngine.enqueueEvents(building.pullDomainEvents());

    return Result.ok(buildingId);
  }
}
