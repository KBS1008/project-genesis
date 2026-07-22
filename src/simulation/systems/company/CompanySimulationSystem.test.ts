import { ManualClock } from '../../../common/time/ManualClock.js';
import { Result } from '../../../common/result/Result.js';
import type { CompanyDecisionExecutionPort } from '../../../domain/brain/CompanyDecisionExecutionPort.js';
import { CompanyBrain } from '../../../domain/brain/CompanyBrain.js';
import { CompanyDecision } from '../../../domain/brain/CompanyDecision.js';
import { createCompanyBrainId } from '../../../domain/brain/CompanyBrainId.js';
import { createCompanyDecisionId } from '../../../domain/brain/CompanyDecisionId.js';
import { CompanyDecisionStatus } from '../../../domain/brain/CompanyDecisionStatus.js';
import { CompanyDecisionType } from '../../../domain/brain/CompanyDecisionType.js';
import { PlanningLayer } from '../../../domain/brain/PlanningLayer.js';
import { Company, createCompanyId, createPlayerId } from '../../../domain/company/Company.js';
import { DEFAULT_REGION_ID } from '../../../domain/world/WorldConstants.js';
import type { TransportLogisticsPort } from '../../../domain/transport/TransportLogisticsPort.js';
import { InMemoryCompanyBrainRepository } from '../../../infrastructure/persistence/InMemoryCompanyBrainRepository.js';
import { InMemoryCompanyRepository } from '../../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { InMemoryFinanceRepository } from '../../../infrastructure/persistence/InMemoryFinanceRepository.js';
import { InMemoryInventoryRepository } from '../../../infrastructure/persistence/InMemoryInventoryRepository.js';
import { InMemoryMarketRepository } from '../../../infrastructure/persistence/InMemoryMarketRepository.js';
import {
  CompanyDecisionExecutionService,
  type CompanyDecisionExecutionServiceDependencies,
} from '../../../application/services/CompanyDecisionExecutionService.js';
import { MarketTradeService } from '../../../application/services/MarketTradeService.js';
import { CompanySimulationSystem } from './CompanySimulationSystem.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyBrainId(value: string) {
  const result = createCompanyBrainId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireDecisionId(value: string) {
  const result = createCompanyDecisionId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requirePlayerId(value: string) {
  const result = createPlayerId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('CompanySimulationSystem', () => {
  it('executes pending brain decisions during the company simulation step', () => {
    const clock = new ManualClock(100);
    const companyRepository = new InMemoryCompanyRepository();
    const companyBrainRepository = new InMemoryCompanyBrainRepository();
    const inventoryRepository = new InMemoryInventoryRepository();
    const financeRepository = new InMemoryFinanceRepository();
    const marketRepository = new InMemoryMarketRepository();
    const companyId = requireCompanyId('company_001');

    const companyResult = Company.create({
      id: companyId,
      name: 'Genesis Corp',
      ownerId: requirePlayerId('player_001'),
      clock,
    });

    expect(companyResult.ok).toBe(true);

    if (companyResult.ok) {
      companyRepository.save(companyResult.value);
    }

    const brainResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId,
      clock,
    });

    expect(brainResult.ok).toBe(true);

    if (!brainResult.ok) {
      return;
    }

    const brain = brainResult.value;
    brain.enqueueDecision(
      new CompanyDecision({
        id: requireDecisionId('decision_purchase_001'),
        type: CompanyDecisionType.PURCHASE_RESOURCE,
        status: CompanyDecisionStatus.PENDING,
        layer: PlanningLayer.TACTICAL,
        priority: 100,
        createdAtTick: 10,
        payload: {
          type: 'PURCHASE_RESOURCE',
          data: {
            resourceId: 'wood',
            quantity: 2,
            regionId: DEFAULT_REGION_ID,
          },
        },
      }),
      clock,
    );
    brain.pullDomainEvents();
    companyBrainRepository.save(brain);

    const executionService = new CompanyDecisionExecutionService({
      companyBrainRepository,
      companyRepository,
      marketTradeService: new MarketTradeService({
        inventoryRepository,
        financeRepository,
        marketRepository,
        clock,
        enqueueEvents: () => undefined,
      }),
      clock,
    } as unknown as CompanyDecisionExecutionServiceDependencies);

    const companyDecisionExecutionPort: CompanyDecisionExecutionPort = {
      executePendingDecisions(companyIdToExecute) {
        executionService.executePendingDecisions(companyIdToExecute);
      },
    };

    const system = new CompanySimulationSystem({
      companyRepository,
      companyBrainRepository,
      companyDecisionExecutionPort,
    });

    system.execute({ tickNumber: 1, clock });

    expect(brain.getPendingDecisions()).toEqual([]);
    expect(brain.getDecisions()[0]?.status).toBe(CompanyDecisionStatus.FAILED);
  });

  it('remains a no-op when economy services are not wired', () => {
    const clock = new ManualClock(100);
    const companyRepository = new InMemoryCompanyRepository();
    const transportLogisticsService = {
      completeTransportOrder: () => Result.ok(undefined),
      dispatchPendingTransports: () => undefined,
    } as TransportLogisticsPort;

    void transportLogisticsService;

    const system = new CompanySimulationSystem({ companyRepository });

    expect(() => {
      system.execute({ tickNumber: 1, clock });
    }).not.toThrow();
  });
});
