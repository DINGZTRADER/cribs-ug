# Runbook

## Prerequisites
- Node.js 24.x
- pnpm 9.x
- Docker Desktop running
- PostgreSQL container available on `localhost:5432`

## Initial Setup
1. Install dependencies:
```powershell
pnpm install --no-frozen-lockfile --config.confirmModulesPurge=false
```
2. Database env:
- `packages/database/.env`
```env
DATABASE_URL="postgresql://rentflow:rentflow@localhost:5432/rentflow_db?schema=public"
```
- `apps/api/.env` minimum:
```env
DATABASE_URL="postgresql://rentflow:rentflow@localhost:5432/rentflow_db?schema=public"
JWT_SECRET="dev_secret_key_change_in_prod"
PORT=3000
DEV_SEED_KEY="your-dev-seed-key"
```

## Database Lifecycle
1. Create/apply migrations:
```powershell
pnpm --filter @repo/database run migrate:dev
```
2. Generate Prisma client:
```powershell
pnpm --filter @repo/database run generate
```

## Build and Test
1. Build all:
```powershell
pnpm build
```
2. Test all:
```powershell
pnpm test
```
3. Run opt-in integration tests (DB required):
```powershell
$env:RUN_INTEGRATION_TESTS='1'
pnpm --filter api test
```

## Run API
```powershell
pnpm --filter api run dev
```

## Demo-Safe Mode
Use demo-safe mode when sharing locally with a client.

1. Prepare demo env:
- Copy `apps/api/.env.demo.example` to `apps/api/.env.demo`.
- Keep `ENABLE_DEV_ENDPOINTS=0` unless you explicitly need `/dev/*`.

2. Start in demo-safe mode:
```powershell
pnpm demo:start
```

3. Mobile demo env:
- Copy `apps/mobile/.env.demo.example` to `apps/mobile/.env`.
- Set `EXPO_PUBLIC_API_URL` to your reachable local/tunnel URL.

## Seed Dev Search Data
Call:
- `POST /dev/seed/search-data`
- Header: `x-dev-seed-key: <DEV_SEED_KEY>`

Note:
- `/dev/seed/*` routes are loaded only when both are true:
  - `NODE_ENV != production`
  - `ENABLE_DEV_ENDPOINTS=1`

## Sanity Check Sequence
1. `POST /auth/register`
2. `POST /auth/login`
3. `POST /dev/seed/search-data`
4. `GET /search/nearby?lat=0.3476&lng=32.5825&radius=5000`
5. `GET /subscriptions/unlock/:propertyId` with Bearer token

Expected unlock result for free user:
- `allowed=false`
- `upsell.recommendedTier=budget` (for lower rent properties)

## Troubleshooting
1. `No driver (HTTP) selected`:
- Ensure `@nestjs/platform-express` is installed.

2. `Cannot find module '.prisma/client/default'`:
- Run:
```powershell
pnpm --filter @repo/database run generate
```

3. `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`:
- Inspect the next error lines; this is a wrapper error.

4. `P3006/P1014` migration issues in dev:
- Reset migration history and recreate initial migration from current schema.

5. `binaries.prisma.sh` fetch failures:
- Network/proxy/SSL issue. Retry in a network with Prisma binary access.
