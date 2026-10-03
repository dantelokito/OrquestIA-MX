# Handoff de Módulo: MOD-AUTH

> **Proyecto:** laborregamarket  
> **Módulo:** AUTH  
> **Fecha:** 2026-08-18  
> **Contrato:** `API-AUTH-01`, ADR-025

Sin path nuevo. Helper `src/lib/auth/cookie.ts`.

| Acción | Cookie |
|--------|--------|
| login / register | `lbm_token` HttpOnly Path=/ SameSite=Lax; Secure si `NODE_ENV=production`; maxAge 7d |
| logout | mismo Path/SameSite/Secure, `Max-Age=0` |

Prohibido: JWT en query, `SameSite=None`. Session GET sigue 200 invitado.

Pruebas: `tests/unit/session-cookie.test.ts`
