/** Player-facing currency copy for dashboard hints (domain currency code stays `GC`). */

export const PLAYER_FACING_CURRENCY_SYMBOL = '$';

export function formatPlayerFacingCurrencyAmount(amount: number, locale = 'de-DE'): string {
  return `${amount.toLocaleString(locale)} ${PLAYER_FACING_CURRENCY_SYMBOL}`;
}
