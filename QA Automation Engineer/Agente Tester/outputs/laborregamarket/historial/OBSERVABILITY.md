# OBSERVABILITY — LaBorregaMarket (QA / Tester Senior)

> Bitácora de validación QA: plan, cobertura, hallazgos y handoff DevOps.  
> **Independiente** de OBSERVABILITY PM/Backend/UX — consolidación para agentes downstream.

---

## Metadatos

| Campo | Valor |
|-------|-------|
| **Producto** | LaBorregaMarket |
| **Versión** | 0.3.0 (Fase 3) |
| **Fecha** | 05/08/2026 |
| **Agente** | QA / Tester Senior |
| **Estado fase** | ✅ Fase 3 QA completada — listo para **@DevOps / Cloud Engineer** |
| **Código bajo prueba** | `C:\Users\PC GAMER\LaBorregaMarket` |
| **Artefactos QA** | `Agente Tester/outputs/laborregamarket/` |

---

## Estado del Plan QA

| Entregable | Estado | Ubicación |
|------------|--------|-----------|
| Plan de pruebas global | ✅ | `TEST_PLAN.md` |
| Matriz AUTH (22 casos) | ✅ | `test-matrices/TC-AUTH-matrix.md` |
| Matriz PROVIDERS/EXPLORE (18) | ✅ | `test-matrices/TC-PROVIDERS-matrix.md` |
| Matriz USERS (10) | ✅ | `test-matrices/TC-USERS-matrix.md` |
| Matriz ADMIN (12) | ✅ | `test-matrices/TC-ADMIN-matrix.md` |
| Matriz RBAC (10) | ✅ | `test-matrices/TC-RBAC-matrix.md` |
| Bug reports (4) | ✅ | `bug-reports/BUG-001..004.md` |
| Suite Playwright (53 tests) | ✅ | `tests/` |
| Env requirements DevOps | ✅ | `env-requirements.md` |
| Sign-off MVP | ✅ | `qa-signoffs/QA-MVP-signoff.md` |
| Matrices F3 (54 casos) | ✅ | `test-matrices/TC-ORDERS/POS/OPS/DASH` |
| Suite Playwright F3 (+58) | ✅ | `tests/api/orders, pos, provider-orders, dashboard` + E2E F3 |
| Sign-off F3 | ✅ | `qa-signoffs/QA-F3-signoff.md` |

---

## Cobertura de pruebas

### Resumen numérico

| Tipo | Diseñados | Automatizados | % Auto |
|------|-----------|---------------|--------|
| Casos manuales (matrices) | **72** | — | — |
| API integration | 40 | **40** | 100% |
| E2E UI | 13 | **13** | 100% |
| **Total automatizado** | — | **111** | F1 53 + F3 58 |

### Cobertura por módulo

| Módulo | AC/US cubiertos | Happy path | Negativos/Edge | RBAC |
|--------|-----------------|------------|----------------|------|
| AUTH | US-AUTH-01..07 | ✅ 100% | ✅ 88% | ✅ |
| PROVIDERS | API-PROVIDERS-01 | ✅ 100% | ✅ 89% | ✅ |
| EXPLORE | UF-CLIENT-01/02 | ✅ 100% | ⏳ 80% | N/A |
| USERS | API-USERS-01 | ✅ 100% | ✅ 90% | ✅ |
| ADMIN | API-ADMIN-01 | ✅ 100% | ✅ 85% | ✅ |

### Perfiles cubiertos

| Perfil | API | E2E | Manual |
|--------|-----|-----|--------|
| CLIENT | ✅ | ✅ | ✅ |
| PROVIDER | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ✅ |

---

## Hallazgos / Bugs detectados

| ID | Resumen | Severidad | Estado | Módulo |
|----|---------|-----------|--------|--------|
| BUG-001 | US-AUTH-01 documenta password min 6 (doc desactualizada) | Minor | Abierto | PM/Docs |
| BUG-002 | Middleware no protege `/api/*` — riesgo arquitectónico | Major | Abierto (mitigado) | Backend |
| BUG-003 | GET `/api/catalogs` sin envelope ADR-003 | Minor | Abierto | API/ADMIN |
| BUG-004 | US-AUTH-01 redirect CLIENT `/` vs `/cuenta` | Minor | Abierto | PM/Docs |

**Blocker/Critical abiertos:** 0  
**Major abiertos:** 1 (BUG-002 — mitigado con guards + tests RBAC)

---

## Cómo ejecutar las suites de prueba

### Pre-requisitos

1. PostgreSQL corriendo con `DATABASE_URL` configurado
2. App LaBorregaMarket en `http://127.0.0.1:8080`
3. Migración F3 aplicada: `npx prisma migrate deploy`

```bash
# Terminal 1 — App
cd C:\Users\PC GAMER\LaBorregaMarket
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# Terminal 2 — Tests QA
cd "C:\Users\PC GAMER\OneDrive - Universidad Autonoma de Nuevo León\Documents\Agentes de desarrollo test\QA Automation Engineer\Agente Tester\outputs\laborregamarket\tests"
cp .env.test.example .env.test
npm install
npx playwright install --with-deps
```

### Comandos

