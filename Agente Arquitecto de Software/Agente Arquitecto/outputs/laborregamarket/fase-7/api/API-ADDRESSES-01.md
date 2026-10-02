# API-ADDRESSES-01 — Delta favoritas (Fase 7)

> **Endpoint:** `/api/users/me/addresses`  
> **Módulo:** `GEO`, `USERS`  
> **Versión:** 0.7.1  
> **Fecha:** 18/08/2026  
> **US:** US-GEO-11, US-GEO-14  
> **Base F4:** [`../../fase-4/api/API-ADDRESSES-01.md`](../../fase-4/api/API-ADDRESSES-01.md)  
> **ADR:** [`../../comun/adrs/ADR-027-address-last-used.md`](../../comun/adrs/ADR-027-address-last-used.md)  
> **Autenticación:** Requerida — Rol `CLIENT` → cookie JWT

Envelope ADR-003. Schema: [`../data-model/DB-addresses.md`](../data-model/DB-addresses.md).

Invitado: **401**. PROVIDER/ADMIN: **403**. Ownership: solo filas del `userId` de la sesión. Cross-user: **404** (no 403).

CRUD F4 (`GET`/`POST` lista, `PATCH`/`DELETE` `[id]`) **sigue vigente**. Este delta añade `lastUsedAt` y el stamp de uso.

---

## GET `/api/users/me/addresses`

Orden: `lastUsedAt DESC NULLS LAST`, luego `isDefault DESC`, `isFavorite DESC`, `createdAt DESC`.

Cada item F4 **más**:

```json
{
  "id": "clx...",
  "label": "Casa",
  "formattedAddress": "Av. Juárez 123, Centro, Monterrey",
  "lat": 25.6714,
  "lng": -100.3089,
  "isFavorite": true,
  "isDefault": true,
  "lastUsedAt": "2026-08-18T18:00:00.000Z",
  "createdAt": "2026-08-14T18:00:00.000Z"
}
```

`lastUsedAt` puede ser `null` (nunca usada en mapa). Lista vacía: `{ "data": [] }` → FE usa SN (ADR-026).

Hidratación Explorar: primera no-null `lastUsedAt` → else `isDefault` → else SN. Radio default **10 km**.

`localStorage` **no** gana a este GET (`US-GEO-14`).

---

## POST `/api/users/me/addresses`

Body F4. Respuesta incluye `lastUsedAt: null` salvo que el cliente también llame `/use`.

---

## PATCH `/api/users/me/addresses/[id]`

Sin stamp de last-used (editar etiqueta no cuenta como uso). `isDefault: true` desmarca el resto en transacción.

---

## POST `/api/users/me/addresses/[id]/use`

> **Descripción:** Marcar esta dirección como última usada en `/explorar`. No cambia `isDefault`.  
> **Autenticación:** Requerida — Rol `CLIENT`

Sin body (o `{}`).

* **200:** `{ "data": { ...address, "lastUsedAt": "<ISO now>" } }`
* **401 / 403 / 404**

`requireRole(CLIENT)` + test 401/403 (DEV-P2-011).

---

## DELETE `/api/users/me/addresses/[id]`

Igual F4. Si se borra la last-used, FE rehidrata con default o SN.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Use | `src/app/api/users/me/addresses/[id]/use/route.ts` |
| Service | `src/lib/services/address.service.ts` — `markLastUsed` |

---

## Referencias

- GEO: [`API-GEO-01.md`](./API-GEO-01.md)
- ADR-026 SN: [`../../comun/adrs/ADR-026-explore-default-san-nicolas.md`](../../comun/adrs/ADR-026-explore-default-san-nicolas.md)
