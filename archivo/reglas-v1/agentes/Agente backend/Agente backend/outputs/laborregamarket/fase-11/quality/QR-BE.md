# Quality Report Backend — Fase 11

> **Fecha:** 12/09/2026  
> **Proyecto:** laborregamarket  
> **Agente:** Backend Developer

## Inputs Utilizados

- Handoff Arquitecto `fase-11/handoff-backend-fase-11.md`
- Contratos AUTH-11, ISO-01, ONB-01, REPORTS-03, ADMIN-02, EXPLORE-11, SEED-11

## Alcance Must cerrado

| Ítem | Evidencia |
|------|-----------|
| `Provider.userId` no unique, User 1:N | `schema.prisma` + migración `drop_provider_userid_unique` |
| Cookie `lbm_active_provider` = flags ADR-025 | `src/lib/auth/cookie.ts` |
| JWT sin sucursal; header ignorado | `JwtPayload` sin provider; POST active usa solo body |
| Listar + set active | `/api/provider/mine`, `/api/provider/active` |
| Panel `/api/provider/*` por activo + IDOR 403 | `requireActiveProvider` + `findOwnedProvider` |
| Reportes F10 por sucursal | `GET /api/provider/reports` con `providerId` activo |
| Global N>1 / 403 N=1 | `getGlobalProviderReport` |
| Alta N+1 | `createProvider` sin 409 1:1; Set-Cookie nueva |
| Admin una fila + `ownerEmail` | `listAdminProviders` |
| Explorar no colapsa | `listProviders` por fila Provider |
| Seed El Paraíso ×2 / Campo Verde ×1 | `prisma/seed.ts` |
| Media / SKU local / secciones por activo | rutas panel pasan `providerId` |

## Tests

```
cd C:\Users\PC GAMER\LaBorregaMarket
npm test
```

Resultado: **324 passed**, 71 files, 12/09/2026.

Casos Must: 401/403 mine-active, 403 id ajeno, 403 global N=1, IDOR secciones, cookie flags.

## Autoevaluación docs

- Sin placeholders `[Insertar]`, `TODO`, `XXX`
- Rutas de fase-11 (no fase-10)
- Referencias a contratos existentes

## Bloqueos

- `npx prisma generate` falló aquí con EPERM al renombrar el query engine de Windows (archivo bloqueado). El schema ya está en el repo; hay que regenerar el client en la máquina si el IDE tiene el DLL abierto. Aplicar migrate + seed en local antes de QA E2E.

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/quality/QR-BE.md`
- **Agente Downstream:** QA, Frontend
