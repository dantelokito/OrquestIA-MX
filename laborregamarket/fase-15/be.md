# F15 · BE — Legal, consentimiento y caché pública

Fecha: 2026-10-03 · Insumo: `fase-15/arch.md` (ADR-042, ADR-043, ADR-044)

## Entregables

Rama `feat/f15-legal-cache` (sobre `caaedba`). Commits: `25579c3` schema y seed legal, `45dd7e9` API-LEGAL y registro, `d135f88` alta de negocio, opt-in WhatsApp y purga de IP, `7770e1a` tipos de tests, `9e06be4` cache-aside e invalidación, `7f9961a` tests de caché. HEAD `7f9961a`.

Migraciones: `20261003000000_f15_legal_module_enum`, `20261003000100_f15_legal_consent`. Seed: `npm run db:seed:legal`.

Endpoints (sin versión de API, envelope ADR-003):

- API-LEGAL-01…05: `GET /api/legal/current`; `GET|PUT /api/admin/legal/settings`; `GET|POST /api/admin/legal/documents`.
- API-AUTH-15-01: `POST /api/auth/register` exige `acceptLegal: true`, `termsVersion`, `privacyVersion`.
- API-PROV-15-01 / 02: `POST /api/providers` (`acceptTerms`, `termsVersion`, `whatsappOrderOptIn`); `GET|PATCH /api/provider/me` expone y edita `whatsappOrderOptIn`.
- API-NOTIFY-15-01: el worker omite WhatsApp si `whatsappOrderOptIn` es false y no escribe `notificationFailed`.
- API-CONSENT-15-01: `GET /api/auth/session` agrega `pendingConsents`; `POST /api/auth/consents`.
- API-AUDIT-15-01: función Inngest `audit-ip-purge` (cron `0 9 * * *` UTC).
- API-CACHE-15-01: `GET /api/providers` y `GET /api/providers/[id]` con `X-Cache: HIT|MISS|BYPASS`. TTL 30 s listado / 60 s detalle. `lat`/`lng` redondeados a 3 decimales antes de filtrar y calcular. Fail-open. `PUBLIC_CACHE_DISABLED=1` o sin `UPSTASH_*` → BYPASS.

`/legal` ya está en `PUBLIC_PATHS` de `src/middleware.ts` (la ruta y todo `/legal/*`).

## Para el siguiente rol

**FE:**

- Campo de opt-in de pedidos: `whatsappOrderOptIn` (boolean) en `POST /api/providers`, `PATCH /api/provider/me` y el DTO de perfil (`GET /api/provider/me`). No es `whatsappEnabled`. Default `false`. `true` fija `whatsappOrderOptInAt`; volver a `false` lo pone en `null`.
- Registro: `acceptLegal`, `termsVersion`, `privacyVersion`. Alta de negocio: `acceptTerms`, `termsVersion`. 400 con `details[].field`. Sin documento vigente: 503 (`Registro temporalmente no disponible` / `Alta de negocio temporalmente no disponible`).
- `GET /api/legal/current` → `{ settings, documents: [{ type, version, title, effectiveAt }] }`, `Cache-Control: no-store`. Slugs: `privacidad`, `terminos`, `cookies`. `getPublicLegalSettings()` y `getCurrentDocument()` están en `src/lib/services/legal.service.ts` para el footer server.
- `GET /api/auth/session` → `pendingConsents: [{ type, version, title }]`. `POST /api/auth/consents` body `{ documents: [{ type, version }] }` (1–2), 201 `{ data: { pendingConsents } }`.
- Domicilio del responsable en admin: un solo campo `address`.
- Explorar: el servidor redondea `lat`/`lng` a 3 decimales antes de Haversine. El body de listado y detalle no cambia; solo se agrega `X-Cache`.
- Llave `localStorage["lbm_measurement"]` es de FE (ADR-044). BE no la lee ni la escribe. Umami: `NEXT_PUBLIC_UMAMI_*` en `.env.example`.
- Serwist (`src/app/sw.ts`, allowlist, sin `defaultCache`) queda en FE. Logout/login con navegación dura también.
- `/`, `/login`, `/registro`, `/registro/negocio`, `/legal/[slug]`: `dynamic = "force-dynamic"`.

