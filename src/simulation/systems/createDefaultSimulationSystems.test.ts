import { ManualClock } from '../../common/time/ManualClock.js';
import { InMemoryBuildingRepository } from '../../infrastructure/persistence/InMemoryBuildingRepository.js';
import { InMemoryCompanyRepository } from '../../infrastructure/persistence/InMemoryCompanyRepository.js';
import { Company, createCompanyId, createPlayerId } from '../../domain/company/Company.js';
import { createDefaultSimulationSystems } from './createDefaultSimulationSystems.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requirePlayerId(value: string) {
  const result = createPlayerId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('createDefaultSimulationSystems', () => {
  it('returns systems in deterministic runtime order', () => {
    const systems = createDefaultSimulationSystems({
      companyRepository: new InMemoryCompanyRepository(),
      buildingRepository: new InMemoryBuildingRepository(),
    });

    expect(systems.map((system) => system.name)).toEqual([
      'Company',
      'Building',
      'Production',
      'Market',
      'Finance',
    ]);
  });

  it('executes company and building systems against persisted aggregates', () => {
    const companyRepository = new InMemoryCompanyRepository();
    const buildingRepository = new InMemoryBuildingRepository();
    const clock = new ManualClock(100);

    const companyResult = Company.create({
      id: requireCompanyId('company_001'),
      name: 'Genesis Corp',
      ownerId: requirePlayerId('player_001'),
      clock,
    });

    expect(companyResult.ok).toBe(true);

    if (companyResult.ok) {
      companyRepository.save(companyResult.value);
    }

    const systems = createDefaultSimulationSystems({
      companyRepository,
      buildingRepository,
    });

    expect(() => {
      for (const system of systems) {
        system.execute({ tickNumber: 1, clock });
      }
    }).not.toThrow();
  });
});
