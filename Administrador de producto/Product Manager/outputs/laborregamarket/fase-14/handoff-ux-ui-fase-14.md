# Handoff: Product Manager → UX/UI Designer

## Metadata

- **Fecha:** 2026-09-17
- **Fase:** 14
- **Proyecto:** laborregamarket
- **Agente Emisor:** Product Manager
- **Agente Receptor:** UX/UI Designer
- **Timestamp:** 2026-09-17 (kickoff documental F14; cobertura PM completa)

Diseñar **Perfil** del proveedor, Catálogo reducido, merma/ajuste/movimientos (sin kardex de ventas), series de reportes y PDF `from`/`to`. **No** rediseñar Explorar, mapa, reseñas, WhatsApp cliente ni `/fruteria` con existencias. **No** Cloudinary/S3. **No** corte de caja ni costos. **No** reactivar `grain` en la UI.

Chat **nuevo**, sin historial. Este handoff no incluye wireframes: los produce UX. Código UI (solo lectura): `C:\Users\PC GAMER\LaBorregaMarket\src\`.

**Fase 13:** **cerrada** en PM (QA APROBADO; [PR #13](https://github.com/dantelokito/BorregaMarket/pull/13) en `main`). Tus STATUS/QG F13 son **históricos**. Escribes **solo** en `fase-14/` de tu workspace. No edites `fase-13/`.

**Baseline código:** **`main`** @ `0eda84c`. Implementación F14 de código es **posterior** (Frontend). No pidas al PM implementar la app.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`impacto-modulos.md`](./impacto-modulos.md)
3. [`quality/QG-cobertura-UX.md`](./quality/QG-cobertura-UX.md)
4. Historias Must en [`user-stories/`](./user-stories/)
5. Este archivo.

**Solo lectura:** `fase-13/` … `fase-1/`. No reescribir WF F10–F13 salvo deltas F14 (Perfil, split Catálogo/POS, Inventario merma, series DASH).

---

## Entregables (emisor)

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-14/prd.md` | PRD | Completo |
| `fase-14/user-stories/US-*.md` | User Stories (14 Must) | Completo |
| `fase-14/impacto-modulos.md` | Impacto | Completo |
| `fase-14/quality/QG-cobertura-UX.md` | Gate cobertura UX | Completo |
| `fase-14/change-orders/CO-F14-001-mejora-panel-proveedor.md` | Change order | Completo |
| `fase-14/handoff-ux-ui-fase-14.md` | Handoff | Listo |
| `fase-14/activation-prompt-ux.txt` | Prompt activación | Listo |

## Pendientes

- [ ] UX produce UF/WF + `handoff-frontend-fase-14.md` (responsable: UX/UI)
- [ ] Arquitecto en **paralelo** (no esperar contratos para empezar flujos; alinear tokens/pantallas con API al emitir FE)
- [ ] Should: comparativa por sucursal, admin PATCH datos, `SELECT FOR UPDATE` no son Must (responsable: —)

## Validación requerida por el receptor

- [ ] ACs Given-When-Then claros (éxito + error)
- [ ] Perfil no satura: bloques claros; Catálogo sin identidad
- [ ] Google locked si no verificado
- [ ] Merma/ajuste: error 400 visible; Movimientos **sin** copy de ventas
- [ ] N=1 reportes generales: sin pantalla nueva (redirect)
- [ ] 4 estados en Perfil, Movimientos, series
- [ ] Sin placeholders en inputs

## Checklist de recepción (para el Receptor)

- [ ] Todos los archivos listados existen
- [ ] Los archivos tienen el formato correcto
- [ ] La información está completa
- [ ] No hay contradicciones con la fase 14
- [ ] Tu STATUS pasa a fase **14** (el PM no lo edita)

---

## Rutas / pantallas Must

| Superficie | Qué diseñar |
|------------|-------------|
| `SubNavProveedor` | Entrada **Perfil**; Catálogo/POS/Inventario/Ventas/Órdenes siguen |
| `/proveedor/perfil` | Identidad (logo, portada, colores) + Google + datos negocio + horarios + capacidades/operación |
| `/proveedor` catálogo | Solo productos F13 (Editar, precio, Eliminar, bandeja). Sin bloques A/B/D |
| `/proveedor/pos` | Toggle fotos de card (`posShowImages`) |
| `/proveedor/inventario` | Sheets merma y conteo; sub-pestaña Movimientos |
| `/proveedor/dashboard` | Tendencia, mix canal, top; PDF `from`/`to` visible |
| `/proveedor/reportes-generales` | Pintar `series`/`products`/`bySource` + filtro productos |
| Cliente `/explorar` `/fruteria` | **Sin** rediseño; consumen datos nuevos |

## a11y y DoD UX

- Controles ≥44px; teclado. Toggles con label.
- 4 estados: Empty, Loading, Error, Success (Perfil, Movimientos, generales).
- Contraste WCAG 2.1 AA. Un CTA dominante por bloque.
- Gráficas: `role="img"` + `aria-label` + `<details>` tabla. Print no se rompe.
- Mobile: SubNav usable; sheets de merma no aplastados.

## Won't (no diseñar)

Kardex de ventas, costos/margen, corte de caja, cajeros, lotes, directorio, crédito, granularidad semanal, comparativa periodo, agrupación por sección, gráficos de margen, Cloudinary, `BL-040`, `US-ADMIN-04`, hard-delete, BOM, Explorar rediseño, reabrir US F13.

## Contradicción de STATUS (registro)

UX/Arch/QA/BE/FE/DevOps pueden seguir diciendo fase **13** activa (F13 cerrada en producto, PR DevOps pendiente). **Reconciliación PM:** F13 está **cerrada documentalmente** (QA APROBADO); producto documental activo = **14**. Al arrancar, actualicen **su** STATUS a 14. El PM no edita STATUS ajenos.

## Inputs Utilizados

- **PRD:** `outputs/laborregamarket/fase-14/prd.md`
- **User Stories:** `outputs/laborregamarket/fase-14/user-stories/US-*.md`
- **QG UX:** `outputs/laborregamarket/fase-14/quality/QG-cobertura-UX.md`
- **STATUS:** `outputs/laborregamarket/STATUS.md`

## Outputs Generados

- **Archivo:** `outputs/laborregamarket/fase-14/handoff-ux-ui-fase-14.md`
- **Agente Downstream:** UX/UI Designer
- **Siguiente STATUS:** UX + Arquitecto en paralelo (fase 14)
