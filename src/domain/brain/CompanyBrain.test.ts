import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import { CompanyBrain } from './CompanyBrain.js';
import { createCompanyBrainId } from './CompanyBrainId.js';
import { CompanyDecision } from './CompanyDecision.js';
import { createCompanyDecisionId } from './CompanyDecisionId.js';
import { CompanyDecisionStatus } from './CompanyDecisionStatus.js';
import { CompanyDecisionType } from './CompanyDecisionType.js';
import { DecisionQueue, compareDecisionsForExecution } from './DecisionQueue.js';
import { Goal } from './Goal.js';
import { GoalKind } from './GoalKind.js';
import { GoalStatus } from './GoalStatus.js';
import { createGoalId } from './GoalId.js';
import { KnowledgeEntry } from './KnowledgeEntry.js';
import { KnowledgeKind } from './KnowledgeKind.js';
import { createKnowledgeEntryId } from './KnowledgeEntryId.js';
import { knowledgeNumber } from './KnowledgeValue.js';
import { MemoryEntry } from './MemoryEntry.js';
import { MemoryKind } from './MemoryKind.js';
import { createMemoryEntryId } from './MemoryEntryId.js';
import { createMemoryPayload } from './MemoryPayload.js';
import { PlanningLayer } from './PlanningLayer.js';
import { DecisionQueued } from './events/DecisionQueued.js';
import { GoalCreated } from './events/GoalCreated.js';
import { StrategyChanged } from './events/StrategyChanged.js';

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

