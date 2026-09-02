# Project Genesis

> **A data-driven, deterministic economy and industry simulation built with TypeScript.**

Project Genesis is a single-player economic simulation game focused on industrial production, logistics, research, energy management, and dynamic markets.

The project follows a **Documentation First** approach: architecture, gameplay design, and domain model are documented alongside implementation.

---

## Release Status

| Item | Status |
|------|--------|
| **Formal release candidate** | `v1.0.0-rc.1` @ `442665cd6437bdebff88fd1540cedc689238c240` |
| **Savegame certification** | PASS (M12.5) |
| **Performance validation** | PASS — qualitative contract (M12.6) |
| **Formal QA approval** | PASS (M12.7) |
| **Version 1.0** | **Not yet released** — pending Executive Review (M12.9) |

Package metadata remains `0.1.0` until the final release gate. Do not treat pre-release version numbers as the shipped product version.

---

## Repository Structure

```text
project-genesis/
├── apps/
│   ├── api/          NestJS simulation server (REST + WebSocket)
│   └── web/          Next.js UI
├── src/              Shared domain, application, infrastructure, simulation
├── game-content/     YAML/JSON gameplay definitions (required at runtime)
├── saves/            Session save files (created at runtime)
├── docs/             Architecture, gameplay, schemas, development guides
├── tests/            Shared test utilities and fixtures
└── tools/            Content validation and maintenance scripts
```

---

## Prerequisites

- **Node.js** ≥ 22
- **pnpm** 11.3.0 (see `packageManager` in root `package.json`)
- Repository cloned with `game-content/` present

---

## Installation

From the repository root:

```bash
pnpm install
```

---

## Development

Start both API and Web in development mode:

```bash
pnpm dev
```

| Process | Default URL |
|---------|-------------|
| Web | `http://127.0.0.1:3000` |
| API | `http://127.0.0.1:3001` |

Gameplay entry: `http://127.0.0.1:3000/game`

Individual processes:

```bash
pnpm dev:api    # API only
pnpm dev:web    # Web only
pnpm dev:stop   # Stop processes on ports 3000 and 3001
```

---

## Production / Release Candidate Runtime

For RC validation and production-style local play, use the **dual-runtime** path documented in:

**[`docs/development/RC_RUNTIME_CONTRACT.md`](docs/development/RC_RUNTIME_CONTRACT.md)**

Summary:

```bash
# 1. Build
pnpm test
pnpm build:web
pnpm --filter @project-genesis/api build

# 2. Start API (from apps/api, production module)
cd apps/api
set NODE_ENV=production          # PowerShell: $env:NODE_ENV="production"
pnpm start:prod

# 3. Start Web (second terminal, from repo root)
pnpm --filter @project-genesis/web start
```

**Web alone is insufficient** — the API must be running for gameplay.

Default ports: Web **3000**, API **3001**. Default save location: `saves/` at the monorepo root.

---

## Environment Variables

Local RC defaults work without a `.env` file. Optional overrides:

| Variable | Consumer | When | Default |
|----------|----------|------|---------|
| `NODE_ENV` | API | Runtime | unset (development); set `production` for compiled RC API |
| `HOST` | API | Runtime | `127.0.0.1` |
| `PORT` | API | Runtime | `3001` |
| `WEB_ORIGIN` | API CORS / WebSocket | Runtime | `http://127.0.0.1:3000` |
| `API_ORIGIN` | Next.js rewrites | **Build-time** | `http://127.0.0.1:3001` |
| `NEXT_PUBLIC_API_ORIGIN` | WebSocket client | **Build-time** | `http://127.0.0.1:3001` |

Rebuild the web app if you change `API_ORIGIN` or `NEXT_PUBLIC_API_ORIGIN`.

Full details: [`RC_RUNTIME_CONTRACT.md`](docs/development/RC_RUNTIME_CONTRACT.md)

---

## Testing

```bash
pnpm test              # Full regression suite (RC gate)
pnpm build:web         # Web production build (RC gate)
pnpm --filter @project-genesis/api build   # API production build (RC gate)
```

Root `pnpm build`, `pnpm typecheck`, and `pnpm lint` are **not** RC release gates.

Clear `NODE_ENV` before running tests if you previously started the API in production mode.

---

## Savegames

- **Location:** `saves/` (relative to monorepo root; default browser session: `browser-session.json`)
- **Current schema:** V3 (`schemaVersion: 3`)
- **Migration:** V1 and V2 saves are migrated sequentially to V3 on load
- **Not persisted:** session-scoped event log and UI notifications (by design)

Certification: [`M12_5_V1_SAVEGAME_COMPATIBILITY_STABILITY_CERTIFICATION_REPORT.md`](docs/architecture/reviews/M12_5_V1_SAVEGAME_COMPATIBILITY_STABILITY_CERTIFICATION_REPORT.md)

---

## Documentation

| Topic | Location |
|-------|----------|
| Full documentation tree | [`docs/`](docs/) |
| RC runtime contract | [`docs/development/RC_RUNTIME_CONTRACT.md`](docs/development/RC_RUNTIME_CONTRACT.md) |
| Testing strategy | [`docs/architecture/TESTING_STRATEGY.md`](docs/architecture/TESTING_STRATEGY.md) |
| Implementation progress | [`docs/development/IMPLEMENTATION_PROGRESS.md`](docs/development/IMPLEMENTATION_PROGRESS.md) |
| V1 release notes (draft) | [`docs/releases/V1_0_RELEASE_NOTES.md`](docs/releases/V1_0_RELEASE_NOTES.md) |
| Known issues | [`docs/releases/V1_0_KNOWN_ISSUES.md`](docs/releases/V1_0_KNOWN_ISSUES.md) |
| M12 certification reports | [`docs/architecture/reviews/`](docs/architecture/reviews/) |

---

## Browser Support

Formal QA (M12.7) validated **Cursor embedded Chromium** as the release browser environment. No universal browser compatibility matrix is established for V1. Use Chromium-class browsers for the most reliable experience.

---

## Technology

- TypeScript, Node.js ≥ 22, pnpm 11.3.0
- **Web:** Next.js 15, React 19
- **API:** NestJS (compiled production path)
- **Tests:** Vitest

See [`docs/architecture/technology-stack.md`](docs/architecture/technology-stack.md) for details.

---

## License

See the [`LICENSE`](LICENSE) file.
