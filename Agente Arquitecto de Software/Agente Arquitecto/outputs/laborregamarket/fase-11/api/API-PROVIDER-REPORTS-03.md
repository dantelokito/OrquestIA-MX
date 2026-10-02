# API-PROVIDER-REPORTS-03 — Reportes globales (todas las sucursales)

> **Endpoint:** `GET /api/provider/reports/global` (**path nuevo**)  
> **Módulo:** `DASH`  
> **Versión:** 0.11.0  
> **Fecha:** 12/09/2026  
> **US:** US-DASH-11  
> **ADR:** [`../../comun/adrs/ADR-035-global-provider-reports.md`](../../comun/adrs/ADR-035-global-provider-reports.md), ADR-033  
> **Autenticación:** Requerida — PROVIDER con N>1  
> **No reutiliza** `GET /api/provider/reports` (ese path sigue = sucursal activa, contrato F10)

## Inputs Utilizados

- **US-DASH-11**, PRD D-F11-2
- **F10:** `fase-10/api/API-PROVIDER-REPORTS-02.md` (solo lectura)

---

## GET `/api/provider/reports/global`

> **Descripción:** Agrega GMV de **todas** las sucursales del user. No usa `activeProviderId` como filtro.

#### Query

Igual que modo F10 de reports sucursal:

| Param | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `from` | string `YYYY-MM-DD` | Sí en modo rango | Inicio inclusive TZ Monterrey |
| `to` | string `YYYY-MM-DD` | Sí en modo rango | Fin inclusive |
| `grain` + `date` | | XOR vs from/to | Modo F6 sobre el **conjunto** de sucursales (Should de simetría; Must = modo `from`/`to`) |
| `productIds` | string[] | No | `ProviderProduct.id` de **cualquier** sucursal propia, o `quickSale` |

Mezcla from/to con grain/date → 400 (mismo mensaje F10).

Ventana: mismas reglas ADR-033 (366 días, no futuro, `from` ≤ `to`). `status ≠ CANCELLED`. GMV = `SUM(OrderItem.subtotal)` si hay filtro de ítems; si no, suma de `Order.total` de órdenes incluidas. `orderCount` = órdenes distintas.

`productIds` con id no perteneciente a **ningún** Provider del user → **403**.

#### Autorización

| Caso | HTTP |
|------|------|
| Sin JWT | 401 |
| No PROVIDER | 403 |
| N ≤ 1 | **403** `{ "error": { "code": "GLOBAL_REPORTS_NOT_AVAILABLE", "message": "El reporte global solo está disponible con más de una sucursal" }, "timestamp": "2026-09-12T21:00:00.000Z" }` |
| N > 1 dueño | 200 |

No 404. No 200 con `empty` fingiendo el módulo cuando N=1.

#### 200 (con ventas)

```json
{
  "data": {
    "empty": false,
    "timezone": "America/Monterrey",
    "generatedAt": "2026-09-12T21:00:00.000Z",
    "scope": "allOwnedProviders",
    "providerCount": 2,
    "period": {
      "mode": "range",
      "from": "2026-09-01",
      "to": "2026-09-12",
      "fromUtc": "2026-09-01T06:00:00.000Z",
      "toUtc": "2026-09-13T06:00:00.000Z"
    },
    "kpis": {
      "gmv": "20000.00",
      "avgTicket": "250.00",
      "orderCount": 80,
      "bySource": {
        "MARKETPLACE": { "gmv": "12000.00", "orderCount": 50 },
        "POS": { "gmv": "8000.00", "orderCount": 30 }
      }
    },
    "byProvider": [
      {
        "providerId": "clxcentro000000000000001",
        "businessName": "Frutas El Paraíso",
        "gmv": "12500.50",
        "orderCount": 48,
        "avgTicket": "260.43"
      },
      {
        "providerId": "clxtecno0000000000000002",
        "businessName": "El Paraíso Tecnológico",
        "gmv": "7499.50",
        "orderCount": 32,
        "avgTicket": "234.36"
      }
    ],
    "series": [
      { "bucket": "2026-09-01", "gmv": "800.00", "orderCount": 4 }
    ],
    "products": [
      {
        "providerProductId": "clxsku00000000000000001",
        "providerId": "clxcentro000000000000001",
        "businessName": "Frutas El Paraíso",
        "name": "Mango",
        "quantitySum": "12.000",
        "salesTotal": "540.00",
        "bySource": {
          "MARKETPLACE": { "gmv": "300.00", "quantitySum": "8.000" },
          "POS": { "gmv": "240.00", "quantitySum": "4.000" }
        }
      }
    ]
  }
}
```

Dinero `formatMoney`, cantidades `formatQuantity`. `series`: un bucket por día (ceros si no hay venta). `byProvider`: **todas** las sucursales del user (ceros si una no vendió). `products`: filas del predicado (no top 5); cada fila lleva `providerId` para no mezclar SKUs homónimos.

#### 200 vacío (N>1 sin ventas)

`empty: true`, kpis cero, `byProvider` con sucursales en cero, `series` en cero, `products: []`.

Print consolidado: Should FE (sin path Must). PDF F6 no se reabre.

#### Errores

| HTTP | Caso |
|------|------|
| 400 | Fechas, span, mezcla de modos |
| 401 | Sin sesión |
| 403 | Rol, N≤1, o `productIds` ajenos |
| 404 | No usado |
| 409 | No usado |
| 500 | Error interno |

Implementación: `WHERE provider_id IN (SELECT id FROM providers WHERE user_id = $sub)`. Una agregación, no un loop N+1.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/api/API-PROVIDER-REPORTS-03.md`
- **Agente Downstream:** Backend, Frontend, QA
