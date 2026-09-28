# Handoff de Módulo: MOD-PROVIDER-PREVIEW

> **Proyecto:** laborregamarket  
> **Módulo:** PROVIDERS (preview + settings)  
> **Fecha:** 2026-08-18  
> **Contrato:** `API-PROVIDER-PREVIEW-01`, `API-PROVIDER-SETTINGS-01`, `DB-providers`

---

## Endpoints

| Método | Ruta | Auth | Estado |
|--------|------|------|--------|
| GET | `/api/providers/[id]` | Pública | OK extra F7 |
| GET/PATCH | `/api/provider/me` | PROVIDER | OK horario/flags |
| PATCH | `/api/admin/providers/[id]` | ADMIN | `verifiedAt` al verificar |

## BD

`prisma/migrations/20260818020000_add_provider_preview_vitrine`  
Backfill `verified_at = updated_at` si ya estaba verificado.

`isOpenNow` no se persiste. TZ `America/Monterrey`. Horario null/vacío → `hoursPublished=false`, `isOpenNow=null`.

## Pruebas

`tests/unit/opening-hours.test.ts`, `provider-settings-hours.test.ts`, `provider-catalog.test.ts`
