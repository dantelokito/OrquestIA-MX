# Handoff de Módulo: MOD-CATALOG-F13

> **Proyecto:** laborregamarket  
> **Módulo:** CATALOG / INVENTORY F13  
> **Stack:** Next.js App Router + Prisma + PostgreSQL + Zod  
> **Fecha:** 2026-09-16  
> **Contrato de referencia:** API-*-13, DB-provider-products, DB-inventory-entries, DB-provider-product-price-history

## Inputs Utilizados

- Handoff Arquitecto `fase-13/handoff-backend-fase-13.md`
- ADR-038, ADR-002, ADR-003, ADR-022, ADR-036, ADR-037

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| GET | `/api/admin/products` | ADMIN PRODUCTS/view | API-ADMIN-PRODUCTS-13 | OK |
| PATCH | `/api/admin/products/[id]` | ADMIN PRODUCTS/edit | API-ADMIN-PRODUCTS-13 | OK |
| DELETE | `/api/admin/products/[id]` | 405 | API-ADMIN-PRODUCTS-13 | OK |
| GET | `/api/provider/products?archived=&page=&limit=` | PROVIDER + cookie sucursal | API-PROVIDER-ARCHIVE-13 | OK |
| DELETE | `/api/provider/products` | 405 | API-PROVIDER-ARCHIVE-13 | OK |
| PATCH | `/api/provider/products/by-product/[productId]` | PROVIDER | API-PROVIDER-OFFER-13 | OK |
| POST | `/api/provider/products/by-product/[productId]/archive` | PROVIDER | API-PROVIDER-ARCHIVE-13 | OK |
| POST | `/api/provider/products/by-product/[productId]/restore` | PROVIDER | API-PROVIDER-ARCHIVE-13 | OK |
| PATCH | `/api/provider/products/by-product/[productId]/price` | PROVIDER | API-PROVIDER-PRICE-13 | OK |
| GET | `/api/provider/products/[providerProductId]/price-history` | PROVIDER | API-PROVIDER-PRICE-13 | OK |
| DELETE | `/api/provider/local-products` y `[id]` | 405 | API-PROVIDER-ARCHIVE-13 | OK |
| GET/PATCH | `/api/provider/inventory*` | PROVIDER | API-INVENTORY-13 | OK |
| POST | `/api/provider/inventory/[id]/entries` | PROVIDER | API-INVENTORY-13 | OK |
| GET | `/api/provider/reports/inventory` | PROVIDER | API-PROVIDER-REPORTS-INV-13 | OK |
| GET | `/api/provider/reports/global/inventory` | PROVIDER N>1 | API-PROVIDER-REPORTS-INV-13 | OK |

Paths **sin** `/api/v1/` (ADR-002). Envelope `{ data }` / `{ error, details }` (ADR-003).

## 2. Validación (DTOs)

- [x] body/query con Zod (`catalog-f10.ts`, `inventory.ts`)
- [x] `parseStrictPagination` → 400 si page/limit inválidos (admin, panel, historial, reportes inv)

## 3. Base de datos

- [x] Unique `provider_products (providerId, productId)` intacta
- [x] Migración `prisma/migrations/20260916180000_f13_archivo_oferta_unidad/migration.sql`
- [ ] Seed no requiere backfill de entradas (Won't)

## 4. Seguridad

- [x] JWT + rol
- [x] IDOR sucursal → 403 (`CatalogForbiddenError`)
- [x] Admin PRODUCTS view/edit

## 5. Pruebas

**Comando:** `npx vitest run` en `C:\Users\PC GAMER\LaBorregaMarket`  
**Resultado:** 376 passed / 81 files.

Módulo F13: `tests/unit/offer-f13.test.ts`, `tests/integration/f13-archive.routes.test.ts`, `tests/integration/inventory-entries.routes.test.ts` (BUG-020: 200/409/400 HTTP).

## 6. DoD Backend

- [x] Validación completa
- [x] Errores envelope sin stack
- [x] Secrets solo `.env`
- [x] RBAC
- [x] Sin N+1 en listados admin (include dueño) e inventario (reserved batch)
- [x] Tests 100% passing de la suite

## 7. JSON para Frontend

Ver `fase-13/handoff-frontend.md`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/module-handoffs/MOD-CATALOG-F13-handoff.md`
- **Agente Downstream:** Frontend (tras handoff UX) y QA (tras FE)
