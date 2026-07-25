import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const AI_FOCUS_TAGS = Object.freeze([
  'ai_focus_planning',
  'ai_focus_expansion',
  'ai_focus_research',
  'ai_focus_pricing',
  'ai_focus_transport',
  'ai_focus_competition',
]);

const PHASE_7_STRATEGIES = Object.freeze([
  {
    id: 'strategy_operational_planner',
    focusTag: 'ai_focus_planning',
    dominantWeight: 'productionWeight',
    minimum: 70,
  },
  {
    id: 'strategy_regional_expander',
    focusTag: 'ai_focus_expansion',
    dominantWeight: 'expansionWeight',
    minimum: 90,
  },
  {
    id: 'strategy_research_priority',
    focusTag: 'ai_focus_research',
    dominantWeight: 'researchWeight',
    minimum: 90,
  },
  {
    id: 'strategy_aggressive_pricing',
    focusTag: 'ai_focus_pricing',
    dominantWeight: 'tradingWeight',
    minimum: 90,
  },
  {
    id: 'strategy_logistics_specialist',
    focusTag: 'ai_focus_transport',
    dominantWeight: 'tradingWeight',
    minimum: 65,
  },
  {
    id: 'strategy_market_rival',
    focusTag: 'ai_focus_competition',
    dominantWeight: 'tradingWeight',
    minimum: 80,
  },
]);

const PHASE_7_NPC_COMPANIES = Object.freeze([
  { id: 'npc_company_steel_works', strategyId: 'strategy_manufacturer' },
  { id: 'npc_company_regional_traders', strategyId: 'strategy_trading' },
  { id: 'npc_company_research_institute', strategyId: 'strategy_research_priority' },
  { id: 'npc_company_eastern_logistics', strategyId: 'strategy_logistics_specialist' },
  { id: 'npc_company_price_aggressor', strategyId: 'strategy_aggressive_pricing' },
  { id: 'npc_company_market_rival', strategyId: 'strategy_market_rival' },
]);

describe('M10 AI expansion content', () => {
  it('loads specialized strategies and NPC competitors for company brain planning', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { strategies, npcCompanies } = result.value;

    expect(strategies.size).toBeGreaterThanOrEqual(11);
    expect(npcCompanies.size).toBeGreaterThanOrEqual(6);

    for (const focusTag of AI_FOCUS_TAGS) {
      const focusedStrategies = strategies.getAll().filter((strategy) =>
        strategy.tags.includes(focusTag),
      );
      expect(focusedStrategies.length).toBeGreaterThanOrEqual(1);
    }

    for (const strategy of PHASE_7_STRATEGIES) {
      const definition = strategies.get(strategy.id);
      expect(definition).toBeDefined();
      expect(definition?.tags).toContain(strategy.focusTag);
      expect(definition?.weights[strategy.dominantWeight as keyof typeof definition.weights]).toBeGreaterThanOrEqual(
        strategy.minimum,
      );
    }

    for (const npcCompany of PHASE_7_NPC_COMPANIES) {
      const definition = npcCompanies.get(npcCompany.id);
      expect(definition).toBeDefined();
      expect(definition?.strategyDefinitionId).toBe(npcCompany.strategyId);
      expect(strategies.has(npcCompany.strategyId)).toBe(true);
    }

    const companyIds = npcCompanies.getAll().map((company) => company.companyId);
    expect(new Set(companyIds).size).toBe(companyIds.length);
  });
});
