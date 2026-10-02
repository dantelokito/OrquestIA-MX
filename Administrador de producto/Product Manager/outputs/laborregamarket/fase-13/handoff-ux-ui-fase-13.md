# Handoff: Product Manager → UX/UI Designer

## Metadata

- **Fecha:** 2026-09-16
- **Fase:** 13
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** UX/UI Designer
- **Timestamp:** 2026-09-16 (kickoff implementación F13; cobertura PM completa)

Diseñar visibilidad admin (GLOBAL + LOCAL), ocultar/restaurar oferta, Editar unidad/factor de **oferta** (GLOBAL y LOCAL), precio de oferta + historial, reportes de inventario. **No** rediseñar Explorar, mapa, reseñas, WhatsApp ni `/fruteria` con existencias. **No** Cloudinary/S3. **No** kardex. **No** hard-delete.

Chat **nuevo**, sin historial. Este handoff no incluye wireframes: los produce UX. Código UI (solo lectura): `C:\Users\PC GAMER\LaBorregaMarket\src\`.

**Fase 12:** cerrada documentalmente en PM. Tus STATUS/QG F12 son **históricos**. Escribes **solo** en `fase-13/` de tu workspace. No edites `fase-12/`.

**Baseline código:** DevOps F12 corre en paralelo ([PR #12](https://github.com/dantelokito/BorregaMarket/pull/12); merge **humano**). No asumas F12 en `main`. No bloquea este diseño. No pidas al PM implementar la app.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md)
3. [`quality/QG-cobertura-UX.md`](./quality/QG-cobertura-UX.md)
4. Historias Must en [`user-stories/`](./user-stories/)
5. Este archivo.

**Solo lectura:** `fase-12/` … `fase-1/`. No reescribir WF F10–F12 salvo deltas F13 (Editar GLOBAL, Eliminar/bandeja, admin listado, pestaña inventario en Reportes).

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-13/prd.md` | PRD | Completo |
| `fase-13/user-stories/US-*.md` | User Stories (13 Must) | Completo |
| `fase-13/impacto-modulos.md` | Impacto | Completo |
| `fase-13/quality/QG-cobertura-UX.md` | Gate cobertura UX | Completo |
| `fase-13/change-orders/CO-F13-001-visibilidad-admin-y-archivo.md` | Change order | Completo |
| `fase-13/handoff-ux-ui-fase-13.md` | Handoff | Listo |
| `fase-13/activation-prompt-ux.txt` | Prompt activación | Listo |

## Pendientes

- [ ] UX produce UF/WF + `handoff-frontend-fase-13.md` (responsable: UX/UI)
- [ ] Arquitecto en **paralelo** (no esperar contratos para empezar flujos; alinear tokens/pantallas con API al emitir FE)
- [ ] Should: `US-ADMIN-04` no es Must F13 (responsable: —)

## Validación requerida por el receptor

- [ ] ACs Given-When-Then claros (escenario éxito + error)
- [ ] Editar visible en filas GLOBAL y LOCAL; copy GLOBAL = unidad/factor de **tu** oferta
- [ ] Eliminar = ocultar; bandeja «Eliminados de la vista» colapsada; no copy de borrar de la base
- [ ] Inactivo (sigue en lista) ≠ oculto (bandeja)
- [ ] Cliente: **sin** pantallas nuevas Must; solo ausencia de ocultos
- [ ] 4 estados en admin listado y bandeja proveedor
- [ ] Sin placeholders en inputs

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 13
- [ ] Tu STATUS pasa a fase **13** (el PM no lo edita)

---

## Rutas / pantallas Must

| Superficie | Qué diseñar |
|------------|-------------|
| Admin Catálogos → Productos | Tabla GLOBAL **y** LOCAL; origen/dueño; filtros `q` / `scope` / `isActive` / dueño; paginación 50/100 visible; inhabilitar; **sin** DELETE |
| `/proveedor` catálogo | Por fila: **Editar** (GLOBAL y LOCAL) + Foto F10 + Activo + **Eliminar**. Alta LOCAL: unidad completa (CAJA) + factor |
| Drawer Editar GLOBAL | Unidad y factor de **esta sucursal**; **no** nombre ni unidad del maestro |
| Drawer Editar / alta LOCAL | Nombre + `Product.unit` + factor |
| Confirmación cambio unidad/factor | Alerta descarte inventario; Encargar activo = error accionable **solo** en este flujo |
| Pie catálogo | «Eliminados de la vista» colapsado; Restaurar |
| Precio | Precio de **tu** oferta; historial corto fecha / antes / después |
| Inventario / POS | **Sin** filas ocultas; unidad mostrada = oferta o fallback maestro |
| Reportes sucursal | Pestaña Inventario: actual + entradas; print |
| Reportes generales N>1 | Solo inventarios actuales; sin historial de entradas |
| Cliente `/explorar` `/fruteria` | Sin rediseño; ocultos ausentes |

## a11y y DoD UX

- Acciones de fila y Restaurar ≥44px; teclado.
- 4 estados: Empty, Loading, Error, Success (admin + bandeja + reportes inventario).
- Contraste WCAG 2.1 AA. Un CTA dominante por pantalla (confirmar descarte vs cancelar).
- Mobile: fila de acciones usable; no aplastar precio.

## Won't (no diseñar)

`US-CAT-17`, hard-delete, mutar maestro GLOBAL, Cloudinary/S3, `BL-040`, receta/BOM, kardex, backfill entradas F12, SKU nuevo por precio o unidad.

## Contradicción de STATUS (registro)

UX/Arch pueden seguir diciendo fase **12** activa (QG-correcciones F12, espera cierre PM). **Reconciliación PM:** F12 está **cerrada documentalmente**; QG UX+Arch F12 ya existían; producto activo = **13**. Al arrancar, actualicen **su** STATUS a 13. El PM no edita STATUS ajenos.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-13/prd.md`
- **User Stories:** `outputs/laborregamarket/fase-13/user-stories/US-*.md`
- **QG UX:** `outputs/laborregamarket/fase-13/quality/QG-cobertura-UX.md`
- **STATUS:** `outputs/laborregamarket/STATUS.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-13/handoff-ux-ui-fase-13.md`
- **Agente Downstream:** UX/UI Designer
- **Siguiente STATUS:** UX + Arquitecto en paralelo (fase 13)
