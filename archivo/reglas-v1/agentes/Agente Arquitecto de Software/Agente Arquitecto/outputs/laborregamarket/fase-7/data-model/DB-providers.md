# DB-providers — Delta preview (Fase 7)

> **Entidad:** `providers` (Prisma model `Provider`)  
> **Base F5:** [`../../fase-5/data-model/DB-providers.md`](../../fase-5/data-model/DB-providers.md)  
> **Fecha:** 18/08/2026  
> **Versión:** 0.7.1  
> **US:** US-EXPLORE-05

No editar F1/F4/F5; este archivo es el delta F7. **No** modelo de pagos.

---

## Campos nuevos

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `opening_hours` | `Json` | NULLABLE | Array de días `{ day, open, close, closed }` o null = no publicado |
| `verified_at` | `DateTime` | NULLABLE | Momento en que ADMIN verificó (copy MM/AAAA) |
| `whatsapp_enabled` | `Boolean` | NOT NULL, DEFAULT `false` | Afirmar WhatsApp en vitrina |
| `accepts_card_at_store` | `Boolean` | NOT NULL, DEFAULT `false` | Pago con tarjeta en sucursal |
| `offers_wholesale` | `Boolean` | NOT NULL, DEFAULT `false` | Mayoreo |
| `offers_retail` | `Boolean` | NOT NULL, DEFAULT `true` | Menudeo |

```prisma
openingHours        Json?    @map("opening_hours")
verifiedAt          DateTime? @map("verified_at")
whatsappEnabled     Boolean  @default(false) @map("whatsapp_enabled")
acceptsCardAtStore  Boolean  @default(false) @map("accepts_card_at_store")
offersWholesale     Boolean  @default(false) @map("offers_wholesale")
offersRetail        Boolean  @default(true) @map("offers_retail")
```

Migración sugerida: `add_provider_preview_vitrine`.

Sin índice nuevo (lectura por PK). `isOpenNow` **no** se persiste: se calcula en lectura (TZ `America/Monterrey`).

Backfill: si `is_verified=true` y `verified_at` null → `verified_at = updated_at` (o `now()`).

`offersDelivery` F4 permanece.

Validación de JSON de horario: capa Zod (no CHECK SQL Must).

---

## Referencias

- Preview: [`../api/API-PROVIDER-PREVIEW-01.md`](../api/API-PROVIDER-PREVIEW-01.md)
- Settings: [`../api/API-PROVIDER-SETTINGS-01.md`](../api/API-PROVIDER-SETTINGS-01.md)