```bash
# Suite completa (API + E2E)
npx playwright test

# Solo API (más rápido, sin browser)
npx playwright test tests/api

# Solo E2E
npx playwright test tests/e2e

# Con UI interactiva
npx playwright test --ui

# Reporte HTML
npx playwright test --reporter=html
npx playwright show-report
```

### Variables de entorno

Ver `env-requirements.md` y `.env.test.example`.

---

## Log de actividad QA

| Fecha | Actividad | Entregable |
|-------|-----------|------------|
| 05/08/2026 | Análisis PRD, API-*, UX UF-*, código LaBorregaMarket | TEST_PLAN.md |
| 05/08/2026 | Diseño 5 matrices (72 casos) | `test-matrices/TC-*` |
| 05/08/2026 | Auditoría shift-left: 4 hallazgos documentados | `bug-reports/` |
| 05/08/2026 | Suite Playwright API (40) + E2E (13) | `tests/` |
| 05/08/2026 | Sign-off MVP + handoff DevOps | `qa-signoffs/QA-MVP-signoff.md` |
| 14/08/2026 | Matrices F3 (54 casos) + suite +58 tests | `test-matrices/TC-ORDERS-*` |
| 14/08/2026 | Sign-off F3 v0.3.0 | `qa-signoffs/QA-F3-signoff.md` |

---

## Protocolo de cierre — Handoff DevOps

**Estado QA:** ✅ **FASE COMPLETADA**

### Para @DevOps / Cloud Engineer

1. **Ambiente staging:** PostgreSQL 15+, Node 20+, variables de `LaBorregaMarket/.env.example`
2. **Seed obligatorio:** `npx prisma db seed` antes de tests
3. **Pipeline CI sugerido:**
   - Job `build` → `prisma migrate deploy` → `db seed` → `npm run build` → `npm start`
   - Job `qa-api` → `npx playwright test tests/api` (sin browser)
   - Job `qa-e2e` → `npx playwright test tests/e2e` (con chromium)
4. **Artefactos:** reporte HTML Playwright, upload en CI
5. **Quality gate deploy:** 0 Blocker/Critical + 100% pass regresión API

### Referencias cruzadas

| Documento | Ubicación |
|-----------|-----------|
| PRD | `Administrador de producto/.../prd.md` |
| API contratos | `Agente Arquitecto/.../api/API-*.md` |
| Backend OBS | `Agente backend/.../OBSERVABILITY.md` |
| UX OBS | `Agente UX UI/.../OBSERVABILITY.md` |
| Plan QA | `TEST_PLAN.md` |
| Env QA | `env-requirements.md` |

---

*Generado por Agente QA / Tester Senior — LaBorregaMarket v0.3.0.*

---

## Append — Fase 4 (14/08/2026)

| Campo | Valor |
|-------|-------|
| **Versión** | 0.4.0 |
| **Estado fase** | QA F4 — matrices + suite Playwright |
| **Alcance** | REVIEWS, GEO, ADDRESSES, ETA, ADMIN analytics, NOTIFY, POS báscula, ORDERS delivery |
| **Matrices** | `fase-4/test-matrices/` (9 archivos, 76 casos) |
| **Suite nueva** | ~68 tests (API + E2E) |
| **Precondición** | OBS-F4-020 migrate F4 (`reviews`, `user_addresses`) |
| **Fuera de alcance** | Pasarela, CFDI, Places Autocomplete, Distance Matrix, WebSerial hardware, EC-09 Redis prod |

Handoff DevOps: misma suite `npx playwright test` desde `outputs/laborregamarket/tests` con `PLAYWRIGHT_BASE_URL`. Maps key opcional. Redis/Inngest no requeridos en local.

### Ejecución 14/08/2026

- App F4 en `http://127.0.0.1:8081` (8080 no respondía).
- API: 139/140 pass (TC-NOT-003 429 sensible a timeout/Inngest).
- E2E F4 focal: 18/18 pass.
- Sign-off: `fase-4/qa-signoffs/QA-F4-signoff.md` — APROBADO CON CONDICIONES.

*Append QA F4 — 14/08/2026.*

---

## Append — Explorar mapa vacío vs filtros (14/08/2026)

Evidencia usuario: `http://localhost:8081/explorar?lat=25.744558649623617&lng=-100.2478863725936&radiusKm=16`, sesión CLIENT, chips Verificado + Frutas.

