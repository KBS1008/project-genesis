/**
 * @module @content/validateNpcCompanyReferences
 *
 * Validates cross-registry references for NPC company content.
 */

import type { NpcCompanyRegistry } from './company/NpcCompanyRegistry.js';
import { ContentLoadError } from './errors/ContentLoadError.js';
import { Result } from '../common/result/Result.js';
import type { StrategyRegistry } from './strategy/StrategyRegistry.js';

/**
 * Ensures NPC companies reference enabled strategy definitions.
 */
export function validateNpcCompanyReferences(
  npcCompanies: NpcCompanyRegistry,
  strategies: StrategyRegistry,
): Result<void, ContentLoadError> {
  const companyIds = new Set<string>();

  for (const npcCompany of npcCompanies.getAll()) {
    if (companyIds.has(npcCompany.companyId)) {
      return Result.fail(
        new ContentLoadError(
          `Duplicate NPC runtime company id "${npcCompany.companyId}" in "${npcCompany.id}".`,
          { contentId: npcCompany.id },
        ),
      );
    }

    companyIds.add(npcCompany.companyId);

    if (!strategies.has(npcCompany.strategyDefinitionId)) {
      return Result.fail(
        new ContentLoadError(
          `${npcCompany.id} references unknown strategy "${npcCompany.strategyDefinitionId}" in "strategyDefinitionId".`,
          { contentId: npcCompany.id },
        ),
      );
    }

    const strategy = strategies.get(npcCompany.strategyDefinitionId);

    if (strategy !== undefined && !strategy.enabled) {
      return Result.fail(
        new ContentLoadError(
          `${npcCompany.id} references disabled strategy "${npcCompany.strategyDefinitionId}".`,
          { contentId: npcCompany.id },
        ),
      );
    }
  }

  return Result.ok(undefined);
}
