'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRELOAD_VISUAL_ASSET_IDS } from '@/presentation/assets';
import {
  PGVisualAssetBackground,
  useVisualAssetPreload,
} from '@/presentation/components/assets';
import { useNotifications } from '@/presentation/notifications/NotificationProvider';
import { CreditsPanel } from './CreditsPanel';
import { LoadGamePanel } from './LoadGamePanel';
import { MainMenuHome } from './MainMenuHome';
import { MenuLoadingScreen } from './MenuLoadingScreen';
import { NewGamePanel } from './NewGamePanel';
import { SettingsPanel } from './SettingsPanel';
import { SplashScreen } from './SplashScreen';
import { loadMenuSettings } from './menu-settings';
import type { MenuPanelView } from './menu-flow';
import { useMenuBootstrap } from './useMenuBootstrap';
import './menu.css';

/** Main menu flow: splash → loading → home and sub-panels (MM-001–MM-007). */
export function MainMenuScreen() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const bootstrap = useMenuBootstrap();
  const [panel, setPanel] = useState<MenuPanelView>('home');
  const animationsEnabled = loadMenuSettings().menuAnimationsEnabled;

  useVisualAssetPreload(PRELOAD_VISUAL_ASSET_IDS);

  const handleContinue = useCallback(() => {
    router.push('/game');
  }, [router]);

  const handleExit = useCallback(() => {
    showNotification({
      tone: 'info',
      message: 'Sie können diesen Browser-Tab schließen, um Project Genesis zu beenden.',
    });
  }, [showNotification]);

  const animationClass = animationsEnabled ? 'pg-main-menu-animated' : 'pg-main-menu-reduced-motion';
  const shellClassName = `pg-main-menu pg-main-menu-with-assets ${animationClass}`;

  if (bootstrap.phase === 'splash') {
    return (
      <div className={shellClassName}>
        <SplashScreen />
      </div>
    );
  }

  if (bootstrap.phase === 'loading') {
    return (
      <div className={shellClassName}>
        <MenuLoadingScreen />
      </div>
    );
  }

  return (
    <div className={shellClassName}>
      <PGVisualAssetBackground assetId="MM-001" />
      <div className="pg-main-menu-card">
        {panel === 'home' ? (
          <MainMenuHome
            sessionStatus={bootstrap.sessionStatus}
            errorMessage={bootstrap.errorMessage}
            onNavigate={setPanel}
            onContinue={handleContinue}
            onExit={handleExit}
          />
        ) : null}

        {panel === 'new-game' ? (
          <NewGamePanel
            onCancel={() => {
              setPanel('home');
            }}
          />
        ) : null}

        {panel === 'load-game' ? (
          <LoadGamePanel
            onCancel={() => {
              setPanel('home');
            }}
          />
        ) : null}

        {panel === 'settings' ? (
          <SettingsPanel
            onCancel={() => {
              setPanel('home');
            }}
          />
        ) : null}

        {panel === 'credits' ? (
          <CreditsPanel
            onCancel={() => {
              setPanel('home');
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
