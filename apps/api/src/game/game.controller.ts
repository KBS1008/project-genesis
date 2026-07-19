/**
 * @module @project-genesis/api/game/game.controller
 *
 * REST endpoints mirroring the browser dev shell contract.
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { toApiSuccess } from '../common/api-response.js';
import { unwrapResult } from '../common/unwrap-result.js';
import type { NewGameDto } from './dto/new-game.dto.js';
import type { PlaceBuildingDto } from './dto/place-building.dto.js';
import type { SellResourceDto } from './dto/sell-resource.dto.js';
import type { TickSimulationDto } from './dto/tick-simulation.dto.js';
import type { StartProductionDto } from './dto/start-production.dto.js';
import type { StartResearchDto } from './dto/start-research.dto.js';
import type { HireEmployeeDto } from './dto/hire-employee.dto.js';
import type { AssignEmployeeDto } from './dto/assign-employee.dto.js';
import { DashboardBroadcastService } from '../dashboard/dashboard-broadcast.service.js';
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
  ) {}

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

  /** Starts a new single-player browser session. */
  @Post('session/new')
  @HttpCode(200)
  startNewGame(@Body() body: NewGameDto | undefined) {
    const result = toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().startNewGame(body?.name)),
    );
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Persists the active session to disk. */
  @Post('session/save')
  @HttpCode(200)
  async saveGame() {
    const saveResult = await this.gameSessionService.getSession().saveGame();
    const result = toApiSuccess(unwrapResult(saveResult));
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Restores the active session from disk. */
  @Post('session/load')
  @HttpCode(200)
  async loadGame() {
    const loadResult = await this.gameSessionService.getSession().loadGame();
    const result = toApiSuccess(unwrapResult(loadResult));
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Advances the simulation by one or more ticks. */
  @Post('simulation/tick')
  @HttpCode(200)
  tick(@Body() body: TickSimulationDto | undefined) {
    const count = body?.count ?? 1;

    if (!Number.isInteger(count)) {
      throw new BadRequestException('Tick count must be an integer.');
    }

    const result = toApiSuccess(unwrapResult(this.gameSessionService.getSession().tick(count)));
    this.#notifyDashboardRefresh();
    return result;
  }

  /** Places a building for the active company. */
  @Post('buildings/place')
  @HttpCode(200)
  placeBuilding(@Body() body: PlaceBuildingDto | undefined) {
    if (
      body?.buildingTypeId === undefined ||
      body.name === undefined ||
      body.x === undefined ||
      body.y === undefined
    ) {
      throw new BadRequestException('Missing building placement fields.');
    }

    const result = toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().placeBuilding({
          buildingTypeId: body.buildingTypeId,
          name: body.name,
          x: body.x,
          y: body.y,
        }),
      ),
    );
    this.#notifyDashboardRefresh();
    return result;
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
