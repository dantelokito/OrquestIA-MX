# Handoff: UX/UI Designer → Frontend Developer

## Metadata

- **Fecha:** 2026-09-16
- **Fase:** 13
- **Proyecto:** laborregamarket
- **Agente Emisor:** UX/UI Designer
- **Agente Receptor:** Frontend Developer
- **Timestamp:** 2026-09-16 (diseño Must F13)

Visibilidad admin (GLOBAL+LOCAL), ocultar/restaurar oferta, Editar unidad/factor de **oferta** (GLOBAL y LOCAL), precio de oferta + historial, pestaña inventario en Reportes. **No** rediseñar Explorar, mapa, reseñas, WhatsApp ni `/fruteria` con existencias. **No** Cloudinary/S3. **No** kardex. **No** hard-delete.

**No implementar código desde este chat UX.** Frontend espera también `handoff-backend-fase-13.md` del Arquitecto. Este handoff **no** activa FE ni QA.

Código (solo lectura en diseño): `C:\Users\PC GAMER\LaBorregaMarket\src\`

---

## Estado: LISTO PARA IMPLEMENTAR (cuando Arch entregue contratos)

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.13.0 + [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.13.0

Quality Gate UX: **cuando FE implemente y QA APROBADO**. `QG-correcciones.md` no aplica ahora.

---

## Entregables

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-13/user-flows/UF-ADMIN-05-catalogo-completo.md` | User flow | Completo |
| `fase-13/user-flows/UF-ADMIN-06-inhabilitar.md` | User flow | Completo |
| `fase-13/user-flows/UF-CAT-14-ocultar-oferta.md` | User flow | Completo |
| `fase-13/user-flows/UF-CAT-15-bandeja-restaurar.md` | User flow | Completo |
| `fase-13/user-flows/UF-CAT-16-cliente-sin-ocultos.md` | User flow | Completo |
| `fase-13/user-flows/UF-CAT-18-editar-unidad-oferta.md` | User flow | Completo |
| `fase-13/user-flows/UF-INV-07-descarte-unidad.md` | User flow | Completo |
| `fase-13/user-flows/UF-CAT-19-20-precio-historial.md` | User flow | Completo |
| `fase-13/user-flows/UF-DASH-10-reportes-historicos.md` | User flow | Completo |
| `fase-13/user-flows/UF-DASH-12-inventario-sucursal.md` | User flow | Completo |
| `fase-13/user-flows/UF-DASH-13-inventario-generales.md` | User flow | Completo |
| `fase-13/user-flows/UF-SEC-04-sin-delete.md` | User flow | Completo |
| `fase-13/wireframes/WF-ADMIN-05-catalogo-completo.md` | Wireframe | Completo |
| `fase-13/wireframes/WF-CAT-14-15-fila-bandeja.md` | Wireframe | Completo |
| `fase-13/wireframes/WF-CAT-18-drawer-editar.md` | Wireframe | Completo |
| `fase-13/wireframes/WF-INV-07-modal-descarte.md` | Wireframe | Completo |
| `fase-13/wireframes/WF-CAT-19-20-precio-historial.md` | Wireframe | Completo |
| `fase-13/wireframes/WF-DASH-12-inventario-sucursal.md` | Wireframe | Completo |
| `fase-13/wireframes/WF-DASH-13-inventario-generales.md` | Wireframe | Completo |
| `fase-13/wireframes/WF-CAT-16-ausencia-cliente.md` | Wireframe (ausencia) | Completo |
| `fase-13/quality/validacion-recepcion.md` | Calidad recepción | Completo |
| `comun/design-tokens.md` | Tokens v0.13.0 | Completo |
| `comun/information-architecture.md` | IA v0.13.0 | Completo |

## Pendientes

- [ ] Contratos API archivo, unidad de oferta, historial precio, entradas inventario (responsable: Arquitecto). FE no inventa paths.
- [ ] Campo persistido de unidad de oferta (responsable: Arquitecto; UX no fija schema)
- [ ] Should: print inventario en reportes generales; `US-ADMIN-04` no es Must F13

