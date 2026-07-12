import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import { CompanyResearch } from './CompanyResearch.js';
import { createCompanyResearchId } from './CompanyResearchId.js';
import { createTechnologyId } from './TechnologyId.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyResearchId(value: string) {
  const result = createCompanyResearchId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('CompanyResearch', () => {
  it('creates empty research state for a company', () => {
    const clock = new ManualClock(100);
    const result = CompanyResearch.create({
      id: requireCompanyResearchId('research_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getCompletedTechnologies()).toEqual([]);
      expect(result.value.getCreatedAt()).toBe(100);
    }
  });

  it('records completed technologies permanently', () => {
    const clock = new ManualClock(100);
    const researchResult = CompanyResearch.create({
      id: requireCompanyResearchId('research_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(researchResult.ok).toBe(true);

    if (!researchResult.ok) {
      return;
    }

    const research = researchResult.value;
    const technologyIdResult = createTechnologyId('basic_woodworking');

    expect(technologyIdResult.ok).toBe(true);

    if (!technologyIdResult.ok) {
      return;
    }

    const completeResult = research.completeTechnology(technologyIdResult.value, clock);

    expect(completeResult.ok).toBe(true);
    expect(research.hasCompletedTechnology('basic_woodworking')).toBe(true);
    expect(research.getCompletedTechnologies()).toEqual(['basic_woodworking']);
  });
});
