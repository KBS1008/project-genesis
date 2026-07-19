import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { ResearchJob, createResearchJobId } from '../../domain/research/ResearchJob.js';
import { ResearchJobStatus } from '../../domain/research/ResearchJobStatus.js';
import { createTechnologyId } from '../../domain/research/TechnologyId.js';
import { InMemoryResearchJobRepository } from './InMemoryResearchJobRepository.js';

function requireResearchJobId(value: string) {
  const result = createResearchJobId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createJob(id: string, companyId: string, clock = new ManualClock(100)): ResearchJob {
  const result = ResearchJob.create({
    id: requireResearchJobId(id),
    companyId: requireCompanyId(companyId),
    technologyId: requireTechnologyId('basic_woodworking'),
    duration: 60,
    cost: 1000,
    clock,
  });

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

describe('InMemoryResearchJobRepository', () => {
  it('saves and retrieves research jobs by id', () => {
    const repository = new InMemoryResearchJobRepository();
    const job = createJob('research_job_001', 'company_001');

    repository.save(job);

    expect(repository.findById(requireResearchJobId('research_job_001'))).toBe(job);
  });

  it('returns undefined when a research job id was not found', () => {
    const repository = new InMemoryResearchJobRepository();

    expect(repository.findById(requireResearchJobId('research_job_missing'))).toBeUndefined();
  });

  it('returns running jobs in deterministic id order', () => {
    const repository = new InMemoryResearchJobRepository();
    const clock = new ManualClock(100);
    const waiting = createJob('research_job_003', 'company_001', clock);
    const secondRunning = createJob('research_job_002', 'company_001', clock);
    const firstRunning = createJob('research_job_001', 'company_001', clock);

    secondRunning.start(clock);
    firstRunning.start(clock);

    repository.save(waiting);
    repository.save(secondRunning);
    repository.save(firstRunning);

    expect(repository.findRunning().map((job) => job.getId().value)).toEqual([
      'research_job_001',
      'research_job_002',
    ]);
    expect(repository.findRunning()[0]?.getStatus()).toBe(ResearchJobStatus.RUNNING);
  });

  it('returns all jobs in deterministic id order', () => {
    const repository = new InMemoryResearchJobRepository();
    const clock = new ManualClock(100);
    const second = createJob('research_job_002', 'company_002', clock);
    const first = createJob('research_job_001', 'company_001', clock);

    repository.save(second);
    repository.save(first);

    expect(repository.findAll().map((job) => job.getId().value)).toEqual([
      'research_job_001',
      'research_job_002',
    ]);
  });

  it('returns company jobs in deterministic id order', () => {
    const repository = new InMemoryResearchJobRepository();
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const second = createJob('research_job_002', 'company_001', clock);
    const first = createJob('research_job_001', 'company_001', clock);
    const otherCompany = createJob('research_job_003', 'company_002', clock);

    repository.save(second);
    repository.save(first);
    repository.save(otherCompany);

    expect(repository.findByCompanyId(companyId).map((job) => job.getId().value)).toEqual([
      'research_job_001',
      'research_job_002',
    ]);
  });

  it('overwrites an existing research job when saving the same id again', () => {
    const repository = new InMemoryResearchJobRepository();
    const clock = new ManualClock(100);
    const running = createJob('research_job_001', 'company_001', clock);

    running.start(clock);
    repository.save(running);

    const waiting = createJob('research_job_001', 'company_001', clock);
    repository.save(waiting);

    expect(repository.findById(requireResearchJobId('research_job_001'))?.getStatus()).toBe(
      ResearchJobStatus.WAITING,
    );
  });
});
