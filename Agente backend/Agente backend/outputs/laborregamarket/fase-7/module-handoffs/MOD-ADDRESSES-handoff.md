# Handoff de Módulo: MOD-ADDRESSES

> **Proyecto:** laborregamarket  
> **Módulo:** ADDRESSES  
> **Stack:** Next.js App Router, Prisma, Zod  
> **Fecha:** 2026-08-18  
> **Contrato:** `API-ADDRESSES-01`, `DB-addresses`

---

## 1. Endpoints

| Método | Ruta | Auth | Estado |
|--------|------|------|--------|
| GET/POST | `/api/users/me/addresses` | CLIENT | OK + `lastUsedAt` |
| PATCH/DELETE | `/api/users/me/addresses/[id]` | CLIENT | OK; PATCH no stamp |
| POST | `/api/users/me/addresses/[id]/use` | CLIENT | OK |

## 2–4. BD y RBAC

Migración `prisma/migrations/20260818010000_add_user_address_last_used_at`.  
`requireRole(CLIENT)`. Cross-user 404.

## 5. Pruebas

`npx vitest run tests/integration/addresses.routes.test.ts` — 401/403 en `/use` (DEV-P2-011).
