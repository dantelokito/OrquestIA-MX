# Handoff de Módulo: MOD-GEO

> **Proyecto:** laborregamarket  
> **Módulo:** GEO / EXPLORE  
> **Stack:** Next.js App Router, Prisma, Zod  
> **Fecha:** 2026-08-18  
> **Contrato:** `API-GEO-01` F7

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| GET | `/api/providers` | Pública | API-GEO-01 | OK |

## 2. Validación

- Query: `geoListQuerySchema` + `q` min 2. `radiusKm` inválido no numérico → 400; fuera de [1,25] → clamp.

## 3. Base de datos

Sin tabla nueva. `q` usa `Provider` + `ProviderProduct` vendible (`isAvailable` + `Product.isActive`) en name **o** slug.

## 4. Seguridad

Pública. Sin JWT.

## 5. Pruebas

`npx vitest run tests/integration/geo.routes.test.ts tests/unit/provider-q-where.test.ts`

## 6. DoD

- [x] Validación  
- [x] Errores envelope  
- [x] `meta.total` independiente de `limit` (count del set Haversine)  
- [x] Tests 191 passing (suite completa)

## 7. Frontend

`meta.total` / `meta.radiusKm`. Pan/zoom no refetch (FE).
