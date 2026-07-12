const statusMessage = document.querySelector('#status-message');
const tickLabel = document.querySelector('#tick-label');
const timeLabel = document.querySelector('#time-label');
const companyPanel = document.querySelector('#company-panel');
const financePanel = document.querySelector('#finance-panel');
const inventoryPanel = document.querySelector('#inventory-panel');
const buildingsPanel = document.querySelector('#buildings-panel');
const productionPanel = document.querySelector('#production-panel');
const researchPanel = document.querySelector('#research-panel');
const marketPanel = document.querySelector('#market-panel');
const milestonesPanel = document.querySelector('#milestones-panel');

const actionButtons = {
  save: document.querySelector('#save-btn'),
  load: document.querySelector('#load-btn'),
  tick: document.querySelector('#tick-btn'),
  placeSawmill: document.querySelector('#place-sawmill-btn'),
  placeWarehouse: document.querySelector('#place-warehouse-btn'),
  startPlanks: document.querySelector('#start-planks-btn'),
  startAdvancedPlanks: document.querySelector('#start-advanced-planks-btn'),
  sellWood: document.querySelector('#sell-wood-btn'),
  startWoodworking: document.querySelector('#start-woodworking-btn'),
};

/** @type {import('../../application/facade/GameSessionDashboard.js').GameSessionDashboard | null} */
let latestDashboard = null;

async function api(path, options = undefined) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const payload = await response.json();

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error ?? 'Request failed.');
  }

  return payload.data;
}

