# API-PROVIDER-ONB-01 — Alta de sucursal N+1

> **Endpoint:** `POST /api/providers` (mismo path F1)  
> **Módulo:** `PROVIDERS`  
> **Versión:** 0.11.0  
> **Fecha:** 12/09/2026  
> **US:** US-ONB-01  
> **ADR:** ADR-034  
> **Autenticación:** Requerida — usuario autenticado que puede operar como PROVIDER (flujo F1: tras registro o sesión PROVIDER)

## Inputs Utilizados

- **US-ONB-01**, PRD D-F11-3
- **Código:** `createProvider` + `findUnique({ userId })` → `ProviderConflictError` (hoy 409)

---

## POST `/api/providers`

> **Descripción:** Crea un `Provider` ligado a `session.sub`. Permite N+1.  
> **Autenticación:** Requerida

Body: el schema vigente `createProviderSchema` (businessName, address, city, lat/lng, description, phone). Sin campos nuevos Must.

#### Comportamiento F11

| Caso | Resultado |
|------|-----------|
| Primer negocio del user | 201 + fila; rol PROVIDER si el flujo F1 ya lo asigna |
| Ya tiene ≥1 Provider | 201 + **nueva** fila mismo `userId`. **No** 409 por “ya tiene negocio” |
| Set-Cookie | `lbm_active_provider` = id **nuevo** |
| CLIENT con sesión | Si el producto hoy exige rol PROVIDER, conservar ese 403; el Must de N+1 es sesión PROVIDER en `/registro/negocio` |

409 queda para conflictos reales (p. ej. validación de negocio), **no** para “un user un provider”.

#### 201

```json
{
  "data": {
    "id": "clxnueva0000000000000003",
    "userId": "clxuser00000000000000001",
    "businessName": "El Paraíso Tecnológico",
    "address": "Av. Eugenio Garza Sada 2501, Tecnológico, Monterrey",
    "city": "Monterrey",
    "latitude": 25.6514,
    "longitude": -100.2895,
    "activeProviderId": "clxnueva0000000000000003"
  }
}
```

Coords del ejemplo = seed Tecnológico (Backend usa las del body; seed fija las oficiales).

#### Errores

| HTTP | Caso |
|------|------|
| 400 | Schema inválido |
| 401 | Sin JWT |
| 403 | Rol no autorizado por el guard vigente |
| 409 | Solo conflictos no-1:N (no “already has provider”) |
| 500 | Error interno |

Audit `CREATE` por `provider.id` (ya existe).

FE: misma ruta `/registro/negocio`; copy “Nueva frutería” si `providerCount >= 1` (fuera de este contrato).

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/api/API-PROVIDER-ONB-01.md`
- **Agente Downstream:** Backend, Frontend
