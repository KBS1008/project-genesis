import { describe, expect, it } from 'vitest';
import { resolveTutorialStepNavigation } from '@/presentation/navigation/resolve-tutorial-step-navigation';

describe('resolveTutorialStepNavigation', () => {
  it('returns null for open_plot and unknown ids', () => {
    expect(resolveTutorialStepNavigation('open_plot', [])).toBeNull();
    expect(resolveTutorialStepNavigation('not_a_step', [])).toBeNull();
  });

  it('resolves build_sawmill to buildings catalog focus', () => {
    const resolved = resolveTutorialStepNavigation('build_sawmill', []);

    expect(resolved).toEqual({
      kind: 'buildings_catalog',
      target: { screen: 'buildings', entitySelection: { kind: 'none' } },
      buildingCatalogFocusBuildingTypeId: 'sawmill',
    });
  });

  it('resolves buy_wood and sell_planks to market resources', () => {
    expect(resolveTutorialStepNavigation('buy_wood', [])?.kind).toBe('markets_resource');
    expect(resolveTutorialStepNavigation('buy_wood', [])?.target).toEqual({
      screen: 'markets',
      entitySelection: { kind: 'resource', id: 'wood' },
    });
    expect(resolveTutorialStepNavigation('sell_planks', [])?.target).toEqual({
      screen: 'markets',
      entitySelection: { kind: 'resource', id: 'planks' },
    });
  });

  it('scopes production to the sole sawmill when exactly one exists', () => {
    const resolved = resolveTutorialStepNavigation('produce_planks', [
      { id: 'building_a', buildingTypeId: 'warehouse' },
      { id: 'building_saw', buildingTypeId: 'sawmill' },
    ]);

    expect(resolved).toEqual({
      kind: 'production',
      target: {
        screen: 'production',
        entitySelection: { kind: 'building', id: 'building_saw' },
      },
    });
  });

  it('opens unscoped production when sawmill count is not exactly one', () => {
    expect(
      resolveTutorialStepNavigation('produce_planks', [])?.target,
    ).toEqual({ screen: 'production', entitySelection: { kind: 'none' } });

    expect(
      resolveTutorialStepNavigation('produce_planks', [
        { id: 's1', buildingTypeId: 'sawmill' },
        { id: 's2', buildingTypeId: 'sawmill' },
      ])?.target,
    ).toEqual({ screen: 'production', entitySelection: { kind: 'none' } });
  });

  it('resolves company operations intents for later tutorial steps', () => {
    const earn = resolveTutorialStepNavigation('earn_profit', []);
    const contract = resolveTutorialStepNavigation('npc_supply_contract', []);
    const tax = resolveTutorialStepNavigation('corporate_tax', []);

    expect(earn?.kind).toBe('company_operations');
    expect(contract?.kind).toBe('company_operations');
    expect(tax?.kind).toBe('company_operations');

    if (earn?.kind === 'company_operations') {
      expect(earn.pendingNavigation).toEqual({ kind: 'milestone_overview' });
    }
    if (contract?.kind === 'company_operations') {
      expect(contract.pendingNavigation).toEqual({ kind: 'economy_contracts_section' });
    }
    if (tax?.kind === 'company_operations') {
      expect(tax.pendingNavigation).toEqual({ kind: 'finance_ledger_section' });
    }
  });
});
