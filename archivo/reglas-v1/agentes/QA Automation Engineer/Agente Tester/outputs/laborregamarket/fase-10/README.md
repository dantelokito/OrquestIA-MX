# Fase 10 — Admin seguro + catálogo local + media disco + reportes (QA)

| Tipo | Ruta |
|------|------|
| Matrices | [test-matrices/](./test-matrices/) |
| Quality / inputs | [quality/QA-INPUT-issues.md](./quality/QA-INPUT-issues.md) |
| Progreso | [qa-signoffs/QA-F10-progreso.md](./qa-signoffs/QA-F10-progreso.md) |
| Sign-off | [QA-F10-signoff.md](./qa-signoffs/QA-F10-signoff.md) (**APROBADO CON CONDICIONES** 12/09 — Zero Blocker PASS localhost) · [QA-F10-progreso.md](./qa-signoffs/QA-F10-progreso.md) |
| Deuda | [deuda-tecnica/](./deuda-tecnica/) — [DT-F10-001](./deuda-tecnica/DT-F10-001-uuid-contexto-inseguro.md) (ex 015) · [DT-F10-002](./deuda-tecnica/DT-F10-002-media-20mib-fe-bodysize.md) (resto 016) |
| Bugs | [BUG-015](./bug-reports/BUG-015.md) **Diferido** · [BUG-016](./bug-reports/BUG-016.md) **Diferido** (BE disco aceptado) |
| Handoff DevOps | [QA-F10-handoff-devops.md](./QA-F10-handoff-devops.md) · [prompt merge](./activation-prompt-devops-merge-F10.txt) |
| Handoff FE | [QA-F10-handoff-frontend.md](./QA-F10-handoff-frontend.md) (histórico) · [015](./activation-prompt-frontend-BUG-015.txt) · [016](./activation-prompt-frontend-BUG-016.txt) |
| Handoff BE | [QA-F10-handoff-backend.md](./QA-F10-handoff-backend.md) (histórico) · [activation-prompt-backend-BUG-016.txt](./activation-prompt-backend-BUG-016.txt) |
| Handoff PM | [QA-F10-handoff-pm.md](./QA-F10-handoff-pm.md) · [retorno 12/09](./QA-F10-retorno-pm-ux-arch.md) · [prompt PM](./activation-prompt-pm-retorno-F10.txt) |
| Handoff UX | [QA-F10-handoff-ux.md](./QA-F10-handoff-ux.md) · [prompt UX](./activation-prompt-ux-retorno-F10.txt) |
| Handoff Arch | [QA-F10-handoff-arquitecto.md](./QA-F10-handoff-arquitecto.md) · [prompt Arch](./activation-prompt-arquitecto-retorno-F10.txt) |
| Suite viva | [`../tests/`](../tests/) — **no se parte** |

F9 permanece **solo lectura**. F8 **cerrada**. No reabrir sign-off F8 ni US F7/F8/F9. F10 **cerrada documentalmente** (12/09). F11 no se abre en esta sesión.

## Alcance Must

| Slice | US | Contratos |
|-------|-----|-----------|
| SEC | US-SEC-01 … 03 | API-ADMIN-SEC-01 |
| ADMIN | US-ADMIN-02, US-ADMIN-03 | API-ADMIN-PRODUCTS-01, API-ADMIN-PROVIDERS-01 |
| CAT | US-CAT-02, US-CAT-03 | API-PROVIDER-PRODUCTS-02, API-PROVIDER-SECTIONS-01 |
| MEDIA | US-MEDIA-06 | API-MEDIA-02 |
| DASH | US-DASH-07 … 09 | API-PROVIDER-REPORTS-02, API-DASH-NOTES-01 |

**Fuera:** `US-ADMIN-04`, Cloudinary/S3, CRUD usuarios, PDF/GrainSelector en chrome F10, reopen F8/F9.

## Comando focal F10

```bash
npx playwright test --workers=1 \
  tests/api/admin-products.spec.ts \
  tests/api/local-products.spec.ts \
  tests/api/sections.spec.ts \
  tests/api/media.spec.ts \
  tests/api/reports.spec.ts \
  tests/api/rbac.spec.ts \
  tests/e2e/dashboard-reports.spec.ts \
  tests/e2e/provider-catalog-f10.spec.ts \
  tests/e2e/fruteria-sections.spec.ts \
  tests/e2e/admin-catalog-f10.spec.ts
```

Cwd: `outputs/laborregamarket/tests`  
Base URL: `http://127.0.0.1:8080`  
Última corrida Must: **89/89** Pass (31/08/2026).  
Cobertura DT (pueden fallar; no bloquean dictamen): Encargar UUID — `npx playwright test tests/e2e/cart-uuid.spec.ts`. Media 20 MiB — `npx playwright test tests/api/media.spec.ts` (`TC-MED-009`, `HP-MED-02`).

Smoke Explorar (no reabre matrices F8): `explore-f8.spec.ts` + `explore-f7.spec.ts`.

## Pre-requisito app

`npx prisma migrate deploy` (`add_product_scope_sections_media`) con `next dev` parado; seed; `UPLOADS_DIR` (default `./uploads`).