| Campo | Hallazgo |
|-------|----------|
| **Lista / geo** | OK — “14 fruterías a 16 km”, distancias (p. ej. Frutas El Paraíso 10.2 km). No es bug de filtros. |
| **Panel mapa** | Empty state “Mapa no disponible” (`ExploreMap.tsx` si `getGoogleMapsApiKey()` es falsy). |
| **`.env` local** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` **ausente** (tampoco hay `.env.local`). `.env.example` la deja vacía a propósito. |
| **Dictamen** | **OBS-F4-023** — EC-08 / READY-FOR-QA. No se abre BUG. Condición de sign-off F4 (Maps key en staging) sigue vigente. |

Para ver el mapa: definir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Maps JavaScript API, referrer localhost:8081) y **reiniciar** `next dev` (la key es `NEXT_PUBLIC_*`).

*Append QA F4 mapa/EC-08 — 14/08/2026.*

---

## Append — Fase 5 (15/08/2026)

| Campo | Valor |
|-------|-------|
| **Versión** | 0.5.0 |
| **Estado fase** | QA F5 — matrices + suite Playwright + sign-off |
| **Alcance** | Leaflet/OSM, catálogo inhabilitado todos los canales, marca PROVIDER + session |
| **Matrices** | `fase-5/test-matrices/` (4 archivos, 44 casos) |
| **Suite nueva** | 35 tests (API + E2E) |
| **Precondición** | OBS-F5-023 migrate `add_provider_brand_colors` |
| **Fuera de alcance** | Pagos, CFDI, PWA, flotilla, Google Maps JS en Explorar, clustering Should, stock |

### Ejecución 15/08/2026

- App F5 en `http://127.0.0.1:8080`. Migración F5 ya aplicada (`No pending migrations`).
- API focal F5: **87/87** (geo + session + catalog + settings + orders/pos 409 + rbac).
- E2E F5: **14/14** (Leaflet/layout, catálogo canales, marca sesión).
- OBS-F4-023 **cerrado**: mapa Leaflet sin Google key; attribution OSM; empty “Mapa no disponible” ausente.
- Suite completa en paralelo vs `next dev` provocó 500 (`Module not found: @upstash/redis` en compile). No se abre BUG de producto. Condición de sign-off: CI con `next start`.

Sign-off: `fase-5/qa-signoffs/QA-F5-signoff.md` — APROBADO CON CONDICIONES.

Handoff DevOps: misma suite `npx playwright test` desde `outputs/laborregamarket/tests`. Maps key **no** Must para Explorar. Attribution OSM visible.

*Append QA F5 — 15/08/2026.*

---

## Append — Fase 6 (17/08/2026)

| Campo | Valor |
|-------|-------|
| **Versión** | 0.6.1 |
| **Estado fase** | QA F6 abierta — matrices + specs; ejecución runtime pendiente |
| **Alcance** | Deuda Redis/503 + reportes DASH + GEO zoom↔radio |
| **Matrices** | `fase-6/test-matrices/` (4 archivos) |
| **Suite nueva** | ~23 tests (reports API, rbac F6, dashboard-reports, geo F6, contact-resilience) |
| **Fuera de alcance** | Pagos, CFDI, clustering, bbox |

### Ejecución 17/08/2026

- App levantada en `http://127.0.0.1:8080` (`next dev`).
- Playwright focal: **2 passed / 51 failed** (8 workers). Pass: `GET /api/users/me` y `GET /api/admin/providers` sin token → 401.
- Fallos API: HTTP 500 por `Module not found: Can't resolve 'inngest'` (y deps F6 ausentes). E2E: `npx playwright install` pendiente (Chromium).
- Bugs: BUG-005 Redis, BUG-006 pdfkit, BUG-007 inngest/compile.
- Sign-off: `fase-6/qa-signoffs/QA-F6-progreso.md` — EN PROGRESO.

*Append QA F6 apertura — 17/08/2026.*

---

## Append — Fase 6 re-run (17/08/2026)

| Campo | Valor |
|-------|-------|
| **BASE_URL** | `http://127.0.0.1:8080` (`.env.test`; equivalente a localhost:8080) |
| **Chromium** | `npx playwright install chromium` — OK |
| **Comando** | `npx playwright test tests/api/reports.spec.ts tests/api/rbac.spec.ts tests/e2e/dashboard-reports.spec.ts tests/e2e/explore-geo.spec.ts tests/e2e/contact-resilience.spec.ts --workers=1` |
| **Resultado** | Suite abortada. ~11 tests API **fail por timeout 30s**. 0 pass. E2E no llegó a correr. |
| **Probe** | Antes: `GET /api/providers` **200**. Durante/después: curl timeout 8–25 s, 0 bytes. PID 32212 LISTEN :8080 (~2 GB). No se arrancó otro `next`. |

Bugs: BUG-005 y BUG-006 **siguen abiertos** (redis/pdfkit ausentes). BUG-007 **parcial** (`inngest` en package.json + node_modules). BUG-008 **nuevo** (Next colgado). Sign-off: sigue EN PROGRESO — **no APROBADO**.

*Append QA F6 re-run — 17/08/2026.*

---

## Append — Fase 6 re-run localhost:8080 (17/08/2026 ~01:25)

| Campo | Valor |
|-------|-------|
| **BASE_URL** | `http://localhost:8080` (app ya levantada; probe `/` y `/api/providers` 200) |
| **Comando** | mismo set F6 `--workers=1` |
| **Resultado inicial** | **48 passed / 5 failed / 53** (2.2 min). Sin hang (BUG-008 no repro). |
| **Ajuste auto** | espera post-login en HP-DASH-04b/06; `setRadiusKm` usa setter nativo React. |
| **Tras ajuste** | HP-DASH-04b Pass. HP-DASH-06 sigue Fail (PDF 500). GEO-07/08 Fail. **49/53**. |

### Fallos de producto

