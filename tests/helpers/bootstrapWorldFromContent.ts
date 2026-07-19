import type { GameContentLoadResult } from '../../src/content/validateGameContent.js';
import { WorldBootstrapService } from '../../src/application/services/WorldBootstrapService.js';
import { InMemoryRegionRepository } from '../../src/infrastructure/persistence/InMemoryRegionRepository.js';
import { InMemoryWorldRepository } from '../../src/infrastructure/persistence/InMemoryWorldRepository.js';
import { InMemoryCityRepository } from '../../src/infrastructure/persistence/InMemoryCityRepository.js';
import { InMemoryWorldMapRepository } from '../../src/infrastructure/persistence/InMemoryWorldMapRepository.js';

/** Bootstraps world graph repositories from validated game content. */
export function bootstrapWorldFromContent(content: GameContentLoadResult): {
  readonly worldRepository: InMemoryWorldRepository;
  readonly regionRepository: InMemoryRegionRepository;
  readonly cityRepository: InMemoryCityRepository;
  readonly worldMapRepository: InMemoryWorldMapRepository;
} {
  const worldRepository = new InMemoryWorldRepository();
  const regionRepository = new InMemoryRegionRepository();
  const cityRepository = new InMemoryCityRepository();
  const worldMapRepository = new InMemoryWorldMapRepository();
  const bootstrapResult = new WorldBootstrapService({
    worldRepository,
    regionRepository,
    cityRepository,
    worldMapRepository,
  }).bootstrap(content);

  if (!bootstrapResult.ok) {
    throw new Error(bootstrapResult.error.message);
  }

  return { worldRepository, regionRepository, cityRepository, worldMapRepository };
}
