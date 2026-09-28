# Handoff: QA → Backend Developer

## Metadata
- **Fecha:** 2026-09-12
- **Fase:** 11
- **Proyecto:** laborregamarket
- **Agente Emisor:** QA / Tester Senior
- **Agente Receptor:** Backend Developer

## Estado (re-prueba 12/09)

Cola BE sigue vacía. BUG-017/018 fueron FE y quedaron **Verificados**. Dictamen QA **APROBADO**.

La API Must F11 pasó en `http://127.0.0.1:8080` (12/12): sesión 1:N, cookie `lbm_active_provider`, IDOR 403, aislamiento CAT, global N>1 200, N=1 `GLOBAL_REPORTS_NOT_AVAILABLE`, RBAC, listing, admin paginado, alta N+1.

## Pendientes de entorno (no ticket de producto)

- `npx prisma generate` → **EPERM** si el query engine DLL está bloqueado por el proceso Next. Reiniciar `npm run dev` antes de generate.
- Localhost **sin** migración `20260912160000_drop_provider_userid_unique` dejaba N=1 y 500 en el segundo `POST /api/providers`. QA ya aplicó `migrate deploy` + `db:seed` (4 sucursales).

## Si FE evidencia apunta a BE

Revisar que `GET /api/auth/session` inmediatamente post-login incluya `providers[]` (el primer paint FE puede llegar antes). No hay fallo de contrato en Playwright API.

## DoD de re-prueba

Solo si aparece `fase-11/quality/EVIDENCIA-BUG-*.md` de Backend:

```text
cwd: QA Automation Engineer/Agente Tester/outputs/laborregamarket/tests
npx playwright test tests/api/f11-multi-provider.spec.ts --reporter=list
```

## Inputs Utilizados

- Handoff BE F11, QR-BE, API-AUTH-11, API-PROVIDER-REPORTS-03

## Outputs Generados

- **Archivo:** `fase-11/QA-F11-handoff-backend.md`
- **Agente Downstream:** Backend Developer
