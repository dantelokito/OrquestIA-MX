# Fase 10 — Admin seguro + catálogo proveedor (diseño)

> **Producto:** LaBorregaMarket v0.10.0 (paquete PM v0.10.2)  
> **Fecha diseño:** 28/08/2026  
> **Estado:** **Diseño listo** — handoff FE emitido. Quality Gate UX cuando FE implemente.

`fase-9/` **solo lectura**. `fase-8/` / `fase-7/` solo lectura. `fase-6/` congelada (DASH F6 es baseline documental/API; F10 **extiende** Reportes en esta carpeta). Pagos/CFDI Won't (`CO-F6-001`). **`CO-F7-001` intacto.** **`CO-F9-001` intacto.** `CO-F10-001` revoca A5. `CO-F10-002` disco. `CO-F10-003` reportes rango.

## Alcance

| US | Superficie | MoSCoW |
|----|------------|--------|
| US-CAT-02 | Alta/edición producto **local** en `/proveedor` | M |
| US-CAT-03 | Secciones dinámicas (panel + `/fruteria/[id]`) | M |
| US-MEDIA-06 | Logo, portada y foto de producto en **disco** | M |
| US-ADMIN-02 | Tab Catálogos CRUD global | M |
| US-ADMIN-03 | Tab Proveedores: flags F5–F9 | M |
| US-SEC-03 | Ocultar cuentas demo en producción | M |
| US-DASH-07 | Venta por producto + checkboxes | M |
| US-DASH-08 | Mes-atajo + rango inicio/fin | M |
| US-DASH-09 | Imprimir esa vista (CSS, sin API) | M |
| US-ADMIN-04 | Promover local → global | S |

## User flows

| ID | Archivo |
|----|---------|
| UF-CAT-02 | [`user-flows/UF-CAT-02-producto-local.md`](./user-flows/UF-CAT-02-producto-local.md) |
| UF-CAT-03 | [`user-flows/UF-CAT-03-secciones.md`](./user-flows/UF-CAT-03-secciones.md) |
| UF-ADMIN-02 | [`user-flows/UF-ADMIN-02-catalogos.md`](./user-flows/UF-ADMIN-02-catalogos.md) (incluye Should ADMIN-04) |
| UF-ADMIN-03 | [`user-flows/UF-ADMIN-03-proveedores-flags.md`](./user-flows/UF-ADMIN-03-proveedores-flags.md) |
| UF-DASH-03 | [`user-flows/UF-DASH-03-reportes-rango.md`](./user-flows/UF-DASH-03-reportes-rango.md) |
| UF-SEC-03 | [`user-flows/UF-SEC-03-higiene-demo.md`](./user-flows/UF-SEC-03-higiene-demo.md) |

## Wireframes

| ID | Archivo |
|----|---------|
| WF-proveedor-catalogo-f10 | [`wireframes/WF-proveedor-catalogo-f10.md`](./wireframes/WF-proveedor-catalogo-f10.md) |
| WF-fruteria-secciones | [`wireframes/WF-fruteria-secciones.md`](./wireframes/WF-fruteria-secciones.md) |
| WF-admin-catalogos | [`wireframes/WF-admin-catalogos.md`](./wireframes/WF-admin-catalogos.md) |
| WF-admin-proveedores | [`wireframes/WF-admin-proveedores.md`](./wireframes/WF-admin-proveedores.md) |
| WF-login-higiene | [`wireframes/WF-login-higiene.md`](./wireframes/WF-login-higiene.md) |
| WF-proveedor-reportes-rango | [`wireframes/WF-proveedor-reportes-rango.md`](./wireframes/WF-proveedor-reportes-rango.md) |
| WF-proveedor-reportes-print-f10 | [`wireframes/WF-proveedor-reportes-print-f10.md`](./wireframes/WF-proveedor-reportes-print-f10.md) |

## Handoff

[`handoff-frontend-fase-10.md`](./handoff-frontend-fase-10.md) — **obligatorio** antes de activar Frontend.

Contratos Arquitecto (no inventar APIs): `Agente Arquitecto/.../fase-10/api/API-ADMIN-SEC-01.md`, `API-ADMIN-PRODUCTS-01.md`, `API-ADMIN-PROVIDERS-01.md`, `API-PROVIDER-PRODUCTS-02.md`, `API-PROVIDER-SECTIONS-01.md`, `API-MEDIA-02.md`, `API-PROVIDER-REPORTS-02.md`, `API-DASH-NOTES-01.md`.

## Decisiones UX F10

| ID | Decisión |
|----|----------|
| D-F10-UX-1 | Reportes **rango-primero**: mes-atajo + inicio/fin visibles. Grano F6 (día/mes/año + PDF) baseline documental/API, **no** chrome F10. |
| D-F10-UX-2 | Borrar sección solo si `productCount=0` (409). Reasignar ítem a ítem. Sin bulk-move Must. |
| D-F10-UX-3 | Alta local = drawer `md+` / sheet móvil. Globales F1/F5 (activar + Activo/Inactivo) **siguen**. |
| D-F10-UX-4 | Grupo **Sin sección** si `sectionId` null. Lista plana; no anidar. |
| D-F10-UX-5 | Media disco: preview `/api/media/…`; cero copy Cloudinary/nube. Placeholders F2 si vacío. |
| D-F10-UX-6 | Admin Catálogos ≠ drawer PROVIDER (taxonomía plataforma vs sección del negocio). |
| D-F10-UX-7 | Chrome ADMIN = marca **plataforma** (`US-BRAND-02`). Reportes PROVIDER ≠ look slate analytics. |
| D-F10-UX-8 | `US-ADMIN-04` Should: cola locales + diálogo categoría. Path API TBD Arch (ADR-029). |
| D-F10-UX-9 | FilterBar Explorar **sin** chips de sección custom (`D-F10-6` / F9 intacto). |

## Fuera de alcance

Analytics admin redo, reescribir `fase-6/`, FilterBar secciones, Maps JS, pan→radio, Cloudinary/CDN, CSV/email/CFDI, multi-mes, 2FA, impersonation, usuarios/roles UI, órdenes admin, PDF del corte F10, wizard secciones iniciales, reopen F7/F8/F9.

**No editar** `fase-1/` … `fase-9/` en esta sesión.

---

*Índice Fase 10 — Agente UX/UI Designer, LaBorregaMarket v0.10.0 — 28/08/2026.*
