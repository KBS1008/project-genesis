'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
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

  if (bootstrap.phase === 'splash') {
    return (
      <div className={`pg-main-menu ${animationClass}`}>
        <SplashScreen />
      </div>
    );
  }

  if (bootstrap.phase === 'loading') {
    return (
      <div className={`pg-main-menu ${animationClass}`}>
        <MenuLoadingScreen />
      </div>
    );
  }

  return (
    <div className={`pg-main-menu ${animationClass}`}>
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
