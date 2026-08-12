# LaBorregaMarket — Suite QA Playwright

Playwright API + E2E tests for LaBorregaMarket MVP.

## Quick start

```bash
# 1. Start the app (separate terminal)
cd C:\Users\PC GAMER\LaBorregaMarket
npm run dev

# 2. Run tests
cd outputs/laborregamarket/tests
cp .env.test.example .env.test
npm install
npx playwright install --with-deps
npx playwright test
```

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
├── api/           # API integration (40 tests)
├── e2e/           # UI flows (13 tests)
│   └── pages/     # Page Object Model
└── fixtures/      # Auth helpers, test data
```

See `../TEST_PLAN.md` and `../OBSERVABILITY.md` for full QA documentation.
