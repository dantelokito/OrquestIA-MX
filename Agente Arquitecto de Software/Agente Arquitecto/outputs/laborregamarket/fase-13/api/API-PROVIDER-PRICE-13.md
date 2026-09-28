# API-PROVIDER-PRICE-13 — Precio de oferta e historial

> **Endpoints:** `PATCH /api/provider/products/by-product/[productId]/price` · `GET /api/provider/products/[providerProductId]/price-history`  
> **Descripción:** Precio = `ProviderProduct.price` de **esa** sucursal. Historial por oferta. No muta maestro GLOBAL.  
> **Autenticación:** Requerida — PROVIDER + sucursal activa  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.13.0  
> **Fecha:** 2026-09-16  
> **US:** US-CAT-19, US-CAT-20  
> **ADR:** ADR-038, ADR-003, ADR-002, ADR-034  
> **Envelope:** ADR-003

## Inputs Utilizados

- PRD D-F13-17/18/22
- Esquema `DB-provider-product-price-history.md`

---

## PATCH `/api/provider/products/by-product/[productId]/price`

Crea oferta si GLOBAL no tenía fila (precio requerido). No cambia `saleUnit`. Encargar **no** bloquea cambio de precio.

#### Body

```json
{ "price": "49.90" }
```

| Campo | Regla |
|-------|--------|
| `price` | string o number ≥ 0, máx. 2 decimales. Requerido. |

Si el valor es **igual** al vigente → 200 **sin** fila nueva de historial.

Si cambia (o es create): actualiza `ProviderProduct.price` + inserta `ProviderProductPriceHistory` (`previousPrice` = anterior o null).

#### 200

```json
{
  "data": {
    "productId": "clxp01",
    "providerProductId": "clxpp01",
    "price": "49.90",
    "previousPrice": "45.00"
  }
}
```

Create: `previousPrice` null.

Otra sucursal / IDOR → **403**. Producto LOCAL ajeno → **403**.

---

## GET `/api/provider/products/[providerProductId]/price-history`

#### Query

| Param | Default | Notas |
|-------|---------|-------|
| `page` | 1 | ≥ 1 |
| `limit` | 50 | Máx. 100 |

Orden: `createdAt DESC`.

#### 200

```json
{
  "data": [
    {
      "id": "clxhist01",
      "price": "49.90",
      "previousPrice": "45.00",
      "changedByUserId": "clxuser01",
      "createdAt": "2026-09-16T18:10:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 50, "total": 3, "totalPages": 1 }
}
```

`providerProductId` de otra sucursal (mismo user u otro) → **403**.

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Precio inválido |
| 401 | Sin sesión |
| 403 | Rol / IDOR |
| 500 | Error interno |

Reportes de **ventas** no leen esta tabla; leen `OrderItem.unitPrice`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/api/API-PROVIDER-PRICE-13.md`
- **Agente Downstream:** Backend Developer
