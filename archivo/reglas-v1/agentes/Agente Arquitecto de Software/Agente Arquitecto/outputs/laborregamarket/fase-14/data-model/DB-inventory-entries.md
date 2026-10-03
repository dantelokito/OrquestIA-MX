# DB-inventory-entries — Delta merma y ajuste (Fase 14)

> **Entidad:** `InventoryEntry` (`inventory_entries`)  
> **Fecha:** 2026-09-17  
> **Fase:** 14  
> **US:** US-INV-08, US-INV-09, US-INV-10  
> **ADR:** ADR-040, ADR-036, ADR-038

## Inputs Utilizados

- `fase-13/data-model/DB-inventory-entries.md` (solo lectura)
- Prisma `main` @ `0eda84c` modelo `InventoryEntry`

---

> **Entidad:** `InventoryEntry`

Campos F13 **siguen**. Delta F14:

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `kind` | Enum `InventoryEntryKind` | NOT NULL, DEFAULT `ENTRADA` | `ENTRADA` \| `MERMA` \| `AJUSTE` |
| `quantity` | Decimal(12,3) | NOT NULL | ENTRADA = recibido; MERMA = descartado (mayor que 0); AJUSTE = conteo (≥ 0) |
| `receiveAs` | Enum `InventoryReceiveAs`? | NULL en MERMA/AJUSTE | F13 era NOT NULL; F14 lo vuelve nullable |
| `appliedDelta` | Decimal(12,3) | NOT NULL | Con signo |
| `onHandAfter` | Decimal(12,3)? | NULL | Saldo resultante. Must en escrituras F14. Histórico F13 = NULL |
| `reason` | Enum `InventoryShrinkageReason`? | NULL | Solo MERMA |
| `note` | VARCHAR(200)? | NULL | Nota opcional |
| `id` | String (cuid) | PRIMARY KEY, NOT NULL | Identificador |
| `providerProductId` | String | FK, NOT NULL | Oferta de la sucursal |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Momento |

```prisma
enum InventoryEntryKind {
  ENTRADA
  MERMA
  AJUSTE
}

enum InventoryShrinkageReason {
  CADUCIDAD
  DANO
  ROBO
  MUESTRA
  OTRO
}

model InventoryEntry {
  id                String                    @id @default(cuid())
  providerProductId String                    @map("provider_product_id")
  kind              InventoryEntryKind        @default(ENTRADA)
  quantity          Decimal                   @db.Decimal(12, 3)
  receiveAs         InventoryReceiveAs?       @map("receive_as")
  appliedDelta      Decimal                   @map("applied_delta") @db.Decimal(12, 3)
  onHandAfter       Decimal?                  @map("on_hand_after") @db.Decimal(12, 3)
  reason            InventoryShrinkageReason?
  note              String?                   @db.VarChar(200)
  createdAt         DateTime                  @default(now()) @map("created_at")

  providerProduct ProviderProduct @relation(fields: [providerProductId], references: [id], onDelete: Restrict)

  @@index([providerProductId, createdAt])
  @@index([kind, createdAt])
  @@map("inventory_entries")
}
```

Migración: `kind` DEFAULT `ENTRADA` para filas existentes. `receiveAs` nullable **después** de backfill-no-op (todas las F13 tienen valor). Sin backfill de `onHandAfter`.

## Relaciones

- N movimientos : 1 `ProviderProduct` (sucursal aislada F11).
- **No** hay tabla `InventoryMovement`.
- **No** se crean filas en POS, `DELIVERED` ni `confirmDiscard`.

## Validaciones

| Campo | Regla |
|-------|--------|
| ENTRADA | `quantity > 0`; `receiveAs` NOT NULL; `appliedDelta ≥ 0` |
| MERMA | `quantity > 0`; `reason` NOT NULL; `receiveAs` NULL; `appliedDelta = −quantity`; `onHandAfter ≥ 0` |
| AJUSTE | `quantity ≥ 0` (conteo); `reason` NULL; `receiveAs` NULL; `onHandAfter = quantity` |
| App | Rechazar `onHandAfter < 0` **antes** de commit (400). CHECK SQL de saldo negativo = Should, no Must |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/data-model/DB-inventory-entries.md`
- **Agente Downstream:** Backend Developer
