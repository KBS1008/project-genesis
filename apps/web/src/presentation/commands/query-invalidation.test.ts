import { describe, expect, it } from 'vitest';
import { QueryInvalidationStore } from '@/presentation/commands/query-invalidation';

describe('QueryInvalidationStore', () => {
  it('bumps generation per scope and notifies subscribers', () => {
    const store = new QueryInvalidationStore();
    let notifications = 0;

    store.subscribe(() => {
      notifications += 1;
    });

    expect(store.getGeneration('screen.production')).toBe(0);
    store.invalidate(['screen.production']);

    expect(store.getGeneration('screen.production')).toBe(1);
    expect(store.getToken(['screen.production'])).toBe('screen.production:1');
    expect(notifications).toBe(1);
  });

  it('keeps independent generations per scope', () => {
    const store = new QueryInvalidationStore();

    store.invalidate(['screen.markets']);

    expect(store.getGeneration('screen.markets')).toBe(1);
    expect(store.getGeneration('screen.finance')).toBe(0);
  });
});
