import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import { CompanyDecision } from '../../domain/brain/CompanyDecision.js';
import { createCompanyBrainId } from '../../domain/brain/CompanyBrainId.js';
import { createCompanyDecisionId } from '../../domain/brain/CompanyDecisionId.js';
import { CompanyDecisionStatus } from '../../domain/brain/CompanyDecisionStatus.js';
import { CompanyDecisionType } from '../../domain/brain/CompanyDecisionType.js';
import { PlanningLayer } from '../../domain/brain/PlanningLayer.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

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

async function createExecutionContext() {
  const bootstrapResult = await bootstrapApplication({ gameContentRoot });

  if (!bootstrapResult.ok) {
    throw new Error(bootstrapResult.error.message);
  }

  const application = bootstrapResult.value;
  const createCompany = new CreateCompanyUseCase(application);

  createCompany.execute({
    companyId: 'company_001',
    name: 'Genesis Industries',
    ownerId: 'player_001',
  });

  const companyId = requireCompanyId('company_001');
  const brainResult = CompanyBrain.create({
    id: requireCompanyBrainId('brain_company_001'),
    companyId,
    clock: application.clock,
    initialStrategyDefinitionId: 'strategy_balanced',
  });

  if (!brainResult.ok) {
    throw new Error(brainResult.error.message);
  }

  brainResult.value.pullDomainEvents();
  application.companyBrainRepository.save(brainResult.value);

  return {
    clock: application.clock,
    companyId,
    companyBrainRepository: application.companyBrainRepository,
    inventoryRepository: application.inventoryRepository,
    financeRepository: application.financeRepository,
    executionService: application.companyDecisionExecutionService,
    planningPipeline: application.companyPlanningPipeline,
  };
}

function enqueuePurchaseDecision(
  context: Awaited<ReturnType<typeof createExecutionContext>>,
  params: {
    decisionId: string;
    resourceId: string;
    quantity: number;
    priority?: number;
  },
) {
  const brain = context.companyBrainRepository.findByCompanyId(context.companyId);

  if (brain === undefined) {
    throw new Error('Brain not found');
  }

  const decision = new CompanyDecision({
    id: requireDecisionId(params.decisionId),
    type: CompanyDecisionType.PURCHASE_RESOURCE,
    status: CompanyDecisionStatus.PENDING,
    layer: PlanningLayer.TACTICAL,
    priority: params.priority ?? 100,
    createdAtTick: 10,
    payload: {
      type: 'PURCHASE_RESOURCE',
      data: {
        resourceId: params.resourceId,
        quantity: params.quantity,
        regionId: DEFAULT_REGION_ID,
      },
    },
  });

  brain.enqueueDecision(decision, context.clock);
  context.companyBrainRepository.save(brain);
  brain.pullDomainEvents();
}

