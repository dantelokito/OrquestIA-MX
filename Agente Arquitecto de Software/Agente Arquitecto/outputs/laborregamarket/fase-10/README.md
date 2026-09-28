# Fase 10 — Admin seguro + catálogo proveedor (Arquitecto)

> **Producto:** LaBorregaMarket v0.10.2  
> **Fecha diseño:** 28/08/2026  
> **Estado:** Contratos cerrados · listo para implementar (BE: SEC → CAT/MEDIA → DASH)

**Fase 9 solo lectura.** F8/F7 solo lectura. Fase 6 congelada (`fase-6/` no se edita; DASH se **extiende** aquí). Pagos/CFDI Won't (`CO-F6-001`). `CO-F7-001` intacto. `CO-F10-001` revoca A5. `CO-F10-002` disco. `CO-F10-003` reportes rango.

## Contratos API

| ID | Archivo | Delta |
|----|---------|-------|
| API-ADMIN-SEC-01 | [`api/API-ADMIN-SEC-01.md`](./api/API-ADMIN-SEC-01.md) | RBAC por módulo; 401/403; último ADMIN; higiene prod |
| API-ADMIN-PRODUCTS-01 | [`api/API-ADMIN-PRODUCTS-01.md`](./api/API-ADMIN-PRODUCTS-01.md) | CRUD global; no hard-delete |
| API-ADMIN-PROVIDERS-01 | [`api/API-ADMIN-PROVIDERS-01.md`](./api/API-ADMIN-PROVIDERS-01.md) | PATCH flags F5–F9 + `US-REV-04` |
| API-PROVIDER-PRODUCTS-02 | [`api/API-PROVIDER-PRODUCTS-02.md`](./api/API-PROVIDER-PRODUCTS-02.md) | SKU local; listado panel; IDOR |
| API-PROVIDER-SECTIONS-01 | [`api/API-PROVIDER-SECTIONS-01.md`](./api/API-PROVIDER-SECTIONS-01.md) | CRUD + reorder; borrar solo vacía |
| API-MEDIA-02 | [`api/API-MEDIA-02.md`](./api/API-MEDIA-02.md) | Disco; serving; override `ProviderProduct.imageUrl` |
| API-PROVIDER-REPORTS-02 | [`api/API-PROVIDER-REPORTS-02.md`](./api/API-PROVIDER-REPORTS-02.md) | `from`/`to` + `productIds[]`; grain F6 intacto |
| API-DASH-NOTES-01 | [`api/API-DASH-NOTES-01.md`](./api/API-DASH-NOTES-01.md) | Print `US-DASH-09` sin API Must |

## ADRs (vivos en `comun/adrs/`)

| ID | Tema |
|----|------|
| ADR-029 | Dual SKU (`Product.scope` GLOBAL/LOCAL) |
| ADR-030 | `ProviderSection` plana |
| ADR-031 | Último ADMIN + sin auto-escalada |
| ADR-032 | Disco de imágenes (ADR-006 aparcado) |
| ADR-033 | Ventana `from`/`to` Reportes (ADR-024 intacto para grain) |

## Data-model

| ID | Archivo |
|----|---------|
| DB-products | [`data-model/DB-products.md`](./data-model/DB-products.md) |
| DB-provider-sections | [`data-model/DB-provider-sections.md`](./data-model/DB-provider-sections.md) |

Migración Prisma Must: `scope` + `ownerProviderId` + `ProviderSection` + `sectionId` + `ProviderProduct.imageUrl`.

## Diagramas

| ID | Archivo |
|----|---------|
| ARCH-CATALOG-02 | [`diagrams/ARCH-CATALOG-02.md`](./diagrams/ARCH-CATALOG-02.md) |
| ARCH-MEDIA-02 | [`diagrams/ARCH-MEDIA-02.md`](./diagrams/ARCH-MEDIA-02.md) |
| ARCH-REPORTS-02 | [`diagrams/ARCH-REPORTS-02.md`](./diagrams/ARCH-REPORTS-02.md) |

## Handoff Backend

[`handoff-backend-fase-10.md`](./handoff-backend-fase-10.md) — **obligatorio** antes de activar BE.

## Notas Frontend

- Panel `/proveedor`: alta local + secciones; no usar `POST /api/admin/products`.
- Detalle `/fruteria/[id]`: agrupar por `section.sortOrder`; locales vendibles del dueño.
- Explorar FilterBar: **sin** chips de sección; `category` sigue `FRUTA\|VERDURA\|AGRICOLA`.
- Reportes: mes rellena `from`/`to`; checkboxes envían `productIds`; vacío = omitir param; print = CSS (`US-DASH-09`).
- Media: preview por URL `/api/media/…`; copy sin “nube”.
- Login/registro: ocultar cuentas demo si `NODE_ENV=production` (`US-SEC-03`).

UX F10 es paralelo: **no** implementar chrome visual hasta `handoff-frontend-fase-10.md`. Sí se pueden adelantar contratos.

## Quality

No emitir `quality/REVIEW-ARCH.md` ni `READY-FOR-QA.md` hasta cierre Backend (SEC + CAT + tests 401/403/IDOR).

## Fuera de alcance

Auto-global, secciones anidadas, chips FilterBar de sección, Cloudinary/S3/CDN, CRUD usuarios, matriz permisos UI, `BL-067`, 2FA, impersonation, Maps JS, Places, pan→radio, pasarela, CFDI, editar `fase-6/`, Redis/CI F6, ADMIN DASH ajeno, CSV, email reporte, multi-mes, reopen F7/F8/F9.
