# API-AUTH-11 — Sesión multi-frutería y switch de contexto

> **Endpoints:** `GET /api/auth/session` (delta), `GET /api/provider/mine`, `POST /api/provider/active`  
> **Módulo:** `AUTH` / `PROVIDERS`  
> **Versión:** 0.11.0  
> **Fecha:** 12/09/2026  
> **US:** US-AUTH-11, US-HEADER-01  
> **ADR:** [`../../comun/adrs/ADR-034-user-providers-1n-active.md`](../../comun/adrs/ADR-034-user-providers-1n-active.md), ADR-003, ADR-025  
> **Autenticación:** Cookie JWT. Contexto: cookie `lbm_active_provider`. Sin `/api/v1/` (ADR-002).

## Inputs Utilizados

- **PRD / US:** workspace PM `fase-11/`
- **Código:** `GET /api/auth/session`, `getAuthSessionPayload` (`findUnique` por `userId`)
- **Base F7:** `fase-7/api/API-AUTH-01.md` (solo lectura)

Envelope ADR-003: éxito `{ data }`; error `{ error: { code, message, details? }, timestamp }`. Campos `success` / `message` de plantilla genérica **no** se introducen (homogéneo con F1–F10).

---

## GET `/api/auth/session`

> **Descripción:** Sesión actual + lista de sucursales del PROVIDER + activo + N.  
> **Autenticación:** Pública (invitado = 200 no autenticado).

Campos F5 (`authenticated`, `role`, `brand`) se conservan. `brand` = par de la sucursal **activa** (o `null` si no hay activo / par inválido).

#### 200 PROVIDER

```json
{
  "data": {
    "authenticated": true,
    "role": "PROVIDER",
    "brand": {
      "primaryColor": "#2D6A4F",
      "secondaryColor": "#F4A261",
      "source": "provider"
    },
    "providerCount": 2,
    "activeProviderId": "clxactivo000000000000001",
    "providers": [
      {
        "id": "clxactivo000000000000001",
        "businessName": "Frutas El Paraíso",
        "primaryColor": "#2D6A4F",
        "secondaryColor": "#F4A261"
      },
      {
        "id": "clxtecno0000000000000002",
        "businessName": "El Paraíso Tecnológico",
        "primaryColor": null,
        "secondaryColor": null
      }
    ]
  }
}
```

`providers` orden `createdAt ASC`. `providerCount` = `providers.length`. CLIENT/ADMIN/invitado: omitir `providers` o `[]`, `providerCount: 0`, `activeProviderId: null`, `brand: null`.

Si cookie de activo es ajena: el servidor **corrige** (primera sucursal) y Set-Cookie; 200 con el id corregido. No 403 en session.

---

## GET `/api/provider/mine`

> **Descripción:** Lista canónica de sucursales del user para el switcher.  
> **Autenticación:** Requerida — Rol `PROVIDER`

#### 200

```json
{
  "data": {
    "providerCount": 2,
    "activeProviderId": "clxactivo000000000000001",
    "providers": [
      {
        "id": "clxactivo000000000000001",
        "businessName": "Frutas El Paraíso",
        "address": "Av. Constitución 1200, Centro, Monterrey",
        "isActive": true
      },
      {
        "id": "clxtecno0000000000000002",
        "businessName": "El Paraíso Tecnológico",
        "address": "Av. Eugenio Garza Sada 2501, Tecnológico, Monterrey",
        "isActive": true
      }
    ]
  }
}
```

#### Errores

| HTTP | Caso |
|------|------|
| 401 | Sin JWT / JWT inválido |
| 403 | CLIENT o ADMIN |
| 500 | Error no controlado |

---

## POST `/api/provider/active`

> **Descripción:** Fija sucursal activa (Set-Cookie `lbm_active_provider`).  
> **Autenticación:** Requerida — Rol `PROVIDER`

#### Request

```json
{
  "providerId": "clxtecno0000000000000002"
}
```

| Campo | Tipo | Requerido |
|-------|------|-----------|
| `providerId` | string cuid | Sí |

#### 200

```json
{
  "data": {
    "activeProviderId": "clxtecno0000000000000002",
    "businessName": "El Paraíso Tecnológico",
    "brand": {
      "primaryColor": null,
      "secondaryColor": null,
      "source": "provider"
    }
  }
}
```

`brand` null si el par no cumple contraste F5. FE rehidrata tokens CSS.

#### Errores

| HTTP | Caso |
|------|------|
| 400 | Body vacío, cuid inválido, claves extra (`.strict()`) |
| 401 | Sin JWT |
| 403 | Rol ≠ PROVIDER **o** `providerId` de otro user **o** id inexistente (tratar como ajeno: **403**, no 404) |
| 409 | No aplica |
| 500 | Error no controlado |

Header `X-Active-Provider-Id` **no** cambia el contexto.

Audit: `module=PROVIDERS`, `action=UPDATE`, `entityId=providerId`, `details: { activeProvider: true }`. Sin secretos.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/api/API-AUTH-11.md`
- **Agente Downstream:** Backend, Frontend