describe('CompanyDecisionExecutionService', () => {
  it('executes purchase decisions through BuyResourceUseCase', async () => {
    const context = await createExecutionContext();

    enqueuePurchaseDecision(context, {
      decisionId: 'decision_purchase_001',
      resourceId: 'wood',
      quantity: 4,
    });

    const result = context.executionService.executePendingDecisions(context.companyId);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        processed: 1,
        completed: 1,
        failed: 0,
      });
    }

    const inventory = context.inventoryRepository.findByCompanyId(context.companyId);
    const wood = inventory?.getItems().find((item) => item.resourceId.value === 'wood');

    expect(wood?.quantity).toBe(4);

    const brain = context.companyBrainRepository.findByCompanyId(context.companyId);
    expect(brain?.getPendingDecisions()).toEqual([]);
    expect(brain?.getDecisions()[0]?.status).toBe(CompanyDecisionStatus.COMPLETED);
  });

  it('executes sell decisions through SellResourceUseCase', async () => {
    const context = await createExecutionContext();
    const inventory = context.inventoryRepository.findByCompanyId(context.companyId);

    inventory?.addQuantity('wood', 10, context.clock);
    context.inventoryRepository.save(inventory!);
    inventory?.pullDomainEvents();

    const brain = context.companyBrainRepository.findByCompanyId(context.companyId);

    if (brain === undefined) {
      throw new Error('Brain not found');
    }

    brain.enqueueDecision(
      new CompanyDecision({
        id: requireDecisionId('decision_sell_001'),
        type: CompanyDecisionType.SELL_RESOURCE,
        status: CompanyDecisionStatus.PENDING,
        layer: PlanningLayer.OPERATIONAL,
        priority: 80,
        createdAtTick: 10,
        payload: {
          type: 'SELL_RESOURCE',
          data: {
            resourceId: 'wood',
            quantity: 3,
            regionId: DEFAULT_REGION_ID,
          },
        },
      }),
      context.clock,
    );
    context.companyBrainRepository.save(brain);
    brain.pullDomainEvents();

    const result = context.executionService.executePendingDecisions(context.companyId);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.completed).toBe(1);
    }

    const updatedInventory = context.inventoryRepository.findByCompanyId(context.companyId);
    const wood = updatedInventory?.getItems().find((item) => item.resourceId.value === 'wood');

    expect(wood?.quantity).toBe(7);
    expect(brain.getDecisions()[0]?.status).toBe(CompanyDecisionStatus.COMPLETED);
  });

  it('marks failed decisions without aborting the remaining queue', async () => {
    const context = await createExecutionContext();
    const brain = context.companyBrainRepository.findByCompanyId(context.companyId);

    if (brain === undefined) {
      throw new Error('Brain not found');
    }

    brain.enqueueDecision(
      new CompanyDecision({
        id: requireDecisionId('decision_sell_missing_stock'),
        type: CompanyDecisionType.SELL_RESOURCE,
        status: CompanyDecisionStatus.PENDING,
        layer: PlanningLayer.TACTICAL,
        priority: 200,
        createdAtTick: 10,
        payload: {
          type: 'SELL_RESOURCE',
          data: {
            resourceId: 'wood',
            quantity: 5,
            regionId: DEFAULT_REGION_ID,
          },
        },
      }),
      context.clock,
    );

    enqueuePurchaseDecision(context, {
      decisionId: 'decision_purchase_after_failure',
      resourceId: 'wood',
      quantity: 2,
      priority: 100,
    });

    const result = context.executionService.executePendingDecisions(context.companyId);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        processed: 2,
        completed: 1,
        failed: 1,
      });
    }

    const statuses = brain.getDecisions().map((decision) => decision.status);

    expect(statuses).toContain(CompanyDecisionStatus.COMPLETED);
    expect(statuses).toContain(CompanyDecisionStatus.FAILED);
  });

  it('marks unsupported decision types as failed', async () => {
    const context = await createExecutionContext();
    const brain = context.companyBrainRepository.findByCompanyId(context.companyId);

    if (brain === undefined) {
      throw new Error('Brain not found');
    }

    brain.enqueueDecision(
      new CompanyDecision({
        id: requireDecisionId('decision_research_001'),
        type: CompanyDecisionType.START_RESEARCH,
        status: CompanyDecisionStatus.PENDING,
        layer: PlanningLayer.STRATEGIC,
        priority: 50,
        createdAtTick: 10,
        payload: {
          type: 'START_RESEARCH',
          data: {
            jobId: 'research_job_001',
            technologyId: 'tech_steel',
          },
        },
      }),
      context.clock,
    );
    context.companyBrainRepository.save(brain);
    brain.pullDomainEvents();

    const result = context.executionService.executePendingDecisions(context.companyId);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.failed).toBe(1);
    }

    expect(brain.getDecisions()[0]?.status).toBe(CompanyDecisionStatus.FAILED);
  });

  it('fails when the company brain is missing', async () => {
    const context = await createExecutionContext();
    const result = context.executionService.executePendingDecisions(
      requireCompanyId('company_missing'),
    );

    expect(result.ok).toBe(false);
  });

  it('executes planning output end-to-end', async () => {
    const context = await createExecutionContext();

    const planningResult = context.planningPipeline.run(context.companyId, 10);

    expect(planningResult.ok).toBe(true);

    if (planningResult.ok) {
      expect(planningResult.value.decisionsQueued).toBeGreaterThan(0);
    }

    const executionResult = context.executionService.executePendingDecisions(context.companyId);

    expect(executionResult.ok).toBe(true);

    if (executionResult.ok) {
      expect(executionResult.value.completed).toBeGreaterThan(0);
    }

    const brain = context.companyBrainRepository.findByCompanyId(context.companyId);
    expect(brain?.getPendingDecisions()).toEqual([]);
  });
});
