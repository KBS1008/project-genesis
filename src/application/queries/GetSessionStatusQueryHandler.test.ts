import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryFinanceRepository } from '../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryCompanyResearchRepository } from '../../infrastructure/persistence/InMemoryCompanyResearchRepository.js';
import { InMemoryCompanyMilestonesRepository } from '../../infrastructure/persistence/InMemoryCompanyMilestonesRepository.js';
import { SimulationState } from '../../simulation/state/SimulationState.js';
import { describe, expect, it } from 'vitest';
import { GetSessionStatusQueryHandler } from './GetSessionStatusQueryHandler.js';
import { GetSimulationStatusQueryHandler } from './GetSimulationStatusQueryHandler.js';
import { GetEventLogQueryHandler } from './GetEventLogQueryHandler.js';

function createCompanyContext() {
  const clock = new ManualClock(250);
  const companyRepository = new InMemoryCompanyRepository();
  const createCompany = new CreateCompanyUseCase({
    clock,
    companyRepository,
    inventoryRepository: new InMemoryInventoryRepository(),
    financeRepository: new InMemoryFinanceRepository(),
    companyResearchRepository: new InMemoryCompanyResearchRepository(),
    companyMilestonesRepository: new InMemoryCompanyMilestonesRepository(),
    simulationEngine: new SimulationEngine({ clock, eventBus: new InMemoryEventBus() }),
  });

  createCompany.execute({
    companyId: 'company_001',
    name: 'Genesis Industries',
    ownerId: 'player_001',
  });

  return { clock, companyRepository };
}

describe('GetSessionStatusQueryHandler', () => {
  it('returns an inactive session when no company exists', () => {
    const handler = new GetSessionStatusQueryHandler({
      companyRepository: new InMemoryCompanyRepository(),
    });

    const result = handler.execute({ savePath: 'saves/browser-session.json' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.hasActiveSession).toBe(false);
      expect(result.value.companyId).toBeNull();
    }
  });

  it('returns active company metadata when a session exists', () => {
    const { companyRepository } = createCompanyContext();
    const handler = new GetSessionStatusQueryHandler({ companyRepository });
    const result = handler.execute({ savePath: 'saves/browser-session.json' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toMatchObject({
        hasActiveSession: true,
        companyId: 'company_001',
        companyName: 'Genesis Industries',
        playerId: 'player_001',
      });
    }
  });
});

describe('GetSimulationStatusQueryHandler', () => {
  it('returns paused state and tick duration from the simulation engine', () => {
    const clock = new ManualClock(500);
    const simulationEngine = new SimulationEngine({
      clock,
      eventBus: new InMemoryEventBus(),
      tickDuration: 2,
      initialState: new SimulationState(7, true),
    });
    const handler = new GetSimulationStatusQueryHandler({ clock, simulationEngine });
    const result = handler.execute({ hasActiveSession: true });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        tickNumber: 7,
        simulationTime: 500,
        isPaused: true,
        tickDuration: 2,
        hasActiveSession: true,
      });
    }
  });
});

describe('GetEventLogQueryHandler', () => {
  it('returns an empty immutable event list until persistence exists', () => {
    const handler = new GetEventLogQueryHandler();
    const result = handler.execute({ limit: 20 });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual([]);
    }
  });
});
