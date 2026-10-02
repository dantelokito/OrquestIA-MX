# Handoff de Módulo: MOD-ORDERS (delta F12 Encargar)

> **Proyecto:** laborregamarket  
> **Módulo:** ORDERS  
> **Stack:** Next.js + Prisma  
> **Fecha:** 2026-09-14  
> **Contrato de referencia:** `API-ORDERS-12`, ADR-037

## Inputs Utilizados

- `API-ORDERS-12.md`

## 1. Endpoints (paths F3 sin cambio)

| Método | Ruta | Auth | Delta F12 |
|--------|------|------|-----------|
| POST | `/api/orders` | CLIENT | No muta `onHand`; PENDING entra a `reserved` computed |
| PATCH | `/api/orders/[id]` | CLIENT/PROVIDER/ADMIN | CLIENT: cancelar PENDING |
| PATCH | `/api/provider/orders/[id]` | PROVIDER + sucursal activa | DELIVERED commit; CANCELLED suelta reserva; 403 IDOR |

## 2. Comportamiento

- Crear Encargar con saldo 0/negativo → **2xx**.
- SKU no vendible → **409** ADR-022.
- Primera transición a `DELIVERED` (Marketplace): `onHand -= qtyCatalog` en transacción. Idempotente si ya estaba DELIVERED.
- `CANCELLED` desde activa: no toca `onHand` (sale del SUM).
- `source=POS`: PATCH status no vuelve a descontar (el cobro ya lo hizo).
- Transiciones inválidas F3 (ej. cancelar DELIVERED) siguen en **409**.

## 3. Pruebas

Unit: create Marketplace no llama `providerProduct.update`; DELIVERED desde IN_TRANSIT sí decrementa. Suite completa 352 passed.

## 6. DoD Backend

- [x] Sin 4xx de stock en create
- [x] Commit atómico status + onHand
- [x] ISO panel 403
- [x] Tests pasando

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/module-handoffs/MOD-ORDERS-handoff.md`
- **Agente Downstream:** Frontend, QA
