# Handoff de Módulo: MOD-GEO

> **Proyecto:** laborregamarket  
> **Módulo:** GEO / EXPLORE  
> **Stack:** Next.js App Router, Prisma, Zod  
> **Fecha:** 2026-08-25  
> **Contrato:** `API-GEO-01` F9

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| GET | `/api/providers` | Pública | API-GEO-01 | OK — chips `offersWholesale` / `offersDelivery` |

Sin ruta `/suggest`. Typeahead = mismo GET (`q`+geo+`limit=10`).

## 2. Validación

- Bool chips: `true`/`1` filtra; `false`/`0`/ausente no filtra; otro → 400 ADR-003.
- Geo/q/clamp F8 intactos (`geoListQuerySchema`, `MEXICO_BOUNDS`).

**Código:** `src/app/api/providers/route.ts` (`parseChipBoolean`), `src/lib/services/provider.service.ts` (`buildWhere` + `mapProviderCard`).

## 3. Base de datos

Sin migración. `Provider.offersWholesale` / `offersDelivery` ya existían (settings F7).

## 4. Seguridad

Pública. Sin JWT.

## 5. Pruebas

`npx vitest run tests/integration/geo.routes.test.ts tests/unit/provider-q-where.test.ts`

Suite completa: **235** passing.

## 6. DoD

- [x] Validación bool chips  
- [x] Errores envelope ADR-003  
- [x] `meta.total` del predicado completo  
- [x] Cards serializan flags  
- [x] Tests F9 Must

## 7. Frontend

Chips → query shareable. Typeahead debounce sobre el mismo listing. No filtrar en memoria la página ya cargada.
