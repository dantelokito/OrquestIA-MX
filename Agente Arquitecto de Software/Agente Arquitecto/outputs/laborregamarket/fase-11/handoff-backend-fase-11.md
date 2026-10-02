# Handoff Backend Developer — LaBorregaMarket Fase 11 (v0.11.0)

> **De:** Agente Arquitecto de Software  
> **Para:** Backend Developer  
> **Fecha:** 12/09/2026  
> **Timestamp:** 2026-09-12  
> **Prioridad:** AUTH/ISO (401/403) → ONB/SEED → DASH global → ADMIN/EXPLORE  
> **No implementar:** Cloudinary/S3, pagos, US-ADMIN-04, catálogo compartido, DT-F10-001/002 P0, `/api/v1/`, claim JWT de sucursal, header como fuente de `activeProviderId`

**Estado:** LISTO PARA IMPLEMENTAR (el orquestador activa Backend; este handoff no lanza el agente).

Código: `C:\Users\PC GAMER\LaBorregaMarket`  
STATUS Arch: [`../STATUS.md`](../STATUS.md)

---

## Orden

```
1. Migración Prisma: drop unique userId + User.providers 1:N
2. Cookie lbm_active_provider + resolveActiveProvider + session delta
3. Quitar findUnique({ userId }) en createProvider y session brand
4. Tests 401/403 IDOR Centro ↔ Tecnológico en /api/provider/*
5. POST /api/providers N+1 + seed El Paraíso Tecnológico
6. GET /api/provider/reports/global (403 si N=1)
7. GET admin: una fila por Provider + ownerEmail
8. Explorar: no groupBy userId
```

No adelantar consolidado si AUTH/ISO no cierran 401/403.

---

## Contratos

| Slice | Archivo |
|-------|---------|
| Sesión / switch | [`api/API-AUTH-11.md`](./api/API-AUTH-11.md) |
| Aislamiento | [`api/API-PROVIDER-ISO-01.md`](./api/API-PROVIDER-ISO-01.md) |
| Alta N+1 | [`api/API-PROVIDER-ONB-01.md`](./api/API-PROVIDER-ONB-01.md) |
| DASH global | [`api/API-PROVIDER-REPORTS-03.md`](./api/API-PROVIDER-REPORTS-03.md) |
| Admin filas | [`api/API-ADMIN-PROVIDERS-02.md`](./api/API-ADMIN-PROVIDERS-02.md) |
| Explorar | [`api/API-EXPLORE-11.md`](./api/API-EXPLORE-11.md) |
| Seed | [`api/API-SEED-11.md`](./api/API-SEED-11.md) |
| DB | [`data-model/DB-providers.md`](./data-model/DB-providers.md) |
| ADRs | [`ADR-034`](../comun/adrs/ADR-034-user-providers-1n-active.md), [`ADR-035`](../comun/adrs/ADR-035-global-provider-reports.md) |

Reportes F10 por sucursal: **no editar** `fase-10/`; solo resolver `providerId` = activo.

---

## Archivos de código a tocar (sugeridos)

| Área | Ruta actual |
|------|-------------|
| Schema | `prisma/schema.prisma` |
| Seed | `prisma/seed.ts` |
| Alta | `src/lib/services/provider.service.ts` (`createProvider`) |
| Sesión | `src/lib/services/session.service.ts`, `src/lib/auth/session.ts` |
| Routes | `src/app/api/auth/session`, `src/app/api/providers`, nuevo `src/app/api/provider/mine`, `.../active`, `.../reports/global` |
| Guards | cualquier `findUnique({ userId })` / `user.provider` |

---

## Checklist recepción Backend

- [ ] Migración Must antes de seed N=2
- [ ] Cookie flags = ADR-025
- [ ] 403 IDOR mismo user
- [ ] Global 403 si N=1 (`GLOBAL_REPORTS_NOT_AVAILABLE`)
- [ ] Envelope ADR-003
- [ ] Tests 401/403 en rutas nuevas y en mutaciones provider
- [ ] Evidencia en `fase-11/quality/EVIDENCIA-BUG-*` solo si QA abre bugs

## Pendientes

- [ ] Print consolidado Should (Frontend)
- [ ] DemoAccountsBlock Campo Verde (Frontend)
- [ ] Switcher UI (Frontend; espera handoff UX)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-11/handoff-backend-fase-11.md`
- **Agente Downstream:** Backend Developer
- **STATUS:** fase 11, contratos listos
