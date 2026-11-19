/**
 * @module @project-genesis/api/game/game.controller
 *
 * REST endpoints mirroring the browser dev shell contract.
 */

import { existsSync } from 'node:fs';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  Optional,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { toApiSuccess } from '../common/api-response.js';
import { unwrapResult } from '../common/unwrap-result.js';
import type { LoadGameDto } from './dto/load-game.dto.js';
import type { NewGameDto } from './dto/new-game.dto.js';
import type { SaveGameDto } from './dto/save-game.dto.js';
import type { SetSimulationSpeedDto } from './dto/set-simulation-speed.dto.js';
import type { PlaceBuildingDto } from './dto/place-building.dto.js';
import type { ValidateBuildingPlacementDto } from './dto/validate-building-placement.dto.js';
import type { SellResourceDto } from './dto/sell-resource.dto.js';
import type { TickSimulationDto } from './dto/tick-simulation.dto.js';
import type { StartProductionDto } from './dto/start-production.dto.js';
import type { StartResearchDto } from './dto/start-research.dto.js';
import type { HireEmployeeDto } from './dto/hire-employee.dto.js';
import type { AssignEmployeeDto } from './dto/assign-employee.dto.js';
import { DashboardBroadcastService } from '../dashboard/dashboard-broadcast.service.js';
import { SavePathRejectedError } from '../config/save-path-config.js';
import { ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE } from './acceptance-simulation-advance-guard.js';
import { AcceptanceSimulationAdvanceGuardService } from './acceptance-simulation-advance-guard.service.js';
import { AcceptanceSimulationTickRequestAuditService } from './acceptance-simulation-tick-request-audit.service.js';
import {
  PROJECT_GENESIS_ACCEPTANCE_S3_RAM_ONLY_BUILDING_PLACEMENT_ENV,
  shouldSkipPersistenceAfterBuildingPlacement,
} from './acceptance-s3-ram-only-building-placement.js';
import type { AcceptanceS3ProductionPhaseGameplayContext } from './acceptance-s3-production-phase-readiness.js';
import { GameSessionService } from './game-session.service.js';

/** Exposes game session actions over HTTP. */
@Controller('api')
export class GameController {
  /**
   * @param gameSessionService - Singleton browser session facade.
   */
  constructor(
    @Inject(GameSessionService)
    private readonly gameSessionService: GameSessionService,
    @Inject(DashboardBroadcastService)
    private readonly dashboardBroadcast: DashboardBroadcastService,
    @Inject(AcceptanceSimulationAdvanceGuardService)
    private readonly acceptanceSimulationAdvanceGuard: AcceptanceSimulationAdvanceGuardService,
    @Optional()
    @Inject(AcceptanceSimulationTickRequestAuditService)
    private readonly tickRequestAudit?: AcceptanceSimulationTickRequestAuditService,
  ) {}

  #buildAcceptanceS3ProductionPhaseGameplayContext():
    | AcceptanceS3ProductionPhaseGameplayContext
    | undefined {
    const session = this.gameSessionService.getSession();
    const buildingsResult = session.listBuildings();
    const jobsResult = session.listProductionJobs();

    if (!buildingsResult.ok || !jobsResult.ok) {
      return undefined;
    }

    return {
      buildings: buildingsResult.value.map((building) => ({
        id: building.id,
        buildingTypeId: building.buildingTypeId,
        status: building.status,
      })),
      productionJobs: jobsResult.value.map((job) => ({
        id: job.id,
        buildingId: job.buildingId,
        recipeId: job.recipeId,
        status: job.status,
        progress: job.progress,
      })),
    };
  }

