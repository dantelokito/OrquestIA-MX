# Notas Arquitecto → Frontend — Fase 11

> **Fecha:** 12/09/2026  
> **No sustituye** el `handoff-frontend-fase-11.md` de UX.  
> **Autenticación:** `credentials: 'include'`. Cookie `lbm_active_provider` es httpOnly: el FE **no** la lee en JS; usa `GET /api/auth/session` o `GET /api/provider/mine`.

## Endpoints nuevos / delta

| Uso UI | Método / path |
|--------|----------------|
| Chrome, N, brand activo | `GET /api/auth/session` → `providerCount`, `providers`, `activeProviderId`, `brand` |
| Switcher | `POST /api/provider/active` `{ providerId }` luego rehidratar tokens |
| Reportes sucursal | `GET /api/provider/reports` F10 **sin cambio de path** |
| Módulo global | `GET /api/provider/reports/global` — **no pintar nav si `providerCount <= 1`**; si 403 `GLOBAL_REPORTS_NOT_AVAILABLE`, ocultar |
| Alta sucursal | `POST /api/providers` mismo form; activo pasa a la nueva |
| Admin | Una fila por `id`; `ownerEmail` |
| Explorar | Dos cards El Paraíso; no deduplicar por email |

No enviar `X-Active-Provider-Id` como Must. No Bearer nuevo.

Errores: 401 login; 403 switch ajeno o IDOR (toast, no filtrar datos).

Print global = Should.

## Outputs Generados

- **Archivo:** `fase-11/handoff-frontend-notas-fase-11.md`
