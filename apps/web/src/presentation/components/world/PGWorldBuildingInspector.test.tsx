// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PGWorldBuildingInspector } from '@/presentation/components/world/PGWorldBuildingInspector';

const detail = Object.freeze({
  title: 'Lager',
  subtitle: 'Aktiv',
  entries: Object.freeze([['Typ', 'Lagerhaus']] as const),
});

const allNavigation = Object.freeze({
  showOpenBuilding: true,
  showOpenProduction: true,
  showManageWorkforce: true,
});

const warehouseNavigation = Object.freeze({
  showOpenBuilding: true,
  showOpenProduction: false,
  showManageWorkforce: false,
});

describe('PGWorldBuildingInspector', () => {
  it('renders detail entries and closes on button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <PGWorldBuildingInspector
        buildingId="building_001"
        detail={detail}
        navigation={warehouseNavigation}
        onClose={onClose}
        onOpenBuilding={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Lager' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Inspektor schließen' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('NAV-T04 — three separate navigation buttons', async () => {
    const user = userEvent.setup();
    const onOpenBuilding = vi.fn();
    const onOpenProduction = vi.fn();
    const onManageWorkforce = vi.fn();

    render(
      <PGWorldBuildingInspector
        buildingId="building_a"
        detail={detail}
        navigation={allNavigation}
        onClose={vi.fn()}
        onOpenBuilding={onOpenBuilding}
        onOpenProduction={onOpenProduction}
        onManageWorkforce={onManageWorkforce}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Gebäude öffnen' }));
    await user.click(screen.getByRole('button', { name: 'Produktion öffnen' }));
    await user.click(screen.getByRole('button', { name: 'Personal verwalten' }));

    expect(onOpenBuilding).toHaveBeenCalledTimes(1);
    expect(onOpenProduction).toHaveBeenCalledTimes(1);
    expect(onManageWorkforce).toHaveBeenCalledTimes(1);
  });

  it('NAV-T05 — warehouse shows only Gebäude öffnen', () => {
    render(
      <PGWorldBuildingInspector
        buildingId="building_002"
        detail={detail}
        navigation={warehouseNavigation}
        onClose={vi.fn()}
        onOpenBuilding={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Gebäude öffnen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Produktion öffnen' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Personal verwalten' })).not.toBeInTheDocument();
  });

  it('GCL-S1-T01 — shows active production section and progress', () => {
    render(
      <PGWorldBuildingInspector
        buildingId="building_a"
        detail={detail}
        navigation={allNavigation}
        onClose={vi.fn()}
        production={{
          headline: 'Produktion läuft',
          productLabel: 'Bretter',
          progressPercent: 42,
          progressLabel: '42%',
          stallDetail: null,
          showOpenProductionAction: true,
        }}
        onOpenBuilding={vi.fn()}
        onOpenProduction={vi.fn()}
        onManageWorkforce={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Produktion' })).toBeInTheDocument();
    expect(screen.getByText('Produktion läuft')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '42');
  });

  it('GCL-S1-T02 — workforce stall message with Personal verwalten always available', () => {
    render(
      <PGWorldBuildingInspector
        buildingId="building_a"
        detail={detail}
        navigation={allNavigation}
        onClose={vi.fn()}
        production={{
          headline: 'Produktion angehalten – Arbeitskräfte fehlen',
          productLabel: 'Bretter',
          progressPercent: 0,
          progressLabel: '0%',
          stallDetail: 'Keine Mitarbeiter am Gebäude zugewiesen.',
          showOpenProductionAction: true,
        }}
        onOpenBuilding={vi.fn()}
        onOpenProduction={vi.fn()}
        onManageWorkforce={vi.fn()}
      />,
    );

    expect(screen.getByText('Produktion angehalten – Arbeitskräfte fehlen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Personal verwalten' })).toBeInTheDocument();
  });

  it('GCL-S1-T04 — omits production section when production is null', () => {
    render(
      <PGWorldBuildingInspector
        buildingId="building_hq"
        detail={detail}
        navigation={warehouseNavigation}
        onClose={vi.fn()}
        production={null}
        onOpenBuilding={vi.fn()}
      />,
    );

    expect(screen.queryByRole('heading', { name: 'Produktion' })).not.toBeInTheDocument();
  });

  it('GCL-S1-AF-T01 — actions appear after identity and before detail entries', () => {
    render(
      <PGWorldBuildingInspector
        buildingId="building_a"
        detail={detail}
        navigation={allNavigation}
        onClose={vi.fn()}
        onOpenBuilding={vi.fn()}
        onOpenProduction={vi.fn()}
        onManageWorkforce={vi.fn()}
      />,
    );

    const subtitle = screen.getByText('Aktiv');
    const openBuilding = screen.getByRole('button', { name: 'Gebäude öffnen' });
    const typEntry = screen.getByText('Typ');

    expect(subtitle.compareDocumentPosition(openBuilding) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(openBuilding.compareDocumentPosition(typEntry) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('GCL-S1-AF-T02 — each navigation action appears once', () => {
    render(
      <PGWorldBuildingInspector
        buildingId="building_a"
        detail={detail}
        navigation={allNavigation}
        onClose={vi.fn()}
        onOpenBuilding={vi.fn()}
        onOpenProduction={vi.fn()}
        onManageWorkforce={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('button', { name: 'Gebäude öffnen' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Produktion öffnen' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Personal verwalten' })).toHaveLength(1);
  });

  it('GCL-S1-AF-T06 — scroll resets when selected building changes', () => {
    const scrollTo = vi.fn();
    const { rerender } = render(
      <PGWorldBuildingInspector
        buildingId="building_a"
        detail={detail}
        navigation={warehouseNavigation}
        onClose={vi.fn()}
        onOpenBuilding={vi.fn()}
      />,
    );

    const body = document.querySelector('.pg-inspector-body');
    expect(body).not.toBeNull();
    body!.scrollTo = scrollTo;

    rerender(
      <PGWorldBuildingInspector
        buildingId="building_b"
        detail={{ ...detail, title: 'Sägewerk' }}
        navigation={warehouseNavigation}
        onClose={vi.fn()}
        onOpenBuilding={vi.fn()}
      />,
    );

    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });
});
