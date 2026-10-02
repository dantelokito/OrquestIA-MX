# ADR-034 — User 1:N Provider y contexto `activeProviderId`

> **Estado:** Aprobado  
> **Fecha:** 12/09/2026  
> **Decisores:** Arquitecto de Software  
> **Fase:** 11 — v0.11.0  
> **US:** US-AUTH-11, US-HEADER-01, US-ISO-01, US-ONB-01

---

## 1. Contexto y problema

Hasta F10, `Provider.userId` es `@unique` y Prisma modela `User.provider` 1:1. El código resuelve “el” negocio con `findUnique({ where: { userId } })`. F11 exige un login PROVIDER con N sucursales aisladas y un contexto activo.

Hay que persistir cuál sucursal está activa sin romper la cookie JWT first-party (ADR-025) ni mezclar datos entre sucursales del mismo dueño (IDOR = 403).

---

## 2. Opciones consideradas

* **A — Cookie httpOnly aparte (`lbm_active_provider`):** valor = `Provider.id`. Mismos flags que el JWT (ADR-025). El JWT sigue siendo solo `sub` (user) + `role`. Switch no reemite JWT.
* **B — Claim `activeProviderId` en el JWT:** cada switch obliga a re-firmar cookie de sesión; más superficie de invalidación; el token viejo podría apuntar a otra sucursal.
* **C — Header `X-Active-Provider-Id` en cada request:** no persiste “última usada”; el FE puede olvidarlo; más fácil inconsistencia entre pestañas; no sustituye cookie para chrome.

---

## 3. Decisión

**Opción A.** Contexto activo = cookie first-party `lbm_active_provider` (cuid). No header Must. No claim JWT Must.

| Flag | Local HTTP | Staging / prod HTTPS |
|------|------------|----------------------|
| `HttpOnly` | true | true |
| `Path` | `/` | `/` |
| `SameSite` | `Lax` | `Lax` |
| `Secure` | false | true |
| `Domain` | omitir | omitir |

Algoritmo `resolveActiveProvider`:

1. Si `role ≠ PROVIDER` → no hay activo (rutas `/api/provider/*` → 403).
2. Leer cookie. Si el id es cuid y existe `Provider` con `id` + `userId = session.sub` → ese es el activo.
3. Si cookie ausente, inválida o de otro dueño → elegir el `Provider` del user con `createdAt ASC` (primera alta). Reescribir cookie.
4. Si el user no tiene providers → `activeProviderId = null` (onboarding).
5. Un id de recurso (producto, media, orden, sección) cuyo `providerId` ≠ activo **o** no pertenece al user → **403** (no 404 de existencia). Tests 401/403 Must.

Tras `POST /api/providers` (alta N+1) el servidor **cambia** el activo a la sucursal nueva y setea la cookie (`US-ONB-01`).

Visibilidad de switcher y del módulo DASH global = `N = COUNT(Provider WHERE userId)` en servidor. No es flag ADMIN.

---

## 4. Consecuencias

- Migración: quitar UNIQUE de `providers.user_id`; índice no único `providers_user_id_idx`. Relación `User.providers` 1:N.
- `createProvider` deja de usar `findUnique({ userId })` como conflicto 409 de “ya tiene negocio”.
- `getAuthSessionPayload` deja de asumir un solo Provider; brand CSS = sucursal **activa**.
- Header `X-Active-Provider-Id` se ignora si llega (no es fuente de verdad).

## Inputs Utilizados

- **PRD:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-11/prd.md`
- **ADR-025:** cookie JWT first-party
- **Código:** `prisma/schema.prisma` (`userId @unique`), `session.service.ts`

## Outputs Generados

- **Archivo:** `comun/adrs/ADR-034-user-providers-1n-active.md`
- **Agente Downstream:** Backend Developer
