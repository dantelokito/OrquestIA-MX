# QA-INPUT-issues — Fase 10

> **Proyecto:** laborregamarket  
> **Fecha:** 2026-08-31  
> **Agente:** QA / Tester Senior  
> **Severidad máxima:** Advertencia (no bloquea el diseño ni la corrida)

## Inputs Utilizados

- **PRD / US:** `Administrador de producto/.../fase-10/prd.md` y `user-stories/`
- **Contratos:** Arquitecto `fase-10/api/API-*.md`
- **Handoff BE:** `Agente backend/.../fase-10/handoff-frontend.md` + QR-BE
- **Handoff FE:** `Agente frontend/.../fase-10/feature-handoffs/` + QR-FE
- **UX:** `Agente UX UI/.../fase-10/handoff-frontend-fase-10.md`

## Hallazgos

| # | Tipo | Severidad | Detalle | Acción QA |
|---|------|-----------|---------|-----------|
| 1 | Ausencia | Advertencia | No existe `READY-FOR-QA.md` F10 en UX ni Arquitecto. FE STATUS pide no invocar QA hasta ese archivo. | Continuar: usuario pidió F10; QR-FE 93/100 (0 P0) y QR-BE 96/100 declaran Must cerrado. |
| 2 | Proceso | Informativo | STATUS QA estaba en fase 9; producto ya en 10. Sign-off F9 sigue pendiente (sesión documental). | Promovido STATUS a 10. `fase-9/` solo lectura. |
| 3 | Fixture | Advertencia | `assertNotLastAdmin` y ADMIN sin `PRODUCTS/view` no son seedables (Won't: CRUD usuarios). | TCs marcados Blocked / cubiertos por unit BE. No se inventa ADMIN restringido. |
| 4 | Regresión UI | Informativo | Chrome Reportes F10 oculta GrainSelector y PDF. API F6 `grain`/`date` y `reports.pdf` siguen. | E2E `dashboard-reports.spec.ts` alineado a rango-primero; API grain intacta. |

## Niveles de bloqueo (regla 00)

Ningún input **Bloqueante** ni **Crítico**. ACs Given-When-Then presentes; contratos con método, path, 401/403/400/409.

## Conclusión

Shift-Left **pasa con advertencias**. Se diseñan matrices y se ejecuta contra `http://127.0.0.1:8080`.
