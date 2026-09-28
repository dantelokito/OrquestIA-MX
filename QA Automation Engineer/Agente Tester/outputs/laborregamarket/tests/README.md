# LaBorregaMarket — Suite QA Playwright

Playwright API + E2E tests for LaBorregaMarket (F1–F10).

## Quick start

```bash
# 1. Start the app (separate terminal)
cd C:\Users\PC GAMER\LaBorregaMarket
npx prisma migrate deploy
npx prisma db seed
npm run dev   # http://127.0.0.1:8080 — CI should use npm start

# 2. Run tests
cd outputs/laborregamarket/tests
cp .env.test.example .env.test
npm install
npx playwright install --with-deps
npx playwright test
```

F10: `UPLOADS_DIR` (default `./uploads`). Parar `next dev` antes de `prisma migrate deploy`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Full suite (API + E2E) |
| `npm run test:api` | API only (no browser) |
| `npm run test:e2e` | E2E with Chromium |
| `npm run report` | Open HTML report |

## Structure

```
tests/
├── api/              # API integration F1–F10
│   ├── admin-products.spec.ts
│   ├── local-products.spec.ts
│   ├── sections.spec.ts
│   ├── media.spec.ts
│   └── …
├── e2e/              # UI flows
│   ├── provider-catalog-f10.spec.ts
│   ├── fruteria-sections.spec.ts
│   ├── admin-catalog-f10.spec.ts
│   ├── dashboard-reports.spec.ts
│   ├── cart-uuid.spec.ts   # BUG-015 stub randomUUID
│   └── pages/        # Page Object Model
└── fixtures/         # auth, orders, geo, catalog, f10
```

See `../comun/TEST_PLAN.md` and `../historial/OBSERVABILITY.md` for full QA documentation.
