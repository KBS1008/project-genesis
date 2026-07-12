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
} from '@nestjs/common';
import { toApiSuccess } from '../common/api-response.js';
import { unwrapResult } from '../common/unwrap-result.js';
import type { NewGameDto } from './dto/new-game.dto.js';
import type { PlaceBuildingDto } from './dto/place-building.dto.js';
import type { SellResourceDto } from './dto/sell-resource.dto.js';
import type { TickSimulationDto } from './dto/tick-simulation.dto.js';
import type { StartProductionDto } from './dto/start-production.dto.js';
import type { StartResearchDto } from './dto/start-research.dto.js';
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
  ) {}

  /** Returns the aggregated dashboard snapshot. */
  @Get('dashboard')
  getDashboard() {
    return toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().getDashboard()),
    );
  }

  /** Starts a new single-player browser session. */
  @Post('session/new')
  @HttpCode(200)
  startNewGame(@Body() body: NewGameDto | undefined) {
    return toApiSuccess(
      unwrapResult(this.gameSessionService.getSession().startNewGame(body?.name)),
    );
  }

  /** Persists the active session to disk. */
  @Post('session/save')
  @HttpCode(200)
  async saveGame() {
    const saveResult = await this.gameSessionService.getSession().saveGame();
    return toApiSuccess(unwrapResult(saveResult));
  }

  /** Restores the active session from disk. */
  @Post('session/load')
  @HttpCode(200)
  async loadGame() {
    const loadResult = await this.gameSessionService.getSession().loadGame();
    return toApiSuccess(unwrapResult(loadResult));
  }

  /** Advances the simulation by one or more ticks. */
  @Post('simulation/tick')
  @HttpCode(200)
  tick(@Body() body: TickSimulationDto | undefined) {
    const count = body?.count ?? 1;

    if (!Number.isInteger(count)) {
      throw new BadRequestException('Tick count must be an integer.');
    }

    return toApiSuccess(unwrapResult(this.gameSessionService.getSession().tick(count)));
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

    return toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().placeBuilding({
          buildingTypeId: body.buildingTypeId,
          name: body.name,
          x: body.x,
          y: body.y,
        }),
      ),
    );
  }

  /** Starts a production job on a building. */
  @Post('production/start')
  @HttpCode(200)
  startProduction(@Body() body: StartProductionDto | undefined) {
    if (body?.buildingId === undefined || body.recipeId === undefined) {
      throw new BadRequestException('Missing production start fields.');
    }

    return toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().startProduction({
          buildingId: body.buildingId,
          recipeId: body.recipeId,
        }),
      ),
    );
  }

  /** Starts a research job for the active company. */
  @Post('research/start')
  @HttpCode(200)
  startResearch(@Body() body: StartResearchDto | undefined) {
    if (body?.technologyId === undefined) {
      throw new BadRequestException('Missing research start fields.');
    }

    return toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().startResearch({
          technologyId: body.technologyId,
        }),
      ),
    );
  }

  /** Sells resources on the market for the active company. */
  @Post('market/sell')
  @HttpCode(200)
  sellResource(@Body() body: SellResourceDto | undefined) {
    if (body?.resourceId === undefined || body.amount === undefined) {
      throw new BadRequestException('Missing market sell fields.');
    }

    return toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().sellResource({
          resourceId: body.resourceId,
          amount: body.amount,
        }),
      ),
    );
  }

  /** Buys resources on the market for the active company. */
  @Post('market/buy')
  @HttpCode(200)
  buyResource(@Body() body: SellResourceDto | undefined) {
    if (body?.resourceId === undefined || body.amount === undefined) {
      throw new BadRequestException('Missing market buy fields.');
    }

    return toApiSuccess(
      unwrapResult(
        this.gameSessionService.getSession().buyResource({
          resourceId: body.resourceId,
          amount: body.amount,
        }),
      ),
    );
  }
}
