# Variables de Entorno QA: laborregamarket

> Documento generado para handoff a **DevOps** y configuración del ambiente de pruebas.

---

## Tabla de variables

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `PLAYWRIGHT_BASE_URL` | Sí | URL base app Next.js | `http://localhost:3000` |
| `QA_CLIENT_EMAIL` | Sí | Usuario CLIENT seed | `cliente@demo.mx` |
| `QA_CLIENT_PASSWORD` | Sí | Password demo | `Demo1234!` |
| `QA_PROVIDER_EMAIL` | Sí | Usuario PROVIDER seed | `frutas@elparaiso.mx` |
| `QA_PROVIDER_PASSWORD` | Sí | Password demo | `Demo1234!` |
| `QA_ADMIN_EMAIL` | Sí | Usuario ADMIN seed | `admin@laborregamarket.mx` |
| `QA_ADMIN_PASSWORD` | Sí | Password demo | `Demo1234!` |
| `PLAYWRIGHT_HEADLESS` | No | Headless en CI | `true` |
| `PLAYWRIGHT_TIMEOUT_MS` | No | Timeout global | `30000` |
| `DATABASE_URL` | Sí* | PostgreSQL (app, no tests) | `postgresql://...` |
| `JWT_SECRET` | Sí* | Secreto JWT app | min 32 chars |

\* Requeridas para levantar la aplicación bajo prueba, no para el runner Playwright directamente.

---

## Pre-requisitos ambiente local

```bash
# 1. App LaBorregaMarket
cd C:\Users\PC GAMER\LaBorregaMarket
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev   # http://localhost:3000

# 2. Suite QA (otra terminal)
cd "...\Agente Tester\outputs\laborregamarket\tests"
cp .env.test.example .env.test
npm install
npx playwright install --with-deps
npx playwright test
```

---

## Comandos CI/CD

```yaml
# Ejemplo GitHub Actions (fragmento)
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: laborregamarket

steps:
  - name: Setup app
    run: |
      cd LaBorregaMarket
      npm ci
      npx prisma migrate deploy
      npx prisma db seed
      npm run build
      npm run start &
  - name: Run Playwright
    run: |
      cd qa-tests
      npm ci
      npx playwright install --with-deps
      npx playwright test --reporter=html
    env:
      PLAYWRIGHT_BASE_URL: http://localhost:3000
```

---

## Datos de prueba (seeds)

| Entidad | Descripción | Origen |
|---------|-------------|--------|
| Admin | `admin@laborregamarket.mx` | `prisma/seed.ts` |
| Cliente | `cliente@demo.mx` | `prisma/seed.ts` |
| Proveedor | `frutas@elparaiso.mx` + Provider | `prisma/seed.ts` |
| 3 fruterías | Monterrey con productos | `prisma/seed.ts` |
| 15 productos globales | Catálogo FRUTA/VERDURA/AGRICOLA | `prisma/seed.ts` |

---

## Notas de seguridad

- No commitear `.env.test` con secretos reales en repos públicos.
- Usar GitHub Secrets para credenciales en CI.
- Rotar `JWT_SECRET` por ambiente.
