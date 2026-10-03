# API-PROVIDER-SETTINGS-01 — Configuración del negocio (delta F4)

> **Endpoint:** `GET` / `PATCH` `/api/provider/me`  
> **Módulo:** `PROVIDERS`  
> **Versión:** 0.4.0  
> **Fecha:** 14/08/2026  
> **US:** US-REV-03, US-REV-04, US-NOTIFY-09, US-ORDERS-05  
> **Base:** [`../../fase-1/api/API-PROVIDER-01.md`](../../fase-1/api/API-PROVIDER-01.md) (`GET` ya existe; **PATCH es nuevo**)  
> **Autenticación:** Requerida — Rol `PROVIDER`

---

## GET `/api/provider/me` — campos extra

Extender `data` F1:

```json
{
  "data": {
    "id": "clx...",
    "businessName": "Frutas El Paraíso",
    "address": "Av. Juárez 123, Centro",
    "city": "Monterrey",
    "latitude": 25.6714,
    "longitude": -100.3089,
    "phone": "+528112345678",
    "isVerified": true,
    "isActive": true,
    "preparationTimeMinutes": 20,
    "offersDelivery": false,
    "googlePlaceId": "ChIJ...",
    "googleMapsUrl": "https://maps.google.com/...",
    "googleReviewsEnabled": true,
    "googleReviewsLocked": false
  }
}
```

| Campo extra | Semántica |
|-------------|-----------|
| `googleReviewsLocked` | `true` cuando `isVerified=false`. UI bloquea inputs + copy "Requiere verificación de tu negocio". Los valores Google (si existían) **sí se devuelven** para no perder el draft visual, pero PATCH está prohibido |

---

## PATCH `/api/provider/me`

> **Descripción:** Actualizar tiempos, delivery y vínculo Google. Gate server-side US-REV-04.  
> **Autenticación:** Requerida — Rol `PROVIDER` (dueño; un Provider por user)

#### Body de Solicitud (Request Payload):

Todos los campos opcionales (PATCH parcial):

```json
{
  "preparationTimeMinutes": 25,
  "offersDelivery": true,
  "googlePlaceId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "googleMapsUrl": "https://maps.google.com/?cid=123",
  "googleReviewsEnabled": true
}
```

| Campo | Tipo | Validación |
|-------|------|------------|
| `preparationTimeMinutes` | integer | 5–120 |
| `offersDelivery` | boolean | — |
| `googlePlaceId` | string \| null | 10–255; o `null` para limpiar |
| `googleMapsUrl` | string \| null | HTTPS y host Maps (ADR-018); o `null` |
| `googleReviewsEnabled` | boolean | Si `true`, exige Place ID o URL no vacíos **después** del patch |

No acepta: `isVerified`, `isActive`, `rating`, `reviewCount`, `userId`.

#### Gate Google (Must)

Si el body incluye `googlePlaceId` y/o `googleMapsUrl` y/o `googleReviewsEnabled` **y** `Provider.isVerified=false` → **403** (aunque el valor sea igual al actual).

```json
{ "error": "Requiere verificación de tu negocio" }
```

No usar 200 ni 422 para este caso (US-REV-04: 403 o 422; se elige **403**).

#### 200 Success:

Mismo shape que GET (incl. `googleReviewsLocked`).

#### 400 Bad Request:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "googleMapsUrl", "message": "URL de Google Maps inválida" }
  ]
}
```

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "googleReviewsEnabled", "message": "Indica Place ID o URL de Google Maps" }
  ]
}
```

* **401 / 403** (rol) / **404** (sin entidad Provider — EmptyState onboarding)

AUDIT `UPDATE`, `module=PROVIDERS`, `entityId=provider.id`. No loguear secretos.

---

## ADMIN — pérdida de verificación

`PATCH /api/admin/providers/[id]` existente: si `isVerified` pasa a `false`, en la **misma transacción** `googleReviewsEnabled=false`. Contrato admin F1 no cambia el path; documentar el side effect aquí.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Route | Extender `src/app/api/provider/me/route.ts` con `PATCH` |
| Service | `src/lib/services/provider.service.ts` — `updateProviderSettings` |
| Validación URL/Place ID | `src/lib/validation/google-maps.ts` |

---

## Referencias

- ADR-018: [`../../comun/adrs/ADR-018-google-reviews.md`](../../comun/adrs/ADR-018-google-reviews.md)
- Schema: [`../data-model/DB-providers.md`](../data-model/DB-providers.md)
- Reviews públicas: [`API-REVIEWS-01.md`](./API-REVIEWS-01.md)
