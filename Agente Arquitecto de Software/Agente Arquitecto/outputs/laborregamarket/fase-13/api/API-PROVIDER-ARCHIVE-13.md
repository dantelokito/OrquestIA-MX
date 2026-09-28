# API-PROVIDER-ARCHIVE-13 — Ocultar y restaurar oferta

> **Endpoints:** `POST /api/provider/products/by-product/[productId]/archive` · `POST /api/provider/products/by-product/[productId]/restore` · `GET /api/provider/products` query `archived` · `DELETE` producto/oferta  
> **Descripción:** Archivo por sucursal activa. Copy de producto «Eliminar» ≠ SQL DELETE.  
> **Autenticación:** Requerida — PROVIDER + cookie `lbm_active_provider` (ADR-034)  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.13.0  
> **Fecha:** 2026-09-16  
> **US:** US-CAT-14, US-CAT-15, US-SEC-04  
> **ADR:** ADR-038, ADR-022, ADR-003, ADR-002  
> **Envelope:** ADR-003

## Inputs Utilizados

- PRD D-F13-3/5/8/24
- US-CAT-14/15, US-SEC-04

---

## Resolución de sucursal

`providerId` = `resolveActiveProvider`. `productId` de LOCAL ajeno u otra sucursal → **403**. CLIENT / ADMIN sin PROVIDER → **403**. Sin JWT → **401**. IDOR no usa 404.

---

## GET `/api/provider/products`

Delta sobre F10/F12:

| Query | Default | Comportamiento |
|-------|---------|----------------|
| (omitido) `archived` | visible | Excluye `archivedAt IS NOT NULL`. Incluye GLOBAL `isActive=true` no archivados (con o **sin** oferta) + LOCAL propios no archivados. Inactivos (`isAvailable=false`) **sí**. GLOBAL nuevos del admin **sí** (D-F13-23). |
| `archived=1` o `true` | bandeja | Solo ofertas de la sucursal activa con `archivedAt`. No incluye GLOBAL sin fila. |

Paginación vigente F10. Default limit panel: 50, máx. 100.

Cada fila visible añade (además de F12):

```json
{
  "archivedAt": null,
  "saleUnit": null,
  "effectiveSaleUnit": "KG",
  "boxContentFactor": "10.000",
  "canEditMaster": false
}
```

- `saleUnit`: valor persistido o `null`.
- `effectiveSaleUnit`: `saleUnit ?? product.unit`.
- `canEditMaster`: `true` solo si `scope=LOCAL` y `ownerProviderId` = sucursal activa (nombre + `Product.unit`).

Bandeja: mismas claves; `archivedAt` ISO-8601.

---

## POST `/api/provider/products/by-product/[productId]/archive`

> **Descripción:** Ocultar. Encargar activo **no** bloquea. Body vacío.

#### 200 (oferta ya existía)

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

#### 200 (GLOBAL sin oferta → stub)

Crea `ProviderProduct`: `price=0`, `isAvailable=false`, `saleUnit=null`, `archivedAt=now()`, `onHand=0`. Inserta **una** fila de historial de precio (`previousPrice=null`, `price=0`). AUDIT `PRODUCTS` `DISABLE` con `details.archived: true`.

```json
{
  "data": {
    "productId": "clxp01",
    "providerProductId": "clxppnew",
    "archivedAt": "2026-09-16T18:00:00.000Z",
    "createdStub": true
  }
}
```

Idempotente: ya archivado → 200 con el mismo `archivedAt` (no lo pisa).

LOCAL de otro dueño / GLOBAL inexistente enumerable cruzado → **403**. Producto GLOBAL `isActive` irrelevante para ocultar (se puede ocultar).

---

## POST `/api/provider/products/by-product/[productId]/restore`

Set `archivedAt=null`. **No** muta `isAvailable`, `sectionId`, `saleUnit`, `price`.

Sin oferta (nunca archivado) → **404** con mensaje «No hay oferta oculta para restaurar».

#### 200

```json
{
  "data": {
    "productId": "clxp01",
    "providerProductId": "clxpp01",
    "archivedAt": null
  }
}
```

AUDIT `PRODUCTS` `ENABLE` con `details.archived: false`.

---

## DELETE producto / oferta

| Ruta | Resultado |
|------|-----------|
| `DELETE /api/provider/products` | **405** |
| `DELETE /api/provider/products/[id]` | **405** |
| `DELETE /api/provider/local-products/[id]` | **405** |
| `DELETE /api/admin/products/[id]` | **405** (ver API-ADMIN-PRODUCTS-13) |

```json
{
  "error": "No se puede eliminar el producto",
  "details": [{ "field": "id", "message": "Oculta la oferta o inactiva el SKU. DELETE no está permitido" }]
}
```

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Query `archived` no booleana |
| 401 | Sin sesión |
| 403 | Rol / IDOR / sucursal cruzada |
| 404 | Restore sin oferta |
| 405 | DELETE |
| 500 | Error interno |

**Prohibido:** 409 por Encargar al archivar.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/api/API-PROVIDER-ARCHIVE-13.md`
- **Agente Downstream:** Backend Developer
