# API-PROVIDER-OFFER-13 — Unidad de oferta, factor y alta LOCAL

> **Endpoints:** `PATCH /api/provider/products/by-product/[productId]` · `POST /api/provider/local-products` (delta) · `PATCH /api/provider/local-products/[id]` (delta)  
> **Descripción:** Unidad de venta **por sucursal** (`saleUnit`) y factor caja. LOCAL sí muta maestro propio. GLOBAL no.  
> **Autenticación:** Requerida — PROVIDER + sucursal activa  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.13.0  
> **Fecha:** 2026-09-16  
> **US:** US-CAT-18, US-INV-07  
> **ADR:** ADR-038, ADR-036, ADR-037, ADR-003, ADR-002  
> **Envelope:** ADR-003  
> **Base:** `fase-10/api/API-PROVIDER-PRODUCTS-02.md`

## Inputs Utilizados

- PRD D-F13-13/14/15/25
- US-CAT-18, US-INV-07

---

## Helper de negocio (obligatorio en servicio)

```
effectiveSaleUnit = providerProduct.saleUnit ?? product.unit
```

POS, Encargar, inventario y GET panel usan `effectiveSaleUnit`.

`reserved` = SUM Encargar activo (ADR-037). Si `reserved > 0` y el PATCH cambia `saleUnit` o `boxContentFactor` → **409** `{ "error": "Hay encargos activos", "details": [{ "field": "saleUnit", "message": "No se puede cambiar unidad o factor con Encargar activo" }] }` código sugerido en details `ENCARGAR_ACTIVE`. **Sin mutar.**

Si cambia `saleUnit` o `boxContentFactor` y `onHand ≠ 0`:

- Sin `confirmDiscard: true` → **400** (`confirmDiscard` requerido).
- Con flag → transacción: persistir unidad/factor + `onHand=0`. **Cero** `InventoryEntry`.

---

## PATCH `/api/provider/products/by-product/[productId]`

Upsert de oferta de la sucursal activa (GLOBAL o LOCAL propio). Primera edición GLOBAL sin oferta **crea** `ProviderProduct`.

#### Body

```json
{
  "price": "45.00",
  "saleUnit": "CAJA",
  "boxContentFactor": "12.000",
  "sectionId": "clxsec01",
  "isAvailable": true,
  "confirmDiscard": true
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `price` | string decimal | Sí en **create**; No en update | ≥ 0, 2 decimales. Create GLOBAL: obligatorio. |
| `saleUnit` | `ProductUnit` \| null | No | Enum completo (KG, PIEZA, MANOJO, CAJA, LITRO, GRAMO). `null` vuelve al fallback maestro. |
| `boxContentFactor` | string decimal \| null | Condicional | Si `effectiveSaleUnit` resultante = `CAJA` → obligatorio `> 0`. Si no CAJA → null permitido. |
| `sectionId` | cuid \| null | No | Debe ser de esta sucursal (403 si ajena). |
| `isAvailable` | boolean | No | ADR-022 intacto. |
| `confirmDiscard` | boolean | Condicional | Ver helper. |
| `name` | — | **Prohibido** en GLOBAL | 400 |
| `unit` (maestro) | — | **Prohibido** en GLOBAL | 400. Usar `saleUnit`. |

IDOR 403. Oferta archivada: PATCH **permitido** (p. ej. ajustar unidad en bandeja) salvo reglas Encargar.

Si solo cambia `price`, ver también `API-PROVIDER-PRICE-13` (este PATCH **sí** puede incluir precio y debe escribir historial).

#### 200 / 201

201 si creó oferta. Shape de fila de panel (incluye `saleUnit`, `effectiveSaleUnit`, `onHand` post-descarte).

---

## POST `/api/provider/local-products`

Delta F10: `unit` acepta **todo** `ProductUnit` (incl. CAJA). Añadir `boxContentFactor`.

```json
{
  "name": "Chile del rancho",
  "unit": "CAJA",
  "boxContentFactor": "20.000",
  "price": 38.5,
  "sectionId": "clx...",
  "isAvailable": true
}
```

- Persiste `Product.unit` LOCAL **y** `ProviderProduct.saleUnit` = el mismo valor (evita divergencia).
- CAJA sin factor → **400**.
- Historial de precio: primera fila.
- Rate limit altas F10 intacto (**429**).

---

## PATCH `/api/provider/local-products/[id]`

`id` = `Product.id` LOCAL del dueño de la sucursal activa.

Body parcial: `name`, `unit` (maestro LOCAL), `saleUnit` (si se omite y viene `unit`, se copia), `boxContentFactor`, `price`, `sectionId`, `isAvailable`, `confirmDiscard`.

Cambio de `unit` LOCAL = cambio de unidad de venta → mismas reglas 409 Encargar / descarte.

LOCAL de otra sucursal → **403**. GLOBAL id → **400** (usar PATCH by-product).

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Validación; CAJA sin factor; falta `confirmDiscard`; intentar mutar maestro GLOBAL |
| 401 | Sin sesión |
| 403 | Rol / IDOR |
| 404 | Restore-only n/a; id LOCAL inexistente propio puede 404 |
| 409 | Encargar activo en cambio unidad/factor |
| 429 | Rate limit altas |
| 500 | Error interno |

**Prohibido:** 4xx de stock al vender (no aplica a estas rutas). **Prohibido:** 409 Encargar al ocultar (archivo es otro contrato).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/api/API-PROVIDER-OFFER-13.md`
- **Agente Downstream:** Backend Developer