function requireGoalId(value: string) {
  const result = createGoalId(value);

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

function requireKnowledgeEntryId(value: string) {
  const result = createKnowledgeEntryId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireMemoryEntryId(value: string) {
  const result = createMemoryEntryId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('CompanyBrain', () => {
  it('creates empty brain state for a company', () => {
    const clock = new ManualClock(100);
    const result = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getGoals()).toEqual([]);
      expect(result.value.getKnowledge()).toEqual([]);
      expect(result.value.getMemory()).toEqual([]);
      expect(result.value.getPendingDecisions()).toEqual([]);
      expect(result.value.getCreatedAt()).toBe(100);
      expect(result.value.getActiveStrategy()).toBeUndefined();
    }
  });

  it('assigns an initial strategy and emits StrategyChanged', () => {
    const clock = new ManualClock(100);
    const result = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
      initialStrategyDefinitionId: 'strategy_balanced',
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const events = result.value.pullDomainEvents();

    expect(result.value.getActiveStrategy()?.strategyDefinitionId).toBe('strategy_balanced');
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(StrategyChanged);
  });

  it('adds goals and emits GoalCreated', () => {
    const clock = new ManualClock(100);
    const brainResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(brainResult.ok).toBe(true);

    if (!brainResult.ok) {
      return;
    }

    const brain = brainResult.value;
    const goal = new Goal({
      id: requireGoalId('goal_001'),
      kind: GoalKind.SECURE_SUPPLY,
      description: 'Secure coal supply',
      priority: 10,
      status: GoalStatus.ACTIVE,
      createdAtTick: 100,
      resourceId: 'coal',
    });

    const addResult = brain.addGoal(goal, clock);

    expect(addResult.ok).toBe(true);
    expect(brain.getActiveGoals()).toHaveLength(1);
    expect(brain.pullDomainEvents()[0]).toBeInstanceOf(GoalCreated);
  });

  it('completes goals and emits GoalCompleted once', () => {
    const clock = new ManualClock(100);
    const brainResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(brainResult.ok).toBe(true);

    if (!brainResult.ok) {
      return;
    }

    const brain = brainResult.value;
    const goal = new Goal({
      id: requireGoalId('goal_001'),
      kind: GoalKind.SECURE_SUPPLY,
      description: 'Secure coal supply',
      priority: 10,
      status: GoalStatus.ACTIVE,
      createdAtTick: 100,
    });

    brain.addGoal(goal, clock);
    brain.pullDomainEvents();

    const completeResult = brain.completeGoal('goal_001', clock);

    expect(completeResult.ok).toBe(true);

    const completeAgainResult = brain.completeGoal('goal_001', clock);

    expect(completeAgainResult.ok).toBe(true);
    expect(brain.pullDomainEvents()).toHaveLength(1);
    expect(brain.getActiveGoals()).toHaveLength(0);
  });

  it('records knowledge and memory entries', () => {
    const clock = new ManualClock(100);
    const brainResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(brainResult.ok).toBe(true);

    if (!brainResult.ok) {
      return;
    }

    const brain = brainResult.value;
    const knowledge = new KnowledgeEntry({
      id: requireKnowledgeEntryId('knowledge_001'),
      kind: KnowledgeKind.MARKET_PRICE,
      key: 'market_price:coal:region_001',
      observedAtTick: 100,
      value: knowledgeNumber(42),
      regionId: 'region_001',
      resourceId: 'coal',
    });

    const memory = new MemoryEntry({
      id: requireMemoryEntryId('memory_001'),
      kind: MemoryKind.HISTORICAL_PRICE,
      observedAtTick: 100,
      expiresAtTick: 200,
      payload: createMemoryPayload({ price: 42 }),
      regionId: 'region_001',
      resourceId: 'coal',
    });

    expect(brain.recordKnowledge(knowledge).ok).toBe(true);
    expect(brain.recordMemory(memory).ok).toBe(true);
    expect(brain.findKnowledgeByKey('market_price:coal:region_001')).toEqual(knowledge);
    expect(brain.pruneExpiredMemory(150)).toEqual([]);
    expect(brain.pruneExpiredMemory(200)).toEqual(['memory_001']);
  });

  it('queues decisions in deterministic priority order', () => {
    const clock = new ManualClock(100);
    const brainResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(brainResult.ok).toBe(true);

    if (!brainResult.ok) {
      return;
    }

    const brain = brainResult.value;

    const lowPriorityDecision = new CompanyDecision({
      id: requireDecisionId('decision_low'),
      type: CompanyDecisionType.PURCHASE_RESOURCE,
      status: CompanyDecisionStatus.PENDING,
      layer: PlanningLayer.TACTICAL,
      priority: 1,
      createdAtTick: 100,
      payload: {
        type: 'PURCHASE_RESOURCE',
        data: { resourceId: 'coal', quantity: 10, regionId: 'region_001' },
      },
    });

    const highPriorityDecision = new CompanyDecision({
      id: requireDecisionId('decision_high'),
      type: CompanyDecisionType.SELL_RESOURCE,
      status: CompanyDecisionStatus.PENDING,
      layer: PlanningLayer.OPERATIONAL,
      priority: 50,
      createdAtTick: 101,
      payload: {
        type: 'SELL_RESOURCE',
        data: { resourceId: 'steel', quantity: 5, regionId: 'region_001' },
      },
    });

    brain.enqueueDecision(lowPriorityDecision, clock);
    brain.pullDomainEvents();
    brain.enqueueDecision(highPriorityDecision, clock);

    expect(brain.getPendingDecisions()[0]?.id.value).toBe('decision_high');
    expect(brain.peekNextPendingDecision()?.id.value).toBe('decision_high');
    expect(brain.pullDomainEvents()[0]).toBeInstanceOf(DecisionQueued);
  });

  it('restores from snapshot without raising events', () => {
    const goal = new Goal({
      id: requireGoalId('goal_001'),
      kind: GoalKind.INCREASE_PRODUCTION,
      description: 'Increase steel output',
      priority: 5,
      status: GoalStatus.ACTIVE,
      createdAtTick: 100,
    });

    const decision = new CompanyDecision({
      id: requireDecisionId('decision_001'),
      type: CompanyDecisionType.START_PRODUCTION,
      status: CompanyDecisionStatus.PENDING,
      layer: PlanningLayer.OPERATIONAL,
      priority: 10,
      createdAtTick: 100,
      payload: {
        type: 'START_PRODUCTION',
        data: { jobId: 'production_job_001', buildingId: 'building_001', recipeId: 'recipe_steel', batches: 1 },
      },
    });

    const restoreResult = CompanyBrain.restore({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      createdAt: 100,
      goals: [goal],
      knowledge: [],
      memory: [],
      decisions: [decision],
    });

    expect(restoreResult.ok).toBe(true);

    if (!restoreResult.ok) {
      return;
    }

    expect(restoreResult.value.pullDomainEvents()).toHaveLength(0);
    expect(restoreResult.value.getGoals()).toHaveLength(1);
    expect(restoreResult.value.getPendingDecisions()).toHaveLength(1);
  });
});

describe('DecisionQueue', () => {
  it('orders decisions by priority, tick, and id', () => {
    const decisionA = new CompanyDecision({
      id: requireDecisionId('decision_a'),
      type: CompanyDecisionType.PURCHASE_RESOURCE,
      status: CompanyDecisionStatus.PENDING,
      layer: PlanningLayer.TACTICAL,
      priority: 10,
      createdAtTick: 100,
      payload: {
        type: 'PURCHASE_RESOURCE',
        data: { resourceId: 'coal', quantity: 1, regionId: 'region_001' },
      },
    });

    const decisionB = new CompanyDecision({
      id: requireDecisionId('decision_b'),
      type: CompanyDecisionType.PURCHASE_RESOURCE,
      status: CompanyDecisionStatus.PENDING,
      layer: PlanningLayer.TACTICAL,
      priority: 10,
      createdAtTick: 100,
      payload: {
        type: 'PURCHASE_RESOURCE',
        data: { resourceId: 'iron', quantity: 1, regionId: 'region_001' },
      },
    });

    expect(compareDecisionsForExecution(decisionA, decisionB)).toBeLessThan(0);

    const queueResult = DecisionQueue.fromDecisions([decisionB, decisionA]);

    expect(queueResult.ok).toBe(true);

    if (queueResult.ok) {
      expect(queueResult.value.getPendingDecisions()[0]?.id.value).toBe('decision_a');
    }
  });
});
