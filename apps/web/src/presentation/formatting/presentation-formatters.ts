/** Centralized presentation formatting helpers (DD-038). */

import type { TickMetricsSnapshot } from '@/presentation/adapters/api/client';

export function formatNumber(value: number, locale = 'de-DE'): string {
  return value.toLocaleString(locale);
}

export function formatCurrency(value: number, currency = 'GC', locale = 'de-DE'): string {
  return `${value.toLocaleString(locale)} ${currency}`;
}

export function formatSignedCurrency(
  direction: string,
  amount: number,
  locale = 'de-DE',
): string {
  if (direction === 'IN') {
    return `+${amount.toLocaleString(locale)}`;
  }

  if (direction === 'OUT') {
    return `−${amount.toLocaleString(locale)}`;
  }

  return amount.toLocaleString(locale);
}

export function formatResourceAmount(value: number, locale = 'de-DE'): string {
  return value.toLocaleString(locale);
}

export function formatTick(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return String(value);
}

export function formatSimulationTime(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }

  return String(value);
}

export function formatDateTime(timestamp: number | null, locale = 'de-DE'): string {
  if (timestamp === null) {
    return '—';
  }

  return new Date(timestamp).toLocaleString(locale);
}

export function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

export function formatEnergy(value: number): string {
  return `${value.toFixed(1)} MW`;
}

export function formatPercent(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function formatTransportStatus(status: string): string {
  if (status === 'WAITING') {
    return 'Warteschlange';
  }

  if (status === 'IN_PROGRESS') {
    return 'Unterwegs';
  }

  if (status === 'COMPLETED') {
    return 'Abgeschlossen';
  }

  return status;
}

export function formatProductionStatus(status: string, awaitingTransport: boolean): string {
  if (status === 'WAITING' && awaitingTransport) {
    return 'Wartet auf Transport';
  }

  return status;
}

export function formatTransactionType(type: string): string {
  const labels: Record<string, string> = {
    SALE: 'Verkauf',
    PURCHASE: 'Einkauf',
    PRODUCTION_COST: 'Produktionskosten',
    BUILDING_COST: 'Baukosten',
    BUILDING_REFUND: 'Bau-Rückerstattung',
    RESEARCH_COST: 'Forschungskosten',
    RESEARCH_REWARD: 'Forschungsprämie',
    MAINTENANCE: 'Wartung',
    RECRUITMENT_COST: 'Rekrutierungskosten',
    SALARY: 'Gehalt',
    LOAN_RECEIVED: 'Kredit erhalten',
    LOAN_PAYMENT: 'Kreditrate',
    INTEREST: 'Zinsen',
    MARKET_FEE: 'Marktgebühr',
    TRANSPORT_COST: 'Transportkosten',
    CONTRACT_PAYMENT: 'Vertragszahlung',
    NPC_REWARD: 'NPC-Belohnung',
    TAX: 'Steuer',
    ADMIN: 'Administration',
    SYSTEM: 'System',
  };

  return labels[type] ?? type;
}

export function formatTransactionAmount(direction: string, amount: number, locale = 'de-DE'): string {
  return formatSignedCurrency(direction, amount, locale);
}

export function transactionDirectionClass(direction: string): string | undefined {
  if (direction === 'IN') {
    return 'kv-value-success';
  }

  if (direction === 'OUT') {
    return 'kv-value-error';
  }

  return undefined;
}

export function trendLabel(direction: 'up' | 'down' | 'stable', text: string): string {
  const icon = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '→';
  return `${icon} ${text}`;
}

export function trendFromHistory(
  points: readonly TickMetricsSnapshot[],
  key: keyof Pick<TickMetricsSnapshot, 'availableCash' | 'energyReserve' | 'activeTransportCount'>,
  stableLabel: string,
): string {
  if (points.length < 2) {
    return trendLabel('stable', stableLabel);
  }

  const previous = points.at(-2)?.[key] ?? 0;
  const current = points.at(-1)?.[key] ?? 0;

  if (current > previous) {
    return trendLabel('up', stableLabel);
  }

  if (current < previous) {
    return trendLabel('down', stableLabel);
  }

  return trendLabel('stable', stableLabel);
}

export function formatContractStatus(active: boolean): string {
  return active ? 'Aktiv' : 'Inaktiv';
}

export function formatMarketTrend(trend: 'UP' | 'DOWN' | 'STABLE'): string {
  if (trend === 'UP') {
    return 'Steigend';
  }

  if (trend === 'DOWN') {
    return 'Fallend';
  }

  return 'Stabil';
}
