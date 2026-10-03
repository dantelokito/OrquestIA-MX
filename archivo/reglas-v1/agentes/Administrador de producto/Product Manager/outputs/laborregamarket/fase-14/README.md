# Fase 14 — Mejoras y deuda del panel PROVIDER (PM)

**Estado:** **cerrada documentalmente** 18/09/2026 (v0.14.0). Sign-off QA **APROBADO**. QG UX + QG Arquitecto **presentes** (sin deltas). **Lista para DevOps PR.** `fase-13/` solo lectura. Baseline: [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) en `main` (`0eda84c`). **No hay Fase 15.**

Siguiente: **DevOps deja PR listo** sobre `feat/f14-panel-proveedor` (`9f5b875` / `92cced6`). Prohibido push/merge a `main` o producción; el **humano** mergea. Esta carpeta es **registro**; no reabrir user stories. Este PM no implementa ni lanza DevOps.

Pagos fuera (`BL-040`). Kardex de ventas **Won't**. Costos/margen **Won't**.

## Cierre

| Ítem | Ruta / estado |
|------|----------------|
| Sign-off QA | `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-14/qa-signoffs/QA-F14-signoff.md` — **APROBADO** (Playwright 41/41, Zero Blocker PASS, sin BUG-021+) |
| QG-correcciones UX | `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-14/quality/QG-correcciones.md` — **sin delta UI** |
| QG-correcciones Arquitecto | `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-14/quality/QG-correcciones.md` — **sin delta contrato/ADR** |
| Must BL-230–235, 237, 239, 240, 244–246, 250, 261, 269, 271 | Hecho / cerrado en backlog PM |
| Rama app | `feat/f14-panel-proveedor` (`9f5b875` / `92cced6`) |
| Baseline | `main` @ `0eda84c` ([PR #13](https://github.com/dantelokito/BorregaMarket/pull/13)) |
| Handoff DevOps | [handoff-devops-fase-14.md](./handoff-devops-fase-14.md) |
| Activación DevOps (respaldo) | [activation-prompt-devops.txt](./activation-prompt-devops.txt) |
| Fase 15 | **No abierta** |

## Artefactos

| Ítem | Ruta |
|------|------|
| PRD | [prd.md](./prd.md) |
| Change order | [change-orders/CO-F14-001-mejora-panel-proveedor.md](./change-orders/CO-F14-001-mejora-panel-proveedor.md) |
| Impacto módulos | [impacto-modulos.md](./impacto-modulos.md) |
| QG cobertura UX | [quality/QG-cobertura-UX.md](./quality/QG-cobertura-UX.md) |
| QG cobertura BE | [quality/QG-cobertura-BE.md](./quality/QG-cobertura-BE.md) |
| QG cobertura FE | [quality/QG-cobertura-FE.md](./quality/QG-cobertura-FE.md) |
| Handoff UX (histórico) | [handoff-ux-ui-fase-14.md](./handoff-ux-ui-fase-14.md) |
| Handoff Arquitecto (histórico) | [handoff-arquitecto-fase-14.md](./handoff-arquitecto-fase-14.md) |
| Activación UX / Arch (histórico) | [activation-prompt-ux.txt](./activation-prompt-ux.txt), [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) |
| Prompt implementación (app) | **No** (prohibido desde PM) |

## Must (histórico — no reabrir)

| ID | US | Qué | BL | Estado |
|----|-----|-----|-----|--------|
| US-PROF-01 | [Pestaña Perfil: identidad visual](./user-stories/US-PROF-01-pestana-perfil-identidad-visual.md) | Logo, portada, colores; menos fetches `getMyBusiness` | BL-230, BL-269 | Cerrado |
| US-PROF-02 | [Google Maps en Perfil](./user-stories/US-PROF-02-google-maps-perfil.md) | Place ID, URL, reseñas; lock si no verificado | BL-231 | Cerrado |
| US-PROF-03 | [Editar datos del negocio](./user-stories/US-PROF-03-editar-datos-negocio.md) | Nombre, dirección, teléfono, coords, descripción | BL-233 | Cerrado |
| US-PROF-04 | [Horarios de atención](./user-stories/US-PROF-04-horarios-atencion.md) | UI de `openingHours` | BL-234 | Cerrado |
| US-PROF-05 | [Capacidades + operación](./user-stories/US-PROF-05-capacidades-operacion.md) | WhatsApp, tarjeta, mayoreo, menudeo, prep, delivery | BL-235 | Cerrado |
| US-CAT-21 | [Catálogo solo productos](./user-stories/US-CAT-21-catalogo-solo-productos.md) | Identidad sale; toggle fotos POS vive en POS | BL-232 | Cerrado |
| US-INV-08 | [Registrar merma](./user-stories/US-INV-08-registrar-merma.md) | Motivo enum; 400 si `on_hand` negativo | BL-237 | Cerrado |
| US-INV-09 | [Ajuste por conteo físico](./user-stories/US-INV-09-ajuste-conteo-fisico.md) | Saldo resultante ≥ 0 | BL-240 | Cerrado |
| US-INV-10 | [Listado Movimientos](./user-stories/US-INV-10-listado-movimientos.md) | Entradas + mermas + ajustes (sin ventas) | BL-239 | Cerrado |
| US-DASH-14 | [Reportes generales pintan series](./user-stories/US-DASH-14-reportes-generales-series.md) | `series`, `products`, `bySource` + filtro | BL-244 | Cerrado |
| US-DASH-15 | [Ventas: gráfica unificada](./user-stories/US-DASH-15-ventas-grafica-unificada.md) | Tendencia, mix canal, top | BL-245, BL-246 | Cerrado |
| US-DASH-16 | [PDF alineado a from/to](./user-stories/US-DASH-16-pdf-reporte-from-to.md) | Descarga del corte visible | BL-250 | Cerrado |
| US-CAT-22 | [Activar GLOBAL sin precio](./user-stories/US-CAT-22-activar-global-sin-precio.md) | No publica $50; exige precio > 0 | BL-261 | Cerrado |
| US-CAT-23 | [Error al eliminar sección](./user-stories/US-CAT-23-error-eliminar-seccion.md) | 409 visible | BL-271 | Cerrado |

## Relación con F13

F13 (admin + ocultar + unidad-oferta + precio + inventario) está **cerrada**. QA **APROBADO**. [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) **en `main`**. Esta fase **no** reabre esas US.

## Won't (explícito)

Costos/margen, corte de caja, cajeros, lotes, directorio clientes, crédito mostrador, kardex de VENTA_POS/ENTREGA_PEDIDO, instrumentar `decrementOnHandForLines`, `SELECT FOR UPDATE` como Must, Cloudinary/S3, `BL-040`, Explorar/mapa/reseñas rediseño, `US-ADMIN-04`, hard-delete, BOM, inventario compartido, granularidad semanal, comparativa periodo anterior, agrupación por sección, gráficos de margen.

## Siguiente

Orquestador: chat limpio **DevOps**. DoD = **PR abierto**, checks verdes. **Sin** merge a `main` ni prod. Humano autoriza el merge. **No** abrir fase 15.
