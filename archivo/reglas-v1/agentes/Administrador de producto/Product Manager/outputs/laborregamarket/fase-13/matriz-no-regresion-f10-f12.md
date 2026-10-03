# Matriz de no-regresión — F13 vs F10 / F11 / F12

> **Fecha:** 16/09/2026  
> **Uso:** QA y devs. F13 no reabre estas US; solo exige que sigan pasando.

## Fase 10 — Admin + catálogo proveedor

| Tema | US / regla | F13 no debe romper |
|------|------------|-------------------|
| Alta LOCAL | `US-CAT-02` | Sigue `Product` LOCAL + `ProviderProduct` en transacción. No auto-global. F13 añade unidad completa + factor en el drawer y **Editar en GLOBAL** (`US-CAT-18`). |
| Secciones | `US-CAT-03` | Alta/rename/reorder. DELETE sección con productos (incluidos **ocultos**) → **409**. |
| CRUD GLOBAL admin | `US-ADMIN-02` | Alta admin **sigue** solo GLOBAL. F13 **añade** listar/moderar LOCAL. Editar proveedor **no** pisa nombre/`Product.unit` del maestro. |
| Promover | `US-ADMIN-04` | Sigue Should; no Must F13. |
| Media disco | `US-MEDIA-06` | Sin Cloudinary. Foto de fila (botón Foto) **intacta**; F13 no la sustituye por Editar. |
| Reportes rango/print | `US-DASH-07` … `09` | Siguen por sucursal y por `OrderItem`. F13 **añade** pestaña inventario (`US-DASH-12`) sin romper ventas. Cambio de precio **o unidad** de catálogo **no** reescribe GMV. |
| Rate limit / no-HTML | D-F10 | Intactos. |

## Fase 11 — 1 user N sucursales

| Tema | US / regla | F13 no debe romper |
|------|------------|-------------------|
| Sucursal activa | `US-AUTH-11`, cookie `lbm_active_provider` | Ocultar/restaurar **y** unidad/precio de oferta son **por sucursal**, no por User. |
| IDOR | `US-ISO-01` | 403 si se toca oferta (precio, unidad, factor, archivo) de la otra sucursal del mismo user. |
| Reportes globales N>1 | `US-DASH-11` | Ventas consolidadas intactas. F13 **añade** inventario **actual** (`US-DASH-13`); **sin** entradas en esa pestaña. |
| Explorar una card por Provider | `US-EXPLORE-11` | Sin rediseño; solo ausencia de ítem no vendible. Unidad en vitrina = unidad de venta de **esa** sucursal (oferta o fallback). |

## Fase 12 — Inventario blando

| Tema | US / regla | F13 no debe romper |
|------|------------|-------------------|
| Inventario blando | `US-INV-01` … `06` | POS/Encargar no bloquean por stock. Entradas F13 se **persisten** además de sumar on-hand (`US-DASH-12`). No kardex de ventas. Descarte `US-INV-07` **no** es entrada. |
| Decimal / tope / factor caja | ADR-036, `US-INV-02` | El factor **sigue** en la oferta. F13 **también** lo captura en alta/editar catálogo (`US-CAT-18`). D-F12-7 intacto (fijo, no por carga). |
| Cambio de unidad con stock | — | F12 no avisaba. F13 `US-INV-07`: alerta + on-hand 0; 409 si Encargar activo (GLOBAL oferta y LOCAL). Blando D-F12-4 **después** del descarte. POS/Encargar/inventario usan unidad de **oferta** (o fallback al maestro). |
| Barra + miniatura CAT | `US-CAT-12`, `US-CAT-13` | Siguen en filas **visibles** del dashboard (con Editar GLOBAL extra). |
| Imágenes POS | `US-POS-12` | Toggle intacto; el POS no lista ocultos. |
| Vitrina sin existencias | D-F12-12 | Intacta. |
| `isAvailable` ≠ stock | ADR-022 | Intacta; F13 **añade** `archivedAt` como tercer flag de vendible. |

## Carry-over (etiquetado, no mezclar)

- `BL-177` / `US-ADMIN-04`, DT-F10-001, DT-F10-002, sign-off QA F9, `BL-040`, `UPLOADS_DIR`.
- DevOps F12 (PR #12 citado por QR DevOps) **en paralelo**; no es US F13.

## Inputs Utilizados

- PRD F10, F11, F12 (solo lectura) y PRD F13 (D-F13-15 enmendado 16/09).
