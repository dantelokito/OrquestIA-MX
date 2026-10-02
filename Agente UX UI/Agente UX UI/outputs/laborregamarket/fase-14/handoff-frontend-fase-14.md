# Handoff: UX/UI Designer → Frontend Developer

## Metadata

- **Fecha:** 2026-09-17
- **Fase:** 14
- **Proyecto:** laborregamarket
- **Agente Emisor:** UX/UI Designer
- **Agente Receptor:** Frontend Developer
- **Timestamp:** 2026-09-17 (diseño Must F14)

Perfil del proveedor, Catálogo reducido, merma/ajuste/movimientos (sin kardex de ventas), series de reportes y PDF `from`/`to`. **No** rediseñar Explorar, mapa, reseñas, WhatsApp cliente ni `/fruteria` con existencias. **No** Cloudinary/S3. **No** corte de caja ni costos. **No** reactivar `grain` en la UI.

**No implementar código desde este chat UX.** Frontend espera también el handoff del Arquitecto (`handoff-backend-fase-14.md` cuando exista). Este handoff **no** activa FE ni QA.

Código (solo lectura en diseño): `C:\Users\PC GAMER\LaBorregaMarket\src\` **`main`** @ `0eda84c`.

---

## Estado: LISTO PARA IMPLEMENTAR (cuando Arch entregue contratos de PROF-03 e INV)

**Punto de entrada:** este archivo + [`../STATUS.md`](../STATUS.md) + [`../comun/design-tokens.md`](../comun/design-tokens.md) v0.14.0 + [`../comun/information-architecture.md`](../comun/information-architecture.md) v0.14.0

Quality Gate UX: **cuando FE implemente y QA APROBADO**. `QG-correcciones.md` no aplica ahora.

Arquitecto trabaja **en paralelo**: no se esperó su SAD para flujos. Al emitir este handoff: `ADR-041` = SVG unificado (sin librería). Alinear el resto de pantallas a `API-PROVIDER-PROFILE-14` / `API-INVENTORY-14` / `API-PROVIDER-REPORTS-14` al implementar. FE **no inventa** paths.

---

## Entregables

| Archivo | Tipo | Estado |
|---------|------|--------|
| `fase-14/user-flows/UF-PROF-01-pestana-identidad.md` | User flow | Completo |
| `fase-14/user-flows/UF-PROF-02-google-maps.md` | User flow | Completo |
| `fase-14/user-flows/UF-PROF-03-datos-negocio.md` | User flow | Completo |
| `fase-14/user-flows/UF-PROF-04-horarios.md` | User flow | Completo |
| `fase-14/user-flows/UF-PROF-05-capacidades.md` | User flow | Completo |
| `fase-14/user-flows/UF-CAT-21-catalogo-solo-productos.md` | User flow | Completo |
| `fase-14/user-flows/UF-CAT-22-activar-global-precio.md` | User flow | Completo |
| `fase-14/user-flows/UF-CAT-23-error-eliminar-seccion.md` | User flow | Completo |
| `fase-14/user-flows/UF-INV-08-registrar-merma.md` | User flow | Completo |
| `fase-14/user-flows/UF-INV-09-ajuste-conteo.md` | User flow | Completo |
| `fase-14/user-flows/UF-INV-10-listado-movimientos.md` | User flow | Completo |
| `fase-14/user-flows/UF-DASH-14-reportes-generales-series.md` | User flow | Completo |
| `fase-14/user-flows/UF-DASH-15-ventas-grafica-unificada.md` | User flow | Completo |
| `fase-14/user-flows/UF-DASH-16-pdf-from-to.md` | User flow | Completo |
| `fase-14/wireframes/WF-PROF-01-05-perfil.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-CAT-21-catalogo-pos.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-CAT-22-precio-activar.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-CAT-23-error-seccion.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-INV-08-merma.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-INV-09-ajuste.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-INV-10-movimientos.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-DASH-14-series-generales.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-DASH-15-ventas-graficas.md` | Wireframe | Completo |
| `fase-14/wireframes/WF-DASH-16-pdf.md` | Wireframe | Completo |
| `fase-14/quality/validacion-recepcion.md` | Calidad recepción | Completo |
| `comun/design-tokens.md` | Tokens v0.14.0 | Completo |
| `comun/information-architecture.md` | IA v0.14.0 | Completo |

## Pendientes

- [ ] Contratos PATCH datos de negocio (lat/lng AMM) y GET/POST merma-ajuste-movimientos (responsable: Arquitecto). FE no inventa paths.
- [ ] ADR gráfica: **cerrada en paralelo** — `ADR-041` SVG unificado, **sin** librería npm. UX ya exigía `role="img"` + `<details>` + print; FE sigue Opción A.
- [ ] Should: comparativa GMV por sucursal, admin PATCH datos, `SELECT FOR UPDATE` (no Must)

## US de este handoff

| ID | Frontend hace | MoSCoW |
|----|----------------|--------|
| **US-PROF-01** | Ruta `/proveedor/perfil`; mover logo/portada/colores; un fetch me | M |
| **US-PROF-02** | Google en Perfil; lock si `isVerified === false` | M |
| **US-PROF-03** | Form datos negocio; errores inline coords | M |
| **US-PROF-04** | Editor 7 días + preview HoursTable | M |
| **US-PROF-05** | Toggles capacidades + prep + delivery en Perfil | M |
| **US-CAT-21** | Catálogo sin bloques A/B/D; toggle fotos en POS | M |
| **US-CAT-22** | Diálogo precio > 0; nunca `?? 50` | M |
| **US-CAT-23** | Banner 409 fuera del form Nueva sección | M |
| **US-INV-08** | Sheet merma; 400 visible si supera saldo | M |
| **US-INV-09** | Sheet conteo; delta preview; conteo ≥ 0 | M |
| **US-INV-10** | Sub-pestaña Movimientos; copy sin ventas POS | M |
| **US-DASH-14** | Pintar series/products/bySource + filtro; N=1 redirect intacto | M |
| **US-DASH-15** | UnifiedProviderChart: tendencia, mix, top; details + print | M |
| **US-DASH-16** | `showPdf={true}` Ventas sucursal; sin grain | M |

## Orden de implementación (cuando Arch+BE permitan)

```
1. SubNav Perfil + ProfilePageClient (GET me único) + mover MediaUpload/BrandColorPicker
2. Google lock, datos negocio, horarios, capacidades (sale ProviderSettingsForm de Catálogo)
3. Catálogo reducido + PosImagesToggle en POS + PriceRequiredDialog + SectionConflictBanner
4. MermaSheet + CountAdjustSheet + InventorySubTabs + MovementsTable
5. UnifiedProviderChart en Ventas y Reportes generales + filtro productIds
6. DocumentActions PDF from/to en Ventas sucursal
7. Verificar: no Explorar, no /fruteria existencias, no grain, no logo en Catálogo
```

## a11y Must

- Tabs SubNav, toggles, sheets, paginación Movimientos, PDF ≥44px; teclado.
- 4 estados: Perfil, Movimientos, reportes generales (series), sheets merma/ajuste.
- Contraste WCAG 2.1 AA. Un CTA dominante **por bloque** en Perfil; Cobrar sigue dominante en POS; Agregar producto en Catálogo.
- Gráficas: `role="img"` + `aria-label` + `<details>` tabla. Print no se rompe.
- Locked Google: texto + disabled, no color-only.
- Tipo movimiento: badge texto + color.
- Mobile: SubNav usable (scroll); sheets merma/ajuste no aplastados.

## Won't (no pintar)

Kardex de ventas/POS/Encargar/descarte, costos/margen, corte de caja, cajeros, lotes, directorio, crédito, granularidad semanal, comparativa periodo, agrupación por sección, Cloudinary, `BL-040`, `US-ADMIN-04`, hard-delete, BOM, Explorar rediseño, `GrainSelector`, reabrir US F13.

## Decisión de navegación (QG)

QG pedía Perfil al extremo derecho después de Ventas, salvo justificación. **Justificación:** Perfil queda **siempre último**, también después de **Reportes generales** (N>1), porque es uso esporádico y esa pestaña operativa debe seguir junto a Ventas.

Orden: Inventario · Catálogo · POS · Órdenes · Ventas · Reportes generales (N>1) · **Perfil**.

## Checklist de recepción (Frontend)

- [ ] Todos los archivos de la tabla existen
- [ ] Perfil 5 bloques (`WF-PROF-01-05`)
- [ ] Catálogo sin identidad; toggle en POS
- [ ] Cuatro estados Perfil y Movimientos
- [ ] N=1 sin pantalla nueva de generales
- [ ] Tokens/IA v0.14.0
- [ ] Esperar contratos Arquitecto antes de paths PROF-03 / INV-08–10 / PDF from-to

## Validación requerida por el receptor

- [ ] Wireframes con 4 estados donde aplica
- [ ] Breakpoints móvil `<640px` / escritorio `>=1024px`
- [ ] Sin placeholders en UF/WF

## Inputs Utilizados

- **Handoff PM:** `Administrador de producto/Product Manager/outputs/laborregamarket/fase-14/handoff-ux-ui-fase-14.md`
- **PRD / US / impacto / QG UX:** workspace PM `fase-14/`
- **STATUS PM:** `Administrador de producto/Product Manager/outputs/laborregamarket/STATUS.md`
- **Diagnóstico:** `comun/MEJORA-PANEL-PROVEEDOR.md` (alcance recortado: merma aditiva, no kardex completo)
- **Código solo lectura:** `SubNavProveedor.tsx`, `ProveedorPageClient.tsx`, `ProviderSettingsForm.tsx`, `InventoryPageClient.tsx`, `StockEntrySheet.tsx`, `PosImagesToggle.tsx`, `ReportsView.tsx`, `GlobalReportsPageClient.tsx`, `HoursTable.tsx`

## Outputs Generados

- **Archivo:** `Agente UX UI/Agente UX UI/outputs/laborregamarket/fase-14/handoff-frontend-fase-14.md`
- **Agente Downstream:** Frontend Developer (tras contratos Arch)
- **Inputs Requeridos:** este handoff + tokens/IA v0.14.0 + APIs Arquitecto
