# Handoff de Módulo: MOD-ADDRESSES

> **Proyecto:** laborregamarket  
> **Módulo:** ADDRESSES  
> **Stack:** Next.js App Router, Prisma, Zod  
> **Fecha:** 2026-08-24  
> **Contrato:** `API-ADDRESSES-01` F8

---

## 1. Endpoints

| Método | Ruta | Auth | Estado |
|--------|------|------|--------|
| GET/POST | `/api/users/me/addresses` | CLIENT | OK; POST `lat`/`lng` → `isInMexico` |
| PATCH/DELETE | `/api/users/me/addresses/[id]` | CLIENT | OK; PATCH coords → MX; DELETE pin = FE |
| POST | `/api/users/me/addresses/[id]/use` | CLIENT | Igual F7 |

Sin endpoint nuevo. Sin migración.

## 2–4. Validación y RBAC

`createAddressSchema` / `patchAddressSchema` usan `mexicoLatSchema` / `mexicoLngSchema`.  
CDMX válido. `33.0, -99.0` → 400, `details.field` = `lat` o `lng`, copy «Ubicación fuera de México».  
Tope 20, `label`, duplicados y `/use` intactos. `requireRole(CLIENT)`. Cross-user 404.

## 5. Pruebas

`npx vitest run tests/integration/addresses.routes.test.ts` — POST/PATCH CDMX 201/200; fuera MX 400.

## 6. DoD

- [x] Validación geo MX  
- [x] Envelope 400  
- [x] RBAC F7  
- [x] Tests passing
