/** Canonical SVG design tokens aligned with DD-039 / VISUAL_STYLE_GUIDE. */
export type SvgDesignTokens = {
  readonly background: string;
  readonly panelBackground: string;
  readonly panelBorder: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly accentPrimary: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly info: string;
  readonly grid: string;
  readonly spacing: readonly number[];
  readonly borderRadius: readonly number[];
  readonly fontFamily: string;
};

/** Default Project Genesis SVG token set. */
export const DEFAULT_SVG_TOKENS: SvgDesignTokens = Object.freeze({
  background: '#08131f',
  panelBackground: '#102132',
  panelBorder: '#2d5d8f',
  textPrimary: '#f4f8fc',
  textSecondary: '#9fc7ff',
  accentPrimary: '#38a3ff',
  success: '#42c16b',
  warning: '#f0b429',
  danger: '#e25555',
  info: '#5cc8ff',
  grid: '#1a3348',
  spacing: Object.freeze([8, 12, 16, 24, 32, 40, 48]),
  borderRadius: Object.freeze([4, 8, 12, 16]),
  fontFamily: 'Segoe UI, Arial, sans-serif',
});
