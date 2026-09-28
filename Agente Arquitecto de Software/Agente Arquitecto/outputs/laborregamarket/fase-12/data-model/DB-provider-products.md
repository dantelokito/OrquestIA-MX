# DB-provider-products — Delta Fase 12 (inventario blando)

> **Entidad:** `ProviderProduct` (`provider_products`)  
> **Fecha:** 2026-09-14  
> **Fase:** 12  
> **ADR:** ADR-036, ADR-022 (intacto)

## Inputs Utilizados

- **PRD:** `Administrador de producto/.../fase-12/prd.md`
- **US:** US-INV-02, US-INV-03, US-INV-04
- **Código (lectura):** `LaBorregaMarket/prisma/schema.prisma` modelo `ProviderProduct`

---

## Campos nuevos (además de F10/F11)

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `onHand` | `Decimal(12,3)` | NOT NULL, DEFAULT 0 | Saldo administrativo. Puede ser negativo. |
| `capacityMax` | `Decimal(12,3)` | NULL | Tope. NULL = sin barra de capacidad. |
| `alertThresholdPercent` | `INT` | NOT NULL, DEFAULT 10 | Umbral 1–100 (% del tope). |
| `alertEnabled` | `BOOLEAN` | NOT NULL, DEFAULT true | Alerta de poca existencia. |
| `boxContentFactor` | `Decimal(12,3)` | NULL | Kg/piezas (unidad de catálogo) por caja. Fijo en la oferta. |
| `stock` | `INT` | NULL | **Deprecado.** No leer ni escribir en F12. |

Prisma (referencia de migración; Backend aplica en el repo de la app):

```prisma
onHand                 Decimal  @default(0) @map("on_hand") @db.Decimal(12, 3)
capacityMax            Decimal? @map("capacity_max") @db.Decimal(12, 3)
alertThresholdPercent  Int      @default(10) @map("alert_threshold_percent")
alertEnabled           Boolean  @default(true) @map("alert_enabled")
boxContentFactor       Decimal? @map("box_content_factor") @db.Decimal(12, 3)
```

`stock Int?` se deja en el schema **sin** `@map` nuevo. Comentario Prisma: deprecado F12.

## Relación

- 1 `Provider` : N `ProviderProduct` (sucursal). Inventario **no** se comparte.
- 1 `Product` : N `ProviderProduct`. Unidad de catálogo = `Product.unit`.
- UNIQUE vigente: `@@unique([providerId, productId])`.

## Índices

| Índice | Motivo |
|--------|--------|
| UNIQUE `(providerId, productId)` | Ya existe |
| `@@index([providerId])` | Listado inventario de la sucursal activa (añadir si no está) |

## `reserved` (no es columna)

Suma computed (ADR-037). No persistir.

## Validaciones de persistencia

| Campo | Regla |
|-------|--------|
| `capacityMax` | Si se envía, debe ser `> 0`. NULL permitido (quitar tope). |
| `alertThresholdPercent` | Entero 1–100. |
| `boxContentFactor` | Si se envía, `> 0`. |
| `onHand` | Solo muta por entradas, POS cobro y commit DELIVERED. No PATCH directo Must. |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-12/data-model/DB-provider-products.md`
- **Agente Downstream:** Backend Developer
