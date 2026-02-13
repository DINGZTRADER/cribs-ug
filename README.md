# Crib-UG - Phase 1 Scaffold

This repository has been scaffolded as a Turborepo + pnpm monorepo with:

- apps/api (NestJS-oriented backend skeleton)
- apps/mobile (Expo React Native skeleton)
- packages/database (Prisma schema + client)
- packages/types (shared DTOs)
- packages/tsconfig and packages/eslint-config (shared tooling)
- docker-compose.yml (Postgres with PostGIS + Redis)

## Next commands

1. pnpm install
2. docker-compose up -d
3. pnpm --filter @repo/database generate
4. pnpm --filter @repo/database migrate:dev