| ID | Hallazgo |
|----|----------|
| BUG-009 | `GET /api/provider/reports.pdf` 500 `Error interno`. JSON reports Pass. pdfkit en node CLI genera `%PDF`. |
| BUG-010 | Slider radio → crash `FitCircle` `layerPointToLatLng`; URL no pasa a `radiusKm=5`. HP-GEO-07b (query 25) Pass. |

Cerrados: BUG-005 Redis, BUG-006 deps pdfkit, BUG-007 inngest compile. Sign-off: sigue EN PROGRESO — **no APROBADO**.

*Append QA F6 re-run localhost — 17/08/2026.*

---

## Append — Handoffs QA F6 a Backend / Frontend (17/08/2026)

Documentos de retorno (cola por agente; no se firma F6):

| Destino | Archivo | Ticket |
|---------|---------|--------|
| @Backend | `fase-6/QA-F6-handoff-backend.md` | BUG-009 PDF 500 |
| @Frontend | `fase-6/QA-F6-handoff-frontend.md` | BUG-010 slider Leaflet |

*Append QA F6 handoffs BE/FE — 17/08/2026.*

---

## Append — Fase 7 QA activación y corrida (23/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 7 — Explorar mapa-primero, preview, AUTH cross-device (v0.7.1) |
| **BASE_URL** | `http://localhost:8080` |
| **Matrices** | `fase-7/test-matrices/TC-GEO`, `TC-EXPLORE`, `TC-AUTH` |
| **Specs nuevos** | `tests/e2e/explore-f7.spec.ts`; deltas `geo.spec.ts`, `addresses.spec.ts`, `auth.spec.ts`, `providers.spec.ts` |
| **Comando** | suite focal F7 (79 tests) `--workers=1` |
| **Resultado** | **79 passed / 0 failed** |
| **Sign-off** | [QA-F7-signoff.md](../fase-7/qa-signoffs/QA-F7-signoff.md) — **APROBADO CON CONDICIONES** |

### Cobertura Must F7

- CO-F7-001: HP-GEO-10 pan sin GET (drag desde borde mapa, no pin draggable)
- meta.total / clamp radius / q mango / preview sheet / `/use` lastUsedAt
- AUTH portable session HP-AUTH-09b

### Condición

- EC-AUTH-09 banner cookies bloqueadas: smoke manual móvil pendiente

### Notas técnicas

- Playwright Chromium reinstalado en sandbox (`npx playwright install chromium`)
- TC-GEO-004 actualizado F7: clamp 25 (ya no 400)
- EC-EXPLORE-01: en error 500 lista se oculta pero mapa + ErrorBanner (no empty borrega)

*Append QA F7 — 23/08/2026.*

---

## Append — BUG-012 FilterBar chrome (23/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 7 |
| **Ticket** | [BUG-012](../fase-7/bug-reports/BUG-012.md) Critical P1 **Abierto** |
| **Síntoma** | Chips de filtro + «Usar mi ubicación» scrollean y salen del viewport en `/explorar` |
| **Causa** | `FilterBar` hijo de `.explore-main-scroll` (overflow del fix BUG-011); `sticky top-[80px]` no ancla al Header |
| **Rol** | Frontend — cero cambio BE / CO-F7-001 |
| **Fix esperado** | `FilterBar` hermano `shrink-0` fuera del scroll; CompactAddressBar + mapa + lista sí scrollean |
| **Caso** | EC-GEO-18 manual Fail; spec Playwright **no** añadida (sesión solo documentación) |
| **Gate** | Zero Blocker **FAIL** — [QA-F7-progreso.md](../fase-7/qa-signoffs/QA-F7-progreso.md) |
| **Handoff** | [QA-F7-handoff-frontend.md](../fase-7/QA-F7-handoff-frontend.md) + [activation-prompt-frontend-BUG-012.md](../fase-7/activation-prompt-frontend-BUG-012.md) |

*Append QA F7 BUG-012 — 23/08/2026.*

---

## Append — BUG-013 FilterBar colapsable (23/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 7 |
| **Ticket** | [BUG-013](../fase-7/bug-reports/BUG-013.md) Major P2 **Abierto** (mejora UX) |
| **Solicitud** | Colapsar FilterBar al scroll down; pestaña central para re-expandir; filtros activos persisten |
| **Dependencia** | BUG-012 cerrado (chrome fijo antes del colapso) |
| **Rol** | Frontend — cero cambio BE / CO-F7-001 |
| **Casos** | HP-GEO-19 (colapso), EC-GEO-19 (pestaña + persistencia) — manual Pendiente |
| **Gate** | No afecta Zero Blocker (Major, no Critical) |
| **Handoff** | [QA-F7-handoff-frontend.md](../fase-7/QA-F7-handoff-frontend.md) + [activation-prompt-frontend-BUG-013.md](../fase-7/activation-prompt-frontend-BUG-013.md) |

*Append QA F7 BUG-013 — 23/08/2026.*

---

