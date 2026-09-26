import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatSignedCurrencyWithSymbol,
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
