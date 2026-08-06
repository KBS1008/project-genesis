import type { QueryScope } from './query-scopes';

type InvalidationListener = () => void;

/** In-memory invalidation registry for workspace and screen query scopes. */
export class QueryInvalidationStore {
  private readonly generations = new Map<QueryScope, number>();
  private readonly listeners = new Set<InvalidationListener>();

  /** Returns the current invalidation generation for a scope. */
  getGeneration(scope: QueryScope): number {
    return this.generations.get(scope) ?? 0;
  }

  /** Builds a stable token for React effect dependencies. */
  getToken(scopes: readonly QueryScope[]): string {
    return scopes.map((scope) => `${scope}:${this.getGeneration(scope)}`).join('|');
  }

  /** Bumps invalidation generations for the provided scopes. */
  invalidate(scopes: readonly QueryScope[]): void {
    if (scopes.length === 0) {
      return;
    }

    for (const scope of scopes) {
      this.generations.set(scope, this.getGeneration(scope) + 1);
    }

    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe(listener: InvalidationListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const queryInvalidationStore = new QueryInvalidationStore();