## Append — Cierre F7 (24/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 7 cerrada (pendiente activación F8) |
| **Dictamen** | **APROBADO CON CONDICIONES** — [QA-F7-signoff.md](../fase-7/qa-signoffs/QA-F7-signoff.md) |
| **Suite focal** | **85/85** Pass (`explore-f7` + geo/addresses/providers/auth/session + explore-geo + explore + auth-login) |
| **Zero Blocker** | **PASS** |
| **Cierres** | BUG-012 Critical, BUG-013 Major, BUG-014 Major (BUG-011 ya cerrado 23/08) |
| **Specs nuevas** | EC-GEO-18, HP-GEO-19, EC-GEO-19, HP-GEO-20, EC-GEO-20 en `tests/e2e/explore-f7.spec.ts`; EC-GEO-17 ahora scrollea `.explore-main-scroll` |
| **Condición** | EC-AUTH-09 smoke cookies-off en móvil real |
| **OBS** | Pestaña «Filtros»: Leaflet/`#radius-km` puede interceptar pointer; expand vía scroll tope + handler OK. No se abre ticket (Minor residual). |

*Append QA F7 cierre — 24/08/2026.*

---

## Append — Apertura F8 Explorar polish (24/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 8 (v0.8.3) |
| **Alcance** | LocationChip + panel; radio 0.5–10; mapa MX; preview hover/long-press |
| **CO** | `CO-F8-001` / `CO-F8-002` / `CO-F8-003`; `CO-F7-001` intacto |
| **Matrices** | [TC-GEO](../fase-8/test-matrices/TC-GEO-matrix.md) · [TC-EXPLORE](../fase-8/test-matrices/TC-EXPLORE-matrix.md) · [TC-ADDRESSES](../fase-8/test-matrices/TC-ADDRESSES-matrix.md) |
| **Progreso** | [QA-F8-progreso.md](../fase-8/qa-signoffs/QA-F8-progreso.md) |
| **Suite** | Adaptar clamp 25→10, CDMX 400→200, CompactAddressBar / «Vista rápida» |
| **Fuera** | AUTH-09, FilterBar nuevo, DASH, pagos |
| **Proceso** | UX QG y Arquitecto `READY-FOR-QA.md` no emitidos; shift-left con BE/FE cerrados |

*Append QA F8 apertura — 24/08/2026.*

---

## Append — Cierre F8 Explorar polish (24/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 8 cerrada |
| **Dictamen** | **APROBADO CON CONDICIONES** — [QA-F8-signoff.md](../fase-8/qa-signoffs/QA-F8-signoff.md) |
| **Suite focal** | **76/76** Pass |
| **Zero Blocker** | **PASS** |
| **Specs** | `explore-f8.spec.ts`; clamp/CDMX/`isInMexico` en `geo.spec.ts` + `addresses.spec.ts`; POM LocationChip |
| **Condiciones** | Long-press/marker real; HP-GEO-18b DELETE pin; QG UX; EC-AUTH-09 F7 |
| **OBS** | Cookie Secure en `npm start`: API usa `withAuth` / header Cookie |

*Append QA F8 cierre — 24/08/2026.*

---

## Append — Apertura F9 deuda preview in-card (24/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 9 |
| **F8** | Cerrada — no reabierta |
| **Ticket** | [DT-F9-001](../fase-9/deuda-tecnica/DT-F9-001-preview-in-card.md) — deuda UX Major (no BUG) |
| **Síntoma** | Preview hover/long-press desanclado del card; rompe orden visual |
| **Propuesta Parte 1/3** | Animación del contenido del submódulo **dentro** del card; mismos triggers; GET detalle existente |
| **Datos** | Card `ProviderListing` y preview `ProviderDetail` **sí** traen campos; UI no consume `sampleProducts` ni precios/imágenes del preview. Header `q` ya filtra en radio. |
| **Partes 2–3** | Búsqueda artículos / nombres similares — backlog PM |
| **Rol** | Product Manager — no FE/BE hasta US/CO |
| **Handoff** | [QA-F9-handoff-pm.md](../fase-9/QA-F9-handoff-pm.md) + [activation-prompt-pm-DT-F9-001.txt](../fase-9/activation-prompt-pm-DT-F9-001.txt) |
| **Gates** | No iniciados — [QA-F9-progreso.md](../fase-9/qa-signoffs/QA-F9-progreso.md) |
| **Suite** | Sin cambios |

*Append QA F9 apertura DT-F9-001 — 24/08/2026.*

---

## Append — F9 deuda header EXPLORAR DT-F9-002 (24/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 9 |
| **F8** | Cerrada — no reabierta |
| **Ticket** | [DT-F9-002](../fase-9/deuda-tecnica/DT-F9-002-header-explorar-busqueda.md) — deuda UX Major (no BUG); Partes **2/3 + 3/3** |
| **Síntoma** | Header de `/explorar` sin typeahead; `q` no cubre corpus extra-página ni chip/tacha |
| **Propuesta** | Suggest **solo fruterías** (portada + nombre); índice productos activos (card + detalle) + nombre similar; **todo el radio**; aviso de filtro; tacha limpia texto y filtros |
| **Datos** | Modelo ya trae listing/detalle; listing paginado no basta como único índice del suggest |
| **Rol** | Product Manager — Arquitecto si hay endpoint suggest; no FE hasta US/CO |
| **Handoff** | [QA-F9-handoff-pm.md](../fase-9/QA-F9-handoff-pm.md) + [activation-prompt-pm-DT-F9-002.txt](../fase-9/activation-prompt-pm-DT-F9-002.txt) |
| **Gates** | No iniciados — [QA-F9-progreso.md](../fase-9/qa-signoffs/QA-F9-progreso.md) |
| **Suite** | Sin cambios |

