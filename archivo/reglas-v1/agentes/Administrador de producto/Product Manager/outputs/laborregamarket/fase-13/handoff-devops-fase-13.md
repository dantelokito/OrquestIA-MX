# Handoff: Product Manager → DevOps / Cloud Engineer

## Metadata

- **Fecha:** 2026-09-16
- **Fase:** 13
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** DevOps / Cloud Engineer Senior
- **Timestamp:** 2026-09-16 (cierre documental F13; QG UX + Arch presentes)

F13 (visibilidad admin, archivo de oferta, unidad/precio de oferta, reportes de inventario) está **cerrada documentalmente**. QA **APROBADO**. Ambos `QG-correcciones.md` existen y declaran **sin delta** UI ni contrato/ADR. **Lista para PR.**

**DoD DevOps:** PR **abierto**, checks verdes, descripción lista. **Prohibido** `git push` a `main`/`master` y merge a producción. El **humano** mergea.

Chat **nuevo**. Este PM **no** implementa, **no** abre el PR y **no** lanza tu rol (lo hace el orquestador). Código de la app: `C:\Users\PC GAMER\LaBorregaMarket`. Rama de trabajo: `feat/f13-archivo-oferta-unidad`. Escribes en tu workspace `outputs/laborregamarket/fase-13/`. **No** promociones a fase 14 (no hay intro F14).

---

## Lectura mínima (en este orden)

1. Este archivo.
2. Sign-off QA: `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-13/qa-signoffs/QA-F13-signoff.md`
3. QG UX: `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-13/quality/QG-correcciones.md`
4. QG Arquitecto: `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-13/quality/QG-correcciones.md`
5. STATUS PM: `Administrador de producto/Product Manager/outputs/laborregamarket/STATUS.md`
6. Baseline F12 **ya en main** ([PR #12](https://github.com/dantelokito/BorregaMarket/pull/12)). F13 se abre **encima** de ese baseline.

`fase-12/` y anteriores: **solo lectura**.

---

## Entregables (emisor / gates)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `QA-F13-signoff.md` | Sign-off QA | **APROBADO** (Playwright 19/19; BUG-020 Verificado) |
| QG UX `fase-13/quality/QG-correcciones.md` | Post-QA | Completo — **sin delta UI** |
| QG Arch `fase-13/quality/QG-correcciones.md` | Post-QA | Completo — **sin delta contrato/ADR** |
| `fase-13/prd.md` + 13 US Must | Alcance | Cerrado |
| Este handoff | Handoff DevOps | Listo |

## Pendientes

- [ ] DevOps deja **PR abierto** con checks verdes (responsable: DevOps)
- [ ] Humano autoriza merge a `main` (responsable: humano)
- [ ] **No** hay fase 14 de producto

## Validación requerida por el receptor

- [ ] Sign-off QA APROBADO (o excepción documentada)
- [ ] Ambos QG-correcciones presentes y no placeholder
- [ ] Rama `feat/f13-archivo-oferta-unidad` (no inventar otra fase)
- [ ] PR **sin** merge a `main` ni producción
- [ ] Sin Cloudinary/S3 Must; media disco F10
- [ ] Sin pasarela `BL-040`

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 13
- [ ] Tu STATUS pasa a F13 DevOps (el PM no lo edita)

---

## Alcance de release (qué va en el PR)

Must F13 implementado y verificado: `US-ADMIN-05/06`, `US-CAT-14/15/16/18/19/20`, `US-DASH-10/12/13`, `US-SEC-04`, `US-INV-07` (`BL-210`–`216`, `219`–`224`).

Único bug de fase: **BUG-020** (500 POST entradas por import faltante) — Backend, Verificado. No cambia contratos ni UI.

Won't: `US-CAT-17`, hard-delete, mutar `Product.unit` GLOBAL, Cloudinary/S3, `BL-040`, receta/BOM, kardex, backfill entradas F12.

## Restricciones

- **No** push a `main`/`master`.
- **No** merge. **No** deploy a producción.
- **No** reabrir `fase-12/` ni Must F7–F12.
- Migraciones Prisma de F13 (archivo, `saleUnit`, entradas, historial de precio) van en el PR; no aplicarlas a prod desde el agente.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **STATUS:** `outputs/laborregamarket/STATUS.md`
- **QA:** `QA Automation Engineer/.../fase-13/qa-signoffs/QA-F13-signoff.md`
- **QG UX / Arch:** workspaces respectivos `fase-13/quality/QG-correcciones.md`
- **Proceso:** `comun/PROCESO.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/handoff-devops-fase-13.md`
- **Agente Downstream:** DevOps / Cloud Engineer Senior
- **Siguiente:** PR listo; humano mergea
