# Variables de Entorno QA: laborregamarket

> Documento generado para handoff a **DevOps** y configuración del ambiente de pruebas.

---

## Tabla de variables

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `PLAYWRIGHT_BASE_URL` | Sí | URL base app Next.js | `http://127.0.0.1:8080` |
| `QA_CLIENT_EMAIL` | Sí | Usuario CLIENT seed | `cliente@demo.mx` |
| `QA_CLIENT_PASSWORD` | Sí | Password demo | `Demo1234!` |
| `QA_PROVIDER_EMAIL` | Sí | Usuario PROVIDER seed N>1 | `frutas@elparaiso.mx` |
| `QA_PROVIDER_PASSWORD` | Sí | Password demo | `Demo1234!` |
| `QA_PROVIDER_N1_EMAIL` | Sí (F11) | PROVIDER N=1 Campo Verde | `verduras@campoverde.mx` |
| `QA_PROVIDER_N1_PASSWORD` | Sí (F11) | Password demo | `Demo1234!` |
| `QA_ADMIN_EMAIL` | Sí | Usuario ADMIN seed | `admin@laborregamarket.mx` |
| `QA_ADMIN_PASSWORD` | Sí | Password demo | `Demo1234!` |
| `PLAYWRIGHT_HEADLESS` | No | Headless en CI | `true` |
| `PLAYWRIGHT_TIMEOUT_MS` | No | Timeout global | `30000` |
| `DATABASE_URL` | Sí* | PostgreSQL (app, no tests) | `postgresql://...` |
| `JWT_SECRET` | Sí* | Secreto JWT app | min 32 chars |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | **No** requerida para `/explorar` (F5 Leaflet/OSM). Embed Google reseñas F4 sigue independiente | — |
| `NEXT_PUBLIC_OSM_TILE_URL` | No | Teselas OSM; default CDN OpenStreetMap | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` |
| *(F8)* | — | Fase 8 **no agrega** variables. Clamp 0.5–10 y `MEXICO_BOUNDS` son código, no env. Cookie `lbm_token` es `Secure` si `NODE_ENV=production` (`npm start`): la suite API reenvía el token en header `Cookie` | — |
| `UPSTASH_REDIS_*` | No (local) | Rate limit contacto; local in-memory | staging/prod |
| `INNGEST_*` | No (local) | Cola emails; no bloquea HTTP | staging |
| `UPLOADS_DIR` | Sí (F10) | Directorio de imágenes en disco (`CO-F10-002`). Default app `./uploads`. **No** `CLOUDINARY_*` Must | `./uploads` |
| `CLOUDINARY_*` | No | Won't F10 — uploads nuevos van a disco | — |

\* Requeridas para levantar la aplicación bajo prueba, no para el runner Playwright directamente.

---

## Pre-requisitos ambiente local

```bash
# 1. App LaBorregaMarket
cd C:\Users\PC GAMER\LaBorregaMarket
cp .env.example .env
npm install
npx prisma migrate deploy   # F14 20260918010000_f14_inventory_entry_kind (parar next si EPERM en prisma generate)
npx prisma db seed
npm run dev   # http://127.0.0.1:8080
# F10: UPLOADS_DIR=./uploads (gitignore). Cloudinary no Must.
# CI: npm run build && npm start (no next dev bajo workers)

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
      PLAYWRIGHT_BASE_URL: http://127.0.0.1:8080
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