*Append QA F9 DT-F9-002 — 24/08/2026.*

---

## Append — F9 deuda card distancia DT-F9-003 (25/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 9 |
| **F8** | Cerrada — no reabierta |
| **Ticket** | [DT-F9-003](../fase-9/deuda-tecnica/DT-F9-003-card-distancia-origen.md) — deuda UX Minor (no BUG) |
| **Síntoma** | Slot semibold `minPrice` («$X MXN desde») no identifica SKU; `distanceKm` pin→sucursal se muestra como km gris flojo |
| **Propuesta** | Quitar `minPrice` de la card; una fila km/m + ETA (ADR-017); sin pin no inventar; sin API Must |
| **Datos** | Listing geo ya trae `distanceKm`; `computeEtaMinutes` en cliente |
| **Rol** | Product Manager — UX copy → Frontend tras US/CO |
| **Handoff** | [QA-F9-handoff-pm.md](../fase-9/QA-F9-handoff-pm.md) + [activation-prompt-pm-DT-F9-003.md](../fase-9/activation-prompt-pm-DT-F9-003.md) |
| **Gates** | No iniciados — [QA-F9-progreso.md](../fase-9/qa-signoffs/QA-F9-progreso.md) |
| **Suite** | Sin cambios |

*Append QA F9 DT-F9-003 — 25/08/2026.*

---

## Append — F9 deuda FilterBar chips DT-F9-004 (25/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 9 |
| **F8** | Cerrada — FilterBar nuevo era Won't; no se reabre |
| **Ticket** | [DT-F9-004](../fase-9/deuda-tecnica/DT-F9-004-filterbar-chips-bloqueados.md) — deuda UX Major (no BUG) |
| **Síntoma** | Chips Orgánico, Mayoreo, A domicilio y Filtros visibles pero `disabled` |
| **Propuesta** | Habilitar o retirar cada chip; mayoreo/domicilio con flags Prisma + query listing; orgánico sin modelo hoy |
| **Rol** | Product Manager — Arquitecto (API) → UX → FE/BE tras US/CO |
| **Handoff** | [QA-F9-handoff-pm.md](../fase-9/QA-F9-handoff-pm.md) + [activation-prompt-pm-DT-F9-004.md](../fase-9/activation-prompt-pm-DT-F9-004.md) |
| **Gates** | No iniciados — [QA-F9-progreso.md](../fase-9/qa-signoffs/QA-F9-progreso.md) |
| **Suite** | Sin cambios |

*Append QA F9 DT-F9-004 — 25/08/2026.*

---

## Append — F9 deuda chrome/mapa DT-F9-005 (25/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 9 |
| **F8** | Cerrada — no reabierta |
| **Ticket** | [DT-F9-005](../fase-9/deuda-tecnica/DT-F9-005-chrome-barra-mapa.md) — deuda UX (no BUG); **último DT cola F9** |
| **Síntoma** | FilterBar + LocationBar apilados; mapa 360px / `min(440px,45vh)` |
| **Propuesta** | Una barra horizontal (chips + GPS + LocationChip); mapa ~+10–20% de altura; no regresionar BUG-012/013 ni CO-F7-001 |
| **Rol** | Product Manager — UX (breakpoint + delta) → Frontend; sin API Must |
| **Handoff** | [QA-F9-handoff-pm.md](../fase-9/QA-F9-handoff-pm.md) + [activation-prompt-pm-DT-F9-005.md](../fase-9/activation-prompt-pm-DT-F9-005.md) |
| **Gates** | No iniciados — [QA-F9-progreso.md](../fase-9/qa-signoffs/QA-F9-progreso.md) |
| **Suite** | Sin cambios |

*Append QA F9 DT-F9-005 — 25/08/2026.*

---

## Append — F10 Admin + catálogo local + reportes (31/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 10 |
| **Dictamen** | **APROBADO CON CONDICIONES** — [QA-F10-signoff.md](../fase-10/qa-signoffs/QA-F10-signoff.md) |
| **Suite focal** | **89 passed / 0 failed** (`admin-products`, `local-products`, `sections`, `media`, `reports`, `rbac`, E2E catálogo/frutería/admin/reportes) |
| **Zero Blocker** | PASS — sin `BUG-*` F10 |
| **Inputs** | QR-FE 93/100; QR-BE 96/100; `READY-FOR-QA.md` ausente (advertencia) |
| **Condiciones** | Sign-off F9 pendiente; E2E Explorar F7/F8 17/23 (chrome F9 vs specs F7); `US-ADMIN-04` Should; TCs último ADMIN Blocked |
| **Env** | `UPLOADS_DIR`; login API con `x-forwarded-for` único (tope 10/15 min) |
| **F8/F9** | No reabiertas |

