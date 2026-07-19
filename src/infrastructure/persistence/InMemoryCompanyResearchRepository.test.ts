import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { CompanyResearch } from '../../domain/research/CompanyResearch.js';
import { createCompanyResearchId } from '../../domain/research/CompanyResearchId.js';
import { createTechnologyId } from '../../domain/research/TechnologyId.js';
import { InMemoryCompanyResearchRepository } from './InMemoryCompanyResearchRepository.js';

function requireCompanyResearchId(value: string) {
  const result = createCompanyResearchId(value);

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

function createResearchModule(id: string, companyId: string, clock = new ManualClock(100)) {
  const result = CompanyResearch.create({
    id: requireCompanyResearchId(id),
    companyId: requireCompanyId(companyId),
    clock,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('InMemoryCompanyResearchRepository', () => {
  it('saves and retrieves research modules by id', () => {
    const repository = new InMemoryCompanyResearchRepository();
    const research = createResearchModule('research_company_001', 'company_001');

    repository.save(research);

    expect(repository.findById(requireCompanyResearchId('research_company_001'))).toBe(research);
  });

  it('returns undefined when a research module id was not found', () => {
    const repository = new InMemoryCompanyResearchRepository();

    expect(repository.findById(requireCompanyResearchId('research_missing'))).toBeUndefined();
  });

  it('finds the research module owned by a company', () => {
    const repository = new InMemoryCompanyResearchRepository();
    const research = createResearchModule('research_company_001', 'company_001');

    repository.save(research);

    expect(repository.findByCompanyId(requireCompanyId('company_001'))).toBe(research);
    expect(repository.findByCompanyId(requireCompanyId('company_002'))).toBeUndefined();
  });

  it('returns research modules in deterministic id order', () => {
    const repository = new InMemoryCompanyResearchRepository();
    const second = createResearchModule('research_company_002', 'company_002');
    const first = createResearchModule('research_company_001', 'company_001');

    repository.save(second);
    repository.save(first);

    expect(repository.findAll().map((research) => research.getId().value)).toEqual([
      'research_company_001',
      'research_company_002',
    ]);
  });

  it('overwrites an existing research module when saving the same id again', () => {
    const repository = new InMemoryCompanyResearchRepository();
    const clock = new ManualClock(100);
    const research = createResearchModule('research_company_001', 'company_001', clock);
    const technologyIdResult = createTechnologyId('basic_woodworking');

    expect(technologyIdResult.ok).toBe(true);

    if (!technologyIdResult.ok) {
      return;
    }

    research.completeTechnology(technologyIdResult.value, clock);
    repository.save(research);

    const restored = createResearchModule('research_company_001', 'company_001', clock);
    repository.save(restored);

    expect(
      repository.findById(requireCompanyResearchId('research_company_001'))?.hasCompletedTechnology(
        'basic_woodworking',
      ),
    ).toBe(false);
  });
});
