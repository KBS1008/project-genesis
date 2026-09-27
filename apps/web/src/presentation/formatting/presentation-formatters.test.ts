import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatSignedCurrencyWithSymbol,
  formatResearchStatus,
  formatTransportStatus,
  PLAYER_FACING_CURRENCY_SYMBOL,
  toPlayerFacingCurrencySymbol,
} from '@/presentation/formatting/presentation-formatters';

describe('presentation-formatters currency', () => {
  it('uses $ for internal GC codes', () => {
    expect(PLAYER_FACING_CURRENCY_SYMBOL).toBe('$');
    expect(toPlayerFacingCurrencySymbol('GC')).toBe('$');
    expect(formatCurrency(1250)).toBe('1.250 $');
    expect(formatCurrency(1250, 'GC')).toBe('1.250 $');
  });

  it('preserves de-DE grouping for large values', () => {
    expect(formatCurrency(1_250_000)).toBe('1.250.000 $');
  });

  it('formats zero without extra precision', () => {
    expect(formatCurrency(0)).toBe('0 $');
  });

  it('preserves signed amount ordering with trailing symbol', () => {
    expect(formatSignedCurrencyWithSymbol('OUT', 500)).toBe('−500 $');
    expect(formatSignedCurrencyWithSymbol('IN', 100)).toBe('+100 $');
  });

  it('passes through unknown internal currency codes', () => {
    expect(toPlayerFacingCurrencySymbol('EUR')).toBe('EUR');
    expect(formatCurrency(10, 'EUR')).toBe('10 EUR');
  });
});

describe('formatTransportStatus', () => {
  it('maps all authoritative TransportOrderStatus values to German labels', () => {
    expect(formatTransportStatus('WAITING')).toBe('Warteschlange');
    expect(formatTransportStatus('IN_PROGRESS')).toBe('Unterwegs');
    expect(formatTransportStatus('COMPLETED')).toBe('Abgeschlossen');
    expect(formatTransportStatus('CANCELLED')).toBe('Abgebrochen');
  });

  it('passes through unknown status strings without throwing', () => {
    expect(formatTransportStatus('ACTIVE')).toBe('ACTIVE');
    expect(formatTransportStatus('')).toBe('');
  });
});

describe('formatResearchStatus', () => {
  it('maps all authoritative ResearchJobStatus values to German labels', () => {
    expect(formatResearchStatus('WAITING')).toBe('Wartend');
    expect(formatResearchStatus('RUNNING')).toBe('Laufend');
    expect(formatResearchStatus('FINISHED')).toBe('Abgeschlossen');
    expect(formatResearchStatus('CANCELLED')).toBe('Abgebrochen');
  });

  it('passes through unknown status strings without throwing', () => {
    expect(formatResearchStatus('IN_PROGRESS')).toBe('IN_PROGRESS');
    expect(formatResearchStatus('')).toBe('');
  });
});
