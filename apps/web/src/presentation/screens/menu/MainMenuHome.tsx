'use client';

import packageInfo from '../../../../package.json';
import type { SessionStatusDto } from '@/presentation/adapters/api/query-client';
import { PGVisualAssetImage } from '@/presentation/components/assets';
import { Button } from '@/presentation/primitives/Button';
import { StatusBanner } from '@/presentation/primitives/StatusBanner';
import type { MenuPanelView } from './menu-flow';

type MainMenuHomeProps = {
  readonly sessionStatus: SessionStatusDto | null;
  readonly errorMessage: string | null;
  readonly onNavigate: (view: MenuPanelView) => void;
  readonly onContinue: () => void;
  readonly onExit: () => void;
};

/** MM-001 Main menu home with runtime continue availability. */
export function MainMenuHome({
  sessionStatus,
  errorMessage,
  onNavigate,
  onContinue,
  onExit,
}: MainMenuHomeProps) {
  const canContinue = sessionStatus?.hasActiveSession === true;

  return (
    <div className="pg-main-menu-home pg-menu-animate-in">
      <div className="pg-main-menu-brand">
        <div className="pg-main-menu-brand-row">
          <PGVisualAssetImage
            assetId="BR-001"
            alt=""
            className="pg-main-menu-brand-mark"
            loading="eager"
          />
          <div className="pg-main-menu-brand-text">
            <h1>Project Genesis</h1>
            <p>Deterministische Wirtschafts- und Industriesimulation</p>
          </div>
        </div>
      </div>

      {errorMessage !== null ? <StatusBanner tone="warning" message={errorMessage} /> : null}

      {canContinue && sessionStatus?.companyName ? (
        <p className="pg-main-menu-continue-hint" role="status">
          Fortsetzen als {sessionStatus.companyName}
        </p>
      ) : null}

      <div className="pg-main-menu-actions">
        <Button onClick={() => onNavigate('new-game')}>Neues Spiel</Button>
        <Button variant="secondary" disabled={!canContinue} onClick={onContinue}>
          Fortsetzen
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('load-game')}>
          Spiel laden
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('settings')}>
          Einstellungen
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('credits')}>
          Credits
        </Button>
        <Button variant="secondary" onClick={onExit}>
          Beenden
        </Button>
      </div>

      <div className="pg-main-menu-footer">
        <span>Version {packageInfo.version}</span>
        <span>M11 · Application Shell</span>
      </div>
    </div>
  );
}
