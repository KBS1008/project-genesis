// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompanyOverviewScreen } from '@/presentation/screens/company/CompanyOverviewScreen';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

vi.mock('@/presentation/screens/dashboard/ExecutiveDashboardScreen', () => ({
  ExecutiveDashboardScreen: () => <div>Executive Dashboard Mock</div>,
}));

describe('CompanyOverviewScreen', () => {
  it('delegates to the executive dashboard screen', () => {
    renderPresentation(<CompanyOverviewScreen onOpenOperations={() => {}} />);
    expect(screen.getByText('Executive Dashboard Mock')).toBeInTheDocument();
  });
});
