# Handoff de Feature: FEAT-DELIVERY

> **Proyecto:** laborregamarket  
> **Feature:** DELIVERY (Should — checkout domicilio)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-14  
> **Wireframe:** `WF-carrito-eta`, `WF-cuenta-pedidos-f4`  
> **Contrato:** `API-ORDERS-01` (delta)

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Toggle fulfillment | `WF-carrito-eta` | `/carrito` | OK |
| Badge En camino | `WF-cuenta-pedidos-f4` | `/cuenta`, ticket | OK |

**Componentes:** `FulfillmentToggle`; `OrderStatusBadge` usa `inTransitLabel(fulfillmentType)`.

Toggle visible **solo** si `offersDelivery`. Pickup F3 default.

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/orders` | POST | `createOrder` + `fulfillmentType` + `deliveryAddressId?` + `clientLat/Lng` | API-ORDERS-01 | OK |

Confirmar bloqueado si DELIVERY sin dirección.

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| Toggle | — | sin `offersDelivery` → oculto | sin dirección | Recoger / A domicilio |
| IN_TRANSIT | — | — | — | PICKUP “Listo para recoger”; DELIVERY “En camino” |

---

## 4. Formularios y validación

Dirección requerida si DELIVERY. Settings proveedor: checkbox “Ofrezco entrega a domicilio”.

---

## 5. Responsive y accesibilidad

- [x] “En camino” solo `fulfillmentType=DELIVERY`
- [x] Icono Truck + texto (nunca color-only)

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/order-labels.test.ts tests/unit/reviews-copy.test.ts`

---

## 7. DoD Frontend

- [x] Should tras GEO
- [x] Pickup F3 intacto si no hay toggle
- [x] Copy IN_TRANSIT ramificado

---

## 8. Notas para downstream

### QA Tester

- Proveedor sin delivery: checkout pickup F3
- Con delivery: dirección + badge En camino en IN_TRANSIT
