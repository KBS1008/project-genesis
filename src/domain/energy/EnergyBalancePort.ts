/**
 * @module @domain/energy/EnergyBalancePort
 *
 * Domain port for energy balance queries used by simulation systems.
 */

import type { CompanyId } from '../company/CompanyId.js';

/** Read-only energy balance access for simulation and application layers. */
export interface EnergyBalancePort {
  canAffordRecipeEnergy(
    companyId: CompanyId,
    recipeId: string,
    options?: { readonly includeRecipeLoad?: boolean },
  ): boolean;
}
