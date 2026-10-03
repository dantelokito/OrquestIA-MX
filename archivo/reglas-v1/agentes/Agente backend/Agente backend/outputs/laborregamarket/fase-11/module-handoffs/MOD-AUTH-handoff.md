# Handoff de Módulo: MOD-AUTH / PROVIDERS (Fase 11)

> **Proyecto:** laborregamarket  
> **Módulo:** AUTH / PROVIDERS  
> **Stack:** Next.js Route Handlers, Prisma, JWT cookie  
> **Fecha:** 12/09/2026  
> **Contrato:** `API-AUTH-11`, `API-PROVIDER-ISO-01`, `API-PROVIDER-ONB-01`, `DB-providers`

## Inputs Utilizados

- Contratos Arquitecto fase-11 y ADR-034 / ADR-025
- Código: `src/lib/auth/active-provider.ts`, `src/lib/auth/cookie.ts`, `src/app/api/provider/mine`, `src/app/api/provider/active`

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| GET | `/api/auth/session` | Pública | API-AUTH-11 | OK |
| GET | `/api/provider/mine` | PROVIDER | API-AUTH-11 | OK |
| POST | `/api/provider/active` | PROVIDER | API-AUTH-11 | OK |
| POST | `/api/providers` | PROVIDER | API-PROVIDER-ONB-01 | OK |
| * | `/api/provider/*` resto | PROVIDER + cookie activa | API-PROVIDER-ISO-01 | OK |

## 2. Validación

- POST active: Zod `.strict()` + `providerId` cuid
- Alta: `createProviderSchema` vigente
- Header `X-Active-Provider-Id` no cambia contexto

## 3. Base de datos

| Tipo | Ruta |
|------|------|
| Schema | `LaBorregaMarket/prisma/schema.prisma` (`User.providers`, `userId` sin unique) |
| Migración | `prisma/migrations/20260912160000_drop_provider_userid_unique` |
| Seed | `prisma/seed.ts` (El Paraíso ×2, Campo Verde ×1) |

## 4. Seguridad

| Ruta | Roles |
|------|-------|
| `/api/provider/mine`, `/active` | PROVIDER |
| `/api/provider/*` panel | PROVIDER + ownership del **activo**; IDOR otra sucursal = 403 |
| Login | Set-Cookie `lbm_active_provider` = primera sucursal |
| Logout | Limpia JWT y cookie activa |

## 5. Pruebas

**Comando:** `npm test` en `C:\Users\PC GAMER\LaBorregaMarket`  
**Resultado:** 324 passed (71 files), 12/09/2026.

Archivos clave: `tests/integration/provider-f11.routes.test.ts`, `tests/unit/active-provider.test.ts`, `tests/unit/session.service.test.ts`.

## 6. DoD Backend

- [x] Validación de entrada
- [x] Errores sin stack al cliente
- [x] Secrets en `.env`
- [x] RBAC + IDOR Must
- [x] Sin N+1 en listados de sucursales (`findMany` por `userId`)
- [x] Tests pasando

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/module-handoffs/MOD-AUTH-handoff.md`
- **Agente Downstream:** Frontend, QA
