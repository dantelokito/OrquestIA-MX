# Handoff de Módulo: MOD-GEO

> **Proyecto:** laborregamarket  
> **Módulo:** GEO / EXPLORE  
> **Stack:** Next.js App Router, Prisma, Zod  
> **Fecha:** 2026-08-24  
> **Contrato:** `API-GEO-01` F8

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| GET | `/api/providers` | Pública | API-GEO-01 | OK — clamp 0.5–10 + `isInMexico` |

## 2. Validación

- Query: `geoListQuerySchema`. `radiusKm` no numérico → 400; fuera de [0.5, 10] → clamp (no 400).
- Coords: `mexicoLatSchema` / `mexicoLngSchema` (`MEXICO_BOUNDS` ADR-028). Copy 400: `Ubicación fuera de México`.
- `etaQuerySchema` **sigue AMM** (fuera de slice F8).

**Schemas:** `src/lib/validators/geo.ts`, constantes `src/lib/geo/bounds.ts` (`isInMexico`).

## 3. Base de datos

Sin migración. Predicado de lista = Haversine F7 (no `WHERE lat BETWEEN`).

## 4. Seguridad

Pública. Sin JWT.

## 5. Pruebas

`npx vitest run tests/integration/geo.routes.test.ts tests/unit/geo.test.ts`

Casos: `0.5` / `10` / `22→10` / `0→0.5` / `0.7`; CDMX 200; `33.0,-99.0` 400.

## 6. DoD

- [x] Validación  
- [x] Errores envelope ADR-003  
- [x] `meta.radiusKm` = valor aplicado  
- [x] Tests passing (suite completa 217)

## 7. Frontend

`MIN_RADIUS_KM=0.5` / `MAX_RADIUS_KM=10` / `DEFAULT_RADIUS_KM=10`. Sin `Math.round`. Pan/zoom no refetch (FE).
