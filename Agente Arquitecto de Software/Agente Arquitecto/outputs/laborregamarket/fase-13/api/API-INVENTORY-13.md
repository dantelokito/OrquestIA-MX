# API-INVENTORY-13 — Inventario: sin archivados, entradas persistidas, unidad efectiva

> **Endpoints:** delta `GET/PATCH /api/provider/inventory*` · `POST .../entries`  
> **Descripción:** Listado sin ofertas archivadas. `addInventoryEntry` inserta `InventoryEntry`. Unidad expuesta = `effectiveSaleUnit`. Descarte de unidad **no** es este POST.  
> **Autenticación:** Requerida — PROVIDER + sucursal activa  
> **Módulo:** `PRODUCTS`  
> **Versión:** 0.13.0  
> **Fecha:** 2026-09-16  
> **US:** US-CAT-16 (listado), US-DASH-12 (persistir), US-INV-07 (no entrada)  
> **ADR:** ADR-038, ADR-036, ADR-002, ADR-003  
> **Envelope:** ADR-003  
> **Base (solo lectura):** `fase-12/api/API-INVENTORY-01.md`

## Inputs Utilizados

- API-INVENTORY-01 F12
- DB-inventory-entries F13

---

## GET `/api/provider/inventory` y GET ficha

**Excluir** `archivedAt IS NOT NULL`.

Cada ítem F12 **más**:

```json
{
  "saleUnit": null,
  "effectiveSaleUnit": "KG",
  "unit": "KG"
}
```

- `unit` en F13 **debe** igualar `effectiveSaleUnit` (rompe el F12 que copiaba `Product.unit` a ciegas).
- Campo `unit` del maestro puede ir como `masterUnit` opcional para FE:

```json
{ "masterUnit": "KG", "effectiveSaleUnit": "CAJA" }
```

Must: `effectiveSaleUnit` presente.

403 IDOR igual F12. Paginación 50/100.

---

## PATCH ficha (tope / alerta / factor)

Si cambia `boxContentFactor`: mismas reglas **409 Encargar** y `confirmDiscard` + `onHand=0` **sin** `InventoryEntry` que `API-PROVIDER-OFFER-13`. Preferible que FE use un solo camino (PATCH oferta); Backend **debe** aplicar la regla en **ambos** si el factor se muta aquí.

---

## POST `/api/provider/inventory/[providerProductId]/entries`

Igual body F12 (`quantity`, `receiveAs`). **Además** inserta `InventoryEntry` en la misma transacción que incrementa `onHand`.

- `appliedDelta` persistido.
- Oferta archivada → **409** `{ "error": "Oferta oculta", "details": [{ "field": "providerProductId", "message": "No se cargan entradas sobre una oferta oculta" }] }`.
- BOX sin factor → 400 (F12).
- Conversión usa `boxContentFactor`; unidad de catálogo = `effectiveSaleUnit`.

#### 200

Ficha actualizada. No hace falta devolver la fila de entrada (el reporte `API-PROVIDER-REPORTS-INV-13` la lista). Opcional `data.lastEntryId`.

**Prohibido:** 4xx de stock. **Prohibido:** usar este POST para el descarte US-INV-07.

## Errores

| HTTP | Uso |
|------|-----|
| 400 | Validación Zod |
| 401 | Sin sesión |
| 403 | Rol / IDOR |
| 409 | Entrada sobre archivado; Encargar en PATCH factor |
| 500 | Error interno |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/api/API-INVENTORY-13.md`
- **Agente Downstream:** Backend Developer
