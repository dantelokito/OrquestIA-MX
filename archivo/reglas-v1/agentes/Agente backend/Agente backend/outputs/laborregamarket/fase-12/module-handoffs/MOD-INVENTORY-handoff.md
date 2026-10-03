# Handoff de Módulo: MOD-INVENTORY

> **Proyecto:** laborregamarket  
> **Módulo:** INVENTORY  
> **Stack:** Next.js App Router + TypeScript + Prisma + PostgreSQL  
> **Fecha:** 2026-09-14  
> **Contrato de referencia:** `API-INVENTORY-01`, `DB-provider-products`, `DB-order-items`, ADR-036, ADR-037

## Inputs Utilizados

- Handoff Arquitecto: `Agente Arquitecto/.../fase-12/handoff-backend-fase-12.md`
- `API-INVENTORY-01.md`, `DB-provider-products.md`, `DB-order-items.md`

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| GET | `/api/provider/inventory` | PROVIDER + sucursal activa | API-INVENTORY-01 | OK |
| GET | `/api/provider/inventory/[providerProductId]` | PROVIDER + sucursal activa | API-INVENTORY-01 | OK |
| PATCH | `/api/provider/inventory/[providerProductId]` | PROVIDER + sucursal activa | API-INVENTORY-01 | OK |
| POST | `/api/provider/inventory/[providerProductId]/entries` | PROVIDER + sucursal activa | API-INVENTORY-01 | OK |

Paths **sin** `/api/v1/`. Envelope `{ data }` / `{ data, meta }` (ADR-003).

## 2. Validación (DTOs)

- Body y query con Zod: `src/lib/validators/inventory.ts`
- IDOR: `ProviderProduct` de otra sucursal → 403 (no 404)

| DTO | Archivo | Campos |
|-----|---------|--------|
| List query | `validators/inventory.ts` | page, limit (máx. 100, default 50) |
| PATCH ficha | `validators/inventory.ts` | capacityMax, alertThresholdPercent, alertEnabled, boxContentFactor |
| POST entries | `validators/inventory.ts` | quantity, receiveAs CATALOG/BOX |

## 3. Base de datos y migraciones

| Tipo | Ruta |
|------|------|
| Schema | `LaBorregaMarket/prisma/schema.prisma` |
| Migración | `prisma/migrations/20260915010000_f12_inventario_blando/migration.sql` |

`stock` Int? permanece deprecado (no se lee ni escribe). `reserved` no es columna: SUM Encargar MARKETPLACE con status distinto de DELIVERED/CANCELLED, convertido a unidad de catálogo.

## 4. Seguridad (RBAC)

| Ruta | Roles |
|------|-------|
| `/api/provider/inventory*` | PROVIDER; 401 sin JWT; 403 CLIENT/ADMIN o sucursal cruzada |

## 5. Pruebas

```
cd C:\Users\PC GAMER\LaBorregaMarket
npx vitest run tests/unit/inventory-convert.test.ts tests/unit/inventory-metrics.test.ts tests/unit/inventory.service.test.ts tests/integration/inventory.routes.test.ts
```

Suite completa: `npm test` → **352 passed** (77 files), 2026-09-14.

## 6. Definition of Done (DoD Backend)

- [x] Validación DTO
- [x] Errores envelope (`error` + `details[]` en 400)
- [x] Secrets solo `.env`
- [x] RBAC + 403 IDOR Centro/Tecnológico
- [x] Una query de catálogo + una de líneas Encargar (sin N+1)
- [x] Tests unit + integración pasando

## 7. Notas para downstream

### Frontend

JSON de ítem (decimales string 3 dígitos):

```json
{
  "providerProductId": "clxpp01",
  "onHand": "12.500",
  "reserved": "3.000",
  "capacityMax": "20.000",
  "fillPercent": 62.5,
  "alertThresholdPercent": 10,
  "alertEnabled": true,
  "lowStockAlert": false,
  "boxContentFactor": "10.000"
}
```

`fillPercent` puede ser `null` (sin tope) o mayor que 100. PATCH no muta `onHand` ni `isAvailable`.

### QA

- Entrada BOX sin factor → 400
- Superar tope permitido
- 403 si cookie Centro y `providerProductId` de Tecnológico

### DevOps

Aplicar migración F12. Regenerar Prisma client si `prisma generate` falla por EPERM del DLL en Windows.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/module-handoffs/MOD-INVENTORY-handoff.md`
- **Agente Downstream:** Frontend (tras UX), QA (tras FE+BE)
