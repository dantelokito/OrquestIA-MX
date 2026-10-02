# Handoff de Feature: FEAT-ORDERS

> **Proyecto:** laborregamarket  
> **Feature:** ORDERS (checkout pickup, historial `/cuenta`, órdenes proveedor)  
> **Stack UI:** Next.js 15 + React 19 + Tailwind 4  
> **Fecha:** 2026-08-13  
> **Wireframe:** `WF-fruteria-encargar`, `WF-carrito`, `WF-cuenta-pedidos`, `WF-proveedor-ordenes`  
> **Contrato:** `API-ORDERS-01`, `API-PROVIDER-ORDERS-01`

---

## 1. Pantallas y componentes implementados

| Pantalla / Vista | Wireframe | Ruta | Estado |
|------------------|-----------|------|--------|
| Detalle + Encargar | `WF-fruteria-encargar` | `/fruteria/[id]` | OK |
| Carrito y confirmación | `WF-carrito` | `/carrito` | OK |
| Historial cliente | `WF-cuenta-pedidos` | `/cuenta` | OK |
| Órdenes proveedor | `WF-proveedor-ordenes` | `/proveedor/ordenes` | OK |

**Componentes:** `QuantityStepper`, `ConfirmDialog`, `OrderStatusBadge`, `OriginBadge`, `PickupNotice`, `CartSummaryBar`, `OrderSuccessPanel`, `OrdersHistory`, `SubNavProveedor`

---

## 2. Integración API

| Endpoint | Método | Service | Contrato | Estado |
|----------|--------|---------|----------|--------|
| `/api/providers/[id]` | GET | `getProviderById` | productos + `providerProductId` | OK |
| `/api/orders` | POST | `createOrder` + `Idempotency-Key` | API-ORDERS-01 | OK |
| `/api/orders` | GET | `listMyOrders` | API-ORDERS-01 | OK |
| `/api/orders/[id]` | PATCH | `updateOrderStatus` `{ status: CANCELLED }` | API-ORDERS-01 | OK |
| `/api/provider/orders` | GET | `listProviderOrders` | API-PROVIDER-ORDERS-01 | OK |
| `/api/provider/orders/[id]` | PATCH | `transitionProviderOrder` | API-PROVIDER-ORDERS-01 | OK |

- [x] Cookie de sesión (`credentials: include`); no Bearer en el cliente
- [x] 401 en confirmar → `/login?next=/carrito`
- [x] Sin `fetch` en vistas; capa `lib/api/`

Carrito: `sessionStorage` (`lbm-cart-f3`), una frutería (D-F3-6).

---

## 3. Estados UI

| Vista | Loading | Empty | Error | Success |
|-------|---------|-------|-------|---------|
| `/fruteria/[id]` | Skeleton | Sin productos + ContactCTA | ErrorBanner | Stepper + barra Encargar |
| `/carrito` | Skeleton | Vacío + Ver fruterías | ErrorBanner + Reintentar | Confirmación #shortId |
| `/cuenta` pedidos | 3 skeletons | Todavía no tienes pedidos | ErrorBanner; 409 al cancelar | Lista + badge |
| `/proveedor/ordenes` | 4 skeletons | No tienes pedidos activos | ErrorBanner; 409 toast | Cards + drawer |

---

## 4. Formularios y validación

| Formulario | Campos | Mensajes inline |
|------------|--------|-----------------|
| Notas carrito | max 280 | contador `n/280` |
| Cancelar | ConfirmDialog | 409 "Ese cambio ya no es posible" |

---

## 5. Responsive y accesibilidad

- [x] Checkout mobile-first; POS/órdenes tablet
- [x] Stepper 44px; `aria-label` por producto
- [x] `IN_TRANSIT` = "Listo para recoger"
- [x] Tabs `role="tablist"` + `?tab=`
- [x] ConfirmDialog: `aria-modal`, Escape, foco inicial no destructivo

---

## 6. Pruebas

**Comando:** `npx vitest run tests/unit/format.test.ts tests/unit/session-cart.test.ts tests/unit/order-labels.test.ts`

---

## 7. DoD Frontend

- [x] Pixel-fidelidad según WF F3
- [x] Responsive
- [x] 4 estados UI
- [x] Consumo limpio de APIs
- [x] Validación (notas, cancelar)
- [x] Accesibilidad basal

---

## 8. Notas

Contacto F2 (Llamar / WhatsApp) se conserva. Un pedido = una frutería. Precios de línea en historial son snapshot del API.
