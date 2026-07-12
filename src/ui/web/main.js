const statusMessage = document.querySelector('#status-message');
const tickLabel = document.querySelector('#tick-label');
const timeLabel = document.querySelector('#time-label');
const companyPanel = document.querySelector('#company-panel');
const financePanel = document.querySelector('#finance-panel');
const inventoryPanel = document.querySelector('#inventory-panel');
const buildingsPanel = document.querySelector('#buildings-panel');
const marketPanel = document.querySelector('#market-panel');
const milestonesPanel = document.querySelector('#milestones-panel');

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
                ${columns.map((column) => `<td>${row[column.key]}</td>`).join('')}
              </tr>
            `,
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function renderDashboard(dashboard) {
  tickLabel.textContent = `Tick ${dashboard.tickNumber}`;
  timeLabel.textContent = `Time ${dashboard.simulationTime}`;

  if (!dashboard.company) {
    renderKeyValues(companyPanel, [['Status', 'Kein aktives Spiel']]);
    renderKeyValues(financePanel, [['Status', '—']]);
    inventoryPanel.innerHTML = '<p class="empty">Inventar erscheint nach Spielstart.</p>';
    buildingsPanel.innerHTML = '<p class="empty">Noch keine Gebäude.</p>';
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
        { key: 'status', label: 'Status' },
        { key: 'position', label: 'Pos' },
      ],
      dashboard.buildings.map((building) => ({
        name: building.name,
        buildingTypeId: building.buildingTypeId,
        status: building.status,
        position: `${building.x}, ${building.y}`,
      })),
      'Noch keine Gebäude.',
    );
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

  milestonesPanel.innerHTML =
    dashboard.completedMilestones.length === 0
      ? '<li class="empty" style="list-style:none;border:none;color:var(--muted)">Noch keine Meilensteine.</li>'
      : dashboard.completedMilestones.map((milestone) => `<li>${milestone}</li>`).join('');
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

document.querySelector('#new-game-btn').addEventListener('click', () => {
  void runAction(
    () => api('/api/session/new', { method: 'POST', body: JSON.stringify({ name: 'Genesis Industries' }) }),
    'Neues Spiel gestartet.',
  );
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

void refreshDashboard().catch((error) => {
  setStatus(error instanceof Error ? error.message : 'Dashboard konnte nicht geladen werden.', 'error');
});
