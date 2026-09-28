# Handoff de Módulo: MOD-OFFER-SECTIONS-F14

> **Proyecto:** laborregamarket  
> **Módulo:** Oferta precio > 0 + DELETE sección 409  
> **Stack:** Next.js App Router + Prisma + Zod  
> **Fecha:** 2026-09-17  
> **Contrato de referencia:** API-PROVIDER-OFFER-14, API-PROVIDER-SECTIONS-14

## Inputs Utilizados

- Handoff Arquitecto `fase-14/handoff-backend-fase-14.md`
- ADR-038, ADR-022, ADR-030

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| PATCH | `/api/provider/products/by-product/[productId]` | PROVIDER | API-PROVIDER-OFFER-14 | OK |
| PATCH | `/api/provider/products` | PROVIDER | API-PROVIDER-OFFER-14 | OK |
| POST/PATCH | `/api/provider/local-products*` | PROVIDER | API-PROVIDER-OFFER-14 | OK |
| DELETE | `/api/provider/sections/[id]` | PROVIDER | API-PROVIDER-SECTIONS-14 | OK 409 usable |

## 2. Validación

- [x] Si `nextAvailable === true` entonces `nextPrice > 0`
- [x] Stub `price=0` + activar sin precio nuevo → 400 `Precio de venta inválido`
- [x] Prohibido fallback `?? 50` / default 50 de precio en servidor
- [x] DELETE sección con productos: 409 `{ "error": "La sección tiene productos. Muévelos antes de eliminarla", "details": [{ "field": "id", "message": "Reasigna los productos a otra sección" }] }`

## 3. Base de datos

Sin migración de oferta. Precio 0 del stub F13 se conserva si la oferta sigue inactiva.

## 4. Seguridad

IDOR 403 intacto. No se muta `Product.unit` GLOBAL.

## 5. Pruebas

`tests/unit/offer-price-f14.test.ts`, PATCH precio 0 en `inventory-f14.routes.test.ts`, DELETE 409 body en `local-catalog.routes.test.ts`.

## 6. DoD Backend

- [x] Validación completa
- [x] Tests en verde

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/module-handoffs/MOD-OFFER-SECTIONS-F14-handoff.md`
- **Agente Downstream:** Frontend, QA
