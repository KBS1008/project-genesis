# RC Runtime Contract

**Project:** Project Genesis  
**Version:** 0.1.0 (pre-release)  
**Status:** Active — M12.1 Dual-Runtime RC Contract  
**Last Updated:** 2026-08-30

---

# Purpose

This document defines the **smallest authoritative dual-runtime contract** for running a local Release Candidate (RC) of Project Genesis.

It covers prerequisites, build commands, production-style startup, environment variables, required filesystem layout, and smoke validation.

This is **not** a deployment guide. No Docker, CI, or hosting configuration is defined here.

---

# Runtime Topology

Project Genesis RC requires **two processes**:

| Process | Package | Default Port | Role |
|---------|---------|-------------:|------|
| **Web** | `@project-genesis/web` | 3000 | Next.js UI; proxies `/api/*` to API |
| **API** | `@project-genesis/api` | 3001 | NestJS simulation server (REST + WebSocket) |

Additionally required on disk (not separate processes):

| Path | Role |
|------|------|
| `game-content/` | YAML/JSON gameplay definitions loaded by API |
| `saves/` | Session persistence directory |

**Web alone is insufficient** for gameplay.

---

# Prerequisites

- **Node.js** ≥ 22 (`package.json` `engines`)
- **pnpm** 11.3.0 (`packageManager` in root `package.json`)
- Repository cloned with `game-content/` present
- `pnpm install` completed at repository root

---

# Build

From repository root:

```bash
pnpm build:web
pnpm --filter @project-genesis/api build
```

| Command | Output |
|---------|--------|
| `pnpm build:web` | `apps/web/.next/` (Next.js production bundle) |
| `pnpm --filter @project-genesis/api build` | `apps/api/dist/` (compiled JS; entry `dist/apps/api/src/main.js`) |

Root `pnpm build` is **not** an RC gate — it compiles dev tooling and tests separately.

---

# Production-Style Startup

Do **not** use `pnpm dev` for RC validation.

## 1. Start API (compiled production path)

From repository root:

```bash
cd apps/api
set NODE_ENV=production
pnpm start:prod
```

Linux/macOS:

```bash
cd apps/api
NODE_ENV=production pnpm start:prod
```

Equivalent:

```bash
NODE_ENV=production node apps/api/dist/apps/api/src/main.js
```

(cwd for path resolution: run from `apps/api/` so compiled `import.meta.url` resolves monorepo root via `game-content/` marker)

## 2. Start Web (production build)

In a second terminal, from repository root:

```bash
pnpm --filter @project-genesis/web start
```

Opens at `http://127.0.0.1:3000`. Gameplay entry: `http://127.0.0.1:3000/game`.

---

# Environment Variables

| Variable | Consumer | Build / Runtime | Default | Required for Local RC? |
|----------|----------|-----------------|---------|:---------------------:|
| `API_ORIGIN` | Next.js rewrites (`next.config.ts`) | **Build-time** for `next build` | `http://127.0.0.1:3001` | No (default OK) |
| `NEXT_PUBLIC_API_ORIGIN` | WebSocket client (`dashboard-socket.ts`) | **Build-time** (inlined by Next.js) | `http://127.0.0.1:3001` | No (default OK) |
| `HOST` | API bind address (`main.ts`) | Runtime | `127.0.0.1` | No |
| `PORT` | API listen port (`main.ts`) | Runtime | `3001` | No |
| `WEB_ORIGIN` | API CORS / WS origin (`main.ts`, gateway) | Runtime | `http://127.0.0.1:3000` | No |
| `NODE_ENV` | API root module selection; dev route guard | Runtime | unset (development) | **Yes** — set to `production` for compiled RC API |

No `.env.example` exists yet. Set variables explicitly in shell when non-default values are needed.

**Rebuild web** if you change `API_ORIGIN` or `NEXT_PUBLIC_API_ORIGIN` — both are resolved at build time.

---

# Required Runtime Layout

The API resolves the monorepo root by walking up from its module location until `game-content/` is found.

```text
project-genesis/          ← monorepo root (must contain game-content/)
├── game-content/         ← required
├── saves/                ← created/used at runtime (default file: browser-session.json)
├── apps/
│   ├── api/
│   │   └── dist/         ← compiled API (after build)
│   └── web/
│       └── .next/        ← compiled web (after build:web)
└── src/                  ← shared domain/application (compiled into api/dist/src/)
```

- **Working directory:** API production start should run from `apps/api/` (matches `start:prod` script).
- **Save path:** `saves/browser-session.json` (relative to monorepo root).
- **Missing saves directory:** API/session bootstrap creates save on first save; directory should exist or be creatable.

---

# Development vs Production API Paths

| Mode | Command | Module | Mechanism |
|------|---------|--------|-----------|
| Development | `pnpm dev:api` / `pnpm start` | `AppDevModule` (includes dev tooling routes) | `tsx src/main.dev.ts` executes TypeScript source |
| **RC / Production** | `NODE_ENV=production pnpm start:prod` | `AppModule` (gameplay only) | `node` executes compiled `dist/` |

Dev-only routes (`/api/dev/visual-assets`, `/api/dev/svg-generator`) return **403 Forbidden** when `NODE_ENV=production`.

---

# Smoke Validation Checklist

## Automated (before manual smoke)

```bash
pnpm test
pnpm build:web
pnpm --filter @project-genesis/api build
```

## Manual (production-style dual runtime)

1. Start API with `NODE_ENV=production` + `start:prod`
2. Start web with `next start`
3. Open `http://127.0.0.1:3000/game`
4. Start or load a playable session
5. Confirm simulation ticks advance (≥ 10 ticks)
6. Navigate Company / World / Production
7. Execute one normal gameplay command (e.g. simulation step or building placement)
8. Save session
9. Load session
10. Confirm restored state; simulation continues

## Regression guards (viewport 1236 × 697)

- No tick-driven full-screen loading flicker
- No reconnect oscillation / permanent stale banner
- No dashboard widget overlap or KPI clipping

---

# RC Gate Summary

| Command / Check | RC Gate? |
|-----------------|----------|
| `pnpm test` | **Yes** |
| `pnpm build:web` | **Yes** |
| `pnpm --filter @project-genesis/api build` | **Yes** |
| Dual-process production-style smoke | **Yes** |
| `pnpm build` (root) | No |
| `pnpm typecheck` (root) | No |
| `pnpm lint` (root) | No |

---

# Related Documents

- `docs/architecture/reviews/M12_RELEASE_PREPARATION_ENTRY_AUDIT.md`
- `docs/project-management/MILESTONE_PLAN.md`
- `docs/project-management/QUALITY_GATES.md`
- `docs/project-management/RELEASE_STRATEGY.md`