**QA:**

- Sin Redis o con `PUBLIC_CACHE_DISABLED=1`, los GET públicos responden 200 y `X-Cache: BYPASS`. Con Redis: primer GET `MISS`, el siguiente `HIT`; un PATCH de precio, archivo, sección, ficha o reseña deja el detalle en `MISS` y sube la generación del listado.
- `q` de 1 carácter → 400 y no escribe caché. `GET /api/catalogs` sigue siendo ADMIN y no se cachea.
- Tras `db:seed:legal`, el registro y el alta exigen la versión vigente. Sin seed, 503.
- `whatsappOrderOptIn: false` no dispara WhatsApp ni `notificationFailed`.

## Pendientes

Ninguno para BE. Revisión legal de los textos v1 antes de producción — Humano. `db:seed:legal` y variables Umami por entorno — DevOps. Service worker — FE.

## Verificación

Re-ejecutada el 2026-10-07 en `feat/f15-legal-cache` @ `bdc0301` (sin cambio de código de estos bugs). `next.config.ts` local con `allowedDevOrigins` de LAN se dejó fuera: el test `security-headers` exige solo `localhost`.

- `npx prisma generate` — exit 0 (Prisma Client v6.19.3; el primer intento dio EPERM con `next start` en 8080; se detuvo y se reintentó).
- `npx tsc --noEmit` — exit 0.
- `npm run lint` — exit 0 (warnings previos; 0 errores).
- `npm test` — exit 0. 89 archivos, 446 tests.
- `npm run build` — exit 0 (Next.js 15.5.22).

## Bugs

Ninguno.

## Fixes

| BUG | Archivos | Commit | Re-prueba local |
|-----|----------|--------|-----------------|
| BUG-025 | `src/app/api/provider/media/route.ts`, `src/lib/services/media.service.ts`, `src/lib/cache/public-cache.ts` | Sin cambio de contrato. `media.service.ts` idéntico a `1aeac1c`. | No corregido. `invalidateProviderCache` corre solo después de `uploadProviderMedia` y no lanza (el `catch` interno registra el fallo de Redis). El tamaño se valida antes, en `validateAndStore`: `MediaValidationError` → 400 ADR-003 `{ error: "Validation failed", details: [{ field: "file", message: "El archivo supera el límite de 20MB" }] }`. El 500 ocurre antes de esa validación: Next 15.5.22 clona el body del middleware con `middlewareClientMaxBodySize` por defecto `10485760` (`config-shared.js`). Un POST de 20 MiB+1 se trunca, `request.formData()` falla y `handleRouteError` responde 500. El matcher de `middleware.ts` ya incluía `/api/` en `1aeac1c`; F15 solo añadió `/legal` a `PUBLIC_PATHS`. Esta rama no lo introdujo. |
| BUG-026 | `src/app/api/admin/providers/[id]/route.ts`, `src/lib/services/provider.service.ts` | Sin cambio de contrato. El `return` de `updateAdminProvider` es el de `1aeac1c`. | No corregido. F15 solo inserta `invalidateProviderCache([id])` antes de `ok(updated)`. El DTO ya devolvía `id`, `businessName`, `isVerified`, `isActive`, `offersWholesale`, `offersDelivery`, `googleReviewsEnabled`, `verifiedAt`. `primaryColor` y `secondaryColor` se seleccionan para el audit y no salen en el cuerpo, así que `body.data.primaryColor` queda `undefined` con 200. Igual en TC-RBAC-028 (`isVerified: false`). Esta rama no lo introdujo. |
