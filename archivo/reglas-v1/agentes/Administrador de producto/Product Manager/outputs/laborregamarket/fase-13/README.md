# Fase 13 — Visibilidad admin + ocultar + unidad de oferta + precio + inventario (PM)

**Estado:** **cerrada documentalmente** 16/09/2026 (v0.13.0). Sign-off QA **APROBADO**. QG UX + QG Arquitecto **presentes** (sin deltas). **Lista para DevOps PR.** `fase-12/` solo lectura. [PR #12](https://github.com/dantelokito/BorregaMarket/pull/12) en **main**. **No hay fase 14.**

Siguiente: **DevOps deja PR listo** sobre `feat/f13-archivo-oferta-unidad`. Prohibido push/merge a `main` o producción; el **humano** mergea. Esta carpeta es **registro**; no reabrir user stories. Este PM no implementa.

Pagos fuera (`BL-040`). `US-CAT-17` **Won't**.

## Cierre

| Ítem | Ruta / estado |
|------|----------------|
| Sign-off QA | `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-13/qa-signoffs/QA-F13-signoff.md` — **APROBADO** (Playwright 19/19, Zero Blocker PASS, BUG-020 Verificado) |
| QG-correcciones UX | `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-13/quality/QG-correcciones.md` — **sin delta UI** (BUG-020 Backend-only) |
| QG-correcciones Arquitecto | `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-13/quality/QG-correcciones.md` — **sin delta contrato/ADR** |
| Evidencia BE BUG-020 | `Agente backend/Agente backend/outputs/laborregamarket/fase-13/quality/EVIDENCIA-BUG-020.md` |
| Must BL-210–216, 219–224 | Hecho / cerrado en backlog PM |
| Rama app | `feat/f13-archivo-oferta-unidad` (sin merge) |
| Handoff DevOps | [handoff-devops-fase-13.md](./handoff-devops-fase-13.md) |
| Activación DevOps (respaldo) | [activation-prompt-devops.txt](./activation-prompt-devops.txt) |
| Fase 14 | **No abierta** |

## Artefactos

| Ítem | Ruta |
|------|------|
| PRD | [prd.md](./prd.md) |
| Change order | [change-orders/CO-F13-001-visibilidad-admin-y-archivo.md](./change-orders/CO-F13-001-visibilidad-admin-y-archivo.md) |
| Borrador ADR-038 | [adr-draft-038-archivo-vs-delete.md](./adr-draft-038-archivo-vs-delete.md) |
| Impacto módulos | [impacto-modulos.md](./impacto-modulos.md) |
| Matriz no-regresión | [matriz-no-regresion-f10-f12.md](./matriz-no-regresion-f10-f12.md) |
| QG cobertura BE | [quality/QG-cobertura-BE.md](./quality/QG-cobertura-BE.md) |
| QG cobertura FE | [quality/QG-cobertura-FE.md](./quality/QG-cobertura-FE.md) |
| QG cobertura UX | [quality/QG-cobertura-UX.md](./quality/QG-cobertura-UX.md) |
| Handoff UX (histórico) | [handoff-ux-ui-fase-13.md](./handoff-ux-ui-fase-13.md) |
| Handoff Arquitecto (histórico) | [handoff-arquitecto-fase-13.md](./handoff-arquitecto-fase-13.md) |
| Activación UX / Arch (histórico) | [activation-prompt-ux.txt](./activation-prompt-ux.txt), [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) |
| Prompt implementación (app) | **No** (prohibido desde PM) |

## Must (histórico — no reabrir)

| ID | US | Qué | Estado |
|----|-----|-----|--------|
| BL-210 | [US-ADMIN-05](./user-stories/US-ADMIN-05-catalogo-completo.md) | Admin lista GLOBAL + LOCAL | Cerrado |
| BL-211 | [US-ADMIN-06](./user-stories/US-ADMIN-06-moderacion-isactive.md) | Admin `isActive`; DELETE 405 | Cerrado |
| BL-212 | [US-CAT-14](./user-stories/US-CAT-14-ocultar-oferta.md) | Eliminar = ocultar | Cerrado |
| BL-213 | [US-CAT-15](./user-stories/US-CAT-15-dashboard-sin-archivados.md) | Dashboard + bandeja + Restaurar | Cerrado |
| BL-214 | [US-DASH-10](./user-stories/US-DASH-10-reportes-con-archivo.md) | Ventas = `OrderItem` | Cerrado |
| BL-215 | [US-CAT-16](./user-stories/US-CAT-16-cliente-sin-archivados.md) | Cliente/POS sin ocultos | Cerrado |
| BL-216 | [US-SEC-04](./user-stories/US-SEC-04-sin-delete-productos.md) | Sin DELETE | Cerrado |
| BL-219 | [US-CAT-18](./user-stories/US-CAT-18-unidad-y-factor-caja.md) | Editar GLOBAL/LOCAL: unidad de oferta + factor caja | Cerrado |
| BL-220 | [US-INV-07](./user-stories/US-INV-07-cambio-unidad-descarta-inventario.md) | Alerta/descarte; 409 Encargar | Cerrado |
| BL-221 | [US-CAT-19](./user-stories/US-CAT-19-precio-oferta.md) | Precio de oferta por sucursal | Cerrado |
| BL-222 | [US-CAT-20](./user-stories/US-CAT-20-historial-precio.md) | Historial de precio de la oferta | Cerrado |
| BL-223 | [US-DASH-12](./user-stories/US-DASH-12-reporte-inventario-sucursal.md) | Reporte inventario: actual + entradas | Cerrado |
| BL-224 | [US-DASH-13](./user-stories/US-DASH-13-inventario-reportes-generales.md) | Generales N>1: solo inventario actual | Cerrado |

## Could / Won't

| Ítem | Estado |
|------|--------|
| Badge admin «N ofertas» | Could |
| `US-CAT-17` solo mis ofertas | **Won't** |
| SKU nuevo por cambio de precio **o unidad** | **Won't** |
| Mutar `Product.unit` del maestro GLOBAL | **Won't** |
| Kardex / backfill entradas F12 | **Won't** |

## Siguiente

Orquestador: chat limpio **DevOps**. DoD = **PR abierto**, checks verdes. **Sin** merge a `main` ni prod. Humano autoriza el merge. **No** abrir fase 14.
