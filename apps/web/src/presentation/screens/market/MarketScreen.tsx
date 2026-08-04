'use client';

import { useEffect, useMemo, useState } from 'react';
import { PGMarketPriceHistoryChart } from '@/presentation/components/dashboard/charts';
import { MarketPricesTable } from '@/components/MarketPricesTable';
import { buildNameResolver } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { buyResource, sellResource } from '@/presentation/adapters/api/market-client';
import { fetchMarketPrices } from '@/presentation/adapters/api/query-client';
import type { MarketHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { useScreenQuery, TICK_QUERY_DEBOUNCE_MS } from '@/presentation/hooks/useScreenQuery';
import { Button } from '@/presentation/primitives/Button';
import { Card } from '@/presentation/primitives/Card';
import { EmptyState } from '@/presentation/primitives/EmptyState';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import { ScreenQueryFrame } from '@/presentation/screens/shared/ScreenQueryFrame';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';
import { useTransientFormState } from '@/presentation/state/useTransientFormState';
import '../world/world-company.css';
import './market-screen.css';

function findMarketHint(
  hints: readonly MarketHintViewData[],
  resourceId: string,
): MarketHintViewData | undefined {
  return hints.find((hint) => hint.resourceId === resourceId);
}

function resolveTradeValidation(
  hint: MarketHintViewData | undefined,
  amount: number,
  side: 'buy' | 'sell',
): { readonly canSubmit: boolean; readonly message: string | null } {
  if (!Number.isInteger(amount) || amount < 1) {
    return {
      canSubmit: false,
      message: 'Bitte geben Sie eine ganze Menge größer als 0 ein.',
    };
  }

  if (hint === undefined || amount !== hint.tradeAmount) {
    return { canSubmit: true, message: null };
  }

  if (side === 'buy') {
    return {
      canSubmit: hint.canBuy,
      message: hint.buyReason,
    };
  }

  return {
    canSubmit: hint.canSell,
    message: hint.sellReason,
  };
}

/** Regional market screen with prices, history, inventory context, and buy/sell forms. */
export function MarketScreen() {
  const { viewData, companyViewData, regions, isBusy, runCommand } = useGameWorkspace();
  const defaultRegionId = regions[0]?.id ?? viewData.world?.regions[0]?.id ?? '';
  const [selectedRegionId, setSelectedRegionId] = useState(defaultRegionId);
  const tradeForm = useTransientFormState({ resourceId: '', amount: 5 });
  const labels = useMemo(
    () => buildNameResolver(companyViewData.labels),
    [companyViewData.labels],
  );
  const tickKey = viewData.simulation.tickNumber ?? 0;
  const regionId = selectedRegionId.length > 0 ? selectedRegionId : defaultRegionId;
  const marketQuery = useScreenQuery(
    `markets:${regionId}:${tickKey}`,
    () => fetchMarketPrices(regionId),
    viewData.session.hasGame && regionId.length > 0,
    { debounceMs: TICK_QUERY_DEBOUNCE_MS },
  );

  useEffect(() => {
    if (defaultRegionId.length > 0 && selectedRegionId.length === 0) {
      setSelectedRegionId(defaultRegionId);
    }
  }, [defaultRegionId, selectedRegionId.length]);

  useEffect(() => {
    const firstResourceId = marketQuery.data?.[0]?.resourceId;

    if (firstResourceId === undefined) {
      return;
    }

    if (
      tradeForm.value.resourceId.length === 0 ||
      marketQuery.data?.some((price) => price.resourceId === tradeForm.value.resourceId) !== true
    ) {
      tradeForm.patch({ resourceId: firstResourceId });
    }
  }, [marketQuery.data, tradeForm.patch, tradeForm.value.resourceId]);

  const selectedHint = findMarketHint(companyViewData.hints.market, tradeForm.value.resourceId);
  const buyValidation = resolveTradeValidation(selectedHint, tradeForm.value.amount, 'buy');
  const sellValidation = resolveTradeValidation(selectedHint, tradeForm.value.amount, 'sell');
  const selectedResourceLabel =
    tradeForm.value.resourceId.length > 0
      ? labels.resource(tradeForm.value.resourceId)
      : 'Ressource';

  const submitTrade = (side: 'buy' | 'sell') => {
    const amount = tradeForm.value.amount;
    const resourceId = tradeForm.value.resourceId;
    const validation = side === 'buy' ? buyValidation : sellValidation;

    if (resourceId.length === 0 || !validation.canSubmit || isBusy) {
      return;
    }

    const action = side === 'buy' ? buyResource : sellResource;

    void runCommand(
      () => action({ resourceId, amount }),
      side === 'buy'
        ? `${amount}× ${selectedResourceLabel} gekauft.`
        : `${amount}× ${selectedResourceLabel} verkauft.`,
    );
  };

  return (
    <ScreenQueryFrame
      hasGame={viewData.session.hasGame}
      isLoading={marketQuery.isLoading}
      errorMessage={marketQuery.errorMessage}
      loadingLabel="Marktdaten werden geladen…"
    >
      <div className="pg-market-screen">
        <Card title="Regionaler Markt">
          <div className="pg-market-toolbar">
            <div className="pg-market-field">
              <label htmlFor="market-region-select">Region</label>
              <select
                id="market-region-select"
                value={regionId}
                onChange={(event) => {
                  setSelectedRegionId(event.target.value);
                }}
                aria-label="Regionale Marktauswahl"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {marketQuery.data !== null && marketQuery.data.length > 0 ? (
            <MarketPricesTable marketPrices={marketQuery.data} labelResource={labels.resource} />
          ) : (
            <EmptyState title="Keine Marktpreise" hint="Für diese Region liegen keine Preise vor." />
          )}
        </Card>

        <div className="pg-market-context-grid">
          <Card title="Unternehmenskontext">
            <ul className="pg-summary-list">
              <li>
                <span>Verfügbares Kapital</span>
                <strong>{companyViewData.kpis?.availableCashLabel ?? '—'}</strong>
              </li>
              <li>
                <span>Preisindex</span>
                <strong>{companyViewData.kpis?.priceIndexLabel ?? '—'}</strong>
              </li>
              <li>
                <span>Tick</span>
                <strong>{companyViewData.tickLabel}</strong>
              </li>
            </ul>
          </Card>

          <Card title="Lagerbestand">
            {companyViewData.inventoryItems.length === 0 ? (
              <EmptyState title="Kein Bestand" hint="Es sind keine Ressourcen im Inventar." />
            ) : (
              <ul className="pg-summary-list">
                {companyViewData.inventoryItems.map((item) => (
                  <li key={item.resourceLabel}>
                    <span>{item.resourceLabel}</span>
                    <strong>
                      {item.available.toLocaleString('de-DE')} / {item.quantity.toLocaleString('de-DE')}
                    </strong>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Handel">
          <div className="pg-market-toolbar">
            <div className="pg-market-field">
              <label htmlFor="market-resource-select">Ressource</label>
              <select
                id="market-resource-select"
                value={tradeForm.value.resourceId}
                onChange={(event) => {
                  tradeForm.patch({ resourceId: event.target.value });
                }}
                aria-label="Handelsressource auswählen"
              >
                {(marketQuery.data ?? []).map((price) => (
                  <option key={price.resourceId} value={price.resourceId}>
                    {labels.resource(price.resourceId)}
                  </option>
                ))}
              </select>
            </div>

            <div className="pg-market-field">
              <label htmlFor="market-amount-input">Menge</label>
              <input
                id="market-amount-input"
                type="number"
                min={1}
                step={1}
                value={tradeForm.value.amount}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  tradeForm.patch({ amount: Number.isNaN(parsed) ? 0 : parsed });
                }}
                aria-label="Handelsmenge"
              />
            </div>
          </div>

          {!buyValidation.canSubmit && buyValidation.message !== null ? (
            <StatusBanner tone="warning" message={`Kauf: ${buyValidation.message}`} />
          ) : null}
          {!sellValidation.canSubmit && sellValidation.message !== null ? (
            <StatusBanner tone="warning" message={`Verkauf: ${sellValidation.message}`} />
          ) : null}

          <div className="pg-market-trade-actions">
            <Button
              disabled={
                isBusy ||
                tradeForm.value.resourceId.length === 0 ||
                !buyValidation.canSubmit
              }
              onClick={() => {
                submitTrade('buy');
              }}
            >
              Kaufen
            </Button>
            <Button
              variant="secondary"
              disabled={
                isBusy ||
                tradeForm.value.resourceId.length === 0 ||
                !sellValidation.canSubmit
              }
              onClick={() => {
                submitTrade('sell');
              }}
            >
              Verkaufen
            </Button>
            {selectedHint !== undefined ? (
              <p className="pg-market-validation">
                Standardmenge laut Hinweis: {selectedHint.tradeAmount.toLocaleString('de-DE')}
              </p>
            ) : null}
          </div>
        </Card>

        <PGMarketPriceHistoryChart
          points={companyViewData.chartPoints}
          labelResource={labels.resource}
        />
      </div>
    </ScreenQueryFrame>
  );
}
