# PRD Corto — LaBorregaMarket Fase 10

> **Proyecto:** LaBorregaMarket
> **Fecha:** 28/08/2026
> **Versión:** 0.10.2
> **Agente:** Product Manager
> **Objetivo del Negocio:** Dar al operador un panel admin endurecido (RBAC, auditoría, higiene), al dueño de frutería un catálogo propio (productos locales + secciones + imágenes en disco) y reportes de ventas imprimibles por rango y por producto.
> **Público Objetivo:** ADMIN (operación de plataforma) y PROVIDER (catálogo y dashboard de su negocio).

## Resumen ejecutivo

F9 (deuda Explorar) queda **solo lectura**. F10 = **seguridad admin** + **catálogo del proveedor** (locales, secciones, media disco) + **delta de Reportes** (`CO-F10-003`): rango inicio–fin, atajo de un mes, venta por producto con checkboxes e impresión de esa vista. No se edita `fase-6/`.

Change orders: [`CO-F10-001`](./change-orders/CO-F10-001-admin-catalogo-local.md), [`CO-F10-002`](./change-orders/CO-F10-002-media-disco-local.md), [`CO-F10-003`](./change-orders/CO-F10-003-dashboard-reportes.md).

#### 1. Alcance (MVP)

* **Incluido:**
  - RBAC por módulo en catalogs y `/api/admin/*` (`US-SEC-01`)
  - AUDIT de escrituras, último ADMIN, ownership de catálogo proveedor (`US-SEC-02`)
  - Higiene demo/prod y 401/403 en rutas nuevas (`US-SEC-03`)
  - CRUD catálogo **global** ADMIN (`US-ADMIN-02`)
  - Tabla proveedores: verificar/activar + flags F5–F9 (`US-ADMIN-03`)
  - Alta/edición de producto **local** en `/proveedor` (`US-CAT-02`)
  - Secciones dinámicas del catálogo del negocio (`US-CAT-03`)
  - Imágenes en **disco local**: logo, portada y productos ofertados (`US-MEDIA-06`)
  - Reportes PROVIDER: rango inicio–fin, atajo un mes, venta por producto + checkboxes, imprimir (`US-DASH-07` … `09`)
* **Fuera de Alcance:**
  - Auto-promoción de locales al catálogo global
  - Secciones anidadas; secciones como chips de FilterBar Explorar
  - CRUD usuarios / matriz `RolePermission` editable
  - Listado ADMIN de órdenes (`BL-067`); UI de moderación de reseñas
  - 2FA, OAuth, impersonation, recuperar password
  - Redo de `/admin/analytics`; ADMIN viendo DASH de otro proveedor
  - Reabrir US F7/F8/F9; reescribir `fase-6/` (Redis/CI / `US-DASH-04…06` docs); pagos (`BL-040`)
  - Clustering, Maps JS, Places, pan→radio
  - Cloudinary, S3, Imgix u otro CDN de imágenes (`CO-F10-002`)

#### 2. Módulos Principales

1. `[SEC]`: RBAC por módulo, AUDIT, integridad de rol ADMIN, higiene entorno (`US-SEC-01` … `03`)
2. `[ADMIN]`: Curación global y operación de proveedores (`US-ADMIN-02` … `03`; Should `US-ADMIN-04`)
3. `[CAT]`: Producto local + secciones dinámicas del PROVIDER (`US-CAT-02`, `US-CAT-03`)
4. `[MEDIA]`: Upload a disco local para logo, portada y fotos de producto (`US-MEDIA-06`; validación `US-MEDIA-03`)
5. `[DASH]`: Reportes filtrables e imprimibles (`US-DASH-07` … `09`; baseline F6 solo lectura)

## Objetivo

Que el ADMIN opere con permisos y bitácora correctos; que el PROVIDER arme un catálogo propio (secciones + SKUs locales) y pueda **reportar e imprimir ventas** por rango y por producto.

## Fuera de alcance (Won't F10)

Ver arriba. `US-CAT-01` (inhabilitar canales), `US-REV-04` (Google al desverificar) y `US-BRAND-02` (marca plataforma para ADMIN) **siguen**. Analytics F4 (`US-ADMIN-01`) **no se rediseña**.

