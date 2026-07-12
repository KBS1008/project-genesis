/**
 * @module @domain/research/ResearchJob.test
 *
 * Unit tests for {@link ResearchJob}.
 */

import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import { createTechnologyId } from './TechnologyId.js';
import { ResearchJob, createResearchJobId } from './ResearchJob.js';
import { ResearchJobStatus } from './ResearchJobStatus.js';
import { ResearchCompleted } from './events/ResearchCompleted.js';
import { ResearchStarted } from './events/ResearchStarted.js';

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

function requireTechnologyId(value: string) {
  const result = createTechnologyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('ResearchJob', () => {
  it('creates a waiting research job', () => {
    const clock = new ManualClock(100);
    const result = ResearchJob.create({
      id: requireResearchJobId('research_job_001'),
      companyId: requireCompanyId('company_001'),
      technologyId: requireTechnologyId('basic_woodworking'),
      duration: 60,
      cost: 1000,
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getStatus()).toBe(ResearchJobStatus.WAITING);
      expect(result.value.getProgress()).toBe(0);
      expect(result.value.getCost()).toBe(1000);
    }
  });

  it('starts a job and raises ResearchStarted', () => {
    const clock = new ManualClock(100);
    const jobResult = ResearchJob.create({
      id: requireResearchJobId('research_job_001'),
      companyId: requireCompanyId('company_001'),
      technologyId: requireTechnologyId('basic_woodworking'),
      duration: 60,
      cost: 1000,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    const startResult = jobResult.value.start(clock);

    expect(startResult.ok).toBe(true);
    expect(jobResult.value.getStatus()).toBe(ResearchJobStatus.RUNNING);

    const events = jobResult.value.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(ResearchStarted);
  });

  it('completes a running job when duration elapses', () => {
    const clock = new ManualClock(100);
    const jobResult = ResearchJob.create({
      id: requireResearchJobId('research_job_001'),
      companyId: requireCompanyId('company_001'),
      technologyId: requireTechnologyId('basic_woodworking'),
      duration: 60,
      cost: 1000,
      clock,
    });

    expect(jobResult.ok).toBe(true);

    if (!jobResult.ok) {
      return;
    }

    jobResult.value.start(clock);
    jobResult.value.pullDomainEvents();

    clock.advance(60);
    const tickResult = jobResult.value.tick(clock);

    expect(tickResult.ok).toBe(true);

    if (tickResult.ok) {
      expect(tickResult.value.status).toBe('completed');
      expect(tickResult.value.progress).toBe(100);
    }

    expect(jobResult.value.getStatus()).toBe(ResearchJobStatus.FINISHED);

    const events = jobResult.value.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(ResearchCompleted);
  });
});
