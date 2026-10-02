# Change Order — Registro de Solicitud de Cambio

> **ID:** CO-F13-001
> **Fecha:** 16/09/2026 (delta unidad/caja + precio oferta + reporte inventario + **Editar/unidad-oferta GLOBAL**)
> **Proyecto:** LaBorregaMarket
> **Solicitante:** Dante (stakeholder)

#### 1. Descripción del Cambio

Fase 13 abre **visibilidad admin del maestro completo** y **ocultar oferta en el catálogo del proveedor**, sin DELETE SQL y sin quitar la base GLOBAL de onboarding.

| Cambio | US | Efecto |
|--------|-----|--------|
| Admin lista GLOBAL **y** LOCAL | US-ADMIN-05 | Rompe el listado admin «solo GLOBAL» de ADR-029 |
| Admin `isActive` en LOCAL y GLOBAL | US-ADMIN-06 | Promueve el Could F10 «listado admin de locales ajenos (solo lectura)» a Must **con** moderación |
| Proveedor «Eliminar» = `archivedAt` | US-CAT-14 | GLOBAL de plataforma y LOCAL propios salen de **su** vista |
| Dashboard excluye ocultos + bandeja | US-CAT-15 | Enmienda ADR-022 («GET panel = catálogo completo»): Inactivos sí; ocultos no |
| Reportes con snapshot | US-DASH-10 | No reescribir `OrderItem` |
| Cliente/POS 409 | US-CAT-16 | Vendible suma «no archivado» |
| Sin DELETE HTTP | US-SEC-04 | `canDelete` PROVIDER sigue en falso |
| **Editar** en GLOBAL y LOCAL: unidad de **oferta** + factor caja | US-CAT-18 | UI deja de limitar Editar a LOCAL y unidades a KG/PIEZA; factor sale del solo-inventario. **No** muta `Product.unit` del maestro GLOBAL |
| Cambio unidad/factor con existencias | US-INV-07 | Alerta + on-hand 0; 409 si Encargar activo (también oferta GLOBAL) |
| Precio de oferta GLOBAL/LOCAL por sucursal | US-CAT-19 | No SKU nuevo; no pisa otras fruterías |
| Historial de precio de la oferta | US-CAT-20 | Distinto del GMV |
| Reporte inventario sucursal | US-DASH-12 | Actual + entradas; no kardex; descarte ≠ entrada |
| Inventario en reportes generales N>1 | US-DASH-13 | Solo saldos actuales |

**Delta 16/09 (revisión alcance):** D-F13-15 enmendado. El proveedor **ajusta unidad y factor de su oferta** en filas GLOBAL (botón Editar visible). El maestro y otras fruterías no cambian. Mismo patrón que el precio (D-F13-17). GLOBAL nuevo del admin **aparece** en fruterías ya operando (D-F13-23).

**No revoca D-F13-4:** el catálogo GLOBAL sigue siendo la base al registrarse. **No** se adopta «dashboard solo mis ofertas» (`US-CAT-17` Won't F13).

**Copy de producto:** [`PRODUCT.md`](C:\Users\PC GAMER\LaBorregaMarket\PRODUCT.md) (líneas del modelo «solo ADMIN crea / el proveedor solo selecciona») queda desfasado desde `CO-F10-001`. Este CO añade: el proveedor **oculta** filas de esa base en *su* panel; el admin **ve** también los LOCAL; el proveedor **edita unidad/precio de su oferta** GLOBAL.

#### 2. Evaluación de Impacto

- [x] Arquitectura
- [x] Diseño UI/UX
- [x] Base de datos

**Detalle del impacto:**

- **Arquitectura:** enmienda ADR-029 (listados admin) y ADR-022 (GET panel + vendible). Campo `archivedAt` en `provider_products`. Ocultar GLOBAL sin oferta **crea** fila archivada. Precio de venta = oferta (`ProviderProduct.price`). Unidad de venta de la sucursal = unidad **de la oferta** si existe (Arquitecto: `ProviderProduct.unit` o equivalente); **no** mutar `Product.unit` GLOBAL. Envelope ADR-003. Formaliza Arquitecto como ADR-038 (+ bitácora de precio, filas de entrada de inventario, y campo de unidad de oferta).
- **Diseño UI/UX:** admin columnas origen/dueño + páginas; proveedor **Editar** en GLOBAL y LOCAL + Eliminar + pie colapsado «Eliminados de la vista»; PriceInput en GLOBAL/LOCAL; historial de precio; pestaña Inventario en Reportes. Copy de Editar GLOBAL: unidad y factor de **tu** oferta, no del catálogo admin. Copy que no diga borrar de la base. No rediseñar Explorar. Foto sigue F10.
- **Base de datos:** migración Prisma Must (`archivedAt` + persistencia de unidad de oferta). Unique `(providerId, productId)` intacto. No hard-delete. Tabla o bitácora de historial de precio por oferta; persistir **entradas** de inventario (hoy `addInventoryEntry` solo incrementa `onHand`). Descarte `US-INV-07` no inserta entrada.
- **QA:** matrices ADMIN, CAT, DASH, SEC, INV; no-regresión F10 secciones/reportes, F11 aislamiento/DASH-11, F12 inventario/POS; Editar GLOBAL no pisa maestro ni sucursal B.

#### 3. Matriz de Intercambio (Trade-off)

* **Opción A:** Esperar merge humano de F12 / PR #12 antes de documentar F13.
* **Opción B:** Documentar cobertura F13 ahora (F12 solo lectura; DevOps F12 en paralelo). Swap: no se construye unificación LOCAL→GLOBAL ni DELETE de productos.

#### 4. Decisión

**Opción seleccionada:** B  
**Aprobado por:** Dante (cierre catálogos 15/09/2026: base GLOBAL al registrar + Eliminar=ocultar GLOBAL y LOCAL + admin conserva historial; **16/09:** precio por oferta + inventario; **16/09 revisión:** Editar/unidad de oferta GLOBAL)  
**Fecha de aprobación:** 15/09/2026 (deltas 16/09)

**Efecto en decisiones previas:** ADR-029 listado admin «solo GLOBAL» **enmendado**. ADR-022 GET panel «completo» **enmendado** para ocultos (Inactivo sigue visible). Cierre PM previo de D-F13-15 («proveedor no cambia unidad GLOBAL») **enmendado**: no muta el **maestro**; sí la **oferta**. `CO-F10-001` / D-F10-5 (alta LOCAL) **intactos**. A5 sigue revocada para el catálogo del negocio. `US-CAT-01`, inventario F12, `BL-040` **intactos**.
