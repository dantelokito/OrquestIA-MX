# Handoff de Módulo: MOD-INVENTORY-F14

> **Proyecto:** laborregamarket  
> **Módulo:** INVENTORY merma / ajuste / movimientos  
> **Stack:** Next.js App Router + Prisma + PostgreSQL + Zod  
> **Fecha:** 2026-09-17  
> **Contrato de referencia:** API-INVENTORY-14, DB-inventory-entries, ADR-040

## Inputs Utilizados

- Handoff Arquitecto `fase-14/handoff-backend-fase-14.md`
- ADR-040, ADR-036, ADR-022, ADR-038, ADR-003, ADR-002

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| POST | `/api/provider/inventory/[providerProductId]/shrinkage` | PROVIDER + sucursal | API-INVENTORY-14 | OK 201 |
| POST | `/api/provider/inventory/[providerProductId]/adjustments` | PROVIDER + sucursal | API-INVENTORY-14 | OK 201 |
| GET | `/api/provider/inventory/movements` | PROVIDER + sucursal | API-INVENTORY-14 | OK paginado |
| POST | `/api/provider/inventory/[providerProductId]/entries` | PROVIDER + sucursal | delta F14 | OK `kind=ENTRADA` + `onHandAfter` |
| GET | `/api/provider/reports/inventory` | PROVIDER + sucursal | delta F14 | OK `entries[]` solo `kind=ENTRADA` |

## 2. Validación (DTOs)

- [x] Merma: `quantity` > 0, `reason` enum, `note` máx. 200
- [x] Ajuste: `countedOnHand` ≥ 0 (cero válido)
- [x] Resultado `onHand < 0` → **400** `INVENTORY_NEGATIVE_NOT_ALLOWED` sin fila
- [x] Movimientos: page/limit, `kind`, `from`/`to` juntos, span ≤ 366, no futuro
- [x] Oferta archivada → 409; SKU ajeno → 403

## 3. Base de datos

- [x] Extiende `InventoryEntry` (no hay tabla `InventoryMovement`)
- [x] Migración `prisma/migrations/20260918010000_f14_inventory_entry_kind/migration.sql`
- [x] `kind` DEFAULT `ENTRADA`; `receiveAs` nullable; sin backfill de `onHandAfter`

## 4. Seguridad

- [x] JWT + sucursal activa
- [x] IDOR 403
- [x] POS / `decrementOnHandForLines` / `DELIVERED` **no tocados** (venta sí puede dejar negativo)

## 5. Pruebas

`npx vitest run` → **401 passed** / 86 files.

`tests/unit/inventory-f14.service.test.ts`, `tests/integration/inventory-f14.routes.test.ts`.

## 6. DoD Backend

- [x] Validación completa
- [x] Transacción Must (sin `SELECT FOR UPDATE`, Should BL-243)
- [x] Paginación movimientos
- [x] Tests en verde

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/module-handoffs/MOD-INVENTORY-F14-handoff.md`
- **Agente Downstream:** Frontend, QA
