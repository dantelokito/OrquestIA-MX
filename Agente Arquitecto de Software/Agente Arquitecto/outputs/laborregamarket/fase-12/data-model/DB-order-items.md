# DB-order-items — Delta Fase 12 (índice reserva)

> **Entidad:** `OrderItem` (`order_items`)  
> **Fecha:** 2026-09-14  
> **Fase:** 12  
> **ADR:** ADR-037

## Inputs Utilizados

- Schema vivo: `OrderItem.quantity Decimal(10,3)`, `unitOfMeasure`, `providerProductId`

---

## Cambio

No hay columnas nuevas. Añadir índice para el SUM de reserved:

| Índice | Campos | Motivo |
|--------|--------|--------|
| `order_items_provider_product_id_idx` | `providerProductId` | Agregar reserved por SKU sin N+1 |

`orders`: reutilizar `@@index([providerId, status, createdAt])` filtrando `source = MARKETPLACE` y `status NOT IN (DELIVERED, CANCELLED)`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/data-model/DB-order-items.md`
- **Agente Downstream:** Backend Developer
