# API-SELLABLE-13 — Vendible público, POS y Encargar

> **Endpoints:** delta `GET /api/providers/[id]` · `POST /api/pos/sales` · `POST /api/orders` · PATCH carrito/checkout existente  
> **Descripción:** `sellableProviderProductWhere` exige no archivado. 409 si oferta oculta o SKU inactivo. Cero 4xx de stock (F12).  
> **Autenticación:** Público (vitrina) / JWT CLIENT o PROVIDER según ruta existente  
> **Versión:** 0.13.0  
> **Fecha:** 2026-09-16  
> **US:** US-CAT-16, US-DASH-10  
> **ADR:** ADR-038, ADR-022, ADR-036, ADR-037, ADR-003, ADR-002  
> **Envelope:** ADR-003  
> **Base:** `fase-12/api/API-POS-12.md`, `API-ORDERS-12.md`, `API-PROVIDER-PRODUCTS-12.md`

## Inputs Utilizados

- US-CAT-16, D-F13-10/11/24
- ADR-022 (isAvailable + isActive)

---

## Predicado vendible (obligatorio)

```
isAvailable = true
AND product.isActive = true
AND archivedAt IS NULL
```

Aplica a: explorar listados de productos de vitrina, `GET /api/providers/[id]` `products[]`, POS catálogo cobrable, alta Encargar / carrito.

APIs públicas **siguen sin** claves de stock F12. **Siguen sin** `archivedAt` en payload público (simplemente no listan la fila).

---

## 409 oferta no disponible

Si el cliente envía `providerProductId` archivado, `isAvailable=false`, o `product.isActive=false` (carrito stale):

```json
{
  "error": "El producto ya no está disponible",
  "details": [{ "field": "providerProductId", "message": "La oferta está oculta o inactiva" }]
}
```

HTTP **409**. No 400 de stock. On-hand 0 o negativo → **2xx** de cobro/pedido (ADR-036).

Ocultar **no** cancela Encargar existentes. Líneas ya reservadas siguen hasta DELIVERED/CANCELLED. Cobros/encargos **nuevos** de esa oferta → 409.

Unidad en líneas nuevas: `effectiveSaleUnit` al momento del alta; snapshot `OrderItem` **no** se reescribe al cambiar catálogo (US-DASH-10).

---

## GET `/api/providers` y detalle

Sin campos de archivo ni inventario. `products[]` omite no vendibles (incl. archivados).

---

## Errores (delta)

| HTTP | Caso |
|------|------|
| 409 | Archivado / inactivo / no disponible (ADR-022 + ADR-038) |
| 400 | Validación existente |
| 401 | Rutas autenticadas |
| 403 | IDOR F11 |
| 500 | Error interno |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/api/API-SELLABLE-13.md`
- **Agente Downstream:** Backend Developer
