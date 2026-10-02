# Handoff Backend → Frontend (JSON real F14)

> **Fecha:** 2026-09-17  
> **Fase:** 14  
> **Emisor:** Backend  
> **Receptor:** Frontend (cuando existan wireframes UX; contratos Arch ya son fuente de verdad)

Código: `C:\Users\PC GAMER\LaBorregaMarket` rama `feat/f14-panel-proveedor`.  
Baseline: **main @ 0eda84c** (PR #13). Paths **sin** `/api/v1/`. Envelope `{ data }` / `{ error }` (ADR-003).

Perfil: un solo `GET /api/provider/me`. Toggle `posShowImages` sigue en PATCH me (UI en POS). Banner 409 de sección **fuera** del form colapsado. Pintar `series` / `products` / `bySource` del JSON vigente (BE no recalcula). PDF con query `from`/`to`. Gráficas SVG en FE (ADR-041).

## PATCH `/api/provider/me` datos de negocio

Request:

```json
{
  "businessName": "Frutas El Paraíso Centro",
  "address": "Av. Juárez 123, Centro",
  "city": "Monterrey",
  "phone": "+528112345678",
  "description": "Fruta de temporada del AMM",
  "latitude": 25.6714,
  "longitude": -100.3089
}
```

200:

```json
{
  "data": {
    "id": "clxprovA",
    "businessName": "Frutas El Paraíso Centro",
    "address": "Av. Juárez 123, Centro",
    "city": "Monterrey",
    "phone": "+528112345678",
    "description": "Fruta de temporada del AMM",
    "latitude": 25.6714,
    "longitude": -100.3089,
    "isVerified": true,
    "verifiedAt": "2026-08-01T18:00:00.000Z",
    "googleReviewsLocked": false
  }
}
```

`isVerified` no cambia al mudar el pin. Geo fuera de AMM → 400 `Validation failed` + `details.field=latitude|longitude`. Body con `isVerified` → 400 (strict). Google lock 403 intacto.

## Precio al publicar

Activar `isAvailable=true` exige precio **> 0**. 400:

```json
{
  "error": "Precio de venta inválido",
  "details": [
    {
      "field": "price",
      "message": "El precio debe ser mayor que cero para publicar la oferta"
    }
  ]
}
```

Si ya había precio > 0, activar lo reutiliza. Stub archivo `price=0` no es precio público. FE Must quitar `price ?? 50`.

## DELETE sección 409

```json
{
  "error": "La sección tiene productos. Muévelos antes de eliminarla",
  "details": [
    {
      "field": "id",
      "message": "Reasigna los productos a otra sección"
    }
  ]
}
```

Leer `error` (string) en banner/toast **fuera** del form «Nueva sección».

## POST merma

`POST /api/provider/inventory/{providerProductId}/shrinkage`

```json
{
  "quantity": "5.000",
  "reason": "CADUCIDAD",
  "note": "Caja golpeada en frío"
}
```

201:

```json
{
  "data": {
    "id": "clxmerma01",
    "providerProductId": "clxpp01",
    "kind": "MERMA",
    "quantity": "5.000",
    "appliedDelta": "-5.000",
    "onHandAfter": "5.000",
    "reason": "CADUCIDAD",
    "note": "Caja golpeada en frío",
    "createdAt": "2026-09-17T18:00:00.000Z",
    "onHand": "5.000"
  }
}
```

Saldo insuficiente → **400**:

```json
{
  "error": {
    "code": "INVENTORY_NEGATIVE_NOT_ALLOWED",
    "message": "La cantidad supera el saldo disponible"
  },
  "timestamp": "2026-09-17T18:00:00.000Z",
  "details": [
    { "field": "quantity", "message": "La merma dejaría existencias negativas" }
  ]
}
```

## POST ajuste (conteo físico)

`POST /api/provider/inventory/{providerProductId}/adjustments`

```json
{
  "countedOnHand": "5.000",
  "note": "Conteo de anaquel 17/09"
}
```

201 `kind=AJUSTE`, `quantity` = conteo, `appliedDelta` = conteo − saldo previo, `reason: null`. Conteo **0 es válido**. Conteo negativo → 400. Oferta oculta → 409. SKU ajeno → 403.

## GET movimientos

`GET /api/provider/inventory/movements?page=1&limit=50`

```json
{
  "data": [
    {
      "id": "clxmerma01",
      "providerProductId": "clxpp01",
      "productName": "Mango Ataulfo",
      "kind": "MERMA",
      "quantity": "5.000",
      "receiveAs": null,
      "appliedDelta": "-5.000",
      "onHandAfter": "5.000",
      "reason": "CADUCIDAD",
      "note": "Caja golpeada en frío",
      "createdAt": "2026-09-17T18:00:00.000Z"
    },
    {
      "id": "clxent01",
      "providerProductId": "clxpp01",
      "productName": "Mango Ataulfo",
      "kind": "ENTRADA",
      "quantity": "2.000",
      "receiveAs": "CATALOG",
      "appliedDelta": "2.000",
      "onHandAfter": "10.000",
      "reason": null,
      "note": null,
      "createdAt": "2026-09-16T17:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "totalPages": 1
  }
}
```

Query opcional: `kind=ENTRADA|MERMA|AJUSTE`, `from`+`to` (`YYYY-MM-DD`), `providerProductId`. Empty: `data: []`, `meta.total=0` (200). Sin ventas POS ni descarte.

Entradas F13 históricas pueden traer `onHandAfter: null`.

## PDF

`GET /api/provider/reports.pdf?from=2026-09-01&to=2026-09-12`

- 200 `application/pdf`
- `Content-Disposition: attachment; filename="reporte-{slug}-{from}_{to}.pdf"`
- Compat: `?grain=day&date=2026-08-10` (filename F6)
- Mezclar grain + from/to → 400

Global N=1: `GET /api/provider/reports/global` → 403 `GLOBAL_REPORTS_NOT_AVAILABLE` (sin cambio de shape).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/handoff-frontend.md`
- **Agente Downstream:** Frontend
