# QA Sign-off: QA-F5-signoff

> **Proyecto:** laborregamarket  
> **Módulo / Feature:** Fase 5 — GEO Leaflet/OSM, catálogo inhabilitado, marca PROVIDER (v0.5.0)  
> **Sprint / Release:** v0.5.0  
> **Ambiente evaluado:** `http://127.0.0.1:8080` (local + seed; migración `add_provider_brand_colors` aplicada)  
> **Fecha:** 2026-08-15  
> **Evaluado por:** Agente QA / Tester Senior

---

## 1. Resumen ejecutivo

Se validó LaBorregaMarket Fase 5 contra READY-FOR-QA de Arquitecto (97/100) y UX (86/100). Se diseñaron 44 casos en 4 matrices (GEO, CAT, BRAND, RBAC) y se extendió la suite Playwright viva: session/tema, catálogo 409, colores, Leaflet/layout, canales de venta y chrome PROVIDER. Happy paths HP-GEO-04/05, HP-CAT-01, HP-BRAND-01/02 cubiertos al 100%. OBS-F4-023 cerrado: `/explorar` renderiza Leaflet **sin** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Sin bugs Blocker/Critical nuevos.

**Recomendación:** **APROBADO CON CONDICIONES** — integrar suite en CI (`npm run start`, no `next dev` bajo carga paralela); clustering Should fuera de alcance.

---

## 2. Métricas de ejecución

| Métrica | Objetivo | Resultado | Cumple |
|---------|----------|-----------|--------|
| Happy path ejecutados | 100% | 6/6 HP F5 (GEO-04/05, CAT-01, BRAND-01/02, REG Google) | ✅ Sí |
| Negativos / edge ejecutados | ≥ 85% | ~16/17 auto (EC-F5-05 `Product.isActive` no auto) | ✅ Sí |
| Casos de seguridad ejecutados | 100% | RBAC F5 6/6 | ✅ Sí |
| Regresión API F5 (Playwright) | 100% pass | 87/87 en corrida focal (geo + session + catalog + settings + orders/pos F5 + rbac) | ✅ Sí |
| Regresión E2E F5 (Playwright) | 100% pass | 14/14 (explore-geo F5, catalog-channels, provider-brand) | ✅ Sí |

**Matrices:** `fase-5/test-matrices/TC-GEO`, `TC-CAT`, `TC-BRAND`, `TC-RBAC`

---

## 3. Bugs abiertos por severidad

| Severidad | Abiertos F5 | Resueltos | Verificados | Diferidos |
|-----------|-------------|-----------|-------------|-----------|
| Blocker | 0 | 0 | 0 | 0 |
| Critical | 0 | 0 | 0 | 0 |
| Major | 0 | 0 | 0 | 0 |
| Minor | 0 | 0 | 0 | 0 |

**Heredados F1:** BUG-001..004. Observaciones UX F5 (OBS-UX-F5-001..007) y OBS-F5-023 (migración) no reabiertas.

**Alineaciones de prueba (no defectos de producto F5):** layout Explorar duplica mapa/slider (desktop + móvil) — locators usan `.first()`. Suite completa en paralelo contra `next dev` puede 500 por compile (`@upstash/redis`); no es AC F5.

---

## 4. Quality gates

| Gate | Criterio | Estado |
|------|----------|--------|
| Zero Blocker Policy | Sin bugs Blocker ni Critical abiertos | ✅ PASS |
| Cobertura happy path | 100% ejecutado | ✅ PASS |
| Cobertura edge/negativos | ≥ 85% ejecutado | ✅ PASS |
| Regresión automatizada | 100% pass en staging/QA | ⏳ PENDIENTE DevOps |
| Automatización actualizada | Scripts API/E2E en repo | ✅ PASS |
| Fixes verificados | N/A F5 (sin bugs nuevos) | ✅ PASS |

---

## 5. Dictamen

**Resultado:** **APROBADO CON CONDICIONES**

### Condiciones

- Pipeline CI con `PLAYWRIGHT_BASE_URL`, PostgreSQL, `prisma migrate deploy` F5 (`add_provider_brand_colors`) y suite `npx playwright test`
- CI debe usar `npm run build` + `npm start` (no `next dev`) para evitar 500 de compile bajo workers paralelos
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` **no** es Must para Explorar; attribution OSM visible; `NEXT_PUBLIC_OSM_TILE_URL` opcional
- EC-F5-05 (`Product.isActive=false` en detalle) no automatizado
- Clustering de markers (Should) no implementado (QR-FE / OBS-UX-F5-006)

### Justificación

Must F5 (Leaflet sin Google key, layout ubicación/radio, inhabilitar en todos los canales, colores + tema de sesión PROVIDER) cumple contratos API y flujos UX de READY-FOR-QA. La suite viva en `tests/` no se partió por fase.

---

## 6. DoD QA

- [x] **Matriz Diseñada:** 44 casos F5 en 4 matrices
- [x] **Ejecución Completa:** API + E2E F5 en `http://127.0.0.1:8080`
- [x] **Bugs Documentados:** Sin nuevos Blocker/Critical F5
- [x] **Verificación de Fixes:** N/A
- [x] **Automatización Actualizada:** session, catalog, brand colors, orders/pos 409, rbac, Leaflet E2E, canales, marca
- [x] **Dictamen Emitido:** Este documento

---

**Firma QA:** Agente QA / Tester Senior  
**Fecha:** 2026-08-15
