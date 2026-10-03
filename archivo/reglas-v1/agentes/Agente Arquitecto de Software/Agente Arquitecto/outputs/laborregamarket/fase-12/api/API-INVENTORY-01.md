# API-INVENTORY-01 — Inventario de sucursal activa

> **Endpoints:** `GET` `/api/provider/inventory` · `GET` `/api/provider/inventory/[providerProductId]` · `PATCH` `/api/provider/inventory/[providerProductId]` · `POST` `/api/provider/inventory/[providerProductId]/entries`  
> **Descripción:** Listado y ficha de existencias de la sucursal **activa**. Entrada de saldo y edición de tope/umbral/alerta/factor caja. SubNav es Frontend; este contrato aísla datos.  
> **Autenticación:** Requerida → Header `Authorization: Bearer <token>` + cookie `lbm_active_provider` (ADR-034)  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.12.0  
> **Fecha:** 2026-09-14  
> **US:** US-INV-01, US-INV-02, US-INV-03, US-INV-04  
> **ADR:** ADR-002 (sin `/api/v1/`), ADR-003, ADR-004, ADR-022, ADR-034, ADR-036, ADR-037  
> **Envelope:** ADR-003 (`data` / `error` + `details[]`). No flag `success` redundante.

## Inputs Utilizados

- **PRD:** `Administrador de producto/.../fase-12/prd.md`
- **ISO F11 (solo lectura):** `fase-11/api/API-PROVIDER-ISO-01.md`

---

## Resolución de sucursal

`providerId` = `resolveActiveProvider`. Si el cliente envía `providerId` o id de `ProviderProduct` de otra sucursal (mismo user u otro dueño) → **403**. CLIENT / ADMIN sin rol PROVIDER → **403**. Sin JWT → **401**.

---

## GET `/api/provider/inventory`

Lista SKUs del catálogo de la sucursal activa (incluye inactivos, coherente con panel CAT). Paginación offset ADR-004.

### Query

| Param | Tipo | Default | Notas |
|-------|------|---------|-------|
| `page` | int | 1 | ≥ 1 |
| `limit` | int | 50 | Máx. 100. Catálogo de sucursal típico cabe en una página. |

### 200 Success

```json
{
  "data": [
    {
      "providerProductId": "clxpp01",
      "productId": "clxp01",
      "name": "Mango Ataulfo",
      "unit": "KG",
      "isAvailable": true,
      "imageUrl": "/api/media/abc123.webp",
      "onHand": "12.500",
      "reserved": "3.000",
      "capacityMax": "20.000",
      "fillPercent": 62.5,
      "alertThresholdPercent": 10,
      "alertEnabled": true,
      "lowStockAlert": false,
      "boxContentFactor": "10.000"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "totalPages": 1
  }
}
```

Decimales en JSON como **string** con 3 decimales (evita float). El FE puede parsear.

### Campos derivados

| Campo | Regla |
|-------|--------|
| `reserved` | SUM converted qty de `OrderItem` con `Order.source=MARKETPLACE` y status ∉ {DELIVERED, CANCELLED} y `providerId` activo (ADR-037). |
| `fillPercent` | Si `capacityMax` es null o ≤ 0: `null`. Si no: `(onHand / capacityMax) * 100` (puede ser > 100 o negativo). |
| `lowStockAlert` | `false` si `alertEnabled=false` o no hay tope. Si no: `fillPercent <= alertThresholdPercent`. On-hand negativo con tope y alerta on → `true`. |
| `imageUrl` | Misma URL disco F10 (`ProviderProduct.imageUrl` o fallback `Product.imageUrl`). No Cloudinary. |

Empty: `data: []`, `total: 0` (FE empty state).

---

## GET `/api/provider/inventory/[providerProductId]`

Misma forma de un ítem (sin array). 403 si el id no es de la sucursal activa. 404 **no** para id cruzado (usar 403). 404 solo si el id no existe **después** de confirmar que no es de otra sucursal enumerable; Backend puede unificar cruzado+inexistente como **403** (preferido F11).

---

## PATCH `/api/provider/inventory/[providerProductId]`

Ficha: tope, umbral, alerta, factor caja. **No** muta `onHand` ni `isAvailable`.

### Body

```json
{
  "capacityMax": "25.000",
  "alertThresholdPercent": 10,
  "alertEnabled": true,
  "boxContentFactor": "10.000"
}
```

Todos opcionales; al menos un campo. `capacityMax: null` quita el tope. `boxContentFactor: null` limpia el factor (entonces `receiveAs=BOX` fallará 400).

### 200 Success

Mismo objeto que GET ficha.

### 400 Bad Request

- `capacityMax` presente y ≤ 0 (salvo `null`)
- `alertThresholdPercent` no entero 1–100
- `boxContentFactor` presente y ≤ 0 (salvo `null`)
- Body vacío

```json
{
  "error": "Datos inválidos",
  "details": [{ "field": "capacityMax", "message": "El tope debe ser mayor que cero" }]
}
```

---

## POST `/api/provider/inventory/[providerProductId]/entries`

Suma existencias. Permite entrada con saldo mal o sobre-tope.

### Body

```json
{
  "quantity": "2.000",
  "receiveAs": "CATALOG"
}
```

| Campo | Regla |
|-------|--------|
| `quantity` | Decimal > 0. Requerido. |
| `receiveAs` | `CATALOG` (default) o `BOX`. |

- `CATALOG`: `onHand += quantity` (unidad de `Product.unit`).
- `BOX`: si `boxContentFactor` es null o ≤ 0 → 400. Si no: `onHand += quantity * boxContentFactor`.

Sin kardex: no se persiste el movimiento; solo el saldo.

### 200 Success

Objeto ficha actualizado (incluye `onHand` nuevo).

### 400

Cantidad vacía, no numérica, ≤ 0; `receiveAs` inválido; BOX sin factor.

---

## Errores HTTP (todos los métodos de este archivo)

| HTTP | Uso |
|------|-----|
| 400 | Validación Zod |
| 401 | Sin sesión |
| 403 | Rol o IDOR / sucursal cruzada |
| 404 | No usar para IDOR; opcional recurso huérfano |
| 500 | Error interno |

**Prohibido:** 409 por stock en estas rutas.

---

## Rendimiento

Una query de catálogo de la sucursal + **una** agregación `GROUP BY providerProductId` de reserved. Prohibido N+1 (un `findMany` de orders por fila).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/api/API-INVENTORY-01.md`
- **Agente Downstream:** Backend Developer
