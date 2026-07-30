'use client';

import { useEffect, useState } from 'react';
import { fetchSessionStatus, type SessionStatusDto } from '@/presentation/adapters/api/query-client';
import { translatePresentationError } from '@/presentation/notifications/translatePresentationError';
import {
  MENU_LOADING_MIN_DURATION_MS,
  MENU_SPLASH_DURATION_MS,
  type MenuFlowPhase,
} from './menu-flow';

export type MenuBootstrapState = {
  readonly phase: MenuFlowPhase;
  readonly sessionStatus: SessionStatusDto | null;
  readonly errorMessage: string | null;
};

const INITIAL_STATE: MenuBootstrapState = Object.freeze({
  phase: 'splash',
  sessionStatus: null,
  errorMessage: null,
});

/** Boots the main menu through splash and loading phases with runtime session data. */
export function useMenuBootstrap(): MenuBootstrapState {
  const [state, setState] = useState<MenuBootstrapState>(INITIAL_STATE);

  useEffect(() => {
    let active = true;
    const splashTimer = window.setTimeout(() => {
      if (active) {
        setState((current) => ({
          ...current,
          phase: 'loading',
        }));
      }
    }, MENU_SPLASH_DURATION_MS);

    return () => {
      active = false;
      window.clearTimeout(splashTimer);
    };
  }, []);

  useEffect(() => {
    if (state.phase !== 'loading') {
      return;
    }

    let active = true;
    const startedAt = Date.now();

    void fetchSessionStatus()
      .then((sessionStatus) => {
        if (!active) {
          return;
        }

        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(MENU_LOADING_MIN_DURATION_MS - elapsed, 0);

        window.setTimeout(() => {
          if (!active) {
            return;
          }

          setState({
            phase: 'home',
            sessionStatus,
            errorMessage: null,
          });
        }, remaining);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(MENU_LOADING_MIN_DURATION_MS - elapsed, 0);

        window.setTimeout(() => {
          if (!active) {
            return;
          }

          setState({
            phase: 'home',
            sessionStatus: null,
            errorMessage: translatePresentationError(error),
          });
        }, remaining);
      });

    return () => {
      active = false;
    };
  }, [state.phase]);

  return state;
}
