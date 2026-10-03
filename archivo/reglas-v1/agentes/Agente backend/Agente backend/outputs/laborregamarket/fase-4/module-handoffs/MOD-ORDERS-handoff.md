# Handoff de Módulo: MOD-ORDERS

> **Proyecto:** LaBorregaMarket  
> **Módulo:** ORDERS (delta Should F4 — delivery + ETA snapshot)  
> **Stack:** Next.js 15 + Prisma + PostgreSQL  
> **Fecha:** 2026-08-14  
> **Contrato de referencia:** `API-ORDERS-01` F4 Should, ADR-017

---

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato API | Estado |
|--------|------|------|--------------|--------|
| POST | `/api/orders` (delta) | CLIENT | API-ORDERS-01 | OK |
| GET | `/api/orders`, `/api/orders/[id]` | CLIENT / dueño | mismos extras | OK |

POS sales **sin cambio**.

---

## 2. Validación (DTOs)

`createMarketplaceOrderSchema`: `fulfillmentType` default PICKUP, `deliveryAddressId` requerido si DELIVERY, `clientLat`/`clientLng` bbox (juntos).

Reglas: `offersDelivery=false` → 400; dirección ajena → 404; PICKUP ignora address.

---

## 3. Base de datos

Campos ya migrados F4: `fulfillmentType`, `deliveryAddressId`, `deliveryAddressSnapshot`, `etaMinutes`.

---

## 4. Seguridad

- [x] Ownership de dirección
- [x] JWT CLIENT

---

## 5. Pruebas

`npm test -- tests/unit/order.service.test.ts tests/integration/orders.routes.test.ts`

---

## 6. Definition of Done (DoD Backend)

- [x] Validación Completa
- [x] Manejo de Errores Robust
- [x] Seguridad de Endpoints
- [x] Pruebas Superadas

---

## 7. Notas para downstream

### Frontend

Copy `IN_TRANSIT`: si `fulfillmentType=DELIVERY` → "En camino"; si PICKUP → "Listo para recoger". Enum de status no cambia.

### QA

DELIVERY sin address → 400. Provider sin `offersDelivery` → 400. Pickup con `deliveryAddressId` se ignora.

### DevOps

Sin env extra.
