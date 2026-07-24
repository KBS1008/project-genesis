'use client';

import {
  BuildingsScreen,
  FinanceScreen,
  ProductionScreen,
  ReportsScreen,
  ResearchScreen,
  TransportScreen,
} from '@/presentation/screens/query/QueryScreens';
import { CompanyScreen } from '@/presentation/screens/company/CompanyScreen';
import { MarketScreen } from '@/presentation/screens/market/MarketScreen';
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
