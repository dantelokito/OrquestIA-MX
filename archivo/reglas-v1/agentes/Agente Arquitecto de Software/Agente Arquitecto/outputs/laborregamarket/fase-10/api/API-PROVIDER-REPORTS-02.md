# API-PROVIDER-REPORTS-02 — Rango `from`/`to` y venta por producto

> **Endpoint:** `GET /api/provider/reports` (delta de query; **mismo path** F6)  
> **Módulo:** `DASH`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-DASH-07, US-DASH-08  
> **ADR:** [`../../comun/adrs/ADR-033-report-date-range.md`](../../comun/adrs/ADR-033-report-date-range.md)  
> **Autenticación:** Requerida — Rol `PROVIDER` (dueño)  
> **Base grain (solo lectura):** [`../../fase-6/api/API-PROVIDER-REPORTS-01.md`](../../fase-6/api/API-PROVIDER-REPORTS-01.md)

## Inputs Utilizados

- **US:** `US-DASH-07`, `US-DASH-08`
- **CO:** `CO-F10-003`
- **No editar:** `fase-6/`

---

## Discriminación de query

| Modo | Query requerida | Prohibido en el mismo request |
|------|-----------------|-------------------------------|
| F6 | `grain` + `date` | `from`, `to` |
| F10 | `from` + `to` | `grain`, `date` |

Mezcla → **400** `{ "error": "Validation failed", "details": [{ "field": "from", "message": "No combines from/to con grain/date" }] }`.

Modo F6: contrato F6 **sin cambios** (incl. `topProducts` top 5).

---

## GET `/api/provider/reports` — modo F10

> **Descripción:** Agregar GMV y desglose por producto del **propio** negocio en un rango de fechas calendario inclusive (TZ America/Monterrey).

#### Query

| Param | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `from` | string | Sí (modo F10) | `YYYY-MM-DD` inicio inclusive |
| `to` | string | Sí (modo F10) | `YYYY-MM-DD` fin inclusive |
| `productIds` | string[] | No | Repetible. Cuid de `ProviderProduct.id` o sentinel `quickSale` |

El atajo de mes es **Frontend**: no hay param `month`.

#### Ventana

`fromUtc = monterreyDayStartUtc(from)`; `toExclusiveUtc = monterreyDayStartUtc(to) + 1 day`. Filtro `Order.createdAt >= fromUtc AND createdAt < toExclusiveUtc`. `status ≠ CANCELLED`. Solo `providerId` de `session.sub`.

| Error | HTTP |
|-------|------|
| Formato inválido | 400 |
| `from` > `to` | 400 `details.field=from` |
| Días inclusive > 366 | 400 `details.field=to` |
| `to` (o `from`) estrictamente futuro vs hoy Monterrey | 400 |
| `productIds` con id de **otro** negocio | **403** |
| `productIds` con cuid inexistente | **403** (no filtrar existencia; tratar como ajeno) |

#### Semántica `productIds`

| Valor | Efecto |
|-------|--------|
| Ausente o lista vacía | Todos los SKUs **con movimiento** en el periodo (incluye venta rápida si hubo) |
| Uno o más cuid | Solo esos `ProviderProduct` propios |
| `quickSale` | Líneas `providerProductId IS NULL` |
| cuid + `quickSale` | Unión |

KPIs recortados al predicado de ítems (GMV = suma de `Order.total` de órdenes que **después del filtro de ítems** siguen teniendo al menos una línea incluida; si se filtra por SKU, GMV = `SUM(OrderItem.subtotal)` de esas líneas, no el `Order.total` completo — **Must: GMV = SUM(subtotal) de ítems incluidos** para no inflar con líneas no marcadas). `orderCount` = conteo distinto de `orderId` con al menos un ítem incluido. `avgTicket` = gmv / orderCount.

Dinero: strings `formatMoney`. Cantidades: `formatQuantity`. Envelope ADR-003.

#### 200 (con ventas)

```json
{
  "data": {
    "empty": false,
    "timezone": "America/Monterrey",
    "generatedAt": "2026-08-28T18:00:00.000Z",
    "provider": {
      "id": "clx...",
      "businessName": "Frutas El Paraíso"
    },
    "period": {
      "mode": "range",
      "from": "2026-08-01",
      "to": "2026-08-31",
      "fromUtc": "2026-08-01T06:00:00.000Z",
      "toUtc": "2026-09-01T06:00:00.000Z"
    },
    "kpis": {
      "gmv": "12500.50",
      "avgTicket": "260.43",
      "orderCount": 48,
      "bySource": {
        "MARKETPLACE": { "gmv": "8200.00", "orderCount": 30 },
        "POS": { "gmv": "4300.50", "orderCount": 18 }
      }
    },
    "series": [
      { "bucket": "2026-08-01", "gmv": "400.00", "orderCount": 2 }
    ],
    "products": [
      {
        "providerProductId": "clx...",
        "name": "Mango",
        "quantitySum": "12.000",
        "salesTotal": "540.00",
        "bySource": {
          "MARKETPLACE": { "gmv": "300.00", "quantitySum": "8.000" },
          "POS": { "gmv": "240.00", "quantitySum": "4.000" }
        }
      },
      {
        "providerProductId": null,
        "name": "Venta rápida",
        "quantitySum": "2.000",
        "salesTotal": "20.00",
        "bySource": {
          "MARKETPLACE": { "gmv": "0.00", "quantitySum": "0.000" },
          "POS": { "gmv": "20.00", "quantitySum": "2.000" }
        }
      }
    ]
  }
}
```

`series`: un punto por día de `from`–`to` (ceros en días sin venta). `products`: **todas** las filas del predicado (no top 5). Venta rápida: `providerProductId: null` y se incluye si aplica `quickSale` o “todos”.

#### 200 vacío

`empty: true`, kpis en cero, `series` con buckets en cero, `products: []`. No 404.

#### Auth

401 sin cookie. 403 CLIENT/ADMIN u otro rol. Un PROVIDER no selecciona otro negocio.

Print: [`API-DASH-NOTES-01.md`](./API-DASH-NOTES-01.md). PDF F6 `GET /api/provider/reports.pdf` **no** se reabre; PDF de este corte = Should.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Route | `src/app/api/provider/reports/route.ts` — parse XOR |
| Service | Extender `getProviderReport` o `getProviderReportRange` |
| TZ | `src/lib/timezone.ts` |
| Tests | 401/403; from>to; span 367; IDOR productIds; empty; GMV ≠ CANCELLED |

Sin migración. Índices `Order(providerId, createdAt)` existentes.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-PROVIDER-REPORTS-02.md`
- **Agente Downstream:** Backend Developer, Frontend (query + tabla)
