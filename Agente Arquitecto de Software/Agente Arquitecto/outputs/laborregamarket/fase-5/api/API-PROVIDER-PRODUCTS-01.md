# API-PROVIDER-PRODUCTS-01 — Catálogo inhabilitado en todos los canales (Fase 5)

> **Endpoints:** lecturas públicas, `POST /api/orders`, `POST /api/provider/pos/sales`, `GET /api/provider/dashboard`  
> **Módulo:** `PRODUCTS`, `ORDERS`, `POS`  
> **Versión:** 0.5.0  
> **Fecha:** 14/08/2026  
> **US:** US-CAT-01  
> **Base toggle:** [`../../fase-1/api/API-PROVIDER-01.md`](../../fase-1/api/API-PROVIDER-01.md)  
> **ADR:** [`../../comun/adrs/ADR-022-catalog-inactive.md`](../../comun/adrs/ADR-022-catalog-inactive.md)

Este documento es el **delta F5**. No hay path nuevo de toggle: sigue `GET`/`PATCH /api/provider/products`. Fuente de verdad: `ProviderProduct.isAvailable` (T9). **No** es stock.

Vendible = existe `ProviderProduct` del `providerId` de la orden **y** `isAvailable=true` **y** `Product.isActive=true`.

---

## Lecturas públicas — omitir inactivos

### GET `/api/providers` (listado / explorar)

`sampleProducts` y `_count.providerProducts` (y filtros `q` / `category`) **solo** filas con `isAvailable=true` y `Product.isActive=true`.

Hoy el listado ya filtra `isAvailable`; F5 exige **también** `product.isActive` en samples y count (cierra deriva OBS-F2-006 si aún aplica).

### GET `/api/providers/[id]` — `products[]`

> **Descripción:** Detalle de frutería.  
> **Autenticación:** Pública

**Incluir únicamente** productos vendibles. **Prohibido** devolver `{ isAvailable: false }` para que el FE los muestre en greyscale: el inhabilitado **desaparece**.

Hueco a cerrar en código: `getProviderDetail` filtra `Product.isActive` pero no `isAvailable`.

Orden: `category ASC`, `name ASC` (F1, sin cambio).

Shape de cada item (F1/F2, sin campos nuevos):

```json
{
  "providerProductId": "clx...",
  "productId": "clx...",
  "name": "Mango",
  "slug": "mango",
  "category": "FRUTA",
  "unit": "KG",
  "price": 45.00,
  "isAvailable": true,
  "imageUrl": null
}
```

`isAvailable` en la respuesta pública será siempre `true` (los `false` no se serializan).

---

## Panel proveedor — catálogo completo

### GET `/api/provider/products`

Sin delta de shape. **Sigue** devolviendo todos los `Product` globales activos con el estado de instancia (`price` null + `isAvailable` false = no activado). El dueño necesita ver inhabilitados para reactivar.

### PATCH `/api/provider/products`

Sin cambio (F1 upsert). Side effect AUDIT `ENABLE`/`DISABLE` se mantiene.

Reactivar (`isAvailable=true` + precio vigente) → el producto reaparece en detalle, explorar (si aplica), carrito elegible y POS.

---

## Comandos de venta — rechazo 409

### POST `/api/orders`

> **Autenticación:** CLIENT  
> Base F3: [`../../fase-3/api/API-ORDERS-01.md`](../../fase-3/api/API-ORDERS-01.md)

Si **cualquier** línea de catálogo no es vendible (id desconocido, otro provider, `isAvailable=false`, o `Product.isActive=false`):

- **No** crear la orden.
- **409 Conflict:**

```json
{ "error": "Producto no disponible" }
```

Código HTTP **409** (mapeo F3 de `ProductUnavailableError`). Envelope ADR-003. No usar 200 ni 201.

Replay de `Idempotency-Key` de una orden **ya creada** no se revalida contra el toggle actual (idempotencia F3 intacta).

### POST `/api/provider/pos/sales`

> **Autenticación:** PROVIDER  
> Base F3: [`../../fase-3/api/API-POS-01.md`](../../fase-3/api/API-POS-01.md)

Misma regla 409 en líneas con `providerProductId`. **Líneas libres** (`customItem` / `itemName`, ADR-013) **no** aplican esta regla.

POS UI: filtrar el GET del panel a `isAvailable=true`; si el catálogo vigente queda vacío, empty state (UX). El POST es la red de seguridad.

---

## Dashboard — top de catálogo vigente

### GET `/api/provider/dashboard`

Base F3: [`../../fase-3/api/API-PROVIDER-DASH-01.md`](../../fase-3/api/API-PROVIDER-DASH-01.md)

| Campo | F5 |
|-------|-----|
| `kpis`, `series7d`, `statusToday` | Sin cambio (histórico cobrado no se reescribe) |
| `topProducts` | Excluir filas cuyo `providerProductId` apunta a `isAvailable=false`. `providerProductId === null` (venta rápida) se mantiene |

---

## Carrito (FE)

No hay API de carrito (sesión cliente). Al inhabilitar:

1. FE retira la línea o la marca no disponible; no se puede volver a agregar hasta reactivar.
2. `POST /api/orders` rechaza 409 si el cliente confirma con un id viejo.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Detalle público | `src/lib/services/provider.service.ts` — `getProviderDetail`: `where: { isAvailable: true, product: { isActive: true } }` |
| Samples / count | Mismo service: `providerCardInclude` + `product.isActive` |
| Orders / POS | Ya lanzan `ProductUnavailableError` → 409; añadir tests de regresión |
| Dashboard | `src/lib/services/dashboard.service.ts` — JOIN / filtro `is_available` en el SQL de top 5 |
| FE POS / carrito / detalle | Ocultar, no greyscale |

---

## Referencias

- ADR-022: [`../../comun/adrs/ADR-022-catalog-inactive.md`](../../comun/adrs/ADR-022-catalog-inactive.md)
- Detalle F1: [`../../fase-1/api/API-PROVIDERS-01.md`](../../fase-1/api/API-PROVIDERS-01.md)
- Toggle F1: [`../../fase-1/api/API-PROVIDER-01.md`](../../fase-1/api/API-PROVIDER-01.md)
