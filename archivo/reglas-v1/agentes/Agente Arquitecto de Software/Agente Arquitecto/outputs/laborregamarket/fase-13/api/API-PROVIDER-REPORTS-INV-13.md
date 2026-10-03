# API-PROVIDER-REPORTS-INV-13 — Reportes inventario y delta ventas

> **Endpoints:** `GET /api/provider/reports/inventory` · `GET /api/provider/reports/global/inventory` · delta `GET /api/provider/reports` y `GET /api/provider/reports/global`  
> **Descripción:** Sucursal: saldo actual + entradas persistidas. N>1: solo actuales. Ventas: `OrderItem` sin filtrar archivo/activo.  
> **Autenticación:** Requerida — PROVIDER  
> **Módulo:** `DASH`  
> **Versión:** 0.13.0  
> **Fecha:** 2026-09-16  
> **US:** US-DASH-12, US-DASH-13, US-DASH-10  
> **ADR:** ADR-038, ADR-035, ADR-033, ADR-003, ADR-002, ADR-034  
> **Envelope:** ADR-003  
> **Base:** `fase-11/api/API-PROVIDER-REPORTS-03.md`, reportes sucursal F10

## Inputs Utilizados

- PRD D-F13-19/20/21
- US-DASH-10/12/13

---

## GET `/api/provider/reports/inventory`

Sucursal **activa**. Incluye ofertas **no archivadas**. Inactivas (`isAvailable=false`) **sí** (saldo sigue existiendo).

#### Query

| Param | Default | Notas |
|-------|---------|-------|
| `page` | 1 | Paginación de **entradas** (no de saldos) |
| `limit` | 50 | Máx. 100 |
| `from` / `to` | — | Opcional filtro de entradas (TZ Monterrey, mismas reglas ADR-033 si se envían). Saldos actuales **siempre** completos (no filtrados por fecha). |

#### 200

```json
{
  "data": {
    "timezone": "America/Monterrey",
    "generatedAt": "2026-09-16T18:00:00.000Z",
    "scope": "activeProvider",
    "providerId": "clxcentro",
    "balances": [
      {
        "providerProductId": "clxpp01",
        "productId": "clxp01",
        "name": "Mango Ataulfo",
        "effectiveSaleUnit": "KG",
        "onHand": "12.500",
        "reserved": "1.000",
        "isAvailable": true
      }
    ],
    "entries": [
      {
        "id": "clxent01",
        "providerProductId": "clxpp01",
        "name": "Mango Ataulfo",
        "quantity": "2.000",
        "receiveAs": "CATALOG",
        "appliedDelta": "2.000",
        "createdAt": "2026-09-16T17:00:00.000Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 12,
    "totalPages": 1,
    "balancesCount": 8
  }
}
```

`meta.total` = total de **entradas** (paginadas). `balances` no se pagina Must (catálogo de sucursal típico < 100); si supera 500 filas Backend pagina balances con `balancePage` — Should, no Must F13.

Print = FE (Should F11). Este GET alimenta la vista.

Empty entradas F12: `entries: []` (sin backfill).

403 IDOR / no PROVIDER. 401 sin JWT.

---

## GET `/api/provider/reports/global/inventory`

N>1 dueño. **No** usa sucursal activa como filtro. **Sin** array `entries`.

N ≤ 1 → **403** mismo código `GLOBAL_REPORTS_NOT_AVAILABLE` que ADR-035.

#### 200

```json
{
  "data": {
    "timezone": "America/Monterrey",
    "generatedAt": "2026-09-16T18:00:00.000Z",
    "scope": "allOwnedProviders",
    "providerCount": 2,
    "byProvider": [
      {
        "providerId": "clxcentro",
        "businessName": "Frutas El Paraíso",
        "branchLabel": "Centro",
        "balances": [
          {
            "providerProductId": "clxpp01",
            "name": "Mango Ataulfo",
            "effectiveSaleUnit": "KG",
            "onHand": "12.500"
          }
        ]
      }
    ]
  }
}
```

Solo ofertas no archivadas. Sin historial de entradas.

---

## Delta reportes de **ventas**

`GET /api/provider/reports` y `GET /api/provider/reports/global`:

- KPIs / series / top **no** INNER JOIN filtrando `product.isActive` ni `archivedAt`.
- Fuente: `OrderItem` (`unitPrice`, `subtotal`, `itemName`) de órdenes `status ≠ CANCELLED`.
- Filtro `productIds[]` sigue siendo ids de `ProviderProduct` **propios** (403 cruzado). Un id archivado **sí** puede filtrar ventas históricas.

Sin campos nuevos Must en el JSON de ventas.

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Fechas inválidas; page/limit |
| 401 | Sin sesión |
| 403 | Rol; N=1 en global inventory; IDOR |
| 500 | Error interno |

Sin N+1: una query balances por sucursal + una query entradas paginadas.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/api/API-PROVIDER-REPORTS-INV-13.md`
- **Agente Downstream:** Backend Developer
