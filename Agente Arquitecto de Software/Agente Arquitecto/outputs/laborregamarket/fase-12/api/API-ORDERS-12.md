# API-ORDERS-12 — Delta Encargar reserva / commit / restore

> **Endpoints:** `POST` `/api/orders` · `PATCH` `/api/orders/[id]` (y transiciones panel proveedor vigentes)  
> **Descripción:** Pedido Marketplace activo reserva cantidad visible; DELIVERED hace commit de `onHand`; CANCELLED suelta la reserva. Paths F3 **sin cambio**.  
> **Autenticación:** CLIENT en create; PROVIDER/CLIENT según contrato F3 de PATCH  
> **Versión:** 0.12.0  
> **Fecha:** 2026-09-14  
> **US:** US-INV-06, US-INV-04  
> **ADR:** ADR-022, ADR-034, ADR-036, ADR-037  
> **Base (solo lectura):** `fase-3/api/API-ORDERS-01.md`, `fase-5/api/API-PROVIDER-PRODUCTS-01.md`

## Inputs Utilizados

- Definición de activas Encargar: `OrderSource.MARKETPLACE` ∧ status ∉ {DELIVERED, CANCELLED}

---

## POST `/api/orders`

Sin cambio de body. Side effect inventario:

- **No** modificar `onHand`.
- La orden `PENDING` + `MARKETPLACE` entra al SUM `reserved`.
- `onHand` 0 o negativo: **2xx** (pedido creado).
- SKU no vendible: **409** `{ "error": "Producto no disponible" }` (ADR-022). **No** 4xx de stock.

Convertir `OrderItem.quantity` + `unitOfMeasure` a unidad de catálogo con la **misma tabla** que `API-POS-12.md`.

---

## PATCH status → `DELIVERED`

Transacción:

1. Si status previo ya era `DELIVERED`: no-op inventario (idempotente).
2. Si status previo era `CANCELLED`: **409** (regla F3 de transiciones; no “re-entregar”).
3. Si status previo era activa Encargar: `onHand -= qtyCatalog` por cada línea de catálogo del **mismo** `providerId` de la orden; luego persistir `DELIVERED`.

Puede quedar `onHand` negativo. Respuesta 2xx de F3.

Órdenes `source=POS`: **no** restar de nuevo (el cobro ya descontó). Si un POS quedó `CONFIRMED` (“recoger más tarde”) sin haber pasado por `pos/sales` completo, Backend solo descuenta si esa venta **aún no** aplicó delta F12; el camino Must es `POST /api/provider/pos/sales`.

---

## PATCH status → `CANCELLED`

Desde PENDING / CONFIRMED / IN_TRANSIT (Marketplace):

- **No** tocar `onHand`.
- La orden sale del SUM reserved.

Desde `DELIVERED`: no “restore” Must (Won't reabrir entregas). Si F3 ya rechaza cancelar entregado, conservar ese 409.

---

## IDOR

Orden de sucursal B con panel activo A → **403**. Create Encargar usa `providerId` del body (vitrina cliente), **no** el cookie del dueño (F11 explore).

---

## Errores

| HTTP | Uso |
|------|-----|
| 400 | Validación F3 |
| 401 | Sin sesión |
| 403 | IDOR panel |
| 409 | ADR-022 o transición F3 inválida. **Nunca** stock |
| 500 | Error interno |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/api/API-ORDERS-12.md`
- **Agente Downstream:** Backend Developer
