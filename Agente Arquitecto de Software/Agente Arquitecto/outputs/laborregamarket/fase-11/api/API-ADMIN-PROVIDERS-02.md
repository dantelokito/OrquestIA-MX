# API-ADMIN-PROVIDERS-02 — Listado y flags por sucursal

> **Endpoint:** `GET /api/admin/providers` (delta), `PATCH /api/admin/providers/[id]` (sin cambio de contrato F10)  
> **Módulo:** `PROVIDERS`  
> **Versión:** 0.11.0  
> **Fecha:** 12/09/2026  
> **US:** US-ADMIN-11 (extiende US-ADMIN-03)  
> **Base:** `fase-10/api/API-ADMIN-PROVIDERS-01.md` (solo lectura)  
> **Autenticación:** ADMIN + `hasModulePermission(PROVIDERS, view|edit)`

## Inputs Utilizados

- **US-ADMIN-11**, API-ADMIN-PROVIDERS-01, API-ADMIN-SEC-01

---

## GET `/api/admin/providers`

Una **fila por `Provider.id`**, no agrupada por `userId`. El Paraíso N=2 + Campo Verde N=1 = **tres** filas (más el resto de seed).

Cada fila Must incluir:

| Campo | Notas |
|-------|--------|
| `id` | `Provider.id` |
| `businessName` | Nombre de sucursal |
| `userId` | Dueño (para UI: mismo email en dos filas) |
| `ownerEmail` | Join `User.email` (si el GET actual no lo trae, **añadirlo** — Must para no confundir sucursales) |
| `isVerified`, `isActive`, `offersWholesale`, `offersDelivery` | Flags F10 por fila |

Paginación ADR-004 si ya existía. Orden: `createdAt DESC` o el vigente; no colapsar.

Prohibido: `distinct userId`, `groupBy userId`, `findUnique({ userId })` en este listado.

---

## PATCH `/api/admin/providers/[id]`

Path y body = F10 (`isVerified`, `isActive`, `offersWholesale`, `offersDelivery`, colores). El `[id]` es **siempre** sucursal. Verificar Tecnológico no toca Centro.

Side-effect `googleReviewsEnabled=false` si `isVerified` pasa a false: **solo** esa fila (ADR-018).

#### Errores

| HTTP | Caso |
|------|------|
| 400 | Body inválido |
| 401 | Sin sesión |
| 403 | No ADMIN / sin PROVIDERS/edit; PROVIDER o CLIENT |
| 404 | `Provider` inexistente |
| 500 | Error interno |

Won't: CRUD usuarios, `US-ADMIN-04`.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/api/API-ADMIN-PROVIDERS-02.md`
- **Agente Downstream:** Backend, Frontend
