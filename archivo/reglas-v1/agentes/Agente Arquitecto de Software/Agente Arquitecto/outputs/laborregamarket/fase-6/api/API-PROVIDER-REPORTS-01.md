# API-PROVIDER-REPORTS-01 — Reporte de ventas por periodo calendario

> **Endpoint:** `GET` `/api/provider/reports`  
> **Módulo:** `DASH`  
> **Versión:** 0.6.1  
> **Fecha:** 16/08/2026  
> **US:** US-DASH-04  
> **ADR:** [`../../comun/adrs/ADR-024-calendar-windows.md`](../../comun/adrs/ADR-024-calendar-windows.md)  
> **Autenticación:** Requerida — Rol `PROVIDER` → cookie JWT  
> **No es:** [`../../fase-3/api/API-PROVIDER-DASH-01.md`](../../fase-3/api/API-PROVIDER-DASH-01.md) (rolling hoy/7d/30d) ni [`../../fase-4/api/API-ADMIN-ANALYTICS-01.md`](../../fase-4/api/API-ADMIN-ANALYTICS-01.md)

`GET /api/provider/dashboard` **sigue vigente** sin delta. Este contrato es el reporte imprimible / PDF.

---

## GET `/api/provider/reports`

> **Descripción:** Agregar GMV, ticket promedio, órdenes, split Encargar vs POS, serie y top productos del **propio** negocio en un día, mes o año concreto (TZ America/Monterrey).  
> **Autenticación:** Requerida — Rol `PROVIDER` (`requireRole` + `resolveProviderByUserId(session.sub)`). ADMIN / CLIENT → **403**. Otro proveedor no es seleccionable.

#### Query Parameters:

| Param | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `grain` | enum | Sí | `day` \| `month` \| `year` |
| `date` | string | Sí | Forma según grano (tabla) |

| `grain` | `date` | Ejemplo |
|---------|--------|---------|
| `day` | `YYYY-MM-DD` | `2026-08-16` |
| `month` | `YYYY-MM` | `2026-08` |
| `year` | `YYYY` | `2026` |

Falta alguno, formato inválido o desajuste grano/`date` → **400**. Periodo estrictamente futuro vs hoy Monterrey → **400**. Periodo en curso (parcial) permitido.

Ventanas `[from, to)`: ver ADR-024. Dinero en JSON: strings `formatMoney` (`"85.50"`), cantidades `formatQuantity` (`"2.000"`), igual que F3.

#### 200 Success (con ventas):

```json
{
  "data": {
    "empty": false,
    "timezone": "America/Monterrey",
    "generatedAt": "2026-08-16T23:41:00.000Z",
    "provider": {
      "id": "clx...",
      "businessName": "Frutas El Paraíso"
    },
    "period": {
      "grain": "month",
      "date": "2026-08",
      "from": "2026-08-01T06:00:00.000Z",
      "to": "2026-09-01T06:00:00.000Z"
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
      { "bucket": "2026-08-01", "gmv": "400.00", "orderCount": 2 },
      { "bucket": "2026-08-02", "gmv": "0.00", "orderCount": 0 }
    ],
    "topProducts": [
      {
        "providerProductId": null,
        "name": "Venta rápida",
        "salesTotal": "20.00",
        "quantitySum": "2.000"
      }
    ]
  }
}
```

| Campo | Definición |
|-------|------------|
| `empty` | `true` si `orderCount === 0` (no 404) |
| `generatedAt` | Instant UTC de generación (encabezado print/PDF) |
| `kpis.gmv` | `SUM(total)` `status ≠ CANCELLED` en `[from, to)` |
| `kpis.avgTicket` | `gmv / orderCount`; `"0.00"` si vacío |
| `kpis.bySource` | Siempre ambas claves; ceros si no hay |
| `series` | `day` → `[]`. `month` → un punto por día (`bucket` = `YYYY-MM-DD`). `year` → un punto por mes (`bucket` = `YYYY-MM`). Buckets futuros del periodo en curso: `"0.00"` / 0 |
| `topProducts` | Top 5 por `SUM(subtotal)`; `providerProductId === null` = venta rápida; omitir filas de catálogo `isAvailable=false` |

`from` / `to` son instantes UTC equivalentes a medianoche Monterrey (UTC−6).

#### 200 Success (vacío):

```json
{
  "data": {
    "empty": true,
    "timezone": "America/Monterrey",
    "generatedAt": "2026-08-16T23:41:00.000Z",
    "provider": {
      "id": "clx...",
      "businessName": "Frutas El Paraíso"
    },
    "period": {
      "grain": "day",
      "date": "2026-08-10",
      "from": "2026-08-10T06:00:00.000Z",
      "to": "2026-08-11T06:00:00.000Z"
    },
    "kpis": {
      "gmv": "0.00",
      "avgTicket": "0.00",
      "orderCount": 0,
      "bySource": {
        "MARKETPLACE": { "gmv": "0.00", "orderCount": 0 },
        "POS": { "gmv": "0.00", "orderCount": 0 }
      }
    },
    "series": [],
    "topProducts": []
  }
}
```

Frontend: empty amigable (KPIs 0 / `—`). Si la API es **500**, ErrorBanner + Reintentar — **no** empty POS de “sin activos”.

Con `grain=month` vacío, `series` sigue siendo un punto por día del mes (todos `"0.00"`). Con `grain=year` vacío, doce meses en cero. Con `grain=day`, `series` siempre `[]`.

#### 400 Bad Request:

```json
{
  "error": "Validation failed",
  "details": [{ "field": "date", "message": "Formato inválido para grain=month" }]
}
```

Otros 400: `grain` ausente o no permitido; `date` futura; `date` ausente.

* **401 Unauthorized:** sin sesión / JWT inválido  
* **403 Forbidden:** rol distinto de PROVIDER  
* **500 Internal Error:** envelope ADR-003; UI ErrorBanner

Comparativa vs periodo anterior (Should) y serie horaria (Could): no forman parte de este contrato.

---

## Fuera de alcance

- Pasarela, CFDI, CSV, email del reporte, ticket térmico
- ADMIN viendo el reporte de un proveedor
- Cambiar `GET /api/provider/dashboard`

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Route | `src/app/api/provider/reports/route.ts` |
| Service | Extender `src/lib/services/dashboard.service.ts` (`getProviderReport`) o `report.service.ts` |
| TZ | `src/lib/timezone.ts` — helpers mes/año sobre `monterreyDayStartUtc` |
| Zod | Query `grain` + `date` |

Índices nuevos: no Must (`providerId` + `createdAt` existentes). RBAC: test 401/403 (DEV-P2-011).

PDF: [`API-PROVIDER-REPORTS-PDF-01.md`](./API-PROVIDER-REPORTS-PDF-01.md). Print CSS: Frontend (`US-DASH-05`).

---

## Referencias

- US-DASH-04, D-F6-3, D-F6-4, D-F6-8
- ADR-024, ADR-003, ADR-002 (sin `/api/v1/`)
- Diagrama: [`../diagrams/ARCH-REPORTS-01.md`](../diagrams/ARCH-REPORTS-01.md)
