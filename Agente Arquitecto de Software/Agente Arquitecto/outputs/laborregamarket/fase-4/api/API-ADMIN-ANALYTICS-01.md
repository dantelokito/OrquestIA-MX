# API-ADMIN-ANALYTICS-01 — Analítica de plataforma

> **Endpoint:** `GET` `/api/admin/analytics`  
> **Módulo:** `ADMIN`  
> **Versión:** 0.4.0  
> **Fecha:** 14/08/2026  
> **US:** US-ADMIN-01  
> **Autenticación:** Requerida — Rol `ADMIN` → cookie JWT

Distinto de [`../../fase-3/api/API-PROVIDER-DASH-01.md`](../../fase-3/api/API-PROVIDER-DASH-01.md) (dashboard **de un** proveedor). Este endpoint agrega **toda** la plataforma.

TZ: **America/Monterrey** (misma convención ADR-012 / F3).

---

## GET `/api/admin/analytics`

> **Descripción:** KPIs de salud: GMV, órdenes, proveedores activos, cancelación, split MARKETPLACE vs POS.  
> **Autenticación:** Requerida — Rol `ADMIN`

#### Query Parameters:

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `range` | enum | `7d` | `today` \| `7d` \| `30d` |

Ventanas (inicio inclusive, fin exclusive now en TZ Monterrey):

| `range` | Inicio |
|---------|--------|
| `today` | 00:00 del día actual Monterrey |
| `7d` | 00:00 de hace 6 días + hoy (7 días calendario) |
| `30d` | 00:00 de hace 29 días + hoy |

#### 200 Success (con datos):

```json
{
  "data": {
    "empty": false,
    "range": "7d",
    "timezone": "America/Monterrey",
    "from": "2026-08-08T06:00:00.000Z",
    "to": "2026-08-15T06:00:00.000Z",
    "kpis": {
      "gmv": 12500.5,
      "orderCount": 48,
      "activeProviders": 6,
      "cancellationRate": 0.0833,
      "bySource": {
        "MARKETPLACE": { "gmv": 8200.0, "orderCount": 30 },
        "POS": { "gmv": 4300.5, "orderCount": 18 }
      }
    }
  }
}
```

| Campo | Definición |
|-------|------------|
| `gmv` | `SUM(total)` de órdenes con `status ≠ CANCELLED` en el periodo (`createdAt`) |
| `orderCount` | Conteos de órdenes **no canceladas** |
| `activeProviders` | Distinct `providerId` con ≥1 orden no cancelada en el periodo **o** `Provider.isActive=true` al corte — **usar:** proveedores con `isActive=true` (plataforma viva), más nota `tradingProviders` opcional |
| `cancellationRate` | `cancelledCount / allCreatedCount` en el periodo (incluye canceladas en el denominador). 0 si no hubo altas |
| `bySource` | GMV y count no cancelados por `Order.source` |

**Proveedores activos (Must):** número de `Provider` con `isActive=true` (no filtrado por periodo). Opcional en `kpis.tradingProviders`: distinct que vendieron en el rango (Should, no bloquea).

Agregación **SQL / Prisma groupBy** (no mock en prod). Alineado a espíritu ADR-012.

#### 200 Success (vacío):

Ninguna orden creada en el periodo:

```json
{
  "data": {
    "empty": true,
    "range": "7d",
    "timezone": "America/Monterrey",
    "from": "2026-08-08T06:00:00.000Z",
    "to": "2026-08-15T06:00:00.000Z",
    "kpis": null
  }
}
```

Frontend: empty state, **no** ceros confusos (`empty: true`).

#### 400 Bad Request:

```json
{
  "error": "Validation failed",
  "details": [{ "field": "range", "message": "Valor no permitido" }]
}
```

* **401 Unauthorized**
* **403 Forbidden:** no ADMIN
* **500 Internal Error**

---

## Fuera de alcance

- Series temporales (el DASH F3 del proveedor ya tiene `series7d`; plataforma F4 es KPIs).
- Filtro por un proveedor (usar dashboard F3).
- Export CSV / BI.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Route | `src/app/api/admin/analytics/route.ts` |
| Service | `src/lib/services/admin-analytics.service.ts` |

UI: `/admin/analytics` (UX `UF-ADMIN-01` pendiente).

---

## Referencias

- US-ADMIN-01
- Dashboard proveedor: [`../../fase-3/api/API-PROVIDER-DASH-01.md`](../../fase-3/api/API-PROVIDER-DASH-01.md)