## US de este handoff

| ID | Frontend hace | MoSCoW |
|----|----------------|--------|
| **US-ADMIN-05** | Tabla GLOBAL+LOCAL, filtros, paginación 50/100 visible | M |
| **US-ADMIN-06** | Inhabilitar/Reactivar LOCAL y GLOBAL; sin DELETE | M |
| **US-CAT-14** | Eliminar = ocultar; copy no destructivo | M |
| **US-CAT-15** | Lista sin ocultos; bandeja Restaurar; GLOBAL onboarding | M |
| **US-CAT-16** | Ausencia en cliente/POS; 409 carrito stale; sin pantallas nuevas | M |
| **US-SEC-04** | No llamar DELETE; 405 copy | M |
| **US-CAT-18** | Editar GLOBAL y LOCAL; enum CAJA; factor | M |
| **US-INV-07** | Modal descarte; 409 Encargar accionable | M |
| **US-CAT-19** | PriceInput GLOBAL «precio de tu frutería» | M |
| **US-CAT-20** | Historial corto fecha/antes/después | M |
| **US-DASH-10** | KPIs no evaporan (sin rediseño) | M |
| **US-DASH-12** | Pestaña Inventario actual+entradas; print | M |
| **US-DASH-13** | N>1 solo actuales; copy sin historial | M |

## Orden de implementación (cuando Arch+BE permitan)

```
1. AdminProductTableF13 + filtros + paginación + Inhabilitar
2. CatalogRowActionsF13: Editar en GLOBAL+LOCAL + Eliminar + bandeja
3. ProductFormDrawer: enum + factor; drawer GLOBAL sin nombre maestro
4. UnitChangeConfirmDialog + bloqueo Encargar
5. PriceInput copy + PriceHistoryList
6. ReportsViewTabs Inventario sucursal + GlobalOnHandBlock N>1
7. Verificar ausencia cliente/POS; no tocar Explorar ni /fruteria
```

## a11y Must

- Acciones de fila, Restaurar, paginación admin ≥44px; teclado.
- 4 estados: admin listado, bandeja, reportes inventario.
- Contraste WCAG 2.1 AA. Un CTA dominante por pantalla (confirmar descarte vs cancelar; Agregar producto en catálogo; Nuevo producto en admin).
- Inactivo vs Eliminado de la vista: texto + no color-only.
- Mobile: no aplastar precio.

## Won't (no pintar)

`US-CAT-17`, hard-delete, mutar maestro GLOBAL, Cloudinary, kardex, backfill entradas F12, SKU nuevo por precio o unidad, rediseño Explorar/mapa/reseñas/WhatsApp, existencias en `/fruteria`, `BL-040`.

## Checklist de recepción (Frontend)

- [ ] Todos los archivos de la tabla existen
- [ ] Editar visible en GLOBAL (`WF-CAT-18`)
- [ ] Cuatro estados admin y bandeja
- [ ] Cliente sin WF de rediseño (`WF-CAT-16`)
- [ ] Tokens/IA v0.13.0
- [ ] Esperar contratos Arquitecto antes de paths

## Validación requerida por el receptor

- [ ] Wireframes con 4 estados donde aplica
- [ ] Breakpoints móvil `<640px` / escritorio `>=1024px`
- [ ] Sin placeholders en UF/WF

## Inputs Utilizados

- **Handoff PM:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-13/handoff-ux-ui-fase-13.md`
- **PRD / US / impacto / QG UX:** workspace PM `fase-13/`
- **STATUS PM:** `Administrador de producto/Product Manager/outputs/laborregamarket/STATUS.md`

## Outputs Generados

- **Archivo:** `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-13/handoff-frontend-fase-13.md`
- **Agente Downstream:** Frontend Developer (tras contratos Arch)
- **Inputs Requeridos:** este handoff + tokens/IA v0.13.0 + APIs Arquitecto
