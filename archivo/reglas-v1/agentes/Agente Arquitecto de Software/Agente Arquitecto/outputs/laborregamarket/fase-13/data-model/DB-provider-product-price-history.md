# DB-provider-product-price-history — Historial de precio de oferta

> **Entidad:** `ProviderProductPriceHistory` (`provider_product_price_history`)  
> **Fecha:** 2026-09-16  
> **Fase:** 13  
> **US:** US-CAT-19, US-CAT-20  
> **ADR:** ADR-038 (precio por oferta, no maestro)

## Inputs Utilizados

- PRD D-F13-17, D-F13-18, D-F13-22
- Precio vigente: `ProviderProduct.price` Decimal(10,2)

---

> **Entidad:** `ProviderProductPriceHistory`

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | String (cuid) | PRIMARY KEY | Identificador |
| `providerProductId` | String | FK, NOT NULL | Oferta |
| `price` | Decimal(10,2) | NOT NULL | Precio **después** del cambio (MXN) |
| `previousPrice` | Decimal(10,2) | NULL | Precio anterior; NULL en primera asignación |
| `changedByUserId` | String | FK User, NOT NULL | Quién persistió |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Timestamp |

```prisma
model ProviderProductPriceHistory {
  id                 String   @id @default(cuid())
  providerProductId  String   @map("provider_product_id")
  price              Decimal  @db.Decimal(10, 2)
  previousPrice      Decimal? @map("previous_price") @db.Decimal(10, 2)
  changedByUserId    String   @map("changed_by_user_id")
  createdAt          DateTime @default(now()) @map("created_at")

  providerProduct ProviderProduct @relation(fields: [providerProductId], references: [id], onDelete: Restrict)
  changedBy       User            @relation(fields: [changedByUserId], references: [id], onDelete: Restrict)

  @@index([providerProductId, createdAt])
  @@map("provider_product_price_history")
}
```

Backend añade `priceHistory ProviderProductPriceHistory[]` en `ProviderProduct` y relación inversa en `User`.

## Relaciones

- N registros : 1 oferta.
- Primera asignación de precio (alta LOCAL, upsert GLOBAL, stub de archivo con 0) **también** inserta fila (`previousPrice=null`).
- Cambio de precio de catálogo **no** reescribe `OrderItem.unitPrice`.

## Validaciones

| Campo | Regla |
|-------|--------|
| `price` | ≥ 0, máx. 2 decimales |
| IDOR | GET historial 403 si la oferta no es de la sucursal activa |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/data-model/DB-provider-product-price-history.md`
- **Agente Downstream:** Backend Developer
