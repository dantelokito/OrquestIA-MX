# Handoff de Módulo: MOD-ADMIN

> **Proyecto:** LaBorregaMarket  
> **Módulo:** ADMIN analytics (plataforma)  
> **Stack:** Next.js 15 + Prisma + PostgreSQL  
> **Fecha:** 2026-08-14  
> **Contrato de referencia:** `API-ADMIN-ANALYTICS-01`

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| GET | `/api/admin/analytics?range=today\|7d\|30d` | ADMIN | API-ADMIN-ANALYTICS-01 | OK |

Distinto de `GET /api/provider/dashboard` (un proveedor).

---

## 2. Validación (DTOs)

`src/lib/validators/analytics.ts` — `range` enum, default `7d`.

TZ America/Monterrey (`src/lib/timezone.ts`). Ventanas: today / 7d / 30d (inicio 00:00 inclusive, fin exclusive now).

---

## 3. Base de datos

Agregación Prisma (`count`, `aggregate`, `groupBy`). `activeProviders` = `Provider.isActive=true` (no filtrado por periodo). GMV/`orderCount` excluyen `CANCELLED`. `cancellationRate` = canceladas / altas del periodo.

Sin órdenes creadas → `{ empty: true, kpis: null }`.

---

## 4. Seguridad

- [x] Solo ADMIN
- [x] 401 / 403

---

## 5. Pruebas

`npm test -- tests/unit/admin-analytics.service.test.ts tests/integration/analytics.routes.test.ts`

---

## 6. Definition of Done (DoD Backend)

- [x] Validación Completa
- [x] Manejo de Errores Robust
- [x] Seguridad de Endpoints
- [x] Sin N+1 / mock de prod
- [x] Pruebas Superadas

---

## 7. Notas para downstream

### Frontend

UI `/admin/analytics` (UX UF-ADMIN-01 pendiente). Si `empty: true` no pintar ceros.

### QA

Range inválido → 400. PROVIDER → 403. Dashboard proveedor intacto.

### DevOps

Sin env extra.
