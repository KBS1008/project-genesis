import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { STARTING_MONEY } from '../../domain/finance/FinanceConstants.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { createRegionalBaselineDemandResolver } from './createRegionalBaselineDemandResolver.js';
import { CreateCompanyUseCase } from '../use-cases/CreateCompanyUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { StartResearchUseCase } from '../use-cases/StartResearchUseCase.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { ResearchJobStatus } from '../../domain/research/ResearchJobStatus.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

function grantMilestone(
  context: Awaited<ReturnType<typeof bootstrapApplication>> extends { ok: true; value: infer T }
    ? T
    : never,
  companyId: string,
  milestoneId: string,
) {
  const companyIdResult = createCompanyId(companyId);
  const milestoneIdResult = createMilestoneId(milestoneId);

  if (!companyIdResult.ok || !milestoneIdResult.ok) {
    throw new Error('Invalid milestone grant input.');
  }

  const milestones = context.companyMilestonesRepository.findByCompanyId(companyIdResult.value);

  if (milestones === undefined) {
    throw new Error('Company milestones were not found.');
  }

  milestones.completeMilestone(milestoneIdResult.value, context.clock);
  context.companyMilestonesRepository.save(milestones);
}

describe('regional modifier simulation wiring', () => {
  it('applies regional modifiers to demand, construction, research, and energy', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    expect(bootstrapResult.ok).toBe(true);

    if (!bootstrapResult.ok) {
      return;
    }

    const context = bootstrapResult.value;
    const resolveDemand = createRegionalBaselineDemandResolver(context.gameContent.regions);

    expect(resolveDemand('region_south', 'consumer_goods')).toBe(83);

    new CreateCompanyUseCase(context).execute({
      companyId: 'company_regional_modifiers',
      name: 'Regional Modifiers Corp',
      ownerId: 'player_001',
    });

    const companyIdResult = createCompanyId('company_regional_modifiers');

    expect(companyIdResult.ok).toBe(true);

    if (!companyIdResult.ok) {
      return;
    }

    const baselineEnergy = context.energyBalanceService.computeForCompany(companyIdResult.value);
    expect(baselineEnergy.generation).toBeCloseTo(34.5);

    const placeBuilding = new PlaceBuildingUseCase(context);
    const placeResult = placeBuilding.execute({
      companyId: 'company_regional_modifiers',
      buildingId: 'building_regional_modifiers_sawmill',
      buildingTypeId: 'sawmill',
      name: 'Regional Sawmill',
      x: 1,
      y: 1,
      regionId: 'region_north',
    });

    expect(placeResult.ok).toBe(true);

    const finance = context.financeRepository.findByCompanyId(companyIdResult.value);
    expect(finance?.getCashBalance()).toBe(STARTING_MONEY - 4700);

    grantMilestone(context, 'company_regional_modifiers', 'profit_100');

    const startResearch = new StartResearchUseCase(context);
    const researchResult = startResearch.execute({
      companyId: 'company_regional_modifiers',
      jobId: 'research_job_regional_modifiers',
      technologyId: 'basic_woodworking',
    });

    expect(researchResult.ok).toBe(true);

    if (researchResult.ok) {
      const job = context.researchJobRepository.findById(researchResult.value);

      expect(job).toBeDefined();
      expect(job?.getStatus()).toBe(ResearchJobStatus.RUNNING);
      expect(job?.getDuration()).toBe(45);
    }
  });
});
