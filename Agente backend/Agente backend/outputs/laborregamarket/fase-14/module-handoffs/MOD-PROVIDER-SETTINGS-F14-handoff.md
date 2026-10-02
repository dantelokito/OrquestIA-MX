# Handoff de Módulo: MOD-PROVIDER-SETTINGS-F14

> **Proyecto:** laborregamarket  
> **Módulo:** PROVIDER SETTINGS / PERFIL (delta F14)  
> **Stack:** Next.js App Router + Prisma + PostgreSQL + Zod  
> **Fecha:** 2026-09-17  
> **Contrato de referencia:** API-PROVIDER-SETTINGS-14, API-PROVIDER-PROFILE-14, DB-providers, ADR-039

## Inputs Utilizados

- Handoff Arquitecto `fase-14/handoff-backend-fase-14.md`
- ADR-039, ADR-018, ADR-003, ADR-002

## 1. Endpoints implementados

| Método | Ruta | Auth | Contrato | Estado |
|--------|------|------|----------|--------|
| GET | `/api/provider/me` | PROVIDER + sucursal activa | API-PROVIDER-PROFILE-14 | OK (sin shape nuevo) |
| PATCH | `/api/provider/me` | PROVIDER + sucursal activa | API-PROVIDER-SETTINGS-14 | OK |

Paths **sin** `/api/v1/`. Envelope ADR-003.

## 2. Validación (DTOs)

- [x] `patchProviderSettingsSchema` acepta `businessName`, `address`, `city`, `phone`, `description`, `latitude`, `longitude`
- [x] Geo AMM (`monterreyLatSchema` / `monterreyLngSchema`); par lat/lng incompleto → 400
- [x] `.strict()` rechaza `isVerified` / `verifiedAt` → 400
- [x] Google lock ADR-018 intacto (403 si no verificado y el body toca Maps)

## 3. Base de datos

- [x] Sin columnas nuevas (DB-providers)
- [x] `updateProviderSettings` **no** escribe `isVerified` ni `verifiedAt`

## 4. Seguridad

- [x] JWT + rol PROVIDER
- [x] IDOR sucursal → 403 si `id`/`providerId` del body no coincide con la activa

## 5. Pruebas

`npx vitest run` → **401 passed** / 86 files.

F14: `tests/unit/provider-settings-f14.test.ts`, `tests/unit/provider-catalog.test.ts` (pin sin mutar sello), `tests/integration/provider-settings-f14.routes.test.ts`. Google lock vigente en `provider-settings.routes.test.ts`.

## 6. DoD Backend

- [x] Validación completa
- [x] Errores envelope sin stack
- [x] Secrets solo `.env`
- [x] RBAC / IDOR 403
- [x] Tests en verde

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/module-handoffs/MOD-PROVIDER-SETTINGS-F14-handoff.md`
- **Agente Downstream:** Frontend, QA