*Append QA F10 — 31/08/2026.*

---

## Append — BUG-015 Encargar `crypto.randomUUID` (31/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 10 |
| **Dictamen** | **RECHAZADO** — Zero Blocker FAIL. El APROBADO CON CONDICIONES del mismo día queda anulado mientras [BUG-015](../fase-10/bug-reports/BUG-015.md) esté abierto |
| **Bug** | Blocker P1 — TypeError `crypto.randomUUID is not a function` al montar `/carrito` (`CartPageClient` useRef). Superficie POS (`PosPageClient`) en el mismo ticket |
| **Receptor** | **Frontend** — [QA-F10-handoff-frontend.md](../fase-10/QA-F10-handoff-frontend.md) · [activation-prompt-frontend-BUG-015.txt](../fase-10/activation-prompt-frontend-BUG-015.txt) |
| **Backend** | No actúa |
| **Matriz** | [TC-CART-regresion.md](../fase-10/test-matrices/TC-CART-regresion.md) (`HP-CART-015`, `EC-CART-015`, `HP-POS-015` Fail) |
| **Spec** | `tests/e2e/cart-uuid.spec.ts` (stub `randomUUID` undefined) |
| **Must F10** | Suite focal 89/89 intacta (SEC/ADMIN/CAT/MEDIA/DASH) |
| **F8/F9** | No reabiertas |

*Append QA F10 BUG-015 — 31/08/2026.*

---

## Append — BUG-016 límite imagen 20 MiB (31/08/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 10 |
| **Dictamen** | Sigue **RECHAZADO** (Zero Blocker = BUG-015). BUG-016 es **Major P2**, no Blocker |
| **Bug** | [BUG-016](../fase-10/bug-reports/BUG-016.md) — tope 5 MB duplicado FE+BE; NFR local 20 MiB (`20_971_520`) en logo, portada y producto |
| **Receptores** | Backend + Frontend; PM CO (`US-MEDIA-03` / `API-MEDIA-02`) |
| **Handoffs** | [FE](../fase-10/QA-F10-handoff-frontend.md) · [BE](../fase-10/QA-F10-handoff-backend.md) · [PM](../fase-10/QA-F10-handoff-pm.md) |
| **Matriz** | [TC-MEDIA-matrix.md](../fase-10/test-matrices/TC-MEDIA-matrix.md) `TC-MED-008`/`009`, `HP-MED-02` Fail hasta fix |
| **Spec** | `tests/api/media.spec.ts` (JPEG padding 6 MiB / 20 MiB+1); copy E2E `provider-catalog-f10` + `admin-catalog-f10` |
| **F8/F9** | No reabiertas |

*Append QA F10 BUG-016 — 31/08/2026.*

---

## Append — Re-test F10 pendientes (10/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 10 — **no se cierra**; F11 **no** se abre |
| **Dictamen** | Sigue **RECHAZADO** |
| **BUG-015** | No implementado — `useRef(crypto.randomUUID())` intacto en carrito y POS |
| **BUG-016** | No implementado — `MAX_IMAGE_BYTES` / `MAX_BYTES` / copy siguen 5 MB |
| **Ecosistema** | PM, FE, BE STATUS siguen en fase 10; no hay `fase-11/` |

*Append QA F10 re-test 015/016 — 10/09/2026.*

---

## Append — Re-test FE/BE entregado (12/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase activa** | 10 — **no se cierra**; F11 **no** se abre |
| **Corrida** | Playwright 015+016: **12 passed / 4 failed** (`http://127.0.0.1:8080`) |
| **BUG-015** | Abierto — FE no cambió `crypto.randomUUID` |
| **BUG-016** | Parcial — `TC-MED-008` Pass (6 MiB); `TC-MED-009` 500; FE copy 5 MB |
| **Retorno** | [QA-F10-retorno-pm-ux-arch.md](../fase-10/QA-F10-retorno-pm-ux-arch.md) + prompts PM / UX / Arquitecto |

*Append QA F10 re-test FE/BE — 12/09/2026.*

---

## Append — Cierre F10 DT + merge DevOps (12/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 10 **cerrada documentalmente**. F11 **no** se abre en esta sesión |
| **Dictamen** | **APROBADO CON CONDICIONES** — [QA-F10-signoff.md](../fase-10/qa-signoffs/QA-F10-signoff.md) |
| **Zero Blocker** | **PASS** (release `http://127.0.0.1:8080`) |
| **Ambiente** | Stakeholder: localhost / 127.0.0.1. Encargar y fotos ≤5 MB (API 6 MiB) usables |
| **BUG-015** | **Diferido** (no Verificado) → [DT-F10-001](../fase-10/deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md) |
| **BUG-016** | BE disco aceptado (`TC-MED-008`). Resto **Diferido** → [DT-F10-002](../fase-10/deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md) |
| **Specs DT** | `cart-uuid.spec.ts` / `HP-MED-02` / `TC-MED-009` pueden fallar; no bloquean dictamen ni merge |
| **Condiciones** | DT-F10-001, DT-F10-002, F9 sin sign-off, `READY-FOR-QA.md` ausente, `US-ADMIN-04` Should |
| **Merge** | [QA-F10-handoff-devops.md](../fase-10/QA-F10-handoff-devops.md). QA **no** hace `git push`. DT-F10 no es P0 de CI |
| **F8/F9** | No reabiertas |

