# DB-inventory-entries — Entradas de inventario (Fase 13)

> **Entidad:** `InventoryEntry` (`inventory_entries`)  
> **Fecha:** 2026-09-16  
> **Fase:** 13  
> **US:** US-DASH-12, US-INV-07  
> **ADR:** ADR-038 (descarte ≠ entrada), ADR-036

## Inputs Utilizados

- PRD D-F13-19, D-F13-21
- `POST /api/provider/inventory/[id]/entries` F12 (solo incrementaba `onHand`)

---

> **Entidad:** `InventoryEntry`

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | String (cuid) | PRIMARY KEY, NOT NULL | Identificador |
| `providerProductId` | String | FK, NOT NULL | Oferta de la sucursal |
| `quantity` | Decimal(12,3) | NOT NULL | Cantidad **recibida** (antes de convertir) |
| `receiveAs` | Enum `CATALOG` \| `BOX` | NOT NULL | Unidad de recepción |
| `appliedDelta` | Decimal(12,3) | NOT NULL | Delta aplicado a `onHand` (tras factor caja) |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Momento de la carga |

```prisma
enum InventoryReceiveAs {
  CATALOG
  BOX
}

model InventoryEntry {
  id                String             @id @default(cuid())
  providerProductId String             @map("provider_product_id")
  quantity          Decimal            @db.Decimal(12, 3)
  receiveAs         InventoryReceiveAs @map("receive_as")
  appliedDelta      Decimal            @map("applied_delta") @db.Decimal(12, 3)
  createdAt         DateTime           @default(now()) @map("created_at")

  providerProduct ProviderProduct @relation(fields: [providerProductId], references: [id], onDelete: Restrict)

  @@index([providerProductId, createdAt])
  @@map("inventory_entries")
}
```

`onDelete: Restrict` — no borrar ofertas (F13 no hay hard-delete).

## Relaciones

- N entradas : 1 `ProviderProduct`.
- **No** se crean filas en descarte `US-INV-07` ni en cobro POS ni commit Encargar (Won't kardex).

## Validaciones

| Campo | Regla |
|-------|--------|
| `quantity` | `> 0` |
| `appliedDelta` | `CATALOG` = quantity; `BOX` = quantity × `boxContentFactor` |
| Backfill F12 | **Prohibido** (D-F13-21). Historial desde go-live F13. |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/data-model/DB-inventory-entries.md`
- **Agente Downstream:** Backend Developer
