import type { PGInspectorEntry } from '@/presentation/components/layout/PGInspectorPanel';
import type {
  CompanyDetailViewData,
  EntityDetailViewData,
  MarketPriceChartViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { DetailSelection } from '@/presentation/screens/company/company-detail-selection';

export type CompanyInspectorSectionViewData = {
  readonly id: string;
  readonly title: string;
  readonly entries: readonly PGInspectorEntry[];
  readonly actionLabel?: string;
};

export type CompanyInspectorViewData = {
  readonly mode: 'overview' | 'focus';
  readonly title?: string;
  readonly subtitle?: string;
  readonly entries?: readonly PGInspectorEntry[];
  readonly relatedTitle?: string;
  readonly relatedItems?: readonly {
    readonly primary: string;
    readonly secondary: string;
    readonly secondaryClass?: string;
  }[];
  readonly sections?: readonly CompanyInspectorSectionViewData[];
  readonly showClose: boolean;
  readonly marketPrices?: readonly MarketPriceChartViewData[];
};

function mapEntityDetail(detail: EntityDetailViewData, relatedTitle?: string): CompanyInspectorViewData {
  return Object.freeze({
    mode: 'focus',
    title: detail.title,
    subtitle: detail.subtitle,
    entries: detail.entries.map(([label, value, valueClass]) =>
      Object.freeze({ label, value, valueClass }),
    ),
    relatedTitle: detail.relatedTitle ?? relatedTitle,
    relatedItems: detail.relatedItems,
    showClose: true,
  });
}

function mapKeyValueEntries(
  entries: readonly (readonly [label: string, value: string, valueClass?: string])[],
): readonly PGInspectorEntry[] {
  return Object.freeze(
    entries.map(([label, value, valueClass]) => Object.freeze({ label, value, valueClass })),
  );
}

/** Maps operations detail selection to PG inspector view-data. */
export function resolveCompanyDetailInspector(
  detail: CompanyDetailViewData,
  marketPrices: readonly MarketPriceChartViewData[],
  selection: DetailSelection,
): CompanyInspectorViewData {
  if (selection.kind === 'overview') {
    const sections: CompanyInspectorSectionViewData[] = [];

    if (detail.hasFinance) {
      sections.push(
        Object.freeze({
          id: 'finance',
          title: 'Finanzen',
          entries: mapKeyValueEntries(detail.financeEntries.slice(0, 4)),
          actionLabel: 'Details',
        }),
      );
    }

    if (detail.hasLogistics) {
      sections.push(
        Object.freeze({
          id: 'logistics',
          title: 'Logistik',
          entries: mapKeyValueEntries(detail.logisticsEntries.slice(0, 4)),
          actionLabel: 'Details',
        }),
      );
    }

    if (detail.hasEnergy) {
      sections.push(
        Object.freeze({
          id: 'energy',
          title: 'Energie',
          entries: mapKeyValueEntries(detail.energyEntries),
        }),
      );
    }

    return Object.freeze({
      mode: 'overview',
      title: 'Unternehmensübersicht',
      entries:
        detail.companyEntries.length > 0 ? mapKeyValueEntries(detail.companyEntries) : undefined,
      sections: Object.freeze(sections),
      marketPrices: marketPrices.length > 0 ? marketPrices : undefined,
      showClose: false,
    });
  }

  switch (selection.kind) {
    case 'building': {
      const entity = detail.buildings.get(selection.id);
      return entity !== undefined
        ? mapEntityDetail(entity, 'Produktion an diesem Standort')
        : { mode: 'focus', showClose: true };
    }
    case 'production': {
      const entity = detail.productionJobs.get(selection.id);
      return entity !== undefined
        ? mapEntityDetail(entity, 'Zugehörige Transporte')
        : { mode: 'focus', showClose: true };
    }
    case 'transport': {
      const entity = detail.transportOrders.get(selection.id);
      return entity !== undefined ? mapEntityDetail(entity) : { mode: 'focus', showClose: true };
    }
    case 'research': {
      const entity = detail.researchJobs.get(selection.id);
      return entity !== undefined ? mapEntityDetail(entity) : { mode: 'focus', showClose: true };
    }
    case 'employee': {
      const entity = detail.employees.get(selection.id);
      return entity !== undefined ? mapEntityDetail(entity) : { mode: 'focus', showClose: true };
    }
    case 'finance':
      return detail.hasFinance
        ? Object.freeze({
            mode: 'focus',
            title: 'Finanzen',
            subtitle: 'Kontostand & Buchungen',
            entries: mapKeyValueEntries(detail.financeEntries),
            relatedTitle: 'Letzte Buchungen',
            relatedItems: detail.recentTransactions.map((transaction) =>
              Object.freeze({
                primary: transaction.typeLabel,
                secondary: transaction.amountLabel,
                secondaryClass: transaction.directionClass,
              }),
            ),
            showClose: true,
          })
        : { mode: 'focus', showClose: true };
    case 'transaction': {
      const entity = detail.transactions.get(selection.id);
      return entity !== undefined ? mapEntityDetail(entity) : { mode: 'focus', showClose: true };
    }
    case 'logistics':
      return detail.hasLogistics
        ? Object.freeze({
            mode: 'focus',
            title: 'Logistik',
            subtitle: 'Transport & Lager',
            entries: mapKeyValueEntries(detail.logisticsEntries),
            relatedTitle: 'Lagerhäuser',
            relatedItems: detail.warehouseSummaries.map((storage) =>
              Object.freeze({
                primary: storage.buildingLabel,
                secondary: storage.summary,
              }),
            ),
            showClose: true,
          })
        : { mode: 'focus', showClose: true };
    case 'warehouse': {
      const entity = detail.warehouseStorage.get(selection.id);
      return entity !== undefined
        ? mapEntityDetail(entity, 'Bestand')
        : { mode: 'focus', showClose: true };
    }
    default:
      return { mode: 'focus', showClose: true };
  }
}
