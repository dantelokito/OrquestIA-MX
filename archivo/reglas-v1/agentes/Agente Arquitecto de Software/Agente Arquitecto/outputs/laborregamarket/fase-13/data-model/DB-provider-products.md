# DB-provider-products — Delta Fase 13 (archivo + unidad de oferta)

> **Entidad:** `ProviderProduct` (`provider_products`)  
> **Fecha:** 2026-09-16  
> **Fase:** 13  
> **ADR:** ADR-038, ADR-022 (intacto), ADR-036 (unidad efectiva)

## Inputs Utilizados

- PRD F13, US-CAT-14/18
- Código (lectura): `LaBorregaMarket/prisma/schema.prisma` modelo `ProviderProduct`
- Baseline F12: `fase-12/data-model/DB-provider-products.md` (solo lectura)

---

## Campos nuevos (además de F12)

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `archivedAt` | `DateTime?` | NULL | NULL = visible en panel. Timestamp = oculto de esta sucursal. |
| `saleUnit` | `ProductUnit?` | NULL | NULL = fallback `Product.unit`. Valor = unidad de venta de **esta** oferta. |

Prisma (referencia; Backend aplica en el repo de la app):

```prisma
archivedAt DateTime?    @map("archived_at")
saleUnit   ProductUnit? @map("sale_unit")
```

Unique **intacta:** `@@unique([providerId, productId])`.

## Relación

- 1 `Provider` : N `ProviderProduct` (oferta **por sucursal**; F11 ISO).
- 1 `Product` : N `ProviderProduct`.
- 1 `ProviderProduct` : N `InventoryEntry`.
- 1 `ProviderProduct` : N `ProviderProductPriceHistory`.

## Índices

| Índice | Motivo |
|--------|--------|
| UNIQUE `(providerId, productId)` | Ya existe; no soltar al archivar |
| `@@index([providerId])` | Ya existe |
| `@@index([providerId, archivedAt])` | Panel vs bandeja |

## Validaciones de persistencia

| Campo | Regla |
|-------|--------|
| `archivedAt` | Solo muta por ocultar/restaurar. Ocultar con Encargar activo **permitido**. |
| `saleUnit` | Enum `ProductUnit`. NULL = fallback. Si efectivo = CAJA → `boxContentFactor` NOT NULL y `> 0`. |
| `onHand` | Descarte F13 pone 0 **sin** `InventoryEntry`. Entradas sí insertan fila. |
| `stock` Int? | Sigue deprecado (ADR-036). |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/data-model/DB-provider-products.md`
- **Agente Downstream:** Backend Developer
