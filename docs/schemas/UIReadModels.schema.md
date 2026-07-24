# UI Read Models and View Data

Version: 1.0  
Status: Active (M9 Phase 11)

---

# Purpose

Documents the read-side contracts consumed by the M9 presentation layer.

The UI never reads domain aggregates directly. Data flows:

```text
Application query handler
  → read model DTO (`src/application/read-models/*`)
  → NestJS API route (`apps/api/src/game/game.controller.ts`)
  → presentation adapter (`apps/web/src/presentation/adapters/api/*`)
  → mapper (`apps/web/src/presentation/adapters/mappers/*`)
  → view data (`apps/web/src/presentation/adapters/view-data/*`)
  → screen component
```

---

# Application Read Models

| Read model | Query route | Primary screens |
| ---------- | ----------- | --------------- |
| `SessionStatusReadModel` | `GET /api/session/status` | Shell, menu |
| `SimulationStatusReadModel` | `GET /api/simulation/status` | Simulation controls |
| `SaveMetadataReadModel` | `GET /api/saves` | Main menu, reports |
| `CompanyReadModel` | `GET /api/company` | Company overview |
| `BuildingReadModel` | `GET /api/buildings` | Buildings, production |
| `InventoryReadModel` | `GET /api/inventory` | Market, production |
| `FinanceReadModel` | `GET /api/finance` | Finance, company |
| `FinanceTransactionReadModel` | `GET /api/finance/transactions` | Finance, reports |
| `MarketPriceReadModel` | `GET /api/markets/prices` | Markets |
| `WorldOverviewReadModel` | `GET /api/world/overview` | World |
| `RegionReadModel` | `GET /api/world/regions` | World |
| `RegionDetailsReadModel` | `GET /api/world/regions/:id` | Region detail |
| `WorldMapReadModel` | `GET /api/world/map` | World |
| `CityReadModel` | `GET /api/world/cities` | World |
| `EventLogEntryReadModel` | `GET /api/events/log` | Reports |
| `GameSessionDashboard` | `GET /api/dashboard` | Legacy company dashboard aggregate |

Transport and production job rows are exposed through dedicated list routes:

- `GET /api/production/jobs`
- `GET /api/research/jobs`
- `GET /api/transport/orders`

---

# Presentation View Data

Screens consume immutable view-data types instead of raw API payloads.

| View data module | Consumers |
| ---------------- | --------- |
| `workspace-view-data.ts` | `GameWorkspaceProvider`, shell |
| `company-dashboard-view-data.ts` | Company dashboard, buildings, production, research |
| `company-overview-view-data.ts` | Company overview |

Mappers translate read models into UI-friendly labels, formatted numbers, and hint collections.

---

# Commands

All mutations use POST routes on the NestJS adapter. Screens call typed clients in `apps/web/src/presentation/adapters/api/`.

Examples:

- `POST /api/session/new|save|load`
- `POST /api/simulation/pause|resume|speed|step|tick`
- `POST /api/market/buy|sell`
- `POST /api/buildings/place`
- `POST /api/production/start`
- `POST /api/research/start`

---

# Related Documents

- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/development/UI_DEVELOPMENT_GUIDE.md`
- `docs/schemas/GameSaveSnapshotV3.schema.md`
