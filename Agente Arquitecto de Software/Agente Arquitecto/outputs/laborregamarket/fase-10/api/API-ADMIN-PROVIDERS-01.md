# API-ADMIN-PROVIDERS-01 — Flags de proveedor F5–F9

> **Endpoint:** `PATCH /api/admin/providers/[id]` (delta)  
> **Módulo:** `PROVIDERS`  
> **Versión:** 0.10.2  
> **Fecha:** 28/08/2026  
> **US:** US-ADMIN-03, US-REV-04  
> **ADR:** [`../../comun/adrs/ADR-018-google-reviews.md`](../../comun/adrs/ADR-018-google-reviews.md)  
> **Autenticación:** ADMIN + `hasModulePermission(PROVIDERS, edit)`  
> **Base:** [`../../fase-1/api/API-ADMIN-01.md`](../../fase-1/api/API-ADMIN-01.md), colores F5 [`../../fase-5/api/API-PROVIDER-SETTINGS-01.md`](../../fase-5/api/API-PROVIDER-SETTINGS-01.md)

## Inputs Utilizados

- **US:** `US-ADMIN-03`
- **Código:** `src/lib/validators/provider-settings.ts` → `patchAdminProviderSchema` hoy solo `isVerified` + colores

---

## PATCH `/api/admin/providers/[id]`

> **Descripción:** Verificar/activar negocio y alinear flags de listing F9.  
> **Autenticación:** Requerida — ADMIN + PROVIDERS/edit

El path **no cambia**. Body parcial F10 (además de `isVerified` y par de colores F5, que siguen):

```json
{
  "isVerified": true,
  "isActive": true,
  "offersWholesale": true,
  "offersDelivery": false
}
```

| Campo | Tipo | Requerido | Efecto |
|-------|------|-----------|--------|
| `isVerified` | boolean | No | Si pasa a `false`: `googleReviewsEnabled=false` en la **misma transacción**; Place ID y URL **no** se borran (`US-REV-04` / ADR-018). Si pasa a `true`: `verifiedAt=now()` si el contrato F7 ya lo persiste |
| `isActive` | boolean | No | Negocio oculto del listing público si `false` (mismo campo F1) |
| `offersWholesale` | boolean | No | Mismo campo que query Explorar F9 |
| `offersDelivery` | boolean | No | Mismo campo que query Explorar F9 |
| `primaryColor` / `secondaryColor` | hex \| null | No | Par F5; Could edición ADMIN de marca de **un** negocio — si vienen, validar par/contraste F5 |

Al menos un campo reconocido. Body vacío o solo desconocidos → **400**. `.strict()` Zod: claves extra → 400.

CLIENT → **403**. PROVIDER no usa esta ruta (usa `/api/provider/me`).

#### 200

```json
{
  "data": {
    "id": "clx...",
    "businessName": "La Borrega Agrícola",
    "isVerified": true,
    "isActive": true,
    "offersWholesale": true,
    "offersDelivery": false,
    "googleReviewsEnabled": false,
    "verifiedAt": "2026-08-28T14:00:00.000Z"
  }
}
```

Listado `GET /api/admin/providers` **Should** incluir `offersWholesale` / `offersDelivery` en cada fila (Must si el tab los muestra; FE espera el handoff UX). El GET actual ya trae `isVerified` / `isActive`.

#### Side effects

- `AuditLog`: `module=PROVIDERS`, `action=UPDATE`, `entityId=provider.id`, `details` = patch aplicado (booleanos). Sin secretos.
- Listing público F9 usa los mismos campos (sin schema nuevo).

#### Errores

| HTTP | Caso |
|------|------|
| 400 | Body inválido / par de colores incompleto |
| 401 | Sin sesión |
| 403 | No ADMIN o sin PROVIDERS/edit |
| 404 | Provider no existe |

Chrome ADMIN usa marca de **plataforma** (`US-BRAND-02`), no los colores del negocio, en el shell `/admin`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-10/api/API-ADMIN-PROVIDERS-01.md`
- **Agente Downstream:** Backend Developer