  #readOriginHeaders(request: Request | undefined): {
    readonly originHeader: string | undefined;
    readonly refererHeader: string | undefined;
  } {
    if (request === undefined) {
      return { originHeader: undefined, refererHeader: undefined };
    }

    const originHeader = request.headers.origin;
    const refererHeader = request.headers.referer;

    return {
      originHeader: typeof originHeader === 'string' ? originHeader : undefined,
      refererHeader: typeof refererHeader === 'string' ? refererHeader : undefined,
    };
  }

  #observeAdvanceAttempt(
    request: Request | undefined,
    input: {
      readonly endpoint: 'tick' | 'step';
      readonly requestedCount: number | 'INVALID_UNPARSEABLE';
      readonly admissionOutcome: 'ADMITTED' | 'DENIED' | 'INVALID_REQUEST';
      readonly reservation: ReturnType<
        AcceptanceSimulationAdvanceGuardService['tryReserveSimulationAdvances']
      > | null;
      readonly simulationCompletion?: 'UNKNOWN' | 'ERROR';
    },
  ): void {
    const headers = this.#readOriginHeaders(request);

    this.tickRequestAudit?.observeSimulationAdvanceAttempt({
      endpoint: input.endpoint,
      requestedCount: input.requestedCount,
      admissionOutcome: input.admissionOutcome,
      reservation: input.reservation,
      ...(input.simulationCompletion !== undefined
        ? { simulationCompletion: input.simulationCompletion }
        : {}),
      originHeader: headers.originHeader,
      refererHeader: headers.refererHeader,
    });
  }

  /** Notifies connected dashboard clients to refresh after session mutations. */
  #notifyDashboardRefresh(): void {
    const dashboardResult = this.gameSessionService.getSession().getDashboard();
    const tickNumber = dashboardResult.ok ? dashboardResult.value.tickNumber : null;
    this.dashboardBroadcast.notifyRefresh(tickNumber);
  }

  /** Returns the aggregated dashboard snapshot. */
  @Get('dashboard')
  getDashboard() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getDashboard()));
  }

  /** Returns tick metrics history for dashboard charts. */
  @Get('dashboard/history')
  getDashboardHistory(
    @Query('fromTick') fromTick?: string,
    @Query('toTick') toTick?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedFromTick = fromTick === undefined ? undefined : Number.parseInt(fromTick, 10);
    const parsedToTick = toTick === undefined ? undefined : Number.parseInt(toTick, 10);
    const parsedLimit = limit === undefined ? undefined : Number.parseInt(limit, 10);

    if (fromTick !== undefined && !Number.isInteger(parsedFromTick)) {
      throw new BadRequestException('fromTick must be an integer.');
    }

    if (toTick !== undefined && !Number.isInteger(parsedToTick)) {
      throw new BadRequestException('toTick must be an integer.');
    }

    if (limit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit! < 1)) {
      throw new BadRequestException('limit must be a positive integer.');
    }

    const historyQuery: {
      fromTick?: number;
      toTick?: number;
      limit?: number;
    } = {};

    if (parsedFromTick !== undefined) {
      historyQuery.fromTick = parsedFromTick;
    }

    if (parsedToTick !== undefined) {
      historyQuery.toTick = parsedToTick;
    }

    if (parsedLimit !== undefined) {
      historyQuery.limit = parsedLimit;
    }

    return toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().getTickHistory(historyQuery)),
    );
  }

  /** Returns bootstrapped world overview data. */
  @Get('world/overview')
  getWorldOverview() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getWorldOverview()));
  }

  /** Returns all bootstrapped regions. */
  @Get('world/regions')
  listRegions() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().listRegions()));
  }

  /** Returns one region with resources and cities. */
  @Get('world/regions/:regionId')
  getRegionDetails(@Param('regionId') regionId: string) {
    if (regionId === undefined || regionId.length === 0) {
      throw new BadRequestException('regionId is required.');
    }

    return toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().getRegionDetails(regionId)),
    );
  }

  /** Returns the active world map layout. */
  @Get('world/map')
  getWorldMap() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getWorldMap()));
  }

  /** Returns cities, optionally filtered by region. */
  @Get('world/cities')
  listCities(@Query('regionId') regionId?: string) {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().listCities(regionId)));
  }

  /** Returns browser session status. */
  @Get('session/status')
  getSessionStatus() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getSessionStatus()));
  }

  /** Returns simulation execution status. */
  @Get('simulation/status')
  getSimulationStatus() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getSimulationStatus()));
  }

  /** Lists savegame metadata in the configured save directory. */
  @Get('saves')
  async listSavegames() {
    const result = await this.gameSessionService.getSession().listSavegames();
    return toApiSuccess(unwrapResult(result));
  }

  /** Returns the active company read model. */
  @Get('company')
  getCompany() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getCompany()));
  }

  /** Returns buildings for the active company. */
  @Get('buildings')
  listBuildings() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().listBuildings()));
  }

  /** Returns inventory for the active company. */
  @Get('inventory')
  getInventory() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getInventory()));
  }

  /** Returns finance data for the active company. */
  @Get('finance')
  getFinance() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getFinance()));
  }

  /** Returns finance transactions for the active company. */
  @Get('finance/transactions')
  listFinanceTransactions() {
    return toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().listFinanceTransactions()),
    );
  }

  /** Returns market prices for the active regional market. */
  @Get('markets/prices')
  getMarketPrices(@Query('regionId') regionId?: string) {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().getMarketPrices(regionId)));
  }

  /** Returns production jobs for the active company. */
  @Get('production/jobs')
  listProductionJobs() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().listProductionJobs()));
  }

  /** Returns research jobs for the active company. */
  @Get('research/jobs')
  listResearchJobs() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().listResearchJobs()));
  }

  /** Returns transport orders for the active company. */
  @Get('transport/orders')
  listTransportOrders() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().listTransportOrders()));
  }

  /** Returns employees for the active company. */
  @Get('employees')
  listEmployees() {
    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().listEmployees()));
  }

  /** Returns player-visible event log entries. */
  @Get('events/log')
  getEventLog(@Query('limit') limit?: string, @Query('category') category?: string) {
    const parsedLimit = limit === undefined ? undefined : Number.parseInt(limit, 10);

    if (limit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit! < 1)) {
      throw new BadRequestException('limit must be a positive integer.');
    }

    return toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().getEventLog(parsedLimit, category)),
    );
  }

  /** Starts a new single-player browser session. */
  @Post('session/new')
  @HttpCode(200)
  async startNewGame(@Body() body: NewGameDto | undefined) {
    const result = toApiSuccess(
      unwrapResult(await this.gameSessionService.getSession().startNewGame(body?.name)),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Persists the active session to disk. */
  @Post('session/save')
  @HttpCode(200)
  async saveGame(@Body() body: SaveGameDto | undefined) {
    let filePath: string | undefined;

    if (body?.filePath !== undefined) {
      try {
        filePath = this.gameSessionService.resolveSavegamePath(body.filePath);
      } catch (error) {
        if (error instanceof SavePathRejectedError) {
          throw new BadRequestException(error.message);
        }

        throw error;
      }
    }

    const saveResult = await this.gameSessionService.getSession().saveGame(filePath);
    const result = toApiSuccess(unwrapResult(saveResult));
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Restores the active session from disk. */
  @Post('session/load')
  @HttpCode(200)
  async loadGame(@Body() body: LoadGameDto | undefined) {
    let filePath: string | undefined;

    if (body?.filePath !== undefined) {
      try {
        filePath = this.gameSessionService.resolveSavegamePath(body.filePath);
      } catch (error) {
        if (error instanceof SavePathRejectedError) {
          throw new BadRequestException(error.message);
        }

        throw error;
      }
    }

    const loadResult = await this.gameSessionService.getSession().loadGame(filePath);
    const result = toApiSuccess(unwrapResult(loadResult));
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Advances the simulation by one or more ticks. */
  @Post('simulation/tick')
  @HttpCode(200)
  tick(@Body() body: TickSimulationDto | undefined, @Req() request?: Request) {
    const count = body?.count ?? 1;

    if (!Number.isInteger(count)) {
      this.#observeAdvanceAttempt(request, {
        endpoint: 'tick',
        requestedCount: 'INVALID_UNPARSEABLE',
        admissionOutcome: 'INVALID_REQUEST',
        reservation: null,
      });
      throw new BadRequestException('Tick count must be an integer.');
    }

    const session = this.gameSessionService.getSession();
    const sessionStatus = unwrapResult(session.getSessionStatus());
    const reservation = this.acceptanceSimulationAdvanceGuard.tryReserveSimulationAdvances(
      count,
      {
        hasActiveSession: sessionStatus.hasActiveSession,
        companyName: sessionStatus.companyName,
        savePath: sessionStatus.savePath,
      },
      this.#buildAcceptanceS3ProductionPhaseGameplayContext(),
    );

    if (!reservation.ok) {
      this.#observeAdvanceAttempt(request, {
        endpoint: 'tick',
        requestedCount: count,
        admissionOutcome: 'DENIED',
        reservation,
      });
      throw new ForbiddenException(ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE);
    }

    try {
      const result = toApiSuccess(unwrapResult(session.tick(count)));
      this.#observeAdvanceAttempt(request, {
        endpoint: 'tick',
        requestedCount: count,
        admissionOutcome: 'ADMITTED',
        reservation,
        simulationCompletion: 'UNKNOWN',
      });
      this.#notifyDashboardRefresh();
      return result;
    } catch (error: unknown) {
      this.#observeAdvanceAttempt(request, {
        endpoint: 'tick',
        requestedCount: count,
        admissionOutcome: 'ADMITTED',
        reservation,
        simulationCompletion: 'ERROR',
      });
      throw error;
    }
  }

  /** Pauses simulation tick execution. */
  @Post('simulation/pause')
  @HttpCode(200)
  pauseSimulation() {
    const result = toApiSuccess(unwrapResult(this.gameSessionService.getSession().pauseSimulation()));
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Resumes simulation tick execution. */
  @Post('simulation/resume')
  @HttpCode(200)
  resumeSimulation() {
    const result = toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().resumeSimulation()),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Updates the simulation speed multiplier. */
  @Post('simulation/speed')
  @HttpCode(200)
  setSimulationSpeed(@Body() body: SetSimulationSpeedDto | undefined) {
    if (body?.tickDuration === undefined || !Number.isInteger(body.tickDuration)) {
      throw new BadRequestException('tickDuration must be an integer.');
    }

    const result = toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().setSimulationSpeed(body.tickDuration)),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Executes one simulation tick while keeping paused state unchanged. */
  @Post('simulation/step')
  @HttpCode(200)
  stepSimulation(@Req() request?: Request) {
    const session = this.gameSessionService.getSession();
    const sessionStatus = unwrapResult(session.getSessionStatus());
    const reservation = this.acceptanceSimulationAdvanceGuard.tryReserveSimulationAdvances(
      1,
      {
        hasActiveSession: sessionStatus.hasActiveSession,
        companyName: sessionStatus.companyName,
        savePath: sessionStatus.savePath,
      },
      this.#buildAcceptanceS3ProductionPhaseGameplayContext(),
    );

    if (!reservation.ok) {
      this.#observeAdvanceAttempt(request, {
        endpoint: 'step',
        requestedCount: 1,
        admissionOutcome: 'DENIED',
        reservation,
      });
      throw new ForbiddenException(ACCEPTANCE_SIMULATION_ADVANCE_DENIED_CODE);
    }

    try {
      const result = toApiSuccess(unwrapResult(session.stepSimulation()));
      this.#observeAdvanceAttempt(request, {
        endpoint: 'step',
        requestedCount: 1,
        admissionOutcome: 'ADMITTED',
        reservation,
        simulationCompletion: 'UNKNOWN',
      });
      this.#notifyDashboardRefresh();
      return result;
    } catch (error: unknown) {
      this.#observeAdvanceAttempt(request, {
        endpoint: 'step',
        requestedCount: 1,
        admissionOutcome: 'ADMITTED',
        reservation,
        simulationCompletion: 'ERROR',
      });
      throw error;
    }
  }

  /** Validates regional placement without persisting (PDM preview). */
  @Post('buildings/validate-placement')
  @HttpCode(200)
  validateBuildingPlacement(@Body() body: ValidateBuildingPlacementDto | undefined) {
    if (
      body?.buildingTypeId === undefined ||
      body.regionId === undefined ||
      body.x === undefined ||
      body.y === undefined
    ) {
      throw new BadRequestException('Missing building placement validation fields.');
    }

    return toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().validateRegionalBuildingPlacement({
          buildingTypeId: body.buildingTypeId,
          regionId: body.regionId,
          x: body.x,
          y: body.y,
        }),
      ),
    );
  }

  /** Places a building for the active company. */
  @Post('buildings/place')
  @HttpCode(200)
  async placeBuilding(@Body() body: PlaceBuildingDto | undefined) {
    if (
      body?.buildingTypeId === undefined ||
      body.name === undefined ||
      body.x === undefined ||
      body.y === undefined
    ) {
      throw new BadRequestException('Missing building placement fields.');
    }

    const session = this.gameSessionService.getSession();

    const buildingId = unwrapResult(
      session.placeBuilding({
        buildingTypeId: body.buildingTypeId,
        name: body.name,
        x: body.x,
        y: body.y,
        ...(body.regionId !== undefined ? { regionId: body.regionId } : {}),
      }),
    );

    const sessionStatus = unwrapResult(session.getSessionStatus());
    const configuredSavePath = this.gameSessionService.savePath;
    const skipPlacementSave = shouldSkipPersistenceAfterBuildingPlacement({
      ramOnlyBuildingPlacementEnv:
        process.env[PROJECT_GENESIS_ACCEPTANCE_S3_RAM_ONLY_BUILDING_PLACEMENT_ENV],
      acceptanceSaveIsolation: this.gameSessionService.acceptanceSaveIsolation,
      projectRoot: this.gameSessionService.projectRoot,
      configuredSavePath,
      sessionStatus,
      configuredSaveFileExists: existsSync(configuredSavePath),
    });

    if (!skipPlacementSave) {
      const saveResult = await session.saveGame();

      if (!saveResult.ok) {
        throw new BadRequestException(saveResult.error.message);
      }
    }

    this.#notifyDashboardRefresh();
    return toApiSuccess(buildingId);
  }

  /** Starts a production job on a building. */
  @Post('production/start')
  @HttpCode(200)
  startProduction(@Body() body: StartProductionDto | undefined) {
    if (body?.buildingId === undefined || body.recipeId === undefined) {
      throw new BadRequestException('Missing production start fields.');
    }

    const result = toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().startProduction({
          buildingId: body.buildingId,
          recipeId: body.recipeId,
        }),
      ),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Starts a research job for the active company. */
  @Post('research/start')
  @HttpCode(200)
  startResearch(@Body() body: StartResearchDto | undefined) {
    if (body?.technologyId === undefined) {
      throw new BadRequestException('Missing research start fields.');
    }

    const result = toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().startResearch({
          technologyId: body.technologyId,
        }),
      ),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Hires an employee for the active company. */
  @Post('employees/hire')
  @HttpCode(200)
  hireEmployee(@Body() body: HireEmployeeDto | undefined) {
    if (body?.employeeTypeId === undefined || body.displayName === undefined) {
      throw new BadRequestException('Missing employee hire fields.');
    }

    const result = toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().hireEmployee({
          employeeTypeId: body.employeeTypeId,
          displayName: body.displayName,
        }),
      ),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Assigns an employee to a building owned by the active company. */
  @Post('employees/assign')
  @HttpCode(200)
  assignEmployee(@Body() body: AssignEmployeeDto | undefined) {
    if (body?.employeeId === undefined || body.buildingId === undefined) {
      throw new BadRequestException('Missing employee assignment fields.');
    }

    const result = toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().assignEmployee({
          employeeId: body.employeeId,
          buildingId: body.buildingId,
        }),
      ),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Sells resources on the market for the active company. */
  @Post('market/sell')
  @HttpCode(200)
  sellResource(@Body() body: SellResourceDto | undefined) {
    if (body?.resourceId === undefined || body.amount === undefined) {
      throw new BadRequestException('Missing market sell fields.');
    }

    const result = toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().sellResource({
          resourceId: body.resourceId,
          amount: body.amount,
        }),
      ),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Buys resources on the market for the active company. */
  @Post('market/buy')
  @HttpCode(200)
  buyResource(@Body() body: SellResourceDto | undefined) {
    if (body?.resourceId === undefined || body.amount === undefined) {
      throw new BadRequestException('Missing market buy fields.');
    }

    const result = toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().buyResource({
          resourceId: body.resourceId,
          amount: body.amount,
        }),
      ),
    );
    this.#notifyDashboardRefresh();
    return result;
  }
}
