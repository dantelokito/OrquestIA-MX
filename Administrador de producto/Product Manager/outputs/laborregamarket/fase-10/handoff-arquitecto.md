# Handoff Arquitecto — Fase 10

> **De:** Product Manager  
> **Para:** @Arquitecto de Software  
> **Fecha:** 28/08/2026 (v0.10.2 — paquete de activación)

F10 endurece admin, abre catálogo del PROVIDER (`CO-F10-001` / `002`) y **extiende Reportes** (`CO-F10-003`). A5 revocada para SKUs **locales**. `fase-6/` solo lectura. F9 solo lectura. Sin Maps JS / Places. `BL-040` fuera.

Chat **nuevo**, sin historial. Paths REST finales y schema Prisma los decides tú; este handoff fija el *qué*, no el *cómo*.

---

## Lectura mínima (en este orden)

1. [`prd.md`](./prd.md)
2. [`change-orders/CO-F10-001-admin-catalogo-local.md`](./change-orders/CO-F10-001-admin-catalogo-local.md), [`CO-F10-002`](./change-orders/CO-F10-002-media-disco-local.md), [`CO-F10-003`](./change-orders/CO-F10-003-dashboard-reportes.md)
3. Historias Must: `US-SEC-01` … `03`, `US-ADMIN-02` … `03`, `US-CAT-02` … `03`, `US-MEDIA-06`, `US-DASH-07` … `09`. Should: `US-ADMIN-04`.
4. Este archivo.
5. Baseline solo lectura: F1 `API-ADMIN-01` + data-model products (dual SKU los sustituye en parte). No editar `fase-6/` ni `fase-9/`.

