/**
 * @module @domain/brain/CompanyBrain
 *
 * Aggregate root for autonomous company planning state.
 *
 * The company brain transforms observable simulation state into validated
 * decisions. It never mutates domain repositories directly.
 *
 * @see docs/architecture/decisions/DD-0XX_COMPANY_BRAIN_AND_DECISION_QUEUE.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId } from '../company/CompanyId.js';
import { ActiveStrategy } from './ActiveStrategy.js';
import type { CompanyBrainId } from './CompanyBrainId.js';
import type { CompanyDecision } from './CompanyDecision.js';
import { CompanyDecisionStatus } from './CompanyDecisionStatus.js';
import { DecisionQueue } from './DecisionQueue.js';
import type { Goal } from './Goal.js';
import { GoalStatus } from './GoalStatus.js';
import type { KnowledgeEntry } from './KnowledgeEntry.js';
import type { MemoryEntry } from './MemoryEntry.js';
import { DecisionQueued } from './events/DecisionQueued.js';
import { GoalCompleted } from './events/GoalCompleted.js';
import { GoalCreated } from './events/GoalCreated.js';
import { StrategyChanged } from './events/StrategyChanged.js';

/** Parameters required to create a company brain. */
export type CreateCompanyBrainParams = {
  readonly id: CompanyBrainId;
  readonly companyId: CompanyId;
  readonly clock: Clock;
  readonly initialStrategyDefinitionId?: string;
};

/** Snapshot used to restore a company brain without raising events. */
export type RestoreCompanyBrainParams = {
  readonly id: CompanyBrainId;
  readonly companyId: CompanyId;
  readonly createdAt: number;
  readonly activeStrategy?: ActiveStrategy;
  readonly goals: readonly Goal[];
  readonly knowledge: readonly KnowledgeEntry[];
  readonly memory: readonly MemoryEntry[];
  readonly decisions: readonly CompanyDecision[];
};

/**
 * Company brain aggregate root owned by exactly one company.
 */
export class CompanyBrain extends AggregateRoot<'CompanyBrain'> {
  readonly #companyId: CompanyId;
  readonly #createdAt: number;
  #activeStrategy?: ActiveStrategy;
  readonly #goals = new Map<string, Goal>();
  readonly #knowledge = new Map<string, KnowledgeEntry>();
  readonly #memory = new Map<string, MemoryEntry>();
  readonly #decisionQueue: DecisionQueue;

