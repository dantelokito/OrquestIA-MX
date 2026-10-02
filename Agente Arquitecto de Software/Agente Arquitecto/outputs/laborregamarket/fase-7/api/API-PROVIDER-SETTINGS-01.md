# API-PROVIDER-SETTINGS-01 — Delta horario y flags de vitrina (Fase 7)

> **Endpoint:** `GET` / `PATCH` `/api/provider/me`  
> **Módulo:** `PROVIDERS`  
> **Versión:** 0.7.1  
> **Fecha:** 18/08/2026  
> **US:** US-EXPLORE-05 (escritura)  
> **Base F5:** [`../../fase-5/api/API-PROVIDER-SETTINGS-01.md`](../../fase-5/api/API-PROVIDER-SETTINGS-01.md)  
> **Autenticación:** Requerida — Rol `PROVIDER` (dueño)

Campos brand F5 y Google F4 **siguen vigentes**. Este delta cubre lo que el preview público lee.

`verifiedAt` **no** lo escribe el PROVIDER. Solo ADMIN al marcar `isVerified` (ruta admin existente).

---

## GET `/api/provider/me` — campos extra

```json
{
  "whatsappEnabled": false,
  "acceptsCardAtStore": false,
  "offersWholesale": false,
  "offersRetail": true,
  "openingHours": null,
  "verifiedAt": null
}
```

---

## PATCH `/api/provider/me` — body opcional (parcial)

```json
{
  "whatsappEnabled": true,
  "acceptsCardAtStore": true,
  "offersWholesale": true,
  "offersRetail": true,
  "openingHours": [
    { "day": 1, "open": "08:00", "close": "18:00", "closed": false }
  ]
}
```

| Campo | Validación |
|-------|------------|
| `whatsappEnabled` | boolean |
| `acceptsCardAtStore` | boolean |
| `offersWholesale` | boolean |
| `offersRetail` | boolean |
| `openingHours` | `null` (no publicado) o array 0–7 días; `day` 0–6 único; si `closed` then `open`/`close` null; si abierto, `HH:mm` y `open` &lt; `close` (mismo día; no overnight Must) |

400 Zod si inválido. 401/403 estándar.

`offersDelivery` ya existe F4.

---

## Implementación sugerida

Extender `src/lib/services/provider.service.ts` + schema Zod de PATCH me. Migración: [`../data-model/DB-providers.md`](../data-model/DB-providers.md).
