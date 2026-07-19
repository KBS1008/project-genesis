/**
 * @module @application/services/ResearchCompletionService.test
 *
 * Unit tests for {@link ResearchCompletionService}.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId, Company, createPlayerId } from '../../domain/company/Company.js';
import type { TechnologyCompleted } from '../../domain/research/events/TechnologyCompleted.js';
import { ResearchJob, createResearchJobId } from '../../domain/research/ResearchJob.js';
import { createTechnologyId } from '../../domain/research/TechnologyId.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { ResearchCompletionService } from './ResearchCompletionService.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireResearchJobId(value: string) {
  const result = createResearchJobId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireTechnologyId(value: string) {
  const result = createTechnologyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createFinishedResearchJob(
  clock: ManualClock,
  params: {
    readonly jobId: string;
    readonly companyId: string;
    readonly technologyId: string;
    readonly duration?: number;
  },
): ResearchJob {
  const jobResult = ResearchJob.create({
    id: requireResearchJobId(params.jobId),
    companyId: requireCompanyId(params.companyId),
    technologyId: requireTechnologyId(params.technologyId),
    duration: params.duration ?? 60,
    cost: 1000,
    clock,
  });

  if (!jobResult.ok) {
    throw new Error(jobResult.error.message);
  }

  const job = jobResult.value;
  const startResult = job.start(clock);

  if (!startResult.ok) {
    throw new Error(startResult.error.message);
  }

  job.pullDomainEvents();
  clock.advance(params.duration ?? 60);

  const tickResult = job.tick(clock);

  if (!tickResult.ok) {
    throw new Error(tickResult.error.message);
  }

  job.pullDomainEvents();
  return job;
}

async function createServiceContext() {
  const bootstrapResult = await bootstrapApplication({ gameContentRoot });

  if (!bootstrapResult.ok) {
    throw new Error(bootstrapResult.error.message);
  }

  const context = bootstrapResult.value;
  const researchCompletionService = new ResearchCompletionService(context);

  return {
    context,
    researchCompletionService,
    createCompany: new CreateCompanyUseCase(context),
  };
}

describe('ResearchCompletionService', () => {
  it('completes the technology associated with a finished research job', async () => {
    const { context, researchCompletionService, createCompany } = await createServiceContext();
    const technologyCompleted: string[] = [];

    context.eventBus.subscribe('TechnologyCompleted', (event) => {
      technologyCompleted.push((event as TechnologyCompleted).technologyId);
    });

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const job = createFinishedResearchJob(context.clock, {
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    const result = researchCompletionService.completeJob(job);

    expect(result.ok).toBe(true);

    const research = context.companyResearchRepository.findByCompanyId(
      requireCompanyId('company_001'),
    );

    expect(research?.hasCompletedTechnology('basic_woodworking')).toBe(true);

    context.simulationEngine.tick();
    expect(technologyCompleted).toEqual(['basic_woodworking']);
  });

  it('fails when the research job references an unknown company', async () => {
    const { context, researchCompletionService } = await createServiceContext();

    const job = createFinishedResearchJob(context.clock, {
      jobId: 'research_job_001',
      companyId: 'company_missing',
      technologyId: 'basic_woodworking',
    });

    const result = researchCompletionService.completeJob(job);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toContain('company_missing');
    }
  });

  it('fails when the research job references an unknown technology', async () => {
    const { context, researchCompletionService, createCompany } = await createServiceContext();

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const job = createFinishedResearchJob(context.clock, {
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'unknown_technology',
    });

    const result = researchCompletionService.completeJob(job);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toContain('unknown_technology');
    }
  });

  it('fails when the company research module was not found', async () => {
    const { context, researchCompletionService } = await createServiceContext();

    createCompanyWithoutResearchModule(context);

    const job = createFinishedResearchJob(context.clock, {
      jobId: 'research_job_001',
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    const result = researchCompletionService.completeJob(job);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toContain('Research module for company "company_001"');
    }
  });
});

function createCompanyWithoutResearchModule(
  context: Awaited<ReturnType<typeof createServiceContext>>['context'],
): void {
  const companyId = requireCompanyId('company_001');
  const ownerIdResult = createPlayerId('player_001');

  if (!ownerIdResult.ok) {
    throw new Error(ownerIdResult.error.message);
  }

  const companyResult = Company.create({
    id: companyId,
    name: 'Genesis Industries',
    ownerId: ownerIdResult.value,
    clock: context.clock,
  });

  if (!companyResult.ok) {
    throw new Error(companyResult.error.message);
  }

  context.companyRepository.save(companyResult.value);
}
