import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCompanyId } from '../../domain/company/Company.js';
import { bootstrapApplication } from '../bootstrap/bootstrapApplication.js';
import { CreateCompanyUseCase } from './CreateCompanyUseCase.js';
import { CompleteTechnologyUseCase } from './CompleteTechnologyUseCase.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentRoot = path.resolve(testDirectory, '../../../game-content');

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('CompleteTechnologyUseCase', () => {
  it('marks a technology as completed for a company', async () => {
    const bootstrapResult = await bootstrapApplication({ gameContentRoot });

    if (!bootstrapResult.ok) {
      throw new Error(bootstrapResult.error.message);
    }

    const context = bootstrapResult.value;
    const createCompany = new CreateCompanyUseCase(context);
    const completeTechnology = new CompleteTechnologyUseCase(context);

    createCompany.execute({
      companyId: 'company_001',
      name: 'Genesis Industries',
      ownerId: 'player_001',
    });

    const result = completeTechnology.execute({
      companyId: 'company_001',
      technologyId: 'basic_woodworking',
    });

    expect(result.ok).toBe(true);

    const research = context.companyResearchRepository.findByCompanyId(requireCompanyId('company_001'));

    expect(research?.hasCompletedTechnology('basic_woodworking')).toBe(true);
  });
});
