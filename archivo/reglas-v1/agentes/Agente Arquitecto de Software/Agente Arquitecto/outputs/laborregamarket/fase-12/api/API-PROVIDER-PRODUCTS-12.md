# API-PROVIDER-PRODUCTS-12 — Barra y miniatura en panel; silencio en público

> **Endpoints:** `GET` `/api/provider/products` (delta) · `GET` `/api/providers` y `GET` `/api/providers/[id]` (restricción)  
> **Descripción:** El panel CAT recibe datos de barra + URL de media disco. Las APIs de vitrina `/fruteria` **no** exponen existencias.  
> **Autenticación:** Panel = PROVIDER; público = Pública  
> **Versión:** 0.12.0  
> **Fecha:** 2026-09-14  
> **US:** US-CAT-12, US-CAT-13  
> **ADR:** ADR-022, ADR-032, ADR-036  
> **Base (solo lectura):** `fase-5/api/API-PROVIDER-PRODUCTS-01.md`, `fase-10/api/API-MEDIA-02.md`

## Inputs Utilizados

- PRD D-F12-12; CO-F10-002 disco

---

## GET `/api/provider/products`

Catálogo **completo** de la sucursal activa (ADR-022: incluye inhabilitados). Delta F12 por ítem de instancia existente:

```json
{
  "providerProductId": "clxpp01",
  "productId": "clxp01",
  "name": "Mango Ataulfo",
  "unit": "KG",
  "price": "45.00",
  "isAvailable": true,
  "imageUrl": "/api/media/abc123.webp",
  "onHand": "12.500",
  "capacityMax": "20.000",
  "fillPercent": 62.5,
  "alertThresholdPercent": 10,
  "alertEnabled": true,
  "lowStockAlert": false,
  "reserved": "3.000"
}
```

- `imageUrl`: misma URL opaca F10. Si no hay foto: `null` (FE placeholder). **Siempre** en lista CAT; no depende de `posShowImages`.
- Barra: mismas fórmulas que `API-INVENTORY-01`. Si falla el cálculo de un SKU, el resto de la fila (precio, toggle) **sí** se serializa; `fillPercent`/`lowStockAlert` pueden ir `null`.
- `isAvailable` **no** cambia por stock.
- Si un producto global aún no tiene instancia, el shape F1 (`price` null) se mantiene **sin** campos de inventario (no hay `ProviderProduct`).

Paginación: la vigente del GET panel F10 (sin nuevo path).

---

## GET `/api/providers` y `GET /api/providers/[id]`

Shape público F5 **sin** estos campos: `onHand`, `capacityMax`, `fillPercent`, `alertThresholdPercent`, `alertEnabled`, `lowStockAlert`, `reserved`, `boxContentFactor`.

`products[]` del detalle sigue omitiendo `isAvailable=false`. `imageUrl` público de producto **sí** puede existir (vitrina F10); eso no es barra de inventario.

Ninguna ruta bajo el contrato de explorar/detalle añade existencias. QA debe asertar ausencia de claves.

---

## Errores panel

| HTTP | Uso |
|------|-----|
| 400 | Query inválida si aplica |
| 401 | Sin sesión en panel |
| 403 | Rol / ISO |
| 500 | Error interno |

Público: códigos F5/F11 sin cambio.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/api/API-PROVIDER-PRODUCTS-12.md`
- **Agente Downstream:** Backend, Frontend