## Decisiones cerradas (26/08/2026)

| # | Decisión | Cierre |
|---|----------|--------|
| D-F10-1 | Orden | Seguridad en APIs nuevas antes que más módulos admin (usuarios, órdenes) |
| D-F10-2 | Retiro global | `Product` global inhabilitado = no activable/vendible; no hard-delete con ventas o `ProviderProduct` |
| D-F10-3 | Flags | Mayoreo/domicilio/activo/verificado en admin = mismos campos que listing F9 / F5 |
| D-F10-4 | Won't | Usuarios UI, órdenes admin, 2FA, impersonation, `BL-040`, auto-global |
| D-F10-5 | A5 | **Revocada.** PROVIDER crea productos **locales**; no comparables ni visibles en otra frutería |
| D-F10-6 | Secciones | Dinámicas por negocio; taxonomía `FRUTA\|VERDURA\|AGRICOLA` solo globales / filtro explorar |
| D-F10-7 | Promover | Local → global = Should (`US-ADMIN-04`); no bloquea Must |
| D-F10-8 | Media | **Disco local.** Logo, portada y imágenes de productos ofertados (y catálogo global ADMIN). Cloud **Won't F10** (`CO-F10-002`). `US-MEDIA-03` intacta |
| D-F10-9 | Reportes | Mes = atajo de un rango; inicio–fin = filtro real; checkboxes de producto (ninguno = todos); imprimir esa vista. Un mes a la vez. Solo propio negocio. `fase-6/` no se edita |

## Priorización MoSCoW

| Prioridad | Items |
|-----------|-------|
| **Must** | US-SEC-01, US-SEC-02, US-SEC-03, US-ADMIN-02, US-ADMIN-03, US-CAT-02, US-CAT-03, US-MEDIA-06, US-DASH-07, US-DASH-08, US-DASH-09 |
| **Should** | US-ADMIN-04 promover; PDF del corte DASH-07/08; sugerir secciones iniciales; filtros bitácora F2–F5 |
| **Could** | Edición ADMIN de colores de un negocio; listado ADMIN de productos locales ajenos (solo lectura) |
| **Won't** | Ver "Fuera de alcance" |

## Métricas de éxito

| Métrica | Objetivo |
|---------|----------|
| CLIENT/PROVIDER → 403 en `/api/admin/*` nuevas; sin token → 401 | 100% |
| Permiso de catálogo alineado al módulo (no `USERS/view` para todos) | 100% |
| Escritura admin o catálogo proveedor deja `AUDIT` | 100% |
| Producto local no aparece en otra frutería ni como SKU comparable | 100% |
| PROVIDER crea sección y producto; `/fruteria/[id]` agrupa por sección | 100% |
| Producto inhabilitado (`US-CAT-01`) no se vende (Encargar/POS) | 100% |
| FilterBar Explorar sin chips de secciones custom | 100% |
| Cero credenciales demo en UI de producción | 100% |
| Logo, portada y foto de producto se sirven sin Cloudinary/S3 | 100% |
| Reportes: atajo mes rellena rango; checkboxes recortan (vacío = todos); print = misma vista | 100% |

## Referencias

- [`change-orders/CO-F10-001-admin-catalogo-local.md`](./change-orders/CO-F10-001-admin-catalogo-local.md)
- [`change-orders/CO-F10-002-media-disco-local.md`](./change-orders/CO-F10-002-media-disco-local.md)
- [`change-orders/CO-F10-003-dashboard-reportes.md`](./change-orders/CO-F10-003-dashboard-reportes.md)
- F6 DASH (solo lectura): `US-DASH-04` … `06`
- F1 A5 (revocada): [`../historial/OBSERVABILITY.md`](../historial/OBSERVABILITY.md)
- F5: `US-CAT-01`, `US-BRAND-02`
- F4: `US-ADMIN-01`, `US-REV-04` (solo lectura)
- F9 (solo lectura): Explorar DT-001…005
- Índice: [`../README.md`](../README.md)
- Backlog: [`../comun/backlog.md`](../comun/backlog.md)
