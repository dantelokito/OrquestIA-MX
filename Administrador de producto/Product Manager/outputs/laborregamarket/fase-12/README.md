# Fase 12 — Inventario / almacén

**Estado:** **cerrada documentalmente** 15/09/2026 (v0.12.0). Sign-off QA **APROBADO**. QG UX + QG Arquitecto **presentes**. **No hay fase 13.**

Siguiente: **DevOps deja PR listo** sobre `feat/f12-inventario-blando`. Prohibido push/merge a `main` o producción; el **humano** mergea. Esta carpeta es **solo lectura** para trabajo nuevo. **No** reabrir user stories.

Pagos fuera (`BL-040`). F11 es **solo lectura**.

## Cierre

| Ítem | Ruta / estado |
|------|----------------|
| Sign-off QA | `QA Automation Engineer/Agente Tester/outputs/laborregamarket/fase-12/qa-signoffs/QA-F12-signoff.md` — **APROBADO** (21/21 Playwright, Zero Blocker PASS) |
| QG-correcciones UX | `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-12/quality/QG-correcciones.md` — **sin deltas UI** (BUG-019 ambiente Prisma) |
| QG-correcciones Arquitecto | `Agente Arquitecto de Software/Agente Arquitecto/outputs/laborregamarket/fase-12/quality/QG-correcciones.md` — **sin deltas contrato/ADR** |
| Evidencia BE BUG-019 | `Agente backend/Agente backend/outputs/laborregamarket/fase-12/quality/EVIDENCIA-BUG-019.md` |
| Must BL-200–208 | Hecho / cerrado en backlog PM |
| Rama app | `feat/f12-inventario-blando` (sin merge) |
| DevOps | Pendiente PR (sin merge) |
| Fase 13 | **No abierta** |

## Must (histórico — no reabrir)

| ID | US | Qué | Estado |
|----|-----|-----|--------|
| BL-200 | [US-INV-01](./user-stories/US-INV-01-modulo-inventario-subnav.md) | `/proveedor/inventario` + SubNav primero + aislamiento + etiqueta Ventas | ✅ Cerrado |
| BL-201 | [US-INV-02](./user-stories/US-INV-02-registrar-entrada-factor-caja.md) | Entrada en unidad de catálogo + factor caja en ficha | ✅ Cerrado |
| BL-202 | [US-INV-03](./user-stories/US-INV-03-capacidad-barra-alerta.md) | Tope, barra %, umbral 10%, apagar alerta, sobre-tope | ✅ Cerrado |
| BL-203 | [US-INV-04](./user-stories/US-INV-04-listado-barra-alerta-parcial.md) | Listado inventario: barra, alerta, parcial Encargar | ✅ Cerrado |
| BL-204 | [US-INV-05](./user-stories/US-INV-05-pos-descuenta-no-bloquea.md) | POS descuenta al cobrar; no bloquea | ✅ Cerrado |
| BL-205 | [US-INV-06](./user-stories/US-INV-06-encargar-reserva-commit-restore.md) | Encargar reserva / DELIVERED / CANCELLED | ✅ Cerrado |
| BL-206 | [US-CAT-12](./user-stories/US-CAT-12-barra-lista-catalogo.md) | Barra dinámica en lista catálogo proveedor | ✅ Cerrado |
| BL-207 | [US-CAT-13](./user-stories/US-CAT-13-miniatura-lista-catalogo.md) | Miniatura en lista catálogo proveedor | ✅ Cerrado |
| BL-208 | [US-POS-12](./user-stories/US-POS-12-imagenes-pos-toggle.md) | Imágenes POS + toggle default ON por sucursal | ✅ Cerrado |

**Should / Could:** ninguno en F12.

## Won't

BOM, inventario compartido, Cloudinary/S3, `BL-040`, bloquear POS/Encargar por stock, usar `stock` como `isAvailable`, kardex, barra/existencias en `/fruteria`.

## Artefactos PM

| Archivo | Uso |
|---------|-----|
| [prd.md](./prd.md) | PRD corto + D-F12-1…12 + NFRs |
| [impacto-modulos.md](./impacto-modulos.md) | Impacto CAT/POS/ORDERS/NAV/MEDIA/ISO |
| [handoff-ux-ui.md](./handoff-ux-ui.md) | Handoff UX (histórico) |
| [handoff-arquitecto.md](./handoff-arquitecto.md) | Handoff Arquitecto (histórico) |
| [activation-prompt-ux.txt](./activation-prompt-ux.txt) | Histórico activación UX |
| [activation-prompt-arquitecto.txt](./activation-prompt-arquitecto.txt) | Histórico activación Arch |
| [user-stories/](./user-stories/) | Nueve US Must (solo lectura) |

## Siguiente

Orquestador: activar **DevOps** en chat limpio. DoD DevOps = **PR abierto**, no merge. Humano autoriza el merge. **No** abrir fase 13.
