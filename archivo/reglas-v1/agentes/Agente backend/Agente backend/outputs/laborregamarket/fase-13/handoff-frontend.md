# Handoff Backend → Frontend (JSON real F13)

> **Fecha:** 2026-09-16  
> **Fase:** 13  
> **Emisor:** Backend  
> **Receptor:** Frontend (cuando existan wireframes UX; no bloquea este JSON)

Código: `C:\Users\PC GAMER\LaBorregaMarket` rama `feat/f13-archivo-oferta-unidad`.  
Baseline F12: **sí** (`main` incluye merge PR #12).

## GET panel

`GET /api/provider/products?page=1&limit=50&archived=1`

```json
{
  "data": {
    "provider": { "id": "clxcentro", "businessName": "Frutas El Paraíso Centro" },
    "catalog": [
      {
        "product": {
          "id": "clxp01",
          "name": "Mango Ataulfo",
          "slug": "mango-ataulfo",
          "category": "FRUTA",
          "unit": "KG",
          "description": null,
          "imageUrl": null
        },
        "price": 45,
        "isAvailable": true,
        "providerProductId": "clxpp01",
        "scope": "GLOBAL",
        "sectionId": null,
        "sectionName": null,
        "imageUrl": null,
        "archivedAt": null,
        "saleUnit": "CAJA",
        "effectiveSaleUnit": "CAJA",
        "boxContentFactor": "12.000",
        "canEditMaster": false,
        "onHand": "12.500",
        "reserved": "0.000"
      }
    ]
  },
  "meta": { "page": 1, "limit": 50, "total": 1, "totalPages": 1 }
}
```

Sin `archived`: oculta filas con `archivedAt`. `archived=1|true`: bandeja. Query inválida → 400.

## Ocultar / restaurar

`POST /api/provider/products/by-product/{productId}/archive` body vacío.

```json
{
  "data": {
    "productId": "clxp01",
    "providerProductId": "clxpp01",
    "archivedAt": "2026-09-16T18:00:00.000Z",
    "createdStub": false
  }
}
```

Stub GLOBAL: `createdStub: true`, `price=0`, `isAvailable=false`. Encargar **no** bloquea (200).

Restore 200 `{ archivedAt: null }`. Sin oferta → 404 «No hay oferta oculta para restaurar».

## PATCH oferta

`PATCH /api/provider/products/by-product/{productId}`

```json
{
  "price": "45.00",
  "saleUnit": "CAJA",
  "boxContentFactor": "12.000",
  "isAvailable": true,
  "confirmDiscard": true
}
```

201 si creó oferta. 409 Encargar si cambia unidad/factor con reserva. 400 si falta `confirmDiscard` con `onHand ≠ 0`. `name`/`unit` en GLOBAL → 400.

## Precio

`PATCH /api/provider/products/by-product/{productId}/price` `{ "price": "49.90" }`

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

`GET /api/provider/products/{providerProductId}/price-history?page=1&limit=50` → `data[]` + `meta`. Otra sucursal → 403.

## Inventario

Listado **sin** archivados. Cada ítem: `unit` = `effectiveSaleUnit`, más `masterUnit`, `saleUnit`.

`POST .../entries` `{ "quantity": "2", "receiveAs": "CATALOG" }` inserta `InventoryEntry`. Archivado → 409. Opcional `lastEntryId`.

Descarte de unidad **no** usa POST entries; va en PATCH oferta/inventario con `confirmDiscard`.

## Admin

`GET /api/admin/products?page=1&limit=50&scope=LOCAL` — SKU maestro GLOBAL y LOCAL, `ownerBusinessName`. Default limit 50, máx 100. `ownerProviderId` + `scope=GLOBAL` → 400. Dueño inexistente → 200 `data: []`.

PATCH LOCAL: solo `{ "isActive": false }`. DELETE → 405 `{ "error": "No se puede eliminar el producto", "details": [...] }`.

## Vendible / 409

Público y POS omiten archivados. Carrito stale:

```json
{
  "error": "El producto ya no está disponible",
  "details": [{ "field": "providerProductId", "message": "La oferta está oculta o inactiva" }]
}
```

HTTP 409. Stock 0 → 2xx en cobro.

## Reportes inventario

`GET /api/provider/reports/inventory` — `data.balances` + `data.entries` paginadas (`meta.total` = entradas).

`GET /api/provider/reports/global/inventory` — N>1; sin `entries`. N=1 → 403 `GLOBAL_REPORTS_NOT_AVAILABLE`.

Ventas: no filtrar por archivo/activo.

## Print

Print inventario = Frontend. Este GET alimenta la vista.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/handoff-frontend.md`
- **Agente Downstream:** Frontend Developer
