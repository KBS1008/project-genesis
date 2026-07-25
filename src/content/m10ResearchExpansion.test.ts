import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TechnologyCategory } from './research/TechnologyDefinition.js';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const PHASE_3_BRANCHES = Object.freeze([
  TechnologyCategory.PRODUCTION,
  TechnologyCategory.ENERGY,
  TechnologyCategory.AUTOMATION,
  TechnologyCategory.LOGISTICS,
  TechnologyCategory.MANAGEMENT,
  TechnologyCategory.FINANCE,
  TechnologyCategory.AGRICULTURE,
  TechnologyCategory.CHEMISTRY,
  TechnologyCategory.ELECTRONICS,
  TechnologyCategory.AI,
]);

const RESEARCH_UNLOCKS = Object.freeze([
  { ownerId: 'machine_shop', technologyId: 'advanced_metallurgy' },
  { ownerId: 'recipe_machine_parts', technologyId: 'advanced_metallurgy' },
  { ownerId: 'assembly_plant', technologyId: 'industrial_assembly' },
  { ownerId: 'recipe_industrial_machinery', technologyId: 'industrial_assembly' },
  { ownerId: 'electronics_factory', technologyId: 'circuit_design' },
  { ownerId: 'recipe_advanced_electronics', technologyId: 'circuit_design' },
  { ownerId: 'consumer_goods_plant', technologyId: 'semiconductor_process' },
  { ownerId: 'recipe_consumer_goods', technologyId: 'semiconductor_process' },
  { ownerId: 'distribution_center', technologyId: 'distribution_networks' },
  { ownerId: 'logistics_hub', technologyId: 'distribution_networks' },
  { ownerId: 'rail_terminal', technologyId: 'intermodal_logistics' },
  { ownerId: 'port', technologyId: 'intermodal_logistics' },
  { ownerId: 'solar_power_plant', technologyId: 'renewable_energy' },
  { ownerId: 'recycling_facility', technologyId: 'polymer_science' },
  { ownerId: 'maintenance_facility', technologyId: 'process_automation' },
  { ownerId: 'research_campus', technologyId: 'corporate_management' },
  { ownerId: 'corporate_headquarters', technologyId: 'executive_leadership' },
  { ownerId: 'predictive_analytics', technologyId: 'factory_automation' },
  { ownerId: 'predictive_analytics', technologyId: 'semiconductor_process' },
]);

function assertAcyclicTechnologyTree(
  technologies: { get(id: string): { readonly requiredResearch: readonly string[] } | undefined; getAll(): readonly { readonly id: string; readonly requiredResearch: readonly string[] }[] },
): void {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (technologyId: string): void => {
    if (visited.has(technologyId)) {
      return;
    }

    if (visiting.has(technologyId)) {
      throw new Error(`Technology dependency cycle detected at "${technologyId}".`);
    }

    visiting.add(technologyId);

    const technology = technologies.get(technologyId);

    for (const prerequisiteId of technology?.requiredResearch ?? []) {
      visit(prerequisiteId);
    }

    visiting.delete(technologyId);
    visited.add(technologyId);
  };

  for (const technology of technologies.getAll()) {
    visit(technology.id);
  }
}

describe('M10 research expansion content', () => {
  it('loads a multi-branch technology tree with research-gated unlocks', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { technologies, buildingTypes, recipes } = result.value;

    expect(technologies.size).toBeGreaterThanOrEqual(21);
    expect(technologies.has('basic_woodworking')).toBe(true);
    expect(technologies.has('predictive_analytics')).toBe(true);

    for (const category of PHASE_3_BRANCHES) {
      const branchTechnologies = technologies.getAll().filter(
        (technology) => technology.category === category,
      );
      expect(branchTechnologies.length).toBeGreaterThanOrEqual(1);
    }

    assertAcyclicTechnologyTree(technologies);

    for (const unlock of RESEARCH_UNLOCKS) {
      const building = buildingTypes.get(unlock.ownerId);
      const recipe = recipes.get(unlock.ownerId);
      const technology = technologies.get(unlock.ownerId);
      const owner = building ?? recipe ?? technology;

      expect(owner).toBeDefined();
      expect(owner?.requiredResearch).toContain(unlock.technologyId);
    }

    expect(technologies.get('predictive_analytics')?.requiredMilestones).toContain(
      'first_consumer_goods',
    );
  });
});
