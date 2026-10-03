# Handoff: Product Manager → DevOps / Cloud Engineer

## Metadata

- **Fecha:** 2026-09-18
- **Fase:** 14
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** DevOps / Cloud Engineer Senior
- **Timestamp:** 2026-09-18 (cierre documental F14; QG UX + Arch presentes)

F14 (mejoras y deuda del panel PROVIDER: Perfil, catálogo/POS, merma aditiva, reportes/PDF) está **cerrada documentalmente**. QA **APROBADO**. Ambos `QG-correcciones.md` existen y declaran **sin delta** UI ni contrato/ADR. **Lista para PR.**

**DoD DevOps:** PR **abierto**, checks verdes, descripción lista. **Prohibido** `git push` a `main`/`master` y merge a producción. El **humano** mergea.

Chat **nuevo**. Este PM **no** implementa, **no** abre el PR y **no** lanza tu rol (lo hace el orquestador). Código de la app: `C:\Users\PC GAMER\LaBorregaMarket`. Rama de trabajo: `feat/f14-panel-proveedor` (`9f5b875` / `92cced6`). Escribes en tu workspace `outputs/laborregamarket/fase-14/`. **No** promociones a fase 15 (el humano **no** autorizó F15).

---

## Lectura mínima (en este orden)

1. Este archivo.
2. Sign-off QA: `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-14/qa-signoffs/QA-F14-signoff.md`
3. QG UX: `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-14/quality/QG-correcciones.md`
4. QG Arquitecto: `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-14/quality/QG-correcciones.md`
5. STATUS PM: `Administrador de producto/Product Manager/outputs/laborregamarket/STATUS.md`
6. Baseline F13 **ya en main** ([PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) `0eda84c`). F14 se abre **encima** de ese baseline.

`fase-13/` y anteriores: **solo lectura**. **No hay fase 15.**

---

## Entregables (emisor / gates)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `QA-F14-signoff.md` | Sign-off QA | **APROBADO** (Playwright 41/41; Zero Blocker; sin BUG-021+) |
| QG UX `fase-14/quality/QG-correcciones.md` | Post-QA | Completo — **sin delta UI** |
| QG Arch `fase-14/quality/QG-correcciones.md` | Post-QA | Completo — **sin delta contrato/ADR** |
| `fase-14/prd.md` + 14 US Must | Alcance | Cerrado (registro; no reabrir US) |
| Este handoff | Handoff DevOps | Listo |

## Pendientes

- [ ] DevOps deja **PR abierto** con checks verdes (responsable: DevOps)
- [ ] Humano autoriza merge a `main` (responsable: humano)
- [ ] **No** hay fase 15 de producto

## Validación requerida por el receptor

- [ ] Sign-off QA APROBADO (o excepción documentada)
- [ ] Ambos QG-correcciones presentes y no placeholder
- [ ] Rama `feat/f14-panel-proveedor` (no inventar otra fase ni F15)
- [ ] PR **sin** merge a `main` ni producción
- [ ] Sin Cloudinary/S3 Must; media disco F10
- [ ] Sin pasarela `BL-040`
- [ ] Sin kardex de VENTA_POS/ENTREGA_PEDIDO

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 14
- [ ] Tu STATUS pasa a F14 DevOps (el PM no lo edita)

---

## Alcance de release (qué va en el PR)

Must F14 implementado y verificado: `US-PROF-01`…`05`, `US-CAT-21`/`22`/`23`, `US-INV-08`/`09`/`10`, `US-DASH-14`/`15`/`16` (`BL-230`–`235`, `237`, `239`, `240`, `244`–`246`, `250`, `261`, `269`, `271`).

Bugs de producto F14: **ninguno** (sin `BUG-021+`). QA clasificó un 500 inicial de merma/ajuste como fallo de proceso local (`prisma generate` bloqueado por `next`), no de producto. Tras `migrate deploy` + reinicio: 41/41 Pass.

Won't: kardex POS/`DELIVERED`, costos/margen, corte de caja, cajeros, lotes, Cloudinary/S3, `BL-040`, `US-ADMIN-04`, Explorar/mapa, hard-delete, BOM.

## Restricciones

- **No** push a `main`/`master`.
- **No** merge. **No** deploy a producción.
- **No** reabrir `fase-13/` ni Must F7–F13.
- **No** abrir `fase-15/` ni US F15.
- Migraciones Prisma de F14 (p. ej. `InventoryEntry.kind` merma/ajuste) van en el PR; no aplicarlas a prod desde el agente.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **STATUS:** `outputs/laborregamarket/STATUS.md`
- **QA:** `QA Automation Engineer/.../fase-14/qa-signoffs/QA-F14-signoff.md`
- **QG UX / Arch:** workspaces respectivos `fase-14/quality/QG-correcciones.md`
- **Proceso:** `comun/PROCESO.md`
- **Grafo orquestación:** query `quién actúa en la fase activa` + `QA-F14-signoff QG-correcciones`
- **Grafo app:** query `feat f14 panel proveedor` (`ProveedorPage`, `inventory-f14.routes.test.ts`)

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/handoff-devops-fase-14.md`
- **Agente Downstream:** DevOps / Cloud Engineer Senior
- **Siguiente:** PR listo; humano mergea. **Fase 15 no se abre.**
