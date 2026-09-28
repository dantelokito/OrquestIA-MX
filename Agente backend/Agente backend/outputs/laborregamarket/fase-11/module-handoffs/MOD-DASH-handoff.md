# Handoff de Módulo: MOD-DASH (Fase 11)

> **Proyecto:** laborregamarket  
> **Módulo:** DASH  
> **Stack:** Prisma + agregaciones en memoria sobre `IN (provider_ids del user)`  
> **Fecha:** 12/09/2026  
> **Contrato:** `API-PROVIDER-REPORTS-03`, ADR-035

## Inputs Utilizados

- API-PROVIDER-REPORTS-03, ADR-033/035
- Reportes F10 por sucursal: `GET /api/provider/reports` (sin cambio de URL)

## 1. Endpoints

| Método | Ruta | Auth | Estado |
|--------|------|------|--------|
| GET | `/api/provider/reports` | PROVIDER + activo | F10 intacto, `providerId` = cookie |
| GET | `/api/provider/reports.pdf` | PROVIDER + activo | F6/F10 sucursal |
| GET | `/api/provider/reports/global` | PROVIDER, N>1 | Nuevo |

N≤1 en global: HTTP 403, `error.code = GLOBAL_REPORTS_NOT_AVAILABLE`. No 404. No 200 vacío.

GMV sin `productIds`: `SUM(Order.total)`. Con filtro: `SUM(OrderItem.subtotal)`. `productIds` de sucursal no propia → 403.

## 2. Pruebas

- Unit: `tests/unit/dashboard.service.test.ts` (N=1 lanza `GlobalReportsNotAvailableError`)
- Integration: `tests/integration/provider-f11.routes.test.ts` (403 code)
- F10: `tests/integration/reports.routes.test.ts`

**Comando:** `npm test` — 324 passed.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/module-handoffs/MOD-DASH-handoff.md`
- **Agente Downstream:** Frontend, QA
