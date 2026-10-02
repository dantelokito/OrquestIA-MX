# API-PROVIDER-OFFER-14 — Precio mayor que 0 al publicar oferta vendible

> **Endpoints:** delta `PATCH /api/provider/products/by-product/[productId]` · `PATCH /api/provider/products` · `POST/PATCH /api/provider/local-products*`  
> **Descripción:** Activar o crear una oferta **vendible** exige precio de oferta **mayor que 0**. Prohibido default 50 en servidor. Stub archivado `price=0` no es precio público.  
> **Autenticación:** Requerida — PROVIDER + sucursal activa  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.14.0  
> **Fecha:** 2026-09-17  
> **US:** US-CAT-22  
> **ADR:** ADR-038, ADR-022, ADR-003, ADR-002  
> **Envelope:** ADR-003  
> **Base (solo lectura):** `fase-13/api/API-PROVIDER-OFFER-13.md`

## Inputs Utilizados

- PRD D-F14-15
- Código: `ProviderCatalogF10.tsx` usa `price: item.price ?? 50` (FE Must eliminar); `patchOfferByProduct` exige precio en create pero acepta ≥ 0

---

## Regla de negocio (obligatoria en servicio)

Sea `nextPrice` el precio persistido **después** del request y `nextAvailable` el `isAvailable` resultante.

```
si nextAvailable === true entonces nextPrice > 0
si no: price ≥ 0 permitido (stub archivo F13, oferta inactiva)
```

- Crear oferta vendible **sin** precio → **400**.
- Activar (`isAvailable=true`) con precio persistido 0 (stub) y **sin** precio nuevo → **400**.
- Precio 0, negativo, NaN o string no numérico al publicar → **400**.
- **Prohibido** en servidor: `price ?? 50`, `price || 50`, default Prisma 50, o cualquier fallback numérico inventado.
- Si ya había `price > 0`, activar **reutiliza** ese precio (no lo pisa).
- No muta `Product` maestro GLOBAL ni ofertas de otras sucursales.

Esta regla aplica a **todos** los caminos que dejen `isAvailable=true`:

- `PATCH /api/provider/products/by-product/[productId]`
- `PATCH /api/provider/products` (toggle legado)
- `POST /api/provider/local-products` y su PATCH si `isAvailable=true`

Historial de precio F13: si es la primera asignación mayor que 0, se escribe fila de historial como F13.

#### 400

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

#### 200 / 201

Shape de fila de panel F13 (incluye `price` persistido, `isAvailable`, `effectiveSaleUnit`). `/fruteria` y Explorar listan solo vendibles ADR-038: no aparece $50 inventado.

---

## Fuera de este delta

Unidad, factor, `confirmDiscard`, archivo, Encargar 409: **intactos** F13. Cero 4xx de stock al vender.

## Errores

| HTTP | Caso |
|------|------|
| 400 | Precio ausente/≤0 al publicar; CAJA sin factor; `confirmDiscard`; mutar maestro GLOBAL |
| 401 | Sin sesión |
| 403 | Rol / IDOR |
| 404 | Id LOCAL inexistente propio (si el camino vigente usa 404) |
| 409 | Encargar activo en cambio unidad/factor; oferta oculta en entradas (no este path) |
| 500 | Error interno |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/api/API-PROVIDER-OFFER-14.md`
- **Agente Downstream:** Backend Developer
