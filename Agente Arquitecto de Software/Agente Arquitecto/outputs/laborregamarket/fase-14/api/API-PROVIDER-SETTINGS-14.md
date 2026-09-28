# API-PROVIDER-SETTINGS-14 — Datos de negocio editables (delta PATCH me)

> **Endpoint:** `GET` / `PATCH` `/api/provider/me`  
> **Descripción:** Ampliar el PATCH de settings para persistir datos de negocio post-onboarding. **No** muta `isVerified`. Geo AMM.  
> **Autenticación:** Requerida — Rol `PROVIDER` + sucursal activa (cookie `lbm_active_provider`) → Header: cookie JWT  
> **Módulo:** `PROVIDERS`  
> **Versión:** 0.14.0  
> **Fecha:** 2026-09-17  
> **US:** US-PROF-03  
> **ADR:** ADR-039, ADR-018, ADR-003, ADR-002, ADR-034  
> **Envelope:** ADR-003  
> **Base (solo lectura):** `fase-7/api/API-PROVIDER-SETTINGS-01.md`, `fase-12/api/API-PROVIDER-PREFS-12.md`

## Inputs Utilizados

- PRD D-F14-4, D-F14-5, D-F14-22, D-F14-23
- `createProviderSchema` + `monterreyLatSchema` / `monterreyLngSchema`
- Código: `src/lib/validators/provider-settings.ts` (`.strict()` sin estos campos)

---

## GET `/api/provider/me`

Sin campos nuevos. Ya serializa `businessName`, `address`, `city`, `phone`, `description`, `latitude`, `longitude`, `isVerified`, `googleReviewsLocked`. 200 `{ "data": { ... } }`.

CLIENT / sin JWT → 401/403. Sin sucursal activa → 403/404 vigente F11.

---

## PATCH `/api/provider/me`

> **Descripción:** PATCH **parcial** atómico sobre la sucursal activa. Campos omitidos no se resetean a null.

#### Body de Solicitud (Request Payload) — delta F14 (todos opcionales)

```json
{
  "businessName": "Frutas El Paraíso Centro",
  "address": "Av. Juárez 123, Centro",
  "city": "Monterrey",
  "phone": "+528112345678",
  "description": "Fruta de temporada del AMM",
  "latitude": 25.6714,
  "longitude": -100.3089
}
```

Los campos ya vigentes **siguen** aceptados en el mismo body (colores, Google, horarios, capacidades, prep, delivery, `posShowImages`). Ver `API-PROVIDER-PROFILE-14.md`.

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| `businessName` | string | No | Si presente: trim, 2–80 caracteres. No null. |
| `address` | string | No | Si presente: trim, 1–200 caracteres. No null. |
| `city` | string | No | Si presente: trim, 1–80. No null. |
| `phone` | string | No | Si presente: 1–20 caracteres. No null (columna NOT NULL). |
| `description` | string \| null | No | Si string: 0–500. `null` limpia. |
| `latitude` | number | Condicional | `monterreyLatSchema` (25.4–25.9). Si se envía uno de lat/lng, **ambos** son requeridos. |
| `longitude` | number | Condicional | `monterreyLngSchema` (−100.6–−99.8). |

**Prohibidos en este PATCH (PROVIDER):** `isVerified`, `verifiedAt`, `isActive`, `rating`, `reviewCount`, `userId`, `logoUrl`, `coverUrl`. Llegan → **400** (`.strict()` o rechazo explícito). El servicio **no** escribe `isVerified` aunque el valor actual sea true.

Si el body incluye `id` o `providerId` y no coinciden con la sucursal activa → **403** (IDOR F11). No hay path con `:providerId` para mutar otra sucursal.

Geo fuera de AMM → **400**:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "latitude", "message": "Ubicación fuera del área de Monterrey" }
  ]
}
```

#### 200 Success:

```json
{
  "data": {
    "id": "clxprovA",
    "businessName": "Frutas El Paraíso Centro",
    "address": "Av. Juárez 123, Centro",
    "city": "Monterrey",
    "phone": "+528112345678",
    "description": "Fruta de temporada del AMM",
    "latitude": 25.6714,
    "longitude": -100.3089,
    "isVerified": true,
    "verifiedAt": "2026-08-01T18:00:00.000Z",
    "googleReviewsLocked": false
  }
}
```

`isVerified` en la respuesta es el **mismo** que antes del PATCH. Explorar / Haversine / ETA leen lat/lng nuevos en el siguiente GET público (sin contrato nuevo).

AUDIT `PROVIDERS` / `UPDATE`, `entityId=provider.id`, `details` con campos mutados (**sin** loguear un reset de verificación que no ocurrió).

---

## Errores

| HTTP | Caso |
|------|------|
| 400 | Zod; geo AMM; par lat/lng incompleto; `isVerified` en body; JSON inválido |
| 401 | Sin sesión |
| 403 | Rol distinto de PROVIDER; IDOR sucursal; Google lock si el mismo body toca Maps (ADR-018) |
| 404 | Provider activo no encontrado |
| 409 | No usado en este delta |
| 500 | Error interno |

Envelope error simple: `{ "error": "..." }` + `details[]` si validación. No stack traces.

---

## Implementación sugerida

| Capa | Archivo |
|------|---------|
| Zod | `src/lib/validators/provider-settings.ts` — añadir campos; **no** añadir `isVerified` |
| Servicio | `updateProviderSettings` — persistir columnas existentes; omitir `isVerified`/`verifiedAt` del `data` Prisma |
| Route | `src/app/api/provider/me/route.ts` |
| Tests | geo 400; `isVerified` permanece true tras mudar pin; IDOR 403; `.strict()` rechaza `isVerified` |

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/api/API-PROVIDER-SETTINGS-14.md`
- **Agente Downstream:** Backend Developer
