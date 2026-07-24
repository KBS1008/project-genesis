'use client';

import {
  FinanceScreen,
  ReportsScreen,
  TransportScreen,
} from '@/presentation/screens/query/QueryScreens';
import { BuildingsScreen } from '@/presentation/screens/buildings/BuildingsScreen';
import { CompanyScreen } from '@/presentation/screens/company/CompanyScreen';
import { MarketScreen } from '@/presentation/screens/market/MarketScreen';
import { ProductionScreen } from '@/presentation/screens/production/ProductionScreen';
import { ResearchScreen } from '@/presentation/screens/research/ResearchScreen';
import { WorldScreen } from '@/presentation/screens/world/WorldScreen';
import { useGameWorkspace } from '@/presentation/state/GameWorkspaceProvider';

/** Routes primary navigation screens inside the game workspace. */
export function ScreenRouter() {
  const { navigation } = useGameWorkspace();

  switch (navigation.screen) {
    case 'company':
      return <CompanyScreen />;
    case 'world':
      return <WorldScreen />;
    case 'markets':
      return <MarketScreen />;
    case 'production':
      return <ProductionScreen />;
    case 'buildings':
      return <BuildingsScreen />;
    case 'research':
      return <ResearchScreen />;
    case 'transport':
      return <TransportScreen />;
    case 'finance':
      return <FinanceScreen />;
    case 'reports':
      return <ReportsScreen />;
    default:
      return <CompanyScreen />;
  }
}