function setStatus(message, tone = '') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${tone}`.trim();
}

function renderKeyValues(container, entries) {
  container.innerHTML = entries
    .map(
      ([label, value]) => `
        <dt>${label}</dt>
        <dd>${value}</dd>
      `,
    )
    .join('');
}

function renderTable(container, columns, rows, emptyText) {
  if (rows.length === 0) {
    container.innerHTML = `<p class="empty">${emptyText}</p>`;
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                ${columns.map((column) => `<td>${row[column.key] ?? ''}</td>`).join('')}
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function formatProgress(progress) {
  return `${Math.round(progress)}%`;
}

function renderConstructionCell(building) {
  if (building.status !== 'UNDER_CONSTRUCTION') {
    return building.status;
  }

  return `
    <div class="progress-cell">
      <span>${building.status}</span>
      <div class="progress-bar" aria-hidden="true">
        <div class="progress-fill" style="width: ${Math.round(building.constructionProgress)}%"></div>
      </div>
      <span class="progress-label">${formatProgress(building.constructionProgress)}</span>
    </div>
  `;
}

function findActiveSawmill(buildings) {
  return buildings.find(
    (building) => building.buildingTypeId === 'sawmill' && building.status === 'ACTIVE',
  );
}

function updateActionButtons(dashboard) {
  const hasGame = Boolean(dashboard.company);
  const actions = dashboard.availableActions ?? {};

  actionButtons.save.disabled = !hasGame;
  actionButtons.tick.disabled = !hasGame;
  actionButtons.placeSawmill.disabled = !hasGame;
  actionButtons.placeWarehouse.disabled = !hasGame || !actions.canPlaceWarehouse;
  actionButtons.startPlanks.disabled = !hasGame || !actions.canStartPlanksProduction;
  actionButtons.startAdvancedPlanks.disabled = !hasGame || !actions.canStartAdvancedPlanksProduction;
  actionButtons.sellWood.disabled = !hasGame;
  actionButtons.startWoodworking.disabled = !hasGame || !actions.canStartWoodworkingResearch;
}

function renderDashboard(dashboard) {
  latestDashboard = dashboard;
  tickLabel.textContent = `Tick ${dashboard.tickNumber}`;
  timeLabel.textContent = `Time ${dashboard.simulationTime}`;

  if (!dashboard.company) {
    renderKeyValues(companyPanel, [['Status', 'Kein aktives Spiel']]);
    renderKeyValues(financePanel, [['Status', '—']]);
    inventoryPanel.innerHTML = '<p class="empty">Inventar erscheint nach Spielstart.</p>';
    buildingsPanel.innerHTML = '<p class="empty">Noch keine Gebäude.</p>';
    productionPanel.innerHTML = '<p class="empty">Keine laufende Produktion.</p>';
    researchPanel.innerHTML = '<p class="empty">Keine laufende Forschung.</p>';
  } else {
    renderKeyValues(companyPanel, [
      ['Name', dashboard.company.name],
      ['ID', dashboard.company.id],
      ['Owner', dashboard.company.ownerId],
      ['Status', dashboard.company.status],
    ]);

    renderKeyValues(financePanel, [
      ['Cash', `${dashboard.finance.cashBalance.toLocaleString('de-DE')} GC`],
      ['Reserved', `${dashboard.finance.reservedCash.toLocaleString('de-DE')} GC`],
      ['Available', `${dashboard.finance.availableCash.toLocaleString('de-DE')} GC`],
    ]);

    renderTable(
      inventoryPanel,
      [
        { key: 'resourceId', label: 'Resource' },
        { key: 'quantity', label: 'Qty' },
        { key: 'reserved', label: 'Reserved' },
        { key: 'available', label: 'Available' },
      ],
      dashboard.inventory.items,
      'Inventar ist leer.',
    );

    renderTable(
      buildingsPanel,
      [
        { key: 'name', label: 'Name' },
        { key: 'buildingTypeId', label: 'Type' },
        { key: 'statusCell', label: 'Status' },
        { key: 'position', label: 'Pos' },
      ],
      dashboard.buildings.map((building) => ({
        name: building.name,
        buildingTypeId: building.buildingTypeId,
        statusCell: renderConstructionCell(building),
        position: `${building.x}, ${building.y}`,
      })),
      'Noch keine Gebäude.',
    );

    renderTable(
      productionPanel,
      [
        { key: 'recipeId', label: 'Recipe' },
        { key: 'buildingId', label: 'Building' },
        { key: 'status', label: 'Status' },
        { key: 'progress', label: 'Progress' },
      ],
      dashboard.productionJobs.map((job) => ({
        recipeId: job.recipeId,
        buildingId: job.buildingId,
        status: job.status,
        progress: formatProgress(job.progress),
      })),
      'Keine laufende Produktion.',
    );

    if (dashboard.researchJobs.length === 0) {
      researchPanel.innerHTML =
        dashboard.completedResearch.length > 0
          ? `<p class="empty">Abgeschlossen: ${dashboard.completedResearch.join(', ')}</p>`
          : '<p class="empty">Keine laufende Forschung.</p>';
    } else {
      renderTable(
        researchPanel,
        [
          { key: 'technologyId', label: 'Technology' },
          { key: 'status', label: 'Status' },
          { key: 'progress', label: 'Progress' },
        ],
        dashboard.researchJobs.map((job) => ({
          technologyId: job.technologyId,
          status: job.status,
          progress: formatProgress(job.progress),
        })),
        'Keine laufende Forschung.',
      );
    }
  }

  renderTable(
    marketPanel,
    [
      { key: 'resourceId', label: 'Resource' },
      { key: 'lastPrice', label: 'Price' },
      { key: 'tradeVolume', label: 'Volume' },
    ],
    dashboard.marketPrices,
    'Keine Marktpreise geladen.',
  );

  const milestones = dashboard.milestones ?? [];

  milestonesPanel.innerHTML =
    milestones.length === 0
      ? '<li class="empty milestone-empty">Noch keine Meilensteine geladen.</li>'
      : milestones
          .map(
            (milestone) => `
              <li class="${milestone.completed ? 'milestone-done' : 'milestone-pending'}">
                <span class="milestone-name">${milestone.name}</span>
                <span class="milestone-id">${milestone.id}</span>
              </li>
            `,
          )
          .join('');

  updateActionButtons(dashboard);
}

async function refreshDashboard() {
  const dashboard = await api('/api/dashboard');
  renderDashboard(dashboard);
}

async function runAction(action, successMessage) {
  try {
    setStatus('Working…');
    await action();
    await refreshDashboard();
    setStatus(successMessage, 'success');
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Unexpected error.', 'error');
  }
}

function requireActiveSawmill() {
  const sawmill = findActiveSawmill(latestDashboard?.buildings ?? []);

  if (sawmill === undefined) {
    throw new Error('Kein aktives Sägewerk verfügbar. Bau abschließen und Ticks ausführen.');
  }

  return sawmill.id;
}

document.querySelector('#new-game-btn').addEventListener('click', () => {
  void runAction(
    () => api('/api/session/new', { method: 'POST', body: JSON.stringify({ name: 'Genesis Industries' }) }),
    'Neues Spiel gestartet.',
  );
});

document.querySelector('#save-btn').addEventListener('click', () => {
  void runAction(() => api('/api/session/save', { method: 'POST', body: '{}' }), 'Spielstand gespeichert.');
});

document.querySelector('#load-btn').addEventListener('click', () => {
  void runAction(() => api('/api/session/load', { method: 'POST', body: '{}' }), 'Spielstand geladen.');
});

document.querySelector('#tick-btn').addEventListener('click', () => {
  void runAction(() => api('/api/simulation/tick', { method: 'POST', body: '{}' }), 'Simulation tick ausgeführt.');
});

document.querySelector('#place-sawmill-btn').addEventListener('click', () => {
  void runAction(
    () =>
      api('/api/buildings/place', {
        method: 'POST',
        body: JSON.stringify({
          buildingTypeId: 'sawmill',
          name: 'Starter Sawmill',
          x: 0,
          y: 0,
        }),
      }),
    'Sägewerk in Bau gegeben.',
  );
});

document.querySelector('#place-warehouse-btn').addEventListener('click', () => {
  void runAction(
    () =>
      api('/api/buildings/place', {
        method: 'POST',
        body: JSON.stringify({
          buildingTypeId: 'warehouse',
          name: 'Main Warehouse',
          x: 2,
          y: 0,
        }),
      }),
    'Lager in Bau gegeben.',
  );
});

document.querySelector('#start-planks-btn').addEventListener('click', () => {
  void runAction(async () => {
    const buildingId = requireActiveSawmill();
    await api('/api/production/start', {
      method: 'POST',
      body: JSON.stringify({ buildingId, recipeId: 'recipe_planks' }),
    });
  }, 'Bretter-Produktion gestartet.');
});

document.querySelector('#start-advanced-planks-btn').addEventListener('click', () => {
  void runAction(async () => {
    const buildingId = requireActiveSawmill();
    await api('/api/production/start', {
      method: 'POST',
      body: JSON.stringify({ buildingId, recipeId: 'recipe_advanced_planks' }),
    });
  }, 'Premium-Bretter-Produktion gestartet.');
});

document.querySelector('#sell-wood-btn').addEventListener('click', () => {
  void runAction(
    () =>
      api('/api/market/sell', {
        method: 'POST',
        body: JSON.stringify({ resourceId: 'wood', amount: 5 }),
      }),
    'Holz verkauft.',
  );
});

document.querySelector('#start-woodworking-btn').addEventListener('click', () => {
  void runAction(
    () =>
      api('/api/research/start', {
        method: 'POST',
        body: JSON.stringify({ technologyId: 'basic_woodworking' }),
      }),
    'Forschung „Holzbearbeitung“ gestartet.',
  );
});

void refreshDashboard().catch((error) => {
  setStatus(error instanceof Error ? error.message : 'Dashboard konnte nicht geladen werden.', 'error');
});