**Código:** `C:\Users\PC GAMER\LaBorregaMarket\`  
**Salida Arch:** `Agente Arquitecto de Software\Agente Arquitecto\outputs\laborregamarket\`

---

## Orden de diseño (igual que BE implementará)

1. **SEC** — `US-SEC-01` … `03`: RBAC por módulo, AUDIT + último ADMIN, 401/403 en **toda** ruta nueva, higiene demo/prod.
2. **CAT / MEDIA** — dual SKU, `ProviderSection`, CRUD global, flags provider, upload a disco.
3. **DASH** — `from`/`to` + `productIds[]`. Print = FE (`US-DASH-09`). PDF del corte = Should.

No adelantar DASH ni CAT si SEC no cierra IDOR/401/403 en las rutas nuevas.

---

## ADRs / decisiones a resolver

| Tema | US | Detalle |
|------|-----|---------|
| RBAC por catálogo | US-SEC-01 | `hasModulePermission` por `SystemModule` real. Cierra OBS-004. Alinear nombres OBS-002 si aplica. |
| AUDIT + último ADMIN | US-SEC-02 | Toda escritura F10. Rechazar degradar al único ADMIN. Sin auto-escalada de rol. |
| Higiene entorno | US-SEC-03 | Criterio prod para ocultar demo copy. Tests 401/403 en **cada** ruta nueva (DEV-P2-011). |
| Dual SKU | US-CAT-02 | Origen global vs local (dueño = ese `Provider`). Forma de tablas = tuya. Unique actual `[providerId, productId]` no basta si el local no es `Product` global. |
| Secciones | US-CAT-03 | Entidad tipo `ProviderSection`: nombre, `sortOrder`, 1:N productos del negocio. Sin anidar. |
| CRUD global | US-ADMIN-02 | Alta/edición/retiro (`isActive=false`). **Prohibido** hard-delete con `ProviderProduct` u `OrderItem`. |
| Flags provider | US-ADMIN-03 | Delta `PATCH /api/admin/providers/[id]`: `isVerified`, `isActive`, `offersWholesale`, `offersDelivery`. Side-effect Google = `US-REV-04`. |
| Promover | US-ADMIN-04 | Should. Transacción local→`Product` global + política de enlace. |
| Media disco | US-MEDIA-06 | **No Cloudinary / S3 / ADR-006 Must.** Archivos en disco del servidor; URL mismo origin o `/uploads/…`. Logo + portada PROVIDER; foto de cada producto ofertado; foto `Product` global ADMIN. Validar MIME real; path opaco; borrar archivo al reemplazar; AUDIT `MEDIA_UPLOAD`; IDOR 403. `US-MEDIA-03` intacta. |
| Vendible | US-CAT-02 | Mismas reglas F5: `isAvailable` + producto activo → Encargar/POS; si no, 409. |
| Explorar | US-CAT-03 | `category` enum de plataforma **solo** globales. Secciones custom **no** son query de listing. Locales pueden entrar en `q` del **propio** detalle; no como SKU comparable entre fruterías. |
| Reportes rango | US-DASH-08 | `from`/`to` inclusive, TZ America/Monterrey. Tope de span (p. ej. 366 días). 400 si inicio > fin. El mes UI no es grano API: es atajo que setea from/to. |
| Reportes productos | US-DASH-07 | `productIds[]` opcional; ausente/vacío = todos. Incluir locales + venta rápida. GMV `status ≠ CANCELLED`. Solo `Provider` de `session.sub`. Print = FE (`US-DASH-09`). PDF corte = Should. |

## Contratos

### Delta Must

| Contrato | US | Esperado |
|----------|-----|----------|
| `GET /api/catalogs` | US-SEC-01 | Permiso por módulo; envelope ADR-003 |
| `POST/PATCH` admin products | US-ADMIN-02 | CRUD global; 4xx si hard-delete ilegal |
| `PATCH /api/admin/providers/[id]` | US-ADMIN-03 | Flags F5–F9 + AUDIT |
| API provider products (nueva o delta) | US-CAT-02 | Alta/edición local; 403 cruzado |
| API provider sections | US-CAT-03 | CRUD + reorder; borrar solo vacía |
| Upload disco (logo, portada, producto) | US-MEDIA-06 | PROVIDER dueño / ADMIN global; MEDIA-03; **sin** SDK cloud |
| Reportes PROVIDER (from/to + productIds) | US-DASH-07, US-DASH-08 | Delta `API-PROVIDER-REPORTS-01` o reports F6; 401/403; envelope ADR-003 |

### Sin delta Must

| Contrato | US | Esperado |
|----------|-----|----------|
| `GET /api/admin/analytics` | — | Intacta F4 |
| Listing explorar `category` / mayoreo / domicilio | F9 | No chips de sección |

### Schema

- Migración Must: sección + origen local (nombres a tu criterio).
- No schema orgánico. No `ProviderProduct.isActive` (sigue `isAvailable`, T9).

### NFR

| Categoría | Requerimiento |
|-----------|---------------|
| Seguridad | JWT httpOnly; dual RBAC; IDOR 403; rate limit altas y uploads; nombres sin HTML; password fuera de AUDIT; uploads no ejecutables; sin path traversal |
| Integridad | ≥1 ADMIN siempre; sin auto-escalada |
| Consistencia | Envelope ADR-003; paginación ADR-004 |
| Aislamiento | Producto/sección local invisibles para otro `providerId` |
| Rendimiento | Listado panel proveedor < 2s con catálogo MVP ampliado |

### Fuera de alcance

DASH F6 **docs** (no editar `fase-6/`), Redis, CI YAML, Places, Distance Matrix, clustering, Maps JS, pasarela, 2FA, impersonation, CRUD usuarios, `BL-067`, pan→radio, reopen F9, **Cloudinary/S3/CDN**, CSV, email reporte, ADMIN viendo otro negocio, multi-mes.

## Entregables esperados (artefactos a devolver)

Nombres sugeridos; paths y tablas los decides tú.

| Artefacto | Contenido |
|-----------|-----------|
| ADR dual SKU | Origen global vs local; dueño = `Provider`; unique que no asuma solo `Product` global |
| ADR `ProviderSection` | Nombre, `sortOrder`, 1:N; sin anidar; borrar solo vacía |
| ADR último ADMIN | Rechazar degradar al único ADMIN; sin auto-escalada |
| ADR disco de imágenes | ADR-006 **aparcado**. Archivos en disco; URL mismo origin o `/uploads/…`; MIME real; path opaco |
| ADR ventana `from`/`to` | Inclusive, TZ America/Monterrey; tope de span; mes UI = atajo, no grano API. No copiar rolling F3 |
| Contratos API | Delta admin products, `PATCH` flags, products/sections PROVIDER, upload disco, reports `from`/`to` + `productIds[]` + tests 401/403/IDOR |
| Migración Prisma Must | Sección + origen local (nombres a tu criterio) |
| `handoff-backend-fase-10.md` | **Obligatorio** antes de activar BE |
| `sad.md` | Actualizar data-model productos/permisos/media/reports |

`US-ADMIN-04` (promover local → global) y PDF del corte DASH son Should.
