# DB-addresses — Delta `lastUsedAt` (Fase 7)

> **Entidad:** `user_addresses` (Prisma model `UserAddress`)  
> **Módulo:** `GEO`  
> **Fecha:** 18/08/2026  
> **Versión:** 0.7.1  
> **US:** US-GEO-11, US-GEO-14  
> **Base F4:** [`../../fase-4/data-model/DB-addresses.md`](../../fase-4/data-model/DB-addresses.md)  
> **ADR:** [`../../comun/adrs/ADR-027-address-last-used.md`](../../comun/adrs/ADR-027-address-last-used.md)

No editar el documento F4; este archivo es el delta F7.

---

## Campo nuevo

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `last_used_at` | `DateTime` | NULLABLE | Última vez que el CLIENT centró Explorar en esta dirección |

```prisma
lastUsedAt DateTime? @map("last_used_at")
```

Migración sugerida: `add_user_address_last_used_at`.

Índice opcional `(user_id, last_used_at DESC)` para hidratar Explorar. El índice F4 `(user_id)` basta en MVP.

---

## Reglas

1. Stamp **solo** en `POST /api/users/me/addresses/[id]/use`.
2. PATCH de label/coords/flags **no** actualiza `lastUsedAt`.
3. `isDefault` sigue siendo máximo uno por `user_id` (transacción F4).
4. Filas existentes: `last_used_at = NULL`.

---

## Referencias

- API: [`../api/API-ADDRESSES-01.md`](../api/API-ADDRESSES-01.md)