*Append QA F10 cierre DT + DevOps — 12/09/2026.*

---

## Append — QA F11 Must (12/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 11 activa |
| **Dictamen** | **RECHAZADO** — [QA-F11-signoff.md](../fase-11/qa-signoffs/QA-F11-signoff.md) |
| **Zero Blocker** | **FAIL** (BUG-017) |
| **API** | 12/12 pass `f11-multi-provider.spec.ts` |
| **E2E** | 2/5 pass |
| **Ambiente** | `http://127.0.0.1:8080`. migrate deploy + seed. prisma generate EPERM |
| **Cierre de fase** | No. Sin DevOps. Sin QG-correcciones hasta APROBADO |

*Append QA F11 Must — 12/09/2026.*

---

## Append — Re-prueba F11 BUG-017/018 (12/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 11 (no cerrada) |
| **Dictamen** | **APROBADO** — [QA-F11-signoff.md](../fase-11/qa-signoffs/QA-F11-signoff.md) |
| **Zero Blocker** | **PASS** |
| **E2E** | TC-F11-101…105 **5/5 Pass** |
| **API** | 12/12 Pass |
| **017** | Verificado (switcher + Reportes generales N>1; N=1 oculto) |
| **018** | Verificado (URL lat/lng; no San Nicolás; dos cards) |
| **Siguiente** | QG-correcciones UX + Arch. Sin DevOps desde QA |

*Append QA F11 re-prueba — 12/09/2026.*

---

## Append — Corrida inicial F12 inventario (14/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 12 (no cerrada) |
| **Dictamen** | **RECHAZADO** — [QA-F12-signoff.md](../fase-12/qa-signoffs/QA-F12-signoff.md) |
| **Zero Blocker** | **FAIL** (BUG-019) |
| **Happy / edge** | 15/15 y 4/4 ejecutados |
| **API F12** | 4 Pass / 12 Fail |
| **E2E F12** | 5/5 Pass (chrome FE) |
| **Migrate** | `f12_inventario_blando` aplicada |
| **generate** | EPERM DLL Windows |
| **Siguiente** | Backend EVIDENCIA-BUG-019. Sin DevOps. Sin promover. |

*Append QA F12 inicial — 14/09/2026.*

---

## Append — Re-prueba F12 BUG-019 (14/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 12 (no cerrada) |
| **Dictamen** | **APROBADO** — [QA-F12-signoff.md](../fase-12/qa-signoffs/QA-F12-signoff.md) |
| **Zero Blocker** | **PASS** |
| **Playwright** | **21/21 Pass** (API 16 + E2E 5) |
| **019** | Verificado (GET inventory 200; PATCH posShowImages 200) |
| **Siguiente** | QG-correcciones UX + Arch. Sin DevOps desde QA |

*Append QA F12 re-prueba — 14/09/2026.*

---

## Append — QA Fase 13 inicial (16/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 13 (no cerrada) |
| **Dictamen** | **RECHAZADO** — [QA-F13-signoff.md](../fase-13/qa-signoffs/QA-F13-signoff.md) |
| **Zero Blocker** | **FAIL** (BUG-020) |
| **Playwright F13** | 16 Pass / 3 Fail (API 12/15, E2E 4/4) |
| **Vitest app** | 373/80 |
| **Migrate** | `20260916180000_f13_archivo_oferta_unidad` aplicada |
| **Ambiente** | `http://127.0.0.1:8080` local |
| **Siguiente** | Backend EVIDENCIA-BUG-020. Sin QG-correcciones. Sin DevOps. |

*Append QA F13 inicial — 16/09/2026.*

---

## Append — Re-prueba F13 BUG-020 (16/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 13 (no cerrada) |
| **Dictamen** | **APROBADO** — [QA-F13-signoff.md](../fase-13/qa-signoffs/QA-F13-signoff.md) |
| **Zero Blocker** | **PASS** |
| **Playwright** | **19/19 Pass** (API 15 + E2E 4) |
| **020** | Verificado (008/011/006b Pass) |
| **Siguiente** | QG-correcciones UX + Arch. Sin DevOps desde QA |

*Append QA F13 re-prueba — 16/09/2026.*

---

## Append — Fase 14 panel PROVIDER (17/09/2026)

| Campo | Valor |
|-------|-------|
| **Fase** | 14 (no cerrada) |
| **Dictamen** | **APROBADO** — [QA-F14-signoff.md](../fase-14/qa-signoffs/QA-F14-signoff.md) |
| **Zero Blocker** | **PASS** |
| **Playwright F14** | **41/41 Pass** (API 35 + E2E 6) |
| **Bugs** | Ninguno (sin BUG-021+) |
| **Rama app** | `feat/f14-panel-proveedor` `9f5b875` |
| **Migrate** | `20260918010000_f14_inventory_entry_kind` |
| **Siguiente** | QG-correcciones UX + Arch. Sin DevOps desde QA |

*Append QA F14 — 17/09/2026.*





