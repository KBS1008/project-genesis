import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { SimulationNotification } from './simulation-notification-types';

function resolveRuntimeTickMetrics(companyViewData: CompanyDashboardViewData): {
  readonly tickNumber: number;
  readonly simulationTime: number;
} {
  const latestPoint = companyViewData.chartPoints.at(-1);

  return {
    tickNumber: latestPoint?.tickNumber ?? 0,
    simulationTime: latestPoint?.simulationTime ?? 0,
  };
}

/** Maps live runtime dashboard alerts into simulation notifications. */
export function mapRuntimeAlertsToNotifications(
  companyViewData: CompanyDashboardViewData,
): readonly SimulationNotification[] {
  const notifications: SimulationNotification[] = [];
  const kpis = companyViewData.kpis;
  const { tickNumber, simulationTime } = resolveRuntimeTickMetrics(companyViewData);

  if (companyViewData.energyHasDeficit) {
    notifications.push({
      notificationId: 'runtime:energy-deficit',
      severity: 'warning',
      title: 'Energiedefizit',
      message: kpis?.energyTrend ?? 'Energieunterdeckung',
      simulationTimestamp: simulationTime,
      tickNumber,
      entityId: null,
      entityType: 'none',
      action: 'open-inspector',
      readState: 'unread',
      eventLogId: null,
      category: 'RUNTIME_ENERGY',
    });
  }

  if (kpis?.taxPaymentBlocked === true) {
    notifications.push({
      notificationId: 'runtime:tax-blocked',
      severity: 'critical',
      title: 'Steuerzahlung blockiert',
      message: kpis.taxTrendLabel,
      simulationTimestamp: simulationTime,
      tickNumber,
      entityId: null,
      entityType: 'none',
      action: 'open-inspector',
      readState: 'unread',
      eventLogId: null,
      category: 'RUNTIME_TAX',
    });
  }

  if (companyViewData.logisticsStatusMessage !== null) {
    notifications.push({
      notificationId: 'runtime:logistics-status',
      severity: 'information',
      title: 'Logistik',
      message: companyViewData.logisticsStatusMessage,
      simulationTimestamp: simulationTime,
      tickNumber,
      entityId: null,
      entityType: 'none',
      action: 'open-transport',
      readState: 'unread',
      eventLogId: null,
      category: 'RUNTIME_LOGISTICS',
    });
  }

  return Object.freeze(notifications);
}
