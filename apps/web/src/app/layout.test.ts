import { describe, expect, it } from 'vitest';
import { metadata } from './layout';

describe('root layout metadata', () => {
  it('wires the minimum certified 32×32 BR-001 favicon derivative', () => {
    expect(metadata.icons).toEqual({
      icon: [{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }],
    });
  });
});
