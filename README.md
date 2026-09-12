# ShopLite E-commerce

A full-stack e-commerce storefront reproducing the **SHOP.CO** Figma template with high design-token
fidelity.

- **Frontend** — Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · React Query + Zustand · MSW (mock-first)
- **Backend** — FastAPI · Pydantic v2 · SQLAlchemy 2.0 (async) · PostgreSQL · Alembic
- **Infra** — Docker Compose · GitLab CI

## Docs

- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — tokens extracted from Figma + component specs
- [`docs/PROJECT_REQUIREMENTS.md`](docs/PROJECT_REQUIREMENTS.md) — functional/NFR scope, API contract, data model
- [`docs/design/screens/`](docs/design/screens) — reference renders
- [`.opencode/skills/figma-to-nextjs-tailwind.md`](.opencode/skills/figma-to-nextjs-tailwind.md) — codegen rules

## Development

```bash
# frontend (mock API via MSW, no backend needed)
cd frontend && pnpm install && pnpm dev

# full stack
docker compose up
```

## Structure

```
frontend/   Next.js app (src/app, components, lib, mocks, stores, styles)
backend/    FastAPI app (api, core, models, schemas, services, db) + alembic + tests
docs/       design system, requirements, reference screens
```
