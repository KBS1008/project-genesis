/**
 * @module @common/logging/LogCategory
 *
 * @see docs/architecture/LOGGING_STRATEGY.md
 */

/** Stable logging categories for structured observability. */
export enum LogCategory {
  Application = 'Application',
  Simulation = 'Simulation',
  Domain = 'Domain',
  Economy = 'Economy',
  Production = 'Production',
  Logistics = 'Logistics',
  Research = 'Research',
  Npc = 'NPC',
  SaveSystem = 'SaveSystem',
  AssetSystem = 'AssetSystem',
  Ui = 'UI',
  Infrastructure = 'Infrastructure',
  Performance = 'Performance',
  Security = 'Security',
}