  private constructor(
    params: {
      id: CompanyBrainId;
      companyId: CompanyId;
      createdAt: number;
      activeStrategy?: ActiveStrategy;
      goals: readonly Goal[];
      knowledge: readonly KnowledgeEntry[];
      memory: readonly MemoryEntry[];
      decisionQueue: DecisionQueue;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#createdAt = params.createdAt;
    this.#decisionQueue = params.decisionQueue;

    if (params.activeStrategy !== undefined) {
      this.#activeStrategy = params.activeStrategy;
    }

    for (const goal of params.goals) {
      this.#goals.set(goal.id.value, goal);
    }

    for (const entry of params.knowledge) {
      this.#knowledge.set(entry.id.value, entry);
    }

    for (const entry of params.memory) {
      this.#memory.set(entry.id.value, entry);
    }

    void restoring;
  }

  /** Creates an empty company brain for a company. */
  static create(params: CreateCompanyBrainParams): Result<CompanyBrain, ValidationError> {
    const createdAt = params.clock.now();
    let activeStrategy: ActiveStrategy | undefined;

    if (params.initialStrategyDefinitionId !== undefined) {
      activeStrategy = new ActiveStrategy({
        strategyDefinitionId: params.initialStrategyDefinitionId,
        appliedAtTick: createdAt,
      });
    }

    const brain = new CompanyBrain({
      id: params.id,
      companyId: params.companyId,
      createdAt,
      ...(activeStrategy !== undefined ? { activeStrategy } : {}),
      goals: [],
      knowledge: [],
      memory: [],
      decisionQueue: DecisionQueue.empty(),
    });

    if (activeStrategy !== undefined) {
      brain.addDomainEvent(
        new StrategyChanged(
          createdAt,
          params.id.value,
          params.companyId.value,
          activeStrategy.strategyDefinitionId,
        ),
      );
    }

    return Result.ok(brain);
  }

  /** Rehydrates a company brain from a persisted snapshot without raising events. */
  static restore(params: RestoreCompanyBrainParams): Result<CompanyBrain, ValidationError> {
    const queueResult = DecisionQueue.fromDecisions(params.decisions);

    if (!queueResult.ok) {
      return Result.fail(queueResult.error);
    }

    const goalIds = new Set<string>();

    for (const goal of params.goals) {
      if (goalIds.has(goal.id.value)) {
        return Result.fail(new ValidationError(`Duplicate goal id "${goal.id.value}".`));
      }

      goalIds.add(goal.id.value);

      const priorityResult = Guard.againstNegative(
        goal.priority,
        'Goal priority must not be negative.',
      );

      if (!priorityResult.ok) {
        return Result.fail(priorityResult.error);
      }
    }

    const knowledgeIds = new Set<string>();

    for (const entry of params.knowledge) {
      if (knowledgeIds.has(entry.id.value)) {
        return Result.fail(new ValidationError(`Duplicate knowledge id "${entry.id.value}".`));
      }

      knowledgeIds.add(entry.id.value);
    }

    const memoryIds = new Set<string>();

    for (const entry of params.memory) {
      if (memoryIds.has(entry.id.value)) {
        return Result.fail(new ValidationError(`Duplicate memory id "${entry.id.value}".`));
      }

      memoryIds.add(entry.id.value);
    }

    return Result.ok(
      new CompanyBrain(
        {
          id: params.id,
          companyId: params.companyId,
          createdAt: params.createdAt,
          ...(params.activeStrategy !== undefined ? { activeStrategy: params.activeStrategy } : {}),
          goals: params.goals,
          knowledge: params.knowledge,
          memory: params.memory,
          decisionQueue: queueResult.value,
        },
        true,
      ),
    );
  }

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** Simulation time when the brain was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** Returns the active strategy, if one has been assigned. */
  getActiveStrategy(): ActiveStrategy | undefined {
    return this.#activeStrategy;
  }

  /** Returns all goals in deterministic id order. */
  getGoals(): readonly Goal[] {
    return Object.freeze(
      [...this.#goals.values()].sort((left, right) => left.id.value.localeCompare(right.id.value)),
    );
  }

  /** Returns active goals sorted by priority descending, then id. */
  getActiveGoals(): readonly Goal[] {
    return Object.freeze(
      this.getGoals()
        .filter((goal) => goal.status === GoalStatus.ACTIVE)
        .sort((left, right) => {
          if (left.priority !== right.priority) {
            return right.priority - left.priority;
          }

          return left.id.value.localeCompare(right.id.value);
        }),
    );
  }

  /** Returns all knowledge entries in deterministic id order. */
  getKnowledge(): readonly KnowledgeEntry[] {
    return Object.freeze(
      [...this.#knowledge.values()].sort((left, right) =>
        left.id.value.localeCompare(right.id.value),
      ),
    );
  }

  /** Returns knowledge entries matching a deterministic lookup key. */
  findKnowledgeByKey(key: string): KnowledgeEntry | undefined {
    return this.getKnowledge().find((entry) => entry.key === key);
  }

  /** Returns all memory entries in deterministic id order. */
  getMemory(): readonly MemoryEntry[] {
    return Object.freeze(
      [...this.#memory.values()].sort((left, right) => left.id.value.localeCompare(right.id.value)),
    );
  }

  /** Returns pending decisions in deterministic execution order. */
  getPendingDecisions(): readonly CompanyDecision[] {
    return this.#decisionQueue.getPendingDecisions();
  }

  /** Returns all queued decisions in deterministic execution order. */
  getDecisions(): readonly CompanyDecision[] {
    return this.#decisionQueue.snapshot();
  }

  /** Changes the active strategy for the company brain. */
  setActiveStrategy(
    strategyDefinitionId: string,
    clock: Clock,
  ): Result<void, ValidationError> {
    const trimmedResult = Guard.againstEmptyString(
      strategyDefinitionId,
      'Strategy definition id must not be empty.',
    );

    if (!trimmedResult.ok) {
      return Result.fail(trimmedResult.error);
    }

    const appliedAtTick = clock.now();
    this.#activeStrategy = new ActiveStrategy({
      strategyDefinitionId: trimmedResult.value,
      appliedAtTick,
    });

    this.addDomainEvent(
      new StrategyChanged(
        appliedAtTick,
        this.getId().value,
        this.#companyId.value,
        trimmedResult.value,
      ),
    );

    return Result.ok(undefined);
  }

  /** Adds a goal to the company brain. */
  addGoal(goal: Goal, clock: Clock): Result<void, ValidationError> {
    if (this.#goals.has(goal.id.value)) {
      return Result.fail(new ValidationError(`Goal "${goal.id.value}" already exists.`));
    }

    const priorityResult = Guard.againstNegative(goal.priority, 'Goal priority must not be negative.');

    if (!priorityResult.ok) {
      return Result.fail(priorityResult.error);
    }

    this.#goals.set(goal.id.value, goal);
    this.addDomainEvent(
      new GoalCreated(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        goal.id.value,
        goal.kind,
      ),
    );

    return Result.ok(undefined);
  }

  /** Marks a goal as completed. */
  completeGoal(goalId: string, clock: Clock): Result<void, ValidationError> {
    const goal = this.#goals.get(goalId);

    if (goal === undefined) {
      return Result.fail(new ValidationError(`Goal "${goalId}" was not found.`));
    }

    if (goal.status === GoalStatus.COMPLETED) {
      return Result.ok(undefined);
    }

    this.#goals.set(goalId, goal.withStatus(GoalStatus.COMPLETED));
    this.addDomainEvent(
      new GoalCompleted(clock.now(), this.getId().value, this.#companyId.value, goalId),
    );

    return Result.ok(undefined);
  }

  /** Marks a goal as cancelled. */
  cancelGoal(goalId: string): Result<void, ValidationError> {
    const goal = this.#goals.get(goalId);

    if (goal === undefined) {
      return Result.fail(new ValidationError(`Goal "${goalId}" was not found.`));
    }

    if (goal.status === GoalStatus.CANCELLED) {
      return Result.ok(undefined);
    }

    this.#goals.set(goalId, goal.withStatus(GoalStatus.CANCELLED));
    return Result.ok(undefined);
  }

  /** Records or replaces a knowledge entry keyed by entry id. */
  recordKnowledge(entry: KnowledgeEntry): Result<void, ValidationError> {
    this.#knowledge.set(entry.id.value, entry);
    return Result.ok(undefined);
  }

  /** Records or replaces a memory entry keyed by entry id. */
  recordMemory(entry: MemoryEntry): Result<void, ValidationError> {
    this.#memory.set(entry.id.value, entry);
    return Result.ok(undefined);
  }

  /** Removes expired memory entries using deterministic tick comparison. */
  pruneExpiredMemory(currentTick: number): readonly string[] {
    const removedIds: string[] = [];

    for (const entry of this.getMemory()) {
      if (entry.isExpiredAt(currentTick)) {
        this.#memory.delete(entry.id.value);
        removedIds.push(entry.id.value);
      }
    }

    return Object.freeze(removedIds.sort((left, right) => left.localeCompare(right)));
  }

  /** Queues a validated decision for later execution. */
  enqueueDecision(decision: CompanyDecision, clock: Clock): Result<void, ValidationError> {
    if (decision.status !== CompanyDecisionStatus.PENDING) {
      return Result.fail(
        new ValidationError(
          `Only pending decisions may be enqueued. Received status "${decision.status}".`,
        ),
      );
    }

    const upsertResult = this.#decisionQueue.upsert(decision);

    if (!upsertResult.ok) {
      return upsertResult;
    }

    this.addDomainEvent(
      new DecisionQueued(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        decision.id.value,
        decision.type,
      ),
    );

    return Result.ok(undefined);
  }

  /** Returns the next pending decision without changing queue state. */
  peekNextPendingDecision(): CompanyDecision | undefined {
    return this.#decisionQueue.peekNextPending();
  }

  /** Updates the status of a queued decision. */
  updateDecisionStatus(
    decisionId: string,
    status: CompanyDecisionStatus,
  ): Result<void, ValidationError> {
    const decision = this.#decisionQueue.findById(decisionId);

    if (decision === undefined) {
      return Result.fail(new ValidationError(`Decision "${decisionId}" was not found.`));
    }

    if (decision.status === status) {
      return Result.ok(undefined);
    }

    return this.#decisionQueue.update(decision.withStatus(status));
  }
}
